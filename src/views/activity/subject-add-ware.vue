<template>
  <div>
    <div class="selectRegion">
      <ware-select
        ref="wareSelectComp"
        @selectedWareChange="onSelectedWareChange"
        :lastSelectedItems="selectedWareList"
        listType="onSale"
        :multipleSelect="true"
      />
    </div>
    <div class="resultRegion">
      <div style="display:table-row;">
        <div class="display-table-cell resultText">
          已选商品：<br /><strong><span v-if="selectedWareNameList.length <= 0">无</span>{{ selectedWareNameList.join(',') }}</strong>
        </div>
        <div class="display-table-cell" style="width: 110px;">
          <el-button type="primary" style="float:right;" @click="onSelectWareComplete">确认添加</el-button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import wareSelect from '../ware/ware-select';
export default {
  props: {
    lastSelectedItems: Array
  },
  data() {
    return {
      selectedWareList: []
    };
  },
  computed: {
    selectedWareNameList() {
      const oneArr = [];
      this.selectedWareList.forEach((value, index) => {
        this.$set(oneArr, index, value.wareName);
      });

      return oneArr;
    }
  },
  methods: {
    initData() {
      this.selectedWareList.length = 0;
      this.$delete(this.selectedWareList, 0);
      this.lastSelectedItems.forEach((value, index, array) => {
        this.$set(this.selectedWareList, index, value);
      });
      if (this.$refs.wareSelectComp) {
        this.$refs.wareSelectComp.initData();
      }
    },
    onSelectedWareChange(selectedItems) {
      this.selectedWareList = selectedItems;
    },
    onSelectWareComplete() {
      this.$emit('selectWareComplete', this.selectedWareList);
    }
  },
  components: {
    wareSelect
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
