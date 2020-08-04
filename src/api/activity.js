import fetch from 'utils/fetch';
import { deleteEmptyAttr } from 'utils/appCommon';

export function addBanner(bannerInfo) {
  return fetch({
    url: '/banner/add',
    method: 'post',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8'
    },
    data: bannerInfo
    // params: bannerInfo
  });
}

export function editBanner(bannerInfo) {
  return fetch({
    url: '/banner/update',
    method: 'post',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8'
    },
    data: bannerInfo
  });
}

export function deleteBanner(bannerInfo) {
  return fetch({
    url: '/banner/delete',
    method: 'post',
    params: bannerInfo
  });
}

export function changeBannerSort(sortInfo) {
  return fetch({
    url: '/banner/changesort',
    method: 'post',
    params: sortInfo
  });
}

export function getBannerList() {
  return fetch({
    url: '/banner/list',
    method: 'post'
  });
}

export function addSubject(subjectInfo) {
  return fetch({
    url: '/channel/add',
    method: 'post',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8'
    },
    data: subjectInfo
  });
}

export function getSubjectList() {
  return fetch({
    url: '/channel/list',
    method: 'post'
  });
}

export function editSubject(subjectInfo) {
  return fetch({
    url: '/channel/update',
    method: 'post',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8'
    },
    data: subjectInfo
  });
}

export function getSubProductList(subjectInfo) {
  return fetch({
    url: '/channel/productlist',
    method: 'post',
    params: subjectInfo
  });
}

export function changeSubjectSort(sortInfo) {
  return fetch({
    url: '/channel/sort',
    method: 'post',
    params: sortInfo
  });
}

export function deleteSubject(subjectInfo) {
  return fetch({
    url: '/channel/delete',
    method: 'post',
    params: subjectInfo
  });
}

export function addVoucher(voucherInfo) {
  return fetch({
    url: '/coupon/admin/createcoupon',
    method: 'post',
    params: voucherInfo
  });
}

export function editVoucher(voucherInfo) {
  return fetch({
    url: '/coupon/admin/updatecoupon',
    method: 'post',
    params: voucherInfo
  });
}

export function sendVoucherToUser(voucherInfo) {
  return fetch({
    url: '/coupon/admin/sendcoupon',
    method: 'post',
    params: voucherInfo
  });
}

export function getVoucherList(listInfo) {
  return fetch({
    url: '/coupon/admin/couponlist',
    method: 'get',
    params: listInfo
  });
}

export function letVoucherInvalid(voucherInfo) {
  return fetch({
    url: '/coupon/admin/ivalidcoupon',
    method: 'post',
    params: voucherInfo
  });
}

export function getVoucherDetail(voucherInfo) {
  return fetch({
    url: '/coupon/admin/coupon',
    method: 'get',
    params: voucherInfo
  });
}

export function getVoucherUserList(voucherInfo) {
  deleteEmptyAttr(voucherInfo);
  return fetch({
    url: '/coupon/admin/coupon_send_record',
    method: 'get',
    params: voucherInfo
  });
}
