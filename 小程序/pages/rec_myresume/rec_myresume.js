// pages/myresume/myresume.js
Page({
  /**
   * 页面的初始数据
   */
  data: {
    infos: null,
    customsid: null,
    sid: null,
    tagName: null,
    show: false,
    gender: null,
    list: [],
    listSlice: null,
    form: {
      candidateSid: null,
      content: "",
      images: [],
      jobStatus: 0,
      note: "",
      personalStrengths: "",
      status: 0
    },
    expectations: {
      cardList: [{
        desiredCity: "",
        desiredIndustry: "",
        maxSalary: '',
        minSalary: '',
        note: "",
        status: 0,
        workTypeSid: ""
      }],
      desiredCity: "",
      desiredIndustry: "",
      maxSalary: '',
      minSalary: '',
      note: "",
      status: 0
    },
    taglist: [],
    work: [],
    project: [],
    school: [],
  },

  setstatus(e) {
     
     
    this.setData({
      "form.jobStatus": e.currentTarget.dataset.status
    })
     
  },

  showPopup() {
    if (!this.data.customsid) {
      wx.showToast({
        title: 'Please complete your personal information first',
        icon: 'none'
      });
      return
    } else {
      this.setData({
        show: true
      });
    }
  },

  onClose() {
    this.setData({
      show: false
    });
  },



  goinfo(e) {
    if (!this.data.customsid && e.currentTarget.dataset.path != '/pages/rec_informations/rec_informations') {
      wx.showToast({
        title: 'Please complete your personal information first',
        icon: 'none'
      });
      return
    } else {
      if (e.currentTarget.dataset.path == "/pages/advantage/advantage") {
        if (e.currentTarget.dataset.data == 'Self-Evaluation') {
          const encodedValue = encodeURIComponent(e.currentTarget.dataset.item);
          wx.navigateTo({
            url: e.currentTarget.dataset.path + '?content=' + encodedValue,
            events: {
              // 为指定事件添加一个监听器，获取被打开页面传送到当前页面的数据
              setcontent: (data) => {
                this.setData({
                  "form.content": data.data,
                });
              },
            },
          })
        } else {
          wx.navigateTo({
            url: e.currentTarget.dataset.path + '?personalStrengths=' + e.currentTarget.dataset.item,
            events: {
              // 为指定事件添加一个监听器，获取被打开页面传送到当前页面的数据
              setadvantage: (data) => {
                 
                this.setData({
                  "form.personalStrengths": data.data,
                });
                 
              },
            },
          })
        }
      } else if (e.currentTarget.dataset.path == "/pages/experience/experience" || e.currentTarget.dataset.path == "/pages/project/project" || e.currentTarget.dataset.path == "/pages/expectations/expectations" || e.currentTarget.dataset.path == "/pages/Educational/Educational") {
        wx.navigateTo({
          url: e.currentTarget.dataset.path + '?sid=' + e.currentTarget.dataset.sid,
          events: {
            // 为指定事件添加一个监听器，获取被打开页面传送到当前页面的数据
            setinfo: () => {
              this.getdetail()
            },
          },
        })
      } else if (e.currentTarget.dataset.path == '/pages/Attachments/Attachments') {
         
        wx.navigateTo({
          url: e.currentTarget.dataset.path + '?images=' + JSON.stringify(e.currentTarget.dataset.item),
          events: {
            // 为指定事件添加一个监听器，获取被打开页面传送到当前页面的数据
            setimgs: (data) => {
               
              this.setData({
                "form.images": data.data,
              });
            },
          },
        })
      } else {
        wx.navigateTo({
          url: e.currentTarget.dataset.path
        })
      }
    }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    this.setData({
      // infos:wx.getStorageSync('userinfo')
    })
    //   
    if (this.data.infos) {
      // this.getlist()
    }
    this.setData({
      customsid: wx.getStorageSync('customsid'),
    })
    if(this.data.customsid){
      this.getlist()
    }
 

    this.setData({
      listSlice: this.data.list.slice(0, 5)
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
    this.setData({
      customsid: wx.getStorageSync('customsid'),
      'form.candidateSid': wx.getStorageSync('customsid')
    })
    // this.getlist()
    if (!this.data.customsid) {} else {
      this.getdetail()
    }


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
  getlist() {
    wx._request(`/v1/resume/${this.data.customsid}/headhunting`, 'GET')
      .then(res => {
        if (res.code == 200) {
          if(res.data.status==1){
            wx.showModal({
              content: 'You have reached the maximum number of resume postings.',
              showCancel: false,  // 如果不需要取消按钮可以设置为 false
              confirmText: 'Confirm',  // 确认按钮的文本
              success(res) {
                if (res.confirm) {
                  // 用户点击了确认按钮
                  wx.navigateBack({
                    delta: 1, // 返回上一页
                  });
                }
              }
            });
            return
          }
          if (res.data.sid) {
            this.setData({
              sid: res.data.sid
            })
          }
          this.setData({
            expectations: res.data.expectations,
            taglist: res.data.tag,
            work: res.data.work,
            project: res.data.project,
            school: res.data.school,
            "form.jobStatus":res.data.jobStatus,
            "form.images": res.data.images,
            "form.content": res.data.content,
            "form.personalStrengths": res.data.personalStrengths,
            userinfo: res.data.candidate
          });
        } else {
          wx.showModal({
            content: res.msg,
            showCancel: false,  // 如果不需要取消按钮可以设置为 false
            confirmText: 'Confirm',  // 确认按钮的文本
            success(res) {
              if (res.confirm) {
                // 用户点击了确认按钮
                wx.navigateBack({
                  delta: 1, // 返回上一页
                });
              }
            }
          });
        }
      })
      .catch(err => {
        console.error('请求失败', err);
      });
  },
  getdetail() {
    wx._request(`/v1/resume/${this.data.customsid}/me`, 'GET')
      .then(res => {
        if (res.code == 200) {
          this.setData({
            expectations: res.data.expectations,
            taglist: res.data.tag,
            work: res.data.work,
            project: res.data.project,
            school: res.data.school,
            userinfo: res.data.candidate
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
  // tag设置

  // 处理输入框内容变化
  handleInputChange: function (event) {
     
    // 更新数据源中的 inputValue
    this.setData({
      tagName: event.detail.value
    });
  },

  settag(e) {
     
    if (!e.currentTarget.dataset.data) {
      wx.showToast({
        title: "Please fill in correctly",
        icon: 'none'
      });
      return
    }

    wx._request("/v1/tag/create-tag", 'POST', {
        sid: this.data.customsid,
        tagName: e.currentTarget.dataset.data,
        type: 1
      })
      .then(res => {
        if (res.code == 200) {
           
          wx.showToast({
            title: 'New successfully added',
            icon: 'none',
          });
          this.setData({
            tagName: '',
          })
          this.getTaglist()
        } else {
          wx.showModal({
            content: res.msg,
            showCancel: false, // 如果不需要取消按钮可以设置为 false
            confirmText: 'Confirm', // 确认按钮的文本
          })
        }
      })

  },
  deltag(e) {
     
    // return
    wx._request(`/v1/tag/${ e.currentTarget.dataset.sid}/delete`, 'PUT')
      .then(res => {
        if (res.code == 200) {
           
          wx.showToast({
            title: 'Deletion success！',
            icon: 'none',
          });
          this.getTaglist()
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

  getTaglist() {
    wx._request(`/v1/tag/${this.data.customsid}/all`, 'GET')
      .then(res => {
        if (res.code == 200) {
           
          this.setData({
            taglist: res.data
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
  // addwork(){
  //   let data={
  //     endDate:'null',
  //     startDate:'null',
  //     industry:'null',
  //     department:'null',
  //     companyName:'null',
  //     posts_name:'null',
  //     achievementsContent:{content:'null'},
  //     descriptionContent:{
  //       content:'null',
  //       title:'null',
  //     }
  //   }
  //   this.data.form.work.push(data)
  //   this.setData({ "form.work":this.data.form.work});
  // },
  delwork(e) {
    console.log(e.currentTarget.dataset.sid,22222);
    // return
    wx._request(`/v1/work/${ e.currentTarget.dataset.sid}/delete`, 'PUT')
      .then(res => {
        if (res.code == 200) {
           
          wx.showToast({
            title: 'Deletion success！',
            icon: 'none',
          });
          this.getdetail()
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
  submit() {
    if (this.data.form.images.length == 0) {
      wx.showModal({
        title: 'Please upload your personal attachments, such as photos, certificates, etc. The attachments will help employers better understand you.',
        // content: data.msg,
        confirmText: 'Confirm', // 确认按钮的文本
        showCancel: false, // 只显示确认按钮
        success(res) {
          if (res.confirm) {
            this.postadd()
          }
        }
      });
    }else{
      this.postadd()
    }

  },

  postadd(){
    // 新增
    if (this.data.sid == null) {
       
      wx._request('/v1/resume/save', 'POST', this.data.form)
        .then(res => {
          if (res.code == 200) {

            wx.showToast({
              title: 'Submitted successfully!',
              icon: 'none',
              complete: () => {
                setTimeout(() => {
                  wx.navigateBack({
                    delta: 1
                  });
                }, 1000); // 与 duration 保持一致
              }
            });
            // this.getlist()
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
    } else {
      // 修改
       
      wx._request(`/v1/resume/${this.data.sid}`, 'put', this.data.form)
        .then(res => {
          if (res.code == 200) {
            wx.showToast({
              title: 'Modified successfully！',
              icon: 'none',
              duration: 0, // 默认2秒
              complete: () => {
                setTimeout(() => {
                  wx.navigateBack({
                    delta: 1
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
  },
  search() {

  },
  delSchool(e) {
     
    // return
    wx._request(`/v1/school/${ e.currentTarget.dataset.sid}/delete`, 'PUT')
      .then(res => {
        if (res.code == 200) {
           
          wx.showToast({
            title: 'Deletion success！',
            icon: 'none',
          });
          this.getdetail()
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