<template>
  <div class="app-container">
    <el-tabs :value="curTabType()" @tab-click="onTabClick">
      <template v-for="(tabItem, index) in this.tabTitles">
        <el-tab-pane :label="tabItem.label" :name="tabItem.name" :key="index">
          <cardList :listType="tabItem.name" />
        </el-tab-pane>
      </template>
    </el-tabs>
  </div>
</template>

<script>
import cardList from './cardList';
export default {
  data() {
    return {
      tabTitles: [
        { label: '未发放', name: 'noGive' }, // all
        { label: '已发放', name: 'give' } // close
      ]
    };
  },
  methods: {
    onTabClick(tab, event) {
      window.localStorage.setItem('cardListCurrentType', tab.name);
      window.localStorage.setItem('curPage', 1);
      window.localStorage.setItem('sortOptions', '');
      tab.$children[0].onRefresh();
    },
    curTabType() {
      const curListType = window.localStorage.getItem('cardListCurrentType');
      return curListType && curListType.length > 0 ? curListType : 'noGive'; // all
    }
  },
  components: {
    cardList
  },
  created() {
    if (this.$route.params.fromSiderBar) {
      window.localStorage.setItem('cardListCurrentType', 'noGive'); // all
      window.localStorage.setItem('curPage', 1);
      window.localStorage.setItem('sortOptions', '');
    }
  }
};
</script>

<style rel="stylesheet/scss" lang="scss" scoped></style>
