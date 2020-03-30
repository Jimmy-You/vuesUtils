### Clone repo

``` bash
# clone the repo
$ git clone ssh://git@git.piesat.cn:27022/Product/product/PIE-Cloud/PIE-publish.git

# go into app's directory
$ cd PIE-publish

# install app's dependencies
$ npm install
```

## Usage

``` bash
# serve with hot reload at localhost:8080
npm run serve

# build for production with minification
npm run build


## What's included

Within the download you'll find the following directories and files:

```
CoreUI-Vue/
├── public/              # pure static assets (directly copied)
│   └── index.html           		# index.html template
│   └── *.js           			 		# 一些静态资源 打包时会暴露在最外层不被webpack处理
├── src/                 # project root
│   ├── assets/                 # module assets (processed by webpack)
│   │   └── scss/               # user styles
│   ├── axiosConfig/            # axios相关封装
│   ├── CONST/            			# 常量
│   ├── components/             # ui组件
│   │   └── global/             # 全局注册的组件
│   │   └── modules/           	# 每个模块对应的局部组件
│   ├── containers/             # 布局组件
│   │   └── _nav.js             # 菜单配置
│   ├── router/                 # 路由
│   ├── templageView/           # 模板提供的组件 
│   ├── utils/                 	# 常用工具 
│   ├── views/                  # 视图组件
│   ├── App.vue                 # main app component
│   ├── common.less             # less变量
│   ├── index.less              # 全局样式
│   └── main.js                 # app entry file
├── test/
│   └── unit/            # unit tests
│   └── e2e/             # e2e tests
├── .eslintrc.js         # eslint config
├── .gitignore           # defaults for gitignore
├── .postcssrc.js        # postcss config
├── CHANGELOG.md
├── README.md
├── babel.config.js      # babel config
├── jest.config.js       # jest config
├── vue.config.js        # vue-cli config 此处可以添加webpack配置
├── LICENSE
└── package.json         # build scripts and dependencies
```

# 开发环境需要使用文档示例
打开router/index.js和container/_nav.js目录下的屏蔽项