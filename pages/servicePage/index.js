// pages/servicePage/index.js
const app = getApp()
import { baseInfoJudge } from './../../utils/functional/index.js'
import {setNavFunc} from './../../utils/setNavStyleFunc.js'
import { login } from './../../utils/functional/loginAuth.js'
const log =require('./../../utils/log.js')
Page({
	data: {
		isClicked: false
	},
	onPageScroll(e){
		setNavFunc(e,app)
	},
	// 绑定爱车
	toBoundCar: function () {
		if(app.globalData.isAuthAll){
			wx.navigateTo({
				url: '../boundCar/index?type=add&isset=false',
			});
    }else{
			 // 是否可点击判断，授权接口api不支持在节流回调里调用
			 if(this.data.isClicked){return false}
			 this.setData({
				 isClicked: true,
			 })
			 const _this=this;
			 setTimeout(()=>{
				 _this.setData({
					 isClicked: false
				 })
			 },2000)
			// 标注当前授权按钮的类型，用以手机授权成功的页面更新回调
			app.store.setState({
				curClickAuthBtn: 'boundCar'
			})
			baseInfoJudge(()=>{
				// 用户信息授权成功，刷新页面
				app.store.setState({
					active: 'boundCar',
				});
				wx.navigateTo({
					url: '../boundCar/index?type=add&isset=false',
				});
			})
		}
	},
	// 手机号授权成功
	updatePageFunc() {
		// 首页授权按钮的类型：boundCar
		const getCurType=app.store.getState().curClickAuthBtn
		if(getCurType=='boundCar') {
			app.store.setState({
				active: 'boundCar',
			});
			wx.navigateTo({
				url: '../boundCar/index?type=add&isset=false',
			});
		}
	},
	async reLoad(){
		try{
			const _this =this;
			await this.initPageStatus()
			// login().then(res => {
				setTimeout(()=>{
					_this.requestDefaultCar()
					_this.requestGoodsList()
					_this.requestCouponList()
				},800)
			// })
		}catch(err){
			wx.showToast({
				title: '网络开小差了',
				icon: 'none',
				duration: 2000
			})
		}
	},
	// 跳转详情
	toDetail: async function (e) {
		await this.judgeNetwork()
		if(app.store.getState.isCurNoNetwork){
			wx.showToast({
				title: '网络开小差了',
				icon: 'none',
				duration: 2000,
			})
			return;
		}
		console.log("--------------------------toDetail")
		wx.navigateTo({
			url: `../goodsDetail/index?spuId=${e.currentTarget.dataset.spuid}&bussinessId=${app.globalData.bussinessId}`,
		});
	},
	/**
	 * 生命周期函数--监听页面加载
	 */
	onLoad: async function (options) {
		console.log(options)
		if(options && options.bussinessId){
			wx.setStorage({
				key: 'bussinessId',
				data: options.bussinessId,
			})
			app.globalData.bussinessId = options.bussinessId
			// login()
		}
		console.log("onLoad-当前首页请求数据参数",wx.getStorageSync('token'),app.globalData.bussinessId,app.globalData.bussinessId)
		log.info("onLoad-当前首页请求数据参数",wx.getStorageSync('token'),app.globalData.bussinessId,app.globalData.bussinessId)
	},
	/**
	 * 生命周期函数--监听页面显示
	 */
	onShow: async function (options) {
		this.initPageStatus();
		// 打开调试
		// wx.setEnableDebug({
		// 	enableDebug: true
		// })
		app.store.setState({
      navBkgColor:'#FF7700',
			navFontColor:'#FFFFFF',
			navBackIcon:'http://img1.bitauto.com/das/chehou_sass/sass_wx/nav-back-white.png',
		})
		app.store.setState({
			'goodsListParams.current': 1,
			'goodsListParams.total': null,
			isMore: true,
			goodsListData: Array.from([]),
			isShowLoading:true,
			'couponListParams.current': 1,
			'couponListParams.total': null,
			couponListData: Array.from([]),
		})
		console.log("onShow-当前首页请求数据参数",wx.getStorageSync('token'),app.globalData.bussinessId)
		log.info("onShow-当前首页请求数据参数",wx.getStorageSync('token'),app.globalData.bussinessId)
		try{
			const _this=this;
			login().then(res => {
				// setTimeout(()=>{
					console.log("登录完成，开始请求商品信息",wx.getStorageSync('token'))
					app.getStoreInfo()
					_this.requestDefaultCar()
					_this.requestGoodsList()
					_this.requestCouponList()
				// },1000)
			})
		}catch(err){
			wx.showToast({
				title: '网络开小差了',
				icon: 'none',
				duration: 2000
			})
		}
		
		// 自定义tabbar
		if (typeof this.getTabBar === 'function' && this.getTabBar()) {
			this.getTabBar().setData({
				selected: 0, //数字是当前页面在tabbar的索引
			})
		}
	},
	onHide: function (){
		app.store.setState({
			isRequest: false
		})
	},
	/**
 * 页面相关事件处理函数--监听用户下拉动作
 */
	onPullDownRefresh: async function () {
		this.initPageStatus()
		app.store.setState({
			'goodsListParams.current': 1,
			'goodsListParams.total': null,
			isMore: true,
			isShowLoading:true,
			goodsListData: Array.from([]),
			'couponListParams.current': 1,
			'couponListParams.total': null,
			couponListData: Array.from([])
		})
		await this.requestCouponList()
		await this.requestGoodsList()
		// 停止下拉刷新
		wx.stopPullDownRefresh()
	},
	/**
	 * 页面上拉触底事件的处理函数
	 */
	onReachBottom: async function () {
		this.initPageStatus()
		if (app.store.getState().goodsListParams.total && app.store.getState().goodsListData.length >= app.store.getState().goodsListParams.total) {
			app.store.setState({
				isShowLoading:false
			})
			console.log("数据加载完毕...")
			app.store.setState({
				isMore: false
			})
			return;
		}
		// 停止下拉刷新
		wx.stopPullDownRefresh();
		await this.requestCouponList()
		await this.requestGoodsList();
	},

	onShareAppMessage(res) {
		var _this = this;
		var pages = getCurrentPages();    //获取加载的页面
		var currentPage = pages[pages.length - 1];  //获取当前页面的对象
		var url = currentPage.route;  //当前页面url
		url += "?bussinessId=" + app.globalData.bussinessId;
		console.log("分享url：" + url)
		return {
			title: app.store.$state.storeInfo.tenantName,
			path: url,
			imageUrl: 'http://img1.bitauto.com/das/chehou_sass/sass_wx/share.png'
		}
	},
})
