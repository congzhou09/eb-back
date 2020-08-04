<!--充值卡管理&#45;&#45;内容-->
<template>
  <div>
    <!--操作控件-->
    <el-card :body-style="{ padding: '10px 20px' }">
      <template v-if="this.listType === 'noGive'">
        <el-button class="add-btn" @click="onAddCard">添加充值卡</el-button>
      </template>
      <!--:rules="sortOptionFormRules"-->
      <el-form :inline="true" :model="sortOptions" ref="sortOptionForm" class="sort-form-inline">
        <el-form-item label="时段" v-if="this.listType === 'give'">
          <el-date-picker v-model="sortOptions.timeRange" type="daterange" :editable="false" placeholder="选择日期范围"> </el-date-picker>
        </el-form-item>
        <el-form-item label="ID" prop="cardId" v-if="this.listType === 'give'">
          <el-input v-model="sortOptions.cardId" :maxlength="30"></el-input>
        </el-form-item>

        <el-form-item label="订单号" prop="orderNumber" v-if="this.listType === 'give'">
          <el-input v-model="sortOptions.orderNumber" :maxlength="90"></el-input>
        </el-form-item>

        <el-form-item label="商品名称" v-if="this.listType === 'noGive'">
          <el-input v-model="sortOptions.productName" :maxlength="200"></el-input>
        </el-form-item>
        <el-form-item label="用户ID" prop="userId" v-if="this.listType === 'give'">
          <el-input v-model="sortOptions.userId" :maxlength="200"></el-input>
        </el-form-item>

        <el-form-item style="margin-left: 10px;">
          <el-button type="primary" @click="onSort">筛选</el-button>
          <el-button type="primary" @click="onRefresh">刷新</el-button>
          <!--<el-button type="primary" icon="document" @click="handleDownload" :loading="downloadLoading">导出excel</el-button>-->
        </el-form-item>
      </el-form>
    </el-card>

    <!--表格  v-loading="isLoading" -->
    <el-table v-loading="isLoading" :data="tableData" border style="width: 100%">
      <el-table-column align="center" prop="cardId" label="ID" width="80"> </el-table-column>
      <el-table-column align="center" prop="cardNo" label="卡号" width="130"> </el-table-column>
      <el-table-column align="center" prop="cardPwd" label="密码" width="130"> </el-table-column>
      <el-table-column align="center" prop="productName" label="关联商品" v-if="this.listType === 'noGive'"> </el-table-column>
      <el-table-column align="center" label="状态" width="120">
        <template slot-scope="scope">
          <!--{{convertToOrderStateLabel(scope.row.orderState)}}-->
          {{ scope.row.orderState }}
        </template>
      </el-table-column>

      <el-table-column align="center" label="领取时间" v-if="this.listType === 'give'">
        <template slot-scope="scope">
          {{ convertToTimeString(scope.row.receivedTime) }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="添加时间" v-if="this.listType === 'noGive'">
        <template slot-scope="scope">
          {{ convertToTimeString(scope.row.createTime) }}
        </template>
      </el-table-column>
      <el-table-column align="center" prop="orderNo" label="领取订单号" v-if="this.listType === 'give'"> </el-table-column>
      <el-table-column align="center" prop="userId" label="用户ID" v-if="this.listType === 'give'"> </el-table-column>
      <el-table-column align="center" prop="nickName" label="用户昵称" v-if="this.listType === 'give'"> </el-table-column>
      <el-table-column align="center" label="操作" v-if="this.listType === 'noGive'">
        <template slot-scope="scope">
          <template v-if="!scope.row.type">
            <el-button type="text" size="small" @click="onEditCard(scope.row.cardId)">修改</el-button>
          </template>
          <template v-if="!scope.row.type">
            <span class="btn-seperator">|</span>
            <el-button type="text" size="small" @click="onDelete(scope.row)">删除</el-button>
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

    <!-- :title="((orderInfo.expressCompany+orderInfo.expressNumber).length>0)?'修改充值卡':'添加充值卡'"-->

    <!--添加/修改充值卡对话框-->
    <el-dialog class="el-dlg-narrow" :visible.sync="cardAdEdDlgShow" @open="onCardDlgOpen" :close-on-click-modal="false">
      <card-update ref="cardUpdateComp" :operType="dlgOperType" :cardId="curCardId" @ok="onAdEdCardOk" @cancel="onChangeCardCancel" />
    </el-dialog>
  </div>
</template>

<script type="text/ecmascript-6">
import { convertToTimeString } from '../../utils/appCommon';
import { getCardList, deleteCard } from '../../api/mall';
import cardUpdate from './card-update';
import { mapGetters } from 'vuex';
export default {
  props: {
    listType: String
  },
  data() {
    const cardIdValidator = (rule, value, callback) => {
      if (!/^[0-9]*$/.test(value)) {
        callback(new Error('请输入正确格式的ID'));
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
    const userIdValidator = (rule, value, callback) => {
      if (!/^[0-9]*$/.test(value)) {
        callback(new Error('请输入正确格式的用户ID'));
      } else {
        callback();
      }
    };
    return {
      currentPage: !isNaN(parseInt(window.localStorage.getItem('curPage'))) ? parseInt(window.localStorage.getItem('curPage')) : 1,
      pageSize: 10,
      totalSize: 0,
      cardAdEdDlgShow: false,
      curCardId: -1,
      sortOptions: {
        cardId: '',
        timeRange: [],
        orderNumber: '',
        productName: '',
        userId: ''
      },
      sortOptionFormRules: {
        cardId: [{ trigger: 'blur', validator: cardIdValidator }],
        orderNumber: [{ trigger: 'blur', validator: orderNoValidator }],
        userId: [{ trigger: 'blur', validator: userIdValidator }]
      },
      tableData: [],
      isLoading: false,
      isReadOnly: true
    };
  },
  computed: {
    ...mapGetters(['readOnlyMap']),
    dlgOperType: function() {
      if (this.curCardId === -1) {
        return 'add';
      } else {
        return 'edit';
      }
    }
  },
  components: {
    cardUpdate
  },
  methods: {
    convertToTimeString: convertToTimeString,
    onAddCard() {
      this.curCardId = -1;
      this.cardAdEdDlgShow = true;
    },
    onEditCard(oneCardId) {
      this.curCardId = oneCardId;
      this.cardAdEdDlgShow = true;
    },
    onCardDlgOpen() {
      if (this.$refs['cardUpdateComp']) {
        this.$refs['cardUpdateComp'].onInit();
      }
    },
    onChangeCardCancel() {
      this.cardAdEdDlgShow = false;
    },
    onAdEdCardOk() {
      //             this.tableData.orderNo = newInfo.orderNo;
      this.onRefresh();
      this.cardAdEdDlgShow = false;
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
      const cardList = {
        status: 1,
        userId: this.sortOptions.userId,
        //                        cardNo: this.sortOptions.cardNo,
        cardId: this.sortOptions.cardId,
        orderNo: this.sortOptions.orderNumber,
        productName: this.sortOptions.productName,
        timeStartStr:
          this.sortOptions.timeRange && this.sortOptions.timeRange.length > 0 && this.sortOptions.timeRange[0]
            ? this.convertToTimeString(this.sortOptions.timeRange[0]).slice(0, 10)
            : '',
        timeEndStr:
          this.sortOptions.timeRange && this.sortOptions.timeRange.length > 0 && this.sortOptions.timeRange[1]
            ? this.convertToTimeString(this.sortOptions.timeRange[1]).slice(0, 10)
            : '',
        curtPage: this.currentPage,
        pageSize: this.pageSize
      };
      if (this.listType != 'noGive') {
        cardList.status = 2;
      }
      getCardList(cardList)
        .then(response => {
          if (response.data.code === 200) {
            const resDatas = response.data.resData;
            this.totalSize = response.data.resData.totalSize;

            resDatas.list.forEach((value, index) => {
              // var wareList = value.products;
              const oneItem = {
                cardId: value.cardId,
                cardNo: value.cardNo,
                orderNo: value.orderNo,
                cardPwd: value.cardPwd,
                productName: value.productName,
                orderState: value.statusStr,
                createTime: value.createTime,
                receivedTime: value.receivedTime,
                userId: value.userId,
                nickName: value.nickName
              };

              this.$set(this.tableData, index, oneItem);
            });
            this.isLoading = false;
          } else {
            this.$message({
              type: 'error',
              message: `获取充值卡列表失败 ${response.data.code}：${response.data.message}`,
              duration: 1800
            });
          }
          this.isLoading = false;
        })
        .catch(err => {
          this.$message.error('获取充值卡列表失败:' + err.message);
          this.isLoading = false;
        });
    },
    onDelete(item) {
      this.$confirm(`将删除充值卡 “${item.productName}” , 是否继续?`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          const deleteInfo = { cardId: item.cardId };
          deleteCard(deleteInfo)
            .then(response => {
              if (response.data.code === 200) {
                if (response.data.result) {
                  this.$message({
                    type: 'success',
                    message: `充值卡 “${item.productName}” 删除成功!`,
                    duration: 1800
                  });
                  this.onRefresh();
                } else {
                  this.$message({
                    type: 'success',
                    message: `充值卡 “${item.productName}” 删除失败：${response.data.message}`,
                    duration: 1800
                  });
                }
              } else {
                this.$message({
                  type: 'error',
                  message: `${response.data.code}：${response.statusText}`,
                  duration: 1800
                });
              }
            })
            .catch(err => {
              this.$message.error(err);
            });
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除',
            duration: 1000
          });
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

    const curListType = window.localStorage.getItem('cardListCurrentType');

    if (curListType) {
      if (this.listType === curListType) {
        this.onRefresh();
      }
    } else if (this.listType === 'noGive') {
      this.onRefresh();
    }
  }
};
</script>

<style rel="stylesheet/scss" lang="scss">
.el-dlg-narrow {
  .el-dialog {
    width: 415px;
  }
}
</style>
<style rel="stylesheet/scss" lang="scss" scoped>
.el-card {
  background-color: #f9fafc;
  border: none;
  box-shadow: none;
  .add-btn {
    margin: 10px 12px 10px 0;
    float: left;
  }
  .el-form-item {
    margin: 10px 12px 10px 0;
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
