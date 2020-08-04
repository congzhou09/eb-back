import fetch from 'utils/fetch';

export function loginByEmail(email, password) {
  const data = {
    email,
    password
  };
  return fetch({
    url: '/admin/login',
    method: 'post',
    data
  });
}

export function getUserInfo(userId) {
  const data = {};
  data.id = userId;
  return fetch({
    url: '/admin/getrid',
    method: 'post',
    params: data
  });
}

export function logout() {
  return fetch({
    url: '/admin/logout',
    method: 'post'
  });
}
