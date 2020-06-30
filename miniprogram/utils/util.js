const app = getApp()
import api from '../api/index'
import {getStorage, Toast} from './wx';
//  是否授权
export function auth() {
  return new Promise((resolve, reject) => {
    wx.getSetting({
      success: res => {
        if (res.authSetting['scope.userInfo']) {
          api.getUserInfo().then(res => {
            app.globalData.userInfo = res.data[0];
            resolve(res.data[0])
          }).catch(err => {
            reject(err)
          })
        } else {
          reject(false)
        }
      }
    })
  })
}
//  添加好友
export function addPartner() {
  const params = {
    userId: app.globalData.userInfo.id,
    toUserId: app.globalData.friendsId,
    token: getStorage('xxhToken'),
    api: 'post_friends'
  }
  api.allApi(params).then(res => {
    Toast(res.msg)
  })
}
