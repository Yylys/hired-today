// pages/information/information.js
Page({
  /**
   * 页面的初始数据
   */
  data: {
    infos: {},
    wx_ImgbaseURL: wx._ImgbaseURL,
    imgurl: wx._ImgbaseURL,
    tagName: null,
    skllName: null,
    deletable: true,
    imgs: [],
    fileList: [],
    fileList1: [],
    sid: null,
    form: {
      avatar: null,
      name: null,
      email: null,
      phone: null,
      address: null,
      weChat: null,
      imageUrl: [],
      certificateUrl: [],
      infoTag: [],
      skillTag: []
    }
  },


  onFormSubmit(e) {
    if (this.data.fileList.length > 0) {
      for (let i = 0; i < this.data.fileList.length; i++) {
        this.data.form.imageUrl.push(this.data.fileList[i].path)
      }
      this.data.fileList = []
    }
    if (this.data.fileList1.length > 0) {
      for (let i = 0; i < this.data.fileList1.length; i++) {
        this.data.form.certificateUrl.push(this.data.fileList1[i].path)
      }
      this.data.fileList1 = []
    }
    this.setData({
      "form.email": e.detail.value.email,
      "form.name": e.detail.value.name,
      "form.phone": e.detail.value.phone,
      "form.weChat": e.detail.value.weChat,
      "form.address": e.detail.value.address,
      "form.imageUrl": this.data.form.imageUrl,
      "form.certificateUrl": this.data.form.certificateUrl,
    });
    // return
    if (!this.data.sid) {
      wx._request('/v1/headhunter', 'POST', this.data.form)
        .then(res => {
          if (res.code == 200) {
            this.getinfo()
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
      wx._request(`/v1/headhunter/${this.data.sid}`, 'put', this.data.form)
        .then(res => {
          if (res.code == 200) {
            this.getinfo()
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


  // goinfo(e) {
  //    
  //   wx.navigateTo({
  //     url: e.currentTarget.dataset.path + '?images=' + JSON.stringify(e.currentTarget.dataset.item),
  //     events: {
  //       // 为指定事件添加一个监听器，获取被打开页面传送到当前页面的数据
  //       upimage: (data) => {
  //         this.setData({
  //           "form.recruiterList": data.data,
  //         });
  //       },
  //     },
  //   })
  // },


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
    this.getinfo()
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow() {
    this.setData({
      infos: wx.getStorageSync('user')
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
    wx._request('/v1/headhunter/me', 'GET')
      .then(res => {
        if (res.code == 200) {
          const list=wx._unit.updateForm(this.data.form,res.data,['certificateUrl','imageUrl'])
          this.setData({
            form:list
          })
          if (res.data.imageUrl) {
            for (let i = 0; i < res.data.imageUrl.length; i++) {
              let data = {
                fileType: "image",
                type: "image",
                url: ""
              }
              data.path = res.data.imageUrl[i].cover
              data.url = this.data.imgurl + res.data.imageUrl[i].cover
              this.data.fileList.push(data)
            }
          }
          if (res.data.certificateUrl) {
            for (let i = 0; i < res.data.certificateUrl.length; i++) {
              let data = {
                fileType: "image",
                type: "image",
                url: ""
              }
              data.path = res.data.certificateUrl[i].cover
              data.url = this.data.imgurl + res.data.certificateUrl[i].cover
              this.data.fileList1.push(data)
            }
          }

          if(res.data && res.data.sid){
            wx.setStorageSync('userinfo', res.data)
            this.setData({
              // "form.avatar": res.data.avatar,
              // "form.email": res.data.email,
              // "form.phone": res.data.phone,
              // "form.weChat": res.data.weChat,
              // "form.address": res.data.address,
              // "form.name": res.data.name,
              // "form.recruiterList": res.data.recruiterList,
              // "form.infoTag": res.data.infoTag ? res.data.infoTag : [],
              // "form.skillTag": res.data.skillTag ? res.data.skillTag : [],
              taglist: res.data.tag,
              sid: res.data.sid,
              fileList: this.data.fileList,
              fileList1: this.data.fileList1
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

  delimg(event) {

    this.data.fileList.splice(event.detail.index, 1);
    this.setData({
      fileList: this.data.fileList
    })
  },

  delimg1(event) {

    this.data.fileList1.splice(event.detail.index, 1);
    this.setData({
      fileList1: this.data.fileList1
    })
  },

  // setdatas() {
  //   const eventChannel = this.getOpenerEventChannel()
  //   for (let i = 0; i < this.data.fileList.length; i++) {
  //     this.data.imgs.push({
  //       cover: this.data.fileList[i].url,
  //       type:4
  //     })
  //   }
  //   eventChannel.emit('setimgs', {
  //     data: this.data.imgs
  //   });
  //   wx.navigateBack({
  //     delta: 1
  //   })
  // },

  afterRead(event) {
    const filelist = this.data.fileList
    const {
      file
    } = event.detail;
    // 当设置 mutiple 为 true 时, file 为数组格式，否则为对象格式

    wx.uploadFile({
      url: wx._baseURL + '/v1/resources/public', // 仅为示例，非真实的接口地址
      filePath: file.url,
      name: 'file',
      // formData: {
      //   user: 'test'
      // },
      success: (res) => {
        // 上传完成需要更新 fileList
        const data = JSON.parse(res.data);
        filelist.push({
          ...file,
          url: wx._ImgbaseURL + data.data.url,
          path: data.data.url
        });
        this.setData({
          fileList: filelist
        });
      },
    });
  },
  afterRead1(event) {
    const filelist = this.data.fileList1

    const {
      file
    } = event.detail;

    // 当设置 mutiple 为 true 时, file 为数组格式，否则为对象格式
    wx.uploadFile({
      url: wx._baseURL + '/v1/resources/public', // 仅为示例，非真实的接口地址
      filePath: file.url,
      name: 'file',
      // formData: {
      //   user: 'test'
      // },
      success: (res) => {
        // 上传完成需要更新 fileList
        const data = JSON.parse(res.data);
        filelist.push({
          ...file,
          url: wx._ImgbaseURL + data.data.url,
          path: data.data.url
        });
        this.setData({
          fileList1: filelist
        });
      },
    });
  },


  settag(e) {
    if (!e.currentTarget.dataset.data) {
      wx.showToast({
        title: "Please fill in correctly",
        icon: 'none'
      });
      return
    }
    if (this.data.form.infoTag && this.data.form.infoTag.length == 6) {
      wx.showToast({
        title: "Add up to six tags",
        icon: 'none'
      });
      return
    }
    this.data.form.infoTag.push(e.currentTarget.dataset.data)
    this.setData({
      "form.infoTag": this.data.form.infoTag,
      tagName: null
    })
    wx.showToast({
      title: 'New successfully added',
      icon: 'none',
    });
  },

  deltag(e) {
    this.data.form.infoTag.splice(e.currentTarget.dataset.sid, 1);
    this.setData({
      "form.infoTag": this.data.form.infoTag,
    })
    wx.showToast({
      title: 'Deletion success！',
      icon: 'none',
    });
  },

  settag1(e) {
    if (!e.currentTarget.dataset.data) {
      wx.showToast({
        title: "Please fill in correctly",
        icon: 'none'
      });
      return
    }
    if (this.data.form.skillTag.length == 6) {
      wx.showToast({
        title: "Add up to six tags",
        icon: 'none'
      });
      return
    }


    this.data.form.skillTag.push(e.currentTarget.dataset.data)
    this.setData({
      "form.skillTag": this.data.form.skillTag,
      skllName: null
    })
    wx.showToast({
      title: 'New successfully added',
      icon: 'none',
    });
  },

  deltag1(e) {
    this.data.form.skillTag.splice(e.currentTarget.dataset.sid, 1);
    this.setData({
      "form.skillTag": this.data.form.skillTag,
    })
    wx.showToast({
      title: 'Deletion success！',
      icon: 'none',
    });
  },

  getTaglist() {
    wx._request(`/v1/tag/${this.data.infos.sid}/all`, 'GET')
      .then(res => {
        if (res.code == 200) {

          this.setData({
            taglist: res.data
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

  // 处理输入框内容变化
  handleInputChange: function (event) {

    // return

    // if(event.detail.value.length<=20){
    //    
    const title = event.currentTarget.dataset.title
    this.setData({
      [title]: event.detail.value
    });
    // }else{
    //   wx.showToast({
    //     title: 'Can only input<20 characters',
    //     icon: 'none'
    //   });
    // }
    // 更新数据源中的 inputValue

  },

})