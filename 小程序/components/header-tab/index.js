// components/header-tab/index.js
Component({

  /**
   * 组件的属性列表
   */
  properties: {
    title: {
      type: String,
      value: '默认标题'
    },
    type: {
      type: String,
      value: 'item'
    }
  },

  lifetimes: {
    attached() {
       
      this.setData({
        navBarClass: this.data.type,
      });
    }
  },


  /**
   * 组件的初始数据
   */
  data: {
    navBarClass: 'item' // 初始类名
  },


  /**
   * 组件的方法列表
   */
  methods: {
    onClickLeft() {
      // wx.showToast({
      //   title: '点击返回',
      //   icon: 'none'
      // });
    },
  }
})