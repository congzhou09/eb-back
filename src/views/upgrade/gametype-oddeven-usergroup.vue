<template>
  <div class="app-container">
    <el-tabs value="first">
      <el-tab-pane :disabled="true" label="用户组管理" name="first">
        <!--操作控件-->
        <el-card :body-style="{ padding: '10px 20px' }">
          <router-link :to="{ path: '/upgrade/gameUser-add' }">
            <el-button type="primary">新增用户组</el-button>
          </router-link>
        </el-card>

        <el-table id="gameUser-add-content" :data="tableData" border style="width: 100%">
          <el-table-column align="center" prop="name" label="用户组名称" width="160"> </el-table-column>
          <el-table-column align="center" label="总参与次数" width="200">
            <template slot-scope="scope">
              {{ scope.row.totalNumber }}
            </template>
          </el-table-column>
          <el-table-column align="center" label="当日参与次数" width="200">
            <template slot-scope="scope">
              {{ scope.row.dayNumber }}
            </template>
          </el-table-column>
          <el-table-column align="center" prop="winAssure" label="连赢保底" width="130"> </el-table-column>
          <el-table-column align="center" prop="failAssure" label="连输保底" width="130"> </el-table-column>

          <el-table-column align="center" label="操作">
            <template slot-scope="scope">
              <template v-if="scope.row.isEffect">
                <el-button type="text" size="small" @click="onSwitch(scope.row)">关闭</el-button>
              </template>
              <template v-else>
                <el-button type="text" size="small" @click="onSwitch(scope.row)">开启</el-button>
              </template>

              <router-link :to="{ name: 'gameUser-edit', params: { gameUserEditData: scope.row } }">
                <span class="btn-seperator">|</span>
                <el-button type="text" size="small">编辑</el-button>
              </router-link>

              <!-- v-if="scope.row.state==='instore'"-->
              <template>
                <span class="btn-seperator">|</span>
                <el-button type="text" size="small" @click="onDelete(scope.row)">删除</el-button>
              </template>
            </template>
          </el-table-column>
          <el-table-column align="center" label="移动">
            <template slot-scope="scope">
              <el-button v-if="indexInTableDate(scope.row) != 0" type="text" size="small" @click="onUpMove(scope.$index, scope.row)">
                <svg class="font-icon" aria-hidden="true">
                  <use xlink:href="#icon-shangyi"></use>
                </svg>
              </el-button>
              <span v-if="indexInTableDate(scope.row) != 0 && indexInTableDate(scope.row) != tableData.length - 1" class="btn-seperator"
                >|</span
              >
              <el-button
                v-if="indexInTableDate(scope.row) != tableData.length - 1"
                type="text"
                size="small"
                @click="onDownMove(scope.$index, scope.row)"
              >
                <svg class="font-icon" aria-hidden="true">
                  <use xlink:href="#icon-xiayi"></use>
                </svg>
              </el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script type="text/ecmascript-6">
    import {deleteGroup, getUserGroup, changeUserGroupeSort, updateGroupEffect} from '../../api/upgrade';
    export default {
        data(){
            return {
                tableData:[]
            };
        },
        computed:{
            userList(){
                return (this.tableData&& this.tableData.length>0)?this.tableData[0].name:"";
            }
        },
        methods:{
            onSwitch(item){

                this.$confirm(`将${item.isEffect?"关闭":"开启"}用户组 “${item.name}” , 是否继续?`, '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    // TODO:用户组开启关闭接口对接
                    const groupEffect={groupId:item.id, isEffect: item.isEffect ? false : true };
//                    console.log('isEffect',groupEffect);
                    updateGroupEffect(groupEffect).then(response=>{
                        if (response.data.code === 200) {
                            if (response.data.result) {
                                this.$message({
                                    type: 'success',
                                    message: `用户组是否${item.isEffect?"关闭":"开启"} “${item.name}” 操作成功!`,
                                    duration: 1800
                                });
                            }
                            else {
                                this.$message({
                                    type: 'error',
                                    message: `用户分组是否${item.isEffect?"关闭":"开启"}操作失败：${response.data.message}`,
                                    duration: 1800
                                });
                            }
                            this.onRefresh();
                        }
                        else {
                            this.$message({
                                type: 'error',
                                message: `用户分组是否${item.isEffect?"关闭":"开启"}操作失败 ${response.data.code}：${response.data.message}`,
                                duration: 1800
                            });
                        }
                        }).catch(err=> {
                            this.$message.error("用户分组是否开启关闭操作失败:" + err.message);
                        });
                }).catch(() => {
                    this.$message({
                        type: 'info',
                        message: `已取消用户组的${item.isEffect?"关闭":"开启"}`,
                        duration: 1000
                    });
                });
            },
            onDelete(item){
                 this.$confirm(`将删除专题 “${item.name}” , 是否继续?`, '提示', {
                     confirmButtonText: '确定',
                     cancelButtonText: '取消',
                     type: 'warning'
                 }).then(() => {
                     const groupInfo = {id: item.id};
                     deleteGroup(groupInfo).then(response=> {
                         if (response.data.code === 200) {
                             if (response.data.result) {
                                 this.$message({
                                     type: 'success',
                                     message: `用户组 “${item.name}” 删除成功!`,
                                     duration: 1800
                                 });
                                 this.onRefresh();
//                                 window.location.reload(false);
                             }
                             else
                             {
                                 this.$message({
                                     type: 'error',
                                     message: `用户组删除失败：${response.data.message}`,
                                     duration: 1800
                                 });
                             }
                         }
                         else
                         {
                             this.$message({
                                 type: 'error',
                                 message: `用户分组删除失败 ${response.data.code}：${response.data.message}`,
                                 duration: 1800
                             });
                         }
                     }).catch(err=> {
                         this.$message.error("用户分组删除失败:" + err.message);
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
                    const sortInfo = {id: item.id, type: -1, twoid: this.tableData[index-1].id, twotype: 1};
                    changeUserGroupeSort(sortInfo).then(response =>{
                        if(response.status===200)
                        {
                            if(response.data.result)
                            {
                                this.$message({
                                    type: 'success',
                                    message: `调整顺序成功!`,
                                    duration: 1800
                                });
                                // 请求ajax成功后执行

//                                this.onRefresh();//******测试专用*******
//                                return;//******测试专用*******

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
                                message: `${response.status}：${response.statusText}`,
                                duration: 1800
                            });
                        }
                    }).catch(err=> {
                        this.$message.error(`调整顺序失败 ${err.message}`);
                    });
                }
            },
            onDownMove(index, item){
                if(index < this.tableData.length-1)
                {
                    const sortInfo = {id: item.id, type: 1, twoid: this.tableData[index+1].id, twotype: -1};
                    changeUserGroupeSort(sortInfo).then(response =>{
                        if(response.status===200)
                        {
                            if(response.data.result)
                            {
                                this.$message({
                                    type: 'success',
                                    message: `调整顺序成功!`,
                                    duration: 1800
                                });
                                // 请求ajax成功后执行

//                                this.onRefresh();//测试专用
//                                return;//测试专用

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
                                message: `${response.status}：${response.statusText}`,
                                duration: 1800
                            });
                        }
                    }).catch(err=> {
                        this.$message.error(`调整顺序失败 ${err.message}`);
                    });
                }
            },
            onRefresh(){  // 获取选择奇偶法用户组
                this.tableData.length = 0;
                this.$delete(this.tableData, 0);
                getUserGroup().then(response=>{
                    if (response.data.code === 200) {
                        response.data.resData.forEach((value, index, array)=>{
                            const oneItem = {};
                            oneItem.id = value.groupId;
                            oneItem.name = value.name;
                            oneItem.totalNumber = value.gameCountAllDesc;
                            oneItem.dayNumber = value.gameCountTodayDesc;
                            oneItem.winAssure = value.guaWincount;
                            oneItem.failAssure = value.guaLosecount;
                            oneItem.isEffect = value.isEffect;
                            this.$set(this.tableData, index, oneItem);
                        });
                    }
                    else
                    {
                        this.$message({
                            type: 'error',
                            message: `获取获取选奇偶法用户组列表失败 ${response.data.code}：${response.data.message}`,
                            duration: 1800
                        });
                    }
                    this.isLoading = false;
                }).catch(err=>{
                    this.isLoading = false;
                    this.$message.error("获取获取选奇偶法用户组列表失败:" + err.message);
                });
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

<style rel="stylesheet/scss" lang="scss" scoped>
.el-card {
  background-color: #f9fafc;
  border: none;
  box-shadow: none;

  .add-btn {
    margin: 10px 32px 10px 0;
  }
}
#gameUser-add-content.el-table {
  margin-top: 17px;
}
.el-table {
  margin-top: 1rem;
  .btn-seperator {
    margin: 0 5px;
    color: rgb(27, 110, 171);
  }
}
.el-tab-pane {
  overflow: auto;
}
</style>
