<template>
    <div class="left">
        <nav class="first-nav">
            <div class="first-nav__logo">
                <el-popover popper-class="first-poper" :width="200" trigger="hover">
                    <template #default>
                        <div class="first-nav__wrap flexs" @click.stop="signOut">
                            <p>登录账号</p>
                            <p>{{ userinfo.nickName }}</p>
                        </div>
                        <div class="first-nav__wrap flexs" @click.stop="clickGk">
                            <p>返回首页</p>
                        </div>
                        <div class="first-nav__wrap flexs" @click.stop="ChangePass">
                            <p>修改密码</p>
                        </div>
                        <div class="first-nav__wrap flexs" @click.stop="signOut">
                            <p>退出登录</p>
                            <el-icon>
                                <switch-button />
                            </el-icon>
                        </div>
                    </template>
                    <template #reference>
                        <el-image style="width: 50px;" class="logo-img" :src="logo"></el-image>
                    </template>
                </el-popover>
            </div>
            <!-- showStyle为true时 -->
            <ul class="first-nav__ul">
                <li class="first-nav__li" v-for="(one, index) in navArr" :key="index"
                    :class="{ 'nav-active': oneNavCur === index, 'nav-hover': hoverCur === index }"
                    @mouseenter="mouseOneEnter(one, index)" @mouseleave="mouseOneLeave(one, index)">
                    <div class="first-nav__li-item" @click.stop="clickOneNav(one, index)">
                        <el-icon>
                            <component :is="one.icon" />
                        </el-icon>
                        <span>{{ one.menuName }}</span>
                    </div>
                    <div class="sub-box" v-show="one.children.length !== 0">
                        <h3 class="second-nav__h3">{{ seconeTitle }}</h3>
                        <div class="sub-ul" @click.stop>
                            <el-menu :default-active="route_paths" router text-color="#323233"
                                active-text-color="#323233" :default-openeds="default_arr" @select="selectMenu"
                                class="menu-box">
                                <menu-items v-for="route in one.children" :key="route.component"
                                    :item="route"></menu-items>
                            </el-menu>
                        </div>
                    </div>
                </li>
            </ul>
        </nav>
    </div>
</template>

<script setup>
import { getCurrentInstance, ref, reactive, computed, onMounted, watch, toRefs } from "vue"
import { useRouter, useRoute } from "vue-router"
import { userStore } from "@store/user"
import logo from "@images/logo.png"
import MenuItems from "./MenuItems.vue"
const userinfo = JSON.parse(sessionStorage.getItem("userinfo"));

import EventBus from "@common/event-bus" // EventBus事件总线，任意组件通信

const store = userStore()
const router = useRouter()
const route = useRoute()
const { proxy } = getCurrentInstance()

const route_paths = ref(null)
watch(
    () => route.path,
    (val) => {
        route_paths.value = val
    },
    {
        immediate: true,
    }
)

const data = reactive({
    navArr: [],
    oldnav: [], // 组合成新的一维数组
    default_arr: [], // 包含index值判断是否需要默认展开左侧菜单
    seconeTitle: "",
    hoverCur: null,
})

const oneNavCur = computed({
    get() {
        return store.oneNavCur
    },
    set(val) {
        store.setCur(val)
    },
})

watch(
    () => store.seconeTitle,
    (val) => {
        data.seconeTitle = val
    },
    {
        immediate: true,
    }
)

onMounted(() => {

    // console.log(1111111)
    // location.reload();

    get_nav()
})

// 获取导航
function get_nav() {
    proxy.$axios
        .get("/v1/menus/treeSelect")
        .then((res) => {
            switch (res.data.code) {
                case 200:
                    // let result =res.data.data
                    let result =JSON.parse(sessionStorage.getItem("userinfo")).menuTree; 
                    console.log(result,'result')
                    if (result.length > 0) {
                        const list = {
                            children: [],
                            component: "/Home",
                            created: null,
                            createdBy: null,
                            createdMilli: null,
                            delFlag: null,
                            icon: "DataAnalysis",
                            isFrame: 0,
                            menuName: "首页",
                            note: "",
                            parentTreeCode: null,
                            path: "/home",
                            permission: "home",
                            query: "",
                            sid: "100-f1afd68efdf34a5b96b762830ee4fb97",
                            status: 0,
                            treeCode: "1005",
                            type: 10,
                            updated: null,
                            updatedBy: null,
                            updatedMilli: null,
                            viewSort: 0,
                            visible: 0,
                        }
                        // result.unshift(list)
                        console.log(result,'result')
                        result = setmenu(result)
                        let zd_arrs = recursionArrs(result)
                        data.default_arr = getAllID(zd_arrs)
                        data.oldnav = JSON.parse(JSON.stringify(zd_arrs))
                        for (let i = 0; i < result.length; i++) {
                            if (result[i].children.length > 0 && result[i].children) {
                                if (result[i].children[0].children.length == 0) {
                                    result[i].component = result[i].children[0].component
                                } else {
                                    result[i].component = result[i].children[0].children[0].component
                                }
                            }
                        }
                        // setmenu(
                        // console.log(result,'result')
                        data.navArr =result
                        let index = oneNavCur.value ? oneNavCur.value : 0
                        pub_nav_title(index)
                    }
                    break
                default:
                    if (res.data.code != 403) {
                        proxy.$message({ message: res.data.msg, type: "error" })
                    }
                    break
            }
        })
        .catch((err) => { })
}

function setmenu(list, metadata = { totalItems: 0, deletedItems: [] }) {
    const result = [];
    for (let item of list) {
        metadata.totalItems++;  // 统计总项数
        if (userinfo.roleKeySet[0]!=='admin' && item.component === "/system/menu") {
            console.log(item, '我是菜单');
            metadata.deletedItems.push(item);  // 收集删除项
        } else {
            const newItem = { ...item };
            if (newItem.children && newItem.children.length > 0) {
                newItem.children = setmenu(newItem.children, metadata);
            }
            result.push(newItem);
        }
    }

    return result;
}





// 递归多维数组对象，然后组合成只包含path，id两个字段的一维数组对象
function recursionArrs(menuTreeList, menuList = []) {
    for (let item of menuTreeList) {
        if (item.component != null) {
            menuList.push({
                url: item.component,
                id: item.sid,
            })
        }
        if (item.children.length > 0) {
            recursionArrs(item.children, menuList)
        }
    }
    return menuList
}
// 遍历获取菜单ID，用于展开二级菜单
function getAllID(arrs) {
    let ids = []
    for (let i = 0; i < arrs.length; i++) {
        ids.push(arrs[i].id)
    }
    ids = Array.from(new Set(ids))

    return ids.map(String)
}

const selectMenu = (index, path) => {
    if (data.hoverCur != null) {
        oneNavCur.value = data.hoverCur
    }
    // 找到选中的菜单ID
    let id = data.oldnav.reduce((news, item) => {
        if (item.component === index) {
            news = item.sid
        }
        return news
    }, "")
    store.setMenuID(id)
    store.setStyle(false)
}

// 一级导航鼠标移入
const mouseOneEnter = (item, index) => {
    data.hoverCur = index
    if (item.children.length == 0) {
        pub_nav_title(oneNavCur.value)
    } else {
        pub_nav_title(index)
    }
}

// 一级导航鼠标移出
const mouseOneLeave = (item, index) => {
    data.hoverCur = null
    if (oneNavCur.value != index && oneNavCur.value != null) {
        pub_nav_title(oneNavCur.value)
    }
}

// 通用的二级导航和标题赋值
function pub_nav_title(index) {
    let new_index = index ? index : 0
    let menuName = data.navArr[new_index].sub_title ? data.navArr[new_index].sub_title : data.navArr[new_index].menuName
    data.seconeTitle = menuName // 一级菜单别名
    store.setSecondTitle(menuName) // // 一级菜单别名
}

const clickOneNav = (item, index) => {
    oneNavCur.value = index
    // console.log(oneNavCur.value ,'oneNavCur.value ')
    // console.log(item,'index')
    if (item.path == '/home' && oneNavCur.value === 0) {
        store.setStyle(true)
    } else {
        store.setStyle(false)
    }
    // oneNavCur.value === 0 ? store.setStyle(true) : store.setStyle(false)

    // 点击一级菜单，获取二三级选中菜单ID
    let id = ""
    if (item.children.length != 0) {
        let twoarr = item.children
        if (twoarr.length > 0 && twoarr[0].children.length == 0) {
            id = twoarr[0].sid
        }
        if (twoarr.length > 0 && twoarr[0].children != 0) {
            id = twoarr[0].children[0].sid
        }
        store.setMenuID(id)
    }
    router.push(item.component)
}
// 返回概况
const clickGk = () => {
    store.setCur(0)
    router.push("/Home")
    store.setStyle(true)
}

// 退出
const signOut = () => {
    proxy
        .$confirm("确定退出当前账号吗？", "温馨提示", {
            type: "warning",
            confirmButtonText: "确定",
            cancelButtonText: "取消",
        })
        .then(() => {
            store.logout()
            router.replace("/")
        })
        .catch(() => { })
}

// 修改密码
const ChangePass = () => {
    store.setCur(null)
    store.setStyle(true)
    router.replace("/ChangePass")
}

const { navArr, default_arr, seconeTitle, hoverCur } = toRefs(data)
</script>

<style lang="less" scoped>
.left {
    width: 100%;
    height: 100%;

    .second-nav__h3 {
        flex: 0 0 @height-mdl;
        width: 100%;
        padding-left: 18px;
        text-align: left;
        height: @height-mdl;
        box-sizing: border-box;
        border-bottom: 1px solid #ebedf0;
        font-size: @font-size-md;
        color: @gray-8;
        line-height: @height-mdl;
        font-weight: 500;
    }

    .first-nav {
        position: absolute;
        top: 0;
        bottom: 0;
        left: 0;
        height: 100%;
        width: 90px;
        background-color: #1a242c;
        display: flex;
        flex-direction: column;
        overflow: hidden;
        z-index: 2;
    }

    .first-nav__logo {
        position: fixed;
        top: 0;
        bottom: 0;
        height: 60px;
        width: 90px;
        word-break: break-word;
        background: #1a242c;
        z-index: 1002;
        display: flex;
        justify-content: center;
        align-items: center;

        .logo-img {
            cursor: pointer;
            width: 40px;
            overflow: hidden;
        }
    }

    .first-nav__ul {
        margin-top: 70px;
        padding-right: @padding-mdl;
        width: 100%;
        flex: 1 1 100%;
        overflow-x: hidden;
        overflow-y: scroll;

        .first-nav__li {
            width: 90px;
            font-size: @font-size-md;
            height: 40px;
            cursor: pointer;
            font-size: 14px;
            color: #c8c9cc;

            .first-nav__li-item {
                display: flex;
                align-items: center;
                justify-content: center;
                height: 100%;
                overflow: hidden;

                span {
                    max-width: 80px;
                }
            }

            .sub-box {
                visibility: hidden;
                cursor: default;
            }

            i {
                font-size: 16px;
                margin-right: 6px;
            }

            &:hover,
            &.nav-hover {
                color: #fff;
                background: rgba(255, 255, 255, 0.2);

                .sub-box {
                    z-index: 999;
                    visibility: visible;
                }
            }

            &.nav-active {
                .sub-box {
                    visibility: visible;
                }

                background: #4b93fa;
                color: #fff;
            }
        }
    }
}

.sub-box {
    position: fixed;
    width: 110px;
    height: 100%;
    z-index: 99;
    top: 0;
    left: 90px;
    overflow: hidden;
    display: flex;
    background: #fff;
    flex-direction: column;
    border-right: @border-gray;
    padding-bottom: @padding-base * 10;

    .sub-ul {
        margin-top: 10px;
        box-sizing: content-box;
        padding-right: @padding-mdl;
        padding-left: 10px;
        width: 100%;
        overflow-x: hidden;
        overflow-y: scroll;

        .menu-box {
            border: 0;

            :deep(.el-sub-menu__title) {
                padding: 0 !important;
                height: 40px;
                margin-bottom: 5px;

                &:hover {
                    background: none;
                }
            }

            :deep(.el-menu-item),
            :deep(.el-sub-menu) {
                line-height: 32px;
                width: 90px;
                text-align: left;
                padding-left: 10px !important;
                overflow: hidden;
                min-width: auto;
                display: inline-block;
                box-sizing: border-box;
                color: @gray-8;

                &:hover {
                    color: @themes !important;
                    background: none;
                }
            }

            :deep(.el-menu-item) {
                height: 32px;
                margin-bottom: @margin-xs;

                &.is-active {
                    background-color: @gray-3;
                }
            }

            :deep(.el-sub-menu) {
                .el-sub-menu__icon-arrow {
                    right: 0;
                }

                .el-menu-item {
                    margin-bottom: 0;
                }
            }
        }
    }
}
</style>

<style lang="less">
// el-popover生成的div不在当前组件之内，甚至不在App.vue组件的div内，他和App.vue组件的div平级，所以需要设置全局style。
.first-poper {
    padding: 6px 0px;
    border: 0;

    .first-nav__wrap {
        cursor: pointer;
        color: #111;
        padding: 12px;
        overflow: hidden;

        &:hover {
            background: rgba(0, 0, 0, 0.05);
        }
    }
}
</style>
