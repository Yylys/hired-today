import { ref, getCurrentInstance } from "vue"
export default function () {
    const { proxy } = getCurrentInstance()

    const fileList = ref([]) // 限一个
    const videoList = ref([]) // 成功之后视频数组
    const videoLoading = ref(false)

    // 上传视频
    function uploadVideo() {
        videoLoading.value = true
        let data = new FormData()
        data.append("file", fileList.value[0])
        proxy.$axios.post("upload/video", data).then((res) => {
            fileList.value = []
            videoLoading.value = false
            if (res.data.code == 0) {
                videoList.value.push(res.data.data.path)
            } else {
                proxy.$message({message:res.data.msg,type:"error"})
            }
        }).catch(err => {
            videoLoading.value = false
        })
    }


    // 移除
    function handleRemove(file) {
        fileList.value = []
        videoList.value = []
    }

    // 图片超出数量时
    function handleExceed(files, fileArr) {
        proxy.$message({ message: "限制一个，请先删除原来的视频再来上传!", type: "warning" })
    }

    // 上传之前的判断
    function beforeAvatarUpload(file) {
        const isType = file.type
        let m20 = 20 * 1024 * 1024;
        const size = file.size <= m20 ? true : false
        if (!isType) {
            proxy.$message({ message: "上传文件格式只能是 mp4 格式!", type: "error" })
            return false
        }
        if (!size) {
            proxy.$message({ message: "上传视频大小不能超过 20M!", type: "error" })
            return false
        }
        return isType && size
    }

    // 文件状态改变时的钩子
    function fileChange(file, fileArr) {
        fileList.value.push(file.raw)
    }

    // 上传地址
    function actionUrl() {
        return ""
    }

    // 预览图片
    // const imgVisible = ref(false)
    // const dialogImageUrl = ref("")
    // function handlePreview(file) {
    //     dialogImageUrl.value = file.url.indexOf(proxy.imgUrl) > -1 ? file.url : proxy.imgUrl + videoList.value[0]
    //     imgVisible.value = true
    // }

    return {
        videoList,
        videoLoading,
        fileList,
        // imgVisible,
        // dialogImageUrl,
        actionUrl,
        uploadVideo,
        handleRemove,
        beforeAvatarUpload,
        handleExceed,
        fileChange
    }
}
