<template>
  <div class="app-container">
    <!--筛选控件-->
    <el-card :body-style="{ padding: '10px 20px' }">
      <el-form :inline="true" :model="sortOptions" :rules="sortFormRules" ref="sortForm">
        <el-form-item label="用户ID" prop="ID">
          <el-input v-model="sortOptions.ID"></el-input>
        </el-form-item>

        <el-form-item label="昵称" prop="name">
          <el-input v-model="sortOptions.name"></el-input>
        </el-form-item>

        <el-form-item label="手机号" prop="telephone">
          <el-input v-model="sortOptions.telephone"></el-input>
        </el-form-item>

        <el-form-item>
          <el-button type="primary" @click="onSort">筛选</el-button>
        </el-form-item>
      </el-form>
    </el-card>

    <!--表格-->
    <el-table v-loading="isLoading" :data="tableData" border style="width: 100%">
      <el-table-column align="center" prop="ID" label="用户ID" width="120"> </el-table-column>
      <el-table-column align="center" label="昵称">
        <template slot-scope="scope">
          {{ scope.row.name }}
          <span v-if="!scope.row.name">-</span>
        </template>
      </el-table-column>
      <el-table-column align="center" prop="telephone" label="手机号">
        <template slot-scope="scope">
          {{ scope.row.telephone }}
          <span v-if="!scope.row.telephone">-</span>
        </template>
      </el-table-column>
      <el-table-column align="center" prop="execTime" label="领取/发放时间"> </el-table-column>
    </el-table>

    <!--分页-->
    <el-pagination
      :current-page="currentPage"
      :page-size="pageSize"
      layout="total, prev, pager, next, jumper"
      :total="totalSize"
      @current-change="onCurrentChange"
    >
    </el-pagination>
  </div>
</template>

<script type="text/ecmascript-6">
import {getVoucherUserList} from '../../api/activity';
export default {
    props: ["processID"],
    data() {
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
        function nameValidator(rule, value, callback){
            callback();
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
                ID: '',
                name: '',
                telephone: ''
            },
            sortFormRules: {
                ID: [
                    { trigger: 'blur', validator: idValidator}
                ],
                name: [
                    { trigger: 'blur', validator: nameValidator}
                ],
                telephone: [
                    { trigger: 'blur', validator: telephoneValidator}
                ]
            },
            tableData: [{
                ID: '1000054',
                name: '克林',
                telephone: '15125489589',
                execTime: '2016-05-02 12:01'
            }],
            currentPage: 1,
            pageSize: 10,
            totalSize: 0,
            isLoading: false,
            isReadOnly: true
        };
    },
    methods: {
        onSort() {
            this.$refs['sortForm'].validate((valid) => {
                if (valid) {
                    this.tableData.length = 0;
                    this.$delete(this.tableData, 0);
                    this.isLoading = true;
                    const listInfo = {couponId:this.processID, userId: this.sortOptions.ID, nickName:this.sortOptions.name, phone: this.sortOptions.telephone,
                        curtPage:this.currentPage};

                    getVoucherUserList(listInfo).then(response=> {
                        if (response.status === 200) {
                            if(response.data.result)
                            {
                                const resData = response.data.resData;
                                this.totalSize = resData.totalSize;
                                resData.list.forEach((value,index)=>{
                                    const oneUser = {
                                        ID: value.userId,
                                        name: value.userNickName,
                                        telephone: value.phone,
                                        execTime: value.sendTime
                                    };
                                    this.$set(this.tableData, index, oneUser);
                                });
                            }
                            else
                            {
                                this.$message({
                                    type: 'error',
                                    message: `失败：${response.data.message}`,
                                    duration: 1800
                                });
                            }
                        }
                        else {
                            this.$message({
                                type: 'error',
                                message: `获取用户列表失败 ${response.status}：${response.statusText}`,
                                duration: 1800
                            });
                        }
                        this.isLoading = false;
                    }).catch(err=> {
                        this.$message.error("获取用户列表失败:" + err.message);
                        this.isLoading = false;
                    });
                }
                else {
                    return false;
                }
            });
        },
        onCurrentChange(val) {
            this.currentPage = val;
            this.onSort();
        },
        onInit(){
            this.$nextTick(()=>{
                this.onSort();
            });
        }
    },
    mounted(){
        this.$nextTick(()=>{
            this.onSort();
        });
    }
};
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
.el-card {
  background-color: #f9fafc;
  border: none;
  box-shadow: none;
  .el-form-item {
    margin: 10px 12px 10px 0;
  }
}
.el-table {
  margin-top: 1rem;
}
.el-tab-pane {
  overflow: auto;
}
.el-pagination {
  text-align: right;
  margin: 1rem 0;
}
</style>
