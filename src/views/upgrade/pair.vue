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
import listContent from './pair-list-content';
export default {
  data() {
    return {
      tabTitles: [
        { label: '促销中商品', name: 'onSale' },
        { label: '已下架商品', name: 'offShelf' },
        { label: '已删除商品', name: 'deleted' }
      ]
    };
  },
  methods: {
    onTabClick(tab, event) {
      window.localStorage.setItem('pairListCurrentType', tab.name);
      window.localStorage.setItem('curPage', 1);
      window.localStorage.setItem('sortOptions', '');
      tab.$children[0].onRefresh();
    },
    curTabType() {
      const curListType = window.localStorage.getItem('pairListCurrentType');
      return curListType && curListType.length > 0 ? curListType : 'onSale';
    }
  },
  components: {
    listContent
  },
  created() {
    if (this.$route.params.fromSiderBar) {
      window.localStorage.setItem('pairListCurrentType', 'onSale');
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
