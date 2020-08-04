<template>
  <div>
    <el-card>
      <span style="display:block;font-size:20px;font-weight: bold;">是否成功为用户打款？</span>
      <span style="display:block;line-height:40px;font-size:14px;color:#6f6e6e;"
        >（如果选“打款失败”,提现金额将退回到系统内相应用户的账户）</span
      >

      <el-radio class="radio" v-model="completeResult" label="2">打款成功</el-radio>
      <el-radio class="radio" v-model="completeResult" label="5">打款失败</el-radio>
      <el-input
        v-show="completeResult === '5'"
        type="textarea"
        :rows="2"
        :maxlength="100"
        placeholder="请填写打款失败的详情！"
        v-model="failDetail"
      >
      </el-input>
    </el-card>
    <div style="text-align:right;margin-top: 30px">
      <el-button type="primary" @click="onOk" :disabled="completeResult === '5' && failDetail.trim().length <= 0">确定</el-button>
      <el-button type="primary" @click="onCancel">取消</el-button>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      completeResult: '2',
      failDetail: ''
    };
  },
  methods: {
    onOk() {
      this.$emit('ok', { state: parseInt(this.completeResult), reason: this.failDetail });
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
