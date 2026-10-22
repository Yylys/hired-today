// config.js
// const baseURL = 'http://192.168.1.41:8701'; // 公共路径
// const ImgbaseURL = 'http://192.168.1.41:8701/v1/resources'; // 图片公共路径
const baseURL = 'https://hiredtoday.cn/api'; // 公共路径
const ImgbaseURL = 'https://hiredtoday.cn/api/v1/resources'; // 图片公共路径
// utils/request.js
// 定义请求拦截器   
function requestInterceptor(config) {
  // 在请求发送前可以对请求进行处理，例如添加 token、修改请求头等
  // 这里简单地将 token 添加到请求头中

  const token = wx.getStorageSync('token');
  if (token) {
    config.header.Authorization = 'Bearer ' + token;
  }
  return config;
}

// 定义响应拦截器
function responseInterceptor(response) {

  // 在收到响应后可以对响应进行处理，例如处理错误、数据格式化等
  if (response.statusCode >= 200 && response.statusCode < 300) {
    // 响应状态码在 200 到 300 之间表示成功，直接返回响应数据
    if (response.data.code == 403) {
      wx.redirectTo({
        url: '/pages/login/login',
      });
    } else if (response.data.code == 501) {
                wx.showModal({
                    title: '',
                    content: response.data.msg,
                    confirmText: 'Confirm', // 确认按钮的文本
                    showCancel: false, // 只显示确认按钮
                    success(res) {
                      if (res.confirm) {
                        // 用户点击确认后跳转到首页
                        wx.redirectTo({
                          url: '/pages/index/index',
                        });
                      }
                    }
                  });
    }
    return response.data;
  } else {
    // 其他状态码可能表示请求失败，这里抛出一个错误
    throw new Error('请求失败，状态码：' + response.statusCode);
  }
}

// 封装请求函数
function request(url, method, data) {
  // 发送请求前调用请求拦截器
  const config = {
    url: baseURL + url,
    method: method,
    data: data,
    header: {
      'Content-Type': 'application/json' // 设置默认请求头
    }
  };
  const modifiedConfig = requestInterceptor(config);

  return new Promise((resolve, reject) => {
    wx.showLoading({
      title: 'Loading...',
      mask: true, // 遮罩层，阻止用户进行其他操作
    });
    wx.request({
      url: modifiedConfig.url,
      method: modifiedConfig.method,
      data: modifiedConfig.data,
      header: modifiedConfig.header,
      success: res => {
        wx.hideLoading(); // 隐藏 loading
          try {
            const modifiedResponse = responseInterceptor(res);
            resolve(modifiedResponse);

          } catch (error) {
            reject(error);
          }
      },
      fail: err => {
        wx.hideLoading(); // 请求失败后隐藏 loading
        reject(err);

      }
    });
  });
}

module.exports = {
  request: request
};

module.exports = {
  baseURL: baseURL,
  ImgbaseURL: ImgbaseURL,
  request: request,
};