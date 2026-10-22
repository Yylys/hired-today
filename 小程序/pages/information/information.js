// pages/information/information.js
Page({
  /**
   * 页面的初始数据
   */
  data: {
    wx_ImgbaseURL: wx._ImgbaseURL,
    // imgurl:wx._ImgbaseURL,
    sid: null,
    form: {
      ascriptionUserId: null,
      avatar: null,
      fullName: null,
      sex: null,
      createType: 1,
      birth: null,
      email: null,
      phone: null,
      weChat: null,
      countriesName: null,
      degreeName: null,
      workName: null,
      countriesSid: null,
      degreeSid: null,
      workSid: null,
    },
    show: false,
    showexperience: false,
    showeducational: false,
    columns: [],
    columns1: [],
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
  setsex(e) {

    this.setData({
      "form.sex": e.currentTarget.dataset.sex
    })
  },
  showPopup() {
    this.setData({
      show: true
    });
  },

  onClose() {
    this.setData({
      show: false,
      showexperience: false,
      showeducational: false
    });
  },

  onInput(event) {
    this.setData({
      currentDate: event.detail,
    });
  },

  onFormSubmit(e) {
    this.setData({
      "form.email": e.detail.value.email,
      "form.fullName": e.detail.value.fullName,
      "form.phone": e.detail.value.phone,
      "form.weChat": e.detail.value.weChat,
    });
    if (!this.data.sid) {
      wx._request('/v1/candidate/save', 'POST', this.data.form)
      // this.request({
      //   url:`/v1/candidate/save`,
      //   method: 'POST',
      //   data:this.data.form})
        .then(res => {
          if (res.code == 200) {
            this.getinfo()
            wx.showToast({
              title: 'Submitted successfully！',
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
      wx._request(`/v1/candidate/${this.data.sid}/update`, 'PUT', this.data.form)
      // this.request({
      //   url:  `/v1/candidate/${this.data.sid}/update`,
      //   method: 'PUT',
      //   data:this.data.form,
      //   loadingTip: 'Loading...'})
        .then(res => {
          if (res.code == 200) {
            this.getinfo()
            wx.showToast({
              // title: 'successfully！',
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

  onChooseAvatar(e) {

    wx.showLoading({
      title: '上传中',
      mask: true,
    });
    let that = this;
    const {
      avatarUrl
    } = e.detail;


    wx.uploadFile({
      url: wx._baseURL + '/v1/resources/public',
      filePath: avatarUrl,
      name: 'file',
      header: {
        Authorization: wx.getStorageSync('token'),
      },
      success(res) {

        const data = JSON.parse(res.data);

        that.setData({
          "form.avatar": data.data.url,
        });
      },
      fail() {
        wx.showToast({
          title: 'Upload failed, please try again',
          icon: 'none',
        });
      },
      complete() {
        wx.hideLoading();
      },
    });
  },

  onsucces(value) {
    this.setData({
      "form.birth": wx._unit.formatDate(value.detail, "YYYY-MM-DD"),
      show: false
    });
  },

  onConfirm(event) {

    this.setData({
      "form.workName": event.detail.value.memberName,
      "form.workSid": event.detail.value.sid,
      show: false,
      showexperience: false,
      showeducational: false
    });

  },

  onConfirm1(event) {
    this.setData({
      "form.degreeName": event.detail.value.memberName,
      "form.degreeSid": event.detail.value.sid,
      show: false,
      showexperience: false,
      showeducational: false
    });

  },

  goinfo() {
    wx.navigateTo({
      url: "/pages/location/location",
      events: {
        // 为指定事件添加一个监听器，获取被打开页面传送到当前页面的数据
        acceptDataFromOpenedPage: (data) => {

          this.setData({
            "form.countriesSid": data.data.sid,
            "form.countriesName": data.data.countriesName,
          });
        },
      },
    })
  },


  showexperience() {
    this.setData({
      showexperience: true
    });
  },

  showeducational() {
    this.setData({
      showeducational: true
    });
  },



  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady() {
    this.getexperience()
    this.geteducational()
    this.getinfo()
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow() {
    this.setData({
      "form.ascriptionUserId": wx.getStorageSync('user').id
    })
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


  getinfo() {
    wx._request('/v1/candidate/me', 'GET')
      .then(res => {
        if (res.code == 200) {

          if (res.data.sid) {
            wx.setStorageSync('userinfo', res.data)
          }
          this.setData({
            "form.avatar": res.data.avatar,
            "form.birth": res.data.birth,
            "form.email": res.data.email,
            "form.fullName": res.data.fullName,
            "form.phone": res.data.phone,
            "form.sex": res.data.sex,
            "form.weChat": res.data.weChat,
            "form.degreeSid": res.data.degree.sid,
            "form.workSid": res.data.work.sid,
            "form.countriesSid": res.data.countries.sid,
            "form.degreeName": res.data.degree.memberName,
            "form.workName": res.data.work.memberName,
            "form.countriesName": res.data.countries.countriesName,
            sid: res.data.sid
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

  getexperience() {
    wx._request('/v1/dicts/by-key/Experience', 'GET')
      .then(res => {
        if (res.code == 200) {
          for (let i = 0; i < res.data.length; i++) {
            res.data[i].text = res.data[i].memberName;
          }
          this.setData({
            columns: res.data
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

  geteducational() {
    wx._request('/v1/dicts/by-key/degree', 'GET')
      .then(res => {
        if (res.code == 200) {
          for (let i = 0; i < res.data.length; i++) {
            res.data[i].text = res.data[i].memberName;
          }
          this.setData({
            columns1: res.data
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

})