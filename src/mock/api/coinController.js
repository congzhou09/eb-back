export default {
  get_category_list: () => {
    return {
      code: 200,
      errorMsg: '',
      message: '成功响应请求',
      resData: [
        {
          createTime: '2017-10-24 14:49:09',
          imageUrl: '/static/mock/1513325207506',
          name: '生活用品',
          sort: 1,
          categoryId: 13
        },
        {
          createTime: '2017-10-24 14:49:16',
          imageUrl: '/static/mock/1513325217873',
          name: '电子产品',
          sort: 2,
          categoryId: 14
        },
        {
          createTime: '2017-10-24 14:49:26',
          imageUrl: '/static/mock/1513325225798',
          name: '电器',
          sort: 3,
          categoryId: 15
        }
      ],
      result: true
    };
  },
  get_product_list: () => {
    return {
      code: 200,
      errorMsg: '',
      message: '成功响应请求',
      resData: {
        curtPage: 1,
        list: [
          {
            stateStr: '出售中',
            createTime: '2017-10-24 15:24:25',
            price: 61460,
            skuNo: '51710240003',
            name: '维达抽纸18包',
            id: 17,
            state: 'onsale',
            categoryName: '生活用品',
            categoryId: 13
          },
          {
            stateStr: '出售中',
            createTime: '2017-10-24 15:41:04',
            price: 152600,
            skuNo: '71710240006',
            name: '美的多功能榨汁机WBL2521H',
            id: 20,
            state: 'onsale',
            categoryName: '电器',
            categoryId: 15
          },
          {
            stateStr: '出售中',
            createTime: '2017-10-24 16:01:35',
            price: 348600,
            skuNo: '61710240009',
            name: '米家床头灯',
            id: 23,
            state: 'onsale',
            categoryName: '电子产品',
            categoryId: 14
          }
        ],
        pageSize: 10,
        totalPage: 1,
        totalSize: 3
      },
      result: true
    };
  },
  get_product: () => {
    return {
      code: 200,
      errorMsg: '',
      message: '成功响应请求',
      resData: {
        specificationList: [
          {
            attrValue: '100 * 100 * 221mm',
            attr: '产品尺寸'
          }
        ],
        productId: 23,
        bannerList: ['/static/mock/1511506751070'],
        price: 348600,
        freight: 0,
        name: '米家床头灯',
        skuNo: '61710240009',
        stock: 99,
        categoryName: '电子产品',
        categoryId: 14,
        productType: 1,
        content:
          '<p><img src="/static/mock/1511506760561" style="max-width:100%" class="detail-img"><br></p><p><img src="/static/mock/1511506764795" style="max-width:100%" class="detail-img"><br></p><p><img src="/static/mock/1511506770447" style="max-width:100%" class="detail-img"><img src="/static/mock/1511506774052" class="detail-img" style="max-width: 100%;"><img src="/static/mock/1511506777921" class="detail-img" style="max-width: 100%;"><img src="/static/mock/1511506780818" class="detail-img" style="max-width: 100%;"><img src="/static/mock/1511506783561" class="detail-img" style="max-width: 100%;"><img src="/static/mock/1511506813184" class="detail-img" style="max-width: 100%;"><br></p><p><img src="/static/mock/1511506825682" style="max-width:100%" class="detail-img"><br></p>'
      },
      result: true
    };
  },
  updateok: () => {
    return { code: 200, errorMsg: '', message: '成功响应请求', resData: null, result: true };
  },
  get_card_list: () => {
    return {
      code: 200,
      errorMsg: '',
      message: '成功响应请求',
      resData: {
        curtPage: 1,
        list: [
          {
            statusStr: '未发放',
            createTime: '2017-12-28 19:46:00',
            cardId: 1,
            cardPwd: '1a2b3c4d5e',
            cardNo: '1122334455',
            productName: '中国移动充值卡',
            status: 1
          }
        ],
        pageSize: 10,
        totalPage: 1,
        totalSize: 1
      },
      result: true
    };
  },
  get_recharge_card: () => {
    return {
      code: 200,
      errorMsg: '',
      message: '成功响应请求',
      resData: { productId: 46, faceValue: 30.0, cardId: 1, companyName: '中国移动', cardPwd: '1a2b3c4d5e', cardNo: '1122334455' },
      result: true
    };
  },
  get_card_product: () => {
    return { code: 200, errorMsg: '', message: '成功响应请求', resData: [{ productId: 46, productName: '手机号充值卡' }], result: true };
  },
  get_channel_list: () => {
    return { code: 200, errorMsg: '', message: '成功响应请求', resData: [{ name: '精选推荐', sort: 1, channelId: 3 }], result: true };
  },
  get_channel_products: () => {
    return {
      code: 200,
      errorMsg: '',
      message: '成功响应请求',
      resData: {
        channelInfo: {
          name: '精选推荐',
          channelId: 3
        },
        productList: [
          {
            stateStr: '出售中',
            productId: 16,
            price: 41860,
            skuNo: '61710240002',
            name: 'QCY Q8蓝牙耳机',
            state: 'onsale',
            categoryName: '电子产品'
          },
          {
            stateStr: '出售中',
            productId: 23,
            price: 348600,
            skuNo: '61710240009',
            name: '米家床头灯',
            state: 'onsale',
            categoryName: '电子产品'
          },
          {
            stateStr: '出售中',
            productId: 35,
            price: 3498600,
            skuNo: '61710240020',
            name: '小米Note 3',
            state: 'onsale',
            categoryName: '电子产品'
          },
          {
            stateStr: '出售中',
            productId: 40,
            price: 6018600,
            skuNo: '61710240025',
            name: '联想ThinkPad E575 商务游戏笔记本电脑',
            state: 'onsale',
            categoryName: '电子产品'
          },
          {
            stateStr: '出售中',
            productId: 45,
            price: 9363200,
            skuNo: '61710240030',
            name: 'iPhone8 plus 64G',
            state: 'onsale',
            categoryName: '电子产品'
          }
        ]
      },
      result: true
    };
  },
  get_order_list: () => {
    return {
      code: 200,
      errorMsg: '',
      message: '成功响应请求',
      resData: {
        curtPage: 1,
        list: [
          {
            orderType: 1,
            orderNo: '3711287231965300',
            statusStr: '待发货',
            orderId: 48,
            totalPrice: 124600,
            createTime: '2017-11-28 20:31:59',
            userPhone: '18426106833',
            userId: 931,
            productName: '小米移动电源2',
            status: 'toship'
          },
          {
            orderType: 1,
            orderNo: '3711285846018400',
            statusStr: '已发货',
            orderId: 44,
            totalPrice: 13860,
            createTime: '2017-11-28 16:41:00',
            userPhone: '13823564988',
            userId: 897,
            productName: '洁丽雅纯棉毛巾',
            status: 'shipped'
          },
          {
            orderType: 1,
            orderNo: '3711285346673900',
            statusStr: '已收货',
            orderId: 43,
            totalPrice: 41860,
            createTime: '2017-11-28 15:17:46',
            userPhone: '18739799328',
            userId: 663,
            productName: 'QCY Q8蓝牙耳机',
            status: 'received'
          }
        ],
        pageSize: 10,
        totalPage: 1,
        totalSize: 3
      },
      result: true
    };
  },
  get_order_detail: () => {
    return {
      code: 200,
      errorMsg: '',
      message: '成功响应请求',
      resData: {
        productListInfo: [
          {
            amount: 1,
            price: 13860,
            headImage: '/static/mock/1508828333918',
            skuNo: '51710280001',
            name: '洁丽雅纯棉毛巾'
          }
        ],
        orderExpressInfo: {
          orderExpressName: '圆通速递',
          expressNo: '887707590865116807'
        },
        orderInfo: {
          orderType: 1,
          orderNo: '3712143580015300',
          statusStr: '已发货',
          receiver: '我是真名',
          totalPrice: 13860,
          nickName: '我是昵称',
          userPhone: '15000004904',
          orderRemark: null,
          userId: 34,
          sendTime: '2017-12-15 11:04:00',
          receiverPhone: '15000004904',
          createTime: '2017-12-14 15:16:40',
          detailAddress: '广东省深圳市南山区  火山城1期2栋3单元404',
          endTime: null,
          serviceRemark: null,
          status: 'shipped'
        }
      },
      result: true
    };
  },
  get_exchange_record: () => {
    return {
      code: 200,
      errorMsg: '',
      message: '成功响应请求',
      resData: {
        curtPage: 1,
        list: [
          {
            amount: 13860,
            orderNo: '3712143580023300',
            operateTypeStr: '升值失败订单兑换金币',
            phone: '15000004904',
            createTime: '2017-12-14 15:16:40',
            nickName: '编号1941',
            operateType: 3,
            userId: 342
          },
          {
            amount: 13860,
            orderNo: '3712135227591300',
            operateTypeStr: '升值失败订单兑换金币',
            phone: '13000009823',
            createTime: '2017-12-13 18:01:15',
            nickName: '昵称( ఠൠఠ )',
            operateType: 3,
            userId: 589
          },
          {
            amount: 41860,
            orderNo: '3711285316672900',
            operateTypeStr: '升值失败订单兑换金币',
            phone: '18700009328',
            createTime: '2017-11-28 15:17:46',
            nickName: '编号1781',
            operateType: 3,
            userId: 663
          }
        ],
        pageSize: 10,
        totalPage: 1,
        totalSize: 3
      },
      result: true
    };
  }
};
