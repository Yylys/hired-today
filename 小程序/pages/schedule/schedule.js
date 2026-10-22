// pages/schedule/schedule.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    imgurl: wx._ImgbaseURL,
    sid:null,
    userKey:null,
    params1() {
      return {
        candidateSid: this.data.sid,
      };
    },
  },

  goinfo(e) {
    wx.navigateTo({
      url: e.currentTarget.dataset.path + '?sid=' + e.currentTarget.dataset.sid,
    })
  },


  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    const user=wx.getStorageSync('user')
    this.setData({
      userKey:wx.getStorageSync('user').roleKeySet[0]
    })
    if(user.roleKeySet.includes('recruiter')){
      this.setData({
        sid:'',
        userKey:wx.getStorageSync('user').roleKeySet[0]
      })
    }else{
      this.setData({
        sid:wx.getStorageSync('userinfo').sid
      })
    }
    this.paging.reRequest();
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

 
})