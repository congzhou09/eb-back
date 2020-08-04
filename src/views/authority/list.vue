<template>
  <div class="app-container">
    <el-tabs value="first">
      <el-tab-pane :disabled="true" label="管理员列表" name="first">
        <!--操作控件-->
        <el-card :body-style="{ padding: '10px 20px' }">
          <el-button @click="onAddNew" class="add-btn">添加管理员</el-button>
          <el-form :inline="true" :model="sortOptions" class="sort-form-inline">
            <el-form-item label="管理员名称">
              <el-input v-model="sortOptions.nickname" placeholder="默认不筛选"></el-input>
            </el-form-item>

            <el-form-item>
              <el-button type="primary" @click="onSort">筛选</el-button>
              <el-button type="primary" @click="onRefresh">刷新</el-button>
            </el-form-item>
          </el-form>
        </el-card>

        <!--表格-->
        <el-table :data="tableData" border style="width: 100%">
          <el-table-column align="center" prop="id" label="管理员ID" width="180"> </el-table-column>
          <el-table-column align="center" prop="name" label="管理员名称" width="180"> </el-table-column>
          <el-table-column align="center" label="角色类型" width="180">
            <template slot-scope="scope">
              {{ convertToAdminRoleLabel(scope.row.roleId) }}
            </template>
          </el-table-column>
          <el-table-column align="center" prop="email" label="电子邮箱"> </el-table-column>
          <el-table-column align="center" prop="creatTime" label="添加时间"> </el-table-column>
          <el-table-column align="center" label="操作">
            <template slot-scope="scope">
              <router-link :to="{ name: 'password', params: { authData: scope.row } }" v-if="scope.row.roleId != 1">
                <el-button type="text" size="small">重置密码</el-button>
              </router-link>
            </template>
          </el-table-column>
        </el-table>

        <!--分页-->
        <el-pagination
          :current-page="currentPage"
          :page-size="pageSize"
          layout="total, prev, pager, next, jumper"
          :total="totalSize"
          @current-change="onCurrentChange"
        >
        </el-pagination>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script type="text/ecmascript-6">
import { getAdminList } from '../../api/authority';
import { convertToAdminRoleLabel, convertToTimeString } from '../../utils/appCommon';
export default {
  data() {
    return {
      sortOptions: {
        nickname: ''
      },
      tableData: [],
      currentPage: !isNaN(parseInt(window.localStorage.getItem('curPage'))) ? parseInt(window.localStorage.getItem('curPage')) : 1,
      pageSize: 10,
      totalSize: 2
    };
  },
  methods: {
    convertToTimeString,
    convertToAdminRoleLabel: convertToAdminRoleLabel,
    onSort() {
      window.localStorage.setItem('sortOptions', JSON.stringify(this.sortOptions));

      const lastCurPage = parseInt(window.localStorage.getItem('curPage'));
      if (!isNaN(lastCurPage)) {
        this.currentPage = lastCurPage;
      }

      const listInfo = {
        page: this.currentPage - 1,
        pageSize: this.pageSize,
        name: this.sortOptions.nickname
      };
      this.tableData.length = 0;
      this.$delete(this.tableData, 0);
      getAdminList(listInfo)
        .then(response => {
          if (response.status === 200) {
            this.totalSize = response.data.totalSize;
            response.data.list.forEach((value, index, array) => {
              value.creatTime = convertToTimeString(value.creatTime);
              this.$set(this.tableData, index, value);
            });
          } else {
            this.$message({
              type: 'error',
              message: `${response.status}：${response.statusText}`,
              duration: 1800
            });
          }
        })
        .catch(err => {
          this.$message.error(err);
        });
    },
    onRefresh() {
      this.getLastSortOptions();
      this.onSort();
    },
    onAddNew() {
      this.$router.push('/authority/add');
    },
    onResetPassword(rowObj) {
      console.log(rowObj.ID, rowObj.name);
      this.$router.push(`/authority/password?ID=${rowObj.ID}&name=${rowObj.name}`);
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
  },
  mounted() {
    this.onSort();
  }
};
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
.el-card {
  background-color: #f9fafc;
  border: none;
  box-shadow: none;
  .add-btn {
    margin: 10px 32px 10px 0;
  }
  .el-form-item {
    margin: 10px 12px 10px 0;
  }
}
.sort-form-inline {
  position: relative;
  display: inline;
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
