// pages/edu_position/edu_position.js
Page({
  /**
   * 页面的初始数据
   */
  data: {
    sid: null,
    actives: 0,
    fxlist: {},
    actives1: 0,
    isCanDraw: false,
    imgurl: wx._ImgbaseURL,
    CateList: [{
        type: '',
        name: 'ALL'
      },
      {
        type: 1,
        name: 'I added'
      },
      {
        type: 2,
        name: 'I invited'
      }
    ],
    CateList1: [{
      type: 0,
      name: 'Under Review'
    },
    {
      type: 1,
      name: 'Published'
    },
    {
      type: 3,
      name: 'Closed Position'
    }
    ],
    active: 0,
    audit: 0,
    audit2: '',
    user: null,
    params1() {
      return {
        userId: this.data.user.id,
        createType: this.data.audit2
      };
    },
    params2() {
      return {
        audit: this.data.audit,
        objectSid: wx.getStorageSync('user').sid
      };
    },
  },

  clear() {
    this.setData({
      list: [],
      list2: []
    })
  },



  // 点击分类项
  onCateItem1(e) {
    this.clear()

    const index = e.currentTarget.dataset.index;
    this.centerMenuItem(index - 1);
    this.setData({
      audit: e.currentTarget.dataset.sid,
      actives1: e.currentTarget.dataset.index,
    });
    this.paging2.reRequest();
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {},

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow() {
    wx.removeStorageSync('customsid');
    this.setData({
      user: wx.getStorageSync('user')
    })
    this.paging1.reRequest();
    this.paging2.reRequest();
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

  // 下架岗位
  setJobstatus(e) {
    let data = {
      sid: e.currentTarget.dataset.sid,
      type: 5
    }
    wx._request('/v1/job/status', 'put', data)
      .then(res => {
        if (res.code == 200) {
          wx.showToast({
            title: 'Operation successful',
            icon: 'none'
          });
          this.paging2.reRequest();
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
   * 用户点击右上角分享
   */
  onShareAppMessage() {

  },

  onChange(event) {
    this.clear()
    this.setData({
      active: event.detail.index
    })
    if (event.detail.index == 1) {
      this.paging2.reRequest();
    } else if (event.detail.index == 0) {
      this.paging1.reRequest();
    }
  },

  centerMenuItem: function (index) {
    // 将选中的菜单项尽可能居中
    const itemId = `item-${index}`;
    this.setData({
      scrollIntoView: itemId,
    });
  },
  // 点击分类项
  onCateItem(e) {
    this.clear()

    const index = e.currentTarget.dataset.index;
    this.centerMenuItem(index - 1);
    this.setData({
      audit2: e.currentTarget.dataset.sid,
      actives: e.currentTarget.dataset.index,
    });

    this.paging1.reRequest();
  },


  dellist(e) {
    let data = {
      sidList: [e.currentTarget.dataset.sid]
    }
    if (e.detail == 'right') {
      // 收藏
      wx._request(`/v1/job/delete`, 'put', data)
        .then(res => {
          if (res.code == 200) {
            this.paging2.reRequest();
          } else {}
        })
    }
  },

  dellists(e) {
    let sid = e.currentTarget.dataset.sid
    if (e.detail == 'right') {
      // 收藏
      wx._request(`/v1/candidate/${sid}/delete`, 'put')
        .then(res => {
          if (res.code == 200) {
            wx.showToast({
              title: 'Delete successfully!',
              icon: 'none'
            });
            this.paging1.reRequest();
          } else {}
        })
    }
  },

  goinfo(e) {
    // if (e.currentTarget.dataset.sid) {
    if (e.currentTarget.dataset.path == '/pages/rec_myresume/rec_myresume') {
      if (e.currentTarget.dataset.sid) {
        if(e.currentTarget.dataset.status==1){
          if(e.currentTarget.dataset.vip == 0){
            wx.showModal({
              content: 'Your talent addition limit within the membership has been reached. Please remove other resumes to view new ones.',
              showCancel: false, // 如果不需要取消按钮可以设置为 false
              confirmText: 'Confirm', // 确认按钮的文本
            })
          }else{
            wx.showModal({
              content: 'Your talent addition limit has been reached. Please purchase a membership or remove other resumes to view new ones.',
              showCancel: false, // 如果不需要取消按钮可以设置为 false
              confirmText: 'Confirm', // 确认按钮的文本
            })
          }
          return
        }
        wx.setStorageSync('customsid', e.currentTarget.dataset.sid)
        wx.navigateTo({
          url: e.currentTarget.dataset.path
        })
      } else {
        wx._request(`/v1/candidate/save-before`, 'GET')
          .then(res => {
            if (res.code == 200) {
              wx.setStorageSync('customsid', e.currentTarget.dataset.sid)
              wx.navigateTo({
                url: e.currentTarget.dataset.path
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


    } else if (e.currentTarget.dataset.path == '/pages/New_Positions/New_Positions') {
      // if (e.currentTarget.dataset.sid) {
      //   if(e.currentTarget.dataset.status==1){

          

      //     if(e.currentTarget.dataset.vip == 0){
      //       wx.showModal({
      //         content: 'Your job posting limit has been reached，Please try agin tomorrow.              ',
      //         showCancel: false, // 如果不需要取消按钮可以设置为 false
      //         confirmText: 'Confirm', // 确认按钮的文本
      //       })
      //     }else{
      //       wx.showModal({
      //         content: 'Your free job posting limit has been reached. Please purchase a membership for additional postings.',
      //         showCancel: false, // 如果不需要取消按钮可以设置为 false
      //         confirmText: 'Confirm', // 确认按钮的文本
      //       })
      //     }
      //     return
      //   }
      //   wx.navigateTo({
      //     url: e.currentTarget.dataset.path + '?sid=' + e.currentTarget.dataset.sid + '&type=' + e.currentTarget.dataset.type,
      //   })
      // } else {
        wx._request(`/v1/job/save-before`, 'GET')
          .then(res => {
            if (res.code == 200) {
              wx.navigateTo({
                url: e.currentTarget.dataset.path + '?sid=' + e.currentTarget.dataset.sid + '&type=' + e.currentTarget.dataset.type,
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
      // }

    } else {
      if (e.currentTarget.dataset.path == '/pages/cardinfo/cardinfo') {
        if (e.currentTarget.dataset.sid) {
          if(e.currentTarget.dataset.status==1){
            if(e.currentTarget.dataset.vip == 0){
              wx.showModal({
                content: 'Your job posting limit has been reached，Please try agin tomorrow.              ',
                showCancel: false, // 如果不需要取消按钮可以设置为 false
                confirmText: 'Confirm', // 确认按钮的文本
              })
            }else{
              wx.showModal({
                content: 'Your free job posting limit has been reached. Please purchase a membership for additional postings.',
                showCancel: false, // 如果不需要取消按钮可以设置为 false
                confirmText: 'Confirm', // 确认按钮的文本
              })
            }
            return
          }
          wx.navigateTo({
            url: e.currentTarget.dataset.path + '?sid=' + e.currentTarget.dataset.sid + '&type=' + e.currentTarget.dataset.type,
          })
        } else {
          wx._request(`/v1/job/save-before`, 'GET')
            .then(res => {
              if (res.code == 200) {
                wx.navigateTo({
                  url: e.currentTarget.dataset.path + '?sid=' + e.currentTarget.dataset.sid + '&type=' + e.currentTarget.dataset.type,
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
  
      }else{
        wx.navigateTo({
          url: e.currentTarget.dataset.path + '?sid=' + e.currentTarget.dataset.sid + '&type=' + e.currentTarget.dataset.type,
        })
      }
    }
    // } else {
    //   wx.navigateTo({
    //     url: e.currentTarget.dataset.path,
    //     events: {
    //       // 为指定事件添加一个监听器，获取被打开页面传送到当前页面的数据
    //       setlist: (data) => {
    //         this.setData({
    //           list2: data.data,
    //         });
    //       },
    //     },
    //   })
    // }
  },

  postewm() {
    return new Promise((resolve, reject) => {
      wx._request(`/v1/candidate/qrcode`, 'POST')
        .then(res => {
          if (res.code == 200) {
            resolve(res);
            this.setData({
              fxlist: res.data,
              isCanDraw: !this.data.isCanDraw
            })
          } else {
            wx.showModal({
              content: res.msg,
              showCancel: false, // 如果不需要取消按钮可以设置为 false
              confirmText: 'Confirm', // 确认按钮的文本
            })
            reject(res);
          }
        })
        .catch(err => reject(err));
    })
  },

  handleClose() {
    this.setData({
      isCanDraw: !this.data.isCanDraw
    })
  },


  async getUserInfo(e) {
    // let arr = this.data.list2.map(item => item.sid);
    const login = wx._unit.qzz_login()
    if (login == true) {
      // this.setData({
      //   'lists.jobSidList': arr
      // })


      if (e.detail.errMsg === 'getUserProfile:ok') {

        await this.postewm()
        // wx._request(`/v1/job/job-posters?url=pages/cardinfos/cardinfos?sid=${this.data.sid}`, 'POST')
        //   .then(res => {
        //     if (res.code == 200) {
        //       this.setData({
        //         "info.baseerm": res.data,
        //         isCanDraw: !this.data.isCanDraw
        //       })
        //     } else {
        //       wx.showToast({
        //         title: res.msg,
        //         icon: 'none'
        //       });
        //     }
        //   })
        //   .catch(err => {
        //     console.error('请求失败', err);
        //   });
      }
    } else {
      wx.showModal({
        showCancel: false,
        content: 'Please complete your personal resume',
        confirmColor: '#2623d1',
        confirmText: "confirm"
      });
    }
  },

})