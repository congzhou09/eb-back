<template>
  <div>
    <!--操作控件-->
    <el-card :body-style="{ padding: '10px 20px' }">
      <el-form :inline="true" :model="sortOptions" :rules="sortFormRules" ref="sortForm" class="sort-form-inline">
        <el-form-item label="用户ID" prop="userID">
          <el-input v-model="sortOptions.userID"></el-input>
        </el-form-item>

        <el-form-item label="手机号">
          <el-input v-model="sortOptions.telephone"></el-input>
        </el-form-item>

        <el-form-item style="margin-left: 10px;">
          <el-button type="primary" @click="onSort">筛选</el-button>
        </el-form-item>
      </el-form>
    </el-card>

    <!--表格-->
    <el-table v-loading="isLoading" :data="tableData" border style="width: 100%">
      <el-table-column align="center" prop="userID" label="用户ID"> </el-table-column>
      <el-table-column align="center" prop="nickName" label="昵称"> </el-table-column>
      <el-table-column align="center" prop="telephone" label="手机号"> </el-table-column>
      <el-table-column align="center" prop="orderNumber" label="订单号"> </el-table-column>
      <el-table-column align="center" label="消费金额(元)">
        <template slot-scope="scope">
          {{ convertToMoneyAmount(scope.row.consumeMoney) }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="收益(元)">
        <template slot-scope="scope">
          {{ convertToMoneyAmount(scope.row.gainMoney) }}
        </template>
      </el-table-column>
      <el-table-column align="center" prop="addTime" label="绑定时间">
        <template slot-scope="scope">
          {{ convertToTimeString(scope.row.addTime) }}
        </template>
      </el-table-column>
    </el-table>

    <!--分页-->
    <el-pagination
      @current-change="onCurrentChange"
      :current-page="currentPage"
      :page-size="pageSize"
      layout="total, prev, pager, next, jumper"
      :total="totalSize"
    >
    </el-pagination>
  </div>
</template>

<script type="text/ecmascript-6">
import {convertToTimeString, convertToMoneyAmount} from '../../utils/appCommon';
import {getIncomeDetail} from '../../api/agent';
export default{
    props:{
        agentID:{
            type: Number
        }
    },
    data(){
        function idValidator(rule, value, callback){
            if(value.match(/[\u4e00-\u9fa5]/))
            {
                callback(new Error('不可以包含中文'));
            }
            else
            {
                callback();
            }
        }
        function telephoneValidator(rule, value, callback){
            if(value.match(/[\u4e00-\u9fa5]/))
            {
                callback(new Error('不可以包含中文'));
            }
            else if(value.length>0)
            {
                const reg = /^1\d{10}$/;
                if(!reg.test(value))
                {
                    callback(new Error('请输入正确的手机号'));
                }
                else
                {
                    callback();
                }
            }
            else
            {
                callback();
            }
        }
        return {
            sortOptions: {
                userID: '',
                telephone: ''
            },
            isLoading: false,
            sortFormRules: {
                userID: [
                    { trigger: 'blur', validator: idValidator}
                ],
                telephone: [
                    { trigger: 'blur', validator: telephoneValidator}
                ]
            },
            tableData: [{
                userID: '111',
                nickName: 'Pengpeng',
                telephone: '11223322112',
                orderNumber: '120932lk323ssq',
                consumeMoney: 100,
                gainMoney: 5,
                addTime: '2017-09-20 11:20:17'
            }],
            currentPage: 1,
            pageSize: 10,
            totalSize: 0
        };
    },
    methods:{
        convertToTimeString: convertToTimeString,
        convertToMoneyAmount: convertToMoneyAmount,
        onCurrentChange(val){
            this.currentPage = val;
            this.onSort();
        },
        onSort(){
            this.$refs['sortForm'].validate((valid) => {
                if (valid)
                {
                    this.isLoading = true;
                    this.tableData.length = 0;
                    this.$delete(this.tableData, 0);
                    const queryInfo ={proxyId: this.agentID, curtPage: this.currentPage, consumerUserId: this.sortOptions.userID, consumerUserPhone: this.sortOptions.telephone};
                    getIncomeDetail(queryInfo).then(response=> {
                        if (response.status === 200) {
                            if (response.data.result) {
                                const resData = response.data.resData;
                                this.totalSize = resData.totalSize;

                                resData.list.forEach((value, index, array)=>{
                                    const oneItem = {};
                                    oneItem.userID = value.userId;
                                    oneItem.nickName = value.nickName;
                                    oneItem.telephone = value.phone;
                                    oneItem.orderNumber = value.orderNo;
                                    oneItem.consumeMoney = value.payAmount;
                                    oneItem.gainMoney = value.profitAmount;
                                    oneItem.addTime = value.createTime;

                                    this.$set(this.tableData, index, oneItem);
                                });
                            }
                            else {
                                this.$message({
                                    type: 'error',
                                    message: `获取收入明细失败：${response.data.message}`,
                                    duration: 1800
                                });
                            }
                        }
                        else {
                            this.$message({
                                type: 'error',
                                message: `获取收入明细失败 ${response.status}：${response.statusText}`,
                                duration: 1800
                            });
                        }

                        this.isLoading = false;
                    }).catch(err=> {
                        this.$message.error("获取收入明细失败:" + err.message);
                        this.isLoading = false;
                    });
                }
                else
                {
                    return false;
                }
            });
        },
        onInit(){
            this.onSort();
        }
    },
    mounted(){
        this.onSort();
    }
};
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
.el-card {
  background-color: #f9fafc;
  border: none;
  box-shadow: none;
}
.sort-form-inline {
  position: relative;
  display: inline;
  .el-form-item {
    margin: 10px 12px 10px 0;
  }
  .el-input {
    width: 173px;
  }
  .el-select {
    width: 173px;
  }
  .el-date-editor {
    width: 208px;
  }
}
.el-table {
  margin-top: 1rem;
}
.el-pagination {
  text-align: right;
  margin: 1rem 0;
}
</style>
