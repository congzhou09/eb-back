<!--概率序列-->
<template>
  <el-form label-width="6rem" :rules="probabilityRules" ref="theForm" :model="probabilityInfo">
    <el-form-item label="序列名称" prop="name">
      <el-input v-model="probabilityInfo.name" :maxlength="30"></el-input>
    </el-form-item>
    <el-form-item label="序列详情" prop="probabilityList">
      <el-input v-model="probabilityInfo.probabilityList"></el-input>
    </el-form-item>

    <div style="text-align:right;">
      <el-button type="primary" @click="onOk('theForm')">确定</el-button>
      <el-button type="primary" @click="onCancel">取消</el-button>
    </div>
  </el-form>
</template>

<script type="text/ecmascript-6">
    export default{
        props: {
            index: {
              type: Number,
              default: 0
            },
            gameUserInfo: {},
            operType: {
                type: String,
                default: 'add'
            }
        },
//        props:["name","probabilityList"],
        data() {
            const nameValidator = (rule, value, callback) => {
                if(value.length<=0)
                {
                    callback(new Error('请输入序列名称'));
                }
                else
                {
                    callback();
                }
            }
            const probabilityListValidator = (rule, value, callback) => {
                if(value.length<=0){
                    callback(new Error('请输入序列详情'));
                }else if(!value.match(/^(([0-9]|(1[0])){1},)*([0-9]|(1[0])){1}$/)){
                    callback(new Error('序列详情填写格式为0-10的整数，多个数字用英文逗号隔开（如：1,2,3,4）'));
                }else{
                    callback();
                }
            }
            return{
                probabilityInfo: {
                    name: '',
                    probabilityList: '',
                    isCurrent: true,
                    onIndex: 0
                },
                probabilityRules: {
                    name: [{required: true, trigger: 'blur', validator: nameValidator}],
                    probabilityList: [{required: true, trigger: 'blur', validator: probabilityListValidator}],
                },
            }
        },
        methods:{
            onCancel(){
                this.$emit('cancel');
            },
            onOk(formName){
                this.$refs[formName].validate((valid) => {
                    if (valid){
                        if(this.operType==='add')
                        {
                            this.$emit('selectMallComplete', this.probabilityInfo);
                        }
                        else// 编辑
                        {
                            this.probabilityInfo.onIndex = this.index;
                            this.$emit('probabComplete', this.probabilityInfo);
                        }
                    }else{
                        return false;
                    }
                })
            },
            initData(){
                this.selectedMallList.length = 0;
                this.$delete(this.selectedMallList, 0);
                this.lastSelectedItems.forEach((value,index,array)=>{
                    this.$set(this.selectedMallList, index, value);
                });
                if(this.$refs.mallSelectComp)
                {
                    this.$refs.mallSelectComp.initData();
                }
            },
            onInit(){
                this.$nextTick(()=>{
                    if(this.operType==='add')
                    {
                        this.$refs['theForm'].resetFields();
                        this.$set(this.probabilityInfo, "name", "");
                        this.$set(this.probabilityInfo, "probabilityList", "");
                    }
                    else
                    {
                        this.$refs['theForm'].resetFields();
                        this.probabilityInfo.name = this.gameUserInfo.listName;
                        this.probabilityInfo.probabilityList = this.gameUserInfo.listInfo;
                    }
                });
            }
        },
        mounted() {
            this.onInit();
        }

    }
</script>

<style></style>
