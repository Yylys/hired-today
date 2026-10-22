// createWebHashHistory 是hash模式就是访问链接带有#
// createWebHistory  是history模式
import { createRouter, createWebHashHistory, createWebHistory } from "vue-router"

const routes = [
    {
        path: "/",
        name: "Login",
        meta: {
            title: "登录",
        },
        component: () => import("../views/Login.vue"),
    },
    {
        path: "/Home",
        name: "Home",
        meta: {
            title: "控制台",
        },
        component: () => import("../views/Home.vue"),
    },

    {
        path: "/ChangePass",
        name: "ChangePass",
        meta: {
            title: "修改密码",
        },
        component: () => import("../views/ChangePass.vue"),
    },
    {
        path: "/system/role",
        name: "system",
        meta: {
            title: " 角色管理 ",
        },
        component: () => import("../views/System/role/Role.vue"),
    },
    {
        path: "/system/dept",
        name: "dept",
        meta: {
            title: " 组织管理 ",
        },
        component: () => import("../views/System/dept/dept.vue"),
    },
    {
        path: "/system/menu",
        name: "menu",
        meta: {
            title: "菜单管理",
        },
        component: () => import("../views/System/menu/menu.vue"),
    },
    {
        path: "/system/user",
        name: "Role",
        meta: {
            title: " 用户管理 ",
        },
        component: () => import("../views/System/admin/Admin.vue"),
    },
    {
        path: "/system/loginLog",
        name: "loginLog",
        meta: {
            title: " 登录日志 ",
        },
        component: () => import("../views/System/log/loginLog.vue"),
    },
    {
        path: "/system/candidate",
        name: "candidate",
        meta: {
            title: "求职者管理",
        },
        component: () => import("../views/System/coustom/candidate.vue"),
    },
    {
        path: "/system/candidateList",
        name: "candidateList",
        meta: {
            title: "人才库",
            showBread: true,
        },
        component: () => import("../views/System/coustom/candidateList.vue"),
    },
    {
        path: "/system/employer",
        name: "employer",
        meta: {
            title: "企业管理",
        },
        component: () => import("../views/System/coustom/employer.vue"),
    },

    {
        path: "/system/recruiter",
        name: "recruiter",
        meta: {
            title: "猎头管理",
        },
        component: () => import("../views/System/coustom/recruiter.vue"),
    },


    {
        path: "/system/Jobmember",
        name: "Jobmember",
        meta: {
            title: "求职者会员",
        },
        component: () => import("../views/member/Jobmember.vue"),
    },
    {
        path: "/system/CorporateMembers",
        name: "CorporateMembers",
        meta: {
            title: "企业会员",
        },
        component: () => import("../views/member/CorporateMembers.vue"),
    },
    {
        path: "/system/Headhuntermember",
        name: "Headhuntermember",
        meta: {
            title: "猎头会员",
        },
        component: () => import("../views/member/Headhuntermember.vue"),
    },

    {
        path: "/system/employerList",
        name: "employerList",
        meta: {
            title: "岗位列表",
            showBread: true,
        },
        component: () => import("../views/System/coustom/employerList.vue"),
    },

    {
        path: "/system/Addemployer",
        name: "Addemployer",
        meta: {
            title: "代发岗位",
            showBread: true,
        },
        component: () => import("../views/System/coustom/Addemployer.vue"),
    },
    {
        path: "/system/operationLog",
        name: "operationLog",
        meta: {
            title: "操作日志",
        },
        component: () => import("../views/System/log/operationLog.vue"),
    },
    {
        path: "/system/country",
        name: "country",
        meta: {
            title: "国家管理",
        },
        component: () => import("../views/System/coustom/country.vue"),
    },
    {
        path: "/system/DeliveryRecord",
        name: "DeliveryRecord",
        meta: {
            title: "投递记录",
        },
        component: () => import("../views/record/DeliveryRecord.vue"),
    },
    {
        path: "/system/bill",
        name: "bill",
        meta: {
            title: "账单记录",
        },
        component: () => import("../views/record/bill.vue"),
    },

    {
        path: "/system/Interview",
        name: "InterviewRecord",
        meta: {
            title: "投递记录",
        },
        component: () => import("../views/record/InterviewRecord.vue"),
    },

    {
        path: "/system/message",
        name: "Message",
        meta: {
            title: "消息通知",
        },
        component: () => import("../views/message/message.vue"),
    },

    {
        path: "/system/complaint",
        name: "complaint",
        meta: {
            title: "投诉反馈",
        },
        component: () => import("../views/System/complaint/complaint.vue"),
    },// 字典管理
    {
        path: "/system/dict",
        name: "DictList",
        meta: {
            title: "字典管理",
        },
        component: () => import("../views/System/Dict/DictList.vue"),
    },
    // 字典成员管理
    {
        path: "/system/DictMemberList/",
        name: "DictMemberList",
        meta: {
            title: "字典成员管理",
            showBread: true,
        },
        component: () => import("../views/System/DictMember/DictMemberList.vue"),
    },
    {
        path: "/system/activity",
        name: "activity",
        meta: {
            title: "活动管理",
        },
        component: () => import("../views/System/activity/activity.vue"),
    },
    {
        path: "/approval/approval",
        name: "approval",
        meta: {
            title: "审核列表",
        },
        component: () => import("../views/approval/approval.vue"),
    },
    {
        path: "/system/activitydetail",
        name: "activitydetail",
        meta: {
            title: "活动报名详情",
            showBread: true,
        },
        component: () => import("../views/System/activity/activitydetail.vue"),
    },
    // activitydetail
    {
        path: "/system/candidateDetail",
        name: "candidateDetail",
        meta: {
            title: "求职者详情",
            showBread: true,
        },
        component: () => import("../views/System/coustom/candidateDetail.vue"),
    },
    {
        path: "/system/employerDetail",
        name: "employerDetail",
        meta: {
            title: "岗位详情",
            showBread: true,
        },
        component: () => import("../views/System/coustom/employerDetail.vue"),
    },
    {
        path: "/system/Management",
        name: "Management",
        meta: {
            title: "协议管理",
        },
        component: () => import("../views/System/Management/Management.vue"),
    },
    {
        path: "/system/guide",
        name: "guide",
        meta: {
            title: "引导页管理",
        },
        component: () => import("../views/System/guide/guide.vue"),
    },
    {
        path: "/cs",
        name: "cs",
        meta: {
            title: "测试",
        },
        component: () => import("../views/cs.vue"),
    },

    {
        path: "/Page403",
        name: "Page403",
        meta: {
            title: "页面403",
        },
        component: () => import("../views/Page403.vue"),
    },

    {
        path: "/:pathMatch(.*)*", // 代替vue2的通配符path: "*",
        name: "Page404",
        meta: {
            title: "页面404",
        },
        component: () => import("../views/Page404.vue"),
    },
]

const router = createRouter({
    history: createWebHashHistory(),
    routes,
})

// 路由拦截
router.beforeEach((to, from) => {
    var token = sessionStorage.getItem("token")
    if (to.name != 'Login') {
        if (!token) {
            //将用户重定向到登录页面
            // console.log(2222)
            return { name: 'Login', replace: true }
        }
    }
    if (to.meta.title) {
        document.title = to.meta.title + ''
    }
    // next()
})

export default router
