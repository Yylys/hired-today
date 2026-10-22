<template>
  <!-- 头部功能 -->
  <div class="white-box">

    <div class="task-one">
      <div class="task-one__item">
        <span class="task-one__label">投诉类型：</span>
        <el-select v-model="state.queryForm.dictTypeSid" placeholder="投诉类型" clearable>
          <el-option v-for="item in options" :key="item.sid" :label="item.memberName" :value="item.sid" />
        </el-select>
      </div>

      <div class="task-one__btn clearfix">
        <el-button type="primary" :loading="search_btn" :icon="Search" @click="handleSearch">搜索</el-button>
      </div>
    </div>
    <!-- 底部tanble展示 -->
    <div>
      <el-table border class="table-mb" v-loading="loading" :data="arr_data"
        :header-cell-style="{ background: '#F5F7FA',fontWeight:'normal',color: '#606267' }" element-loading-background="rgba(255, 255, 255, 0.6)"
        @selection-change="handleAllSelected">
        <!-- <el-table-column :show-overflow-tooltip="true"  align="center" type="selection" width="55" /> -->

        <el-table-column :show-overflow-tooltip="true"  align="center" prop="type" label="反馈类型" min-width="90">
          <template #default="{ row }">
            <span>{{ row.dictType.memberName}}</span>
          </template>
        </el-table-column>
        <el-table-column :show-overflow-tooltip="true"  min-width="200" align="center" prop="user.nickName" label="反馈人"> </el-table-column>

        <el-table-column :show-overflow-tooltip="true"  min-width="200" align="center" prop="content" label="反馈内容"> </el-table-column>
        <el-table-column min-width="180" prop="loginUserName" label="投诉图片">
          <template #default="{ row }">
            <el-image @click="handlePictureCardPreview(item.cover)"
              :preview-teleported=true :preview-src-list="srcList" class="fk_img_warp"
              v-for="(item, index) in row.imgList" :key="index" style="height: 40px; width: 40px"
              :src="proxy.imgUrl + item.cover" fit="fill" />
          </template>
        </el-table-column>
        <el-table-column :show-overflow-tooltip="true"  align="center" prop="created" label="投诉时间" width="200">
          <template #default="{ row }">
            <span v-if="row.created">{{ row.created}}</span>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination v-model:current-page="current" v-model:page-size="size" :page-sizes="sizeNum" :total="totalNums"
        layout="total, sizes, prev, pager, next, jumper">
      </el-pagination>
    </div>
  </div>
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
import UploadImg from "@mixins/upload-img";
import OneLoad from "@mixins/one-load";



const { proxy } = getCurrentInstance();
const centerDialogVisible = ref(false);


// 图片预览
const srcList = ref([]);
const handlePictureCardPreview = (uploadFile) => {
  srcList.value[0] = proxy.imgUrl + uploadFile;
  // console.log(srcList.value,'srcList.value')
};
const options = ref([])

const state = reactive({
  queryForm: {
    dictTypeSid: null,
    sortFieldName: "created",
    ascended:false
    
  },
});


onActivated(() => {
  // getList();
});


onMounted(() => {
  getList();
  getType()
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
  getdata("/v1/feedback", params);
}

const handleSearch = () => {
  if (state.queryForm.wxNickName == "") {
    state.queryForm.wxNickName = null;
  }
  if (state.queryForm.type == "") {
    state.queryForm.type = null;
  }
  if (state.queryForm.telephone == "") {
    state.queryForm.telephonez = null;
  }
  search_btn.value = true;
  pubRefreshParams(getList);
};
const getType = () => {
  // console.log(num, 'id')
  proxy.$axios
    .get("/v1/dicts/by-key/feedbackType")
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


</script>

<script>
// export default {
//   name: "Home",
// };
</script>

<style scoped lang="less">
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

.fk_img_warp {
  // display: flex;
  margin-right: 10px;
}

:deep(.el-image-viewer__img) {
  width: auto;
  background: red !important;
  margin: 100px !important;


}

::v-deep .el-image-viewer__img {
  width: auto;
  background: red !important;
  margin: 100px !important;


}
</style>
