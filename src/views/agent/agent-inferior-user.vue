<template>
  <div>
    <!--操作控件-->
    <el-card :body-style="{ padding: '10px 20px' }">
      <el-form :inline="true" :model="sortOptions" :rules="sortFormRules" ref="sortForm" class="sort-form-inline">
        <el-form-item label="用户ID" prop="userID">
          <el-input v-model="sortOptions.userID"></el-input>
        </el-form-item>

        <el-form-item label="手机号" prop="telephone">
          <el-input v-model="sortOptions.telephone"></el-input>
        </el-form-item>

        <el-form-item style="margin-left: 10px;">
          <el-button type="primary" @click="onSort">筛选</el-button>
        </el-form-item>
      </el-form>
    </el-card>

    <!--表格-->
    <el-table v-loading="isLoading" :data="tableData" border style="width: 100%">
      <el-table-column align="center" prop="userID" label="用户ID" width="120"> </el-table-column>
      <el-table-column align="center" prop="nickName" label="昵称" width=""> </el-table-column>
      <el-table-column align="center" label="手机号">
        <template slot-scope="scope">
          {{ scope.row.telephone ? scope.row.telephone : '-' }}
        </template>
      </el-table-column>
      <el-table-column align="center" prop="addTime" label="绑定时间"> </el-table-column>
      <el-table-column align="center" label="最后充值时间">
        <template slot-scope="scope">
          {{ convertToTimeString(scope.row.rechargeTime) }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="最后消费时间">
        <template slot-scope="scope">
          {{ convertToTimeString(scope.row.sellTime) }}
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
import {convertToTimeString} from '../../utils/appCommon';
import {validatorID, validatorTelephone} from '../../utils/validate';
import {getBindUser} from '../../api/agent';
export default{
    props:{
        agentID:{
            type: Number
        }
    },
    data(){
        return {
            sortOptions: {
                userID: '',
                telephone: ''
            },
            isLoading: false,
            sortFormRules: {
                userID: [
                    { trigger: 'blur', validator: validatorID}
                ],
                telephone: [
                    { trigger: 'blur', validator: validatorTelephone}
                ]
            },
            tableData: [{
                userID: '111',
                nickName: 'Pengpeng',
                telephone: '11223322112',
                addTime: '2017-09-20 11:20:17'
            }],
            currentPage: 1,
            pageSize: 10,
            totalSize: 0
        };
    },
    methods:{
        convertToTimeString: convertToTimeString,
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
                    const queryInfo ={proxyId: this.agentID, curtPage: this.currentPage, userId: this.sortOptions.userID, phone: this.sortOptions.telephone};
                    getBindUser(queryInfo).then(response=> {
                        if (response.status === 200) {
                            if (response.data.result) {
                                const resData = response.data.resData;
                                this.totalSize = resData.totalSize;

                                resData.list.forEach((value, index, array)=>{
                                    const oneItem = {};
                                    oneItem.userID = value.userId;
                                    oneItem.nickName = value.nickName;
                                    oneItem.telephone = value.phone;
                                    oneItem.addTime = value.bindTime;
                                    oneItem.rechargeTime = value.rechargeTime;
                                    oneItem.sellTime = value.sellTime;
                                    this.$set(this.tableData, index, oneItem);
                                });
                            }
                            else {
                                this.$message({
                                    type: 'error',
                                    message: `获取绑定用户失败：${response.data.message}`,
                                    duration: 1800
                                });
                            }
                        }
                        else {
                            this.$message({
                                type: 'error',
                                message: `获取绑定用户失败 ${response.status}：${response.statusText}`,
                                duration: 1800
                            });
                        }

                        this.isLoading = false;
                    }).catch(err=> {
                        this.$message.error("获取绑定用户失败:" + err.message);
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
