<template>
  <div class="display-table-row">
    <div class="display-table-cell" style="width:200px">
      <span class="table-cell-text">升值信息</span>
    </div>
    <div class="display-table-cell">
      <ul class="info-list">
        <li><label class="title-label">升值玩法：</label>欢乐农场</li>
        <li>
          <label class="title-label">下注图标：</label>
          <span v-if="gameInfo.betIcon && gameInfo.betIcon.length > 0">{{ gameInfo.betIcon }}</span>
          <span v-else>-</span>
        </li>
        <li>
          <label class="title-label">当期开奖：</label>
          <span v-if="gameInfo.winIcon && gameInfo.winIcon.length > 0">{{ gameInfo.winIcon }}</span>
          <span v-else>-</span>
        </li>
        <li>
          <label class="title-label">升值状态：</label>
          <span v-if="gameInfo.upgradeResult && gameInfo.upgradeResult.length > 0">{{ gameInfo.upgradeResult }}</span>
          <span v-else>-</span>
        </li>
        <li>
          <label class="title-label">下注期号：</label>
          <span v-if="gameInfo.issue && gameInfo.issue.length > 0">{{ gameInfo.issue }}</span>
          <span v-else>-</span>
        </li>
      </ul>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
export default{
    props: {
        gameInfo: {
            type: Object,
            default: function () {
                return {
                    betIcon: '',
                    winIcon: '',
                    issue: "",
                    upgradeResult: ""
                }
            }
        }
    },
    data(){
        return {};
    }
}
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
