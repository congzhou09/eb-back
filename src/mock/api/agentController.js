export default {
  get_proxy_list: () => {
    return {
      code: 200,
      errorMsg: '',
      message: '成功响应请求',
      resData: {
        curtPage: 1,
        list: [
          {
            proxyLevel: '高级代理',
            bindNum: '1',
            nickName: '高高',
            standardTime: '2017-10-01 19:07:09',
            mobile: '13400000427',
            rechargeTime: 1513232975000,
            userId: 20,
            monthlySales: '0.00',
            sellTime: 1508744743000,
            proxyId: 1,
            monthlyIncome: '0.00'
          },
          {
            proxyLevel: '中级代理',
            bindNum: '54',
            nickName: '中中',
            standardTime: '2017-09-25 11:33:27',
            mobile: '15811119926',
            rechargeTime: 1513862986000,
            userId: 22,
            monthlySales: '0.00',
            sellTime: 1513326070000,
            proxyId: 3,
            monthlyIncome: '0.00'
          },
          {
            proxyLevel: '初级代理',
            bindNum: '2',
            nickName: '初初',
            standardTime: '2017-09-25 20:37:19',
            mobile: '13622222286',
            rechargeTime: 1505673740000,
            userId: 27,
            monthlySales: '0.00',
            sellTime: 1508154282000,
            proxyId: 8,
            monthlyIncome: '0.00'
          }
        ],
        pageSize: 10,
        totalPage: 1,
        totalSize: 3
      },
      result: true
    };
  },
  get_proxy_detail: () => {
    return {
      code: 200,
      errorMsg: '',
      message: '成功响应请求',
      resData: {
        statusStr: '正常代理',
        registerTime: '2017-09-13 21:47:33',
        bindNum: '1',
        nickName: '高高',
        standardTime: '2017-10-01 19:07:09',
        lowerProxyNum: '1',
        sumIncome: '170.90',
        avatar: '/static/mock/user3.png',
        parentProxyId: null,
        userId: 20,
        monthlySales: '0.00',
        proxyLevelStr: '高级代理',
        proxyLevel: 3,
        phone: '13400000427',
        inviteCode: '3052vl',
        lowerLowerProxyNum: '1',
        sumSales: '3382.00',
        proxyId: 1,
        status: 1,
        monthlyIncome: '0.00'
      },
      result: true
    };
  },
  updateok: () => {
    return { code: 200, errorMsg: '', message: '成功响应请求', resData: null, result: true };
  },
  get_profit_detail: () => {
    return {
      code: 200,
      errorMsg: '',
      message: '成功响应请求',
      resData: {
        curtPage: 1,
        list: [
          {
            orderNo: '2712302023015800',
            payAmount: 8,
            phone: '18222224253',
            profitAmount: 0.16,
            createTime: '2017-12-30 15:50:31',
            nickName: '用户1',
            userId: 308
          },
          {
            orderNo: '2712295270257900',
            payAmount: 720,
            phone: '18722228925',
            profitAmount: 14.4,
            createTime: '2017-12-29 21:05:04',
            nickName: '用户2',
            userId: 271
          },
          {
            orderNo: '2712295264268300',
            payAmount: 72,
            phone: '18733338325',
            profitAmount: 1.44,
            createTime: '2017-12-29 21:04:04',
            nickName: '用户3',
            userId: 271
          },
          {
            orderNo: '2712295240292800',
            payAmount: 24,
            phone: '18722228925',
            profitAmount: 0.48,
            createTime: '2017-12-29 21:00:04',
            nickName: '用户2',
            userId: 271
          }
        ],
        pageSize: 10,
        totalPage: 1,
        totalSize: 4
      },
      result: true
    };
  },
  get_bind_user: () => {
    return {
      code: 200,
      errorMsg: '',
      message: '成功响应请求',
      resData: {
        curtPage: 1,
        list: [
          {
            phone: '18222224253',
            bindTime: '2017-09-22 21:00:14',
            nickName: '用户1',
            rechargeTime: 1508147585000,
            userId: 308,
            sellTime: 1514620231000
          }
        ],
        pageSize: 10,
        totalPage: 1,
        totalSize: 1
      },
      result: true
    };
  },
  get_lower_proxy: () => {
    return {
      code: 200,
      errorMsg: '',
      message: '成功响应请求',
      resData: {
        curtPage: 1,
        list: [
          {
            proxyLevel: '高级代理',
            phone: '18722228925',
            bindTime: '2017-09-22 14:53:16',
            rechargeTime: 1510124280000,
            userId: 21,
            sellTime: 1514552661000,
            proxyId: 2,
            status: '正常代理'
          }
        ],
        pageSize: 10,
        totalPage: 1,
        totalSize: 1
      },
      result: true
    };
  },
  select_proxy_note: () => {
    return {
      code: 200,
      errorMsg: '',
      message: '成功响应请求',
      resData: {
        straight: '2.00%',
        secondary:
          '初级代理成为代理7天内销售额达到8000或者月销售额达到30000，初级代理可以晋升中级代理，中级代理可以获得绑定用户销售额2.00%的返利，同时获得下级中级代理销售额0.50%的返现；',
        lowerLower: '0.50%',
        lower: '0.50%',
        tertiary:
          '中级代理培养并保持5个直系中级代理，中级代理可以晋升高级代理，高级代理可以获得绑定用户销售额2.00%的返利，同时获得下级中级代理销售额0.50%的返利以及下下级初级代理销售额0.50%的返利。',
        primary: '平台用户邀请3人绑定自己的推广码并成功消费，可以获得初级代理的资格，初级代理可以获得绑定用户消费金额的2.00%的返利；'
      },
      result: true
    };
  },
  get_withdraw_record: () => {
    return {
      code: 200,
      errorMsg: '',
      message: '成功响应请求',
      resData: {
        curtPage: 1,
        list: [
          {
            recordId: 211,
            amount: '10.80',
            serialNumber: '11712260803580',
            statusStr: '已完成',
            phone: '15933333486',
            applyTime: '2017-12-26 16:28:01',
            userId: 527,
            withdrawTypeStr: '账户余额',
            proxyId: 273,
            status: 2
          },
          {
            recordId: 211,
            amount: '0.16',
            serialNumber: '11712260892062',
            statusStr: '已完成',
            phone: '15022222038',
            applyTime: '2017-12-26 12:31:19',
            userId: 343,
            withdrawTypeStr: '账户余额',
            proxyId: 73,
            status: 2
          },
          {
            recordId: 211,
            amount: '2.46',
            serialNumber: '11712220869223',
            statusStr: '已完成',
            phone: '15811111916',
            applyTime: '2017-12-22 23:59:37',
            userId: 272,
            withdrawTypeStr: '账户余额',
            proxyId: 3,
            status: 2
          }
        ],
        pageSize: 10,
        totalPage: 1,
        totalSize: 3
      },
      result: true
    };
  },
  get_withdraw_detail: () => {
    return {
      code: 200,
      errorMsg: '',
      message: '成功响应请求',
      resData: {
        amount: 10.8,
        statusStr: '已完成',
        accountName: '用户1',
        bankCardNo: '122611129865353',
        nickName: '用户1',
        withdrawType: 2,
        bankName: '中信银行',
        auditRemark: null,
        userId: 527,
        uuid: '5315139624',
        withdrawTypeStr: '账户余额',
        recordId: 211,
        phone: '15222221186',
        proxyId: 273,
        status: 2
      },
      result: true
    };
  }
};
