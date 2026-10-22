<template>
    <div :class="[{ 'style-ui': showStyle }, 'app-box']">
        <template v-if="showPage">
            <el-container>
                <el-aside id="left-aside">
                    <pub-left />
                </el-aside>
                <el-main id="app-main">
                    <pub-header />
                    <div class="main-box clearfix">
                        <el-config-provider :locale="locale">
                            <router-view v-slot="{ Component }">
                                <keep-alive :include="includeList">
                                    <component :is="Component"></component>
                                </keep-alive>
                            </router-view>
                        </el-config-provider>
                    </div>
                    <pub-footer style="position: absolute; bottom: 20px; left: 50%;" company="蚂蚁雄兵技术支持"></pub-footer>
                </el-main>
            </el-container>
        </template>

        <template v-else>
            <el-config-provider :locale="locale">
                <router-view v-slot="{ Component }">
                    <keep-alive :include="includeList">
                        <component :is="Component"></component>
                    </keep-alive>
                </router-view>
            </el-config-provider>
        </template>
    </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from "vue"
import { useRoute } from "vue-router"
import { userStore } from "@store/user"
import zhCn from 'element-plus/dist/locale/zh-cn.mjs'
import PubFooter from "@components/PubFooter.vue"
import PubHeader from "@components/PubHeader.vue"
import PubLeft from "@components/PubLeft.vue"

onMounted(() => {
//     if (process.env.NODE_ENV === 'development') {
//   console.log('Running in development mode');
// } else if (process.env.NODE_ENV === 'production') {
//   console.log('Running in production mode');
// }
})

const locale = ref(null)
locale.value = zhCn

const store = userStore()
const showStyle = computed(() => {
    return store.showStyle
})

const includeList = ref([])
includeList.value = store.includeList
console.log(store.includeList,'app')

const route = useRoute()
const showPage = ref(false)
watch(
    () => route.path,
    (val) => {
        if (val === "/") {
            showPage.value = false
        } else {
            showPage.value = true
        }
    }
)
</script>

<style lang="less">
@import (once) "@assets/css/common.less";

.app-box {
    width: 100%;
    height: 100%;
}
#left-aside {
    width: 230px !important;
    transition: all 0.2s;
    position: fixed;
    left: 0;
    top: 0;
    height: 100%;
    z-index: 11;
    overflow: hidden;
}

#app-main {
    padding: 0;
    width: auto;
    margin-left: 200px;
    min-width: 960px;
    overflow-x: hidden;
    padding-bottom: 60px;
}

.el-container {
    width: 100%;
    min-height: 100vh;
    position: relative;
}

.main-box {
    padding: @padding-sm;
    min-height: 500px;
    background: #f6f6f6;
}
// :deep(.el-table .cell) {
//     font-weight: 400 !important;
//     color:red
// }

</style>
