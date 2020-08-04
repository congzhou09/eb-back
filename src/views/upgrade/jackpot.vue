<template>
  <div class="app-container" v-loading="isLoading">
    <el-tabs value="jackpot">
      <template>
        <el-tab-pane label="欢乐农场" name="jackpot">
          <farmJeckpot />
        </el-tab-pane>
        <el-tab-pane label="十选一" name="tenOne">
          <tenoneJeckpot />
        </el-tab-pane>
      </template>
    </el-tabs>
  </div>
</template>

<script type="text/ecmascript-6">
import farmJeckpot from "./farm-jeckpot";
import tenoneJeckpot from "./tenone-jeckpot";
export default {
    data() {
        return {
            activeName:'1',
            isLoading: false,
            editDlgShow: false,
            curProbabList: {}
        };
    },
    methods: {
        onDlgShow(refName){
            if(this.$refs[refName])
            {
                this.$refs[refName].onInit();
            }
        },
    },
    components: {
        farmJeckpot,
        tenoneJeckpot
    },
    created(){
        if(this.$route.params.fromSiderBar)
        {
            window.localStorage.setItem('pairListCurrentType', "jackpot");
            window.localStorage.setItem('curPage', 1);
            window.localStorage.setItem('sortOptions', '');
        }
    }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
.el-tab-pane {
  overflow: auto;
}
.table-cell-img {
  vertical-align: middle;
  width: 56px;
  margin: 2px;
  border: 1px solid #c7bcbc;
  border-radius: 9px;
}
</style>
