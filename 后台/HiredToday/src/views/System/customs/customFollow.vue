<template>
  <!-- 头部功能 -->
  <div class="white-box">
    <div class="table-mb">
      <el-button  type="primary" :icon="CirclePlus" @click="handleAdd">添加</el-button>
      <el-button  :icon="Delete" @click="allDel">批量删除</el-button>
    </div>
    <!-- 底部tanble展示 -->
    <div>
      <el-table border class="table-mb" v-loading="loading" :data="arr_data"
        :header-cell-style="{ background: '#F5F7FA', fontWeight: 'normal', color: '#606267' }"
        element-loading-background="rgba(255, 255, 255, 0.6)" @selection-change="handleAllSelected">
        <el-table-column :show-overflow-tooltip="true" align="center" type="selection" width="55" />
        <el-table-column :show-overflow-tooltip="true" align="center" prop="content" label="内容	" min-width="100"
          fixed="left">
        </el-table-column>
        <el-table-column :show-overflow-tooltip="true" label="图片" min-width="130">
          <template #default="{ row }">
            <el-image @click="handlePictureCardPreview(item)" :preview-teleported=true :preview-src-list="srcList"
              class="fk_img_warp" v-for="(item, index) in row.images" :key="index"
              style="height: 40px; width: 40px; margin: 0 2px;" :src="proxy.imgUrl + item" fit="fill" />
          </template>
        </el-table-column>
        <el-table-column :show-overflow-tooltip="true" align="center" prop="followName" label="跟进人" min-width="90">
        </el-table-column>
        <el-table-column :show-overflow-tooltip="true" align="center" prop="created" label="跟进时间" min-width="190">
        </el-table-column>
        <el-table-column :show-overflow-tooltip="true" align="center" prop="updated" label="更新时间" min-width="190">
        </el-table-column>
        <el-table-column align="center" label="操作" width="120" fixed="right">
          <template #default="{ row }">
            <el-button style="margin-left: 10px"  class="theme-btn" link
              type="primary" @click="handleEdit(row)">编辑
            </el-button>
            <el-popconfirm title="确定删除此项吗？" width="170px" confirm-button-text="确定" cancel-button-text="取消"
              @confirm="handleDelete(row)">
              <template #reference>
                <el-button  class="theme-btn" link type="primary">删除
                </el-button>
              </template>
            </el-popconfirm>
            <!-- <el-button class="theme-btn" link type="primary" @click="handleEdit(row.id, 2)">修改密码
                      </el-button> -->
          </template>
        </el-table-column>
      </el-table>
      <el-pagination v-model:current-page="current" v-model:page-size="size" :page-sizes="sizeNum" :total="totalNums"
        layout="total, sizes, prev, pager, next, jumper">
      </el-pagination>
    </div>
  </div>
  <div>
    <el-dialog v-model="centerDialogVisible" title="客户跟进" width="600" align-center @close="clearval()">
      <el-form :model="ruleNewsForm" label-width="120px" :rules="ruleNews" ref="ruleNewsRef" style="width: 85%">
        <el-form-item label="跟进内容	" prop="content" style="margin-top: 10px">
          <el-input v-model.trim="ruleNewsForm.content" clearable placeholder="请输入" />
        </el-form-item>
        <el-form-item label="跟进图片" prop="images">
          <el-upload v-model:file-list="fileList" ref="uploadRef" v-loading="imgLoading" class="prize-upload"
            :limit="limit" :action="actionImgUrl()" :http-request="uploadImg" list-type="picture-card" :multiple="false"
            :on-remove="handleRemove" :before-upload="beforeAvatarUpload" :on-change="fileChange"
            :on-preview="handlePreview">
            <el-icon color="#999">
              <upload-filled />
            </el-icon>
          </el-upload>
        </el-form-item>

        <el-form-item>
          <div style="margin-top: 30px">
            <el-button type="primary" size="large" @click="submitForm(ruleNewsRef)">保存</el-button>
          </div>
        </el-form-item>
      </el-form>
    </el-dialog>



  </div>
  <el-dialog v-model="imgVisible">
    <img w-full :src="dialogImageUrl" alt="Preview Image" />
  </el-dialog>
</template>

<script setup>
import {
  getCurrentInstance,
  ref,
  reactive,
  onMounted,
  watch,
  onActivated,
} from "vue";
import OneLoad from "@mixins/one-load";
import UploadImg from "@mixins/upload-img";
import { Delete, CirclePlus, Search } from "@element-plus/icons-vue";
import { useRouter, useRoute } from "vue-router"
import store from '@/store'
const router = useRouter()
const route = useRoute()

var sid = route.query.sid || ""
const userinfo = JSON.parse(sessionStorage.getItem("userinfo"));
const permissions = store.state.value.user.permissions


// 图片预览
const srcList = ref([]);
const handlePictureCardPreview = (uploadFile) => {
  srcList.value[0] = proxy.imgUrl + uploadFile;
};

const customSort = (a, b, sortOrder) => {
  // 自定义排序逻辑
  // 返回 -1 表示 a 在 b 之前，返回 1 表示 a 在 b 之后
  // sortOrder 表示当前排序顺序，可以根据该值来确定排序顺序逻辑
  // 例如如果 sortOrder 是 'ascending'，则按升序排序；如果是 'descending'，则按降序排序
  // 这里可以根据需要编写你自己的排序逻辑
  // 示例是按字符串长度升序排序
  return sortOrder === 'ascending' ? a.length - b.length : b.length - a.length;
}

const { proxy } = getCurrentInstance();
const centerDialogVisible = ref(false);
const limit = 6;
const fileList = ref([]);


const ruleNewsRef = ref(null);
const ruleNews = reactive({
  // giftName: [{ required: true, message: "请输入名称", trigger: "blur" }],

});


const state = reactive({
  queryForm: {
    customSid: sid,
  },
});


const ruleNewsForm = reactive({
  giftName: "",
  // giftAble: 0,
  note: "",
  sid: null,
  onlineStatus: null,
  // giftUsed: 0,
  giftNum: 0,
  images: "",
});

// 表单重置
const reset = () => {
  (ruleNewsForm.sid = undefined),
    (ruleNewsForm.content = null),
    // ruleNewsForm.giftAble = 0,
    // ruleNewsForm.giftUsed = 0,
    (ruleNewsForm.note = undefined),
    (ruleNewsForm.giftNum = 0),
    (ruleNewsForm.onlineStatus = null),
    (ruleNewsForm.sid = null);
  fileList.value = [];
  succList.value = [];
};




// 文件上传
const uploadRef = ref(null);
const {
  succList,
  imgLoading,
  imgVisible,
  dialogImageUrl,
  beforeAvatarUpload,
  handlePreview,
  actionImgUrl,
  uploadImg,
  handleRemove,
  fileChange,
} = UploadImg();






onActivated(() => {
  // getList();
});

onMounted(() => {
  getList();
});

const {
  current,
  sizeNum,
  size,
  loading,
  arr_data,
  totalNums,
  search_text,
  search_btn,
  pubParams,
  pubRefreshParams,
  getdata,
} = OneLoad();

// 切换每页显示条数
watch(size, (val) => {
  // console.log('qiehuan')
  current.value = 1;
  size.value = val;
  pubParams(getList);
});
// 跳转第几页
watch(current, (val) => {
  current.value = val;
  pubParams(getList);
});

function getList() {
  let params = {
    current: current.value,
    size: size.value,
    ...state.queryForm,
  };
  getdata("/v1/sys-custom-follow/customFollow", params);
}

const handleSearch = () => {
  if (state.queryForm.operatorUserName == "") {
    state.queryForm.operatorUserName = null;
  }
  // if(state.queryForm.operatorUserId==''){
  //   state.queryForm.operatorUserId=null
  // }
  search_btn.value = true;
  pubRefreshParams(getList);
};

// 删除单个
const handleDelete = (row) => {
  console.log(row, "row");
  postDel([row.sid]);
};
// 删除多个
const ids = ref([]);
const handleAllSelected = (val) => {
  ids.value = val;
};
const allDel = () => {
  console.log(ids.value, "ids.value[i].sid");
  if (ids.value.length == 0) {
    proxy.$message({ message: "请选择需要删除的数据", type: "warning" });
    return;
  }
  let arrs = [];
  for (let i = 0; i < ids.value.length; i++) {
    arrs.push(ids.value[i].sid);
  }
  console.log(arrs, "arrs");
  postDel(arrs);
};
// 删除接口
function postDel(params) {
  console.log(params, "params");
  proxy.$axios
    .put("/v1/sys-custom-follow/delete", {
      sidList: params,
    })
    .then((res) => {
      if (res.data.code == 200) {
        proxy.$message({ message: "删除成功", type: "success" });
        pubRefreshParams(getList);
      } else {
        if (res.data.code != 403) {
          proxy.$message({ message: res.data.msg, type: "error" })
        };
      }
    })
    .catch((err) => { });
}

// 添加
const handleAdd = () => {
  centerDialogVisible.value = true;
};
// 编辑
const handleEdit = (row) => {
  console.log(row)
  let arr = {
    name: "",
    percentage: 0,
    raw: {},
    status: "ready",
  };
  ruleNewsForm.sid = row.sid;
  (ruleNewsForm.content = row.content),
    (ruleNewsForm.images = row.images),
    (succList.value = row.images);
  fileList.value = []
  for (var i = 0; i < row.images.length; i++) {
    fileList.value[i] = arr;
    fileList.value[i].name = row.images[i];
    fileList.value[i].url = proxy.imgUrl + row.images[i];
    fileList.value[i].raw.url = proxy.imgUrl + row.images[i];
  }
  console.log(fileList.value, 'fileList.value')
  console.log(ruleNewsForm, 'ruleNewsForm')
  centerDialogVisible.value = true;
};



const submitForm = (formEl) => {
  console.log(fileList, '.raw')
  if (!formEl) return;
  formEl.validate((valid, fields) => {
    if (valid) {
      if (
        ruleNewsForm.sid == null ||
        ruleNewsForm.sid == undefined ||
        !ruleNewsForm.sid
      ) {
        console.log("新增");
        let data = {
          // giftAble: ruleNewsForm.giftAble,
          // giftUsed: ruleNewsForm.giftUsed,
          content: ruleNewsForm.content,
          customSid: sid,
          imgUrls: succList.value,
          // onlineStatus: ruleNewsForm.onlineStatus,
          // giftNum: ruleNewsForm.giftNum,
        };
        postadd(data);
      }
      else {
        console.log("编辑");
        let data = {
          content: ruleNewsForm.content,
          customSid: sid,
          imgUrls: succList.value,
          sid: ruleNewsForm.sid,
        };
        postupdate(data);
      }
    }
  });
};



const clearval = () => {
  // fileList.value = []
  // ruleNewsForm.treeCode = null
  reset();
};

// 向服务器发送 POST 请求，地址为 "/v1/sys-custom-follow/customFollow"
// 请求的参数为 params
// 如果请求成功，显示成功消息，关闭对话框，重新获取列表
// 如果请求失败，显示错误消息
function postadd(params) {
  proxy.$axios
    .post("/v1/sys-custom-follow", params)
    .then((res) => {
      // 判断请求是否成功
      if (res.data.code == 200) {
        // 显示成功消息
        proxy.$message({ message: "新增成功", type: "success" });
        // 关闭对话框
        centerDialogVisible.value = false;
        // 重新获取列表
        pubParams(getList);
      } else {
        // 显示错误消息
        if (res.data.code != 403) {
          proxy.$message({ message: res.data.msg, type: "error" })
        };
      }
    })
    .catch((err) => { });
}



// 修改
const setstates = (sid, status) => {
  proxy.$axios
    .put(`/v1/sys-custom-follow/customFollow/online/${sid}/${status}`)
    .then((res) => {
      if (res.data.code == 200) {
        proxy.$message({ message: "修改成功", type: "success" });
        pubParams(getList);
        // giftstatus.value = false
      } else {
        if (res.data.code != 403) {
          proxy.$message({ message: res.data.msg, type: "error" })
        };
      }
    })
    .catch((err) => { });
};


function postupdate(params) {
  proxy.$axios
    .put("/v1/sys-custom-follow", params)
    .then((res) => {
      if (res.data.code == 200) {
        proxy.$message({ message: "修改成功", type: "success" });
        centerDialogVisible.value = false;
        pubRefreshParams(getList);
      } else {
        if (res.data.code != 403) {
          proxy.$message({ message: res.data.msg, type: "error" })
        };
      }
    })
    .catch((err) => { });
}

const showimg = (row) => {
  dialogImageUrl.value = proxy.imgUrl + row.images;
  imgVisible.value = true;
};



</script>

<script>
// export default {
//   name: "Home",
// };
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
</style>
