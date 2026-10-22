// pages/Interview_Feedback/Interview_Feedback.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    interviewname:null,
    showexperience: false,
    form:{
      interviewSid:null,
      content	:null,
      interviewType:null,
    },
    columns:[{
      type:0,
      name:'Approve'
    },{
      type:1,
      name:'Reject'
    }]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
     
    this.setData({
      'form.interviewSid':options.sid
    })

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

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage() {

  },
  showexperience() {
    this.setData({
      showexperience: true
    });
  },

  onClose() {
    this.setData({
      showexperience: false,
    });
  },

  onConfirm(event) {
    this.setData({
       interviewname: event.detail.value.name,
      "form.interviewType": event.detail.value.type,
      showexperience: false,
    });
  },

    // 处理输入框内容变化
    handleInputChange: function (event) {
        this.setData({
         "form.content": event.detail.value
        });
    },
    onFormSubmit(){
      console.log(this.data.form,'this.data.form');
      if(!this.data.form.content){
        console.log('没有内容');
        wx.showModal({
          content: 'Please enter the Interview feedback details',
          showCancel: false, // 如果不需要取消按钮可以设置为 false
          confirmText: 'Confirm', // 确认按钮的文本
        })
        return
      }
      console.log();
      if(this.data.form.interviewType.length>0){
        console.log('没有分类');
        wx.showModal({
          content: 'Please enter the Interview feedback details',
          showCancel: false, // 如果不需要取消按钮可以设置为 false
          confirmText: 'Confirm', // 确认按钮的文本
        })
        return
      }
      wx._request('/v1/interview/feedback', 'POST', this.data.form)
      .then(res => {
        if (res.code == 200) {
          wx.showToast({
            title: 'Submitted successfully！',
            icon: 'none',
            duration: 0, // 默认2秒
            complete: () => {
              setTimeout(() => {
                wx.navigateBack({
                  delta: 2
                });
              }, 0); // 与 duration 保持一致
            }
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
    }
})