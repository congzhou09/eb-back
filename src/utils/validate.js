/* 是否是公司邮箱*/
export function validateEmail(str) {
  const reg = /^[a-z0-9](?:[-_.+]?[a-z0-9]+)*@[a-z0-9](?:[-_.+]?[a-z0-9]+)*\.(com|com.cn|cn|net)$/i;
  return reg.test(str.trim());
}

/* 合法uri*/
export function validateURL(textval) {
  const urlregex = /^(https?|ftp):\/\/([a-zA-Z0-9.-]+(:[a-zA-Z0-9.&%$-]+)*@)*((25[0-5]|2[0-4][0-9]|1[0-9]{2}|[1-9][0-9]?)(\.(25[0-5]|2[0-4][0-9]|1[0-9]{2}|[1-9]?[0-9])){3}|([a-zA-Z0-9-]+\.)*[a-zA-Z0-9-]+\.(com|edu|gov|int|mil|net|org|biz|arpa|info|name|pro|aero|coop|museum|[a-zA-Z]{2}))(:[0-9]+)*(\/($|[a-zA-Z0-9.,?'\\+&%$#=~_-]+))*$/;
  return urlregex.test(textval);
}

/* 小写字母*/
export function validateLowerCase(str) {
  const reg = /^[a-z]+$/;
  return reg.test(str);
}

/* ID*/
export function validatorID(rule, value, callback) {
  if (typeof value === 'string' && value.match(/[\u4e00-\u9fa5]/)) {
    callback(new Error('不可以包含中文'));
  } else {
    callback();
  }
}
/* 手机号*/
export function validatorTelephone(rule, value, callback) {
  if (value.match(/[\u4e00-\u9fa5]/)) {
    callback(new Error('不可以包含中文'));
  } else if (value.length > 0) {
    const reg = /^1\d{10}$/;
    if (!reg.test(value)) {
      callback(new Error('请输入正确的手机号'));
    } else {
      callback();
    }
  } else {
    callback();
  }
}

/* 大写字母*/
export function validateUpperCase(str) {
  const reg = /^[A-Z]+$/;
  return reg.test(str);
}

/* 大小写字母*/
export function validatAlphabets(str) {
  const reg = /^[A-Za-z]+$/;
  return reg.test(str);
}

export function nonblankValidator(str) {
  return str.length > 0;
}
