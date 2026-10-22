// pages/InterviewDetails/InterviewDetails.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    time: null,
    show: false,
    sid: null,
    info: [],
    imgurl: wx._ImgbaseURL,
    userKey:null,
  },

  showPopup(e) {
    this.setData({
      show: true,
    });
  },

  closepop() {
    this.setData({
      show: false,
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    this.setData({
      sid: options.sid,
      userKey:wx.getStorageSync('user').roleKeySet[0]
    })
    this.getinfo(options.sid)
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
  getinfo(sid) {
    wx._request(`/v1/message/${sid}`, 'GET')
      .then(res => {
        if (res.code == 200) {
          this.setData({
            info: res.data,
            time: res.data.interview.timeList[0],
          })
          if(res.data.readOnly==0 && res.data.messageState==7){
            wx.showModal({
              showCancel: false,
              content: "You have declined the candidate's application. Please explore more suitable candidates! Wishing you success!",
              confirmColor:'#2623d1',
              confirmText:"confirm"
            });
          }else if(res.data.readOnly==0){
            wx.showModal({
              showCancel: false,
              content: 'You have declined the interview invitation. Feel free to explore other opportunities that may be a better fit for you. We wish you the best of luck in your job search!',
              confirmColor:'#2623d1',
              confirmText:"confirm"
            });
          }
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
  settime(e) {
    this.setData({
      time: e.currentTarget.dataset.time
    })
  },
  onsub() {
     
    let data = {
      reason: this.data.content,
      sid: this.data.sid
    }
    wx._request("/v1/interview/refuse", 'POST', data)
      .then(res => {
        if (res.code == 200) {
          wx.showToast({
            title: 'Submitted successfully',
            icon: 'none',
            duration: 500, // 默认2秒
            complete: () => {
              setTimeout(() => {
                wx.navigateBack({
                  delta: 1
                });
              }, 500); // 与 duration 保持一致
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
  // 处理输入框内容变化
  handleInputChange: function (event) {
    // 更新数据源中的 inputValue
    this.setData({
      content: event.detail.value
    });
  },
  posttime() {
    if(this.data.time==null){
      wx.showToast({
        title: "Please Choose an interview time",
        icon: 'none'
      });
      return
    }else{
      let data = {
        time: this.data.time,
        sid: this.data.sid
      }
      wx._request("/v1/interview/accept", 'POST', data)
        .then(res => {
          if (res.code == 200) {
            wx.showToast({
              title: 'Submitted successfully',
              icon: 'none',
              duration: 0, // 默认2秒
              complete: () => {
                setTimeout(() => {
                  wx.navigateBack({
                    delta: 1
                  });
                }, 0); // 与 duration 保持一致
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
    }

  }
  ,
  goinfo(e) {
      wx.navigateTo({
        url: e.currentTarget.dataset.path + '?sid=' + e.currentTarget.dataset.sid,
      })
    }
})