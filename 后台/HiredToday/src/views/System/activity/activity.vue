<template>
  <!-- 头部功能 -->
  <div class="white-box">
    <div class="table-mb" style="display: flex;">
      <el-button type="primary" :icon="CirclePlus" @click="handleAdd">添加</el-button>
      <!-- <el-button  icon="Delete" @click="allDel">批量删除</el-button> -->
    </div>
    <div class="task-one">
      <div class="task-one__item">
        <span class="task-one__label">活动主题：</span>
        <el-input placeholder="请输入要搜索的活动名称	" v-model.trim="state.queryForm.title" size="default" clearable></el-input>
      </div>
      <div class="task-one__item">
        <span class="task-one__label">活动分类：</span>
        <el-select v-model="state.queryForm.classifySid" placeholder="活动状态" clearable>
          <el-option v-for="item in options" :key="item.sid" :label="item.memberName" :value="item.sid" />
        </el-select>
      </div>

      <div class="task-one__item">
        <span class="task-one__label">活动状态：</span>
        <el-select v-model="state.queryForm.activityStatus" placeholder="活动状态" clearable>
          <el-option v-for="item in options1" :key="item.value" :label="item.label" :value="item.value" />
        </el-select>
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
        <el-table-column :show-overflow-tooltip="true" align="center" prop="title" label="活动内容"
          min-width="200"></el-table-column>
        <el-table-column :show-overflow-tooltip="true" align="center" prop="dict" label="活动分类	" min-width="150"
          fixed="left">
          <template #default="{ row }">
            <div v-if="row.dict">{{ row.dict.memberName }}</div>
          </template>
        </el-table-column>
        <el-table-column :show-overflow-tooltip="true" align="center" label="活动状态" fixed="right" min-width="90">
          <template #default="{ row }">
            <span v-if="row.activityStatus == 1">预告中</span>
            <span v-if="row.activityStatus == 2">报名中</span>
            <span v-if="row.activityStatus == 3">进行中</span>
            <span v-if="row.activityStatus == 4">已结束</span>
          </template>
        </el-table-column>
        <el-table-column :show-overflow-tooltip="true" align="center" label="时间" min-width="250">
          <template #default="{ row }">
            <div><span>报名开始时间：</span><span>{{ row.registrationStartTime }}</span></div>
            <div><span>报名结束时间：</span><span>{{ row.registrationEndTime }}</span></div>
            <div><span>活动开始时间：</span><span>{{ row.startTime }}</span></div>
            <div><span>活动结束时间：</span><span>{{ row.endTime }}</span></div>
          </template>
        </el-table-column>
        <el-table-column :show-overflow-tooltip="true" align="center" prop="quota" label="最大名额"
          min-width="100"></el-table-column>
        <el-table-column :show-overflow-tooltip="true" align="center" prop="fee" label="活动费用" min-width="100">
          <template #default="{ row }">
            <span>{{ row.fee / 100 }}</span>
          </template>
        </el-table-column>
        <el-table-column :show-overflow-tooltip="true" align="center" prop="registrationCount" label="参与人数"
          min-width="100"></el-table-column>

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
            <el-button class="theme-btn" link type="primary" @click="showEdit(row)">报名详情
            </el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination v-model:current-page="current" v-model:page-size="size" :page-sizes="sizeNum" :total="totalNums"
        layout="total, sizes, prev, pager, next, jumper">
      </el-pagination>
    </div>
  </div>
  <div>
    <el-dialog v-model="centerDialogVisible" title="活动信息" width="1000" align-center @close="clearval()">
      <el-form :model="ruleNewsForm" label-width="150px" :rules="ruleNews" ref="ruleNewsRef" style="width: 800px; ">
        <el-form-item label="活动分类" prop="classifySid">
          <el-select v-model="ruleNewsForm.classifySid" placeholder="活动分类" clearable style="width:340px;" size="large">
            <el-option v-for="item in options" :key="item.sid" :label="item.memberName" :value="item.sid" />
          </el-select>
        </el-form-item>

        <el-form-item label="活动可见角色" prop="roleSid">
          <el-select multiple v-model="ruleNewsForm.roleSid" placeholder="活动可见角色" clearable style="width:340px;"
            size="large">
            <el-option v-for="item in options2" :key="item.sid" :label="item.roleName" :value="item.sid" />
          </el-select>
        </el-form-item>

        <el-form-item label="活动主题" prop="title" style="margin-top: 10px">
          <el-input v-model.trim="ruleNewsForm.title" clearable placeholder="请输入" />
        </el-form-item>
        <el-form-item label="限定总人数(人)" prop="quota">
          <el-input v-model.trim="ruleNewsForm.quota" clearable placeholder="请输入" />
        </el-form-item>
        <el-form-item label="活动费用" prop="fee">
          <el-input v-model.trim="ruleNewsForm.fee" clearable placeholder="请输入" />
        </el-form-item>
        <el-form-item label="活动简介" prop="description	">
          <el-input type="textarea" :autosize="{ minRows: 4 }" v-model.trim="ruleNewsForm.description" clearable
            placeholder="请输入" />
        </el-form-item>
        <el-form-item label="是否启用" prop="status">
          <el-switch v-model="ruleNewsForm.status" inline-prompt size="large" active-text="是" inactive-text="否"
            :active-value="0" :inactive-value="1" />
        </el-form-item>
        <el-form-item label="活动报名开始时间" prop="registrationStartTime">
          <el-date-picker v-model="ruleNewsForm.registrationStartTime" type="datetime" placeholder="请选择报名开始时间"
            value-format="YYYY-MM-DD HH:mm:ss" time-format="HH:mm:ss" />
        </el-form-item>
        <el-form-item label="活动报名结束时间" prop="registrationEndTime">
          <el-date-picker v-model="ruleNewsForm.registrationEndTime" type="datetime" placeholder="请选择报名结束时间"
            value-format="YYYY-MM-DD HH:mm:ss" time-format="HH:mm:ss" />
        </el-form-item>
        <el-form-item label="活动开始时间" prop="startTime">
          <el-date-picker v-model="ruleNewsForm.startTime" type="datetime" placeholder="请选择活动开始时间"
            value-format="YYYY-MM-DD HH:mm:ss" time-format="HH:mm:ss" />
        </el-form-item>
        <el-form-item label="活动结束时间" prop="endTime">
          <el-date-picker v-model="ruleNewsForm.endTime" type="datetime" placeholder="请选择活动结束时间"
            value-format="YYYY-MM-DD HH:mm:ss" time-format="HH:mm:ss" />
        </el-form-item>
        <el-form-item label="活动海报" prop="giftImgUrl">
          <el-upload v-model:file-list="fileList" ref="uploadRef" v-loading="imgLoading"
            :class="fileList.length > 0 ? 'hide' : ''" :limit="1" :action="actionImgUrl()" :http-request="uploadImg"
            list-type="picture-card" :multiple="false" :on-remove="handleRemove" :before-upload="beforeAvatarUpload"
            :on-change="fileChange" :on-preview="handlePictureCardPreview">
            <template #trigger>
              <el-icon color="#999">
                <upload-filled />
              </el-icon>
            </template>
          </el-upload>
          <p style="margin-left: 20px; padding: 0px 0 20px; color: red;">建议尺寸：117px*84px</p>
        </el-form-item>

        <el-form-item label="活动主图" prop="giftImgUrls">
          <el-upload v-model:file-list="fileList1" ref="uploadRef" v-loading="imgLoading"
            :class="fileList1.length > 4 ? 'hide' : ''" :limit="5" :action="actionImgUrl()" :http-request="uploadImg1"
            list-type="picture-card" :multiple="false" :on-remove="handleRemove" :before-upload="beforeAvatarUpload"
            :on-change="fileChange" :on-preview="handlePictureCardPreview">
            <template #trigger>
              <el-icon color="#999">
                <upload-filled />
              </el-icon>
            </template>
          </el-upload>
          <p style="margin-left: 20px; padding: 0px 0 20px; color: red;">建议尺寸：750px*580px</p>
        </el-form-item>
        <el-form-item label="说明">
          <div class="editor-box">
            <Toolbar style="border: 1px solid #ccc" :editor="editorRef" :defaultConfig="toolbarConfig" mode="default" />
            <Editor style="height: 440px; overflow-y: hidden;border :1px solid #ccc" v-model="valueHtml"
              :defaultConfig="editorConfig" mode="default" @onCreated="handleCreated" />
          </div>
        </el-form-item>
        <el-form-item>
          <div style="margin-top: 30px">
            <el-button type="primary" size="large" @click="submitForm(ruleNewsRef)">保存</el-button>
          </div>
        </el-form-item>
      </el-form>
    </el-dialog>
    <el-dialog v-model="dialogVisible">
    <!-- <img style="width: 750px !important; height:500px !important ;" w-full :src="dialogImageUrl" alt="Preview Image" /> -->
    <el-image :src="dialogImageUrl" fit="cover" />
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


const dialogImageUrl = ref('')
const dialogVisible = ref(false)

const ruleNewsRef = ref(null)
const time = ref('')

const options = ref([])
const options2 = ref([])
const options1 = ref([{
  value: 1,
  label: '预告中'
}, {
  value: 2,
  label: '报名中'
}, {
  value: 3,
  label: '进行中'
}, {
  value: 4,
  label: '已结束'
}])






const ruleNews = reactive({

  fee: [{ required: true, message: "请输入", trigger: "blur" }],
  title: [{ required: true, message: "请输入", trigger: "blur" }],
  quota: [
    { required: true, message: '人数不能为空', trigger: 'blur' },
    { pattern: /^\+?[1-9]\d*$/, message: '请输入正确的人数', trigger: 'blur' }
  ],
  description: [{ required: true, message: "请输入", trigger: "blur" }],
  endTime: [{ required: true, message: "请选择时间", trigger: "blur" }],
  startTime: [{ required: true, message: "请选择时间", trigger: "blur" }],
  registrationEndTime: [{ required: true, message: "请选择时间", trigger: "blur" }],
  registrationStartTime: [{ required: true, message: "请选择时间", trigger: "blur" }],
})



const state = reactive({
  queryForm: {
    activityStatus: null,
    classifySid: null,
    title: null,
  }
})



const fileList = ref([])
const fileList1 = ref([])

const ruleNewsForm = reactive({
  title: '',
  quota: "",
  fee: '',
  description: "",
  sid: null,
  status: 0,
  classifySid: null,
  roleSid: [],
  registrationStartTime: '',
  startTime: '',
  endTime: '',
  registrationEndTime: '',
})

// 表单重置
const reset = () => {
  ruleNewsForm.sid = undefined,
    ruleNewsForm.title = null,
    ruleNewsForm.quota = undefined,
    ruleNewsForm.fee = undefined,
    ruleNewsForm.description = undefined,
    ruleNewsForm.registrationStartTime = '',
    ruleNewsForm.registrationEndTime = '',
    ruleNewsForm.startTime = '',
    ruleNewsForm.endTime = '',
    ruleNewsForm.status = 0,
    ruleNewsForm.classifySid = 0,
    ruleNewsForm.roleSid = [],
    ruleNewsForm.sid = null
  fileList.value = [];
  fileList1.value = [];
  valueHtml.value = ''
}


// 配置级联选择参数
const props = ref({
  multiple: true,
  value: "sid",
  label: "menuName",
  children: "children",
})

onActivated(() => {
  // getList()
})

onMounted(() => {
  getList();
  getKeys()
  getRole()
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
  getdata("/v1/activity", params)
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
    .put("/v1/activity/delete", {
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
const handleEdit = (data) => {
  // console.log(num, 'id')
  let arr = {
    name: "",
    percentage: 0,
    raw: {},
    status: "ready",
  }
  proxy.$axios
    .get(`/v1/activity/${data.sid}`)
    .then((res) => {
      if (res.data.code == 200) {
        let row = res.data.data
        valueHtml.value = row.content, // 往图片追加根域名和'/'
          ruleNewsForm.sid = row.sid
        ruleNewsForm.quota = row.quota,
          ruleNewsForm.fee = row.fee / 100,
          ruleNewsForm.description = row.description,
          ruleNewsForm.title = row.title,
          ruleNewsForm.status = row.status,
          ruleNewsForm.classifySid = row.classifySid,
          ruleNewsForm.roleSid = row.roleSid,
          ruleNewsForm.registrationStartTime = row.registrationStartTime
        ruleNewsForm.registrationEndTime = row.registrationEndTime
        ruleNewsForm.startTime = row.startTime
        ruleNewsForm.endTime = row.endTime
        fileList.value.push(arr)
        fileList.value[0].path = row.posters.cover
        fileList.value[0].url = proxy.imgUrl + row.posters.cover
        console.log(fileList.value, 'fileList1.value')
        for (let i = 0; i < row.mimage.length; i++) {
          let arr1 = {
            name: "",
            percentage: 0,
            raw: {},
            status: "ready",
          }

          fileList1.value[i] = arr1
          fileList1.value[i].raw.path = row.mimage[i].cover
          fileList1.value[i].url = proxy.imgUrl + row.mimage[i].cover
        }
      } else {
        if (res.data.code != 403) {
          proxy.$message({ message: res.data.msg, type: "error" })
        }

      }
    })
    .catch((err) => { })
  centerDialogVisible.value = true
}

const showEdit = (row) => {
  router.push({
    path: '/system/activitydetail',
    query: {
      sid: row.sid
    }
  })
}



const handlePictureCardPreview = (uploadFile) => {
  dialogImageUrl.value = uploadFile.url
  dialogVisible.value = true
}




const submitForm = (formEl) => {

  // console.log(ruleNewsForm,'ruleNewsForm')
  if (!formEl) return
  formEl.validate((valid, fields) => {
    let htmls = ""
    if (valueHtml.value) {
      htmls = valueHtml.value // 去除图片根域名以及根域名后面的'/'
    }

    if (valid) {
      if (fileList.value.length == 0 || fileList1.value.length == 0) {
        proxy.$message({ message: '请上传图片', type: "error" })
        return
      }
      console.log(fileList1.value, 'fileList.value[0].path')
      let arr = []
      for (let i = 0; i < fileList1.value.length; i++) {
        console.log(fileList1.value[i].raw.path)
        arr.push({
          cover: fileList1.value[i].raw.path,
          status: 0,
          type: 5
        })
      }
      if (ruleNewsForm.sid == null || ruleNewsForm.sid == undefined || !ruleNewsForm.sid) {
        console.log('新增')
        let data = {
          quota: ruleNewsForm.quota,
          description: ruleNewsForm.description,
          title: ruleNewsForm.title,
          status: ruleNewsForm.status,
          classifySid: ruleNewsForm.classifySid,
          roleSid: ruleNewsForm.roleSid,
          registrationStartTime: ruleNewsForm.registrationStartTime,
          registrationEndTime: ruleNewsForm.registrationEndTime,
          startTime: ruleNewsForm.startTime,
          endTime: ruleNewsForm.endTime,
          content: htmls,
          fee: ruleNewsForm.fee * 100,
          mimage: arr,
          posters: {
            cover: fileList.value[0].path,
            status: 0,
            type: 6
          },
        }
        postadd(data)
      } else {
        console.log('编辑')
        // console.log(fileList.value[0].path, 'fileList.value[0].path')
        let data = {
          quota: ruleNewsForm.quota,
          description: ruleNewsForm.description,
          title: ruleNewsForm.title,
          status: ruleNewsForm.status,
          classifySid: ruleNewsForm.classifySid,
          roleSid: ruleNewsForm.roleSid,
          registrationStartTime: ruleNewsForm.registrationStartTime,
          registrationEndTime: ruleNewsForm.registrationEndTime,
          startTime: ruleNewsForm.startTime,
          endTime: ruleNewsForm.endTime,
          fee: ruleNewsForm.fee * 100,
          content: htmls,
          mimage: arr,
          posters: {
            cover: fileList.value[0].path,
            status: 0,
            type: 6
          },
        }
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
    .post("/v1/activity", params)
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
    .put(`/v1/activity/${sid}`, params)
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
const { succList, imgLoading, imgVisible, handlePreview, actionImgUrl, handleRemove, fileChange, beforeAvatarUpload } = UploadImg()

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

// 上传-单张海报的上传
function uploadImg1(file) {
  imgLoading.value = true
  let data = new FormData()

  console.log(file, 'file')
  // data.append("file", fromImg.value)
  data.append("file", file.file)
  proxy.$axios.post("/v1/resources/public", data).then((res) => {
    imgLoading.value = false
    if (res.data.code == 200) {
      file.file.path = res.data.data.url
    } else {
      proxy.$message({ message: res.data.msg, type: "error" })
    }
  }).catch(err => {
    imgLoading.value = false
  })
}


const getRole = () => {
  // console.log(num, 'id')
  proxy.$axios
    .get("/v1/roles/enrollRole")
    .then((res) => {
      if (res.data.code == 200) {
        options2.value = res.data.data;
      } else {
        if (res.data.code != 403) {
          proxy.$message({ message: res.data.msg, type: "error" })
        }
      }
    })
    .catch((err) => { })
}


const getKeys = () => {
  // console.log(num, 'id')
  proxy.$axios
    .get("/v1/dicts/by-key/activity")
    .then((res) => {
      if (res.data.code == 200) {
        options.value = res.data.data.filter(item => item.status === 0);
      } else {
        if (res.data.code != 403) {
          proxy.$message({ message: res.data.msg, type: "error" })
        }
      }
    })
    .catch((err) => { })
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
