// components/index/me/me.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    infos: {
      type: Object,
      value: {}
    }
  },
  /**
   * 组件的初始数据
   */
  data: {
    wx_ImgbaseURL: wx._ImgbaseURL,
    // userinfos: {},
    show: false,
    list: [{
      icon: "/static/imgs/me/Icon@2x-2.png",
      name: "My Resume",
      path: "/pages/myresume/myresume"
    }, {
      icon: "/static/imgs/me/Icon@2x.png",
      name: "My Job Applications",
      path: "/pages/Jobrecord/Jobrecord"
    }, {
      icon: "/static/imgs/me/Icon@2x-3.png",
      name: "Interview Schedule",
      path: "/pages/schedule/schedule"
    }, {
      icon: "/static/imgs/me/组 711267@2x.png",
      name: "Favorite Events",
      path: "/pages/Favoriteevents/Favoriteevents"
    }, {
      icon: "/static/imgs/me/组 711119@2x.png",
      name:"Provide Feedback",
      path: "/pages/Feedback/Feedback"
    }, {
      icon: "/static/imgs/me/组 711120@2x.png",
      name: "Online Support",
    }, {
      icon: "/static/imgs/me/Icon@2x-4.png",
      name: "Job Hunting Instructions",
      path: "/pages/user_xy/user_xy",
      type: 16
    }, {
      icon: "/static/imgs/me/Icon@2x-5.png",
      name: "About Us",
      path: "/pages/user_xy/user_xy",
      type: 15
    }, {
      icon: "/static/imgs/me/Icon@2x-6.png",
      name: "Platform Agreement",
      path: "/pages/user_xy/user_xy",
      type: 2
    }, {
      icon: "/static/imgs/me/pass.jpg",
      name: "Reset Password",
      path: "/pages/res_login/res_login",
    }, {
      icon: "/static/imgs/me/out.jpg",
      name: "Log Out",
      path: "/pages/login/login",
      type: 2
    }
]
  },
  /**
   * 组件的方法列表
   */
  methods: {
    goinfo(e) {
      const login = wx._unit.qzz_login()
       
       
      if(e.currentTarget.dataset.path == '/pages/login/login'){
        wx.removeStorageSync('user')
        wx.removeStorageSync('userinfo')
        wx.removeStorageSync('token')
        wx.removeStorageSync('info')
        wx.navigateTo({
          url: e.currentTarget.dataset.path
        })
      }else{
        if (login == false && e.currentTarget.dataset.path == '/pages/information/information') {
          wx.navigateTo({
            url: e.currentTarget.dataset.path
          })
        } else if (login == true) {
          if (e.currentTarget.dataset.type == undefined) {
            wx.navigateTo({
              url: e.currentTarget.dataset.path
            })
          } else {
             
            wx.navigateTo({
              // url: `${e.currentTarget.dataset.path}type=${e.currentTarget.dataset.type}`
              url: '/pages/user_xy/user_xy?type=' + e.currentTarget.dataset.type,
            })
          }
        }
        else{
          wx.showModal({
            showCancel: false,
            content: 'Please complete your personal resume',
            confirmColor: '#2623d1',
            confirmText: "confirm"
          });
        }
      }
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

    Refresh() {
      wx._request('/v1/candidate/flushed', 'GET')
        .then(res => {
          if (res.code == 200) {
            wx.showToast({
              title: 'Refresh successful',
              icon: 'none'
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



    paywx() {
      let userinfo = wx.getStorageSync('userinfo')
       
      if (!userinfo) {
        wx.showToast({
          title: "Please complete your personal resume",
          icon: 'none'
        });
        return
      }
      let data = {
        payType: 2,
      }
      wx._request('/v1/pay/wx-pay', 'POST', data)
        .then(res => {
          if (res.code == 200) {
            if (res.data.signType == 'RSA') {
              wx.requestPayment({
                timeStamp: res.data.timeStamp, // 生成时间戳
                nonceStr: res.data.nonceStr, // 生成随机字符串
                package: res.data.package, // 预支付交易会话标识
                signType: res.data.signType, // 签名方式
                paySign: res.data.paySign, // 签名
                success: (res) => {
                  // 支付成功回调
                  this.getinfo()
                   
                },
                fail(res) {
                  // 支付失败回调
                  wx.showToast({
                    title: res.msg,
                    icon: 'none'
                  });
                   
                }
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
    },




  },
  ready() {
    // this.getVip()
  },
  attached() {
    // 组件被添加到页面时调用
    // this.getinfo()
  },
})