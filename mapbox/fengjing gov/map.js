import lodash from 'lodash'
import vm from '../main.js'

export default function(Vue, options) {
	Vue.prototype.map = {
		//全局函数1
		map: '',

		// 地图上已经加载的source
		sources: [],
		// 地图上已经加载的layer
		layers: [],
		// 地图上的marker
		markers: [],
		popup: '',
		beforeMap: '',
		compare: '',
		initMap: function(mapObj, callback) {
			console.log(mapObj, 'mapObj')
			const { mapUrl = '', lon = 0, lat = 0, container = 'map_wrapper', level = '' } = mapObj
			this.map = new mapboxgl.Map({
				container,
				style: mapUrl,
				center: [ lon, lat ],
				zoom: 7
			})
			this.map.setMinZoom(4)
			if (level == '0') {
				this.map.setZoom(5)
			} else if (level == '1') {
				this.map.setZoom(7)
			} else if (level == '2') {
				this.map.setZoom(9)
			} else if (level == '3') {
				this.map.setZoom(11)
			}
			this.sources = []
			this.layers = []
			const that = this
			this.map.on('mousemove', function(e) {
				that.map.getCanvasContainer().style.cursor = 'pointer'
			})
			if (callback && typeof callback == 'function') callback()
		},
		// 清空底图上的图层和操作
		clean() {
			if (this.map) {
				// 删除layers
				this.removeAllLayers()
				// 删除source
				this.removeAllSources()
				// 删除markers
				if (this.markers.length) {
					this.markers.forEach((item) => {
						item.remove()
					})
				}
				this.markers = []
				if (this.popup) this.popup.remove()
			}
		},
		// 重新加载底图
		reload(callback) {
			if (this.map) this.map.remove() // 去除现有底图
			const userEntity = vm.$store.state.userEntity
			this.initMap(
				{
					mapUrl: vm.$store.state.basicMapUrl,
					lon: Number(userEntity.longitude || 0),
					lat: Number(userEntity.latitude || 0)
				},
				callback
			)
		},
		changeLayers: function(layerObj = {}, callback) {
			let that = this
			if (Object.keys(layerObj).length) {
				if (that.map._loaded) {
					// 删除layers
					this.removeAllLayers()
					// 删除source
					this.removeAllSources()
					// 添加新的sources
					// 添加新的layers
					that.addLayerMethod(layerObj, callback)
				} else {
					that.map.on('load', () => {
						that.addLayerMethod(layerObj, callback)
					})
				}
			}
		},
		removeLayers: function(item) {
			// 删除layers
			if (this.map.getLayer(item)) {
				this.map.removeLayer(item)
				lodash.remove(this.layers, item)
			}
		},
		removeSources: function(item) {
			if (this.map.getSource(item)) {
				this.map.removeSource(item)
				lodash.remove(this.sources, item)
			}
		},
		removeAllLayers: function() {
			const _this = this
			this.layers.forEach((item) => {
				_this.removeLayers(item)
				if (_this.map.hasImage(item)) _this.map.removeImage(item)
			})
		},
		removeAllSources: function() {
			const _this = this
			this.sources.forEach((item) => {
				_this.removeSources(item)
			})
		},
		// removeLayerById: function(id) {
		// 	if(this.map.getLayer(id)) this.map.removeLayer(id);
		// },
		addLayerMethod: function(layerObj, callback) {
			let that = this
			const { sources = {}, layers = [] } = layerObj
			const keys = Object.keys(sources)
			keys.forEach((item) => {
				const sourceId = item
				if (!that.map.getSource(sourceId)) {
					// 没有加载此source的时候  加载
					const { type = '', tiles = [], url = [] } = sources[sourceId] || {}
					// layer source参数
					const params = {
						type
					}
					type == 'raster' ? (params.tiles = tiles) : (params.url = url)
					if (type == 'raster') params.scheme = 'tms'
					// layer Source
					that.map.addSource(sourceId, params)
					that.sources.push(sourceId) // 将sourceId保存起来
				}
			})
			// 添加图层
			if (Array.isArray(layers)) {
				layers.forEach((item) => {
					let sourceLayer = 'source-layer'
					const { id = '' } = item
					if (!that.map.getLayer(id)) {
						that.map.addLayer({
							...item
						})
						that.layers.push(id) // 将layerId保存起来
					}
				})
			}
			const sourceId = keys[0] || ''
			const layerId = layers[0] ? layers[0].id || '' : ''
			if (callback && typeof callback == 'function') callback(sourceId, layerId)
		},
		// 删除某个图层
		removeLayerMethods: function(layerObj, callback) {
			let sourceId = ''
			let layerId = ''
			const { sources = {}, layers = [] } = layerObj
			const keys = Object.keys(sources)
			keys.forEach((item) => {
				sourceId = item
			})
			// 添加图层
			if (Array.isArray(layers)) {
				layers.forEach((item) => {
					const { id = '' } = item
					layerId = id
				})
			}
			if (callback && typeof callback == 'function') callback(sourceId, layerId)
		},

		// 添加单个图层的方法
		addSingle: function(layerObj = {}, callback) {
			// 添加新的layers
			const that = this
			if (that.map.loaded()) {
				that.addLayerMethod(layerObj, (sourceId, layerId) => {
					that.addDigitFarmingBounced(sourceId, layerId, callback)
				})
			} else {
				that.map.on('load', () => {
					that.addLayerMethod(layerObj, (sourceId, layerId) => {
						that.addDigitFarmingBounced(sourceId, layerId, callback)
					})
				})
			}
		},
		//删除单个图层的方法
		removeSingle: function(layerObj = {}, callback) {
			const that = this
			if (that.map.loaded()) {
				that.removeLayerMethods(layerObj, (sourceId, layerId) => {
					that.removeLayers(layerId)
					that.removeSources(sourceId)
				})
			} else {
				that.map.on('load', () => {
					that.removeLayerMethods(layerObj, (sourceId, layerId) => {
						that.removeLayers(layerId)
						that.removeSources(sourceId)
					})
				})
			}
			if (this.popup) this.popup.remove()
		},
		// 数字农图弹出
		addDigitFarmingBounced: function(sourceId, layerId, callback) {
			//弹框展示
			let that = this
			that.map.on('click', layerId, function(e) {
				var bbox = [ [ e.point.x - 5, e.point.y - 5 ], [ e.point.x + 5, e.point.y + 5 ] ]
				var features1 = that.map.queryRenderedFeatures(bbox, {
					layers: [ layerId ]
				})
				if (that.popup != '') {
					that.popup.remove()
				}
				var layerNOTE = features1[0].properties.名称
					? '<p class="txt">名称 : <span>' + features1[0].properties.名称 + '</span></p>'
					: ''
				var layerPNO = features1[0].properties.地址
					? '<p class="txt">地址 : <span>' + features1[0].properties.地址 + '</span></p>'
					: ''
				that.popup = new mapboxgl.Popup({
					offset: 15,
					closeOnClick: false
				})
					.setLngLat(e.lngLat)
					.setHTML('<div class="layerInformation">' + layerNOTE + layerPNO + '</div>')
					.addTo(that.map)
				if (callback && typeof callback == 'function')
					callback({ outer: features1[0].layer.id, inner: features1[0].properties.名称 })
			})
		},
		// 将某个点突出显示
		pointEmphasis: function(obj = {}) {
			const { lat = '', lon = '' } = obj
			this.map.flyTo({
				curve: 0.5,
				center: [ lon, lat ],
				zoom: 12
			})
		},
		//种植监管中地块查看放大地块
		expandLand: function(obj = {}) {
			const { landLat = '', landLon = '' } = obj
			this.map.flyTo({
				curve: 0.5,
				center: [ landLon, landLat ],
				zoom: 12
			})
		},
		compareMap: function(basicUrl, lonLat, layerObj) {
			const _this = this
			const beforeMapObj = {
				map: '',
				sources: [],
				// 地图上已经加载的layer
				layers: []
			}
			if (this.beforeMap) {
				// if (layerObj == '') {
				// 	this.beforeMap.layers = _this.removeLayers.bind(this.beforeMap, null)
				// 	this.beforeMap.sources = _this.removeSources.bind(this.beforeMap, null)
				// } else {
				this.beforeMap.layers.forEach((item) => {
					const removeLayers = _this.removeLayers.bind(this.beforeMap, item)
					removeLayers()
				})
				this.beforeMap.sources.forEach((item) => {
					const removeSources = _this.removeSources.bind(this.beforeMap, item)
					removeSources()
				})
				// }
			}
			if (this.beforeMap && !layerObj) {
				return // 如果已经存在对比地图 而且新的数据为空 则不进行其他操作
			}
			$('.mapboxgl-compare').remove()

			var init = this.initMap.bind(
				beforeMapObj,
				{
					mapUrl: basicUrl, // 加载before的底图
					lon: lonLat[0] || 0,
					lat: lonLat[1] || 0,
					container: 'beforeMap'
				},
				() => {
					// 初始化地图完成之后  加载before得图层
					if (beforeMapObj.map._loaded) {
						// 添加新的layers
						const newAddLayer = _this.addLayerMethod.bind(beforeMapObj, layerObj, () => {
							_this.beforeMap = beforeMapObj
							_this.compare = new mapboxgl.Compare(_this.map, beforeMapObj.map)
						}) // 参数: layerObj: 图斑的json
						newAddLayer()
					} else {
						beforeMapObj.map.on('load', () => {
							const newAddLayer = _this.addLayerMethod.bind(beforeMapObj, layerObj, () => {
								_this.beforeMap = beforeMapObj
								_this.compare = new mapboxgl.Compare(_this.map, beforeMapObj.map)
							}) // 参数: layerObj: 图斑的json
							newAddLayer()
						})
					}
				}
			)
			init()
		},
		// 设置高亮显示的marker
		setActiveMarker: function(id) {
			this.markers.forEach((item) => {
				const chiId = item._element.id
				if (chiId == id) {
					// item.togglePopup();
					$(`#${id}`).click()
					const lonLat = item.getLngLat()
					this.pointEmphasis({
						lon: lonLat.lng,
						lat: lonLat.lat
					})
				}
			})
		},
		// 在地图上添加标记点的方法
		addMarker: function(markerObj, callback) {
			// callback: 点击marker时的回掉函数
			const _this = this
			const { lon = 0, lat = 0, id = 0, index = 0, landAdd = '' } = markerObj
			var el = document.createElement('div')
			el.className = 'normal-marker'
			el.innerText = index
			el.id = id
			el.style.width = 30 + 'px'
			el.style.height = 40 + 'px'
			el.addEventListener('click', function(e) {
				// 替换marker状态
				_this.toogleMarkerStatus(e.currentTarget, id)
				if (callback && typeof callback == 'function') callback(id)
			})
			// TODO添加toogle弹出popup
			const idNode = `<p class="txt">编号: ${index}</p>`
			const addrNode = `<p class="txt">地址: ${landAdd}</p>`
			let popup = new mapboxgl.Popup({
				offset: 25
			}).setHTML(`<div class="layerInformation">${idNode}${addrNode}</div>`)
			// add marker to map
			const marker = new mapboxgl.Marker(el)
				.setLngLat([ Number(lon), Number(lat) ])
				// .setPopup(popup)
				.addTo(this.map)
			this.markers.push(marker)
		},

		// 点击标记点之后  修改状态
		toogleMarkerStatus: function(ele) {
			// 如果当前marker是激活状态  则不做操作
			const classList = ele.classList
			if (classList.contains('active-marker')) {
				return
			}
			// 当前marker是未激活状态 则将已激活的清除 将本marker变为激活 并关闭弹出提示框
			this.markers.forEach((chiItem) => {
				const el = chiItem._element
				const classListChi = el.classList
				classListChi.remove('active-marker')
				el.style.width = '30px'
				el.style.height = '40px'
			})
			classList.add('active-marker')
			ele.style.width = '38px'
			ele.style.height = '48px'
		},

		// 为地图添加图片
		changeOverlayImage: function(imgObj) {
			// 如果之前存在覆盖图层   则删除
			if (this.map.getLayer('overlayImage')) {
				this.map.removeLayer('overlayImage')
				this.map.removeSource('overlayImage')
			}
			// x1 左侧经度 x2 右侧经度 y1 纬度上边界 y2纬度下边界 url图片路径
			const { x1 = 0, x2 = 0, y1 = 0, y2 = 0, url = '' } = imgObj
			this.map.addSource('overlayImage', {
				type: 'image',
				url: url,
				coordinates: [ [ x1, y1 ], [ x2, y1 ], [ x2, y2 ], [ x1, y2 ] ]
			})
			this.map.addLayer({
				id: 'overlayImage',
				type: 'raster',
				source: 'overlayImage',
				paint: {
					'raster-fade-duration': 0
				}
			})
			this.layers.push('overlayImage')
			this.sources.push('overlayImage')
		},
		//数字农图--添加图标
		addDigitalIcon: function(arrLonLat, name, img) {
			console.log('arrLonLat: ', arrLonLat, name)
			let features = []
			let ID = ''
			let that = this
			arrLonLat.forEach((item, index) => {
				features.push({
					type: 'Feature',
					geometry: {
						type: 'Point',
						coordinates: item
					}
				})
				ID = index + name
				that.layers.push(ID)
				that.sources.push(ID)
			})
			that.map.loadImage(img, function(error, image) {
				if (error) throw error
				that.map.addImage(ID, image)
				that.map.addLayer({
					id: ID,
					type: 'symbol',
					source: {
						type: 'geojson',
						data: {
							type: 'FeatureCollection',
							features: features
						}
					},
					layout: {
						'icon-image': ID,
						'icon-size': 0.5
					}
				})
			})
		},
		//数字农图--删除图标
		removeIconLayer: function(arrLonLat, name) {
			console.log('TCL: arrLonLat, name', arrLonLat, name)
			let features = []
			let ID = ''
			arrLonLat.forEach((item, index) => {
				features.push({
					type: 'Feature',
					geometry: {
						type: 'Point',
						coordinates: item
					}
				})
				ID = index + name
			})
			this.map.removeLayer(ID)
			this.map.removeSource(ID)
			this.map.removeImage(ID)
		}
	}
}
