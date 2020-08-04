<script src="../../components/Icon-svg/index.js"></script>
<template>
  <div class="login-container">
    <div class="form-container">
      <el-form
        autoComplete="on"
        :model="loginForm"
        :rules="loginRules"
        ref="loginForm"
        label-position="left"
        label-width="0px"
        class="card-box login-form"
      >
        <h3 class="title">商城运营管理后台</h3>
        <el-form-item prop="email">
          <span class="svg-container">
            <svg class="font-icon" aria-hidden="true">
              <use xlink:href="#icon-jiedianyoujian"></use>
            </svg>
          </span>
          <el-input name="email" type="text" v-model="loginForm.email" autoComplete="on" placeholder="邮箱"></el-input>
        </el-form-item>
        <el-form-item prop="password">
          <span class="svg-container">
            <svg class="font-icon" aria-hidden="true">
              <use xlink:href="#icon-mima"></use>
            </svg>
          </span>
          <el-input
            name="password"
            type="password"
            @keyup.enter.native="handleLogin"
            v-model="loginForm.password"
            autoComplete="on"
            placeholder="密码"
          ></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" style="width:100%;" :loading="isLoading" @click.native.prevent="handleLogin">
            登录
          </el-button>
        </el-form-item>
        <!--<router-link to="/sendpwd" class="forget-pwd">
                忘记密码?(或首次登录)
            </router-link>-->
      </el-form>
    </div>
    <div class="tips">
      密码随意 至少6位 各权限管理员示例账号如下: super@ee.com - 超级管理员 ware@ee.com - 商品管理员 money@ee.com - 财务管理员 normal@ee.com
      - 普通管理员 expand@ee.com - 推广管理员
    </div>
  </div>
</template>

<script>
import { validateEmail } from '../../utils/validate';

export default {
  name: 'login',
  data() {
    const emailValidator = (rule, value, callback) => {
      if (!validateEmail(value)) {
        callback(new Error('请输入正确的邮箱'));
      } else {
        callback();
      }
    };
    const validatePass = (rule, value, callback) => {
      if (value.length < 6) {
        callback(new Error('密码不能小于6位'));
      } else {
        callback();
      }
    };
    return {
      loginForm: {
        email: '',
        password: ''
      },
      loginRules: {
        email: [{ required: true, trigger: 'blur', validator: emailValidator }],
        password: [{ required: true, trigger: 'blur', validator: validatePass }]
      },
      isLoading: false,
      showDialog: false
    };
  },
  methods: {
    handleLogin() {
      this.$refs.loginForm.validate(valid => {
        if (valid) {
          this.isLoading = true;
          this.$store
            .dispatch('LoginByEmail', this.loginForm)
            .then(() => {
              this.isLoading = false;
              this.$router.push({ path: '/home' });
              // this.showDialog = true;
            })
            .catch(err => {
              this.isLoading = false;
              this.$message.error(err);
            });
        } else {
          this.isLoading = false;
          console.log('error submit!!');
          return false;
        }
      });
    }
  }
};
</script>

<style rel="stylesheet/scss" lang="scss">
@import 'src/styles/mixin.scss';
.login-container {
  display: flex;
  flex-direction: column;
  height: 100vh;
  background-color: #2d3a4b;
}
.form-container {
  flex: 1;

  input:-webkit-autofill {
    -webkit-box-shadow: 0 0 0px 1000px #293444 inset !important;
    -webkit-text-fill-color: #fff !important;
  }
  input {
    background: transparent;
    border: 0px;
    -webkit-appearance: none;
    border-radius: 0px;
    padding: 12px 5px 12px 15px;
    color: #eeeeee;
    height: 47px;
  }
  .el-input {
    display: inline-block;
    height: 47px;
    width: 85%;
  }
  .svg-container {
    padding: 6px 5px 6px 15px;
    color: #889aa4;
  }

  .title {
    font-size: 26px;
    font-weight: 400;
    color: #eeeeee;
    margin: 0px auto 40px auto;
    text-align: center;
    font-weight: bold;
  }

  .login-form {
    position: absolute;
    width: 400px;
    left: 50%;
    top: 50%;
    transform: translateX(-50%) translateY(-50%);
  }

  .el-form-item {
    border: 1px solid rgba(255, 255, 255, 0.1);
    background: rgba(0, 0, 0, 0.1);
    border-radius: 5px;
    color: #454545;
  }

  .forget-pwd {
    color: #fff;
  }
}
.tips {
  font-size: 14px;
  color: #dedede;
  text-align: center;
  margin-bottom: 1.5rem;
}
</style>
