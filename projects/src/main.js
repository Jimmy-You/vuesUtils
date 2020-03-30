import Vue from 'vue'
import App from './App'
import router from './router'
import store from './store'
import CoreuiVue from '@coreui/vue'
import { iconsSet as icons } from './assets/icons/icons.js' // 引入coreUi的图标
import CONST_CONFIG from './CONST'
// import 'view-design/dist/styles/iview.css'
import './assets/icons/iconfont/iconfont.css'
import VueClipboard from 'vue-clipboard2'
// 注册全局组件
import './index.less'
import './common.less'
import './iview.less'
import './components/global'
// axios
import http from './axiosConfig/http'
import vuescroll from 'vuescroll'
import UploaderList from './utils/UploadList';

Vue.use(UploaderList)

Vue.use(vuescroll) // install the vuescroll first

Vue.prototype.$vuescrollConfig = {
	bar: {
		background: '#CAD4D8'
	}
}
// 常量
Vue.prototype.$CONST = CONST_CONFIG
// axios
Vue.prototype.$http = http

// Vue.config.performance = true
// CoreUI组件
Vue.use(CoreuiVue)
// 复制功能组件
Vue.use(VueClipboard)

const vm = new Vue({
	el: '#app',
	router,
	store,
	icons,
	template: '<App/>',
	components: {
		App
	}
})

export default vm;
