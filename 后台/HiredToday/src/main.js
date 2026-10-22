import { createApp } from 'vue'
import App from './App.vue'
import router from "./router";
import store from "./store"
import Particles from "@tsparticles/vue3";
import { loadSlim } from "@tsparticles/slim";
import * as utils from "./assets/common/utils"
import * as ElementPlusIconsVue from '@element-plus/icons-vue'
import echarts from "./assets/common/echarts"
import axios from "./assets/common/request"
import directive from './assets/common/index'
import { baseUrl } from "/public/static/config"
// import { createPinia } from 'pinia';

import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'


const app = createApp(App);
for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
  app.component(key, component)
}
// const pinia = createPinia();

// 全局挂载
app.config.globalProperties.$utils = utils;
app.config.globalProperties.$echarts = echarts
// app.config.globalProperties.$urls = "http://shengqin.kmmyxb.cn/api"
// app.config.globalProperties.imgUrl = "http://shengqin.kmmyxb.cn/api/v1/resources"
// app.config.globalProperties.$urls = "https://hengletai.kmmyxb.net.cn/api/"
// app.config.globalProperties.imgUrl = "https://hengletai.kmmyxb.net.cn/api/v1/resources"
app.config.globalProperties.$urls = baseUrl
app.config.globalProperties.imgUrl = `${baseUrl}/v1/resources`
app.config.globalProperties.$axios = axios;

app.use(directive)
// app.use(pinia)
app.use(ElementPlus)
app.use(router).use(store).use(Particles, {
  init: async (engine) => {
    // 加载精简版本
    await loadSlim(engine);
  },
}).mount("#app")
