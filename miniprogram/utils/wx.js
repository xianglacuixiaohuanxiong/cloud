//  轻提示
export function Toast (title, icon = 'none', duration = 2000) {
  wx.showToast({title, icon, duration})
}

//  确定弹窗
export function Modal (title, content) {
  return new Promise((resolve, reject) => {
    wx.showModal({
      title,
      content,
      success (res) {
        if (res.confirm) {
          resolve();
        } else if (res.cancel) {
          reject();
        }
      }
    })
  })
}

//  loading - show
export function showLoading (title, mask = false) {
  wx.showLoading({ title, mask })
}

//  前往页面
export function routerPush (url) {
  wx.navigateTo({ url })
}

//  不留当前记录
export function routerRenew (url) {
  wx.redirectTo({ url })
}

//  返回页面
export function routerBack (params) {
  if (typeof params === "number") {
    wx.navigateBack({ delta: params })
  } else {
    wx.navigateBack({ url: params })
  }
}

//  返回tabbar页面
export function routerTabBar(url) {
  wx.switchTab({ url })
}

//  更新数据
export function setData (option, callback) {
  this.setData(option, callback)
}

//  本地存储 -> 放入
export function setStorage (key, val) {
  wx.setStorageSync(key, val)
}

//  本地存储 -> 取出
export function getStorage (key) {
  const val = wx.getStorageSync(key);
  return val
}

//  本地存储 -> 清除
export function removeStorage (key) {
  wx.removeStorageSync(key);
}