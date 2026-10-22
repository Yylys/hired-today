// pages/experience/experience.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    user: wx.getStorageSync('user'),
    sid: null,
    info:'',
    num: null,
    jobName: null,
    form: {
      detail: "",
      interviewTime: [''],
      interviewer: "",
      jobSid: "",
      messageSid:"",
      numberOfInterviews: '',
      platform: "",
      candidateSid: "",
      status: 0,
      title: ""
    },
    columns: [],
    show: false,
    showexperience: false,
    currentDate: new Date().getTime(),
    minDate: new Date('1920-01-01').getTime(),

    formatter(type, value) {
      if (type === 'year') {
        return `${value}年`;
      }
      if (type === 'month') {
        return `${value}月`;
      }
      return value;
    },
  },

  addtime() {
    this.data.form.interviewTime.push('')
    this.setData({
      "form.interviewTime": this.data.form.interviewTime
    })
  },

  showPopup(e) {
    this.setData({
      show: true,
      num: e.currentTarget.dataset.index
    });
  },

  onsucces(value) {
    this.data.form.interviewTime[this.data.num] = wx._unit.formatDate(value.detail, "YYYY-MM-DD HH:mm:ss")
    this.setData({
      "form.interviewTime": this.data.form.interviewTime,
      show: false
    });
  },

  onInput(event) {
     
    this.setData({
      currentDate: event.detail,
    });
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    console.log(options,22222);
    if(options.jobsid){
      this.setData({
        // "jobName": JSON.parse(options.jobname),
        "form.jobSid": options.jobsid,
        "form.messageSid":options.messageSid
      });
      this.getmess(options.messageSid)
    }

    if (options.sid == null || options.sid == 'undefined') {} else {
      this.setData({
        'form.candidateSid': options.sid
      })
    }   
     this.getexperience()
  },

  getinfo(sid) {
    wx._request(`/v1/project/${sid}`, 'GET')
      .then(res => {
        if (res.code == 200) {
           
          this.setData({
            form: res.data
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

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady() {

  },
  getmess(sid) {
    wx._request(`/v1/message/${sid}`, 'GET')
      .then(res => {
        if (res.code == 200) {
          this.setData({
            jobName: res.data.job.jobName
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
  onFormSubmit(e) {

    const eventChannel = this.getOpenerEventChannel()
    this.setData({
      "form.title": e.detail.value.title,
      "form.interviewer": e.detail.value.interviewer,
      "form.platform": e.detail.value.platform,
      "form.numberOfInterviews": e.detail.value.numberOfInterviews,
      "form.detail": e.detail.value.detail,
    });
     
    // 新增
    wx._request('/v1/interview', 'POST', this.data.form)
      .then(res => {
        if (res.code == 200) {
          wx.showToast({
            title: 'Invitation successful！',
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
      .catch(err => {
        console.error('请求失败', err);
      });

  },

  showexperience() {
    this.setData({
      showexperience: true
    });
  },

  onClose() {
    this.setData({
      show: false,
      showexperience: false,
    });
  },
  onConfirm(event) {
     
    this.setData({
      "jobName": event.detail.value.jobName,
      "form.jobSid": event.detail.value.sid,
      show: false,
      showexperience: false,
    });
  },
  getexperience() {
    wx._request('/v1/job/page', 'GET', {
        objectSid: this.data.user.sid,
        audit:1
      })
      .then(res => {
        if (res.code == 200) {
          for (let i = 0; i < res.data.records.length; i++) {
            res.data.records[i].text = res.data.records[i].jobName;
          }
          this.setData({
            columns: res.data.records
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
})