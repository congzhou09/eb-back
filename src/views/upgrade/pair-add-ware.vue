<template>
  <div>
    <el-steps :active="curStep" :align-center="true">
      <el-step title="添加基础商品"></el-step>
      <el-step title="添加升值商品"></el-step>
      <el-step title="添加其他信息"></el-step>
    </el-steps>
    <div class="stepRegion" v-if="curStep === 0">
      <div class="selectRegion">
        <ware-select
          key="0"
          :multipleSelect="false"
          :lastSelectedItems="baseWareSelected"
          @selectedWareChange="onBaseWareSelect"
        ></ware-select>
      </div>
      <div class="resultText">
        已选商品：<br /><strong
          ><span v-if="baseWareSelected.length <= 0">无</span><span v-else>{{ baseWareSelected[0].wareName }}</span></strong
        >
      </div>
      <div style="text-align: right;">
        <el-button type="primary" @click="onBaseWareComplete" :disabled="baseWareSelected.length <= 0">下一步</el-button>
      </div>
    </div>

    <div class="stepRegion" v-else-if="curStep === 1">
      <div class="selectRegion">
        <ware-select
          key="1"
          :multipleSelect="true"
          :lastSelectedItems="upgradeWareSelected"
          @selectedWareChange="onUpgradeWareSelect"
        ></ware-select>
      </div>
      <div class="resultText">
        已选商品：<br /><strong
          ><span v-if="upgradeWareSelected.length <= 0">无</span><span v-else>{{ upgradeWareNameSelected.join(',') }}</span></strong
        >
      </div>
      <div style="text-align: right;">
        <el-button type="primary" @click="onGoBack">上一步</el-button>
        <el-button type="primary" @click="onUpgradeWareComplete" :disabled="upgradeWareSelected.length <= 0">下一步</el-button>
      </div>
    </div>

    <div class="stepRegion" v-else>
      <el-form class="" label-width="6rem" :rules="formRules" :model="formData">
        <el-form-item label="基础商品图" required>
          <el-upload
            accept=".jpg,.png"
            :show-file-list="false"
            :action="urlPrefix + '/file/upload/pairCover'"
            :before-upload="beforeCoverImgUpload"
            :on-success="onBaseCoverImgSuccess"
            :on-error="onCoverImgError"
            name="file"
            list-type="picture-card"
          >
            <img v-if="formData.baseWareImgUrl" :src="formData.baseWareImgUrl" class="cover-img" />
            <i v-else class="el-icon-plus"></i>
          </el-upload>
        </el-form-item>
        <el-form-item label="升值商品图" required>
          <el-upload
            accept=".jpg,.png"
            :show-file-list="false"
            :action="urlPrefix + '/file/upload/pairCover'"
            :before-upload="beforeCoverImgUpload"
            :on-success="onUpgradeCoverImgSuccess"
            :on-error="onCoverImgError"
            name="file"
            list-type="picture-card"
          >
            <img v-if="formData.upgradeWareImgUrl" :src="formData.upgradeWareImgUrl" class="cover-img" />
            <i v-else class="el-icon-plus"></i>
          </el-upload>
        </el-form-item>
        <el-form-item label="玩法选择" required>
          <el-radio v-for="item in gameTypeList" v-model="formData.gameType" :key="item.id" :label="item.id">{{ item.name }}</el-radio>
        </el-form-item>
        <!--如果玩法选择-欢乐农场-->
        <el-form-item v-if="formData.gameType === 3" label="区域选择" required>
          <el-select v-model="formData.level" placeholder="选择区域">
            <el-option v-for="item in farmModelList" :key="item.value" :label="item.label" :value="item.value"> </el-option>
          </el-select>
        </el-form-item>
      </el-form>

      <div style="text-align: right;">
        <el-button type="primary" @click="onGoBack">上一步</el-button>
        <el-button
          type="primary"
          @click="onWholeComplete"
          :disabled="
            formData.baseWareImgUrl.length === 0 ||
              formData.upgradeWareImgUrl.length === 0 ||
              formData.gameType === -1 ||
              (formData.gameType === 3 && !formData.level)
          "
        >
          完成</el-button
        >
      </div>
    </div>
  </div>
</template>

<script>
import fetch from 'utils/fetch';
import wareSelect from '../ware/ware-select.vue';
import { farmModelList } from '../../utils/appCommon';
import { addPair, getGameList } from '../../api/upgrade';
export default {
  data() {
    return {
      curStep: 0,
      baseWareSelected: [],
      upgradeWareSelected: [],
      upgradeWareNameSelected: [],
      gameTypeList: [],

      formData: {
        baseWareImgUrl: '',
        upgradeWareImgUrl: '',
        gameType: -1,
        level: ''
      },
      formRules: {},
      urlPrefix: fetch.defaults.baseURL,
      farmModelList
    };
  },
  methods: {
    initData() {
      this.curStep = 0;
      this.baseWareSelected.length = 0;
      this.upgradeWareSelected.length = 0;
      this.upgradeWareNameSelected.length = 0;
      this.formData = {
        baseWareImgUrl: '',
        upgradeWareImgUrl: '',
        gameType: -1
      };
      this.getGameTypeList();
    },
    getGameTypeList() {
      this.gameTypeList.length = 0;
      this.$delete(this.gameTypeList, 0);
      getGameList()
        .then(response => {
          if (response.status === 200) {
            response.data.forEach((value, index) => {
              const oneItem = {
                id: value.id,
                name: value.name,
                buyCountLimit: value.num
              };
              this.$set(this.gameTypeList, index, oneItem);
            });
          } else {
            this.$message({
              type: 'error',
              message: `获取玩法列表失败 ${response.status}：${response.statusText}, 请刷新页面`,
              duration: 1800
            });
          }
        })
        .catch(err => {
          this.$message.error(`获取玩法列表失败: ${err.message}, 请刷新页面`);
        });
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
    onBaseCoverImgSuccess(res, file) {
      this.formData.baseWareImgUrl = res;
    },
    onUpgradeCoverImgSuccess(res, file) {
      this.formData.upgradeWareImgUrl = res;
    },
    onCoverImgError(err, file, fileList) {
      this.$message({
        message: '上传失败！',
        type: 'warning'
      });
    },
    onBaseWareSelect(selectedWares) {
      this.baseWareSelected = selectedWares;
    },
    onUpgradeWareSelect(selectedWares) {
      this.upgradeWareSelected = selectedWares;
      this.upgradeWareNameSelected.length = 0;
      selectedWares.forEach((value, index, array) => {
        this.upgradeWareNameSelected.push(value.wareName);
      });
    },
    onBaseWareComplete() {
      if (this.baseWareSelected.length > 0) {
        this.curStep = 1;
      }
    },
    onUpgradeWareComplete() {
      if (this.upgradeWareSelected.length > 0) {
        this.curStep = 2;
      }
    },
    onWholeComplete() {
      const upgradeIds = [];
      this.upgradeWareSelected.forEach((value, index) => {
        upgradeIds.push(value.id);
      });
      const pairInfo = {
        productId: this.baseWareSelected[0].id,
        categoryId: this.baseWareSelected[0].categoryId,
        gameId: this.formData.gameType,
        basicimage: this.formData.baseWareImgUrl,
        upimage: this.formData.upgradeWareImgUrl,
        ids: upgradeIds.join(','),
        level: this.formData.level === '' ? 0 : this.formData.level
      };
      console.log(pairInfo);
      addPair(pairInfo)
        .then(response => {
          if (response.status === 200) {
            if (response.data.result) {
              this.$message({
                type: 'success',
                message: `新增促销商品成功!`,
                duration: 1800
              });
              this.$emit('selectWareComplete');
            } else {
              this.$message({
                type: 'error',
                message: `新增促销商品失败：${response.data.message}`,
                duration: 1800
              });
            }
          } else {
            this.$message({
              type: 'error',
              message: `新增促销商品失败 ${response.status}：${response.statusText}`,
              duration: 1800
            });
          }
        })
        .catch(err => {
          this.$message.error('新增促销商品失败:' + err.message);
        });
    },
    onGoBack() {
      this.curStep = this.curStep - 1;
    }
  },
  components: {
    wareSelect
  },
  mounted() {
    this.getGameTypeList();
  }
};
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
.stepRegion {
  width: 100%;
  .selectRegion {
    border: 1px solid #c9c9c9;
  }
  .resultText {
    padding: 10px 8px 0 8px;
    background-color: rgba(244, 251, 251, 0.37);
    strong {
      width: 100%;
      color: #1b4774;
    }
  }
}
.el-form-item {
  margin-top: 20px;
  padding: 10px 0;
  border-bottom: 1px dashed;
}
.cover-img {
  width: 80px;
  height: 80px;
  border-radius: 6px;
}
.el-form-item__label {
  margin-right: 15px;
}
</style>
<style rel="stylesheet/scss" lang="scss">
.stepRegion {
  .el-upload {
    width: 80px;
    height: 80px;
    .el-icon-plus {
      line-height: 80px;
    }
  }
}
</style>
