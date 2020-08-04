<template>
  <el-form label-width="6rem" :rules="formRules" ref="passwordReset" :model="formData">
    <el-form-item label="当前用户">
      <el-input :disabled="true" :value="formData.name"></el-input>
    </el-form-item>
    <el-form-item label="输入新密码" prop="password">
      <el-input type="password" v-model="formData.password"></el-input>
    </el-form-item>
    <el-form-item label="确认新密码" prop="password2">
      <el-input type="password" v-model="formData.password2"></el-input>
    </el-form-item>

    <div style="text-align:right;">
      <el-button type="primary" @click="onSubmit('passwordReset')">确定</el-button>
      <el-button type="primary" @click="onCancel">取消</el-button>
    </div>
  </el-form>
</template>

<script type="text/ecmascript-6">
import {modifyAdmin} from 'api/authority';
export default{
    props:{
        preDataFromProp:{
            type: Object,
            default: function(){
                return {};
            }
        }
    },
    data(){
        const passwordValidator = (rule, value, callback) => {
            if (value.length < 6) {
                callback(new Error('密码不能小于6位'));
            }
            else {
                callback();
            }
        };
        return {
            formData: {
                id: -1,
                name: '',
                password: '',
                password2: ''
            },
            formRules: {
                password: [
                    { required: true, trigger: 'blur', validator: passwordValidator }
                ],
                password2: [
                    { required: true, trigger: 'blur', validator: this.password2Validator }
                ]
            }
        }
    },
    methods:{
        password2Validator (rule, value, callback){
            if (value.length < 6) {
                callback(new Error('密码不能小于6位'));
            }
            else if (this.formData.password.length>=6) {
                if(this.formData.password!=value)
                {
                    callback(new Error('两次输入密码不一致'));
                }
                else
                {
                    callback();
                }
            }
            else {
                callback();
            }
        },
        onSubmit(formName){
            this.$refs[formName].validate((valid)=>{
                if (valid)
                {
                    const adminInfo ={id: this.formData.id, password: md5(this.formData.password)};
                    modifyAdmin(adminInfo).then(response=>{
                        if(response.status===200)
                        {
                            if(response.data.result)
                            {
                                this.$message({
                                    type: 'success',
                                    message: `密码重置成功!`,
                                    duration: 1800
                                });
                                this.$emit('complete');
                            }
                            else
                            {
                                this.$message({
                                    type: 'error',
                                    message: `密码重置失败：${response.data.message}`,
                                    duration: 1800
                                });
                            }
                        }
                        else
                        {
                            this.$message({
                                type: 'error',
                                message: `${response.status}：${response.statusText}`,
                                duration: 1800
                            });
                        }
                    }).catch(err=>{
                        this.$message.error(err);
                    });
                }
                else
                {
                    return false;
                }
            });
        },
        onCancel(){
            this.$emit('cancel');
        }
    },
    mounted(){
        this.formData.id = this.preDataFromProp.id;
        this.formData.name = this.preDataFromProp.name;
    }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped></style>
