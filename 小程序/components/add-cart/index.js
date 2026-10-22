import { deepClone } from '../../utils/util.js';
Component({
    /**
     * 组件的属性列表
     */
    properties: {
        show: Boolean,
        showField: {
            type: String,
            value: 'showAddCartPopup',
        },
        good: Object,
        i18n_language: Object,
        addCartGoodIndex: Number,
        i18: Object,
    },

    /**
     * 组件的初始数据
     */
    data: {
        addCartNum: 1,
        addCartTotalPrice: 0,
        buttonDisabled: false,
        goodInfo: {}, //包装过的商品信息
        stock: 0,
        singlePrice: void 0,
    },
    pageObj: null,
    addCartTimeId: '',
    chooseSku: null, //暂存生效的sku
    observers: {
        good: function (newValue) {
            if (newValue) {
                this.setData({
                    addCartNum: 1,
                    addCartTotalPrice: 0,
                    buttonDisabled: false,
                    stock: 0,
                });
                this.chooseSku = null;
                this.packageGood(newValue);
            }
        },
    },
    /**
     * 组件的生命周期
     */
    lifetimes: {
        // 在组件实例进入页面节点树时执行
        attached: function () {
            try {
                const pages = getCurrentPages();
                this.pageObj = pages[pages.length - 1];
            } catch (error) {}
        },
    },

    /**
     * 组件的方法列表
     */
    methods: {
        packageGood(good) {
            let goodInfo = deepClone(good);
            goodInfo.attribute.forEach(item => {
                item.activeAttr = 0; //客户要求默认选中第一个
            });
            this.setData({ goodInfo });
            this.computeTotalPrice();
        },
        close() {
            return new Promise(resolve => {
                this.pageObj.setData(
                    {
                        [`${this.data.showField}`]: false,
                    },
                    () => {
                        resolve(true);
                    }
                );
            });
        },
        chooseAttr(e) {
            clearTimeout(this.addCartTimeId);
            this.addCartTimeId = setTimeout(() => {
                const { index, attrindex: attrIndex } = e.currentTarget.dataset;
                const { goodInfo } = this.data;
                if (attrIndex === goodInfo.attribute[index].activeAttr) return;

                this.setData({
                    [`goodInfo.attribute[${index}].activeAttr`]: attrIndex,
                });

                if (this.isChooseAllAttr()) {
                    this.setData({ addCartNum: 1 });
                    this.computeTotalPrice();
                }
                clearTimeout(this.addCartTimeId);
            }, 100);
        },
        isChooseAllAttr() {
            return this.data.goodInfo.attribute.every(item => {
                return item.activeAttr != null;
            });
        },
        matchingSinglePrice() {
            const { goodInfo } = this.data;
            let formatChooseAttr = {};
            goodInfo.attribute.forEach(item => {
                formatChooseAttr[item.title] = item.item[item.activeAttr].title;
            });

            const skuItem = goodInfo.sku.find(item => {
                let flag = true;
                for (let key in formatChooseAttr) {
                    if (item[key] !== formatChooseAttr[key]) {
                        flag = false;
                    }
                }
                return flag;
            });

            this.setData({
                addCartNum: Math.max(this.data.addCartNum, Number(skuItem.min_num)),
                stock: Number(skuItem.stock),
                singlePrice: Number(skuItem.price),
            });
            this.chooseSku = skuItem;

            return Number(skuItem.price);
        },
        computeTotalPrice() {
            const singlePrice = this.matchingSinglePrice();
            const addCartTotalPrice = Number((singlePrice * this.data.addCartNum).toFixed(2));
            this.setData({ addCartTotalPrice });
        },
        reduce() {
            const { addCartNum, stock, i18 } = this.data;
            if (stock === 0 || addCartNum === 1) return;
            if (addCartNum === Number(this.chooseSku.min_num)) {
                return wx.showToast({
                    title: i18.startingFromSaleCount + this.chooseSku.min_num,
                    icon: 'none',
                });
            }

            this.setData({ addCartNum: addCartNum - 1 });
            this.computeTotalPrice();
        },
        add() {
            const { addCartNum, stock, i18 } = this.data;
            if (stock === 0) {
                return wx.showToast({
                    title: i18.mostTip + ' ' + stock,
                    icon: 'none',
                });
            }
            if (addCartNum >= stock) {
                if (addCartNum > stock) {
                    this.setData({ addCartNum: stock });
                    this.computeTotalPrice();
                }
                return wx.showToast({
                    title: i18.mostTip + ' ' + stock,
                    icon: 'none',
                });
            }

            this.setData({ addCartNum: addCartNum + 1 });
            this.computeTotalPrice();
        },
        confirmAddCart() {
            if (this.data.buttonDisabled) return;

            const { addCartNum, stock, i18 } = this.data;

            if (this.chooseSku == null) {
                return wx.showToast({
                    title: i18.chooseAttrTip,
                    icon: 'none',
                });
            }

            if (addCartNum > stock) {
                return wx.showToast({
                    title: i18.insufficientInventor,
                    icon: 'none',
                });
            }

            this.setData({ buttonDisabled: true });

            this.triggerEvent('confirmAdd', {
                index: this.data.addCartGoodIndex,
                addCartNum,
                sku: this.chooseSku,
                attrKey: this.data.goodInfo.attribute.map(item => item.title),
            });
            this.close();
        },
    },
});
