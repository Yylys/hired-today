// pages/advantage/advantage.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    title: '',
    personalStrengths: null,
    content: null,
    textAreaValue: '',
  },



  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    if (options.personalStrengths != null) {
      this.setData({
        personalStrengths: options.personalStrengths,
        title: 'Personal Advantage'
      })
    } else {
      const decodedValue = decodeURIComponent(options.content);
      console.log(decodedValue); // 输出: Market Insight & User Understanding
      this.setData({
        content: decodedValue,
        title: 'Self-Evaluation'
      })
    }

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

  getInputValue(res) {
     
    const value = res.detail.value;
    this.setData({
      textAreaValue: value
    });
  },

  // 处理输入框内容变化
  handleInputChange: function (event) {
    // 更新数据源中的 inputValue

    if (this.data.personalStrengths != null) {
      this.setData({
        personalStrengths: event.detail.value,
        textAreaValue: event.detail.value
      });
    } else {
      this.setData({
        content: event.detail.value,
        textAreaValue: event.detail.value
      });
    }
     

  },

  setdata() {
    const eventChannel = this.getOpenerEventChannel()
    if (this.data.personalStrengths != null) {
      // wx.setStorageSync('setadvantage', this.data.personalStrengths)
      eventChannel.emit('setadvantage', {
        data: this.data.personalStrengths
      });
      wx.navigateBack({
        delta: 1
      })
    } else {
      wx.setStorageSync('setadsetcontentvantage', this.data.content)
      eventChannel.emit('setcontent', {
        data: this.data.content
      });
      wx.navigateBack({
        delta: 1
      })
    }

  }
})