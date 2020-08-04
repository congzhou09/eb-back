<template>
  <div class="app-container">
    <el-tabs value="first">
      <el-tab-pane :disabled="true" label="重置密码" name="first">
        <el-card>
          <password-content :preDataFromProp="passwordData" @complete="$router.back()" @cancel="onCancel" />
        </el-card>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script type="text/ecmascript-6">
import passwordContent from './password-content';
export default {
  data() {
    return {
      passwordData: {}
    };
  },
  methods: {
    onCancel() {
      this.$router.back();
    },
    overdueMeg() {
      this.$confirm('当前页面已过期，将返回列表页。', '', {
        confirmButtonText: '确定'
      })
        .then(() => {
          this.$router.replace({ path: '/authority/list' });
        })
        .catch(() => {});
    }
  },
  components: {
    passwordContent
  },
  created() {
    if (this.$route.params.authData && this.$route.params.authData.name.length > 0) {
      this.passwordData.name = this.$route.params.authData.name;
      this.passwordData.id = this.$route.params.authData.id;
    } else {
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
  .el-form-item {
    margin: 18px 0 12px 0;
  }
}
</style>
