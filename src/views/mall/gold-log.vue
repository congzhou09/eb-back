<!--金币商城金币记录-->
<template>
  <div class="app-container">
    <el-tabs value="1">
      <el-tab-pane :disabled="true" label="增加记录" name="1">
        <!--操作控件-->
        <el-card :body-style="{ padding: '10px 20px' }">
          <el-form :inline="true" :model="sortOptions" :rules="sortFormRules" ref="sortForm" class="sort-form-inline">
            <el-form-item label="用户ID">
              <el-input v-model="sortOptions.tableUserId"></el-input>
            </el-form-item>

            <el-form-item label="订单号">
              <el-input v-model="sortOptions.orderNumber"></el-input>
            </el-form-item>

            <el-form-item label="手机号" prop="telephone">
              <el-input v-model="sortOptions.telephone"></el-input>
            </el-form-item>

            <el-form-item label="兑换日期">
              <!-- <el-date-picker
                                    v-model="sortOptions.exchangeTime"
                                    type="daterange"
                                    placeholder="选择日期范围">
                            </el-date-picker>:picker-options="pickerOptions"-->
              <el-date-picker v-model="sortOptions.exchangeTime" type="date" placeholder="选择日期"> </el-date-picker>
            </el-form-item>

            <el-form-item style="margin-left: 10px;">
              <el-button type="primary" @click="onSort">筛选</el-button>
              <el-button type="primary" @click="onRefresh">刷新</el-button>
            </el-form-item>
          </el-form>
        </el-card>

        <!--表格-->
        <el-table v-loading="isLoading" :data="tableData" border style="width: 100%">
          <el-table-column align="center" prop="userId" label="用户ID" width="120"> </el-table-column>
          <el-table-column align="center" prop="telephone" label="手机号" width=""> </el-table-column>
          <el-table-column align="center" label="昵称" width="">
            <template slot-scope="scope">
              <router-link :to="{ name: 'gold-user-check', params: { from: 'consume-list', userData: userCheckDataAdaptor(scope.row) } }">
                <span style="color:#20a0ff;">{{ scope.row.nickName }}</span>
              </router-link>
            </template>
          </el-table-column>
          <el-table-column align="center" prop="goldType" label="类型" width=""> </el-table-column>
          <el-table-column align="center" label="订单号(升值购)" width="">
            <template slot-scope="scope">
              <!--<router-link v-if="scope.row.orderNumber.length>0" :to="{ name:'gold-order-check', params: {from: 'consume-list', orderData: (scope.row)} }">-->
              <span v-if="scope.row.orderNumber.length > 0">{{ scope.row.orderNumber }}</span>
              <!--</router-link>-->
              <span v-else>无</span>
            </template>
          </el-table-column>
          <el-table-column align="center" label="兑换金币" width="">
            <template slot-scope="scope">
              <!--{{convertToMoneyAmount(scope.row.consumeAmount)}}-->
              {{ scope.row.consumeAmount }}
            </template>
          </el-table-column>

          <el-table-column align="center" label="兑换时间">
            <template slot-scope="scope">
              {{ convertToTimeString(scope.row.consumeTime) }}
            </template>
          </el-table-column>
        </el-table>

        <!--分页-->
        <el-pagination
          @size-change="onSizeChange"
          @current-change="onCurrentChange"
          :current-page="currentPage"
          :page-sizes="[10, 30, 50, 100]"
          :page-size="pageSize"
          layout="total, sizes, prev, pager, next, jumper"
          :total="totalSize"
        >
        </el-pagination>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script type="text/ecmascript-6">
import { convertToMoneyAmount, convertToTimeString } from '../../utils/appCommon';
import { getLogList } from '../../api/mall';
export default {
  data() {
    function telephoneValidator(rule, value, callback) {
      if (value.match(/[\u4e00-\u9fa5]/)) {
        callback(new Error('不可以包含中文'));
      } else if (value.length > 0) {
        const reg = /^1\d{10}$/;
        if (!reg.test(value)) {
          callback(new Error('请输入正确的手机号'));
        } else {
          callback();
        }
      } else {
        callback();
      }
    }
    return {
      sortOptions: {
        telephone: '',
        tableUserId: '',
        orderNumber: '',
        exchangeTime: ''
      },
      sortFormRules: {
        telephone: [{ trigger: 'blur', validator: telephoneValidator }]
      },
      tableData: [],
      currentPage: !isNaN(parseInt(window.localStorage.getItem('curPage'))) ? parseInt(window.localStorage.getItem('curPage')) : 1,
      pageSize: 10,
      totalSize: 0,
      isLoading: false
    };
  },
  methods: {
    convertToMoneyAmount: convertToMoneyAmount,
    convertToTimeString: convertToTimeString,
    onSort() {
      window.localStorage.setItem('sortOptions', JSON.stringify(this.sortOptions));

      const lastCurPage = parseInt(window.localStorage.getItem('curPage'));
      if (!isNaN(lastCurPage)) {
        this.currentPage = lastCurPage;
      }

      this.$refs['sortForm'].validate(valid => {
        if (valid) {
          this.tableData.length = 0;
          this.$delete(this.tableData, 0);
          this.isLoading = true;

          const logList = {
            curtPage: this.currentPage,
            pageSize: this.pageSize,
            orderNo: this.sortOptions.orderNumber,
            userId: this.sortOptions.tableUserId,
            phone: this.sortOptions.telephone,
            exchangeTime:
              this.sortOptions.exchangeTime && this.sortOptions.exchangeTime != null
                ? this.convertToTimeString(this.sortOptions.exchangeTime).slice(0, 10)
                : '',
            recordType: 'add'
          };

          getLogList(logList)
            .then(response => {
              if (response.data.code === 200) {
                const resDatas = response.data;
                this.totalSize = response.data.resData.totalSize;
                resDatas.resData.list.forEach((value, index) => {
                  const oneItem = {
                    userId: value.userId,
                    telephone: value.phone,
                    nickName: value.nickName,
                    goldType: value.operateTypeStr,
                    orderNumber: value.orderNo,
                    consumeAmount: value.amount,
                    //  remainAmount: value.accountBalance,
                    // operateNumber: value.operateNo,
                    consumeTime: value.createTime
                    // operateType: value.operateType
                  };
                  this.$set(this.tableData, index, oneItem);
                });
              } else {
                this.$message({
                  type: 'error',
                  message: `获取消费列表失败 ${response.data.code}：${response.data.message}`,
                  duration: 1800
                });
              }
              this.isLoading = false;
            })
            .catch(err => {
              this.$message.error('获取消费列表失败:' + err.message);
              this.isLoading = false;
            });
        } else {
          return false;
        }
      });
    },
    onRefresh() {
      this.getLastSortOptions();
      this.onSort();
    },
    onSizeChange(val) {
      this.pageSize = val;
      this.onRefresh();
    },
    onCurrentChange(val) {
      this.currentPage = val;
      window.localStorage.setItem('curPage', val);
      this.onSort();
    },
    userCheckDataAdaptor(item) {
      item.ID = item.userId;
      item.name = item.nickName;
      return item;
    },
    getLastSortOptions() {
      const lastSortOptions = window.localStorage.getItem('sortOptions');
      if (lastSortOptions && lastSortOptions.length > 0) {
        const lastSortOptionsObj = JSON.parse(lastSortOptions);
        for (const oneProp in this.sortOptions) {
          if ({}.hasOwnProperty.call(this.sortOptions, oneProp)) {
            this.sortOptions[oneProp] = lastSortOptionsObj.hasOwnProperty(oneProp)
              ? lastSortOptionsObj[oneProp]
              : this.sortOptions[oneProp] instanceof Array
              ? []
              : '';
          }
        }
      }
    },
    onClear() {
      this.sortOptions.telephone = '';
      this.sortOptions.tableUserId = '';
      this.sortOptions.orderNumber = '';
      this.sortOptions.exchangeTime = '';
      this.onSort();
    }
  },
  created() {
    if (this.$route.params.fromSiderBar) {
      window.localStorage.setItem('curPage', 1);
      window.localStorage.setItem('sortOptions', '');
    } else {
      this.getLastSortOptions();
    }
  },
  mounted() {
    this.onSort();
    this.onClear();
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
.el-dialog {
  width: 600px;
}
</style>
