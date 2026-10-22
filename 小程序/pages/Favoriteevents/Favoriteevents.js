// pages/Favoriteevents/Favoriteevents.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    imgurl:wx._ImgbaseURL,
    params() {
      return {
        activityType:1
        // classifySid: this.data.sid,
      };
    },
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  ready() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow() {
    this.paging.reRequest();
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

  goinfo(e) {
    wx.navigateTo({
      url: e.currentTarget.dataset.path + '?sid=' + e.currentTarget.dataset.sid,
    })
  },
})