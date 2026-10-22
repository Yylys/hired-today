// pages/Enterprise/Enterprise.js
Page({
  /**
   * 页面的初始数据
   */
  data: {
    num:0,
    activeNames:['1','2','3','4','5','6'],
    userinfos:{
      Vip:{},
      infos:{}
    },
    post_active: 0,
    recruiter: '',
    titles: ['All jobs', 'Recommended'],
    min: 0,
    max: 60,
    show: false,
    degreeSid: '',
    experienceSid: '',
    jobStatus: '',
    countriesSid: '',
    countriesName: null,
    contentHeight: 0,
    topHeight:0,
    currentTab: 0,
    minSalary:'',
    maxSalary:"",
    imgurl: wx._ImgbaseURL,
    CateList: [],
    CateList2: [],
    degreeList: [],
    ExperienceList: [],
    TalentsList: [],
    jobList: [{
        sid: 0,
        memberName: 'Resignation - Arrive at any time'
      },
      {
        sid: 1,
        memberName: 'On the job - Arrive within the month'
      }, {
        sid: 2,
        memberName: 'Employed - Consider Opportunities'
      },
      {
        sid: 4,
        memberName: 'Employed - not considered yet'
      }
    ],
    sid: null,
    collsid: null,
    Talentsid: null,
    actives: '',
    active2:0,
    actives1: '',
    actives2: '',
    actives3: '',
    params1() {
      return {
        classifySid: this.data.sid,
        status: 0
      };
    },
    params2() {
      return {
        workSid: this.data.Talentsid,
        status: 0,
        degreeSid: this.data.degreeSid,
        experienceSid: this.data.experienceSid,
        minAge: this.data.min,
        maxAge: this.data.max,
        minSalary:this.data.minSalary,
        maxSalary:this.data.maxSalary,
        countrySid: this.data.countriesSid,
        jobStatus: this.data.jobStatus
      };
    },
    params3() {
      return {
        classifySid: this.data.collsid,
        status: 0
      };
    },
    params4() {
      return {
        recruiter: this.data.recruiter,
        audit:1,
        recruiter:0
      };
    },
  },

  clear(){
    this.setData({
      list:[],
      list2:[],
      list3:[],
      list4:[],
    })
  },

  // 处理菜单切换
  handleTabChange(e) {
    this.clear()
    let currnet = e.detail.index;
    if (currnet == undefined) return;
    this.setData({
      currentTab: currnet
    })
    if (currnet == 2) {
      this.getactivity()
      this.getactivity2()
    } else if (currnet == 1) {
      this.getTalents()
    } else if (currnet == 3) {
       
      this.message.reRequest()
    }else if(currnet == 4){
      this.getinfos()
      this.getVip()
    }else{
      this.post.reRequest()
    }

    this.getnum()
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    // this.post.reRequest()
    this.getdegree()

    this.getnum()
    this.getExperience()
    const systemInfo = wx.getSystemInfoSync();
     
    const windowHeight = systemInfo.windowHeight;
    const statusBarHeight = systemInfo.statusBarHeight
    const fixedHeight = 240; // 固定高度
    const navBarHeight = 46; // 自定义导航栏高度，通常为 44px 或根据实际情况调整
    this.setData({
      contentHeight: windowHeight - fixedHeight,
      topHeight: statusBarHeight + navBarHeight
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
    this.post.reRequest()
    // this.getTalents()
    // this.message.reRequest()
    this.getinfos()
    this.getVip()
    this.getnum()
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

  // 刷新消息数据
  upmessage(){
    this.message.reRequest()
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage(res) {
     
        let path = "/pages/collList/collList?sid="+ res.target.dataset.id ;
        let title = res.target.dataset.title;
         
        // if (res && res.target) {
        //     let pid = res.target.dataset.pid;
        //     let product_id = res.target.dataset.product_id;
        //     if (pid) {
        //         path = '/pages/cls/pdcList/Index?pid=' + pid + '&product_id=' + product_id + '&uid=' + getApp()
        //             .globalData.userInfo.uid;
        //         title = "您的朋友向你推荐了一款鲜花"
        //     }
        // }
        // const promise = new Promise(resolve => {
        //   setTimeout(() => {
        //     resolve({
        //       title: '自定义转发标题'
        //     })
        //   }, 2000)
        // })
        return {
            title: title,
            path: path,
            // promise 
        }

  },
  onChange(event) {

    if(event.detail.name==0){
       
      // this.paging.reRequest();
      this.getactivity()
    }else{
      this.getactivity2()
    }
    this.setData({
      active2: event.detail.name,
    });
  },
  centerMenuItem: function (index) {
    // 将选中的菜单项尽可能居中
    const itemId = `item-${index}`;
    this.setData({
      scrollIntoView: itemId,
    });
  },
  // 点击分类项
  onCateItem1(e) {
    this.clear()
     
    const index = e.currentTarget.dataset.index;
    this.centerMenuItem(index - 1);
    this.setData({
      Talentsid: e.currentTarget.dataset.sid,
      actives1: e.currentTarget.dataset.index,
    });
    this.paging2.reRequest();
  },
  // 点击分类项
  onCateItem(e) {
    this.clear()
     
    const index = e.currentTarget.dataset.index;
    this.centerMenuItem(index - 1);
    this.setData({
      sid: e.currentTarget.dataset.sid,
      actives: e.currentTarget.dataset.index,
    });
    this.paging.reRequest();
  },

  onCateItem2(e) {
    this.clear()
     
    const index = e.currentTarget.dataset.index;
    this.centerMenuItem(index - 1);
    this.setData({
      collsid: e.currentTarget.dataset.sid,
      actives3: e.currentTarget.dataset.index,
    });
    this.collection.reRequest();
  },

  goinfo(e) {
    wx.navigateTo({
      url: e.currentTarget.dataset.path + '?sid=' + e.currentTarget.dataset.sid,
    })
  },
  getnum(){
    this.request({url:'/v1/message/unread', method:'GET'})
    .then(res => {
      if (res.code == 200) {
        this.setData({
          num:res.data
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
  getactivity() {
    this.clear()
    this.request({url:'/v1/dicts/by-key/activity', method:'GET'})
      .then(res => {
        if (res.code == 200) {
          this.setData({
            CateList: res.data,
            sid: res.data[0].sid,
            actives:0
          })
          this.paging.reRequest();
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
  getTalents() {
    this.request({url:'/v1/dicts/by-key/workType', method:'GET'})
      .then(res => {
        if (res.code == 200) {
          let data=[{sid:'', memberName:'ALL'}]
          this.setData({
            TalentsList: [...data, ...res.data],
            Talentsid: '',
            actives1: 0
          })
          this.paging2.reRequest()
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
  getactivity2() {
    this.clear()
    this.request({url:'/v1/dicts/by-key/job_collection', method:'GET'})
      .then(res => {
        if (res.code == 200) {
          this.setData({
            CateList2: res.data,
            collsid: res.data[0].sid,
            actives3:0
          })
          this.collection.reRequest();
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


  goinfos() {
    wx.navigateTo({
      url: "/pages/location/location",
      events: {
        // 为指定事件添加一个监听器，获取被打开页面传送到当前页面的数据
        acceptDataFromOpenedPage: (data) => {
           
          this.setData({
            countriesSid: data.data.sid,
            countriesName: data.data.countriesName,
          });
        },
      },
    })
  },

  getAge(e) {
     
    if( e.detail.min>=0){
      this.setData({
        min: e.detail.min,
      })
    }else{
      this.setData({
        max: e.detail.max,
      })

    }

  },

  showPopup() {
    this.setData({
      show: true
    });
  },
  gosearch() {
    wx.navigateTo({
      url: '/pages/historySearch/index',
    })
  },

  onClose() {
    this.setData({
      show: false
    });
  },

  onChanges(event) {
     
    this.setData({
      activeNames: event.detail,
    });
  },

  onChanges1(event) {
     
    this.setData({
      degreeSid: event.detail,
    });
  },

  onChanges2(event) {
     
    this.setData({
      experienceSid: event.detail,
    });
  },

  onChanges3(event) {
     
    this.setData({
      jobStatus: event.detail,
    });
  },
  onChanges4(event) {
     
    this.setData({
      Talentsid: event.detail,
    });
  },




  getdegree() {
    wx._request('/v1/dicts/by-key/degree', 'GET')
      .then(res => {
        if (res.code == 200) {
          this.setData({
            degreeList: res.data,
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

  getExperience() {
    wx._request('/v1/dicts/by-key/Experience', 'GET')
      .then(res => {
        if (res.code == 200) {
          this.setData({
            ExperienceList: res.data,
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

  setsearch() {
    this.paging2.reRequest();
    this.setData({
      show:false
    })
  },

  // 处理输入事件
  handleInput(event) {
    const title = event.currentTarget.dataset.title
    const value = event.detail;
    this.setData({
      [title]: value
    });
  },

  Reset(){
    this.setData({
      degreeSid: '',
      experienceSid: '',
      min: 0,
      max: 60,
      countrySid: '',
      jobStatus: '',
      minSalary:'',
      maxSalary:'',
      countriesName: null,
      countriesSid:'',
    }) 
  },

  Changepost(event) {
    this.clear()
     
    this.setData({
      post_active: event.detail.index
    })
    if (event.detail.title == 'All jobs') {
      this.setData({
        recruiter: '',
      })
    } else if (event.detail.title == 'Recommended') {
       
      this.setData({
        recruiter: 1,
      })
    }
    this.post.reRequest()
  },
  getinfos() {
    this.request({url:'/v1/headhunter/me',method:'GET'})
      .then(res => {
        if (res.code == 200) {
          if(res.data.sid){
            wx.setStorageSync('userinfo', res.data)
          }
          this.setData({
            "userinfos.infos": res.data
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

  getVip() {
    this.request({url:'/v1/vip/headhunter',method: 'GET'})
      .then(res => {
        if (res.code == 200) {
          this.setData({
            "userinfos.Vip": res.data
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