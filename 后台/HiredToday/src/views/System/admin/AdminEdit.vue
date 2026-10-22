<template>
    <div class="white-box">
        <!-- <div>{{ ruleNewsForm }}</div> -->
        <el-form v-if="num" ref="ruleNewsRef" :model="ruleNewsForm" :rules="ruleNews" label-width="120px">
            <el-form-item label="密码" prop="password">
                <el-input v-model.trim="ruleNewsForm.password" clearable placeholder="请输入新密码" />
            </el-form-item>
            <el-form-item>
                <div class="foot-btn flexs-center" style="margin-top: 30px">
                    <el-button type="primary" size="large" :loading="form_loading"
                        @click="submitNewsForm(ruleNewsRef)">确认修改</el-button>
                </div>
            </el-form-item>
        </el-form>
        <el-form v-if="!num" ref="ruleNewsRef" :model="ruleNewsForm" :rules="ruleNews" label-width="120px">
            <el-form-item label="账号" prop="username">
                <el-input v-model.trim="ruleNewsForm.username" clearable placeholder="请输入账号" />
            </el-form-item>
            <el-form-item label="密码" prop="password" v-if="!id">
                <el-input v-model.trim="ruleNewsForm.password" clearable placeholder="请输入密码" />
            </el-form-item>
            <el-form-item label="姓名" prop="name">
                <el-input v-model.trim="ruleNewsForm.name" clearable placeholder="请输入姓名" />
            </el-form-item>
            <el-form-item label="手机号" prop="tel">
                <el-input v-model.trim="ruleNewsForm.tel" clearable placeholder="请输入手机号" />
            </el-form-item>
            <!-- <el-form-item label="姓名" prop="name">
                <el-input v-model.trim="ruleNewsForm.name" clearable placeholder="请输入姓名" />
            </el-form-item> -->
            <el-form-item label="备注" prop="remark">
                <el-input v-model.trim="ruleNewsForm.remark" clearable placeholder="请输入备注" />
            </el-form-item>
            <el-form-item label="是否隐藏" prop="is_stop">
                <el-switch v-model="ruleNewsForm.is_stop" inline-prompt size="large" active-text="是" inactive-text="否"
                    :active-value="1" :inactive-value="0" />
            </el-form-item>
            <el-form-item label="角色" prop="role_id">
                <!-- <el-cascader v-model="ruleNewsForm.role_id" :props="props" :options="class_options"  /> -->
                <el-select v-model="ruleNewsForm.role_id" class="m-2" placeholder="请选择所属角色" size="large"
                    style="width: 240px">
                    <el-option v-for="item in role" :key="item.id" :label="item.name" :value="item.id" />
                </el-select>
            </el-form-item>

            <el-form-item>
                <div class="foot-btn flexs-center" style="margin-top: 30px">
                    <el-button type="primary" size="large" :loading="form_loading"
                        @click="submitNewsForm(ruleNewsRef)">确认修改</el-button>
                </div>
            </el-form-item>
        </el-form>

        <!-- 图片库 -->
        <!-- <picture-library :show="showImg" :select_multiple="false" @close="showImg = false" @select="selectImg">
        </picture-library> -->
        <go-back />
    </div>
</template>

<script setup>
import { getCurrentInstance, ref, onMounted, shallowRef, reactive, onBeforeUnmount } from "vue"
import { useRouter, useRoute } from "vue-router"
import { UploadFilled, CloseBold } from "@element-plus/icons-vue"
import GoBack from "@components/GoBack.vue"
import PictureLibrary from "@components/PictureLibrary.vue"
import "@wangeditor/editor/dist/css/style.css"
import { Editor, Toolbar } from "@wangeditor/editor-for-vue"

const router = useRouter()
const route = useRoute()
const { proxy } = getCurrentInstance()

var id = route.query.id || ""
var num = route.query.num || ""

onMounted(() => {
    if (id) {
        getDetail()
    }
    getroll()
})


function getDetail() {
    // console.log(id,'id')
    proxy.$axios
        .get("admin/system/admin/detail", {
            params: {
                id: id,
            },
        })
        .then((res) => {
            if (res.data.code == 200) {
                let result = res.data.data
                ruleNewsForm.role_id = result.role_id
                // valueHtml.value = result.detail.content.replace(/<img [^>]*src=['"]/g, `<img src="${proxy.imgUrl}`) // 往图片追加根域名和'/'
                ruleNewsForm.id = result.id
                ruleNewsForm.username = result.username
                ruleNewsForm.name = result.name
                ruleNewsForm.remark = result.remark
                ruleNewsForm.is_stop = result.is_stop
                ruleNewsForm.tel = result.tel

                // if (result.detail && result.thumb) {
                //     ruleNewsForm.img_paths = result.thumb
                //     srcList.value.push(proxy.imgUrl + result.thumb)
                // }

            } else {
                        if(res.data.code!=403){
          proxy.$message({ message: res.data.msg, type: "error" })
        }
            }
        })
        .catch((err) => { })
}

const role = ref([
    // { id: 1, name: '超级管理员' },
    // { id: 44, name: '角色1' }
])
function getroll() {
    // console.log(num, 'id')
    proxy.$axios
        .get("common/dataSelect/roleSelect")
        .then((res) => {
            if (res.data.code == 200) {
                // console.log(res.data, 'role')
                role.value = res.data.data
                console.log(role.value, 'role.value')
            } else {
                        if(res.data.code!=403){
          proxy.$message({ message: res.data.msg, type: "error" })
        }
            }
        })
        .catch((err) => { })
}

/**
 * 添加
 * @param {Boolean} form_loading 提交按钮状态
 * @param {Number} classType 弹窗类型，1是添加，2是编辑
 * @param {Array} ruleNewsRef 表单规则
 * @param {Object} ruleNewsForm  表单字段
 * @param {Object} ruleNews  表单提示
 * @param {Function} submitNewsForm 提交表单
 */
const form_loading = ref(false)
const ruleNewsRef = ref(null)
const ruleNewsForm = reactive({
    id: "",
    username: "",
    name: "",
    is_stop: 0, // 是否禁用1-是0-不是
    tel: "",
    remark: "",
    role_id: "",
    password: '',
    // sort: "100",
    // audit: 1, // 0:待审核,1:已通过
    // img_paths: "",
})

const validatePass = (rule, value, callback) => {
    console.log(rule, value, callback, '规则')
    if (value === '') {
        callback(new Error('请填写手机号'))
    } else {
        if (ruleForm.checkPass !== '') {
            if (!ruleFormRef.value) return
            ruleFormRef.value.validateField('checkPass', () => null)
        }
        callback()
    }
}

const ruleNews = reactive({
    role_id: [{ required: true, message: "请选择文章分类", trigger: "blur" }],
    username: [{ required: true, message: "请输入账号", trigger: "blur" }],
    password: [{ required: true, message: "请输入账号", trigger: "blur" }],
    remark: [{ required: true, message: "请输入备注", trigger: "blur" }],
    name: [{ required: true, message: "请输入姓名", trigger: "change" }],
    role_id: [{ required: true, message: "请选择角色", trigger: "blur" }],
    tel: [
        { required: true, message: '手机号不能为空', trigger: 'blur' },
        { pattern: /^1[3456789]\d{9}$/, message: '请输入正确的手机号', trigger: 'blur' }
    ]
})
const submitNewsForm = (formEl) => {
    if (!formEl) return
    if (id && num) {
        formEl.validate((valid, fields) => {
            if (valid) {
                form_loading.value = true
                proxy.$axios
                    .post("admin/system/admin/editPass", {
                        // id: id,
                        id: ruleNewsForm.id,
                        password: ruleNewsForm.password,
                    })
                    .then((res) => {
                        form_loading.value = false
                        if (res.data.code == 200) {
                            proxy.$message({ message: "修改成功！", type: "success" })
                            router.push("/System/Admin")
                        } else {
                                    if(res.data.code!=403){
          proxy.$message({ message: res.data.msg, type: "error" })
        }
                        }
                    })
                    .catch((err) => {
                        form_loading.value = false
                    })
            }
        })
    } else {
        if (id) {
            formEl.validate((valid, fields) => {
                if (valid) {
                    // let cid = ""
                    // cid = Array.isArray(ruleNewsForm.id) ? ruleNewsForm.id[ruleNewsForm.id.length - 1] : ruleNewsForm.id
                    console.log(ruleNewsForm, 'ruleNewsForm')
                    form_loading.value = true
                    proxy.$axios
                        .post("admin/system/admin/update", {
                            // id: id,
                            id: ruleNewsForm.id,
                            username: ruleNewsForm.username,
                            name: ruleNewsForm.name,
                            is_stop: ruleNewsForm.is_stop,
                            tel: ruleNewsForm.tel,
                            remark: ruleNewsForm.remark,
                            role_id: ruleNewsForm.role_id,
                            // content: htmls,
                        })
                        .then((res) => {
                            form_loading.value = false
                            if (res.data.code == 200) {
                                proxy.$message({ message: "保存成功！", type: "success" })
                                router.push("/System/Admin")
                            } else {
                                        if(res.data.code!=403){
          proxy.$message({ message: res.data.msg, type: "error" })
        }
                            }
                        })
                        .catch((err) => {
                            form_loading.value = false
                        })
                }
            })
        } else {
            formEl.validate((valid, fields) => {
                if (valid) {
                    // let cid = ""
                    // cid = Array.isArray(ruleNewsForm.id) ? ruleNewsForm.id[ruleNewsForm.id.length - 1] : ruleNewsForm.id
                    console.log(ruleNewsForm, 'ruleNewsForm')
                    form_loading.value = true
                    proxy.$axios
                        .post("admin/system/admin/create", {
                            // id: id,
                            // id: ruleNewsForm.id,
                            username: ruleNewsForm.username,
                            password: ruleNewsForm.password,
                            name: ruleNewsForm.name,
                            is_stop: ruleNewsForm.is_stop,
                            tel: ruleNewsForm.tel,
                            remark: ruleNewsForm.remark,
                            role_id: ruleNewsForm.role_id,
                            // content: htmls,
                        })
                        .then((res) => {
                            form_loading.value = false
                            if (res.data.code == 200) {
                                proxy.$message({ message: "添加成功！", type: "success" })
                                router.push("/System/Admin")
                            } else {
                                        if(res.data.code!=403){
          proxy.$message({ message: res.data.msg, type: "error" })
        }
                            }
                        })
                        .catch((err) => {
                            form_loading.value = false
                        })
                }
            })
        }
    }


}

/**
 * 添加图片
 * @param {Boolean} showImg 显示图片库
 * @param {Function} selectImg 选择图片
 */
const showImg = ref(false)
const srcList = ref([])
const selectImg = (val) => {
    showImg.value = false
    ruleNewsForm.img_paths = val[0].photo
    srcList.value.push(proxy.imgUrl + val[0].photo)
}
const delImg = () => {
    ruleNewsForm.img_paths = ""
    srcList.value = []
}

/**
 * 富文本编辑器
 * @param {Object} editorConfig 编辑器配置
 * @param {String} valueHtml 输入内容
 * @param {Object} toolbarConfig 工具栏配置
 * @param {Function} createEditor 创建编辑器
 * @param {Function} createToolbar 创建工具栏
 * @param {Function} handleChange 编辑器内容变化
 */
const editorRef = shallowRef() // 编辑器实例，必须用 shallowRef
const valueHtml = ref("") // 内容 HTML
const toolbarConfig = {
    excludeKeys: [
        // 排除不需要的菜单
        "insertLink",
        "insertImage",
        "editImage",
        "viewImageLink",
        "insertVideo",
        "uploadVideo",
        "editVideoSize",
        "emotion",
    ],
}
const editorConfig = { placeholder: "请输入内容...", MENU_CONF: {} }
const handleCreated = (editor) => {
    editorRef.value = editor // 记录 editor 实例，重要！
}
editorConfig.MENU_CONF["uploadImage"] = {
    // 自定义上传
    async customUpload(file, insertFn) {
        let data = new FormData()
        data.append("from", "album")
        data.append("image", file)
        proxy.$axios
            .post("upload/image", data)
            .then((res) => {
                if (res.data.code == 0) {
                    let url = proxy.imgUrl + res.data.data.path
                    insertFn(url) // 最后插入图片 insertFn(url, alt, href)，alt：描述，href:链接，后面非必填
                } else {
                            if(res.data.code!=403){
          proxy.$message({ message: res.data.msg, type: "error" })
        }
                }
            })
            .catch((err) => { })
    },
}
// 组件销毁时，也及时销毁编辑器
onBeforeUnmount(() => {
    const editor = editorRef.value
    if (editor == null) return
    editor.destroy()
})
</script>
<script>
export default {
    name: "NewsEdit",
}
</script>

<style lang="less" scoped>
.editor-box {
    border: 1px solid #ccc;
    border-radius: 2px;
}

:deep(.el-date-editor) {
    width: 320px !important;

    .el-input__wrapper {
        width: 320px;
    }
}

.prize-upload {
    :deep(.el-upload--picture-card) {
        width: 120px;
        height: 120px;
        line-height: 120px;
        margin-bottom: 20px;
    }

    :deep(.el-upload-list__item) {
        width: 120px;
        height: 120px;
    }
}
</style>
