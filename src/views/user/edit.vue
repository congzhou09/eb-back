<template>
  <div class="app-container">
    <el-tabs value="1">
      <el-tab-pane :disabled="true" label="编辑用户信息" name="1">
        <el-card>
          <el-form label-width="5.2rem" :rules="formRules" ref="userEdit" :model="formData">
            <el-form-item label="ID">
              <span class="form-item-value">{{ formData.ID }}</span>
            </el-form-item>
            <el-form-item label="账户余额">
              <span class="form-item-value">{{ convertToMoneyAmount(formData.remainMoneyAmount) }}</span>
            </el-form-item>
            <el-form-item label="金币余额">
              <span class="form-item-value">{{ formData.remainGoldAmount }}</span>
            </el-form-item>
            <el-form-item label="头像">
              <img class="user-avatar form-item-value" :src="formData.avator" />
            </el-form-item>

            <el-form-item label="昵称" prop="name" required>
              <el-input v-model="formData.name"></el-input>
            </el-form-item>
            <el-form-item label="手机号" prop="telephone" required>
              <el-input v-model="formData.telephone"></el-input>
            </el-form-item>

            <el-form-item style="float:right;">
              <el-button type="primary" @click="onSubmit('userEdit')">保存</el-button>
              <el-button type="primary" @click="onCancel()">取消</el-button>
            </el-form-item>
          </el-form>
        </el-card>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script type="text/ecmascript-6">
import { convertToMoneyAmount } from '../../utils/appCommon';
import { editUserInfo } from '../../api/user';
export default {
  data() {
    const nameValidator = (rule, value, callback) => {
      if (value.length <= 0) {
        callback(new Error('请输入昵称'));
      } else if (/\s+/g.test(value)) {
        callback(new Error('禁止输入空格'));
      } else {
        callback();
      }
    };
    const telValidator = (rule, value, callback) => {
      if (value.length <= 0) {
        callback(new Error('请输入手机号'));
      } else {
        callback();
      }
    };
    return {
      formData: {
        ID: '',
        name: '',
        telephone: '',
        remainMoneyAmount: '',
        remainGoldAmount: ''
      },
      formRules: {
        name: [{ required: true, trigger: 'blur', validator: nameValidator }],
        telephone: [{ required: true, trigger: 'blur', validator: telValidator }]
      }
    };
  },
  methods: {
    convertToMoneyAmount: convertToMoneyAmount,
    onSubmit(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          const userInfo = { id: this.formData.ID, nickname: this.formData.name, phone: this.formData.telephone };
          editUserInfo(userInfo)
            .then(response => {
              if (response.status === 200) {
                if (response.data.result) {
                  this.$message({
                    type: 'success',
                    message: `修改用户信息成功!`,
                    duration: 1800
                  });
                  this.$router.back();
                } else {
                  this.$message({
                    type: 'error',
                    message: `修改用户信息失败：${response.data.message}`,
                    duration: 1800
                  });
                }
              } else {
                this.$message({
                  type: 'error',
                  message: `修改用户信息失败 ${response.status}：${response.statusText}`,
                  duration: 1800
                });
              }
            })
            .catch(err => {
              this.$message.error('修改用户信息失败:' + err.message);
            });
        } else {
          return false;
        }
      });
    },
    onCancel() {
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
    if (this.$route.params.userData && this.$route.params.userData.name.length > 0) {
      this.formData = this.$route.params.userData;
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
.form-item-value {
  margin-left: 10px;
}
.user-avatar {
  width: 50px;
  height: 50px;
  border-radius: 10px;
}
</style>
