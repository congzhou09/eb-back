<template>
  <el-card class="el-card-in-dlg">
    <div>
      <ul class="info-list">
        <li><label class="title-label">用户ID：</label>{{ superiorInfo.userID }}</li>
        <li><label class="title-label">UUID：</label>{{ superiorInfo.UUID }}<span v-if="superiorInfo.UUID === null">无</span></li>
        <li><label class="title-label">昵称：</label>{{ superiorInfo.nickName }}</li>
        <li><label class="title-label">手机号：</label>{{ superiorInfo.telephone }}</li>
        <li><label class="title-label">代理ID：</label>{{ superiorInfo.agentID }}</li>
      </ul>
    </div>

    <div class="btn-group">
      <el-button type="primary" @click="$emit('cancel')">关闭</el-button>
    </div>
  </el-card>
</template>

<script type="text/ecmascript-6">
import {getSuperior} from '../../api/agent';
export default{
    props:{
        superiorID:{
            type: Number
        }
    },
    data(){
        return {
            superiorInfo: {
                userID: '',
                UUID: '',
                nickName: '',
                telephone: '',
                agentID: ''
            }
        };
    },
    methods:{
        onInit(){
            getSuperior({parentProxyId: this.superiorID}).then(response=> {
                if (response.status === 200) {
                    if (response.data.result) {
                        const resData = response.data.resData;
                        this.superiorInfo.userID = resData.userId;
                        this.superiorInfo.UUID = resData.uuid;
                        this.superiorInfo.nickName = resData.nickname;
                        this.superiorInfo.telephone = resData.phone;
                        this.superiorInfo.agentID = resData.proxyId;
                    }
                    else {
                        this.$message({
                            type: 'error',
                            message: `获取上级代理信息失败：${response.data.message}`,
                            duration: 1800
                        });
                    }
                }
                else {
                    this.$message({
                        type: 'error',
                        message: `获取上级代理信息失败 ${response.status}：${response.statusText}`,
                        duration: 1800
                    });
                }
            }).catch(err=> {
                this.$message.error("获取上级代理信息失败:" + err.message);
            });
        }
    },
    created(){
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
  .btn-group {
    text-align: right;
    margin: 1rem 7px 0 0;
  }
}
.info-list {
  list-style: none;
  padding: 0;
  li {
    margin: 6px 0;
    padding-bottom: 5px;
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
  }
}
</style>
