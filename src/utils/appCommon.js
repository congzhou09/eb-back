// 管理员类型
export const adminRoleRelateObj = {
  1: '超级管理员',
  2: '商品管理员',
  3: '财务管理员',
  4: '普通管理员',
  5: '推广管理员'
};

export function convertToAdminRoleLabel(value) {
  for (const key in adminRoleRelateObj) {
    if (parseInt(key) === parseInt(value)) {
      return adminRoleRelateObj[key];
    }
  }
  return '未知类型';
}

// 用户状态
export const userStateList = [
  { label: '正常', value: 0 },
  { label: '封号', value: 1 },
  { label: '删除', value: 2 }
];

// 订单状态
export const orderStateList = [
  { label: '已确认', value: 'confirmed' },
  { label: '未确认', value: 'unconfirmed' },
  { label: '待支付', value: 'topay' },
  { label: '已支付', value: 'payed' },
  { label: '未支付', value: 'unpayed' },
  { label: '待退款', value: 'torepay' },
  { label: '已退款', value: 'repayed' },
  { label: '未退款', value: 'unrepayed' },
  { label: '待发货', value: 'toship' },
  { label: '已发货', value: 'shipped' },
  { label: '未发货', value: 'unshipped' },
  { label: '待收货', value: 'torecieve' },
  { label: '已收货', value: 'received' },
  { label: '已取消', value: 'canceled' },
  { label: '已关闭', value: 'closed' },
  { label: '已拆分', value: 'splited' },
  { label: '待奖励', value: 'toreward' },
  { label: '已奖励', value: 'rewarded' },
  { label: '未奖励', value: 'unrewarded' },
  { label: '待升值', value: 'torevalue' },
  { label: '已升值', value: 'revalued' },
  { label: '未升值', value: 'unrevalued' },
  { label: '已兑换', value: 'exchange' },
  { label: '待提货', value: 'waitpick' },
  { label: '已提货', value: 'pick' }
];

export function convertToOrderStateLabel(value) {
  for (let i = 0; i < orderStateList.length; i++) {
    if (orderStateList[i].value === value) {
      return orderStateList[i].label;
    }
  }
  return '未知状态';
}

// 金币商城订单状态
/*
export const orderStateLists = [
    {label: '已确认', value: 1},//confirmed,unshipped
    {label: '待发货', value: 2},//toship
    {label: '已发货', value: 3},//shipped
    {label: '已收货', value: 4},//received
    {label: '手动取消', value: 5},//canceled
];
/!* {label: '已确认', value: 'confirmed',},// 1
                    {label: '未发货', value: 'unshipped'},// 1
                    {label: '待发货', value: 'toship'},//2
                    {label: '已发货', value: 'shipped'},// 3
                    {label: '已收货', value: 'received'},//4
                    {label: '手动取消', value: 'canceled'},//5*!/
export function convertToOrderStateLabels(value){
    for(var i=0;i<orderStateLists.length;i++){
        if(orderStateLists[i].value===value)
        {
            return orderStateLists[i].label;
        }
    }
    return '未知状态';
}
*/

// 支付类型
export const payTypeList = [
  { label: '未支付', value: 0 },
  { label: '支付宝', value: 1 },
  { label: '微信', value: 2 },
  { label: '钱包余额', value: 3 }
];

export function convertToPayTypeLabel(value) {
  for (let i = 0; i < payTypeList.length; i++) {
    if (payTypeList[i].value === value) {
      return payTypeList[i].label;
    }
  }
  return '未知类型';
}

// 优惠券类型
export const voucherTypeList = [
  { label: '新人优惠券', value: 1 },
  { label: '个人优惠券', value: 2 },
  { label: '普通优惠券', value: 3 },
  { label: '代理优惠券', value: 4 },
  { label: '商品优惠券', value: 5 }
];

export function convertToVoucherTypeLabel(value) {
  for (let i = 0; i < voucherTypeList.length; i++) {
    if (voucherTypeList[i].value === value) {
      return voucherTypeList[i].label;
    }
  }
  return '未知类型';
}

// 优惠券状态
export const voucherStateList = [
  { label: '失效', value: 0 },
  { label: '有效', value: 1 }
];

export function convertToVoucherStateLabel(value) {
  for (let i = 0; i < voucherStateList.length; i++) {
    if (voucherStateList[i].value === value) {
      return voucherStateList[i].label;
    }
  }
  return '未知状态';
}

// 优惠券使用范围
export const voucherScopeList = [
  { label: '全部商品', value: 1 },
  { label: '商城商品', value: 2 },
  { label: '促销商品', value: 3 }
];

export function convertToVoucherScopeLabel(value) {
  for (let i = 0; i < voucherScopeList.length; i++) {
    if (voucherScopeList[i].value === value) {
      return voucherScopeList[i].label;
    }
  }
  return '未知使用范围';
}

// 商品分类
export function convertToCategoryLabel(relateList, value) {
  for (let i = 0; i < relateList.length; i++) {
    if (relateList[i].id === value) {
      return relateList[i].name;
    }
  }
  return '未知分类';
}

// 金币商城商品分类
export function mallConvertToCategoryLabel(relateList, value) {
  for (let i = 0; i < relateList.length; i++) {
    if (relateList[i].categoryId === value) {
      return relateList[i].name;
    }
  }
  return '未知分类';
}

// 商品状态
export const wareStateList = [
  { label: '出售中', value: 'onsale' },
  { label: '已下架', value: 'instore' },
  { label: '已删除', value: 'invalid' }
];

export function convertToWareStateLabel(value) {
  for (let i = 0; i < wareStateList.length; i++) {
    if (wareStateList[i].value === value) {
      return wareStateList[i].label;
    }
  }
  return '未知状态';
}

// 促销商品组合状态
export const pairStateList = [
  { label: '出售中', value: 0 },
  { label: '已下架', value: 1 },
  { label: '已删除', value: 2 }
];
export function convertToPairStateLabel(value) {
  for (let i = 0; i < pairStateList.length; i++) {
    if (pairStateList[i].value === value) {
      return pairStateList[i].label;
    }
  }
  return '未知状态';
}

// 提现状态
export const withdrawStateList = [
  { label: '待审核', value: 0 },
  { label: '已审核', value: 1 },
  { label: '已完成', value: 2 },
  { label: '审核未通过', value: 3 },
  { label: '已打款', value: 4 },
  { label: '打款失败', value: 5 }
];

// 提现类型
export const withdrawTypeList = [
  { label: '银行卡', value: 1 },
  { label: '支付宝', value: 2 }
];

// 欢乐农场
export const farmModelList = [
  { label: '灾害险(100)', value: 0 },
  { label: '区域(1.8)', value: 1 },
  { label: '类型(3.5)', value: 2 },
  { label: '商品(10)', value: 3 }
];
export function convertTofarmModel(value) {
  for (let i = 0; i < farmModelList.length; i++) {
    if (farmModelList[i].value === value) {
      return farmModelList[i].label;
    }
  }
  return '未知区域';
}

// 农场坐标
export const farmCoordinate = [
  { label: '0', value: 1 },
  { label: '1', value: 2 },
  { label: '2', value: 3 },
  { label: '1,1', value: 4 },
  { label: '1,2', value: 5 },
  { label: '2,1', value: 6 },
  { label: '2,2', value: 7 },
  { label: '1,1,1', value: 8 },
  { label: '1,1,2', value: 9 },
  { label: '1,1,3', value: 10 },
  { label: '1,2,1', value: 11 },
  { label: '1,2,2', value: 12 },
  { label: '1,2,3', value: 13 },
  { label: '2,1,1', value: 14 },
  { label: '2,1,2', value: 15 },
  { label: '2,1,3', value: 16 },
  { label: '2,2,1', value: 17 },
  { label: '2,2,2', value: 18 },
  { label: '2,2,3', value: 19 }
];
export function convertTofarmCoordinat(value) {
  for (let i = 0; i < farmCoordinate.length; i++) {
    if (farmCoordinate[i].value === value) {
      return farmCoordinate[i].label;
    }
  }
  return '未知坐标';
}

// 玩法类型
export function convertToGametypeLabel(relateList, value) {
  for (let i = 0; i < relateList.length; i++) {
    if (relateList[i].id === value) {
      return relateList[i].name;
    }
  }
  return '未知玩法';
}

export function convertToWithdrawStateLabel(value) {
  for (let i = 0; i < withdrawStateList.length; i++) {
    if (withdrawStateList[i].value === value) {
      return withdrawStateList[i].label;
    }
  }
  return '未知状态';
}

export function convertToWithdrawType(value) {
  for (let i = 0; i < withdrawTypeList.length; i++) {
    if (withdrawTypeList[i].value === value) {
      return withdrawTypeList[i].label;
    }
  }
  return '未知状态';
}

// 金额显示为保留两位小数点
export function convertToMoneyAmount(value) {
  const valueNumber = parseFloat(value);
  return valueNumber.toFixed(2);
}

// 日期格式化为“2017-06-06 11:02:00”形式
export function convertToTimeString(msValue) {
  if (!msValue) {
    return '无';
  }

  const oneDate = new Date(msValue);
  return `${oneDate.getFullYear()}-${oneDate.getMonth() > 8 ? oneDate.getMonth() + 1 : '0' + (oneDate.getMonth() + 1)}-\
${oneDate.getDate() > 9 ? oneDate.getDate() : '0' + oneDate.getDate()} \
${oneDate.getHours() > 9 ? oneDate.getHours() : '0' + oneDate.getHours()}:\
${oneDate.getMinutes() > 9 ? oneDate.getMinutes() : '0' + oneDate.getMinutes()}:\
${oneDate.getSeconds() > 9 ? oneDate.getSeconds() : '0' + oneDate.getSeconds()}`;
}

// 日期格式化为“2017年06月06日 11时02分00秒”形式
export function convertToTimeData(msValue) {
  if (!msValue) {
    return '无';
  }

  const oneDate = new Date(msValue);
  return `${oneDate.getFullYear()}年${oneDate.getMonth() > 8 ? oneDate.getMonth() + 1 : '0' + (oneDate.getMonth() + 1)}月\
${oneDate.getDate() > 9 ? oneDate.getDate() : '0' + oneDate.getDate()}日\
${oneDate.getHours() > 9 ? oneDate.getHours() : '0' + oneDate.getHours()}时\
${oneDate.getMinutes() > 9 ? oneDate.getMinutes() : '0' + oneDate.getMinutes()}分\
${oneDate.getSeconds() > 9 ? oneDate.getSeconds() : '0' + oneDate.getSeconds()}秒`;
}

// 跳转前弹出未保存提示
export function hintSaveBeforeLeave(to, from, next, _this) {
  if (_this) {
    _this
      .$confirm(`将跳转到其他页面，是否继续?`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
      .then(() => {
        next(true);
      })
      .catch(() => {
        next(false);
      });
  }
}

// 删除值为空的属性
export function deleteEmptyAttr(oneObj) {
  for (const oneAttr in oneObj) {
    if (typeof oneObj[oneAttr] === 'string' && oneObj[oneAttr].length <= 0) {
      delete oneObj[oneAttr];
    }
  }
}

// 金币商城商品状态
export const mallStateList = [
  { label: '出售中', value: 'onsale' },
  { label: '已下架', value: 'instore' },
  { label: '已删除', value: 'invalid' }
];

export function convertToMallStateLabel(value) {
  for (let i = 0; i < mallStateList.length; i++) {
    if (mallStateList[i].value === value) {
      return mallStateList[i].label;
    }
  }
  return '未知状态';
}
