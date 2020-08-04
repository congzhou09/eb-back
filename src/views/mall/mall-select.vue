<template>
  <div>
    <el-card :body-style="{ padding: '10px 20px' }">
      <!--操作控件-->
      <el-form :inline="true" :model="sortOptions" class="sort-form-inline">
        <el-form-item label="">
          <el-select v-model="sortOptions.mallCategory" multiple placeholder="默认所有分类">
            <el-option v-for="item in mallCategoryList" :key="item.name" :label="item.name" :value="item.categoryId"> </el-option>
          </el-select>
        </el-form-item>

        <template>
          <el-form-item label="">
            <el-select v-model="sortOptions.mallState" placeholder="默认所有状态">
              <el-option v-for="item in mallStateList" :key="item.value" :label="item.label" :value="item.value"> </el-option>
            </el-select>
          </el-form-item>
        </template>

        <el-form-item label="货号">
          <el-input v-model="sortOptions.mallNumber"></el-input>
        </el-form-item>

        <el-form-item label="名称">
          <el-input v-model="sortOptions.mallName"></el-input>
        </el-form-item>

        <el-form-item>
          <el-button type="primary" @click="onSort">筛选</el-button>
          <el-button type="primary" @click="onRefresh">刷新</el-button>
        </el-form-item>
      </el-form>
    </el-card>

    <!--表格-->
    <el-table
      v-loading="isLoading"
      ref="theTable"
      :data="tableData"
      style="width: 100%"
      @select="onSelect"
      @select-all="onSelectAll"
      @row-click="onRowClick"
      :row-class-name="getRowClassName"
    >
      <el-table-column type="selection" v-if="multipleSelect"> </el-table-column>
      <el-table-column v-else label="" type="radio-selection" width="50">
        <template slot-scope="scope">
          <el-radio v-model="curSelect" :label="scope.row.id">
            <span style="display:none;">s</span>
          </el-radio>
        </template>
      </el-table-column>

      <el-table-column align="center" prop="mallNumber" label="货号" width="120"> </el-table-column>
      <el-table-column align="center" label="名称" width="130">
        <template slot-scope="scope">
          <template v-if="scope.row.state === 'invalid'">
            <del>{{ scope.row.mallName }}</del>
          </template>
          <template v-else>
            {{ scope.row.mallName }}
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
          {{ convertToMallStateLabel(scope.row.state) }}
        </template>
      </el-table-column>
    </el-table>

    <!--分页-->
    <el-pagination
      :current-page="currentPage"
      :page-size="10"
      layout="total, prev, pager, next, jumper"
      :total="totalSize"
      @current-change="onCurrentChange"
    >
    </el-pagination>
  </div>
</template>

<script type="text/ecmascript-6">
import {mallStateList, convertToMallStateLabel, convertToMoneyAmount, convertToTimeString, deleteEmptyAttr, mallConvertToCategoryLabel} from '../../utils/appCommon'
import {getCategoryList, getMallList} from '../../api/mall';
export default{
    props: {
        multipleSelect: {
            type: Boolean,
            default: false
        },
        listType: {
            type: String,
            default: 'all'
        },
        lastSelectedItems: {
            type: Array,
            default: ()=>{
                return [];
            }
        }
    },
    data() {
        return {
            mallStateList: mallStateList,
            mallCategoryList: [],
            sortOptions: {
                mallCategory: [],
                mallState: '',
                mallNumber: '',
                mallName: ''
            },
            tableData: [],
            currentPage: 1,
            totalSize: 0,
            selectedItems: [],
            curSelect: -1,
            isLoading: true
        };
    },
    methods: {
        initData(){
            this.sortOptions.mallState = this.convertListTypeToMallState(this.listType);
            this.onRefresh();
            this.selectedItems = this.lastSelectedItems.filter(function(){return true});
            this.backupToggleState();
        },
        convertToMoneyAmount: convertToMoneyAmount,
        convertToMallStateLabel:convertToMallStateLabel,
        convertListTypeToMallState(value){
            let result = "";
            switch(value)
            {
                case("all"):
                {
                    break;
                }
                case("onSale"):
                {
                    result = "onsale";
                    break;
                }
                case("offShelf"):
                {
                    result = "instore";
                    break;
                }
                case("deleted"):
                {
                    result = "invalid";
                    break;
                }
                default:
                    break;
            }
            return result;
        },
        onSort(){
            this.isLoading = true;
            this.tableData.length = 0;
            this.$delete(this.tableData, 0);

            const listInfo = {state:this.sortOptions.mallState, categoryIds:this.sortOptions.mallCategory.join(','), skuNo:this.sortOptions.mallNumber,
                name:this.sortOptions.mallName,curtPage: this.currentPage, pageSize:10};

            deleteEmptyAttr(listInfo);

            getMallList(listInfo).then(response=>{
                if (response.status === 200) {
                    this.totalSize = response.data.resData.totalSize;
                    response.data.resData.list.forEach((value, index, array)=>{
                        const oneItem = {};
                        oneItem.id = value.id;
                        oneItem.mallNumber = value.skuNo;
                        oneItem.mallName = value.name;
                        oneItem.categoryId = value.categoryId;
                        oneItem.category = mallConvertToCategoryLabel(this.mallCategoryList, value.categoryId);
                        oneItem.price = value.price;
                        oneItem.state = value.state;
                        oneItem.addTime = convertToTimeString(value.createTime);

                        this.$set(this.tableData, index, oneItem);
                    });
                }
                else {
                    this.$message({
                        type: 'error',
                        message: `获取分类失败 ${response.data.code}：${response.data.message}`,
                        duration: 1800
                    });
                }
                this.isLoading = false;
                this.backupToggleState();
            }).catch(err=>{

                this.isLoading = false;
                this.$message.error("获取列表失败:" + err.message);
            });
        },
        onSizeChange(val){
            this.pageSize = val;
            this.onRefresh();
        },
        onRefresh(){
            console.log(`获取数据并更新`);
            this.onSort();
        },
        onCurrentChange(val) {
            this.currentPage = val;
            this.onSort();
        },
        backupToggleState(){
            for(let i=0;i<this.selectedItems.length;i++)
            {
                for(let j=0;j<this.$refs.theTable.data.length;j++)
                {
                    if(this.$refs.theTable.data[j].id===this.selectedItems[i].id)
                    {
                        this.$refs.theTable.toggleRowSelection(this.$refs.theTable.data[j], true);
                        break;
                    }
                }
            }
            if(!this.multipleSelect&& this.selectedItems.length>0)
            {
                this.curSelect = this.selectedItems[0].id;
            }
        },
        onSelectAll(selection){
            if(selection.length> 0)
            {
                for(let i=0;i< selection.length;i++)
                {
                    let existMark = false;
                    for(let j=0;j<this.selectedItems.length;j++)
                    {
                        if(this.selectedItems[j].id === selection[i].id)
                        {
                            existMark = true;
                        }
                    }
                    if(!existMark)
                    {
                        this.selectedItems.push(selection[i]);
                    }
                }
            }
            else
            {
                for(i=0;i<this.$refs.theTable.data.length;i++)
                {
                    for(j=0;j<this.selectedItems.length;j++)
                    {
                        if(this.selectedItems[j].id === this.$refs.theTable.data[i].id)
                        {
                            this.selectedItems.splice(j, 1);
                            break;
                        }
                    }
                }
            }

            this.$emit('selectedMallChange', this.selectedItems);
        },
        onSelect(selection, row){
            let existMark = false;
            for(let i=0;i<this.selectedItems.length;i++)
            {
                if(this.selectedItems[i].id === row.id)
                {
                    this.selectedItems.splice(i, 1);
                    this.$refs.theTable.toggleRowSelection(row, false);
                    existMark = true;
                }
            }
            if(!existMark)
            {
                this.selectedItems.push(row);
            }

            this.$emit('selectedMallChange', this.selectedItems);
        },
        onRowClick(row, event, column){
            if(column.type!='selection'&& column.type!='radio-selection')
            {
                let theCheckControl;
                if(!this.multipleSelect)
                {
                    theCheckControl = $(event.currentTarget).find('.el-radio__original');
                }
                else
                {
                    theCheckControl = $(event.currentTarget).find('.el-checkbox__original');
                }
                if(theCheckControl.length> 0)
                {
                    theCheckControl.trigger('click');
                }

            }
            else
            {
                if(!this.multipleSelect)
                {
                    this.selectedItems.length = 0;
                    this.selectedItems.push(row);
                    this.curSelect = row.id;
                    this.$emit('selectedMallChange', this.selectedItems);
                }
            }
        },
        getRowClassName(row, index){
            for(let i=0;i<this.selectedItems.length;i++)
            {
                if(this.selectedItems[i].id===row.id)
                {
                    return 'selected-row';
                }
            }
            return '';
        },
        getCategoryListPromise(){
            // 获取分类信息
            return new Promise((resolve, reject)=>{
                const categoryList={needDefault: true};
                getCategoryList(categoryList).then(response=> {
                    if (response.data.code === 200) {
                        response.data.resData.forEach((value, index, array)=> {
                            this.$set(this.mallCategoryList, index, value);
                        });

                        resolve();
                    }else{
                        this.$message({
                            type: 'error',
                            message: `获取分类失败 ${response.status}：${response.statusText}`,
                            duration: 1800
                        });

                        reject();
                    }
                }).catch(err=> {
                    this.$message.error("获取分类失败:" + err.message);
                    reject();
                });
            });
        },
    },
    mounted(){
        this.sortOptions.mallState = this.convertListTypeToMallState(this.listType);
        this.selectedItems = this.lastSelectedItems.filter(function(){return true});
        this.getCategoryListPromise().then(()=> {
            this.onRefresh();
        }).catch((err)=> {
            this.$message({
                type: 'error',
                message: `页面初始化失败: ${err.message},请刷新页面`,
                duration: 1800
            });
        });
    }
}
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
    background-color: #c9e5f5;
  }
}
.el-pagination {
  text-align: right;
  margin: 1rem 0;
}
</style>
<style rel="stylesheet/scss" lang="scss">
.el-table .selected-row {
  background-color: #a5f5f9;
}
</style>
