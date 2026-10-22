// pages/dots/index2.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    current1: 0,
    autoplay1: true,
    imgurl: wx._ImgbaseURL,
    // 轮播图自动切换时间间隔
    interval1: 5000,
    //轮播图进度条的计时器
    progressNumInterval: null,
    //轮播图进度条的进度
    progressNum: 0,
    swiperCurrent: 0,
    imgList: []
  },
  gologin(e) {
    // e.currentTarget.dataset.num
    wx.navigateTo({
      url: `/pages/login/login?type=${e.currentTarget.dataset.num}`,
    })
  },
  monitorCurrent1(e) {
     
    if (e.detail.source == "touch" || e.detail.source == "autoplay") {
      // 二次执行顶部轮播图的小圆点的进度点
      this.progressLineInterval();
      this.setData({
        current1: e.detail.current
      })
    }
  },
  //封装轮播图进度条计时器的方法
  progressLineInterval: function () {
    // 清理小圆点的计时器
    clearInterval(this.data.progressNumInterval)
    // 清理小圆点的进度
    this.setData({
      progressNum: 0,
    })
    /**
     * 轮播图的切换时间为5秒，进度条的进度为1-100%，
     * 因为5000/100=50毫秒，所以每50毫秒就要执行1个进度点
     * 另外需要把计时器寄存在data{}对象上，否则会清理不掉上一个计时器
     * */
    this.data.progressNumInterval = setInterval(() => {
      let progressNum = this.data.progressNum;
       
      if (progressNum < 100) {
        progressNum++;
      } else {
        progressNum = 0;
        // 清理进度条的计时器
        clearInterval(this.data.progressNumInterval)
      }
      this.setData({
        progressNum: progressNum
      })
    }, 50)
  },


  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    // 初次执行顶部轮播图的进度条的进度点
    this.progressLineInterval();

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    this.getinfo()
    let usre= wx.getStorageSync('user')
    console.log(usre.length,'usre');
    if(usre.length!=0){
      if (usre.roleKeySet.includes('candidate')) {
        wx.switchTab({
          url: '/pages/cs/cs',
        })
      } else if (usre.roleKeySet.includes('employer')) {
        wx.switchTab({
          url: '/pages/Enterprise/Enterprise',
        })
      } else if (usre.roleKeySet.includes('recruiter')) {
        wx.switchTab({
          url: '/pages/recruiter_tab/recruiter_tab',
        })
      }
    }

},

onHide: function () {

  //关闭轮播图
  this.setData({
    autoplay: false
  })
  // 清理进度条的计时器
  clearInterval(this.data.progressNumInterval)
},

/**
 * 生命周期函数--监听页面卸载
 */
onUnload: function () {
  //关闭轮播图
  this.setData({
    autoplay: false
  })
  // 清理进度条的计时器
  clearInterval(this.data.progressNumInterval)
},

/**
 * 页面相关事件处理函数--监听用户下拉动作
 */
onPullDownRefresh: function () {

},

/**
 * 页面上拉触底事件的处理函数
 */
onReachBottom: function () {

},



getinfo() {
  wx._request(`/v1/guide/banner/mini`, 'GET')
    .then(res => {
      if (res.code == 200) {
        this.setData({
          imgList: res.data,
        })
      } else {
        wx.showToast({
          title: res.msg,
          icon: 'none'
        });
      }

    })
    .catch(err => {
      console.error('请求失败', err);
    });
},
})