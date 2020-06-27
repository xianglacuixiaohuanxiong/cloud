// 云函数入口文件
const cloud = require('wx-server-sdk')
const pinyin = require('js-pinyin');
pinyin.setOptions({checkPolyphone: false, charCase: 0});
cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
})
//  引入数据库
const partnerDb= cloud.database().collection('partner')
const userDb = cloud.database().collection('user')
// 云函数入口函数
exports.main = async (event, context) => {
  console.log(pinyin.getCamelChars('管理员'));
  const wxContext = cloud.getWXContext()
  //  先查询我有的好友openid
  const partnerIdList = await partnerDb.where({
    openid: wxContext.OPENID,
  }).get()
  //  如果有的话就查询详情
  if (partnerIdList.data.length) {
    let partnerList = [];
    partnerIdList.data.forEach(v => {
      const promise = userDb.where({ openid: v.partnerId }).get()
      partnerList.push(promise)
    })
    return (await Promise.all(partnerList)).reduce((acc, cur) => {
      const data = fenzu(acc.data.concat(cur.data))
      return {
        data: {
          list: data,
          state: 1,
          number: 20
        },
        errMsg: acc.errMsg,
      }
    })
  } else {
    return { data: [] }
  }
}
function fenzu(arr) {
  let wordList = [];
  for (let i = 0; i < 26; i++) {
    const key = String.fromCharCode(65 + i);
    let map = {};
    map[key] = {
      name: key,
      items: []
    }
    arr.map((v, k) => {
      let firstIndex = v.nickName.substr(0, 1);
      if (pinyin.getCamelChars(firstIndex) === String.fromCharCode(65 + i)) {
        map[key].items.push(v)
      }
    })
    if (map[key].items === undefined || map[key].items.length === 0) {
      continue
    } else {
      wordList.push(map[key])
    }
  }
  return wordList
}