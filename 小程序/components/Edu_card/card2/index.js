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
    ImgbaseURL: wx._ImgbaseURL,
  },
  onLoad() {
     
  },
 



  /**
   * 组件的方法列表
   */
  methods: {
    goinfo(e) {
      wx.navigateTo({
        url: `/pages/plazainfo/plazainfo`
        // url: `/pages/zsztinfo/zsztinfo?sid=${e.currentTarget.dataset.item.sid}`
      })
    },
  }
})