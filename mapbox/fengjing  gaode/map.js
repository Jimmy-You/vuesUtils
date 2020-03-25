import coordtransform from "coordtransform"
import { weatherImagePrefix } from '../api/urlPath'
import vm from '../main'
import level_01 from '../assets/images/icon/level_01.png'
import level_02 from '../assets/images/icon/level_02.png'
import level_03 from '../assets/images/icon/level_03.png'
const HEBEI_CONST = {
	'邯郸': ['复兴区', '邯山区', '丛台区'],
	'石家庄': ['井陉矿区', '鹿泉区', '新华区', '桥西区', '长安区', '裕华区'],
	'邢台': ['桥西区', '桥东区', '邢台县'],
	'衡水': ['桃城区'],
	'沧州': ['运河区', '沧县', '新华区'],
	'保定': ['博野县', '清苑区', '莲池区', '竞秀区', '定兴县', '涞水县'],
	'张家口': ['下花园区', '桥东区', '桥西区'],
	'唐山': ['古冶区', '开平区', '路北区', '路南区'],
	'秦皇岛': ['北戴河区', '海港区', '山海关区'],
	'廊坊': ['安次区', '广阳区'],
	'承德': ['双滦区', '双桥区', '鹰手营子矿区'],
}
const HEBEI_CODE = {
	'邯郸': '1304',
	'石家庄': '1301',
	'邢台': '1305',
	'衡水': '1311',
	'沧州': '1309',
	'保定': '1306',
	'张家口': '1307',
	'唐山': '1302',
	'秦皇岛': '1303',
	'廊坊': '1310',
	'承德': '1308',
}

export default function (Vue, options) {
	Vue.prototype.loadMap = { //全局函数1
		tool: "",
		scale: '',
		alertWindowId: undefined, // 站点详情弹窗
		landSelectedId: undefined, // 当前选中的站点id
		map: null,
		landList: [], // 站点列表
		markArr: [], // 预警图标列表
		autoImageList: [], // 轮播图图片数组
		landListTemp: [], // 沧州边界
		distrubuteTemp: [], // 枣园分布边界
		landMap: new Map(), // 保存站点对象的map,
		nowStationList: [], // 实况站点列表
		currentHightStation: '', //当前高亮的站点
		periodAreasList: [], // 生育期地块颜色展示
		periodStationsList: [], //生育期站点列表
		currentDistributeArea: '', // 当前悬浮的枣地块
		onMove: false,
		init: function (id, callback) {
			var googleMapLayer = new AMap.TileLayer({ //图层
				getTileUrl: 'http://mt{1,2,3,0}.google.cn/vt/lyrs=s&hl=zh-CN&gl=cn&x=[x]&y=[y]&z=[z]&s=Galile' //获取google地图源
			});
			var disCountry = new AMap.DistrictLayer.Province({
				zIndex: 99,
				adcode: ['130000'],
				depth: 2,
				styles: {
					'nation-stroke': '#22ffff',
					'coastline-stroke': [0, 158, 160, 0.7],
					'province-stroke': 'rgba(0, 158, 160, 0.7)',
					'city-stroke': 'rgba(0, 158, 160, 0.7)',//中国特有字段
					'county-stroke': 'rgba(0, 158, 160, 0.7)',
					'fill': 'rgba(255, 255, 255, 0)',
					'province-stroke-weight': 5,
					'strokeWeight': 10
				}
			})
			this.map = new AMap.Map(id, {
				center: [116.220001, 39.520001], //设置中心点
				zoom: 15, //设置缩放级别
				// pitch: 0,
				// viewMode: '3D',
				features: ['bg', 'building', 'point'],
				// layers: [googleMapLayer]
			});
			disCountry.setMap(this.map);
			// this.map.plugin(["AMap.ToolBar"], () => {
			// 	//加载工具条
			// 	var toolbar = {
			// 		position: "RT",
			// 		locationMarker: []
			// 	}

			// 	this.tool = new AMap.ToolBar(toolbar);
			// 	this.tool.hideLocation()
			// 	this.map.addControl(this.tool);
			// });
			this.map.plugin(["AMap.Scale"], () => {
				//加载比例尺
				var scale = {
					visible: true
				}
				this.scale = new AMap.Scale(scale);
				this.map.addControl(this.scale);
			});
			// 地图初始化结束
			if (callback) callback();
		},
		// 生成站点详情的方法
		renderLandLabel(data = {}) {
			const { landName = '', cropVariety = '', cropArea = '', landAddress = '', remark = '', isCount = 0, landLat = 0, landLon = 0 } = data;
			let latFor = Number(landLat).toFixed(3), lonFor = Number(landLon).toFixed(3);
			return `
				<div class="land-info-window show-land-info-window">
					<div class="info-content">
						<div>
							<div class="content-item">
								<span>园区名称:&nbsp;</span>
								<span title="${landName}">${landName}</span>
							</div>
						</div>
						<div>
							<div class="content-item">
								<span>品种:&nbsp;</span>
								<span title="${cropVariety}">${cropVariety}</span>
							</div>
						</div>
						<div>
							<div class="content-item">
							<span>面积:&nbsp;</span>
							<span title="${cropArea}">${cropArea}亩</span>
						</div>
						</div>
						<div>
							<div class="content-item">
								<span>经纬度:&nbsp;</span>
								<span title="${lonFor},${latFor}">${lonFor},${latFor}</span>
							</div>
						</div>
						<div>
							<div class="content-item">
								<span>地址:&nbsp;</span>
								<span title="${landAddress}">${landAddress}</span>
							</div>
						</div>
						<div>
							<div class="content-item">
								<span>备注:&nbsp;</span>
								<span title="${remark}">${remark}</span>
							</div>
						</div>
						<div class="opreate-button" id="showDetail" style="display: ${isCount > 0 ? 'block' : 'none'}">
							显示物候期统计详情
						</div>
					</div>
				</div>
			`
		},
		// 添加站点图标和点击事件等
		addLandPoint(landObj) {
			const {
				landId = '',
				landLat = '0',
				landLon = '0',
			} = landObj;
			const center = coordtransform.wgs84togcj02(Number(landLon), Number(landLat));
			const land = new AMap.Marker({
				position: center,
				content: `<div class="normal_marker">${landId}</div>`,
				offset: new AMap.Pixel(-15, -40),
			});
			land.setMap(this.map);
			this.landMap.set(landId, land);
			this.landList.push({
				id: landId,
				land,
			}); // 保存起来 方便操作

			const changePeriod = function (id) {
				if (!vm.$store.state.showPhasePeroidTable) {
					vm.$store.dispatch('changePhasePeroidTableShow', id)
				}
			}
			// 点击地块的事件
			land.on('click', ({ target = {} }) => {
				// 点击之后修改store中的选中地块
				if (this.landSelectedId == landObj.landId) {
					// 点击的是已选中的
					vm.$store.dispatch('updateLandSelect', {});
				} else {
					this.map.setZoomAndCenter(16, center);
					vm.$store.dispatch('updateLandSelect', landObj);
				}
				// 如果已经显示了物候期统计数据  则清除
				if (vm.$store.state.showPhasePeroidTable) {
					vm.$store.dispatch('changePhasePeroidTableShow')
				}
				// 如果已经显示了历史数据
				if (vm.$store.state.showHistoryChart) {
					vm.$store.dispatch('changeHistoryDataShow')
				}
				// 边界高亮问题
				if (this.landSelectedId && this.landSelectedId !== landId) { // 之前选中的和当前选中的不一样
					this.landMap.get(this.landSelectedId).setContent(`<div class="normal_marker">${this.landSelectedId}</div>`)
					this.landMap.get(this.landSelectedId).setOffset(new AMap.Pixel(-15, -40))
					land.setContent(`<div class="normal_marker active__marker">${landId}</div>`)
					land.setOffset(new AMap.Pixel(-19, -48))
					setTimeout(() => {
						if (this.landMap.get(this.landSelectedId)) this.landMap.get(this.landSelectedId).setLabel(null);
						land.setLabel({
							offset: new AMap.Pixel(50, 0),
							content: this.renderLandLabel(landObj),
							direction: 'right'
						});
						if ($('#showDetail')) {
							$('#showDetail').on('click', () => changePeriod(landId))
						}
					}, 100)
				} else if (this.landSelectedId && this.landSelectedId == landId) { // 之前选中的和当前选中的一样
					land.setContent(`<div class="normal_marker">${landId}</div>`)
					land.setOffset(new AMap.Pixel(-15, -40))
					setTimeout(() => {
						land.setLabel(null);
					}, 100)
				} else { // 之前没有选中
					land.setContent(`<div class="normal_marker active__marker">${landId}</div>`)
					land.setOffset(new AMap.Pixel(-19, -48))
					setTimeout(() => {
						land.setLabel({
							offset: new AMap.Pixel(50, 0),
							content: this.renderLandLabel(landObj),
							direction: 'right'
						})
						if ($('#showDetail')) {
							$('#showDetail').on('click', () => changePeriod(landId))
						}
					}, 100)
				}
				setTimeout(() => {
					if (this.landSelectedId == landObj.landId) {
						this.landSelectedId = undefined;
					} else {
						this.landSelectedId = landObj.landId
					}

				}, 150)
			})
		},
		// 添加地块边界及中心点icon --暂时不用 
		addLandPolygon(landObj) {
			const {
				geometry = '',
				landName = '-',
				landId = '',
				landLat = '0',
				landLon = '0',
				cropVariety = '',
				cropArea = 0,
				landAddress = '',
				remark = '',
				landCode = ''
			} = landObj;
			const center = coordtransform.wgs84togcj02(Number(landLon), Number(landLat));
			// this.map.panTo(center); // 临时测试使用
			let pointArr = geometry.split(',') || [];
			pointArr = pointArr.map((chiItem) => {
				return chiItem.trim().split(' ');
			})
			const pointArrFormatter = [];
			for (let j = 0; j < pointArr.length; j++) { // 边界点坐标值转换
				pointArrFormatter.push(coordtransform.wgs84togcj02(Number(pointArr[j][0]), Number(pointArr[j][1])));
			}
			const land = new AMap.Polygon({
				map: this.map,
				zIndex: 80,
				path: pointArrFormatter,
				strokeColor: '#EFAD2D',
				strokeWeight: 3,
				fillColor: '#000000',
				fillOpacity: 0,
			});
			this.landMap.set(landId, land);
			this.landList.push({
				id: landId,
				land,
			}); // 保存起来 方便操作
			// 点击地块的事件
			land.on('click', ({ target = {} }) => {
				// 点击之后修改store中的选中地块
				if (this.landSelectedId == landObj.landId) {
					// 点击的是已选中的
					vm.$store.dispatch('updateLandSelect', {});
				} else {
					vm.$store.dispatch('updateLandSelect', landObj);
				}

				this.map.setZoomAndCenter(16, center);
				// 边界高亮问题
				if (this.landSelectedId && this.landSelectedId !== landId) {
					this.landMap.get(this.landSelectedId).setOptions({
						strokeColor: '#ffffff',
						strokeWeight: 3,
					})
					land.setOptions({
						strokeColor: '#2efbe3',
						strokeWeight: 5,
					})
				} else if (this.landSelectedId && this.landSelectedId == landId) {
					land.setOptions({
						strokeColor: '#ffffff',
						strokeWeight: 3,
					})
				} else {
					land.setOptions({
						strokeColor: '#2efbe3',
						strokeWeight: 5,
					})
				}
				if (this.landSelectedId == landObj.landId) {
					this.landSelectedId = undefined;
				} else {
					this.landSelectedId = landObj.landId
				}
				// 如果已经打开本地块的详情  则关闭 
				if (this.alertWindowId && this.alertWindowId == landId) {
					// return;
					$('.show-land-info-window').removeClass('show-land-info-window');
					setTimeout(() => {
						this.map.clearInfoWindow();
						this.alertWindowId = undefined;
					}, 500);
				} else {
					// 已经打开详情  但不是本地块的  则先关闭 再创建本地块的
					if (this.alertWindowId && this.alertWindowId != landId) this.map.clearInfoWindow();
					// 添加显示信息窗体
					this.alertWindowId = landId;
					const infoWindow = new AMap.InfoWindow({
						isCustom: true,
						content: createInfoWindow(),
						position: center,
						offset: new AMap.Pixel(270, 140)
					});
					function createInfoWindow() {
						return `
						<div class="land-info-window show-land-info-window">
							<div class="guide-img">
							</div>
							<div class="info-content">
								<div>
									<div class="content-item">
										<span>园区名称:&nbsp;</span>
										<span title="${landName}">${landName}</span>
									</div>
								</div>
								<div>
									<div class="content-item">
										<span>品种:&nbsp;</span>
										<span title="${cropVariety}">${cropVariety}</span>
									</div>
								</div>
								<div>
									<div class="content-item">
									<span>面积:&nbsp;</span>
									<span title="${cropArea}">${cropArea}亩</span>
								</div>
								</div>
								<div>
									<div class="content-item">
										<span>地址:&nbsp;</span>
										<span title="${landAddress}">${landAddress}</span>
									</div>
								</div>
								<div>
									<div class="content-item">
										<span>备注:&nbsp;</span>
										<span title="${remark}">${remark}</span>
									</div>
								</div>
							</div>
						</div>
					`
					}
					infoWindow.on('open', () => {
						// 打开之后我们添加显示宽度的类名
						$('.land-info-window').addClass('show-land-info-window');
					})
					infoWindow.on('close', () => {
						// 关闭之后我们添加宽度置0的类名 ??? 会不会有效
						$('.show-land-info-window').removeClass('show-land-info-window');
					})
					infoWindow.open(this.map)
				}
			})
			// 添加地块上的地块名称
			const landNameMarker = new AMap.Text({
				text: landCode,
				map: this.map,
				position: center, // 地块中心点
			})
			landNameMarker.setStyle({
				'background': 'rgba(255,255,255,0)',
				'color': '#ffffff',
				'border': 'none',
				'font-size': '64px',
				'font-weight': 'bold',
				'font-family': 'SourceHanSansCN',
			})
		},
		// 主动触发地块点击事件
		setHightLightLand(landObj) {
			if (landObj) {
				this.landList.forEach((item) => {
					const { id = '', land = {} } = item;
					if (id == landObj.landId || id == landObj.id) {
						land.emit('click');
					}
				})
			}
		},
		// 地图上插入轮播图片
		addImageForPlay(url, reset) {
			const _this = this;
			if (reset) this.cleanImageForPlay();
			const bounds = new AMap.Bounds([111.9, 34.8], [119.9, 42.8]);
			this.autoImageList.push(new AMap.GroundImage(
				url,
				bounds,
				{
					map: _this.map
				}
			));
		},
		// 清除地图轮播
		cleanImageForPlay() {
			if (this.autoImageList.length) {
				this.autoImageList.forEach((item) => {
					this.map.remove(item);
				})
				this.autoImageList = [];
			}
		},
		// 展示预警信息
		showWarning(data) {
			if (Array.isArray(data) && data.length) {
				const markArr = [];
				data.forEach((item, index) => {
					const {
						longitude = 0,
						latitude = 0,
						cityRelease = '',
						earlyWarningContent = '',
						earlyWarningDate = '',
						earlyWarningRank = '',
						earlyWarningType = '',
						stationNum = ''
					} = item;
					const marker = new AMap.Marker({
						position: new AMap.LngLat(Number(longitude), Number(latitude)),
						icon: `${weatherImagePrefix}${earlyWarningType}-${earlyWarningRank}.png`
					});
					marker.on('click', () => {
						if (marker.getLabel() && marker.getLabel().content) {
							// 已经显示点击隐藏
							marker.setLabel(null)
						} else {
							// 没有显示就增加label
							marker.setLabel({
								offset: new AMap.Pixel(50, 0),
								content: `<div class="warning-label">
									<div class="item"><span class="title">城市:</span><span class="content">${cityRelease}</span></div>
									<div class="item"><span class="title">站点编号:</span><span class="content">${stationNum}</span></div>
									<div class="item"><span class="title">预报日期:</span><span class="content">${earlyWarningDate}</span></div>
									<div class="item"><span class="title">预警内容:</span><span class="content">${earlyWarningContent}</span></div>
								</div>`,
								direction: 'right'
							})
						}
					})
					markArr.push(marker);
				})
				this.markArr = markArr;
				const overlayGroup = new AMap.OverlayGroup(markArr);
				// 统一添加到地图实例上
				this.map.add(overlayGroup);
			}
		},
		// 清除预警类型的弹窗
		removeWeatherWarning() {
			if (this.markArr && this.markArr.length) {
				this.markArr.forEach((item) => {
					if (item.getLabel() && item.getLabel().content) {
						item.setLabel(null)
					}
					this.map.remove(item)
				})
				this.markArr = []
			}
		},
		// 绘制沧州市边界
		drawProvinceLands(data, index, callback) {
			new AMap.DistrictSearch({
				extensions: 'all',
				subdistrict: 0
			}).search('沧州市', (status, result) => {
				// 外多边形坐标数组和内多边形坐标数组
				var holes = result.districtList[0].boundaries
				const land = new AMap.Polygon({
					map: this.map,
					zIndex: 8,
					path: holes,
					strokeColor: '#EFAD2D',
					strokeWeight: 3,
					fillColor: '#000000',
					fillOpacity: 0,
				});
				this.map.set('pro' + 8, land);
				this.map.setZoomAndCenter(8, coordtransform.wgs84togcj02(116.51, 38.21));
				this.landListTemp.push({
					id: 'pro' + 8,
					land,
				});
			})
			if (callback) callback(center);
		},
		// 跳转到制定位置
		padToCoordinate(center, zoom) {
			this.map.setZoomAndCenter(zoom, coordtransform.wgs84togcj02(Number(center[0]), Number(center[1])));
		},
		// 控制沧州边界的显示
		showProvince() {
			this.landListTemp.forEach((item) => {
				item.land.show();
			})
		},
		// 控制沧州边界的隐藏
		removeProvince() {
			this.landListTemp.forEach((item) => {
				item.land.hide();
			})
		},
		// 悬浮显示枣园信息
		showDistributeArea(e, data) {
			if (data) {
				const { pixel = {}, target = {} } = data;
				const { name = '', area = '' } = target.getExtData() || {};
				$('#showAreaDetail').empty();
				$('#showAreaDetail').append(`
				<div class="item">
					<span class="title">枣园面积</span>
					<span class="info">${area}公顷</span>
				</div>
				`)
				$('#showAreaDetail').css('top', e.pageY)
				$('#showAreaDetail').css('left', e.pageX + 10)
				$('#showAreaDetail').css('display', 'block')
			}
		},
		// 枣分布
		drawDistributeLands(data, index) {

			if (data && Array.isArray(data)) {
				data.forEach((item, id) => {
					const { lat = 0, lon = 0, vectorData = '', area = '', vectorName = '--', vectorId = 0 } = item || {};
					let pointStr = vectorData.split('|') || [];
					pointStr.forEach(chiItem => {
						let pointArr = chiItem.split(',') || [];
						pointArr = pointArr.map((chiItem) => {
							return chiItem.trim().split(' ');
						})
						const pointArrFormatter = [];
						for (let j = 0; j < pointArr.length; j++) { // 边界点坐标值转换
							pointArrFormatter.push(coordtransform.wgs84togcj02(Number(pointArr[j][0]), Number(pointArr[j][1])));
						}
						const land = new AMap.Polygon({
							map: this.map,
							zIndex: index,
							path: pointArrFormatter,
							strokeColor: '#000080',
							strokeWeight: 3,
							fillColor: '#000000',
							fillOpacity: 0,
							extData: {
								name: vectorName,
								area: area
							}
						});
						this.map.set('dis' + vectorId, land);
						land.on('click', ({ target = {} }) => {
							this.map.setZoomAndCenter(16, coordtransform.wgs84togcj02(Number(lon), Number(lat)));
						})
						land.on('mouseover', (e) => { // 鼠标悬浮事件
							if (!this.onMove) {
								this.onMove = true;
								$('body').on('mousemove', (event) => this.showDistributeArea(event, e))
							}
						})
						land.on('mouseout', (e) => { // 鼠标移除事件
							this.onMove = false;
							$('#showAreaDetail').empty();
							$('#showAreaDetail').css('display', 'none');
							$('body').off('mousemove')
						})
						this.distrubuteTemp.push({
							id: 'dis' + vectorId,
							land,
						});
					})
				})
			}
		},
		// 枣园分布的展示
		showDistribute() {
			this.distrubuteTemp.forEach((item) => {
				item.land.show();
			})
		},
		// 枣园分布的隐藏
		removeDistribute() {
			this.distrubuteTemp.forEach((item) => {
				item.land.hide();
			})
		},
		// 清除地图上所有内容
		cleanMap() {
			// 删除alertwindow
			if (this.alertWindowId) {
				$('.show-land-info-window').removeClass('show-land-info-window');
				setTimeout(() => {
					this.map.clearInfoWindow();
					this.alertWindowId = undefined;
				}, 2000);
			}
			// 删除预警信息
			this.removeWeatherWarning();
			// 删除轮播图片
			this.cleanImageForPlay();
			// 删除站点数据
			this.removeStation();
			// 删除生育期相关图层
			this.removePeriodData();
		},
		// 播放过程中缩放的操做
		changeStatus() {
			vm.$Message.info('提示: 播放过程中进行地图缩放, 播放会自动暂停')
			document.getElementById('playBtn').click();
		},
		// 添加缩放暂停功能
		addZoomSuspend() {
			this.map.on('zoomstart', this.changeStatus)
		},
		// 移除缩放暂停功能
		removeZoomSuspend() {
			this.map.off('zoomstart', this.changeStatus)
		},
		// 移除站点数据
		removeStation() {
			this.nowStationList.forEach((item) => {
				this.map.remove(item);
			})
			this.currentHightStation = ''
		},
		// 实况站点取消突出
		removeStationStatus() {
			if (this.currentHightStation) {
				this.currentHightStation.setOptions({
					fillColor: 'rgba(0, 158, 160, 0.7)',
				})
				this.currentHightStation = ''
			}
		},
		// 实况站点突出
		stationClick(e, callback) {
			if (this.currentHightStation && this.currentHightStation.getExtData().id == e.target.getExtData().id) {
				return;
			}
			// 取消之前的高亮
			if (this.currentHightStation) this.currentHightStation.setOptions({
				fillColor: 'rgba(0, 158, 160, 0.7)',
			})
			// 当前选中的高亮
			e.target.setOptions({
				fillColor: 'rgba(239,173,45, 0.7)',
			})
			this.currentHightStation = e.target;
			if (callback && typeof callback == 'function') callback(e);
		},
		// 实况站点的添加
		renderNowStation(data, clickHandler) {
			if (data && Array.isArray(data) && data.length) {
				this.nowStationList = [];
				data.forEach((item) => {
					const { districtName = '', districtStationNum = '', latitude = 0, longitude = 0 } = item;
					var circleMarker = new AMap.CircleMarker({
						center: coordtransform.wgs84togcj02(Number(longitude), Number(latitude)),
						// center: [Number(longitude), Number(latitude)],
						radius: 10,
						strokeColor: 'white',
						strokeWeight: 2,
						strokeOpacity: 0.5,
						fillColor: 'rgba(0, 158, 160, 0.7)',
						fillOpacity: 1,
						zIndex: 10,
						bubble: false,
						cursor: 'pointer',
						clickable: true,
						extData: {
							id: districtStationNum,
							name: districtName
						}
					})
					circleMarker.on('click', (e) => { this.stationClick(e, clickHandler) })
					circleMarker.setMap(this.map)
					this.nowStationList.push(circleMarker);
				})
			}
		},
		// 清除生育期相关图层
		removePeriodData() {
			if (this.periodAreasList && this.periodAreasList.length) {
				this.periodAreasList.forEach((item) => {
					this.map.remove(item.land); // 删除颜色图层
				})
			}
			if (this.periodStationsList && this.periodStationsList.length) {
				this.periodStationsList.forEach((item) => {
					this.map.remove(item); // 删除站点图标
				})
			}
		},
		// 生育预报的站点添加
		renderPeriodStation(data, callback) {
			this.removePeriodData();
			if (data && Array.isArray(data) && data.length) {
				vm.$store.dispatch('changeGlobalLoading')
				let count = 0;
				data.forEach((item) => {
					// 添加图标和地块颜色显示
					let { status: state = 0, longitude = 0, latitude = 0, stationName: districtName = '', stationNum: districtStationNum = 0, remark = '' } = item;
					if (districtName == '滦县') {
						districtName = '滦州市'
					}
					// const station = new AMap.Marker({
					// 	position: coordtransform.wgs84togcj02(Number(longitude), Number(latitude)),
					// 	// content: districtName + state,
					// 	icon: state == 0 ? level_01 : state == 1 ? level_02 : level_03,
					// 	offset: new AMap.Pixel(-19, -20),
					// 	extData: {
					// 		id: districtStationNum,
					// 		name: districtName
					// 	}
					// });
					// station.setMap(this.map);
					// 添加区域颜色
					// this.periodStationsList.push(station);
					if (remark <= 0) {
						count++;
						new AMap.DistrictSearch({
							extensions: 'all',
							subdistrict: 0
						}).search(districtName.trim(), (status, result) => {
							// 外多边形坐标数组和内多边形坐标数组
							count--;
							if (count <= 0) {
								vm.$store.dispatch('changeGlobalLoading')
							}
							if (!result.districtList || !result.districtList.length) return;
							let holes = [];
							result.districtList.forEach((item) => {
								if (item.name.trim() == districtName.trim() || (item.name.startsWith(districtName.trim()) && item.adcode.startsWith('13'))) {
									holes = item.boundaries
								}
							})
							const land = new AMap.Polygon({
								map: this.map,
								zIndex: 12,
								path: holes,
								strokeColor: 'rgba(255,255,255,0)',
								strokeWeight: 1,
								fillColor: Number(state) == 1 ? '#54ff54' : Number(state) == 2 ? '#54c9ff' : '#ffdd54',
								fillOpacity: 0.7,
							});
							land.on('click', () => {
								if (vm.$store.state.periodAreaData.stationNum == item.stationNum) {
									// 已有生育期适应程度显示表格
									vm.$store.dispatch('changePeroidSuitableShow')
								} else {
									vm.$store.dispatch('changePeroidSuitableShow', item)
								}
							})
							this.map.set('period' + districtStationNum, land);
							this.periodAreasList.push({
								id: 'period' + districtStationNum,
								land,
							});
						})
					} else {
						const areas = HEBEI_CONST[districtName.trim()] || [];
						areas.forEach((outItem) => {
							count++;
							new AMap.DistrictSearch({
								extensions: 'all',
								subdistrict: 0
							}).search(outItem.trim(), (status, result) => {
								// 外多边形坐标数组和内多边形坐标数组
								count--;
								if (count <= 0) {
									vm.$store.dispatch('changeGlobalLoading')
								}
								if (!result.districtList || !result.districtList.length) return;
								let holes = [];
								result.districtList.forEach((item) => {
									if ((item.name.trim() == outItem.trim() && item.adcode.startsWith(HEBEI_CODE[districtName.trim()])) || (item.name.startsWith(outItem.trim()) && item.adcode.startsWith(HEBEI_CODE[districtName.trim()]))) {
										holes = item.boundaries
									}
								})
								const land = new AMap.Polygon({
									map: this.map,
									zIndex: 12,
									path: holes,
									strokeColor: 'rgba(255,255,255,0)',
									strokeWeight: 1,
									fillColor: Number(state) == 1 ? '#54ff54' : Number(state) == 2 ? '#54c9ff' : '#ffdd54',
									fillOpacity: 0.7,
								});
								this.map.set('period' + districtStationNum, land);
								this.periodAreasList.push({
									id: 'period' + districtStationNum,
									land,
								});
							})
						})
					}
				})
			}
		}
	}
}
