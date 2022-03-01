const calcTimeDistance=(expire)=>{
	// console.log('当前过期时间为:',expire)
	if(!expire){return}
	var nowtime = new Date(),  //获取当前时间
				endtime = new Date(expire.replace(/-/g, "/"));  //定义结束时间
		var lefttime = endtime.getTime() - nowtime.getTime(),  //距离结束时间的毫秒数
        leftd = Math.floor(lefttime/(1000*60*60*24)),  //计算天数
        lefth = Math.floor(lefttime/(1000*60*60)%24),  //计算小时数
        leftm = Math.floor(lefttime/(1000*60)%60),  //计算分钟数
				lefts = Math.floor(lefttime/1000%60);  //计算秒数
				if(lefth<0||leftm<0||lefts<0){
					return '00:00:00'
				}
				// leftd + "天" + 
		// console.log('处理后的时间为：',PrefixZero(lefth,2) + ":" + PrefixZero(leftm,2) + ":" + PrefixZero(lefts,2))
    return PrefixZero(lefth,2) + ":" + PrefixZero(leftm,2) + ":" + PrefixZero(lefts,2);  //返回倒计时的字符串
}

function PrefixZero(num,n) {
	return (Array(n).join('0') + num).slice(-n);
}

const formatTime = (date) => {
	const year = date.getFullYear()
	const month = date.getMonth() + 1
	const day = date.getDate()
	const hour = date.getHours()
	const minute = date.getMinutes()
	const second = date.getSeconds()

	return `${[year, month, day].map(formatNumber).join('/')} ${[
		hour,
		minute,
		second,
	]
		.map(formatNumber)
		.join(':')}`
}

const formatNumber = (n) => {
	n = n.toString()
	return n[1] ? n : `0${n}`
}
// 根据经纬度计算距离
// lat1用户的纬度
// lng1用户的经度
// lat2商家的纬度
// lng2商家的经度
const getDistance = (lat1, lng1, lat2, lng2) => {
	const radLat1 = Rad(lat1)
	const radLat2 = Rad(lat2)
	const a = radLat1 - radLat2
	const b = Rad(lng1) - Rad(lng2)
	let s =
		2 *
		Math.asin(
			Math.sqrt(
				Math.pow(Math.sin(a / 2), 2) +
					Math.cos(radLat1) * Math.cos(radLat2) * Math.pow(Math.sin(b / 2), 2)
			)
		)
	s = s * 6378.137
	s = Math.round(s * 10000) / 10000
	s = s.toFixed(1) + 'km' //保留两位小数
	return s
}
//根据经纬度判断距离
const rad = (d) => {
	return (d * Math.PI) / 180.0
}
// 呼起客服弹窗
const customerService = () => {
	wx.showActionSheet({
		itemList: [app.globalData.serviceTel],
		success(res) {
			wx.makePhoneCall({
				phoneNumber: app.globalData.serviceTel,
				complete: function () {
					wx.hideLoading()
				},
			})
		},
	})
}
const getScene = (scene = "")=> {
	if (scene == "") return {}
	let res = {}
	let params = decodeURIComponent(scene).split("&")
	params.forEach(item => {
		let pram = item.split("=")
		res[pram[0]] = pram[1]
	})
	return res
}

module.exports = {
	formatTime,
	getDistance,
	customerService,
	calcTimeDistance,
	getScene
}
