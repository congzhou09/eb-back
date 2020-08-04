<template>
  <el-card>
    <el-form label-width="6rem" :rules="formRules" ref="manualChange" :model="formData">
      <el-form-item label="用户ID" prop="userId">
        <el-input v-model="formData.userId"></el-input>
      </el-form-item>

      <el-form-item label="类型" prop="changeType" required>
        <el-select v-model="formData.changeType" :disabled="true">
          <el-option v-for="item in changeTypeList" :key="item.value" :label="item.label" :value="item.value"> </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="金额" prop="moneyAmount">
        <el-input v-model="formData.moneyAmount"></el-input>
      </el-form-item>

      <el-form-item style="float:right;">
        <el-button type="primary" @click="onSubmit('manualChange')">确定</el-button>
        <el-button type="primary" @click="onCancel">取消</el-button>
      </el-form-item>
    </el-form>
  </el-card>
</template>

<script>
export default {
  props: {
    formData: {
      type: Object,
      default: function() {
        return {
          userId: '',
          changeType: 1,
          moneyAmount: 1
        };
      }
    }
  },
  data() {
    const userIdValidator = (rule, value, callback) => {
      if (value.length <= 0) {
        callback(new Error('请输入用户ID'));
      } else if (value.match(/[^0-9]/)) {
        callback(new Error('用户ID格式错误'));
      } else {
        callback();
      }
    };
    const moneyAmountValidator = (rule, value, callback) => {
      if (typeof value === 'string' && value.length <= 0) {
        callback(new Error('请输入金额'));
      } else if (typeof value === 'string' && (value.match(/[^0-9^.]/) || value === '0')) {
        callback(new Error('无效的金额值'));
      } else if (!/^[1-9]+[0-9]*$|^\d+\.\d+$/.test(value)) {
        callback(new Error('无效的金额值'));
      } else {
        callback();
      }
    };
    return {
      changeTypeList: [
        { label: '充值', value: 1 },
        { label: '扣款', value: -1 }
      ],
      formRules: {
        userId: [{ required: true, trigger: 'blur', validator: userIdValidator }],
        moneyAmount: [{ required: true, trigger: 'blur', validator: moneyAmountValidator }]
      }
    };
  },
  methods: {
    onSubmit(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          this.$emit('submit', this.formData);
        } else {
          return false;
        }
      });
    },
    onCancel() {
      this.$emit('cancel');
    }
  }
};
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
.el-input {
  width: 198px;
}
</style>
