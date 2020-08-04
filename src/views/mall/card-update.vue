<!--添加充值卡-->
<template>
  <el-form label-width="6rem" :rules="cardRules" ref="theForm" :model="cardInfo">
    <el-form-item label="卡号" prop="cardNo">
      <el-input v-model="cardInfo.cardNo" :maxlength="30"></el-input>
    </el-form-item>
    <el-form-item label="密码" prop="cardPwd">
      <el-input v-model="cardInfo.cardPwd" :maxlength="50"></el-input>
    </el-form-item>
    <el-form-item label="面值(元)" prop="faceValue">
      <el-input v-model="cardInfo.faceValue" :maxlength="50"></el-input>
    </el-form-item>
    <el-form-item label="运营商" prop="companyName">
      <el-select v-model="cardInfo.companyName" clearable placeholder="请选择运营商">
        <el-option v-for="(item, index) in companyNameList" :key="`companyName-${index}`" :label="item.label" :value="item.value"> </el-option>
      </el-select>
    </el-form-item>
    <el-form-item label="商品" prop="productId">
      <el-select v-model="cardInfo.productId" filterable clearable placeholder="请选择或输入所关联商品名称">
        <el-option v-loading="isLoading" v-for="item in productIds" :key="item.value" :label="item.productName" :value="item.productId">
        </el-option>
      </el-select>
    </el-form-item>
    <div style="text-align:right;">
      <el-button type="primary" @click="onOk('theForm')">确定</el-button>
      <el-button type="primary" @click="onCancel">取消</el-button>
    </div>
  </el-form>
</template>

<script>
import { productInfo, addCard, checkCard, editCard } from '../../api/mall';
export default {
  props: {
    cardId: {
      type: Number
    },
    operType: {
      type: String,
      default: 'add'
    }
  },
  data() {
    const cardNoValidator = (rule, value, callback) => {
      if (value.length <= 0) {
        callback(new Error('请输入卡号'));
      } else {
        callback();
      }
    };
    const cardPwdValidator = (rule, value, callback) => {
      if (value.length <= 0) {
        callback(new Error('请输入密码'));
      } else {
        callback();
      }
    };
    const faceValueValidator = (rule, value, callback) => {
      if (value.length <= 0) {
        callback(new Error('请输入面值'));
      } else if (!/^[1-9]+[0-9]*$|^\d+\.\d+$/.test(value)) {
        callback(new Error('请输入正确的面值'));
      } else {
        callback();
      }
    };
    const companyNameValidator = (rule, value, callback) => {
      if (typeof value === 'string' && value.length <= 0) {
        callback(new Error('请选择运营商'));
      } else {
        callback();
      }
    };
    const productIdValidator = (rule, value, callback) => {
      if (typeof value === 'string' && value.length <= 0) {
        callback(new Error('请选择商品'));
      } else {
        callback();
      }
    };
    return {
      cardInfo: {
        cardNo: '',
        cardPwd: '',
        faceValue: '',
        companyName: '',
        productId: ''
      },
      cardRules: {
        cardNo: [{ required: true, trigger: 'blur', validator: cardNoValidator }],
        cardPwd: [{ required: true, trigger: 'blur', validator: cardPwdValidator }],
        faceValue: [{ required: true, trigger: 'blur', validator: faceValueValidator }],
        companyName: [{ required: true, trigger: 'change', validator: companyNameValidator }],
        productId: [{ required: true, trigger: 'change', validator: productIdValidator }]
      },
      companyNameList: [
        { label: '中国移动', value: '中国移动' },
        { label: '中国联通', value: '中国联通' },
        { label: '中国电信', value: '中国电信' }
      ],
      productIds: [],
      isLoading: true
    };
  },
  methods: {
    onCancel() {
      this.$emit('cancel');
    },
    onOk(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          const cardInfo = {
            cardNo: this.cardInfo.cardNo,
            cardPwd: this.cardInfo.cardPwd,
            companyName: this.cardInfo.companyName,
            faceValue: parseFloat(this.cardInfo.faceValue),
            productId: this.cardInfo.productId
          };
          if (this.operType === 'add') {
            // 添加充值卡
            addCard(cardInfo)
              .then(response => {
                if (response.data.code === 200) {
                  if (response.data.result) {
                    this.$message({
                      type: 'success',
                      message: `充值卡添加成功!`,
                      duration: 1800
                    });
                    this.$emit('ok');
                  } else {
                    this.$message({
                      type: 'error',
                      message: `充值卡添加失败: ${response.data.message}`,
                      duration: 2000
                    });
                  }
                } else {
                  this.$message({
                    type: 'error',
                    message: `充值卡添加失败: ${response.data.code}：${response.data.message}`,
                    duration: 2000
                  });
                }
              })
              .catch(err => {
                this.$message.error('充值卡添加失败:' + err.data.message);
              });
          } // 编辑充值卡
          else {
            cardInfo.cardId = this.cardId;
            editCard(cardInfo)
              .then(response => {
                if (response.data.code === 200) {
                  if (response.data.result) {
                    this.$message({
                      type: 'success',
                      message: `充值卡修改成功!`,
                      duration: 1800
                    });
                    this.$emit('ok');
                  } else {
                    this.$message({
                      type: 'error',
                      message: `充值卡修改失败: ${response.data.message}`,
                      duration: 2000
                    });
                  }
                } else {
                  this.$message({
                    type: 'error',
                    message: `充值卡修改失败: ${response.data.code}：${response.data.message}`,
                    duration: 2000
                  });
                }
              })
              .catch(err => {
                this.$message.error('充值卡修改失败:' + err.data.message);
              });
          }
          /* if(this.cardInfo.exName == null && this.cardInfo.exExpressNo == null)//添加
                        {*/
          //                            addExpress(cardInfo).then(response=>{

          /* }
                        else//修改
                        {*/
          //                            cardInfo.id = this.cardInfo.id;
          //                            updateExpress(cardInfo).then(response=>{
          /*  updateExpress(cardInfo).then(response=>{
                                if (response.data.code === 200) {
                                    if(response.data.result)
                                    {
                                        this.$message({
                                            type: 'success',
                                            message: `更新配送信息成功!`,
                                            duration: 1800
                                        });
                                        this.$emit('ok', cardInfo);
                                    }
                                    else
                                    {
                                        this.$message({
                                            type: 'error',
                                            message: `更新配送信息失败：${response.data.message}`,
                                            duration: 1800
                                        });
                                    }
                                }
                                else {
                                    this.$message({
                                        type: 'error',
                                        message: `更新配送信息失败 ${response.data.code}：${response.data.message}`,
                                        duration: 1800
                                    });
                                }
                            }).catch(err=>{
                                this.$message.error("更新配送信息失败:" + err.message);
                            });*/
          /*     }*/
        } else {
          return false;
        }
      });
    },
    onInit() {
      this.$nextTick(() => {
        if (this.operType === 'add') {
          this.$refs['theForm'].resetFields();
        } else {
          this.$refs['theForm'].resetFields();
          this.getCardInfo();
        }
        this.getVirtualProductList();
      });
    },
    getVirtualProductList() {
      this.isLoading = true;
      productInfo()
        .then(response => {
          if (response.data.code === 200) {
            response.data.resData.forEach((value, index, array) => {
              this.$set(this.productIds, index, value);
            });
          } else {
            this.$message({
              type: 'error',
              message: `获取虚拟商品列表失败： ${response.data.code}：${response.data.message}`,
              duration: 1800
            });
          }
          this.isLoading = false;
        })
        .catch(err => {
          this.isLoading = false;
          this.$message.error('获取金币商城中虚拟商品信息失败:' + err.message);
        });
    },
    getCardInfo() {
      this.isLoading = true;
      const cardInfo = {};
      cardInfo.cardId = this.cardId;
      checkCard(cardInfo)
        .then(response => {
          if (response.data.code === 200) {
            const resData = response.data.resData;

            this.cardInfo.cardNo = resData.cardNo;
            this.cardInfo.cardPwd = resData.cardPwd;
            this.cardInfo.faceValue = resData.faceValue;
            this.cardInfo.companyName = resData.companyName;
            this.cardInfo.productId = resData.productId;
          } else {
            this.$message({
              type: 'error',
              message: `获取充值卡信息失败： ${response.data.code}：${response.data.message}`,
              duration: 1800
            });
          }
          this.isLoading = false;
        })
        .catch(err => {
          this.isLoading = false;
          this.$message.error('获取充值卡信息失败:' + err.message);
        });
    }
  },
  mounted() {
    this.onInit();
  },
  created() {}
};
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
.el-input {
  width: 250px;
}
.el-select {
  width: 250px;
}
</style>
