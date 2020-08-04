<template>
  <div class="app-container">
    <el-tabs value="1">
      <el-tab-pane :disabled="true" label="新增玩法" name="1">
        <el-card>
          <el-form label-width="6rem" :rules="formRules" ref="gametypeForm" :model="formData">
            <el-form-item label="玩法名称" prop="name" required>
              <el-input v-model="formData.name" style="max-width: 20rem;"></el-input>
            </el-form-item>
            <el-form-item label="购买次数" prop="buyCountLimit" required>
              <el-input-number v-model="formData.buyCountLimit" :min="1" :max="999" style="max-width: 20rem;"></el-input-number>
            </el-form-item>
            <!--<el-form-item label="图片" porp="image_url" required>
                            <el-input style="display:none;" v-model="formData.image_url" :disabled="true"></el-input>
                            <el-upload v-show="!formData.image_url" class="cover-uploader"
                                       accept=".jpg,.png"
                                       :show-file-list="false"
                                       :action="urlPrefix + '/file/upload/banner'"
                                       :before-upload="beforeCoverImgUpload"
                                       :on-success="onCoverImgSuccess"
                                       :on-error="onCoverImgError"
                                       name="file" list-type="picture-card">
                                <i class="el-icon-plus" ref="uploadElem"></i>
                            </el-upload>
                            <img v-if="formData.image_url" :src="formData.image_url" class="coverImgContainer" @click="onCoverImgContainerClick">

                            &lt;!&ndash;<el-dialog v-model="coverDlgShow" size="tiny">&ndash;&gt;
                            &lt;!&ndash;<img width="100%" :src="formData.image_url" alt="">&ndash;&gt;
                            &lt;!&ndash;</el-dialog>&ndash;&gt;
                        </el-form-item>-->
            <el-form-item style="float:right;">
              <el-button type="primary" @click="onSubmit('gametypeForm')">确定</el-button>
              <el-button type="primary" @click="onCancel">取消</el-button>
            </el-form-item>
          </el-form>
        </el-card>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script type="text/ecmascript-6">
import fetch from 'utils/fetch';
import { hintSaveBeforeLeave } from '../../utils/appCommon';
import { addGame, editGame } from '../../api/upgrade';
export default {
  data() {
    function nameValidator(rule, value, callback) {
      if (value.length <= 0) {
        callback(new Error('请输入玩法名称'));
      } else {
        callback();
      }
    }
    function buyCountLimitValidator(rule, value, callback) {
      if (value.length <= 0) {
        callback(new Error('请输入购买次数'));
      } else {
        callback();
      }
    }
    const imageUrlValidator = (rule, value, callback) => {
      if (value.length <= 0) {
        callback(new Error('请添加图片'));
      } else {
        callback();
      }
    };
    return {
      curPageType: 'add', // add-添加页面 edit-编辑页面
      formData: {
        id: -1,
        name: '',
        buyCountLimit: 10,
        image_url: ''
      },
      formRules: {
        name: [{ required: true, trigger: 'blur', validator: nameValidator }],
        buyCountLimit: [{ required: true, trigger: 'blur', validator: buyCountLimitValidator }],
        image_url: [{ required: true, trigger: 'change', validator: imageUrlValidator }]
      },
      addSuccess: false,
      urlPrefix: fetch.defaults.baseURL
    };
  },
  methods: {
    onSubmit(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          const gameInfo = { name: this.formData.name, num: this.formData.buyCountLimit };

          if (this.curPageType === 'add') {
            // 新增玩法
            addGame(gameInfo)
              .then(response => {
                if (response.status === 200) {
                  if (response.data.result) {
                    this.$message({
                      type: 'success',
                      message: `新增玩法成功!`,
                      duration: 1800
                    });
                    this.addSuccess = true;
                    this.$router.back();
                  } else {
                    this.$message({
                      type: 'error',
                      message: `新增玩法失败：${response.data.message}`,
                      duration: 1800
                    });
                  }
                } else {
                  this.$message({
                    type: 'error',
                    message: `新增玩法失败 ${response.status}：${response.statusText}`,
                    duration: 1800
                  });
                }
              })
              .catch(err => {
                this.$message.error('新增玩法失败:' + err.message);
              });
          } // 修改玩法
          else {
            gameInfo.id = this.formData.id;
            editGame(gameInfo)
              .then(response => {
                if (response.status === 200) {
                  if (response.data.result) {
                    this.$message({
                      type: 'success',
                      message: `修改玩法成功!`,
                      duration: 1800
                    });
                    this.addSuccess = true;
                    this.$router.back();
                  } else {
                    this.$message({
                      type: 'error',
                      message: `修改玩法失败：${response.data.message}`,
                      duration: 1800
                    });
                  }
                } else {
                  this.$message({
                    type: 'error',
                    message: `修改玩法失败 ${response.status}：${response.statusText}`,
                    duration: 1800
                  });
                }
              })
              .catch(err => {
                this.$message.error('修改玩法失败:' + err.message);
              });
          }
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
          this.$router.replace({ path: '/upgrade/game' });
        })
        .catch(() => {});
    },
    // 图片上传
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
    }
  },
  created() {
    if (this.$route.name === 'gametype-edit') {
      this.curPageType = 'edit';
      if (this.$route.params.gametypeEditData && Object.getOwnPropertyNames(this.$route.params.gametypeEditData).length > 0) {
        this.formData.id = this.$route.params.gametypeEditData.id;
        this.formData.name = this.$route.params.gametypeEditData.name;
        this.formData.buyCountLimit = this.$route.params.gametypeEditData.buyCountLimit;
      } else {
        this.overdueMeg();
      }
    }
  },
  beforeRouteLeave(to, from, next) {
    if (this.$route.name != 'gametype-edit') {
      if (!this.addSuccess) {
        hintSaveBeforeLeave(to, from, next, this);
      } else {
        next(true);
      }
    } else {
      next(true);
    }
  }
};
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
.el-card {
  max-width: 70rem;
  box-shadow: none;
  padding-bottom: 0.9rem;
  .el-form-item {
    margin: 18px 0 12px 0;
  }
  .el-input-number {
    width: 100%;
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
