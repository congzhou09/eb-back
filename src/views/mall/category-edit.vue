<template>
  <div class="app-container">
    <el-tabs value="1">
      <el-tab-pane :disabled="true" label="修改分类" name="1">
        <category-add-content @submit="onSubmit" :name="preData.name" :cover-url="preData.coverImgUrl" />
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script type="text/ecmascript-6">
import categoryAddContent from './category-add-content.vue';
import { editCategory } from '../../api/mall';
export default {
  components: {
    categoryAddContent
  },
  data() {
    return {
      preData: {
        categoryId: '',
        name: '',
        coverImgUrl: ''
      }
    };
  },
  methods: {
    onSubmit(formData) {
      const categoryInfo = { id: this.preData.categoryId, name: formData.name, imageUrl: formData.coverImgUrl };
      editCategory(categoryInfo)
        .then(response => {
          if (response.data.code === 200) {
            if (response.data.result) {
              this.$message({
                type: 'success',
                message: `分类修改成功!`,
                duration: 1800
              });
              this.addSuccess = true;
              this.$router.back();
            } else {
              this.$message({
                type: 'error',
                message: `分类修改失败：${response.data.message}`,
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
          this.$router.replace({ path: '/ware/category' });
        })
        .catch(() => {});
    }
  },
  created() {
    if (this.$route.params.categoryData && this.$route.params.categoryData.name.length > 0) {
      this.preData.categoryId = this.$route.params.categoryData.categoryId;
      this.preData.name = this.$route.params.categoryData.name;
      this.preData.coverImgUrl = this.$route.params.categoryData.imageUrl;
    } else {
      this.overdueMeg();
    }
  }
};
</script>

<style rel="stylesheet/scss" lang="scss" scoped></style>
