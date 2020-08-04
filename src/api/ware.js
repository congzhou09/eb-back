import fetch from 'utils/fetch';

export function addCategory(categoryInfo) {
  return fetch({
    url: '/categray/add',
    method: 'post',
    data: categoryInfo
  });
}

export function editCategory(categoryInfo) {
  return fetch({
    url: '/categray/update',
    method: 'post',
    data: categoryInfo
  });
}

export function deleteCategory(categoryInfo) {
  return fetch({
    url: '/categray/delete',
    method: 'post',
    params: categoryInfo
  });
}

export function changeCategorySort(sortInfo) {
  return fetch({
    url: '/categray/changesort',
    method: 'post',
    params: sortInfo
  });
}

export function getCategoryList() {
  return fetch({
    url: '/categray/list',
    method: 'post'
  });
}

export function addWare(wareInfo) {
  return fetch({
    url: '/product/add',
    method: 'post',
    data: wareInfo
  });
}

export function editWare(wareInfo) {
  return fetch({
    url: '/product/update',
    method: 'post',
    data: wareInfo
  });
}

export function changeWareState(wareInfo) {
  return fetch({
    url: '/product/changestate',
    method: 'post',
    params: wareInfo
  });
}

export function getWareList(listInfo) {
  return fetch({
    url: '/product/unlogin/list',
    method: 'post',
    params: listInfo
  });
}

export function getWareInfo(getInfo) {
  return fetch({
    url: '/product/unlogin/productinfo',
    method: 'post',
    params: getInfo
  });
}

// 优惠券信息
export function getCouponsList() {
  return fetch({
    url: '/product/get_valid_product_coupon',
    method: 'get'
  });
}
