import fetch from 'utils/fetch';

export function addGame(gameInfo) {
  return fetch({
    url: '/game/add',
    method: 'post',
    params: gameInfo
  });
}

export function editGame(gameInfo) {
  return fetch({
    url: '/game/updategame',
    method: 'post',
    data: gameInfo
  });
}

export function getGameList() {
  return fetch({
    url: '/game/list',
    method: 'post'
  });
}

export function getIconList() {
  return fetch({
    url: '/game/farmicon_list',
    method: 'post'
  });
}

export function getfarmicon(getfarmiconInfo) {
  return fetch({
    url: '/game/farmicon',
    method: 'post',
    params: getfarmiconInfo
  });
}
export function changeGameSort(sortInfo) {
  return fetch({
    url: '/game/changesort',
    method: 'post',
    params: sortInfo
  });
}

export function addUserGroup(userGroupInfo) {
  return fetch({
    url: '/game/addusergroup',
    method: 'post',
    data: userGroupInfo
  });
}

export function editUserGroup(userGroupInfo) {
  return fetch({
    url: '/game/updateusergroup',
    method: 'post',
    data: userGroupInfo
  });
}

export function changeUserGroupeSort(sortInfo) {
  return fetch({
    url: '/game/changusergroupesort',
    method: 'post',
    params: sortInfo
  });
}

export function updateGroupEffect(groupEffect) {
  return fetch({
    url: '/game/update_group_effect',
    method: 'post',
    params: groupEffect
  });
}

export function deleteGroup(groupInfo) {
  return fetch({
    url: '/game/deleteusergroup',
    method: 'post',
    params: groupInfo
  });
}

export function getGroudUserInfo(groupInfos) {
  return fetch({
    url: '/game/queryusergroup',
    method: 'post',
    params: groupInfos
  });
}

export function getUserGroup() {
  return fetch({
    url: '/game/get_user_group',
    method: 'get'
  });
}

export function getresult(nameInfo) {
  return fetch({
    url: '/game/result',
    method: 'post',
    params: nameInfo
  });
}

export function addPair(pairInfo) {
  return fetch({
    url: '/game/addpromotion',
    method: 'post',
    data: pairInfo
  });
}

export function editPair(pairInfo) {
  return fetch({
    url: '/game/updatepromotion',
    method: 'post',
    data: pairInfo
  });
}

export function getPairList(listInfo) {
  return fetch({
    url: '/game/plist',
    method: 'post',
    params: listInfo
  });
}

export function getPairBaseInfo(pairInfo) {
  return fetch({
    url: '/game/get',
    method: 'post',
    params: pairInfo
  });
}

export function changePairState(pairInfo) {
  return fetch({
    url: '/game/delete',
    method: 'post',
    params: pairInfo
  });
}

export function getUpgradeWareList(listInfo) {
  return fetch({
    url: '/game/uplist',
    method: 'post',
    params: listInfo
  });
}

export function updateFarmicon(iconInfo) {
  return fetch({
    url: '/game/update_farmicon',
    method: 'post',
    headers: {
      'Content-Type': 'application/json;charset=utf-8'
    },
    data: iconInfo
  });
}

// 十选一
// 获取奖池相关数据
export function getjackpotList(getjackpot) {
  return fetch({
    url: '/game/jackpotlist',
    method: 'post',
    params: getjackpot
  });
}

// 添加奖池相关数据
export function addjackpotInfo(addjackpot) {
  return fetch({
    url: '/game/add_jackpot',
    method: 'post',
    data: addjackpot
  });
}

// 修改奖池相关数据
export function updatajackpotInfo(updatajackpot) {
  return fetch({
    url: '/game/update_jackpot',
    method: 'post',
    params: updatajackpot
  });
}

// 获取公式相关数据
export function getformulaList(getformula) {
  return fetch({
    url: '/game/formulalist',
    method: 'post',
    params: getformula
  });
}

export function getformula(getformulaID) {
  return fetch({
    url: '/game/formula',
    method: 'post',
    params: getformulaID
  });
}

export function deleteFormula(formularInfo) {
  return fetch({
    url: '/game/delete_formula',
    method: 'post',
    params: formularInfo
  });
}

export function addformulaInfo(addformula) {
  return fetch({
    url: '/game/add_formula',
    method: 'post',
    data: addformula
  });
}

export function editFormulas(editformula) {
  return fetch({
    url: '/game/update_formula',
    method: 'post',
    data: editformula
  });
}
