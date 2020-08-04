<template>
  <div class="display-table-row">
    <div class="display-table-cell" style="width:200px">
      <span class="table-cell-text">升值信息</span>
    </div>
    <div class="display-table-cell">
      <ul class="info-list">
        <li><label class="title-label">升值玩法：</label>选奇偶</li>
        <li>
          <label class="title-label">奇偶结果：</label
          >{{
            upgradeInfo.length > 0
              ? `${parseInt(upgradeInfo[0][0]) != 0 ? '奇' : '偶'}-${upgradeInfo[0][1]} (共${upgradeInfo.length}次)`
              : '无'
          }}
          <el-button v-if="upgradeInfo.length > 1" style="margin-left: 20px;" type="text" @click="checkDetailDlgShow = true">
            查看详情
          </el-button>
        </li>
        <li>
          <label class="title-label">升值状态：</label>
          <span v-if="gameInfo.upgradeResult.length > 0">{{ gameInfo.upgradeResult }}</span>
          <span v-else>-</span>
        </li>
      </ul>
    </div>

    <!--对话框-->
    <el-dialog title="升值详情" :visible.sync="checkDetailDlgShow" :close-on-click-modal="false">
      <el-table class="oddevenDetail" :data="upgradeInfo" style="width: 100%" :row-class-name="getRowClassName">
        <el-table-column align="center" type="index" label="序号" width="120"> </el-table-column>
        <el-table-column align="center" prop="digit" label="结果(ms)">
          <template slot-scope="scope">
            {{ scope.row[1] }}
          </template>
        </el-table-column>
        <el-table-column align="center" prop="oddeven" label="选择">
          <template slot-scope="scope">
            {{ isNaN(parseInt(scope.row[0])) ? scope.row[0] : parseInt(scope.row[0]) != 0 ? '奇' : '偶' }}
          </template>
        </el-table-column>
      </el-table>
    </el-dialog>
  </div>
</template>

<script>
export default {
  props: {
    gameInfo: {
      type: Object,
      default: function() {
        return {
          result: '',
          orderNo: '',
          upgradeResult: ''
        };
      }
    }
  },
  data() {
    return {
      checkDetailDlgShow: false
    };
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
    },
    upgradeInfo() {
      const resultArr = this.gameInfo.result.split(',');
      const theUpgradeInfo = [];
      resultArr.forEach((value, index) => {
        let smallArr = [];
        if (value.indexOf('|') >= 0) {
          smallArr = value.split('|');
        } else {
          smallArr.push('未选');
          smallArr.push('无');
        }

        this.$set(theUpgradeInfo, index, smallArr);
      });
      return theUpgradeInfo;
    }
  },
  methods: {
    getRowClassName(row, index) {
      if (isNaN(parseInt(row[1]))) {
        return '';
      } else if ((parseInt(row[0]) === 1 && parseInt(row[1]) % 2 != 0) || (parseInt(row[0]) === 0 && parseInt(row[1]) % 2 === 0)) {
        return 'success-row';
      } else {
        return 'fail-row';
      }
    }
  }
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

<style rel="stylesheet/scss" lang="scss">
.oddevenDetail {
  tr.success-row {
    background-color: #a9ee93;
  }
  tr.fail-row {
    background-color: rgb(240, 217, 220);
  }
}
</style>
