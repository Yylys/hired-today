// components/card/index.js
Component({

  /**
   * 组件的属性列表
   */
  properties: {
    list: {
      type: Array,
      value: []
    }
  },



  /**
   * 组件的初始数据
   */
  data: {
    imgurl: wx._ImgbaseURL,
    userKey:null
  },
  ready() {
    this.setData({
      userKey:wx.getStorageSync('user').roleKeySet[0]
    })
    // console.log(this.data.userKey,'userKey');
  },

  /**
   * 组件的方法列表
   */
  methods: {
    goinfo(e) {
      wx.navigateTo({
        url: e.currentTarget.dataset.path + '?sid=' + e.currentTarget.dataset.sid,
      })
    },
  },
})