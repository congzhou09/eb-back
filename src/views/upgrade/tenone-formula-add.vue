<template>
  <el-card class="el-card-in-dlg" v-loading="isLoading">
    <el-form label-width="10rem" label-position="left" :model="formData" :rules="theFormRules" ref="theForm" style="margin-left: 20px;">
      <el-form-item label="权重值st = "> </el-form-item>
      <el-form-item label="总奖励金额（m） X" prop="amount">
        <el-input v-model="formData.amount" placeholder="权重系数" :maxlength="20"> </el-input>
      </el-form-item>
      <el-form-item label="总参与用户数（u）X" key="sum" prop="sum">
        <el-input v-model="formData.sum" placeholder="权重系数" :maxlength="20"> </el-input>
      </el-form-item>
      <el-form-item label="商品遗漏数（d）X" key="missing" prop="missing">
        <el-input v-model="formData.missing" placeholder="权重系数" :maxlength="20"> </el-input>
      </el-form-item>
      <el-form-item label="单注下注金额（s）X" key="bet" prop="bet">
        <el-input v-model="formData.bet" placeholder="权重系数" :maxlength="20"> </el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="onOk">保存</el-button>
        <el-button type="primary" @click="$emit('cancel')">取消</el-button>
      </el-form-item>
    </el-form>
    <!-- <div class="btn-group"></div>-->
  </el-card>
</template>

<script type="text/ecmascript-6">
import { voucherTypeList, convertToVoucherTypeLabel } from '../../utils/appCommon';
import { addformulaInfo, editFormulas, getformula } from '../../api/upgrade';

export default {
  props: {
    curType: {
      type: String,
      default: 'add'
    },
    processID: {
      type: Number
    },
    formulaType: {
      default: 1
    }
  },
  data() {
    return {
      voucherTypeList: voucherTypeList,
      formData: {
        type: 1,
        amount: '',
        sum: '',
        missing: '',
        bet: '',
        id: ''
      },
      theFormRules: {
        amount: { trigger: 'blur', validator: this.integerValidator },
        sum: { trigger: 'blur', validator: this.integerValidator },
        missing: { trigger: 'blur', validator: this.integerValidator },
        bet: { trigger: 'blur', validator: this.integerValidator }
      },
      isLoading: false
    };
  },
  methods: {
    integerValidator(rule, value, callback) {
      if (value === '') {
        callback(new Error('权重系数不能为空，若当前值无用可填写0'));
      }
      //                !/(^\(-1\))|(^[0-5]$)/.test(value)
      else if (/^(([0-4]\.[0-9]*[1-9][0-9]*)|([0-4]\.[0-9]+))|(^-1)|(^-[0]*\.[0-9]*)|(^[0-5])$/.test(value)) {
        callback();
      } else {
        callback(new Error('权重系数范围在：(-1至5)为整数或浮点数；'));
      }
    },
    convertToVoucherTypeLabel,
    onTypeChange(voucherType) {
      if (this.curType === 'add') {
        // 添加
        this.backToOrigin(voucherType);
        this.$nextTick(() => {
          this.$refs['theForm'].resetFields();
        });
      }
    },
    backToOrigin(voucherType) {
      this.formData = {};
      const origData = {
        type: 1,
        name: '',
        amount: '',
        sum: '',
        missing: '',
        bet: '',
        id: ''
      };
      Object.keys(origData).forEach(value => {
        this.$set(this.formData, value, origData[value]);
      });
      if (voucherType) {
        this.$set(this.formData, 'type', voucherType);
      }

      this.$nextTick(() => {
        this.$refs['theForm'].resetFields();
      });
    },
    onOk() {
      this.$refs['theForm'].validate(valid => {
        if (valid) {
          this.isLoading = true;

          if (this.curType === 'add') {
            // 添加
            const m = this.formData.amount;
            const u = this.formData.sum;
            const d = this.formData.missing;
            const s = this.formData.bet;

            const mf = m < 1 ? '(' + m + ')' : m;
            const uf = u < 1 ? '(' + u + ')' : u;
            const df = s < 1 ? '(' + d + ')' : d;
            const sf = s < 1 ? '(' + s + ')' : s;

            const st = 'm*' + mf + '+u*' + uf + '+d*' + df + '+s*' + sf;
            const addformula = {
              gameId: 1,
              formula: st,
              m: m,
              u: u,
              d: d,
              s: s,
              formulaType: this.formulaType
            };
            addformulaInfo(addformula)
              .then(response => {
                if (response.status === 200) {
                  if (response.data.code === 200) {
                    this.$message({
                      type: 'success',
                      message: `添加公式成功!`,
                      duration: 1800
                    });
                    this.$emit('ok');
                  } else {
                    this.$message({
                      type: 'error',
                      message: `添加公式失败：${response.data.message}`,
                      duration: 1800
                    });
                  }
                } else {
                  this.$message({
                    type: 'error',
                    message: `添加公式失败 ${response.status}：${response.statusText}`,
                    duration: 1800
                  });
                }
                this.isLoading = false;
                this.formData.amount = '';
                this.formData.sum = '';
                this.formData.missing = '';
                this.formData.bet = '';
              })
              .catch(err => {
                this.isLoading = false;
                this.$message.error('添加公式失败:' + err.message);
              });
          } else {
            const m = this.formData.amount;
            const u = this.formData.sum;
            const d = this.formData.missing;
            const s = this.formData.bet;
            const st = 'm*' + m + '+u*' + u + '+d*' + d + '+s*' + s;
            const editformula = {
              gameId: 1,
              formula: st,
              m: m,
              u: u,
              d: d,
              s: s,
              id: this.formData.id
            };
            editFormulas(editformula)
              .then(response => {
                if (response.status === 200) {
                  if (response.data.code === 200) {
                    this.$message({
                      type: 'success',
                      message: `更新公式成功!`,
                      duration: 1800
                    });
                    this.$emit('ok');
                  } else {
                    this.$message({
                      type: 'error',
                      message: `更新公式失败：${response.data.message}`,
                      duration: 1800
                    });
                  }
                } else {
                  this.$message({
                    type: 'error',
                    message: `更新公式失败 ${response.status}：${response.statusText}`,
                    duration: 1800
                  });
                }
                this.isLoading = false;
              })
              .catch(err => {
                this.isLoading = false;
                this.$message.error('更新公式失败:' + err.message);
              });
            this.$emit('cancel');
          }
        } else {
          return false;
        }
      });
    },
    getInfo() {
      this.isLoading = true;
      // console.log('id获取',this.processID);
      const getformulaID = { id: this.processID };
      getformula(getformulaID)
        .then(response => {
          if (response.status === 200) {
            if (response.data.code === 200) {
              const resData = response.data.resData;

              this.formData.amount = resData.m;
              this.formData.sum = resData.u;
              this.formData.missing = resData.d;
              this.formData.bet = resData.s;
              this.formData.id = resData.id;
            } else {
              this.$message({
                type: 'error',
                message: `获取公式失败：${response.data.message}`,
                duration: 1800
              });
              this.$emit('cancel');
            }
          } else {
            this.$message({
              type: 'error',
              message: `获取公式失败 ${response.status}：${response.statusText}`,
              duration: 1800
            });
            this.$emit('cancel');
          }

          this.$nextTick(() => {
            this.isLoading = false;
          });
        })
        .catch(err => {
          this.isLoading = false;
          this.$message.error('获取公式失败:' + err.message);
          this.$emit('cancel');
        });
    },
    onInit() {
      if (this.curType === 'add') {
        // 添加
        this.isLoading = false;
        this.backToOrigin();
      } else {
        this.$refs['theForm'].resetFields();
        this.$nextTick(() => {
          this.getInfo();
        });
      }
    }
  },
  mounted() {
    if (this.curType != 'add') {
      // 编辑
      this.$nextTick(() => {
        this.getInfo();
      });
    }
  },
  created() {}
};
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
.el-card {
  background-color: white;
  box-shadow: none;
  padding: 0;

  .el-input,
  .el-select {
    width: 230px;
  }

  .btn-group {
    position: absolute;
    right: 50px;
    bottom: 52px;
    text-align: right;
    margin: 1rem 7px 0 0;
  }
}
.btn-group {
  position: absolute;
  right: 50px;
  bottom: 52px;
  text-align: right;
  margin: 1rem 7px 0 0;
}
</style>
