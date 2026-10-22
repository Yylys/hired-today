const getCurrentPage = function () {
    const pages = getCurrentPages();
    return pages[pages.length - 1];
};
const onPageReachBottom = function (event) {
    const page = getCurrentPage();
    if (!page) return;
    const { pageReachBottomHandler } = page;
    pageReachBottomHandler === null || pageReachBottomHandler === void 0
        ? void 0
        : pageReachBottomHandler.forEach(handler => {
              if (typeof handler === 'function') {
                  handler(event);
              }
          });
};
export default reachBottomHandler => {
    return Behavior({
        attached() {
            const page = getCurrentPage();
            if (!page) return;
            const bindReachBottomHandler = reachBottomHandler.bind(this);
            if (bindReachBottomHandler) {
                this._bindReachBottomHandler = bindReachBottomHandler;
            }
            if (Array.isArray(page.pageReachBottomHandler)) {
                page.pageReachBottomHandler.push(bindReachBottomHandler);
            } else {
                page.pageReachBottomHandler =
                    typeof page.onReachBottom === 'function' ? [page.onReachBottom.bind(page), bindReachBottomHandler] : [bindReachBottomHandler];
            }
            page.onReachBottom = onPageReachBottom;
        },
        detached() {
            var _a;
            const page = getCurrentPage();
            if (!page) return;

            page.pageReachBottomHandler =
                ((_a = page.pageReachBottomHandler) === null || _a === void 0 ? void 0 : _a.filter(item => item !== this._bindReachBottomHandler)) || [];
        },
    });
};
