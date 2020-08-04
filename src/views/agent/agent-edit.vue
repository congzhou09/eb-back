<template>
  <el-card class="el-card-in-dlg">
    <el-form label-width="6rem" :model="formData" ref="theForm">
      <el-form-item label="代理ID">
        <span>{{ formData.agentID }}</span>
      </el-form-item>
      <el-form-item label="代理等级" prop="agentLevel">
        <el-select v-model="formData.agentLevel">
          <el-option v-for="item in agentGradeList" :key="item.value" :label="item.label" :value="item.value"> </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="代理状态">
        <el-select v-model="formData.agentState">
          <el-option v-for="item in agentStateList" :key="item.value" :label="item.label" :value="item.value"> </el-option>
        </el-select>
      </el-form-item>
    </el-form>

    <div class="btn-group">
      <el-button type="primary" @click="onOk">保存</el-button>
      <el-button type="primary" @click="$emit('cancel')">取消</el-button>
    </div>
  </el-card>
</template>

<script type="text/ecmascript-6">
import { agentGradeList, agentStateList } from '../../utils/agentCommon';
import { validatorID } from '../../utils/validate';
import { editAgent } from '../../api/agent';
export default {
  props: {
    formDataProp: {
      type: Object,
      default: function() {
        return {
          agentID: '',
          agentLevel: 1,
          agentState: 1
        };
      }
    }
  },
  data() {
    return {
      formData: {
        agentID: '',
        agentLevel: 1,
        agentState: 1
      },
      agentGradeList: agentGradeList,
      agentStateList: agentStateList
    };
  },
  methods: {
    idValidator(rule, value, callback) {
      if (!value || value.length <= 0) {
        callback(new Error('ID不可以为空'));
      } else {
        return validatorID(rule, value, callback);
      }
    },
    onOk() {
      const agentInfo = {
        proxyId: this.formData.agentID,
        status: this.formData.agentState,
        proxyLevel: this.formData.agentLevel
      };
      editAgent(agentInfo)
        .then(response => {
          if (response.status === 200) {
            if (response.data.result) {
              this.$message({
                type: 'success',
                message: `修改代理信息成功!`,
                duration: 1800
              });
              this.$emit('ok');
            } else {
              this.$message({
                type: 'error',
                message: `修改代理信息失败：${response.data.message}`,
                duration: 1800
              });
            }
          } else {
            this.$message({
              type: 'error',
              message: `修改代理信息失败 ${response.status}：${response.statusText}`,
              duration: 1800
            });
          }
        })
        .catch(err => {
          this.$message.error('修改代理信息失败:' + err.message);
        });
    },
    onInit() {
      this.$refs['theForm'].resetFields();
      for (const key in this.formData) {
        if ({}.hasOwnProperty.call(this.formData, key)) {
          this.formData[key] = this.formDataProp[key];
        }
      }
    }
  },
  mounted() {
    this.onInit();
  }
};
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
.el-card {
  background-color: white;
  max-width: 40rem;
  box-shadow: none;
  padding: 0;
  .el-input {
    width: 198px;
  }
  .btn-group {
    text-align: right;
    margin: 1rem 7px 0 0;
  }
}
</style>
