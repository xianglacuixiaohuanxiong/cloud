// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
})

const db = cloud.database()
const branchBill = db.collection('branchBill')
const _ = db.command
// 云函数入口函数
exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext()
  const openid = wxContext.OPENID;
  const list = await branchBill.where(_.and([{
    // enterId: openid._.or(event.partnerId)
    enterId: _.or(_.eq(openid), _.eq(event.partnerId))
  },{
    // outId: event.partnerId._.or(openid)
    outId: _.or(_.eq(openid), _.eq(event.partnerId))
  }])).get()
  console.log(list)
  list.data.map(v => {
    if (v.enterId === wxContext.OPENID) {
      v.status = 1
    } else {
      v.status = 0
    }
  })
  return await Promise.all(list.data).then(() => {
    return list
  })
}