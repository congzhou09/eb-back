<!--概率序列-->
<template>
  <el-form label-width="6rem" :rules="formDataRules" ref="theForm" :model="formData">
    <!--<el-form-item label="模块">
            <el-select v-model="formData.farmModel" placeholder="选择一级区域">
                <el-option
                        v-for="item in farmModelList"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value">
                </el-option>
            </el-select>
        </el-form-item>-->

    <!--<el-form-item label="">
            <el-select v-model="formData.farmModelTwo" placeholder="选择二级区域">
                <el-option
                        v-for="item in farmModeTwolList"
                        :key="item.value"
                        :label="item.name"
                        :value="item.id">
                </el-option>
            </el-select>
        </el-form-item>-->
    <el-form-item label="名称" prop="name">
      <el-input v-model="formData.name" :maxlength="30"></el-input>
    </el-form-item>
    <el-form-item label="图标" prop="coverImgUrl" required>
      <el-input style="display:none;" v-model="formData.coverImgUrl" :disabled="true"></el-input>
      <el-upload
        v-show="!formData.coverImgUrl"
        class="cover-uploader"
        multiple
        list-type="picture-card"
        accept=".jpg,.png"
        :show-file-list="false"
        :action="urlPrefix + '/file/upload/banner'"
        :before-upload="beforeCoverImgUpload"
        :on-success="onCoverImgSuccess"
        :on-error="onCoverImgError"
        name="file"
      >
        <i class="el-icon-plus" ref="uploadElem"></i>
      </el-upload>
      <img v-if="formData.coverImgUrl" :src="formData.coverImgUrl" class="coverImgContainer" @click="onCoverImgContainerClick" />
    </el-form-item>

    <div style="text-align:right;">
      <el-button type="primary" @click="onOk('theForm')">确定</el-button>
      <el-button type="primary" @click="onCancel">取消</el-button>
    </div>
  </el-form>
</template>

<script type="text/ecmascript-6">
import fetch from 'utils/fetch';
import { farmModelList } from '../../utils/appCommon';
import { updateFarmicon, getfarmicon } from '../../api/upgrade';
export default {
  /* props: {
            index: 0,
            gameUserInfo: {},
            operType: {
                type: String,
                default: 'add'
            }
        },*/
  props: {
    curType: {
      type: String,
      default: 'add'
    },
    processID: {
      type: Number
    }
  },
  //        props:["name","probabilityList"],
  data() {
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
        isCurrent: true,
        onIndex: 0,
        coverImgUrl: '',
        farmModel: '',
        farmModelTwo: ''
      },
      formDataRules: {
        coverImgUrl: [{ required: true, trigger: 'change', validator: coverImgUrlValidator }]
      },
      farmModelList: farmModelList,
      farmModeTwolList: [],
      urlPrefix: fetch.defaults.baseURL
    };
  },
  methods: {
    onCancel() {
      this.$emit('cancel');
    },
    onOk(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          // 修改
          const iconInfo = { id: this.processID, name: this.formData.name, img: this.formData.coverImgUrl };
          updateFarmicon(iconInfo)
            .then(response => {
              if (response.status === 200) {
                if (response.data.code === 200) {
                  this.$message({
                    type: 'success',
                    message: `更新图标设置成功`,
                    duration: 1800
                  });
                  this.$emit('ok');
                } else {
                  this.$message({
                    type: 'error',
                    message: `更新图标设置失败：${response.data.message}`,
                    duration: 1800
                  });
                }
              } else {
                this.$message({
                  type: 'error',
                  message: `更新图标设置失败 ${response.status}：${response.statusText}`,
                  duration: 1800
                });
              }
              this.$emit('cancel');
              this.$nextTick(() => {
                this.isLoading = false;
              });
            })
            .catch(err => {
              this.isLoading = false;
              this.$message.error('更新图标设置失败:' + err.message);
              this.$emit('cancel');
            });
        } else {
          return false;
        }
      });
    },
    initData() {
      this.selectedMallList.length = 0;
      this.$delete(this.selectedMallList, 0);
      this.lastSelectedItems.forEach((value, index, array) => {
        this.$set(this.selectedMallList, index, value);
      });
      if (this.$refs.mallSelectComp) {
        this.$refs.mallSelectComp.initData();
      }
    },
    // 根据ID获取要修改的信息
    getInfo() {
      this.isLoading = true;
      // console.log('id获取',this.processID);
      const getfarmiconInfo = { id: this.processID };
      getfarmicon(getfarmiconInfo)
        .then(response => {
          if (response.status === 200) {
            if (response.data.code === 200) {
              const resData = response.data.resData;

              /*  this.formData.farmModel = resData.u;
                            this.formData.farmModelTwo = resData.d;*/
              this.formData.name = resData.name;
              this.formData.coverImgUrl = resData.img;
            } else {
              this.$message({
                type: 'error',
                message: `获取图标信息失败：${response.data.message}`,
                duration: 1800
              });
              this.$emit('cancel');
            }
          } else {
            this.$message({
              type: 'error',
              message: `获取图标信息失败 ${response.status}：${response.statusText}`,
              duration: 1800
            });
            this.$emit('cancel');
          }

          this.$nextTick(() => {
            this.isLoading = false;
          });
        })
        .catch(err => {
          this.isLoading = false;
          this.$message.error('获取图标信息失败:' + err.message);
          this.$emit('cancel');
        });
    },
    onInit() {
      this.$refs['theForm'].resetFields();
      this.$nextTick(() => {
        this.getInfo();
      });
    },
    /* 添加图片处理*/
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
      // this.formData.coverImgUrl = URL.createObjectURL(file.raw);
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
  mounted() {
    this.onInit();
  },
  created() {
    //            console.log(this.processID);
  }
};
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
.coverImgContainer {
  position: relative;
  top: 0;
  width: 320px;
  min-height: 150px;
  cursor: pointer;
  border-radius: 12px;
  border: 1px solid #e8e8e4;
}
</style>
