export default {
  list: () => {
    return {
      curtPage: 0,
      list: [
        {
          banner: '/static/mock/1511249919219',
          categoryId: 40,
          content: '',
          couponId: 0,
          createTime: 1511856011000,
          headImage: '/static/mock/1511249919219',
          id: 148,
          name: '网易智造易魔方蓝牙音箱',
          originalPrice: 269.0,
          pType: 1,
          price: 245.0,
          skuNo: '201711210007',
          state: 'instore'
        },
        {
          banner: '/static/mock/1511259252173',
          categoryId: 39,
          content: '',
          couponId: 0,
          createTime: 1511855178000,
          headImage: '/static/mock/1511259252173',
          id: 162,
          name: '米家智能床头灯',
          originalPrice: 359.0,
          pType: 1,
          price: 299.0,
          skuNo: '201711210021',
          state: 'onsale'
        },
        {
          banner: '/static/mock/1510885465028',
          categoryId: 41,
          content: '',
          couponId: 0,
          createTime: 1511838603000,
          headImage: '/static/mock/1510885465028',
          id: 138,
          name: '西班牙75ML美白牙膏',
          originalPrice: 198.0,
          pType: 1,
          price: 198.0,
          skuNo: '201711170002',
          state: 'onsale'
        }
      ],
      pageSize: 10,
      totalPage: 1,
      totalSize: 3
    };
  },
  get_valid_product_coupon: () => {
    return { code: 200, errorMsg: '', message: '成功响应请求', resData: [], result: true };
  },
  productinfo: () => {
    return {
      banlance: 0,
      banner: '/static/mock/1511249919219',
      categoryId: 40,
      categoryName: '电子数码产品',
      content:
        '<p><br></p><p><img src="/static/mock/1511250048599" style="max-width:100%" class="detail-img"><br></p><p><img src="/static/mock/1511250054522" style="max-width:100%" class="detail-img"><br></p><p><img src="/static/mock/1511250059460" style="max-width:100%" class="detail-img"><br></p><p><img src="/static/mock/1511250065055" style="max-width:100%" class="detail-img"><br></p><p><img src="/static/mock/1511250070745" style="max-width:100%" class="detail-img"><br></p><p><br></p>',
      couponId: 0,
      couponName: '',
      createTime: 1511856011000,
      freight: 0.0,
      headImage: '/static/mock/1511249919219',
      id: 148,
      name: '网易智造易魔方蓝牙音箱',
      originalPrice: 269.0,
      pType: 1,
      price: 245.0,
      productSpecifications: [{ specification: '功率', unit: '4W' }],
      skuNo: '201711210007',
      state: 'instore',
      stock: 531
    };
  },
  update: () => {
    return { code: 200, errorMsg: '', message: '成功响应请求', resData: null, result: true };
  },
  changestate: () => {
    return { code: 200, errorMsg: '', message: '成功响应请求', resData: null, result: true };
  },
  add: () => {
    return { code: 200, errorMsg: '', message: '成功响应请求', resData: null, result: true };
  }
};
