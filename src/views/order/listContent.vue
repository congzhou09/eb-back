<template>
  <div>
    <!--操作控件-->
    <el-card :body-style="{ padding: '10px 20px' }">
      <el-form :inline="true" :model="sortOptions" ref="sortOptionForm" :rules="sortOptionFormRules" class="sort-form-inline">
        <el-form-item label="用户ID" prop="buyerID">
          <el-input v-model="sortOptions.buyerID" :maxlength="30"></el-input>
        </el-form-item>

        <el-form-item label="订单号" prop="orderNumber">
          <el-input v-model="sortOptions.orderNumber" :maxlength="90"></el-input>
        </el-form-item>

        <el-form-item label="商品名称">
          <el-input v-model="sortOptions.wareName" :maxlength="200"></el-input>
        </el-form-item>

        <el-form-item label="订单状态" v-if="this.listType === 'all'">
          <el-select v-model="sortOptions.orderState" multiple placeholder="默认所有分类">
            <el-option v-for="(item, index) in orderStateList" :key="index" :label="item.label" :value="item.value"> </el-option>
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
      <el-table-column align="center" prop="orderNumber" label="订单号"> </el-table-column>
      <el-table-column align="center" prop="wareName" label="商品名称"> </el-table-column>
      <el-table-column align="center" label="订单状态" width="120">
        <template slot-scope="scope">
          {{ convertToOrderStateLabel(scope.row.orderState) }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="订单金额(元)">
        <template slot-scope="scope">
          {{ convertToMoneyAmount(scope.row.orderMoneyAmount) }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="下单时间">
        <template slot-scope="scope">
          {{ convertToTimeString(scope.row.orderPlaceTime) }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="操作">
        <template slot-scope="scope">
          <router-link :to="{ name: 'order-check', params: { orderData: scope.row } }">
            <el-button type="text" size="small">查看</el-button>
          </router-link>

          <template v-if="!isReadOnly">
            <template v-if="scope.row.orderState === 'confirmed' || scope.row.orderState === 'unpayed'">
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

            <template v-if="scope.row.orderState === 'canceled'">
              <span style="margin: 0 5px;color:rgb(27, 110, 171);">|</span>
              <el-button type="text" size="small" @click="onCloseOrder(scope.row)">关闭订单</el-button>
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
  </div>
</template>

<script type="text/ecmascript-6">
import { convertToOrderStateLabel, convertToMoneyAmount, convertToTimeString } from '../../utils/appCommon';
import { getOrderList, informShip, cancelOrder, closeOrder } from '../../api/order';
import { mapGetters } from 'vuex';
export default {
  props: {
    listType: String
  },
  data() {
    const buyerIDValidator = (rule, value, callback) => {
      if (!/^[0-9]*$/.test(value)) {
        callback(new Error('请输入正确格式的用户ID'));
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
        buyerID: [{ trigger: 'blur', validator: buyerIDValidator }],
        orderNumber: [{ trigger: 'blur', validator: orderNoValidator }]
      },
      orderStateList: [
        { label: '已确认', value: 'confirmed' },
        { label: '待支付', value: 'topay' },
        { label: '已支付', value: 'payed' },
        { label: '未支付', value: 'unpayed' },
        { label: '待退款', value: 'torepay' },
        { label: '已退款', value: 'repayed' },
        { label: '待发货', value: 'toship' },
        { label: '已发货', value: 'shipped' },
        { label: '待收货', value: 'torecieve' },
        { label: '已收货', value: 'received' },
        { label: '已取消', value: 'canceled' },
        { label: '已关闭', value: 'closed' }
      ],
      sortOptions: {
        buyerID: '',
        orderNumber: '',
        wareName: '',
        orderState: [],
        timeRange: []
      },
      tableData: [
        {
          id: 4,
          buyerID: '10041',
          orderNumber: '625553558ks2',
          wareName: '香蕉',
          orderState: 'topay',
          orderMoneyAmount: 32,
          orderPlaceTime: '2017-05-02 12:09',
          hasExpress: false
        },
        {
          id: '',
          buyerID: '10042',
          orderNumber: '625553558ks3',
          wareName: '苹果',
          orderState: 'toship',
          orderMoneyAmount: '12.5',
          orderPlaceTime: '2017-05-02 18:09',
          hasExpress: false
        },
        {
          id: '',
          buyerID: '10043',
          orderNumber: '625553558ks3',
          wareName: '菠萝',
          orderState: 'toReceive',
          orderMoneyAmount: '12.5',
          orderPlaceTime: '2017-05-02 18:09',
          hasExpress: false
        },
        {
          id: '',
          buyerID: '10044',
          orderNumber: '625553558ks4',
          wareName: '牛肉',
          orderState: 'canceled',
          orderMoneyAmount: '92.5',
          orderPlaceTime: '2017-05-02 21:09',
          hasExpress: false
        },
        {
          id: '',
          buyerID: '10045',
          orderNumber: '625553558ks4',
          wareName: '梨',
          orderState: 'closed',
          orderMoneyAmount: '9.5',
          orderPlaceTime: '2017-05-02 21:09',
          hasExpress: false
        },
        {
          id: '',
          buyerID: '10046',
          orderNumber: '625553558ks4',
          wareName: '羊肉',
          orderState: 'done',
          orderMoneyAmount: 9,
          orderPlaceTime: '2017-05-02 21:09',
          hasExpress: false
        }
      ],
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
        const tHeader = ['用户ID', '订单号', '商品名称', '订单状态', '订单金额(元)', '下单时间'];
        const filterVal = ['buyerID', 'orderNumber', 'wareName', 'orderState', 'orderMoneyAmount', 'orderPlaceTime'];
        const list = this.tableData;
        const data = this.formatJson(filterVal, list);
        exportJsonToExcel(tHeader, data, '普通订单excel');
        this.downloadLoading = false;
      });
    },
    formatJson(filterVal, jsonData) {
      return jsonData.map(v =>
        filterVal.map(j =>
          j === 'orderState'
            ? convertToOrderStateLabel(v[j])
            : j === 'orderMoneyAmount'
            ? convertToMoneyAmount(v[j])
            : j === 'orderPlaceTime'
            ? convertToTimeString(v[j])
            : v[j]
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
        page: this.currentPage,
        size: this.pageSize,
        order: {
          orderType: 1,
          state: this.sortOptions.orderState.join(','),
          userId: this.sortOptions.buyerID,
          orderNo: this.sortOptions.orderNumber,
          productName: this.sortOptions.wareName,
          beginTime:
            this.sortOptions.timeRange && this.sortOptions.timeRange.length > 0 && this.sortOptions.timeRange[0]
              ? this.convertToTimeString(this.sortOptions.timeRange[0]).slice(0, 10)
              : '',
          endTime:
            this.sortOptions.timeRange && this.sortOptions.timeRange.length > 0 && this.sortOptions.timeRange[1]
              ? this.convertToTimeString(this.sortOptions.timeRange[1]).slice(0, 10)
              : ''
        }
      };
      if (this.listType != 'all') {
        listInfo.order.state = 'closed';
      }
      getOrderList(listInfo)
        .then(response => {
          if (response.status === 200) {
            const resData = response.data;
            this.totalSize = resData.total;

            resData.orders.forEach((value, index) => {
              const wareList = value.products;
              const oneItem = {
                id: value.order.id,
                buyerID: value.order.userId,
                orderNumber: value.order.orderNo,
                orderState: value.order.state,
                orderMoneyAmount: value.order.totalPrice,
                orderPlaceTime: value.order.createTime,
                hasExpress: !!(
                  value.express &&
                  value.express.expressNo &&
                  value.express.expressNo.length > 0 &&
                  value.express.name.length > 0
                ) // 物流信息是否完整
              };
              if (wareList.length > 0) {
                oneItem.wareName = wareList[0].product.name + (wareList.length > 1 ? '...' : '');
              } else {
                this.$message({
                  type: 'error',
                  message: `订单数据错误：订单 ${response.statusText} 中没有商品`,
                  duration: 1800
                });
              }
              this.$set(this.tableData, index, oneItem);
            });
          } else {
            this.$message({
              type: 'error',
              message: `获取订单列表失败 ${response.status}：${response.statusText}`,
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
                  message: `取消订单失败 ${response.status}：${response.statusText}`,
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
              if (response.status === 200) {
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
                  message: `通知发货失败 ${response.status}：${response.statusText}`,
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
