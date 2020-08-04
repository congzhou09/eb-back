<template>
  <el-form label-width="6rem" :rules="expressRules" ref="expressInfo" :model="expressData">
    <el-form-item label="配送方" prop="name">
      <el-input v-model="expressData.name" :maxlength="30"></el-input>
    </el-form-item>
    <el-form-item label="快递单号" prop="expressNo">
      <el-input v-model="expressData.expressNo" :maxlength="50"></el-input>
    </el-form-item>

    <div style="text-align:right;">
      <el-button type="primary" @click="onChangeExpress('expressInfo')">确定</el-button>
      <el-button type="primary" @click="onCancel">取消</el-button>
    </div>
  </el-form>
</template>

<script>
import { express, updateExpress } from '../../api/mall';
export default {
  props: {
    expressData: {
      type: Object,
      default: () => {
        return {
          name: '',
          expressNo: '',
          orderNumber: '',
          exName: '',
          exExpressNo: '',
          id: 0
        };
      }
    }
  },
  data() {
    const expressNameValidator = (rule, value, callback) => {
      if (value === null) {
        callback(new Error('请输入配送方名称'));
      } else {
        callback();
      }
    };
    const expressNoValidator = (rule, value, callback) => {
      if (value === null) {
        callback(new Error('请输入快递单号'));
      } else {
        callback();
      }
    };
    return {
      expressRules: {
        name: [{ required: true, trigger: 'blur', validator: expressNameValidator }],
        expressNo: [{ required: true, trigger: 'blur', validator: expressNoValidator }]
      }
    };
  },
  methods: {
    onCancel() {
      this.$emit('cancel');
    },
    onChangeExpress(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          const expressInfo = {
            expressNo: this.expressData.expressNo,
            name: this.expressData.name,
            orderNo: this.expressData.orderNumber
          };

          if (this.expressData.exName == null && this.expressData.exExpressNo == null) {
            // 添加
            //                            addExpress(expressInfo).then(response=>{
            express(expressInfo)
              .then(response => {
                if (response.data.code === 200) {
                  if (response.data.result) {
                    this.$message({
                      type: 'success',
                      message: `更新配送信息成功!`,
                      duration: 1800
                    });
                    this.$emit('ok', expressInfo);
                  } else {
                    this.$message({
                      type: 'error',
                      message: `更新配送信息失败：${response.data.message}`,
                      duration: 1800
                    });
                  }
                } else {
                  this.$message({
                    type: 'error',
                    message: `更新配送信息失败 ${response.data.code}：${response.data.message}`,
                    duration: 1800
                  });
                }
              })
              .catch(err => {
                this.$message.error('更新配送信息失败:' + err.data.message);
              });
          } // 修改
          else {
            //                            expressInfo.id = this.expressData.id;
            //                            updateExpress(expressInfo).then(response=>{
            updateExpress(expressInfo)
              .then(response => {
                if (response.data.code === 200) {
                  if (response.data.result) {
                    this.$message({
                      type: 'success',
                      message: `更新配送信息成功!`,
                      duration: 1800
                    });
                    this.$emit('ok', expressInfo);
                  } else {
                    this.$message({
                      type: 'error',
                      message: `更新配送信息失败：${response.data.message}`,
                      duration: 1800
                    });
                  }
                } else {
                  this.$message({
                    type: 'error',
                    message: `更新配送信息失败 ${response.data.code}：${response.data.message}`,
                    duration: 1800
                  });
                }
              })
              .catch(err => {
                this.$message.error('更新配送信息失败:' + err.message);
              });
          }
        } else {
          return false;
        }
      });
    }
  }
};
</script>

<style rel="stylesheet/scss" lang="scss" scoped></style>
