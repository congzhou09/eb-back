<!--金币商城&#45;&#45;商品详情页 -->
<template>
  <el-card class="el-card-in-dlg" v-loading="isLoading">
    <ul class="user-info">
      <li><label class="title-label">商品名称:</label>{{ formData.name }}</li>
      <li><label class="title-label">商品分类:</label>{{ formData.mallCategory }}</li>
      <li><label class="title-label">商品价格:</label>{{ formData.price }}</li>
      <li>
        <label class="title-label">商品图片:</label>
        <div style="margin-left: 9rem;">
          <img
            :src="imgs"
            v-for="(imgs, index) in formData.coverImgs"
            style="width: 100px; height: 100px; border: 0; padding: 0.5rem;"
            :key="index"
          />
        </div>
      </li>
      <li>
        <label class="title-label">商品规格:</label>
        <div style="margin-left: 7rem;">
          <ul>
            <li v-for="(specss, index) in formData.specs" style="list-style: none" :key="index">
              <span>规格名称：{{ specss.attr }}</span>
              <span>规格描述：{{ specss.attrValue }}</span>
            </li>
          </ul>
        </div>
      </li>
      <li><label class="title-label">商品货号:</label>{{ formData.mallNumber }}</li>
      <li><label class="title-label">商品库存:</label>{{ formData.inventory }}</li>
      <li><label class="title-label">商品运费:</label>{{ formData.freight }}</li>
      <li>
        <label class="title-label">商品详情:</label>
        <div v-html="formData.mallDetail"></div>
      </li>
    </ul>
    <div class="btn-group">
      <el-button type="primary" @click="$emit('cancel')">关闭</el-button>
    </div>
  </el-card>
</template>

<script type="text/ecmascript-6">
import { getMallInfo } from '../../api/mall';
export default {
  props: ['productId'],
  data() {
    return {
      isLoading: true,
      mallCategoryList: [],
      formData: {
        // id:'',
        state: '',
        name: '',
        mallCategory: '',
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
        freight: 0,
        mallDetail: ''
      }
    };
  },
  methods: {
    getInit() {
      this.isLoading = true;
      const getInfo = { productId: this.productId };

      getMallInfo(getInfo)
        .then(response => {
          if (response.data.code === 200) {
            const resDatas = response.data.resData;
            const dstData = this.formData;
            dstData.name = resDatas.name;
            dstData.mallCategory = resDatas.categoryName;
            dstData.price = resDatas.price;
            dstData.coverImgs = resDatas.bannerList;
            dstData.specs = resDatas.specificationList;
            dstData.mallNumber = resDatas.skuNo;
            //                        dstData.state = resData.state;
            dstData.inventory = resDatas.stock;
            dstData.freight = resDatas.freight;
            dstData.mallDetail = resDatas.content;
          } else {
            this.$message({
              type: 'error',
              message: `获取商品信息失败 ${response.date.code}：${response.data.message}`,
              duration: 1800
            });
          }
          this.$nextTick(() => {
            this.isLoading = false;
          });
        })
        .catch(err => {
          this.isLoading = false;
          this.$message.error('获取商品信息失败:' + err.message);
        });
    },
    onInit() {
      this.$nextTick(() => {
        this.getInit();
      });
    }
  },
  mounted() {
    this.getInit();
  }
};
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
.el-card {
  background-color: white;
  box-shadow: none;
  padding: 0;
  .el-input,
  .el-select {
    width: 230px;
  }
  .btn-group {
    position: relative;
    text-align: right;
    margin: 1rem 7px 0 0;
  }
}
.user-info {
  list-style: none;
  padding: 0 1.2rem 5px 1.2rem;
  li {
    margin: 6px 0;
    padding-bottom: 5px;
    .title-label {
      display: inline-block;
      width: 100px;
      text-align: right;
      margin-right: 3rem;
    }
    .text-value {
      margin-right: 15px;
    }
    .content-span {
      margin-left: -4px;
    }
  }
}
</style>
