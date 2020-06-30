import { getAuth, setApp } from './utils/auth';
App({
  onLaunch() {

    if (!wx.cloud) {
      console.error('请使用 2.2.3 或以上的基础库以使用云能力')
    } else {
      wx.cloud.init({
        // env 参数说明：
        //   env 参数决定接下来小程序发起的云开发调用（wx.cloud.xxx）会默认请求到哪个云环境的资源
        //   此处请填入环境 ID, 环境 ID 可打开云控制台查看
        //   如不填则使用默认环境（第一个创建的环境）
        // env: 'my-env-id',
        traceUser: true,
      })
    }
    setApp(this);
    this.isUpdata();
    this.overShares();
    this.globalData = {}
  },
  _init(cb){
    const that = this;
    getAuth()
      .then(res => {
        that.globalData.userInfo = res;
        typeof cb == 'function' && cb(true)
        return;
      })
      .catch(_ => {
        typeof cb=='function' && cb(false)
      })
  },
  //  设置全局分享
  overShares() {
    let that = this;
    !function () {
      let PageTmp = Page;
      Page = function (pageConfig) {
        pageConfig = Object.assign({
          onShareAppMessage: function () {
            return {
              title: `虚拟记账~`,
              path: `/pages/index/index`,
              imageUrl: '/assets/img/share.jpg'
            }
          }
        }, pageConfig);
        PageTmp(pageConfig)
      }
    }();
  },
  //  判断小程序是否有更新
  isUpdata() {
    const updateManager = wx.getUpdateManager();
    updateManager.onCheckForUpdate(res => {
      if (res.hasUpdate) console.log(`有新版,可以更新`);
      else console.log(`没有新版`)
    });
    //  监听小程序有版本更新事件
    updateManager.onUpdateReady(res => {
      wx.showModal({
        title: '更新提示',
        content: '新版本已经准备好,是否重启应用?',
        success: data => {
          if (data.confirm) {
            // 强制小程序重启并使用新版本
            updateManager.applyUpdate()
          }
        }
      })
    });
    // 监听小程序更新失败事件
    updateManager.onUpdateFailed(() => {
      wx.showToast({
        title: '新版本下载失败',
        icon: 'none'
      })
    });
  }
})
