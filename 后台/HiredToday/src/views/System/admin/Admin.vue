<template>
    <!-- 头部功能 -->
    <div class="white-box">
        <div class="table-mb" >
            <!-- <el-button type="primary" plain :icon="Delete" @click="allDel">批量删除</el-button> -->
            <el-button type="primary" icon="CirclePlus" @click="handleAdd">添加</el-button>
        </div>
        <!-- <Header></Header> -->
        <div class="task-one">
            <div class="task-one__item">
                <span class="task-one__label">姓名：</span>
                <el-input placeholder="请输入要搜索的姓名" v-model.trim="state.queryForm.nickName" size="default"
                    clearable></el-input>
            </div>
            <div class="task-one__item">
                <span class="task-one__label">账号：</span>
                <el-input placeholder="请输入搜索的账号或手机号" v-model.trim="state.queryForm.phone" size="default"
                    clearable></el-input>
            </div>
            <div class="task-one__item">
                <span class="task-one__label">角色状态：</span>
                <el-select v-model="state.queryForm.status" placeholder="角色状态">
                    <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value" />
                </el-select>
            </div>
            <!-- <div class="task-one__item">
                <span class="task-one__label">机构：</span>
                <el-cascader v-model="state.queryForm.orgSid" :props="props1" :options="class_options1" collapse-tags
                    clearable placeholder="请选择归属机构" props.checkStrictly=true />
            </div> -->
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
                <el-table-column :show-overflow-tooltip="true" align="center" prop="userName" label="账号" width="200">
                </el-table-column>
                <el-table-column :show-overflow-tooltip="true" align="center" prop="nickName" label="姓名">
                </el-table-column>
                <el-table-column :show-overflow-tooltip="true" align="center" prop="phone" label="手机号" width="150">
                </el-table-column>

                <el-table-column :show-overflow-tooltip="true" align="center" prop="roleNames" label="角色">
                    <template #default="{ row }">
                        <el-tag style="margin: 0 3px;" v-for="item in row.roleNames">{{ item }}</el-tag>
                    </template>
                </el-table-column>
                <el-table-column :show-overflow-tooltip="true" align="center" prop="customNum" label="客户数" width="100">
                </el-table-column>
                
                <el-table-column :show-overflow-tooltip="true" align="center" prop="orgName" label="机构" width="150">
                </el-table-column>
                <el-table-column :show-overflow-tooltip="true" align="center" label="是否启用" width="90">
                    <template #default="{ row }">
                        <!-- <span>{{ row.is_stop == 0 ? "否" : "是" }}</span> -->
                        <el-tag :type="row.status == 0 ? '' : 'danger'">{{ row.status == 0 ? "是" : "否" }}</el-tag>
                    </template>
                </el-table-column>

                <el-table-column :show-overflow-tooltip="true" align="center" label="操作" width="210" fixed="right">

                    <template #default="{ row }">
                        <el-button  class="theme-btn" link type="primary"
                            @click="handleEdit(row, 2)">编辑
                        </el-button>
                        <span >
                            <el-popconfirm title="确定删除此项吗？" width="170px" confirm-button-text="确定"
                                cancel-button-text="取消" @confirm="handleDelete(row)">
                                <template #reference>
                                    <el-button class="theme-btn" link type="primary" style="margin-left: 14px">删除
                                    </el-button>
                                </template>
                            </el-popconfirm>
                        </span>
                        <el-button  class="theme-btn" link type="primary"
                            @click="handleEdit(row, 3)">修改密码
                        </el-button>
                    </template>
                </el-table-column>
            </el-table>
            <!-- <el-pagination v-model:current-current="current" v-model:current-size="size" :current-sizes="sizeNum"
                :total="totalNums" layout="total, sizes, prev, currentr, next, jumper">
            </el-pagination> -->
            <el-pagination v-model:current-page="current" v-model:page-size="size" :page-sizes="sizeNum"
                :total="totalNums" layout="total, sizes, prev, pager, next, jumper">
            </el-pagination>
            <!-- <go-back /> -->
        </div>

    </div>
    <div>
        <el-dialog v-model="centerDialogVisible" title="账号信息" width="600" align-center @close="clearval()">
            <el-form :model="ruleNewsForm" label-width="120px" :rules="ruleNews" ref="ruleNewsRef" v-if="type !== 3">
                <el-form-item label="账号" prop="userName" style="margin-top: 10px">
                    <el-input v-model.trim="ruleNewsForm.userName" clearable placeholder="请输入" />
                </el-form-item>
                <el-form-item label="密码" prop="password" v-if="type !== 2">
                    <el-input type="password" show-password v-model.trim="ruleNewsForm.password" clearable
                        placeholder="请输入" />
                </el-form-item>
                <el-form-item label="姓名" prop="nickName">
                    <el-input v-model.trim="ruleNewsForm.nickName" clearable placeholder="请输入" />
                </el-form-item>
                <el-form-item label="备注" prop="note">
                    <el-input type="textarea" :maxlength="-1"  maxlength="-1"
                        v-model.trim="ruleNewsForm.note" clearable placeholder="请输入" />
                </el-form-item>
                <el-form-item label="手机号" prop="phone">
                    <el-input type="tel" oninput="value=value.replace(/[^\d]/g,'')" maxlength="11"
                        v-model="ruleNewsForm.phone" clearable placeholder="请输入" />
                </el-form-item>
                <el-form-item label="是否启用" prop="status">
                    <el-switch v-model="ruleNewsForm.status" inline-prompt size="large" active-text="是"
                        inactive-text="否" :active-value="0" :inactive-value="1" />
                </el-form-item>
                <el-form-item label="角色" prop="roleSids">
                    <el-cascader v-model="ruleNewsForm.roleSids" :props="props" :options="class_options" collapse-tags
                        clearable placeholder="请选择管理权限" />
                </el-form-item>
                <!-- <el-form-item label="机构" prop="orgSid">
                    <el-cascader v-model="ruleNewsForm.orgSid" :props="props1" :options="class_options1" collapse-tags
                        clearable placeholder="请选择归属机构" props.checkStrictly=true />
                </el-form-item> -->
                <el-form-item>
                    <div style="margin-top: 30px">
                        <el-button type="primary" size="large" @click="submitForm(ruleNewsRef)">保存</el-button>
                    </div>
                </el-form-item>
            </el-form>
            <el-form :model="ruleNewsForm" label-width="120px" :rules="ruleNews1" ref="ruleNewsRefs" v-if="type == 3">
                <el-form-item label="密码" prop="password" v-if="type == 3">
                    <el-input type="password" show-password v-model.trim="ruleNewsForm.password" clearable
                        placeholder="请输入" />
                </el-form-item>
                <el-form-item>
                    <div style="margin-top: 30px">
                        <el-button type="primary" size="large" @click="submitForm(ruleNewsRefs)">确认修改</el-button>
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
import JSEncrypt from "jsencrypt"
const pub_keys = ref("")

// import Header from "@components/PubHeader.vue"

const router = useRouter()
const { proxy } = getCurrentInstance()
const centerDialogVisible = ref(false)

const state = reactive({
    queryForm: {
        nickName: null,
        status: null,
        phone: null,
        // orgSid:null,
    }
})

const options = [
    {
        value: '',
        label: '全部',
    },
    {
        value: '1',
        label: '停用',
    },
    {
        value: '0',
        label: '正常',
    }
]

const ruleNewsRef = ref(null)
const ruleNewsRefs = ref(null)
const ruleNews1 = reactive({
    password: [{ required: true, message: "请输入密码", trigger: "blur" }],
})
const ruleNews = reactive({
    userName: [{ required: true, message: "请输入账号", trigger: "blur" }],
    password: [{ required: true, message: "请输入密码", trigger: "blur" }],
    // note: [{ required: true, message: "请输入备注", trigger: "blur" }],
    roleSids: [{ required: true, message: "请选择角色", trigger: "change" }],
    phone: [
        { required: true, message: '手机号不能为空', trigger: 'blur' },
        { pattern: /^1[3456789]\d{9}$/, message: '请输入正确的手机号', trigger: 'blur' }
    ],
    // orgSid: [{ required: true, message: "请选择角色", trigger: "change" }],
})

const ruleNewsForm = reactive({
    userName: '',
    password: "",
    nickName: "",
    note: "",
    level: 0,
    sid: null,
    status: null,
    roleSids: [],
    // orgSid: "",
    // 加密密码
    pwd: null
})

// 表单重置
const reset = () => {
    org.value = ''
    ruleNewsForm.sid = undefined,
        ruleNewsForm.userName = null,
        ruleNewsForm.roleSids = [],
        ruleNewsForm.note = undefined,
        ruleNewsForm.phone = null,
        ruleNewsForm.status = 1,
        // ruleNewsForm.orgSid = ""
    ruleNewsForm.nickName = null
    ruleNewsForm.pwd = null
    ruleNewsForm.password = null
    type.value = null
}


// 配置级联选择参数
const props = ref({
    multiple: true,
    value: "sid",
    label: "roleName",
    // children: "children",
})

// 配置级联选择参数
const props1 = ref({
    // multiple: true,
    checkStrictly: true,
    value: "sid",
    label: "orgName",
    children: "children",
})

onActivated(() => {
    // getList()
})

onMounted(() => {
    getList();
    getroll();
    getorg()
    getKey()
})

const class_options = ref([])
const class_options1 = ref([])

function getorg() {
    // console.log(num, 'id')
    proxy.$axios
        .get("/v1/sys-orgs/treeSelect")
        .then((res) => {
            if (res.data.code == 200) {
                // console.log(res.data, 'role')
                class_options1.value = res.data.data
                // console.log(res.data, 'res.data.data.records')
            } else {
                if (res.data.code != 403) {
                    proxy.$message({ message: res.data.msg, type: "error" })
                }
            }
        })
        .catch((err) => { })
}
const roll = ref([])
function getroll() {
    // console.log(num, 'id')
    proxy.$axios
        .get("/v1/roles")
        .then((res) => {
            if (res.data.code == 200) {
                // console.log(res.data, 'role')
                class_options.value = res.data.data.records
                roll.value = res.data.data.records
                // console.log(role.value, 'role.value')
            } else {
                if (res.data.code != 403) {
                    proxy.$message({ message: res.data.msg, type: "error" })
                }
            }
        })
        .catch((err) => { })
}





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
    // if(state.queryForm.orgSid  && state.queryForm.orgSid.length!=0 &&state.queryForm.orgSid!=orgSids.value){
    //     state.queryForm.orgSid=state.queryForm.orgSid[state.queryForm.orgSid.length-1]
    //     orgSids.value=state.queryForm.orgSid
    // }
        
    let params = {
        current: current.value,
        size: size.value,
        ...state.queryForm
    }
    getdata("/v1/users", params)
}


// 修改
const setstate = (row) => {
    console.log(row, '1111111')
    proxy.$axios
        .post("admin/system/admin/update", row)
        .then((res) => {
            // form_loading.value = false
            if (res.data.code == 200) {
                proxy.$message({ message: res.data.msg, type: "success" })
                getdata("/v1/users")
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
const type = ref(null)
const handleEdit = (row, num) => {
    type.value = num
    ruleNewsForm.sid = row.sid
    console.log(row, 'row')
    getDetail(row.sid)
    centerDialogVisible.value = true
}

const org = ref()

function getDetail(sid) {
    proxy.$axios
        .get(`/v1/users/${sid}`)
        .then((res) => {
            if (res.data.code == 200) {
                console.log(res.data.data, 'detail')
                let result = res.data.data
                menus.value = res.data.data.sids
                // ruleNewsForm.menuSids = res.data.data.sids
                // ruleNewsForm.sid = result.sid
                ruleNewsForm.userName = result.userName
                ruleNewsForm.nickName = result.nickName
                // ruleNewsForm.orgSid = result.orgSid
                // org.value = result.orgSid
                ruleNewsForm.note = result.note
                ruleNewsForm.phone = result.phone
                ruleNewsForm.status = result.status
                let arr = []
                for (let i = 0; i < roll.value.length; i++) {
                    for (let j = 0; j < result.roleKeySet.length; j++) {
                        if (roll.value[i].roleKey == result.roleKeySet[j]) {
                            arr.push(roll.value[i].sid)
                        }
                    }
                }
                ruleNewsForm.roleSids = arr
                menus.value = arr
                // const commonValues = array1.filter(value => array2.includes(value));
                // console.log(arr, 'arr')
                // console.log( ruleNewsForm,' ruleNewsForm')
            } else {
                if (res.data.code != 403) {
                    proxy.$message({ message: res.data.msg, type: "error" })
                }
            }
        })
        .catch((err) => { })
}


const clearval = () => {
    // fileList.value = []
    reset()
    ruleNewsForm.treeCode = null
}


const menus = ref([])

const submitForm = (formEl) => {
    console.log(ruleNewsForm, 'ruleNewsForm')
    if (!formEl) return
    formEl.validate((valid, fields) => {
        //  getpwd()
        if (valid) {
            let cid = ''
            if (menus.value == ruleNewsForm.roleSids) {
                cid = ruleNewsForm.roleSids
            } else {
                const mergedArray = Array.from(ruleNewsForm.roleSids.reduce((acc, curr) => {
                    const set = new Set(curr);
                    return new Set([...acc, ...set]);
                }, new Set()));
                cid = mergedArray.flat()
            }
            // if (org.value == ruleNewsForm.orgSid) {
            // } else {
            //     ruleNewsForm.orgSid = ruleNewsForm.orgSid[ruleNewsForm.orgSid.length - 1]
            //     org.value = ruleNewsForm.orgSid
            // }
            // await getpwd()
            if (ruleNewsForm.sid == null) {
                let data = {
                    userName: ruleNewsForm.userName,
                    nickName: ruleNewsForm.nickName,
                    note: ruleNewsForm.note,
                    roleSids: cid,
                    status: ruleNewsForm.status,
                    phone: ruleNewsForm.phone,
                    // orgSid: ruleNewsForm.orgSid,
                    password: ''
                }
                postadd(data)
            } else {
                if (type.value == 2) {
                    console.log('编辑')
                    // console.log(cid)
                    let data = {
                        userName: ruleNewsForm.userName,
                        nickName: ruleNewsForm.nickName,
                        note: ruleNewsForm.note,
                        roleSids: cid,
                        status: ruleNewsForm.status,
                        phone: ruleNewsForm.phone,
                        // orgSid: ruleNewsForm.orgSid,
                        sid: ruleNewsForm.sid
                    }
                    postupdate(data)
                } else {
                    console.log('修改密码')
                    // console.log(cid)
                    let data = {
                        password: '',
                        sid: ruleNewsForm.sid
                    }
                    getpwd(data)
                }

            }
        }
    })
}

function getKey() {
    proxy.$axios
        .get("/v1/authentication/public-key")
        .then((res) => {
            if (res.data.code == 200) {
                pub_keys.value = res.data.data
            } else {
                if (res.data.code != 403) {
                    proxy.$message({ message: res.data.msg, type: "error" })
                }
            }
        })
        .catch((err) => { })
}


function getpwd(params) {
    let encryptor = new JSEncrypt() // 创建加密对象实例
    encryptor.setPublicKey(pub_keys.value) // 设置公钥
    let pass = encryptor.encrypt(ruleNewsForm.password)
    params.password = pass
    proxy.$axios
        .put("/v1/users", params)
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


// function getpwd(params) {
//     proxy.$axios
//         .get("/v1/authentication/encrypt", {
//             params: {
//                 originalStr: ruleNewsForm.password
//             }
//         })
//         .then((res) => {
//             if (res.data.code == 200) {
//                 ruleNewsForm.pwd = res.data.data
//                 params.password = ruleNewsForm.pwd
//                 proxy.$axios
//                     .put("/v1/users", params)
//                     .then((res) => {
//                         if (res.data.code == 200) {
//                             proxy.$message({ message: '修改成功', type: "success" })
//                             centerDialogVisible.value = false
//                             pubParams(getList)
//                         } else {
//                                     if(res.data.code!=403){

//                         }
//                     })
//                     .catch((err) => { })
//             } else {
//                         if(res.data.code!=403){

//             }
//         })
//         .catch((err) => { })
// }


function postadd(params) {
    proxy.$axios
        .get("/v1/authentication/encrypt", {
            params: {
                originalStr: ruleNewsForm.password
            }
        })
        .then((res) => {
            if (res.data.code == 200) {
                ruleNewsForm.pwd = res.data.data
                params.password = ruleNewsForm.pwd
                proxy.$axios
                    .post("/v1/users", params)
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
        .put("/v1/users", params)
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
