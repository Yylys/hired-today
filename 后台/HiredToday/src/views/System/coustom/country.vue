<template>
  <!-- 头部功能 -->
  <div class="white-box">
    <div class="table-mb" style="display: flex;">
      <el-button type="primary" :icon="CirclePlus" @click="handleAdd">添加</el-button>
      <!-- <el-button  icon="Delete" @click="allDel">批量删除</el-button> -->
    </div>
    <div class="task-one">
      <div class="task-one__item">
        <span class="task-one__label">国家名称：</span>
        <el-input placeholder="请输入要搜索的国家名称" v-model.trim="state.queryForm.countriesName" size="default"
          clearable></el-input>
      </div>

      <div class="task-one__btn clearfix">
        <el-button type="primary" :loading="search_btn" :icon="Search" @click="handleSearch">搜索</el-button>
      </div>
    </div>
    <!-- 底部tanble展示 -->
    <div>
      <el-table border class="table-mb" v-loading="loading" :data="arr_data"
        :header-cell-style="{ background: '#F5F7FA', fontWeight: 'normal', color: '#606267' }"
        element-loading-background="rgba(255, 255, 255, 0.6)" @selection-change="handleAllSelected">
        <!-- <el-table-column :show-overflow-tooltip="true" align="center" type="selection" width="55" /> -->

        <!-- <el-table-column :show-overflow-tooltip="true"  align="center" prop="sid" label="活动ID" min-width="300"> </el-table-column> -->
        <el-table-column :show-overflow-tooltip="true" align="center" prop="countriesName" label="国家名称"
          min-width="200"></el-table-column>
        <el-table-column :show-overflow-tooltip="true" align="center" prop="dict" label="头像" min-width="150"
          fixed="left">
          <template #default="{ row }">
            <el-image class="fk_img_warp" style="height: 40px; width: 60px;margin: 0 5px;" :src="row.nationalFlagUrl"
              fit="fill" />
          </template>
        </el-table-column>

        <el-table-column :show-overflow-tooltip="true" align="center" label="操作" width="200" fixed="right">
          <template #default="{ row }">

            <el-button class="theme-btn" link type="primary" @click="handleEdit(row)">编辑
            </el-button>
            <el-popconfirm title="确定删除此项吗？" width="170px" confirm-button-text="确定" cancel-button-text="取消"
              @confirm="handleDelete(row)">
              <template #reference>
                <el-button  class="theme-btn" link type="primary"
                  style="margin-left: 14px">删除
                </el-button>
              </template>
            </el-popconfirm>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination v-model:current-page="current" v-model:page-size="size" :page-sizes="sizeNum" :total="totalNums"
        layout="total, sizes, prev, pager, next, jumper">
      </el-pagination>
    </div>
  </div>
  <div>
    <el-dialog v-model="centerDialogVisible" title="国家名称" width="1000" align-center @close="clearval()">
      <el-form :model="ruleNewsForm" label-width="150px" :rules="ruleNews" ref="ruleNewsRef" style="width: 800px; ">
        <el-form-item label="国家名称" prop="countriesName" style="margin-top: 10px">
          <el-input v-model.trim="ruleNewsForm.countriesName" clearable placeholder="请输入" />
        </el-form-item>
        <el-form-item label="国家头像" prop="giftImgUrl">
          <el-upload v-model:file-list="fileList" ref="uploadRef" v-loading="imgLoading"
            :class="fileList.length > 0 ? 'hide' : ''" :limit="1" :action="actionImgUrl()" :http-request="uploadImg"
            list-type="picture-card" :multiple="false" :on-remove="handleRemove" :before-upload="beforeAvatarUpload"
            :on-change="fileChange" :on-preview="handlePreview">
            <template #trigger>
              <el-icon color="#999">
                <upload-filled />
              </el-icon>
            </template>
          </el-upload>
        </el-form-item>
        <el-form-item label="是否启用" prop="status">
          <el-switch v-model="ruleNewsForm.status" inline-prompt size="large" active-text="是" inactive-text="否"
            :active-value="0" :inactive-value="1" />
        </el-form-item>
        <el-form-item>
          <div style="margin-top: 30px">
            <el-button type="primary" size="large" @click="submitForm(ruleNewsRef)">保存</el-button>
          </div>
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>
</template>

<script setup>
import { getCurrentInstance, ref, shallowRef, reactive, onMounted, watch, onActivated } from "vue"
import OneLoad from "@mixins/one-load"
import UploadImg from "@mixins/upload-img"
import "@wangeditor/editor/dist/css/style.css"
import { Editor, Toolbar } from "@wangeditor/editor-for-vue"
import { useRouter } from "vue-router"
import { Delete, CirclePlus, Search } from "@element-plus/icons-vue"
// import { Editor, Toolbar } from "@wangeditor/editor-for-vue"

const router = useRouter()
const { proxy } = getCurrentInstance()
const centerDialogVisible = ref(false)

const fileList = ref([])
const ruleNewsRef = ref(null)


const ruleNews = reactive({

  // title: [{ required: true, message: "请输入名称", trigger: "blur" }],
  // quota: [
  //   { required: true, message: '人数不能为空', trigger: 'blur' },
  //   { pattern: /^\+?[1-9]\d*$/, message: '请输入正确的人数', trigger: 'blur' }
  // ],
  // status: [{ required: true, message: "是否启用", trigger: "blur" }],
  // time: [{ required: true, message: "请选择时间", trigger: "blur" }],
})



const state = reactive({
  queryForm: {
    countriesName: null,
  }
})

const ruleNewsForm = reactive({
  countriesName: '',
  status: 0,
  nationalFlagUrl: '',
  sid: null,
})

// 表单重置
const reset = () => {
  ruleNewsForm.sid = undefined,
    ruleNewsForm.countriesName = null,
    ruleNewsForm.nationalFlagUrl = null,
    ruleNewsForm.status = 0,
    ruleNewsForm.sid = null,
    fileList.value = [];
}



onActivated(() => {
  // getList()
})

onMounted(() => {
  getList();
})


const { current, sizeNum, size, loading, arr_data, totalNums, search_text, search_btn, pubParams, pubRefreshParams, getdata } = OneLoad()

// 切换每页显示条数
watch(size, (val) => {
  current.value = 1
  size.value = val
  pubParams(getList)
})
// 跳转第几页
watch(current, (val) => {
  current.value = val
  pubParams(getList)
})

function getList() {
  let params = {
    current: current.value,
    size: size.value,
    ...state.queryForm
  }
  getdata("/v1/countries", params)
}

const handleSearch = () => {
  if (state.queryForm.operatorUserName == '') {
    state.queryForm.operatorUserName = null
  }
  // if(state.queryForm.operatorUserId==''){
  //   state.queryForm.operatorUserId=null
  // }
  search_btn.value = true
  pubRefreshParams(getList)

}


// 删除单个
const handleDelete = (row) => {
  console.log(row, 'row')
  postDel([row.sid])
}
// 删除多个
const ids = ref([])
const handleAllSelected = (val) => {
  ids.value = val
}
const allDel = () => {
  console.log(ids.value, 'ids.value[i].sid')
  if (ids.value.length == 0) {
    proxy.$message({ message: "请选择需要删除的数据", type: "warning" })
    return
  }
  let arrs = []
  for (let i = 0; i < ids.value.length; i++) {
    arrs.push(ids.value[i].sid)
  }
  console.log(arrs, 'arrs')
  postDel(arrs)
}
// 删除接口
function postDel(params) {
  console.log(params, 'params')
  proxy.$axios
    .put("/v1/countries/delete", {
      sidList: params,
    })
    .then((res) => {
      if (res.data.code == 200) {
        proxy.$message({ message: '删除成功', type: "success" })
        pubRefreshParams(getList)
      } else {
        if (res.data.code != 403) {
          proxy.$message({ message: res.data.msg, type: "error" })
        }
      }
    })
    .catch((err) => { })
}


// 添加
const handleAdd = () => {
  centerDialogVisible.value = true
}
// 编辑
const handleEdit = (row) => {
  let arr = {
    name: "",
    percentage: 0,
    raw: {},
    status: "ready",
  }
  ruleNewsForm.sid = row.sid
  ruleNewsForm.countriesName = row.countriesName,
    ruleNewsForm.status = row.status,
    fileList.value.push(arr)
    // console.log(extractPathAfterPublic(row.nationalFlagUrl),'row.nationalFlagUrl')
  fileList.value[0].path = extractPathAfterPublic(row.nationalFlagUrl);
  fileList.value[0].url = row.nationalFlagUrl
  centerDialogVisible.value = true
  console.log(fileList.value,'fileList.value')
}


function extractPathAfterPublic(url) {
    // 使用 split() 方法分割字符串
    const parts = url.split('/public');
    
    // 如果找到了 '/public'，则返回从'/public'开始的部分
    if (parts.length > 1) {
        return '/public' + parts[1];
    }
    
    return '未找到 /public';
}

// const showEdit = (row) => {
//   router.push({
//     path: '/system/activitydetail',
//     query: {
//       sid: row.sid
//     }
//   })
// }



const submitForm = (formEl) => {
  console.log(fileList.value, 'fileList.value')
  // console.log(ruleNewsForm,'ruleNewsForm')
  if (!formEl) return
  formEl.validate((valid, fields) => {
    if (valid) {
      let data = {
        countriesName: ruleNewsForm.countriesName,
        status: ruleNewsForm.status,
        nationalFlagUrl: proxy.imgUrl + fileList.value[0].path,
      }
      if (ruleNewsForm.sid == null || ruleNewsForm.sid == undefined || !ruleNewsForm.sid) {
        console.log('新增')
        postadd(data)
      } else {
        console.log('编辑')
        postupdate(ruleNewsForm.sid, data)
      }
    }
  })
}


const clearval = () => {
  // fileList.value = []
  // ruleNewsForm.treeCode = null
  reset()
}

function postadd(params) {
  proxy.$axios
    .post("/v1/countries", params)
    .then((res) => {
      if (res.data.code == 200) {
        proxy.$message({ message: '新增成功', type: "success" })
        centerDialogVisible.value = false
        pubParams(getList)
      } else {
        if (res.data.code != 403) {
          proxy.$message({ message: res.data.msg, type: "error" })
        }
      }
    })
    .catch((err) => { })
}

function postupdate(sid, params) {
  proxy.$axios
    .put(`/v1/countries/${sid}`, params)
    .then((res) => {
      if (res.data.code == 200) {
        proxy.$message({ message: '修改成功', type: "success" })
        centerDialogVisible.value = false
        pubParams(getList)
      } else {
        if (res.data.code != 403) {
          proxy.$message({ message: res.data.msg, type: "error" })
        }
      }
    })
    .catch((err) => { })
}






const uploadRef = ref(null)
const { succList, imgLoading, imgVisible, dialogImageUrl, handlePreview, actionImgUrl, handleRemove, fileChange, beforeAvatarUpload } = UploadImg()

// 上传-单张的上传
function uploadImg() {
  imgLoading.value = true
  let data = new FormData()
  // data.append("file", fromImg.value)
  data.append("file", fileList.value[0].raw)
  proxy.$axios.post("/v1/resources/public", data).then((res) => {
    imgLoading.value = false
    if (res.data.code == 200) {
      fileList.value[0].path = res.data.data.url
    } else {
      proxy.$message({ message: res.data.msg, type: "error" })
    }
  }).catch(err => {
    imgLoading.value = false
  })
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
const valueHtml = ref(null) // 内容 HTML
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
    // data.append("from", "album")
    console.log(file, 'data')
    data.append("file", file)
    proxy.$axios
      .post("/v1/resources/public", data)
      .then((res) => {
        if (res.data.code == 200) {
          let url = proxy.imgUrl + res.data.data.url
          insertFn(url) // 最后插入图片 insertFn(url, alt, href)，alt：描述，href:链接，后面非必填
        } else {
          if (res.data.code != 403) {
            proxy.$message({ message: res.data.msg, type: "error" })
          }
        }
      })
      .catch((err) => { })
  },
}


// const handleChanges=(e)=>{
//   console.log(e,)
// }

</script>

<script>
// export default {
//   name: "Home",
// }
</script>

<style lang="less" scoped>
.home-box {
  display: flex;
}

.home-main {
  flex: 1;
  padding: 0 20px 0 0;
}

.home-aside {
  flex: none;
  width: 240px;
}

.hide :deep(.el-upload--picture-card) {
  display: none;
}
</style>
