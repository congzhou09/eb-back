<template>
  <div class="app-container">
    <el-tabs value="1">
      <el-tab-pane :disabled="true" label="模式详情" name="1">
        <el-card v-loading="isLoading">
          <div style="max-width: 65%;">
            <div class="block-head">
              <span>代理返利</span>
              <el-button
                v-if="!isReadOnly"
                class="operate-btn"
                type="text"
                style="float:right;"
                @click="
                  modeEditDlgShow = true;
                  onDlgShow('editComp');
                "
                >编辑</el-button
              >
            </div>
            <ul class="user-info">
              <li>
                <label class="title-label">直接用户消费返利：</label><span>{{ modeInfo.inferiorUserIntRate }}</span>
              </li>
              <li><label class="title-label">下级代理用户消费返利：</label>{{ modeInfo.inferiorAgentIntRate }}</li>
              <li><label class="title-label">下下级代理用户消费返利：</label>{{ modeInfo.biInferiorUserIntRate }}</li>
            </ul>
          </div>
          <div>
            <div class="block-head">初级代理标准</div>
            <p class="block-paragraph">{{ modeInfo.primaryAgentStandard }}</p>
          </div>
          <div>
            <div class="block-head">中级代理标准</div>
            <p class="block-paragraph">{{ modeInfo.mediumAgentStandard }}</p>
          </div>
          <div>
            <div class="block-head">高级代理标准</div>
            <p class="block-paragraph">{{ modeInfo.seniorAgentStandard }}</p>
          </div>
        </el-card>
      </el-tab-pane>
    </el-tabs>

    <!--弹出框-->
    <el-dialog class="el-dlg-narrow" title="代理返利比例修改" :visible.sync="modeEditDlgShow" :close-on-click-modal="false">
      <mode-edit
        ref="editComp"
        :formDataProp="{
          inferiorUserIntRate: modeInfo.inferiorUserIntRate,
          inferiorAgentIntRate: modeInfo.inferiorAgentIntRate,
          biInferiorUserIntRate: modeInfo.biInferiorUserIntRate
        }"
        @ok="onInfoModified"
        @cancel="modeEditDlgShow = false"
      ></mode-edit>
    </el-dialog>
  </div>
</template>

<script type="text/ecmascript-6">
import { mapGetters } from 'vuex';
import {getModeInfo} from '../../api/agent';
import modeEdit from './mode-edit';
export default{
    data(){
        return {
            modeInfo:{
                inferiorUserIntRate: '',
                inferiorAgentIntRate: '',
                biInferiorUserIntRate: '',
                primaryAgentStandard: '',
                mediumAgentStandard: '',
                seniorAgentStandard: ''
            },
            modeEditDlgShow: false,
            isLoading: false,
            isReadOnly: true
        };
    },
    computed: {
        ...mapGetters([
            'readOnlyMap'
        ])
    },
    methods:{
        onDlgShow(refName){
            if(this.$refs[refName])
            {
                this.$refs[refName].onInit();
            }
        },
        onInfoModified(){
            this.modeEditDlgShow = false;
            this.getViewData();
        },
        getViewData(){
            getModeInfo().then(response=> {
                if (response.status === 200) {
                    if (response.data.result) {
                        const resData = response.data.resData;
                        this.modeInfo.inferiorUserIntRate = resData.straight;
                        this.modeInfo.inferiorAgentIntRate = resData.lower;
                        this.modeInfo.biInferiorUserIntRate = resData.lowerLower;
                        this.modeInfo.primaryAgentStandard = resData.primary;
                        this.modeInfo.mediumAgentStandard = resData.secondary;
                        this.modeInfo.seniorAgentStandard = resData.tertiary;
                    }
                    else {
                        this.$message({
                            type: 'error',
                            message: `获取模式内容失败：${response.data.message}`,
                            duration: 1800
                        });
                    }
                }
                else {
                    this.$message({
                        type: 'error',
                        message: `获取模式内容失败 ${response.status}：${response.statusText}`,
                        duration: 1800
                    });
                }
            }).catch(err=> {
                this.$message.error("获取模式内容失败:" + err.message);
            });
        }
    },
    created(){
        if(!this.readOnlyMap[this.$route.path])
        {
            this.isReadOnly = false;
        }

        this.getViewData();
    },
    components:{
        modeEdit
    }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
.block-head {
  font-size: 17px;
  font-weight: bold;
  color: #7d7c7c;
  padding-bottom: 10px;
  border-bottom: 1px solid #eaeefb;
}
.block-paragraph {
  width: 60rem;
  padding: 10px 30px;
  line-height: 30px;
  text-indent: 2rem;
}
.el-card {
  box-shadow: none;
  padding-bottom: 0.9rem;
  border: none;
  .operate-btn {
    margin: 0;
  }
}
.user-info {
  list-style: none;
  padding: 0 1.2rem 5px 1.2rem;
  li {
    margin: 6px 0;
    padding-bottom: 5px;
    .title-label {
      display: inline-block;
      width: 200px;
      text-align: right;
      margin-right: 3rem;
    }
    .text-value {
      margin-right: 15px;
    }
  }
  .user-avatar {
    width: 40px;
    height: 40px;
    border-radius: 10px;
    border: 1px solid #dfdfdf;
  }
}
</style>
<style rel="stylesheet/scss" lang="scss">
.el-dlg-narrow {
  .el-dialog {
    width: 415px;
  }
}
</style>
