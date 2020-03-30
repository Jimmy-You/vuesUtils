// 组件 Start

const adminHome = () => import("@/views/adminHome");
const aboutVersion = () => import("@/views/aboutVersion");
const TehSupport = () => import("@/views/TehSupport");
const dataList = () => import("@/views/dataList");
const dataQuery = () => import("@/views/dataQuery");
const taskManage = () => import("@/views/taskManage");
const offlineArchive = () => import("@/views/offlineArchive");

// 组件 End

export default [
  {
    path: "adminHome",
    name: "adminHome",
    component: adminHome
  },
  {
    path: "dataList",
    name: "dataList",
    component: dataList
  },
  {
    path: "aboutVersion",
    name: "aboutVersion",
    component: aboutVersion
  },
  {
    path: "TehSupport",
    name: "TehSupport",
    component: TehSupport
  },
  {
    path: "dataQuery",
    name: "dataQuery",
    component: dataQuery
  },
  {
    path: "taskManage",
    name: "taskManage",
    component: taskManage
  },
  {
    path: "offlineArchive",
    name: "offlineArchive",
    component: offlineArchive
  }
];
