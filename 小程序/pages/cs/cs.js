// pages/Enterprise/Enterprise.js
const citySelector = requirePlugin('citySelector');
const qqMapKey = 'HTZBZ-INTKN-ENPFS-SSI72-GA7SE-6UBCY'; // 替换为你在腾讯地图开发者平台申请的密钥
Page({
  /**
   * 页面的初始数据
   */
  data: {
    num: 0,
    userinfos: {
      Vip: {},
      infos: {}
    },
    askcode: '',
    askname: '',
    post_active: 0,
    usre: null,
    topHeight: 0,
    contentHeight: 0,
    currentTab: 0,
    imgurl: wx._ImgbaseURL,
    CateList: [],
    CateList2: [],
    titles: ['All jobs', 'Recommended', 'Headhunters'],
    sid: null,
    collsid: null,
    actives: '',
    // active: 2,
    recommend: '',
    recruiter: '',
    params2() {
      return {
        audit: 1,
        areaCode: this.data.askcode,
        recommend: this.data.recommend,
        publish: this.data.recruiter
      };
    },
    params1() {
      return {
        classifySid: this.data.sid,
        status: 0
      };
    },
    params3() {
      return {
        classifySid: this.data.collsid,
        status: 0
      };
    },
    key: 'HTZBZ-INTKN-ENPFS-SSI72-GA7SE-6UBCY', //使用在腾讯位置服务申请的key
    referer: 'HiredToday', //调用插件的app的名称
    hotCitys: '北京,上海,广州,深圳,西安,青岛,昆明,哈尔滨,南京,重庆,成都',
  },
  // 城市选择器
  setCity() {
    const that=this
    wx.showModal({
      content: 'Please note that when searching for a city in English, the first letter must be lowercase.',
      confirmText: 'Confirm',
      cancelText: 'Cancel',
      showCancel: false,
      cancelColor: '#9EA5B8',
      confirmColor: '#2623D1',
      success(res) {
        if (res.confirm) {
          wx.navigateTo({
            url: `plugin://citySelector/index?key=${that.data.key}&referer=${that.data.referer}&hotCitys=${that.data.hotCitys}`,
          })
        } else if (res.cancel) {
          console.log('用户点击取消')
        }

      }
    });
    // wx.navigateTo({
    //   url: `plugin://citySelector/index?key=${this.data.key}&referer=${this.data.referer}&hotCitys=${this.data.hotCitys}`,
    // })
  },



  // 处理菜单切换
  handleTabChange(e) {
    this.clear()
    let currnet = e.detail.index;
    if (currnet == undefined) return;
    this.setData({
      currentTab: currnet
    })
    if (currnet == 0) {
      this.getpost()

      // this.post.reRequest()

    } else if (currnet == 1) {

      this.setData({
        actives: 0,
      });
      this.getactivity()
      this.getactivity2()
    } else if (currnet == 2) {
      this.notification.reRequest()

    } else {
      this.getinfos()
      this.getVip()
    }
    this.getnum()
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {

    this.getnum()
    this.getLocationAndCallQQMap()
    this.getpost()
    const systemInfo = wx.getSystemInfoSync();
    const statusBarHeight = systemInfo.statusBarHeight
    const windowHeight = systemInfo.windowHeight;
    const fixedHeight = 250; // 固定高度
    const navBarHeight = 46; // 自定义导航栏高度，通常为 44px 或根据实际情况调整
    this.setData({
      usre: wx.getStorageSync('user'),
      contentHeight: windowHeight - fixedHeight,
      topHeight: statusBarHeight + navBarHeight
    });
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady() {},

  /**
   * 生命周期函数--监听页面显示
   */
  onShow() {
    this.getnum()
    this.getinfos()
    this.getinfo()
    this.getVip()
    const selectedCity = citySelector.getCity(); // 选择城市后返回城市信息对
    console.log(selectedCity,'selectedCity');
    if (selectedCity && this.data.askcode != selectedCity.id) {
      // this.clear()
      this.setData({
        askcode: selectedCity.id,
        askname: selectedCity.pinyin.join("")
      })
      this.getpost()
    }
    // this.notification.reRequest()
    // this.getactivity()
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide() {

  },

  getinfo() {
    wx._request('/v1/candidate/me', 'GET')
      .then(res => {
        if (res.code == 200 && res.data) {
          if (res.data.sid) {
            wx.setStorageSync('userinfo', res.data)
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


  getnum() {
    this.request({url:'/v1/message/unread', method:'GET'})
      .then(res => {
        if (res.code == 200) {
          this.setData({
            num: res.data
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
  onChange(event) {
    this.clear()

    if (event.detail.name == 0) {

      // this.paging.reRequest();
      this.getactivity()
    } else {
      this.getactivity2()
    }
  },
  Changepost(event) {
    this.clear()

    this.setData({
      post_active: event.detail.index
    })
    if (event.detail.title == 'All jobs') {
      this.setData({
        recommend: '',
        recruiter: '',
      })
    } else if (event.detail.title == 'Recommended') {

      this.setData({
        recommend: 0,
        recruiter: 1,
      })
    } else {

      this.setData({
        recommend: '',
        recruiter: 0,
      })
    }
    this.post.reRequest()

  },
  centerMenuItem: function (index) {
    // 将选中的菜单项尽可能居中
    const itemId = `item-${index}`;
    this.setData({
      scrollIntoView: itemId,
    });
  },

  // 刷新消息数据
  upmessage() {
    this.notification.reRequest()
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
      actives: e.currentTarget.dataset.index,
    });
    this.collection.reRequest();
  },

  goinfo(e) {

    wx.navigateTo({
      url: e.currentTarget.dataset.path + '?sid=' + e.currentTarget.dataset.sid,
    })
  },
  getactivity() {
    this.request({url:'/v1/dicts/by-key/activity', method:'GET'})
      .then(res => {
        if (res.code == 200) {
          this.setData({
            CateList: res.data,
            sid: res.data[0].sid,
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

  getactivity2() {
    this.request({url:'/v1/dicts/by-key/job_collection', method:'GET'})
      .then(res => {
        if (res.code == 200) {
          this.setData({
            CateList2: res.data,
            collsid: res.data[0].sid,
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

  getpost() {
    this.post.reRequest()
  },

  gosearch() {
    wx.navigateTo({
      url: '/pages/historySearch/index',
    })
  },
  // 分享
  onShareAppMessage(options) {
    return {
      title: options.target.dataset.title,
      path: `/pages/collList/collList?sid=${options.target.dataset.id}`, // 分享后打开的页面路径
      // imageUrl: 'https://example.com/share-image.png', // 分享时显示的图片
      success: function () {
        // 分享成功
      },
      fail: function () {
        // 分享失败
      }
    }
  },

  getinfos() {
    this.request({url:'/v1/users/me', method:'GET'})
      .then(res => {
        if (res.code == 200) {
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
    this.request({url:'/v1/vip/candidate', method:'GET'})
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
  clear() {
    this.setData({
      list: [],
      list2: [],
      list3: []
    })
  },
  getLocationAndCallQQMap: function () {
    let that = this;
    wx.getFuzzyLocation({
      type: 'wgs84', // 获取经纬度信息
      success: function (res) {
        const latitude = res.latitude;
        const longitude = res.longitude;
        // 发起腾讯地图逆地理编码请求
        wx.request({
          url: 'https://apis.map.qq.com/ws/geocoder/v1/',
          data: {
            location: latitude + ',' + longitude,
            key: qqMapKey,
            get_poi: 0,
            language: 'en', // 设置语言为英文
          },
          success: function (res) {

            const address = res.data.result.address; // 获取逆地理编码后的地址信息



            let code = res.data.result.ad_info.adcode.slice(0, 4) + "00"
            let city = res.data.result.ad_info.city.replace(" City", "")
            // 在页面上展示地址信息
            that.setData({
              askcode: code,
              askname: city
            })
            that.getpost()
          },
          fail: function (error) {
            console.error('调用腾讯地图API失败', error);
          }
        });
      },
      fail: function (error) {
        console.error('获取位置信息失败', error);
      }
    });

  },
})