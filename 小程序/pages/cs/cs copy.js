// pages/cs/cs.js
// 在小程序页面中引入相关的地图服务密钥
const qqMapKey = 'HTZBZ-INTKN-ENPFS-SSI72-GA7SE-6UBCY'; // 替换为你在腾讯地图开发者平台申请的密钥
Page({

  /**
   * 页面的初始数据
   */
  data: {

  },


  onPageScroll: function (e) {
    const scrollTop = e.scrollTop;
    // 根据滚动距离来动态设置导航栏透明度
    const alpha = Math.min(1, scrollTop / 100); // 举例：滚动100像素后导航栏完全不透明
    const backgroundColor = `rgba(255, 255, 255, ${alpha})`;
    wx.setNavigationBarColor({
      frontColor: '#ffffff', // 文字颜色
      backgroundColor: backgroundColor // 动态设置背景颜色
    });
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    this.getLocationAndCallQQMap()

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
            language: 'en',  // 设置语言为英文
          },
          success: function (res) {
            const address = res.data.result.address; // 获取逆地理编码后的地址信息
             
             
             


            // 在页面上展示地址信息
            that.setData({
              locationInfo: address
            });
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



  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow() {

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

 
})