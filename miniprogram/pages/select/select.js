const app = getApp()
import api from '../../api/index'
import notification from '../../utils/wxNotification'
import {getStorage, routerBack, routerPush, setData} from '../../utils/wx';

Page({
  data: {
    list: {},
    result: [],
    isLoading: true
  },
  onLoad() {
    this.getData()
  },
  //  获取用户信息
  getData() {
    api.allApi({ api: 'friends', token: getStorage('xxhToken') })
      .then(res => {
        setData.call(this, { list: res.data, isLoading: false })
      })
  },
  onChange(e) {
    setData.call(this, {
      result: e.detail
    })
  },
  toggle(event) {
    const { index } = event.currentTarget.dataset;
    const checkbox = this.selectComponent(`.checkboxes-${index}`);
    checkbox.toggle();
  },
  noop() {},
  //  确认
  confirm() {
    const that = this;
    const [ ...data ] = that.data.result;
    let info = data.map(item => {
      item = { val: item };
      item.id = item.val.split(',')[0];
      item.name = item.val.split(',')[1];
      delete item.val
      return item
    })
    notification.postNotificationName('changeUser', info);
    routerBack(1)
  },
  //  退出页面的时候
  onUnload: function () {
    let that = this;
    let pages = getCurrentPages();
    let prevPage = pages[pages.length - 2];
    //  删除事件通知
    notification.removeNotification('changeUser', prevPage)
  },
})
