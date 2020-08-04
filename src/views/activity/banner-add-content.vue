<template>
  <el-card>
    <el-form label-width="6rem" :rules="formRules" ref="bannerForm" :model="formData">
      <el-form-item label="活动名称" prop="name">
        <el-input v-model="formData.name"></el-input>
      </el-form-item>
      <el-form-item label="名称(英文)" prop="englishName">
        <el-input v-model="formData.englishName"></el-input>
      </el-form-item>
      <el-form-item label="活动编号" prop="activityNumber">
        <el-input v-model="formData.activityNumber"></el-input>
      </el-form-item>
      <el-form-item label="链接" prop="link_url">
        <el-input v-model="formData.link_url"></el-input>
      </el-form-item>
      <el-form-item label="图片">
        <el-input style="display:none;" v-model="formData.image_url" :disabled="true"></el-input>
        <el-upload
          v-show="!formData.image_url"
          class="cover-uploader"
          accept=".jpg,.png"
          :show-file-list="false"
          :action="urlPrefix + '/file/upload/banner'"
          :before-upload="beforeCoverImgUpload"
          :on-success="onCoverImgSuccess"
          :on-error="onCoverImgError"
          name="file"
          list-type="picture-card"
        >
          <i class="el-icon-plus" ref="uploadElem"></i>
        </el-upload>
        <img v-if="formData.image_url" :src="formData.image_url" class="coverImgContainer" @click="onCoverImgContainerClick" />

        <!--<el-dialog v-model="coverDlgShow" size="tiny">-->
        <!--<img width="100%" :src="formData.image_url" alt="">-->
        <!--</el-dialog>-->
      </el-form-item>

      <el-form-item style="float:right;">
        <el-button type="primary" @click="onSubmit('bannerForm')">确定</el-button>
        <el-button type="primary" @click="onCancel">取消</el-button>
      </el-form-item>
    </el-form>
  </el-card>
</template>

<script type="text/ecmascript-6">
import fetch from 'utils/fetch';
export default {
  props: ['bannerAddData'],
  data() {
    const nameValidator = (rule, value, callback) => {
      if (value.length <= 0) {
        callback(new Error('请输入名称'));
      } else {
        callback();
      }
    };
    const englishNameValidator = (rule, value, callback) => {
      if (value.length <= 0) {
        callback(new Error('请输入名称'));
      } else if (value.match(/[\u4e00-\u9fa5]/)) {
        callback(new Error('不可以包含中文'));
      } else {
        callback();
      }
    };
    const activityNumberValidator = (rule, value, callback) => {
      if (value.length <= 0) {
        callback(new Error('请输入活动编号'));
      } else {
        callback();
      }
    };
    const linkUrlValidator = (rule, value, callback) => {
      if (value.length <= 0) {
        callback(new Error('请输入链接'));
      } else {
        callback();
      }
    };
    const imageUrlValidator = (rule, value, callback) => {
      if (value.length <= 0) {
        callback(new Error('请添加图片'));
      } else {
        callback();
      }
    };

    return {
      formData: {
        id: '',
        name: '',
        englishName: '',
        activityNumber: '',
        image_url: '',
        link_url: ''
      },
      formRules: {
        name: [{ required: true, trigger: 'blur', validator: nameValidator }],
        englishName: [{ required: true, trigger: 'blur', validator: englishNameValidator }],
        activityNumber: [{ required: true, trigger: 'blur', validator: activityNumberValidator }],
        link_url: [{ required: true, trigger: 'blur', validator: linkUrlValidator }],
        image_url: [{ required: true, trigger: 'change', validator: imageUrlValidator }]
      },
      coverDlgShow: false,
      urlPrefix: fetch.defaults.baseURL
    };
  },
  methods: {
    onPreviewCoverImg(file) {
      this.coverDlgShow = true;
      //                this.formData.image_url = file.url;
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
      this.$set(this.formData, 'image_url', res);
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
    if (this.$route.name === 'banner-edit') {
      this.formData.id = this.bannerAddData.id;
      this.formData.name = this.bannerAddData.name;
      this.formData.englishName = this.bannerAddData.englishName;
      this.formData.activityNumber = this.bannerAddData.activityNumber;
      this.formData.image_url = this.bannerAddData.image_url;
      this.formData.link_url = this.bannerAddData.link_url;
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
  width: 320px;
  cursor: pointer;
  border-radius: 12px;
  border: 1px solid #e8e8e4;
}
</style>
