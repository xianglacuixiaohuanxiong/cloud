import { axios } from '../utils/request'
//  登录
function login () {
  return axios('login', {});
}

//  存储用户信息
function setUserInfo (params) {
  return axios('set_userInfo', params);
}
export default {
  login,
  setUserInfo
}
