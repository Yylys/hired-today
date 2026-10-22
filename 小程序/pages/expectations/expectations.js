// pages/expectations/expectations.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    sid: null,
    expectations: {
      candidateSid: null,
      cardList: [{
        desiredCity: "",
        desiredIndustry: "",
        maxSalary: '',
        minSalary: '',
        note: "",
        status: 0,
        workTypeSid: ""
      }],
      desiredCity: "",
      desiredIndustry: "",
      maxSalary: '',
      minSalary: '',
      note: "",
      status: 0
    },
    show: false,
    index: null,
    columns: [],
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    this.setData({
      'expectations.candidateSid': wx.getStorageSync('customsid') ? wx.getStorageSync('customsid') : wx.getStorageSync('userinfo').sid,
    })

    if (options.sid == null || options.sid == 'undefined') {} else {
      this.setData({
        sid: options.sid
      })
      this.getinfo(this.data.expectations.candidateSid)
    }
  },



  getinfo(sid) {
    wx._request(`/v1/expectations/${sid}`, 'GET')
      .then(res => {
        if (res.code == 200) {
          this.setData({
            'expectations.cardList': res.data
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
    this.getexperience()
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


  onAdd() {
    let list = this.data.expectations.cardList
    for (let i = 0; i < list.length; i++) {
      if (list[i].desiredCity == '' || list[i].desiredCity == undefined) {
        console.log(22222222);
        wx.showModal({
          content: " Please complete the city where you expect to work",
          showCancel: false, // 如果不需要取消按钮可以设置为 false
          confirmText: 'Confirm', // 确认按钮的文本
        })
        return
      }
      if (list[i].desiredIndustry == '' || list[i].desiredIndustry == undefined) {
        wx.showModal({
          content: "Please complete the job position you expect",
          showCancel: false, // 如果不需要取消按钮可以设置为 false
          confirmText: 'Confirm', // 确认按钮的文本
        })
        return
      }
      if (list[i].minSalary == '' || list[i].minSalary == undefined) {
        wx.showModal({
          content: "Minimum salary cannot be empty.",
          showCancel: false, // 如果不需要取消按钮可以设置为 false
          confirmText: 'Confirm', // 确认按钮的文本
        })
        return
      }
      if (list[i].maxSalary == '' || list[i].maxSalary == undefined) {
        wx.showModal({
          content: "Maximum salary cannot be empty.",
          showCancel: false, // 如果不需要取消按钮可以设置为 false
          confirmText: 'Confirm', // 确认按钮的文本
        })
        return
      }
      if (list[i].workTypeSid == "" || list[i].workTypeSid == undefined) {
        wx.showModal({
          content: "Please select your preferred job type",
          showCancel: false, // 如果不需要取消按钮可以设置为 false
          confirmText: 'Confirm', // 确认按钮的文本
        })
        return
      }
    }
    // if (!wx.getStorageSync('Authorization')) return
    wx.showModal({
      title: '',
      content: 'Are you sure you want to add a second job preference?',
      confirmText: 'Cancel',
      cancelText: 'Add',
      confirmColor: '#9EA5B8',
      cancelColor: '#2623D1',
      complete: res => {
        if (res.cancel) {
          this.data.expectations.cardList.push({
            desiredCity: '',
            desiredIndustry: '',
            maxSalary: '',
            minSalary: '',
            tag: []
          });
          this.setData({
            expectations: this.data.expectations,
          });
        }
      },
    });
  },

  shows(e) {

    this.setData({
      show: true,
      index: e.currentTarget.dataset.index
    });
  },

  getexperience() {
    wx._request('/v1/dicts/by-key/workType', 'GET')
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
  onConfirm(event) {
    this.setData({
      [`expectations.cardList[${this.data.index}].workTypeSid`]: event.detail.value.sid,
      [`expectations.cardList[${this.data.index}].workTypeName`]: event.detail.value.memberName,
      show: false,
    });

  },
  onClose() {
    this.setData({
      show: false,
    });
  },

  onFormSubmit(e) {
    let list = this.data.expectations.cardList
    for (let i = 0; i < list.length; i++) {
      if (list[i].desiredCity == '' || list[i].desiredCity == undefined) {
        console.log(22222222);
        wx.showModal({
          content: " Please complete the city where you expect to work",
          showCancel: false, // 如果不需要取消按钮可以设置为 false
          confirmText: 'Confirm', // 确认按钮的文本
        })
        return
      }
      if (list[i].desiredIndustry == '' || list[i].desiredIndustry == undefined) {
        wx.showModal({
          content: "Please complete the job position you expect",
          showCancel: false, // 如果不需要取消按钮可以设置为 false
          confirmText: 'Confirm', // 确认按钮的文本
        })
        return
      }
      if (list[i].minSalary == '' || list[i].minSalary == undefined) {
        wx.showModal({
          content: "Minimum salary cannot be empty.",
          showCancel: false, // 如果不需要取消按钮可以设置为 false
          confirmText: 'Confirm', // 确认按钮的文本
        })
        return
      }
      if (list[i].maxSalary == '' || list[i].maxSalary == undefined) {
        wx.showModal({
          content: "Maximum salary cannot be empty.",
          showCancel: false, // 如果不需要取消按钮可以设置为 false
          confirmText: 'Confirm', // 确认按钮的文本
        })
        return
      }
      if (list[i].workTypeSid == "" || list[i].workTypeSid == undefined) {
        wx.showModal({
          content: "Please select your preferred job type",
          showCancel: false, // 如果不需要取消按钮可以设置为 false
          confirmText: 'Confirm', // 确认按钮的文本
        })
        return
      }
    }



    if (!this.data.sid) {
      // 新增
      wx._request('/v1/expectations', 'POST', this.data.expectations)
        .then(res => {
          if (res.code == 200) {
            wx.showToast({
              title: 'Submitted successfully!',
              icon: 'none',
            });
            wx.navigateBack({
              delta: 1
            })
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
      // 编辑

      delete this.data.expectations.sid;
      wx._request(`/v1/expectations/${this.data.sid}`, 'put', this.data.expectations)
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
  // 处理输入框内容变化
  handleInputChange: function (event) {

    // 更新数据源中的 inputValue
    this.setData({
      [`expectations.cardList[${event.currentTarget.dataset.index}].desiredCity`]: event.detail.value
    });
  },
  // 处理输入框内容变化
  handleInputChange1: function (event) {

    // 更新数据源中的 inputValue
    this.setData({
      [`expectations.cardList[${event.currentTarget.dataset.index}].desiredIndustry`]: event.detail.value
    });
  },
  // 处理输入框内容变化
  handleInputChange2: function (event) {
    let inputValue = event.detail.value;
    // 更新数据源中的 inputValue
    if (/^\d+$/.test(inputValue)) {
      this.setData({
        [`expectations.cardList[${event.currentTarget.dataset.index}].minSalary`]: inputValue
      });
    } else {
      // 如果不符合规则，可以选择清空或者其他处理
      this.setData({
        [`expectations.cardList[${event.currentTarget.dataset.index}].minSalary`]: inputValue.replace(/[^\d]/g, '') // 去掉非数字字符
      });
    }
  },



  // 处理输入框内容变化
  handleInputChange3: function (event) {
    let inputValue = event.detail.value;
    // 更新数据源中的 inputValue
    if (/^\d+$/.test(inputValue)) {
      this.setData({
        [`expectations.cardList[${event.currentTarget.dataset.index}].maxSalary`]: inputValue
      });
    } else {
      // 如果不符合规则，可以选择清空或者其他处理
      this.setData({
        [`expectations.cardList[${event.currentTarget.dataset.index}].maxSalary`]: inputValue.replace(/[^\d]/g, '') // 去掉非数字字符
      });
    }
  },


  onInput(event) {
    const value = event.detail.value;
    if (isNaN(value) || value.trim() === '') {
      wx.showToast({
        title: 'Please Enter a valid number',
        icon: 'none',
        duration: 2000
      });
    }

  }
})