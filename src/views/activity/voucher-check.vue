<template>
  <el-card class="el-card-in-dlg" v-loading="isLoading">
    <ul class="user-info">
      <li><label class="title-label">优惠券类型：</label>{{ convertToVoucherTypeLabel(formData.type) }}</li>
      <li><label class="title-label">优惠券名称：</label>{{ formData.name }}</li>
      <li v-if="formData.type == 3"><label class="title-label">发放总数量：</label>{{ formData.amount }}张</li>
      <li v-if="formData.type === 3"><label class="title-label">每人限领：</label>{{ formData.limitCountDraw }}张</li>
      <li v-if="formData.type === 1 || formData.type == 2 || formData.type === 4">
        <label class="title-label">每人发放数：</label>{{ formData.limitCountEmit }}张
      </li>
      <li><label class="title-label">面值：</label>{{ convertToMoneyAmount(formData.faceValue) }}元</li>
      <li>
        <label class="title-label">使用门槛：</label
        >{{ formData.preConditionValue > 0 ? `满${formData.preConditionValue}元可用` : `无限制` }}
      </li>
      <li v-if="formData.type === 1 || formData.type === 2 || formData.type === 4 || formData.type === 5">
        <label class="title-label">有效期：</label>{{ formData.dueTime }}天
      </li>
      <li v-if="formData.type === 1 || formData.type === 3">
        <label class="title-label">生效期：</label>
        <span
          class="content-span"
          v-if="formData.execTime[0] && formData.execTime[0].length > 0 && formData.execTime[1] && formData.execTime[1].length > 0"
        >
          {{ `${formData.execTime[0].slice(0, 11)} ~ ${formData.execTime[1].slice(0, 11)}` }}
        </span>
        <span class="content-span" v-else>无数据</span>
      </li>
      <li v-if="formData.type === 4">
        <label class="title-label">发放对象：</label>{{ formData.senderTarget === 1 ? '绑定用户' : '绑定代理' }}
      </li>
      <li><label class="title-label">可用范围：</label>{{ convertToVoucherScopeLabel(formData.execScope) }}</li>
    </ul>

    <div class="btn-group">
      <el-button type="primary" @click="$emit('cancel')">关闭</el-button>
    </div>
  </el-card>
</template>

<script type="text/ecmascript-6">
import {convertToVoucherTypeLabel, convertToVoucherScopeLabel, convertToMoneyAmount} from '../../utils/appCommon';
import {getVoucherDetail} from '../../api/activity';
export default{
    props:["processID"],
    data(){
        return{
            formData: {
                type: 1,
                name: '',
                amount: '',
                limitCountDraw: '',
                limitCountEmit: '',
                faceValue: '',
                preConditionValue: '',
                dueTime: '',
                execTime: [],
                senderTarget: 1,
                execScope: 1
            },
            isLoading: true
        };
    },
    methods:{
        convertToVoucherTypeLabel,
        convertToVoucherScopeLabel,
        convertToMoneyAmount,
        getInfo(){
            this.isLoading = true;
            const voucherInfo = {couponId: this.processID};
            getVoucherDetail(voucherInfo).then(response=> {
                if (response.status === 200) {
                    if (response.data.result) {
                        const resData = response.data.resData;
                        this.formData.type = resData.type;
                        this.formData.name = resData.name;
                        this.formData.execScope = resData.scope;
                        switch(this.formData.type)
                        {
                            case(1):
                            {
                                this.formData.limitCountEmit = resData.singleReleaseNum;
                                this.formData.faceValue = resData.faceValue;
                                this.formData.preConditionValue = resData.payLimit;
                                this.formData.dueTime = resData.term;
                                this.formData.execTime[0] = resData.termStart;
                                this.formData.execTime[1] = resData.termEnd;
                                break;
                            }
                            case(2):
                            {
                                this.formData.limitCountEmit = resData.singleReleaseNum;
                                this.formData.faceValue = resData.faceValue;
                                this.formData.preConditionValue = resData.payLimit;
                                this.formData.dueTime = resData.term;
                                break;
                            }
                            case(3):
                            {
                                this.formData.amount = resData.releaseNumLimit;
                                this.formData.limitCountDraw = resData.singleReleaseNum;
                                this.formData.faceValue = resData.faceValue;
                                this.formData.preConditionValue = resData.payLimit;
                                this.formData.execTime[0] = resData.termStart;
                                this.formData.execTime[1] = resData.termEnd;
                                break;
                            }
                            case(4):
                            {
                                this.formData.limitCountEmit = resData.singleReleaseNum;
                                this.formData.faceValue = resData.faceValue;
                                this.formData.preConditionValue = resData.payLimit;
                                this.formData.dueTime = resData.term;
                                this.formData.senderTarget = resData.sendUserType;
                                break;
                            }
                            case(5):
                            {
                                this.formData.faceValue = resData.faceValue;
                                this.formData.preConditionValue = resData.payLimit;
                                this.formData.dueTime = resData.term;
                                break;
                            }
                            default:
                                break;
                        }
                    }
                    else {
                        this.$message({
                            type: 'error',
                            message: `获取优惠券详情失败：${response.data.message}`,
                            duration: 1800
                        });
                    }
                }
                else {
                    this.$message({
                        type: 'error',
                        message: `获取优惠券详情失败 ${response.status}：${response.statusText}`,
                        duration: 1800
                    });
                }

                this.$nextTick(()=>{
                    this.isLoading = false;
                });
            }).catch(err=> {
                this.isLoading = false;
                this.$message.error("获取优惠券详情失败:" + err.message);
            });
        },
        onInit(){
            this.$nextTick(()=>{this.getInfo();});
        }
    },
    mounted(){
        this.getInfo();
    }
}
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
    position: relative;
    text-align: right;
    margin: 1rem 7px 0 0;
  }
}
.user-info {
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
    .text-value {
      margin-right: 15px;
    }
    .content-span {
      margin-left: -4px;
    }
  }
}
</style>
