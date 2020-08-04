<template>
  <div>
    <!--操作控件-->
    <el-card :body-style="{ padding: '10px 20px' }">
      <el-form :inline="true" :model="sortOptions" ref="sortOptionForm" :rules="sortOptionFormRules" class="sort-form-inline">
        <el-form-item label="订单类型" prop="orderProductType">
          <el-select v-model="sortOptions.orderProductType" clearable>
            <el-option v-for="item in orderProductTypeList" :key="item.name" :label="item.name" :value="item.orderProductTypeId">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="用户ID" prop="buyerID">
          <el-input v-model="sortOptions.buyerID" :maxlength="30"></el-input>
        </el-form-item>

        <el-form-item label="订单号" prop="orderNumber">
          <el-input v-model="sortOptions.orderNumber" :maxlength="90"></el-input>
        </el-form-item>

        <el-form-item label="基础商品">
          <el-input v-model="sortOptions.baseWareName" :maxlength="200"></el-input>
        </el-form-item>

        <el-form-item label="玩法">
          <el-select v-model="sortOptions.gameType" placeholder="默认所有玩法">
            <el-option v-for="(item, index) in gameTypeList" :key="index" :label="item.name" :value="item.id"> </el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="订单状态">
          <el-select v-model="sortOptions.orderState" multiple placeholder="默认所有状态">
            <el-option v-for="(item, index) in orderStateList" :key="index" :label="item.label" :value="item.value"> </el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="下单时间">
          <el-date-picker
            style="margin-right:8px;"
            v-model="sortOptions.timeRange"
            type="daterange"
            :editable="false"
            placeholder="选择日期范围"
          >
          </el-date-picker>
        </el-form-item>

        <el-form-item label="手机号" prop="orderPhone">
          <el-input v-model="sortOptions.orderPhone" :maxlength="90"></el-input>
        </el-form-item>

        <el-form-item style="margin-left: 10px;">
          <el-button type="primary" @click="onClickSort">筛选</el-button>
          <el-button type="primary" @click="onClickRefresh">刷新</el-button>
          <el-button type="primary" icon="document" @click="handleDownload" :loading="downloadLoading">导出excel</el-button>
        </el-form-item>
      </el-form>
    </el-card>

    <!--表格-->
    <el-table v-loading="isLoading" :data="tableData" border style="width: 100%">
      <el-table-column align="center" label="手机" width="125">
        <template slot-scope="scope">
          <span v-if="scope.row.phone && scope.row.phone.length > 0">{{ scope.row.phone }}</span>
          <span v-else>-</span>
        </template>
      </el-table-column>
      <el-table-column align="center" prop="buyerID" label="用户ID" width="90"> </el-table-column>
      <el-table-column align="center" prop="orderNumber" label="订单号"> </el-table-column>
      <el-table-column align="center" label="玩法" width="100">
        <template slot-scope="scope">
          {{ convertToGametypeLabel(gameTypeList, scope.row.gameType) }}
        </template>
      </el-table-column>
      <el-table-column align="center" prop="baseWareName" label="基础商品"> </el-table-column>
      <el-table-column align="center" label="升值商品" width="100">
        <template slot-scope="scope">
          <el-popover
            ref="popover"
            placement="left-end"
            width="200"
            trigger="hover"
            @show="onPopOverShow(scope.$index, scope.row.promotionId)"
          >
            <el-table v-if="scope.row.upgradeWare.length > 0" :data="scope.row.upgradeWare">
              <el-table-column align="center" property="name" label="商品列表"></el-table-column>
            </el-table>
            <p v-if="scope.row.upgradeWare.length <= 0">数据获取中……</p>
          </el-popover>
          <el-button
            v-if="scope.row.orderNumber.slice(scope.row.orderNumber.length - 2) === '00' && scope.row.orderNumber.promotionId > 0"
            type="text"
            size="small"
            v-popover:popover
            >查看</el-button
          >
          <span v-else>-</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="升值结果" width="100">
        <template slot-scope="scope">
          <span v-if="scope.row.upgradeResult && scope.row.upgradeResult.length > 0">{{ scope.row.upgradeResult }}</span>
          <span v-else>-</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="订单状态" width="100">
        <template slot-scope="scope">
          {{ convertToOrderStateLabel(scope.row.orderState) }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="订单金额(元)" width="120">
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
          <router-link :to="{ name: 'upgrade-order-check', params: { orderData: scope.row } }">
            <el-button type="text" size="small">查看</el-button>
          </router-link>

          <template v-if="!isReadOnly">
            <template v-if="scope.row.orderState === 'pick'">
              <span style="margin: 0 5px;color:rgb(27, 110, 171);">|</span>
              <el-button type="text" size="small" @click="onNoticeShip(scope.row)">通知发货</el-button>
            </template>
          </template>
        </template>
      </el-table-column>
    </el-table>

    <!--分页-->
    <el-pagination
      :current-page="currentPage"
      :page-sizes="[10, 30, 50, 100]"
      :page-size="pageSize"
      layout="total, sizes, prev, pager, next, jumper"
      :total="totalSize"
      @size-change="onSizeChange"
      @current-change="onCurrentChange"
    >
    </el-pagination>
  </div>
</template>

<script type="text/ecmascript-6">
import { convertToOrderStateLabel, convertToGametypeLabel, convertToMoneyAmount, convertToTimeString } from '../../utils/appCommon';
import { getGameList, getUpgradeWareList } from '../../api/upgrade';
import { getOrderList, informShip } from '../../api/order';
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
    const telephoneValidator = (rule, value, callback) => {
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
    return {
      sortOptionFormRules: {
        buyerID: [{ trigger: 'blur', validator: buyerIDValidator }],
        orderNumber: [{ trigger: 'blur', validator: orderNoValidator }],
        orderPhone: [{ trigger: 'blur', validator: telephoneValidator }]
      },
      orderStateList: [
        { label: '已支付', value: 'payed' },
        { label: '待退款', value: 'torepay' },
        { label: '已退款', value: 'repayed' },
        { label: '待发货', value: 'toship' },
        { label: '已发货', value: 'shipped' },
        { label: '待收货', value: 'torecieve' },
        { label: '已收货', value: 'received' },
        { label: '已取消', value: 'canceled' },
        { label: '待奖励', value: 'toreward' },
        { label: '已奖励', value: 'rewarded' },
        { label: '未奖励', value: 'unrewarded' },
        { label: '待升值', value: 'torevalue' },
        { label: '已升值', value: 'revalued' },
        { label: '未升值', value: 'unrevalued' },
        { label: '已兑换', value: 'exchange' },
        { label: '待提货', value: 'waitpick' },
        { label: '已提货', value: 'pick' }
      ],
      gameTypeList: [],
      sortOptions: {
        orderProductType: '',
        buyerID: '',
        orderNumber: '',
        baseWareName: '',
        gameType: '',
        orderState: [],
        timeRange: [],
        orderPhone: ''
      },
      orderProductTypeList: [
        { name: '所有商品订单', orderProductTypeId: null },
        { name: '实体商品订单', orderProductTypeId: 1 },
        { name: '优惠券商品订单', orderProductTypeId: 3 }
      ],
      tableData: [
        {
          buyerID: '10041',
          orderNumber: '625553558ks2',
          promotionId: -1,
          gameType: '十选一',
          baseWareName: '香蕉',
          upgradeWare: [{ name: '香蕉' }, { name: '牛奶' }],
          upgradeResult: '升值成功',
          orderState: 'toship',
          orderMoneyAmount: 32,
          orderPlaceTime: '2017-05-02 12:09',
          hasExpress: false
        },
        {
          buyerID: '10042',
          orderNumber: '625553558ks3',
          promotionId: -1,
          gameType: '十选一',
          baseWareName: '苹果',
          upgradeWare: [{ name: '苹果' }, { name: '醋' }],
          upgradeResult: '升值成功',
          orderState: 'toship',
          orderMoneyAmount: '12.5',
          orderPlaceTime: '2017-05-02 18:09',
          hasExpress: false
        }
      ],
      currentPage: !isNaN(parseInt(window.localStorage.getItem('curPage'))) ? parseInt(window.localStorage.getItem('curPage')) : 1,
      pageSize: 10,
      totalSize: 0,
      isLoading: true,
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
        const tHeader = ['手机号', '用户ID', '订单号', '玩法', '基础商品', '升值结果', '订单状态', '订单金额(元)', '下单时间'];
        const filterVal = [
          'phone',
          'buyerID',
          'orderNumber',
          'gameType',
          'baseWareName',
          'upgradeResult',
          'orderState',
          'orderMoneyAmount',
          'orderPlaceTime'
        ];
        const list = this.tableData;
        const data = this.formatJson(filterVal, list);
        exportJsonToExcel(tHeader, data, '升值订单excel');
        this.downloadLoading = false;
      });
    },
    formatJson(filterVal, jsonData) {
      return jsonData.map(v =>
        filterVal.map(j =>
          j === 'gameType'
            ? convertToGametypeLabel(this.gameTypeList, v[j])
            : j === 'orderState'
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
    convertToGametypeLabel: convertToGametypeLabel,
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
          orderType: 2,
          orderProductType: this.sortOptions.orderProductType === '' ? null : this.sortOptions.orderProductType,
          phone: this.sortOptions.orderPhone,
          state: this.sortOptions.orderState.join(','),
          userId: this.sortOptions.buyerID,
          orderNo: this.sortOptions.orderNumber,
          productName: this.sortOptions.baseWareName,
          gameId: this.sortOptions.gameType,
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
      if (this.listType === 'succeeded') {
        listInfo.order.state = 'closed';
      } else if (this.listType === 'failed') {
        listInfo.order.state = 'closed';
      }

      getOrderList(listInfo)
        .then(response => {
          if (response.status === 200) {
            const resData = response.data;
            this.totalSize = resData.total;

            resData.orders.forEach((value, index) => {
              const wareList = value.products;
              const theOrderNo = value.order.orderNo;
              const thePhone = value.user.phone;
              // 拆分后子订单，升值失败订单尾号是01，升值成功订单尾号是02
              //                            var orderNoTail = (theOrderNo.slice(theOrderNo.length-2)!="00")?((theOrderNo.slice(theOrderNo.length-2)==="02")?"升值成功":"升值失败"):"-";
              const oneItem = {
                id: value.order.id,
                phone: thePhone,
                buyerID: value.order.userId,
                orderNumber: theOrderNo,
                promotionId: value.order.promotionId,
                gameType: value.order.gameId,
                gameString: this.convertToGametypeLabel(this.gameTypeList, value.order.gameId),
                upgradeWare: [],
                upgradeResult: value.order.gameInfo,
                orderState: value.order.state,
                orderMoneyAmount: value.order.totalPrice,
                orderPlaceTime: value.order.createTime,
                hasExpress: !!(value.express.expressNo.length > 0 && value.express.name.length > 0) // 物流信息是否完整
              };

              if (wareList.length > 0) {
                oneItem.baseWareName = wareList[0].product.name + (wareList.length > 1 ? '...' : '');
              } else {
                this.$message({
                  type: 'error',
                  message: `订单数据错误：订单 ${value.order.orderNo} 中没有商品`,
                  duration: 1800
                });
              }
              oneItem.couponId = wareList[0].product.couponId;
              oneItem.pType = wareList[0].product.pType;
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
    onPopOverShow(index, pairId) {
      //                console.log(pairId);
      if (this.tableData[index].upgradeWare.length <= 0) {
        const listInfo = { id: pairId };
        getUpgradeWareList(listInfo)
          .then(response => {
            if (response.status === 200) {
              const oldElem = this.tableData[index];
              oldElem.upgradeWare = [];

              response.data.forEach((value, index) => {
                const oneUpgradeWare = { name: value.product.name };
                oldElem.upgradeWare.push(oneUpgradeWare);
              });

              this.$set(this.tableData, index, oldElem);

              if (response.data.length <= 0) {
                this.$message({
                  type: 'error',
                  message: `升值商品返回空`,
                  duration: 1800
                });
              }
            } else {
              this.$message({
                type: 'error',
                message: `失败 ${response.status}：${response.statusText}`,
                duration: 1800
              });
            }
          })
          .catch(err => {
            this.$message.error('获取升值商品列表失败:' + err.message);
          });
      }
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
    getGameTypeList() {
      this.gameTypeList.length = 0;
      this.$delete(this.gameTypeList, 0);
      getGameList()
        .then(response => {
          if (response.status === 200) {
            this.$set(this.gameTypeList, 0, { id: '', name: '所有玩法' });

            response.data.forEach((value, index) => {
              const oneItem = {
                id: value.id,
                name: value.name
              };
              this.$set(this.gameTypeList, index + 1, oneItem);
            });
          } else {
            this.$message({
              type: 'error',
              message: `获取玩法列表失败 ${response.status}：${response.statusText}, 请刷新页面`,
              duration: 1800
            });
          }
        })
        .catch(err => {
          this.$message.error(`获取玩法列表失败: ${err.message}, 请刷新页面`);
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
    this.getGameTypeList();
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
