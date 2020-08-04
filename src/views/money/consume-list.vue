<template>
  <div class="app-container">
    <el-tabs value="1">
      <el-tab-pane :disabled="true" label="消费记录" name="1">
        <!--操作控件-->
        <el-card :body-style="{ padding: '10px 20px' }">
          <el-form :inline="true" :model="sortOptions" :rules="sortFormRules" ref="sortForm" class="sort-form-inline">
            <el-form-item label="订单号">
              <el-input v-model="sortOptions.orderNumber"></el-input>
            </el-form-item>

            <el-form-item label="手机号" prop="telephone">
              <el-input v-model="sortOptions.telephone"></el-input>
            </el-form-item>

            <el-form-item label="昵称">
              <el-input v-model="sortOptions.nickName"></el-input>
            </el-form-item>

            <el-form-item label="操作日期">
              <el-date-picker v-model="sortOptions.timeRange" type="daterange" placeholder="选择日期范围"> </el-date-picker>
            </el-form-item>

            <el-form-item style="margin-left: 10px;">
              <el-button type="primary" @click="onSort">筛选</el-button>
              <el-button type="primary" @click="onRefresh">刷新</el-button>
              <el-button v-if="!isReadOnly" type="primary" @click="changeMoneyDlgShow = true">手动扣费</el-button>
              <el-button type="primary" icon="document" @click="handleDownload" :loading="downloadLoading">导出excel</el-button>
            </el-form-item>
          </el-form>
        </el-card>

        <!--表格-->
        <el-table v-loading="isLoading" :data="tableData" border style="width: 100%">
          <el-table-column align="center" prop="userId" label="用户ID" width="120"> </el-table-column>
          <el-table-column align="center" prop="telephone" label="手机号" width=""> </el-table-column>
          <el-table-column align="center" label="昵称" width="">
            <template slot-scope="scope">
              <router-link :to="{ name: 'money-user-check', params: { from: 'consume-list', userData: userCheckDataAdaptor(scope.row) } }">
                <span style="color:#20a0ff;">{{ scope.row.nickName }}</span>
              </router-link>
            </template>
          </el-table-column>
          <el-table-column align="center" label="订单号" width="">
            <template slot-scope="scope">
              <router-link
                v-if="scope.row.orderNumber.length > 0"
                :to="{ name: 'money-order-check', params: { from: 'consume-list', orderData: scope.row } }"
              >
                <span style="color:#20a0ff;">{{ scope.row.orderNumber }}</span>
              </router-link>
              <span v-else>无</span>
            </template>
          </el-table-column>
          <el-table-column align="center" label="消费金额" width="">
            <template slot-scope="scope">
              {{ convertToMoneyAmount(scope.row.consumeAmount) }}
              <small v-if="scope.row.operateType === 5" style="font-weight:bold;color:#a6a3a3;"> (手动扣款)</small>
            </template>
          </el-table-column>
          <el-table-column align="center" label="账户余额" width="">
            <template slot-scope="scope">
              {{ convertToMoneyAmount(scope.row.remainAmount) }}
            </template>
          </el-table-column>
          <el-table-column align="center" prop="operateNumber" label="流水号" width=""> </el-table-column>
          <el-table-column align="center" label="消费时间">
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

        <el-dialog title="手动扣费" :visible.sync="changeMoneyDlgShow" @open="onChangeMoneyDlgOpen" :close-on-click-modal="false">
          <manual-change @submit="onChangeMoney" @cancel="changeMoneyDlgShow = false" :formData="changeMoneyFormData" />
        </el-dialog>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script type="text/ecmascript-6">
import manualChange from './manual-change';
import { convertToMoneyAmount, convertToTimeString } from '../../utils/appCommon';
import { getMoneyList, manualChangeMoney } from '../../api/money';
import { mapGetters } from 'vuex';
export default {
  components: {
    manualChange
  },
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
        nickName: '',
        orderNumber: '',
        timeRange: ''
      },
      sortFormRules: {
        telephone: [{ trigger: 'blur', validator: telephoneValidator }]
      },
      tableData: [
        {
          userId: '10041',
          telephone: '112554542214',
          nickName: '天津饭',
          orderNumber: '2sdf22lk12',
          consumeAmount: '12.00',
          remainAmount: '22.00',
          operateNumber: '41124212sdf245',
          consumeTime: '2017-05-02 12:09',
          operateType: 5
        },
        {
          userId: '10042',
          telephone: '185316652254',
          nickName: '武天',
          orderNumber: '2sdf22lk12',
          consumeAmount: '11.00',
          remainAmount: '33.00',
          operateNumber: '41124212sdf245',
          consumeTime: '2017-05-02 12:09',
          operateType: 5
        }
      ],
      currentPage: !isNaN(parseInt(window.localStorage.getItem('curPage'))) ? parseInt(window.localStorage.getItem('curPage')) : 1,
      pageSize: 10,
      totalSize: 0,
      isLoading: true,
      changeMoneyDlgShow: false,
      changeMoneyFormData: {
        userId: '',
        changeType: -1,
        moneyAmount: 0
      },
      downloadLoading: false,
      isReadOnly: true
    };
  },
  computed: {
    ...mapGetters(['readOnlyMap'])
  },
  methods: {
    handleDownload() {
      this.downloadLoading = true;
      require.ensure([], () => {
        const { exportJsonToExcel } = require('vendor/Export2Excel');
        const tHeader = ['用户ID', '手机号', '昵称', '订单号', '消费金额', '账户金额', '流水账号', '消费时间'];
        const filterVal = [
          'userId',
          'telephone',
          'nickName',
          'orderNumber',
          'consumeAmount',
          'remainAmount',
          'operateNumber',
          'consumeTime'
        ];
        const list = this.tableData;
        const data = this.formatJson(filterVal, list);
        exportJsonToExcel(tHeader, data, '消费记录excel');
        this.downloadLoading = false;
      });
    },
    formatJson(filterVal, jsonData) {
      return jsonData.map(v =>
        filterVal.map(j =>
          j === 'consumeAmount'
            ? convertToMoneyAmount(v[j])
            : j === 'remainAmount'
            ? convertToMoneyAmount(v[j])
            : j === 'consumeTime'
            ? convertToTimeString(v[j])
            : v[j]
        )
      );
    },
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
          // operatorNo: this.sortOptions.operateNumber,
          const listInfo = {
            page: this.currentPage - 1,
            pageSize: this.pageSize,
            type: 2,
            userName: this.sortOptions.nickName,
            phone: this.sortOptions.telephone,
            begin:
              this.sortOptions.timeRange && this.sortOptions.timeRange.length > 0 && this.sortOptions.timeRange[0] != null
                ? this.convertToTimeString(this.sortOptions.timeRange[0]).slice(0, 10)
                : '',
            end:
              this.sortOptions.timeRange && this.sortOptions.timeRange.length > 0 && this.sortOptions.timeRange[1] != null
                ? this.convertToTimeString(this.sortOptions.timeRange[1]).slice(0, 10)
                : ''
          };

          getMoneyList(listInfo)
            .then(response => {
              if (response.status === 200) {
                const resData = response.data;
                this.totalSize = resData.totalSize;
                resData.list.forEach((value, index) => {
                  const oneItem = {
                    userId: value.userId,
                    telephone: value.phone,
                    nickName: value.userName,
                    orderNumber: value.orderNo,
                    consumeAmount: value.amount,
                    remainAmount: value.accountBalance,
                    operateNumber: value.operateNo,
                    consumeTime: value.operateTime,
                    operateType: value.operateType
                  };
                  this.$set(this.tableData, index, oneItem);
                });
              } else {
                this.$message({
                  type: 'error',
                  message: `获取消费列表失败 ${response.status}：${response.statusText}`,
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
    onChangeMoneyDlgOpen() {
      this.changeMoneyFormData = {
        userId: '',
        changeType: -1,
        moneyAmount: 1
      };
    },
    onChangeMoney(chargeFormInfo) {
      const chargeInfo = { id: chargeFormInfo.userId, value: chargeFormInfo.moneyAmount, type: chargeFormInfo.changeType };
      if (chargeFormInfo.changeType != -1) {
        // 类型验证
        this.$message({
          type: 'error',
          message: `手动扣款失败: 扣款类型不匹配`,
          duration: 1800
        });
        return;
      }
      manualChangeMoney(chargeInfo)
        .then(response => {
          if (response.status === 200) {
            if (response.data.result) {
              this.$message({
                type: 'success',
                message: `手动扣款成功!`,
                duration: 1800
              });
              this.changeMoneyDlgShow = false;
              this.onSort();
            } else {
              this.$message({
                type: 'error',
                message: `手动扣款失败：${response.data.message}`,
                duration: 1800
              });
            }
          } else {
            this.$message({
              type: 'error',
              message: `手动扣款失败 ${response.status}：${response.statusText}`,
              duration: 1800
            });
          }
        })
        .catch(err => {
          this.$message.error('手动扣款失败:' + err.message);
        });
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
    }
  },
  created() {
    if (this.$route.params.fromSiderBar) {
      window.localStorage.setItem('curPage', 1);
      window.localStorage.setItem('sortOptions', '');
    } else {
      this.getLastSortOptions();
    }
    if (!this.readOnlyMap[this.$route.path]) {
      this.isReadOnly = false;
    }
  },
  mounted() {
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
.el-dialog {
  width: 600px;
}
</style>
