// components/card/index.js
Component({

  /**
   * 组件的属性列表
   */
  properties: {
    list: {
      type: Array,
      value: [],
      observer(newVal) {
        // 在 list 属性变化时进行去重
        this.removeDuplicates(newVal);
      }
    }
  },



  /**
   * 组件的初始数据
   */
  data: {
    imgurl: wx._ImgbaseURL,
    uniqueList:[],
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
        // 去重方法
        removeDuplicates(list) {
          const uniqueList = list.filter((value, index, self) => 
            index === self.findIndex((t) => t.sid === value.sid)
          );
          // 更新去重后的数据
          this.setData({
            uniqueList: uniqueList
          });
        }
  },
})