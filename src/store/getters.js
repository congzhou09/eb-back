const getters = {
  sidebar: state => state.app.sidebar,
  token: state => state.user.token,
  userId: state => state.user.id,
  roleId: state => state.user.roleId,
  name: state => state.user.name,
  email: state => state.user.email,
  avatar: state => state.user.avatar,
  permission_routers: state => state.permission.routers,
  addRouters: state => state.permission.addRouters,
  readOnlyMap: state => state.permission.readOnlyMap
};
export default getters;
