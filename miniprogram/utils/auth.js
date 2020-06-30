let app;
import api from '../api/index';
import { Toast,setStorage, getStorage, removeStorage } from "./wx";
//  自动登录 -> 根据状态判断
export function getAuth () {
  return new Promise((resolve, reject) => {
    //  登录是否失效
    wx.checkSession({
      success: _ => {
        //  没失效
        wx.getSetting({
          success: res => {
            //  且授权有效
            if (res.authSetting['scope.userInfo']) {
              // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
              //  使用token获取用户信息
              //  判断是否有token
              const token = getStorage('xxhToken');
              if (token) {
                tokenUser()
                  .then(user => {
                    resolve(user.data);
                  })
                  .catch(err => {
                    if (err.code === -10002) {
                      removeStorage('xxhToken');
                      getAuth();
                    } else {
                      Toast(`咦,没找到服务器呢~`)
                      reject(err)
                    }
                  })
              } else {
                wx.getUserInfo({
                  success: res => {
                    getUser(res, true)
                      .then(user => {
                        //  使用token换取用户信息
                        resolve(user)
                      })
                      .catch(err => {
                        reject(err)
                      })
                  },
                  fail: err => {
                    reject(err)
                  }
                })
              }
            } else {
              //  没有授权则清除token
              removeStorage('xxhToken');
              reject(false)
            }
          }
        })
      },
      fail: _ => {
        //  失效
        wx.getSetting({
          success: res => {
            //  且授权有效
            if (res.authSetting['scope.userInfo']) {
              //  换取token
              wx.getUserInfo({
                success: res => {
                  getUser(res, true)
                    .then(user => {
                      //  使用token换取用户信息
                      resolve(user)
                    })
                    .catch(err => {
                      reject(err)
                    })
                },
                fail: err => {
                  reject(err)
                }
              })
            } else {
              //  没有授权则清除token
              removeStorage('xxhToken');
              reject(false)
            }
          }
        })
      }
    })
  })
}
//  授权获取token
export function getUser (e, isGetUser) {
  return new Promise((resolve, reject) => {
    wx.login({
      success: res => {
        if (res.code) {
          const params = {
            api: 'login',
            code: res.code,
            rawData: isGetUser ? e.rawData : e.detail.rawData,
            signature: isGetUser ? e.signature : e.detail.signature,
            iv: isGetUser ? e.iv : e.detail.iv,
            encryptedData: isGetUser ? e.encryptedData : e.detail.encryptedData
          };
          api.allApi(params)
            .then(token => {
              setStorage('xxhToken', token.data);
              tokenUser()
                .then(user => {
                  resolve(user.data)
                })
            })
            .catch(err => {
              if (err.code === 220) {
                getUser(e, isGetUser)
              }
              reject(err)
            })
        } else {
          Toast(`登录失败${res.errMsg}`)
        }
      }
    })
  })
}
//  token换取用户信息
function tokenUser () {
  return new Promise((resolve, reject) => {
    api.allApi({ api: 'userInfo', token: getStorage('xxhToken') })
      .then(res => {
        resolve(res)
      })
      .catch(err => {
        reject(err)
      })
  })
}
export function setApp (_app) {
  app = _app;
}
