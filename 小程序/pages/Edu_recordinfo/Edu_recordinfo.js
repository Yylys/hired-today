// pages/Jobrecordinfo/Jobrecordinfo.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    info:{},
    imgurl: wx._ImgbaseURL,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    this.getinfo(options.sid)
  },

  getinfo(sid){
    wx._request(`/v1/resume/${sid}/invite-info`, 'GET')
      .then(res => {
        if (res.code == 200) {
          this.setData({
            info: res.data
          });
        } else {
          wx.showModal({
            content: res.msg,
            showCancel: false, // 如果不需要取消按钮可以设置为 false
            confirmText: 'Confirm', // 确认按钮的文本
          })
        }
      })
      .catch(err => {
        console.error('请求失败', err);
      });
  },

  goinfo(e){
    wx.navigateTo({
      url: e.currentTarget.dataset.path + '?sid=' + e.currentTarget.dataset.sid,
    })
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