// pages/InterviewDetails/InterviewDetails.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    num: null,
    imageUrls: [],
    time: null,
    show: false,
    shows: false,
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
      shows: false,
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    this.setData({
      sid: options.sid
    })
    // this.getinfo(options.sid)
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
    this.getinfo(this.data.sid)
    if(wx.getStorageSync('user')){
      this.setData({
        userKey:wx.getStorageSync('user'),
      })
    }
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
          if(res.data.readOnly==0 && res.data.messageState==7){
            // wx.showToast({
            //   title: 'You have replied, please be patient and wait for the other party feedback',
            //   icon: 'none'
            // });
            wx.showModal({
              showCancel: false,
              content: "You have declined the candidate's application. Please explore more suitable candidates! Wishing you success!",
              confirmColor:'#2623d1',
              confirmText:"confirm"
            });
          }else if(res.data.readOnly==0 ){
            wx.showModal({
              showCancel: false,
              content: 'You have sent an interview invitation to the candidate. Please wait for the candidate to confirm. Confirmed interviews can be viewed in the interview schedule.Wishing you success in finding the right candidate!',
              confirmColor:'#2623d1',
              confirmText:"confirm"
            });
          }
          if (res.data.resumeInfo.images && res.data.resumeInfo.images.length > 0) {
            let result = res.data.resumeInfo.images
             
            for (let i = 0; i < result.length; i++) {
              this.data.imageUrls.push(result[i].cover)
              this.setData({
                imageUrls: this.data.imageUrls,
                num: result.length - 2
              });
            }
          }
          if(res.data.content){

            this.setData({
              shows: true,
            });
          }
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

  settime(e) {
     
    this.setData({
      time: e.currentTarget.dataset.time
    })
  },
  onsub() {
     
    let data = {
      jobSid: this.data.info.job.sid,
      reason: this.data.content,
      candidateSid: this.data.info.resumeInfo.candidate.sid,
      messageSid:this.data.info.sid
    }
    wx._request("/v1/interview/refuse-interview", 'POST', data)
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

  previewImage(e) {
    // const current = e.target.dataset.src; // 当前点击的图片
    wx.previewImage({
      // current: 2, // 当前显示图片的http链接
      urls: this.data.imageUrls // 需要预览的图片http链接列表
    });
  },

  goyq() {
    wx.navigateTo({
      url: '/pages/interview/interview?sid=' + this.data.info.resumeInfo.candidate.sid +'&messageSid=' + this.data.info.sid +  '&jobsid=' + this.data.info.job.sid + '&jobname=' + JSON.stringify(this.data.info.job.jobName) ,
    })
  }

})