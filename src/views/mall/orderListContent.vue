<template>
  <div>
    <!--操作控件-->
    <el-card :body-style="{ padding: '10px 20px' }">
      <el-form :inline="true" :model="sortOptions" ref="sortOptionForm" :rules="sortOptionFormRules" class="sort-form-inline">
        <el-form-item label="手机号" prop="phone">
          <el-input v-model="sortOptions.phone" :maxlength="30"></el-input>
        </el-form-item>

        <el-form-item label="订单号" prop="orderNumber">
          <el-input v-model="sortOptions.orderNumber" :maxlength="90"></el-input>
        </el-form-item>

        <el-form-item label="商品类型" prop="productType">
          <el-select v-model="sortOptions.productType" clearable placeholder="默认所有类型">
            <el-option v-for="item in mallProductTypeList" :key="item.name" :label="item.name" :value="item.productTypeId"> </el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="订单状态" v-if="this.listType === 'all'">
          <el-select v-model="sortOptions.orderStates" clearable placeholder="默认所有分类">
            <el-option v-for="item in orderStateList" :key="item.label" :label="item.label" :value="item.value"> </el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="下单时间">
          <el-date-picker v-model="sortOptions.timeRange" type="daterange" :editable="false" placeholder="选择日期范围"> </el-date-picker>
        </el-form-item>

        <el-form-item style="margin-left: 10px;">
          <el-button type="primary" @click="onSort">筛选</el-button>
          <el-button type="primary" @click="onRefresh">刷新</el-button>
          <el-button type="primary" icon="document" @click="handleDownload" :loading="downloadLoading">导出excel</el-button>
        </el-form-item>
      </el-form>
    </el-card>

    <!--表格  v-loading="isLoading" -->
    <el-table v-loading="isLoading" :data="tableData" border style="width: 100%">
      <el-table-column align="center" prop="buyerID" label="用户ID" width="80"> </el-table-column>
      <el-table-column align="center" prop="phone" label="手机号" width="140"> </el-table-column>
      <el-table-column align="center" prop="orderNumber" label="订单号"> </el-table-column>
      <el-table-column align="center" prop="mallName" label="商品名称"> </el-table-column>
      <el-table-column align="center" label="订单状态" width="120">
        <template slot-scope="scope">
          {{ convertToOrderStateLabel(scope.row.orderState) }}
          <!--{{scope.row.orderState}}-->
        </template>
      </el-table-column>
      <el-table-column align="center" label="订单金额">
        <template slot-scope="scope">
          <!--{{convertToMoneyAmount(scope.row.orderMoneyAmount)}}-->
          {{ scope.row.orderMoneyAmount }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="下单时间">
        <template slot-scope="scope">
          {{ convertToTimeString(scope.row.orderPlaceTime) }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="操作">
        <template slot-scope="scope">
          <router-link :to="{ name: 'order-check-mall', params: { orderData: scope.row } }">
            <el-button type="text" size="small">查看</el-button>
          </router-link>

          <template v-if="!isReadOnly">
            <template v-if="scope.row.orderState === 'payed' || scope.row.orderState === 'toship'">
              <span style="margin: 0 5px;color:rgb(27, 110, 171);">|</span>
              <el-button type="text" size="small" @click="onCancelOrder(scope.row)">取消订单</el-button>
            </template>

            <template v-if="scope.row.orderState === 'payed'">
              <span style="margin: 0 5px;color:rgb(27, 110, 171);">|</span>
              <el-button type="text" size="small" @click="onNoticeShip(scope.row)">通知发货</el-button>
            </template>

            <!--<template v-if="scope.row.orderState==='toship'">-->
            <!--<span style="margin: 0 5px;color:rgb(27, 110, 171);">|</span>-->
            <!--<el-button type="text" size="small" @click="expressDlgShow = true">-->
            <!--{{(scope.row.hasExpress)?'修改配送信息':'填写配送信息'}}-->
            <!--</el-button>-->
            <!--</template>-->

            <!-- <template v-if="scope.row.orderState==='canceled'">
                            <span style="margin: 0 5px;color:rgb(27, 110, 171);">|</span>
                            <el-button type="text" size="small" @click="onCloseOrder(scope.row);">关闭订单</el-button>
                        </template>-->
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
  </div>
</template>

<script type="text/ecmascript-6">
import { convertToOrderStateLabel, convertToMoneyAmount, convertToTimeString } from '../../utils/appCommon';
import { getOrderList, informShip, cancelOrder, closeOrder } from '../../api/mall';
import { mapGetters } from 'vuex';
export default {
  props: {
    listType: String
  },
  data() {
    const phoneValidator = (rule, value, callback) => {
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
    };
    const orderNoValidator = (rule, value, callback) => {
      if (!/^[0-9]*$/.test(value)) {
        callback(new Error('请输入正确格式的订单号'));
      } else {
        callback();
      }
    };
    return {
      sortOptionFormRules: {
        phone: [{ trigger: 'blur', validator: phoneValidator }],
        orderNumber: [{ trigger: 'blur', validator: orderNoValidator }]
      },

      orderStateList: [
        { label: '已支付', value: 'payed' }, // 1,unshipped
        { label: '待发货', value: 'toship' }, // 2
        { label: '已发货', value: 'shipped' }, // 3
        { label: '已收货', value: 'received' }, // 4
        { label: '手动取消', value: 'canceled' } // 5
        /* {label: '手动取消', value: 5},*/
      ],
      sortOptions: {
        phone: '',
        orderNumber: '',
        orderStates: '',
        productType: '',
        timeRange: []
      },
      mallProductTypeList: [
        { name: '实体商品', productTypeId: 1 },
        { name: '充值卡虚拟商品', productTypeId: 2 }
      ],
      tableData: [],
      currentPage: !isNaN(parseInt(window.localStorage.getItem('curPage'))) ? parseInt(window.localStorage.getItem('curPage')) : 1,
      pageSize: 10,
      totalSize: 0,
      isLoading: true,
      expressDlgShow: false,
      isReadOnly: true,
      downloadLoading: false
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
        const tHeader = ['用户ID', '手机号', '订单号', '商品名称', '订单状态', '订单金额', '下单时间'];
        const filterVal = ['buyerID', 'phone', 'orderNumber', 'mallName', 'orderState', 'orderMoneyAmount', 'orderPlaceTime'];
        const list = this.tableData;
        const data = this.formatJson(filterVal, list);
        exportJsonToExcel(tHeader, data, '兑换订单excel');
        this.downloadLoading = false;
      });
    },
    formatJson(filterVal, jsonData) {
      // j==='orderMoneyAmount' ? convertToMoneyAmount(v[j]) :
      return jsonData.map(v =>
        filterVal.map(j =>
          j === 'orderState' ? convertToOrderStateLabel(v[j]) : j === 'orderPlaceTime' ? convertToTimeString(v[j]) : v[j]
        )
      );
    },
    convertToOrderStateLabel: convertToOrderStateLabel,
    convertToMoneyAmount: convertToMoneyAmount,
    convertToTimeString: convertToTimeString,
    onClickSort() {
      if (this.beforeSort('sortOptionForm')) {
        this.onSort();
      }
    },
    onClickRefresh() {
      if (this.beforeSort('sortOptionForm')) {
        this.onRefresh();
      }
    },
    beforeSort(formName) {
      let validateOk = false;
      this.$refs[formName].validate(valid => {
        if (valid) {
          validateOk = true;
        } else {
          return false;
        }
      });

      return validateOk;
    },
    onSort() {
      window.localStorage.setItem('sortOptions', JSON.stringify(this.sortOptions));

      this.tableData.length = 0;
      this.$delete(this.tableData, 0);
      this.isLoading = true;

      const lastCurPage = parseInt(window.localStorage.getItem('curPage'));
      if (!isNaN(lastCurPage)) {
        this.currentPage = lastCurPage;
      }

      const listInfo = {
        curtPage: this.currentPage,
        pageSize: this.pageSize,
        orderType: this.sortOptions.productType,
        orderStatus: this.sortOptions.orderStates === '' ? 'all' : this.sortOptions.orderStates,
        phone: this.sortOptions.phone,
        orderNo: this.sortOptions.orderNumber,
        startDate:
          this.sortOptions.timeRange && this.sortOptions.timeRange.length > 0 && this.sortOptions.timeRange[0]
            ? this.convertToTimeString(this.sortOptions.timeRange[0]).slice(0, 10)
            : '',
        endDate:
          this.sortOptions.timeRange && this.sortOptions.timeRange.length > 0 && this.sortOptions.timeRange[1]
            ? this.convertToTimeString(this.sortOptions.timeRange[1]).slice(0, 10)
            : ''
      };
      getOrderList(listInfo)
        .then(response => {
          if (response.data.code === 200) {
            const resDatas = response.data.resData;
            this.totalSize = resDatas.totalSize;

            resDatas.list.forEach((value, index) => {
              // const mallList = value.list;
              const oneItem = {
                buyerID: value.userId,
                phone: value.userPhone,
                mallName: value.productName,
                orderNumber: value.orderNo,
                orderState: value.status,
                orderMoneyAmount: value.totalPrice,
                orderPlaceTime: value.createTime
                //  hasExpress: !!(value.express.expressNo.length>0&&value.express.name.length>0)//物流信息是否完整
              };
              /*       if(mallList.length>0)
                            {
                                oneItem.mallName = mallList[0].product.name + ((mallList.length>1)?"...":"");
                            }
                            else
                            {
                                this.$message({
                                    type: 'error',
                                    message: `订单数据错误：订单 ${response.statusText} 中没有商品`,
                                    duration: 1800
                                });
                            }*/
              this.$set(this.tableData, index, oneItem);
            });
          } else {
            this.$message({
              type: 'error',
              message: `获取订单列表失败 ${response.data.code}：${response.data.message}`,
              duration: 1800
            });
          }
          this.isLoading = false;
        })
        .catch(err => {
          this.$message.error('获取订单列表失败:' + err.message);
          this.isLoading = false;
        });
    },
    onRefresh() {
      this.getLastSortOptions();
      //                console.log(`type="${this.listType}" 获取数据并更新`);
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
    onCancelOrder(item) {
      this.$confirm(`将取消订单 “${item.orderNumber}” , 是否继续?`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          const orderInfo = { orderNo: item.orderNumber };
          cancelOrder(orderInfo)
            .then(response => {
              if (response.status === 200) {
                if (response.data.result) {
                  this.$message({
                    type: 'success',
                    message: `订单 “${item.orderNumber}” 取消成功!`,
                    duration: 1800
                  });
                  item.orderState = 'canceled';
                } else {
                  this.$message({
                    type: 'error',
                    message: `取消订单失败：${response.data.message}`,
                    duration: 1800
                  });
                }
              } else {
                this.$message({
                  type: 'error',
                  message: `取消订单失败 ${response.data.code}：${response.data.message}`,
                  duration: 1800
                });
              }
            })
            .catch(err => {
              this.$message.error('取消订单失败:' + err.message);
            });
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: `已取消订单的取消`,
            duration: 1000
          });
        });
    },
    onNoticeShip(item) {
      this.$confirm(`将发送订单 “${item.orderNumber}” 的通知发货邮件, 是否继续?`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          const orderInfo = { orderNo: item.orderNumber };
          informShip(orderInfo)
            .then(response => {
              if (response.data.code === 200) {
                if (response.data.result) {
                  this.$message({
                    type: 'success',
                    message: `订单 “${item.orderNumber}” 通知发货成功!`,
                    duration: 1800
                  });
                  item.orderState = 'toship';
                } else {
                  this.$message({
                    type: 'error',
                    message: `通知发货失败：${response.data.message}`,
                    duration: 1800
                  });
                }
              } else {
                this.$message({
                  type: 'error',
                  message: `通知发货失败 ${response.data.code}：${response.data.message}`,
                  duration: 1800
                });
              }
            })
            .catch(err => {
              this.$message.error('通知发货失败:' + err.message);
            });
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: `已取消通知发货`,
            duration: 1000
          });
        });
    },
    onCloseOrder(item) {
      this.$confirm(`将关闭订单 “${item.orderNumber}” , 是否继续?`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          const orderInfo = { orderNo: item.orderNumber };
          closeOrder(orderInfo)
            .then(response => {
              if (response.status === 200) {
                if (response.data.result) {
                  this.$message({
                    type: 'success',
                    message: `订单 “${item.orderNumber}” 关闭成功!`,
                    duration: 1800
                  });
                  item.orderState = 'closed';
                } else {
                  this.$message({
                    type: 'error',
                    message: `关闭订单失败：${response.data.message}`,
                    duration: 1800
                  });
                }
              } else {
                this.$message({
                  type: 'error',
                  message: `关闭订单失败 ${response.status}：${response.statusText}`,
                  duration: 1800
                });
              }
            })
            .catch(err => {
              this.$message.error('关闭订单失败:' + err.message);
            });
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: `已取消关闭订单`,
            duration: 1000
          });
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
    if (!this.readOnlyMap[this.$route.path]) {
      this.isReadOnly = false;
    }

    const curListType = window.localStorage.getItem('orderListCurrentType');

    if (curListType) {
      if (this.listType === curListType) {
        this.onRefresh();
      }
    } else if (this.listType === 'all') {
      this.onRefresh();
    }
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
  .el-date-editor {
    width: 208px;
  }
  .el-select {
    width: 173px;
  }
}
.el-select {
  width: 150px;
}
.el-table {
  margin-top: 1rem;
}
.el-pagination {
  text-align: right;
  margin: 1rem 0;
}
</style>
