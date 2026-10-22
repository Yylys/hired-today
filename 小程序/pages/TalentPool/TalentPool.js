// pages/joblist/joblist.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    imgurl: wx._ImgbaseURL,
    selectedCards: null, // 使用 Set 存储选中的卡片 ID
    show: false,
    userSid: null,
    form: {
      content: "",
      sid: "",
      userCandidateSid: ""
    },
    params2() {
      return {
        userSid: this.data.userSid
      };
    },
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    this.setData({
      selectedCards: new Set(), // 在 onLoad 中创建 Set
      "form.sid": options.sid,
      userSid: wx.getStorageSync('user').sid
    });
    //  this.post.reRequest()

    this.post.reRequest().then(() => {
      if (this.data.list2.length == 0) {
        wx.showModal({
          title: '',
          content: 'Please add talent resume to your talent pool first.',
          confirmText: 'Add Now',
          cancelText: 'Later',
          cancelColor: '#9EA5B8',
          confirmColor: '#2623D1',
          complete: res => {
            if (res.cancel) {
              wx.navigateBack({
                delta: 1
              });
            }
            if (res.confirm) {
              wx.navigateTo({
                url: '/pages/My_Resources/My_Resources',
              });
            }
          },
        });
      }
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

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage() {

  },

  toggleSelect(e) {
    const item = e.currentTarget.dataset.item
    this.setData({
      "form.userCandidateSid": item.sid
    })
  },

  postdata() {
    console.log(this.data.form, 'this.data.form');
    if (this.data.form.userCandidateSid) {
      this.setData({
        show: true
      });
    } else {
      wx.showModal({
        content: 'Please select the candidate you would like to recommend.',
        showCancel: false, // 如果不需要取消按钮可以设置为 false
        confirmText: 'Confirm', // 确认按钮的文本
      })
    }

  },
  bindTextAreaBlur: function (event) {
    this.setData({
      "form.content": event.detail.value
    });
  },
  closepops() {
    this.setData({
      show: false,
    })
  },
  closepop() {
    wx._request("/v1/job/job-delivery", 'POST', this.data.form)
      .then(res => {
        if (res.code == 200) {
          wx.showToast({
            title: 'successful',
            icon: 'none',
            duration: 1000, // 默认2秒
            complete: () => {
              setTimeout(() => {
                wx.navigateBack({
                  delta: 1
                });
              }, 1000); // 与 duration 保持一致
            }
          });
        } else {
          wx.showModal({
            content: res.msg,
            showCancel: false, // 如果不需要取消按钮可以设置为 false
            confirmText: 'Confirm', // 确认按钮的文本
          })
        }
      })
  },
})