export default {
  list: req => {
    return {
      curtPage: 1,
      list: [
        {
          accessToken: '',
          avatar: '/static/mock/user3.png',
          balance: 0.0,
          createTime: 1513650973000,
          gold: 0,
          greenhandState: 1,
          id: 968,
          lastloginTime: 1513650973000,
          luckyValue: 0,
          message: '',
          nickname: '用户3807',
          openid: '',
          parentId: 0,
          password: '',
          phone: '15910000000',
          proxyId: 0,
          rechargeTime: null,
          reveiveAwardState: 0,
          sellTime: null,
          state: 0,
          token: '',
          updateTime: 1513651008000,
          uuid: '9999992820'
        },
        {
          accessToken: '',
          avatar: '/static/mock/user3.png',
          balance: 0.0,
          createTime: 1512525941000,
          gold: 0,
          greenhandState: 0,
          id: 966,
          lastloginTime: 1512525941000,
          luckyValue: 0,
          message: '',
          nickname: '用户3637',
          openid: '',
          parentId: 0,
          password: '',
          phone: '18841000000',
          proxyId: 0,
          rechargeTime: null,
          reveiveAwardState: 0,
          sellTime: null,
          state: 0,
          token: '',
          updateTime: 1512525941000,
          uuid: '3328338208'
        },
        {
          accessToken: '',
          avatar: '/static/mock/user2.png',
          balance: 0.0,
          createTime: 1512445706000,
          gold: 0,
          greenhandState: 0,
          id: 965,
          lastloginTime: 1512445706000,
          luckyValue: 0,
          message: '',
          nickname: '用户2303',
          openid: '',
          parentId: 0,
          password: 'dc9f0a305cd013f2c52ef5174507d526',
          phone: '18755550000',
          proxyId: 0,
          rechargeTime: null,
          reveiveAwardState: 0,
          sellTime: null,
          state: 0,
          token: '',
          updateTime: 1512445706000,
          uuid: '4469589627'
        }
      ],
      pageSize: 10,
      totalPage: 1,
      totalSize: 3
    };
  },
  viewuserinfo: () => {
    return {
      accessToken: '',
      avatar: '/static/mock/user3.png',
      balance: 0.0,
      createTime: 1513650973000,
      gold: 0,
      greenhandState: 1,
      id: 968,
      lastloginTime: 1513650973000,
      luckyValue: 0,
      message: '',
      nickname: '用户3807',
      openid: '',
      parentId: 0,
      password: '',
      phone: '15910000000',
      proxyId: 0,
      reveiveAwardState: 0,
      state: 0,
      token: '',
      updateTime: 1513651008000,
      uuid: '9999992820'
    };
  },
  changeuserinfo: () => {
    return { code: 200, errorMsg: '', message: '修改成功', resData: null, result: true };
  },
  changeuserstate: () => {
    return { code: 200, errorMsg: '', message: '修改成功', resData: null, result: true };
  }
};
