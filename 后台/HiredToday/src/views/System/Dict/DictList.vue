<template>
    <div class="white-box">
        <div>
            <el-button class="table-mb" type="primary" @click="handleAdd"
              >添加字典</el-button>
        </div>

        <div class="task-one">
            <div class="task-one__item">
                <span class="task-one__label">字典名称：</span>
                <el-input placeholder="请输入字典名称" v-model="state.queryForm.dictName" @keyup.enter.native="handleSearch"
                    clearable>
                </el-input>
            </div>
            <div class="task-one__item">
                <span class="task-one__label">字典Key：</span>
                <el-input placeholder="请输入字典Key" v-model="state.queryForm.dictKey" @keyup.enter.native="handleSearch"
                    clearable>
                </el-input>
            </div>
            <div class="task-one__btn clearfix">
                <el-button type="primary" :loading="loading" icon="Search" @click="handleSearch">搜索</el-button>
            </div>
        </div>

        <div>
            <el-button class="table-mb" @click="allDel()">批量删除字典</el-button>
        </div>

        <el-table class="table-mb" v-loading="loading" :data="arr_data" row-key="sid" :header-cell-style="{
            background: '#F5F7FA',
            textAlign: 'center',
        }" :cell-style="({ column }) => {
            return {
                textAlign:
                    column.className === 'operation-nav'
                        ? 'left'
                        : 'center',
                paddingLeft:
                    column.className === 'operation-nav' ? '25px' : '0',
            };
        }
            " border element-loading-background="rgba(255, 255, 255, 0.6)" @selection-change="handleAllSelected">
            <el-table-column type="selection" width="55" />
            <el-table-column prop="dictName" label="字典名称" min-width="200" fixed="left" :show-overflow-tooltip="{
                'popper-class': 'max-w-800',
            }"></el-table-column>
            <el-table-column prop="dictKey" label="字典Key" min-width="160"  :show-overflow-tooltip="{
                'popper-class': 'max-w-800',
            }"></el-table-column>
            <el-table-column prop="note" label="备注" min-width="160"  :show-overflow-tooltip="{
                'popper-class': 'max-w-800',
            }"></el-table-column>
            <el-table-column prop="status" label="状态" min-width="100" >
                <template #default="{ row }">
                    <el-tag :type="row.status == 0 ? 'primary' : 'danger'">{{ row.status == 0 ? "正常" : "停用" }}</el-tag>
                </template>
            </el-table-column>
            <el-table-column prop="created" label="创建时间" min-width="160" ></el-table-column>
            <el-table-column label="操作" min-width="200" class-name="operation-nav" fixed="right">
                <template #default="{ row }">
                    <el-button  
                    class="theme-btn"  v-hasPermi="['system:dict:edit']" link type="primary"
                        @click="handleEdit(row.sid)">编辑
                    </el-button>
                    <el-button  class="theme-btn" link type="primary"
                        @click="toMember(row)">成员
                    </el-button>

                    <el-popconfirm v-if="row.deletable !=1"  title="确定删除此项吗？" width="170px" confirm-button-text="确定"
                        cancel-button-text="取消" @confirm="handleDelete(row.sid)">
                        <template #reference>
                            <el-button  class="theme-btn" link type="primary"
                               >删除
                            </el-button>
                        </template>
                    </el-popconfirm>
                </template>
            </el-table-column>
        </el-table>

        <el-pagination v-model:current-page="current" v-model:page-size="size" :page-sizes="sizeNum" :total="totalNums"
            layout="total, sizes, prev, pager, next, jumper">
        </el-pagination>
        <el-dialog v-model="centerDialogVisible" title="角色信息" width="600" align-center @close="clearval()">
            <el-form ref="ruleNewsRef" :model="state.ruleForm" :rules="state.ruleNews" label-width="120px"
                class="mt-20">
                <el-form-item label="字典名称" prop="dictName">
                    <el-input v-model.trim="state.ruleForm.dictName" clearable placeholder="请输入字典名称" />
                </el-form-item>
                <el-form-item label="字典Key" prop="dictKey">
                    <el-input v-model.trim="state.ruleForm.dictKey" clearable placeholder="请输入字典Key" />
                </el-form-item>
                <el-form-item label="备注" prop="note">
                    <el-input v-model.trim="state.ruleForm.note" type="textarea" maxlength="-1"
                        :autosize="{ minRows: 2 }" clearable  placeholder="请输入备注" />
                </el-form-item>
                <el-form-item label="是否可删除" prop="deletable">
                    <el-switch v-model="state.ruleForm.deletable" inline-prompt size="large" active-text="是"
                        inactive-text="否" :active-value="1" :inactive-value="0" />
                </el-form-item>
                <el-form-item label="状态" prop="status">
                    <el-switch v-model="state.ruleForm.status" inline-prompt size="large" active-text="正常"
                        inactive-text="停用" :active-value="0" :inactive-value="1" />
                </el-form-item>
                <el-form-item>
                    <div style="margin-top: 30px">
                        <el-button type="primary" size="large" @click="submitForm(ruleNewsRef)">保存</el-button>
                    </div>
                </el-form-item>
            </el-form>
        </el-dialog>
    </div>


</template>

<script setup>
import { getCurrentInstance, ref, reactive, onMounted, watch, onActivated } from "vue"
import OneLoad from "@mixins/one-load"
import { useRouter } from "vue-router"
const { proxy } = getCurrentInstance()
const router = useRouter()

const centerDialogVisible = ref(false)
const ruleNewsRef = ref(null)
const sid = ref(null)
const state = reactive({
    queryForm: {
        dictName: null,
        dictKey: null,
    },
    ruleForm: {
        status: 0,
        deletable: 0,
        dictName: null,
        dictKey: null,
        note: null,
    },
    ruleNews: {
        dictName: [{ required: true, message: "请输入", trigger: "blur" }],
        dictKey: [{ required: true, message: "请输入", trigger: "blur" }],
        // note: [{ required: true, message: "请输入", trigger: "blur" }]
    }
})

// 表单重置
const reset = () => {
    state.ruleForm.status = 0,
        state.ruleForm.deletable = 0,
        state.ruleForm.dictName = null,
        state.ruleForm.dictKey = null,
        state.ruleForm.note = null
}

// // 新增
// const add = () => {
//     centerDialogVisible.value = true
//     reset()
// }

// // 编辑
// const edit = (row) => {
//     centerDialogVisible.value = true
//     sid.value = row.id
//     state.ruleForm = { ...row }
// }

// // 删除
// const del = (row) => {
//     proxy.$confirm("此操作将永久删除该数据, 是否继续?", "提示", {

//     })
// }



onActivated(() => {
    // getList()
})

onMounted(() => {
    getList();
})

const options = [
    {
        value: 1,
        label: '全部',
    },
    {
        value: 2,
        label: '本级及下级',
    },
    {
        value: 3,
        label: '本级',
    },
    {
        value: 4,
        label: '仅下级',
    },
    {
        value: 5,
        label: '自定义',
    }
]


const { current, sizeNum, size, loading, arr_data, totalNums, search_text, search_btn, pubParams, pubRefreshParams, getdata } = OneLoad()

// 切换每页显示条数
watch(size, (val) => {
    current.value = 1
    size.value = val
    pubParams(getList)
})
// 跳转第几页
watch(current, (val) => {
    current.value = val
    pubParams(getList)
})

function getList() {
    let params = {
        current: current.value,
        size: size.value,
        ...state.queryForm
    }
    getdata("/v1/dicts", params)
}

const handleSearch = () => {
    // console.log(state.queryForm, 'arr_data')
    search_btn.value = true
    pubRefreshParams(getList)

}

// 删除单个
const handleDelete = (row) => {
    console.log(row, 'row')
    postDel([row])
}
/**
 * 点击添加字典
 * @param {Function} onClickAdd 跳转到新增页
 */
const onClickAdd = () => {
    router.push({ name: "DictAdd" });
};

/**
 * 点击修改按钮
 * @param {Function} onClickEdit 跳转修改页
 */

// 跳转字典成员列表
const toMember = (row) => {
    console.log(row, 'row')
    router.push({
        path: '/system/DictMemberList',
        query: {
            key: row.dictKey
        }
    })
};

// 添加
const handleAdd = () => {
    reset()
    centerDialogVisible.value = true
}
// 编辑
const handleEdit = (id) => {
    sid.value = id
    centerDialogVisible.value = true
    getorg()
}

const submitForm = (formEl) => {
    if (!formEl) return
    formEl.validate((valid, fields) => {
        if (valid) {
            if (sid.value == null) {
                postadd(state.ruleForm)
            } else {
                postupdate(state.ruleForm)
            }
        }
    })
}
function postadd(params) {
    proxy.$axios
        .post("/v1/dicts", params)
        .then((res) => {
            console.log(res, 'res')
            if (res.data.code == 200) {
                proxy.$message({ message: '新增成功', type: "success" })
                centerDialogVisible.value = false
                pubParams(getList)
            } else {
                if (res.data.code != 403) {
                    proxy.$message({ message: res.data.msg, type: "error" })
                }
            }
        })
        .catch((err) => { })
}

function postupdate(params) {
    proxy.$axios
        .put(`/v1/dicts/${sid.value}`, params)
        .then((res) => {
            if (res.data.code == 200) {
                proxy.$message({ message: '修改成功', type: "success" })
                centerDialogVisible.value = false
                pubParams(getList)
            } else {
                if (res.data.code != 403) {
                    proxy.$message({ message: res.data.msg, type: "error" })
                }
            }
        })
        .catch((err) => { })
}

const clearval = () => {
    centerDialogVisible.value = false

}

const handleAllSelected = (val) => {
    ids.value = val
}

const ids = ref([])
const allDel = () => {
    if (ids.value.length == 0) {
        proxy.$message({ message: "请选择需要删除的数据", type: "warning" })
        return
    }
    let arrs = []
    for (let i = 0; i < ids.value.length; i++) {
        arrs.push(ids.value[i].sid)
    }
    console.log(arrs, 'arrs')
    postDel(arrs)
}
// 删除接口
function postDel(params) {
    console.log(params, 'params')
    proxy.$axios
        .put("/v1/dicts/delete", { sidList: params, })
        .then((res) => {
            if (res.data.code == 200) {
                proxy.$message({ message: '删除成功', type: "success" })
                pubParams(getList)
            } else {
                proxy.$message({ message: res.data.msg, type: "error" })
            }
        })
        .catch((err) => { })
}

function getorg() {
    // console.log(num, 'id')
    proxy.$axios
        .get(`/v1/dicts/${sid.value}`)
        .then((res) => {
            if (res.data.code == 200) {
                console.log(res.data, '信息')
                state.ruleForm.status = res.data.data.status
                state.ruleForm.deletable = res.data.data.deletable
                state.ruleForm.dictName = res.data.data.dictName
                state.ruleForm.dictKey = res.data.data.dictKey
                state.ruleForm.note = res.data.data.note
            } else {
                if (res.data.code != 403) {
                    proxy.$message({ message: res.data.msg, type: "error" })
                }
            }
        })
        .catch((err) => { })
}



</script>

<style lang="less" scoped></style>
