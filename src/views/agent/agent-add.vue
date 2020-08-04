<template>
  <el-card class="el-card-in-dlg">
    <el-form label-width="6rem" :model="formData" :rules="theFormRules" ref="theForm">
      <el-form-item label="用户ID" prop="userID">
        <el-input v-model="formData.userID"></el-input>
      </el-form-item>
      <el-form-item label="代理等级">
        <el-select v-model="formData.agentLevel">
          <el-option v-for="item in agentGradeList" :key="item.value" :label="item.label" :value="item.value"> </el-option>
        </el-select>
      </el-form-item>
    </el-form>

    <div class="btn-group">
      <el-button type="primary" @click="onOk">保存</el-button>
      <el-button type="primary" @click="$emit('cancel')">取消</el-button>
    </div>
  </el-card>
</template>

<script type="text/ecmascript-6">
import {agentGradeList} from '../../utils/agentCommon';
import {validatorID} from '../../utils/validate';
import {addAgent} from '../../api/agent';
export default{
    data(){
        return{
            formData: {
                userID: '',
                agentLevel: 1
            },
            theFormRules: {
                userID: [
                    { trigger: 'blur', validator: this.idValidator}
                ]
            },
            agentGradeList: agentGradeList
        };
    },
    methods:{
        idValidator(rule, value, callback){
            if(!value||value.length<=0)
            {
                callback(new Error('ID不可以为空'));
            }
            else
            {
                return validatorID(rule, value, callback);
            }
        },
        onOk(){
            this.$refs['theForm'].validate((valid) => {
                if(valid)
                {
                    const agentInfo = {userId: this.formData.userID, proxyLevel: this.formData.agentLevel};
                    addAgent(agentInfo).then(response=> {
                        if (response.status === 200) {
                            if (response.data.result) {
                                this.$message({
                                    type: 'success',
                                    message: `添加代理成功!`,
                                    duration: 1800
                                });
                                this.$emit('ok');
                            }
                            else {
                                this.$message({
                                    type: 'error',
                                    message: `添加代理失败：${response.data.message}`,
                                    duration: 1800
                                });
                            }
                        }
                        else {
                            this.$message({
                                type: 'error',
                                message: `添加代理失败 ${response.status}：${response.statusText}`,
                                duration: 1800
                            });
                        }
                    }).catch(err=> {
                        this.$message.error("添加代理失败:" + err.message);
                    });
                }
                else
                {
                    return false;
                }
            });
        },
        onInit(){
            this.$refs['theForm'].resetFields();
            this.formData = {
                userID: '',
                agentLevel: 1
            };
        }
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
}
</style>
