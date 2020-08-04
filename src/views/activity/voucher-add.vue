<template>
  <el-card class="el-card-in-dlg" v-loading="isLoading">
    <el-form label-width="6rem" :model="formData" :rules="theFormRules" ref="theForm">
      <el-col :span="12">
        <el-form-item label="优惠券类型" required>
          <el-select v-if="curType === 'add'" v-model="formData.type" @change="onTypeChange">
            <el-option v-for="item in voucherTypeList" :key="item.value" :label="item.label" :value="item.value"> </el-option>
          </el-select>
          <span v-else style="margin-left: 10px;">{{ convertToVoucherTypeLabel(formData.type) }}</span>
        </el-form-item>
        <el-form-item label="优惠券名称" key="name" prop="name" required>
          <el-input v-model="formData.name" :maxlength="20"></el-input>
        </el-form-item>
        <el-form-item v-if="formData.type == 3" label="发放总数量" key="amount" prop="amount" required>
          <el-input v-model="formData.amount" placeholder="请输入张数" :maxlength="20">
            <template slot="append">张</template>
          </el-input>
        </el-form-item>
        <el-form-item v-if="formData.type === 3" label="每人限领" key="limitCountDraw" prop="limitCountDraw" required>
          <el-input v-model="formData.limitCountDraw" placeholder="请输入张数" :maxlength="5">
            <template slot="append">张</template>
          </el-input>
        </el-form-item>
        <el-form-item
          v-if="formData.type === 1 || formData.type == 2 || formData.type === 4"
          label="每人发放数"
          key="limitCountEmit"
          prop="limitCountEmit"
          required
        >
          <el-input v-model="formData.limitCountEmit" placeholder="请输入张数" :maxlength="10">
            <template slot="append">张</template>
          </el-input>
        </el-form-item>
        <el-form-item label="面值" key="faceValue" prop="faceValue" required>
          <el-input v-model="formData.faceValue" placeholder="请输入金额数" :maxlength="20">
            <template slot="append">元</template>
          </el-input>
        </el-form-item>
        <el-form-item
          v-if="formData.type === 1 || formData.type === 2 || formData.type === 4 || formData.type === 5"
          label="有效期"
          key="dueTime"
          prop="dueTime"
          required
        >
          <el-input v-model="formData.dueTime" placeholder="请输入天数" :maxlength="20">
            <template slot="append">天</template>
          </el-input>
        </el-form-item>
        <el-form-item v-if="formData.type === 1 || formData.type === 3" label="生效期" prop="execTime" required>
          <el-date-picker v-model="formData.execTime" type="daterange" :editable="false" placeholder="选择日期范围"> </el-date-picker>
        </el-form-item>

        <el-form-item v-if="formData.type === 4" label="发放对象" key="senderTarget" prop="senderTarget" required>
          <el-radio class="radio" v-model="formData.senderTarget" :label="1">绑定用户</el-radio>
          <el-radio class="radio" v-model="formData.senderTarget" :label="2">绑定代理</el-radio>
        </el-form-item>
      </el-col>

      <el-col :span="12">
        <el-form-item label="使用门槛" prop="preCondition" required>
          <el-radio-group v-model="formData.preCondition" @change="onPreConditionChange">
            <el-radio :label="1">无限制</el-radio>
            <el-radio :label="2">满额使用</el-radio>
          </el-radio-group>
        </el-form-item>

        <el-form-item key="preConditionValue" prop="preConditionValue">
          <el-input v-model="formData.preConditionValue" :disabled="formData.preCondition != 2">
            <template slot="prepend">满</template>
            <template slot="append">元可使用</template>
          </el-input>
        </el-form-item>

        <el-form-item label="可用范围" prop="execScope" required>
          <el-radio class="radio" v-model="formData.execScope" :label="1">全部商品</el-radio>
          <el-radio class="radio" v-model="formData.execScope" :label="2">商城商品</el-radio>
          <el-radio class="radio" v-model="formData.execScope" :label="3">促销商品</el-radio>
        </el-form-item>
      </el-col>
    </el-form>
    <div class="btn-group">
      <el-button type="primary" @click="onOk">保存</el-button>
      <el-button type="primary" @click="$emit('cancel')">取消</el-button>
    </div>
  </el-card>
</template>

<script type="text/ecmascript-6">
import {voucherTypeList, convertToVoucherTypeLabel, convertToTimeString} from "../../utils/appCommon";
import {addVoucher, editVoucher, getVoucherDetail} from "../../api/activity";
export default{
    props: {
        curType:{
            type: String,
            default: "add"
        },
        processID:{
            type: Number
        }
    },
    data(){
        function nameValidator(rule, value, callback){
            if(!value||value.length<=0)
            {
                callback(new Error('不可以为空'));
            }
            else
            {
                callback();
            }
        }
        function integerValidator(rule, value, callback) {
            value += '';
            if(!value||value.length<=0)
            {
                callback(new Error('不可以为空'));
            }
            else if(!value.match(/^[1-9]+[0-9]*$/))
            {
                callback(new Error('请填写大于0的整数'));
            }
            else
            {
                callback();
            }
        }
        return{
            voucherTypeList: voucherTypeList,
            formData: {
                type: 1,
                name: '',
                amount: '',
                limitCountDraw: '',
                limitCountEmit: '',
                faceValue: '',
                preCondition: 1,
                preConditionValue: '',
                dueTime: '',
                execTime: [],
                senderTarget: 1,
                execScope: 1
            },
            theFormRules: {
                name: { trigger: 'blur', validator: nameValidator},
                amount: { trigger: 'blur', validator: integerValidator},
                limitCountDraw: { trigger: 'blur', validator: integerValidator},
                limitCountEmit: { trigger: 'blur', validator: integerValidator},
                faceValue: { trigger: 'blur', validator: this.numberValidator},
                dueTime: { trigger: 'blur', validator: integerValidator},
                preConditionValue: {trigger:'blur', validator: this.preConditionValueValidator},
                execTime: { trigger: 'blur', validator: nameValidator}
            },
            isLoading: false
        };
    },
    methods:{
        convertToVoucherTypeLabel,
        onPreConditionChange(newValue){
            if(newValue===1)
            {
                this.$refs['theForm'].validateField('preConditionValue');
            }
        },
        numberValidator(rule, value, callback) {
            value += '';
            if(!value||value.length<=0)
            {
                callback(new Error('不可以为空'));
            }
            else if(!value.match(/^[1-9]+[0-9]*$|^\d+\.\d+$/))
            {
                callback(new Error('请填写大于0的整数或小数'));
            }
            else
            {
                callback();
            }
        },
        preConditionValueValidator(rule, value, callback){
            if(this.formData.preCondition===1)
            {
                callback();
            }
            else
            {
                return this.numberValidator(rule, value, callback);
            }
        },
        onTypeChange(voucherType){
            if(this.curType==="add")// 添加
            {
                this.backToOrigin(voucherType);
                this.$nextTick(()=>{
                    this.$refs['theForm'].resetFields();
                });
            }
        },
        backToOrigin(voucherType){
            this.formData = {};
            const origData = {
                type: 1,
                name: '',
                amount: '',
                limitCountDraw: '',
                limitCountEmit: '',
                faceValue: '',
                preCondition: 1,
                preConditionValue: '',
                dueTime: '',
                execTime: [],
                senderTarget: 1,
                execScope: 1
            };
            Object.keys(origData).forEach((value)=>{
                this.$set(this.formData, value, origData[value]);
            });
            if(voucherType)
            {
                this.$set(this.formData, 'type', voucherType);
            }

            this.$nextTick(()=>{
                this.$refs['theForm'].resetFields();
            });
        },
        onOk(){
            this.$refs['theForm'].validate((valid) => {
                if(valid)
                {
                    this.isLoading = true;

                    if(this.curType==="add")// 添加
                    {
                        const voucherInfo = {
                            type: this.formData.type,
                            name: this.formData.name,
                            scope: this.formData.execScope
                        }
                        switch(this.formData.type)
                        {
                            case(1):
                            {
                                voucherInfo.singleReleaseNum = this.formData.limitCountEmit;
                                voucherInfo.faceValue = this.formData.faceValue;
                                voucherInfo.payLimit = (this.formData.preCondition===1)?0:(this.formData.preConditionValue);
                                voucherInfo.term = this.formData.dueTime;
                                voucherInfo.termStart = (this.formData.execTime&& this.formData.execTime.length > 0&& this.formData.execTime[0]!=null)?(convertToTimeString(this.formData.execTime[0]).slice(0,10)):("");
                                voucherInfo.termEnd = (this.formData.execTime&& this.formData.execTime.length > 0&& this.formData.execTime[1]!=null)?(convertToTimeString(this.formData.execTime[1]).slice(0,10)):("");
                                break;
                            }
                            case(2):
                            {
                                voucherInfo.singleReleaseNum = this.formData.limitCountEmit;
                                voucherInfo.faceValue = this.formData.faceValue;
                                voucherInfo.payLimit = (this.formData.preCondition===1)?0:(this.formData.preConditionValue);
                                voucherInfo.term = this.formData.dueTime;
                                break;
                            }
                            case(3):
                            {
                                voucherInfo.releaseNumLimit = this.formData.amount;
                                voucherInfo.singleReleaseNum = this.formData.limitCountDraw;
                                voucherInfo.faceValue = this.formData.faceValue;
                                voucherInfo.payLimit = (this.formData.preCondition===1)?0:(this.formData.preConditionValue);
                                voucherInfo.termStart = (this.formData.execTime&& this.formData.execTime.length > 0&& this.formData.execTime[0]!=null)?(convertToTimeString(this.formData.execTime[0]).slice(0,10)):("");
                                voucherInfo.termEnd = (this.formData.execTime&& this.formData.execTime.length > 0&& this.formData.execTime[1]!=null)?(convertToTimeString(this.formData.execTime[1]).slice(0,10)):("");
                                break;
                            }
                            case(4):
                            {
                                voucherInfo.singleReleaseNum = this.formData.limitCountEmit;
                                voucherInfo.faceValue = this.formData.faceValue;
                                voucherInfo.payLimit = (this.formData.preCondition===1)?0:(this.formData.preConditionValue);
                                voucherInfo.term = this.formData.dueTime;
                                voucherInfo.sendUserType = this.formData.senderTarget;
                                break;
                            }
                            case(5):
                            {
                                voucherInfo.faceValue = this.formData.faceValue;
                                voucherInfo.payLimit = (this.formData.preCondition===1)?0:(this.formData.preConditionValue);
                                voucherInfo.term = this.formData.dueTime;
                                break;
                            }
                            default:
                                break;
                        }

                        addVoucher(voucherInfo).then(response=> {
                            if (response.status === 200) {
                                if (response.data.result) {
                                    this.$message({
                                        type: 'success',
                                        message: `添加优惠券成功!`,
                                        duration: 1800
                                    });
                                    this.$emit('ok');
                                }
                                else {
                                    this.$message({
                                        type: 'error',
                                        message: `添加优惠券失败：${response.data.message}`,
                                        duration: 1800
                                    });
                                }
                            }
                            else {
                                this.$message({
                                    type: 'error',
                                    message: `添加优惠券失败 ${response.status}：${response.statusText}`,
                                    duration: 1800
                                });
                            }
                            this.isLoading = false;
                        }).catch(err=> {
                            this.isLoading = false;
                            this.$message.error("添加优惠券失败:" + err.message);
                        });
                    }
                    else
                    {
                        const voucherInfo = {
                            couponId: this.processID,
                            type: this.formData.type,
                            name: this.formData.name,
                            scope: this.formData.execScope
                        }
                        switch(this.formData.type)
                        {
                            case(1):
                            {
                                voucherInfo.singleReleaseNum = this.formData.limitCountEmit;
                                voucherInfo.faceValue = this.formData.faceValue;
                                voucherInfo.payLimit = (this.formData.preCondition===1)?0:(this.formData.preConditionValue);
                                voucherInfo.term = this.formData.dueTime;
                                voucherInfo.termStart = (this.formData.execTime&& this.formData.execTime.length > 0&& this.formData.execTime[0]!=null)?(convertToTimeString(this.formData.execTime[0]).slice(0,10)):("");
                                voucherInfo.termEnd = (this.formData.execTime&& this.formData.execTime.length > 0&& this.formData.execTime[1]!=null)?(convertToTimeString(this.formData.execTime[1]).slice(0,10)):("");
                                break;
                            }
                            case(2):
                            {
                                voucherInfo.singleReleaseNum = this.formData.limitCountEmit;
                                voucherInfo.faceValue = this.formData.faceValue;
                                voucherInfo.payLimit = (this.formData.preCondition===1)?0:(this.formData.preConditionValue);
                                voucherInfo.term = this.formData.dueTime;
                                break;
                            }
                            case(3):
                            {
                                voucherInfo.releaseNumLimit = this.formData.amount;
                                voucherInfo.singleReleaseNum = this.formData.limitCountDraw;
                                voucherInfo.faceValue = this.formData.faceValue;
                                voucherInfo.payLimit = (this.formData.preCondition===1)?0:(this.formData.preConditionValue);
                                voucherInfo.termStart = (this.formData.execTime&& this.formData.execTime.length > 0&& this.formData.execTime[0]!=null)?(convertToTimeString(this.formData.execTime[0]).slice(0,10)):("");
                                voucherInfo.termEnd = (this.formData.execTime&& this.formData.execTime.length > 0&& this.formData.execTime[1]!=null)?(convertToTimeString(this.formData.execTime[1]).slice(0,10)):("");
                                break;
                            }
                            case(4):
                            {
                                voucherInfo.singleReleaseNum = this.formData.limitCountEmit;
                                voucherInfo.faceValue = this.formData.faceValue;
                                voucherInfo.payLimit = (this.formData.preCondition===1)?0:(this.formData.preConditionValue);
                                voucherInfo.term = this.formData.dueTime;
                                voucherInfo.sendUserType = this.formData.senderTarget;
                                break;
                            }
                            case(5):
                            {
                                voucherInfo.faceValue = this.formData.faceValue;
                                voucherInfo.payLimit = (this.formData.preCondition===1)?0:(this.formData.preConditionValue);
                                voucherInfo.term = this.formData.dueTime;
                                break;
                            }
                            default:
                                break;
                        }

                        editVoucher(voucherInfo).then(response=> {
                            if (response.status === 200) {
                                if (response.data.result) {
                                    this.$message({
                                        type: 'success',
                                        message: `更新优惠券成功!`,
                                        duration: 1800
                                    });
                                    this.$emit('ok');
                                }
                                else {
                                    this.$message({
                                        type: 'error',
                                        message: `更新优惠券失败：${response.data.message}`,
                                        duration: 1800
                                    });
                                }
                            }
                            else {
                                this.$message({
                                    type: 'error',
                                    message: `更新优惠券失败 ${response.status}：${response.statusText}`,
                                    duration: 1800
                                });
                            }
                            this.isLoading = false;
                        }).catch(err=> {
                            this.isLoading = false;
                            this.$message.error("更新优惠券失败:" + err.message);
                        });
                    }
                }
                else
                {
                    return false;
                }
            });
        },
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
                        switch (this.formData.type) {
                            case(1): {
                                this.formData.limitCountEmit = resData.singleReleaseNum;
                                this.formData.faceValue = resData.faceValue;
                                if (resData.payLimit && resData.payLimit > 0) {
                                    this.formData.preCondition = 2;
                                }
                                else {
                                    this.formData.preCondition = 1;
                                }
                                this.formData.preConditionValue = resData.payLimit;
                                this.formData.dueTime = resData.term;
                                this.formData.execTime.length = 0;
                                this.formData.execTime.push(resData.termStart);
                                this.formData.execTime.push(resData.termEnd);
                                break;
                            }
                            case(2): {
                                this.formData.limitCountEmit = resData.singleReleaseNum;
                                this.formData.faceValue = resData.faceValue;
                                if (resData.payLimit && resData.payLimit > 0) {
                                    this.formData.preCondition = 2;
                                }
                                else {
                                    this.formData.preCondition = 1;
                                }
                                this.formData.preConditionValue = resData.payLimit;
                                this.formData.dueTime = resData.term;
                                break;
                            }
                            case(3): {
                                this.formData.amount = resData.releaseNumLimit;
                                this.formData.limitCountDraw = resData.singleReleaseNum;
                                this.formData.faceValue = resData.faceValue;
                                if (resData.payLimit && resData.payLimit > 0) {
                                    this.formData.preCondition = 2;
                                }
                                else {
                                    this.formData.preCondition = 1;
                                }
                                this.formData.preConditionValue = resData.payLimit;
                                this.formData.execTime.length = 0;
                                this.formData.execTime.push(resData.termStart);
                                this.formData.execTime.push(resData.termEnd);
                                break;
                            }
                            case(4): {
                                this.formData.limitCountEmit = resData.singleReleaseNum;
                                this.formData.faceValue = resData.faceValue;
                                if (resData.payLimit && resData.payLimit > 0) {
                                    this.formData.preCondition = 2;
                                }
                                else {
                                    this.formData.preCondition = 1;
                                }
                                this.formData.preConditionValue = resData.payLimit;
                                this.formData.dueTime = resData.term;
                                this.formData.senderTarget = resData.sendUserType;
                                break;
                            }
                            case(5): {
                                this.formData.faceValue = resData.faceValue;
                                if (resData.payLimit && resData.payLimit > 0) {
                                    this.formData.preCondition = 2;
                                }
                                else {
                                    this.formData.preCondition = 1;
                                }
                                this.formData.preConditionValue = resData.payLimit;
                                this.formData.dueTime = resData.term;
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
                        this.$emit("cancel");
                    }
                }
                else {
                    this.$message({
                        type: 'error',
                        message: `获取优惠券详情失败 ${response.status}：${response.statusText}`,
                        duration: 1800
                    });
                    this.$emit("cancel");
                }

                this.$nextTick(()=>{
                    this.isLoading = false;
                });
            }).catch(err=> {
                this.isLoading = false;
                this.$message.error("获取优惠券详情失败:" + err.message);
                this.$emit("cancel");
            });
        },
        onInit(){
            if(this.curType==="add")// 添加
            {
                this.isLoading = false;
                this.backToOrigin();
            }
            else
            {
                this.$refs['theForm'].resetFields();
                this.$nextTick(()=>{
                    this.getInfo();
                });
            }
        }
    },
    mounted(){
        if(this.curType!="add")// 编辑
        {
            this.$nextTick(()=>{
                this.getInfo();
            });
        }
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
    position: absolute;
    right: 50px;
    bottom: 52px;
    text-align: right;
    margin: 1rem 7px 0 0;
  }
}
</style>
