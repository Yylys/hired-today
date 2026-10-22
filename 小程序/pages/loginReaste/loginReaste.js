// 导入包
import WxmpRsa from '../../miniprogram_npm/wxmp-rsa/dist/index'
// 实例化rsa
const rsa = new WxmpRsa()

Page({
  /**
   * 页面的初始数据
   */
  data: {
    key: '',
    form: {
      pass: '',
      password: "",
      checkpass: '',
      // nickName: "",
      roleSids: "",
      userName: ""
    }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {

  },

  checkboxChange: function (e) {
    this.setData({
      agree: e.detail.value.length > 0, // 根据复选框的选择情况更新 agree 的值
    });
  },




  // 加密
  setpass(e, key) {
    const str = e.detail.value.password
    // 定义公钥
    const publicKey = key
    // 设置公钥
    rsa.setPublicKey(publicKey)
    // 加密
    const cryptStr = rsa.encryptLong(str)
    let val = {
      password: cryptStr,
      // nickName: e.detail.value.nickName,
      userName: e.detail.value.userName,
      roleSids: this.data.form.roleSids,
    }
    wx._request('/v1/users/password', 'PUT', val)
      .then(res => {
        if (res.code == 200) {
          wx.showToast({
            title: 'Your new password has been successfully reset, Please return to log in',
            icon: 'none',
            duration: 2000, // 默认2秒
            complete: () => {
              setTimeout(() => {
                wx.navigateBack({
                  delta: 1
                });
              }, 2000); // 与 duration 保持一致
            }
          });
          // 清空表单数据
          this.setData({
            "form.pass": '',
            "form.password": "",
            "form.nickName": "",
            "form.roleSids": "",
            "form.userName": "",
            "form.checkpass": "",
            acc: !this.data.acc
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
  radioChange: function (e) {
    this.setData({
      "form.roleSids[0]": e.detail.value
    });

  },

  // 获取公钥
  async getkey(e, code) {
    wx._request('/v1/authentication/public-key', 'GET')
      .then(res => {
        if (res.code == 200) {
          this.setpass(e, res.data)
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

  onFormSubmit(event) {
    if (!this.data.form.roleSids) {
      wx.showModal({
        title: 'Error',
        content: "Please select your account role",
        showCancel: false, // 如果不需要取消按钮可以设置为 false
        confirmText: 'Confirm', // 确认按钮的文本
      });
      return;
    }
    if (event.detail.value.password == '') {
      wx.showModal({
        title: 'Error',
        content: "Please set a new password",
        showCancel: false, // 如果不需要取消按钮可以设置为 false
        confirmText: 'Confirm', // 确认按钮的文本
      });
      return
    }
    if (event.detail.value.checkpass == '') {
      wx.showModal({
        title: 'Error',
        content: "Please confirm your new password",
        showCancel: false, // 如果不需要取消按钮可以设置为 false
        confirmText: 'Confirm', // 确认按钮的文本
      });
      return
    }
    if (event.detail.value.password != event.detail.value.checkpass) {
      wx.showModal({
        title: 'Error',
        content: "Two passwords are inconsistent",
        showCancel: false, // 如果不需要取消按钮可以设置为 false
        confirmText: 'Confirm', // 确认按钮的文本
      });
      return
    }


    this.getkey(event)
  },



  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady() {},

  /**
   * 生命周期函数--监听页面显示
   */
  onShow() {
    wx.removeStorageSync('user')
    wx.removeStorageSync('userinfo')
    wx.removeStorageSync('token')
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

})