<!--金币商城添加商品-->
<template>
  <div class="app-container">
    <el-tabs value="1">
      <el-tab-pane :distable="true" label="发布商品" name="1">
        <el-form :model="formData" label-width="8rem" :rules="formRules" ref="mallAddForm">
          <div class="display-table">
            <div class="display-table-row">
              <div class="display-table-cell table-title" style="width: 150px">
                <span class="table-title-text">商品信息</span>
              </div>
              <div class="display-table-cell">
                <el-form-item label="商品名称" prop="name" required>
                  <el-input v-model="formData.name"></el-input>
                </el-form-item>
                <el-form-item label="商品分类" prop="mallCategory" required>
                  <el-select v-model="formData.mallCategory">
                    <el-option v-for="item in mallCategoryList" :key="item.name" :label="item.name" :value="item.categoryId"> </el-option>
                  </el-select>
                </el-form-item>
                <el-form-item label="商品类型" prop="productType" required>
                  <el-select v-model="formData.productType">
                    <el-option v-for="item in mallProductTypeList" :key="item.name" :label="item.name" :value="item.productTypeId">
                    </el-option>
                  </el-select>
                </el-form-item>
                <el-form-item label="商品价格(金币)" prop="price" required>
                  <el-input v-model="formData.price"></el-input>
                </el-form-item>
                <el-form-item label="商品图" prop="coverImgs" required>
                  <span class="cover-tips">(支持"jpg""png",大小不超500kb)</span>
                  <el-upload
                    accept=".jpg,.png"
                    :action="urlPrefix + '/file/upload/mallCover'"
                    :on-preview="onPreviewCoverImg"
                    :before-upload="beforeCoverImgUpload"
                    :on-success="onCoverImgSuccess"
                    :on-remove="onCoverImgRemove"
                    :on-error="onCoverImgError"
                    :file-list="coverImgFileList"
                    name="file"
                    list-type="picture-card"
                  >
                    <i class="el-icon-plus"></i>
                  </el-upload>
                  <el-dialog v-model="coverDlgShow">
                    <img width="100%" :src="coverImgUrl" alt="" />
                  </el-dialog>
                </el-form-item>
              </div>
            </div>
            <div class="display-table-row">
              <div class="display-table-cell table-title" style="width: 150px">
                <span class="table-title-text">规格</span>
              </div>
              <div class="display-table-cell table-cell-inline">
                <div style="float:left;display:flex;flex-wrap:wrap;align-items:center;">
                  <div class="spec-item" v-for="(item, index) in formData.specs" :index="index" :key="index">
                    <el-form-item
                      label="规格名称"
                      :prop="'specs.' + index + '.name'"
                      :rules="{ required: true, trigger: 'blur', validator: specNameValidator }"
                    >
                      <el-input v-model="item.name"></el-input>
                    </el-form-item>
                    <el-form-item
                      label="规格描述"
                      :prop="'specs.' + index + '.value'"
                      :rules="{ required: true, trigger: 'blur', validator: specValueValidator }"
                    >
                      <el-input v-model="item.value"></el-input>
                    </el-form-item>
                    <el-button
                      title="删除此行规格"
                      style="margin-left:35px;"
                      class="round-btn"
                      type="warning"
                      icon="el-icon-minus"
                      v-if="formData.specs.length > 1"
                      @click="deleteOneSpec(index)"
                    ></el-button>
                  </div>

                  <el-button
                    title="增加新规格"
                    class="fix-lower-right round-btn"
                    type="primary"
                    icon="el-icon-plus"
                    @click="addOneSpec()"
                  ></el-button>
                </div>
              </div>
            </div>
            <div class="display-table-row">
              <div class="display-table-cell table-title" style="width: 150px">
                <span class="table-title-text">基本信息</span>
              </div>
              <div class="display-table-cell">
                <el-form-item label="货号" prop="mallNumber">
                  <el-input v-model="formData.mallNumber"></el-input>
                </el-form-item>
                <el-form-item label="库存" prop="inventory">
                  <el-input-number v-model="formData.inventory" :min="1" :max="999999999"></el-input-number>
                </el-form-item>
                <!-- <el-form-item label="运费（元）" prop="freight">
                                    <el-input v-model="formData.freight"></el-input>
                                </el-form-item>-->
              </div>
            </div>
            <div class="display-table-row">
              <div class="display-table-cell table-title" style="width: 150px">
                <span class="table-title-text">商品详情</span>
              </div>
              <div class="display-table-cell">
                <div id="detail-editor"></div>
                <el-form-item label="" prop="mallDetail" style="position:absolute;top:42px;left:-89px;width:400px;">
                  <el-input style="display:none;" v-model="formData.mallDetail" :disabled="true"></el-input>
                </el-form-item>
              </div>
            </div>
          </div>
        </el-form>
        <div class="operate-region">
          <el-button title="预览" type="primary" @click="previewDlgShow = true">预览</el-button>

          <template v-if="curPageType === 'add'">
            <el-button title="加入仓库" type="primary" @click="onAddOffShelf('mallAddForm')">入库</el-button>
            <el-button title="加入仓库并上架" type="primary" @click="onAddOnShelf('mallAddForm')">入库上架</el-button>
          </template>
          <template v-else>
            <el-button title="保存" type="primary" @click="onSave('mallAddForm')">保存</el-button>
          </template>

          <el-button title="取消" type="primary" @click="onCancel()">取消</el-button>
        </div>

        <el-dialog title="商品详情预览" :visible.sync="previewDlgShow">
          <preview :content="getPreviewContent()"></preview>
        </el-dialog>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script type="text/ecmascript-6">
import fetch from 'utils/fetch';
import preview from './preview';
import EditorConstructor from '@/lib/wangEditor.min';
import { hintSaveBeforeLeave } from '../../utils/appCommon';
import { getCategoryList, addMall, getMallInfo, editMall } from '../../api/mall';
export default {
  components: {
    preview
  },
  data() {
    const nameValidator = (rule, value, callback) => {
      if (value.length <= 0) {
        callback(new Error('请输入商品名称'));
      } else {
        callback();
      }
    };
    const mallCategoryValidator = (rule, value, callback) => {
      if (typeof value === 'string' && value.length <= 0) {
        callback(new Error('请选择商品分类'));
      } else {
        callback();
      }
    };
    const priceValidator = (rule, value, callback) => {
      if (value.length <= 0) {
        callback(new Error('请输入价格'));
      } else if (!/^[1-9]+[0-9]*$|^\d+\.\d+$/.test(value)) {
        callback(new Error('请输入正确的价格'));
      } else {
        callback();
      }
    };
    const coverImgsValidator = (rule, value, callback) => {
      if (value.length <= 0) {
        callback(new Error('请添加封面图'));
      } else {
        callback();
      }
    };
    const mallNumberValidator = (rule, value, callback) => {
      if (value.length <= 0) {
        callback(new Error('请输入货号'));
      } else if (/[\u4e00-\u9fa5]/.test(value)) {
        callback(new Error('货号不可以包含中文'));
      } else {
        callback();
      }
    };
    const inventoryValidator = (rule, value, callback) => {
      if (value.length <= 0) {
        callback(new Error('请输入库存'));
      } else {
        callback();
      }
    };
    /* const freightValidator = (rule, value, callback) => {
                if (value.length<=0) {
                    callback(new Error('请输入运费'));
                } else {
                    callback();
                }
            };*/
    const mallDatailValidator = (rule, value, callback) => {
      if (value.length <= 0 || value === '<p><br></p>') {
        callback(new Error('请输入商品详情'));
      } else {
        callback();
      }
    };
    return {
      curPageType: 'add', // add-添加页面 edit-编辑页面
      formData: {
        id: '',
        state: '',
        name: '',
        mallCategory: '',
        productType: '',
        price: '',
        coverImgs: [],
        specs: [
          {
            name: '',
            value: ''
          }
        ],
        mallNumber: '',
        inventory: 0,
        //                    freight: 0,
        mallDetail: ''
      },
      mallCategoryList: [],
      mallProductTypeList: [
        { name: '实体商品', productTypeId: 1 },
        { name: '充值卡虚拟商品', productTypeId: 2 }
      ],
      coverImgUrl: '',
      coverDlgShow: false,
      previewDlgShow: false,
      urlPrefix: fetch.defaults.baseURL,
      coverImgFileList: [],
      detailEditor: null,
      formRules: {
        name: [{ required: 'true', trigger: 'blur', validator: nameValidator }],
        mallCategory: [{ required: 'true', trigger: 'change', validator: mallCategoryValidator }],
        price: [{ required: 'true', trigger: 'blur', validator: priceValidator }],
        coverImgs: [{ required: 'true', trigger: 'change', validator: coverImgsValidator }],
        mallNumber: [{ required: 'true', trigger: 'blur', validator: mallNumberValidator }],
        inventory: [{ required: 'true', trigger: 'blur', validator: inventoryValidator }],
        //                    freight: [{required: 'true', trigger: 'blur', validator: freightValidator}],
        mallDetail: [{ required: 'true', trigger: 'change', validator: mallDatailValidator }]
      },
      addSuccess: false
    };
  },
  methods: {
    specNameValidator(rule, value, callback) {
      if (!value || value.length <= 0) {
        callback(new Error('请输入规格名称'));
      } else {
        callback();
      }
    },
    specValueValidator(rule, value, callback) {
      if (!value || value.length <= 0) {
        callback(new Error('请输入规格描述'));
      } else {
        callback();
      }
    },

    // 上传
    onPreviewCoverImg(file) {
      this.coverDlgShow = true;
      this.coverImgUrl = file.url;
    },
    beforeCoverImgUpload(file) {
      if (this.coverImgFileList.length >= 6) {
        this.$message.error('最多添加6张图片!');
        return false;
      }

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
    updateCoverImgs(fileList) {
      this.formData.coverImgs.length = 0;
      this.coverImgFileList.length = 0;
      for (let i = 0; i < fileList.length; i++) {
        const url = typeof fileList[i].response === 'undefined' ? fileList[i].url : fileList[i].response;
        this.formData.coverImgs.push(url);

        const oneImgFile = { name: 'whatever', url: url };
        this.coverImgFileList.push(oneImgFile);
      }
    },
    onCoverImgSuccess(response, file, fileList) {
      // 加载图片获取图片真实宽度和高度
      const image = new Image();
      image.onload = () => {
        const longSide = image.width > image.height ? image.width : image.height;
        const shortSide = image.width < image.height ? image.width : image.height;

        if (longSide / shortSide > 1.1) {
          this.$message({
            message: '图片宽高比例不是1:1， 将影响显示效果！',
            type: 'error',
            duration: '5000'
          });
        }
      };
      image.src = file.url; // response

      this.updateCoverImgs(fileList);
    },
    onCoverImgRemove(file, fileList) {
      this.updateCoverImgs(fileList);
    },
    onCoverImgError(err, file, fileList) {
      this.$message({
        message: '上传失败！',
        type: 'warning'
      });
    },
    // 规格
    deleteOneSpec(index) {
      const distArr = this.formData.specs;
      if (distArr.length > 1) {
        distArr.splice(index, 1);
      }
    },
    addOneSpec() {
      this.formData.specs.push({ name: '', value: '' });
    },
    getPreviewContent() {
      if (this.detailEditor) {
        if (!!!window.filterXSS) {
          // 如果cdn不可用则使用本地xss
          require('@/lib/xss.min.js');
        }
        const xss = window.filterXSS;
        const whiteList = xss.whiteList;
        whiteList['img'].push('class');
        return xss(this.detailEditor.txt.html(), { whiteList: whiteList });
      }
      return '';
    },
    onAddOffShelf(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          this.addBody('instore');
        } else {
          return false;
        }
      });
    },
    onAddOnShelf(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          this.addBody('onsale');
        } else {
          return false;
        }
      });
    },
    addBody(state) {
      const formData = this.formData;
      const specs = formData.specs.map(function(oneElem) {
        return { attr: oneElem.name, attrValue: oneElem.value };
      });
      const mallInfo = {
        state: state,
        gCategoryId: formData.mallCategory,
        productType: formData.productType,
        gSkuNo: formData.mallNumber,
        name: formData.name,
        price: parseFloat(formData.price),
        banner: formData.coverImgs.join(','),
        content: formData.mallDetail,
        specificationList: specs,
        freight: formData.freight,
        stock: formData.inventory
      };
      addMall(mallInfo)
        .then(response => {
          if (response.data.code === 200) {
            if (response.data.result) {
              this.$message({
                type: 'success',
                message: `商品添加成功!`,
                duration: 1800
              });
              this.addSuccess = true;
              this.$router.back();
            } else {
              this.$message({
                type: 'error',
                message: `商品添加失败：${response.data.message}`,
                duration: 1800
              });
            }
          } else {
            this.$message({
              type: 'error',
              message: `商品添加失败 ${response.data.code}：${response.dara.message}`,
              duration: 1800
            });
          }
        })
        .catch(err => {
          this.$message.error(err);
        });
    },
    onCancel() {
      this.$router.back();
    },
    getMallInfo(id) {
      const getInfo = { productId: id };
      getMallInfo(getInfo)
        .then(response => {
          // console.log(response.data);
          if (response.data.code === 200) {
            const resDatas = response.data.resData;
            const dstData = this.formData;
            dstData.id = id;
            dstData.name = resDatas.name;
            dstData.mallCategory = resDatas.categoryId;
            dstData.productType = resDatas.productType;
            dstData.price = resDatas.price;

            dstData.coverImgs = resDatas.bannerList;

            for (let i = 0; i < dstData.coverImgs.length; i++) {
              const oneImgFile = { name: 'whatever', url: dstData.coverImgs[i] };
              this.coverImgFileList.push(oneImgFile);
            }
            if (!resDatas.specificationList) {
              resDatas.specificationList = [];
            }

            for (let i = 0; i < resDatas.specificationList.length; i++) {
              if (i === 0) {
                // 清空旧数据
                dstData.specs.length = 0;
              }
              const oneSpec = { name: resDatas.specificationList[i].attr, value: resDatas.specificationList[i].attrValue };
              dstData.specs.push(oneSpec);
            }
            dstData.mallNumber = resDatas.skuNo;
            //                        dstData.state = resData.state;
            dstData.inventory = resDatas.stock;
            dstData.freight = resDatas.freight;
            dstData.mallDetail = resDatas.content;

            this.detailEditor.txt.html(resDatas.content);
          } else {
            this.$message({
              type: 'error',
              message: `获取商品信息失败 ${response.date.code}：${response.data.message}`,
              duration: 1800
            });
          }
        })
        .catch(err => {
          this.$message.error(err);
        });
    },
    onSave(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          const formData = this.formData;
          const specs = formData.specs.map(function(oneElem) {
            return { attr: oneElem.name, attrValue: oneElem.value };
          });
          const mallInfo = {
            // state: formData.state,
            gCategoryId: formData.mallCategory,
            gSkuNo: formData.mallNumber,
            name: formData.name,
            price: parseFloat(formData.price),
            banner: formData.coverImgs.join(','),
            // headImage: formData.coverImgs[0],
            content: formData.mallDetail,
            specificationList: specs,
            freight: formData.freight,
            stock: formData.inventory,
            id: formData.id
          };
          editMall(mallInfo)
            .then(response => {
              if (response.data.code === 200) {
                if (response.data.result) {
                  this.$message({
                    type: 'success',
                    message: `商品修改成功!`,
                    duration: 1800
                  });
                  this.addSuccess = true;
                  this.$router.back();
                } else {
                  this.$message({
                    type: 'error',
                    message: `商品修改失败：${response.data.message}`,
                    duration: 1800
                  });
                }
              } else {
                this.$message({
                  type: 'error',
                  message: `商品修改失败 ${response.data.code}：${response.data.message}`,
                  duration: 1800
                });
              }
            })
            .catch(err => {
              this.$message.error(err);
            });
        } else {
          return false;
        }
      });
    },
    overdueMeg() {
      this.$confirm('当前页面已过期，将返回列表页。', '', {
        confirmButtonText: '确定'
      })
        .then(() => {
          this.$router.replace({ path: '/mall/list' });
        })
        .catch(() => {});
    }
  },
  creatde() {},
  mounted() {
    // 获取分类信息
    const categoryList = { needDefault: false };
    getCategoryList(categoryList)
      .then(response => {
        if (response.data.code === 200) {
          response.data.resData.forEach((value, index, array) => {
            this.$set(this.mallCategoryList, index, value);
          });
        } else {
          this.$message({
            type: 'error',
            message: `获取分类失败 ${response.data.code}：${response.data.message}`,
            duration: 1800
          });
        }
      })
      .catch(err => {
        this.$message.error('获取分类失败:' + err.message);
      });
    // 富文本编辑器初始化
    this.detailEditor = new EditorConstructor('#detail-editor');
    const editorConfig = this.detailEditor.customConfig;

    editorConfig.zIndex = 1;
    editorConfig.menus = [
      'head', // 标题
      'bold', // 粗体
      'italic', // 斜体
      'underline', // 下划线
      'strikeThrough', // 删除线
      'foreColor', // 文字颜色
      'backColor', // 背景颜色
      'link', // 插入链接
      'justify', // 对齐方式
      'image' // 插入图片
    ];
    //            editorConfig.showLinkImg = false;

    editorConfig.uploadImgServer = this.urlPrefix + '/file/upload/mallDetail';
    editorConfig.uploadFileName = 'file';
    editorConfig.uploadImgHooks = {
      customInsert: (insertImg, response, editor) => {
        if (typeof response === 'string') {
          insertImg(response, { class: 'detail-img' });
        } else {
          for (let i = 0; i < response.length; i++) {
            insertImg(/* this.urlPrefix +*/ response[i], { class: 'detail-img' });
          }
        }
      }
    };
    editorConfig.uploadImgMaxSize = 500 * 1024;
    editorConfig.uploadImgMaxLength = 1;
    editorConfig.customAlert = function(info) {
      this.$message.error(info);
    };
    editorConfig.onchange = html => {
      this.$set(this.formData, 'mallDetail', html);
    };

    this.detailEditor.create();

    if (this.$route.path === '/mall/edit') {
      this.curPageType = 'edit';
      if (this.$route.params.mallData && this.$route.params.mallData.mallNumber.length > 0) {
        //                    this.formData.id = this.$route.params.mallData.id;
        this.getMallInfo(this.$route.params.mallData.id);
      } else {
        this.overdueMeg();
      }
    }
  },
  beforeRouteLeave(to, from, next) {
    if (this.$route.path != '/mall/edit') {
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
.display-table {
  display: table;
  width: 100%;
  border-collapse: separate;
  border-spacing: 2px;
}
.display-table-row {
  display: table-row;
}
.table-title {
  background-color: #f3f3f3;
}
.display-table-cell {
  position: relative;
  display: table-cell;
  border: 1px solid #bfcbd9;
  padding: 8px;
  .el-input,
  .el-input-number {
    width: 45%;
  }
  .el-select {
    width: 45%;
  }
  .table-title-text {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translateX(-50%) translateY(-50%);
    font-size: 15px;
    color: #48576a;
  }
  .el-form-item {
    margin: 7px 0;
    .cover-tips {
      position: absolute;
      color: #20a0ff;
      font-size: 11px;
      width: 87px;
      line-height: 17px;
      bottom: 2px;
      left: -95px;
      font-weight: bold;
    }
  }
  .spec-item {
    float: left;
    display: flex;
    align-items: center;
    .el-form-item {
      float: left;
      display: flex;
      align-items: center;
      width: 19vw;
      .el-input {
        width: 100%;
      }
    }
    .el-button {
      margin-left: 35px;
    }
  }
}
.table-cell-inline {
  .round-btn {
    border-radius: 100%;
    padding: 11px;
  }
  .fix-lower-right {
    position: relative;
    left: 30px;
    height: fit-content;
  }
}
#detail-editor {
  margin: -8px;
}
.operate-region {
  text-align: right;
  margin: 12px 5px 20px 0;
}
</style>

<style rel="stylesheet/scss" lang="scss">
.display-table-cell {
  .el-form-item__label {
    padding: 14px 12px 11px 0;
  }
  .el-form-item__content {
    line-height: 0;
  }
}
.spec-item {
  .el-form-item__content {
    margin-left: 0 !important;
  }
}
.detail-img {
  width: 70%;
  vertical-align: middle;
}
</style>
