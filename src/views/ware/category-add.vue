<template>
  <div class="app-container">
    <el-tabs value="1">
      <el-tab-pane :disabled="true" label="新增分类" name="1">
        <category-add-content @submit="onSubmit" />
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
import { addCategory } from 'api/ware';
import categoryAddContent from './category-add-content.vue';
import { hintSaveBeforeLeave } from '../../utils/appCommon';
export default {
  data() {
    return {
      addSuccess: false
    };
  },
  components: {
    categoryAddContent
  },
  methods: {
    onSubmit(formData) {
      const categoryInfo = { name: formData.name, imageUrl: formData.coverImgUrl };
      addCategory(categoryInfo)
        .then(response => {
          if (response.status === 200) {
            if (response.data.result) {
              this.$message({
                type: 'success',
                message: `分类添加成功!`,
                duration: 1800
              });
              this.addSuccess = true;
              this.$router.back();
            } else {
              this.$message({
                type: 'error',
                message: `分类添加失败：${response.data.message}`,
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
