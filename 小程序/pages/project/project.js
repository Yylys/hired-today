// pages/experience/experience.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    keyboardHeight: 300, // 键盘高度
    sid: null,
    form: {
      // candidateSid:wx.getStorageSync('userinfo').sid,
      candidateSid:null,
    },
    time: '',
    show: false,
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



  showPopup(e) {
    this.setData({
      show: true,
      time: e.currentTarget.dataset.time
    });
  },

  onClose() {
    this.setData({
      show: false
    });
  },
  onsucces(value) {
    if (this.data.time == "start") {
      this.setData({
        "form.startDate": wx._unit.formatDate(value.detail, "YYYY-MM"),
        show: false
      });
    } else {
      this.setData({
        "form.endDate": wx._unit.formatDate(value.detail, "YYYY-MM"),
        show: false
      });
    }
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
        // 监听键盘高度变化
        // wx.onKeyboardHeightChange((res) => {
        //   console.log('键盘高度变化:', res.height);
        //   this.setData({
        //     keyboardHeight: res.height,
        //   });
        // });
    this.setData({
      'form.candidateSid':wx.getStorageSync('customsid') ? wx.getStorageSync('customsid') : wx.getStorageSync('userinfo').sid,
    })
     
    if (options.sid==null || options.sid=='undefined') {
    } else {
      this.setData({
        sid: options.sid
      })
      this.getinfo(options.sid)
    }
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
      "form.projectName": e.detail.value.projectName,
      "form.projectRole": e.detail.value.projectRole,
      "form.achievementsContent": e.detail.value.performance,
      "form.descriptionContent": e.detail.value.content,
      "form.major": '1',
    });
    if (this.data.sid ==null || this.data.sid=='undefined') {
      // 新增
      wx._request('/v1/project', 'POST', this.data.form)
        .then(res => {
          if (res.code == 200) {
            wx.showToast({
              title: 'Submitted successfully!',
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
        .catch(err => {
          console.error('请求失败', err);
        });
    } else {
      // 修改
      delete this.data.form.sid;
      wx._request(`/v1/project/${this.data.sid}`, 'put', this.data.form)
        .then(res => {
          if (res.code == 200) {
            wx.showToast({
              title: 'Modified successfully！',
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
        .catch(err => {
          console.error('请求失败', err);
        });
    }
  },
})