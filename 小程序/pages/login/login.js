// 导入包
import WxmpRsa from '../../miniprogram_npm/wxmp-rsa/dist/index'
// 实例化rsa
const rsa = new WxmpRsa()

Page({
  /**
   * 页面的初始数据
   */
  data: {
    code: null,
    currentTab: 0,
    acc: true,
    agree: false, // 默认未勾选
    selectedType: '', // 初始化选中的类型
    key: '',
    form: {
      pass: '',
      password: "",
      nickName: "",
      roleSids: "",
      checkpass:'',
      userName: ""
    }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {

    if (options.type == 1) {
      this.setData({
        acc: false, // 根据复选框的选择情况更新 agree 的值
      });
    }
  },

  checkboxChange: function (e) {
    this.setData({
      agree: e.detail.value.length > 0, // 根据复选框的选择情况更新 agree 的值
    });
  },

  // 加密
  setpass(e, key, code) {
    const str = e.detail.value.password
    // 定义公钥
    const publicKey = key
    // 设置公钥
    rsa.setPublicKey(publicKey)
    // 加密
    const cryptStr = rsa.encryptLong(str)
    let val = {
      password: cryptStr,
      nickName: e.detail.value.nickName,
      roleSids: this.data.form.roleSids,
      userName: e.detail.value.userName,
      code: code
    }

    wx._request('/v1/authentication/register/mobile', 'POST', val)
      .then(res => {
        if (res.code == 200) {
           
          wx.showToast({
            title: 'Successfully Registered！',
            icon: 'none'
          });
          // 清空表单数据
          this.setData({
            "form.pass": '',
            "form.password": "",
            "form.nickName": "",
            "form.roleSids": "",
            "form.userName": "",
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
    this.request({url:'/v1/authentication/public-key', method:'GET'})
      .then(res => {
        if (res.code == 200) {
           
          this.setpass(e, res.data, code)
          // this.setData({
          //   key: res.data
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

  onFormSubmit(event) {
    if(event.detail.value.password ==''){
      wx.showModal({
        title: 'Error',
        content: "Please set your password",
        showCancel: false, // 如果不需要取消按钮可以设置为 false
        confirmText: 'Confirm', // 确认按钮的文本
      });

      return
    }
    if(event.detail.value.checkpass ==''){

      wx.showModal({
        title: 'Error',
        content: "Please confirm your password",
        showCancel: false, // 如果不需要取消按钮可以设置为 false
        confirmText: 'Confirm', // 确认按钮的文本
      });
      return
    }
    if(event.detail.value.password != event.detail.value.checkpass){

      wx.showModal({
        title: 'Error',
        content: "Two passwords are inconsistent",
        showCancel: false, // 如果不需要取消按钮可以设置为 false
        confirmText: 'Confirm', // 确认按钮的文本
      });
      return
    }
    if (!this.data.agree) {
      // wx.showToast({
      //   title: 'Please check the box to agree to the User Agreement and Privacy Policy',
      //   icon: 'none',
      // });
      wx.showModal({
        title: 'Error',
        content: "By registering an account, you agree to the platform's 'User Agreement' and 'Privacy Policy'",
        showCancel: false, // 如果不需要取消按钮可以设置为 false
        confirmText: 'Confirm', // 确认按钮的文本
      });
      return;
    }
    if (!this.data.form.roleSids) {
      wx.showModal({
        title: 'Error',
        content: 'Please select your role',
        showCancel: false, // 如果不需要取消按钮可以设置为 false
        confirmText: 'Confirm', // 确认按钮的文本
      });
      return;
    }
    this.getlogin(event)

  },

  async onFormLogin(event) {
    if (!this.data.agree) {
      // wx.showToast({
      //   title: 'To use this feature, please register/login and agree to the "User Agreement" and"Privacy Policy" below.',
      //   icon: 'none',
      // });
      wx.showModal({
        title: 'Error',
        content: 'By signing up, you agree to our User Agreement and Privacy Policy.',
        showCancel: false, // 如果不需要取消按钮可以设置为 false
        confirmText: 'Confirm', // 确认按钮的文本
      });
      // wx.showModal({
      //   title: '提示',
      //   content: '请勾选同意《用户协议》和《隐私政策》。',
      //   showCancel: false, // 如果不需要取消按钮可以设置为 false
      //   confirmText: '知道了', // 确认按钮的文本
      // });
      return;
    }
    this.getkeys(event)
     

  },

  getlogin(event) {
    wx.login({
      success: (res) => {
        if (res.code) {
           
          this.getkey(event, res.code)
        } else {
          console.error('登录失败！' + res.errMsg);
        }
      }
    });
  },

  // 获取公钥
  async getkeys(e) {
    wx._request('/v1/authentication/public-key', 'GET')
      .then(res => {
        if (res.code == 200) {
           
          this.setlogin(e, res.data)
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

  // 加密
  setlogin(e, key) {
    const str = e.detail.value.password
    // 定义公钥
    const publicKey = key
    // 设置公钥
    rsa.setPublicKey(publicKey)
    // 加密
    const cryptStr = rsa.encryptLong(str)
    let val = {
      password: cryptStr,
      userName: e.detail.value.userName,
    }
     
    wx._request('/v1/authentication/login/mobile', 'POST', val)
      .then(res => {
        if (res.code == 200) {
           
          wx.setStorageSync('user', res.data)
          wx.setStorageSync('token', res.data.accessToken);
           
          if (res.data.roleKeySet.includes('candidate')) {
            wx.switchTab({
              url: '/pages/cs/cs',
            })
          } else if (res.data.roleKeySet.includes('employer')) {
            wx.switchTab({
              url: '/pages/Enterprise/Enterprise',
            })
          } else if (res.data.roleKeySet.includes('recruiter')) {
             
            wx.switchTab({
              url: '/pages/recruiter_tab/recruiter_tab',
            })
          }
          // wx.showToast({
          //   title: '登录成功！',
          //   icon: 'none'
          // });
          // 清空表单数据
          this.setData({
            "form.pass": '',
            "form.password": "",
            "form.nickName": "",
            "form.roleSids": "",
            "form.userName": "",
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



  clickTab(e) {
     
    this.setData({
      currentTab: e.currentTarget.dataset.id,
      acc: !this.data.acc
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady() {
    this.getlogin()
  },

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
  goinfo(e) {
    wx.navigateTo({
      url: '/pages/user_xy/user_xy?type=' + e.currentTarget.dataset.type,
    })
  },
  goinfos() {
    wx.navigateTo({
      url: '/pages/loginReaste/loginReaste',
    })
  },
})