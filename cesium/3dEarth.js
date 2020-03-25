/*
 * @Author: heCheng
 * @Date: 2018-11-19 13:12:33
 * @Last Modified by: heCheng
 * @Last Modified time: 2019-04-30 15:12:33
 */
/**
 *
 *
 * @class ThreeEarth  用来初始化cesium方法的3d地球以及部分方法
 * @param {string} [parms={
 *    animation: false,    是否显示动画控件(左下方那个)
 *    baseLayerPicker: false,  是否显示图层选择控件
 *    geocoder: false,    是否显示地名查找控件
 *    timeline: false,    是否显示时间线控件
 *    sceneModePicker: true,    是否显示投影方式控件
 *    navigationHelpButton: true,    是否显示帮助信息控件
 *    infoBox: true,    是否显示帮助信息控件
 *   }]
 */
import { Notification } from 'element-ui';
import Cesium from 'cesium/Cesium';
import { req } from './request.js';
import urlPath from '../api/urlPath.js';
import store from '../store/index';

export default class ThreeEarth {
	constructor(
		DomId,
		SildId,
		parms = {
			fullscreenButton: false,
			animation: false,
			baseLayerPicker: false,
			geocoder: false,
			timeline: false,
			sceneModePicker: false,
			navigationHelpButton: false,
			homeButton: false,
			infoBox: false
		}
	) {
		//初始化对象的语句
		console.groupCollapsed('Class状态：3dEarthjs');
		console.assert(DomId, '3dEarthjs的id参数无效');
		this.entyParms = [];
		this.nowEnty = {};
		this.DomId = DomId;
		this.parms = parms;
		this.sliderId = SildId;
		delete this.parms.sliderId;
		this.blackMarble = {};
		this.viewer = {};
		this.imageryProviderFn();
		this.run();
		this.height = 22000000;
		this.viewer.scene.screenSpaceCameraController.minimumZoomDistance = 500; //相机的高度的最小值
		this.viewer.scene.screenSpaceCameraController.maximumZoomDistance = 22000000; //相机高度的最大值
		this.viewer.scene.screenSpaceCameraController._minimumZoomRate = 30000; // 设置相机缩小时的速率
		this.viewer.scene.screenSpaceCameraController._maximumZoomRate = 5906376272000; //设置相机放大时的速率
		this.viewer.cesiumWidget.screenSpaceEventHandler.removeInputAction(
			Cesium.ScreenSpaceEventType.LEFT_DOUBLE_CLICK
		); //取消双击追踪到该位置
		this.handler = new Cesium.ScreenSpaceEventHandler(this.viewer.scene.canvas);
		this.pointThing = {};
		this.changeNumbeer = 0;
		// this.wheelFn()
		// this.viewer.camera.setView({
		//     destination: Cesium.Rectangle.fromDegrees(89.5, 15.4, 115.4, 61.2),
		//     orientation: {
		//         heading: Cesium.Math.toRadians(0.0), // 方向
		//         //pitch : Cesium.Math.toRadians(0.0),// 倾斜角度
		//         roll: 0
		//     }
		// });
		let that = this;
		var previousPickedEntity = undefined;
		var Dom = document.getElementById(that.DomId);
		this.handler.setInputAction(function(movement) {
			var pickedPrimitive = that.viewer.scene.pick(movement.endPosition);
			var pickedEntity = Cesium.defined(pickedPrimitive) ? pickedPrimitive.id : undefined;
			Dom.style.cursor = 'default';
			if (Cesium.defined(previousPickedEntity)) {
				Dom.style.cursor = 'default';
				previousPickedEntity.billboard.scale = 1.0;
				// previousPickedEntity.billboard.color = Cesium.Color.WHITE;
			}
			if (Cesium.defined(pickedEntity) && Cesium.defined(pickedEntity.billboard)) {
				Dom.style.cursor = 'pointer';
				pickedEntity.billboard.scale = 2.0;
				// pickedEntity.billboard.color = Cesium.Color.ORANGERED;
				previousPickedEntity = pickedEntity;
			}
		}, Cesium.ScreenSpaceEventType.MOUSE_MOVE);
		this.viewer.clock.onTick.addEventListener(function() {
			if (that.viewer.camera.pitch != 0) {
				that.viewer.scene.screenSpaceCameraController.enableTilt = false;
			}
		});
	}
	async run() {
		console.log('开始渲染地图');
		this.viewer = new Cesium.Viewer(this.DomId, this.parms);
		this.viewer._cesiumWidget._creditContainer.style.display = 'none'; // 去掉版权标识
		await this.addImageryProviderFn();
		// this.addPiont()
		// this.flyToFn()
		console.groupEnd();
		this.BackHome();
	}
	/**
   *
   *
   * @memberof ThreeEarth 用来实例化增加imageryProvider参数
   */
	imageryProviderFn() {
		console.log('实例化增加imageryProvider参数');
		// this.parms.imageryProvider = new Cesium.WebMapTileServiceImageryProvider({
		//     url: "http://t0.tianditu.com/img_w/wmts?service=wmts&request=GetTile&version=1.0.0&LAYER=img&tileMatrixSet=w&TileMatrix={TileMatrix}&TileRow={TileRow}&TileCol={TileCol}&style=default&format=tiles",
		//     layer: "tdtVecBasicLayer",
		//     style: "default",
		//     format: "image/jpeg",
		//     tileMatrixSetID: "GoogleMapsCompatible",
		//     show: false
		// });
		var imgurl = 'http://mt1.google.cn/vt/lyrs=s&hl=zh-CN&x={x}&y={y}&z={z}&s=Gali'; //谷歌影像
		this.parms.imageryProvider = new Cesium.UrlTemplateImageryProvider({
			url: imgurl
		});
	}
	/**
   *
   *
   * @memberof ThreeEarth 添加天地图中文注记
   */
	addImageryProviderFn() {
		console.log('添加天地图中文注记');
		this.addin = this.viewer.imageryLayers.addImageryProvider(
			new Cesium.WebMapTileServiceImageryProvider({
				url:
					'http://t0.tianditu.com/cia_w/wmts?service=wmts&request=GetTile&version=1.0.0&LAYER=cia&tileMatrixSet=w&TileMatrix={TileMatrix}&TileRow={TileRow}&TileCol={TileCol}&style=default.jpg',
				layer: 'tdtAnnoLayer',
				style: 'default',
				format: 'image/jpeg',
				tileMatrixSetID: 'GoogleMapsCompatible',
				show: false
			})
		);
	}
	/**
   *
   *  添加标点
   * @param {string} [parms={
   *     name: "xuanwuhu",
   *     position: {
   *       lat: 118.793091,
   *       long: 32.07457,
   *     },
   *     point: {
   *       pixelSize: 5,    点的大小
   *       color: Cesium.Color.RED,   点的颜色
   *       outlineColor: Cesium.Color.WHITE,    轮廓颜色
   *       outlineWidth: 2    边框宽度
   *     },
   *     label: {
   *       text: "玄武湖",  显示的字符
   *       font: "14pt monospace",    字符的样式
   *       style: Cesium.LabelStyle.FILL_AND_OUTLINE,   样式
   *       outlineWidth: 2,     边框宽度
   *       verticalOrigin: Cesium.VerticalOrigin.BUTTON,      垂直位置
   *       pixelOffset: {     中心位置
   *         x: 0,
   *         y: 20,
   *       }
   *     }
   *   }]
   * @returns
   * @memberof ThreeEarth
   */
	addPiont(
		parms = {
			name: 'xuanwuhu',
			position: {
				lat: 118.793091,
				long: 32.07457
			},
			point: {
				pixelSize: 5,
				color: Cesium.Color.RED,
				outlineColor: Cesium.Color.WHITE,
				outlineWidth: 2
			},
			label: {
				text: '玄武湖',
				font: '14pt monospace',
				style: Cesium.LabelStyle.FILL_AND_OUTLINE,
				outlineWidth: 2,
				verticalOrigin: Cesium.VerticalOrigin.BUTTON,
				pixelOffset: {
					x: 0,
					y: 20
				}
			}
		}
	) {
		console.log('添加标点');
		parms.position = Cesium.Cartesian3.fromDegrees(parms.position.lon, parms.position.lat);
		parms.label.pixelOffset = new Cesium.Cartesian2(parms.label.pixelOffset.x, parms.label.pixelOffset.y);
		return this.viewer.entities.add(parms);
	}
	/**
   *
   *
   * @param {*} Piont   实例化标点返回的对象
   * @param {*} [parms={
   *     duration: 1,控制时间
   *   }]
   * @memberof ThreeEarth
   */
	flyToFn(
		Piont,
		parms = {
			duration: 5,
			angle: -540,
			frequency: 100000
		}
	) {
		console.log('地球跳转flyTo');
		if (!Piont) Piont = this.addPiont();
		if (!parms.offset) parms.offset = this.HeadingPitchRangeFn(parms);
		this.viewer.flyTo(Piont, parms);
	}
	/**
   *
   *
   * @param {*} [parms={
   *     direction: 0.0,    方向
   *     angle: -540,   倾斜角度
   *     frequency: 10000   翻滚次数
   *   }]
   * @returns   flyTo需要的offset参数
   * @memberof ThreeEarth
   */
	HeadingPitchRangeFn(
		parms = {
			direction: 0.0,
			angle: -540,
			frequency: 100000
		}
	) {
		console.log('flyTo需要的offset参数');
		console.log(parms);

		return new Cesium.HeadingPitchRange(parms.direction, Cesium.Math.toRadians(parms.angle), parms.frequency);
	}
	BackHome(lon = 39.916527, lat = 116.397128) {
		this.viewer.camera.flyTo({
			destination: Cesium.Cartesian3.fromDegrees(lat, lon, 21000000.0),
			duration: 5
		});
	}
	getHeight() {
		if (this.viewer) {
			let scene = this.viewer.scene;
			let ellipsoid = scene.globe.ellipsoid;
			let height = ellipsoid.cartesianToCartographic(this.viewer.camera.position).height;
			return height;
		}
	}
	enlarge() {
		if (this.changeNumbeer < 1200) return;
		else this.viewer.camera.zoomIn(this.changeNumbeer);
	}
	narrow() {
		if (this.changeNumbeer > 4000000) return;
		else this.viewer.camera.zoomOut(this.changeNumbeer);
	}
	curlingClose() {
		this.viewer.scene.imagerySplitPosition = 0; //分割位置
		// layers.remove();//删除图层
		this.layers.remove(this.layers.get(2));
		this.layers.remove(this.blackMarble);
	}
	curling(isSlilderShow) {
		this.layers = this.viewer.imageryLayers;
		// let layers = this.layers;
		// var tdtvec = new Cesium.WebMapServiceImageryProvider(this.pointThing.output);
		// this.blackMarble = layers.addImageryProvider(tdtvec); // 添加天地图
		// var getStyle = function(dom, attr) {
		//     return dom.currentStyle ? dom.currentStyle[attr] : getComputedStyle(dom, false)[attr];
		// }
		if (this.layers.contains(this.addin && this.glayer)) {
			let slider = document.getElementById(this.sliderId);
			this.slider = slider;
			if(isSlilderShow) {
				this.slider.style.display = 'block';
				this.glayer.splitDirection = Cesium.ImagerySplitDirection.RIGHT;
			} else {
				this.slider.style.display = 'none';
				this.glayer.splitDirection = Cesium.ImagerySplitDirection.NONE;
				return;
			}
			this.slider.style.left = '50%';
			let left = slider.offsetLeft / slider.parentElement.clientWidth;
			if (left == 0) {
				left = 0.5;
			}
			this.viewer.scene.imagerySplitPosition = left;
			let handler = new Cesium.ScreenSpaceEventHandler(slider);
			this.bMoveActive = false;
			var that = this;
			handler.setInputAction(function() {
				that.bMoveActive = true;
			}, Cesium.ScreenSpaceEventType.LEFT_DOWN);
			handler.setInputAction(function() {
				that.bMoveActive = true;
			}, Cesium.ScreenSpaceEventType.PINCH_START);

			handler.setInputAction(function(movement) {
				that.curlingMove(movement, that.bMoveActive);
			}, Cesium.ScreenSpaceEventType.MOUSE_MOVE);
			handler.setInputAction(function(movement) {
				that.curlingMove(movement, that.bMoveActive);
			}, Cesium.ScreenSpaceEventType.PINCH_MOVE);

			handler.setInputAction(function() {
				that.bMoveActive = false;
			}, Cesium.ScreenSpaceEventType.LEFT_UP);
			handler.setInputAction(function() {
				that.bMoveActive = false;
			}, Cesium.ScreenSpaceEventType.PINCH_END);
		} else {
			Notification.error({
			position: 'bottom-right',
			title: '请先进行检测!',
			duration: 1000,
			offset: 30
			})
		}
	}
	curlingMove(movement, Active) {
		if (!Active) return;
		var nMove = movement.endPosition.x; //- movement.startPosition.x;
		var splitPosition = (this.slider.offsetLeft + nMove) / this.slider.parentElement.offsetWidth;
		if (splitPosition < 0.001) {
			splitPosition = 0.001;
		}
		if (splitPosition > 0.996) {
			splitPosition = 0.996;
		}
		this.slider.style.left = 100.0 * splitPosition + '%';
		this.viewer.scene.imagerySplitPosition = splitPosition;
	}
	addShip(parms) {
		this.viewer.camera.flyTo({
			destination: Cesium.Cartesian3.fromDegrees(
				this.pointThing.position.lon,
				this.pointThing.position.lat,
				this.pointThing.position.height
			),
			duration: 5
		});
		if (!parms) return;
		var url = parms.url; //GeoServer wms服务
		var geolayer = new Cesium.createTileMapServiceImageryProvider({
			url: url
		});
		var imageryLayers = this.viewer.imageryLayers;
		this.glayer = imageryLayers.addImageryProvider(geolayer);
		// imageryLayers.raiseToTop(this.glayer);
		// parms.alpha &&
		//   (this.glayer.alpha = 0.5) &&
		//   (this.glayer.splitDirection = Cesium.ImagerySplitDirection.RIGHT);
		// this.glayer.brightness = 1.0;
	}
	addJson(jsonPath) {
		console.log('TCL: addJson -> jsonPath', jsonPath);
		const path = urlPath.home.getJeoJson;
		req.get(path, {
			targetId: jsonPath,
		}).then((req) => {
			if(req.data.result) {
				const data = JSON.parse(req.data.result.shapeGeoJson);
				// 需要先删除之前的数据
				this.viewer.dataSources.removeAll();
				var mylayer = this.viewer.dataSources.add(Cesium.GeoJsonDataSource.load(data));
				this.viewer.flyTo(mylayer, {
					duration: 1,
					//方向，倾斜角度，翻滚次数
					offset: new Cesium.HeadingPitchRange(0.0, Cesium.Math.toRadians(-540.0), 0)
				});
			} else {
				Notification.error({
					position: 'bottom-right',
					title: '暂无GeoJson数据!',
					duration: 1000,
					offset: 30
				})
			}
		})
		// var mylayer = this.viewer.dataSources.add(Cesium.GeoJsonDataSource.load(jsonPath));
		// // var mylayer = this.viewer.dataSources.add(Cesium.GeoJsonDataSource.load('1.geojson'));
		// this.viewer.flyTo(mylayer, {
		// 	duration: 1,
		// 	//方向，倾斜角度，翻滚次数
		// 	offset: new Cesium.HeadingPitchRange(0.0, Cesium.Math.toRadians(-540.0), 0)
		// });
	}
	Entity(parms) {
		// 构造固定实体
		parms.billboard = {
			//图标
			image: 'static/location.png',
			width: 25,
			height: 25
		};
		parms.positions = parms.position;
		(parms.position = Cesium.Cartesian3.fromDegrees(parms.position.lon, parms.position.lat, parms.position.height)),
			(parms.label = {
				//文字标签
				//   text: parms.name,
				//   font: "15pt monospace",
				style: Cesium.LabelStyle.FILL,
				outlineWidth: 2,
				verticalOrigin: Cesium.VerticalOrigin.BOTTOM, //垂直方向以底部来计算标签的位置
				pixelOffset: new Cesium.Cartesian2(0, -20) //偏移量
			});
		this.entyParms.push(parms);
		return new Cesium.Entity(parms);
	}
	entitiesAdd(arr) {
		// 添加实体
		if (arr instanceof Array) {
			arr.map((v) => {
				this.viewer.entities.add(v);
			});
		} else {
			this.viewer.entities.add(arr);
		}
	}
	removeAllEntity(arr) {
		// 移除实体
		this.viewer.entities.removeAll();
	}
	wheelFn(callBack) {
		//鼠标滚轮事件，接受参数滚动值
		this.handler.setInputAction(function(ment) {
			callBack(ment);
		}, Cesium.ScreenSpaceEventType.WHEEL);
	}
	mouseClick(callBack) {
		// 鼠标点击事件， 接受参数点击位置
		let that = this;
		this.handler.setInputAction(function(ment) {
			let pick = that.viewer.scene.pick(ment.position); //获取点击处的屏幕坐标
			if (pick && pick.id) {
				let name = pick.id.name; //获取点击处的标志名称
				that.nowEnty = that.entyParms.map((v) => (v.name = name));
				if (Cesium.defined(pick)) {
					console.log('TCL: mouseClick -> pick', pick);
					that.pointThing.output = pick.id.output;
					that.pointThing.input = pick.id.input;
					that.pointThing.position = pick.id.positions;
					that.pointThing.name = pick.id.id;
					console.log('that.pointThing: ', that.pointThing);
					if(that.slider) that.slider.style.display = 'none';
					callBack(ment, that.pointThing);
				}
			}
		}, Cesium.ScreenSpaceEventType.LEFT_CLICK);
	}
	mouseMove(callBack) {
		let that = this;
		this.handler.setInputAction(function(movement){
			var cartesian = that.viewer.camera.pickEllipsoid(movement.endPosition, ellipsoid); 
			var ellipsoid = that.viewer.scene.globe.ellipsoid; 
			if (cartesian) { //能获取，显示坐标
				var cartographic = ellipsoid.cartesianToCartographic(cartesian);
				callBack({
					lon: Cesium.Math.toDegrees(cartographic.longitude).toFixed(6),
					lat: Cesium.Math.toDegrees(cartographic.latitude).toFixed(6),
				})
			} else { //不能获取不显示
				callBack();
			}     
		},Cesium.ScreenSpaceEventType.MOUSE_MOVE);
	}
	cameraChanged(callBack) {
		let that = this;
		this.viewer.camera.changed.addEventListener(function(evt) {
			var labellen = that.viewer.entities.values.length;
			var height = that.viewer.camera.positionCartographic.height; //获取当前相机高度
			that.changeNumbeer = height / 5; //放大缩小间隔
			var viewbounds = that.getViewExtent(); //获取当前视野范围viewbounds对象
			var entities = that.viewer.entities; //获取entity
			var labelin = []; //落在当前视野范围内的标注；
			for (let i = 0; i < labellen; i++) {
				if (
					entities.values[i].positions.lon > viewbounds.southwest.lng &&
					entities.values[i].positions.lon < viewbounds.northeast.lng &&
					entities.values[i].positions.lat > viewbounds.southwest.lat &&
					entities.values[i].positions.lat < viewbounds.northeast.lat
				) {
					labelin.push(entities.values[i]); //获取当前视野范围的标注
				}
			}
			//   if (labelin.length > 1) {
			//     that.pointThing = {}
			//   }
			callBack(height, labellen, that.view, labelin.length);
		});
	}
	initial() {
		this.pointThing.position.height = 15000;
		this.viewer.camera.flyTo({
			destination: Cesium.Cartesian3.fromDegrees(
				this.pointThing.position.lon,
				this.pointThing.position.lat,
				this.pointThing.position.height
			),
			duration: 5
		});
	}
	goTo() {
		this.pointThing.position.height = 15000;
		this.addShip(this.pointThing.input);
		store.commit('CHANGE_LEFT_MENU_CLICIABLE', { ...store.state.leftMenuClickable, curling: true });
	}
	goTest() {
		if (!this.pointThing.output) {
			Notification.error({
				title: '暂无检测数据',
				duration: 1000,
				type: 'warning',
				position: 'bottom-right'
			});
			store.commit('CHANGE_LEFT_MENU_CLICIABLE', { ...store.state.leftMenuClickable, initial: false, curling: false });	
		}
		if(this.layers && this.layers.get(2)) { // 检测之前清除上次操作的残留图层
			this.curlingClose();
		}
		// this.pointThing.output.alpha = 0.5;
		// this.pointThing.position.height = 10000;
		// this.addShip(this.pointThing.output);
		this.addJson(this.pointThing.output.url);
		store.commit('CHANGE_LEFT_MENU_CLICIABLE', { ...store.state.leftMenuClickable, initial: true });
	}
	getViewExtent() {
		//获取当前视野的地理范围
		var rectangle = this.viewer.camera.computeViewRectangle();
		// 弧度转为经纬度
		var west = rectangle.west / Math.PI * 180; //西经
		var north = rectangle.north / Math.PI * 180; //北纬
		var east = rectangle.east / Math.PI * 180; //东经
		var south = rectangle.south / Math.PI * 180; //南纬
		var bounds = {
			southwest: {
				lng: west,
				lat: south
			},
			northeast: {
				lng: east,
				lat: north
			}
		};
		return bounds;
	}
	cameraRotate(flag) {
		if (!flag) {
			this.viewer.camera.flyTo({
				destination: Cesium.Cartesian3.fromDegrees(
					this.pointThing.position.lon,
					this.pointThing.position.lat,
					this.pointThing.position.height
				),
				duration: 2
			});
			return;
		}
		var viewbounds = this.getViewExtent(); //获取当前视野范围
		var longtmin = viewbounds.southwest.lng;
		var longtmax = viewbounds.northeast.lng;
		var jc = longtmax - longtmin; //获取经差
		//解决延迟现象
		this.viewer.camera.flyTo({
			destination: Cesium.Cartesian3.fromDegrees(
				this.pointThing.position.lon + jc / 8,
				this.pointThing.position.lat,
				this.pointThing.position.height
			),
			duration: 2
		});
	}
}
