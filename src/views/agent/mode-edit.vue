<template>
  <el-card class="el-card-in-dlg">
    <el-form label-width="6rem" :model="formData" :rules="theFormRules" ref="theForm">
      <el-form-item label="初级代理" prop="inferiorUserIntRate" required>
        <el-input v-model="formData.inferiorUserIntRate"></el-input>
      </el-form-item>
      <el-form-item label="中级代理" prop="inferiorAgentIntRate" required>
        <el-input v-model="formData.inferiorAgentIntRate"></el-input>
      </el-form-item>
      <el-form-item label="高级代理" prop="biInferiorUserIntRate" required>
        <el-input v-model="formData.biInferiorUserIntRate"></el-input>
      </el-form-item>
    </el-form>

    <span class="input-instruct">（填写说明：非负百分数，值小于100%，支持精确到小数点后两位，格式示例：1%，1.2%，5.00%）</span>

    <div class="btn-group">
      <el-button type="primary" @click="onOk">保存</el-button>
      <el-button type="primary" @click="$emit('cancel')">取消</el-button>
    </div>
  </el-card>
</template>

<script type="text/ecmascript-6">
import { updateInferiorRate } from '../../api/agent';
export default {
  props: {
    formDataProp: {
      type: Object,
      default: function() {
        return {
          inferiorUserIntRate: '',
          inferiorAgentIntRate: '',
          biInferiorUserIntRate: ''
        };
      }
    }
  },
  data() {
    function rateValidator(rule, value, callback) {
      if (!value || value.length <= 0) {
        callback(new Error('不可以为空'));
      } else {
        const ratePattern = /^[0-9]{1,2}(\.[0-9]{1,2})?%$/;
        if (!value.match(ratePattern)) {
          callback(new Error('无效的返利比例'));
        } else {
          callback();
        }
      }
    }
    return {
      formData: {
        inferiorUserIntRate: '',
        inferiorAgentIntRate: '',
        biInferiorUserIntRate: ''
      },
      theFormRules: {
        inferiorUserIntRate: [{ trigger: 'blur', validator: rateValidator }],
        inferiorAgentIntRate: [{ trigger: 'blur', validator: rateValidator }],
        biInferiorUserIntRate: [{ trigger: 'blur', validator: rateValidator }]
      }
    };
  },
  methods: {
    onOk() {
      this.$refs['theForm'].validate(valid => {
        if (valid) {
          const rateInfo = {
            straight: parseFloat(this.formData.inferiorUserIntRate) / 100,
            lower: parseFloat(this.formData.inferiorAgentIntRate) / 100,
            lowerLower: parseFloat(this.formData.biInferiorUserIntRate) / 100
          };
          updateInferiorRate(rateInfo)
            .then(response => {
              if (response.status === 200) {
                if (response.data.result) {
                  this.$message({
                    type: 'success',
                    message: `修改返利比例成功!`,
                    duration: 1800
                  });
                  this.$emit('ok');
                } else {
                  this.$message({
                    type: 'error',
                    message: `修改返利比例失败：${response.data.message}`,
                    duration: 1800
                  });
                }
              } else {
                this.$message({
                  type: 'error',
                  message: `修改返利比例失败 ${response.status}：${response.statusText}`,
                  duration: 1800
                });
              }
            })
            .catch(err => {
              this.$message.error('修改返利比例失败:' + err.message);
            });
        } else {
          return false;
        }
      });
    },
    onInit() {
      this.$refs['theForm'].resetFields();
      for (const key in this.formData) {
        if ({}.hasOwnProperty.call(this.formData, key)) {
          this.formData[key] = this.formDataProp[key];
        }
      }
    }
  },
  mounted() {
    this.onInit();
  }
};
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
.el-card {
  background-color: white;
  max-width: 40rem;
  box-shadow: none;
  padding: 0;
  .el-input {
    width: 198px;
  }
  .btn-group {
    text-align: right;
    margin: 1rem 7px 0 0;
  }
  .input-instruct {
    display: inline-block;
    font-size: 12px;
    width: 80%;
    color: rgb(39, 70, 220);
    padding-left: 26px;
    font-weight: bold;
  }
}
</style>
