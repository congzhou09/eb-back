<template>
  <div class="app-container">
    <el-tabs value="first">
      <el-tab-pane :disabled="true" label="添加管理员" name="first">
        <el-card>
          <el-form label-width="6rem" :rules="formRules" ref="authorityAdd" :model="formData">
            <el-form-item label="管理员名称" prop="name">
              <el-input v-model="formData.name"></el-input>
            </el-form-item>
            <el-form-item label="电子邮箱" prop="email">
              <el-input v-model="formData.email"></el-input>
            </el-form-item>
            <el-form-item label="角色类型" prop="roleId">
              <el-select v-model="formData.roleId">
                <el-option v-for="item in adminRoleArr" :key="item.key" :label="item.value" :value="item.key"> </el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="登录密码" prop="password">
              <el-input type="password" v-model="formData.password"></el-input>
            </el-form-item>
            <el-form-item label="确认密码" prop="password2">
              <el-input type="password" v-model="formData.password2"></el-input>
            </el-form-item>

            <el-form-item style="float:right;">
              <el-button type="primary" @click="onSubmit('authorityAdd')">确定</el-button>
              <el-button type="primary" @click="onCancel">取消</el-button>
            </el-form-item>
          </el-form>
        </el-card>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
import { adminRoleRelateObj, hintSaveBeforeLeave } from '../../utils/appCommon';
import { validateEmail } from 'utils/validate';
import { addAdmin } from 'api/authority';
export default {
  data() {
    const nameValidator = (rule, value, callback) => {
      if (value.length <= 0) {
        callback(new Error('请输入管理员名称'));
      } else {
        callback();
      }
    };
    const emailValidator = (rule, value, callback) => {
      if (!validateEmail(value)) {
        callback(new Error('请输入正确的邮箱'));
      } else {
        callback();
      }
    };
    const roleIdValidator = (rule, value, callback) => {
      if (!value) {
        callback(new Error('请选择角色类型'));
      } else if (value <= 1 || value > adminRoleRelateObj.length - 1) {
        callback(new Error('无效的角色类型'));
      } else {
        callback();
      }
    };
    const passwordValidator = (rule, value, callback) => {
      if (value.length < 6) {
        callback(new Error('密码不能小于6位'));
      } else {
        callback();
      }
    };
    return {
      formData: {
        name: '',
        email: '',
        roleId: '',
        password: '',
        password2: ''
      },
      formRules: {
        name: [{ required: true, trigger: 'blur', validator: nameValidator }],
        email: [{ required: true, trigger: 'blur', validator: emailValidator }],
        roleId: [{ required: true, trigger: 'blur', validator: roleIdValidator }],
        password: [{ required: true, trigger: 'blur', validator: passwordValidator }],
        password2: [{ required: true, trigger: 'blur', validator: this.password2Validator }]
      },
      addSuccess: false
    };
  },
  computed: {
    adminRoleArr() {
      const adminRoleArr = [];
      for (const key in adminRoleRelateObj) {
        if (key != '1') {
          const oneObj = {};
          oneObj.key = key;
          oneObj.value = adminRoleRelateObj[key];
          adminRoleArr.push(oneObj);
        }
      }
      return adminRoleArr;
    }
  },
  methods: {
    password2Validator(rule, value, callback) {
      if (value.length < 6) {
        callback(new Error('密码不能小于6位'));
      } else if (this.formData.password.length >= 6) {
        if (this.formData.password != value) {
          callback(new Error('两次输入密码不一致'));
        } else {
          callback();
        }
      } else {
        callback();
      }
    },
    onSubmit(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          addAdmin(this.formData)
            .then(response => {
              if (response.status === 200) {
                if (response.data.result) {
                  this.$message({
                    type: 'success',
                    message: `管理员添加成功!`,
                    duration: 1800
                  });
                  this.addSuccess = true;
                  this.$router.push('/authority/list');
                } else {
                  this.$message({
                    type: 'error',
                    message: `管理员添加失败：${response.data.message}`,
                    duration: 1800
                  });
                }
              } else {
                this.$message({
                  type: 'error',
                  message: `${response.status}：${response.statusText}`,
                  duration: 1800
                });
              }
            })
            .catch(err => {
              this.$message.error(err);
            });
        } else {
          return false;
        }
      });
    },
    onCancel() {
      this.$router.back();
    }
  },
  beforeRouteLeave(to, from, next) {
    if (!this.addSuccess) {
      hintSaveBeforeLeave(to, from, next, this);
    } else {
      next(true);
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
    .el-select {
      width: 100%;
    }
  }
}
</style>
