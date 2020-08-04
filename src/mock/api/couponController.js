export default {
  list: () => {
    return {
      code: 200,
      errorMsg: '',
      message: '成功响应请求',
      resData: {
        curtPage: 1,
        list: [
          {
            couponName: '登录奖励1',
            hadReleasedNum: '391/5000',
            createTime: '2017-11-17',
            faceValue: '1.00(满10.00)',
            typeName: '普通优惠券',
            statusName: '有效',
            termOfValidity: '2017-11-17至2020-01-01',
            couponId: 1,
            type: 3,
            status: 1
          },
          {
            couponName: '代理绑定（代理）',
            hadReleasedNum: '427',
            createTime: '2017-09-29',
            faceValue: '1.00(满10.00)',
            typeName: '代理优惠券',
            statusName: '有效',
            termOfValidity: '7天',
            couponId: 2,
            type: 4,
            status: 1
          },
          {
            couponName: '新手注册',
            hadReleasedNum: '972',
            createTime: '2017-09-29',
            faceValue: '8.00(满80.00)',
            typeName: '新人专享',
            statusName: '失效',
            termOfValidity: '7天',
            couponId: 3,
            type: 1,
            status: 0
          },
          {
            couponName: '老用户回流7',
            hadReleasedNum: '115',
            createTime: '2017-09-29',
            faceValue: '5.00(满10.00)',
            typeName: '个人优惠券',
            statusName: '有效',
            termOfValidity: '7天',
            couponId: 4,
            type: 2,
            status: 1
          }
        ],
        pageSize: 10,
        totalPage: 1,
        totalSize: 4
      },
      result: true
    };
  },
  coupon: options => {
    const couponId = parseInt(options.url.slice(options.url.indexOf('?couponId=') + 10));
    if (couponId === 1) {
      return {
        code: 200,
        errorMsg: '',
        message: '成功响应请求',
        resData: {
          adminId: 17,
          couponId: 54,
          createTime: '2017-11-17 10:31:33',
          faceValue: 1,
          hadReleasedNum: 39,
          name: '登录奖励1',
          payLimit: 10,
          releaseNumLimit: 5000,
          scope: 1,
          sendUserType: 0,
          singleReleaseNum: 9,
          status: 1,
          term: 7,
          termEnd: '2020-01-01 23:59:59',
          termStart: '2017-11-17 00:00:00',
          type: 3,
          updateTime: '2017-12-25 06:00:36'
        },
        result: true
      };
    } else if (couponId === 2) {
      return {
        code: 200,
        errorMsg: '',
        message: '成功响应请求',
        resData: {
          adminId: 13,
          couponId: 41,
          createTime: '2017-09-29 16:45:20',
          faceValue: 1,
          hadReleasedNum: 427,
          name: '代理绑定（代理）',
          payLimit: 10,
          releaseNumLimit: 0,
          scope: 1,
          sendUserType: 2,
          singleReleaseNum: 1,
          status: 1,
          term: 7,
          termEnd: null,
          termStart: null,
          type: 4,
          updateTime: '2017-12-20 17:08:25'
        },
        result: true
      };
    } else if (couponId === 3) {
      return {
        code: 200,
        errorMsg: '',
        message: '成功响应请求',
        resData: {
          adminId: 17,
          couponId: 29,
          createTime: '2017-09-29 16:38:20',
          faceValue: 8,
          hadReleasedNum: 972,
          name: '新手注册',
          payLimit: 80,
          releaseNumLimit: 0,
          scope: 1,
          sendUserType: 0,
          singleReleaseNum: 2,
          status: 0,
          term: 7,
          termEnd: '2019-10-01 23:59:59',
          termStart: '2017-09-01 00:00:00',
          type: 1,
          updateTime: '2017-12-04 10:58:02'
        },
        result: true
      };
    } else {
      return {
        code: 200,
        errorMsg: '',
        message: '成功响应请求',
        resData: {
          adminId: 9,
          couponId: 52,
          createTime: '2017-09-29 17:38:42',
          faceValue: 5,
          hadReleasedNum: 115,
          name: '老用户回流7',
          payLimit: 10,
          releaseNumLimit: 0,
          scope: 3,
          sendUserType: 0,
          singleReleaseNum: 1,
          status: 1,
          term: 7,
          termEnd: null,
          termStart: null,
          type: 2,
          updateTime: '2017-12-23 18:13:44'
        },
        result: true
      };
    }
  },
  coupon_send_record: () => {
    return {
      code: 200,
      errorMsg: '',
      message: '成功响应请求',
      resData: {
        curtPage: 1,
        list: [
          {
            phone: '13834562224',
            userNickName: '李磊',
            userId: 484,
            sendTime: '2017-09-30 10:03:06'
          },
          {
            phone: '13591234300',
            userNickName: '林涛',
            userId: 485,
            sendTime: '2017-09-30 10:25:36'
          },
          {
            phone: '18312348431',
            userNickName: '糖果',
            userId: 486,
            sendTime: '2017-09-30 10:56:07'
          }
        ],
        pageSize: 10,
        totalPage: 1,
        totalSize: 3
      },
      result: true
    };
  },
  updateok: () => {
    return { code: 200, errorMsg: '', message: '成功响应请求', resData: null, result: true };
  }
};
