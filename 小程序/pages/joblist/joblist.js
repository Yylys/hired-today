// pages/joblist/joblist.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    imgurl: wx._ImgbaseURL,
    selectedCards: null, // 使用 Set 存储选中的卡片 ID
    params2() {
      return {
        audit:1,
        objectSid:wx.getStorageSync('user').sid
      };
    },
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    this.setData({
      selectedCards: new Set() // 在 onLoad 中创建 Set
    });
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow() {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage() {

  },

  toggleSelect(e) {
     
    const item = e.currentTarget.dataset.item
    const index = e.currentTarget.dataset.index
    if (item.show) {
       
      item.show = !item.show
    } else {
       
      item.show = true
    }
    this.setData({
      [`list2[${index}]`]: item
    })
  },

  postdata() {
    let data = []
    for (let i = 0; i < this.data.list2.length; i++) {
      if (this.data.list2[i].show == true) {
        data.push(this.data.list2[i])
      }
    }
    if (data.length < 2) {
      wx.showToast({
        title: 'Select at least two options',
        icon: 'none'
      });
    } else {
      const eventChannel = this.getOpenerEventChannel()
      eventChannel.emit('setlist', {
        data
      });
      wx.navigateBack({
        delta: 1
      })
    }

  }
})