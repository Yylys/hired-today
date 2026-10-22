<template>
    <div class="login-bg">
        <div class="login-box">
            <div class="login-top">
                <el-image :src="logo" style=" width: 100px;" fit="cover" alt="logo"></el-image>
            </div>
            <div class="login-center">
                <el-form :model="data.ruleForm" :rules="data.rules" ref="ruleFormRef">
                    <el-form-item prop="account" required>
                        <el-input v-model.trim="data.ruleForm.account" size="large" :prefix-icon="Iphone"
                            placeholder="输入账号" clearable></el-input>
                    </el-form-item>
                    <el-form-item prop="pass">
                        <el-input v-model.trim="data.ruleForm.pass" :prefix-icon="Lock" placeholder="输入密码" clearable
                            size="large" show-password>
                        </el-input>
                    </el-form-item>
                    <el-form-item prop="num">
                        <div style="display: flex; justify-content: space-between; width: 100%; align-items: end;">
                            <el-input v-model.trim="data.ruleForm.num" style="width: 150px;" placeholder="输入验证码"
                                clearable></el-input>
                            <img @click="getCode" style="height: 35px; width: 120px;" :src="imgs" alt="">
                        </div>
                    </el-form-item>
                    <!-- @keyup.enter.native="submitForm(ruleFormRef)" -->
                    <el-form-item class="form-btn">
                        <el-button color="#0099cc" size="large" :loading="btn_loading" @click="submitForm(ruleFormRef)">
                            登录</el-button>
                    </el-form-item>
                </el-form>
            </div>
            <p class="copyright">
                <el-link href="http://mayixiongbing.com/" :underline="false" target="_blank">©技术支持：蚂蚁雄兵</el-link>
            </p>
        </div>

        <!-- <Particles id="tsparticles" :options="data.options" /> -->
        <vue-particles id="tsparticles" :options="data.options" />

        <!-- 滑块+拼图验证 -->
        <!-- <el-dialog v-model="dialogSlider" title="拼图验证" width="300px" top="29vh" :append-to-body="true"
            :destroy-on-close="true" :close-on-click-modal="false" @close="dialogSlider = false">
            <slide-verify ref="sliderImg" :slider-text="sliderText" :accuracy="4" :show="false" :imgs="imgArr" :w="260"
                :h="220" @again="onAgain" @success="onSuccess" @fail="onFail"></slide-verify>
        </el-dialog> -->
    </div>
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
                    // sessionStorage.setItem("userinfo", JSON.stringify(result))
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
                    store.setStyle(false)
                    router.replace("/approval/approval")
                    break
                default:
                    if (res.data.code != 403) {
                        proxy.$message({ message: res.data.msg, type: "error" })
                        getCode()
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
                // console.log(res.data.data, '请求数据')
                // pub_keys.value = res.data.data
                uuid.value = res.data.data.uuid
                imgs.value = res.data.data.img
            } else {
                if (res.data.code != 403) {
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
                if (res.data.code != 403) {
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
</style>
