<template>
  <div class="app-container">
    <el-tabs value="first">
      <el-tab-pane :disabled="true" label="玩法管理" name="first">
        <!--操作控件-->
        <el-card :body-style="{ padding: '10px 20px' }">
          <router-link :to="{ name: 'gametype-add' }">
            <el-button class="add-btn">新增玩法</el-button>
          </router-link>
        </el-card>

        <!--表格-->
        <el-table v-loading="isLoading" :data="tableData" border style="width: 100%">
          <el-table-column align="center" type="index" label="序号" width="120"> </el-table-column>
          <el-table-column align="center" prop="name" label="玩法名称" width=""> </el-table-column>
          <el-table-column align="center" label="操作">
            <template slot-scope="scope">
              <router-link :to="{ name: 'gametype-edit', params: { gametypeEditData: scope.row } }">
                <el-button type="text" size="small">修改</el-button>
              </router-link>
              <template v-if="scope.row.name === '选奇偶'">
                <span class="btn-seperator">|</span>
                <router-link :to="{ name: 'gametype-oddeven-usergroup', params: { gametypeEditData: scope.row } }">
                  <el-button type="text" size="small">用户组</el-button>
                </router-link>
              </template>
              <template v-if="scope.row.name === '欢乐农场'">
                <span class="btn-seperator">|</span>
                <router-link :to="{ name: 'farm-icon-manage', params: { gametypeEditData: scope.row } }">
                  <el-button type="text" size="small">图标管理</el-button>
                </router-link>
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

<script type="text/ecmascript-6">
    import {getGameList, changeGameSort} from '../../api/upgrade';
    export default{
        data(){
            return {
                tableData: [{
                    id: 1,
                    name: '十选一',
                    buyCountLimit: 10
                },{
                    id: 2,
                    name: '选奇偶',
                    buyCountLimit: 9
                }],
                isLoading: true
            };
        },
        methods:{
            onRefresh(){
                this.tableData.length = 0;
                this.$delete(this.tableData, 0);
                getGameList().then(response=> {
                    if (response.status === 200) {
                        response.data.forEach((value, index)=>{
                            const oneItem = {
                                id: value.id,
                                name: value.name,
                                buyCountLimit: value.num
                            };
                            this.$set(this.tableData, index, oneItem);
                        });
                    }
                    else {
                        this.$message({
                            type: 'error',
                            message: `获取玩法列表失败 ${response.status}：${response.statusText}`,
                            duration: 1800
                        });
                    }
                    this.isLoading = false;
                }).catch(err=> {
                    this.isLoading = false;
                    this.$message.error("获取玩法列表失败:" + err.message);
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
            onUpMove(index, item){
                if (index > 0) {
                    const sortInfo = {id: item.id, type: -1, twoid: this.tableData[index - 1].id, twotype: 1};
                    changeGameSort(sortInfo).then(response => {
                        if (response.status === 200) {
                            if (response.data.result) {
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
                            else {
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
                                message: `调整顺序失败 ${response.status}：${response.statusText}`,
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
                    const sortInfo = {id: item.id, type: 1, twoid: this.tableData[index + 1].id, twotype: -1};
                    changeGameSort(sortInfo).then(response => {
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

                                // 请求ajax成功后执行
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
                            else {
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
                                message: `${response.status}：${response.statusText}`,
                                duration: 1800
                            });
                        }
                    }).catch(err=> {
                        this.$message.error(`调整顺序失败 ${err.message}`);
                    });
                }

            }
        },
        mounted(){
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
