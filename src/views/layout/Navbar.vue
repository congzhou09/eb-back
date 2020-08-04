<template>
  <div>
    <header class="navbar" mode="horizontal">
      <h2 class="title">运营管理后台</h2>
      <el-dropdown class="avatar-container" trigger="click">
        <div class="avatar-wrapper">
          <img class="user-avatar" :src="imgSrc" />
          <h4 class="user-name">{{ name }}</h4>
          <i class="el-icon-caret-bottom" />
        </div>
        <el-dropdown-menu class="user-dropdown" slot="dropdown">
          <router-link class="inlineBlock" to="/">
            <el-dropdown-item>
              首页
            </el-dropdown-item>
          </router-link>
          <!--<router-link  class='inlineBlock' to="/admin/profile">
                        <el-dropdown-item>
                            设置
                        </el-dropdown-item>
                    </router-link>-->
          <el-dropdown-item>
            <span @click="passwordDlgShow = true" style="display:block;">修改密码</span>
          </el-dropdown-item>
          <el-dropdown-item divided>
            <span @click="logout" style="display:block;">退出登录</span>
          </el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
    </header>
    <el-dialog class="password-dlg" title="修改密码" :visible.sync="passwordDlgShow" :close-on-click-modal="false">
      <password-change
        :preDataFromProp="passwordData"
        @complete="passwordDlgShow = false"
        @cancel="passwordDlgShow = false"
      ></password-change>
    </el-dialog>
  </div>
</template>

<script type="text/ecmascript-6">
import { mapGetters } from 'vuex';
import passwordChange from '../authority/password-content';

export default {
  components: {
    passwordChange
  },
  data() {
    return {
      passwordDlgShow: false,
      passwordData: {},
      imgSrc: ''
    };
  },
  computed: {
    ...mapGetters(['sidebar', 'userId', 'name', 'roleId'])
  },
  methods: {
    toggleSideBar() {
      this.$store.dispatch('ToggleSideBar');
    },
    changePassword() {},
    logout() {
      this.$store.dispatch('LogOut').then(() => {
        location.reload(); // 为了重新实例化vue-router对象 避免bug
      });
    }
  },
  mounted() {
    this.passwordData = { id: this.userId, name: this.name };
    switch (this.roleId) {
      case 1: {
        import('../../assets/super.png').then(data => {
          this.imgSrc = data.default;
        });
        break;
      }
      case 2: {
        import('../../assets/ware.png').then(data => {
          this.imgSrc = data.default;
        });
        break;
      }
      case 3: {
        import('../../assets/money.png').then(data => {
          this.imgSrc = data.default;
        });
        break;
      }
      case 4: {
        import('../../assets/common.png').then(data => {
          this.imgSrc = data.default;
        });
        break;
      }
      case 5: {
        import('../../assets/expand.png').then(data => {
          this.imgSrc = data.default;
        });
        break;
      }
      default:{
        import('../../assets/avatar.png').then(data => {
          this.imgSrc = data.default;
        });
        break;
      }
    }
  }
};
</script>
<style rel="stylesheet/scss" lang="scss" scoped>
header.navbar {
  position: fixed;
  z-index: 1000;
  width: 100%;
  height: 80px;
  top: 0;
  left: 0;
  line-height: 50px;
  border-radius: 0px !important;
  background-color: rgb(125, 193, 148);
  .title {
    position: absolute;
    color: white;
    left: 20px;
  }
  .hamburger-container {
    line-height: 58px;
    height: 50px;
    float: left;
    padding: 0 10px;
  }
  .avatar-container {
    height: 50px;
    display: inline-block;
    position: absolute;
    top: 16px;
    right: 95px;
    .avatar-wrapper {
      cursor: pointer;
      position: relative;
      .user-avatar {
        float: left;
        width: 40px;
        height: 40px;
        border-radius: 10px;
        transform: translateY(18%);
      }
      .user-name {
        display: inline-block;
        margin: 0 0 0 10px;
        vertical-align: middle;
        color: antiquewhite;
      }
      .el-icon-caret-bottom {
        position: absolute;
        right: -20px;
        top: 22px;
        font-size: 15px;
        color: antiquewhite;
      }
    }
  }
}
</style>

<style rel="stylesheet/scss" lang="scss">
.password-dlg {
  .el-dialog {
    width: 600px;
  }
}
</style>
