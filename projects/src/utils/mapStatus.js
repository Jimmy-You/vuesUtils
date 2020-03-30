//定义定位信息图层方法
var Status = function (map, bottom, left, coordSystem) {
	var self = this
	this.dom = document.createElement('div')
	this.dom.id = 'box'
	this.dom.style.left = left ? `${left}px` : '0'
	this.dom.style.bottom = bottom == undefined ? '150px' : bottom + 'px'
	this.dom.style.position = 'absolute'
	//this.dom.style.width = "600px";
	this.dom.style.width = '160px'
	this.dom.style.zIndex = 1
	this.dom.style.color = '#fff'
	// this.dom.style.padding = '10px'
	this.dom.style.backgroundColor = "rgba(0,0,0,0.6)";

	var status3 = document.createElement('div')
	status3.id = 'status3'
	status3.style.fontSize = '8px'
	status3.style.height = '20px'
	this.dom.appendChild(status3)

	// var status1 = document.createElement("div");
	// status1.id = "status1";
	// status1.style.height = "20px";
	// this.dom.appendChild(status1);

	var status = document.createElement('div')
	status.id = 'status'
	status.style.fontSize = '8px'
	status.style.height = '20px'
	this.dom.appendChild(status)

	// var status2 = document.createElement("div");
	// status2.id = "status2";
	// status2.style.height = "20px";
	// this.dom.appendChild(status2);
	var poi = {
		x: map.getCenter().lng,
		y: map.getCenter().lat
	}
	function _getLngLat(poi) {
		var lnglat = {}
		if (coordSystem) {
			lnglat.lng = poi.x / 20037508.34 * 180
			var mmy = poi.y / 20037508.34 * 180
			lnglat.lat = 180 / Math.PI * (2 * Math.atan(Math.exp(mmy * Math.PI / 180)) - Math.PI / 2)
		} else {
			lnglat.lng = poi.x
			lnglat.lat = poi.y
		}
		return lnglat
	}

	// status2.innerHTML = ("层级：" + parseInt(map.getZoom()))
	status3.innerHTML = '缩放等级:' + Math.floor(Math.pow(2, 23 - parseInt(map.getZoom())) * 70.53 / 100) * 100
	status.innerHTML = '中心点(' + _getLngLat(poi).lng.toFixed(4) + ',' + ' ' + _getLngLat(poi).lat.toFixed(4) + ')'
	map.on('move', function (e) {
		var poi = {
			x: map.getCenter().lng,
			y: map.getCenter().lat
		}
		function _getLngLat(poi) {
			var lnglat = {}
			if (coordSystem) {
				lnglat.lng = poi.x / 20037508.34 * 180
				var mmy = poi.y / 20037508.34 * 180
				lnglat.lat = 180 / Math.PI * (2 * Math.atan(Math.exp(mmy * Math.PI / 180)) - Math.PI / 2)
			} else {
				lnglat.lng = poi.x
				lnglat.lat = poi.y
			}
			return lnglat
		}

		// status2.innerHTML = ("层级：" + parseInt(map.getZoom()))
		// status1.innerHTML = ("系数：" + Math.pow(2, (23 - parseInt(map.getZoom()))))
		status3.innerHTML = 'scale 1:' + Math.floor(Math.pow(2, 23 - parseInt(map.getZoom())) * 70.53 / 100) * 100
		status.innerHTML = 'center(' + _getLngLat(poi).lng.toFixed(4) + ',' + ' ' + _getLngLat(poi).lat.toFixed(4) + ')'
		// status2.innerHTML = ( " 视角范围:" + "("+map.getBounds()[0].toFixed(2)+","+ " " +map.getBounds()[1].toFixed(2) +")" + " "
		//     +"("+map.getBounds()[2].toFixed(2)+"," + " "+map.getBounds()[3].toFixed(2) +")");
	})
	// map.on("mousemove", function (e) {
	//     //console.log(e);
	//     status1.innerHTML = ("   定位经纬度：" +"(" + e.coordinate[0].toFixed(2) +","+ " "+ e.coordinate[1].toFixed(2)+")");
	// });
	// map.on("click", function (e) {
	//     // console.log(e);
	//     status1.innerHTML = ("   定位经纬度：" +"(" + e.coordinate[0].toFixed(2) +","+ " "+ e.coordinate[1].toFixed(2)+")");
	// })
}

export default Status;
