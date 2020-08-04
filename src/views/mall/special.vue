<!--专题列表-->
<template>
  <div class="app-container">
    <el-tabs value="1">
      <el-tab-pane :disable="true" label="专题设置" name="1">
        <!--操作控件-->
        <el-card :body-style="{ padding: '10px 20px' }">
          <router-link :to="{ name: 'special-add' }">
            <el-button class="add-btn">新增专题</el-button>
          </router-link>
        </el-card>
        <!--表格-->
        <el-table v-loading="isLoading" :data="tableData" border style="width: 100%;">
          <el-table-column type="index" label="序号" width="120" align="center"> </el-table-column>
          <el-table-column prop="name" label="专题名称" width="" align="center"> </el-table-column>
          <el-table-column label="操作" align="center">
            <template slot-scope="scope">
              <router-link :to="{ name: 'special-edit', params: { editData: scope.row } }">
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
              <template v-if="indexInTableDate(scope.row) !== tableData.length - 1">
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

<script type="text/ecmascript-6">
import {getSpecialList, deleteSpecial, changeSpecialSort} from '../../api/mall';
export default {
    data(){
        return {
            tableData:[],
            isLoading: false,
        }
    },
    methods: {
        onRefresh(){
            this.isLoading = true;
            this.tableData.length=0;
            this.$delete(this.tableData, 0);
            getSpecialList().then(response=>{
                if(response.data.code===200){
                    response.data.resData.forEach((value, index)=>{
                        const oneObj = {};
                        oneObj.id = value.channelId;
                        oneObj.name = value.name;
                        oneObj.sort = value.sort;
                        this.$set(this.tableData, index, oneObj);
                    });
                }else{
                    this.$message({
                        type: 'error',
                        message: `获取专题列表失败 ${response.data.code}：${response.data.message}`,
                        duration: 1800
                    });
                }
                this.isLoading = false;
            }).catch((err)=>{
                this.isLoading = false;
                this.$message.error("获取专题列表失败:" + err.message);
            });

        },
        onDelete(item){
            this.$confirm(`将删除专题 “${item.name}” , 是否继续?`, '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                const specialInfo = {channelId: item.id};
                deleteSpecial(specialInfo).then(response=> {
                    if (response.data.code === 200) {
                        if (response.data.result) {
                            this.$message({
                                type: 'success',
                                message: `专题 “${item.name}” 删除成功!`,
                                duration: 1800
                            });
                        }
                        else {
                            this.$message({
                                type: 'error',
                                message: `专题删除失败：${response.data.message}`,
                                duration: 1800
                            });
                        }
                        this.onRefresh();
                    }
                    else {
                        this.$message({
                            type: 'error',
                            message: `专题删除失败 ${response.data.code}：${response.data.message}`,
                            duration: 1800
                        });
                    }
                }).catch(err=> {
                    this.$message.error("专题删除失败:" + err.message);
                });

            }).catch(() => {
                this.$message({
                    type: 'info',
                    message: '已取消删除',
                    duration: 1000
                });
            });
        },
        onUpMove(index, item){
            if(index > 0)
            {
                const sortInfo = {id1: item.id, sort1: item.sort, id2: this.tableData[index-1].id, sort2: this.tableData[index-1].sort};
                changeSpecialSort(sortInfo).then(response =>{
                    if(response.data.code===200)
                    {
                        if(response.data.result)
                        {
                            this.$message({
                                type: 'success',
                                message: `调整顺序成功!`,
                                duration: 1800
                            });
                            // 请求ajax成功后执行

                            this.onRefresh();//* *****测试专用*******
                            return;//* *****测试专用*******

                            const distArr = this.tableData;
                            for(let i=0;i<distArr.length;i++)
                            {
                                if(distArr[i].name===item.name && distArr[i].addTime===item.addTime && typeof(distArr[i-1])!="undefined")
                                {
                                    const tmp = distArr[i];
                                    this.$set(distArr, i, distArr[i-1]);
                                    this.$set(distArr, i-1, tmp);
                                    break;
                                }
                            }
                        }
                        else
                        {
                            this.$message({
                                type: 'error',
                                message: `调整顺序失败：${response.data.message}`,
                                duration: 1000
                            });
                        }
                    }
                    else
                    {
                        this.$message({
                            type: 'error',
                            message: `调整顺序失败 ${response.data.code}：${response.data.message}`,
                            duration: 1800
                        });
                    }
                }).catch(err=> {
                    this.$message.error(`调整顺序失败 ${err.message}`);
                });
            }
        },
        onDownMove(index, item){
            if (index < this.tableData.length - 1) {
                const sortInfo = {id1: item.id, sort1: item.sort, id2: this.tableData[index + 1].id, sort2: this.tableData[index + 1].sort};
                changeSpecialSort(sortInfo).then(response => {
                    if (response.data.code === 200) {
                        if (response.data.result) {
                            this.$message({
                                type: 'success',
                                message: `调整顺序成功!`,
                                duration: 1800
                            });
                            // 请求ajax成功后执行

                            this.onRefresh();// 测试专用
                            return;// 测试专用

                            const distArr = this.tableData;
                            for(let i=0;i<distArr.length;i++)
                            {
                                if(distArr[i].name===item.name && distArr[i].addTime===item.addTime && typeof(distArr[i+1])!="undefined")
                                {
                                    const tmp = distArr[i];
                                    this.$set(distArr, i, distArr[i+1]);
                                    this.$set(distArr, i+1, tmp);
                                    break;
                                }
                            }
                        }else{
                            this.$message({
                                type: 'error',
                                message: `调整顺序失败：${response.data.message}`,
                                duration: 1000
                            });
                        }
                    }
                    else {
                        this.$message({
                            type: 'error',
                            message: `${response.data.code}：${response.data.message}`,
                            duration: 1800
                        });
                    }
                }).catch(err=> {
                    this.$message.error(`调整顺序失败 ${err.message}`);
                });
            }
        },
        indexInTableDate(item){
            const distArr = this.tableData;
            for(let i=0;i<distArr.length;i++)
            {
                if(distArr[i].name===item.name && distArr[i].addTime===item.addTime)
                {
                    return i;
                }
            }
            return -1;
        },
    },
    mounted() {
        this.onRefresh();
    }

}
</script>

<style rel="stylesheet" lang="scss" spoced>
.el-card {
  background-color: #f9fafc;
  border: none;
  border-show: none;
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
</style>
