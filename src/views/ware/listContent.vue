<template>
  <div>
    <el-card :body-style="{ padding: '10px 20px' }">
      <!--操作控件-->
      <template v-if="!fromOutside && !isReadOnly">
        <router-link :to="{ path: '/ware/add' }">
          <el-button class="add-btn">发布商品</el-button>
        </router-link>
      </template>

      <el-form :inline="true" :model="sortOptions" class="sort-form-inline">
        <el-form-item label="">
          <el-select v-model="sortOptions.wareCategory" multiple placeholder="默认所有分类">
            <el-option v-for="item in wareCategoryList" :key="item.name" :label="item.name" :value="item.id"> </el-option>
          </el-select>
        </el-form-item>

        <template v-if="fromOutside">
          <el-form-item label="">
            <el-select v-model="sortOptions.wareState" multiple placeholder="默认所有状态">
              <el-option v-for="item in wareStateList" :key="item.value" :label="item.label" :value="item.value"> </el-option>
            </el-select>
          </el-form-item>
        </template>

        <el-form-item label="货号">
          <el-input v-model="sortOptions.wareNumber" :maxlength="90"></el-input>
        </el-form-item>

        <el-form-item label="名称">
          <el-input v-model="sortOptions.wareName" :maxlength="200"></el-input>
        </el-form-item>

        <el-form-item>
          <el-button type="primary" @click="onSort">筛选</el-button>
          <el-button type="primary" @click="onRefresh">刷新</el-button>
          <el-button type="primary" icon="document" @click="handleDownload" :loading="downloadLoading">导出excel</el-button>
        </el-form-item>
      </el-form>
    </el-card>

    <!--表格-->
    <el-table
      v-loading="isLoading"
      ref="theTable"
      :data="tableData"
      border
      style="width: 100%"
      @selection-change="onSelectionChange"
      @row-click="onRowClick"
      :row-class-name="getRowClassName"
    >
      <el-table-column type="selection" v-if="fromOutside"> </el-table-column>

      <el-table-column align="center" prop="wareNumber" label="货号" width="150"> </el-table-column>
      <el-table-column align="center" label="名称" min-width="204">
        <template slot-scope="scope">
          <template v-if="scope.row.state === 'invalid'">
            <del>{{ scope.row.wareName }}</del>
          </template>
          <template v-else>
            {{ scope.row.wareName }}
          </template>
        </template>
      </el-table-column>
      <el-table-column align="center" prop="category" label="所属分类" width="180"> </el-table-column>
      <el-table-column align="center" label="价格(元)">
        <template slot-scope="scope">
          {{ convertToMoneyAmount(scope.row.price) }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="状态">
        <template slot-scope="scope">
          {{ convertToWareStateLabel(scope.row.state) }}
        </template>
      </el-table-column>

      <el-table-column align="center" prop="addTime" label="添加时间" v-if="!fromOutside"> </el-table-column>

      <el-table-column align="center" label="操作" v-if="listType != 'deleted' && !fromOutside && !isReadOnly">
        <template slot-scope="scope">
          <template v-if="scope.row.state != 'invalid'">
            <router-link :to="{ name: 'ware-edit', params: { wareData: scope.row } }">
              <el-button type="text" size="small">编辑</el-button>
            </router-link>
            <span style="margin: 0 5px;color:rgb(27, 110, 171);">|</span>
          </template>

          <template v-if="scope.row.state === 'instore'">
            <el-button type="text" size="small" @click="onPutOnShelf(scope.row)">上架</el-button>
            <span style="margin: 0 5px;color:rgb(27, 110, 171);">|</span>
          </template>

          <template v-if="scope.row.state === 'onsale'">
            <el-button type="text" size="small" @click="onGetOffShelf(scope.row)">下架</el-button>
          </template>

          <template v-if="scope.row.state === 'instore'">
            <el-button type="text" size="small" @click="onDelete(scope.row)">删除</el-button>
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
import {
  wareStateList,
  convertToWareStateLabel,
  convertToMoneyAmount,
  convertToTimeString,
  deleteEmptyAttr,
  convertToCategoryLabel
} from '../../utils/appCommon';
import { getCategoryList, getWareList, changeWareState } from '../../api/ware';
import { mapGetters } from 'vuex';
export default {
  props: {
    listType: String,
    fromOutside: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      wareStateList: wareStateList,
      wareCategoryList: [],
      sortOptions: {
        wareCategory: [],
        wareState: [],
        wareNumber: '',
        wareName: ''
      },
      tableData: [],
      currentPage: !isNaN(parseInt(window.localStorage.getItem('curPage'))) ? parseInt(window.localStorage.getItem('curPage')) : 1,
      pageSize: 10,
      totalSize: 0,
      selectedItems: [],
      selectedRows: [],
      isLoading: true,
      downloadLoading: false,
      isReadOnly: true
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
        const tHeader = ['货号', '名称', '所属分类', '价格（元）', '状态', '添加时间'];
        const filterVal = ['wareNumber', 'wareName', 'category', 'price', 'state', 'addTime'];
        const list = this.tableData;
        const data = this.formatJson(filterVal, list);
        exportJsonToExcel(tHeader, data, '商品列表excel');
        this.downloadLoading = false;
      });
    },
    formatJson(filterVal, jsonData) {
      return jsonData.map(v =>
        filterVal.map(j => (j === 'price' ? convertToMoneyAmount(v[j]) : j === 'state' ? convertToWareStateLabel(v[j]) : v[j]))
      );
    },
    convertToMoneyAmount: convertToMoneyAmount,
    convertToWareStateLabel: convertToWareStateLabel,
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
        state: '',
        categoryId: this.sortOptions.wareCategory.join(','),
        skuNo: this.sortOptions.wareNumber,
        name: this.sortOptions.wareName,
        page: this.currentPage - 1,
        pageSize: this.pageSize
      };
      switch (this.listType) {
        case 'all': {
          break;
        }
        case 'onSale': {
          listInfo.state = 'onsale';
          break;
        }
        case 'offShelf': {
          listInfo.state = 'instore';
          break;
        }
        case 'deleted': {
          listInfo.state = 'invalid';
          break;
        }
        default:
          break;
      }

      deleteEmptyAttr(listInfo);

      getWareList(listInfo)
        .then(response => {
          if (response.status === 200) {
            this.totalSize = response.data.totalSize;
            response.data.list.forEach((value, index, array) => {
              const oneItem = {};
              oneItem.id = value.id;
              oneItem.wareNumber = value.skuNo;
              oneItem.wareName = value.name;
              oneItem.category = convertToCategoryLabel(this.wareCategoryList, value.categoryId);
              oneItem.price = value.price;
              oneItem.state = value.state;
              oneItem.addTime = convertToTimeString(value.createTime);

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
    onPutOnShelf(item) {
      this.$confirm(`将上架商品 “${item.wareName}” , 是否继续?`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          this.changeStatePromise(item.id, 'onsale')
            .then(() => {
              this.$message({
                type: 'success',
                message: `商品 “${item.wareName}” 上架成功!`,
                duration: 1800
              });
            })
            .catch(errMessage => {
              this.$message({
                type: 'info',
                message: `上架失败: ${errMessage}`,
                duration: 1000
              });
            });
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: `已取消上架`,
            duration: 1000
          });
        });
    },
    onGetOffShelf(item) {
      this.$confirm(`将下架商品 “${item.wareName}” , 是否继续?`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          this.changeStatePromise(item.id, 'instore')
            .then(() => {
              this.$message({
                type: 'success',
                message: `商品 “${item.wareName}” 下架成功!`,
                duration: 1800
              });
            })
            .catch(errMessage => {
              this.$message({
                type: 'info',
                message: `下架失败: ${errMessage}`,
                duration: 1000
              });
            });
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: `已取消下架`,
            duration: 1000
          });
        });
    },
    onDelete(item) {
      this.$confirm(`将删除商品 “${item.wareName}” , 是否继续?`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          this.changeStatePromise(item.id, 'invalid')
            .then(() => {
              this.$message({
                type: 'success',
                message: `商品 “${item.wareName}” 删除成功!`,
                duration: 1800
              });
            })
            .catch(errMessage => {
              this.$message({
                type: 'info',
                message: `删除失败: ${errMessage}`,
                duration: 1000
              });
            });
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: `已取消删除`,
            duration: 1000
          });
        });
    },
    onSelectionChange(value) {
      this.selectedItems = value;
      this.$emit('selectedWareChange', this.selectedItems);
    },
    onRowClick(row, event, column) {
      if (this.fromOutside) {
        // 点击表格行则toggle此行item的选中状态
        if (column.type != 'selection') {
          this.$refs.theTable.toggleRowSelection(row);
        }
      }
    },
    getRowClassName(row, index) {
      if (this.fromOutside) {
        for (let i = 0; i < this.selectedItems.length; i++) {
          if (this.selectedItems[i].wareNumber === row.wareNumber && this.selectedItems[i].wareName === row.wareName) {
            return 'selected-row';
          }
        }
        return '';
      }
      return '';
    },
    getCategoryListPromise() {
      // 获取分类信息
      return new Promise((resolve, reject) => {
        getCategoryList()
          .then(response => {
            if (response.status === 200) {
              response.data.forEach((value, index, array) => {
                this.$set(this.wareCategoryList, index, value);
              });

              resolve();
            } else {
              this.$message({
                type: 'error',
                message: `获取分类失败 ${response.status}：${response.statusText}`,
                duration: 1800
              });

              reject();
            }
          })
          .catch(err => {
            this.$message.error('获取分类失败:' + err.message);
            reject();
          });
      });
    },
    getLastSortOptions() {
      const lastSortOptions = window.localStorage.getItem('sortOptions');
      if (lastSortOptions && lastSortOptions.length > 0) {
        const lastSortOptionsObj = JSON.parse(lastSortOptions);
        for (const oneProp in this.sortOptions) {
          if (Object.prototype.hasOwnProperty.call(this.sortOptions, oneProp)) {
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
    this.getCategoryListPromise()
      .then(() => {
        const lastListType = window.localStorage.getItem('wareListCurrentType');

        if (lastListType && lastListType.length > 0) {
          if (this.listType === lastListType) {
            this.onRefresh();
          }
        } else if (this.listType === 'all') {
          this.onRefresh();
        }
      })
      .catch(err => {
        // console.log(err.message);
        this.$message({
          type: 'error',
          message: `因网络原因，页面初始化失败,请刷新页面`,
          duration: 1800
        });
      });

    if (!this.readOnlyMap[this.$route.path]) {
      this.isReadOnly = false;
    }
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
.el-table .selected-row {
  background: #a5f5f9;
}
</style>
