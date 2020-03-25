export function getByteLength(str) {
	var bytesCount = 0;  
	for (var i = 0 ,n = str.length; i < n; i++) {  
			var c = str.charCodeAt(i);  
			if ((c >= 0x0001 && c <= 0x007e) || (0xff60<=c && c<=0xff9f)) {  
					bytesCount += 1;  
			} else {  
					bytesCount += 2;  
			}  
	}  
	return bytesCount;
}
/**
 * 主要用于将整段的字符串根据要展示的字节长度进行截取
 * @param {*} str 原始字符串
 * @param {*} len 返回字符串的字节长度
 * @param {*} endstr 末尾使用的字符串 非必填
 * 
 */
export function cutByByte(str, len, endstr) {
	var len = +len,
	endstr = typeof(endstr) == 'undefined' ? "..." : endstr.toString(),
	endstrBl = getByteLength(endstr);
	if(getByteLength(str) <= len) return str;
	function n2(a) {var n = a / 2 | 0; return (n > 0 ? n : 1)}//用于二分法查找
	if (!(str + "").length || !len || len <= 0) {
			return "";
	}
	if(len<endstrBl){
			endstr = "";
			endstrBl = 0;
	}
	var lenS = len - endstrBl,
	_lenS = 0,
	_strl = 0;
	while (_strl <= lenS) {
			var _lenS1 = n2(lenS - _strl),
			addn = getByteLength(str.substr(_lenS, _lenS1));
			if (addn == 0) {return str;}
			_strl += addn
			_lenS += _lenS1
	}
	if(str.length - _lenS > endstrBl || getByteLength(str.substring(_lenS-1))>endstrBl){
			return str.substr(0, _lenS - 1) + endstr
	}else{
			return str;
	}    
}