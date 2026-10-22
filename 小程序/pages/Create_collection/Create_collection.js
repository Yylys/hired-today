// pages/edu_position/edu_position.js
Page({
  /**
   * 页面的初始数据
   */
  data: {
    sid:null,
    CateList: [{
        type: 2,
        name: 'Pending review'
      },
      {
        type: 1,
        name: 'Announcing'
      },
      {
        type: 3,
        name: 'Removed'
      }
    ],
    lable: null,
    imgurl: wx._ImgbaseURL,
    list2: [],
    fxlist: {},
    isCanDraw: false,
    actives: 0,
    lists: {
      "classifySid": "",
      "collectionName": "",
      "jobSidList": []
    },
    active: 0,
    audit: 2,
    columns1: [],
    columns2: [],
    columns3: [],
    columns5: [],
    columns4: [{
        name: 'Yes',
        id: 0
      }, {
        name: 'No',
        id: 1
      }

    ],
    showdeg: false,
    showExp: false,
    showWork: false,
    showre: false,
    showjob: false,
    Experiencename: null,
    Degreename: null,
    jobname: null,
    Workname: null,
    recruitername: 'No',
    form: {
      "address": null,
      "content": null,
      "dictDegreeSid": null,
      department: null,
      "dictExperienceSid": null,
      "dictWorkSid": null,
      "interviewCount": null,
      "jobName": null,
      "maxSalary": null,
      "minSalary": null,
      "recruiter": 1,
      "recruiterPrice": null,
      "recruitsCount": null,
      "skill": [],
      updateType:2
    },
    params1() {
      return {
        audit: this.data.audit,
        objectSid: wx.getStorageSync('user').sid
      };
    },
    min: 0,
    max: 60
  },


  getlist1() {
    wx._request('/v1/dicts/by-key/Experience', 'GET')
      .then(res => {
        if (res.code == 200) {
          this.setData({
            columns1: res.data
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

  getlist2() {
    wx._request('/v1/dicts/by-key/degree', 'GET')
      .then(res => {
        if (res.code == 200) {
          this.setData({
            columns2: res.data
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

  getlist3() {
    wx._request('/v1/dicts/by-key/workType', 'GET')
      .then(res => {
        if (res.code == 200) {
          this.setData({
            columns3: res.data
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

  getlist5() {
    wx._request('/v1/dicts/by-key/job_collection', 'GET')
      .then(res => {
        if (res.code == 200) {
          this.setData({
            columns5: res.data
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
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {

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
    this.getlist5()
    // this.paging1.reRequest();
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

  onChange(event) {
    this.setData({
      active: event.detail.index
    })
    if (event.detail.index == 1) {
      this.getlist1()
      this.getlist2()
      this.getlist3()
    } else if (event.detail.index == 0) {
      this.paging1.reRequest();
    } else {
      this.getlist5()
    }
  },

  centerMenuItem: function (index) {
    // 将选中的菜单项尽可能居中
    const itemId = `item-${index}`;
    this.setData({
      scrollIntoView: itemId,
    });
  },
  // 点击分类项
  onCateItem(e) {
     
    const index = e.currentTarget.dataset.index;
    this.centerMenuItem(index - 1);
    this.setData({
      audit: e.currentTarget.dataset.sid,
      actives: e.currentTarget.dataset.index,
    });
    this.paging1.reRequest();
  },
  // 下架岗位
  setJobstatus(e) {
    let data = {
      sid: e.currentTarget.dataset.sid,
      type: 5
    }
    wx._request('/v1/job/status', 'put', data)
      .then(res => {
        if (res.code == 200) {
          wx.showToast({
            title: 'Operation successful',
            icon: 'none'
          });
          this.paging1.reRequest();
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
  goinfo(e) {
    if (e.currentTarget.dataset.sid) {
      wx.navigateTo({
        url: e.currentTarget.dataset.path + '?sid=' + e.currentTarget.dataset.sid,
      })
    } else {
      wx.navigateTo({
        url: e.currentTarget.dataset.path,
        events: {
          // 为指定事件添加一个监听器，获取被打开页面传送到当前页面的数据
          setlist: (data) => {
            this.setData({
              list2: data.data,
            });
          },
        },
      })
    }

  },

  getAge(e) {
    this.setData({
      min: e.detail.min,
      max: e.detail.max,
    })
  },


  showdeg() {
    this.setData({
      showdeg: true
    });
  },

  showExp() {
    this.setData({
      showExp: true
    });
  },

  showWork() {
    this.setData({
      showWork: true
    });
  },


  showjob() {
    this.setData({
      showjob: true
    });
  },

  showre() {
    this.setData({
      showre: true
    });
  },

  onConfirm2(event) {
    this.setData({
      "Experiencename": event.detail.value.memberName,
      "form.dictExperienceSid": event.detail.value.sid,
      showdeg: false,
    });
  },

  onConfirm3(event) {
    this.setData({
      "workname": event.detail.value.memberName,
      "form.dictWorkSid": event.detail.value.sid,
      showWork: false,
    });
  },

  onConfirm4(event) {
    this.setData({
      "recruitername": event.detail.value.name,
      "form.recruiter": event.detail.value.id,
      showre: false,
    });
  },

  onConfirm5(event) {
    this.setData({
      "jobname": event.detail.value.memberName,
      "lists.classifySid": event.detail.value.sid,
      showjob: false,
    });
  },



  onConfirm1(event) {
    this.setData({
      "Degreename": event.detail.value.memberName,
      "form.dictDegreeSid": event.detail.value.sid,
      showExp: false,
    });
  },

  onClose() {
    this.setData({
      showdeg: false,
      showExp: false,
      showWork: false,
      showjob: false,
      showre: false
    });
  },


  postdata() {
     
    if(!this.data.sid){
      wx._request('/v1/job', 'POST', this.data.form)
      .then(res => {
        if (res.code == 200) {
          this.setData({
            active:0,
            actives:0
          })
          wx.showToast({
            title: 'successfully！',
            icon: 'none',
          });
          this.clear()
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
    }else{
      wx._request(`/v1/job/${this.data.sid}`, 'put', this.data.form)
      .then(res => {
        if (res.code == 200) {
          this.setData({
            active:0,
            actives:0
          })
          wx.showToast({
            title: 'Operation successful',
            icon: 'none'
          });
          this.clear()
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

  handleInput(event) {
    const title = event.currentTarget.dataset.title
    const value = event.detail.value;
    this.setData({
      [`${title}`]: value
    });
  },

  clear() {
    let data = {
      "address": null,
      "content": null,
      "dictDegreeSid": null,
      department: null,
      "dictExperienceSid": null,
      "dictWorkSid": null,
      "interviewCount": null,
      "jobName": null,
      "maxSalary": null,
      "minSalary": null,
      "recruiter": 1,
      "recruiterPrice": null,
      "recruitsCount": null,
      "skill": [],
    }
    this.setData({
      form: data,
      sid:null,
    })
  },

  postlists() {
     
    return new Promise((resolve, reject) => {
      wx._request("/v1/job/job-collection", 'POST', this.data.lists)
        .then(res => {
          if (res.code == 200) {
            // wx.showToast({
            //   title: 'Submitted successfully',
            //   icon: 'none'
            // });
             
            this.postewm(res.data)
            resolve(res);
          } else {
             wx.showModal({
              content: res.msg,
              showCancel: false, // 如果不需要取消按钮可以设置为 false
              confirmText: 'Confirm', // 确认按钮的文本
            })
            reject(res);
          }
        })
        .catch(err => reject(err));
    })
  },

  postewm(id) {
    return new Promise((resolve, reject) => {
      wx._request(`/v1/job/job-collection-qrcode?url=/pages/JobcollectionLists/JobcollectionLists?id=${id}`, 'POST')
        .then(res => {
          if (res.code == 200) {
            resolve(res);
            this.setData({
              fxlist: res.data,
              isCanDraw: !this.data.isCanDraw
            })
          } else {
             wx.showModal({
              content: res.msg,
              showCancel: false, // 如果不需要取消按钮可以设置为 false
              confirmText: 'Confirm', // 确认按钮的文本
            })
            reject(res);
          }
        })
        .catch(err => reject(err));
    })
  },


  async getUserInfo(e) {
    if(this.data.list2.length==0){
      wx.showToast({
        title: 'Please select a position',
        icon: 'none'
      });
    }else{
      let arr = this.data.list2.map(item => item.sid);
      const login = wx._unit.qzz_login()
      if (login == true) {
        this.setData({
          'lists.jobSidList': arr
        })
        if (e.detail.errMsg === 'getUserInfo:ok') {
          await this.postlists()
          // wx._request(`/v1/job/job-posters?url=pages/cardinfos/cardinfos?sid=${this.data.sid}`, 'POST')
          //   .then(res => {
          //     if (res.code == 200) {
          //       this.setData({
          //         "info.baseerm": res.data,
          //         isCanDraw: !this.data.isCanDraw
          //       })
          //     } else {
          //       wx.showToast({
          //         title: res.msg,
          //         icon: 'none'
          //       });
          //     }
          //   })
          //   .catch(err => {
          //     console.error('请求失败', err);
          //   });
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

  handleClose() {
    this.setData({
      isCanDraw: !this.data.isCanDraw
    })
  },

  setedit(e) {
     
    wx._request(`/v1/job/${e.currentTarget.dataset.sid}/job-info`, 'GET')
      .then(res => {
        if (res.code == 200) {
           
          this.setData({
            'form.address': res.data.address,
            "form.content": res.data.content,
            "form.dictDegreeSid": res.data.dictDegreeSid,
            'form.department': res.data.department,
            "form.dictExperienceSid": res.data.dictExperienceSid,
            "form.dictWorkSid": res.data.dictWorkSid,
            "form.interviewCount": res.data.interviewCount,
            "form.jobName": res.data.jobName,
            "form.maxSalary": res.data.maxSalary,
            "form.minSalary": res.data.minSalary,
            "form.recruiter": res.data.recruiter,
            "form.recruiterPrice": res.data.recruiterPrice,
            "form.recruitsCount": res.data.recruitsCount,
            "form.skill": res.data.skill,
            Degreename: res.data.dictExperience.memberName,
            Experiencename: res.data.dictDegree.memberName,
            workname: res.data.dictWork.memberName,
            active: 1,
            sid: res.data.sid,
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

  settag(e) {
     
    if (e.currentTarget.dataset.data.length > 0) {
      this.data.form.skill.push(e.currentTarget.dataset.data)
      this.setData({
        'form.skill': this.data.form.skill,
        lable:null
      })
       
    }
  },
  deltag(e) {
    this.data.form.skill.splice(e.currentTarget.dataset.index, 1);
    this.setData({
      'form.skill': this.data.form.skill
    })
  }
})