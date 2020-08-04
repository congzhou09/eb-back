<template>
  <div>
    <!--操作控件-->
    <el-card :body-style="{ padding: '10px 20px' }">
      <el-button class="add-btn" @click="addWareDlgShow = true">新增促销商品</el-button>

      <el-form :inline="true" :model="sortOptions" class="sort-form-inline">
        <el-form-item label="">
          <el-select v-model="sortOptions.baseWareCategory" multiple placeholder="默认所有分类">
            <el-option v-for="item in wareCategoryList" :key="item.id" :label="item.name" :value="item.id"> </el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="">
          <el-select v-model="sortOptions.gameType" multiple placeholder="默认所有玩法">
            <el-option v-for="item in gameTypeList" :key="item.id" :label="item.name" :value="item.id"> </el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="基础商品">
          <el-input v-model="sortOptions.baseWareName"></el-input>
        </el-form-item>

        <el-form-item style="margin-left: 10px;">
          <el-button type="primary" @click="onSort">筛选</el-button>
          <el-button type="primary" @click="onRefresh">刷新</el-button>
        </el-form-item>
      </el-form>
    </el-card>

    <!--表格-->
    <el-table v-loading="isLoading" :data="tableData" border style="width: 100%">
      <el-table-column align="center" type="index" label="序号" width="80"> </el-table-column>
      <el-table-column align="center" prop="baseWare" label="基础商品"> </el-table-column>
      <el-table-column align="center" label="所属分类" width="100">
        <template slot-scope="scope">
          {{ convertToCategoryLabel(wareCategoryList, scope.row.category) }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="价格(元)" width="90">
        <template slot-scope="scope">
          {{ convertToMoneyAmount(scope.row.price) }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="所属玩法" width="100">
        <template slot-scope="scope">
          {{ convertToGametypeLabel(gameTypeList, scope.row.gameType) }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="奖励区域" width="150">
        <template slot-scope="scope">
          <span v-if="scope.row.gameType === 3">{{ convertTofarmModel(scope.row.level) }}</span>
          <span v-else>-</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="添加时间">
        <template slot-scope="scope">
          {{ convertToTimeString(scope.row.addTime) }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="升值商品">
        <template slot-scope="scope">
          <el-popover ref="popover" placement="left-end" width="200" trigger="hover" @show="onPopOverShow(scope.$index, scope.row.id)">
            <el-table v-if="scope.row.upgradeWare.length > 0" :data="scope.row.upgradeWare">
              <el-table-column align="center" property="name" label="商品列表"></el-table-column>
            </el-table>
            <p v-if="scope.row.upgradeWare.length <= 0">数据获取中……</p>
          </el-popover>
          <el-button type="text" size="small" v-popover:popover>查看</el-button>
        </template>
      </el-table-column>

      <el-table-column align="center" label="操作" v-if="listType != 'deleted'">
        <template slot-scope="scope">
          <router-link :to="{ name: 'pair-edit', params: { pairData: scope.row } }">
            <el-button type="text" size="small">编辑</el-button>
          </router-link>

          <template v-if="listType === 'onSale'">
            <span style="margin: 0 5px;color:rgb(27, 110, 171);">|</span>
            <el-button type="text" size="small" @click="onGetOffShelf(scope.row)">下架</el-button>
          </template>

          <template v-if="listType === 'offShelf'">
            <span style="margin: 0 5px;color:rgb(27, 110, 171);">|</span>
            <el-button type="text" size="small" @click="onPutOnShelf(scope.row)">上架</el-button>
          </template>

          <template v-if="listType === 'offShelf'">
            <span style="margin: 0 5px;color:rgb(27, 110, 171);">|</span>
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

    <el-dialog :visible.sync="addWareDlgShow" @open="onAddWareDlgOpen" :close-on-click-modal="false">
      <pair-add-ware ref="addWareContent" @selectWareComplete="onSelectWareComplete" />
    </el-dialog>
  </div>
</template>

<script type="text/ecmascript-6">
import {
  convertToMoneyAmount,
  convertToTimeString,
  convertToCategoryLabel,
  convertToGametypeLabel,
  deleteEmptyAttr,
  convertTofarmModel
} from '../../utils/appCommon';
import pairAddWare from './pair-add-ware';
import { getCategoryList } from '../../api/ware';
import { getPairList, getGameList, getUpgradeWareList, changePairState } from '../../api/upgrade';
export default {
  props: {
    listType: String
  },
  data() {
    return {
      test: 'popover1',
      wareCategoryList: [],
      gameTypeList: [],
      sortOptions: {
        baseWareCategory: [],
        gameType: '',
        baseWareName: ''
      },
      tableData: [
        {
          id: 1,
          baseWare: '香蕉',
          category: '水果',
          price: 32,
          upgradeWare: [{ name: '香蕉' }, { name: '饼干' }],
          gameType: '十选一',
          addTime: '2017-05-02 12:09'
        },
        {
          id: 2,
          baseWare: '肉串',
          category: '肉类',
          price: 64,
          upgradeWare: [{ name: '肉串' }, { name: '黑胡椒' }],
          gameType: '选奇偶',
          addTime: '2017-05-02 18:09'
        }
      ],
      currentPage: !isNaN(parseInt(window.localStorage.getItem('curPage'))) ? parseInt(window.localStorage.getItem('curPage')) : 1,
      pageSize: 10,
      totalSize: 0,
      addWareDlgShow: false,
      isLoading: true
    };
  },
  components: {
    pairAddWare
  },
  methods: {
    convertToMoneyAmount: convertToMoneyAmount,
    convertToTimeString: convertToTimeString,
    convertToCategoryLabel: convertToCategoryLabel,
    convertToGametypeLabel: convertToGametypeLabel,
    convertTofarmModel: convertTofarmModel,
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
        categoryId: this.sortOptions.baseWareCategory.join(','),
        gameId: this.sortOptions.gameType.join(','),
        name: this.sortOptions.baseWareName,
        page: this.currentPage - 1,
        pageSize: this.pageSize
      };
      switch (this.listType) {
        case 'onSale': {
          listInfo.state = 0;
          break;
        }
        case 'offShelf': {
          listInfo.state = 1;
          break;
        }
        case 'deleted': {
          listInfo.state = 2;
          break;
        }
        default: {
          listInfo.state = 0;
          break;
        }
      }
      deleteEmptyAttr(listInfo);

      getPairList(listInfo)
        .then(response => {
          if (response.status === 200) {
            this.totalSize = response.data.totalSize;
            response.data.list.forEach((value, index, array) => {
              const oneItem = {};
              oneItem.id = value.id;
              oneItem.baseWare = value.product.name;
              oneItem.category = value.product.categoryId;
              oneItem.price = value.product.price;
              oneItem.upgradeWare = [];
              oneItem.gameType = value.gameId;
              oneItem.level = value.level;
              oneItem.addTime = value.createtime;

              this.$set(this.tableData, index, oneItem);
            });
          } else {
            this.$message({
              type: 'error',
              message: `获取促销商品列表失败 ${response.status}：${response.statusText}`,
              duration: 1800
            });
          }
          this.isLoading = false;
        })
        .catch(err => {
          this.isLoading = false;
          this.$message.error('获取促销商品列表失败:' + err.message);
          throw new Error('获取促销商品列表失败:' + err.message);
        });
    },
    onAddWareDlgOpen() {
      if (this.$refs.addWareContent && this.$refs.addWareContent.initData) {
        this.$refs.addWareContent.initData();
      }
    },
    onRefresh() {
      this.getLastSortOptions();
      //                console.log(`type="${this.listType}" 获取数据并更新`);
      this.onSort();
    },
    onSizeChange(val) {
      this.pageSize = val;
      this.onSort();
    },
    onCurrentChange(val) {
      this.currentPage = val;
      window.localStorage.setItem('curPage', val);
      this.onSort();
    },
    onPopOverShow(index, pairId) {
      console.log(pairId);
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
    onPutOnShelf(item) {
      this.$confirm(`将上架商品 “${item.baseWare}” , 是否继续?`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          const pairInfo = { id: item.id, state: 0 };
          changePairState(pairInfo)
            .then(response => {
              if (response.status === 200) {
                if (response.data.result) {
                  this.$message({
                    type: 'success',
                    message: `商品 “${item.baseWare}” 上架成功!`,
                    duration: 1800
                  });
                  this.onSort();
                } else {
                  this.$message({
                    type: 'error',
                    message: `商品 “${item.baseWare}” 上架失败：${response.data.message}`,
                    duration: 1800
                  });
                }
              } else {
                this.$message({
                  type: 'error',
                  message: `商品 “${item.baseWare}” 上架失败 ${response.status}：${response.statusText}`,
                  duration: 1800
                });
              }
            })
            .catch(err => {
              this.$message.error('商品 “${item.baseWare}” 上架失败:' + err.message);
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
      this.$confirm(`将下架商品 ${item.baseWare} , 是否继续?`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          const pairInfo = { id: item.id, state: 1 };
          changePairState(pairInfo)
            .then(response => {
              if (response.status === 200) {
                if (response.data.result) {
                  this.$message({
                    type: 'success',
                    message: `商品 ${item.baseWare} 下架成功!`,
                    duration: 1800
                  });
                  this.onSort();
                } else {
                  this.$message({
                    type: 'error',
                    message: `商品 ${item.baseWare} 下架失败：${response.data.message}`,
                    duration: 1800
                  });
                }
              } else {
                this.$message({
                  type: 'error',
                  message: `商品 ${item.baseWare} 下架失败 ${response.status}：${response.statusText}`,
                  duration: 1800
                });
              }
            })
            .catch(err => {
              this.$message.error(`商品 ${item.baseWare} 下架失败: ${err.message}`);
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
      this.$confirm(`将删除商品 ${item.baseWare} , 是否继续?`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          const pairInfo = { id: item.id, state: 2 };
          changePairState(pairInfo)
            .then(response => {
              if (response.status === 200) {
                if (response.data.result) {
                  this.$message({
                    type: 'success',
                    message: `商品 ${item.baseWare} 删除成功!`,
                    duration: 1800
                  });
                  this.onSort();
                } else {
                  this.$message({
                    type: 'error',
                    message: `商品 ${item.baseWare} 删除失败：${response.data.message}`,
                    duration: 1800
                  });
                }
              } else {
                this.$message({
                  type: 'error',
                  message: `商品 ${item.baseWare} 删除失败 ${response.status}：${response.statusText}`,
                  duration: 1800
                });
              }
            })
            .catch(err => {
              this.$message.error(`商品 ${item.baseWare} 删除失败: + ${err.message}`);
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
    onSelectWareComplete(selectedWareList) {
      this.addWareDlgShow = false;
      this.onSort();
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
                message: `获取商品分类失败 ${response.status}：${response.statusText}`,
                duration: 1800
              });

              reject();
            }
          })
          .catch(err => {
            this.$message.error('获取商品分类失败:' + err.message);
            reject();
          });
      });
    },
    getGameTypeList() {
      this.gameTypeList.length = 0;
      this.$delete(this.gameTypeList, 0);
      getGameList()
        .then(response => {
          if (response.status === 200) {
            response.data.forEach((value, index) => {
              const oneItem = {
                id: value.id,
                name: value.name,
                buyCountLimit: value.num
              };
              this.$set(this.gameTypeList, index, oneItem);
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
    this.getCategoryListPromise()
      .then(() => {
        const curListType = window.localStorage.getItem('pairListCurrentType');

        if (curListType) {
          if (this.listType === curListType) {
            this.onRefresh();
          }
        } else if (this.listType === 'all') {
          this.onRefresh();
        }
      })
      .catch(() => {
        this.$message({
          type: 'error',
          message: `因网络原因，页面初始化失败,请刷新页面`,
          duration: 1800
        });
      });
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
