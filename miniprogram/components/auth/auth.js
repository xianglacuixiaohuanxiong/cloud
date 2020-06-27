const app = getApp();
import api from '../../api/index'
Component({
  properties: {
    isShow: {
      type: Boolean,
      val: false
    }
  },
  methods: {
    // 获取用户信息
    async getUserInfo(e) {
      let that = this;
      const res = await api.login();
      let userInfo = e.detail.userInfo;
      userInfo.openid = res.openid;
      await api.setUserInfo(userInfo);
      app.globalData.userInfo = userInfo
      that.triggerEvent('info', userInfo);
    },
    popStatus () {
      this.setData({
        isShow: false
      })
    }
  }
});