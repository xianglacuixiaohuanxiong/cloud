const app = getApp()
import api from '../../api/index'
import { routerPush, setData, getStorage } from "../../utils/wx";

Page({
  data: {
    list: {},
    isNull: 0
  },
  onLoad() {

  },
  onShow() {
    this.getData()
  },
  //  获取用户信息
  getData() {
    api.allApi({ api: 'friends', token: getStorage('xxhToken') })
      .then(res => {
        const isNull = Object.keys(res.data.list);
        setData.call(this, { list: res.data, isNull })
      })
  },
  //  查询详情
  jump(e) {
    const id = e.currentTarget.dataset.id;
    routerPush(`/pages/buddyDetails/buddyDetails?id=${id}`)
  },
  //  邀请好友
  onShareAppMessage() {
    return {
      title: `点击成为我的好友!`,
      path: `/pages/index/index?id=${app.globalData.userInfo.id}`,
      imageUrl: '../../assets/img/share.jpg'
    }
  }
})
