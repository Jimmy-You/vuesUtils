const isProduction = process.env.NODE_ENV == 'production'
import Vue from 'vue'
import Router from 'vue-router'
import proRouterArr from './productRouter'
let docRouterArr
// docRouterArr = require('./docRouter'); // 开发环境需要文档时打开此项 生产环境关闭此项可以减小打包体积
// 布局组件
const TheContainer = () => import('@/containers/TheContainer')
// 公用页面
const Page404 = () => import('@/views/errorPages/Page404.vue')
const Page500 = () => import('@/templateView/pages/Page500')
const Login = () => import('@/views/login')
const Register = () => import('@/templateView/pages/Register')
const dataPreview = () => import('@/views/mapMainPreview');
const dataSetPreview = () => import("@/views/dataSetPreview");

Vue.use(Router)

// coreUi提供的路由
const docRouter = docRouterArr ? docRouterArr : []

// 生产环境不需要文档router 包含layout的页面路由
const childrenRouter = isProduction ? proRouterArr : docRouter.concat(proRouterArr)

// 整合路由 组件  +  异常页面
function configRoutes() {
	return [
		{
			path: '/',
			redirect: isProduction ? '/adminHome' : '/adminHome',
			name: 'Home',
			component: TheContainer,
			children: childrenRouter
		},
		{
			path: '/pages',
			redirect: '/pages/404',
			name: 'Pages',
			component: {
				render(c) {
					return c('router-view')
				}
			},
			children: [
				{
					path: '404',
					name: 'Page404',
					component: Page404
				},
				{
					path: '500',
					name: 'Page500',
					component: Page500
				},
				{
					path: 'login',
					name: 'Login',
					component: Login
				},
				{
					path: 'register',
					name: 'Register',
					component: Register
				},
				{
					path: 'dataPreview',
					name: 'dataPreview',
					component: dataPreview
				},
				{
					path: 'dataSetPreview',
					name: 'dataSetPreview',
					component: dataSetPreview
				},
			]
		},
		{
			path: '*',
			redirect: '/pages'
		}
	]
}

const router = new Router({
	mode: 'hash',
	linkActiveClass: 'active',
	scrollBehavior: () => ({ y: 0 }),
	routes: configRoutes()
})

// TODO 添加路由守卫
router.beforeEach((to, from, next) => {
	const path = to.path
	const token = localStorage.getItem('PIECloud-Token')
	if (
		!token &&
		(path != '/pages/login' &&
			path != '/pages/regist')
	) {
		// 未登录  且访问受限制页面
		next({
			path: '/pages/login'
		})
	} else if (token && path == '/pages/login') {
		next({
			path: '/adminHome'
		})
	} else if (token && path == '/') {
		next({
			path: '/adminHome'
		})
	} else {
		next()
	}
})

export default router
