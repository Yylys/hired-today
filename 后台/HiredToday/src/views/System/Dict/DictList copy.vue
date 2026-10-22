<template>
    <div class="white-box">
        <div>
            <el-button
                class="table-mb"
                type="primary"
                @click="onClickAdd"
                >添加字典</el-button
            >
        </div>

        <div class="task-one">
            <div class="task-one__item">
                <span class="task-one__label">字典名称：</span>
                <el-input
                    placeholder="请输入字典名称"
                    v-model="state.dictName"
                    @keyup.enter.native="handleSearch"
                    clearable
                >
                </el-input>
            </div>
            <div class="task-one__item" v-hasPermi="['system:dict:queryKey']">
                <span class="task-one__label">字典Key：</span>
                <el-input
                    placeholder="请输入字典Key"
                    v-model="state.dictKey"
                    @keyup.enter.native="handleSearch"
                    clearable
                >
                </el-input>
            </div>
            <div class="task-one__btn clearfix">
                <el-button
                    type="primary"
                    :loading="loading"
                    icon="Search"
                    @click="handleSearch"
                    >搜索</el-button
                >
            </div>
        </div>

        <div>
            <el-button
                class="table-mb"
                @click="onClickDel()"
                v-hasPermi="['system:dict:del']"
                >批量删除字典</el-button
            >
        </div>

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
            element-loading-background="rgba(255, 255, 255, 0.6)"
            @selection-change="selectionChange"
            @sort-change="sortChange"
        >
            <el-table-column
                v-hasPermi="['system:dict:del']"
                type="selection"
                width="55"
                :selectable="(row) => row.deletable === 0"
            />
            <el-table-column
                prop="dictName"
                label="字典名称"
                min-width="200"
                fixed="left"
                :show-overflow-tooltip="{
                    'popper-class': 'max-w-800',
                }"
            ></el-table-column>
            <el-table-column
                prop="dictKey"
                label="字典Key"
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
                                    'v-hasPermi': ['system:dict:edit'],
                                },
                                text: '修改',
                            },
                            {
                                props: {
                                    onClick: () => toMember(row),
                                    'v-hasPermi': ['system:dict:queryKey'],
                                },
                                text: '成员',
                            },
                            {
                                props: {
                                    onClick: () => onClickDel(row.sid),
                                    'v-hasPermi': ['system:dict:del'],
                                },
                                text: '删除',
                                isRender: row.deletable === 0,
                            },
                        ]"
                    />
                </template>
            </el-table-column>
        </el-table>

        <el-pagination
            background
            v-model:current-page="page"
            v-model:page-size="pageSize"
            :page-sizes="pageSizeNum"
            :total="totalNums"
            layout="slot, sizes, prev, pager, next, jumper"
        >
            <span class="color-#606266"
                >共&nbsp;{{
                    totalNums >= 100 * pageSize
                        ? `${100 * pageSize}+`
                        : totalNums
                }}&nbsp;条</span
            >
        </el-pagination>
    </div>
</template>

<script setup>
import { reactive, onActivated, inject, onMounted } from "vue";
import { useRouter } from "vue-router";
import OneLoad from "@mixins/one-load";
import MoreBtn from "@/components/MoreBtn.vue";
import { ElMessageBox } from "element-plus";
import { getDicts, delDicts } from "@/apis/system/dict";
import { useDictStore } from "@stores/dict.js";

const dictStore = useDictStore();
dictStore.getDictMembers("data_status");

const $message = inject("$message");
const router = useRouter();

const state = reactive({
    ascended: false,
    sortFieldName: null,
    dictKey: null,
    dictName: null,
    sidList: [],
});

onActivated(() => {
    pubParams(getList);
});

onMounted(() => {});

/**
 * minxin列表加载
 */
const {
    loading,
    arr_data,
    pubRefreshParams,
    pubParams,
    page,
    pageSize,
    getdata,
    pageSizeNum,
    totalNums,
    openPaging,
} = OneLoad();
openPaging(getList);

function getList() {
    getdata(
        getDicts({
            current: page.value,
            size: pageSize.value,
            ascended: state.ascended,
            sortFieldName: state.sortFieldName,
            dictKey: state.dictKey,
            dictName: state.dictName,
        })
    );
}

/**
 * 搜索
 * @param {Function} handleSearch 搜索
 */

const handleSearch = () => {
    pubRefreshParams(getList);
};

/**
 * 点击添加字典
 * @param {Function} onClickAdd 跳转到新增页
 */
const onClickAdd = () => {
    router.push({ name: "DictAdd" });
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
            name: "DictEdit",
            query: {
                sid,
            },
        });
};

// 跳转字典成员列表
const toMember = ({ dictKey, dictName }) => {
    dictKey &&
        router.push({
            name: "DictMemberList",
            params: {
                key: dictKey,
            },
            query: {
                dictName: encodeURIComponent(dictName),
            },
        });
};

/**
 * 点击删除按钮
 * @param {Function} onClickDel 删除字典
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
    await ElMessageBox.confirm("确定删除字典吗？");
    const res = await delDicts({ sidList: state.sidList });
    if (res.data.code == 200) {
        $message({ message: "删除成功", type: "success" });
        pubParams(getList);
    } else {
        $message({ message: res.data.msg, type: "error" });
    }
};
</script>

<style lang="less" scoped></style>
