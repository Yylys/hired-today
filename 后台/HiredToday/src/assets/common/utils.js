/**
 * 防抖-一个需要频繁触发的函数，在规定时间内，只让最后一次生效，前面的不生效
 * @param {function} fn 要节流的函数
 * @param {number} delay 规定的时间，默认500ms
 * 用法：const bindInput = proxy.$util.debounce(() => { //函数 },500)
 */
export const debounce = (fn, delay = 500) => {
    let timer = null
    return function () {
        let context = this
        let args = arguments
        clearTimeout(timer)
        timer = setTimeout(function () {
            fn.apply(context, args)
        }, delay)
    }
}

/**
 * 节流-一个函数执行一次后，只有大于设定的执行周期才会执行第二次。有个需要频繁触发的函数，出于优化性能的角度，在规定时间内，只让函数触发的第一次生效，后面的不生效
 * @param {function} fn 要节流的函数
 * @param {number} delay 规定的时间，默认500ms
 * 用法：const bindInput = proxy.$util.throttle(() => { //函数 },500)
 */
export const throttle = (fn, delay = 500) => {
    let valid = true
    return function () {
        let context = this
        let args = arguments
        if (!valid) {
            return false
        }
        valid = false
        setTimeout(() => {
            fn.apply(context, args)
            valid = true
        }, delay)
    }
}

// 精准判断数据类型
export const getType = (obj) => {
    let type = typeof obj
    if (type != "object") {
        return type
    }
    return Object.prototype.toString.call(obj).replace(/^\[object (\S+)\]$/, "$1")
}

// 小于一万以下不变，大于一万则转换为带“万”单位，如“1.52万”
export const convertTenThousand = (num) => {
    num = Number(num)
    if (num == 0 || (num > 0 && num < 10000)) {
        return num
    } else {
        return (num / 10000).toFixed(2) + "万"
    }
}

// 取绝对值
export const abs = (val) => {
    if (val == "") return 0
    return Math.abs(val)
}

// 乘法，保留两位小数且不四舍五入
export const retainFloat = (a, b = 1, point = 2) => {
    var retain_nums = (parseInt(a * 100 * b) / 100).toFixed(point)
    return retain_nums
}

// 除法，保留两位小数且不四舍五入
export const divisionFloat = (a, b = 1, point = 2) => {
    var division_nums = (parseInt((a / b) * 100) / 100).toFixed(point)
    return division_nums
}

// 减法
export const subtract = (a, b = 0, point = 2) => {
    if (a === "") return ""
    if (!b) b = 0
    return (parseInt((a - b) * 100) / 100).toFixed(point)
}

// 加法
export const additions = (a, b = 0, point = 2) => {
    if (!b) b = 0
    var totals = Number(a) + Number(b)
    // return (parseInt(totals * 100) / 100).toFixed(point)
    return truncateNumber(totals, point)
}

function truncateNumber(num, point) {
    var str = num.toString() // 转换为字符串类型
    if (str.indexOf(".") !== -1) {
        // 判断是否有小数部分
        var parts = str.split(".") // 按点号切割成整数部分和小数部分
        let decimals = parts[1]
        if (point == 2) {
            decimals = decimals[1] ? decimals : decimals + "0"
        }
        return parts[0] + "." + decimals.substring(0, 2) // 返回拼接后的结果
        // return parseFloat(parts[0] + "." + decimals.substring(0, 2)) // 返回拼接后的结果
    } else {
        return num // 没有小数部分直接返回原值
    }
}

//富文本反转义html
export const escape2Html = (str) => {
    let arrEntities = { lt: "<", gt: ">", nbsp: " ", amp: "&", quot: '"' }
    return str.replace(/&(lt|gt|nbsp|amp|quot);/gi, function (all, t) {
        return arrEntities[t]
    })
}

//富文本转义html
export const html2Escape = (str) => {
    return sHtml.replace(/[<>&"]/g, function (c) {
        return { "<": "&lt;", ">": "&gt;", "&": "&amp;", '"': "&quot;" }[c]
    })
}

// 前端js注入，XSS安全问题解决-后台也需要开启
export const replaceStr = (str) => {
    return str.replace(/[<>"&\/`']/g, "")
}

// 格式化年月日，20230828 ——> 2023-08-28
export const formatDateLine = (str) => {
    if (!str) return ""
    str = str.toString()
    return `${str.substring(0, 4)}-${str.substring(4, 6)}-${str.substring(6)}`
}

// 获取url上的参数
export const getUrlParam = (name) => {
    let reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)") //构造一个含有目标参数的正则表达式对象
    let r = window.location.search.substr(1).match(reg) //匹配目标参数
    if (r != null) return decodeURIComponent(r[2])
    return null //返回参数值
}

// 当location.search获取不到参数时，使用这个函数获取指定域名参数
export const getUrls = (qs) => {
    let s = location.href.replace("?", "?&").split("&")
    let re = ""
    for (let i = 1; i < s.length; i++) {
        if (s[i].indexOf(qs + "=") == 0) {
            re = s[i].replace(qs + "=", "")
        }
    }
    return re
}

/**
 * 根据数组中字段排序,从小到大
 * @param property 要对比的某对象或数组中的字段参数
 * 用法示例：gg_type.sort(compare("gg_id"));
 */
export const compare = (property) => {
    return function (a, b) {
        let value1 = a[property]
        let value2 = b[property]
        return value1 - value2
    }
}

//根据数组中字段排序,从大到小
export const compare_big = (property) => {
    return function (a, b) {
        let value1 = a[property]
        let value2 = b[property]
        return value2 - value1
    }
}

// 根据身份证号获取生日
export const getBirthdayFromIdNumber = (idNumber) => {
    const year = idNumber.substring(6, 10);
    const month = idNumber.substring(10, 12);
    const day = idNumber.substring(12, 14);
    return `${year}年${month}月${day}日`;
  };

  // 根据身份证号获取生日
export const getBirthdayFromIdNumbers = (idNumber) => {
    const year = idNumber.substring(6, 10);
    const month = idNumber.substring(10, 12);
    const day = idNumber.substring(12, 14);
    return `${month}-${day}`;
  };

  // 根据身份证号获取年龄
export const getAge = (idCardNumber) => {
    // 获取出生日期
    var birthYear = parseInt(idCardNumber.substring(6, 10));
    var birthMonth = parseInt(idCardNumber.substring(10, 12)) - 1; // 月份从0开始
    var birthDay = parseInt(idCardNumber.substring(12, 14));

    // 计算年龄
    var today = new Date();
    var age = today.getFullYear() - birthYear;
    var monthDiff = today.getMonth() - birthMonth;
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDay)) {
        age--;
    }
    return  age
  };

    // 根据身份证号获取性别
export const getGender = (idCardNumber) => {
    var genderCode = parseInt(idCardNumber.charAt(16));
    
    // 判断性别
    if (genderCode % 2 === 0) {
        return "女";
    } else {
        return "男";
    }
  };

// 一维数组去重
export const unique = (array) => {
    return Array.from(new Set(array))
}

// 对象数组去重
export const uniqueObjArray = (arrs, key) => {
    // 利用Array.filter和map对象数组去重 （性能较高，推荐）
    return arrs.filter((item) => !map.has(item[key].toString()) && map.set(item[key].toString()))

    // 利用Array.filter和Array.includes 对象数组去重
    // let list = []
    // return arrs.filter((item) => !list.includes(item[key]) && list.push(item[key]))
}

/**
 * 获取今天时间
 * 格式YYYY-MM-DD
 */
export const getDate = () => {
    let date = new Date()
    let year = date.getFullYear()
    let month = date.getMonth() + 1
    let strDate = date.getDate()
    return [year, month, strDate].map(formatNumber).join("-")
}

/**
 * 时间戳转换为日期格式 YYYY-MM-DD HH:MM:SS
 * nowss：时间戳，若时间戳为13位时则不需要乘以1000，10位才需要
 * 需要转换成字符串才能获取数字长度
 * @param {Number} nowss：时间戳，若时间戳为13位时则不需要乘以1000，10位才需要，需要转换成字符串才能获取数字长度
 * @param {String} type YYYY-MM-DD HH:mm:ss-年月日 时分秒，YYYY-MM-DD-年月日，HH:mm:ss-时分秒，HH:mm-时分
 */
export const formatDate = (nowss, type = "YYYY-MM-DD HH:mm:ss") => {
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
    }
}

// 日期格式YYYY-MM-DD HH:MM:SS，date为中国标准时间
export const formatTime = (date) => {
    const year = date.getFullYear()
    const month = date.getMonth() + 1
    const day = date.getDate()
    const hour = date.getHours()
    const minute = date.getMinutes()
    const second = date.getSeconds()
    return [year, month, day].map(formatNumber).join("-") + " " + [hour, minute, second].map(formatNumber).join(":")
}

// 日期格式YYYY-MM-DD，date为中国标准时间
export const formatDates = (date) => {
    const year = date.getFullYear()
    const month = date.getMonth() + 1
    const day = date.getDate()
    return [year, month, day].map(formatNumber).join("-")
}

// 时间格式 HH:MM:SS
export const formatAtTimes = (date) => {
    const hour = date.getHours()
    const minute = date.getMinutes()
    const second = date.getSeconds()
    return [hour, minute, second].map(formatNumber).join(":")
}

// 计算两个日期相差的天数，sDate1和sDate2格式是2023-11-13
export const dateDiff = (sDate1, sDate2) => {
    var aDate, oDate1, oDate2, iDays
    aDate = sDate1.split("-")
    oDate1 = new Date(aDate[1] + "-" + aDate[2] + "-" + aDate[0]) // 转换为13-11-2023格式
    aDate = sDate2.split("-")
    oDate2 = new Date(aDate[1] + "-" + aDate[2] + "-" + aDate[0])
    iDays = parseInt(Math.abs(oDate1 - oDate2) / 1000 / 60 / 60 / 24) //把相差的毫秒数转换为天数
    return iDays
}

const formatNumber = (n) => {
    n = n.toString()
    return n[1] ? n : "0" + n
}

// 日期格式YYYY-MM-DD HH:MM:SS 截取值YYYY-MM-DD
export const splitDate = (date) => {
    return date.split(" ")[0]
}

/**
 * 判断登录
 * userinfo 用户信息参数
 * 调用1:judgeLogin(userinfo).then(() => {}).catch(()=>{});
 */
export const judgeLogin = (userinfo) => {
    return new Promise((resolve, reject) => {
        if (userinfo && Object.keys(userinfo).length > 0) {
            resolve()
        } else {
            reject()
        }
    })
}

/**
 * 隐藏手机中间4位数
 * @param {data} 传入数据
 * 格式：1820****111
 */
export const hidePhone = (data) => {
    return data.replace(/^(\d{3})\d+(\d{4})$/, "$1****$2")
}

/**
 * 隐藏身份证中间8位数
 * @param {data} 传入数据
 * 格式：530026******2101
 */
export const idCard = (data) => {
    return data.replace(/(.{6}).*(.{4})/, "$1********$2")
}

/**
 * 保留前后四位 中间每4个*会有一个空格  6212 **** **** *** 0222
 * @param {value} 传入数据
 */
export const bankCard = (value) => {
    if (value && value.length > 8) {
        return `${value.substring(0, 4)} ${"*".repeat(value.length - 8).replace(
            /(.{4})/g,
            `
		$1 `
        )}${value.length % 4 ? " " : ""}${value.slice(-4)}`
    }
    return value
}

/**
 * 只显示后四位 **** **** *** 0222
 * @param {value} 传入数据
 */
export const onlyFourBank = (value) => {
    if (value && value.length > 8) {
        return `${"*".repeat(value.length - 4)}${value.length % 4 ? "" : ""}${value.slice(-4)}`
    }
    return value
}

/**
 * 验证身份证格式
 */
export const testCard = (text) => {
    let idcardReg = /^[1-9]\d{5}[1-9]\d{3}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])\d{3}([0-9]|X)$/
    return idcardReg.test(text)
}

/**
 * 只隐藏姓名中间的字
 * @param {data} 传入数据
 * 格式：张*三
 */
export const hideCenterName = (name) => {
    let newStr
    if (name.length === 2) {
        newStr = name.substr(0, 1) + "*"
    } else if (name.length > 2) {
        let char = ""
        for (let i = 0, len = name.length - 2; i < len; i++) {
            char += "*"
        }
        newStr = name.substr(0, 1) + char + name.substr(-1, 1)
    } else {
        newStr = name
    }
    return newStr
}

/**
 * 只显示姓氏
 * @param {data} 传入数据
 * 格式：张**
 */
export const showFirstName = (name) => {
    let newStr
    if (name.length === 2) {
        newStr = name.substr(0, 1) + "*"
    } else if (name.length > 2) {
        let char = ""
        for (let i = 0, len = name.length - 1; i < len; i++) {
            char += "*"
        }
        newStr = name.substr(0, 1) + char
    } else {
        newStr = name
    }
    return newStr
}

/**
 * element-ui message消息提示框封装
 * @param {String} text 文字内容
 * @param {String} type success/warning/info/error，默认success
 * @param {String} duration 显示时间，默认3000
 */
// import { ElMessage } from 'element-plus'
// export const messages = (text = '保存成功', type = "success", duration = 1500) => {
//     ElMessage({
//         message: text,
//         type: type,
//         duration: duration,
//     })
//     setTimeout(() => {
//         ElMessage.closeAll()
//     }, duration);
// }

/**
 * element-ui 自定义验证方法集合
 * @property {function} validPhone 验证手机号
 * @property {function} validNumOrPoint 格式为整数或小数(保留两位小数)
 */
export const validPhone = (rule, value, callback) => {
    let reg = /^1[23456789]\d{9}$/
    if (value === "") {
        callback(new Error("请输入手机号"))
    } else if (!reg.test(value)) {
        callback(new Error("请输入正确的11位手机号码"))
    } else {
        callback()
    }
}

//格式为整数或小数(保留两位小数)
export const validNumOrPoint = (rule, value, callback) => {
    let regu = /^\d+(\.\d{1,2})?$/
    if (value === "") {
        callback(new Error("请输入数字"))
    } else if (!regu.test(value)) {
        callback(new Error("格式为整数或小数(保留两位小数)"))
    } else {
        callback()
    }
}

//格式为正负整数或小数(保留两位小数)
export const validNumOrPointMinus = (rule, value, callback) => {
    let regu = /^\-?\d+(\.\d{1,2})?$/
    if (value === "") {
        callback(new Error("请输入数字"))
    } else if (!regu.test(value)) {
        callback(new Error("格式为整数或小数(保留两位小数)"))
    } else {
        callback()
    }
}
