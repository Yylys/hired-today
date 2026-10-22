<template>
    <div class="white-box">
        <el-form ref="rulePassRef" :model="rulePassForm" :rules="ruleCheckPass" label-width="120px">
            <!-- <el-form-item label="原密码" prop="old_pass">
                <el-input v-model.trim="rulePassForm.old_pass" type="password" clearable placeholder="请输入原密码" />
            </el-form-item> -->
            <el-form-item label="新密码" prop="new_pass">
                <el-input v-model.trim="rulePassForm.new_pass" type="password" clearable placeholder="请输入新密码" />
            </el-form-item>
            <el-form-item>
                <div class="flexs" style="margin-top: 30px">
                    <el-button type="primary" :loading="form_loading"
                        @click="submitPassForm(rulePassRef)">确认修改</el-button>
                    <el-button @click="resetPassForm(rulePassRef)">重置</el-button>
                </div>
            </el-form-item>
        </el-form>
    </div>
</template>

<script setup>
import { getCurrentInstance, ref, onMounted, reactive } from "vue"
import { useRouter } from "vue-router"
import JSEncrypt from "jsencrypt"
const { proxy } = getCurrentInstance()
const router = useRouter()
const pub_keys = ref("")

onMounted(() => {
    getKey()
})

function getKey() {
    proxy.$axios
        .get("/v1/authentication/public-key")
        .then((res) => {
            if (res.data.code == 200) {
                pub_keys.value = res.data.data
            } else {
                        if(res.data.code!=403){
          proxy.$message({ message: res.data.msg, type: "error" })
        }
            }
        })
        .catch((err) => { })
}

/**
 * 修改密码
 * @param {Boolean} form_loading 提交按钮状态
 * @param {Array} rulePassRef 表单规则
 * @param {Object} rulePassForm  表单字段
 * @param {Object} ruleCheckPass  表单提示
 * @param {Function} submitPassForm 提交表单
 */
const form_loading = ref(false)
const rulePassRef = ref(null)

const userinfo =JSON.parse(sessionStorage.getItem("userinfo")); 
const rulePassForm = reactive({
    // old_pass: "",
    new_pass: "",
})
const ruleCheckPass = reactive({
    // old_pass: [{ required: true, message: "请输入原密码", trigger: "blur" }],
    new_pass: [{ required: true, message: "请输入新密码", trigger: "blur" }],
})
const submitPassForm = (formEl) => {
    if (!formEl) return
    formEl.validate((valid, fields) => {
        if (valid) {
            form_loading.value = true
            let encryptor = new JSEncrypt() // 创建加密对象实例
            encryptor.setPublicKey(pub_keys.value) // 设置公钥
            let pass = encryptor.encrypt(rulePassForm.new_pass)
            console.log(userinfo.sid,'userinfo.sid')
            proxy.$axios
                .put(`/v1/users/${userinfo.id}-${userinfo.uid}/password/${pass}`, {
                    // sid:`${userinfo.id}-${userinfo.uid}`,
                    // password: pass,
                })
                .then((res) => {
                    form_loading.value = false
                    if (res.data.code == 200) {
                        proxy.$message({ message: '修改成功', type: "success" })
                        router.push("/")
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
const resetPassForm = (formEl) => {
    if (!formEl) return
    formEl.resetFields()
}

</script>

<style lang="less" scoped>
.el-form {
    width: 400px;
}
</style>
