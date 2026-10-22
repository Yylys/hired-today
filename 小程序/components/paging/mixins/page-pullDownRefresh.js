const getCurrentPage = function () {
    const pages = getCurrentPages();
    return pages[pages.length - 1];
};
const onPagePullDownRefresh = function (event) {
    const page = getCurrentPage();
    if (!page) return;
    const { pageOnPullDownRefresh } = page;
    pageOnPullDownRefresh === null || pageOnPullDownRefresh === void 0
        ? void 0
        : pageOnPullDownRefresh.forEach(onPullDownRefresh => {
              if (typeof onPullDownRefresh === 'function') {
                  onPullDownRefresh(event);
              }
          });
};
export default onPullDownRefresh => {
    return Behavior({
        attached() {
            const page = getCurrentPage();
            if (!page) return;
            const bindOnPullDownRefresh = onPullDownRefresh.bind(this);
            if (bindOnPullDownRefresh) {
                this._bindOnPullDownRefresh = bindOnPullDownRefresh;
            }
            if (Array.isArray(page.pageOnPullDownRefresh)) {
                page.pageOnPullDownRefresh.push(bindOnPullDownRefresh);
            } else {
                page.pageOnPullDownRefresh =
                    typeof page.onPullDownRefresh === 'function' ? [page.onPullDownRefresh.bind(page), bindOnPullDownRefresh] : [bindOnPullDownRefresh];
            }
            page.onPullDownRefresh = onPagePullDownRefresh;
        },
        detached() {
            var _a;
            const page = getCurrentPage();
            if (!page) return;
            page.pageOnPullDownRefresh =
                ((_a = page.pageOnPullDownRefresh) === null || _a === void 0 ? void 0 : _a.filter(item => item !== this._bindOnPullDownRefresh)) || [];
        },
    });
};
