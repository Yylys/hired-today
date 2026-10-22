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
        >
        <el-table-column :show-overflow-tooltip="true" align="center" label="引导图" min-width="110">
          <template #default="{ row }">
            <!-- <el-link :href="`${proxy.imgUrl}v1/resources${row.giftImgUrl}`" :underline="false" target="_blank"
              style="color:#409EFF">点击查看</el-link> -->
            <el-image @click="showimg(row)" style="height: 163px; width: 75px" :src="proxy.imgUrl + row.images.cover"
              fit="fill" />
          </template>
        </el-table-column>
        <el-table-column :show-overflow-tooltip="true" align="center" prop="sort" label="排序" min-width="100">
        </el-table-column>
        <el-table-column :show-overflow-tooltip="true" align="center" prop="created" label="更新时间" min-width="190">
        </el-table-column>
        <el-table-column :show-overflow-tooltip="true" align="center" prop="updated" label="更新时间" min-width="190">
        </el-table-column>
        <el-table-column align="center" label="操作" width="180" fixed="right">
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
    <el-dialog v-model="centerDialogVisible" title="引导图" width="600" align-center @close="clearval()">
      <el-form :model="ruleNewsForm" label-width="120px" :rules="ruleNews" ref="ruleNewsRef" style="width: 85%">
        <el-form-item label="引导图" prop="giftImgUrl">
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
        <p style="margin-left: 120px; padding: 0px 0 20px; color: red;">建议尺寸：750px*1624px</p>
        <el-form-item label="排序	" prop="sort" style="margin-top: 10px">
          <el-input-number v-model="ruleNewsForm.sort" controls-position="right" :min="0" />
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
import { useRouter } from "vue-router";
import { Delete, CirclePlus, Search } from "@element-plus/icons-vue";

import store from '@/store'


const router = useRouter();
const { proxy } = getCurrentInstance();
const centerDialogVisible = ref(false);
const giftstatus = ref(false);
const limit = 1;
const fileList = ref([]);

const options = [
  // {
  //   value: null,
  //   label: "全部",
  // },
  {
    value: 0,
    label: "上架",
  },
  {
    value: 1,
    label: "下架",
  },
  {
    value: 2,
    label: "待审核",
  },
  {
    value: 3,
    label: "已驳回",
  },
];

const ruleNewsRef = ref(null);
const time = ref("");
const ruleNews = reactive({
  sort: [{ required: true, message: "请输入名称", trigger: "blur" }],
  // ]
});

const ruleNewsForm = reactive({
  sort: "",
  giftImgUrl: "",
  sid:null

});

// 表单重置
const reset = () => {
  (ruleNewsForm.sid = undefined),
    (ruleNewsForm.sort = null),
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
  };
  getdata("/v1/guide/banner", params);
}

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
    .put("/v1/guide/banner/delete", {
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
  let arr = {
    name: "",
    percentage: 0,
    raw: {},
    status: "ready",
  };
  ruleNewsForm.sid = row.sid;
    (ruleNewsForm.sort = row.sort),
  fileList.value.push(arr);
  fileList.value[0].name = row.images.cover;
  fileList.value[0].url = proxy.imgUrl + row.images.cover;
  // console.log(fileList.value, 'fileList.value')
  succList.value[0]= row.images
  centerDialogVisible.value = true;
  console.log(fileList.value, 'fileList.value')
 console.log(succList.value,'succList.value')
};

const submitForm = (formEl) => {
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
          sort: ruleNewsForm.sort,
          images: {
            cover:succList.value[0],
            status: 0,
            type: 1
          },
        };
        postadd(data);
      } else {
        console.log("编辑");
        let data = {
          sort: ruleNewsForm.sort,
          images: {
            cover:succList.value[0],
            status: 0,
            type: 1
          },
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

// 向服务器发送 POST 请求，地址为 "/v1/guide/banner"
// 请求的参数为 params
// 如果请求成功，显示成功消息，关闭对话框，重新获取列表
// 如果请求失败，显示错误消息
function postadd(params) {
  proxy.$axios
    .post("/v1/guide/banner", params)
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


function postupdate(params) {
  proxy.$axios
    .put(`/v1/guide/banner/${ruleNewsForm.sid}`, params)
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
  dialogImageUrl.value = proxy.imgUrl + row.images.cover;
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

.hide :deep(.el-upload--picture-card) {
  display: none;
}
</style>
