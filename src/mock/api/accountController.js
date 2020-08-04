export default {
  list: () => {
    return {
      curtPage: 0,
      list: [
        {
          accountBalance: 8,
          accountId: 260,
          amount: 7.2,
          billingOrderId: 'ploy85xnYsBHXHYUWtzVij',
          channelOrderId: '2017122521001004740210918738',
          id: 22124,
          operateNo: '21712250124286',
          operateTime: 1514152947000,
          operateType: 1,
          operateUser: 589,
          orderNo: '',
          phone: '13000099003',
          userId: 589,
          userName: '无需顾虑( ఠൠఠ )'
        },
        {
          accountBalance: 10.3,
          accountId: 568,
          amount: 5,
          billingOrderId: 'oV1wkLxKDU2HyHKU3typcB',
          channelOrderId: '2017122321001004910221833504',
          id: 22208,
          operateNo: '21712230184129',
          operateTime: 1514024336000,
          operateType: 1,
          operateUser: 663,
          orderNo: '',
          phone: '18788799388',
          userId: 663,
          userName: '编号7281'
        }
      ],
      pageSize: 10,
      totalPage: 1,
      totalSize: 2
    };
  },
  changeuseraccount: () => {
    return { code: 200, errorMsg: '', message: '成功响应请求', resData: null, result: true };
  },
  applylist: () => {
    return {
      curtPage: 0,
      list: [
        {
          alipayAccount: '13700000000',
          alipayRealName: '编号8791',
          amount: 80,
          bank: '',
          cardNo: '',
          createTime: 1513785344000,
          id: 573,
          operateNo: '11712200007235',
          phone: '13700000000',
          reason: '',
          state: 2,
          updateTime: 1513785344000,
          userId: 972,
          userName: '编号8791',
          withdrawType: 2
        },
        {
          alipayAccount: '13500000000',
          alipayRealName: '编号8792',
          amount: 50,
          bank: '',
          cardNo: '',
          createTime: 1513733183000,
          id: 572,
          operateNo: '11712200300043',
          phone: '13500000000',
          reason: '',
          state: 2,
          updateTime: 1513733183000,
          userId: 515,
          userName: '编号8792',
          withdrawType: 2
        }
      ],
      pageSize: 10,
      totalPage: 1,
      totalSize: 3
    };
  },
  info: options => {
    const InfoId = options.url.slice(options.url.indexOf('?id=') + 4);
    const responseObj = {
      alipayAccount: '13700000000',
      alipayRealName: '编号8791',
      amount: 80,
      bank: '',
      cardNo: '',
      createTime: 1513785344000,
      id: 573,
      operateNo: '11712200387235',
      phone: '13700000000',
      reason: '',
      state: 2,
      updateTime: 1513785344000,
      userId: 972,
      userName: '编号8791',
      withdrawType: 2
    };
    responseObj.id = parseInt(InfoId);
    return responseObj;
  }
};
