export function rpx2px(rpx) {
    return (rpx / 750) * wx.getSystemInfoSync().windowWidth;
}

export function debounce(func, delay) {
    // 设置定时器标识
    let timer;
    // 难点返回事件绑定函数
    return function () {
        // func指定this
        let context = this;
        // func参数
        let args = arguments;
        // 先清除定时器
        clearTimeout(timer);
        //设置定时器
        timer = setTimeout(() => {
            // 调用函数
            func.apply(context, args);
        }, delay);
    };
}
