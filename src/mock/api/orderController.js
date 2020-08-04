export default {
  query: options => {
    if (JSON.parse(options.body).orderType === 1) {
      // 普通订单
      if (options.url.indexOf('page') > 0) {
        // 订单列表
        return {
          total: 2,
          orders: [
            {
              address: null,
              buyRecord: null,
              express: {
                createTime: null,
                createUser: '',
                expressNo: '',
                id: 0,
                name: '',
                orderNo: '',
                updateTime: null
              },
              hilomp: null,
              logs: [
                {
                  createTime: 1506412329000,
                  id: 4973,
                  operate: 2,
                  operateUser: 1,
                  orderNo: '1709261052906100',
                  userType: 1
                }
              ],
              order: {
                addressId: 202,
                adressId: 202,
                createTime: 1506410529000,
                discountAmount: 0,
                freight: 0,
                gameId: 0,
                gameInfo: '',
                id: 6357,
                isauto: 0,
                orderNo: '1709261052906100',
                orderRemark: '',
                orderType: 1,
                parentOrderNo: '',
                phone: '13728515348',
                promotionId: 0,
                serviceRemark: '',
                state: 'canceled',
                totalPrice: 1008,
                updateTime: 1506412329000,
                userCouponId: 0,
                userId: 287
              },
              orderPay: {
                billingOrderId: '',
                channelOrderId: '',
                id: 0,
                orderNo: '',
                payPrice: 0,
                payTime: null,
                payType: 0,
                runningNumber: '',
                state: 0,
                userId: 0
              },
              products: [
                {
                  orderProduct: {
                    amount: 1,
                    id: 8799,
                    orderNo: '1709261052906100',
                    price: 998,
                    productId: 67,
                    userId: 287
                  },
                  product: {
                    categoryId: 24,
                    couponId: 0,
                    createTime: 1503482132000,
                    headImage: '/static/mock/1506677401785.png',
                    id: 67,
                    name: '佳美娜干红',
                    originalPrice: 1288,
                    pType: 1,
                    price: 998,
                    skuNo: '11708230007',
                    state: 'onsale'
                  }
                }
              ],
              user: {
                balance: 0,
                createTime: 1505374904000,
                gold: 0,
                greenhandState: 0,
                id: 287,
                lastloginTime: 1509071887000,
                luckyValue: 0,
                message: '',
                parentId: 0,
                password: '',
                proxyId: 0,
                reveiveAwardState: 0,
                state: 0,
                updateTime: 1509071887000
              }
            },
            {
              address: null,
              buyRecord: null,
              express: {
                createTime: null,
                createUser: '',
                expressNo: '',
                id: 0,
                name: '',
                orderNo: '',
                updateTime: null
              },
              hilomp: null,
              logs: [
                {
                  createTime: 1505964573000,
                  id: 4807,
                  operate: 3,
                  operateUser: 302,
                  orderNo: '1709216456955100',
                  userType: 2
                }
              ],
              order: {
                addressId: 192,
                adressId: 192,
                createTime: 1505964569000,
                discountAmount: 0,
                freight: 0,
                gameId: 0,
                gameInfo: '',
                id: 6047,
                isauto: 0,
                orderNo: '1709216456955100',
                orderRemark: '',
                orderType: 1,
                parentOrderNo: '',
                phone: '13928664296',
                promotionId: 0,
                serviceRemark: '',
                state: 'toship',
                totalPrice: 18,
                updateTime: 1512705600000,
                userCouponId: 0,
                userId: 302
              },
              orderPay: {
                billingOrderId: '',
                channelOrderId: '',
                id: 3378,
                orderNo: '1709216456955100',
                payPrice: 18,
                payTime: 1505964573000,
                payType: 3,
                runningNumber: '11709210273517',
                state: 1,
                userId: 302
              },
              products: [
                {
                  orderProduct: {
                    amount: 1,
                    id: 8470,
                    orderNo: '1709216456955100',
                    price: 8,
                    productId: 107,
                    userId: 302
                  },
                  product: {
                    categoryId: 30,
                    content: '<p><!--StartFragment--><!--EndFragment--></p><h1>龙园号 勐海小饼（陈香） 6克/饼</h1>',
                    couponId: 0,
                    createTime: 1504084755000,
                    headImage: '/static/mock/1506677409770',
                    id: 107,
                    name: '勐海小饼',
                    originalPrice: 11,
                    pType: 1,
                    price: 8,
                    skuNo: '11708300004',
                    state: 'onsale'
                  }
                }
              ],
              user: {
                balance: 0,
                createTime: 1505445444000,
                gold: 0,
                greenhandState: 0,
                id: 302,
                lastloginTime: 1507599080000,
                luckyValue: 0,
                message: '',
                nickname: ' alice ',
                parentId: 0,
                password: '',
                phone: '13928664296',
                proxyId: 0,
                reveiveAwardState: 0,
                state: 0,
                updateTime: 1507599080000
              }
            }
          ]
        };
      } // 订单详情
      else {
        return {
          total: 1,
          orders: [
            {
              address: null,
              buyRecord: null,
              express: {
                createTime: null,
                createUser: '',
                expressNo: '',
                id: 0,
                name: '',
                orderNo: '',
                updateTime: null
              },
              hilomp: null,
              logs: [
                {
                  createTime: 1505964573000,
                  id: 4807,
                  operate: 3,
                  operateUser: 302,
                  orderNo: '1709216456955100',
                  userType: 2
                }
              ],
              order: {
                addressId: 192,
                adressId: 192,
                consignee: '张小姐',
                createTime: 1505964569000,
                detailedAddress: '浩瀚路23号',
                discountAmount: 0,
                freight: 0,
                gameId: 0,
                gameInfo: '',
                id: 6047,
                isauto: 0,
                orderNo: '1709216456955100',
                orderRemark: '',
                orderType: 1,
                parentOrderNo: '',
                phone: '13988888888',
                promotionId: 0,
                serviceRemark: '',
                state: 'toship',
                totalPrice: 18,
                updateTime: 1512705600000,
                userCouponId: 0,
                userId: 302
              },
              orderPay: {
                billingOrderId: '',
                channelOrderId: '',
                id: 3378,
                orderNo: '1709216456955100',
                payPrice: 18,
                payTime: 1505964573000,
                payType: 3,
                runningNumber: '11709210273517',
                state: 1,
                userId: 302
              },
              products: [
                {
                  orderProduct: {
                    amount: 1,
                    id: 8470,
                    orderNo: '1709216456955100',
                    price: 8,
                    productId: 107,
                    userId: 302
                  },
                  product: {
                    categoryId: 30,
                    content: '<p><!--StartFragment--><!--EndFragment--></p><h1>龙园号 勐海小饼（陈香） 6克/饼</h1>',
                    couponId: 0,
                    createTime: 1504084755000,
                    headImage: '/static/mock/1506677409770',
                    id: 107,
                    name: '勐海小饼',
                    originalPrice: 11,
                    pType: 1,
                    price: 8,
                    skuNo: '11708300004',
                    state: 'onsale'
                  }
                }
              ],
              user: {
                balance: 0,
                createTime: 1505445444000,
                gold: 0,
                greenhandState: 0,
                id: 302,
                lastloginTime: 1507599080000,
                luckyValue: 0,
                message: '',
                nickname: ' alice ',
                parentId: 0,
                password: '',
                phone: '13928664296',
                proxyId: 0,
                reveiveAwardState: 0,
                state: 0,
                updateTime: 1507599080000
              }
            }
          ]
        };
      }
    } // 升值订单
    else {
      if (options.url.indexOf('page') > 0) {
        // 订单列表
        return {
          total: 3,
          orders: [
            {
              address: null,
              buyRecord: null,
              express: {
                createTime: null,
                createUser: '',
                expressNo: '',
                id: 0,
                name: '',
                orderNo: '',
                updateTime: null
              },
              farmBetLog: null,
              hilomp: {
                briefResult: '1',
                chance: 50,
                createTime: 1514248898000,
                id: 11463,
                orderNo: '2712264889784200',
                result: '0|442',
                sequence: '5,1,442',
                updateTime: 1514248897000
              },
              logs: [],
              order: {
                addressId: 0,
                adressId: 0,
                consignee: '',
                createTime: 1514248897000,
                detailedAddress: '',
                discountAmount: 0,
                farmPromotionIds: '',
                freight: 0,
                gameId: 2,
                gameInfo: '成功',
                id: 23418,
                isauto: 0,
                orderNo: '271226488978420001',
                orderRemark: '',
                orderType: 1,
                parentOrderNo: '2712264889784200',
                phone: '',
                promotionId: 0,
                serviceRemark: '',
                state: 'repayed',
                totalPrice: 14.5,
                updateTime: 1514248897000,
                userCouponId: 0,
                userId: 663
              },
              orderPay: {
                billingOrderId: '',
                channelOrderId: '',
                id: 13839,
                orderNo: '2712264889784200',
                payPrice: 8,
                payTime: 1514248897000,
                payType: 3,
                runningNumber: '11712260256414',
                state: 1,
                userId: 663
              },
              products: [
                {
                  orderProduct: {
                    amount: 1,
                    id: 26471,
                    orderNo: '271226488978420001',
                    price: 14.5,
                    productId: 143,
                    userId: 663
                  },
                  product: {
                    banner: '/static/mock/1511245906254',
                    categoryId: 40,
                    content:
                      '<p><img src="/static/mock/1511246053356" style="max-width:100%" class="detail-img"><br></p><p><img src="/static/mock/1511246078122" style="max-width:100%" class="detail-img"><br></p><p><img src="/static/mock/1511246087684" style="max-width:100%" class="detail-img"><br></p><p><img src="/static/mock/1511246107337" style="max-width:100%" class="detail-img"><br></p><p><br></p>',
                    couponId: 0,
                    createTime: 1511438448000,
                    headImage: '/static/mock/1511245906254',
                    id: 143,
                    name: '手机通用自拍杆',
                    originalPrice: 18,
                    pType: 1,
                    price: 14.5,
                    skuNo: '201711210002',
                    state: 'onsale'
                  }
                }
              ],
              user: {
                accessToken: '',
                avatar: '/static/mock/1509615951669',
                balance: 0,
                createTime: 1510631800000,
                gold: 0,
                greenhandState: 1,
                id: 663,
                lastloginTime: 1514248659000,
                luckyValue: 1,
                message: '',
                nickname: '编号7281',
                openid: '',
                parentId: 0,
                password: '727a73b40662dc7a2fb0d1ff11c1306c',
                phone: '18700009328',
                proxyId: 0,
                reveiveAwardState: 0,
                state: 0,
                token: '',
                updateTime: 1514249811000,
                uuid: '2006716815'
              }
            },
            {
              address: null,
              buyRecord: null,
              express: {
                createTime: null,
                createUser: '',
                expressNo: '',
                id: 0,
                name: '',
                orderNo: '',
                updateTime: null
              },
              farmBetLog: null,
              hilomp: null,
              logs: null,
              order: {
                addressId: 0,
                adressId: 0,
                consignee: '',
                createTime: 1514248897000,
                detailedAddress: '',
                discountAmount: 0,
                farmPromotionIds: '',
                freight: 0,
                gameId: 2,
                gameInfo: '',
                id: 23417,
                isauto: 1,
                orderNo: '2712264889784200',
                orderRemark: '',
                orderType: 1,
                parentOrderNo: '',
                phone: '',
                promotionId: 55,
                serviceRemark: '',
                state: 'revalued',
                totalPrice: 8,
                updateTime: 1514248897000,
                userCouponId: 0,
                userId: 663
              },
              orderPay: null,
              products: [
                {
                  orderProduct: {
                    amount: 1,
                    id: 26470,
                    orderNo: '2712264889784200',
                    price: 8,
                    productId: 137,
                    userId: 663
                  },
                  product: {
                    banner: '/static/mock/1510884803194',
                    categoryId: 41,
                    content:
                      '<p><img src="/static/mock/1510885261309" style="max-width:100%" class="detail-img"><br></p><p><img src="/static/mock/1510885269843" style="max-width:100%" class="detail-img"><br></p><p><img src="/static/mock/1510885276570" style="max-width:100%" class="detail-img"><br></p><p><img src="/static/mock/1510885281997" style="max-width:100%" class="detail-img"><br></p><p><img src="/static/mock/1510885290858" style="max-width:100%" class="detail-img"><br></p><p><img src="/static/mock/1510885297264" style="max-width:100%" class="detail-img"><br></p>',
                    couponId: 0,
                    createTime: 1511838570000,
                    headImage: '/static/mock/1510884803194',
                    id: 137,
                    name: '依姿露小甘菊护手霜',
                    originalPrice: 15,
                    pType: 1,
                    price: 8,
                    skuNo: '201711170001',
                    state: 'instore'
                  }
                }
              ],
              user: {
                accessToken: '',
                avatar: '/static/mock/1509615951669',
                balance: 0,
                createTime: 1510631800000,
                gold: 0,
                greenhandState: 1,
                id: 663,
                lastloginTime: 1514248659000,
                luckyValue: 1,
                message: '',
                nickname: '编号7281',
                openid: '',
                parentId: 0,
                password: '727a73b40662dc7a2fb0d1ff11c1306c',
                phone: '18700009328',
                proxyId: 0,
                reveiveAwardState: 0,
                state: 0,
                token: '',
                updateTime: 1514249811000,
                uuid: '2006716815'
              }
            },
            {
              address: null,
              buyRecord: null,
              express: {
                createTime: null,
                createUser: '',
                expressNo: '',
                id: 0,
                name: '',
                orderNo: '',
                updateTime: null
              },
              farmBetLog: null,
              hilomp: null,
              logs: null,
              order: {
                addressId: 0,
                adressId: 0,
                consignee: '',
                createTime: 1505565624000,
                detailedAddress: '',
                discountAmount: 0,
                farmPromotionIds: '',
                freight: 0,
                gameId: 1,
                gameInfo: '失败',
                id: 5453,
                isauto: 0,
                orderNo: '2709166562491300',
                orderRemark: '',
                orderType: 1,
                parentOrderNo: '',
                phone: '',
                promotionId: 59,
                serviceRemark: '',
                state: 'unrevalued',
                totalPrice: 5,
                updateTime: 1505565624000,
                userCouponId: 0,
                userId: 317
              },
              orderPay: null,
              products: [
                {
                  orderProduct: {
                    amount: 1,
                    id: 7864,
                    orderNo: '2709166562491300',
                    price: 5,
                    productId: 81,
                    userId: 317
                  },
                  product: {
                    categoryId: 30,
                    couponId: 0,
                    createTime: 1503497166000,
                    headImage: '/static/mock/1506677406665',
                    id: 81,
                    name: '金丝皇菊 袋装 ',
                    originalPrice: 8,
                    pType: 1,
                    price: 5,
                    skuNo: '11708230020',
                    state: 'onsale'
                  }
                }
              ],
              user: {
                accessToken: '',
                avatar:
                  'http://wx.qlogo.cn/mmopen/vi_32/32ic9mJPqwcoE8Y5GGSk0YsZXuGYVxrnqicibcbmNdCCZP1gKUNDQWZrfgj9JM0EKP5HQJEgiaq2ibicpLnRHRnqesxw/0',
                balance: 0,
                createTime: 1505565330000,
                gold: 0,
                greenhandState: 0,
                id: 317,
                lastloginTime: 1505565330000,
                luckyValue: 0,
                message: '',
                nickname: '明天会更好 ',
                openid: 'oS28ewqTZMwWdt-V0ZQfWULbf-VY',
                parentId: 0,
                password: '',
                phone: '13822223898',
                proxyId: 0,
                reveiveAwardState: 0,
                state: 0,
                token: '',
                updateTime: 1505565366000,
                uuid: '2761017725'
              }
            },
            {
              address: null,
              buyRecord: null,
              express: {
                createTime: null,
                createUser: '',
                expressNo: '',
                id: 0,
                name: '',
                orderNo: '',
                updateTime: null
              },
              farmBetLog: null,
              hilomp: null,
              logs: null,
              order: {
                addressId: 0,
                adressId: 0,
                consignee: '',
                createTime: 1514461955000,
                detailedAddress: '',
                discountAmount: 0,
                farmPromotionIds: '',
                freight: 0,
                gameId: 3,
                gameInfo: '成功',
                id: 23567,
                isauto: 0,
                orderNo: '271228619530170001',
                orderRemark: '',
                orderType: 1,
                parentOrderNo: '2712286195301700',
                phone: '',
                promotionId: 0,
                serviceRemark: '',
                state: 'rewarded',
                totalPrice: 56,
                updateTime: 1514461918000,
                userCouponId: 0,
                userId: 288
              },
              orderPay: null,
              products: [
                {
                  orderProduct: {
                    amount: 2,
                    id: 26651,
                    orderNo: '271228619530170001',
                    price: 14.5,
                    productId: 143,
                    userId: 288
                  },
                  product: {
                    banner: '/static/mock/1511245906254',
                    categoryId: 40,
                    content:
                      '<p><img src="/static/mock/1511246053356" style="max-width:100%" class="detail-img"><br></p><p><img src="/static/mock/1511246078122" style="max-width:100%" class="detail-img"><br></p><p><img src="/static/mock/1511246087684" style="max-width:100%" class="detail-img"><br></p><p><img src="/static/mock/1511246107337" style="max-width:100%" class="detail-img"><br></p><p><br></p>',
                    couponId: 0,
                    createTime: 1511438448000,
                    headImage: '/static/mock/1511245906254',
                    id: 143,
                    name: '手机通用自拍杆',
                    originalPrice: 18,
                    pType: 1,
                    price: 14.5,
                    skuNo: '201711210002',
                    state: 'onsale'
                  }
                },
                {
                  orderProduct: {
                    amount: 1,
                    id: 26652,
                    orderNo: '271228619530170001',
                    price: 15,
                    productId: 72,
                    userId: 288
                  },
                  product: {
                    categoryId: 30,
                    couponId: 0,
                    createTime: 1503491291000,
                    headImage: '/static/mock/1506677403030',
                    id: 72,
                    name: '普洱金砖 ',
                    originalPrice: 18,
                    pType: 1,
                    price: 15,
                    skuNo: '11708230012',
                    state: 'onsale'
                  }
                },
                {
                  orderProduct: {
                    amount: 1,
                    id: 26653,
                    orderNo: '271228619530170001',
                    price: 12,
                    productId: 108,
                    userId: 288
                  },
                  product: {
                    banner: '',
                    categoryId: 30,
                    content: '',
                    couponId: 0,
                    createTime: 1504088018000,
                    headImage: '/static/mock/1506677410097',
                    id: 108,
                    name: '薏米麦茶',
                    originalPrice: 13,
                    pType: 1,
                    price: 12,
                    skuNo: '11708300005',
                    state: 'onsale'
                  }
                }
              ],
              user: {
                accessToken: '',
                avatar: '/static/mock/1509615951669',
                balance: 0,
                createTime: 1505375742000,
                gold: 0,
                greenhandState: 1,
                id: 288,
                lastloginTime: 1514458369000,
                luckyValue: 1,
                message: '',
                nickname: '编号1348',
                openid: '',
                parentId: 0,
                phone: '13522222222',
                proxyId: 0,
                reveiveAwardState: 0,
                state: 0,
                token: '',
                updateTime: 1514460654000,
                uuid: ''
              }
            }
          ]
        };
      } // 订单详情
      else {
        return {
          total: 1,
          orders: [
            {
              address: null,
              buyRecord: null,
              express: {
                createTime: null,
                createUser: '',
                expressNo: '',
                id: 0,
                name: '',
                orderNo: '',
                updateTime: null
              },
              farmBetLog: null,
              hilomp: {
                briefResult: '1',
                chance: 50,
                createTime: 1514248898000,
                id: 11463,
                orderNo: '2712264889784200',
                result: '0|442',
                sequence: '5,1,442',
                updateTime: 1514248897000
              },
              logs: [],
              order: {
                addressId: 0,
                adressId: 0,
                consignee: '',
                createTime: 1514248897000,
                detailedAddress: '',
                discountAmount: 0,
                farmPromotionIds: '',
                freight: 0,
                gameId: 2,
                gameInfo: '成功',
                id: 23418,
                isauto: 0,
                orderNo: '271226488978420001',
                orderRemark: '',
                orderType: 1,
                parentOrderNo: '2712264889784200',
                phone: '',
                promotionId: 0,
                serviceRemark: '',
                state: 'repayed',
                totalPrice: 14.5,
                updateTime: 1514248897000,
                userCouponId: 0,
                userId: 663
              },
              orderPay: {
                billingOrderId: '',
                channelOrderId: '',
                id: 13839,
                orderNo: '2712264889784200',
                payPrice: 8,
                payTime: 1514248897000,
                payType: 3,
                runningNumber: '11712260256414',
                state: 1,
                userId: 663
              },
              products: [
                {
                  orderProduct: {
                    amount: 1,
                    id: 26471,
                    orderNo: '271226488978420001',
                    price: 14.5,
                    productId: 143,
                    userId: 663
                  },
                  product: {
                    banner: '/static/mock/1511245906254',
                    categoryId: 40,
                    content:
                      '<p><img src="/static/mock/1511246053356" style="max-width:100%" class="detail-img"><br></p><p><img src="/static/mock/1511246078122" style="max-width:100%" class="detail-img"><br></p><p><img src="/static/mock/1511246087684" style="max-width:100%" class="detail-img"><br></p><p><img src="/static/mock/1511246107337" style="max-width:100%" class="detail-img"><br></p><p><br></p>',
                    couponId: 0,
                    createTime: 1511438448000,
                    headImage: '/static/mock/1511245906254',
                    id: 143,
                    name: '手机通用自拍杆',
                    originalPrice: 18,
                    pType: 1,
                    price: 14.5,
                    skuNo: '201711210002',
                    state: 'onsale'
                  }
                }
              ],
              user: {
                accessToken: '',
                avatar: '/static/mock/1509615951669',
                balance: 0,
                createTime: 1510631800000,
                gold: 0,
                greenhandState: 1,
                id: 663,
                lastloginTime: 1514248659000,
                luckyValue: 1,
                message: '',
                nickname: '编号7281',
                openid: '',
                parentId: 0,
                phone: '18700007281',
                proxyId: 0,
                reveiveAwardState: 0,
                state: 0,
                updateTime: 1514249811000
              }
            }
          ]
        };
      }
    }
  },
  express: () => {
    return { code: 200, errorMsg: '', message: '成功响应请求', resData: [], result: true };
  },
  close: () => {
    return { code: 200, errorMsg: '', message: '成功响应请求', resData: [], result: true };
  },
  updateOk: () => {
    return { code: 200, errorMsg: '', message: '成功响应请求', resData: [], result: true };
  }
};
