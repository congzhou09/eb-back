import fetch from 'utils/fetch';
import { deleteEmptyAttr } from '../utils/appCommon';

export function getMoneyList(listInfo) {
  deleteEmptyAttr(listInfo);
  return fetch({
    url: '/account/list',
    method: 'post',
    params: listInfo
  });
}

export function getWithdrawList(listInfo) {
  deleteEmptyAttr(listInfo);
  return fetch({
    url: '/account/applylist',
    method: 'post',
    params: listInfo
  });
}

export function changeWithdrawState(widthdrawInfo) {
  return fetch({
    url: '/account/state',
    method: 'post',
    params: widthdrawInfo
  });
}

export function manualChangeMoney(changeInfo) {
  return fetch({
    url: '/account/changeuseraccount',
    method: 'post',
    params: changeInfo
  });
}

export function getWithDrawInfo(changeInfo) {
  return fetch({
    url: '/account/info',
    method: 'post',
    params: changeInfo
  });
}
