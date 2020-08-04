<template>
  <div class="app-container">
    <el-tabs value="1">
      <el-tab-pane :disabled="true" label="修改banner" name="1">
        <banner-add-content @submit="onSubmit" :bannerAddData="bannerEditData" />
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
import { editBanner } from 'api/activity';
import bannerAddContent from './banner-add-content';
export default {
  components: {
    bannerAddContent
  },
  data() {
    return {
      bannerEditData: {}
    };
  },
  methods: {
    onSubmit(formData) {
      //                var formData = new FormData();
      //                formData.append('id',formData.id);
      //                formData.append('name', formData.name);
      //                formData.append('engname', formData.englishName);
      //                formData.append('acitivityNo', formData.activityNumber);

      const bannerInfo = {
        id: formData.id,
        name: formData.name,
        engname: formData.englishName,
        acitivityNo: formData.activityNumber,
        imageUrl: formData.image_url,
        url: formData.link_url
      };
      editBanner(bannerInfo)
        .then(response => {
          if (response.status === 200) {
            if (response.data.result) {
              this.$message({
                type: 'success',
                message: `banner修改成功!`,
                duration: 1800
              });
              this.addSuccess = true;
              this.$router.back();
            } else {
              this.$message({
                type: 'error',
                message: `banner修改失败：${response.data.message}`,
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
    },
    overdueMeg() {
      this.$confirm('当前页面已过期，将返回列表页。', '', {
        confirmButtonText: '确定'
      })
        .then(() => {
          this.$router.replace({ path: '/activity/banner' });
        })
        .catch(() => {});
    }
  },
  created() {
    if (this.$route.params.bannerEditData && Object.getOwnPropertyNames(this.$route.params.bannerEditData).length > 0) {
      this.bannerEditData = this.$route.params.bannerEditData;
      this.bannerEditData.englishName = this.bannerEditData.engname;
      this.bannerEditData.activityNumber = this.bannerEditData.acitivityNo;
      this.bannerEditData.image_url = this.bannerEditData.imageUrl;
      this.bannerEditData.link_url = this.bannerEditData.url;
    } else {
      this.overdueMeg();
    }
  }
};
</script>

<style rel="stylesheet/scss" lang="scss" scoped></style>
