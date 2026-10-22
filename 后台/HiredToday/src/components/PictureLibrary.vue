<template>
    <div v-if="show">
        <el-dialog
            v-model="showLibrary"
            class="dialog-area"
            title="我的图库"
            width="1000px"
            top="12vh"
            :append-to-body="true"
            :destroy-on-close="true"
            draggable
            @close="onClose"
        >
            <div class="lib-box">
                <div class="lib-left">
                    <div class="lib-left__head">
                        <div class="left-one flexs-center" @click.stop="showClassDialog(1)" v-if="!class_obj || class_obj.album_id == 0">
                            <el-icon color="#000" size="12px">
                                <Plus />
                            </el-icon>
                            <span class="left-one__text">添加</span>
                        </div>
                        <div class="flexs nav-more" v-else>
                            <div class="left-one__item flexs-center" @click.stop="showClassDialog(1)">
                                <el-icon color="#000" size="14px">
                                    <Plus />
                                </el-icon>
                                <span class="left-one__text">添加</span>
                            </div>
                            <div class="left-one__item flexs-center" @click.stop="showClassDialog(2)">
                                <el-icon color="#000" size="14px">
                                    <Edit />
                                </el-icon>
                                <span class="left-one__text">重命名</span>
                            </div>
                            <div class="left-one__item flexs-center" @click.stop="dialogDelClass = true">
                                <el-icon color="#000" size="14px">
                                    <Delete />
                                </el-icon>
                                <span class="left-one__text">删除</span>
                            </div>
                        </div>
                    </div>
                    <div class="lib-left__body">
                        <div
                            :class="[cur === index ? 'is-active' : '', 'left-class']"
                            v-for="(item, index) in imgClass"
                            :key="item.album_id"
                            @click.stop="clickClass(item, index)"
                        >
                            <el-icon size="16px">
                                <FolderOpened />
                            </el-icon>
                            <span class="tree-name line-one" :title="item.name + '(' + item.nums + ')'"> {{ item.name }}({{ item.nums || 0 }}) </span>
                        </div>
                    </div>
                </div>
                <!-- :http-request="uploadImg" -->
                <div class="lib-right">
                    <div class="right-one">
                        <el-upload
                            ref="uploadFileRef"
                            :show-file-list="false"
                            :action="actionImgUrl()"
                            :on-change="fileChange"
                            :multiple="upload_batch"
                            :auto-upload="false"
                            :limit="30"
                            style="margin-right: 12px"
                        >
                            <el-button type="success" size="small">上传图片</el-button>
                        </el-upload>

                        <el-button type="primary" size="small" @click.stop="removeImg">移动图片</el-button>
                        <el-button type="info" size="small" @click.stop="showEditImg" :disabled="imgSelectArrs.length > 1"> 重命名 </el-button>
                        <el-button type="danger" size="small" @click.stop="delImg">删除图片</el-button>
                        <div class="right-one__btn">
                            <el-input placeholder="请输入图片名称" v-model="search_text" @keyup.enter.native="handleSearch" clearable> </el-input>
                            <el-button type="primary" :loading="search_btn" @click="handleSearch">搜索 </el-button>
                        </div>
                    </div>
                    <div class="right-body" v-loading="loading">
                        <el-empty description="暂无图片数据" style="margin: 40px auto" v-if="arr_data.length == 0" />
                        <template v-else>
                            <div class="img-item" v-for="(item, index) in arr_data" :key="item.name" @click.stop="clickImgs(item, index)">
                                <div class="img-item__pic">
                                    <el-image :src="proxy.imgUrl + item.photo + '!img_400'" :alt="item.tag" :title="item.tag" fit="cover" v-if="item.photo" />
                                </div>
                                <div class="img-item__text line-one" :title="item.tag">{{ item.tag }}</div>
                                <!-- 遮罩层 -->
                                <template v-if="select_multiple">
                                    <div class="img-mask" v-show="item.is_select">
                                        <div class="img-mask__icon">
                                            <el-icon size="20px" color="#fff">
                                                <Select />
                                            </el-icon>
                                        </div>
                                    </div>
                                </template>
                                <template v-else>
                                    <div class="img-mask" v-show="img_cur === index">
                                        <div class="img-mask__icon">
                                            <el-icon size="20px" color="#fff">
                                                <Select />
                                            </el-icon>
                                        </div>
                                    </div>
                                </template>
                            </div>
                        </template>
                    </div>
                    <div class="right-foot flexs">
                        <el-button class="right-foot__left" type="primary" size="small" @click="confirmSelectImg" v-if="footBth"> 使用选中的图片 </el-button>
                        <!-- 分页 -->
                        <el-pagination
                            background
                            v-model:current-page="page"
                            v-model:page-size="pageSize"
                            :total="totalNums"
                            layout="total, prev, pager, next, jumper"
                        >
                        </el-pagination>
                    </div>
                </div>
            </div>
        </el-dialog>

        <!-- 添加/编辑分类 -->
        <el-dialog
            v-model="dialogImgClass"
            :title="class_types == 1 ? '添加分类' : '编辑分类'"
            width="560px"
            :append-to-body="true"
            :destroy-on-close="true"
            @close="closeUpdate"
        >
            <div class="edit-box">
                <div class="edit-item">
                    <p>图片分类：</p>
                    <el-input placeholder="输入图片分类名称" v-model.trim="img_name" clearable></el-input>
                </div>
                <el-button type="primary" :loading="btnLoading" @click="confirmClass">确认</el-button>
            </div>
        </el-dialog>

        <!-- 删除分类 -->
        <el-dialog v-model="dialogDelClass" title="删除分类" width="560px" :append-to-body="true" :destroy-on-close="true">
            <div class="edit-box">
                <p class="del-tips">删除该文件夹同时会删除其子文件夹，是否继续？</p>
                <el-radio-group v-model="del_type">
                    <el-radio label="1">不删除图片</el-radio>
                    <el-radio label="2">同时删除图片</el-radio>
                </el-radio-group>
            </div>
            <template #footer>
                <span class="dialog-footer">
                    <el-button type="primary" :loading="btnLoading" @click="delClass">确认</el-button>
                    <el-button @click="dialogDelClass = false">取消</el-button>
                </span>
            </template>
        </el-dialog>

        <!-- 移动图片 -->
        <el-dialog
            v-model="dialogRemoveClass"
            title="请选择移动文件夹"
            width="560px"
            top="11vh"
            :append-to-body="true"
            :destroy-on-close="true"
            @close="removeClose"
        >
            <div class="class-box">
                <div class="lib-left__body">
                    <div
                        :class="[removeCur === index ? 'is-active' : '', 'left-class']"
                        v-for="(item, index) in imgClass"
                        :key="item.album_id"
                        @click.stop="removeItem(item, index)"
                    >
                        <el-icon size="16px">
                            <FolderOpened />
                        </el-icon>
                        <span class="tree-name line-one" :title="item.name + '(' + item.nums + ')'"> {{ item.name }}({{ item.nums || 0 }}) </span>
                    </div>
                </div>
            </div>
            <template #footer>
                <span class="dialog-footer">
                    <el-button type="primary" :loading="btnLoading" @click="confirmRemove">确认</el-button>
                    <el-button @click="removeClose">取消</el-button>
                </span>
            </template>
        </el-dialog>

        <!-- 重命名图片 -->
        <el-dialog v-model="dialogEditImg" title="重命名图片" width="560px" :append-to-body="true" :destroy-on-close="true">
            <div class="edit-box">
                <div class="edit-item">
                    <p>图片名称：</p>
                    <el-input placeholder="输入图片分类名称" v-model.trim="editImgName" clearable></el-input>
                </div>
                <el-button type="primary" :loading="btnLoading" @click="confirmEditImg">确认</el-button>
            </div>
        </el-dialog>
    </div>
</template>

<script setup>
/**
 * 图片库
 * @property {Boolean} show 显示图片库状态
 * @property {String} text 加载提示文字
 */
import { getCurrentInstance, ref, onMounted, watch, onBeforeUnmount } from "vue"
import { Delete, Edit, Plus, FolderOpened, Select } from "@element-plus/icons-vue"
import OneLoad from "@mixins/one-load"
import UploadImg from "@mixins/upload-img"

/**
 * 参数
 * @property {Boolean} show 是否显示图库
 * @property {Boolean} select_multiple 是否开启多选图片，默认多选
 * @property {Boolean} upload_batch 是否开启批量上传图片，默认批量
 * @property {Boolean} footBth 是否显示底部确认选中按钮，默认显示
 */
const props = defineProps({
    show: {
        type: Boolean,
        default: false,
    },
    select_multiple: {
        type: Boolean,
        default: true,
    },
    upload_batch: {
        type: Boolean,
        default: true,
    },
    footBth: {
        type: Boolean,
        default: true,
    },
})
// 监听图片库弹窗显示隐藏，显示即触发获取数据接口
watch(
    () => props.show,
    (val) => {
        if (val) {
            img_cur.value = null
            pubLibParams()
        }
    }
)

const { proxy } = getCurrentInstance()
onMounted(() => {
    // getList()
})

//清除
onBeforeUnmount(() => {
    // uploadFileRef.value = null
})

const showLibrary = ref(true) // 图片库显示状态
/**
 * mixins
 */
const { page, pageSize, loading, arr_data, totalNums, search_btn, search_text } = OneLoad()
pageSize.value = 24
function pubLibParams() {
    totalNums.value = 0
    loading.value = true
    page.value = 1
    arr_data.value = []
    getList()
}
// 跳转第几页
watch(page, (val) => {
    loading.value = true
    arr_data.value = []
    img_cur.value = null
    getList()
})
const handleSearch = () => {
    search_btn.value = true
    pubLibParams()
}

/**
 * 图片列表
 * @property {Object} OneLoad minxin列表加载
 * @property {Object} img_objs 选中的图片
 * @property {Number} img_cur 单选图片
 * @property {Array} imgSelectArrs 选中的图片ID数组
 */
const img_objs = ref(null)
const img_cur = ref(null)
const imgSelectArrs = ref([]) // 选中的图片ID
const album_id = ref("0") // 图片分类ID
const clickImgs = (item, index) => {
    img_objs.value = item
    let arrs = []
    if (props.select_multiple) {
        // 多选
        arr_data.value[index].is_select = !arr_data.value[index].is_select
        for (let i = 0; i < arr_data.value.length; i++) {
            if (arr_data.value[i].is_select) {
                arrs.push(arr_data.value[i])
            }
        }
    } else {
        img_cur.value = index
        arrs.push(item)
    }
    imgSelectArrs.value = arrs
}
function getList(tab_class = "") {
    let params = {
        page: page.value,
        limit: pageSize.value,
        so: search_text.value,
        album_id: album_id.value, // 分类ID
    }
    proxy.$axios
        .get("design/index", {
            params,
        })
        .then((res) => {
            loading.value = false
            search_btn.value = false
            if (res.data.code == 0) {
                let result = res.data.data
                totalNums.value = res.data.count
                result.map((item) => {
                    item.is_select = false
                })
                arr_data.value = result
                if (tab_class == "") {
                    getClass()
                }
            } else {
                        if(res.data.code!=403){
          proxy.$message({ message: res.data.msg, type: "error" })
        }
            }
        })
        .catch((err) => {
            loading.value = false
            search_btn.value = false
        })
}

/**
 * 图片分类
 * @property {Array} imgClass 图片分类数组
 * @property {Numer} cur 图片分类index
 * @property {Object} class_obj 图片分类项
 * @property {Function} getClass 获取图片分类数据
 */
const cur = ref(0)
const class_obj = ref(null)
const imgClass = ref([])
const clickClass = (item, index) => {
    cur.value = index
    album_id.value = item.album_id
    class_obj.value = item
    img_cur.value = null
    imgSelectArrs.value = []
    loading.value = true
    totalNums.value = 0
    page.value = 1
    arr_data.value = []
    getList(1)
}
function getClass() {
    proxy.$axios
        .get("design/cate")
        .then((res) => {
            if (res.data.code == 0) {
                let result = res.data.data
                let nums = 0
                result.map((item) => {
                    nums += item.nums
                })
                result.unshift({
                    album_id: 0,
                    name: "所有图片",
                    nums,
                })
                imgClass.value = result
                class_obj.value = result[0]
            } else {
                        if(res.data.code!=403){
          proxy.$message({ message: res.data.msg, type: "error" })
        }
            }
        })
        .catch((err) => {})
}

/**
 * 分类操作：添加、编辑、删除
 * @property {Boolean} dialogImgClass 添加/编辑弹窗状态
 * @property {Boolean} dialogDelClass 删除弹窗状态
 * @property {String} class_types 1是添加,2重命名
 * @property {String} del_type 删除分类方式,0是不删除图片,1删除
 * @property {String} img_name 图片名称
 * @property {Function} showClassDialog 显示弹窗
 * @property {Function} confirmClass 添加/编辑事件
 * @property {Function} delClass 删除事件
 */
const img_name = ref("")
const dialogImgClass = ref(false)
const btnLoading = ref(false)
const class_types = ref(1)
const showClassDialog = (type) => {
    class_types.value = type
    img_name.value = type == 2 ? class_obj.value.name : ""
    dialogImgClass.value = true
}
const confirmClass = () => {
    if (img_name.value == "") {
        proxy.$message({ message: "请输入图片分类名称", type: "warning" })
        return
    }
    btnLoading.value = true
    let data = {
        title: img_name.value,
    }
    if (class_types.value == 1) {
        data.parent_id = class_obj.value.album_id
    } else {
        data.album_id = album_id.value
    }

    let url = class_types.value == 1 ? "design/addCate" : "design/editCate"
    proxy.$axios
        .post(url, data)
        .then((res) => {
            dialogImgClass.value = false
            btnLoading.value = false
            if (res.data.code == 0) {
                pubLibParams()
            } else {
                        if(res.data.code!=403){
          proxy.$message({ message: res.data.msg, type: "error" })
        }
            }
        })
        .catch((err) => {
            btnLoading.value = false
        })
}

const dialogDelClass = ref(false)
const del_type = ref("1")
const delClass = () => {
    proxy.$axios
        .post("design/delCate", {
            album_id: album_id.value,
            type: del_type.value,
        })
        .then((res) => {
            btnLoading.value = false
            if (res.data.code == 0) {
                dialogDelClass.value = false
                cur.value = 0
                pubLibParams()
            } else {
                        if(res.data.code!=403){
          proxy.$message({ message: res.data.msg, type: "error" })
        }
            }
        })
        .catch((err) => {
            btnLoading.value = false
        })
}
const closeUpdate = () => {
    img_name.value = ""
    dialogImgClass.value = false
}

/**
 * 移动图片
 * @property {Boolean} dialogRemoveClass 移动图片弹窗
 * @property {Number} removeCur 移动图片index
 * @property {Object} removeObj 选中移动的文件夹项
 * @property {Function} removeImg 移动图片
 * @property {Function} confirmRemove 确定移动图片
 * @property {Function} removeClose 关闭移动图片弹窗
 */
const dialogRemoveClass = ref(false)
const removeCur = ref(null)
const removeObj = ref(null)
const removeItem = (item, index) => {
    removeCur.value = index
    removeObj.value = item
}
const removeImg = () => {
    if (imgSelectArrs.value.length == 0) {
        proxy.$message({ message: "请选择要移动的图片", type: "warning" })
        return
    }
    dialogRemoveClass.value = true
}
const confirmRemove = () => {
    if (!removeCur.value) {
        proxy.$message({ message: "请选择要移动的图片", type: "warning" })
        return
    }
    let arrs = []
    for (let i = 0; i < imgSelectArrs.value.length; i++) {
        arrs.push(imgSelectArrs.value[i].photo_id)
    }

    dialogRemoveClass.value = false
    loading.value = true
    proxy.$axios
        .post("design/moveImg", {
            album_id: removeObj.value.album_id,
            photo_id: imgSelectArrs.value.length == 1 ? arrs.toString() : arrs,
        })
        .then((res) => {
            loading.value = false
            if (res.data.code == 0) {
                imgSelectArrs.value = []
                pubLibParams()
            } else {
                        if(res.data.code!=403){
          proxy.$message({ message: res.data.msg, type: "error" })
        }
            }
        })
        .catch((err) => {
            loading.value = false
        })
}
const removeClose = () => {
    removeCur.value = null
    removeObj.value = null
    dialogRemoveClass.value = false
}

/**
 * 重命名图片
 * @property {Boolean} dialogEditImg 编辑图片弹窗
 * @property {String} editImgName 图片名称
 * @property {Function} showEditImg 获取编辑图片信息
 * @property {Function} confirmEditImg 确认
 */
const dialogEditImg = ref(false)
const editImgName = ref("")
const showEditImg = () => {
    if (imgSelectArrs.value.length == 0) {
        proxy.$message({ message: "请选择要重命名的图片", type: "warning" })
        return
    }
    if (imgSelectArrs.value.length > 1) {
        proxy.$message({ message: "请选择一张要重命名的图片", type: "warning" })
        return
    }
    editImgName.value = img_objs.value.tag
    dialogEditImg.value = true
}
const confirmEditImg = () => {
    if (!editImgName.value) {
        proxy.$message({ message: "请输入图片名称", type: "warning" })
        return
    }
    dialogEditImg.value = false
    loading.value = true
    proxy.$axios
        .post("design/editImg", {
            photo_id: imgSelectArrs.value[0].photo_id,
            title: editImgName.value,
        })
        .then((res) => {
            loading.value = false
            if (res.data.code == 0) {
                pubLibParams()
            } else {
                        if(res.data.code!=403){
          proxy.$message({ message: res.data.msg, type: "error" })
        }
            }
        })
        .catch((err) => {
            loading.value = false
        })
}

// 删除图片
const delImg = () => {
    if (imgSelectArrs.value.length == 0) {
        proxy.$message({ message: "请选择要删除的图片", type: "warning" })
        return
    }
    let arrs = []
    for (let i = 0; i < imgSelectArrs.value.length; i++) {
        arrs.push(imgSelectArrs.value[i].photo_id)
    }
    loading.value = true
    proxy.$axios
        .post("design/delImg", {
            photo_id: imgSelectArrs.value.length == 1 ? arrs.toString() : arrs,
        })
        .then((res) => {
            loading.value = false
            if (res.data.code == 0) {
                imgSelectArrs.value = []
                img_cur.value = null
                pubLibParams()
            } else {
                        if(res.data.code!=403){
          proxy.$message({ message: res.data.msg, type: "error" })
        }
            }
        })
        .catch((err) => {
            loading.value = false
        })
}

/**
 * 上传图片
 * @property {Function} uploadImg 上传
 */
const { actionImgUrl } = UploadImg()
// 上传-默认批量上传
let maxLength = 0
function fileChange(file, fileArr) {
    let length = fileArr.length
    maxLength = Math.max(length, maxLength)
    setTimeout(() => {
        if (length !== maxLength) {
            // proxy.$message("当前length为" + length + "不是最大值")
            return
        } else {
            recursUpload(fileArr, 0, 0, 0, length) // 调用你上传文件的接口了
        }
    }, 100)
}

/**
 * 递归上传图片
 * @property {Array} file      文件路径数组
 * @property {Number} succNum  successUp是成功上传的个数->0
 * @property {Number} failNum  failUp是上传失败的个数->0
 * @property {Number} i          i是文件路径数组的指标->0
 * @property {Number} length     length是文件路径数组的长度
 */
const uploadFileRef = ref(null)
function recursUpload(file, succNum, failNum, i, length) {
    loading.value = true
    let data = new FormData()
    data.append("album_id", album_id.value)
    data.append("image", file[i].raw)
    proxy.$axios
        .post("design/addImg", data)
        .then((res) => {
            succNum++
            if (res.data.code == 0) {
                i++
                if (i == length) {
                    loading.value = false
                    uploadFileRef.value.clearFiles()
                    pubLibParams()
                } else {
                    recursUpload(file, succNum, failNum, i, length) // 递归调用
                }
            } else {
                        if(res.data.code!=403){
          proxy.$message({ message: res.data.msg, type: "error" })
        }
            }
        })
        .catch((err) => {
            failNum++
            i++
            if (i == length) {
                proxy.$message({ message: `总共${succNum}张上传成功，${failNum}张上传失败！`, type: "error" })
                loading.value = false
                pubLibParams()
            } else {
                recursUpload(file, succNum, failNum, i, length) // 递归调用
            }
        })
}

// 抛出事件
const emits = defineEmits(["close", "select"])
const onClose = () => {
    imgSelectArrs.value = []
    img_objs.value = null
    img_cur.value = null
    cur.value = 0
    class_obj.value = null
    emits("close")
}

// 使用选中的图片
const confirmSelectImg = () => {
    if (imgSelectArrs.value.length == 0) {
        proxy.$message({ message: "请选择图片", type: "warning" })
        return
    }
    // showLibrary.value = false
    emits("select", imgSelectArrs.value)
}
</script>

<style lang="less" scoped>
.left-class {
    width: 100%;
    display: flex;
    align-items: center;
    padding: 6px 16px;
    margin-left: 18px;

    &:first-child {
        margin-left: 0;
    }

    &:hover {
        cursor: pointer;
        background-color: @gray-3;
    }

    &.is-active {
        color: @white;
        background-color: @themes;
    }

    .tree-name {
        margin-left: 4px;
    }
}

:deep(.el-dialog__body) {
    padding: 0 !important;
}

.lib-box {
    display: flex;
    align-items: flex-start;
    overflow: hidden;
    border-top: @border-gray;

    .lib-left {
        flex: none;
        width: 220px;
        height: 640px;
        border-right: @border-gray;
        position: relative;
        overflow: hidden;

        .left-one {
            background-color: @gray-2;
            height: 46px;
            border-bottom: @border-gray;
            color: #000;
            font-size: @font-size-sm;
            width: 100%;
            cursor: pointer;

            &:hover {
                color: @themes;

                .el-icon {
                    color: @themes;
                }
            }
        }

        .nav-more {
            background-color: @gray-2;
            height: 45px;
            border-bottom: @border-gray;
            color: #000;
            font-size: @font-size-sm;
            width: 100%;
            padding: 0px 16px;

            .left-one__item {
                cursor: pointer;

                &:hover {
                    color: @themes;

                    .el-icon {
                        color: @themes;
                    }
                }
            }
        }

        .left-one__text {
            margin-left: @margin-base;
        }

        .lib-left__body {
            padding: @padding-sm 0px;
            height: 580px;
            overflow-x: hidden;
            overflow-y: auto;
        }
    }

    .lib-right {
        flex: 1;
        height: 640px;
        position: relative;

        .right-one {
            padding: 0px @padding-md;
            height: 46px;
            border-bottom: @border-gray;
            display: flex;
            align-items: center;

            .el-button {
                height: 30px;
            }

            .right-one__btn {
                display: flex;
                align-items: center;
                margin-left: @margin-mdl;

                .el-input {
                    margin-right: @margin-xs;
                }

                :deep(.el-input__inner) {
                    height: 30px;
                    line-height: 30px;
                }
            }
        }

        .right-body {
            width: 100%;
            padding: @padding-sm;
            min-height: 200px;
            max-height: 540px;
            overflow: hidden;
            display: flex;
            align-items: flex-start;
            flex-flow: row wrap;

            .img-item {
                flex: none;
                width: 118px;
                height: 124px;
                border: @border-gray;
                border-radius: @radius-xs;
                overflow: hidden;
                margin-right: 9px;
                margin-bottom: @margin-xs;
                position: relative;
                cursor: pointer;

                &:hover {
                    background-color: @gray-2;
                }

                &:nth-child(6n) {
                    margin-right: 0;
                }

                .img-item__pic {
                    width: 118px;
                    height: 100px;
                    overflow: hidden;

                    .el-image {
                        width: 100%;
                        height: 100%;
                    }
                }

                .img-item__text {
                    padding: 0px @padding-base;
                    line-height: 24px;
                    font-size: @font-size-sm;
                    text-align: center;
                }

                .img-mask {
                    position: absolute;
                    top: 0;
                    left: 0;
                    background: rgba(0, 0, 0, 0.4);
                    z-index: 11;
                    width: 100%;
                    height: 100%;

                    .img-mask__icon {
                        position: absolute;
                        left: 50%;
                        top: 50%;
                        transform: translate(-50%, -50%);
                        width: 34px;
                        height: 34px;
                        overflow: hidden;
                        border-radius: 50%;
                        background: @themes;
                        text-align: center;

                        .el-icon {
                            margin-top: 7px;
                        }
                    }
                }
            }
        }

        .right-foot {
            position: absolute;
            bottom: 0px;
            left: 0;
            width: 100%;
            height: 54px;
            padding: 0px @padding-md;
            overflow: hidden;

            .right-foot__left {
                height: 30px;
            }
        }
    }
}

.class-box {
    height: 600px;
    overflow-x: hidden;
    overflow-y: auto;
}

.edit-box {
    padding: @padding-sm @padding-mdl @padding-xl;

    .edit-item {
        display: flex;
        align-items: center;
        font-size: @font-size-md;
        color: @gray-8;
        margin-bottom: @margin-xl;

        p {
            flex: none;
            text-align: right;
            padding-right: @padding-xs;
        }
    }

    .el-button {
        margin-left: 78px;
    }
}

.del-tips {
    font-size: @font-size-md;
    color: @gray-8;
    margin-bottom: @margin-md;
    font-weight: bold;
}
</style>
<style lang="less">
// 修改dialog样式
.dialog-area {
    .el-dialog__header {
        border-bottom: 1px solid #f6f6f6;
        margin-right: 0;
        overflow: hidden;
    }

    .el-dialog__body {
        padding: 0px;
    }

    .el-dialog__footer {
        border-top: 1px solid #f6f6f6;
    }
}
</style>
