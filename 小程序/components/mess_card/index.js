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
    num: null,
    userKey: null
  },
  ready() {
    this.setData({
      userKey: wx.getStorageSync('user').roleKeySet[0]
    })
    // console.log(this.data.userKey,'userKey');
  },
  /**
   * 组件的方法列表
   */
  methods: {
    notifyParent: function () {
      // 触发父组件的事件
      this.triggerEvent('callParent', {
        message: '来自子组件的请求'
      });
    },
    goinfo(e) {
      wx.navigateTo({
        url: e.currentTarget.dataset.path + '?sid=' + e.currentTarget.dataset.sid,
      })
    },
    dellists(e) {
      let sid = e.currentTarget.dataset.sid
      if (e.detail == 'right') {
        // 收藏
        wx._request(`/v1/message/delete/${sid}`, 'put')
          .then(res => {
            if (res.code == 200) {
              wx.showToast({
                title: 'successfully!',
                icon: 'none'
              });
              this.notifyParent()
            } else {
              wx.showModal({
                content: res.msg,
                showCancel: false, // 如果不需要取消按钮可以设置为 false
                confirmText: 'Confirm', // 确认按钮的文本
              })
            }
          })
      }
    },

    openbox(e) {

      this.setData({
        num: e.currentTarget.dataset.index
      });
    },

    closebox(event) {

      this.setData({
        num: null
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