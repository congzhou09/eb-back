<template>
  <div class="app-container">
    <el-tabs :value="curTabType()" @tab-click="onTabClick">
      <template v-for="(tabItem, index) in this.tabTitles">
        <el-tab-pane :label="tabItem.label" :name="tabItem.name" :key="index">
          <orderListContent :listType="tabItem.name" />
        </el-tab-pane>
      </template>
    </el-tabs>
  </div>
</template>

<script>
import orderListContent from './orderListContent';
export default {
  data() {
    return {
      tabTitles: [
        { label: '订单列表', name: 'all' }
        /* {label:"已关闭订单", name:"close"}*/
      ]
    };
  },
  methods: {
    onTabClick(tab, event) {
      window.localStorage.setItem('orderListCurrentType', tab.name);
      window.localStorage.setItem('curPage', 1);
      window.localStorage.setItem('sortOptions', '');
      tab.$children[0].onRefresh();
    },
    curTabType() {
      const curListType = window.localStorage.getItem('orderListCurrentType');
      return curListType && curListType.length > 0 ? curListType : 'all';
    }
  },
  components: {
    orderListContent
  },
  created() {
    if (this.$route.params.fromSiderBar) {
      window.localStorage.setItem('orderListCurrentType', 'all');
      window.localStorage.setItem('curPage', 1);
      window.localStorage.setItem('sortOptions', '');
    }
  }
};
</script>

<style rel="stylesheet/scss" lang="scss" scoped></style>
