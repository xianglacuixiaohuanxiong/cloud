// 云函数入口文件
const cloud = require('wx-server-sdk')
const axios = require('axios')


cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
})

const db = cloud.database().collection('user')

// 云函数入口函数
exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext()
  context.login({
    success: res => {
      context.getUserInfo({
        success: user => {
          const params = {
            code: res.code,
            rawData: user.rawData,
            signature: user.signature,
            iv: user.iv,
            encryptedData: user.encryptedData
          }
          axios.post('http://106.12.152.73:8090/api/me/login', params).then(res => {
            console.log(res)
            return res
          })
        }
      })
    }
  })

  // try {
  //   return await db.where({
  //     openid: wxContext.OPENID
  //   }).get()
  // } catch (e) {
  //   return e
  // }
}