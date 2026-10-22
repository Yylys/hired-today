<template>
    <!-- 头部功能 -->
    <div class="white-box">
        <div class="table-mb">
            <!-- <el-button type="primary" plain :icon="Delete" @click="allDel">批量删除</el-button> -->
            <el-button type="primary" icon="CirclePlus" @click="handleAdd">添加</el-button>
        </div>
        <!-- <Header></Header> -->
        <div class="task-one">
            <div class="task-one__item">
                <span class="task-one__label">标题：</span>
                <el-input placeholder="请输入要搜索的标题" v-model.trim="state.queryForm.title" size="default"
                    clearable></el-input>
            </div>
            <div class="task-one__btn clearfix">
                <el-button type="primary" :loading="search_btn" icon="Search" @click="handleSearch">搜索</el-button>
            </div>
        </div>
        <!-- 底部tanble展示 -->

        <div>
            <el-table border class="table-mb" v-loading="loading" :data="arr_data"
                :header-cell-style="{ background: '#F5F7FA' }" element-loading-background="rgba(255, 255, 255, 0.6)"
                @selection-change="handleAllSelected">
                <!-- <el-table-column :show-overflow-tooltip="true"  align="center"  type="index" label="序号" width="55" /> -->
                <!-- <el-table-column :show-overflow-tooltip="true"  align="center"  prop="id" label="管理员ID" width="90"> </el-table-column> -->
                <el-table-column :show-overflow-tooltip="true" align="center" prop="title" label="标题" width="250">
                </el-table-column>
                <el-table-column :show-overflow-tooltip="true" align="center" prop="content" label="通知内容">
                </el-table-column>
                <el-table-column :show-overflow-tooltip="true" align="center" prop="created" label="创建时间" width="190">
                </el-table-column>
                <!--                <el-table-column :show-overflow-tooltip="true" align="center" prop="message" label="通知内容">-->
                <!--                </el-table-column>-->

                <!--                <el-table-column :show-overflow-tooltip="true" align="center" label="是否启用" width="90">-->
                <!--                    <template #default="{ row }">-->
                <!--                        &lt;!&ndash; <span>{{ row.is_stop == 0 ? "否" : "是" }}</span> &ndash;&gt;-->
                <!--                        <el-tag :type="row.status == 0 ? '' : 'danger'">{{ row.status == 0 ? "是" : "否" }}</el-tag>-->
                <!--                    </template>-->
                <!--                </el-table-column>-->

                <!--                <el-table-column :show-overflow-tooltip="true" align="center" label="操作" width="210" fixed="right">-->

                <!--                    <template #default="{ row }">-->
                <!--                        <el-button class="theme-btn" link type="primary"-->
                <!--                            @click="handleEdit(row)">编辑-->
                <!--                        </el-button>-->
                <!--                        <span >-->
                <!--                            <el-popconfirm title="确定删除此项吗？" width="170px" confirm-button-text="确定"-->
                <!--                                cancel-button-text="取消" @confirm="handleDelete(row)">-->
                <!--                                <template #reference>-->
                <!--                                    <el-button class="theme-btn" link type="primary" style="margin-left: 14px">删除-->
                <!--                                    </el-button>-->
                <!--                                </template>-->
                <!--                            </el-popconfirm>-->
                <!--                        </span>-->
                <!--                    </template>-->
                <!--                </el-table-column>-->
            </el-table>
            <el-pagination v-model:current-page="current" v-model:page-size="size" :page-sizes="sizeNum"
                :total="totalNums" layout="total, sizes, prev, pager, next, jumper">
            </el-pagination>
        </div>

    </div>
    <div>
        <el-dialog v-model="centerDialogVisible" title="账号信息" width="600" align-center @close="clearval()">
            <el-form :model="ruleNewsForm" label-width="120px" :rules="ruleNews" ref="ruleNewsRef">
                <el-form-item label="通知标题" prop="title">
                    <el-input v-model.trim="ruleNewsForm.title" clearable placeholder="请输入" />
                </el-form-item>
                <el-form-item label="可见角色" >
                    <el-select multiple v-model="ruleNewsForm.roleKey" placeholder="可见角色" clearable
                        style="width:340px;" size="large">
                        <el-option v-for="item in options2" :key="item.roleKey" :label="item.roleName" :value="item.roleKey" />
                    </el-select>
                </el-form-item>
                <!--                <el-form-item label="通知内容" prop="message">-->
                <!--                    <el-input type="textarea" :maxlength="-1"  maxlength="-1"-->
                <!--                        v-model.trim="ruleNewsForm.message" clearable placeholder="请输入" />-->
                <!--                </el-form-item>-->
                <el-form-item label="通知内容" prop="content">
                    <el-input type="textarea"  autosize v-model.trim="ruleNewsForm.content" clearable
                        placeholder="请输入" />
                </el-form-item>



                <!--                <el-form-item label="是否启用" prop="status">-->
                <!--                    <el-switch v-model="ruleNewsForm.status" inline-prompt size="large" active-text="是"-->
                <!--                        inactive-text="否" :active-value="0" :inactive-value="1" />-->
                <!--                </el-form-item>-->
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

// import Header from "@components/PubHeader.vue"

const options2 = ref([])
const router = useRouter()
const { proxy } = getCurrentInstance()
const centerDialogVisible = ref(false)

const state = reactive({
    queryForm: {
        title: null
    }
})


const getRole = () => {
  // console.log(num, 'id')
  proxy.$axios
    .get("/v1/roles/enrollRole")
    .then((res) => {
      if (res.data.code == 200) {
        options2.value = res.data.data;
      } else {
        if (res.data.code != 403) {
          proxy.$message({ message: res.data.msg, type: "error" })
        }
      }
    })
    .catch((err) => { })
}

const ruleNewsRef = ref(null)
const ruleNews = reactive({
    title: [{ required: true, message: "请输入通知标题", trigger: "blur" }],
    content: [{ required: true, message: "请输入通知内容", trigger: "blur" }],
})

const ruleNewsForm = reactive({
    message: '',
    title: "",
    content: "",
    status: 0,
})

// 表单重置
const reset = () => {
    ruleNewsForm.message = ''
    ruleNewsForm.title = ''
    ruleNewsForm.content = ''
    ruleNewsForm.status = 0
}

onActivated(() => {
    // getList()
})

onMounted(() => {
    getList();
    getRole()
})

const { current, sizeNum, size, loading, arr_data, totalNums, search_btn, pubParams, pubRefreshParams, getdata } = OneLoad()

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

// const orgSids=ref(null)
function getList() {
    let params = {
        current: current.value,
        size: size.value,
        ...state.queryForm
    }
    getdata("/v1/message/sysytem-message", params)
}
// 修改
const setstate = (row) => {
    proxy.$axios
        .post("admin/system/admin/update", row)
        .then((res) => {
            // form_loading.value = false
            if (res.data.code == 200) {
                proxy.$message({ message: res.data.msg, type: "success" })
                pubParams(getList)
            } else {
                if (res.data.code != 403) {
                    proxy.$message({ message: res.data.msg, type: "error" })
                }
            }
        })
        .catch((err) => {
            // form_loading.value = false
        })
}

const handleSearch = () => {
    // console.log(state.queryForm, 'arr_data')
    search_btn.value = true
    pubRefreshParams(getList)
}

// 删除单个
const handleDelete = (row) => {
    // console.log(row,'row')
    postDel(row)
}
// 删除多个
const ids = ref([])
const handleAllSelected = (val) => {
    ids.value = val
}

// 删除接口
function postDel(params) {
    console.log(params, 'params')
    proxy.$axios
        .put("/v1/users/delete", {
            sidList: [params.sid],
        })
        .then((res) => {
            if (res.data.code == 200) {
                proxy.$message({ message: '删除成功', type: "success" })
                pubParams(getList)
            } else {
                if (res.data.code != 403) {
                    proxy.$message({ message: res.data.msg, type: "error" })
                }
            }
        })
        .catch((err) => { })
}

// 添加
const handleAdd = () => {
    centerDialogVisible.value = true
}
// 编辑
const handleEdit = (row) => {
    ruleNewsForm.sid = row.sid
    getDetail(row.sid)
    centerDialogVisible.value = true
}
function getDetail(sid) {
    proxy.$axios
        .get(`/v1/message/${sid}`)
        .then((res) => {
            if (res.data.code == 200) {
                console.log(res.data.data, 'detail')
                let result = res.data.data
                for (let key in result) {
                    ruleNewsForm[key] = result[key]
                }
            } else {
                if (res.data.code != 403) {
                    proxy.$message({ message: res.data.msg, type: "error" })
                }
            }
        })
        .catch((err) => { })
}


const clearval = () => {
    reset()
}

const submitForm = (formEl) => {
    if (!formEl) return
    formEl.validate((valid, fields) => {
        if (valid) {
            postadd(ruleNewsForm)
        }
    })
}

function postadd(params) {
    proxy.$axios
        .post("/v1/message", params)
        .then((res) => {
            if (res.data.code == 200) {
                proxy.$message({ message: '新增成功', type: "success" })
                centerDialogVisible.value = false
                reset()
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
        .put("/v1/message", params)
        .then((res) => {
            if (res.data.code == 200) {
                proxy.$message({ message: '修改成功', type: "success" })
                centerDialogVisible.value = false
                reset()
                pubParams(getList)
            } else {
                if (res.data.code != 403) {
                    proxy.$message({ message: res.data.msg, type: "error" })
                }
            }
        })
        .catch((err) => { })
}

</script>

<script>
// export default {
//     name: "Home",
// }
</script>

<style lang="less" scoped>
.home-box {
    display: flex;
}

.home-main {
    flex: 1;
    padding: 0 20px 0 0;
}

.home-aside {
    flex: none;
    width: 240px;
}
</style>
