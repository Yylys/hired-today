module.exports = Behavior({
    data: {
        page: 1,
        list: [],
        empty: true,
        loading: true,
        finished: false,
        triggered: false,
        searchValue: '', //搜索文本
        isSpliceSoming: false, //要删除一条或者多条数据(此时单纯调用splice会导致下一页数据不同步，可能还会导致页面内容过少，无法触发触底事件加载下一页，为true阶段去请求下一页指定数量的数据，删除成功后追加数据)。
        isSpliceSomingLimit: 0, //该阶段请求弥补的数据条数
        isSpliceSomeList: [], //弥补的数据
    },
    login: false, //请求不需要登录验证
    throttle: 0, //有的时候，API 的请求回来的特别快，往往骨架占位刚刚被渲染，真实的数据就已经回来了，用户的界面会突然一闪， 此时为了避免这种情况，就需要通过 throttle 属性来避免这个问题。
    methods: {
        getParamsData() {
            //页面特殊的请求参数，需要时在页面内覆盖此方法，默认返回{}
            return {};
        },
        getReqUrl() {
            //增加一个方法改变url请求参数,需要时在页面内覆盖此方法(this.data.reqUrl不存在时生效)
        },
        getList(refresh) {
            this.setData({ loading: true });
            if (refresh) {
                this.setData({
                    list: [],
                    empty: true,
                    finished: false,
                });

                this.data.page = 1;
            }

            this.req()
                .then(async res => {
                    await this.sleep(this.throttle || 0);
                    if (!res.data) res.data = [];

                    let pushObj = {};

                    let result = res.data;

                    if (this.formatHandler) {
                        result = await this.formatHandler(res, refresh); //页面方法(可以格式化数据)
                    }

                    refresh && this.setData({ list: [] });
                    let length = this.data.list.length;

                    for (let item of result) {
                        Reflect.set(pushObj, ['list[' + length + ']'], item);
                        length++;
                    }

                    Object.assign(pushObj, {
                        loading: false,
                        empty: result.length === 0 && this.data.list.length === 0,
                    });

                    if (length === res.total || res.data.length === 0 || res.total == undefined) Object.assign(pushObj, { finished: true });

                    if (refresh) {
                        Object.assign(pushObj, { triggered: false });
                        wx.stopPullDownRefresh();
                    }

                    this.setData(pushObj);
                })
                .catch(() => {
                    if (refresh) {
                        wx.stopPullDownRefresh();
                        this.setData({ triggered: false });
                    }
                });
        },
        req() {
            return new Promise((resolve, reject) => {
                let paramsData = this.getParamsData();
                let reqData = {
                    page: this.data.isSpliceSoming ? this.data.page + 1 : this.data.page,
                    limit: 10,
                    ...paramsData,
                };
                this.request({
                    url: this.reqUrl || this.getReqUrl(),
                    login: this.login,
                    data: reqData,
                })
                    .then(res => {
                        resolve(res);
                    })
                    .catch(() => {
                        reject(false);
                    });
            });
        },
        spliceSomeBefore(nums) {
            return new Promise(async resolve => {
                if (this.data.finished) return resolve(false);
                /**删除数量大于请求limit，直接大刷新 */
                const paramsData = this.getParamsData();
                const limit = paramsData.limit || 10;
                if (nums > limit) {
                    return resolve(true);
                }

                this.data.isSpliceSoming = true;
                this.data.isSpliceSomingLimit = nums;
                this.req().then(async res => {
                    if (!res.data) res.data = [];

                    let result = res.data;

                    if (this.formatHandler) {
                        result = await this.formatHandler(res, false); //页面方法(可以格式化数据)
                    }

                    if (result.length <= this.data.isSpliceSomingLimit) {
                        this.data.isSpliceSomeList = result;
                        this.setData({ finished: true });
                    } else {
                        this.data.isSpliceSomeList = result.slice(0, this.data.isSpliceSomingLimit);
                    }
                    this.data.isSpliceSoming = false;
                    resolve(false);
                });
            });
        },
        spliceSomeAfter() {
            if (this.data.isSpliceSomeList.length === 0) {
                if (this.data.list.length === 0) this.setData({ empty: true });
                return;
            }
            let pushObj = {};
            let length = this.data.list.length;
            for (let item of this.data.isSpliceSomeList) {
                Reflect.set(pushObj, ['list[' + length + ']'], item);
                length++;
            }
            pushObj.empty = false;
            this.setData(pushObj);
            this.data.isSpliceSomeList = [];
        },
        /**刷新前 resolve(false)不执行刷新 */
        beforeRefresh() {
            return new Promise(resolve => {
                resolve(true);
            });
        },
        async onRefresh() {
            //scroll-view下拉刷新
            if (this.data.triggered) return;
            let next = await this.beforeRefresh();
            if (!next) return this.setData({ triggered: false });
            this.setData({ triggered: true });
            this.getList(true);
        },
        async onPullDownRefresh() {
            //页面下拉刷新
            let next = await this.beforeRefresh();
            if (!next) return wx.stopPullDownRefresh();
            this.getList(true);
        },
        onReachBottom: function () {
            //页面加载更多
            if (this.data.loading || this.data.finished) return;
            this.onLoadMore();
        },
        onLoadMore() {
            //scroll-view加载更多
            if (this.data.loading || this.data.finished) return;
            this.data.page++;
            this.getList();
        },
        /**如果有搜索框 */
        onSearchChange({ detail }) {
            if (detail.value === '') {
                this.onSearchSubmit(); //清空内容自动请求
            }
        },
        onSearchSubmit() {
            this.setData({
                list: [],
                empty: true,
            });
            this.getList(true);
        },
    },
});
