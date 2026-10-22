// pages/user_xy/user_xy.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    info: null
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    if (options.type == 1) {
      wx.setNavigationBarTitle({
        title: 'User Agreement',
      })
    } else if (options.type == 2) {
      wx.setNavigationBarTitle({
        title: 'Privacy Policy',
      })
    } else if (options.type == 15) {
      wx.setNavigationBarTitle({
        title: 'About Us',
      })
    } else if (options.type == 16) {
      wx.setNavigationBarTitle({
        title: 'Job Hunting Instructions',
      })
    }
    this.getinfo(options.type)
  },

  getinfo(type) {
    // wx._request(`/v1/agreement/${type}/info`, 'GET')
    // .then(res => {
    //   if (res.code == 200) {
    //     this.setData({
    //       info: res.data
    //     })
    //     console.log(this.data.info);
    //   } else {
    //     wx.showToast({
    //       title: res.msg,
    //       icon: 'none'
    //     });
    //   }
    // })
    // .catch(err => {
    //   console.error('请求失败', err);
    //   });
    this.request({
      url: `/v1/agreement/${type}/info`,
      method: 'GET',
      loadingTip: 'Loading...',
    }).then(res => {
      const newHtmlContent = res.data.content.replace(/&nbsp;/g, ' ');
      console.log(newHtmlContent,newHtmlContent);
      this.setData({
        info: newHtmlContent
      })
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


})