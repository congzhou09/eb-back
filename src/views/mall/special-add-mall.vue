<!--金币商城=>专题管理=>添加商品-->
<template>
  <div>
    <div class="selectRegion">
      <mall-select
        ref="mallSelectComp"
        @selectedMallChange="onSelectedMallChange"
        :lastSelectedItems="selectedMallList"
        listType="onSale"
        :multipleSelect="true"
      />
    </div>
    <div class="resultRegion">
      <div style="display:table-row;">
        <div class="display-table-cell resultText">
          已选商品：<br /><strong><span v-if="selectedMallNameList.length <= 0">无</span>{{ selectedMallNameList.join(',') }}</strong>
        </div>
        <div class="display-table-cell" style="width: 110px;">
          <el-button type="primary" style="float:right;" @click="onSelectMallComplete">确认添加</el-button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import mallSelect from './mall-select';
export default {
  props: {
    lastSelectedItems: Array
  },
  data() {
    return {
      selectedMallList: []
    };
  },
  computed: {
    selectedMallNameList() {
      const oneArr = [];
      this.selectedMallList.forEach((value, index) => {
        this.$set(oneArr, index, value.mallName);
      });

      return oneArr;
    }
  },
  methods: {
    initData() {
      this.selectedMallList.length = 0;
      this.$delete(this.selectedMallList, 0);
      this.lastSelectedItems.forEach((value, index, array) => {
        this.$set(this.selectedMallList, index, value);
      });
      if (this.$refs.mallSelectComp) {
        this.$refs.mallSelectComp.initData();
      }
    },
    onSelectedMallChange(selectedItems) {
      this.selectedMallList = selectedItems;
    },
    onSelectMallComplete() {
      this.$emit('selectMallComplete', this.selectedMallList);
    }
  },
  components: {
    mallSelect
  },
  mounted() {
    this.initData();
  }
};
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
.selectRegion {
  border: 1px solid #dad8d8;
  padding: 2px;
}
.resultRegion {
  display: table;
  width: 100%;
  margin: 25px 0 0 0;
  .resultText {
    padding: 0 8px 0 8px;
    border: 1px solid #b4c5e2;
    background-color: rgba(244, 251, 251, 0.37);
    strong {
      width: 100%;
      color: #1b4774;
    }
  }
  .display-table-cell {
    display: table-cell;
    vertical-align: bottom;
  }
}
</style>
