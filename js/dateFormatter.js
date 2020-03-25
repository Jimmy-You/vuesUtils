// 日期格式化函数
export default function dateFormatter(type, date) {
	if (date == '') return ''; // 处理组件默认值
	if (!(date instanceof Date)) throw new Error("请传入Date对象");
	switch (type) {
		case 'yyyy':
			return `${date.getFullYear()}`
		case 'MM.d':
			return `${(date.getMonth() + 1).toString()}.${date.getDate().toString()}`
		case 'yyyy-MM':
			return `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, 0)}-${date.getDate().toString().padStart(2, 0)}`
		case 'yyyy-MM-dd':
			return `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, 0)}-${date.getDate().toString().padStart(2, 0)}`
		case 'yyyy年MM月dd日':
			return `${date.getFullYear()}年${(date.getMonth() + 1).toString().padStart(2, 0)}月${date.getDate().toString().padStart(2, 0)}日`
		case 'yyyy年MM月dd日 HH:mm:ss':
			return `${date.getFullYear()}年${(date.getMonth() + 1).toString().padStart(2, 0)}月${date.getDate().toString().padStart(2, 0)}日${date.getHours().toString().padStart(2, 0)}:${date.getMinutes().toString().padStart(2, 0)}:${date.getSeconds().toString().padStart(2, 0)}`
		case 'yyyy-MM-dd HH:mm:ss':
			return `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, 0)}-${date.getDate().toString().padStart(2, 0)} ${date.getHours().toString().padStart(2, 0)}:${date.getMinutes().toString().padStart(2, 0)}:${date.getSeconds().toString().padStart(2, 0)}`
			case 'yyyy-MM-dd HH:mm':
				return `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, 0)}-${date.getDate().toString().padStart(2, 0)} ${date.getHours().toString().padStart(2, 0)}:${date.getMinutes().toString().padStart(2, 0)}`
		default:
			return date.toString();
	}
}