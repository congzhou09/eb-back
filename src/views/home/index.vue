<template>
  <div class="app-container">
    <!--<div class="wrapper">-->
    <el-row :gutter="40">
      <el-col :span="8" v-loading="isLoading">
        <el-card :body-style="{ padding: '5px 25px 10px 25px' }">
          <h4 class="card-header">网址信息统计</h4>
          <div v-for="(item, index) in siteStatis" class="card-item" :key="`siteStatis${index}`">
            <label>{{ item.name }}</label
            >{{ ' ' + item.value }}
          </div>
          <h4 class="card-header">近期动态</h4>
          <div v-for="(item, index) in recentTrend" class="card-item" :key="`recentTrend${index}`">
            <label>{{ item.name }}</label
            >{{ ' ' + item.value }}
          </div>
        </el-card>
      </el-col>
      <el-col :span="8">
        <el-card :body-style="{ padding: '5px 25px 10px 25px' }">
          <h4 class="card-header">用户</h4>
          <div v-for="(item, index) in userInfo" class="card-item" :key="index">
            <label>{{ item.name }}</label
            >{{ ' ' + item.value }}
          </div>
        </el-card>
      </el-col>
    </el-row>
    <!--</div>-->
  </div>
</template>
<script>
import { adminRoleRelateObj } from '../../utils/appCommon';
import { homeInfo } from '../../api/home';
export default {
  data() {
    return {
      siteStatis: [
        { name: '商品数量', value: 0 },
        { name: '会员人数', value: 0 }
      ],
      recentTrend: [
        { name: '今日新增人数', value: 0 },
        { name: '今日新增商品', value: 0 }
      ],
      isLoading: true
    };
  },
  computed: {
    userInfo() {
      return [
        { name: '名称', value: this.$store.state.user.name },
        { name: '角色', value: this.$store.getters.roleId in adminRoleRelateObj ? adminRoleRelateObj[this.$store.getters.roleId] : '' }
      ];
    }
  },
  mounted() {
    homeInfo()
      .then(response => {
        if (response.status === 200) {
          this.siteStatis[0].value = response.data.productTotalNum;
          this.siteStatis[1].value = response.data.userTotalNum;

          this.recentTrend[0].value = response.data.productNewNum;
          this.recentTrend[1].value = response.data.userNewNum;
        } else {
          this.$message({
            type: 'error',
            message: `失败 ${response.status}：${response.statusText}`,
            duration: 1800
          });
        }
        this.isLoading = false;
      })
      .catch(err => {
        this.isLoading = false;
        this.$message.error('获取首页信息失败:' + err.message);
      });
  }
};
</script>
<style rel="stylesheet/scss" lang="scss" scoped>
.el-card {
  min-height: 27rem;
  margin-top: 20px;
}
.card-item {
  font-size: 0.92rem;
  border-bottom: 1px dashed;
  padding-bottom: 0.65rem;
  margin-bottom: 1rem;
  label {
    margin-right: 1rem;
  }
}
.card-header {
  border-bottom: 1px solid;
  padding-top: 5px;
  padding-bottom: 12px;
}
</style>
