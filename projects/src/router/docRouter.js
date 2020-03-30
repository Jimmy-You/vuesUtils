// 模板组件 Start

// Views
const Dashboard = () => import('@/templateView/Dashboard')

const Colors = () => import('@/templateView/theme/Colors')
const Typography = () => import('@/templateView/theme/Typography')

// const Charts = () => import('@/templateView/charts/Charts')
const Widgets = () => import('@/templateView/widgets/Widgets')

// templateView - Components
const Cards = () => import('@/templateView/base/Cards')
const Forms = () => import('@/templateView/base/Forms')
const Switches = () => import('@/templateView/base/Switches')
const Tables = () => import('@/templateView/base/Tables')
const Tabs = () => import('@/templateView/base/Tabs')
const Breadcrumbs = () => import('@/templateView/base/Breadcrumbs')
const Carousels = () => import('@/templateView/base/Carousels')
const Collapses = () => import('@/templateView/base/Collapses')
const Jumbotrons = () => import('@/templateView/base/Jumbotrons')
const ListGroups = () => import('@/templateView/base/ListGroups')
const Navs = () => import('@/templateView/base/Navs')
const Navbars = () => import('@/templateView/base/Navbars')
const Paginations = () => import('@/templateView/base/Paginations')
const Popovers = () => import('@/templateView/base/Popovers')
const ProgressBars = () => import('@/templateView/base/ProgressBars')
const Tooltips = () => import('@/templateView/base/Tooltips')

// templateView - Buttons
const StandardButtons = () => import('@/templateView/buttons/StandardButtons')
const ButtonGroups = () => import('@/templateView/buttons/ButtonGroups')
const Dropdowns = () => import('@/templateView/buttons/Dropdowns')
const BrandButtons = () => import('@/templateView/buttons/BrandButtons')

// templateView - Icons
const CoreUIIcons = () => import('@/templateView/icons/CoreUIIcons')
const Brands = () => import('@/templateView/icons/Brands')
const Flags = () => import('@/templateView/icons/Flags')

// templateView - Notifications
const Alerts = () => import('@/templateView/notifications/Alerts')
const Badges = () => import('@/templateView/notifications/Badges')
const Modals = () => import('@/templateView/notifications/Modals')


// Users
const Users = () => import('@/templateView/users/Users')
const User = () => import('@/templateView/users/User')
// 模板组件 End

module.exports = [
  {
    path: 'dashboard',
    name: 'Dashboard',
    component: Dashboard
  },
  {
    path: 'theme',
    redirect: '/theme/colors',
    name: 'Theme',
    component: {
      render (c) { return c('router-view') }
    },
    children: [
      {
        path: 'colors',
        name: 'Colors',
        component: Colors
      },
      {
        path: 'typography',
        name: 'Typography',
        component: Typography
      }
    ]
  },
  
  {
    path: 'widgets',
    name: 'Widgets',
    component: Widgets
  },
  {
    path: 'users',
    meta: { label: 'Users'},
    component: {
      render (c) { return c('router-view') }
    },
    children: [
      {
        path: '',
        component: Users,
      },
      {
        path: ':id',
        meta: { label: 'User Details'},
        name: 'User',
        component: User,
      },
    ]
  },
  {
    path: 'base',
    redirect: '/base/cards',
    name: 'Base',
    component: {
      render (c) { return c('router-view') }
    },
    children: [
      {
        path: 'cards',
        name: 'Cards',
        component: Cards
      },
      {
        path: 'forms',
        name: 'Forms',
        component: Forms
      },
      {
        path: 'switches',
        name: 'Switches',
        component: Switches
      },
      {
        path: 'tables',
        name: 'Tables',
        component: Tables
      },
      {
        path: 'tabs',
        name: 'Tabs',
        component: Tabs
      },
      {
        path: 'breadcrumbs',
        name: 'Breadcrumbs',
        component: Breadcrumbs
      },
      {
        path: 'carousels',
        name: 'Carousels',
        component: Carousels
      },
      {
        path: 'collapses',
        name: 'Collapses',
        component: Collapses
      },
      {
        path: 'jumbotrons',
        name: 'Jumbotrons',
        component: Jumbotrons
      },
      {
        path: 'list-groups',
        name: 'List Groups',
        component: ListGroups
      },
      {
        path: 'navs',
        name: 'Navs',
        component: Navs
      },
      {
        path: 'navbars',
        name: 'Navbars',
        component: Navbars
      },
      {
        path: 'paginations',
        name: 'Paginations',
        component: Paginations
      },
      {
        path: 'popovers',
        name: 'Popovers',
        component: Popovers
      },
      {
        path: 'progress-bars',
        name: 'Progress Bars',
        component: ProgressBars
      },
      {
        path: 'tooltips',
        name: 'Tooltips',
        component: Tooltips
      }
    ]
  },
  {
    path: 'buttons',
    redirect: '/buttons/standard-buttons',
    name: 'Buttons',
    component: {
      render (c) { return c('router-view') }
    },
    children: [
      {
        path: 'standard-buttons',
        name: 'Standard Buttons',
        component: StandardButtons
      },
      {
        path: 'button-groups',
        name: 'Button Groups',
        component: ButtonGroups
      },
      {
        path: 'dropdowns',
        name: 'Dropdowns',
        component: Dropdowns
      },
      {
        path: 'brand-buttons',
        name: 'Brand Buttons',
        component: BrandButtons
      }
    ]
  },
  {
    path: 'icons',
    redirect: '/icons/coreui-icons',
    name: 'CoreUI Icons',
    component: {
      render (c) { return c('router-view') }
    },
    children: [
      {
        path: 'coreui-icons',
        name: 'Icons library',
        component: CoreUIIcons
      },
      {
        path: 'brands',
        name: 'Brands',
        component: Brands
      },
      {
        path: 'flags',
        name: 'Flags',
        component: Flags
      }
    ]
  },
  {
    path: 'notifications',
    redirect: '/notifications/alerts',
    name: 'Notifications',
    component: {
      render (c) { return c('router-view') }
    },
    children: [
      {
        path: 'alerts',
        name: 'Alerts',
        component: Alerts
      },
      {
        path: 'badges',
        name: 'Badges',
        component: Badges
      },
      {
        path: 'modals',
        name: 'Modals',
        component: Modals
      }
    ]
  }
]