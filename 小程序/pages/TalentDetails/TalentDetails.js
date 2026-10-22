// pages/TalentDetails/TalentDetails.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    type: null,
    userKey: null,
    show: false,
    shows: false,
    userinfo: null,
    infos: null,
    imgurl: wx._ImgbaseURL,
    active: 0,
    getUserInfo: null,
    num: null,
    imageUrls: [],
    sid: null,
    jobsid: null,
    candidateSid: null,
  },

  onChange(event) {
    // wx.showToast({
    //   title: `切换到标签 ${event.detail.name}`,
    //   icon: 'none',
    // });
  },
  closepop() {
    this.setData({
      shows: false,
    })
  },



  save(e) {
    wx._request(`/v1/resume/${ e.currentTarget.dataset.data.candidate.sid}/preference`, 'POST')
      .then(res => {
        if (res.code == 200) {
          if (e.currentTarget.dataset.data.isCollection == true) {
            wx.showToast({
              title: 'Cancel Collection！',
              icon: 'none',
            });
          } else {
            wx.showToast({
              title: 'Collection Successful！',
              icon: 'none',
            });
          }
          this.getinfo(this.data.sid)
        } else {}
      })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    this.setData({
      sid: options.sid,
      userKey: wx.getStorageSync('user').roleKeySet[0]
    })
    if (options.type) {
      if (options.type == 1) {
        wx.showModal({
          showCancel: false,
          content: 'You have sent an interview invitation to the candidate. Please wait for the candidate to confirm. Confirmed interviews can be viewed in the interview schedule.Wishing you success in finding the right candidate!',
          confirmColor: '#2623d1',
          confirmText: "confirm"
        });
      }
      this.setData({
        type: options.type,
      })
    }
    if (options.jobsid) {
      this.setData({
        jobsid: options.jobsid
      })
      this.getcontent(options.sid, options.jobsid)
    }

  },





  getcontent(sid, jobsid) {
    let data = {
      jobSid: jobsid,
      userSid: sid
    }
    wx._request('/v1/job/received-content', 'GET', data)
      .then(res => {
        if (res.code == 200) {
          if (res.data.hasOwnProperty('content')) {
            this.setData({
              infos: res.data,
              show: true
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


  getinfo(sid) {
    wx._request(`/v1/candidate/${sid}/candidate-info`, 'GET')
      .then(res => {
        if (res.code == 200) {
          this.setData({
            info: res.data,
            candidateSid: res.data.sid
          });
          this.getuserinfo(res.data.sid)
          // if(res.data.content){
          //   wx.showModal({
          //     showCancel: false,
          //     content: res.data.content,
          //     confirmColor:'#2623d1',
          //     confirmText:"confirm"
          //   });
          // }
          if (res.data.promptMessage) {
            wx.showModal({
              content: res.data.promptMessage,
              showCancel: false, // 如果不需要取消按钮可以设置为 false
              confirmText: 'Confirm', // 确认按钮的文本
            })
          }
        } else if (res.code == 500) {
          let that = this;
          wx.showModal({
            title: '',
            content: res.msg,
            confirmColor: '#2623d1',
            showCancel: true,
            confirmText: 'Edit Now',
            cancelText: 'Later',
            success(res) {
              if (res.confirm) {
                if (that.data.getUserInfo.roleKeySet[0] == 'employer') {
                  wx.reLaunch({
                    url: '/pages/edu_information/edu_information',
                  })
                } else {
                  wx.reLaunch({
                    url: '/pages/rec_information/rec_information',
                  })
                }
              } else {
                wx.navigateBack()
              }
            },
          });


          // wx.showModal({
          //   content: res.msg,
          //   showCancel: false, // 如果不需要取消按钮可以设置为 false
          //   confirmText: 'Confirm', // 确认按钮的文本
          // })
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

  getuserinfo(sid) {
    wx._request(`/v1/resume/${sid}/me`, 'GET')
      .then(res => {
        if (res.code == 200) {
          this.setData({
            userinfo: res.data
          });
          if (res.data.images && res.data.images.lengt > 0) {
            for (let i = 0; i <= res.data.images.length; i++) {
              this.data.imageUrls.push(res.data.images[i].cover)
              this.setData({
                userinfo: res.data,
                imageUrls: this.data.imageUrls,
                num: res.data.images.length - 2
              });
            }
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

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow() {
    if (!wx.getStorageSync('userinfo').name) {
      wx.showModal({
        title: '',
        content: 'To view the talent resumes, you need to complete the company information first.',
        confirmText: 'Edit now',
        cancelText: 'Later',
        cancelColor: '#9EA5B8',
        confirmColor: '#2623D1',
        complete: res => {
          if (res.cancel) {
            wx.navigateBack({
              delta: 1
            });
          }
          if (res.confirm) {
            if (this.data.getUserInfo.roleKeySet[0] == 'employer') {
              wx.navigateTo({
                url: '/pages/edu_information/edu_information',
              })
            } else {
              wx.navigateTo({
                url: '/pages/rec_information/rec_information',
              })
            }
          }
        },
      });
    } else {
      this.getinfo(this.data.sid)
    }

    if (wx.getStorageSync('user')) {
      this.setData({
        getUserInfo: wx.getStorageSync('user'),
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
  previewImage(e) {
    this.setData({
      imageUrls: []
    })
    // 使用 map 提取 sid
    const arr = e.currentTarget.dataset.item.map(item => item.cover);

    this.setData({
      imageUrls: arr
    })
    wx.previewImage({
      // current: 2, // 当前显示图片的http链接
      urls: this.data.imageUrls // 需要预览的图片http链接列表
    });
  },
  goyq() {
    wx._request('/v1/job/page', 'GET', {
        objectSid: this.data.candidateSid,
        audit: 1
      })
      .then(res => {
        if (res.data.total == 0) {
          wx.showModal({
            content: "Please publish a job first!",
            showCancel: false, // 如果不需要取消按钮可以设置为 false
            confirmText: 'Confirm', // 确认按钮的文本
          })
        } else {
          wx.navigateTo({
            url: '/pages/interview/interview?sid=' + this.data.candidateSid,
          })
        }
      })



  },
  showPopup() {
    this.setData({
      show: true
    });
  },


  onClose() {
    this.setData({
      show: false
    });
  },
})