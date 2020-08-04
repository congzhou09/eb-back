import { asyncRouterMap, constantRouterMap } from '../../router';

function hasPermission(roles, route) {
  if (route.meta && route.meta.roles) {
    return roles.some(oneRole => route.meta.roles.indexOf(oneRole) >= 0);
  } else {
    return true;
  }
}

function hasReadonlyLimit(roles, route) {
  if (route.meta && route.meta.readonly) {
    return roles.some(oneRole => route.meta.readonly.indexOf(oneRole) >= 0);
  } else {
    return false;
  }
}

const permission = {
  state: {
    routers: constantRouterMap,
    addRouters: [],
    readOnlyMap: {}
  },

  mutations: {
    SET_ROUTERS: (state, routers) => {
      state.addRouters = routers;
      state.routers = constantRouterMap.concat(routers);
    },
    SET_READONLYMAP: (state, readonlymap) => {
      state.readOnlyMap = readonlymap;
    }
  },

  actions: {
    GenerateRoutes({ commit }, data) {
      return new Promise(resolve => {
        const roles = data;
        const accessedRouters = asyncRouterMap.filter(v => {
          if (hasPermission(roles, v)) {
            if (v.children && v.children.length > 0) {
              v.children = v.children.filter(child => {
                if (hasPermission(roles, child)) {
                  return true;
                }
                return false;
              });
            }
            return true;
          } else {
            return false;
          }
        });
        commit('SET_ROUTERS', accessedRouters);
        resolve();
      });
    },
    GenerateReadonlyMap({ commit, state }, data) {
      return new Promise(resolve => {
        const roles = data;
        const readOnlyMap = {};
        state.routers.forEach((v, index) => {
          const totalPath = v.path;
          if (hasReadonlyLimit(roles, v)) {
            if (v.children && v.children.length > 0) {
              v.children.forEach(child => {
                readOnlyMap[totalPath + '/' + child.path] = true;
              });
            } else {
              readOnlyMap[totalPath] = true;
            }
          } else {
            if (v.children && v.children.length > 0) {
              v.children.forEach(child => {
                if (hasReadonlyLimit(roles, child)) {
                  readOnlyMap[totalPath + '/' + child.path] = true;
                }
              });
            }
          }
        });
        commit('SET_READONLYMAP', readOnlyMap);
        resolve();
      });
    }
  }
};

export default permission;
