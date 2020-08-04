<template>
  <div>
    <el-card :body-style="{ padding: '10px 20px' }">
      <!--操作控件-->
      <el-button
        v-if="listType != 'invalid' && !isReadOnly"
        class="add-btn"
        @click="
          addDlgShow = true;
          onDlgShow('addComp');
        "
        >新增优惠券</el-button
      >

      <el-form :inline="true" :model="sortOptions" class="sort-form-inline">
        <el-form-item label="类型">
          <el-select v-model="sortOptions.voucherType" placeholder="默认所有类型">
            <el-option :key="-1" label="全部类型" :value="-1"></el-option>
            <el-option v-for="item in voucherTypeList" :key="item.value" :label="item.label" :value="item.value"> </el-option>
          </el-select>
        </el-form-item>

        <el-form-item>
          <el-button type="primary" @click="onSort">筛选</el-button>
          <el-button type="primary" @click="onRefresh">刷新</el-button>
        </el-form-item>
      </el-form>
    </el-card>

    <!--表格-->
    <el-table v-loading="isLoading" ref="theTable" :data="tableData" border style="width: 100%">
      <el-table-column align="center" label="优惠券名称">
        <template slot-scope="scope">
          <template v-if="scope.row.state === 0">
            <del>{{ scope.row.name }}</del>
          </template>
          <template v-else>
            {{ scope.row.name }}
          </template>
        </template>
      </el-table-column>
      <el-table-column align="center" prop="value" label="面值"> </el-table-column>
      <el-table-column align="center" prop="duration" label="有效期"> </el-table-column>
      <el-table-column align="center" label="领取/发放人次">
        <template slot-scope="scope">
          <el-button
            type="text"
            @click="
              processID = scope.row.id;
              voucherUsersDlgShow = true;
              onDlgShow('voucherUsersComp');
            "
            >{{ scope.row.getcount }}</el-button
          >
        </template>
      </el-table-column>
      <el-table-column align="center" prop="addTime" label="添加时间"> </el-table-column>
      <el-table-column align="center" label="类型">
        <template slot-scope="scope">
          {{ convertToVoucherTypeLabel(scope.row.type) }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="状态">
        <template slot-scope="scope">
          {{ convertToVoucherStateLabel(scope.row.state) }}
        </template>
      </el-table-column>

      <el-table-column align="center" label="操作" v-if="listType != 'deleted'">
        <template slot-scope="scope">
          <template>
            <el-button
              type="text"
              size="small"
              @click="
                processID = scope.row.id;
                checkDlgShow = true;
                onDlgShow('checkComp');
              "
              >查看</el-button
            >
          </template>

          <template v-if="!isReadOnly">
            <template v-if="scope.row.state === 1">
              <span style="margin: 0 5px;color:rgb(27, 110, 171);">|</span>
              <el-button
                type="text"
                size="small"
                @click="
                  processID = scope.row.id;
                  editDlgShow = true;
                  onDlgShow('editComp');
                "
                >编辑</el-button
              >
            </template>

            <template v-if="scope.row.type === 2 && scope.row.state === 1">
              <span style="margin: 0 5px;color:rgb(27, 110, 171);">|</span>
              <el-button
                type="text"
                size="small"
                @click="
                  processID = scope.row.id;
                  sendDlgShow = true;
                "
                >发放</el-button
              >
            </template>

            <template v-if="scope.row.state === 1">
              <span style="margin: 0 5px;color:rgb(27, 110, 171);">|</span>
              <el-button type="text" size="small" @click="onLetInvalid(scope.row)">使失效</el-button>
            </template>
          </template>
        </template>
      </el-table-column>
    </el-table>

    <!--分页-->
    <el-pagination
      :current-page="currentPage"
      :page-size="pageSize"
      :page-sizes="[10, 30, 50, 100]"
      layout="total, sizes, prev, pager, next, jumper"
      :total="totalSize"
      @size-change="onSizeChange"
      @current-change="onCurrentChange"
    >
    </el-pagination>

    <!--弹出框-->
    <el-dialog title="新增优惠券" :visible.sync="addDlgShow" :close-on-click-modal="false">
      <voucher-add
        ref="addComp"
        curType="add"
        @ok="
          addDlgShow = false;
          onRefresh();
        "
        @cancel="addDlgShow = false"
      ></voucher-add>
    </el-dialog>
    <el-dialog title="编辑优惠券" :visible.sync="editDlgShow" :close-on-click-modal="false">
      <voucher-add
        ref="editComp"
        curType="edit"
        :processID="processID"
        @ok="
          editDlgShow = false;
          onRefresh();
        "
        @cancel="editDlgShow = false"
      ></voucher-add>
    </el-dialog>
    <el-dialog
      class="el-dlg-narrow"
      title="发放优惠券"
      :visible.sync="sendDlgShow"
      :close-on-click-modal="false"
      @open="onSendVoucherDlgShow"
    >
      <el-form label-width="4rem" :model="voucherSendForm" ref="voucherSendForm">
        <el-form-item label="用户ID" prop="voucherSendUserID" :rules="{ trigger: 'blur', validator: userIDValidator }" required>
          <el-input style="width: 305px;" v-model="voucherSendForm.voucherSendUserID" :maxlength="20"></el-input>
        </el-form-item>
      </el-form>
      <div class="btn-group">
        <el-button type="primary" @click="onSendVoucher">确定</el-button>
        <el-button type="primary" @click="sendDlgShow = false">取消</el-button>
      </div>
    </el-dialog>
    <el-dialog class="el-dlg-narrow" title="查看优惠券" :visible.sync="checkDlgShow" :close-on-click-modal="false">
      <voucher-check ref="checkComp" :processID="processID" @cancel="checkDlgShow = false"></voucher-check>
    </el-dialog>
    <el-dialog title="查看领取用户" :visible.sync="voucherUsersDlgShow" :close-on-click-modal="false">
      <voucher-user-list ref="voucherUsersComp" :processID="processID" @cancel="voucherUsersDlgShow = false"></voucher-user-list>
    </el-dialog>
  </div>
</template>

<script type="text/ecmascript-6">
import { voucherTypeList, convertToVoucherTypeLabel, convertToVoucherStateLabel, convertToMoneyAmount } from '../../utils/appCommon';
import { getVoucherList, letVoucherInvalid, sendVoucherToUser } from '../../api/activity';
import { validatorID } from '../../utils/validate';
import voucherAdd from './voucher-add';
import voucherCheck from './voucher-check';
import voucherUserList from './voucher-user-list';
import { mapGetters } from 'vuex';
export default {
  props: {
    listType: String
  },
  data() {
    return {
      sortOptions: {
        voucherType: -1
      },
      voucherTypeList: voucherTypeList,
      voucherSendForm: {
        voucherSendUserID: ''
      },
      tableData: [
        {
          id: '1122',
          name: '新人专享',
          value: '1.00(满10)',
          duration: '7天',
          getcount: '30/100',
          addTime: '2017-07-25',
          type: '新人优惠券',
          state: 1
        }
      ],
      currentPage: !isNaN(parseInt(window.localStorage.getItem('curPage'))) ? parseInt(window.localStorage.getItem('curPage')) : 1,
      totalSize: 0,
      pageSize: 10,
      selectedItems: [],
      selectedRows: [],
      isLoading: true,
      addDlgShow: false,
      editDlgShow: false,
      sendDlgShow: false,
      checkDlgShow: false,
      voucherUsersDlgShow: false,
      processID: -1,
      isReadOnly: true
    };
  },
  computed: {
    ...mapGetters(['readOnlyMap'])
  },
  methods: {
    convertToMoneyAmount: convertToMoneyAmount,
    convertToVoucherTypeLabel: convertToVoucherTypeLabel,
    convertToVoucherStateLabel: convertToVoucherStateLabel,
    userIDValidator(rule, value, callback) {
      if (!value || value.length <= 0) {
        callback(new Error('不可以为空'));
      } else {
        return validatorID(rule, value, callback);
      }
    },
    onSendVoucher() {
      this.$refs['voucherSendForm'].validate(valid => {
        if (valid) {
          const voucherInfo = { couponId: this.processID, userId: this.voucherSendForm.voucherSendUserID };
          sendVoucherToUser(voucherInfo)
            .then(response => {
              if (response.status === 200) {
                if (response.data.result) {
                  this.$message({
                    type: 'success',
                    message: `发送个人优惠券成功!`,
                    duration: 1800
                  });
                  this.sendDlgShow = false;
                } else {
                  this.$message({
                    type: 'error',
                    message: `发送个人优惠券失败：${response.data.message}`,
                    duration: 1800
                  });
                }
              } else {
                this.$message({
                  type: 'error',
                  message: `发送个人优惠券失败 ${response.status}：${response.statusText}`,
                  duration: 1800
                });
              }
            })
            .catch(err => {
              this.$message.error('发送个人优惠券失败:' + err.message);
            });
        } else {
          return false;
        }
      });
    },
    onDlgShow(refName) {
      if (this.$refs[refName]) {
        this.$refs[refName].onInit();
      }
    },
    onSort() {
      window.localStorage.setItem('sortOptions', JSON.stringify(this.sortOptions));

      const lastCurPage = parseInt(window.localStorage.getItem('curPage'));
      if (!isNaN(lastCurPage)) {
        this.currentPage = lastCurPage;
      }

      this.isLoading = true;
      this.tableData.length = 0;
      this.$delete(this.tableData, 0);

      const listInfo = { type: this.sortOptions.voucherType, curtPage: this.currentPage, pageSize: this.pageSize };
      switch (this.listType) {
        case 'all': {
          listInfo.status = -1;
          break;
        }
        case 'valid': {
          listInfo.status = 1;
          break;
        }
        case 'invalid': {
          listInfo.status = 0;
          break;
        }
        default:
          break;
      }

      getVoucherList(listInfo)
        .then(response => {
          if (response.status === 200) {
            if (response.data.result) {
              const resData = response.data.resData;
              this.totalSize = resData.totalSize;
              resData.list.forEach((value, index, array) => {
                const oneItem = {};
                oneItem.id = value.couponId;
                oneItem.name = value.couponName;
                oneItem.value = value.faceValue;
                oneItem.duration = value.termOfValidity;
                oneItem.getcount = value.hadReleasedNum;
                oneItem.addTime = value.createTime;
                oneItem.type = value.type;
                oneItem.state = value.status;

                this.$set(this.tableData, index, oneItem);
              });
            } else {
              this.$message({
                type: 'error',
                message: `获取优惠券列表失败：${response.data.message}`,
                duration: 1800
              });
            }
          } else {
            this.$message({
              type: 'error',
              message: `获取优惠券列表失败 ${response.status}：${response.statusText}`,
              duration: 1800
            });
          }
          this.isLoading = false;
        })
        .catch(err => {
          this.isLoading = false;
          this.$message.error('获取优惠券列表失败:' + err.message);
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
    onLetInvalid(item) {
      this.$confirm(`将使优惠券“${item.name}”失效（会影响到已发出的优惠券，慎用）, 是否继续?`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          const voucherInfo = { couponId: item.id };
          letVoucherInvalid(voucherInfo)
            .then(response => {
              if (response.status === 200) {
                if (response.data.result) {
                  this.$message({
                    type: 'success',
                    message: `使优惠券失效操作成功!`,
                    duration: 1800
                  });
                  this.onRefresh();
                } else {
                  this.$message({
                    type: 'error',
                    message: `使优惠券失效操作失败：${response.data.message}`,
                    duration: 1800
                  });
                }
              } else {
                this.$message({
                  type: 'error',
                  message: `使优惠券失效操作失败 ${response.status}：${response.statusText}`,
                  duration: 1800
                });
              }
            })
            .catch(err => {
              this.$message.error('使优惠券失效操作失败:' + err.message);
            });
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: `已取消使优惠券失效`,
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
    },
    onSendVoucherDlgShow() {
      if (this.$refs['voucherSendForm']) {
        this.$refs['voucherSendForm'].resetFields();
      }
    }
  },
  created() {
    const lastListType = window.localStorage.getItem('curListType');

    if (lastListType && lastListType.length > 0) {
      if (this.listType === lastListType) {
        this.onRefresh();
      }
    } else if (this.listType === 'all') {
      this.onRefresh();
    }
    if (!this.readOnlyMap[this.$route.path]) {
      this.isReadOnly = false;
    }
  },
  components: {
    voucherAdd,
    voucherCheck,
    voucherUserList
  }
};
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
.btn-group {
  position: relative;
  text-align: right;
  margin: 1rem 7px 0 0;
}
.el-card {
  background-color: #f9fafc;
  border: none;
  box-shadow: none;
  .add-btn {
    margin: 10px 12px 10px 0;
  }
  .el-form-item {
    margin: 10px 12px 10px 0;
  }
}
.sort-form-inline {
  position: relative;
  display: inline;
}
.el-select {
  width: 150px;
}
.el-table {
  margin-top: 1rem;
  .selected-row {
    background: #c9e5f5;
  }
}
.el-pagination {
  text-align: right;
  margin: 1rem 0;
}
</style>
<style rel="stylesheet/scss" lang="scss">
.el-dlg-narrow {
  .el-dialog {
    width: 415px;
  }
}
</style>
