//index.js
const app = getApp()
import api from '../../api/index'
Page({
  data: {
    avatarUrl: './user-unlogin.png',
    userInfo: {},
    logged: false,
    takeSession: false,
    requestResult: ''
  },

  onLoad: function() {
    if (!wx.cloud) {
      wx.redirectTo({
        url: '../chooseLib/chooseLib',
      })
      return
    }

    // 获取用户信息
    wx.getSetting({
      success: res => {
        if (res.authSetting['scope.userInfo']) {
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
          wx.getUserInfo({
            success: res => {
              this.setData({
                avatarUrl: res.userInfo.avatarUrl,
                userInfo: res.userInfo
              })
            }
          })
        }
      }
    })
  },
  //  获取用户id
  getUserId() {
    return new Promise((resolve, reject) => {
      wx.cloud.callFunction({
        name: 'login',
        data: {},
        success: res => {
          app.globalData.openid = res.result.openid;
          resolve(res.result.openid)
        },
        fail: err => {
          reject(`调用失败`)
          console.error('[云函数] [login] 调用失败', err)
        }
      })
    })
  },
  //  获取用户信息
  async getUserInfo(e) {
    if (!this.data.logged && e.detail.userInfo) {
      const res = await api.login();
      let userInfo = e.detail.userInfo;
      userInfo.openid = res.openid;
      const data = await api.setUserInfo(userInfo);
      console.log(data)
      // this.getUserId().then(res => {
      //   console.log(res)
      //   console.log(e.detail.userInfo)
      //   let userInfo = e.detail.userInfo;
      //   userInfo.openid = res;
      //   console.log(userInfo)
      //   wx.cloud.callFunction({
      //     name: 'set_userInfo',
      //     data: userInfo,
      //     success: result => {
      //       console.log(result)
      //     }
      //   })
      // })
      this.setData({
        logged: true,
        avatarUrl: e.detail.userInfo.avatarUrl,
        userInfo: e.detail.userInfo
      })
    }
  },
  onGetUserInfo: function(e) {
    if (!this.data.logged && e.detail.userInfo) {
      this.setData({
        logged: true,
        avatarUrl: e.detail.userInfo.avatarUrl,
        userInfo: e.detail.userInfo
      })
    }
  },

  onGetOpenid: function() {
    // 调用云函数
    api.login().then(res => {
      app.globalData.openid = res.openid;
      wx.navigateTo({
        url: '../userConsole/userConsole',
      })
    }).catch(err => {
      console.error('[云函数] [login] 调用失败', err)
      wx.navigateTo({
        url: '../deployFunctions/deployFunctions',
      })
    })
  },

  // 上传图片
  doUpload: function () {
    // 选择图片
    wx.chooseImage({
      count: 1,
      sizeType: ['compressed'],
      sourceType: ['album', 'camera'],
      success: function (res) {

        wx.showLoading({
          title: '上传中',
        })

        const filePath = res.tempFilePaths[0]

        // 上传图片
        const cloudPath = 'my-image' + filePath.match(/\.[^.]+?$/)[0]
        wx.cloud.uploadFile({
          cloudPath,
          filePath,
          success: res => {
            console.log('[上传文件] 成功：', res)

            app.globalData.fileID = res.fileID
            app.globalData.cloudPath = cloudPath
            app.globalData.imagePath = filePath

            wx.navigateTo({
              url: '../storageConsole/storageConsole'
            })
          },
          fail: e => {
            console.error('[上传文件] 失败：', e)
            wx.showToast({
              icon: 'none',
              title: '上传失败',
            })
          },
          complete: () => {
            wx.hideLoading()
          }
        })

      },
      fail: e => {
        console.error(e)
      }
    })
  },

})
