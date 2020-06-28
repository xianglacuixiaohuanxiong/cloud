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
    enterId: _.or(_.eq(openid), _.eq(event.partnerId))
  },{
    outId: _.or(_.eq(openid), _.eq(event.partnerId))
  }])).get()
  let totalMoney = 0
  list.data.map(v => {
    if (v.enterId === wxContext.OPENID) {
      v.status = 1
      totalMoney = totalMoney + v.money
    } else {
      v.status = 0
      totalMoney = totalMoney - v.money
    }
  })
  return await Promise.all(list.data).then(() => {
    return {
      data: list.data,
      totalMoney
    }
  })
}
