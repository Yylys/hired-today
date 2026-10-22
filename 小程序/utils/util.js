const formatTime = date => {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const hour = date.getHours()
  const minute = date.getMinutes()
  const second = date.getSeconds()
  return `${[year, month, day].map(formatNumber).join('/')} ${[hour, minute, second].map(formatNumber).join(':')}`
}

const formatNumber = n => {
  n = n.toString()
  return n[1] ? n : `0${n}`
}

const formatDate = (nowss, type = "YYYY-MM-DD HH:mm:ss") => {
  let times = String(nowss).length === 10 ? new Date(nowss * 1000) : new Date(nowss)
  var year = times.getFullYear() //取得4位数的年份
  var month = times.getMonth() + 1 //取得日期中的月份，其中0表示1月，11表示12月
  var day = times.getDate() //返回日期月份中的天数（1到31）
  var hour = times.getHours() //返回日期中的小时数（0到23）
  var minute = times.getMinutes() //返回日期中的分钟数（0到59）
  var second = times.getSeconds() //返回日期中的秒数（0到59）
  if (type === "YYYY-MM-DD HH:mm:ss") {
    return [year, month, day].map(formatNumber).join("-") + " " + [hour, minute, second].map(formatNumber).join(":")
  } else if (type === "YYYY-MM-DD HH:mm") {
    return [year, month, day].map(formatNumber).join("-") + " " + [hour, minute].map(formatNumber).join(":")
  } else if (type === "YYYY-MM-DD") {
    return [year, month, day].map(formatNumber).join("-")
  } else if (type === "HH:mm:ss") {
    return [hour, minute, second].map(formatNumber).join(":")
  } else if (type === "HH:mm") {
    return [hour, minute].map(formatNumber).join(":")
  } else if (type === "YYYY-MM") {
    return [year, month].map(formatNumber).join("-")
  }
}


const qzz_login = () => {
  const userinfo = wx.getStorageSync('userinfo')
  if (userinfo) {
    console.log('存在');
    return true
  } else {
    console.log('不存在');

    return false
  }
}

const qzz_logins = () => {
  const userinfo = wx.getStorageSync('userinfo')
  if (!userinfo) {
    wx.showModal({
      content: 'Please complete your profile and resume to apply for positions.',
      confirmText: 'Create',
      cancelText: 'Later',
      cancelColor: '#9EA5B8',
      confirmColor: '#2623D1',
      success(res) {
        if (res.confirm) {
          wx.navigateTo({
            url: '/pages/information/information',
          })
        } else if (res.cancel) {
          console.log('用户点击取消')
        }
      }
    });
    return false
  } else if (userinfo.refine == true) {
    return true
  } else if (userinfo.refine == false) {
    wx.showModal({
      content: 'Please complete your profile and resume to apply for positions.',
      confirmText: 'Create',
      cancelText: 'Later',
      cancelColor: '#9EA5B8',
      confirmColor: '#2623D1',
      success(res) {
        if (res.confirm) {
          wx.navigateTo({
            url: '/pages/myresume/myresume',
          })
        } else if (res.cancel) {
          console.log('用户点击取消')
        }
      }
    });
    return false
  }
}

const updateForm=(form, resData, excludeFields = []) =>{
  return Object.keys(form).reduce((acc, key) => {
    // 如果字段不在排除列表中，并且后端数据有该字段且不为 undefined
    if (!excludeFields.includes(key) && resData.hasOwnProperty(key) && resData[key] !== undefined) {
      acc[key] = resData[key];  // 更新该字段
    } else {
      acc[key] = form[key];  // 保留原来的值
    }
    return acc;
  }, {});
}

// 获取OSS策略
function getOssPolicy(host) {
  return new Promise((resolve, reject) => {
    wx.request({
      url: host + 'common/getOssPolicy',  // 请求地址
      method: 'GET',
      data: {}, // 请求参数
      header: { 'Content-Type': 'application/json' },
      success: (res) => {
        resolve(res.data.data);
      },
      fail: (err) => {
        console.error('GET请求失败', err);
        reject(err);
      }
    });
  });
}

// 上传文件到OSS
function uploadToOss(filePath, ossData) {
  return new Promise((resolve, reject) => {
    const currentDate = new Date();
    const formattedDate = currentDate.toISOString().slice(0, 10).replace(/-/g, "");
    const host = ossData.host;
    const signature = ossData.signature;
    const ossAccessKeyId = ossData.accessid;
    const policy = ossData.policy;
    const dir = ossData.dir;
    
    const key = dir + 'imgs/' + formattedDate + Math.floor(Math.random() * 900000) + 100000 + filePath.split('/').pop();

    wx.uploadFile({
      url: host,
      filePath: filePath,
      name: 'file',  // 必须填file
      formData: {
        key,
        policy,
        OSSAccessKeyId: ossAccessKeyId,
        signature,
        // 'x-oss-security-token': securityToken  // 使用STS签名时必传
      },
      success: (uploadRes) => {
        if (uploadRes.statusCode === 204) {
          const imageUrl = `https://imgzh.kmmyxb.cn/${key}`;
          resolve(imageUrl);  // 返回上传后的图片URL
        } else {
          reject(new Error('Upload failed'));
        }
      },
      fail: (err) => {
        console.log(err, '上传失败');
        reject(err);  // 上传失败
      }
    });
  });
}


module.exports = {
  formatTime,
  formatDate,
  qzz_login,
  qzz_logins,
  updateForm,
  getOssPolicy,
  uploadToOss
}