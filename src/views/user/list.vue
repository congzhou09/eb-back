<template>
  <div class="app-container">
    <el-tabs value="1">
      <el-tab-pane :disabled="true" label="用户列表" name="1">
        <!--筛选控件-->
        <el-card :body-style="{ padding: '10px 20px' }">
          <el-form :inline="true" :model="sortOptions" :rules="sortFormRules" ref="sortForm">
            <el-form-item label="用户ID" prop="ID">
              <el-input v-model="sortOptions.ID"></el-input>
            </el-form-item>

            <el-form-item label="昵称" prop="name">
              <el-input v-model="sortOptions.name"></el-input>
            </el-form-item>

            <el-form-item label="手机号" prop="telephone">
              <el-input v-model="sortOptions.telephone"></el-input>
            </el-form-item>
            <el-form-item label="申请日期">
              <el-date-picker v-model="sortOptions.timeRange" type="daterange" placeholder="选择日期范围"> </el-date-picker>
            </el-form-item>
            <el-form-item label="最后消费时间">
              <el-date-picker v-model="sortOptions.sellTimeRange" type="daterange" placeholder="选择日期范围"> </el-date-picker>
            </el-form-item>

            <el-form-item>
              <el-button type="primary" @click="onSort">筛选</el-button>
              <el-button type="primary" @click="onRefresh">刷新</el-button>
            </el-form-item>
          </el-form>
        </el-card>

        <!--表格-->
        <el-table v-loading="isLoading" :data="tableData" border style="width: 100%">
          <el-table-column align="center" prop="ID" label="用户ID" width="100"> </el-table-column>
          <el-table-column align="center" label="昵称">
            <template slot-scope="scope">
              <router-link :to="{ name: 'user-check', params: { from: 'list', userData: scope.row } }"
                ><!--from参数用于左侧菜单点亮-->
                <span style="color:#20a0ff;">{{ scope.row.name }}</span>
              </router-link>
              <span v-if="!scope.row.name">-</span>
            </template>
          </el-table-column>
          <el-table-column align="center" label="UUID" width="125">
            <template slot-scope="scope">
              <span v-if="!scope.row.UUID.length || scope.row.UUID.length <= 0">-</span>
              <span v-else>{{ scope.row.UUID }}</span>
            </template>
          </el-table-column>
          <el-table-column align="center" prop="telephone" label="手机号" width="125">
            <template slot-scope="scope">
              {{ scope.row.telephone }}
              <span v-if="!scope.row.telephone">-</span>
            </template>
          </el-table-column>
          <el-table-column align="center" label="账户金额">
            <template slot-scope="scope">
              {{ convertToMoneyAmount(scope.row.remainMoneyAmount) }}
            </template>
          </el-table-column>
          <el-table-column align="center" label="账户金币">
            <template slot-scope="scope">
              {{ scope.row.remainGoldAmount }}
            </template>
          </el-table-column>
          <el-table-column align="center" label="注册时间">
            <template slot-scope="scope">
              {{ convertToTimeString(scope.row.regTime) }}
            </template>
          </el-table-column>
          <!--<el-table-column align="center" label="上次登录时间">
                        <template slot-scope="scope">
                            {{convertToTimeString(scope.row.lastloginTime)}}
                        </template>
                    </el-table-column>-->
          <el-table-column align="center" label="最后充值时间">
            <template slot-scope="scope">
              {{ convertToTimeString(scope.row.rechargeTime) }}
            </template>
          </el-table-column>
          <el-table-column align="center" label="最后消费时间">
            <template slot-scope="scope">
              {{ convertToTimeString(scope.row.sellTime) }}
            </template>
          </el-table-column>
          <el-table-column align="center" label="操作" v-if="!isReadOnly">
            <template slot-scope="scope">
              <router-link :to="{ name: 'edit', params: { userData: scope.row } }">
                <el-button type="text" size="small">编辑</el-button>
              </router-link>
              <span style="margin: 0 5px;color:rgb(27, 110, 171);">|</span>
              <el-button type="text" size="small" @click="onFreeze(scope.row)">封号</el-button>
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
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script type="text/ecmascript-6">
import { convertToMoneyAmount, convertToTimeString } from '../../utils/appCommon';
import { getUserList, changeUserState } from '../../api/user';
import { mapGetters } from 'vuex';
export default {
  data() {
    function idValidator(rule, value, callback) {
      if (value.match(/[\u4e00-\u9fa5]/)) {
        callback(new Error('不可以包含中文'));
      } else {
        callback();
      }
    }
    function nameValidator(rule, value, callback) {
      callback();
    }
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
        ID: '',
        name: '',
        telephone: '',
        timeRange: [],
        sellTimeRange: []
      },
      sortFormRules: {
        ID: [{ trigger: 'blur', validator: idValidator }],
        name: [{ trigger: 'blur', validator: nameValidator }],
        telephone: [{ trigger: 'blur', validator: telephoneValidator }]
      },
      tableData: [
        {
          UUID: '1001',
          ID: '1000054',
          name: '克林',
          telephone: '15125489589',
          remainMoneyAmount: 200.9,
          regTime: '2016-05-02 12:01',
          lastloginTime: '2016-09-01 12:01'
        }
      ],
      currentPage: !isNaN(parseInt(window.localStorage.getItem('curPage'))) ? parseInt(window.localStorage.getItem('curPage')) : 1,
      pageSize: 10,
      totalSize: 0,
      isLoading: true,
      isReadOnly: true
    };
  },
  computed: {
    ...mapGetters(['readOnlyMap'])
  },
  methods: {
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
          const listInfo = {
            user: {
              id: this.sortOptions.ID,
              nickname: this.sortOptions.name,
              phone: this.sortOptions.telephone,
              state: 0
            },
            page: this.currentPage - 1,
            pageSize: this.pageSize,
            beginTime:
              this.sortOptions.timeRange && this.sortOptions.timeRange.length > 0 && this.sortOptions.timeRange[0]
                ? this.convertToTimeString(this.sortOptions.timeRange[0]).slice(0, 10)
                : '',
            endTime:
              this.sortOptions.timeRange && this.sortOptions.timeRange.length > 0 && this.sortOptions.timeRange[1]
                ? this.convertToTimeString(this.sortOptions.timeRange[1]).slice(0, 10)
                : '',
            beginConsumeTime:
              this.sortOptions.sellTimeRange && this.sortOptions.sellTimeRange.length > 0 && this.sortOptions.sellTimeRange[0]
                ? this.convertToTimeString(this.sortOptions.sellTimeRange[0]).slice(0, 10)
                : '',
            endConsumeTime:
              this.sortOptions.sellTimeRange && this.sortOptions.sellTimeRange.length > 0 && this.sortOptions.sellTimeRange[1]
                ? this.convertToTimeString(this.sortOptions.sellTimeRange[1]).slice(0, 10)
                : ''
          };
          //   	        		console.log('value',listInfo);
          getUserList(listInfo)
            .then(response => {
              if (response.status === 200) {
                const resData = response.data;
                this.totalSize = resData.totalSize;
                resData.list.forEach((value, index) => {
                  const oneUser = {
                    UUID: value.uuid,
                    ID: value.id,
                    name: value.nickname,
                    telephone: value.phone,
                    remainMoneyAmount: value.balance,
                    remainGoldAmount: value.gold,
                    regTime: value.createTime,
                    /* lastloginTime: value.lastloginTime,*/
                    rechargeTime: value.rechargeTime,
                    sellTime: value.sellTime,
                    avator: value.avatar
                  };
                  this.$set(this.tableData, index, oneUser);
                });
              } else {
                this.$message({
                  type: 'error',
                  message: `获取用户列表失败 ${response.status}：${response.statusText}`,
                  duration: 1800
                });
              }
              this.isLoading = false;
            })
            .catch(err => {
              this.$message.error('获取用户列表失败:' + err.message);
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
    onFreeze(freezUser) {
      this.$confirm(`将对用户 “${freezUser.name}” 进行封号, 是否继续?`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          const userInfo = { id: freezUser.ID, state: 1 };
          changeUserState(userInfo)
            .then(response => {
              if (response.status === 200) {
                if (response.data.result) {
                  this.$message({
                    type: 'success',
                    message: `用户 “${freezUser.name}” 封号成功!`,
                    duration: 1800
                  });

                  this.onRefresh();
                } else {
                  this.$message({
                    type: 'error',
                    message: `用户封号失败：${response.data.message}`,
                    duration: 1800
                  });
                }
              } else {
                this.$message({
                  type: 'error',
                  message: `用户封号失败 ${response.status}：${response.statusText}`,
                  duration: 1800
                });
              }
            })
            .catch(err => {
              this.$message.error('用户封号失败:' + err.message);
            });
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: '已取消封号',
            duration: 1000
          });
        });
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
  }
};
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
.el-card {
  background-color: #f9fafc;
  border: none;
  box-shadow: none;
  .el-form-item {
    margin: 10px 12px 10px 0;
  }
}
.el-table {
  margin-top: 1rem;
}
.el-tab-pane {
  overflow: auto;
}
.el-pagination {
  text-align: right;
  margin: 1rem 0;
}
</style>
