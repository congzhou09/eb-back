import { param2Obj } from '../../utils';

const userMap = {
  super: {
    creatTime: 1504169613000,
    email: 'super@ee.com',
    id: 1,
    name: '超超',
    password: '',
    roleId: 1,
    state: 0,
    token: 'a_a7f29b95-ef7f-4389-83e0-74442a47c820',
    updateTime: null
  },
  ware: {
    creatTime: 1508488457000,
    email: 'ware@ee.com',
    id: 2,
    name: '商商',
    password: '',
    roleId: 2,
    state: 0,
    token: 'a_1acceb65-4c77-4e0c-b504-340fb80c24fa',
    updateTime: null
  },
  money: {
    creatTime: 1504148622000,
    email: 'money@ee.com',
    id: 3,
    name: '财财',
    password: '',
    roleId: 3,
    state: 0,
    token: 'a_9093f3dc-d6b6-4d0b-9d5b-eaf084c8bd0d',
    updateTime: null
  },
  common: {
    creatTime: 1505381457000,
    email: 'normal@ee.com',
    id: 4,
    name: '普普',
    password: '',
    roleId: 4,
    state: 0,
    token: 'a_68bee436-6f92-47b4-91ee-6657a53e6080',
    updateTime: null
  },
  expand: {
    creatTime: 1512380159000,
    email: 'expand@ee.com',
    id: 5,
    name: '推推',
    password: '',
    roleId: 5,
    state: 0,
    token: 'a_87d36dbc-65c4-4e21-8f5c-a3c7e69d9a74',
    updateTime: null
  }
};

export default {
  login: req => {
    const { email } = JSON.parse(req.body);
    return userMap[email.split('@')[0]];
  },
  getrid: req => {
    const { id } = param2Obj(req.url);
    let resultObj = {};
    Object.keys(userMap).forEach(function(oneKey) {
      if (userMap[oneKey].id === parseInt(id)) {
        resultObj = userMap[oneKey];
      }
    });
    return resultObj;
  },
  logout: () => {
    return { code: 200, errorMsg: '', message: '退出成功', resData: null, result: true };
  },
  list: () => {
    const oneArr = [];
    Object.keys(userMap).forEach(function(oneKey) {
      oneArr.push(userMap[oneKey]);
    });
    const resultObj = JSON.parse('{"curtPage":0,"list":[],"pageSize":10,"totalPage":1,"totalSize":5}');
    resultObj.list = oneArr;
    return resultObj;
  },
  add: () => {
    return { code: 200, errorMsg: '', message: '添加成功', resData: null, result: true };
  }
};
