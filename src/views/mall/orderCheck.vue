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
                <li><label class="title-label">买家ID：</label>{{ orderInfo.buyerID }}</li>
                <li><label class="title-label">昵称：</label>{{ orderInfo.buyerName }}</li>
                <li><label class="title-label">手机号：</label>{{ orderInfo.telephone }}</li>
                <!--<li><label class="title-label">支付方式：</label>{{convertToPayTypeLabel(orderInfo.payType)}}</li>-->
                <li><label class="title-label">下单时间：</label>{{ convertToTimeData(orderInfo.orderCreateTime) }}</li>
                <li><label class="title-label">发货时间：</label>{{ convertToTimeData(orderInfo.orderSendTime) }}</li>
                <li><label class="title-label">完成时间：</label>{{ convertToTimeData(orderInfo.orderEndTime) }}</li>
                <!--<li v-if="orderInfo.orderPayTime"><label class="title-label">支付时间：</label>{{convertToTimeString(orderInfo.orderPayTime)}}</li>-->
                <!--<li v-if="orderInfo.orderRevalueTime"><label class="title-label">升值时间：</label>{{convertToTimeString(orderInfo.orderRevalueTime)}}</li>-->
                <!--<li v-if="orderInfo.orderRewardNoticeTime"><label class="title-label">开奖时间：</label>{{convertToTimeString(orderInfo.orderRewardNoticeTime)}}</li>-->
                <li v-if="orderInfo.orderShipTime">
                  <label class="title-label">发货时间：</label>{{ convertToTimeString(orderInfo.orderShipTime) }}
                </li>
                <!--<li v-if="orderInfo.orderTakeDeliverTime"><label class="title-label">收货时间：</label>{{convertToTimeString(orderInfo.orderTakeDeliverTime)}}</li>-->
                <!--<li v-if="orderInfo.orderDrawMoneyTime"><label class="title-label">退款时间：</label>{{convertToTimeString(orderInfo.orderDrawMoneyTime)}}</li>-->
              </ul>
            </div>
          </div>

          <div class="display-table-row">
            <div class="display-table-cell" style="width:200px">
              <span class="table-cell-text">订单信息</span>
            </div>
            <div class="display-table-cell">
              <ul class="info-list">
                <li><label class="title-label">订单号：</label>{{ orderInfo.orderNumber }}</li>
                <li>
                  <label class="title-label">订单状态：</label>
                  {{ convertToOrderStateLabel(orderInfo.orderState) }}
                  <!--{{orderInfo.orderState}}-->
                </li>
                <li>
                  <label class="title-label">订单金额：</label>
                  <!--{{convertToMoneyAmount(orderInfo.orderMoneyAmount)}}（金币）-->
                  {{ orderInfo.orderMoneyAmount }}（金币）
                </li>

                <li>
                  <label class="title-label">客服备注：</label>{{ orderInfo.agentRemark }}<span v-show="!orderInfo.agentRemark">无</span>
                  <el-button
                    v-if="!isReadOnly && agentRemarkDlgShowArr.indexOf(orderInfo.orderState) >= 0"
                    style="margin-left: 20px;"
                    type="text"
                    @click="agentRemarkDlgShow = true"
                  >
                    {{ !orderInfo.agentRemark == '' ? '修改' : '添加' }}
                  </el-button>
                </li>
              </ul>
            </div>
          </div>

          <div class="display-table-row" v-show="isdetails1">
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
          <div class="display-table-row" v-show="isdetails1">
            <div class="display-table-cell" style="width:200px">
              <span class="table-cell-text">配送信息</span>
            </div>
            <div class="display-table-cell">
              <ul class="info-list">
                <li>
                  <label class="title-label">配送方：</label>{{ orderInfo.expressCompany
                  }}<span v-show="!orderInfo.expressCompany">无</span>
                </li>
                <li>
                  <label class="title-label">快递单号：</label>{{ orderInfo.expressNumber
                  }}<span v-show="!orderInfo.expressNumber">无</span>
                </li>
              </ul>
            </div>
          </div>
          <div class="display-table-row" v-show="isdetails2">
            <div class="display-table-cell" style="width:200px">
              <span class="table-cell-text">充值卡</span>
            </div>
            <div class="display-table-cell">
              <ul v-if="orderInfo.cardList.length > 0" class="info-list">
                <template v-for="(cards, index) in orderInfo.cardList">
                  <li :key="index">
                    <label class="title-label">卡号：</label>{{ cards.cardNo }}
                    <em style="display: block; height: 10px;"></em>
                    <label class="title-label">密码：</label>{{ cards.cardPwd }}
                  </li>
                </template>
              </ul>
              <ul v-else class="info-list">
                <li>
                  <label class="title-label">卡号：</label>无
                  <em style="display: block; height: 10px;"></em>
                  <label class="title-label">密码：</label>无
                </li>
              </ul>
            </div>
          </div>
        </div>
      </el-tab-pane>
      <el-tab-pane label="商品信息" name="wareInfo">
        <el-table :data="tableData" style="width: 100%">
          <el-table-column align="center" prop="mallNumber" label="商品货号"> </el-table-column>
          <el-table-column align="center" prop="name" label="商品名称">
            <template slot-scope="scope">
              <img class="table-cell-img" :src="scope.row.coverImg" /><label>{{ scope.row.name }}</label>
            </template>
          </el-table-column>
          <el-table-column align="center" label="商品价格">
            <template slot-scope="scope"> {{ scope.row.price }}金币 </template>
          </el-table-column>
          <el-table-column align="center" prop="count" label="商品数量"> </el-table-column>
        </el-table>
      </el-tab-pane>
    </el-tabs>

    <!--按钮-->
    <div class="btn-group">
      <template v-if="!isReadOnly">
        <el-button v-if="orderInfo.orderState === 'payed'" type="primary" @click="onCancelOrder">取消订单</el-button>
        <el-button
          v-if="(orderInfo.orderState === 'toship' || orderInfo.orderState === 'shipped') && curOrderType === 1"
          type="primary"
          @click="expressDlgShow = true"
        >
          {{ !(orderInfo.expressCompany + orderInfo.expressNumber) == '' ? '修改配送信息' : '填写配送信息' }}
        </el-button>
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
      :title="!orderInfo.agentRemark == '' ? '修改客服备注' : '填写客服备注'"
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
  </div>
</template>

<script type="text/ecmascript-6">
import {
  convertToOrderStateLabel,
  convertToTimeData,
  convertToMoneyAmount,
  convertToPayTypeLabel,
  convertToTimeString
} from '../../utils/appCommon';
import { getOrderInfo, informShip, cancelOrder, serviceRemark } from '../../api/mall';
import expressUpdate from './express-update';
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
      isdetails1: false,
      isdetails2: false,
      curOrderType: 1, // 1-普通订单 2-充值卡订单
      orderInfo: {
        id: '',
        buyerID: '',
        buyerName: '',
        telephone: '',
        gameString: '',
        orderCreateTime: '1970-01-01 00:00:00',
        orderShipTime: '',
        orderNumber: '',
        orderState: '',
        orderMoneyAmount: 0,
        agentRemark: '',
        receiverName: '',
        receiverTel: '',
        receiverAddress: '',
        expressCompany: '',
        expressNumber: '',
        expressId: 0,
        cardList: [
          {
            cardNo: '',
            cardPwd: ''
          }
        ]
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
        }
      },
      tableData: [
        {
          mallNumber: '',
          name: '',
          coverImg: '',
          price: 0.0,
          count: 0
        }
      ],
      expressDlgShow: false,
      agentRemarkDlgShow: false,
      agentRemarkDlgShowArr: [
        /* "payed",
                        "payed",
                        "unpayed",
                        "toship",*/
        'payed',
        'toship'
      ],
      agentRemarkRules: {
        content: [{ trigger: 'blur', validator: agentRemarkContentValidator }]
      },
      expressData: {
        orderNumber: '',
        name: '',
        expressNo: '',
        exName: '',
        exExpressNo: '',
        id: 0
      },
      agentRemarkData: {
        content: ''
      },
      isLoading: true,
      isReadOnly: true
    };
  },
  computed: {
    ...mapGetters(['readOnlyMap'])
  },
  components: {
    expressUpdate
  },
  methods: {
    convertToOrderStateLabel: convertToOrderStateLabel,
    convertToMoneyAmount: convertToMoneyAmount,
    convertToPayTypeLabel: convertToPayTypeLabel,
    convertToTimeString: convertToTimeString,
    convertToTimeData: convertToTimeData,
    onReturn() {
      this.$router.back();
    },
    overdueMeg() {
      this.isLoading = false;
      this.$confirm('当前页面已过期，将返回列表页。', '', {
        confirmButtonText: '确定'
      })
        .then(() => {
          this.$router.replace({ path: '/order/list' });
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
            orderNo: this.orderInfo.orderNumber,
            serviceRemark: this.agentRemarkData.content
          };
          serviceRemark(remarkInfo)
            .then(response => {
              if (response.data.code === 200) {
                if (response.data.result) {
                  this.$message({
                    type: 'success',
                    message: `客服备注更新成功!`,
                    duration: 1800
                  });
                  this.orderInfo.agentRemark = remarkInfo.content;
                  this.orderInfo.agentRemark = remarkInfo.serviceRemark;
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
                  message: `客服备注更新失败 ${response.data.code}：${response.data.message}`,
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
      this.expressData.exName = this.orderInfo.expressCompany;
      this.expressData.expressNo = this.orderInfo.expressNumber;
      this.expressData.exExpressNo = this.orderInfo.expressNumber;

      //                this.expressData.id = this.orderInfo.expressId;
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
      this.orderInfo.orderState = 'shipped'; // 已发货
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
              if (response.data.code === 200) {
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

      this.tableData.length = 0;
      this.$delete(this.tableData, 0);

      this.orderInfo.id = this.$route.params.orderData.id;
      this.orderInfo.orderNumber = this.$route.params.orderData.orderNumber;

      // 通过order id请求后台获取详细信息
      const getInfo = { orderNo: this.orderInfo.orderNumber };
      /*   if(this.curOrderType === "2")
                {
                    getInfo.orderType = 2;
                   // this.orderInfo.gameString = this.$route.params.orderData.gameString;
                }
                else
                {
                    getInfo.orderType = 1;
                }*/
      getOrderInfo(getInfo)
        .then(response => {
          if (response.data.code === 200) {
            if (response.data.resData.orderInfo !== '') {
              const resDatas = response.data.resData.orderInfo;
              this.orderInfo.buyerID = resDatas.userId;
              this.orderInfo.buyerName = resDatas.nickName;
              this.orderInfo.telephone = resDatas.userPhone;

              this.orderInfo.orderCreateTime = resDatas.createTime;
              this.orderInfo.orderSendTime = resDatas.sendTime;
              this.orderInfo.orderEndTime = resDatas.endTime;
              this.orderInfo.orderNumber = resDatas.orderNo;
              this.orderInfo.orderState = resDatas.status;
              this.orderInfo.orderMoneyAmount = resDatas.totalPrice;
              //                            this.orderInfo.discountAmount = resDatas.discountAmount;
              this.orderInfo.orderRemark = resDatas.orderRemark;
              this.orderInfo.agentRemark = resDatas.serviceRemark;

              const orderT = resDatas.orderType;

              if (orderT === 1) {
                this.isdetails1 = true;
                this.isdetails2 = false;
                this.curOrderType = 1;
                this.orderInfo.receiverName = resDatas.receiver;
                this.orderInfo.receiverTel = resDatas.receiverPhone;
                this.orderInfo.receiverAddress = resDatas.detailAddress;

                this.orderInfo.expressCompany = response.data.resData.orderExpressInfo.orderExpressName;
                this.orderInfo.expressNumber = response.data.resData.orderExpressInfo.expressNo;
              } else {
                this.isdetails1 = false;
                this.isdetails2 = true;
                this.curOrderType = 2;

                const dstData = this.orderInfo;
                const cardData = response.data.resData;
                // 清空旧数据
                dstData.cardList.length = 0;
                this.$delete(dstData.cardList, 0);
                for (let i = 0; i < cardData.cardList.length; i++) {
                  const oneCard = { cardNo: cardData.cardList[i].cardNo, cardPwd: cardData.cardList[i].cardPwd };
                  this.$set(dstData.cardList, i, oneCard);
                }
              }

              const productData = response.data.resData;
              productData.productListInfo.forEach((value, index) => {
                const oneItem = {
                  mallNumber: value.skuNo,
                  name: value.name,
                  coverImg: value.headImage,
                  price: value.price,
                  count: value.amount
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
              message: `获取订单详情失败 ${response.data.code}：${response.data.message}`,
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
