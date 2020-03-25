export default function processPolygonString2PolygonArray(polygonString) {
	var geoJson = {}

	if (polygonString.startsWith('MULTIPOLYGON')) {
		// 多面
		geoJson['type'] = 'MultiPolygon'

		var firstLeftIndex = polygonString.indexOf('(')
		// 去掉首尾括号
		var str = polygonString.substring(firstLeftIndex + 1, polygonString.length - 1) // ((),(),()) , ((),(),()) , ((),(),())
		// console.log(str);

		var pArray = new Array()
		var polygonArray = str.split(')),((')
		for (var i = 0; i < polygonArray.length; i++) {
			var pStr = polygonArray[i] //每个polygon的String
			if (polygonArray.length === 1) {
				//如果只有1个，说明没有被分割
				// 去掉第一个( 去掉结尾)
				pStr = pStr.substring(1, pStr.length - 1)
			} else if (i === 0) {
				// 第一个，去第一个( 补结尾加上 )
				pStr = pStr.substring(1, pStr.length) + ')' // (),(),() 环的集合
			} else if (i === polygonArray.length - 1) {
				// 最后一个: 补第一个( ， 去 最后一个)
				pStr = '(' + pStr.substring(0, pStr.length - 1)
			} else {
				// 中间，补第一个( 补最后一个 )
				pStr = '(' + pStr + ')'
			}

			// pStr 表示 () , () ,() 线环集合

			// 分割环
			var rArray = new Array()
			var ringsArray = pStr.split('),(')
			for (var j = 0; j < ringsArray.length; j++) {
				var ringStr = ringsArray[j]

				if (ringsArray.length === 1) {
					// 去掉第一个( 去掉结尾 )
					ringStr = ringStr.substring(1, ringStr.length - 1)
				} else if (j === 0) {
					// 如果是第一个
					// 去掉第一个(
					ringStr = ringStr.substring(1, ringStr.length)
				} else if (j === ringsArray.length - 1) {
					// 最后一个
					// 去掉结尾 )
					ringStr = ringStr.substring(0, ringStr.length - 1)
				}

				// 再按逗号分割就是点集合
				var ptsArray = new Array()
				var pointArr = ringStr.split(',')
				for (var k = 0; k < pointArr.length; k++) {
					var pt_arr = pointArr[k].replace(/(^\s*)|(\s*$)/g, '').split(' ')
					var proj_arr = [ pt_arr[0], pt_arr[1] ]

					ptsArray.push(proj_arr)
				}

				rArray.push(ptsArray)
			}
			pArray.push(rArray)
		}

		//console.log(JSON.stringify(pArray));

		geoJson['coordinates'] = pArray
	} else if (polygonString.startsWith('POLYGON')) {
		// 面，其中有可能有环
		geoJson['type'] = 'Polygon'
		var firstLeftIndex = polygonString.indexOf('(')
		var lastRightIndex = polygonString.indexOf(')')
		// 去掉首尾括号
		var str = polygonString.substring(firstLeftIndex + 1, polygonString.length - 1) // (),(),()

		var rArray = new Array()
		var ringsArray = str.split('),(')
		for (var j = 0; j < ringsArray.length; j++) {
			var ringStr = ringsArray[j]

			if (ringsArray.length === 1) {
				// 去掉第一个( 去掉结尾 )
				ringStr = ringStr.substring(1, ringStr.length - 1)
			} else if (j === 0) {
				// 如果是第一个
				// 去掉第一个(
				ringStr = ringStr.substring(1, ringStr.length)
			} else if (j === ringsArray.length - 1) {
				// 最后一个
				// 去掉结尾 )
				ringStr = ringStr.substring(0, ringStr.length - 1)
			}

			// 再按逗号分割就是点集合
			var ptsArray = new Array()
			var pointArr = ringStr.split(',')
			for (var k = 0; k < pointArr.length; k++) {
				var pt_arr = pointArr[k].split(' ')
				var proj_arr = [ pt_arr[0], pt_arr[1] ]

				ptsArray.push(proj_arr)
			}

			rArray.push(ptsArray)
		}

		geoJson['coordinates'] = rArray
	}
	return geoJson
}
