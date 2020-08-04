<template>
  <div class="app-container">
    <el-tabs value="1">
      <el-tab-pane :disabled="true" label="发布商品" name="1">
        <el-form label-width="7rem" :rules="formRules" ref="wareAddForm" :model="formData">
          <div class="display-table">
            <div class="display-table-row">
              <div class="display-table-cell table-title" style="width:150px">
                <span class="table-cell-text">商品信息</span>
              </div>
              <div class="display-table-cell">
                <el-form-item label="商品名称" prop="name" required>
                  <el-input v-model="formData.name"></el-input>
                </el-form-item>
                <el-form-item label="商品分类" prop="wareCategory">
                  <el-select v-model="formData.wareCategory">
                    <el-option v-for="item in wareCategoryList" :key="item.name" :label="item.name" :value="item.id"> </el-option>
                  </el-select>
                </el-form-item>
                <el-form-item label="商品类型" prop="productType" required>
                  <el-select v-model="formData.productType">
                    <el-option v-for="item in wareProductTypeList" :key="item.name" :label="item.name" :value="item.productTypeId">
                    </el-option>
                  </el-select>
                </el-form-item>
                <el-form-item label="商品价格(元)" prop="price" required>
                  <el-input v-model="formData.price"></el-input>
                </el-form-item>
                <el-form-item label="商品原价(元)" prop="orgPrice" required>
                  <el-input v-model="formData.orgPrice"></el-input>
                </el-form-item>
                <el-form-item label="添加优惠券" prop="coupons">
                  <el-select v-model="formData.coupons" :disabled="formData.productType != 3">
                    <el-option v-for="item in couponsList" :key="item.name" :label="item.name" :value="item.couponId"> </el-option>
                  </el-select>
                </el-form-item>
                <el-form-item label="封面图" prop="coverImgs">
                  <span class="cover-tips">(支持"jpg""png",大小不超500kb)</span>
                  <el-upload
                    accept=".jpg,.png"
                    :action="urlPrefix + '/file/upload/wareCover'"
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
              <div class="display-table-cell table-title" style="width:150px">
                <span class="table-cell-text">规格</span>
              </div>
              <div class="display-table-cell table-cell-inline">
                <div style="float:left;display:flex;flex-wrap:wrap;align-items:center;">
                  <div class="spec-item" v-for="(item, index) in formData.specs" :index="index" :key="`spec-item${index}`">
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
              <div class="display-table-cell table-title" style="width:150px">
                <span class="table-cell-text">基本信息</span>
              </div>
              <div class="display-table-cell">
                <el-form-item label="货号" prop="wareNumber">
                  <el-input v-model="formData.wareNumber"></el-input>
                </el-form-item>
                <el-form-item label="库存" prop="inventory">
                  <el-input-number v-model="formData.inventory" :min="1" :max="999999999"></el-input-number>
                </el-form-item>
                <el-form-item label="运费" prop="freight">
                  <el-input v-model="formData.freight"></el-input>
                </el-form-item>
              </div>
            </div>
            <div class="display-table-row">
              <div class="display-table-cell table-title" style="width:150px">
                <span class="table-cell-text">商品详情</span>
              </div>
              <div class="display-table-cell">
                <div id="detail-editor"></div>
                <el-form-item label="" prop="wareDetail" style="position:absolute;top:42px;left:-89px;width:400px;">
                  <el-input style="display:none;" v-model="formData.wareDetail" :disabled="true"></el-input>
                </el-form-item>
              </div>
            </div>
          </div>
        </el-form>
        <div class="operate-region">
          <el-button title="预览" type="primary" @click="previewDlgShow = true">预览</el-button>

          <template v-if="curPageType === 'add'">
            <el-button title="加入仓库" type="primary" @click="onAddOffShelf('wareAddForm')">入库</el-button>
            <el-button title="加入仓库并上架" type="primary" @click="onAddOnShelf('wareAddForm')">入库上架</el-button>
          </template>
          <template v-else>
            <el-button title="保存" type="primary" @click="onSave('wareAddForm')">保存</el-button>
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
import { getCategoryList, addWare, getWareInfo, editWare, getCouponsList } from '../../api/ware';
import preview from './preview';
import EditorConstructor from '@/lib/wangEditor.min';
import { hintSaveBeforeLeave } from '../../utils/appCommon';

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
    const categoryValidator = (rule, value, callback) => {
      if (typeof value === 'string' && value.length <= 0) {
        callback(new Error('请选择商品分类'));
      } else {
        callback();
      }
    };
    const productTypeValidator = (rule, value, callback) => {
      if (typeof value === 'string' && value.length <= 0) {
        callback(new Error('请选择商品类型'));
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

    const coverImgValidator = (rule, value, callback) => {
      if (value.length <= 0) {
        callback(new Error('请添加封面图'));
      } else {
        callback();
      }
    };

    const wareNumberValidator = (rule, value, callback) => {
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

    const freightValidator = (rule, value, callback) => {
      if (value.length <= 0) {
        callback(new Error('请输入运费'));
      } else {
        callback();
      }
    };

    const wareDatailValidator = (rule, value, callback) => {
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
        wareCategory: '',
        productType: '',
        price: '',
        orgPrice: '',
        coupons: '',
        coverImgs: [],
        specs: [
          {
            name: '',
            value: ''
          }
        ],
        wareNumber: '',
        inventory: 0,
        freight: 0,
        wareDetail: ''
      },
      formRules: {
        name: [{ required: true, trigger: 'blur', validator: nameValidator }],
        wareCategory: [{ required: true, trigger: 'change', validator: categoryValidator }],
        productType: [{ required: true, trigger: 'change', validator: productTypeValidator }],
        price: [{ required: true, trigger: 'blur', validator: priceValidator }],
        orgPrice: [{ required: true, trigger: 'blur', validator: priceValidator }],
        coupons: [{ required: true, trigger: 'change', validator: this.couponsValidator }],
        coverImgs: [{ required: true, trigger: 'change', validator: coverImgValidator }],
        wareNumber: [{ required: true, trigger: 'blur', validator: wareNumberValidator }],
        inventory: [{ required: true, trigger: 'blur', validator: inventoryValidator }],
        freight: [{ required: true, trigger: 'blur', validator: freightValidator }],
        wareDetail: [{ required: true, trigger: 'change', validator: wareDatailValidator }]
      },
      coverImgFileList: [],
      wareCategoryList: [],
      wareProductTypeList: [
        { name: '普通商品', productTypeId: 1 },
        { name: '商品优惠券', productTypeId: 3 }
      ],
      couponsList: [],
      detailEditor: null,
      coverImgUrl: '',
      coverDlgShow: false,
      previewDlgShow: false,
      urlPrefix: fetch.defaults.baseURL,
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
    couponsValidator(rule, value, callback) {
      if (this.formData.productType !== 3) {
        callback();
      } else {
        if (typeof value === 'string' && value.length <= 0) {
          callback(new Error('请选择要添加的优惠券'));
        } else {
          callback();
        }
      }
    },
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
        return { specification: oneElem.name, unit: oneElem.value };
      });
      const wareInfo = {
        state: state,
        categoryId: formData.wareCategory,
        pType: formData.productType,
        skuNo: formData.wareNumber,
        name: formData.name,
        price: parseFloat(formData.price),
        couponId: formData.coupons,
        originalPrice: parseFloat(formData.orgPrice),
        banner: formData.coverImgs.join(','),
        headImage: formData.coverImgs[0],
        content: formData.wareDetail,
        productSpecifications: specs,
        freight: formData.freight,
        stock: formData.inventory
      };

      addWare(wareInfo)
        .then(response => {
          if (response.status === 200) {
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
              message: `商品添加失败 ${response.status}：${response.statusText}`,
              duration: 1800
            });
          }
        })
        .catch(err => {
          this.$message.error(err);
        });
    },
    getWareInfo(id) {
      const getInfo = { id: id };
      getWareInfo(getInfo)
        .then(response => {
          if (response.status === 200) {
            const resData = response.data;
            const dstData = this.formData;
            dstData.id = id;
            dstData.name = resData.name;
            dstData.wareCategory = resData.categoryId;
            dstData.coupons = resData.couponId;
            dstData.productType = resData.pType;
            dstData.price = resData.price;
            dstData.orgPrice = resData.originalPrice;
            dstData.coverImgs = resData.banner.split(',');

            for (let i = 0; i < dstData.coverImgs.length; i++) {
              const oneImgFile = { name: 'whatever', url: dstData.coverImgs[i] };
              this.coverImgFileList.push(oneImgFile);
            }
            if (!resData.productSpecifications) {
              resData.productSpecifications = [];
            }
            for (let i = 0; i < resData.productSpecifications.length; i++) {
              if (i === 0) {
                // 清空旧数据
                dstData.specs.length = 0;
              }
              const oneSpec = { name: resData.productSpecifications[i].specification, value: resData.productSpecifications[i].unit };
              dstData.specs.push(oneSpec);
            }
            dstData.wareNumber = resData.skuNo;
            dstData.state = resData.state;
            dstData.inventory = resData.stock;
            dstData.freight = resData.freight;
            dstData.wareDetail = resData.content;

            this.detailEditor.txt.html(resData.content);
          } else {
            this.$message({
              type: 'error',
              message: `获取商品信息失败 ${response.status}：${response.statusText}`,
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
            return { specification: oneElem.name, unit: oneElem.value };
          });
          const wareInfo = {
            state: formData.state,
            categoryId: formData.wareCategory,
            pType: formData.productType,
            skuNo: formData.wareNumber,
            name: formData.name,
            price: parseFloat(formData.price),
            originalPrice: parseFloat(formData.orgPrice),
            couponId: formData.coupons,
            banner: formData.coverImgs.join(','),
            headImage: formData.coverImgs[0],
            content: formData.wareDetail,
            productSpecifications: specs,
            freight: formData.freight,
            stock: formData.inventory,
            id: formData.id
          };
          editWare(wareInfo)
            .then(response => {
              if (response.status === 200) {
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
                  message: `商品修改失败 ${response.status}：${response.statusText}`,
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
    onCancel() {
      this.$router.back();
    },
    addOneSpec() {
      this.formData.specs.push({ name: '', value: '' });
    },
    deleteOneSpec(index) {
      const distArr = this.formData.specs;
      if (distArr.length > 1) {
        distArr.splice(index, 1);
      }
    },
    overdueMeg() {
      this.$confirm('当前页面已过期，将返回列表页。', '', {
        confirmButtonText: '确定'
      })
        .then(() => {
          this.$router.replace({ path: '/ware/list' });
        })
        .catch(() => {});
    }
  },
  mounted() {
    // 获取分类信息
    getCategoryList()
      .then(response => {
        if (response.status === 200) {
          response.data.forEach((value, index, array) => {
            this.$set(this.wareCategoryList, index, value);
          });
        } else {
          this.$message({
            type: 'error',
            message: `获取分类失败 ${response.status}：${response.statusText}`,
            duration: 1800
          });
        }
      })
      .catch(err => {
        this.$message.error('获取分类失败:' + err.message);
      });
    // 获取优惠券信息
    getCouponsList()
      .then(response => {
        if (response.data.code === 200) {
          response.data.resData.forEach((value, index, array) => {
            this.$set(this.couponsList, index, value);
          });
        } else {
          this.$message({
            type: 'error',
            message: `获取优惠券失败 ${response.data.code}：${response.data.message}`,
            duration: 1800
          });
        }
      })
      .catch(err => {
        this.$message.error('获取优惠券失败:' + err.message);
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

    editorConfig.uploadImgServer = this.urlPrefix + '/file/upload/wareDetail';
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
      this.$set(this.formData, 'wareDetail', html);
    };

    this.detailEditor.create();

    if (this.$route.path === '/ware/edit') {
      this.curPageType = 'edit';
      if (this.$route.params.wareData && this.$route.params.wareData.wareNumber.length > 0) {
        // this.formData.id = this.$route.params.wareData.id;
        this.getWareInfo(this.$route.params.wareData.id);
      } else {
        this.overdueMeg();
      }
    }
  },
  beforeRouteLeave(to, from, next) {
    if (this.$route.path != '/ware/edit') {
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
  .table-cell-text {
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
