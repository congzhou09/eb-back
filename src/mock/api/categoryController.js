export default {
  list: () => {
    return [
      {
        createTime: 1503367820000,
        id: 24,
        imageUrl: '/static/mock/1505446536424.png',
        name: '优质红酒',
        sort: 0,
        state: 0,
        type: 0
      },
      {
        createTime: 1510830432000,
        id: 39,
        imageUrl: '/static/mock/1510830426598',
        name: '电器',
        sort: 0,
        state: 0,
        type: 0
      },
      {
        createTime: 1510830447000,
        id: 40,
        imageUrl: '/static/mock/1510830446248',
        name: '电子数码产品',
        sort: 0,
        state: 0,
        type: 0
      },
      {
        createTime: 1510830458000,
        id: 41,
        imageUrl: '/static/mock/1510830457645',
        name: '生活用品',
        sort: 0,
        state: 0,
        type: 0
      },
      {
        createTime: 1503572670000,
        id: 26,
        imageUrl: '/static/mock/1505446523000.png',
        name: '手工艺品',
        sort: 1,
        state: 0,
        type: 0
      },
      {
        createTime: 1503572620000,
        id: 30,
        imageUrl: '/static/mock/1505446529372.png',
        name: '养生茶叶',
        sort: 1,
        state: 0,
        type: 0
      },
      {
        createTime: 1504323429000,
        id: 31,
        imageUrl: '/static/mock/1505446515642.png',
        name: '全部商品',
        sort: 2,
        state: 0,
        type: 0
      },
      {
        createTime: 1503541514000,
        id: 1,
        imageUrl: '/static/mock/1505446515642.png',
        name: '默认分类',
        sort: 3,
        state: 0,
        type: 1
      }
    ];
  },
  changesort: () => {
    return { code: 200, errorMsg: '', message: '成功响应请求', resData: null, result: true };
  },
  delete: () => {
    return { code: 200, errorMsg: '', message: '成功响应请求', resData: null, result: true };
  },
  update: () => {
    return { code: 200, errorMsg: '', message: '成功响应请求', resData: null, result: true };
  }
};
