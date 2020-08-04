import fetch from 'utils/fetch';
import { deleteEmptyAttr } from '../utils/appCommon';

export function getOrderInfo(getInfo) {
  return fetch({
    url: '/order/query',
    method: 'post',
    data: getInfo
  });
}

export function getOrderList(listInfo) {
  const pageInfo = { page: listInfo.page, size: listInfo.size };
  const orderInfo = listInfo.order;
  return fetch({
    url: '/order/query',
    method: 'post',
    params: pageInfo,
    data: orderInfo
  });
}

export function express(expressInfo) {
  return fetch({
    url: '/order/express',
    method: 'post',
    data: expressInfo
  });
}

export function addExpress(expressInfo) {
  return fetch({
    url: '/order/addexpress',
    method: 'post',
    data: expressInfo
  });
}

export function updateExpress(expressInfo) {
  return fetch({
    url: '/order/updateexpress',
    method: 'post',
    data: expressInfo
  });
}

export function informShip(orderInfo) {
  return fetch({
    url: '/order/prepareship',
    method: 'post',
    params: orderInfo
  });
}

export function cancelOrder(orderInfo) {
  return fetch({
    url: '/order/cancel',
    method: 'post',
    params: orderInfo
  });
}

export function closeOrder(orderInfo) {
  return fetch({
    url: '/order/close',
    method: 'post',
    params: orderInfo
  });
}

export function serviceRemark(remarkInfo) {
  deleteEmptyAttr(remarkInfo);
  return fetch({
    url: '/order/serviceremark',
    method: 'post',
    params: remarkInfo
  });
}
