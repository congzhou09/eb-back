<template>
  <div class="app-container">
    <el-tabs value="1">
      <el-tab-pane :disabled="true" label="提现详情" name="1">
        <el-card>
          <ul class="info-list">
            <li>
              <label class="title-label">用户ID：</label><span>{{ withdrawInfo.userID }}</span>
            </li>
            <li>
              <label class="title-label">用户昵称：</label><span>{{ withdrawInfo.nickName }}</span>
            </li>
            <li>
              <label class="title-label">手机号：</label><span>{{ withdrawInfo.telephone }}</span>
            </li>
            <li><label class="title-label">提现金额：</label>{{ convertToMoneyAmount(withdrawInfo.withdrawAmount) }}</li>
            <li><label class="title-label">提现方式：</label>{{ convertToWithdrawType(withdrawInfo.withdrawType) }}</li>
            <li v-if="withdrawInfo.alipayRealName"><label class="title-label">用户姓名：</label>{{ withdrawInfo.alipayRealName }}</li>
            <li v-if="withdrawInfo.alipayAccount"><label class="title-label">支付宝账户：</label>{{ withdrawInfo.alipayAccount }}</li>
            <li v-if="withdrawInfo.bankAccount"><label class="title-label">银行账户名：</label>{{ withdrawInfo.bankAccount }}</li>
            <li v-if="withdrawInfo.bankCardNumber"><label class="title-label">银行卡号：</label>{{ withdrawInfo.bankCardNumber }}</li>
            <li>
              <label class="title-label">状态：</label>{{ convertToWithdrawStateLabel(withdrawInfo.state)
              }}<span v-if="withdrawInfo.reason">（原因：{{ withdrawInfo.reason }}）</span>
            </li>
          </ul>
          <div class="btn-group">
            <el-button v-if="withdrawInfo.nickName.length > 0 && withdrawInfo.state === 0" type="primary" @click="examineDlgShow = true"
              >审核</el-button
            >
            <el-button
              v-if="withdrawInfo.nickName.length > 0 && withdrawInfo.state === 1"
              type="primary"
              @click="onChangeWithdrawState(withdrawInfo.id, 4)"
              >确认</el-button
            >
            <el-button v-if="withdrawInfo.nickName.length > 0 && withdrawInfo.state === 4" type="primary" @click="completeDlgShow = true"
              >完成</el-button
            >
            <!--onChangeWithdrawState(withdrawInfo.id, 3)-->
            <el-button type="primary" @click="onReturn()">返回</el-button>
          </div>
        </el-card>
      </el-tab-pane>
    </el-tabs>

    <!--弹出框-->
    <el-dialog
      class="withdraw-examine"
      title="提现审核"
      :visible.sync="examineDlgShow"
      @open="onWithDrawExamineDlgOpen"
      :close-on-click-modal="false"
    >
      <withdraw-examine ref="withdrawExamineComp" @ok="onWithdrawExamineOk" @cancel="examineDlgShow = false"></withdraw-examine>
    </el-dialog>
    <el-dialog
      class="withdraw-examine"
      title="提现完成"
      :visible.sync="completeDlgShow"
      @open="onWithDrawCompleteeDlgOpen"
      :close-on-click-modal="false"
    >
      <withdraw-Complete ref="withdrawCompleteComp" @ok="onWithdrawCompleteOk" @cancel="completeDlgShow = false"></withdraw-Complete>
    </el-dialog>
  </div>
</template>

<script type="text/ecmascript-6">
import { convertToWithdrawStateLabel, convertToMoneyAmount, convertToWithdrawType } from '../../utils/appCommon';
import { getWithDrawInfo, changeWithdrawState } from '../../api/money';
import withdrawExamine from './withdraw-examine';
import withdrawComplete from './withdraw-complete';
export default {
  data() {
    return {
      withdrawInfo: {
        id: '',
        nickName: '',
        telephone: '',
        withdrawAmount: 0,
        withdrawType: '',
        bankAccount: '',
        bankCardNumber: '',
        state: '',
        userID: '',
        reason: '',
        alipayRealName: '',
        alipayAccount: ''
      },
      examineDlgShow: false,
      completeDlgShow: false
    };
  },
  methods: {
    convertToWithdrawStateLabel: convertToWithdrawStateLabel,
    convertToMoneyAmount: convertToMoneyAmount,
    convertToWithdrawType: convertToWithdrawType,
    onReturn() {
      this.$router.back();
    },
    overdueMeg() {
      this.$confirm('当前页面已过期，将返回列表页。', '', {
        confirmButtonText: '确定'
      })
        .then(() => {
          this.$router.replace({ path: '/money/withdraw' });
        })
        .catch(() => {});
    },
    changeWithdrawStateCore(id, state, reason) {
      const newState = this.convertToWithdrawStateLabel(state);
      const withdrawInfo = { id, state };
      if (reason && reason.length > 0) {
        withdrawInfo.reason = reason;
      }
      changeWithdrawState(withdrawInfo)
        .then(response => {
          if (response.status === 200) {
            if (response.data.result) {
              this.$message({
                type: 'success',
                message: `修改提现状态为 ${newState} 成功!`,
                duration: 1800
              });
              this.getInfo();
            } else {
              this.$message({
                type: 'error',
                message: `修改提现状态为 ${newState} 失败：${response.data.message}`,
                duration: 1800
              });
            }
          } else {
            this.$message({
              type: 'error',
              message: `修改提现状态为 ${newState} 失败 ${response.status}：${response.statusText}`,
              duration: 1800
            });
          }
        })
        .catch(err => {
          this.$message.error('修改提现状态为 ${newState} 失败:' + err.message);
        });
    },
    onChangeWithdrawState(id, state, reason) {
      if (state === 4) {
        const newState = this.convertToWithdrawStateLabel(state);
        this.$confirm(`将修改提现状态为" ${newState} ", 是否继续?`, '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        })
          .then(() => {
            this.changeWithdrawStateCore(id, state, reason);
          })
          .catch(() => {
            this.$message({
              type: 'info',
              message: '已取消提现状态修改',
              duration: 1000
            });
          });
      } else {
        this.changeWithdrawStateCore(id, state, reason);
      }
    },
    onWithdrawExamineOk(examineObj) {
      if (examineObj.state === 3) {
        this.onChangeWithdrawState(this.withdrawInfo.id, 3, examineObj.reason);
      } else if (examineObj.state === 1) {
        this.onChangeWithdrawState(this.withdrawInfo.id, 1);
      }
      this.examineDlgShow = false;
    },
    onWithDrawExamineDlgOpen() {
      if (this.$refs['withdrawExamineComp']) {
        this.$refs['withdrawExamineComp'].init();
      }
    },
    onWithdrawCompleteOk(infoObj) {
      if (infoObj.state === 5) {
        this.onChangeWithdrawState(this.withdrawInfo.id, 5, infoObj.reason);
      } else if (infoObj.state === 2) {
        this.onChangeWithdrawState(this.withdrawInfo.id, 2);
      }
      this.completeDlgShow = false;
    },
    onWithDrawCompleteeDlgOpen() {
      if (this.$refs['withdrawCompleteComp']) {
        this.$refs['withdrawCompleteComp'].init();
      }
    },
    getInfo() {
      const withdrawInfo = { id: this.withdrawInfo.id };
      getWithDrawInfo(withdrawInfo)
        .then(response => {
          if (response.status === 200) {
            if (response.data.id === withdrawInfo.id) {
              const resData = response.data;

              this.withdrawInfo.nickName = resData.userName;
              this.withdrawInfo.telephone = resData.phone;
              this.withdrawInfo.withdrawAmount = resData.amount;
              this.withdrawInfo.bankAccount = resData.bank;
              this.withdrawInfo.bankCardNumber = resData.cardNo;
              this.withdrawInfo.state = resData.state;
              this.withdrawInfo.userID = resData.userId;
              this.withdrawInfo.reason = resData.reason;
              this.withdrawInfo.withdrawType = resData.withdrawType;
              this.withdrawInfo.alipayRealName = resData.alipayRealName;
              this.withdrawInfo.alipayAccount = resData.alipayAccount;
            } else {
              this.$message({
                type: 'error',
                message: `服务器返回提现详情内容错误`,
                duration: 1800
              });
            }
          } else {
            this.$message({
              type: 'error',
              message: `获取提现详情失败 ${response.status}：${response.statusText}`,
              duration: 1800
            });
          }
        })
        .catch(err => {
          this.$message.error('获取提现详情失败:' + err.message);
        });
    }
  },
  created() {
    if (this.$route.params.withdrawData && Object.getOwnPropertyNames(this.$route.params.withdrawData).length > 0) {
      this.withdrawInfo.id = this.$route.params.withdrawData.id;
      this.getInfo();
    } else {
      this.overdueMeg();
    }
  },
  components: {
    withdrawExamine,
    withdrawComplete
  }
};
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
.el-card {
  max-width: 40rem;
  box-shadow: none;
  padding-bottom: 0.9rem;
  .btn-group {
    text-align: right;
    margin: 1rem 7px;
  }
}
.info-list {
  list-style: none;
  padding: 0 1.2rem 5px 1.2rem;
  li {
    margin: 18px 0;
    padding-bottom: 5px;
    border-bottom: 1px dashed;
    .title-label {
      display: inline-block;
      width: 100px;
      text-align: right;
      margin-right: 3rem;
    }
  }
  .user-avatar {
    width: 40px;
    height: 40px;
    border-radius: 10px;
  }
}
</style>
