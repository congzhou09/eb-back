import fetch from 'utils/fetch';
import { deleteEmptyAttr } from '../utils/appCommon';

export function getUserList(listInfo) {
  const userInfo = listInfo.user;
  const pageInfo = {
    page: listInfo.page,
    pageSize: listInfo.pageSize,
    beginTime: listInfo.beginTime,
    endTime: listInfo.endTime,
    beginConsumeTime: listInfo.beginConsumeTime,
    endConsumeTime: listInfo.endConsumeTime
  };
  deleteEmptyAttr(userInfo);
  return fetch({
    url: '/user/list',
    method: 'post',
    data: userInfo,
    params: pageInfo
  });
}

export function getUserInfo(userInfo) {
  return fetch({
    url: '/user/viewuserinfo',
    method: 'post',
    params: userInfo
  });
}

export function editUserInfo(userInfo) {
  return fetch({
    url: '/user/changeuserinfo',
    method: 'post',
    params: userInfo
  });
}

export function changeUserState(userInfo) {
  return fetch({
    url: '/user/changeuserstate',
    method: 'post',
    params: userInfo
  });
}
