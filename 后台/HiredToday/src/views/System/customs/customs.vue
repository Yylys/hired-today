<template>
  <!-- 头部功能 -->
  <div class="white-box">
    <div class="table-mb" style="display: flex; justify-content: start;">
      <el-button type="primary" icon=CirclePlus @click="handleAdd">添加</el-button>
      <el-button icon=Delete @click="allDel">批量删除</el-button>
      <el-button  icon=Download @click="downloadFile">模板下载</el-button>
      <router-link style="margin-left: 10px;" 
        :to="{ path: '/system/imports', query: { type: 1 } }"> <el-button icon=Expand>导入记录</el-button></router-link>
      <el-upload  ref="uploadRef" v-model:file-list="fileList"
        v-loading="imgLoading" :limit=limit class="prize-upload" style="width: 85%;margin-left: 10px;"
        :action="actionImgUrl()" :http-request="uploadImgs" :multiple="false" :show-file-list="false"
        :on-remove="handleRemove" :before-upload="beforeAvatarUpload" :on-change="fileChange">
        <el-button icon=Upload>批量导入
        </el-button>
      </el-upload>
    </div>
    <div class="task-one">
      <div class="task-one__item">
        <span class="task-one__label">客户姓名：</span>
        <el-input placeholder="请输入要搜索的客户姓名	" v-model.trim="state.queryForm.name" size="default" clearable></el-input>
      </div>
      <div class="task-one__item">
        <span class="task-one__label">手机号：</span>
        <el-input placeholder="请输入要搜索的手机号	" v-model.trim="state.queryForm.phone" size="default" clearable></el-input>
      </div>
      <div class="task-one__item">
        <span class="task-one__label">客户身份证：</span>
        <el-input placeholder="请输入要搜索的客户身份证	" v-model.trim="state.queryForm.idCard" size="default" clearable></el-input>
      </div>

      

      <div class="task-one__item" v-if="hasAdminOrOperator(userinfo.roleKeySet, 2)">
        <span class="task-one__label">销售负责人：</span>
        <el-cascader filterable v-model="saleSid" :props="props2" :options="class_options2" collapse-tags clearable
          placeholder="请选择销售负责人" />
      </div>
      <div class="task-one__item" v-if="hasAdminOrOperator(userinfo.roleKeySet, 1)">
        <span class="task-one__label">机构：</span>
        <el-cascader filterable v-model="orgSid" :props="props3" :options="class_options3" collapse-tags clearable
          :show-all-levels="false" placeholder="请选择机构" />
      </div>
      <div class="task-one__item">
        <!-- <span class="task-one__label">客户标签：</span> -->
        <p>客户标签：</p>
        <!-- <el-cascader v-model="labelSids" :props="props" :options="class_options" collapse-tags clearable placeholder="请选择客户标签" /> -->
        <el-select v-model="labelSids" placeholder="请选择客户标签" collapse-tags multiple clearable>
          <el-option v-for="item in class_options" :key="item.sid" :label="item.labelName" :value="item.sid" />
        </el-select>
      </div>
      <div class="task-one__item">
        <span class="task-one__label">来源名称：</span>
        <el-cascader filterable v-model="sourceSid" :props="props1" :options="class_options1" collapse-tags clearable
          placeholder="请选择客户来源" />
      </div>

      <div class="task-one__item">
        <span class="task-one__label">录入时间：</span>
        <el-date-picker v-model="value1" type="datetimerange" range-separator="至" start-placeholder="开始时间"
          end-placeholder="结束时间" />
      </div>
      <div class="task-one__btn clearfix">
        <el-button type="primary" :loading="search_btn" icon="Search" @click="handleSearch">搜索</el-button>
      </div>
    </div> <!-- 底部tanble展示 -->
    <div>
      <el-table border class="table-mb" v-loading="loading" :data="arr_data"
        :header-cell-style="{ background: '#F5F7FA', fontWeight: 'normal', color: '#606267' }"
        element-loading-background="rgba(255, 255, 255, 0.6)" @selection-change="handleAllSelected">
        <el-table-column :show-overflow-tooltip="true" align="center" type="selection" width="55" />
        <el-table-column :show-overflow-tooltip="true" align="center" prop="orgName" label="归属机构" min-width="100"
          fixed="left"> </el-table-column>
        <el-table-column :show-overflow-tooltip="true" align="center" prop="saleName" label="销售" min-width="85"
          fixed="left"> </el-table-column>
        <el-table-column :show-overflow-tooltip="true" align="center" prop="name" label="客户姓名" min-width="85">
          <template #default="{ row }">
            <router-link style="color: #606266;" :to="{ path: '/system/userDetail', query: { sid: row.sid } }">{{
              row.name }}</router-link>
          </template>
        </el-table-column>
        <el-table-column :show-overflow-tooltip="true" align="center" prop="memberId" label="会员ID" width="90">
        </el-table-column>

        <el-table-column :show-overflow-tooltip="true" align="center" prop="idCard" label="身份证"
          min-width="167"></el-table-column>
        <el-table-column :show-overflow-tooltip="true" align="center" prop="passport" label="护照"
          min-width="100"></el-table-column>
        <el-table-column :show-overflow-tooltip="true" align="center" prop="phone" label="手机号" min-width="115">
          <template #default="{ row }">
            <span>{{ row.phone }}</span>
          </template>
        </el-table-column>
        <el-table-column :show-overflow-tooltip="true" align="center" label="年龄" width="55">
          <template #default="{ row }">
            <span v-if="row.idCard">{{ proxy.$utils.getAge(row.idCard) }}</span>
          </template>
        </el-table-column>
        <el-table-column :show-overflow-tooltip="true" align="center" label="生日" width="65">
          <template #default="{ row }">
            <span v-if="row.idCard">{{ proxy.$utils.getBirthdayFromIdNumbers(row.idCard) }}</span>
          </template>
        </el-table-column>
        <el-table-column :show-overflow-tooltip="true" align="center" label="性别" width="60">
          <template #default="{ row }">
            <span v-if="row.idCard">{{ proxy.$utils.getGender(row.idCard) }}</span>
          </template>
        </el-table-column>
        <el-table-column :show-overflow-tooltip="true" align="center" prop="address" label="地址" width="150">

        </el-table-column>
        <el-table-column :show-overflow-tooltip="true" align="center" prop="integralUsed" label="已使用积分" min-width="100">
        </el-table-column>
        <el-table-column :show-overflow-tooltip="true" align="center" prop="integral" label="积分余额" min-width="90">
        </el-table-column>
        <el-table-column :show-overflow-tooltip="true" align="center" prop="sourceName" label="客户来源" min-width="90">
        </el-table-column>
        <el-table-column :show-overflow-tooltip="true" align="center" prop="anniversary" label="纪念日" min-width="90">
        </el-table-column>
        <el-table-column :show-overflow-tooltip="true" align="center" prop="retireUnit" label="退休单位" min-width="90">
        </el-table-column>
        <el-table-column :show-overflow-tooltip="true" align="center" prop="labelNames" label="客户标签" min-width="200">
          <template #default="{ row }">
            <el-tag size="large" style="margin: 0 3px;" v-for="item in row.labelSids">{{ item.name }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column :show-overflow-tooltip="true" align="center" prop="note" label="备注" min-width="200">

        </el-table-column>
        <el-table-column :show-overflow-tooltip="true" align="center" prop="created" label="创建时间" width="100">
          <template #default="{ row }">
            <span v-if="row.created">{{ proxy.$utils.splitDate(row.created) }}</span>
          </template>
        </el-table-column>
        <el-table-column :show-overflow-tooltip="true" align="center" label="状态" fixed="right" min-width="80">
          <template #default="{ row }">
            <el-tag :type="row.status == 0 ? '' : 'danger'">{{ row.status == 0 ? "正常" : "停用" }} </el-tag>
          </template>
        </el-table-column>
        <el-table-column :show-overflow-tooltip="true" align="center" label="操作" min-width="170" fixed="right">
          <template #default="{ row }">
            <el-button  class="theme-btn" link type="primary"
              @click="goinfo(row)">编辑</el-button>
            <el-popconfirm title="确定删除此项吗？" width="170px" confirm-button-text="确定" cancel-button-text="取消"
              @confirm="handleDelete(row)">
              <template #reference>
                <el-button  class="theme-btn" link type="primary">删除</el-button>
              </template>
            </el-popconfirm>
            <el-dropdown>
              <el-button style="margin: 2px 0 0 10px;" class="theme-btn" link type="primary">更多
                <el-icon class="el-icon--right">
                  <arrow-down />
                </el-icon>
              </el-button>
              <template #dropdown>
                <el-dropdown-menu>
                  <el-dropdown-item v-if="containsElement(permissions, 'system:customs:edit')"> <el-button
                      class="theme-btn" link type="primary"
                      @click="handleintegral(row)">修改积分</el-button></el-dropdown-item>
                  <el-dropdown-item v-if="containsElement(permissions, 'system:activityEnroll:add')"> <el-button
                      class="theme-btn" link type="primary"
                      @click="activityset(row)">活动报名</el-button></el-dropdown-item>
                  <el-dropdown-item v-if="containsElement(permissions, 'system:customs:gifts')"> <el-button
                      class="theme-btn" link type="primary" @click="gogifts(row)">礼品库</el-button></el-dropdown-item>
                  <el-dropdown-item>
                    <el-button v-if="containsElement(permissions, 'system:customs:query')" class="theme-btn" link
                      type="primary" @click="godetail(row)">客户详情</el-button></el-dropdown-item>
                  <el-dropdown-item>
                    <el-button v-if="containsElement(permissions, 'system:customFollow:query')" class="theme-btn" link
                      type="primary" @click="gocustomFollow(row)">客户跟进</el-button></el-dropdown-item>
                </el-dropdown-menu>
              </template>
            </el-dropdown>
          </template>
        </el-table-column>
      </el-table>
      <!-- <el-pagination v-model:current-page="current" v-model:page-size="size" :page-sizes="sizeNum" :total="totalNums" :pager-count="5"
        layout="total, sizes, prev, pager, next, jumper">
      </el-pagination> -->
      <el-pagination v-model:current-page="current" v-model:page-size="size" :page-sizes="sizeNum" :total="num"
        layout="sizes, prev, slot, next, jumper">
        <!-- 自定义 total 的显示内容 -->
        <!-- <div v:totals="totals">
          <span>客户数: {{ totalNums }}</span>
        </div> -->
        <!-- 自定义 total 插槽 -->
          <div class="custom-total" style="position: absolute; left: 20%; ">
            <span>客户数: {{ num }}人</span>
          </div>
        <!-- <template v-slot:pager> -->
        <div class="el-pagination" >
          <button v-for="page in displayedPages" :key="page" @click="changePage(page)"
            :class="{ 'active': currentPage === page, 'ellipsis': page === '...' }">
            {{ page }}
          </button>
        </div>
        <!-- </template> -->
        <!-- <div slot="slot">
          <div class="el-pagination">
            <button v-for="page in displayedPages" :key="page" @click="changePage(page)"
              :class="{ 'active': currentPage === page, 'ellipsis': page === '...' }">
              {{ page }}
            </button>
          </div>
        </div> -->
      </el-pagination>
    </div>
  </div>
  <div>
    <el-dialog v-model="integralVisible" title="修改积分" width="380" align-center @close="clearval()">
      <el-form :model="ruleNewsForm" label-width="120px" :rules="ruleNews" ref="ruleNewsRef"
        style="width: 100%; margin-top: 20px;">
        <div style="margin-left: 60px;">
          <span style="color: red;">扣除</span>
          <!-- <el-input  v-model.trim="ruleNewsForm.integral" clearable placeholder="请输入" /> -->
          <el-input-number v-model="ruleNewsForm.integral" placeholder="请输入" style="margin: 0 10px ;" />
          <span style="color: green;">增加</span>
        </div>
        <el-form-item>
          <div style="margin: 30px 0 0 20px">
            <el-button type="primary" size="large" @click="submitintegral()">保存</el-button>
          </div>
        </el-form-item>
      </el-form>
    </el-dialog>
    <el-dialog v-model="activityVisible" title="活动报名" width="600" align-center @close="clearval()">
      <el-form :model="ruleNewsForm" label-width="120px" :rules="ruleNews" ref="ruleNewsRef"
        style="width: 85%; margin-top: 20px;">
        <el-form-item label="活动选择" prop="note	">
          <el-select v-model="state.list.activitySid" placeholder="请选择需要参与的活动" collapse-tags clearable>
            <el-option v-for="item in class_activity" :key="item.sid" :label="item.activityName" :value="item.sid">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <div style="margin: 30px 0 0 20px">
            <el-button type="primary" size="large" @click="submitactivity()">保存</el-button>
          </div>
        </el-form-item>
      </el-form>
    </el-dialog>
    <el-dialog v-model="lineVisible" title="线路报名" width="600" align-center @close="clearval()">
      <el-form :model="ruleNewsForm" label-width="120px" :rules="ruleNews" ref="ruleNewsRef"
        style="width: 85%; margin-top: 20px;">
        <el-form-item label="线路选择" prop="note	">
          <el-select v-model="state.list.lineSid" placeholder="请选择需要参与的活动" collapse-tags clearable>
            <el-option :disabled="item.goingResidue == 0" v-for="item in class_line" :key="item.sid"
              :label="item.lineName" :value="item.sid">
              <div style="display: flex; justify-content: space-between; align-items: center;">
                <span v-if="item.lineName">线路：{{ item.lineName }}</span>
                <span style="margin-right: 10px;">余位：{{ item.goingResidue }}人</span>
              </div>
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="交通方式" prop="note	">
          <el-select v-model="state.list.trafficMode" placeholder="请选择交通方式" collapse-tags clearable>
            <el-option v-for="item in trafficMode" :key="item.value" :label="item.label" :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="付款状态" prop="note	">
          <el-select v-model="state.list.paymentStatus" placeholder="请选择付款状态" collapse-tags clearable>
            <el-option v-for="item in paymentStatus" :key="item.value" :label="item.label" :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <div style="margin: 30px 0 0 20px">
            <el-button type="primary" size="large" @click="submitline()">保存</el-button>
          </div>
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>
</template>



<script>
import { userStore } from "@store/user"
export default {
  name: "customs",
  beforeRouteEnter() {
    const store = userStore()
    store.setInclude("customs")
  }
}

</script>

<script setup>
import { getCurrentInstance, ref, reactive, computed, onMounted, watch, onActivated } from "vue"
import OneLoad from "@mixins/one-load"
// import { Delete, CirclePlus, Search } from "@element-plus/icons-vue"
import { useRouter, onBeforeRouteLeave } from "vue-router"
import moment from 'moment'
import UploadImg from "@mixins/upload-img"
import { userStore } from "@store/user"

const store = userStore()
const userinfo = JSON.parse(sessionStorage.getItem("userinfo"));
const permissions = store.permissions
// const permissions = store.state.value.user.permissions
const { proxy } = getCurrentInstance()
// const centerDialogVisible = ref(false)
const integralVisible = ref(false)
const activityVisible = ref(false)
const lineVisible = ref(false)





const value3 = ref('')
const router = useRouter()
// const textarea = ref('')
const ruleNewsRef = ref(null)
const time = ref('')
const ruleNews = reactive({
  name: [{ required: true, message: "请输入客户姓名", trigger: "blur" }],
  phone: [
    { required: true, message: "请输入手机号", trigger: "blur" },
    { pattern: /^1[3456789]\d{9}$/, message: '请输入正确的手机号', trigger: 'blur' }
  ],
  // integral: [{ required: true, message: "请输入积分余额", trigger: "blur" }],
  // saleSid: [{ required: true, message: "请输入销售员", trigger: "blur" }],
  // labelSids: [{ required: true, message: "请选择客户标签", trigger: "blur" }],
  // sourceSid: [{ required: true, message: "请选择客户来源", trigger: "blur" }],
  status: [{ required: true, message: "请选择状态", trigger: "blur" }],
  idCard: [
    { required: true, message: "请输入身份证号码", trigger: "blur" },
  ],
  passport: [
    { required: true, message: "请输入护照号", trigger: "blur" },
    { pattern: /(^[a-zA-Z0-9]{9}$)/, message: '请输入正确的护照号', trigger: 'blur' },
  ]
})
const idNumberError = ref('');
const age = ref('');
const validateIDNumber = (rule, value, callback) => {
  const idRegex = /^[1-9]\d{5}[1-9]\d{3}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])\d{3}([0-9]|X)$/;
  if (!idRegex.test(ruleNewsForm.idCard)) {
    // idNumberError.value = '请输入正确的身份证号码';
    callback(new Error('请输入正确的身份证号码'));
    return;
  }
  const birthday = ruleNewsForm.idCard.substr(6, 8);
  console.log(birthday, 'birthday')
  const year = birthday.substr(0, 4);
  const month = birthday.substr(4, 2);
  const day = birthday.substr(6, 2);
  const birthDate = new Date(year, month - 1, day);
  age.value = calculateAge(birthDate);
  if (age.value > 60) {
    idNumberError.value = '超龄提醒:60岁以上,身体好的情况下可以添加';
    // callback(new Error('年龄超过60'));
  } else {
    idNumberError.value = '';
  }
  return true
};

const calculateAge = (birthDate) => {
  const today = new Date();
  let age = today.getFullYear() - birthDate.getFullYear();
  const monthDiff = today.getMonth() - birthDate.getMonth();
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
    age--;
  }
  return age;
};


function hasAdminOrOperator(array, num) {
  if (num == 1) {
    return array.includes("admin") || array.includes("system") || array.includes("director")
  } else {
    return array.includes("admin") || array.includes("system") || array.includes("director") || array.includes("manager")
  }
}


let trafficMode = [
  {
    value: 1,
    label: '飞机'
  },
  {
    value: 2,
    label: '火车/高铁'
  },
  {
    value: 3,
    label: '大巴'
  }, {
    value: 10,
    label: '其他'
  }
]
let paymentStatus = [
  {
    value: 1,
    label: '全款'
  },
  {
    value: 2,
    label: '定金'
  },
  {
    value: 0,
    label: '未交'
  }
]

const state = reactive({
  queryForm: {
    name: null,
    phone: null,
    idCard: null,
    saleSid: [],
    labelSids: [],
    sourceSid: [],
    startDate: null,
    endDate: null,
    orgSid: []
  },
  list: {
    sid: '',
    activitySid: '',
    lineSid: '',
    paymentStatus: null,
    trafficMode: null
  },
  form: {
    type: '0'
  }
})
const saleSid = ref([])
const labelSids = ref([])
const orgSid = ref([])

const sourceSid = ref([])
const value1 = ref([])
const handleSearch = () => {
  // console.log(value1.value, 'labelSids.value')
  if (value1.value) {
    const dates = value1.value.map(dateString => moment(dateString, 'ddd MMM DD YYYY HH:mm:ss [GMT]Z (z)').format('YYYY-MM-DD HH:mm:ss'));
    state.queryForm.startDate = dates[0]
    state.queryForm.endDate = dates[1]
  } else {
    state.queryForm.startDate = null
    state.queryForm.endDate = null
  }
  if (saleSid.value) {
    state.queryForm.saleSid = saleSid.value[0]
  } else {
    saleSid.value = []
    state.queryForm.saleSid = null
  }
  if (sourceSid.value) {
    state.queryForm.sourceSid = sourceSid.value[0]
  } else {
    sourceSid.value = []
    state.queryForm.sourceSid = null
  }
  state.queryForm.labelSids = labelSids.value + ''
  // state.queryForm.sourceSid = sourceSid.value[0],
  if (orgSid.value) {
    state.queryForm.orgSid = orgSid.value[orgSid.value.length - 1]
  } else {
    state.queryForm.orgSid = null
  }
  // state.queryForm.orgSid=orgSid.value[orgSid.value.length-1]
  console.log(orgSid.value, 'state.queryForm')
  search_btn.value = true
  pubRefreshParams(getList)

}



const ruleNewsForm = reactive({
  name: '',
  note: "",
  phone: "",
  integral: 0,
  saleSid: [],
  labelSids: [],
  sourceSid: [],
  sid: null,
  status: 0,
  passport: "",
  memberId: null,
  address: ""
})

function containsElement(arr, element) {

  if (userinfo.admin) {
    return true
  }
  for (var i = 0; i < arr.length; i++) {
    if (arr[i] === element) {
      return true;
    }
  }
  return false;
}


// 表单重置
const reset = () => {
  ruleNewsForm.note = undefined,
    ruleNewsForm.name = '',
    ruleNewsForm.status = 0,
    ruleNewsForm.sid = null,
    ruleNewsForm.labelSids = [],
    ruleNewsForm.sourceSid = [],
    ruleNewsForm.saleSid = [],
    ruleNewsForm.idCard = '',
    ruleNewsForm.phone = '',
    ruleNewsForm.integral = 0,
    ruleNewsForm.passport = '',
    ruleNewsForm.memberId = null,
    ruleNewsForm.address = ''
  state.list.lineSid = '',
    state.list.trafficMode = '',
    state.list.paymentStatus = '',
    state.list.activitySid = '',
    state.list.status = ''
  fileList.value = []
}



// 获取客户标签
// 配置级联选择参数
const props = ref({
  multiple: true,
  value: "sid",
  label: "labelName",
  // children: "children",
})

const class_options = ref([])
function getorg() {
  // console.log(num, 'id')
  proxy.$axios
    .get("/v1/sys-label")
    .then((res) => {
      if (res.data.code == 200) {
        // console.log(res.data, 'role')
        // class_options.value = res.data.data
        class_options.value = res.data.data.filter(item => item.status === 0);
        // console.log(res.data, 'res.data.data.records')
      } else {
        if (res.data.code != 403) {
          proxy.$message({ message: res.data.msg, type: "error" })
        }
      }
    })
    .catch((err) => { })
}

// 获取客户来源
// 配置级联选择参数
const props1 = ref({
  // multiple: true,
  value: "sid",
  label: "sourceName",
  // children: "children",
})

const class_options1 = ref([])
function getorg1() {
  // console.log(num, 'id')
  proxy.$axios
    .get("/v1/sys-source")
    .then((res) => {
      if (res.data.code == 200) {
        // console.log(res.data, 'role')

        class_options1.value = res.data.data.filter(item => item.status === 0);
        // console.log(res.data, '.records')
      } else {
        if (res.data.code != 403) {
          proxy.$message({ message: res.data.msg, type: "error" })
        }
      }
    })
    .catch((err) => { })
}

// 获取销售负责人
// 配置级联选择参数
const props2 = ref({
  // multiple: true,
  value: "sid",
  label: "nickName",
  // children: "children",
})

const class_options2 = ref([])
function getorg2() {
  // console.log(num, 'id')
  proxy.$axios
    .get("/v1/users/salesList")
    .then((res) => {
      if (res.data.code == 200) {
        // console.log(res.data, 'role')
        class_options2.value = res.data.data

        // console.log(res.data, 'res.data.data.records')
      } else {
        if (res.data.code != 403) {
          proxy.$message({ message: res.data.msg, type: "error" })
        }
      }
    })
    .catch((err) => { })
}


// 文件下载
const downloadFile = () => {
  const fileUrl = proxy.imgUrl + '/public/20240521/fd6cc80ee283416782719bb0fb079961.xlsx'; // 文件的下载地址
  const fileName = '客户模版.xlsx'; // 文件的名称
  // 创建一个<a>标签
  const a = document.createElement('a');
  // 设置<a>标签的href属性为文件的下载地址
  a.href = fileUrl;
  // 设置<a>标签的download属性为文件的名称
  a.download = fileName;
  // 将<a>标签添加到文档中
  document.body.appendChild(a);
  // 模拟点击<a>标签来触发下载
  a.click();
  // 下载完成后移除<a>标签
  document.body.removeChild(a);
}

// 配置级联选择参数
const props3 = ref({
  // multiple: true,
  value: "sid",
  label: "orgName",
  checkStrictly: true,
  children: "children",
})
const class_options3 = ref([])
function getorg3() {
  // console.log(num, 'id')
  proxy.$axios
    .get("/v1/sys-orgs/treeSelect")
    .then((res) => {
      if (res.data.code == 200) {
        // console.log(res.data, 'role')
        class_options3.value = res.data.data

        // console.log(res.data, 'res.data.data.records')
      } else {
        if (res.data.code != 403) {
          proxy.$message({ message: res.data.msg, type: "error" })
        }
      }
    })
    .catch((err) => { })
}



const class_activity = ref([])
function getactivity() {
  // console.log(num, 'id')
  proxy.$axios
    .get("/v1/sys-activity/list")
    .then((res) => {
      if (res.data.code == 200) {
        // console.log(res.data, 'role')
        // class_activity.value = res.data.data
        class_activity.value = res.data.data.filter(item => item.status === 0);
        // console.log(res.data, 'res.data.data.records')
      } else {
        if (res.data.code != 403) {
          proxy.$message({ message: res.data.msg, type: "error" })
        }
      }
    })
    .catch((err) => { })
}

// console.log(1111111)
// 配置级联选择参数
onActivated(() => {
  // console.log(store.includeList, '激活')
  pubParams(getList)
  getorg()
  getorg1()
  getorg2()
  getorg3()
})

// // 离开-可以利用这个触发删除页面缓存操作
onBeforeRouteLeave((to, from, next) => {
  // console.log(to,'from.name')
  if (to.name !== "userinfo") {
    store.delInclude("customs")
  }
  next()
})

onMounted(() => {
  // console.log(store.includeList, '初次')
  // getList();
  // pubParams(getList)
  // getorg()
  // getorg1()  
  // getorg2()
  // getorg3()
  // console.log(totalPages.value,'totalPages')
  // console.log(totalNums.value,'totalNums')
})

const totalPages = computed(() => Math.ceil(num.value / size.value));
// 计算显示的页码范围
const displayedPages = computed(() => {
  const range = 5; // 显示当前页前后五页
  const start = Math.max(1, current.value - range);
  const end = Math.min(totalPages.value, current.value + range);
  const ends = Math.min(99, current.value + range);

  let pages = [];
  if (totalPages.value < 100) {
    for (let i = start; i <= end; i++) {
      pages.push(i);
    }
  } else {
    for (let i = start; i <= ends; i++) {
      pages.push(i);
    }
    pages.push('100+');
  }

  return pages;
});

// 切换页码
const changePage = (page) => {
  current.value = page;
  // 可在这里添加获取数据的逻辑，根据新的 currentPage 请求数据
};


const { current, sizeNum, size, loading, arr_data, totalNums,num, search_text, search_btn, pubParams, pubRefreshParams, getdata } = OneLoad()

// 切换每页显示条数
watch(size, (val) => {
  console.log(val, '切换')
  current.value = 1
  size.value = val
  pubParams(getList)
})
// 跳转第几页
watch(current, (val) => {
  if (val == "100+") {
    current.value = 100
  } else {
    current.value = val
  }
  console.log(val, '跳转')
  pubParams(getList)
})


function getList() {
  let params = {
    current: current.value,
    size: size.value,
    ...state.queryForm
  }
  getdata("/v1/sys-customs", params).then(() => {
    console.log(totalNums.value, '0000000000000')
  })
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
  // console.log(arrs, 'arrs')
  postDel(arrs)
}
// 删除接口
function postDel(params) {
  console.log(params, 'params')
  proxy.$axios
    .put("/v1/sys-customs/delete", {
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
  type.value = 1
  router.push({
    path: '/system/userinfo',

  })
  // centerDialogVisible.value = true
}
const type = ref('')
// 编辑


// 修改积分
const handleintegral = (row) => {
  ruleNewsForm.sid = row.sid
  integralVisible.value = true
}

const submitintegral = () => {
  proxy.$axios
    .put(`/v1/sys-customs/edit-integral/${ruleNewsForm.sid}/${ruleNewsForm.integral}`)
    .then((res) => {
      if (res.data.code == 200) {
        proxy.$message({ message: '修改成功', type: "success" })
        integralVisible.value = false
        pubParams(getList)
      } else {
        if (res.data.code != 403) {
          proxy.$message({ message: res.data.msg, type: "error" })
        }
      }
    })
    .catch((err) => { })
}

const submitactivity = () => {
  let data = {
    activitySid: state.list.activitySid,
    customSid: state.list.sid
  }
  proxy.$axios
    .post("/v1/sys-activity-enroll", data)
    .then((res) => {
      if (res.data.code == 200) {
        proxy.$message({ message: '报名成功', type: "success" })
        activityVisible.value = false
        state.list.sid = null
        state.list.activitySid = ''
        pubParams(getList)
      } else {
        if (res.data.code != 403) {
          proxy.$message({ message: res.data.msg, type: "error" })
        }
      }
    })
    .catch((err) => { })
}

const submitline = () => {
  let data = {
    customSid: state.list.sid,
    paymentStatus: state.list.paymentStatus,
    lineSid: state.list.lineSid,
    trafficMode: state.list.trafficMode
  }
  proxy.$axios
    .post("/v1/sys-line-enroll", data)
    .then((res) => {
      if (res.data.code == 200) {
        proxy.$message({ message: '报名成功', type: "success" })
        lineVisible.value = false
        state.list.sid = null
        state.list.lineSid = ''
        state.list.paymentStatus = null
        state.list.trafficMode = null
        pubParams(getList)
      } else {
        if (res.data.code != 403) {
          proxy.$message({ message: res.data.msg, type: "error" })
        }
      }
    })
    .catch((err) => { })
}



const clearval = () => {
  reset()
}


const activityset = (row) => {
  state.list.sid = row.sid
  getactivity()
  activityVisible.value = true
}



const godetail = (row) => {
  // console.log(row, 'row')
  router.push({
    path: '/system/userDetail',
    query: {
      sid: row.sid
    }
  })
  // /system/giftsDetail
}



const gogifts = (row) => {
  // console.log(row, 'row')
  router.push({
    path: '/system/giftsDetail',
    query: {
      sid: row.sid
    }
  })
  // /system/giftsDetail
}

const gocustomFollow = (row) => {
  // console.log(row, 'row')
  router.push({
    path: '/system/customFollow',
    query: {
      sid: row.sid
    }
  })
  // /system/giftsDetail
}




const goinfo = (row) => {
  // console.log(row, 'row')
  router.push({
    path: '/system/userinfo',
    query: {
      sid: row.sid
    }
  })
  // /system/giftsDetail
}


// 文件上传
const uploadRef = ref(null)
const { succList, imgLoading, imgVisible, dialogImageUrl, handlePreview, actionImgUrl, handleRemove, uploadImg, fileChange } = UploadImg()
const fileList = ref([])
const limit = ref(1)
// 上传-单张的上传
function uploadImgs() {
  // console.log(fileList.value, 'fileList.value')
  imgLoading.value = true
  let data = new FormData()
  // data.append("file", fromImg.value)
  data.append("file", fileList.value[0].raw)
  proxy.$axios.post("/v1/sys-customs/importCustoms", data).then((res) => {
    fileList.value = []
    imgLoading.value = false
    if (res.data.code == 200) {
      proxy.$message({ message: '上传成功', type: "success" })
      pubParams(getList)
      fileList.value = []
    } else {
      if (res.data.code != 403) {
        proxy.$message({ message: res.data.msg, type: "error" })
      }
    }
  }).catch(err => {
    imgLoading.value = false
  })
}

// 上传之前的判断
function beforeAvatarUpload(file) {

}


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

.example-showcase .el-dropdown-link {
  cursor: pointer;
  color: var(--el-color-primary);
  display: flex;
  align-items: center;
}
</style>
