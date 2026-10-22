// components/slider/index.js
Component({
  // 使用全局样式
  options: {
      addGlobalClass: true
  },
  lifetimes: {
      attached: function() {
        // 在组件实例进入页面节点树时执行
          const res = wx.getSystemInfoSync()
          this.setData({
              ratio: 750 / res.windowWidth
          })
        
      },
      detached: function() {
        // 在组件实例被从页面节点树移除时执行
      },
  },
  /**
   * 组件的属性列表
   */
  properties: {
    min: {
      type: Number,
      value: 0
    },
    max: {
      type: Number,
      value: 500
    },
  },

  /**
   * 组件的初始数据
   */
  data: {
      pdLeft: 0,     // 左边滑块的位置
      pdRight: 0,     // 右边滑块的位置
      ratio: 2,
      startX1: 0,     //计算左滑块初始位置离屏幕左边的距离
      startX2: 0,     //计算右滑块初始位置离屏幕右边的距离
  },

  /**
   * 组件的方法列表
   */
  methods: {
      touchStart1(e){
          // console.log("e0", e.touches[0].clientX);
          if(!this.data.startX1){
              this.setData({
                  startX1: e.touches[0].clientX
              })

          }
      },
      touchMove1(e){
          // console.log("eeee1", e.touches[0].clientX);
          let x = (e.touches[0].clientX - this.data.startX1) * this.data.ratio
          let v = x >= 0 ? x : 0               //不能超过父容器最左边
          if(v + this.data.pdRight >= 600){    //右边的滑块越过左边时
              v = 600 - this.data.pdRight
          }
          this.setData({
              pdLeft: v
          })
          console.log(this.data.pdLeft,'pdLeft');
          this.triggerEvent('submit', {
              min: Math.round(v/10),
          })
          console.log("v", v);
          console.log(" Math.round", Math.round(v/10));
          console.log("this.data.pdLeft", this.data.min);
          

      },
      touchEnd1(){},
      touchStart2(e){
          // console.log("e0", e.touches[0].clientX);
          if(!this.data.startX2){
              this.setData({
                  startX2: e.touches[0].clientX
              })

          }
      },
      touchMove2(e){
          // console.log("eeee2", e.touches[0].clientX);
          let x = (this.data.startX2 - e.touches[0].clientX) * this.data.ratio
          let v = x >= 0 ? x : 0              //不能超过父容器最右边
          if(v + this.data.pdLeft >= 600){    //右边的滑块越过左边时
              v = 600 - this.data.pdLeft
          }
          this.setData({
              pdRight: v
          })
          this.triggerEvent('submit', {
              max: Math.round((600-v)/10),
          })
          // console.log("this.data.pdRight", this.data.pdRight);
      },
      touchEnd2(){},
      reset(){
          this.setData({
              pdLeft: 0,
              pdRight: 0,
              startX1: 0,
              startX2: 0,
          })
          this.triggerEvent('submit', {
              min: 0,
              max: 120
          })
      },
      
  }
})

