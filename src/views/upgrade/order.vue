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
import listContent from './order-list-content';
export default {
  data() {
    return {
      tabTitles: [
        { label: '全部订单', name: 'all' }
        /* {label:"成功订单", name:"succeeded"},
                    {label:"失败订单", name:"failed"}*/
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
    listContent
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
