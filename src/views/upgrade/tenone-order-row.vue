<template>
  <div class="display-table-row">
    <div class="display-table-cell" style="width:200px">
      <span class="table-cell-text">升值信息</span>
    </div>
    <div class="display-table-cell">
      <ul class="info-list">
        <li><label class="title-label">升值玩法：</label>十选一</li>
        <li>
          <label class="title-label">所选号码：</label>
          <span v-if="gameInfo.buyNumber && gameInfo.buyNumber.length > 0">{{ gameInfo.buyNumber }}</span>
          <span v-else>-</span>
        </li>
        <li>
          <label class="title-label">开奖号码：</label>
          <span v-if="gameInfo.winningNumber && gameInfo.winningNumber.length > 0">{{ gameInfo.winningNumber }}</span>
          <span v-else>-</span>
        </li>
        <li>
          <label class="title-label">升值状态：</label>
          <span v-if="gameInfo.upgradeResult && gameInfo.upgradeResult.length > 0">{{ gameInfo.upgradeResult }}</span>
          <span v-else>-</span>
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    gameInfo: {
      type: Object,
      default: function() {
        return {
          orderNo: '',
          buyNumber: '',
          winningNumber: '',
          upgradeResult: ''
        };
      }
    }
  },
  data() {
    return {};
  },
  computed: {
    upgradeState() {
      const orderNoTail = this.gameInfo.orderNo.slice(this.gameInfo.orderNo.length - 2);
      if (orderNoTail === '02') {
        return '升值成功';
      } else if (orderNoTail === '01') {
        return '升值失败';
      } else {
        return '-';
      }
    }
  },
  methods: {}
};
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
.display-table-row {
  display: table-row;
}
.display-table-cell {
  position: relative;
  display: table-cell;
  border: 1px solid #bfcbd9;
  padding: 8px;
  .table-cell-text {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translateX(-50%) translateY(-50%);
    font-size: 15px;
    color: #48576a;
  }
  .info-list {
    list-style: none;
    padding-left: 1.2rem;
    li {
      margin: 13px 0;
      .title-label {
        display: inline-block;
        width: 100px;
        text-align: right;
        margin-right: 1rem;
      }
    }
  }
}
</style>
