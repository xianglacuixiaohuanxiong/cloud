const app = getApp();
import { addPartner } from '../../utils/util'
import { getUser } from '../../utils/auth';
import { showLoading, Toast } from "../../utils/wx";
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
      if (e.detail.errMsg === 'getUserInfo:ok') {
        showLoading(`前往新世界`)
        getUser(e)
          .then(res => {
            wx.hideLoading();
            app.globalData.userInfo = res;
            that.triggerEvent('info', res);
            if (app.globalData.friendsId) addPartner()
          })
          .catch(err => {
            Toast(`服务器出问题了呢~`)
            console.log(err)
          })
      } else {
        Toast(`你取消了授权`)
      }
    },
    popStatus () {
      this.setData({
        isShow: false
      })
    }
  }
});
