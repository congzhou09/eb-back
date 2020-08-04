<template>
  <div class="app-container" v-loading="isLoading">
    <el-tabs value="orderInfo">
      <el-tab-pane label="订单信息" name="orderInfo">
        <!--表格-->
        <div class="display-table">
          <div class="display-table-row">
            <div class="display-table-cell" style="width:200px">
              <span class="table-cell-text">基本信息</span>
            </div>
            <div class="display-table-cell">
              <ul class="info-list">
                <li><label class="title-label">用户ID：</label>{{ orderInfo.buyerID }}</li>
                <li><label class="title-label">昵称：</label>{{ orderInfo.buyerName }}</li>
                <li><label class="title-label">手机号：</label>{{ orderInfo.telephone }}</li>
                <li><label class="title-label">支付方式：</label>{{ convertToPayTypeLabel(orderInfo.payType) }}</li>
                <li><label class="title-label">下单时间：</label>{{ convertToTimeString(orderInfo.orderCreateTime) }}</li>
                <li v-if="orderInfo.orderPayTime">
                  <label class="title-label">支付时间：</label>{{ convertToTimeString(orderInfo.orderPayTime) }}
                </li>
                <li v-if="orderInfo.orderRevalueTime">
                  <label class="title-label">升值时间：</label>{{ convertToTimeString(orderInfo.orderRevalueTime) }}
                </li>
                <li v-if="orderInfo.orderRewardNoticeTime">
                  <label class="title-label">开奖时间：</label>{{ convertToTimeString(orderInfo.orderRewardNoticeTime) }}
                </li>
                <li v-if="orderInfo.orderShipTime">
                  <label class="title-label">发货时间：</label>{{ convertToTimeString(orderInfo.orderShipTime) }}
                </li>
                <li v-if="orderInfo.orderTakeDeliverTime">
                  <label class="title-label">收货时间：</label>{{ convertToTimeString(orderInfo.orderTakeDeliverTime) }}
                </li>
                <li v-if="orderInfo.orderDrawMoneyTime">
                  <label class="title-label">退款时间：</label>{{ convertToTimeString(orderInfo.orderDrawMoneyTime) }}
                </li>
              </ul>
            </div>
          </div>
          <oddeven-order-row v-if="curOrderType === 'upgrade' && orderInfo.gameString === '选奇偶'" :gameInfo="gameInfo.hilomp" />
          <tenone-order-row v-if="curOrderType === 'upgrade' && orderInfo.gameString === '十选一'" :gameInfo="gameInfo.tenone" />
          <farm-order-row v-if="curOrderType === 'upgrade' && orderInfo.gameString === '欢乐农场'" :gameInfo="gameInfo.farm" />

          <div class="display-table-row">
            <div class="display-table-cell" style="width:200px">
              <span class="table-cell-text">订单信息</span>
            </div>
            <div class="display-table-cell">
              <ul class="info-list">
                <li><label class="title-label">订单号：</label>{{ orderInfo.orderNumber }}</li>
                <li><label class="title-label">支付单号：</label>{{ orderInfo.payNumber }}<span v-if="!orderInfo.payNumber">无</span></li>
                <li><label class="title-label">订单状态：</label>{{ convertToOrderStateLabel(orderInfo.orderState) }}</li>
                <li><label class="title-label">订单金额：</label>{{ convertToMoneyAmount(orderInfo.orderMoneyAmount) }}（元）</li>
                <li v-if="orderInfo.pType !== 3">
                  <label class="title-label">优惠券抵扣：</label>
                  <span v-if="orderInfo.discountAmount" style="margin-left: -4px;"
                    >{{ convertToMoneyAmount(orderInfo.discountAmount) }}（元）</span
                  >
                  <span v-else style="margin-left: -4px;">无</span>
                </li>
                <li v-if="orderInfo.pType !== 3">
                  <label class="title-label">订单备注：</label>{{ orderInfo.orderRemark
                  }}<span v-if="!orderInfo.orderRemark.length">无</span>
                </li>
                <li v-if="orderInfo.pType !== 3">
                  <label class="title-label">客服备注：</label>{{ orderInfo.agentRemark
                  }}<span v-if="!orderInfo.agentRemark.length">无</span>
                  <el-button
                    v-if="!isReadOnly && agentRemarkDlgShowArr.indexOf(orderInfo.orderState) >= 0"
                    style="margin-left: 20px;"
                    type="text"
                    @click="agentRemarkDlgShow = true"
                  >
                    {{ orderInfo.agentRemark.length > 0 ? '修改' : '添加' }}
                  </el-button>
                </li>
              </ul>
            </div>
          </div>
          <div class="display-table-row" v-if="orderInfo.pType !== 3">
            <div class="display-table-cell" style="width:200px">
              <span class="table-cell-text">收货人信息</span>
            </div>
            <div class="display-table-cell">
              <ul class="info-list">
                <li>
                  <label class="title-label">收货人姓名：</label>{{ orderInfo.receiverName
                  }}<span v-if="!orderInfo.receiverName.length">无</span>
                </li>
                <li>
                  <label class="title-label">联系方式：</label>{{ orderInfo.receiverTel
                  }}<span v-if="!orderInfo.receiverTel.length">无</span>
                </li>
                <li>
                  <label class="title-label">详细地址：</label>{{ orderInfo.receiverAddress
                  }}<span v-if="!orderInfo.receiverAddress.length">无</span>
                </li>
              </ul>
            </div>
          </div>
          <div class="display-table-row" v-if="orderInfo.pType !== 3">
            <div class="display-table-cell" style="width:200px">
              <span class="table-cell-text">配送信息</span>
            </div>
            <div class="display-table-cell">
              <ul class="info-list">
                <li>
                  <label class="title-label">配送方：</label>{{ orderInfo.expressCompany
                  }}<span v-if="!orderInfo.expressCompany.length">无</span>
                </li>
                <li>
                  <label class="title-label">快递单号：</label>{{ orderInfo.expressNumber
                  }}<span v-if="!orderInfo.expressNumber.length">无</span>
                </li>
              </ul>
            </div>
          </div>
          <div class="display-table-row" v-if="this.$route.path == '/upgrade/order-check' && orderInfo.pType === 3">
            <div class="display-table-cell" style="width:200px">
              <span class="table-cell-text">优惠券信息</span>
            </div>
            <div class="display-table-cell">
              <ul class="info-list">
                <li>
                  <label class="title-label">优惠券信息：</label>
                  <el-button
                    type="text"
                    size="small"
                    @click="
                      processID = orderInfo.couponId;
                      checkDlgShow = true;
                      onDlgShow('checkComp');
                    "
                    >点击查看详情</el-button
                  >
                </li>
              </ul>
            </div>
          </div>
        </div>
      </el-tab-pane>
      <el-tab-pane label="商品信息" name="wareInfo">
        <el-table :data="tableData" style="width: 100%">
          <el-table-column align="center" prop="wareNumber" label="商品货号"> </el-table-column>
          <el-table-column align="center" prop="name" label="商品名称">
            <template slot-scope="scope">
              <img class="table-cell-img" :src="scope.row.coverImg" /><label>{{ scope.row.name }}</label>
            </template>
          </el-table-column>
          <el-table-column align="center" label="商品价格">
            <template slot-scope="scope">
              {{ convertToMoneyAmount(scope.row.price) }}
            </template>
          </el-table-column>
          <el-table-column align="center" prop="count" label="商品数量"> </el-table-column>
        </el-table>
      </el-tab-pane>
    </el-tabs>

    <!--按钮-->
    <div class="btn-group">
      <template v-if="!isReadOnly">
        <el-button v-if="orderInfo.orderState === 'confirmed' || orderInfo.orderState === 'unpayed'" type="primary" @click="onCancelOrder"
          >取消订单</el-button
        >
        <el-button
          v-if="orderInfo.orderState === 'toship' || orderInfo.orderState === 'shipped' || orderInfo.orderState === 'torecieve'"
          type="primary"
          @click="expressDlgShow = true"
        >
          {{ (orderInfo.expressCompany + orderInfo.expressNumber).length > 0 ? '修改配送信息' : '填写配送信息' }}
        </el-button>
        <el-button
          v-if="
            (curOrderType === 'ordinary' && orderInfo.orderState === 'payed') ||
              (curOrderType === 'upgrade' && orderInfo.orderState === 'pick')
          "
          type="primary"
          @click="onNoticeShip"
          >通知发货</el-button
        >
        <el-button v-if="orderInfo.orderState === 'canceled'" type="primary" @click="onCloseOrder">关闭订单</el-button>
      </template>
      <el-button type="primary" @click="onReturn()">返回</el-button>
    </div>

    <!--对话框-->
    <el-dialog
      :title="(orderInfo.expressCompany + orderInfo.expressNumber).length > 0 ? '修改配送信息' : '填写配送信息'"
      :visible.sync="expressDlgShow"
      @open="onExpressDlgOpen"
      :close-on-click-modal="false"
    >
      <express-update :expressData="expressData" @ok="onChangeExpressOk" @cancel="onChangeExpressCancel" />
    </el-dialog>

    <el-dialog
      :title="orderInfo.agentRemark.length > 0 ? '修改客服备注' : '填写客服备注'"
      :visible.sync="agentRemarkDlgShow"
      @open="onAgentRemarkDlgOpen"
      :close-on-click-modal="false"
    >
      <el-form label-width="7rem" :model="agentRemarkData" :rules="agentRemarkRules" ref="agentRemarkUpdate">
        <el-form-item label="客服备注内容" prop="content">
          <el-input v-model="agentRemarkData.content"></el-input>
        </el-form-item>

        <div style="text-align:right;">
          <el-button type="primary" @click="onChangeAgentRemark('agentRemarkUpdate')">确定</el-button>
          <el-button type="primary" @click="agentRemarkDlgShow = false">取消</el-button>
        </div>
      </el-form>
    </el-dialog>
    <!--查看优惠券-->
    <el-dialog class="el-dlg-narrow" title="查看优惠券" :visible.sync="checkDlgShow" :close-on-click-modal="false">
      <voucher-check ref="checkComp" :processID="processID" @cancel="checkDlgShow = false"></voucher-check>
    </el-dialog>
  </div>
</template>

<script type="text/ecmascript-6">
import { convertToOrderStateLabel, convertToMoneyAmount, convertToPayTypeLabel, convertToTimeString } from '../../utils/appCommon';
import { getOrderInfo, informShip, cancelOrder, closeOrder, serviceRemark } from '../../api/order';
import expressUpdate from './express-update';
import oddevenOrderRow from '../upgrade/oddeven-order-row';
import tenoneOrderRow from '../upgrade/tenone-order-row';
import farmOrderRow from '../upgrade/farm-order-row';
import voucherCheck from '../activity/voucher-check';
import { mapGetters } from 'vuex';
export default {
  data() {
    const agentRemarkContentValidator = (rule, value, callback) => {
      if (value.length <= 0) {
        callback(new Error('备注内容不可以为空'));
      } else {
        callback();
      }
    };

    return {
      curOrderType: 'ordinary', // ordinary-普通订单 upgrade-升值订单
      orderInfo: {
        id: '',
        couponId: '',
        pType: '',
        buyerID: '',
        buyerName: '',
        telephone: '',
        payType: -1,
        gameString: '',
        orderCreateTime: '1970-01-01 00:00:00',
        orderPayTime: '',
        orderRevalueTime: '',
        orderRewardNoticeTime: '',
        orderShipTime: '',
        orderDrawMoneyTime: '',
        orderTakeDeliverTime: '',
        orderNumber: '',
        payNumber: '',
        orderState: '',
        orderMoneyAmount: 0,
        discountAmount: 0,
        orderRemark: '',
        agentRemark: '',
        receiverName: '',
        receiverTel: '',
        receiverAddress: '',
        expressCompany: '',
        expressNumber: '',
        expressId: 0
      },
      gameInfo: {
        hilomp: {
          orderNo: '',
          result: '',
          upgradeResult: ''
        },
        tenone: {
          orderNo: '',
          buyNumber: '',
          winningNumber: '',
          upgradeResult: ''
        },
        farm: {
          name: '欢乐农场',
          betIcon: '',
          winIcon: '',
          upgradeResult: '',
          issue: ''
        }
      },
      tableData: [
        {
          wareNumber: '',
          name: '',
          coverImg: '',
          price: 0.0,
          count: 0,
          couponId: ''
        }
      ],
      expressDlgShow: false,
      agentRemarkDlgShow: false,
      agentRemarkDlgShowArr: ['confirmed', 'topay', 'payed', 'unpayed', 'toship'],
      agentRemarkRules: {
        content: [{ trigger: 'blur', validator: agentRemarkContentValidator }]
      },
      expressData: {
        orderNumber: '',
        name: '',
        expressNo: '',
        id: 0
      },
      agentRemarkData: {
        content: ''
      },
      isLoading: true,
      isReadOnly: true,
      checkDlgShow: false,
      processID: -1
    };
  },
  computed: {
    ...mapGetters(['readOnlyMap'])
  },
  components: {
    expressUpdate,
    oddevenOrderRow,
    tenoneOrderRow,
    voucherCheck,
    farmOrderRow
  },
  methods: {
    convertToOrderStateLabel: convertToOrderStateLabel,
    convertToMoneyAmount: convertToMoneyAmount,
    convertToPayTypeLabel: convertToPayTypeLabel,
    convertToTimeString: convertToTimeString,
    onDlgShow(refName) {
      if (this.$refs[refName]) {
        this.$refs[refName].onInit();
      }
    },
    onReturn() {
      this.$router.back();
    },
    overdueMeg() {
      this.isLoading = false;
      this.$confirm('当前页面已过期，将返回列表页。', '', {
        confirmButtonText: '确定'
      })
        .then(() => {
          if (location.href.indexOf('/upgrade/') > 0) {
            this.$router.replace({ path: '/upgrade/order' });
          } else {
            this.$router.replace({ path: '/order/list' });
          }
        })
        .catch(() => {});
    },
    onAgentRemarkDlgOpen() {
      this.agentRemarkData.content = this.orderInfo.agentRemark;
      if (this.$refs['agentRemarkUpdate']) {
        this.$refs['agentRemarkUpdate'].validate();
      }
    },
    onChangeAgentRemark(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          const remarkInfo = {
            id: this.orderInfo.id,
            content: this.agentRemarkData.content
          };
          serviceRemark(remarkInfo)
            .then(response => {
              if (response.status === 200) {
                if (response.data.result) {
                  this.$message({
                    type: 'success',
                    message: `客服备注更新成功!`,
                    duration: 1800
                  });
                  this.orderInfo.agentRemark = remarkInfo.content;
                  this.agentRemarkDlgShow = false;
                } else {
                  this.$message({
                    type: 'error',
                    message: `客服备注更新失败：${response.data.message}`,
                    duration: 1800
                  });
                }
              } else {
                this.$message({
                  type: 'error',
                  message: `客服备注更新失败 ${response.status}：${response.statusText}`,
                  duration: 1800
                });
              }
            })
            .catch(err => {
              this.$message.error('客服备注更新失败:' + err.message);
            });
        } else {
          return false;
        }
      });
    },
    onExpressDlgOpen() {
      this.expressData.orderNumber = this.orderInfo.orderNumber;
      this.expressData.name = this.orderInfo.expressCompany;
      this.expressData.expressNo = this.orderInfo.expressNumber;
      this.expressData.id = this.orderInfo.expressId;
    },
    onNoticeShip() {
      this.$confirm(`将发送订单 “${this.orderInfo.orderNumber}” 的通知发货邮件, 是否继续?`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          const orderInfoPara = { orderNo: this.orderInfo.orderNumber };
          informShip(orderInfoPara)
            .then(response => {
              if (response.status === 200) {
                if (response.data.result) {
                  this.$message({
                    type: 'success',
                    message: `订单 “${this.orderInfo.orderNumber}” 通知发货成功!`,
                    duration: 1800
                  });
                  this.orderInfo.orderState = 'toship';
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
    onChangeExpressCancel() {
      this.expressDlgShow = false;
    },
    onChangeExpressOk(newInfo) {
      this.orderInfo.expressCompany = newInfo.name;
      this.orderInfo.expressNumber = newInfo.expressNo;
      this.orderInfo.orderState = 'shipped';
      this.expressDlgShow = false;
    },
    onCancelOrder() {
      this.$confirm(`将取消订单 “${this.orderInfo.orderNumber}” , 是否继续?`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          const orderInfo = { orderNo: this.orderInfo.orderNumber };
          cancelOrder(orderInfo)
            .then(response => {
              if (response.status === 200) {
                if (response.data.result) {
                  this.$message({
                    type: 'success',
                    message: `订单 “${this.orderInfo.orderNumber}” 取消成功!`,
                    duration: 1800
                  });
                  this.orderInfo.orderState = 'canceled';
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
    onCloseOrder() {
      this.$confirm(`将关闭订单 “${this.orderInfo.orderNumber}” , 是否继续?`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          const orderInfo = { orderNo: this.orderInfo.orderNumber };
          closeOrder(orderInfo)
            .then(response => {
              if (response.status === 200) {
                if (response.data.result) {
                  this.$message({
                    type: 'success',
                    message: `订单 “${this.orderInfo.orderNumber}” 关闭成功!`,
                    duration: 1800
                  });
                  this.orderInfo.orderState = 'closed';
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
    }
  },
  created() {
    if (this.$route.params.orderData && Object.getOwnPropertyNames(this.$route.params.orderData).length > 0) {
      if (!this.readOnlyMap[this.$route.path]) {
        this.isReadOnly = false;
      }

      if (this.$route.name === 'upgrade-order-check' || this.$route.params.orderData.orderNumber.slice(0, 1) === '2') {
        this.curOrderType = 'upgrade';
      }

      this.tableData.length = 0;
      this.$delete(this.tableData, 0);

      this.orderInfo.id = this.$route.params.orderData.id;
      this.orderInfo.couponId = this.$route.params.orderData.couponId;
      this.orderInfo.pType = this.$route.params.orderData.pType;

      this.orderInfo.orderNumber = this.$route.params.orderData.orderNumber;
      // 通过order id请求后台获取详细信息
      const getInfo = { orderNo: this.orderInfo.orderNumber };
      if (this.curOrderType === 'upgrade') {
        getInfo.orderType = 2;
        this.orderInfo.gameString = this.$route.params.orderData.gameString;
      } else {
        getInfo.orderType = 1;
      }
      getOrderInfo(getInfo)
        .then(response => {
          if (response.status === 200) {
            if (response.data.orders.length > 0) {
              const resData = response.data.orders[0];

              this.orderInfo.buyerID = resData.user.id;
              this.orderInfo.buyerName = resData.user.nickname;
              this.orderInfo.telephone = resData.user.phone;

              this.orderInfo.payType = resData.orderPay.payType;
              this.orderInfo.payNumber = resData.orderPay.runningNumber;

              this.orderInfo.orderCreateTime = resData.order.createTime;
              this.orderInfo.orderNumber = resData.order.orderNo;
              this.orderInfo.orderState = resData.order.state;
              this.orderInfo.orderMoneyAmount = resData.order.totalPrice;
              this.orderInfo.discountAmount = resData.order.discountAmount;
              this.orderInfo.orderRemark = resData.order.orderRemark;
              this.orderInfo.agentRemark = resData.order.serviceRemark;

              this.orderInfo.receiverName = resData.order.consignee;
              this.orderInfo.receiverTel = resData.order.phone;
              this.orderInfo.receiverAddress = resData.order.detailedAddress;

              this.orderInfo.expressCompany = resData.express.name;
              this.orderInfo.expressNumber = resData.express.expressNo;

              const orderTimes = resData.logs;
              orderTimes.reverse(); // 时间倒序，处理有多个支付时间的情况
              /*
                             操作时间：{1：取消订单，2：关闭订单，3：支付，4：发货，5：收货 6：退款}
                             */
              orderTimes.forEach((value, index) => {
                switch (value.operate) {
                  case 3: {
                    this.orderInfo.orderPayTime = value.createTime;
                    break;
                  }
                  case 4: {
                    this.orderInfo.orderShipTime = value.createTime;
                    break;
                  }
                  case 5: {
                    this.orderInfo.orderTakeDeliverTime = value.createTime;
                    break;
                  }
                  case 6: {
                    this.orderInfo.orderDrawMoneyTime = value.createTime;
                    break;
                  }
                  default: {
                    break;
                  }
                }
              });

              if (resData.buyRecord) {
                this.gameInfo.tenone.orderNo = resData.buyRecord.orderNo;
                this.gameInfo.tenone.buyNumber = resData.buyRecord.buyRecord;
                this.gameInfo.tenone.winningNumber = resData.buyRecord.code;
                this.gameInfo.tenone.upgradeResult = resData.order.gameInfo;
                this.orderInfo.orderRevalueTime = resData.buyRecord.creatTime;
                this.orderInfo.orderRewardNoticeTime = resData.buyRecord.updateTime;
              }

              if (resData.hilomp) {
                this.gameInfo.hilomp.result = resData.hilomp.result;
                this.gameInfo.hilomp.orderNo = resData.hilomp.orderNo;
                this.gameInfo.hilomp.orderState = resData.order.state;
                this.gameInfo.hilomp.upgradeResult = resData.order.gameInfo;
                this.orderInfo.orderRevalueTime = resData.hilomp.updateTime;
              }

              if (resData.farmBetLog) {
                let failIcons = resData.farmBetLog.farmiconNameFail;
                failIcons = typeof failIcons === 'string' ? failIcons : '';
                let winIcons = resData.farmBetLog.farmiconNameSuccess;
                winIcons = typeof winIcons === 'string' ? winIcons : '';
                if (failIcons.length > 0 && winIcons.length > 0) {
                  this.gameInfo.farm.betIcon = failIcons + ',' + winIcons;
                } else {
                  this.gameInfo.farm.betIcon = failIcons + winIcons;
                }
                this.gameInfo.farm.winIcon = resData.farmBetLog.openIcon;
                this.gameInfo.farm.upgradeResult = resData.order.gameInfo;
                this.gameInfo.farm.issue = resData.farmBetLog.issue + '';
              }

              resData.products.forEach((value, index) => {
                const oneItem = {
                  wareNumber: value.product.skuNo,
                  name: value.product.name,
                  coverImg: value.product.headImage,
                  price: value.product.price,
                  count: value.orderProduct.amount,
                  couponId: value.product.couponId
                };
                this.$set(this.tableData, index, oneItem);
              });
            } else {
              this.$message({
                type: 'error',
                message: `获取订单详情失败：服务器返回数据为空`,
                duration: 1800
              });
            }
          } else {
            this.$message({
              type: 'error',
              message: `获取订单详情失败 ${response.status}：${response.statusText}`,
              duration: 1800
            });
          }
          this.isLoading = false;
        })
        .catch(err => {
          this.isLoading = false;
          this.$message.error('获取订单详情失败:' + err.message);
        });

      //                this.orderInfo.buyerID = this.$route.params.orderData.buyerID;
      //                this.orderInfo.orderNumber = this.$route.params.orderData.orderNumber;
      //                this.orderInfo.orderState = this.$route.params.orderData.orderState;

      //                this.tableData[0].name = this.$route.params.orderData.wareName;
    } else {
      this.overdueMeg();
    }
  }
};
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
.display-table {
  display: table;
  width: 100%;
  border-collapse: separate;
  border-spacing: 2px;
}
.display-table-row {
  display: table-row;
}
.display-table-cell {
  position: relative;
  display: table-cell;
  border: 1px solid #bfcbd9;
  padding: 8px;
  .table-cell-text {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translateX(-50%) translateY(-50%);
    font-size: 15px;
    color: #48576a;
  }
  .info-list {
    list-style: none;
    padding-left: 1.2rem;
    li {
      margin: 13px 0;
      .title-label {
        display: inline-block;
        width: 100px;
        text-align: right;
        margin-right: 1rem;
      }
    }
  }
}
.btn-group {
  text-align: right;
  margin: 1rem 7px;
}
</style>

<style rel="stylesheet/scss" lang="scss">
.table-cell-img {
  vertical-align: middle;
  width: 56px;
  margin: 2px;
  border: 1px solid #c7bcbc;
  border-radius: 9px;
}
</style>
