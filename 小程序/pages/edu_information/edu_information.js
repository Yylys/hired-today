// pages/information/information.js
Page({
  /**
   * 页面的初始数据
   */
  data: {
    keyboardHeight:0,
    autosize: {
      minHeight: 120,
    },

    infos:{},
    wx_ImgbaseURL: wx._ImgbaseURL,
    imgurl: wx._ImgbaseURL,
    tagName: null,
    deletable: true,
    imgs: [],
    fileList: [],
    sid: null,
    taglist:[],
    form: {
      avatar: null,
      name: null,
      address: null,
      industry: null,
      recruiterList: [],
      imageUrl: [],
      cultureContent: null,
      introContent: null,
    }
  },

  onLineChange(e) {
    console.log('lineCount: ', e.detail);
  },


  onFormSubmit(e) {
if(!this.data.taglist || this.data.taglist.length==0){
  wx.showModal({
    content: "Please complete the company tag",
    showCancel: false, // 如果不需要取消按钮可以设置为 false
    confirmText: 'Confirm', // 确认按钮的文本
  })
  return
}

    this.data.form.imageUrl=[]
    if (this.data.fileList.length > 0) {
      for (let i = 0; i < this.data.fileList.length; i++) {
        this.data.form.imageUrl.push(this.data.fileList[i].path)
      }
    }
    this.setData({
      "form.address": e.detail.value.address,
      "form.name": e.detail.value.name,
      "form.industry": e.detail.value.industry,
      "form.introContent": e.detail.value.introContent,
      "form.cultureContent": e.detail.value.cultureContent,
      "form.imageUrl": this.data.form.imageUrl,
    });
     
    if (!this.data.sid) {
      wx._request('/v1/enterprise', 'POST', this.data.form)
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
      wx._request(`/v1/enterprise/${this.data.sid}`, 'put', this.data.form)
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


  goinfo(e) {
     
    wx.navigateTo({
      url: e.currentTarget.dataset.path + '?images=' + JSON.stringify(e.currentTarget.dataset.item),
      events: {
        // 为指定事件添加一个监听器，获取被打开页面传送到当前页面的数据
        upimage: (data) => {
          this.setData({
            "form.recruiterList": data.data,
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
                 // 监听键盘高度变化
                //  wx.onKeyboardHeightChange((res) => {
                //   console.log('键盘高度变化:', res.height);
                //   this.setData({
                //     keyboardHeight: res.height,
                //   });
                // });
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
      infos:wx.getStorageSync('user')
     })

    this.getTaglist()
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
  // onShareAppMessage() {

  // },


  getinfo() {
    wx._request('/v1/enterprise/me', 'GET')
      .then(res => {
        if (res.code == 200) {
          if(res.data && res.data.img ){
            for (let i = 0; i < res.data.img.length; i++) {
              let data = {
                fileType: "image",
                type: "image",
                url: ""
              }
              data.path =  res.data.img[i].cover
              data.url =this.data.imgurl +res.data.img[i].cover
              this.data.fileList.push(data)
            }
          }

          wx.setStorageSync('userinfo', res.data)
          this.setData({
            "form.avatar": res.data.avatar,
            "form.address": res.data.address,
            "form.industry": res.data.industry,
            "form.name": res.data.name,
            "form.recruiterList": res.data.recruiterList,
            "form.cultureContent": res.data.cultureContent,
            "form.introContent": res.data.introContent,
            taglist: res.data.tag,
            sid: res.data.sid,
            fileList:this.data.fileList
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

  delimg(event) {
     
    this.data.fileList.splice(event.detail.index, 1);
    this.setData({
      fileList: this.data.fileList
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

  settag(e) {
     
    if (!e.currentTarget.dataset.data) {
      wx.showToast({
        title: "Please fill in correctly",
        icon: 'none'
      });
      return
    }
    wx._request("/v1/tag/create-tag", 'POST' ,{
      sid:this.data.infos.sid,
      tagName:e.currentTarget.dataset.data,
      type:2
    })
      .then(res => {
        if (res.code == 200) {
          wx.showToast({
            title: 'New successfully added',
            icon: 'none',
          });
          this.setData({
            tagName:null
          })
          this.getTaglist()
        } else {
          wx.showModal({
            content: res.msg,
            showCancel: false, // 如果不需要取消按钮可以设置为 false
            confirmText: 'Confirm', // 确认按钮的文本
          })
        }
      })

  },
  deltag(e) {
     
    // return
    wx._request(`/v1/tag/${ e.currentTarget.dataset.sid}/delete`, 'PUT')
      .then(res => {
        if (res.code == 200) {
           
          wx.showToast({
            title: 'Deletion success！',
            icon: 'none',
          });
          this.getTaglist()
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
       
      // 更新数据源中的 inputValue
      this.setData({
        tagName: event.detail.value
      });
    },


    

})