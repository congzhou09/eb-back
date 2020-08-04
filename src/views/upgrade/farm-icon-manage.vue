<template>
  <div class="app-container">
    <el-tabs value="first">
      <el-tab-pane :disabled="true" label="图标管理" name="first">
        <!--表格-->
        <el-table v-loading="isLoading" :data="tableData" border style="width: 100%">
          <el-table-column align="center" prop="id" label="ID" width="120"> </el-table-column>
          <el-table-column align="center" label="坐标" width="120">
            <template slot-scope="scope">
              {{ convertTofarmCoordinat(scope.row.coordinate) }}
            </template>
          </el-table-column>
          <el-table-column align="center" prop="module" label="模块" width=""> </el-table-column>
          <el-table-column align="center" prop="name" label="名称" width=""> </el-table-column>
          <el-table-column align="center" prop="sort" label="排序" width="120"> </el-table-column>
          <el-table-column align="center" label="图标" width="">
            <template slot-scope="scope">
              <img class="table-cell-img" :src="scope.row.icons" />
            </template>
          </el-table-column>
          <el-table-column align="center" label="操作" v-if="!isReadOnly">
            <template slot-scope="scope">
              <el-button
                type="text"
                size="small"
                @click="
                  processID = scope.row.id;
                  editDlgShow = true;
                  onDlgShow('editComp');
                "
                >修改</el-button
              >
            </template>
          </el-table-column>
        </el-table>
        <!--修改图标弹窗-->
        <!--<el-dialog title="权重设置" :visible.sync="editDlgShow" :close-on-click-modal="false" @open="onEditWeightDlgOpen">
                    <weight-edit ref="editListComp" operType="edit" :gameUserInfo="curProbabList" @cancel="editDlgShow = false;"></weight-edit>
                </el-dialog>-->
        <!--onRefresh();-->
        <el-dialog title="修改图标" width="30%" :visible.sync="editDlgShow" :close-on-click-modal="false">
          <weight-edit
            ref="editComp"
            curType="edit"
            :processID="processID"
            @ok="
              editDlgShow = false;
              onRefresh();
            "
            @cancel="editDlgShow = false"
          ></weight-edit>
        </el-dialog>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script type="text/ecmascript-6">
import weightEdit from "./weight-edit";
import {convertTofarmCoordinat} from '../../utils/appCommon';
import {getIconList, } from '../../api/upgrade';
import { mapGetters } from 'vuex';
export default {
    data() {
        return {
            activeName:'1',
            isLoading: false,
            tableData:[{
                'id': 1,
                'module': '飞机',
                'name': '侦查机',
                'icons':'/static/mock/1512454072758.png'
            }],
            editDlgShow: false,
            processID: -1,
            isReadOnly: true,
            curProbabList: {}
        };
    },
    methods: {
        convertTofarmCoordinat:convertTofarmCoordinat,
        onDlgShow(refName){
            if(this.$refs[refName])
            {
                this.$refs[refName].onInit();
            }
        },
        // 获取图标
        onRefresh(){
            this.tableData.length = 0;
            this.$delete(this.tableData, 0);
            getIconList().then(response=> {
                console.log(response);
                if (response.status === 200) {
                    if(response.data.code === 200){

                        response.data.resData.forEach((value, index)=>{
                            const oneItem = {
                                id: value.id,
                                coordinate: value.id,
                                sort: value.sort,
                                parentId: value.parentId,
                                module: (value.level ===0 || value.level===1)? value.name : value.level===2?'区域':'商品',
                                name: value.name,
                                icons: value.img,


                            };
                            this.$set(this.tableData, index, oneItem);
                        });

                    }else{
                        this.$message({
                            type: 'error',
                            message: `获取图标列表失败：${response.data.message}`,
                            duration: 1800
                        });
                    }

                }
                else {
                    this.$message({
                        type: 'error',
                        message: `获取图标列表失败 ${response.status}：${response.statusText}`,
                        duration: 1800
                    });
                }
                this.isLoading = false;
            }).catch(err=> {
                this.isLoading = false;
                this.$message.error("获取玩法列表失败:" + err.message);
            });
        },
    },
    components: {
        weightEdit
    },
    computed: {
        ...mapGetters([
            'readOnlyMap'
        ])
    },
    mounted(){
        this.onRefresh();
    },
    created(){
        if(this.$route.params.fromSiderBar)
        {
            window.localStorage.setItem('pairListCurrentType', "jackpot");
            window.localStorage.setItem('curPage', 1);
            window.localStorage.setItem('sortOptions', '');
        }
        if(!this.readOnlyMap[this.$route.path])
        {
            this.isReadOnly = false;
        }
    }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
.el-card {
  background-color: #f9fafc;
  border: none;
  box-shadow: none;
}
.add-btn {
  margin: 10px 32px 10px 0;
}
.table-cell-img {
  vertical-align: middle;
  width: 56px;
  margin: 2px;
  border: 1px solid #c7bcbc;
  border-radius: 9px;
}
</style>
