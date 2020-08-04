<template>
  <div class="app-container">
    <el-tabs value="1">
      <el-tab-pane :disabled="true" label="分类管理" name="1">
        <!--操作控件-->
        <el-card :body-style="{ padding: '10px 20px' }">
          <router-link :to="{ path: '/ware/category-add' }">
            <el-button class="add-btn">新增分类</el-button>
          </router-link>
        </el-card>

        <!--表格-->
        <el-table :data="tableData" border style="width: 100%">
          <el-table-column align="center" type="index" label="序号" width="120"> </el-table-column>
          <el-table-column align="center" prop="name" label="名称" width="230"> </el-table-column>
          <el-table-column align="center" prop="createTime" label="添加时间"> </el-table-column>
          <el-table-column align="center" label="操作">
            <template slot-scope="scope">
              <router-link :to="{ name: 'category-edit', params: { categoryData: scope.row } }">
                <el-button type="text" size="small">修改</el-button>
              </router-link>
              <template v-if="!scope.row.type">
                <span class="btn-seperator">|</span>
                <el-button type="text" size="small" @click="onDelete(scope.row)">删除</el-button>
              </template>
              <template v-if="indexInTableDate(scope.row) != 0">
                <span class="btn-seperator">|</span>
                <el-button type="text" size="small" @click="onUpMove(scope.$index, scope.row)">
                  <svg class="font-icon" aria-hidden="true">
                    <use xlink:href="#icon-shangyi"></use>
                  </svg>
                </el-button>
              </template>
              <template v-if="indexInTableDate(scope.row) != tableData.length - 1">
                <span class="btn-seperator">|</span>
                <el-button type="text" size="small" @click="onDownMove(scope.$index, scope.row)">
                  <svg class="font-icon" aria-hidden="true">
                    <use xlink:href="#icon-xiayi"></use>
                  </svg>
                </el-button>
              </template>
            </template>
          </el-table-column>
        </el-table>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
import { getCategoryList, changeCategorySort, deleteCategory } from '../../api/ware';
import { convertToTimeString } from '../../utils/appCommon';
export default {
  data() {
    return {
      tableData: []
    };
  },
  methods: {
    onRefresh() {
      this.tableData.length = 0;
      this.$delete(this.tableData, 0);
      getCategoryList()
        .then(response => {
          if (response.status === 200) {
            response.data.forEach((value, index, array) => {
              value.createTime = convertToTimeString(value.createTime);
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
    onDelete(item) {
      this.$confirm(`将删除分类 “${item.name}” , 是否继续?`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          const deleteInfo = { id: item.id };
          deleteCategory(deleteInfo)
            .then(response => {
              if (response.status === 200) {
                if (response.data.result) {
                  this.$message({
                    type: 'success',
                    message: `分类 “${item.name}” 删除成功!`,
                    duration: 1800
                  });
                  this.onRefresh();
                } else {
                  this.$message({
                    type: 'success',
                    message: `分类 “${item.name}” 删除失败：${response.data.message}`,
                    duration: 1800
                  });
                }
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
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除',
            duration: 1000
          });
        });
    },
    indexInTableDate(item) {
      const distArr = this.tableData;
      for (let i = 0; i < distArr.length; i++) {
        if (distArr[i].name === item.name && distArr[i].addTime === item.addTime) {
          return i;
        }
      }
      return -1;
    },
    onUpMove(index, item) {
      if (index > 0) {
        const sortInfo = { id: item.id, type: -1, twoid: this.tableData[index - 1].id, twotype: 1 };
        changeCategorySort(sortInfo)
          .then(response => {
            if (response.status === 200) {
              if (response.data.result) {
                this.$message({
                  type: 'success',
                  message: `调整顺序成功!`,
                  duration: 1800
                });
                // 请求ajax成功后执行

                //                                this.onRefresh();//测试专用
                //                                return;//测试专用

                const distArr = this.tableData;
                for (let i = 0; i < distArr.length; i++) {
                  if (distArr[i].name === item.name && distArr[i].addTime === item.addTime && typeof distArr[i - 1] != 'undefined') {
                    const tmp = distArr[i];
                    this.$set(distArr, i, distArr[i - 1]);
                    this.$set(distArr, i - 1, tmp);
                    break;
                  }
                }
              } else {
                this.$message({
                  type: 'error',
                  message: `调整顺序失败：${response.data.message}`,
                  duration: 1000
                });
              }
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
      }
    },
    onDownMove(index, item) {
      if (index < this.tableData.length - 1) {
        const sortInfo = { id: item.id, type: 1, twoid: this.tableData[index + 1].id, twotype: -1 };
        changeCategorySort(sortInfo)
          .then(response => {
            if (response.status === 200) {
              if (response.data.result) {
                this.$message({
                  type: 'success',
                  message: `调整顺序成功!`,
                  duration: 1800
                });
                // 请求ajax成功后执行

                //                                this.onRefresh();//测试专用
                //                                return;//测试专用

                const distArr = this.tableData;
                for (let i = 0; i < distArr.length; i++) {
                  if (distArr[i].name === item.name && distArr[i].addTime === item.addTime && typeof distArr[i + 1] != 'undefined') {
                    const tmp = distArr[i];
                    this.$set(distArr, i, distArr[i + 1]);
                    this.$set(distArr, i + 1, tmp);
                    break;
                  }
                }
              } else {
                this.$message({
                  type: 'error',
                  message: `调整顺序失败：${response.data.message}`,
                  duration: 1000
                });
              }
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
      }
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
  .add-btn {
    margin: 10px 12px 10px 0;
  }
}
.el-table {
  margin-top: 1rem;
  .btn-seperator {
    margin: 0 5px;
    color: rgb(27, 110, 171);
  }
}
.el-pagination {
  text-align: right;
  margin: 1rem 0;
}
</style>
