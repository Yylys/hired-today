// pages/plazainfo/plazainfo.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    info: {},
    sid: '',
    imgurl:wx._ImgbaseURL,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
     
    this.getinfo(options.sid)
    this.setData({
      sid: options.sid,
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
  onShareAppMessage: function (res) {
    return {
      title: 'this.info.title',
      path: `/pages/plazainfo/plazainfo?sid=${this.data.sid}`,
      imageUrl: this.info.posters.cover // 可选
    };
  },
  
  getinfo(sid) {
   wx._request(`/v1/activity/${sid}`,'GET')
      .then(res => {
        if (res.code == 200) {
          this.setData({
            info: res.data
          });
        } else {
          if(res.code==501){

          }else{
            wx.showModal({
              content: res.msg,
              showCancel: false, // 如果不需要取消按钮可以设置为 false
              confirmText: 'Confirm', // 确认按钮的文本
            })
          }

        }
      })
      .catch(err => {
        console.error('请求失败', err);
      });
  },
  save(e) {
    wx._request(`/v1/activity/${ e.currentTarget.dataset.data.sid}/preference`, 'POST')
      .then(res => {
        if (res.code == 200) {
          if (e.currentTarget.dataset.data.isCollection == true) {
            wx.showToast({
              title: 'Cancel collection！',
              icon: 'none',
            });
          } else {
            wx.showToast({
              title: 'Collection successful！',
              icon: 'none',
            });
          }
          this.getinfo(this.data.sid)
        } else {}
      })
  },

  paywx() {
    let userinfo=wx.getStorageSync('userinfo')
     
    if(!userinfo){
      wx.showToast({
        title: "Please complete your personal resume",
        icon: 'none'
      });
      return
    }
    let data={
      activitySid:this.data.sid,
      payType: 1,
    }
    wx._request('/v1/pay/wx-pay', 'POST',data)
      .then(res => {
        if (res.code == 200) {
          if(res.data.signType=='RSA'){
            wx.requestPayment({
              timeStamp: res.data.timeStamp, // 生成时间戳
              nonceStr: res.data.nonceStr, // 生成随机字符串
              package: res.data.package, // 预支付交易会话标识
              signType: res.data.signType, // 签名方式
              paySign: res.data.paySign, // 签名
              success:(res) =>{
                // 支付成功回调
                 
                this.getinfo(this.data.sid)
              },
              fail (res) {
                // 支付失败回调
                // wx.showToast({
                //   title: res.msg,
                //   icon: 'none'
                // });
                wx.showModal({
                  content: res.msg,
                  showCancel: false, // 如果不需要取消按钮可以设置为 false
                  confirmText: 'Confirm', // 确认按钮的文本
                })
                 
              }
            });
          }
        } else {
          wx.showModal({
            content: res.msg,
            showCancel: false, // 如果不需要取消按钮可以设置为 false
            confirmText: 'Confirm', // 确认按钮的文本
          })
        }
        this.getinfo(this.data.sid)
      })
  },
})