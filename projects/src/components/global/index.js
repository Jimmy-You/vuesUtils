import Vue from 'vue';
import iView from 'view-design'; // 按需使用iview

const components = require.context('./', false, /\.vue$/)

components.keys().forEach(key => {
	if(key === './index.js') return;
	const name = key.slice(key.indexOf('/') + 1, key.lastIndexOf('.'));
	Vue.component(name, components(key).default);
})

// 使用iview
Vue.use(iView)