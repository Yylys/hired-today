// pages/jsCase/historySearch/index.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    list:[],
    imgurl: wx._ImgbaseURL,
    jobName:null,
    params2() {
      return {
        jobName: this.data.jobName,
        audit:1,
        recruiter:wx.getStorageSync('user').roleKeySet[0]=='recruiter' ? 0: 1
      };
    },
  },

 
  onShow: function () {
    if (wx.getStorageSync('search_history') ){
      this.setData({
        list:JSON.parse(wx.getStorageSync('search_history') ).slice(0, 15)
      })
    }
    this.post.reRequest()
  },

  goinfo(e) {
     
    wx.navigateTo({
      url: e.currentTarget.dataset.path + '?sid=' + e.currentTarget.dataset.sid,
    })
  },

  getData(e){
    let data = e.detail.value.replace(/(^\s*)|(\s*$)/g, "");//去掉前后的空格
    this.setData({
      jobName:data
    })
      if (data.trim() != '') {
      this.post.reRequest()
        this.data.list.forEach((key, index) => {
          if (key == data) {
            this.data.list.splice(index, 1);
          }
        })
        this.data.list.unshift(data);
        this.setData({
          list:this.data.list.slice(0,15)
        })
        wx.setStorageSync('search_history', JSON.stringify(this.data.list))
      }
  },
  // clear_input(){
  //   this.setData({
  //     search:''
  //   })
  // },

  getSearch(e){
    let {index}=e.currentTarget.dataset,{hot_list}=this.data;
    let va=hot_list[index]
    this.setData({
      jobName:va
    })
    this.post.reRequest()
    // 将标签存到历史搜索中
    this.data.list.forEach((item, index) => {
      if (item == va) {
        this.data.list.splice(index, 1);
      }
    })
    this.data.list.unshift(va);
    this.setData({
      list:this.data.list.slice(0,15)
    })
    wx.setStorageSync('search_history', JSON.stringify(this.data.list))
  },
   //清空历史
   clearHistory() {
    this.setData({
      list:[]
    })
    wx.removeStorageSync('search_history')
  },
  getSearchOne(e){
    let {index}=e.currentTarget.dataset,{list}=this.data;
    let va=list[index]
    this.setData({
      jobName:va
    })
    this.post.reRequest()
    this.data.list.forEach((item, index) => {
      if (item == va) {
        this.data.list.splice(index, 1);
      }
    })
    this.data.list.unshift(va);
    this.setData({
      list:this.data.list.slice(0,10)
    })
     
    wx.setStorageSync('search_history', JSON.stringify(this.data.list))
  }
})