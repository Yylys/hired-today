/**
 * 使用该获取位置需要在页面的js文件引入
 * const getLocation = require('../../common/getLocation.js');
 * page（{
 * behaviors: [getLocation],
 * data：{....},
 * onLoad(){
 *   this.getLocation(() => {
            this.paging.reRequest();
        }, true);
 * }
 * }）
 */
import { themeColor } from "./config";

module.exports = Behavior({
  data: {
    latitude: "",
    longitude: "",
  },
  methods: {
    async getLocation(callback, force = false, complete) {
      let status = await this.authorize();
      try {
        if (!status) return this.tipAllowLocation(callback, force, complete);

        const res = await this.getAccurateFuzzyLocation();

        if (res) {
          const { latitude, longitude } = res;
          this.setData({
            latitude,
            longitude,
          });
          callback && callback();
        }
        complete && complete();
      } catch (error) {}
    },
    getAccurateFuzzyLocation() {
      return new Promise((resolve, reject) => {
        wx.getFuzzyLocation({
          type: "gcj02",
          success: (res) => {
            resolve(res);
          },
          fail() {
            const tip = "位置获取失败，请检查设备定位权限开启后重试";
            wx.showToast({
              title: tip,
              icon: "error",
            });
            reject(false);
          },
        });
      });
    },
    //提前获取授权
    authorize() {
      return new Promise((resolve) => {
        wx.authorize({
          scope: "scope.userFuzzyLocation",
          success() {
            resolve(true);
          },
          fail(err) {
            resolve(false);
          },
        });
      });
    },
    /**引导用户允许获取位置权限 */
    tipAllowLocation(callback, force, complete) {
      let that = this;
      wx.showModal({
          title: '提示',
          content: '你的位置信息将用于获取近距离可签到社群的距离，若拒绝授权，将不能获取距离社群的距离！即将前往小程序设置，请允许使用位置的服务。',
          confirmColor: themeColor,
          showCancel: true,
          confirmText: '前往',
          cancelText: '关闭',
          success(res) {
              if (res.confirm) {
                  wx.openSetting({
                      success(result) {
                          if (force) {
                              that.getLocation(callback, force, complete);
                          } else {
                              if (result.authSetting['scope.userFuzzyLocation']) that.getLocation(callback, force, complete);
                          }
                      },
                  });
              } else {
                  complete && complete();
              }
          },
      });
    },
  },
});
