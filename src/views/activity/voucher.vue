<template>
  <div class="app-container">
    <el-tabs :value="curTabType()" @tab-click="onTabClick">
      <template v-for="(tabItem, index) in this.tabTitles">
        <el-tab-pane :label="tabItem.label" :name="tabItem.name" :key="index">
          <listContent :listType="tabItem.name" />
        </el-tab-pane>
      </template>
    </el-tabs>
  </div>
</template>

<script>
import listContent from './voucher-list-content';
export default {
  data() {
    return {
      tabTitles: [
        { label: '全部优惠券', name: 'all' },
        { label: '进行中', name: 'valid' },
        { label: '已失效', name: 'invalid' }
      ]
    };
  },
  methods: {
    onTabClick(tab, event) {
      window.localStorage.setItem('curListType', tab.name);
      window.localStorage.setItem('curPage', 1);
      window.localStorage.setItem('sortOptions', '');
      tab.$children[0].onRefresh();
    },
    curTabType() {
      const curListType = window.localStorage.getItem('curListType');
      return curListType && curListType.length > 0 ? curListType : 'all';
    }
  },
  components: {
    listContent
  },
  created() {
    if (this.$route.params.fromSiderBar) {
      window.localStorage.setItem('curListType', 'all');
      window.localStorage.setItem('curPage', 1);
      window.localStorage.setItem('sortOptions', '');
    }
  }
};
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
.el-tab-pane {
  overflow: auto;
}
</style>
