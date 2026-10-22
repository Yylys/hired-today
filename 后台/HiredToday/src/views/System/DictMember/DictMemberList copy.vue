<template>
    <div class="white-box">
        <div>
            <el-button
                class="table-mb"
                type="primary"
                @click="onClickAdd"
                >添加字典成员</el-button
            >
            <el-button
                class="table-mb"
                @click="onClickDel()"
                >批量删除字典成员</el-button
            >
        </div>

        <p class="mb-15">上级字典：{{ dictName }}</p>

        <el-table
            class="table-mb"
            v-loading="loading"
            :data="arr_data"
            row-key="sid"
            :header-cell-style="{
                background: '#F5F7FA',
                textAlign: 'center',
            }"
            :cell-style="
                ({ column }) => {
                    return {
                        textAlign:
                            column.className === 'operation-nav'
                                ? 'left'
                                : 'center',
                        paddingLeft:
                            column.className === 'operation-nav' ? '25px' : '0',
                    };
                }
            "
            border
            select-on-indeterminate
            element-loading-background="rgba(255, 255, 255, 0.6)"
            @selection-change="selectionChange"
            @sort-change="sortChange"
        >
            <el-table-column
                type="selection"
                width="55"
            />
            <el-table-column
                prop="memberName"
                label="字典成员名称"
                min-width="200"
                fixed="left"
                :show-overflow-tooltip="{
                    'popper-class': 'max-w-800',
                }"
            ></el-table-column>
            <el-table-column
                prop="memberKey"
                label="字典成员Key"
                min-width="160"
                sortable="custom"
                :show-overflow-tooltip="{
                    'popper-class': 'max-w-800',
                }"
            ></el-table-column>
            <el-table-column
                prop="note"
                label="备注"
                min-width="160"
                sortable="custom"
                :show-overflow-tooltip="{
                    'popper-class': 'max-w-800',
                }"
            ></el-table-column>
            <el-table-column
                prop="viewSort"
                label="排序"
                min-width="160"
                sortable="custom"
            ></el-table-column>
            <el-table-column
                prop="status"
                label="状态"
                min-width="100"
                sortable="custom"
            >
                <template #default="{ row }">
                    {{ dictStore.getDictMemberName("data_status", row.status) }}
                </template>
            </el-table-column>
            <el-table-column
                prop="created"
                label="创建时间"
                min-width="160"
                sortable="custom"
            ></el-table-column>
            <el-table-column
                label="操作"
                width="200"
                class-name="operation-nav"
                fixed="right"
            >
                <template #default="{ row }">
                    <MoreBtn
                        :buttons="[
                            {
                                props: {
                                    onClick: () => onClickEdit(row.sid),
                                    'v-hasPermi': ['system:dictMember:edit'],
                                },
                                text: '修改',
                            },
                            {
                                props: {
                                    onClick: () => onClickDel(row.sid),
                                    'v-hasPermi': ['system:dictMember:del'],
                                },
                                text: '删除',
                            },
                        ]"
                    />
                </template>
            </el-table-column>
        </el-table>
    </div>
</template>

<script setup>
import { inject, reactive, onMounted, onActivated, computed } from "vue";
import { useRouter, useRoute } from "vue-router";
import OneLoad from "@mixins/one-load";
import MoreBtn from "@/components/MoreBtn.vue";
import { ElMessageBox } from "element-plus";
import { getDictMembersByKey, delDictMembers } from "@/apis/system/dict";
import { useDictStore } from "@stores/dict.js";

const dictStore = useDictStore();
dictStore.getDictMembers("data_status");

const $message = inject("$message");
const router = useRouter();
const route = useRoute();

const state = reactive({
    ascended: false,
    sortFieldName: null,
    memberKey: null,
    memberName: null,
    dictKeyOptions: [],
    sidList: [],
});

const key = computed(() => route.params.key);
const dictName = computed(() => decodeURIComponent(route.query.dictName));

onActivated(() => {
    pubParams(getList);
});

/**
 * minxin列表加载
 */
const { loading, arr_data, pubRefreshParams, pubParams, getdata } = OneLoad();

function getList() {
    getdata(
        getDictMembersByKey({
            key: key.value,
        })
    );
}

/**
 * 点击添加字典成员
 * @param {Function} onClickAdd 跳转到新增页
 */
const onClickAdd = () => {
    router.push({
        name: "DictMemberAdd",
        params: {
            key: key.value,
        },
    });
};

/**
 * 排序
 * @param {Function} sortChange 排序
 */
const sortChange = (e) => {
    const { property, order } = e.column;
    state.ascended = order === "ascending";
    state.sortFieldName = order ? property : null;
    pubRefreshParams(getList);
};

/**
 * 点击修改按钮
 * @param {Function} onClickEdit 跳转修改页
 */
const onClickEdit = (sid) => {
    sid &&
        router.push({
            name: "DictMemberEdit",
            params: {
                key: key.value,
            },
            query: {
                sid,
            },
        });
};

/**
 * 点击删除按钮
 * @param {Function} onClickDel 删除字典成员
 */
const selectionChange = (e) => {
    state.sidList = e.map((item) => item.sid);
};
const onClickDel = async (sid) => {
    if (sid) {
        state.sidList = [sid];
    }
    if (!state.sidList.length) {
        return $message({ message: "请先勾选要删除的数据", type: "warning" });
    }
    await ElMessageBox.confirm("确定删除字典成员吗？");
    const res = await delDictMembers({ sidList: state.sidList });
    if (res.data.code == 200) {
        $message({ message: "删除成功", type: "success" });
        pubParams(getList);
    } else {
        $message({ message: res.data.msg, type: "error" });
    }
};
</script>

<style lang="less" scoped></style>
