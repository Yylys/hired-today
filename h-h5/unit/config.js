// config.js
let baseURLs = ''; // 公共路径
process.env.NODE_ENV === 'development' ? (baseURLs = '/api/v1') : (baseURLs = '/api/v1')
//
// export const baseURL = 'http://192.168.1.75:8701'; // 图片公共路径
// export const ImgbaseURL = 'http://192.168.1.75:8701/v1/resources'; // 图片公共路径
export const baseURL = 'https://hiredtoday.cn/api/v1'; // 公共路径
export const ImgbaseURL = 'https://hiredtoday.cn/api/v1/resources'; // 图片公共路径
// utils/request.js
// 定义请求拦截器
function requestInterceptor(config) {
	// 在请求发送前可以对请求进行处理，例如添加 token、修改请求头等
	// 这里简单地将 token 添加到请求头中
	// console.log(config,'config');
	const token = uni.getStorageSync('token');
	if (token) {
		config.header.Authorization = 'Bearer ' + token;
	}
	return config;
}

// 定义响应拦截器
function responseInterceptor(response) {
	// console.log(response,'response');
	// 在收到响应后可以对响应进行处理，例如处理错误、数据格式化等
	if (response.statusCode >= 200 && response.statusCode < 300) {
		// 响应状态码在 200 到 300 之间表示成功，直接返回响应数据
		if (response.data.code == 403) {
			// uni.redirectTo({
			// 	url: '/pages/index/index',
			// });
		}
		return response.data;
	} else {
		// 其他状态码可能表示Request Failure，这里抛出一个错误
		throw new Error('Request Failure，状态码：' + response.statusCode);
	}
}

// 封装请求函数
export function request(url, method, data) {
	// 发送请求前调用请求拦截器
	const config = {
		url:  baseURL + url,
		method: method,
		data: data,
		header: {
			'Content-Type': 'application/json', // 设置默认请求头
			// "Access-Control-Allow-Origin": "*"
		}
	};

	const modifiedConfig = requestInterceptor(config);
	console.log(modifiedConfig,'modifiedConfig');

	return new Promise((resolve, reject) => {
		uni.request({
			url: modifiedConfig.url,
			method: modifiedConfig.method,
			data: modifiedConfig.data,
			header: modifiedConfig.header,
			success: res => {
				// 收到响应后调用响应拦截器
				try {
					const modifiedResponse = responseInterceptor(res);
					resolve(modifiedResponse);
				} catch (error) {
					reject(error);
				}
			},
			fail: err => {
				reject(err);
			}
		});
	});
}


// module.exports = {
//   baseURL: baseURL,
//   ImgbaseURL: ImgbaseURL,
//   request: request,
// };