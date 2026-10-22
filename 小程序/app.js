const config = require('./utils/config.js');
const unit = require('./utils/util.js');

App({


  onLaunch() {
      checkUpdate();
      wx._request=config.request
      wx._baseURL=config.baseURL
      wx._ImgbaseURL=config.ImgbaseURL
      wx._unit=unit
  },
  globalData: {
      userInfo: null,
      latitude: 0,
      longitude: 0,
  },
});




// 版本更新
function checkUpdate() {
  if (wx.canIUse('getUpdateManager')) {
      const updateManager = wx.getUpdateManager();
      updateManager.onCheckForUpdate(function (res) {
          // 请求完新版本信息的回调
          if (res.hasUpdate) {
              updateManager.onUpdateReady(function () {
                  // 新的版本已经下载好，调用 applyUpdate 应用新版本并重启
                  updateManager.applyUpdate();
              });
              updateManager.onUpdateFailed(function () {
                  // 下载失败
                  wx.showModal({
                      title: '提示',
                      content: '检查到有新版本但下载失败，请删除当前小程序重新搜索打开',
                      showCancel: false,
                  });
              });
          }
      });
  } else {
      //如果小程序需要在最新的微信版本体验，如下提示
      wx.showModal({
          title: '更新提示',
          content: '当前微信版本过低，无法使用该功能，请升级到最新微信版本后重试。',
      });
  }
}

/**
* 不需要每个页面再单独引入
*/
!(function () {
  let PageTmp = Page;
  // let routerUrl = ''; //当前页面路由

  Page = function (pageConfig) {
      const basePage = require('./common/base');
      const baseUpload = require('./common/uploadFile');
      let behaviors = [basePage];

      pageConfig.useMixinUpload && behaviors.push(baseUpload);

      if (pageConfig.behaviors) {
          behaviors = behaviors.concat(pageConfig.behaviors);
      }

      delete pageConfig.behaviors;

      pageConfig = Object.assign(
          {
              behaviors,
              
              // onShareAppMessage: function () {
              //     //根据不同路由设置不同分享内容（微信小程序分享自带参数，如非特例，不需配置分享路径）
              //     let shareInfo = {};
              //     let noGlobalSharePages = [];
              //     //全局分享配置，如部分页面需要页面默认分享或自定义分享可以单独判断处理
              //     if (!routerUrl.includes(noGlobalSharePages)) {
              //         shareInfo = {};
              //     }
              //     return shareInfo;
              // },
          },
          pageConfig
      );

      // 配置页面模板
      PageTmp(pageConfig);
  };

  // wx.onAppRoute(function (res) {
  //     //app.js中需要在隐式路由中才能用getCurrentPages（）获取到页面路由
  //     let pages = getCurrentPages(),
  //         view = pages[pages.length - 1];
  //     routerUrl = view.route;
  // });
})();
