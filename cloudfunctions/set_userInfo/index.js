// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
})

//  引入数据库
const db = cloud.database()
const _ = db.command
// 云函数入口函数
exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext()
  try {
    return await db.collection('user').where({
      openid: wxContext.OPENID,
    }).update({
      data: event
    })
  } catch (e) {
    console.err(`没有查询到改用户,快去新增!!`)
  }
}
