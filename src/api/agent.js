import fetch from 'utils/fetch';
import { deleteEmptyAttr } from '../utils/appCommon';

export function getAgentList(listInfo) {
  deleteEmptyAttr(listInfo);
  return fetch({
    url: '/proxy/admin/get_proxy_list',
    method: 'get',
    params: listInfo
  });
}
export function getAgentDetail(queryInfo) {
  return fetch({
    url: '/proxy/admin/get_proxy_detail',
    method: 'get',
    params: queryInfo
  });
}
export function addAgent(agentInfo) {
  return fetch({
    url: '/proxy/admin/create_new_proxy',
    method: 'post',
    params: agentInfo
  });
}
export function editAgent(agentInfo) {
  return fetch({
    url: '/proxy/admin/edit_proxy',
    method: 'post',
    params: agentInfo
  });
}
export function letAgentInvalid(agentInfo) {
  return fetch({
    url: '/proxy/admin/cancel_proxy',
    method: 'post',
    params: agentInfo
  });
}
export function letAgentValid(agentInfo) {
  return fetch({
    url: '/proxy/admin/recovery_proxy',
    method: 'post',
    params: agentInfo
  });
}
export function getBindUser(queryInfo) {
  deleteEmptyAttr(queryInfo);
  return fetch({
    url: '/proxy/admin/get_bind_user',
    method: 'get',
    params: queryInfo
  });
}
export function getSuperior(queryInfo) {
  return fetch({
    url: '/proxy/admin/get_higher_proxy',
    method: 'get',
    params: queryInfo
  });
}
export function getInferiorAgent(queryInfo) {
  deleteEmptyAttr(queryInfo);
  return fetch({
    url: '/proxy/admin/get_lower_proxy',
    method: 'get',
    params: queryInfo
  });
}
export function getBiinferiorAgent(queryInfo) {
  deleteEmptyAttr(queryInfo);
  return fetch({
    url: '/proxy/admin/get_lower_lower_proxy',
    method: 'get',
    params: queryInfo
  });
}
export function getIncomeDetail(queryInfo) {
  deleteEmptyAttr(queryInfo);
  return fetch({
    url: '/proxy/admin/get_profit_detail',
    method: 'get',
    params: queryInfo
  });
}
export function getModeInfo() {
  return fetch({
    url: '/proxy/admin/select_proxy_note',
    method: 'get'
  });
}
export function updateInferiorRate(rateInfo) {
  return fetch({
    url: '/proxy/admin/update_layer_percent',
    method: 'post',
    params: rateInfo
  });
}
export function getWithdrawList(queryInfo) {
  deleteEmptyAttr(queryInfo);
  return fetch({
    url: '/proxy/admin/get_withdraw_record',
    method: 'get',
    params: queryInfo
  });
}
export function getWithdrawDetail(queryInfo) {
  return fetch({
    url: '/proxy/admin/get_withdraw_detail',
    method: 'get',
    params: queryInfo
  });
}
export function changeWithdrawState(stateInfo) {
  return fetch({
    url: '/proxy/admin/update_withdraw_record_status',
    method: 'post',
    params: stateInfo
  });
}
