import {
  themeColor
} from './config';
const config = require('../utils/config');
module.exports = Behavior({
  data: {
    host: config.baseURL,
    imgHost: config.ImgbaseURL,
    userInfo: null,
    allow_jump: true, //为false时不可跳转至登录，节流 防止多次跳转
  },
  pageLifetimes: {
    show: function () {
      const userInfo = getApp().globalData.userInfo;
      if (userInfo) {
        this.setData({
          userInfo,
        });
      } else {
        let Authorization = wx.getStorageSync('token');
        // if (Authorization) this.getUserInfo();
      }
    },
  },
  methods: {
    //值取反
    toggle({
      currentTarget
    }) {
      const {
        field
      } = currentTarget.dataset;
      let obj = {};
      obj[field] = !this.data[field];
      this.setData(obj);
    },
    //wxml点击跳转
    navigator({
      currentTarget
    }) {
      if (currentTarget.dataset.login) {
        let Authorization = wx.getStorageSync('token');
        // 没有登录、跳转登录页
        if (!Authorization) return this.redirect_login();
        // if (!Authorization)
        //     return wx.navigateTo({
        //         url: '/pages/login/login',
        //     });
      }
      wx.navigateTo({
        url: currentTarget.dataset.url,
      });
    },
    //延迟执行
    sleep(time = 800) {
      return new Promise(resolve => {
        let delayTimeId = setTimeout(() => {
          resolve(true);
          clearTimeout(delayTimeId);
        }, time);
      });
    },
    //401重定向登录（重定向登录已废弃，当用户未登录时不再自动登录，需用户主动点击登录）
    // redirect_login() {
    //     if (!this.data.allow_jump) return;
    //     this.data.allow_jump = false;
    //     getApp().globalData.userInfo = null;
    //     this.setData({
    //         userInfo: null,
    //         ...(!this.data.refresherTriggered
    //             ? {}
    //             : {
    //                   refresherTriggered: false,
    //               }),
    //     });
    //     wx.removeStorageSync('Authorization');
    //     wx.stopPullDownRefresh();
    //     this.wxLogin();
    // },
    // wxLogin() {
    //     let that = this;
    //     wx.login({
    //         withCredentials: true,
    //         timeout: 10000,
    //         success(res) {
    //             let reqData = { code: res.code };
    //             that.request({
    //                 url: 'user/login',
    //                 method: 'POST',
    //                 loadingTip: '登录中',
    //                 data: reqData,
    //             })
    //                 .then(res => {
    //                     wx.setStorageSync('Authorization', res.data.token);
    //                     let options = '';
    //                     options = that.getCurrentPageUrlWithArgs();
    //                     that.getUserInfo(() => {
    //                         that.logined_reload(options);
    //                     });
    //                 })
    //                 .finally(() => {
    //                     that.data.allow_jump = true;
    //                 });
    //         },
    //     });
    // },
    //登录成功后执行
    async logined_reload(options) {
      wx.hideLoading();
      await this.onLoad(options);
      await this.onReady();
      if (this.pagingRefNames) {
        wx.nextTick(() => {
          this.pagingRefNames.forEach(refName => {
            this[refName].immediatecheck && this[refName].reRequest();
          });
        });
      }
    },
    //获取当前页面的参数
    getCurrentPageUrlWithArgs() {
      let options = this.options;
      return options;
    },
    // //获取用户信息
    // getUserInfo(callback) {
    //     this.request({
    //         url: 'user/info',
    //     }).then(({ data }) => {
    //         getApp().globalData.userInfo = data;
    //         this.setData({
    //             userInfo: data,
    //         });
    //         callback && callback(data);
    //     });
    // },
    /**
     * 网络请求封装
     * @param {*} req_data
     * url 请求地址,
     * method 默认get
     * loadingTip:加载中提示，如果存在，先显示loading
     * login 为truthy没登录时请求接口前会重定向至登录
     */
    request(req_data) {
      function xssFilter(data) {
        if (typeof data === 'object') {
          for (let key in data) {
            let value = data[key];
            if (typeof value === 'string') {
              data[key] = value.replace(/[<>&"]/g, function (c) {
                return {
                  '<': '&lt;',
                  '>': '&gt;',
                  '&': '&amp;',
                  '"': '&quot;',
                } [c];
              });
            } else if (typeof value === 'object') {
              data[key] = xssFilter(value);
            }
          }
          return data;
        } else if (typeof data === 'string') {
          return data.replace(/[<>&"]/g, function (c) {
            return {
              '<': '&lt;',
              '>': '&gt;',
              '&': '&amp;',
              '"': '&quot;'
            } [c];
          });
        } else {
          return data;
        }
      }

      return new Promise((resolve, reject) => {
        let that = this;
        let requestNumber = 0; //重试请求次数
        let continueRequest = false; //请求失败重新请求中
        //   let Authorization = wx.getStorageSync('Authorization1');
        let Authorization = wx.getStorageSync('token');

        if (req_data.login && !Authorization) {
          wx.stopPullDownRefresh();
          return that.redirect_login();
        }
        req_data.loadingTip &&
          wx.showLoading({
            title: req_data.loadingTip,
            mask: true,
          });

        req_data.timeout = 10 * 1000; // * 设置超时时间为10秒
        req_data.header = {
          'content-type': 'application/json',
          // 'Content-Type': 'application/x-www-form-urlencoded',
          Accept: 'application/json, text/javascript, */*; q=0.01',
        };
        delete req_data.contentType;
        if (Authorization) req_data.header.Authorization = Authorization;
        req_data.url = this.data.host + req_data.url;
        if (!req_data.method) req_data.method = 'GET';
        if (req_data.data) req_data.data = xssFilter(req_data.data);

        const success = function (res) {
          continueRequest = false;
          switch (res.statusCode) {
            case 200:
              if (res.header.Authorization) {
                wx.setStorageSync('token', 'Bearer ' + res.header.Authorization);
              }
              let data = res.data;
              switch (data.code) {
                case undefined:
                  resolve(data);
                  break;

                case 200:
                  resolve(data);
                  break;

                case 0:
                  resolve(data);
                  break;

                case 401:
                  // that.redirect_login();
                  reject(data);
                  break;
                case 403:
                  wx.redirectTo({
                    url: '/pages/login/login',
                  });
                  break;
                case 501:
                  // wx.showModal({
                  //   title: 'Error',
                  //   content: data.msg,
                  //   showCancel: false, // 只显示确认按钮
                  //   success(res) {
                  //     if (res.confirm) {
                        // 用户点击确认后跳转到首页
                        wx.redirectTo({
                          url: '/pages/index/index',
                        });
                    //   }
                    // }
                  // });
                  break;

                default:
                  reject(data);
                  if (req_data.hideDialogCode && req_data.hideDialogCode.includes(data.code)) return;
                  // wx.showModal({
                  //     showCancel: false,
                  //     content: data.msg.toString() || '',
                  //     confirmColor: themeColor,
                  // });
              }
              break;

            case 401:
              that.redirect_login();
              reject(res);
              break;
            case 403:

              wx.navigateTo({
                url: '/pages/index/index',
              });
              break;

            default:
              wx.showToast({
                title: res.data.message || 'Service Exception',
                icon: 'none',
              });
              reject(res);
          }
        };
        const fail = function (res) {
          // * 请求失败重试两次
          if (requestNumber < 2) {
            continueRequest = true;
            requestNumber++;
            wx.request({
              ...req_data,
              success,
              fail,
              complete,
            });
          } else {
            continueRequest = false;
            //失败处理
            // wx.showToast({
            //     title: '服务异常',
            //     icon: 'none',
            // });
            reject(res);
          }
        };
        const complete = function () {
          if (!continueRequest) {
            req_data.loadingTip && wx.hideLoading();
          }
        };

        wx.request({
          ...req_data,
          success,
          fail,
          complete,
        });
      });
    },
  },
});