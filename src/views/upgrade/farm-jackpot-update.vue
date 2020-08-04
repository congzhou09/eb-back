<template>
  <el-form label-width="6rem" :rules="expressRules" ref="expressInfo" :model="expressData">
    <el-form-item :label="this.expressData.moneyType === 6 ? '抽税率' : '奖池线'" prop="warningValue">
      <el-input v-model="expressData.warningValue" :maxlength="30"></el-input>
    </el-form-item>

    <div style="text-align:right;">
      <el-button type="primary" @click="onChangeExpress('expressInfo')">确定</el-button>
      <el-button type="primary" @click="onCancel">取消</el-button>
    </div>
  </el-form>
</template>

<script>
import { addjackpotInfo, updatajackpotInfo } from '../../api/upgrade';
export default {
  props: {
    expressData: {
      type: Object,
      default: () => {
        return {
          warningValue: '',
          moneyType: '',
          id: 0,
          jackValue: ''
        };
      }
    }
  },
  data() {
    const warningValueValidator = (rule, value, callback) => {
      /* if(value.length<=0)
                 {
                     callback(new Error('内容不可以为空'));
                 }
                 else
                 if(!/^[0-9]*$/.test(value)){
                     callback(new Error('请输入正确的奖池线值，只能输入整数'));
                 }
                 else
                 {
                     callback();
                 }*/
      if (value.length <= 0) {
        callback(new Error('内容不可以为空'));
      } else {
        if (this.expressData.moneyType === 6) {
          if (/^(([0-9]+\.[0-9]*[1-9][0-9]*)|([0-9]*[1-9][0-9]*\.[0-9]+))$/.test(value) && value <= 1) {
            callback();
          } else {
            callback(new Error('抽水率，请用小数传递例：如5% =0.05'));
          }
        } else {
          if (!/^[0-9]*$/.test(value)) {
            callback(new Error('请输入正确的奖池线值，只能输入整数'));
          } else {
            callback();
          }
        }
      }
    };
    return {
      expressRules: {
        warningValue: [{ required: true, trigger: 'blur', validator: warningValueValidator }]
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
          // console.log('添加的值-----',this.expressData.jackValue+'id'+this.expressData.id);
          // if(this.expressData.id===0 || this.expressData.id==='')//添加

          if (this.expressData.jackValue === '') {
            // 添加
            // alert('添加');
            const addjackpot = { gameId: 3, money: this.expressData.warningValue, moneyType: this.expressData.moneyType };

            addjackpotInfo(addjackpot)
              .then(response => {
                if (response.status === 200) {
                  if (response.data.code === 200) {
                    this.$message({
                      type: 'success',
                      message: `添加奖池预警线值成功!`,
                      duration: 1800
                    });
                    this.$emit('ok', addjackpot);
                    this.$emit('cancel');
                  } else {
                    this.$message({
                      type: 'error',
                      message: `添加奖池预警线值失败：${response.data.message}`,
                      duration: 1800
                    });
                  }
                  this.$emit('cancel');
                } else {
                  this.$message({
                    type: 'error',
                    message: `添加奖池预警线值失败 ${response.status}：${response.statusText}`,
                    duration: 1800
                  });
                }
                this.$emit('cancel');
              })
              .catch(err => {
                this.$message.error(err);
              });
          } // 修改
          else {
            const updatajackpot = { id: this.expressData.id, money: this.expressData.warningValue };

            updatajackpotInfo(updatajackpot)
              .then(response => {
                if (response.status === 200) {
                  if (response.data.code === 200) {
                    this.$message({
                      type: 'success',
                      message: `修改奖池预警线值成功!`,
                      duration: 1800
                    });
                    this.$emit('ok', updatajackpot);
                    this.$emit('cancel');
                  } else {
                    this.$message({
                      type: 'error',
                      message: `修改奖池预警线值失败：${response.data.message}`,
                      duration: 1800
                    });
                  }
                } else {
                  this.$message({
                    type: 'error',
                    message: `修改奖池预警线值失败 ${response.status}：${response.statusText}`,
                    duration: 1800
                  });
                }
                this.$emit('cancel');
              })
              .catch(err => {
                this.$message.error(err);
              });
          }
        } else {
          return false;
        }
      });
    }
  },
  created() {
    // console.log(this.expressData.moneyType);
  }
};
</script>

<style rel="stylesheet/scss" lang="scss" scoped></style>
