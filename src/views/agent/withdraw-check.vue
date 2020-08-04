<template>
  <el-card class="el-card-in-dlg">
    <div>
      <div class="block-head">用户信息</div>
      <ul class="info-list">
        <li>
          <label class="title-label">用户ID：</label><span>{{ withdrawInfo.userID }}</span>
        </li>
        <li>
          <label class="title-label">UUID：</label><span>{{ withdrawInfo.UUID === null ? '无' : withdrawInfo.UUID }}</span>
        </li>
        <li>
          <label class="title-label">昵称：</label><span>{{ withdrawInfo.nickName }}</span>
        </li>
        <li>
          <label class="title-label">手机号：</label><span>{{ withdrawInfo.telephone }}</span>
        </li>
        <li>
          <label class="title-label">代理ID：</label><span>{{ withdrawInfo.agentID }}</span>
        </li>
      </ul>
    </div>
    <div>
      <div class="block-head">提现信息</div>
      <ul class="info-list">
        <li><label class="title-label">提现金额：</label>{{ convertToMoneyAmount(withdrawInfo.withdrawAmount) }}</li>
        <li><label class="title-label">银行账户名：</label>{{ withdrawInfo.bankAccount }}</li>
        <li><label class="title-label">银行类型：</label>{{ withdrawInfo.bankName }}</li>
        <li><label class="title-label">银行卡号：</label>{{ withdrawInfo.bankCardNumber }}</li>
        <li>
          <label class="title-label">状态：</label>{{ convertToWithdrawStateLabel(withdrawInfo.state)
          }}<span v-if="withdrawInfo.reason">（原因：{{ withdrawInfo.reason }}）</span>
        </li>
      </ul>
    </div>

    <div class="btn-group">
      <el-button type="primary" @click="$emit('cancel')">关闭</el-button>
    </div>
  </el-card>
</template>

<script type="text/ecmascript-6">
import { convertToWithdrawStateLabel, convertToMoneyAmount } from '../../utils/appCommon';
import { getWithdrawDetail } from '../../api/agent';
export default {
  props: {
    withdrawId: {
      type: Number
    }
  },
  data() {
    return {
      withdrawInfo: {
        id: '',
        userID: '',
        UUID: '',
        nickName: '',
        telephone: '',
        agentID: '',
        withdrawAmount: 0,
        bankAccount: '',
        bankName: '',
        bankCardNumber: '',
        state: '',
        reason: ''
      }
    };
  },
  methods: {
    convertToMoneyAmount: convertToMoneyAmount,
    convertToWithdrawStateLabel: convertToWithdrawStateLabel,
    overdueMeg() {
      this.$confirm('当前页面已过期，将返回列表页。', '', {
        confirmButtonText: '确定'
      })
        .then(() => {
          this.$router.replace({ path: '/agent/withdraw' });
        })
        .catch(() => {});
    },
    getInfo() {
      const withdrawInfo = { recordId: this.withdrawId };
      getWithdrawDetail(withdrawInfo)
        .then(response => {
          if (response.status === 200) {
            const resData = response.data.resData;
            if (resData.recordId === withdrawInfo.recordId) {
              this.withdrawInfo.userID = resData.userId;
              this.withdrawInfo.UUID = resData.uuid;
              this.withdrawInfo.nickName = resData.nickName;
              this.withdrawInfo.telephone = resData.phone;
              this.withdrawInfo.agentID = resData.proxyId;
              this.withdrawInfo.withdrawAmount = resData.amount;
              this.withdrawInfo.bankAccount = resData.accountName;
              this.withdrawInfo.bankName = resData.bankName;
              this.withdrawInfo.bankCardNumber = resData.bankCardNo;
              this.withdrawInfo.state = resData.status;
              this.withdrawInfo.reason = resData.auditRemark;
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
    },
    init() {
      this.$nextTick(() => {
        this.getInfo();
      });
    }
  },
  mounted() {
    this.getInfo();
  }
};
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
.el-card {
  background-color: white;
  max-width: 40rem;
  box-shadow: none;
  .block-head {
    font-size: 15px;
    font-weight: bold;
    color: #7d7c7c;
    padding-bottom: 10px;
    border-bottom: 1px solid #eaeefb;
  }
  .btn-group {
    text-align: right;
    margin: 1rem 7px 0 0;
  }
}
.info-list {
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
  }
  .user-avatar {
    width: 40px;
    height: 40px;
    border-radius: 10px;
  }
}
</style>
<style rel="stylesheet/scss" lang="scss">
.el-card-in-dlg {
  .el-card__body {
    padding: 2px;
  }
}
</style>
