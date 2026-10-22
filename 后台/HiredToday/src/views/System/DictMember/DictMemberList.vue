<template>
    <div class="white-box">
        <div>
            <el-button class="table-mb" type="primary"
                @click="handleAdd">添加字典成员</el-button>
            <el-button class="table-mb"
                @click="allDel()">批量删除字典成员</el-button>
        </div>

        <!-- <p class="mb-15">上级字典：{{ memberName }}</p> -->

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
            " border select-on-indeterminate element-loading-background="rgba(255, 255, 255, 0.6)" @selection-change="handleAllSelected">
            <el-table-column type="selection" width="55"  />
            <el-table-column prop="memberName" label="字典成员名称" min-width="200" fixed="left" :show-overflow-tooltip="{
                'popper-class': 'max-w-800',
            }"></el-table-column>
            <el-table-column prop="memberKey" label="字典成员Key" min-width="160" :show-overflow-tooltip="{
                'popper-class': 'max-w-800',
            }"></el-table-column>
            <el-table-column prop="note" label="备注" min-width="160"  :show-overflow-tooltip="{
                'popper-class': 'max-w-800',
            }"></el-table-column>
            <el-table-column prop="viewSort" label="排序" min-width="160" ></el-table-column>
            <el-table-column prop="status" label="状态" min-width="100" >
                <template #default="{ row }">
                    <!-- {{ dictStore.getDictMemberName("data_status", row.status) }} -->
                </template>
            </el-table-column>
            <el-table-column prop="created" label="创建时间" min-width="160" ></el-table-column>
            <el-table-column label="操作" width="200" class-name="operation-nav" fixed="right">
                <template #default="{ row }">
                    <el-button class="theme-btn" link type="primary"
                        @click="handleEdit(row)">编辑
                    </el-button>
                    <el-popconfirm title="确定删除此项吗？" width="170px" confirm-button-text="确定"
                        cancel-button-text="取消" @confirm="handleDelete(row)">
                        <template #reference>
                            <el-button  class="theme-btn" link type="primary"
                                style="margin-left: 14px">删除
                            </el-button>
                        </template>
                    </el-popconfirm>
                </template>
            </el-table-column>
        </el-table>
    </div>
    <el-dialog v-model="centerDialogVisible" title="角色信息" width="600" align-center @close="clearval()">
        <el-form ref="ruleNewsRef" :model="state.ruleForm" :rules="state.ruleNews" label-width="120px" class="mt-20">
            <el-form-item label="字典成员名称" prop="memberName">
                <el-input v-model.trim="state.ruleForm.memberName" clearable placeholder="请输入字典名称" />
            </el-form-item>
            <el-form-item label="字典成员Key" prop="memberKey">
                <el-input v-model.trim="state.ruleForm.memberKey" clearable placeholder="请输入字典Key" />
            </el-form-item>
            <el-form-item label="备注" prop="note">
                <el-input v-model.trim="state.ruleForm.note" type="textarea" maxlength="-1" :autosize="{ minRows: 2 }"
                    clearable  placeholder="请输入备注" />
            </el-form-item>
            <el-form-item label="显示排序" prop="viewSort">
                <el-input-number v-model="state.ruleForm.viewSort" controls-position="right" :min="0" />
              </el-form-item>
            <el-form-item label="是否可删除" prop="deletable">
                <el-switch v-model="state.ruleForm.deletable" inline-prompt size="large" active-text="是"
                    inactive-text="否" :active-value="0" :inactive-value="1" />
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
</template>

<script setup>
import { getCurrentInstance, ref, reactive, onMounted, watch, onActivated, computed } from "vue"
import OneLoad from "@mixins/one-load"
import { useRouter, useRoute } from "vue-router"



const router = useRouter()
const route = useRoute()
const { proxy } = getCurrentInstance()
const centerDialogVisible = ref(false)
const sid = ref(null)
const ruleNewsRef = ref(null)
const state = reactive({
    queryForm: {
        memberName: null,
        memberKey: null,
    },
    ruleForm: {
        status: 0,
        deletable: 0,
        memberName: null,
        memberKey: null,
        note: null,
        viewSort:null,
        dictKey:null,
    },
    ruleNews: {
        memberName: [{ required: true, message: "请输入", trigger: "blur" }],
        memberKey: [{ required: true, message: "请输入", trigger: "blur" }],
        // note: [{ required: true, message: "请输入", trigger: "blur" }]
    }
})
var key = route.query.key || ""
state.ruleForm.dictKey= key



// 表单重置
const reset = () => {
    state.ruleForm.status = 0,
        state.ruleForm.deletable = 0,
        state.ruleForm.memberName = null,
        state.ruleForm.memberKey = null,
        state.ruleForm.note = null   
        state.ruleForm.viewSort = null  
        
}

onActivated(() => {
    // getList()
})

onMounted(() => {

    // route.meta.title= memberName.value
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
    getdata(`/v1/dicts/by-key/${key}`, params)
}

const handleSearch = () => {
    // console.log(state.queryForm, 'arr_data')
    search_btn.value = true
    pubRefreshParams(getList)

}

// 删除单个
const handleDelete = (row) => {
    console.log(row, 'row')
    postDel([row.sid])
}




// 添加
const handleAdd = () => {
    reset()
    centerDialogVisible.value = true
}
// 编辑
const handleEdit = (row) => {
    sid.value = row.sid
    centerDialogVisible.value = true
    getorg()
}

const clearval = () => {
    centerDialogVisible.value = false

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
        .put("/v1/dict-members/delete", { sidList: params, })
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
        .get(`/v1/dict-members/${sid.value}`)
        .then((res) => {
            if (res.data.code == 200) {
                console.log(res.data, '信息')
                state.ruleForm.status = res.data.data.status
                state.ruleForm.deletable = res.data.data.deletable
                state.ruleForm.memberName = res.data.data.memberName
                state.ruleForm.memberKey = res.data.data.memberKey
                state.ruleForm.note = res.data.data.note
                state.ruleForm.viewSort = res.data.data.viewSort
            } else {
                if (res.data.code != 403) {
                    proxy.$message({ message: res.data.msg, type: "error" })
                }
            }
        })
        .catch((err) => { })
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
        .post("/v1/dict-members", params)
        .then((res) => {
            console.log(res, 'res')
            if (res.data.code == 200) {
                proxy.$message({ message: '新增成功', type: "success" })
                centerDialogVisible.value = false
                sid.value = null
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
        .put(`/v1/dict-members/${sid.value}`, params)
        .then((res) => {
            if (res.data.code == 200) {
                proxy.$message({ message: '修改成功', type: "success" })
                centerDialogVisible.value = false
                sid.value = null
                pubParams(getList)
            } else {
                if (res.data.code != 403) {
                    proxy.$message({ message: res.data.msg, type: "error" })
                }
            }
        })
        .catch((err) => { })
}

const handleAllSelected = (val) => {
    ids.value = val
}

</script>


<style lang="less" scoped></style>
