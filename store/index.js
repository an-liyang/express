import Store from 'wxministore/index.js'
import { serviceModule } from './serviceModule/index.js'
import { myModule } from './myModule/index.js'
import {couponModule} from './couponModule/index.js'
export default new Store({
	state: {
		isRequest: false,
		isShowLoading:true,
		isCurNoNetwork:false,
		noNetworkImg:'./../images/no-network.png',
		sourceCar: '', // 跳转我的爱车来源
		isTipMask: false, //是否显示手机授权弹窗
		curClickAuthBtn: '', //当前需要点击的授权按钮类型
		navBkgColor: '#FF7700', //头部颜色
		navFontColor: '#fff',
		navBackIcon:
			'http://img1.bitauto.com/das/chehou_sass/sass_wx/nav-back-white.png',
		navHomeIcon:
			'http://img1.bitauto.com/das/chehou_sass/sass_wx/nav-back-home.png',
		topNavHeight: 60,
		...serviceModule.state,
		...myModule.state,
		...couponModule.state
	},
	methods: {
		...serviceModule.methods,
		...myModule.methods,
		...couponModule.methods,
		async initPageStatus(){
			getApp().store.setState({
				isRequest: false,
				isShowLoading:true,
				isCurNoNetwork:false,
			})
			await this.judgeNetwork()
		},
		judgeNetwork(){
			const _this =this;
			wx.getNetworkType({
				success(res) {
					const networkType = res.networkType
					console.log(res);
					if ("none" == networkType) {
						setTimeout(()=>{
							getApp().store.setState({
								isShowLoading:false,
								isCurNoNetwork:true
							})
							console.log('当前网络状态---------',getApp().store.getState().isCurNoNetwork)
						},5000)
						// _this.judgeNetwork();
					} else {
						console.log("当前没有关闭网络...")
					}
				},
				fail(err) {
					console.log('judgeNetwork  error...',err)
				}
			})
		}
	},
	pageListener: {
		onLoad(options) {
			console.log('我在' + this.route, '参数为', options)
			getApp().store.setState({
				isTipMask: false,
			})
		},
		onHide(){
			getApp().store.setState({
				isRequest: false,
				isCurNoNetwork:false,
				isShowLoading:true
			})
		},
		onShow() {
			getApp().store.setState({
				isRequest: false,
				isTipMask: false,
				// isShowLoading:true,
				isCurNoNetwork:false,
			})
			this.judgeNetwork()
		},
		onHide() {},
	},
	// 开启了局部模式
	// openPart: true,
})
