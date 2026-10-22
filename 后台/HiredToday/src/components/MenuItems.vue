<template>
    <el-menu-item :index="item ? item.component : ''" v-if="item.children.length == 0">
        {{ item.menuName }}
    </el-menu-item>

    <el-sub-menu :index="item ? String(item.sid) : ''" v-else>
        <template #title>
            <span>{{ item.menuName }}</span>
        </template>

        <div v-for="(child, index) in item.children" :key="index">
            <template v-if="child.children.length > 0">
                <menu-items :key="String(child.sid)" :item="child" />
            </template>
            <el-menu-item v-else :index="child.component">
                <span>{{ child.menuName }}</span>
            </el-menu-item>
        </div>
    </el-sub-menu>
</template>

<script setup>
import { toRefs } from "vue"

/**
 * el-menu菜单项
 */
const props = defineProps({
    collapse: {
        type: Boolean,
        default: true,
    },
    item: {
        type: Object,
    },
})

const { item } = toRefs(props)
</script>

<style lang="less"></style>
