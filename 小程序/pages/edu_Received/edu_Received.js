// pages/edu_Received/edu_Received.js
Page({
  /**
   * 页面的初始数据
   */
  data: {
    sid:null,
    imgurl: wx._ImgbaseURL,
    params2() {
      return {
        jobSid:this.data.sid
      };
    },
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    this.setData({
      sid:options.sid
    })
    this.paging2.reRequest();
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
  goinfo(e) {
    wx.navigateTo({
      url: e.currentTarget.dataset.path + '?sid=' + e.currentTarget.dataset.sid + "&jobsid=" + this.data.sid+ "&type=" + e.currentTarget.dataset.type, 
    })
  },
})