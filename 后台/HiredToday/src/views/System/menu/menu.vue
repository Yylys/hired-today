<template>
  <!-- 头部功能 -->
  <div class="white-box">
    <div>
      <div class="table-mb">
        <el-button type="primary" icon="CirclePlus" @click="handleEdit(0)">添加主菜单</el-button>
      </div>
      <el-table border class="table-mb" v-loading="loading" row-key="sid" :data="arr_data"
        :header-cell-style="{ background: '#F5F7FA',fontWeight:'normal',color: '#606267' }" element-loading-background="rgba(255, 255, 255, 0.6)"
        @selection-change="handleAllSelected">
        <!-- <el-table-column :show-overflow-tooltip="true"  align="center"  type="index" label="序号" width="55" /> -->
        <el-table-column :show-overflow-tooltip="true"  prop="menuName" label="菜单名称"> </el-table-column>
        <el-table-column :show-overflow-tooltip="true"  align="center" prop="icon" label="图标"  width="100">
          <template #default="{ row }">
            <el-icon>
              <component v-if="row.icon" :is='row.icon' />
            </el-icon>
          </template>
        </el-table-column>
        <el-table-column :show-overflow-tooltip="true"  align="center" prop="icon" label="菜单类型"  width="100">
          <template #default="{ row }">
            <span>{{ row.type == 0 ? '目录' : row.type == 10 ? '菜单' : '按钮' }}</span>
          </template>
        </el-table-column>
        <el-table-column :show-overflow-tooltip="true"  align="center"  label="排序">
          <template #default="{ row }">
            <span>{{ row.viewSort }} </span>
          </template>
        </el-table-column>
        <el-table-column :show-overflow-tooltip="true"  align="center"  prop="permission" label="权限标识"> </el-table-column>
        <el-table-column :show-overflow-tooltip="true"  align="center"  prop="component" label="组件路径"> </el-table-column>
        <el-table-column :show-overflow-tooltip="true"  align="center"  label="操作" width="210" fixed="right">
          <template #default="{ row }">
            <el-button class="theme-btn" link type="primary"
              @click="handleEdit(1, row)">添加子目录
            </el-button>
            <el-button class="theme-btn" link type="primary"
              @click="handleEdit(2, row)">编辑
            </el-button>
            <span >
              <el-popconfirm  title="确定删除此项吗？" width="170px" confirm-button-text="确定"
                cancel-button-text="取消" @confirm="handleDelete(row)">
                <template #reference>
                  <el-button class="theme-btn" link type="primary" style="margin-left: 14px">删除
                  </el-button>
                </template>
              </el-popconfirm>
            </span>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <div>
      <el-dialog v-model="centerDialogVisible" title="菜单信息" width="600" align-center @close="clearval()">
        <el-form :model="state.form" label-width="120px" :rules="ruleNews" ref="ruleNewsRef">
          <el-row>
            <el-col :span="24">
              <!-- <el-form-item v-if="type == 2 && state.form.type != 20" label="上级菜单" prop="parentTreeCode">
                <el-cascader v-model="state.form.parentTreeCode" :options="arr_data" props.checkStrictly=true
                  :props="props" @change="handleChange" placeholder="请选择" />
              </el-form-item> -->
              <el-form-item label="上级菜单" prop="parentTreeCode" style="margin-top: 10px">
                <el-cascader disabled :show-all-levels="false" v-model="state.form.parentTreeCode" :options="arr_data"
                  :props="props" @change="handleChange" placeholder="主目录" />
              </el-form-item>
            </el-col>
            <el-col :span="24">
              <el-form-item label="菜单类型" prop="type	">
                <el-radio-group v-model="state.form.type">
                  <el-radio label='0'>目录</el-radio>
                  <el-radio label='10'>菜单</el-radio>
                  <el-radio label='20'>按钮</el-radio>
                </el-radio-group>
              </el-form-item>
            </el-col>
            <el-col :span="24" v-if="state.form.type == '0'">
              <el-form-item label="菜单图标" prop="icon">
                <el-input ref="buttonRef" slot="reference" v-model="state.form.icon" placeholder="点击选择图标" readonly
                  :prefix-icon="state.form.icon">
                  <el-icon v-if="state.form.icon" style="width: 25px;">
                    <component :is='state.form.icon' />
                  </el-icon>{{ state.form.icon }}
                </el-input>
                <el-popover v-model:visible="showPopover" ref="popoverRef" :virtual-ref="buttonRef" trigger="click"
                  virtual-triggering width="300px">
                  <div
                    style="display: flex; flex-direction: column; width: 250px; height: 300px; margin: 10px; overflow-y: auto;">
                    <div class="icon" @click="selected(icon)"
                      style="width: 200px; font-size: 20px; margin: 5px; padding-left: 10px;" v-for="icon in iconList"
                      :key="icon">
                      <el-icon>
                        <component v-if="icon" :is='icon' />
                      </el-icon>
                      <span>{{ icon }}</span>
                    </div>
                  </div>
                </el-popover>
              </el-form-item>
            </el-col>
            <el-col :span="24">
              <el-form-item label="菜单名称" prop="menuName">
                <el-input v-model="state.form.menuName" placeholder="请输入菜单名称" />
              </el-form-item>
            </el-col>
            <el-col :span="24">
              <el-form-item label="显示排序" prop="viewSort">
                <el-input-number v-model="state.form.viewSort" controls-position="right" :min="0" />
              </el-form-item>
            </el-col>
            <el-col :span="24" v-if="state.form.type != '20'">
              <el-form-item prop="path" label="路由地址">
                <el-input v-model="state.form.path" placeholder="请输入路由地址" />
              </el-form-item>
            </el-col>
            <el-col :span="24" v-if="state.form.type == '10'">
              <el-form-item prop="component" label="组件路径">
                <el-input v-model="state.form.component" placeholder="请输入组件路径" />
              </el-form-item>
            </el-col>
            <el-col :span="12" v-if="state.form.type != '20'">
              <el-form-item prop="visible" label="是否显示">
                <el-switch v-model="state.form.visible" inline-prompt size="large" active-text="是" inactive-text="否"
                  :active-value="0" :inactive-value="1" />
              </el-form-item>
            </el-col>
            <el-col :span="12" v-if="state.form.type != '20'">
              <el-form-item prop="status" label="状态">
                <el-switch v-model="state.form.status" inline-prompt size="large" active-text="正常" inactive-text="停用"
                  :active-value="0" :inactive-value="1" />
              </el-form-item>
            </el-col>
            <el-col :span="24">
              <el-form-item prop="permission" label="权限标识">
                <el-input v-model="state.form.permission" placeholder="请输入路由参数" maxlength="255" />
              </el-form-item>
            </el-col>
          </el-row>
          <el-form-item>
            <div slot="footer" class="dialog-footer" style="margin-top: 30px">
          <el-button type="primary" size="large" @click="submitForm(ruleNewsRef)">确 定</el-button>
          <!-- <el-button @click="cancel">取 消</el-button> -->
        </div>
          </el-form-item>
        </el-form>

      </el-dialog>
    </div>

  </div>
</template>

<script setup>
import { getCurrentInstance, ref, reactive, onMounted, watch, onActivated } from "vue"
import OneLoad from "@mixins/one-load"
import { useRouter } from "vue-router"
const ruleNewsRef = ref(null)
const buttonRef = ref()
const popoverRef = ref()
const showPopover = ref(false)
const iconList = ref(["add-location",
  "aim",
  "alarm-clock",
  "apple",
  "arrow-down",
  "arrow-down-bold",
  "arrow-left",
  "arrow-left-bold",
  "arrow-right",
  "arrow-right-bold",
  "arrow-up",
  "arrow-up-bold",
  "avatar",
  "back",
  "baseball",
  "basketball",
  "bell",
  "bell-filled",
  "bicycle",
  "bottom",
  "bottom-left",
  "bottom-right",
  "bowl",
  "box",
  "briefcase",
  "brush",
  "brush-filled",
  "burger",
  "calendar",
  "camera",
  "camera-filled",
  "caret-bottom",
  "caret-left",
  "caret-right",
  "caret-top",
  "cellphone",
  "chat-dot-round",
  "chat-dot-square",
  "chat-line-round",
  "chat-line-square",
  "chat-round",
  "chat-square",
  "check",
  "checked",
  "cherry",
  "chicken",
  "chrome-filled",
  "circle-check",
  "circle-check-filled",
  "circle-close",
  "circle-close-filled",
  "circle-plus",
  "circle-plus-filled",
  "clock",
  "close",
  "close-bold",
  "cloudy",
  "coffee",
  "coffee-cup",
  "coin",
  "cold-drink",
  "collection",
  "collection-tag",
  "comment",
  "compass",
  "connection",
  "coordinate",
  "copy-document",
  "cpu",
  "credit-card",
  "crop",
  "d-arrow-left",
  "d-arrow-right",
  "d-caret",
  "data-analysis",
  "data-board",
  "data-line",
  "delete",
  "delete-filled",
  "delete-location",
  "dessert",
  "discount",
  "dish",
  "dish-dot",
  "document",
  "document-add",
  "document-checked",
  "document-copy",
  "document-delete",
  "document-remove",
  "download",
  "drizzling",
  "edit",
  "edit-pen",
  "eleme",
  "eleme-filled",
  "element-plus",
  "expand",
  "failed",
  "female",
  "files",
  "film",
  "filter",
  "finished",
  "first-aid-kit",
  "flag",
  "fold",
  "folder",
  "folder-add",
  "folder-checked",
  "folder-delete",
  "folder-opened",
  "folder-remove",
  "food",
  "football",
  "fork-spoon",
  "fries",
  "full-screen",
  "goblet",
  "goblet-full",
  "goblet-square",
  "goblet-square-full",
  "gold-medal",
  "goods",
  "goods-filled",
  "grape",
  "grid",
  "guide",
  "handbag",
  "headset",
  "help",
  "help-filled",
  "hide",
  "histogram",
  "home-filled",
  "hot-water",
  "house",
  "ice-cream",
  "ice-cream-round",
  "ice-cream-square",
  "ice-drink",
  "ice-tea",
  "info-filled",
  "iphone",
  "key",
  "knife-fork",
  "lightning",
  "link",
  "list",
  "loading",
  "location",
  "location-filled",
  "location-information",
  "lock",
  "lollipop",
  "magic-stick",
  "magnet",
  "male",
  "management",
  "map-location",
  "medal",
  "memo",
  "menu",
  "message",
  "message-box",
  "mic",
  "microphone",
  "milk-tea",
  "minus",
  "money",
  "monitor",
  "moon",
  "moon-night",
  "more",
  "more-filled",
  "mostly-cloudy",
  "mouse",
  "mug",
  "mute",
  "mute-notification",
  "no-smoking",
  "notebook",
  "notification",
  "odometer",
  "office-building",
  "open",
  "operation",
  "opportunity",
  "orange",
  "paperclip",
  "partly-cloudy",
  "pear",
  "phone",
  "phone-filled",
  "picture",
  "picture-filled",
  "picture-rounded",
  "pie-chart",
  "place",
  "platform",
  "plus",
  "pointer",
  "position",
  "postcard",
  "pouring",
  "present",
  "price-tag",
  "printer",
  "promotion",
  "quartz-watch",
  "question-filled",
  "rank",
  "reading",
  "reading-lamp",
  "refresh",
  "refresh-left",
  "refresh-right",
  "refrigerator",
  "remove",
  "remove-filled",
  "right",
  "scale-to-original",
  "school",
  "scissor",
  "search",
  "select",
  "sell",
  "semi-select",
  "service",
  "set-up",
  "setting",
  "share",
  "ship",
  "shop",
  "shopping-bag",
  "shopping-cart",
  "shopping-cart-full",
  "shopping-trolley",
  "smoking",
  "soccer",
  "sold-out",
  "sort",
  "sort-down",
  "sort-up",
  "stamp",
  "star",
  "star-filled",
  "stopwatch",
  "success-filled",
  "sugar",
  "suitcase",
  "suitcase-line",
  "sunny",
  "sunrise",
  "sunset",
  "switch",
  "switch-button",
  "switch-filled",
  "takeaway-box",
  "ticket",
  "tickets",
  "timer",
  "toilet-paper",
  "tools",
  "top",
  "top-left",
  "top-right",
  "trend-charts",
  "trophy",
  "trophy-base",
  "turn-off",
  "umbrella",
  "unlock",
  "upload",
  "upload-filled",
  "user",
  "user-filled",
  "van",
  "video-camera",
  "video-camera-filled",
  "video-pause",
  "video-play",
  "view",
  "wallet",
  "wallet-filled",
  "warn-triangle-filled",
  "warning",
  "warning-filled",
  "watch",
  "watermelon",
  "wind-power",
  "zoom-in",
  "zoom-out"])
const router = useRouter()
const { proxy } = getCurrentInstance()
const centerDialogVisible = ref(false)

const state = reactive({
  form: {
    sid: undefined,
    parentTreeCode: null,
    treeCode: null,
    permission: "",
    menuName: undefined,
    component: null,
    icon: undefined,
    type: '0',
    viewSort: undefined,
    isFrame: "1",
    status: "0",
    visible: "0",
    path: null,
    status: "0"
  }

})

// const state = reactive({
//   queryForm: {
//     orgName: null,
//     name: null,
//     tel: null,
//   }
// })

// const ruleNewsForm = reactive({
//   addressName: '',
//   orgName: "",
//   phone: "",
//   treeCode: null,
//   sid: null
// })



const props = ref({
  // multiple: true,
  checkStrictly: true,
  value: "treeCode",
  label: "menuName",
  children: "children",
})

const handleChange = (value) => {
  console.log(value)
}

const selected = (val) => {
  showPopover.value = false
  state.form.icon = val
}

const ruleNews = reactive({
  menuName: [
    { required: true, message: "菜单名称不能为空", trigger: "blur" }
  ],
  viewSort: [
    { required: true, message: "菜单顺序不能为空", trigger: "blur" }
  ],
  path: [
    { required: true, message: "路由地址不能为空", trigger: "blur" }
  ],
  permission: [
    { required: true, message: "权限标识不能为空", trigger: "blur" }
  ]
})


// 表单重置
const reset = () => {
  state.form.sid = undefined,
    state.form.parentTreeCode = null,
    state.form.menuName = undefined,
    state.form.icon = undefined,
    state.form.permission = null,
    state.form.type = "0",
    state.form.viewSort = undefined,
    state.form.isFrame = "1",
    state.form.status = "0",
    state.form.visible = "0",
    state.form.status = "0"
  state.form.path = ""
  state.form.component = null
  code.value = ''
}

const submitForm = (formEl) => {
  if (!formEl) return
  formEl.validate((valid, fields) => {
    if (valid) {
      // console.log(code.value, 'code.value')
      // console.log(state.form.parentTreeCode, 'state.form.parentTreeCode')
      console.log(Array.isArray(state.form.parentTreeCode), 'state.form.form')
      if (Array.isArray(state.form.parentTreeCode)) {
        state.form.parentTreeCode = state.form.parentTreeCode[state.form.parentTreeCode.length - 1]
      } else {
      }
      if (type.value == 0) {
        // alert("新增")
        // console.log(state.form.parentTreeCode[state.form.parentTreeCode.length-1],'00000')
        let data = {
          // "parentTreeCode": state.form.parentTreeCode[state.form.parentTreeCode.length-1],
          "menuName": state.form.menuName,
          "icon": state.form.icon,
          "permission": state.form.permission,
          "component": state.form.component,
          "type": Number(state.form.type),
          "viewSort": state.form.viewSort,
          "isFrame": state.form.isFrame,
          "status": state.form.status,
          "path": state.form.path,
          "visible": state.form.visible,
          "status": state.form.status,
          "permission": state.form.permission,
        }
        addMenu(data).then(response => { });
      }
      else if (type.value == 1) {
        // alert("新增子目录")
        let data = {
          "parentTreeCode": state.form.parentTreeCode,
          "menuName": state.form.menuName,
          "component": state.form.component,
          "icon": state.form.icon,
          "permission": state.form.permission,
          "type": Number(state.form.type),
          "viewSort": state.form.viewSort,
          "isFrame": state.form.isFrame,
          "status": state.form.status,
          "visible": state.form.visible,
          "status": state.form.status,
          "path": state.form.path,
          "permission": state.form.permission,
        }
        addMenu(data).then(response => {
        });
      } else {
        // alert("编辑")
        let data = {
          "parentTreeCode": state.form.parentTreeCode,
          "component": state.form.component,
          "permission": state.form.permission,
          "menuName": state.form.menuName,
          "icon": state.form.icon,
          "permission": state.form.permission,
          "type": Number(state.form.type),
          "viewSort": state.form.viewSort,
          "isFrame": state.form.isFrame,
          "status": state.form.status,
          "visible": state.form.visible,
          "status": state.form.status,
          "path": state.form.path,
        }
        updateMenu(state.form.sid,data).then(response => {
        });

      }
    }
  })
}


// 修改
function updateMenu(sid,params) {
  proxy.$axios
    .put(`/v1/menus/${sid}`, params)
    .then((res) => {
      console.log(res.data)
      if (res.data.code == 200) {
        proxy.$message({ message: "修改成功", type: "success" })
        pubParams(getList)
        centerDialogVisible.value = false
      } else {
                if(res.data.code!=403){
          proxy.$message({ message: res.data.msg, type: "error" })
        }
      }
    })
    .catch((err) => { })
}

function addMenu(params) {
  proxy.$axios
    .post("/v1/menus", params)
    .then((res) => {
      console.log(res.data)
      if (res.data.code == 200) {
        proxy.$message({ message: "创建成功", type: "success" })
        pubParams(getList)
        centerDialogVisible.value = false
      } else {
                if(res.data.code!=403){
          proxy.$message({ message: res.data.msg, type: "error" })
        }
      }
    })
    .catch((err) => { })
}


onActivated(() => {
  // getList()
})

onMounted(() => {
  getList()
})

const submitbanner = () => {
  if (type.value == 1 || !type.value) {
    postAdd()
  } else {
    postupdete()
  }
  pubParams(getList)
}


const { current, sizeNum, size, loading, arr_data, totalNums, search_btn, pubParams, pubRefreshParams, getdata } = OneLoad()

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
  getdata("/v1/menus/treeSelect", params)
}


// 修改
const setstate = (row) => {
  console.log(row, '1111111')
  proxy.$axios
    .post("admin/system/admin/update", row)
    .then((res) => {
      // form_loading.value = false
      if (res.data.code == 200) {
        proxy.$message({ message: res.data.msg, type: "success" })
        getdata("/v1/menus/treeSelect")
      } else {
                if(res.data.code!=403){
          proxy.$message({ message: res.data.msg, type: "error" })
        }
      }
    })
    .catch((err) => {
      // form_loading.value = false
    })
}

const handleSearch = () => {
  // console.log(state.queryForm, 'arr_data')
  search_btn.value = true
  pubRefreshParams(getList)
}

// 删除单个
const handleDelete = (row) => {
  // console.log(row,'row')
  postDel(row)
}
// 删除多个
const ids = ref([])
const handleAllSelected = (val) => {
  ids.value = val
}
// const allDel = () => {
//     if (ids.value.length == 0) {
//         proxy.$message({message:"请选择需要删除的数据",type:"warning"})
//         return
//     }
//     let arrs = []
//     for (let i = 0; i < ids.value.length; i++) {
//         arrs.push(ids.value[i].article_id)
//     }
//     postDel(arrs)
// }
// 删除接口
function postDel(params) {
  console.log(params, 'params')
  proxy.$axios
    .put("/v1/menus/delete", {
      sidList: [params.sid],
    })
    .then((res) => {
      if (res.data.code == 200) {
        proxy.$message({ message: '删除成功', type: "success" })
        pubParams(getList)
      } else {
                if(res.data.code!=403){
          proxy.$message({ message: res.data.msg, type: "error" })
        }
      }
    })
    .catch((err) => { })
}

const code = ref('')

const type = ref('')
// 编辑
const handleEdit = (num, row) => {
  // console.log(num, 'num')
  type.value = num
  if (num == 1) {
    state.form.parentTreeCode = row.treeCode
    code.value = row.treeCode
    // code.value=row.treeCode
  } else if (num == 2) {
    console.log(row.parentTreeCode, '111')
    // let result = row.treeCode.split('-');
    // if (result.length <= 1) {
    //   state.form.parentTreeCode = ''
    // } else {
    //   state.form.parentTreeCode = result[result.length - 2]
    // }
    // console.log(state.form.parentTreeCode,'state.form.parentTreeCode')
    state.form.sid = row.sid
    // code.value = state.form.parentTreeCode
    state.form.parentTreeCode = row.parentTreeCode
    state.form.menuName = row.menuName,
      state.form.icon = row.icon,
      state.form.permission = row.permission,
      state.form.component = row.component,
      state.form.type = row.type.toString(),
      // console.log(state.form.type,'state.form.type')
      state.form.viewSort = row.viewSort,
      state.form.isFrame = row.isFrame,
      state.form.status = row.status,
      state.form.visible = row.visible,
      state.form.status = row.status
    state.form.path = row.path
  }
  centerDialogVisible.value = true
  // console.log(code.value, 'code.value')
  // console.log(state.form.parentTreeCode, 'state.form.parentTreeCode')
}

const clearval = () => {
  // // fileList.value = []
  reset()
  // ruleNewsForm.treeCode = null
}





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

:hover.icon {
  background-color: #f5f5f5;
  border-radius: 10px;
}
</style>
