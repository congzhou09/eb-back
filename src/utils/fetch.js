import axios from 'axios';
import { Message } from 'element-ui';
import store from '../store';
import router from '../router';
import NProgress from 'nprogress'; // Progress 进度条
import { MessageBox } from 'element-ui';
import Cookies from 'js-cookie';
// import {param} from '../../utils/index';
// 创建axios实例
const service = axios.create({
  baseURL: process.env.BASE_API, // api的base_url
  timeout: 5000 // 请求超时时间
});

// request拦截器
service.interceptors.request.use(
  config => {
    // console.log(config.headers.common.Accept.split(',')[0]);

    const qs = require('querystring'); // 可以对form提交格式的参数转序列化格式如：curtPage=1&pageSize=10
    // Do something before request is sent
    if (store.getters.token) {
      // token
      const token = store.getters.token;
      // body
      let queryString = '';
      let body = '';
      if (config.data) {
        const dataType = typeof config.data;
        if (dataType == 'object') {
          body = JSON.stringify(config.data);
        }
        if (dataType == 'string') {
          body = decodeURIComponent(config.data);
        }
        // console.log(body);
      }
      if (config.params) {
        queryString = qs.stringify(config.params);
      }
      // url
      const urla = config.url.split(process.env.BASE_API)[1];
      const url = urla + (queryString === '' ? '' : '?' + queryString);
      // id
      const id = Cookies.get('userId');
      // stime
      let stime = new Date();
      stime = stime.getTime();
      // sign
      const signs = url + body + 'admin' + id + stime + token;
      const sign = md5(signs);
      const Authorization = 'admin.' + id + '.' + stime + '.' + sign;
      config.headers.Authorization = Authorization;
    }
    return config;
  },
  error => {
    // Do something with request error
    console.log(error); // for debug
    Promise.reject(error);
  }
);

// respone拦截器
/**
 * 下面的注释为通过response自定义code来标示请求状态，当code返回如下情况为权限有问题，登出并返回到登录页
 * 如通过xmlhttprequest 状态码标识 逻辑可写在下面error中
 */
// const code = response.data.code;
// // 50014:Token 过期了 50012:其他客户端登录了 50008:非法的token
// if (code === 50008 || code === 50014 || code === 50012) {
//   Message({
//     message: res.message,
//     type: 'error',
//     duration: 5 * 1000
//   });
//   // 登出
//   store.dispatch('FedLogOut').then(() => {
//     router.push({ path: '/login' })
//   });
// } else {
//   return response
// }
service.interceptors.response.use(
  response => {
    const code = response.data.code;
    if (code === 10000) {
      NProgress.done();
      MessageBox.alert(`${decodeURI(response.data.message)} 需要重新登录，将跳转到登录页`, '提示', {
        confirmButtonText: '确定',
        callback: action => {
          store.dispatch('LogOut').then(() => {
            router.push({ path: '/login' });
          });
        }
      });
    } else {
      return response;
    }
  },
  error => {
    console.log('err' + error); // for debug
    /* eslint-disable */
    Message({
      message: '与服务器通信失败：' + error.message,
      type: 'error',
      duration: 6 * 1000
    });
    /* eslint-enable */
    NProgress.done();
    return Promise.reject(error);
  }
);

export default service;
