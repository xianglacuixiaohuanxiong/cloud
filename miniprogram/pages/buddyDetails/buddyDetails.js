const app = getApp()
import api from '../../api/index'
import { getStorage, setData, Toast } from '../../utils/wx';
Page({
  data: {
    id: '',
    page: 1,
    total: 0,
    totalMoney: 0,
    list: []
  },
  onLoad(query) {
    const id = query.id;
    setData.call(this, { id })
    this.getData(id)
  },
  getData(toUserId) {
    const that = this;
    const params = {
      page: that.data.page,
      toUserId,
      token: getStorage('xxhToken'),
      api: 'toFriends'
    }
    api.allApi(params)
      .then(res => {
        setData.call(that, {
          list: that.data.list.concat(res.data.billDetails.data),
          total: res.data.billDetails.totalCount,
          totalPirc: res.data.number
        })
      })
  },
  //  触底事件
  onReachBottom () {
    if (this.data.list.length >= this.data.total) {
      Toast(`没有更多的记录啦!~`)
    } else {
      setData.call(this, { page: this.data.page + 1 }, () => { this.getData(this.data.id) });
    }
  },
})
