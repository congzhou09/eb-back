import { loginByEmail, logout, getUserInfo } from 'api/login';
import Cookies from 'js-cookie';

const user = {
  state: {
    token: Cookies.get('user-token'),
    id: Cookies.get('userId'),
    name: '',
    email: '',
    roleId: -1,
    avatar: 'avatar.png'
  },

  mutations: {
    SET_USERINFO_BASE: (state, userInfo) => {
      state.token = userInfo.token;
      state.id = userInfo.id;
      Cookies.set('userId', userInfo.id);
      state.name = userInfo.name;
      state.email = userInfo.email;
    },
    SET_USERINFO_EXTEND: (state, userInfo) => {
      state.id = userInfo.id;
      state.name = userInfo.name;
      state.roleId = userInfo.roleId;
    },
    CLEAR_USERINFO: state => {
      for (const oneAttr in state) {
        if (oneAttr) {
          state[oneAttr] = '';
        }
      }
    }
  },

  actions: {
    // 邮箱登录
    LoginByEmail({ commit }, userInfo) {
      const email = userInfo.email.trim();
      return new Promise((resolve, reject) => {
        loginByEmail(email, md5(userInfo.password))
          .then(response => {
            if (response.status === 200) {
              if (response.data) {
                Cookies.set('user-token', response.data.token);
                commit('SET_USERINFO_BASE', response.data);
                resolve();
              } else {
                reject('登录失败：用户名或密码错误');
              }
            } else {
              this.$message({
                type: 'error',
                message: `登录失败 ${response.status}：${response.statusText}`,
                duration: 1800
              });
              resolve();
            }
          })
          .catch(error => {
            reject(error);
          });
      });
    },

    // 重新获取用户信息
    GetUserInfo({ commit }, userId) {
      return new Promise((resolve, reject) => {
        getUserInfo(userId)
          .then(response => {
            if (response.status === 200) {
              commit('SET_USERINFO_EXTEND', response.data);
              resolve();
            } else {
              this.$message({
                type: 'error',
                message: `${response.status}：${response.statusText}`,
                duration: 1800
              });
              resolve();
            }
          })
          .catch(error => {
            reject(error);
          });
      });
    },

    // 第三方验证登录
    LoginByThirdparty({ commit, state }, code) {
      return new Promise((resolve, reject) => {
        commit('SET_CODE', code);
        loginByThirdparty(state.status, state.email, state.code, state.auth_type)
          .then(response => {
            commit('SET_TOKEN', response.data.token);
            Cookies.set('Admin-Token', response.data.token);
            resolve();
          })
          .catch(error => {
            reject(error);
          });
      });
    },

    // 登出
    LogOut({ commit, state }) {
      return new Promise((resolve, reject) => {
        logout(state.token)
          .then(response => {
            if (response.status === 200) {
              Cookies.remove('user-token');
              Cookies.remove('userId');
              commit('SET_USERINFO_BASE', { token: '', id: '' });
              resolve();
            } else {
              this.$message({
                type: 'error',
                message: `${response.status}：${response.statusText}`,
                duration: 1800
              });
              resolve();
            }
          })
          .catch(error => {
            reject(error);
          });
      });
    },

    // 前端 登出
    FedLogOut({ commit }) {
      return new Promise(resolve => {
        commit('SET_TOKEN', '');
        Cookies.remove('Admin-Token');
        resolve();
      });
    },

    // 动态修改权限
    ChangeRole({ commit }, role) {
      return new Promise(resolve => {
        commit('SET_ROLES', [role]);
        commit('SET_TOKEN', role);
        Cookies.set('Admin-Token', role);
        resolve();
      });
    }
  }
};

export default user;
