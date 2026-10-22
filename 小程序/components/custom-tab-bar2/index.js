Component({
  /**
   * 组件的属性列表
   */
  properties: {
    // 是否显示 TabBar
    showTabBar: {
      type: Boolean,
      value: true
    },
    // 当前选中的 Tab
    currentTab: {
      type: Number,
      value: 0
    },
    num: {
      type: Number,
      value: 0
    }
  },
  data: {
    list:[
      {name:'Job',acturl:'/static/imgs/tabar/post.png',url:'/static/imgs/tabar/post_a.png'},
      {name:'Talents',acturl:'/static/imgs/tabar/Talents.jpg',url:'/static/imgs/tabar/Talents_a.jpg'},
      {name:'Plaza',acturl:'/static/imgs/tabar/plaza.png',url:'/static/imgs/tabar/plaza_a.png'},
      {name:'Notification',acturl:'/static/imgs/tabar/notification.png',url:'/static/imgs/tabar/notification_a.png'},
      {name:'Personal',acturl:'/static/imgs/tabar/personal.png',url:'/static/imgs/tabar/personal_a.png'},
    ]
  },

  /**
   * 组件的方法列表
   */
  methods: {
    // 切换 Tab
    switchTab(e) { 
       
      const { index,path } = e.currentTarget.dataset;
      // wx.switchTab({
      //   url: path,
      // })
      // 触发父组件的事件，传递当前选中的 Tab
      this.triggerEvent('switchTab', { index });
    }
  }
});
