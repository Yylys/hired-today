import axios from "axios"
import router from "../../router"
import { baseUrl } from "../../../public/static/config"
import { ElMessage } from 'element-plus'

const isPro = Object.is(process.env.NODE_ENV, "production") // 判断开发环境，true为生产环境即线上，false为开发环境
// const baseURL = isPro ? "http://shengqin.kmmyxb.cn/api/" : "/api"
// const baseURL = isPro ? "https://hengletai.kmmyxb.net.cn/api/" : "/api"
const baseURL = isPro ? baseUrl : "/api"
// 使用自定义的配置文件发送请求
const instance = axios.create({
    baseURL: baseURL,
    timeout: 200000,
})


// http 请求拦截器
instance.interceptors.request.use(
    (config) => {
        // console.log(window.config.baseUrl,'response')
        var token = sessionStorage.getItem("token")
        // console.log(token,'token')
        // let bosid = sessionStorage.getItem("bosid") || ""
        config.headers["hsy-bosid"] = "myxbwarehouse"

        if (token) {
            config.headers["Authorization"] = token
            // config.headers["hsy-bosid"] = bosid
        }
        return config
    },
    (err) => {
        return Promise.reject(err)
    }
)



// http 响应拦截器
instance.interceptors.response.use(
    (response) => {
        console.log(response,'response')
        var token = response.headers.authorization || response.headers.Authorization
        if (token) {
            sessionStorage.setItem("token", token)
        }
        if(response.data.code == 403){
            // console.log("权限不足！")
            // ElMessage({
            //     message: "权限不足！",
            //     type: "error",
            //     duration: 2000,
            // })
            router.replace("/")
        }
        // var code = response.data.code;
        return response
    },
    (error) => {
        if (error.response) {

            switch (error.response.status) {
                case 401:
                    ElMessage({
                        message: "登录失效，请重新登录！",
                        type: "error",
                        duration: 2000,
                    })
                    router.replace("/")
                    break
                case 422:

                case 500:
                    ElMessage({
                        message: error.response.status + "：" + error.response.data.message,
                        type: "error",
                        duration: 1500,
                    })
                    break
                case 403:
                    router.replace("/")
                    break
            }
        }
        return Promise.reject(error)
    }
)

export default instance
