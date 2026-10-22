<template>
    <div class="pub-header flexs">
        <div class="pub-header__left" v-if="rouet_path !== '/Home'">
            <template v-if="showBread">
                <back-page :content="title"></back-page>
            </template>
            <template v-else>
                {{ title }}
            </template>
        </div>
        <div class="pub-header__left" v-else>
            <h3>{{ title }}</h3>
        </div>
    </div>
</template>

<script setup>
import { getCurrentInstance, ref, onMounted, watch } from "vue"
import { useRoute } from "vue-router"
import BackPage from "./BackPage.vue"

import EventBus from "@common/event-bus" // EventBus事件总线，任意组件通信

const route = useRoute()
const rouet_path = ref("")
const title = ref("")
const showBread = ref(false)

const { proxy } = getCurrentInstance()

watch(
    () => route.path,
    (val) => {
        rouet_path.value = val
        if (rouet_path.value === "/Home") {
            title.value = "控制台"
        } else {
            title.value = route.meta.title
            showBread.value = route.meta.showBread ? route.meta.showBread : false
        }
    },
    {
        immediate: true,
    }
)

onMounted(() => {})
</script>

<style lang="less" scoped>
.pub-header {
    position: relative;
    height: @height-mdl;
    background: #fff;
    border-bottom: @border-gray;
    padding: 0px 25px;
    font-size: @font-size-md;

    .pub-header__left {
        color: @gray-8;
        cursor: default;

        h3 {
            font-size: 20px;
            color: @gray-8;
            font-weight: bold;
        }
    }
}
</style>
