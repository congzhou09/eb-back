<!--金币商城-新增专题-->
<template>
  <el-card>
    <el-form label-width="5rem" :rules="formRules" ref="formData" :model="formData">
      <el-form-item label="名称" prop="name">
        <el-input v-model="formData.name"></el-input>
      </el-form-item>

      <div>
        <el-form-item label="商品列表" prop="mallList">
          <el-input type="text" v-model="mallList" v-show="false"></el-input>
          <el-button type="primary" @click="onAddMall()">添加商品</el-button>
        </el-form-item>

        <el-table id="special-add-content" :data="tableData" border style="width: 100%">
          <el-table-column align="center" prop="mallNumber" label="平台货号" width="120"> </el-table-column>
          <el-table-column align="center" label="商品名称" width="130">
            <template slot-scope="scope">
              <template v-if="scope.row.state === 'invalid'">
                <del>{{ scope.row.mallName }}</del>
              </template>
              <template v-else>
                <el-button
                  type="text"
                  size="small"
                  @click="
                    productId = scope.row.id;
                    previewDlgShow = true;
                    onDlgShow('checkComp');
                  "
                  >{{ scope.row.mallName }}</el-button
                >
              </template>
            </template>
          </el-table-column>
          <el-table-column align="center" prop="category" label="所属分类" width="180"> </el-table-column>
          <el-table-column align="center" prop="price" label="价格（金币）">
            <!-- <template slot-scope="scope">
                             {{convertToMoneyAmount(scope.row.price)}}
                        </template>-->
          </el-table-column>
          <el-table-column align="center" label="商品状态">
            <template slot-scope="scope">
              {{ convertToMallStateLabel(scope.row.state) }}
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

      <el-form-item style="float: right;">
        <el-button type="primary" @click="onSubmit('formData')">保存</el-button>
        <el-button type="primary" @click="onCancel">取消</el-button>
      </el-form-item>
    </el-form>

    <el-dialog title="添加促销商品" :visible.sync="addMallDlgShow" :close-on-click-modal="false">
      <special-add-mall ref="specialAddMallComp" :lastSelectedItems="tableData" @selectMallComplete="onSelectMallComplete" />
    </el-dialog>

    <el-dialog class="el-dlg-narrow" title="商品详情预览" :visible.sync="previewDlgShow" :close-on-click-modal="false">
      <preview-mall ref="checkComp" :productId="productId" @cancel="previewDlgShow = false"></preview-mall>
    </el-dialog>
  </el-card>
</template>

<script type="text/ecmascript-6">
import specialAddMall from './special-add-mall';
import previewMall from './preview-mall';
import {convertToMallStateLabel, convertToMoneyAmount} from '../../utils/appCommon';
import {getSubProductList} from '../../api/mall';
export default {
    props:{
        subInfo: {},
    },
    components:{
        specialAddMall,
        previewMall,
    },
    data() {
        const nameValidator = (rule, value, callback) => {
            if (value.length <= 0) {
              callback(new Error('请输入专题名称'));
            } else {
              callback();
            }
        };
        return {
            formData:{
                id:'',
                name:'',
            },
            formRules: {
                name: [{ required: true, trigger: 'blur', validator: nameValidator}],
                mallList: [{ required: true, trigger: 'change', validator: this.mallListValidator}],
            },
            tableData:[],
            addMallDlgShow: false,
            previewDlgShow: false,
            productId: 1,
        }
    },
    computed:{
        mallList(){
            return (this.tableData&& this.tableData.length>0)?this.tableData[0].mallName:"";
        }
    },
    methods: {
        convertToMoneyAmount: convertToMoneyAmount,
        convertToMallStateLabel: convertToMallStateLabel,
        mallListValidator(rule, value, callback){
            if (this.mallList.length<=0) {
                callback(new Error('请至少选择一种商品'));
            } else {
                callback();
            }
        },
         onAddMall(){
            this.addMallDlgShow = true;
            if(this.$refs.specialAddMallComp)
            {
                this.$refs.specialAddMallComp.initData();
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
        onRemove(scope){
            const item = scope.row;
            const delIndex = scope.$index;
            this.$confirm(`将移除商品 “${item.mallName}” , 是否继续?`, '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                this.$delete(this.tableData, delIndex);
                this.$message({
                    type: 'success',
                    message: `商品 “${item.mallName}” 移除成功!`,
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
        onCancel(){
            this.$router.back();
        },
        onSelectMallComplete(selectedMallList){
            this.tableData.length = 0;
            this.$delete(this.tableData, 0);

            selectedMallList.forEach((value, index)=>{
                this.$set(this.tableData, index, value);
            });
            this.addMallDlgShow = false;
        },
        onDlgShow(refName){
            if(this.$refs[refName])
            {
                this.$refs[refName].onInit();
            }
        },
    },
    mounted(){
        if(this.subInfo.id)
        {
            this.formData.id = this.subInfo.id;
            this.formData.name = this.subInfo.name;

            const specialInfo = {channelId: this.subInfo.id};
            getSubProductList(specialInfo).then(response=>{

                if (response.data.code === 200) {
                    response.data.resData.productList.forEach((value, index)=>{
                        const oneObj = {id: value.productId, price: value.price,
                            state: value.state, mallName: value.name,
                            mallNumber: value.skuNo, category:value.categoryName};
                        this.$set(this.tableData, index, oneObj);
                    });
                }
                else {
                    this.$message({
                        type: 'error',
                        message: `获取专题详情失败 ${response.data.code}：${response.data.message}`,
                        duration: 1800
                    });
                }
            }).catch(err=>{
                this.$message.error("获取专题详情失败:" + err.message);
            });
        }
    },
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
#special-add-content.el-table {
  margin-top: 17px;
}
</style>
