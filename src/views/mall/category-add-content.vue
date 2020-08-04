<template>
  <el-card>
    <el-form label-width="4rem" :rules="formRules" ref="categoryAdd" :model="formData">
      <el-form-item label="名称" prop="name">
        <el-input v-model="formData.name"></el-input>
      </el-form-item>
      <el-form-item label="图标" prop="coverImgUrl">
        <el-input style="display:none;" v-model="formData.coverImgUrl" :disabled="true"></el-input>
        <el-upload
          v-show="!formData.coverImgUrl"
          class="cover-uploader"
          multiple
          list-type="picture-card"
          accept=".jpg,.png"
          :show-file-list="false"
          :action="urlPrefix + '/file/upload/category'"
          :before-upload="beforeCoverImgUpload"
          :on-success="onCoverImgSuccess"
          :on-error="onCoverImgError"
          name="file"
        >
          <i class="el-icon-plus" ref="uploadElem"></i>
        </el-upload>
        <img v-if="formData.coverImgUrl" :src="formData.coverImgUrl" class="coverImgContainer" @click="onCoverImgContainerClick" />

        <!--<el-dialog v-model="coverDlgShow" size="tiny">-->
        <!--<img width="100%" :src="formData.coverImgUrl" alt="">-->
        <!--</el-dialog>-->
      </el-form-item>

      <el-form-item style="float:right;">
        <el-button type="primary" @click="onSubmit('categoryAdd')">确定</el-button>
        <el-button type="primary" @click="onCancel">取消</el-button>
      </el-form-item>
    </el-form>
  </el-card>
</template>

<script>
import fetch from 'utils/fetch';
export default {
  props: ['name', 'coverUrl'],
  data() {
    const nameValidator = (rule, value, callback) => {
      if (value.length <= 0) {
        callback(new Error('请输入分类名称'));
      } else {
        callback();
      }
    };
    const coverImgUrlValidator = (rule, value, callback) => {
      if (value.length <= 0) {
        callback(new Error('请添加分类图标'));
      } else {
        callback();
      }
    };

    return {
      formData: {
        name: '',
        coverImgUrl: ''
      },
      formRules: {
        name: [{ required: true, trigger: 'blur', validator: nameValidator }],
        coverImgUrl: [{ required: true, trigger: 'change', validator: coverImgUrlValidator }]
      },
      coverDlgShow: false,
      urlPrefix: fetch.defaults.baseURL
    };
  },
  methods: {
    onPreviewCoverImg(file) {
      this.coverDlgShow = true;
      //                this.formData.coverImgUrl = file.url;
    },
    beforeCoverImgUpload(file) {
      const acceptFileTypeList = ['image/jpeg', 'image/png'];
      const typeOK = acceptFileTypeList.join().indexOf(file.type) >= 0;
      const isLt500K = file.size / 1024 / 1024 / 1024 < 500;
      if (!typeOK) {
        this.$message.error('图片格式不支持！');
      }
      if (!isLt500K) {
        this.$message.error('单张上传图片大小不能超过 500kb！');
      }
      return typeOK && isLt500K;
    },
    onCoverImgSuccess(res, file) {
      this.formData.coverImgUrl = res;
      //                this.formData.coverImgUrl = URL.createObjectURL(file.raw);
    },
    onCoverImgError(err, file, fileList) {
      this.$message({
        message: '上传失败！',
        type: 'warning'
      });
    },
    onCoverImgContainerClick() {
      const { uploadElem } = this.$refs;
      if (!!uploadElem) {
        uploadElem.click();
      }
    },
    onSubmit(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          this.$emit('submit', this.formData);
        } else {
          return false;
        }
      });
    },
    onCancel() {
      this.$router.back();
    }
  },
  created() {
    if (this.$route.name === 'categoryMall-edit') {
      this.formData.name = this.name;
      this.formData.coverImgUrl = this.coverUrl;
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
.coverImgContainer {
  position: relative;
  top: 0;
  width: 100px;
  cursor: pointer;
  border-radius: 12px;
  border: 1px solid #e8e8e4;
}
</style>
