<template>
  <div class="app-container">
    <el-tabs value="first">
      <el-tab-pane :disabled="true" label="商品详情" name="first">
        <el-card id="pair-edit">
          <el-form class="" label-width="6rem" :rules="formRules" :model="formData">
            <el-form-item label="所属玩法" required>
              <el-radio v-for="item in gameTypeList" v-model="formData.gameType" :key="item.id" :label="item.id">{{ item.name }}</el-radio>
            </el-form-item>

            <el-form-item label="添加时间">
              <span>{{ convertToTimeString(formData.addTime) }}</span>
            </el-form-item>

            <el-form-item label="商品状态">
              <span>{{ convertToPairStateLabel(formData.state) }}</span>
            </el-form-item>

            <!--如果玩法选择-欢乐农场-->
            <el-form-item v-if="formData.gameType === 3" label="区域选择" required>
              <el-select v-model="formData.level" placeholder="选择区域">
                <el-option v-for="item in farmModelList" :key="item.value" :label="item.label" :value="item.value"> </el-option>
              </el-select>
            </el-form-item>
            <hr />

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
            <hr />
            <el-form-item label="基础商品" required></el-form-item>

            <el-table :data="baseWareTableData" border style="width: 100%">
              <el-table-column align="center" prop="wareNumber" label="货号" width="120"> </el-table-column>
              <el-table-column align="center" label="名称" width="130">
                <template slot-scope="scope">
                  {{ scope.row.wareName }}
                </template>
              </el-table-column>
              <el-table-column align="center" label="所属分类" width="180">
                <template slot-scope="scope">
                  {{ convertToCategoryLabel(wareCategoryList, scope.row.category) }}
                </template>
              </el-table-column>
              <el-table-column align="center" label="价格(元)">
                <template slot-scope="scope">
                  {{ convertToMoneyAmount(scope.row.price) }}
                </template>
              </el-table-column>
              <el-table-column align="center" label="状态">
                <template slot-scope="scope">
                  {{ convertToWareStateLabel(scope.row.state) }}
                </template>
              </el-table-column>

              <el-table-column align="center" label="操作">
                <el-button type="text" size="small" @click="baseWareDlgShow = true">替换</el-button>
              </el-table-column>
            </el-table>

            <el-form-item label="升值商品" required>
              <el-button type="primary" @click="upgradeWareDlgShow = true">添加</el-button>
            </el-form-item>
            <el-table :data="upgradeWareTableData" border style="width: 100%">
              <el-table-column align="center" prop="wareNumber" label="货号" width="120"> </el-table-column>
              <el-table-column align="center" label="名称" width="130">
                <template slot-scope="scope">
                  {{ scope.row.wareName }}
                </template>
              </el-table-column>
              <el-table-column align="center" label="所属分类" width="180">
                <template slot-scope="scope">
                  {{ convertToCategoryLabel(wareCategoryList, scope.row.category) }}
                </template>
              </el-table-column>
              <el-table-column align="center" label="价格(元)">
                <template slot-scope="scope">
                  {{ convertToMoneyAmount(scope.row.price) }}
                </template>
              </el-table-column>
              <el-table-column align="center" label="状态">
                <template slot-scope="scope">
                  {{ convertToWareStateLabel(scope.row.state) }}
                </template>
              </el-table-column>

              <el-table-column align="center" label="操作">
                <template slot-scope="scope">
                  <template>
                    <el-button
                      type="text"
                      size="small"
                      @click="
                        upgradeWareSingleTableData.length = 0;
                        upgradeWareSingleTableData.push(scope.row);
                        upgradeWareSingleDlgShow = true;
                      "
                      >替换</el-button
                    >
                    <span style="margin: 0 5px;color:rgb(27, 110, 171);">|</span>
                    <el-button type="text" size="small" @click="onRemove(scope)">移除</el-button>
                  </template>
                </template>
              </el-table-column>
            </el-table>
          </el-form>

          <div style="margin:40px 10px 0 0;text-align:right;">
            <el-button
              type="primary"
              :disabled="
                formData.baseWareImgUrl.length === 0 ||
                  formData.upgradeWareImgUrl.length === 0 ||
                  formData.gameType === -1 ||
                  this.baseWareTableData.length <= 0 ||
                  this.upgradeWareTableData.length <= 0
              "
              @click="onEditPair"
              >保存</el-button
            >
            <el-button type="primary" @click="$router.back()">取消</el-button>
          </div>
        </el-card>

        <!--对话框-->
        <el-dialog title="选择基础商品" :visible.sync="baseWareDlgShow" :close-on-click-modal="false" @open="onBaseWareDlgShow">
          <div class="selectRegion">
            <ware-select
              key="0"
              ref="baseWareSelect"
              :multipleSelect="false"
              :lastSelectedItems="baseWareTableData"
              @selectedWareChange="onBaseWareSelect"
            ></ware-select>
          </div>
          <div class="resultText">
            已选商品：<br /><strong
              ><span v-if="newSelectBaseWares.length <= 0">无</span><span v-else>{{ newSelectBaseWares[0].wareName }}</span></strong
            >
          </div>
          <div style="text-align: right;">
            <el-button type="primary" @click="onChangeBaseWares">确定</el-button>
            <el-button type="primary" @click="baseWareDlgShow = false">取消</el-button>
          </div>
        </el-dialog>

        <el-dialog title="选择升值商品" :visible.sync="upgradeWareDlgShow" :close-on-click-modal="false" @open="onUpgradeWareDlgShow">
          <div class="selectRegion">
            <ware-select
              key="1"
              ref="upgradeWareSelect"
              :multipleSelect="true"
              :lastSelectedItems="upgradeWareTableData"
              @selectedWareChange="onUpgradeWareSelect"
            ></ware-select>
          </div>
          <div class="resultText">
            已选商品：<br /><strong
              ><span v-if="newSelectUpgradeWares.length <= 0">无</span><span v-else>{{ newSelectUpgradeWareNames.join(',') }}</span></strong
            >
          </div>
          <div style="text-align: right;">
            <el-button type="primary" @click="onChangeUpgradeWares">确定</el-button>
            <el-button type="primary" @click="upgradeWareDlgShow = false">取消</el-button>
          </div>
        </el-dialog>

        <el-dialog
          title="选择升值商品"
          :visible.sync="upgradeWareSingleDlgShow"
          :close-on-click-modal="false"
          @open="onUpgradeWareSingleDlgShow"
        >
          <div class="selectRegion">
            <ware-select
              key="2"
              ref="upgradeWareSingleSelect"
              :multipleSelect="false"
              :lastSelectedItems="upgradeWareSingleTableData"
              @selectedWareChange="onUpgradeWareSingleSelect"
            ></ware-select>
          </div>
          <div class="resultText">
            已选商品：<br /><strong
              ><span v-if="newSelectUpgradeWaresSingle.length <= 0">无</span
              ><span v-else>{{ newSelectUpgradeWaresSingle[0].wareName }}</span></strong
            >
          </div>
          <div style="text-align: right;">
            <el-button type="primary" @click="onChangeUpgradeWaresSingle">确定</el-button>
            <el-button type="primary" @click="upgradeWareSingleDlgShow = false">取消</el-button>
          </div>
        </el-dialog>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script type="text/ecmascript-6">
import fetch from 'utils/fetch';
import {
  convertToTimeString,
  convertToWareStateLabel,
  convertToPairStateLabel,
  convertToCategoryLabel,
  convertToMoneyAmount,
  farmModelList
} from '../../utils/appCommon';
import { getGameList, getPairBaseInfo, editPair } from '../../api/upgrade';
import { getCategoryList } from '../../api/ware';
import wareSelect from '../ware/ware-select.vue';
export default {
  data() {
    return {
      gameTypeList: [],
      wareCategoryList: [],
      formData: {
        id: -1,
        gameType: -1,
        addTime: '2017-08-01 21:12:12',
        state: '促销中',
        baseWareImgUrl: '',
        upgradeWareImgUrl: '',
        level: ''
      },
      formRules: {},
      baseWareDlgShow: false,
      newSelectBaseWares: [],
      upgradeWareDlgShow: false,
      newSelectUpgradeWares: [],
      newSelectUpgradeWareNames: [],
      upgradeWareSingleDlgShow: false,
      upgradeWareSingleTableData: [],
      newSelectUpgradeWaresSingle: [],
      baseWareTableData: [
        {
          id: 1,
          wareNumber: '12673',
          wareName: '香蕉',
          category: '水果',
          price: 32,
          state: '出售中'
        }
      ],
      upgradeWareTableData: [
        {
          id: 2,
          wareNumber: '12621',
          wareName: '桃子',
          category: '水果',
          price: 12,
          state: '出售中'
        }
      ],
      urlPrefix: fetch.defaults.baseURL,
      farmModelList: farmModelList
    };
  },
  methods: {
    convertToTimeString: convertToTimeString,
    convertToWareStateLabel: convertToWareStateLabel,
    convertToPairStateLabel: convertToPairStateLabel,
    convertToMoneyAmount: convertToMoneyAmount,
    convertToCategoryLabel: convertToCategoryLabel,
    onUpgradeWareSingleDlgShow() {
      this.newSelectUpgradeWaresSingle = this.upgradeWareSingleTableData;
      if (this.$refs.upgradeWareSingleSelect) {
        this.$refs.upgradeWareSingleSelect.initData();
      }
    },
    onUpgradeWareSingleSelect(selectedWares) {
      this.newSelectUpgradeWaresSingle = selectedWares;
    },
    onChangeUpgradeWaresSingle() {
      if (this.newSelectUpgradeWaresSingle.length > 0) {
        const newUpgradeWare = this.newSelectUpgradeWaresSingle[0];
        const oneUpgradeWare = {
          id: newUpgradeWare.id,
          wareNumber: newUpgradeWare.wareNumber,
          wareName: newUpgradeWare.wareName,
          category: newUpgradeWare.categoryId,
          price: newUpgradeWare.price,
          state: newUpgradeWare.state
        };

        for (let i = 0; i < this.upgradeWareTableData.length; i++) {
          if (this.upgradeWareTableData[i].id === this.upgradeWareSingleTableData[0].id) {
            this.$set(this.upgradeWareTableData, i, oneUpgradeWare);
            break;
          }
        }
      }
      this.upgradeWareSingleDlgShow = false;
    },
    onBaseWareDlgShow() {
      this.newSelectBaseWares = this.baseWareTableData;
      if (this.$refs.baseWareSelect) {
        this.$refs.baseWareSelect.initData();
      }
    },
    onBaseWareSelect(selectedWares) {
      this.newSelectBaseWares = selectedWares;
    },
    onChangeBaseWares() {
      if (this.newSelectBaseWares.length > 0) {
        this.baseWareTableData.length = 0;

        const newBaseWare = this.newSelectBaseWares[0];
        const oneBaseWare = {
          id: newBaseWare.id,
          wareNumber: newBaseWare.wareNumber,
          wareName: newBaseWare.wareName,
          category: newBaseWare.categoryId,
          price: newBaseWare.price,
          state: newBaseWare.state
        };

        this.$set(this.baseWareTableData, 0, oneBaseWare);
      }
      this.baseWareDlgShow = false;
    },
    onUpgradeWareDlgShow() {
      this.newSelectUpgradeWares = this.upgradeWareTableData;

      this.newSelectUpgradeWareNames.length = 0;
      this.newSelectUpgradeWares.forEach((value, index) => {
        this.newSelectUpgradeWareNames.push(value.wareName);
      });

      if (this.$refs.upgradeWareSelect) {
        this.$refs.upgradeWareSelect.initData();
      }
    },
    onUpgradeWareSelect(selectedWares) {
      this.newSelectUpgradeWares = selectedWares;

      this.newSelectUpgradeWareNames.length = 0;
      this.newSelectUpgradeWares.forEach((value, index) => {
        this.newSelectUpgradeWareNames.push(value.wareName);
      });
    },
    onChangeUpgradeWares() {
      if (this.newSelectUpgradeWares.length > 0) {
        this.upgradeWareTableData.length = 0;

        this.newSelectUpgradeWares.forEach((value, index) => {
          const oneUpgradeWare = {
            id: value.id,
            wareNumber: value.wareNumber,
            wareName: value.wareName,
            category: value.categoryId,
            price: value.price,
            state: value.state
          };

          this.$set(this.upgradeWareTableData, index, oneUpgradeWare);
        });
      }
      this.upgradeWareDlgShow = false;
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
    onCoverImgError(err, file, fileList) {
      this.$message({
        message: '上传失败！',
        type: 'warning'
      });
    },
    onBaseCoverImgSuccess(res, file) {
      this.formData.baseWareImgUrl = res;
    },
    onUpgradeCoverImgSuccess(res, file) {
      this.formData.upgradeWareImgUrl = res;
    },
    overdueMeg() {
      this.$confirm('当前页面已过期，将返回列表页。', '', {
        confirmButtonText: '确定'
      })
        .then(() => {
          this.$router.replace({ path: '/upgrade/pair' });
        })
        .catch(() => {});
    },
    getCategoryListPromise() {
      // 获取分类信息
      return new Promise((resolve, reject) => {
        getCategoryList()
          .then(response => {
            if (response.status === 200) {
              response.data.forEach((value, index, array) => {
                this.$set(this.wareCategoryList, index, value);
              });

              resolve();
            } else {
              this.$message({
                type: 'error',
                message: `获取分类失败 ${response.status}：${response.statusText}`,
                duration: 1800
              });

              reject();
            }
          })
          .catch(err => {
            this.$message.error('获取分类失败:' + err.message);
            reject();
          });
      });
    },
    getGameTypeListPromise() {
      return new Promise((resolve, reject) => {
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
              resolve();
            } else {
              this.$message({
                type: 'error',
                message: `获取玩法列表失败 ${response.status}：${response.statusText}, 请刷新页面`,
                duration: 1800
              });
              reject();
            }
          })
          .catch(err => {
            reject();
            this.$message.error(`获取玩法列表失败: ${err.message}, 请刷新页面`);
          });
      });
    },
    onRemove(scope) {
      const item = scope.row;
      const delIndex = scope.$index;
      this.$confirm(`将移除商品 “${item.wareName}” , 是否继续?`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          this.$delete(this.upgradeWareTableData, delIndex);
          this.$message({
            type: 'success',
            message: `商品 “${item.wareName}” 移除成功!`,
            duration: 1800
          });
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: `已取消移除`,
            duration: 1000
          });
        });
    },
    onEditPair() {
      const upgradeIds = [];
      this.upgradeWareTableData.forEach((value, index) => {
        upgradeIds.push(value.id);
      });
      const pairInfo = {
        id: this.formData.id,
        productId: this.baseWareTableData[0].id,
        categoryId: this.baseWareTableData[0].category,
        gameId: this.formData.gameType,
        basicimage: this.formData.baseWareImgUrl,
        upimage: this.formData.upgradeWareImgUrl,
        ids: upgradeIds.join(','),
        level: this.formData.level === '' ? 0 : this.formData.level
      };

      editPair(pairInfo)
        .then(response => {
          if (response.status === 200) {
            if (response.data.result) {
              this.$message({
                type: 'success',
                message: `修改促销商品成功!`,
                duration: 1800
              });
              this.$router.back();
            } else {
              this.$message({
                type: 'error',
                message: `修改促销商品失败：${response.data.message}`,
                duration: 1800
              });
            }
          } else {
            this.$message({
              type: 'error',
              message: `修改促销商品失败 ${response.status}：${response.statusText}`,
              duration: 1800
            });
          }
        })
        .catch(err => {
          this.$message.error('修改促销商品失败:' + err.message);
        });
    }
  },
  components: {
    wareSelect
  },
  created() {
    if (this.$route.params.pairData && this.$route.params.pairData.id >= 0) {
      this.formData.id = this.$route.params.pairData.id;
      const pairInfo = { id: this.formData.id };

      this.baseWareTableData.length = 0;
      this.$delete(this.baseWareTableData, 0);
      this.upgradeWareTableData.length = 0;
      this.$delete(this.upgradeWareTableData, 0);

      Promise.all([this.getGameTypeListPromise(), this.getCategoryListPromise(), getPairBaseInfo(pairInfo)])
        .then(responses => {
          const response = responses[2];
          if (response.status === 200) {
            const resData = response.data;
            this.formData.gameType = resData.gameId;
            this.formData.level = resData.level;
            this.formData.addTime = resData.createtime;
            this.formData.state = resData.state;
            this.formData.baseWareImgUrl = resData.basicimage;
            this.formData.upgradeWareImgUrl = resData.upimage;

            // 基础商品
            const oneBaseWare = {
              id: resData.product.id,
              wareNumber: resData.product.skuNo,
              wareName: resData.product.name,
              category: resData.product.categoryId,
              price: resData.product.price,
              state: resData.product.state
            };
            this.baseWareTableData.push(oneBaseWare);
            // 升值商品
            resData.upProductList.forEach((value, index) => {
              const oneUpgradeWare = {
                id: value.product.id,
                wareNumber: value.product.skuNo,
                wareName: value.product.name,
                category: value.product.categoryId,
                price: value.product.price,
                state: value.product.state
              };
              this.upgradeWareTableData.push(oneUpgradeWare);
            });
          } else {
            this.$message({
              type: 'error',
              message: `失败 ${response.status}：${response.statusText}`,
              duration: 1800
            });
          }
        })
        .catch(err => {
          this.$message.error('获取详情失败:' + err.message);
        });
    } else {
      this.overdueMeg();
    }
  }
};
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
.el-form-item {
  margin: 18px 0 12px 0;
}
.cover-img {
  width: 80px;
  height: 80px;
  border-radius: 6px;
}
</style>

<style rel="stylesheet/scss" lang="scss">
#pair-edit {
  box-shadow: none;
  padding-bottom: 0.9rem;

  .el-form-item__label {
    margin-right: 15px;
  }
  .el-upload {
    width: 80px;
    height: 80px;
    .el-icon-plus {
      line-height: 80px;
    }
  }
  .el-form-item__label {
    margin-right: 15px;
  }
}
</style>
