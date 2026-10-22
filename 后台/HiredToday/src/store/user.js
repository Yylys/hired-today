import { defineStore } from "pinia"

export const userStore = defineStore({
    id: "user",
    state: () => {
        return {
            includeList: ["Home"], // 缓存页面的数组
            userinfo: null,
            oneNavCur: 0,
            showStyle: true, // 风格，true只显示左侧一级，false为显示一二级导航
            seconeTitle: "",
            menu_id: "", // 菜单ID
            permissions: [], // 权限标识
        }
    },
    actions: {

        // 权限标识
        setPermissions(data) {
            this.permissions = data
        },

        setInfo(data) {
            this.userinfo = data
        },

        // 菜单ID
        setMenuID(data) {
            this.menu_id = data
        },

        // 全局样式
        setStyle(data) {
            this.showStyle = data
        },

        setCur(data) {
            this.oneNavCur = data
        },

        // 修改左侧二级菜单头部标题
        setSecondTitle(data) {
            this.seconeTitle = data
        },

        //插入缓存数组
        setInclude(data) {
            var index = this.includeList.findIndex((item) => item === data)
            if (index == -1) {
                this.includeList.push(data)
            }
        },
        //删除对应缓存字段
        delInclude(data) {
            var index = this.includeList.indexOf(data)
            if (index > -1) {
                this.includeList.splice(index, 1)
            }
        },
        // 赋值
        getInclude(data) {
            this.includeList = data
        },

        // 用户退出，清除本地数据
        logout() {
            this.userinfo = null
            this.includeList = []
            sessionStorage.clear()
            sessionStorage.clear()
        },
    },
    // 开启数据缓存，在 strategies 里自定义 key 值，并将存放位置由 sessionStorage 改为 sessionStorage
    // 默认所有 state 都会进行缓存，你可以通过 paths 指定要持久化的字段，其他的则不会进行持久化，如：paths: ['name', 'age'] 替换key的位置
    persist: {
        enabled: true,
        strategies: [
            {
                key: "users",
                storage: sessionStorage,
            },
        ],
    },
})
