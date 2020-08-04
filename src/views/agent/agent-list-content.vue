<template>
  <div>
    <el-card :body-style="{ padding: '10px 20px' }">
      <!--操作控件-->
      <el-button
        v-if="listType === 'valid' && !isReadOnly"
        class="add-btn"
        @click="
          addDlgShow = true;
          onDlgShow('addComp');
        "
        >新增代理</el-button
      >

      <el-form :inline="true" :model="sortOptions" class="sort-form-inline">
        <el-form-item label="代理ID">
          <el-input v-model="sortOptions.agentID" :maxlength="90"></el-input>
        </el-form-item>

        <el-form-item label="用户ID">
          <el-input v-model="sortOptions.userID" :maxlength="90"></el-input>
        </el-form-item>

        <el-form-item label="等级">
          <el-select v-model="sortOptions.agentGrades" multiple placeholder="默认所有等级">
            <el-option v-for="item in agentGradeList" :key="item.value" :label="item.label" :value="item.value"> </el-option>
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
      <el-table-column align="center" label="代理ID" prop="agentID"> </el-table-column>
      <el-table-column align="center" label="代理等级" prop="agentGrade" width="120"> </el-table-column>
      <el-table-column align="center" prop="userID" label="用户ID"> </el-table-column>
      <el-table-column align="center" prop="nickName" label="昵称"> </el-table-column>
      <el-table-column align="center" prop="telephone" label="手机号"> </el-table-column>
      <el-table-column align="center" prop="staffCount" label="绑定用户数"> </el-table-column>
      <el-table-column align="center" label="月销售额">
        <template slot-scope="scope">
          {{ convertToMoneyAmount(scope.row.monthSale) }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="月收入">
        <template slot-scope="scope">
          {{ convertToMoneyAmount(scope.row.monthIncome) }}
        </template>
      </el-table-column>
      <el-table-column align="center" prop="addTime" label="添加时间"> </el-table-column>

      <el-table-column align="center" label="操作">
        <template slot-scope="scope">
          <template>
            <router-link :to="{ name: 'agent-check', params: { agentData: scope.row } }">
              <el-button type="text" size="small">查看</el-button>
            </router-link>
          </template>

          <template v-if="!isReadOnly">
            <template v-if="listType === 'valid'">
              <span style="margin: 0 5px;color:rgb(27, 110, 171);">|</span>
              <el-button type="text" size="small" @click="onLetInvalid(scope.row)">取消资格</el-button>
            </template>

            <template v-if="listType === 'invalid'">
              <span style="margin: 0 5px;color:rgb(27, 110, 171);">|</span>
              <el-button type="text" size="small" @click="onLetValid(scope.row)">恢复资格</el-button>
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
    <el-dialog class="el-dlg-narrow" title="新增代理" :visible.sync="addDlgShow" :close-on-click-modal="false">
      <agent-add
        ref="addComp"
        @ok="
          addDlgShow = false;
          onRefresh();
        "
        @cancel="addDlgShow = false"
      ></agent-add>
    </el-dialog>
  </div>
</template>

<script type="text/ecmascript-6">
import { convertToMoneyAmount } from '../../utils/appCommon';
import { agentGradeList } from '../../utils/agentCommon';
import { getAgentList, letAgentInvalid, letAgentValid } from '../../api/agent';
import agentAdd from './agent-add';
import { mapGetters } from 'vuex';
export default {
  props: {
    listType: String
  },
  data() {
    return {
      agentGradeList: agentGradeList,
      sortOptions: {
        agentID: '',
        userID: '',
        agentGrades: []
      },
      tableData: [
        {
          agentID: 11,
          agentGrade: '高级代理',
          userID: 1102,
          nickName: '圧帕王',
          telephone: '18215554454',
          staffCount: 20,
          monthSale: 200,
          monthIncome: 2,
          state: 1,
          addTime: '2017-07-25 11:25:40'
        }
      ],
      currentPage: !isNaN(parseInt(window.localStorage.getItem('curPage'))) ? parseInt(window.localStorage.getItem('curPage')) : 1,
      totalSize: 0,
      pageSize: 10,
      selectedItems: [],
      selectedRows: [],
      isLoading: true,
      addDlgShow: false,
      isReadOnly: true
    };
  },
  computed: {
    ...mapGetters(['readOnlyMap'])
  },
  methods: {
    convertToMoneyAmount: convertToMoneyAmount,
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

      const listInfo = {
        proxyId: this.sortOptions.agentID,
        userId: this.sortOptions.userID,
        curtPage: this.currentPage,
        pageSize: this.pageSize,
        proxyLevel: this.sortOptions.agentGrades.join(',')
      };
      switch (this.listType) {
        case 'valid': {
          listInfo.status = 1; // 1-正常 0-封号
          break;
        }
        case 'invalid': {
          listInfo.status = 0;
          break;
        }
        default: {
          break;
        }
      }

      getAgentList(listInfo)
        .then(response => {
          if (response.status === 200) {
            const resData = response.data.resData;
            this.totalSize = resData.totalSize;
            resData.list.forEach((value, index, array) => {
              const oneItem = {};
              oneItem.agentID = value.proxyId;
              oneItem.agentGrade = value.proxyLevel;
              oneItem.userID = value.userId;
              oneItem.nickName = value.nickName;
              oneItem.telephone = value.mobile;
              oneItem.staffCount = value.bindNum;
              oneItem.monthSale = value.monthlySales;
              oneItem.monthIncome = value.monthlyIncome;
              oneItem.addTime = value.standardTime;

              this.$set(this.tableData, index, oneItem);
            });
          } else {
            this.$message({
              type: 'error',
              message: `获取分类失败 ${response.status}：${response.statusText}`,
              duration: 1800
            });
          }
          this.isLoading = false;
        })
        .catch(err => {
          this.isLoading = false;
          this.$message.error('获取列表失败:' + err.message);
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
    changeStatePromise(id, state) {
      return new Promise((resolve, reject) => {
        const wareInfo = { id: id, state: state };
        changeWareState(wareInfo)
          .then(response => {
            if (response.status === 200) {
              this.onRefresh();
              resolve();
            } else {
              reject(`修改商品状态失败: ${response.status}：${response.statusText}`);
            }
          })
          .catch(err => {
            reject(err.message);
          });
      });
    },
    onLetValid(item) {
      this.$confirm(`将恢复用户 “${item.nickName}” 的代理资格, 是否继续?`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          letAgentValid({ proxyId: item.agentID })
            .then(response => {
              if (response.status === 200) {
                if (response.data.code === 200) {
                  this.$message({
                    type: 'success',
                    message: `用户 “${item.nickName}” 的代理资格恢复成功!`,
                    duration: 1800
                  });
                  this.onRefresh();
                } else {
                  this.$message({
                    type: 'error',
                    message: `代理资格恢复失败 ${response.data.message}`,
                    duration: 1800
                  });
                }
              } else {
                this.$message({
                  type: 'error',
                  message: `代理资格恢复失败 ${response.status}：${response.statusText}`,
                  duration: 1800
                });
              }
            })
            .catch(errMessage => {
              this.$message({
                type: 'info',
                message: `代理资格恢复失败: ${errMessage}`,
                duration: 1000
              });
            });
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: `已取消代理资格的恢复`,
            duration: 1000
          });
        });
    },
    onLetInvalid(item) {
      this.$confirm(`将取消用户 “${item.nickName}” 的代理资格, 是否继续?`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          letAgentInvalid({ proxyId: item.agentID })
            .then(response => {
              if (response.status === 200) {
                if (response.data.code === 200) {
                  this.$message({
                    type: 'success',
                    message: `用户 “${item.nickName}” 的代理资格取消成功!`,
                    duration: 1800
                  });
                  this.onRefresh();
                } else {
                  this.$message({
                    type: 'error',
                    message: `代理资格取消失败 ${response.data.message}`,
                    duration: 1800
                  });
                }
              } else {
                this.$message({
                  type: 'error',
                  message: `代理资格取消失败 ${response.status}：${response.statusText}`,
                  duration: 1800
                });
              }
            })
            .catch(errMessage => {
              this.$message({
                type: 'info',
                message: `代理资格取消失败: ${errMessage}`,
                duration: 1000
              });
            });
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: `已取消代理资格的取消`,
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
    const lastListType = window.localStorage.getItem('curListType');

    if (lastListType && lastListType.length > 0) {
      if (this.listType === lastListType) {
        this.onRefresh();
      }
    } else if (this.listType === 'valid') {
      this.onRefresh();
    }

    if (!this.readOnlyMap[this.$route.path]) {
      this.isReadOnly = false;
    }
  },
  components: {
    agentAdd
  }
};
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
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
