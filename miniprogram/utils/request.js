export function axios (name, data) {
  return new Promise((resolve, reject) => {
    wx.cloud.callFunction({
      name,
      data,
      success: res => {
        resolve(res.result)
      },
      fail: err => {
        reject(err)
      }
    })
  })
}
