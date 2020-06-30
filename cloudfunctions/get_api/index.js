const cloud = require('wx-server-sdk')
const axios = require('axios');
const qs = require('qs')

cloud.init()

// 云函数入口函数
exports.main = async (event, context) => {
  const api = event.api;
  const url = 'http://106.12.152.73:8090/api/me/';
  let data = {};
  switch (api) {
    //  获取token
    case 'login':
      data = (await axios.post(url + api, event)).data
      break;
    //  获取用户信息
    case 'userInfo':
      data = (await axios.get(url + api, {headers: {token: event.token}})).data
      break;
    //  添加好友
    case 'post_friends':
      data = (await axios({
        method: 'post',
        url: url + api.split('_')[1],
        data: qs.stringify({
          userId: event.userId,
          toUserId: event.toUserId
        }),
        headers: {token: event.token}
      })).data
      break;
    //  获取好友列表
    case 'friends':
      data = (await axios.get(url + api, {headers: {token: event.token}})).data
      break;
    //  获取好友记录
    case 'toFriends':
      data = (await axios.get(url + api, {
        params: {
          page: event.page,
          toUserId: event.toUserId
        },
        headers: {token: event.token},
      })).data
      break;
    //  添加账单
    case 'put_userBill':
      data = (await axios.put(url + api.split('_')[1], {
        detailsMsg: event.detailsMsg,
        number: event.number,
        toUserIds: event.toUserIds,
      },{headers: {token: event.token}})).data
      break;
    //  查询自己的账单
    case 'userBill':
      data = (await axios.get(url + api, {headers: {token: event.token}})).data
      break;
  }
  return data
}
