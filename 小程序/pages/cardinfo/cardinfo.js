// pages/cardinfo/cardinfo.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    imgurl: wx._ImgbaseURL,
    imageUrls: [],
    info: {},
    user: null,
    show: false,
    isCanDraw: false,
    sid: null,
    content: null,
    getUserInfo:null
  },
  getUserInfo(e) {
    const login = wx._unit.qzz_login()
    if (login == true) {
      if (e.detail.errMsg === 'getUserInfo:ok') {
        wx._request(`/v1/job/job-posters?url=pages/cardinfos/cardinfos?sid=${this.data.sid}`, 'POST')
          .then(res => {
            if (res.code == 200) {
              this.setData({
                "info.baseerm": res.data,
                isCanDraw: !this.data.isCanDraw
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
      }
    } else{
      wx.showModal({
        showCancel: false,
        content: 'Please complete your personal resume',
        confirmColor: '#2623d1',
        confirmText: "confirm"
      });
    }
  },
  getinfo(sid) {
    wx._request(`/v1/job/${sid}/job-info`,'GET')
      .then(res => {
        if (res.code == 200) {
          if(res.data.audit==3){
            wx.showModal({
              content: 'The position is closed.',
              showCancel: false, // 如果不需要取消按钮可以设置为 false
              confirmText: 'Confirm', // 确认按钮的文本
              success: function(res) {
                if (res.confirm) {
                  // 用户点击了确认按钮，返回上一页
                  wx.navigateBack({
                    delta: 1  // delta: 1 表示返回上一页
                  });
                }
              }
            });
          }
          res.data.minprice = (res.data.minSalary / 1000).toFixed(0)
          res.data.maxprice = (res.data.maxSalary / 1000).toFixed(0)
          if(res.data.content && res.data.content.length>0){
            // res.data.content =JSON.stringify()  res.data.content.split('↵').join('<br/>').;
          }
          this.setData({
            info: res.data
          })
          if(wx.getStorageSync('user').roleKeySet[0]=='recruiter' && res.data.recruiter==1 ){
            if(this.data.user.sid!=res.data.headhunterResultDTO.sid){
              wx.showModal({
                content: 'Sorry, this position is not open toheadhunters.',
                showCancel: false, // 如果不需要取消按钮可以设置为 false
                confirmText: 'Confirm', // 确认按钮的文本
              })
            }
          }
        } else {
          wx.showModal({
            content: res.msg,
            showCancel: false, // 如果不需要取消按钮可以设置为 false
            confirmText: 'Confirm', // 确认按钮的文本
            success: function(res) {
              if (res.confirm) {
                // 用户点击了确认按钮，返回上一页
                wx.navigateBack({
                  delta: 1  // delta: 1 表示返回上一页
                });
              }
            }
          });
        }
      })
      .catch(err => {
        console.error('请求失败', err);
      });
  },
  getrwm() {
    wx._request(`/v1/job/job-posters?url=pages/cardinfos/cardinfos?sid=${this.data.sid}`, 'POST')
      .then(res => {
        if (res.code == 200) {
          this.setData({
            "info.baseerm": res.data,
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
  },



  handleClose() {
    this.setData({
      isCanDraw: !this.data.isCanDraw
    })
  },
  onShareAppMessage(options) {
    return {
      title: '分享标题',
      path: '/pages/cardinfo/cardinfo', // 分享后打开的页面路径
      imageUrl: 'https://example.com/share-image.png', // 分享时显示的图片
      success: function () {
        // 分享成功
      },
      fail: function () {
        // 分享失败
      }
    }
  },
  // 处理输入框内容变化
  bindTextAreaBlur: function (event) {
    this.setData({
      content: event.detail.value
    });
  },
  closepops() {
    this.setData({
      show: false,
    })
  },
  closepop() {
     
    let data = {}
    // if (this.data.content) {
      data.sid = this.data.sid,
        data.content = this.data.content,
        data.userCandidateSid = this.data.user.sid
    // } else {
    //   data.sid = this.data.sid
    //   userCandidateSid = this.data.user.sid
    // }
     
    wx._request("/v1/job/job-delivery", 'POST', data)
      .then(res => {
        if (res.code == 200) {
          wx.showToast({
            title: 'Application successful',
            icon: 'none'
          });
          this.getinfo(this.data.sid)
          this.setData({
            show: false,
          })
          this.getinfo(this.data.sid)
        } else {
          wx.showModal({
            content: res.msg,
            showCancel: false, // 如果不需要取消按钮可以设置为 false
            confirmText: 'Confirm', // 确认按钮的文本
          })
        }
      })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
     
    this.setData({
      sid: options.sid
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
    if(wx.getStorageSync('user')){
      this.setData({
        getUserInfo:wx.getStorageSync('user'),
      })
    }
    this.setData({
      user: wx.getStorageSync('userinfo'),
      // getUserInfo:wx.getStorageSync('user'),
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

  goinfo(e) {
    if(e.currentTarget.dataset.sid){
      wx.navigateTo({
        url: e.currentTarget.dataset.path + '?sid=' + e.currentTarget.dataset.sid,
      })
    }else{
      wx.navigateTo({
        url: e.currentTarget.dataset.path,
      })
    }
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

  showPopup() {
    const login = wx._unit.qzz_logins()
    if (login == true) {
      this.setData({
        show: true
      });
    }
     
  
  },

  onClose() {
    this.setData({
      show: false
    });
  },

  // 收藏
  save(e) {
    wx._request(`/v1/job/${ e.currentTarget.dataset.data.sid}/preference`,'POST')
      .then(res => {
        if (res.code == 200) {
          if (e.currentTarget.dataset.data.isCollection == true) {
            wx.showToast({
              title: 'Cancel collection！',
              icon: 'none',
            });
          } else {
            wx.showToast({
              title: 'Collection successful！',
              icon: 'none',
            });
          }
          this.getinfo(this.data.sid)
        } else {}
      })
  },

  previewImage(e) {
    this.setData({
      imageUrls: []
    })
    // 使用 map 提取 sid
    const arr = e.currentTarget.dataset.item.map(item => this.data.imgurl + item.cover);
     
    this.setData({
      imageUrls: arr
    })
    wx.previewImage({
      // current: 2, // 当前显示图片的http链接
      urls: this.data.imageUrls // 需要预览的图片http链接列表
    });
  },
})