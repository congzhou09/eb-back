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

<script type="text/ecmascript-6">
import listContent from './agent-list-content';
export default {
  data() {
    return {
      tabTitles: [
        { label: '代理列表', name: 'valid' },
        { label: '封号代理', name: 'invalid' }
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
      return curListType && curListType.length > 0 ? curListType : 'valid';
    }
  },
  components: {
    listContent
  },
  created() {
    if (this.$route.params.fromSiderBar) {
      window.localStorage.setItem('curListType', 'valid');
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
