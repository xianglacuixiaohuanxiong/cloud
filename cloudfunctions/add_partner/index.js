// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
})

//  引入数据库
const db = cloud.database().collection('partner')
const _ = db.command
// 云函数入口函数
exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext()
  //  先去找看看有没有这个好友
  if (event.partnerId === wxContext.OPENID) {
    return { msg: '不能添加自己哦~' }
  } else {
    const status = await db.where({
      openid: wxContext.OPENID,
      partnerId: event.partnerId
    }).get()
    if (status.data.length) {
      //  有这个好友
      return { msg: '你已经有该小伙伴了' }
    } else {
      //  没有这个好友
      try {
        await db.add({
          data: {
            openid: wxContext.OPENID,
            partnerId: event.partnerId
          }
        })
        return { msg: '添加小伙伴成功!' }
      } catch (e) {
        return { msg: '添加小伙伴失败' }
      }
    }
  }
}