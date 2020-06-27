// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
})
const totalBill = cloud.database().collection('totalBill')
const branchBill = cloud.database().collection('branchBill')

// 云函数入口函数
exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext();
  const menberList = event.menber;
  //  添加账单
  if (event.isAverage) {
    //  平分账单
    await totalBill.add({
      data: event
    })
    let isConfirm = []
    menberList.forEach(v => {
      const promise = branchBill.add({
        data: {
          billName: event.billName,
          enterId: wxContext.OPENID,
          outId: v.openid,
          outName: v.name,
          money: Number((event.moeny / event.menber.length).toFixed(2))
        }
      })
      isConfirm.push(promise)
    })
    return await Promise.all(isConfirm).then(() => {
      return { msg: `账单新增完毕~快去看看吧~` }
    })
  } else {
    //  各自的
    return { msg: `功能开发中....` }
    // const params = {
    //   name: '',
    //   pro: [
    //     { openid: '123456', money: 12 },
    //     { openid: '123456', money: 12 },
    //   ]
    // }
  }
}