// app.js
import store from './store/index.js'
import { getShopInfo } from './apis/common.js'
import { login } from './utils/functional/loginAuth.js'
import { getScene } from './utils/util.js'
const Config = require('./config.js')
const log = require('./utils/log.js')

App({
	store,
	useStore: true,
	globalData: {
		isAuthAll: false,
		isLogin: false,
		isHavePhone: false,
		isHaveUserInfo: false,
		systeminfo: false, //系统信息
		headerBtnPosi: false, //头部菜单高度
		bussinessId: '',
	},
	onLaunch(options) {
		console.log('app.js获取的参数：', options)
		log.info('app.js获取的参数：', options)
		// wx.clearStorage()  //主要作用是在开发环境切换环境时，清楚开发者工具里的缓存，因为不清空，会造成邮件报警
	},
	// 热启动时--onshow中参数为最新的
	async onShow(options) {
		console.log('app.js获取的参数onShow：', options)
		const _this =this;
		await _this.setBusinessId(options)
		// 热加载的加载的时候初始化授权状态
		_this.globalData.isAuthAll = false;
	},
	// 获取商户id
	async setBusinessId(options) {
		const _this = this
		if (options.query && options.query.bussinessId) {
			wx.setStorage({
				key: 'bussinessId',
				data: options.query.bussinessId,
			})
			_this.globalData.bussinessId = options.query.bussinessId
		} else if (options.query && options.query.scene) {
			//从后端生成的二维码进入页面
			console.log('从二维码原始传参:', options)
			console.log('getScene处理后的二维码参数：', getScene(options.query.scene))
			const getObj = getScene(options.query.scene)
			wx.setStorage({
				key: 'bussinessId',
				data: getObj.bussinessId,
			})
			_this.globalData.bussinessId = getObj.bussinessId
		} else {
			wx.getStorage({
				key: 'bussinessId',
				success(res) {
					if (res.data) {
						_this.globalData.bussinessId = res.data
						wx.setStorage({
							key: 'bussinessId',
							data: res.data, //默认
						})
					} else {
						_this.globalData.bussinessId = Config['Bussiness_ID']
						wx.setStorage({
							key: 'bussinessId',
							data: Config['Bussiness_ID'], //默认
						})
					}
				},
				fail() {
					_this.globalData.bussinessId = Config['Bussiness_ID']
					wx.setStorage({
						key: 'bussinessId',
						data: Config['Bussiness_ID'], //默认
					})
				},
			})
		}
		console.log('当前页面的bussinessId为：', wx.getStorageSync('bussinessId'))
		log.info('当前页面的bussinessId为：', wx.getStorageSync('bussinessId'))
		// await login().then(()=>{
		// 	console.log("登录成功...")
		// 	_this.getStoreInfo()
		// }).catch(err=>{
		// 	console.log("登录失败...")
		// })
		
	},
	// 获取商户信息
	getStoreInfo() {
		const _this = this
		wx.getStorage({
			key: 'bussinessId',
			success(res) {
				_this.globalData.bussinessId = res.data
				// 获取店铺信息
				getShopInfo({ bussinessId: _this.globalData.bussinessId })
					.then((res) => {
						console.log('获取门店信息成功：', res)
						if (res.Success) {
							wx.setStorage({
								key: 'storeInfo',
								data: res.Data,
							})
							_this.store.setState({
								'storeInfo.tenantAddressLatitude':
									res.Data.tenantAddressLatitude,
								'storeInfo.tenantAddressLongitude':
									res.Data.tenantAddressLongitude,
								'storeInfo.tenantAppointmentPhone':
									res.Data.tenantAppointmentPhone,
								'storeInfo.tenantBussinessHours': res.Data.tenantBussinessHours,
								'storeInfo.tenantDetailedAddress':
									res.Data.tenantDetailedAddress,
								'storeInfo.tenantMainBusiness': res.Data.tenantMainBusiness,
								'storeInfo.tenantName': res.Data.tenantName,
							})
							console.log(_this.store.getState().storeInfo.tenantName)
						}
					})
					.catch((err) => {
						console.log('获取门店信息失败：', err)
					})
			},
		})
	},
})
