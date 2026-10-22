// pages/information/information.js
Page({
  /**
   * 页面的初始数据
   */
  data: {
    candidateSid: null,
    wx_ImgbaseURL: wx._ImgbaseURL,
    imgurl: wx._ImgbaseURL,
    sid: null,
    recruitername: 'No',
    form: {
      ascriptionUserId: null,
      avatar: null,
      fullName: null,
      createType: 1,
      sex: null,
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
      recruiterPrice: null,
      recruiter: 1,
      recommendPrice: null,
    },
    show: false,
    showexperience: false,
    showeducational: false,
    columns: [],
    columns1: [],
    columns4: [{
        name: 'Yes',
        id: 0
      }, {
        name: 'No',
        id: 1
      }

    ],
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

    // 处理输入事件
    onInputChange: function (e) {
      let inputValue = e.detail.value;
  
      // 使用正则表达式，确保输入最多两位小数
      // 只允许数字和最多两位小数
      if (/^\d+(\.\d{0,2})?$/.test(inputValue)) {
        this.setData({
          'form.recruiterPrice': inputValue
        });
      } else {
        // 如果不符合规则，可以选择清空或者其他处理
        this.setData({
          'form.recruiterPrice': inputValue.slice(0, -1)
        });
      }
    },

  // onClose() {
  //    
  //   this.setData({
  //     show: false,
  //     showexperience: false,
  //     showeducational: false
  //   });
  // },

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
      "form.recommendPrice": e.detail.value.recommendPrice,
      "form.recruiterPrice": e.detail.value.recruiterPrice,
    });
    // console.log(this.data.form,'22222');
    if(this.data.form.recruiter==0){
      if (/^\d+(\.\d{1,2})?$/.test(this.data.form.recruiterPrice)) {
        console.log("输入是有效的数字，最多两位小数");
      } else {
        wx.showModal({
          content: 'The commission only supportsentering specific numbers and willbe calculated in CNY.',
          showCancel: false, // 如果不需要取消按钮可以设置为 false
          confirmText: 'Confirm', // 确认按钮的文本
        })
        return
      }
    }

    if (!this.data.sid) {
      wx._request('/v1/candidate/save', 'POST', this.data.form)
        .then(res => {
          if (res.code == 200) {
            // this.getinfo()
            wx.setStorageSync('customsid', res.data)
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
      wx._request(`/v1/candidate/${this.data.sid}/update`, 'put', this.data.form)
        .then(res => {
          if (res.code == 200) {
            // this.getinfo()
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

    this.setData({
      candidateSid: wx.getStorageSync('customsid'),
      'form.ascriptionUserId': wx.getStorageSync('user').id
    })
    if (this.data.candidateSid) {
      this.getinfo()
    }

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady() {
    this.getexperience()
    this.geteducational()

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


  getinfo() {

    wx._request(`/v1/candidate/${this.data.candidateSid}/candidate-info`, 'GET')
      .then(res => {
        if (res.code == 200) {

          wx.setStorageSync('userinfo', res.data)
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
            "form.recruiterPrice": res.data.recruiterPrice,
            "form.recruiter": res.data.recruiter,
            "form.recommendPrice": res.data.recommendPrice,
            recruitername: res.data.recruiter == 0 ? 'Yes' : "No",
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
  },
  showre() {
    this.setData({
      showre: true
    });
  },
  onClose() {
    this.setData({
      showre: false,
      show: false,
      showexperience: false,
      showeducational: false
    });
  },

  onConfirm4(event) {
    this.setData({
      "recruitername": event.detail.value.name,
      "form.recruiter": event.detail.value.id,
      showre: false,
    });
  },

})