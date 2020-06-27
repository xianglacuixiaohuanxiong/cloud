// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
})

//  引入数据库
const db = cloud.database().collection('user')
const _ = db.command
// 云函数入口函数
exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext()
  const status = await db.where({
    openid: wxContext.OPENID,
  }).get()
  if (status.data.length) {
    //  更新数据
    try {
      db.doc(status.data[0]._id).set({
        data: event
      })
      return await db.where({
        openid: wxContext.OPENID,
      }).get()
    } catch (e) {
      console.log(e)
    }
  } else {
    //  新增数据
    try {
      db.add({
        data: event
      })
      return await db.where({
        openid: wxContext.OPENID,
      }).get()
    } catch (e) {
      console.log(e)
    }
  }
}
