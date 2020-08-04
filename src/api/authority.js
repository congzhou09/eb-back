import fetch from 'utils/fetch';

export function addAdmin(adminInfo) {
  const data = {
    name: adminInfo.name,
    email: adminInfo.email,
    password: md5(adminInfo.password),
    roleId: parseInt(adminInfo.roleId)
  };
  return fetch({
    url: '/admin/add',
    method: 'post',
    data
  });
}

export function getAdminList(listInfo) {
  return fetch({
    url: '/admin/list',
    method: 'post',
    params: listInfo
  });
}

export function modifyAdmin(adminInfo) {
  return fetch({
    url: '/admin/modifypasword',
    method: 'post',
    data: adminInfo
  });
}
