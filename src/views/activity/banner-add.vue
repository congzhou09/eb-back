<template>
  <div class="app-container">
    <el-tabs value="1">
      <el-tab-pane :disabled="true" label="新增banner" name="1">
        <banner-add-content @submit="onSubmit" />
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
import { addBanner } from 'api/activity';
import bannerAddContent from './banner-add-content';
import { hintSaveBeforeLeave } from '../../utils/appCommon';
export default {
  data() {
    return {
      addSuccess: false
    };
  },
  components: {
    bannerAddContent
  },
  methods: {
    onSubmit(formData) {
      const bannerInfo = {
        name: formData.name,
        engname: formData.englishName,
        acitivityNo: formData.activityNumber,
        imageUrl: formData.image_url,
        url: formData.link_url
      };
      addBanner(bannerInfo)
        .then(response => {
          if (response.status === 200) {
            if (response.data.result) {
              this.$message({
                type: 'success',
                message: `banner添加成功!`,
                duration: 1800
              });
              this.addSuccess = true;
              this.$router.back();
            } else {
              this.$message({
                type: 'error',
                message: `banner添加失败：${response.data.message}`,
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

<style rel="stylesheet/scss" lang="scss" scoped></style>
