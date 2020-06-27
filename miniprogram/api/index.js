import { axios } from '../utils/request'
//  登录
function login () {
  return axios('login', {});
}

//  存储用户信息
function setUserInfo(params) {
  return axios('set_userInfo', params);
}

//  获取用户信息
function getUserInfo() {
  return axios('get_userInfo');
}

//  添加好友
function addPartner(params) {
  return axios('add_partner', params);
}

//  查询好友列表
function queryPartnerList() {
  return axios('partner_list');
}

//  新增账单
function addBill(params) {
  return axios('add_bill', params);
}

//  查询账单
function queryBill(params) {
  return axios('query_bill', params);
}
export default {
  login,
  setUserInfo,
  getUserInfo,
  addPartner,
  queryPartnerList,
  addBill,
  queryBill
}
