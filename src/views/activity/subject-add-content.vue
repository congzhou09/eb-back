<template>
  <el-card>
    <el-form label-width="5rem" :rules="formRules" ref="bannerForm" :model="formData">
      <el-form-item label="名称" prop="name">
        <el-input v-model="formData.name"></el-input>
      </el-form-item>
      <div>
        <el-form-item label="商品列表" prop="wareList">
          <el-input v-model="wareList" v-show="false"></el-input>
          <el-button type="primary" @click="onAddWare()">添加商品</el-button>
        </el-form-item>

        <el-table id="subject-ware-table" :data="tableData" border style="width: 100%">
          <el-table-column align="center" prop="wareNumber" label="货号" width="120"> </el-table-column>
          <el-table-column align="center" label="名称" width="130">
            <template slot-scope="scope">
              <template v-if="scope.row.state === 'invalid'">
                <del>{{ scope.row.wareName }}</del>
              </template>
              <template v-else>
                {{ scope.row.wareName }}
              </template>
            </template>
          </el-table-column>
          <el-table-column align="center" prop="category" label="所属分类" width="180"> </el-table-column>
          <el-table-column align="center" label="价格(元)">
            <template slot-scope="scope">
              {{ convertToMoneyAmount(scope.row.price) }}
            </template>
          </el-table-column>
          <el-table-column align="center" label="状态">
            <template slot-scope="scope">
              {{ convertToWareStateLabel(scope.row.state) }}
            </template>
          </el-table-column>

          <el-table-column align="center" label="操作">
            <template slot-scope="scope">
              <template>
                <el-button type="text" size="small" @click="onRemove(scope)">移除</el-button>
              </template>
            </template>
          </el-table-column>
        </el-table>
      </div>

      <el-form-item style="float:right;">
        <el-button type="primary" @click="onSubmit('bannerForm')">确定</el-button>
        <el-button type="primary" @click="onCancel">取消</el-button>
      </el-form-item>
    </el-form>

    <el-dialog title="选择待添加商品" :visible.sync="addWareDlgShow" :close-on-click-modal="false">
      <subject-add-ware ref="subjectAddWareComp" :lastSelectedItems="tableData" @selectWareComplete="onSelectWareComplete" />
    </el-dialog>
  </el-card>
</template>

<script type="text/ecmascript-6">
import subjectAddWare from './subject-add-ware';
import {convertToWareStateLabel, convertToMoneyAmount} from '../../utils/appCommon';
import {getSubProductList} from '../../api/activity';
export default{
    props:{
        subInfo: Object
    },
    data(){
        const nameValidator = (rule, value, callback) => {
            if (value.length<=0) {
                callback(new Error('请输入名称'));
            } else {
                callback();
            }
        };

        return{
            formData: {
                id: '',
                name: ''
            },
            formRules: {
                name: [
                    { required: true, trigger: 'blur', validator: nameValidator}
                ],
                wareList: [
                    {required: true, trigger: 'change', validator: this.warListValidator}
                ]
            },
            tableData: [],
            addWareDlgShow: false
        }
    },
    computed:{
        wareList(){
            return (this.tableData&& this.tableData.length>0)?this.tableData[0].wareName:"";
        }
    },
    methods: {
        convertToWareStateLabel: convertToWareStateLabel,
        convertToMoneyAmount: convertToMoneyAmount,
        warListValidator(rule, value, callback){
            if (this.wareList.length<=0) {
                callback(new Error('请至少选择一种商品'));
            } else {
                callback();
            }
        },
        onSubmit(formName){
            this.$refs[formName].validate((valid) => {
                if (valid) {
                    this.$emit('submit', this.formData, this.tableData);
                } else {
                    return false;
                }
            });
        },
        onAddWare(){
            this.addWareDlgShow = true;
            if(this.$refs.subjectAddWareComp)
            {
                this.$refs.subjectAddWareComp.initData();
            }
        },
        onCancel(){
            this.$router.back();
        },
        onRemove(scope){
            const item = scope.row;
            const delIndex = scope.$index;
            this.$confirm(`将移除商品 “${item.wareName}” , 是否继续?`, '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                this.$delete(this.tableData, delIndex);
                this.$message({
                    type: 'success',
                    message: `商品 “${item.wareName}” 移除成功!`,
                    duration: 1800
                });
            }).catch(() => {
                this.$message({
                    type: 'info',
                    message: `已取消移除`,
                    duration: 1000
                });
            });
        },
        onSelectWareComplete(selectedWareList){
            this.tableData.length = 0;
            this.$delete(this.tableData, 0);

            selectedWareList.forEach((value, index)=>{
                this.$set(this.tableData, index, value);
            });
            this.addWareDlgShow = false;
        }
    },
    components:{
        subjectAddWare
    },
    mounted(){
        if(this.subInfo.id)
        {
            this.formData.id = this.subInfo.id;
            this.formData.name = this.subInfo.name;

            const subjectInfo = {id: this.subInfo.id};
            getSubProductList(subjectInfo).then(response=>{
                if (response.status === 200) {
                    response.data.forEach((value, index)=>{
                        const oneObj = {id: value.id, price: value.price,
                            state: value.state, wareName: value.name,
                            wareNumber: value.skuNo, category:value.categoryName};
                        this.$set(this.tableData, index, oneObj);
                    });
                }
                else {
                    this.$message({
                        type: 'error',
                        message: `获取专题详情失败 ${response.status}：${response.statusText}`,
                        duration: 1800
                    });
                }
            }).catch(err=>{
                this.$message.error("获取专题详情失败:" + err.message);
            });
        }
    }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
.el-card {
  max-width: 55rem;
  box-shadow: none;
  padding-bottom: 0.9rem;
  .el-form-item {
    margin: 18px 0 12px 0;
  }
}
</style>

<style rel="stylesheet/scss" lang="scss">
#subject-ware-table.el-table {
  margin-top: 17px;
}
</style>
