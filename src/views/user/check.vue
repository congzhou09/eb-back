<template>
  <div class="app-container">
    <el-tabs value="1">
      <el-tab-pane :disabled="true" label="查看用户信息" name="1">
        <el-card v-loading="isLoading">
          <ul class="user-info">
            <li>
              <label class="title-label">ID：</label><span>{{ userInfo.ID }}</span>
            </li>
            <li>
              <label class="title-label" style="transform: translateY(-11px);">头像：</label
              ><img class="user-avatar" :src="userInfo.avator" />
            </li>
            <li><label class="title-label">账户余额：</label>{{ convertToMoneyAmount(userInfo.remainMoneyAmount) }}</li>
            <li><label class="title-label">金币余额：</label>{{ userInfo.remainGoldAmount }}</li>
            <li><label class="title-label">注册时间：</label>{{ convertToTimeString(userInfo.regTime) }}</li>
            <li><label class="title-label">昵称：</label>{{ userInfo.name }}</li>
            <li><label class="title-label">手机号：</label>{{ userInfo.telephone }}</li>
          </ul>
          <el-button type="primary" @click="onReturn()">返回</el-button>
        </el-card>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
import { convertToMoneyAmount, convertToTimeString } from '../../utils/appCommon';
import { getUserInfo } from '../../api/user';
export default {
  data() {
    return {
      userInfo: {
        ID: '',
        avator: '',
        remainMoneyAmount: 0,
        remainGoldAmount: 0,
        regTime: 0,
        name: '',
        telephone: ''
      },
      isLoading: true
    };
  },
  methods: {
    convertToMoneyAmount: convertToMoneyAmount,
    convertToTimeString: convertToTimeString,
    onReturn() {
      this.$router.back();
    },
    overdueMeg() {
      this.$confirm('当前页面已过期，将返回列表页。', '', {
        confirmButtonText: '确定'
      })
        .then(() => {
          this.$router.replace({ path: '/user/list' });
        })
        .catch(() => {});
    }
  },
  created() {
    if (this.$route.params.userData && Object.getOwnPropertyNames(this.$route.params.userData).length > 0) {
      //                this.userInfo = this.$route.params.userData;
      const queryInfo = { id: this.$route.params.userData.ID };
      getUserInfo(queryInfo)
        .then(response => {
          if (response.status === 200) {
            if (response.data.id) {
              this.userInfo = {
                ID: response.data.id,
                avator: response.data.avatar,
                remainMoneyAmount: response.data.balance,
                remainGoldAmount: response.data.gold,
                regTime: response.data.createTime,
                name: response.data.nickname,
                telephone: response.data.phone
              };
            } else {
              this.$message({
                type: 'error',
                message: `获取用户信息失败 ${response.status}：${response.statusText}`,
                duration: 1800
              });
            }
          } else {
            this.$message({
              type: 'error',
              message: `获取用户信息失败 ${response.status}：${response.statusText}`,
              duration: 1800
            });
          }
          this.isLoading = false;
        })
        .catch(err => {
          this.$message.error('获取用户信息失败:' + err.message);
          this.isLoading = false;
        });
    } else {
      this.isLoading = false;
      this.overdueMeg();
    }
  }
};
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
.el-card {
  max-width: 40rem;
  box-shadow: none;
  padding-bottom: 0.9rem;
  .el-button {
    float: right;
    margin-right: 2rem;
  }
}
.user-info {
  list-style: none;
  padding: 0 1.2rem 5px 1.2rem;
  li {
    margin: 18px 0;
    padding-bottom: 5px;
    border-bottom: 1px dashed;
    .title-label {
      display: inline-block;
      width: 100px;
      text-align: right;
      margin-right: 3rem;
    }
  }
  .user-avatar {
    width: 40px;
    height: 40px;
    border-radius: 10px;
    border: 1px solid #dfdfdf;
  }
}
</style>
