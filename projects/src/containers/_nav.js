// 用于生成侧边栏的js配置文件
const flag = process.env.NODE_ENV == "production";
//
const menus = [
  {
    _name: "CSidebarNavItem",
    name: "首页",
    to: "/adminHome",
    fontIcon: "iconfont icon-home"
  },
  // {
  //   _name: 'CSidebarNavDropdown',
  //   name: '我的数据',
  //   route: '/data',
  //   fontIcon: 'iconfont icon-data',
  //   items: [
  //     {
  //       name: '栅格数据',
  //       to: '/data/GridData',
  //     },
  //     {
  //       name: '矢量数据',
  //       to: '/data/VectorData',
  //     },
  //     {
  //       name: 'DEM数据',
  //       to: '/data/demData',
  //     },
  //     {
  //       name: '三维数据',
  //       to: '/data/thirdDData',
  //     },
  //   ]
  // },
  {
    _name: "CSidebarNavItem",
    name: "数据目录",
    to: "/dataList",
    fontIcon: "iconfont icon-data"
  },
  {
    _name: "CSidebarNavItem",
    name: "数据查询",
    to: "/dataQuery",
    fontIcon: "iconfont icon-search"
  },
  {
    _name: "CSidebarNavItem",
    name: "任务监控",
    to: "/taskManage",
    fontIcon: "iconfont icon-monitor2"
  },
  {
    _name: "CSidebarNavItem",
    name: "离线归档",
    to: "/offlineArchive",
    fontIcon: "iconfont icon-search"
  },
  {
    _name: "CSidebarNavItem",
    name: "关于我们",
    to: "/aboutVersion",
    fontIcon: "iconfont icon-team"
  },
  {
    _name: "CSidebarNavItem",
    name: "技术支持",
    to: "/TehSupport",
    fontIcon: "iconfont icon-phone"
  }
];

const docMenus = [
  {
    _name: "CSidebarNavItem",
    name: "Dashboard",
    to: "/dashboard",
    icon: "cil-speedometer",
    badge: {
      color: "primary",
      text: "NEW"
    }
  },
  {
    _name: "CSidebarNavTitle",
    _children: ["Theme"]
  },
  {
    _name: "CSidebarNavItem",
    name: "Colors",
    to: "/theme/colors",
    icon: "cil-drop"
  },
  {
    _name: "CSidebarNavItem",
    name: "Typography",
    to: "/theme/typography",
    icon: "cil-pencil"
  },
  {
    _name: "CSidebarNavTitle",
    _children: ["Components"]
  },
  {
    _name: "CSidebarNavDropdown",
    name: "Base",
    route: "/base",
    icon: "cil-puzzle",
    items: [
      {
        name: "Breadcrumbs",
        to: "/base/breadcrumbs",
        icon: "cil-puzzle"
      },
      {
        name: "Cards",
        to: "/base/cards",
        icon: "cil-puzzle"
      },
      {
        name: "Carousels",
        to: "/base/carousels",
        icon: "cil-puzzle"
      },
      {
        name: "Collapses",
        to: "/base/collapses",
        icon: "cil-puzzle"
      },
      {
        name: "Forms",
        to: "/base/forms",
        icon: "cil-puzzle"
      },
      {
        name: "Jumbotrons",
        to: "/base/jumbotrons",
        icon: "cil-puzzle"
      },
      {
        name: "List Groups",
        to: "/base/list-groups",
        icon: "cil-puzzle"
      },
      {
        name: "Navs",
        to: "/base/navs",
        icon: "cil-puzzle"
      },
      {
        name: "Navbars",
        to: "/base/navbars",
        icon: "cil-puzzle"
      },
      {
        name: "Paginations",
        to: "/base/paginations",
        icon: "cil-puzzle"
      },
      {
        name: "Popovers",
        to: "/base/popovers",
        icon: "cil-puzzle"
      },
      {
        name: "Progress Bars",
        to: "/base/progress-bars",
        icon: "cil-puzzle"
      },
      {
        name: "Switches",
        to: "/base/switches",
        icon: "cil-puzzle"
      },
      {
        name: "Tables",
        to: "/base/tables",
        icon: "cil-puzzle"
      },
      {
        name: "Tabs",
        to: "/base/tabs",
        icon: "cil-puzzle"
      },
      {
        name: "Tooltips",
        to: "/base/tooltips",
        icon: "cil-puzzle"
      }
    ]
  },
  {
    _name: "CSidebarNavDropdown",
    name: "Buttons",
    route: "/buttons",
    icon: "cil-cursor",
    items: [
      {
        name: "Buttons",
        to: "/buttons/standard-buttons",
        icon: "cil-cursor"
      },
      {
        name: "Button Dropdowns",
        to: "/buttons/dropdowns",
        icon: "cil-cursor"
      },
      {
        name: "Button Groups",
        to: "/buttons/button-groups",
        icon: "cil-cursor"
      },
      {
        name: "Brand Buttons",
        to: "/buttons/brand-buttons",
        icon: "cil-cursor"
      }
    ]
  },
  {
    _name: "CSidebarNavItem",
    name: "Charts",
    to: "/charts",
    icon: "cil-chart-pie"
  },
  {
    _name: "CSidebarNavDropdown",
    name: "Icons",
    route: "/icons",
    icon: "cil-star",
    items: [
      {
        name: "CoreUI Icons",
        to: "/icons/coreui-icons",
        icon: "cil-star",
        badge: {
          color: "info",
          text: "NEW"
        }
      },
      {
        name: "Brands",
        to: "/icons/brands",
        icon: "cil-star"
      },
      {
        name: "Flags",
        to: "/icons/flags",
        icon: "cil-star"
      }
    ]
  },
  {
    _name: "CSidebarNavDropdown",
    name: "Notifications",
    route: "/notifications",
    icon: "cil-bell",
    items: [
      {
        name: "Alerts",
        to: "/notifications/alerts",
        icon: "cil-bell"
      },
      {
        name: "Badges",
        to: "/notifications/badges",
        icon: "cil-bell"
      },
      {
        name: "Modals",
        to: "/notifications/modals",
        icon: "cil-bell"
      }
    ]
  },
  {
    _name: "CSidebarNavItem",
    name: "Widgets",
    to: "/widgets",
    icon: "cil-calculator",
    badge: {
      color: "primary",
      text: "NEW",
      shape: "pill"
    }
  },
  {
    _name: "CSidebarNavDivider",
    _class: "m-2"
  },
  {
    _name: "CSidebarNavTitle",
    _children: ["Extras"]
  },
  {
    _name: "CSidebarNavDropdown",
    name: "Pages",
    route: "/pages",
    icon: "cil-star",
    items: [
      {
        name: "Login",
        to: "/pages/login",
        icon: "cil-star"
      },
      {
        name: "Register",
        to: "/pages/register",
        icon: "cil-star"
      },
      {
        name: "Error 404",
        to: "/pages/404",
        icon: "cil-star"
      },
      {
        name: "Error 500",
        to: "/pages/500",
        icon: "cil-star"
      }
    ]
  }
];

// coreUI 提供的menu
const Menus = [
  {
    _name: "CSidebarNav",
    _children: flag ? menus : menus.concat(docMenus)
  }
];

export default Menus;
