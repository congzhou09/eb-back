<template>
  <div class="app-container">
    <el-tabs value="1">
      <el-tab-pane :disabled="true" label="提现记录" name="1">
        <!--操作控件-->
        <el-card :body-style="{ padding: '10px 20px' }">
          <el-form :inline="true" :model="sortOptions" :rules="sortFormRules" ref="sortForm" class="sort-form-inline">
            <el-form-item label="手机号" prop="telephone">
              <el-input v-model="sortOptions.telephone"></el-input>
            </el-form-item>

            <el-form-item label="昵称" v-if="false">
              <el-input v-model="sortOptions.nickName"></el-input>
            </el-form-item>

            <el-form-item label="流水号">
              <el-input v-model="sortOptions.operateNumber"></el-input>
            </el-form-item>

            <el-form-item label="申请日期">
              <el-date-picker v-model="sortOptions.timeRange" type="daterange" placeholder="选择日期范围"> </el-date-picker>
            </el-form-item>
            <el-form-item label="提现类型">
              <el-select v-model="sortOptions.withdrawTypel" placeholder="默认所有类型">
                <el-option :key="0" label="全部类型" :value="0"></el-option>
                <el-option v-for="item in withdrawTypeList" :key="item.value" :label="item.label" :value="item.value"> </el-option>
              </el-select>
            </el-form-item>

            <el-form-item style="margin-left: 10px;">
              <el-button type="primary" @click="onSort">筛选</el-button>
              <el-button type="primary" @click="onRefresh">刷新</el-button>
              <el-button type="primary" icon="document" @click="handleDownload" :loading="downloadLoading">导出excel</el-button>
            </el-form-item>
          </el-form>
        </el-card>

        <!--表格-->
        <el-table v-loading="isLoading" :data="tableData" border style="width: 100%">
          <el-table-column align="center" prop="userId" label="用户ID" width="120"> </el-table-column>
          <el-table-column align="center" prop="telephone" label="手机号" width=""> </el-table-column>
          <el-table-column align="center" prop="operateNumber" label="流水号" width=""> </el-table-column>
          <el-table-column align="center" v-if="false" label="昵称" width="">
            <template slot-scope="scope">
              <router-link :to="{ name: 'money-user-check', params: { from: 'recharge-list', userData: userCheckDataAdaptor(scope.row) } }">
                <span style="color:#20a0ff;">{{ scope.row.nickName }}</span>
              </router-link>
            </template>
          </el-table-column>
          <el-table-column align="center" prop="withdrawType" label="提现类型" width="">
            <template slot-scope="scope">
              {{ convertToWithdrawType(scope.row.withdrawType) }}
            </template>
          </el-table-column>
          <el-table-column v-if="isWithdrawNC" align="center" label="支付宝账号" width="140">
            <template slot-scope="scope">
              <span v-if="scope.row.alipayAccount && scope.row.alipayAccount.length > 0">{{ scope.row.alipayAccount }}</span>
              <span v-else>-</span>
            </template>
          </el-table-column>
          <el-table-column v-if="isWithdrawNC" align="center" label="提现姓名" width="120">
            <template slot-scope="scope">
              <span v-if="scope.row.alipayRealName && scope.row.alipayRealName.length > 0">{{ scope.row.alipayRealName }}</span>
              <span v-else>-</span>
            </template>
          </el-table-column>
          <el-table-column align="center" label="提现金额" width="">
            <template slot-scope="scope">
              {{ convertToMoneyAmount(scope.row.withdrawAmount) }}
            </template>
          </el-table-column>
          <el-table-column align="center" label="状态">
            <template slot-scope="scope">
              {{ convertToWithdrawStateLabel(scope.row.state) }}
            </template>
          </el-table-column>
          <el-table-column align="center" prop="applyTime" label="申请时间">
            <template slot-scope="scope">
              {{ convertToTimeString(scope.row.applyTime) }}
            </template>
          </el-table-column>

          <el-table-column align="center" label="操作">
            <template slot-scope="scope">
              <template>
                <router-link :to="{ name: 'withdraw-check', params: { withdrawData: scope.row } }">
                  <el-button type="text" size="small">查看</el-button>
                </router-link>
              </template>

              <template v-if="!isReadOnly">
                <template v-if="scope.row.state === 0">
                  <span style="margin: 0 5px;color:rgb(27, 110, 171);">|</span>
                  <el-button
                    type="text"
                    size="small"
                    @click="
                      WithdrawPorcId = scope.row.id;
                      examineDlgShow = true;
                    "
                    >审核</el-button
                  >
                </template>

                <template v-if="scope.row.state === 1">
                  <span style="margin: 0 5px;color:rgb(27, 110, 171);">|</span>
                  <el-button type="text" size="small" @click="onChangeWithdrawState(scope.row.id, 4)">确认</el-button>
                </template>

                <template v-if="scope.row.state === 4">
                  <span style="margin: 0 5px;color:rgb(27, 110, 171);">|</span>
                  <el-button
                    type="text"
                    size="small"
                    @click="
                      WithdrawPorcId = scope.row.id;
                      completeDlgShow = true;
                    "
                    >完成</el-button
                  >
                </template>
              </template>
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

        <!--弹出框-->
        <el-dialog
          class="withdraw-examine"
          title="提现审核"
          :visible.sync="examineDlgShow"
          @open="onWithDrawExamineDlgOpen"
          :close-on-click-modal="false"
        >
          <withdraw-examine ref="withdrawExamineComp" @ok="onWithdrawExamineOk" @cancel="examineDlgShow = false"></withdraw-examine>
        </el-dialog>
        <el-dialog
          class="withdraw-examine"
          title="提现完成"
          :visible.sync="completeDlgShow"
          @open="onWithDrawCompleteeDlgOpen"
          :close-on-click-modal="false"
        >
          <withdraw-Complete ref="withdrawCompleteComp" @ok="onWithdrawCompleteOk" @cancel="completeDlgShow = false"></withdraw-Complete>
        </el-dialog>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script type="text/ecmascript-6">
import {
  withdrawTypeList,
  convertToWithdrawStateLabel,
  convertToMoneyAmount,
  convertToTimeString,
  convertToWithdrawType
} from '../../utils/appCommon';
import { getWithdrawList, changeWithdrawState } from '../../api/money';
import withdrawExamine from './withdraw-examine.vue';
import withdrawComplete from './withdraw-complete.vue';
import { mapGetters } from 'vuex';
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
        nickName: '',
        operateNumber: '',
        timeRange: [],
        withdrawTypel: ''
      },
      sortFormRules: {
        telephone: [{ trigger: 'blur', validator: telephoneValidator }]
      },
      tableData: [
        {
          id: '',
          userId: '20041',
          telephone: '18647425742',
          nickName: '杂烩饭',
          withdrawAmount: 12,
          operateNumber: '41124212sdf245',
          state: 'invalid',
          applyTime: '2017-05-02 12:09'
        },
        {
          id: '',
          userId: '20042',
          telephone: '15210121254',
          nickName: '波波',
          withdrawAmount: '11.00',
          operateNumber: '41124212sdf245',
          state: 'onsale',
          applyTime: '2017-05-02 12:09'
        }
      ],
      currentPage: !isNaN(parseInt(window.localStorage.getItem('curPage'))) ? parseInt(window.localStorage.getItem('curPage')) : 1,
      pageSize: 10,
      totalSize: 0,
      isLoading: true,
      examineDlgShow: false,
      completeDlgShow: false,
      WithdrawPorcId: -1,
      downloadLoading: false,
      withdrawTypeList: withdrawTypeList,
      isReadOnly: true,
      isWithdrawNC: true
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
        const tHeader = ['用户ID', '手机号', '流水账号', '提现金额', '状态', '申请时间'];
        const filterVal = ['userId', 'telephone', 'operateNumber', 'withdrawAmount', 'state', 'applyTime'];
        const list = this.tableData;
        const data = this.formatJson(filterVal, list);
        exportJsonToExcel(tHeader, data, '提现记录excel');
        this.downloadLoading = false;
      });
    },
    formatJson(filterVal, jsonData) {
      return jsonData.map(v =>
        filterVal.map(j =>
          j === 'withdrawAmount'
            ? convertToMoneyAmount(v[j])
            : j === 'state'
            ? convertToWithdrawStateLabel(v[j])
            : j === 'applyTime'
            ? convertToTimeString(v[j])
            : v[j]
        )
      );
    },
    convertToWithdrawStateLabel: convertToWithdrawStateLabel,
    convertToMoneyAmount: convertToMoneyAmount,
    convertToTimeString: convertToTimeString,
    convertToWithdrawType: convertToWithdrawType,
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

          const listInfo = {
            page: this.currentPage - 1,
            pageSize: this.pageSize,
            operatorNo: this.sortOptions.operateNumber,
            userName: this.sortOptions.nickName,
            phone: this.sortOptions.telephone,
            withdrawType: this.sortOptions.withdrawTypel === '' ? 0 : this.sortOptions.withdrawTypel,
            begin:
              this.sortOptions.timeRange && this.sortOptions.timeRange.length > 0 && this.sortOptions.timeRange[0] != null
                ? this.convertToTimeString(this.sortOptions.timeRange[0]).slice(0, 10)
                : '',
            end:
              this.sortOptions.timeRange && this.sortOptions.timeRange.length > 0 && this.sortOptions.timeRange[1] != null
                ? this.convertToTimeString(this.sortOptions.timeRange[1]).slice(0, 10)
                : ''
          };

          getWithdrawList(listInfo)
            .then(response => {
              // 判断若是银行卡则不显示支付宝账号和姓名否则显示
              if (this.sortOptions.withdrawTypel === 1) {
                this.isWithdrawNC = false;
              } else {
                this.isWithdrawNC = true;
              }
              if (response.status === 200) {
                const resData = response.data;
                this.totalSize = resData.totalSize;
                resData.list.forEach((value, index) => {
                  const oneItem = {
                    id: value.id,
                    userId: value.userId,
                    telephone: value.phone,
                    alipayAccount: value.alipayAccount,
                    alipayRealName: value.alipayRealName,
                    nickName: value.userName,
                    withdrawAmount: value.amount,
                    operateNumber: value.operateNo,
                    withdrawType: value.withdrawType,
                    state: value.state,
                    applyTime: value.createTime
                  };
                  this.$set(this.tableData, index, oneItem);
                });
              } else {
                this.$message({
                  type: 'error',
                  message: `获取提现列表失败 ${response.status}：${response.statusText}`,
                  duration: 1800
                });
              }
              this.isLoading = false;
            })
            .catch(err => {
              this.$message.error('获取提现列表失败:' + err.message);
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
    changeWithdrawStateCore(id, state, reason) {
      const newState = this.convertToWithdrawStateLabel(state);
      const withdrawInfo = { id: id, state: state };
      if (reason && reason.length > 0) {
        withdrawInfo.reason = reason;
      }
      changeWithdrawState(withdrawInfo)
        .then(response => {
          if (response.status === 200) {
            if (response.data.result) {
              this.$message({
                type: 'success',
                message: `修改提现状态为 ${newState} 成功!`,
                duration: 1800
              });
              this.onRefresh();
            } else {
              this.$message({
                type: 'error',
                message: `修改提现状态为 ${newState} 失败：${response.data.message}`,
                duration: 1800
              });
            }
          } else {
            this.$message({
              type: 'error',
              message: `修改提现状态为 ${newState} 失败 ${response.status}：${response.statusText}`,
              duration: 1800
            });
          }
        })
        .catch(err => {
          this.$message.error('修改提现状态为 ${newState} 失败:' + err.message);
        });
    },
    onChangeWithdrawState(id, state, reason) {
      if (state === 4) {
        const newState = this.convertToWithdrawStateLabel(state);
        this.$confirm(`将修改提现状态为" ${newState} ", 是否继续?`, '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        })
          .then(() => {
            this.changeWithdrawStateCore(id, state, reason);
          })
          .catch(() => {
            this.$message({
              type: 'info',
              message: '已取消提现状态修改',
              duration: 1000
            });
          });
      } else {
        this.changeWithdrawStateCore(id, state, reason);
      }
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
      item.ID = item.buyerID;
      item.name = item.nickName;
      return item;
    },
    onWithdrawExamineOk(examineObj) {
      if (examineObj.state === 3) {
        this.onChangeWithdrawState(this.WithdrawPorcId, 3, examineObj.reason);
      } else if (examineObj.state === 1) {
        this.onChangeWithdrawState(this.WithdrawPorcId, 1);
      }
      this.examineDlgShow = false;
    },
    onWithDrawExamineDlgOpen() {
      if (this.$refs['withdrawExamineComp']) {
        this.$refs['withdrawExamineComp'].init();
      }
    },
    onWithdrawCompleteOk(infoObj) {
      if (infoObj.state === 5) {
        this.onChangeWithdrawState(this.WithdrawPorcId, 5, infoObj.reason);
      } else if (infoObj.state === 2) {
        this.onChangeWithdrawState(this.WithdrawPorcId, 2);
      }
      this.completeDlgShow = false;
    },
    onWithDrawCompleteeDlgOpen() {
      if (this.$refs['withdrawCompleteComp']) {
        this.$refs['withdrawCompleteComp'].init();
      }
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
    this.onRefresh();
  },
  components: {
    withdrawExamine,
    withdrawComplete
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
<style rel="stylesheet/scss" lang="scss">
.withdraw-examine {
  .el-dialog {
    width: 600px;
  }
}
</style>
