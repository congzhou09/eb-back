import fetch from 'utils/fetch';
import { deleteEmptyAttr } from '../utils/appCommon';
// params是将参数放到payload中
// data是放到body中
export function addCategory(categoryInfo) {
  return fetch({
    url: '/gold_category/admin/create_category',
    method: 'post',
    // params:categoryInfo
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8'
    },
    data: categoryInfo
  });
}

export function editCategory(categoryInfo) {
  return fetch({
    url: '/gold_category/admin/update_category',
    method: 'post',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8'
    },
    data: categoryInfo
  });
}

export function deleteCategory(categoryInfo) {
  return fetch({
    url: '/gold_category/admin/remove_category',
    method: 'post',
    params: categoryInfo
  });
}

export function changeCategorySort(sortInfo) {
  return fetch({
    url: '/gold_category/admin/switch_sort',
    method: 'post',
    params: sortInfo
  });
}

export function getCategoryList(categoryList) {
  return fetch({
    url: '/gold_category/admin/get_category_list',
    method: 'get',
    params: categoryList
  });
}

export function addMall(mallInfo) {
  return fetch({
    url: '/gold_product/admin/create_product',
    method: 'post',
    data: mallInfo
  });
}

export function editMall(mallInfo) {
  return fetch({
    url: '/gold_product/admin/edit_product',
    method: 'post',
    data: mallInfo
  });
}

export function changeMallState(mallInfo) {
  return fetch({
    url: '/gold_product/admin/update_product_state',
    method: 'post',
    params: mallInfo
  });
}

export function getMallList(listInfo) {
  return fetch({
    url: '/gold_product/admin/get_product_list',
    method: 'get',
    params: listInfo
  });
}

export function getMallInfo(getInfo) {
  return fetch({
    url: '/gold_product/admin/get_product',
    method: 'get',
    params: getInfo
  });
}

export function getSpecialList() {
  return fetch({
    url: '/gold_channel/admin/get_channel_list',
    method: 'get'
  });
}

export function addSpecial(specialInfo) {
  return fetch({
    url: '/gold_channel/admin/create_channel',
    method: 'post',
    headers: {
      'Content-Type': 'application/json;charset=utf-8'
    },
    data: specialInfo
  });
}

export function editSpecial(specialInfo) {
  return fetch({
    url: '/gold_channel/admin/update_channel',
    method: 'post',
    headers: {
      'Content-Type': 'application/json;charset=utf-8'
    },
    data: specialInfo
  });
}

export function getSubProductList(specialInfo) {
  return fetch({
    url: '/gold_channel/admin/get_channel_products',
    method: 'get',
    params: specialInfo
  });
}

export function deleteSpecial(specialInfo) {
  return fetch({
    url: '/gold_channel/admin/remove_channel',
    method: 'post',
    params: specialInfo
  });
}
export function changeSpecialSort(sortInfo) {
  return fetch({
    url: '/gold_channel/admin/switch_sort',
    method: 'post',
    params: sortInfo
  });
}

/* 兑换记录*/

export function getLogList(logList) {
  return fetch({
    url: '/gold_log/admin/get_exchange_record',
    method: 'get',
    params: logList
  });
}

/* 订单*/

export function getOrderList(listInfo) {
  return fetch({
    url: '/gold_order/admin/get_order_list',
    method: 'get',
    params: listInfo
  });
}

export function getOrderInfo(getInfo) {
  return fetch({
    url: '/gold_order/admin/get_order_detail',
    method: 'get',
    params: getInfo
  });
}

export function serviceRemark(remarkInfo) {
  deleteEmptyAttr(remarkInfo);
  return fetch({
    url: '/gold_order/admin/fill_service_remark',
    method: 'post',
    params: remarkInfo
  });
}

export function cancelOrder(orderInfo) {
  return fetch({
    url: '/gold_order/admin/cancel_order',
    method: 'post',
    params: orderInfo
  });
}

export function closeOrder(orderInfo) {
  return fetch({
    url: '/gold_order/admin/close_order',
    method: 'post',
    params: orderInfo
  });
}

export function informShip(orderInfo) {
  return fetch({
    url: '/gold_order/admin/inform_send',
    method: 'post',
    params: orderInfo
  });
}

export function express(expressInfo) {
  return fetch({
    url: '/gold_order/admin/fill_express',
    method: 'post',
    params: expressInfo
  });
}

export function updateExpress(expressInfo) {
  return fetch({
    url: '/gold_order/admin/update_express',
    method: 'post',
    params: expressInfo
  });
}

// 充值卡
export function productInfo() {
  return fetch({
    url: '/recharge_card/admin/get_card_product',
    method: 'get'
  });
}

export function addCard(cardInfo) {
  return fetch({
    url: '/recharge_card/admin/create_recharge_card',
    method: 'post',
    params: cardInfo
  });
}

export function checkCard(cardInfo) {
  return fetch({
    url: '/recharge_card/admin/get_recharge_card',
    method: 'get',
    params: cardInfo
  });
}

export function editCard(cardInfo) {
  return fetch({
    url: '/recharge_card/admin/update_recharge_card',
    method: 'post',
    params: cardInfo
  });
}

export function getCardList(cardList) {
  return fetch({
    url: '/recharge_card/admin/get_card_list',
    method: 'get',
    params: cardList
  });
}

export function deleteCard(deleteInfo) {
  return fetch({
    url: '/recharge_card/admin/delete_recharge_card',
    method: 'post',
    params: deleteInfo
  });
}
