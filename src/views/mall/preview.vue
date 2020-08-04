<template>
  <div v-html="content" class="preview-container"></div>
</template>

<script>
export default {
  props: {
    content: String
  }
};
</script>

<style rel="stylesheet/scss" lang="scss">
.preview-container {
  border: 1px solid rgba(177, 177, 177, 0.6);
  .detail-img {
    width: 100%;
    vertical-align: middle;
  }
}
</style>
