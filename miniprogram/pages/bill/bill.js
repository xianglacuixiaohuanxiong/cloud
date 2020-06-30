const app = getApp()
import api from '../../api/index'
import {getStorage, setData, Toast} from '../../utils/wx';

Page({
  data: {
    page: 1,
    total: 0,
    plusNumber: 0,
    reduceNumber: 0,
    list: []
  },
  onLoad() {
    this.getData()
  },
  //  获取信息
  getData() {
    const that = this;
    const params = {
      api: 'userBill',
      token: getStorage('xxhToken'),
      page: that.data.page
    }
    api.allApi(params)
      .then(res => {
        setData.call(that, {
          list: that.data.list.concat(res.data.userBills.data),
          total: res.data.userBills.totalCount,
          plusNumber: res.data.plusNumber,
          reduceNumber: res.data.reduceNumber
        })
      })
  },
  //  触底事件
  onReachBottom () {
    if (this.data.list.length >= this.data.total) {
      Toast(`没有更多的记录啦!~`)
    } else {
      setData.call(this, { page: this.data.page + 1 }, () => { this.getData() });
    }
  },
})
