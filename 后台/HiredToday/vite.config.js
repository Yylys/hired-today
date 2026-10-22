import { defineConfig } from "vite"
import vue from "@vitejs/plugin-vue"
import path from "path"
import { baseUrl } from "./public/static/config"
const isProduction = process.env.NODE_ENV === "production"
// https://vitejs.dev/config/
export default defineConfig({
    base: "/", // 设置打包路径
    productionSourceMap: !isProduction, //关闭生产环境下的SourceMap映射文件
    plugins: [
        vue(),
        // AutoImport({
        //     resolvers: [ElementPlusResolver()],
        // }),
        // Components({
        //     resolvers: [ElementPlusResolver()],
        // }),
    ],
    resolve: {
        alias: {
            // 如果报错__dirname找不到，需要安装node,执行npm install @types/node --save-dev
            "@": path.resolve(__dirname, "src"),
            "@assets": path.resolve(__dirname, "src/assets"),
            "@store": path.resolve(__dirname, "src/store"),
            "@mixins": path.resolve(__dirname, "src/mixins"),
            "@components": path.resolve(__dirname, "src/components"),
            "@common": path.resolve(__dirname, "src/assets/common"),
            "@images": path.resolve(__dirname, "src/assets/images"),
            "@views": path.resolve(__dirname, "src/views"),
        },
    },
    css: {
        sourceMap: !isProduction, // css sourceMap 配置
        preprocessorOptions: {
            less: {
                modifyVars: {
                    hack: `true; @import (reference) "${path.resolve("src/assets/css/base.less")}";`,
                },
                javascriptEnabled: true,
            },
        },
    },
    build: {
        outDir: "dist",
        assetsDir: "assets", //指定静态资源存放路径
        sourcemap: false, //是否构建source map 文件
        terserOptions: {
            // 生产环境移除console
            compress: {
                drop_console: true,
                drop_debugger: true,
            },
        },
    },
    server: {
        https: false, // 是否开启 https
        open: false, // 是否自动在浏览器打开
        cors: true, // 允许跨域
        port: 3000, // 端口号
        // host: "192.168.1.88",
        host: "0.0.0.0",
        proxy: {
            "/api": {
                // target: "http://shengqin.kmmyxb.cn/api", // 后台接口
                // target: "https://hengletai.kmmyxb.net.cn/api/", // 后台接口
                // target: "http://116.63.177.173/api", // 后台接口
                // target: process.env.NODE_ENV === 'production' ?    'http://shengqin.kmmyxb.cn/api'  : 'http://116.63.177.173/api' ,
                // target: 'http://127.0.0.1:8000',
                target: baseUrl, // 后台接口
                changeOrigin: true,
                secure: false, // 如果是https接口，需要配置这个参数
                // ws: true, //websocket支持
                rewrite: (path) => path.replace(/^\/api/, ""), // 匹配/supplier/admin  格式为：/^\/supplier\/admin/
            },
        },
    },
    // 引入第三方的配置
    optimizeDeps: {
        include: [],
    },
})  
