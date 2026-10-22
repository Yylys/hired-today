import { reactive, toRefs, ref, getCurrentInstance } from "vue"
export default function () {
    const { proxy } = getCurrentInstance()

    const fileList = ref([]) // 限一张
    const imgPath = ref([]) // 可以插入多张图片
    const succList = ref([]) // 成功之后图片数组
    const imgLoading = ref(false)
    const fromImg = ref('album') // [album:图库,product:产品,verify:认证相关]

    // 上传-单张的上传
    function uploadImg() {

        imgLoading.value = true
        let data = new FormData()
        // data.append("file", fromImg.value)
        data.append("file", fileList.value[0])
        proxy.$axios.post("/v1/resources/public", data).then((res) => {
            fileList.value = []
            imgLoading.value = false
            if (res.data.code == 200) {
                succList.value.push(res.data.data.url)
                // console.log( succList.value,' succList.value')
            } else {
                proxy.$message({ message: res.data.msg, type: "error" })
            }
        }).catch(err => {
            imgLoading.value = false
        })
    }

    // 上传-可以插入多张图片
    function uploadImgMore() {
        imgLoading.value = true
        let data = new FormData()
        // data.append("file", fromImg.value)
        data.append("file", fileList.value[0])
        proxy.$axios.post("/v1/resources/public", data).then((res) => {
            imgLoading.value = false
            if (res.data.code == 200) {
                let objs = {
                    uid: fileList.value[0].uid,
                    img: res.data.data.path,
                }
                imgPath.value.push(objs)
                fileList.value = []
                
            } else {
                proxy.$message({ message: res.data.msg, type: "error" })
            }
        }).catch(err => {
            imgLoading.value = false
        })
    }

    // 移除图片
    function handleRemove(file) {
        fileList.value = []
        succList.value = []
    }
    // 移除图片-多张时
    function handleRemoveMore(file) {
        let index = imgPath.value.findIndex((item) => item.uid == file.uid)
        if (index > -1) {
            imgPath.value.splice(index, 1)
        }
    }

    // 图片超出数量时
    function handleExceed(files, fileArr) {
        proxy.$message({ message: `限制一张，请先删除原来的图片再来上传`, type: "warning" })
    }
    // 图片超出数量时-多张时
    function handleExceedMore(files, fileArr) {
        proxy.$message({ message: `限制六张，请先删除原来的图片再来上传`, type: "warning" })
    }

    // 上传之前的判断
    function beforeAvatarUpload(file) {
        // console.log(file, 'file2321312312')
        // const isLt2M = file.size / 1024 / 1024 < 2
        const isType = file.type === "image/jpeg" || file.type === "image/png"
        let m10 = 10 * 1024 * 1024;
        const size = file.size <= m10 ? true : false
        if (!isType) {
            proxy.$message({ message: "上传文件格式只能是 jpg/png 格式!", type: "warning" })
            return false
        }
        if (!size) {
            proxy.$message({ message: "上传图片大小不能超过 10M!", type: "error" })
            return false
        }
        return isType && size
    }

    // 文件状态改变时的钩子
    function fileChange(file, fileArr) {
   
        fileList.value.push(file.raw)
            //  console.log(fileList.value,'fileArr')
    }

    // 图片上传地址
    function actionImgUrl() {
        return ""
    }

    // 预览图片
    const imgVisible = ref(false)
    const dialogImageUrl = ref("")
    function handlePreview(file) {
        if (imgPath.value.length > 0 ) {
            var index = imgPath.value.findIndex((item) => item.uid == file.uid)
            console.log( dialogImageUrl.value,' 1')
            dialogImageUrl.value = proxy.imgUrl + imgPath.value[index].img

        } else {
            console.log( dialogImageUrl.value,' 2')
            dialogImageUrl.value = file.url.indexOf(proxy.imgUrl) > -1 ? file.url : proxy.imgUrl + succList.value[0]
        }
        imgVisible.value = true
    }

    return {
        fromImg,
        succList,
        imgLoading,
        fileList,
        imgPath,
        imgVisible,
        dialogImageUrl,
        actionImgUrl,
        uploadImg,
        uploadImgMore,
        handleRemove,
        handleRemoveMore,
        beforeAvatarUpload,
        handleExceed,
        handleExceedMore,
        fileChange,
        handlePreview,
    }
}
