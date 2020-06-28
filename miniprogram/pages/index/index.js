const app = getApp();
import api from '../../api/index'
import notification from '../../utils/wxNotification'
import { auth, addPartner } from '../../utils/util'
import { Toast, routerPush, getStorage, setData } from "../../utils/wx";
Page({
  data: {
    isAuthPop: false,
    isAuth: false,
    nickName: '点击头像登录',
    avatarUrl: '../../assets/img/user.png',
    //  列表
    list: [
      { title: '好友列表', type: 'buddy' },
      { title: '账单记录', type: 'bill' },
    ],
    isLoading: true,  //  是否加载中
    billShow: false,  //  是否显示添加账单
    //  传递的值
    form: {
      detailsMsg: '',
      number: '',
      buddyList: [],
      buddyNameList: [],
      buddyIdList: []
    }
  },
  onLoad (query) {
    const that = this;
    //  注册通知
    if (query.id) app.globalData.partnerId = query.id;
    auth()
      .then(_ => {
        if (query.id) addPartner();
        setData.call(that, {
          isAuth: true,
          nickName: app.globalData.userInfo.nickName,
          avatarUrl: app.globalData.userInfo.avatarUrl,
        })
      })
      .catch(err => {
        if (!err) {
          //  没有授权
        } else {
          //  别的情况
        }
      })
      .finally(() => {
        setData.call(that, { isLoading: false })
      })
  },
  onShow () {
    //
  },
  //  双向绑定数据
  inputChange(e) {
    const key = e.currentTarget.dataset.key;
    const val = `form.${key}`
    setData.call(this, { [val]: e.detail })
  },
  //  统一管理点击事件
  handleTap(e) {
    const that = this;
    if (that.data.isAuth) {
      const type = e.currentTarget.dataset.type;
      switch (type) {
        //  登录
        case 'login':
          // routerPush(`/pages/login/login`);
          Toast(`好啦好啦,我知道你的头像好看`)
          break;
        //  好友列表
        case 'buddy':
          routerPush(`/pages/partner/partner`);
          break;
        //  我的账单
        case 'bill':
          routerPush(`/pages/bill/bill`);
          break;
        //  添加账单
        case 'add':
          setData.call(that, { billShow: true })
          break;
        default:
          Toast(`哎呀,迷路了呢~`)
      }
    } else {
      setData.call(this, { isAuthPop: true })
      // routerPush(`/pages/login/login`);
    }
  },
  onClose() {
    setData.call(this, { billShow: false })
  },
  //  选择小伙伴
  clicks() {
    //  注册通知事件
    notification.addNotification('changeUser', this.buddyNotification, this )
    routerPush(`/pages/select/select`)
  },
  //  选择小伙伴通知事件
  buddyNotification(info) {
    const buddyNameList = info.map(v => v.name);
    const buddyIdList = info.map(v => v.openid);
    setData.call(this, {
      'form.buddyList': info,
      'form.buddyNameList': buddyNameList,
      'form.buddyIdList': buddyIdList
    })
  },
  //  添加账单
  comfirm() {
    const that = this;
    const data = that.data.form;
    const params = {
      billName: data.detailsMsg,
      moeny: Number(data.number),
      isAverage: true,
      menber: data.buddyList
    }
    console.log(!params.menber.length)
    return
    if (!params.billName) {
      Toast(`没有名称不能记录呀!`);
      return false;
    } else if (!params.moeny) {
      Toast(`没有金额也不能记录呀!`);
      return false;
    } else if (isNaN(params.moeny)) {
      Toast(`这个金额我也识别不到呀!`);
      return false;
    } else if (!params.menber.length) {
      Toast(`至少选择一人一起分账~`)
    } else {
      api.addBill(params)
        .then(res => {
          Toast(res.msg);
          that.onClose()
        })
    }
  },
  //  退出pop时清除
  handleClose() {
    const form = {
      detailsMsg: '',
      number: '',
      buddyNameList: [],
      buddyIdList: []
    }
    setData.call(this, { form })
  },
  //  授权成功
  changeStatus(e) {
    this.setData({
      isAuthPop: false,
      isAuth: true,
      logged: true,
      avatarUrl: e.detail.avatarUrl,
      userInfo: e.detail
    })
  }
})
