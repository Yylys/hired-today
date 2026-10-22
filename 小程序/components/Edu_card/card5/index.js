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
    num: null
  },
  onLoad() {
     
  },

  /**
   * 组件的方法列表
   */
  methods: {
    goinfo(e) {
      wx.navigateTo({
        url: '/pages/Jobrecordinfo/Jobrecordinfo'
        // url: `/pages/cardinfo/cardinfo?sid=${e.currentTarget.dataset.item.sid}`
      })
    },

    openbox(e) {
       
      this.setData({
        num: e.currentTarget.dataset.index
      });
    },

    closebox(event){
       
      this.setData({
        num:null
      });
    },

    onClose(event) {
      const {
        position,
        instance
      } = event.detail;
      switch (position) {
        case 'left':
        case 'cell':
          instance.close();
          break;
        case 'right':
          Dialog.confirm({
            message: '确定删除吗？',
          }).then(() => {
            instance.close();
          });
          break;
      }
    },
  },
})