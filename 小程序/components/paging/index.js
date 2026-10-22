/**
 * @paging
 * @description 封装了下拉刷新、触底加载、列表删除等操作，scroll-view也可以放心食用
 * @props pagingRefField 组件实例在页面上的属性名称，页面上可以使用多个组件实例，默认名为paging（如：this.paging.reRequest();）
 * @props filed 页面列表数据所属属性，默认list
 * @props reqUrl 请求url，可以为String或Function
 * @props reqMethod 请求方式，默认GET
 * @props limit 每次请求条数，默认10条
 * @props params 特殊请求参数，可以为Object和Function
 * 在data里面写
 *   //写法1： getParams(){
            // return {
            //     status:1
            // }
        // }
        //写法2 getParams:{
        //     status:"1"
        // }
 * @props needLogin 请求前是否验证登录，默认为false，如为true，未登录时会自动跳转登录页
 * @props throttle //有的时候，API 的请求回来的特别快，往往骨架占位刚刚被渲染，真实的数据就已经回来了，用户的界面会突然一闪， 此时为了避免这种情况，就 需要通过 throttle 属性来避免这个问题。默认300ms，建议开启
 * @props immediatecheck 默认自动请求数据，如想自定义请求时机请设置为false，在页面上需要调用的时机执行this.paging.reRequest();
 * @props formatHandler 格式化数据，自动传入参数e
 * @props beforeRefresh 刷新事件守卫 resolve(true)或return true 执行刷新  resolve(false)或return false 取消刷新
 * @props refresherTriggered 使用scroll-view并且开启下拉刷新时需要使用，如下：
 *  <scroll-view refresher-enabled="{{true}}"  refresher-triggered="{{refresherTriggered}}">
 *      <paging model:refresher-triggered="{{refresherTriggered}}" ></paging>
 *  </scroll-view>
 * @props showNoMoreTip 是否显示没有更多提示，默认true
 * @props noMoreText 没有更多提示文字，默认“没有更多了”
 * @props emptyImage 空数据提示图片路径，默认“/static/img/empty.png”
 * @props emptyText 空数据提示文字，默认“暂无信息”
 *
 * @help
 * 1、组件支持3个插槽
 *      默认内容插槽
 *      加载中插槽（一般无需考虑）name="loading"
 *      空数据插槽（一般无需考虑）name="empty"
 * 2、如需设置骨架屏，可以妙用loading插槽
 *      <view slot="loading" wx:if="{{list.length===0}}">骨架屏内容</view>
 */

import onPullDownRefreshMixin from './mixins/page-pullDownRefresh';
import onReachBottomMixin from './mixins/page-reachBottom';
const getCurrentPage = function () {
  const pages = getCurrentPages();
  return pages[pages.length - 1];
};
const isObject = function (obj) {
  return obj != null && typeof obj == 'object' && !Array.isArray(obj);
};
const isFunction = function (obj) {
  return typeof obj == 'function';
};
const deepClone = function (data) {
  //string,number,bool,null,undefined,symbol,object,array,date
  if (data && typeof data == 'object') {
    //针对函数的拷贝
    if (typeof data == 'function') {
      let tempFunc = data.bind(null);
      tempFunc.prototype = deepClone(data.prototype);
      return tempFunc;
    }

    switch (Object.prototype.toString.call(data)) {
      case '[object String]':
        return data.toString();
      case '[object Number]':
        return Number(data.toString());
      case '[object Boolean]':
        return new Boolean(data.toString());
      case '[object Date]':
        return new Date(data.getTime());
      case '[object Array]':
        var arr = [];
        for (let i = 0; i < data.length; i++) {
          arr[i] = deepClone(data[i]);
        }
        return arr; //js自带对象或用户自定义类实例

      case '[object Object]':
        var obj = {};
        for (let key in data) {
          //会遍历原型链上的属性方法，可以用hasOwnProperty来控制 （obj.hasOwnProperty(prop)
          obj[key] = deepClone(data[key]);
        }
        return obj;
    }
  } else {
    //string,number,bool,null,undefined,symbol
    return data;
  }
};
Component({
  options: {
    multipleSlots: true,
  },
  behaviors: [
    onPullDownRefreshMixin(function () {
      this.onPullDownRefresh();
    }),
    onReachBottomMixin(function () {
      this.onReachBottom();
    }),
  ],
  properties: {
    pagingRefField: {
      type: String,
      value: 'paging',
    },
    //页面绑定的数据属性
    filed: {
      type: String,
      value: 'list',
    },
    //api请求url
    reqUrl: {
      type: [String, Function],
    },
    //api请求方式
    reqMethod: {
      type: String,
      value: 'GET',
    },
    //每页请求条数
    limit: {
      type: [Number, String],
      value: 10,
    },
    //请求参数
    params: {
      type: [Object, Function],
    },
    //是否需要登录验证
    needLogin: {
      type: Boolean,
      value: false,
    },
    throttle: {
      type: [Number, String],
      // value: 300,
      value: 0,
    },
    //初始化完毕立即请求
    immediatecheck: {
      type: Boolean,
      value: true,
    },
    //格式化处理函数
    formatHandler: Function,
    //刷新事件守卫 resolve(true)执行刷新  resolve(false)取消刷新
    beforeRefresh: Function,
    //scroll-view 下拉刷新状态（使用scroll-view并且开启下拉刷新时需要使用）
    refresherTriggered: Boolean,
    //是否显示没有更多提示
    showNoMoreTip: {
      type: Boolean,
      value: true,
    },
    //没有更多提示文字
    noMoreText: {
      type: String,
      value: 'No more',
    },
    //empty提示图片
    emptyImage: {
      type: String,
      value: '/static/imgs/No Notifictations yet.jpg',
    },
    // empty提示文字
    emptyText: {
      type: String,
      value: '',
    },
  },
  data: {
    empty: true,
    loading: true,
    initLoaded: false,
    finished: false,
  },
  pageInstance: null,
  page: 1,
  isSpliceSoming: false, //要删除一条或者多条数据(此时单纯调用splice会导致下一页数据不同步，可能还会导致页面内容过少，无法触发触底事件加载下一页，为true阶段去请求下一页指定数量的数据，删除成功后追加数据)。
  isSpliceSomingLimit: 0, //该阶段请求弥补的数据条数
  isSpliceSomeList: [], //弥补的数据
  lifetimes: {
    attached() {
      this.pageInstance = getCurrentPage();
      let pagingRefNames = this.pageInstance.pagingRefNames;
      this.pageInstance.pagingRefNames = Array.isArray(pagingRefNames) ? pagingRefNames.concat([this.data.pagingRefField]) : [this.data.pagingRefField];
      this.pageInstance[this.data.pagingRefField] = {
        immediatecheck: this.data.immediatecheck,
        reRequest: this.reRequest.bind(this),
        onSpliceReady: this.onSpliceReady.bind(this),
      };

      //初始化，否则默认为undefined
      this.page = 1;
      this.isSpliceSoming = false;
      this.isSpliceSomeList = [];
    },
    detached() {
      this.pageInstance = null;
    },
  },
  ready() {
    this.data.immediatecheck &&
      wx.nextTick(() => {
        this.reRequest();
      });
  },
  methods: {
    req() {
      return new Promise((resolve, reject) => {
        let reqData = {
          current: this.isSpliceSoming ? this.page + 1 : this.page, //php--->page
          size: this.data.limit, //php-->limit
          size: this.data.limit,
        };
        if (this.data.params) {
          if (isObject(this.data.params)) {
            Object.assign(reqData, this.data.params);
          } else if (isFunction(this.data.params)) {
            Object.assign(reqData, this.data.params.call(this.pageInstance));
          }
        }

        const url = isFunction(this.data.reqUrl) ? this.data.reqUrl.call(this.pageInstance) : this.data.reqUrl;
        this.pageInstance
          .request({
            url,
            method: this.data.reqMethod,
            login: this.data.needLogin,
            data: reqData,
          })
          .then(res => {
             
            res.data.data = res.data.records
            resolve(res.data); //后端返回接口多了一个data
            // resolve(res.rows); //如果是返回res.rows
            //   resolve(res.data)//正常情况
          })
          .catch(() => {
            reject(false);
          });
      });
    },
    getList(refresh) {
      return new Promise((resolve,reject)=>{
        const startTime = Date.now();
        this.setData({
          loading: true,
          initLoaded: true,
        });
  
        if (refresh) {
          this.setData({
            "this.data.filed": [],
          });
          this.setData({
            empty: true,
            finished: false,
          });
  
          this.page = 1;
        }
  
        this.req()
          .then(async res => {
             
            if (res.data) res.data = res.data;
            if (!res.data) res.data = [];
            let pagePushObj = {};
            let pushObj = {};
             
            let result = res.data;
             
             
            if (this.data.formatHandler) {
              result = await this.data.formatHandler.call(this.pageInstance, {
                result: res,
                isRefresh: refresh,
              }); //页面方法(可以格式化数据)
            }
  
            const endTime = Date.now();
            const throttle = Number(this.data.throttle);
            const interval = endTime - startTime;
            if (interval < throttle) {
              await this.sleep(throttle - interval);
            }
            if (refresh) {
              this.pageInstance.setData({
                [this.data.filed]: [],
              });
            }
  
            let length = this.pageInstance.data[this.data.filed].length;
            for (let item of result) {
              Reflect.set(pagePushObj, [`${this.data.filed}[${length}]`], item);
              length++;
            }
  
            Object.assign(pushObj, {
              loading: false,
  
              empty: result.length == 0 && this.pageInstance.data[this.data.filed].length == 0,
            });
  
            if (length == res.total || res.data.length == 0 || res.total == undefined)
              Object.assign(pushObj, {
                finished: true,
              });
  
            if (refresh) {
              Object.assign(pushObj, {
                refresherTriggered: false,
              });
              wx.stopPullDownRefresh();
            }
             
            this.pageInstance.setData(pagePushObj);
            this.setData(pushObj);
            resolve()
             
          })
          .catch(() => {
            if (refresh) {
              wx.stopPullDownRefresh();
              this.setData({
                refresherTriggered: false,
              });
              reject()
            }
          });
      })

    },
    onReachBottom() {
       
      if (this.data.loading || this.data.finished) return;
      this.page++;
      this.getList();
    },
    async onPullDownRefresh() {
      if (this.data.refresherTriggered) return;

      if (this.data.beforeRefresh) {
        let next = await this.data.beforeRefresh.call(this.pageInstance);
        if (!next) {
          wx.stopPullDownRefresh();
          return this.setData({
            refresherTriggered: false,
          });
        }
      }

      this.setData({
        refresherTriggered: true,
      });
      this.reRequest();
    },
    //延迟执行
    sleep(time = 0) {
      return new Promise(resolve => {
        let delayTimeId = setTimeout(() => {
          resolve(true);
          clearTimeout(delayTimeId);
        }, time);
      });
    },
    reRequest() {
      return new Promise((resolve,reject) => {
        this.getList(true).then(resolve).catch(reject);
      })
    },
    onSpliceReady(indexs) {
      return new Promise(async resolve => {
        let indexArray = deepClone(indexs);
        if (!Array.isArray(indexArray)) indexArray = [indexs];
        const isRefresh = await this.spliceSomeBefore(indexArray.length);
        resolve(this.spliceDone.bind(this, indexArray, isRefresh));
      });
    },
    spliceSomeBefore(nums) {
       
      return new Promise(async resolve => {
        if (this.data.finished) return resolve(false);
        /**删除数量大于请求limit，直接大刷新 */
        if (nums > Number(this.data.limit)) {
          return resolve(true);
        }
        this.isSpliceSoming = true;
        this.isSpliceSomingLimit = nums;
        this.req().then(async res => {
          if (res.rows) res.data = res.rows;
          if (!res.data) res.data = [];

          let result = res.data;

          if (this.data.formatHandler) {
            result = await this.data.formatHandler.call(this.pageInstance, {
              result: res,
              isRefresh: refresh,
            }); //页面方法(可以格式化数据)
          }

          if (result.length <= this.isSpliceSomingLimit) {
            this.isSpliceSomeList = result;
            this.setData({
              finished: true,
            });
          } else {
            this.isSpliceSomeList = result.slice(0, this.isSpliceSomingLimit);

          }

          this.isSpliceSoming = false;
          resolve(false);
        });
      });
    },
    spliceDone(indexArray, isRefresh) {
      if (isRefresh) {
        this.reRequest();
      } else {
        let list = this.pageInstance.data[this.data.filed];
         

        indexArray.forEach(index => {
          delete list[index];
        });
        list = list.filter(item => item);
        this.pageInstance.setData({
          [this.data.filed]: list,
        });
        list.length == 0 &&
          this.setData({
            empty: true,
          });
        this.spliceSomeAfter();
      }
    },
    spliceSomeAfter() {
      const list = this.pageInstance.data[this.data.filed];
      if (this.isSpliceSomeList.length == 0) {
        if (list.length == 0)
          this.setData({
            empty: true,
          });
        return;
      }
      let pushObj = {};
      let length = list.length;
      for (let item of this.isSpliceSomeList) {
        Reflect.set(pushObj, [this.data.filed + '[' + length + ']'], item);
        length++;
      }
      this.pageInstance.setData(pushObj);
      this.setData({
        empty: false,
      });
      this.isSpliceSomeList = [];
    },
  },
});