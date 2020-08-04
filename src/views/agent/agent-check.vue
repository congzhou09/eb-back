<template>
  <div class="app-container">
    <el-tabs value="1">
      <el-tab-pane :disabled="true" label="代理详情" name="1">
        <el-card v-loading="isLoading">
          <div>
            <div class="block-head">基本信息</div>
            <ul class="user-info">
              <li>
                <label class="title-label" style="transform: translateY(-11px);">头像：</label
                ><img class="user-avatar" :src="agentInfo.avator" />
              </li>
              <li>
                <label class="title-label">用户ID：</label><span>{{ agentInfo.userID }}</span>
              </li>
              <li><label class="title-label">昵称：</label>{{ agentInfo.nickName }}</li>
              <li><label class="title-label">手机号：</label>{{ agentInfo.telephone }}</li>
              <li><label class="title-label">注册时间：</label>{{ agentInfo.regTime }}</li>
            </ul>
          </div>
          <div>
            <div class="block-head">
              <span>代理信息</span>
              <el-button
                v-if="!isReadOnly"
                class="operate-btn"
                type="text"
                style="float:right;"
                @click="
                  agentEditDlgShow = true;
                  onDlgShow('editComp');
                "
                >编辑</el-button
              >
            </div>
            <ul class="user-info">
              <li>
                <label class="title-label">代理ID：</label><span>{{ agentInfo.agentID }}</span>
              </li>
              <li><label class="title-label">代理等级：</label>{{ convertToAgentGradeLabel(agentInfo.agentGrade) }}</li>
              <li><label class="title-label">代理状态：</label>{{ convertToStateLabel(agentInfo.state) }}</li>
              <li><label class="title-label">代理时间：</label>{{ agentInfo.regTime }}</li>
              <li>
                <label class="title-label">邀请码：</label><span>{{ agentInfo.inviteCode }}</span>
              </li>
            </ul>
          </div>
          <div>
            <div class="block-head">销售信息</div>
            <ul class="user-info">
              <li>
                <label class="title-label">当月销售额：</label><span>{{ convertToMoneyAmount(agentInfo.monthlySales) }}</span>
              </li>
              <li><label class="title-label">当月收入：</label>{{ convertToMoneyAmount(agentInfo.monthlyIncome) }}</li>
              <li><label class="title-label">总销售额：</label>{{ convertToMoneyAmount(agentInfo.sumSales) }}</li>
              <li><label class="title-label">总收入：</label>{{ convertToMoneyAmount(agentInfo.sumIncome) }}</li>
              <li>
                <label class="title-label">收入明细：</label>
                <el-button
                  v-if="parseFloat(agentInfo.sumIncome) != 0"
                  class="operate-btn"
                  type="text"
                  @click="
                    incomeDetailDlgShow = true;
                    onDlgShow('incomeComp');
                  "
                  >查看</el-button
                >
                <span v-else>无</span>
              </li>
            </ul>
          </div>
          <div>
            <div class="block-head">绑定信息</div>
            <ul class="user-info">
              <li>
                <label class="title-label">上级代理：</label>
                <el-button
                  v-if="agentInfo.superiorID != null"
                  class="operate-btn"
                  type="text"
                  @click="
                    superiorDlgShow = true;
                    onDlgShow('superiorComp');
                  "
                  >查看</el-button
                >
                <span v-else>无</span>
              </li>
              <li>
                <label class="title-label">绑定用户：</label>
                <span class="text-value">{{ agentInfo.inferiorUserNum }}</span>
                <el-button
                  v-if="agentInfo.inferiorUserNum > 0"
                  class="operate-btn"
                  type="text"
                  @click="
                    inferiorUserDlgShow = true;
                    onDlgShow('inferiorUserComp');
                  "
                >
                  查看
                </el-button>
              </li>
              <li>
                <label class="title-label">下级代理：</label>
                <span class="text-value">{{ agentInfo.inferiorAgentNum }}</span>
                <el-button
                  v-if="agentInfo.inferiorAgentNum > 0"
                  class="operate-btn"
                  type="text"
                  @click="
                    inferiorAgentDlgShow = true;
                    onDlgShow('inferiorAgentComp');
                  "
                >
                  查看
                </el-button>
              </li>
              <li>
                <label class="title-label">下下级代理：</label>
                <span class="text-value">{{ agentInfo.biinferiorAgentNum }}</span>
                <el-button
                  v-if="agentInfo.biinferiorAgentNum > 0"
                  class="operate-btn"
                  type="text"
                  @click="
                    biInferiorAgentDlgShow = true;
                    onDlgShow('biinferiorAgentComp');
                  "
                >
                  查看
                </el-button>
              </li>
            </ul>
          </div>

          <el-button type="primary" @click="onReturn()" style="float:right;margin-right: 2rem;">返回</el-button>
        </el-card>

        <!--弹出框-->
        <el-dialog class="el-dlg-narrow" title="代理信息编辑" :visible.sync="agentEditDlgShow" :close-on-click-modal="false">
          <agent-edit
            ref="editComp"
            :formDataProp="{
              agentID: agentInfo.agentID,
              agentLevel: agentInfo.agentGrade,
              agentState: agentInfo.state
            }"
            @ok="
              agentEditDlgShow = false;
              getViewData();
            "
            @cancel="agentEditDlgShow = false"
          ></agent-edit>
        </el-dialog>
        <el-dialog class="el-dlg-narrow" title="上级代理" :visible.sync="superiorDlgShow" :close-on-click-modal="false">
          <agent-superior ref="superiorComp" :superiorID="agentInfo.superiorID" @cancel="superiorDlgShow = false"></agent-superior>
        </el-dialog>
        <el-dialog title="收入明细" :visible.sync="incomeDetailDlgShow" :close-on-click-modal="false">
          <agent-income-detail ref="incomeComp" :agentID="agentInfo.agnetID"></agent-income-detail>
        </el-dialog>
        <el-dialog title="绑定用户" :visible.sync="inferiorUserDlgShow" :close-on-click-modal="false">
          <agent-inferior-user ref="inferiorUserComp" :agentID="agentInfo.agnetID"></agent-inferior-user>
        </el-dialog>
        <el-dialog title="下级代理" :visible.sync="inferiorAgentDlgShow" :close-on-click-modal="false">
          <agent-inferior-agent
            ref="inferiorAgentComp"
            :agentID="agentInfo.agnetID"
            @cancel="inferiorAgentDlgShow = false"
          ></agent-inferior-agent>
        </el-dialog>
        <el-dialog title="下下级代理" :visible.sync="biInferiorAgentDlgShow" :close-on-click-modal="false">
          <agent-biinferior-agent
            ref="biinferiorAgentComp"
            :agentID="agentInfo.agnetID"
            @cancel="biInferiorAgentDlgShow = false"
          ></agent-biinferior-agent>
        </el-dialog>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script type="text/ecmascript-6">
import { mapGetters } from 'vuex';
import { convertToMoneyAmount, convertToTimeString } from '../../utils/appCommon';
import { convertToAgentGradeLabel, convertToStateLabel } from '../../utils/agentCommon';
import { getAgentDetail } from '../../api/agent';
import agentSuperior from './agent-superior';
import agentInferiorUser from './agent-inferior-user';
import agentInferiorAgent from './agent-inferior-agent';
import agentBiinferiorAgent from './agent-biinferior-agent';
import agentIncomeDetail from './agent-income-detail';
import agentEdit from './agent-edit';
export default {
  data() {
    return {
      agentInfo: {
        agnetID: '',
        inviteCode: '',
        userID: '',
        superiorID: '',
        avator: '',
        agentGrade: '',
        state: '',
        regTime: '',
        agentTime: '',
        nickName: '',
        telephone: '',
        monthlySales: '',
        monthlyIncome: '',
        sumSales: '',
        sumIncome: '',
        inferiorUserNum: 0,
        inferiorAgentNum: 0,
        biinferiorAgentNum: 0
      },
      isReadOnly: true,
      isLoading: false,
      superiorDlgShow: false,
      incomeDetailDlgShow: false,
      inferiorUserDlgShow: false,
      inferiorAgentDlgShow: false,
      biInferiorAgentDlgShow: false,
      agentEditDlgShow: false
    };
  },
  computed: {
    ...mapGetters(['readOnlyMap'])
  },
  methods: {
    convertToMoneyAmount: convertToMoneyAmount,
    convertToTimeString: convertToTimeString,
    convertToAgentGradeLabel: convertToAgentGradeLabel,
    convertToStateLabel: convertToStateLabel,
    onDlgShow(refName) {
      if (this.$refs[refName]) {
        this.$refs[refName].onInit();
      }
    },
    onReturn() {
      this.$router.back();
    },
    overdueMeg() {
      this.$confirm('当前页面已过期，将返回列表页。', '', {
        confirmButtonText: '确定'
      })
        .then(() => {
          this.$router.replace({ path: '/agent/list' });
        })
        .catch(() => {});
    },
    getViewData() {
      this.isLoading = true;
      const queryInfo = { proxyId: this.agentInfo.agnetID };
      getAgentDetail(queryInfo)
        .then(response => {
          if (response.status === 200) {
            if (response.data.result) {
              const resData = response.data.resData;
              this.agentInfo.avator = resData.avatar;
              this.agentInfo.userID = resData.userId;
              this.agentInfo.superiorID = resData.parentProxyId;
              this.agentInfo.nickName = resData.nickName;
              this.agentInfo.telephone = resData.phone;
              this.agentInfo.regTime = resData.registerTime;
              this.agentInfo.agentID = resData.proxyId;
              this.agentInfo.agentGrade = resData.proxyLevel;
              this.agentInfo.state = resData.status;
              this.agentInfo.agentTime = resData.standardTime;
              this.agentInfo.monthlySales = resData.monthlySales;
              this.agentInfo.monthlyIncome = resData.monthlyIncome;
              this.agentInfo.sumSales = resData.sumSales;
              this.agentInfo.sumIncome = resData.sumIncome;
              this.agentInfo.inferiorUserNum = resData.bindNum;
              this.agentInfo.inferiorAgentNum = resData.lowerProxyNum;
              this.agentInfo.biinferiorAgentNum = resData.lowerLowerProxyNum;
              this.agentInfo.inviteCode = resData.inviteCode;
            } else {
              this.$message({
                type: 'error',
                message: `获取代理详情失败：${response.data.message}`,
                duration: 1800
              });
            }
          } else {
            this.$message({
              type: 'error',
              message: `获取代理详情失败 ${response.status}：${response.statusText}`,
              duration: 1800
            });
          }
          this.isLoading = false;
        })
        .catch(err => {
          this.$message.error('获取代理详情失败:' + err.message);
          this.isLoading = false;
        });
    }
  },
  created() {
    if (this.$route.params.agentData && Object.getOwnPropertyNames(this.$route.params.agentData).length > 0) {
      if (!this.readOnlyMap[this.$route.path]) {
        this.isReadOnly = false;
      }

      this.agentInfo.agnetID = this.$route.params.agentData.agentID;
      this.getViewData();
    } else {
      this.isLoading = false;
      this.overdueMeg();
    }
  },
  components: {
    agentSuperior,
    agentInferiorUser,
    agentInferiorAgent,
    agentBiinferiorAgent,
    agentIncomeDetail,
    agentEdit
  }
};
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
.block-head {
  font-size: 17px;
  font-weight: bold;
  color: #7d7c7c;
  padding-bottom: 10px;
  border-bottom: 1px solid #eaeefb;
}
.el-card {
  max-width: 80%;
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
      width: 100px;
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
