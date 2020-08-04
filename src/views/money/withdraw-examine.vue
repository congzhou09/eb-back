<template>
  <div>
    <el-card>
      <h3>请检查提现申请卡号、账户名是否有效</h3>
      <el-radio class="radio" v-model="examinePass" label="1">审核通过</el-radio>
      <el-radio class="radio" v-model="examinePass" label="3">审核不通过</el-radio>
      <el-input
        v-show="examinePass === '3'"
        type="textarea"
        :rows="2"
        :maxlength="100"
        placeholder="请填写不通过的详细原因！"
        v-model="notPassReason"
      >
      </el-input>
    </el-card>
    <div style="text-align:right;margin-top: 30px">
      <el-button type="primary" @click="onOk" :disabled="examinePass === '3' && notPassReason.trim().length <= 0">确定</el-button>
      <el-button type="primary" @click="onCancel">取消</el-button>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      examinePass: '1',
      notPassReason: ''
    };
  },
  methods: {
    onOk() {
      this.$emit('ok', { state: parseInt(this.examinePass), reason: this.notPassReason });
    },
    onCancel() {
      this.$emit('cancel');
    },
    init() {
      this.examinePass = '1';
      this.notPassReason = '';
    }
  }
};
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
.el-card {
  background-color: #fbfbfb;
  border: none;
  box-shadow: none;
  padding-bottom: 10px;
}
.el-textarea {
  margin-top: 17px;
}
</style>
