<template>
    <div class="login-bg">
        <div class="form-container login-box">
            <p class="title">Login</p>
            <el-form :model="data.ruleForm" :rules="data.rules" ref="ruleFormRef" class="form">
                <el-form-item prop="account" required class="input-group">
                    <label for="username">账号</label>
                    <el-input id="username" v-model.trim="data.ruleForm.account" size="large" :prefix-icon="Iphone"
                        placeholder="输入账号" clearable></el-input>
                </el-form-item>
                <el-form-item prop="pass" class="input-group">
                    <label for="password">密码</label>
                    <el-input name="password" id="password" v-model.trim="data.ruleForm.pass" :prefix-icon="Lock" placeholder="输入密码" clearable
                        size="large" show-password>
                    </el-input>
                </el-form-item>
                <el-form-item prop="num" class="input-group">
                    <label for="password">验证码</label>
                        <div style="display: flex; justify-content: space-between; width: 100%; align-items: end;">
                            <el-input v-model.trim="data.ruleForm.num" style="width: 120px;" placeholder="输入验证码"
                                clearable></el-input>
                            <img @click="getCode" style="width: 130px;" :src="imgs" alt="">
                        </div>
                    </el-form-item>
                <!-- <button>Sign in</button> -->
                <el-form-item class="form-btn">
                        <el-button  class="sign" size="large" :loading="btn_loading" @click="submitForm(ruleFormRef)">
                            登录</el-button>
                    </el-form-item>
            </el-form>
            <div class="social-message">
                <div class="line"></div>
                <p class="copyright">
                    <el-link href="http://mayixiongbing.com/" :underline="false" target="_blank">©技术支持：蚂蚁雄兵</el-link>
                </p>
                <div class="line"></div>
            </div>
        </div>
        <!-- <div class="login-center">
                <el-form :model="data.ruleForm" :rules="data.rules" ref="ruleFormRef">
                    <el-form-item prop="account" required>
                        <el-input v-model.trim="data.ruleForm.account" size="large" :prefix-icon="Iphone"
                            placeholder="输入账号" clearable></el-input>
                    </el-form-item>


                    <el-form-item class="form-btn">
                        <el-button color="#0099cc" size="large" :loading="btn_loading" @click="submitForm(ruleFormRef)">
                            登录</el-button>
                    </el-form-item>
                </el-form>
            </div> -->

    </div>
    <vue-particles id="tsparticles" :options="data.options" />


</template>

<script setup>
import { getCurrentInstance, ref, reactive, onMounted, onBeforeUnmount } from "vue"
import { useRouter } from "vue-router"
import { userStore } from "@store/user"
import { Lock, Iphone } from "@element-plus/icons-vue"
import logo from "@assets/logo.png"
import img1 from "@images/img1.jpg"
import img2 from "@images/img2.jpg"
import img3 from "@images/img3.jpg"
import SlideVerify from "vue3-slide-verify"
import "vue3-slide-verify/dist/style.css"
import JSEncrypt from "jsencrypt"

const router = useRouter()
const store = userStore()
const { proxy } = getCurrentInstance()

onMounted(() => {
    getCode()
    // getpwd()
    getKey()
})
onBeforeUnmount(() => {
    sliderImg.value = null
    ruleFormRef.value = null
    imgArr.value = []
    data.options = null
    dialogSlider.value = false
})

const data = reactive({
    options: {
        fpsLimit: 100,
        interactivity: {
            events: {
                onClick: {
                    enable: true,
                    mode: "push",
                },
                onHover: {
                    enable: true,
                    mode: "grab",
                },
                resize: true,
            },
            modes: {
                bubble: {
                    distance: 400,
                    duration: 2,
                    opacity: 0.6,
                    size: 10,
                },
                push: {
                    quantity: 4,
                },
                repulse: {
                    distance: 200,
                    duration: 0.4,
                },
            },
        },
        particles: {
            color: {
                value: "#ffffff",
            },
            links: {
                color: "#ffffff",
                distance: 150,
                enable: true,
                opacity: 0.5,
                width: 1,
            },
            collisions: {
                enable: true,
            },
            move: {
                direction: "none",
                enable: true,
                outMode: "bounce",
                random: false,
                speed: 2,
                straight: false,
            },
            number: {
                density: {
                    enable: true,
                    value_area: 800,
                },
                value: 60,
            },
            opacity: {
                value: 0.5,
            },
            shape: {
                type: "circle",
            },
            size: {
                random: true,
                value: 3,
            },
        },
        detectRetina: true,
    },
    ruleForm: {
        account: "",
        pass: "",
        num: '',
    },
    rules: {
        account: [{ required: true, message: "请输入账号", trigger: "blur" }],
        pass: [{ required: true, message: "请输入密码", trigger: "blur" }],
        num: [{ required: true, message: "请输入验证码", trigger: "blur" }],
    },
})

const ruleFormRef = ref(null)
const btn_loading = ref(false)

/**
 * 滑块+拼图验证 vue3-slide-verify
 * @param {Number} w canvas width
 * @param {Number} h canvas height
 * @param {Number} accuracy 滑动验证的误差范围，默认值 5
 * @param {Array} imgs picture array 背景图数组，默认值 []
 * @param {String} sliderText 滑块中提示文字
 * @param {Function} onAgain 检测到非人为操作滑动时触发的回调函数
 * @param {Function} onSuccess 成功回调
 * @param {Function} onFail 失败处理
 * @param {Function} onRefresh 点击刷新按钮后
 */
const sliderText = ref("向右滑动 >>")
const imgArr = ref([img1, img2, img3])
const sliderImg = ref(null)
const dialogSlider = ref(false)
// const onAgain = () => {
//     proxy.$message({ message: "检测到非人为操作！ try again", type: "error" })
//     sliderImg.value.refresh() // 刷新
// }
// const onSuccess = (times) => {
//     logins()
// }
// const onFail = () => {
//     proxy.$message({ message: "验证不通过", type: "error" })
// }

const submitForm = (formEl) => {
    if (!formEl) return
    formEl.validate((valid, fields) => {
        if (valid) {
            // dialogSlider.value = true
            // console.log('开始登录')
            logins()
        }
    })
}

const pwd = ref(null)

// 将API路径定义为常量
const ENCRYPT_API_PATH = "/v1/authentication/encrypt";

// function logins() {
//     // sliderImg.value.refresh() // 刷新
//     dialogSlider.value = false
//     btn_loading.value = true
//     // let encryptor = new JSEncrypt() // 创建加密对象实例
//     // encryptor.setPublicKey(pub_keys.value) // 设置公钥
//     // let pass = encryptor.encrypt(data.ruleForm.pass) // 对内容进行加密
//     proxy.$axios
//         .post("/v1/authentication/login/pc", { userName: data.ruleForm.account, password: pwd.value, }, { headers: { "CAP_UID": uuid.value, "CAP_VAL": data.ruleForm.num, }, }
//         )
//         .then((res) => {
//             btn_loading.value = false
//             switch (res.data.code) {
//                 case 200:
//                     let result = res.data.data
//                     sessionStorage.setItem("userinfo", JSON.stringify(result))
//                     if (result.admin) {
//                         store.setPermissions(["*:*:*"])
//                     } else {
//                         store.setPermissions(result.permissionSet)
//                     }
//                     sessionStorage.setItem("token", result.accessToken)
//                     store.setCur(0)
//                     store.setStyle(true)
//                     router.replace("/Home")
//                     break
//                 default:
//                             if(res.data.code!=403){
          proxy.$message({ message: res.data.msg, type: "error" })
        }
//                     break
//             }
//         })
//         .catch((err) => {
//             btn_loading.value = false
//         })
// }
function logins() {
    // sliderImg.value.refresh() // 刷新
    // dialogSlider.value = false
    console.log(pub_keys.value, 'pub_keys.value')
    btn_loading.value = true
    let encryptor = new JSEncrypt() // 创建加密对象实例
    encryptor.setPublicKey(pub_keys.value) // 设置公钥
    let pass = encryptor.encrypt(data.ruleForm.pass) // 对内容进行加密
    proxy.$axios
        .post("/v1/authentication/login/pc", { userName: data.ruleForm.account, password: pass, },
            { headers: { "CAP_UID": uuid.value, "CAP_VAL": data.ruleForm.num, }, }
        )
        .then((res) => {
            btn_loading.value = false
            switch (res.data.code) {
                case 200:
                    let result = res.data.data
                    sessionStorage.setItem("userinfo", JSON.stringify(result))
                    if (result.admin) {
                        store.setPermissions(["*:*:*"])
                    } else {
                        store.setPermissions(result.permissionSet)
                    }
                    sessionStorage.setItem("token", result.accessToken)
                    // sessionStorage.setItem("reload", JSON.stringify(true))
                    // console.log(result.accessToken,'result.accessToken')
                    // alert(result.accessToken)
                    store.setCur(0)
                    store.setStyle(true)
                    router.replace("/system/candidate")
                    break
                default:
                            if(res.data.code!=403){
          proxy.$message({ message: res.data.msg, type: "error" })
        }
                    break
            }
        })
        .catch((err) => {
            btn_loading.value = false
        })
}

const pub_keys = ref("")
const uuid = ref(null)
const imgs = ref(null)
function getCode() {
    proxy.$axios
        .get("/v1/captcha")
        .then((res) => {
            if (res.data.code == 200) {
                console.log(res.data.data, '请求数据')
                // pub_keys.value = res.data.data
                uuid.value = res.data.data.uuid
                imgs.value = res.data.data.img
            } else {
                        if(res.data.code!=403){
          proxy.$message({ message: res.data.msg, type: "error" })
        }
            }
        })
        .catch((err) => { })
}

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


</script>

<style lang="less" scoped>
:deep(.el-dialog__body) {
    padding: 10px 20px 20px;
}

.copyright {
    width: 100%;
    text-align: center;

    .el-link.el-link--default {
        color: #999;

        &:hover {
            color: #0099cc;
        }
    }
}

.login-box {
    z-index: 10;
    width: 400px;
    border-radius: 5px;
    padding-bottom: 50px;
    background: white;
    box-shadow: 0px 0px 5px #333333;

    .login-top {
        width: 100%;
        text-align: center;
        margin-bottom: 50px;
        padding-top: 50px;

        .el-image {
            width: 220px;
        }
    }

    .login-center {
        padding: 0 60px;
    }

    :deep(.el-form-item__label) {
        &::before {
            content: "" !important;
        }
    }

    .form-btn {
        margin: 44px 0px 20px;

        :deep(.el-form-item__content) {
            margin: 0 !important;

            .el-button {
                width: 100%;
                letter-spacing: 1px;
            }
        }
    }
}

.login-bg {
    width: 100%;
    height: 100%;
    background: url("../assets/images/bg.jpg") no-repeat center;
    background-size: cover;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: column;
    overflow: hidden;
    position: relative;
}

.form-container {
    width: 320px;
    border-radius: 0.75rem;
    background-color: rgba(17, 24, 39, 1);
    padding: 2rem;
    color: rgba(243, 244, 246, 1);
}

.title {
    text-align: center;
    font-size: 1.5rem;
    line-height: 2rem;
    font-weight: 700;
}

.form {
    margin-top: 1.5rem;
}

.input-group {
    margin-top: 0.25rem;
    font-size: 0.875rem;
    line-height: 1.25rem;
}

.input-group label {
    display: block;
    color: rgba(156, 163, 175, 1);
    margin-bottom: 4px;
}

.input-group input {
    width: 100%;
    border-radius: 0.375rem;
    border: 1px solid rgba(55, 65, 81, 1);
    outline: 0;
    background-color: rgba(17, 24, 39, 1);
    padding: 0.75rem 1rem;
    color: rgba(243, 244, 246, 1);
}

.input-group input:focus {
    border-color: rgba(167, 139, 250);
}

.forgot {
    display: flex;
    justify-content: flex-end;
    font-size: 0.75rem;
    line-height: 1rem;
    color: rgba(156, 163, 175, 1);
    margin: 8px 0 14px 0;
}

.forgot a,
.signup a {
    color: rgba(243, 244, 246, 1);
    text-decoration: none;
    font-size: 14px;
}

.forgot a:hover,
.signup a:hover {
    text-decoration: underline rgba(167, 139, 250, 1);
}

.sign {
    display: block;
    width: 100%;
    background-color: rgba(167, 139, 250, 1);
    padding: 0.75rem;
    text-align: center;
    color: rgba(17, 24, 39, 1);
    border: none;
    border-radius: 0.375rem;
    font-weight: 600;
}

.social-message {
    display: flex;
    align-items: center;
    padding-top: 1rem;
}

.line {
    height: 1px;
    flex: 1 1 0%;
    background-color: rgba(55, 65, 81, 1);
}

.social-message .message {
    padding-left: 0.75rem;
    padding-right: 0.75rem;
    font-size: 0.875rem;
    line-height: 1.25rem;
    color: rgba(156, 163, 175, 1);
}

.social-icons {
    display: flex;
    justify-content: center;
}

.social-icons .icon {
    border-radius: 0.125rem;
    padding: 0.75rem;
    border: none;
    background-color: transparent;
    margin-left: 8px;
}

.social-icons .icon svg {
    height: 1.25rem;
    width: 1.25rem;
    fill: #fff;
}

.signup {
    text-align: center;
    font-size: 0.75rem;
    line-height: 1rem;
    color: rgba(156, 163, 175, 1);
}
</style>
