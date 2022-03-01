// pages/myPage/index.js
const app = getApp()
import { baseInfoJudge } from './../../utils/functional/index.js'
import { getPersonalCenterInfo } from './../../apis/common.js'
// import { login} from './../../utils/functional/loginAuth.js'
// import {setNavFunc} from './../../utils/setNavStyleFunc.js'
Page({
	/**
	 * 页面的初始数据
	 */
	data: {
		isClicked: false,
		isClickAuthBtn:true,
		isShow: false,
		orderModule: [
			{
				img: './../../images/my-unpay-icon.png',
				txt: '待支付',
				type:'pay'
			},
			{
				img: './../../images/my-service-icon.png',
				txt: '待服务',
				type:'service'
			},
			{
				img: './../../images/my-close-icon.png',
				txt: '已关闭',
				type:'close'
			},
			{
				img: './../../images/my-finish-icon.png',
				txt: '已完成',
				type:'finish'
			},
		],
		centerInfoData: {},
		storeInfo:{}
	},
	/**
	 * 生命周期函数--监听页面加载
	 */
	onLoad: function (options) {
	},
		/**
	 * 生命周期函数--监听页面显示
	 */
	onShow: async function () {
		this.setData({
			'isClickAuthBtn':true
		})
		app.store.setState({
      navBkgColor:'#F7F7F9',
      navFontColor:'#292522',
      navBackIcon:'http://img1.bitauto.com/das/chehou_sass/sass_wx/nav-back.png',
    })
		await app.getStoreInfo()
		const _this=this;
		setTimeout(()=>{
			wx.getStorage({
				key: 'storeInfo',
				success (res) {
					_this.setData({
						'storeInfo':Object.assign({},res.data)
					})
				}
			})
		},500)
		// 获取我的页面数据
		// login().then(res=>{
			_this.getPersonCenterData()
		// })
		// 自定义tabbar
		if (typeof this.getTabBar === 'function' && this.getTabBar()) {
			this.getTabBar().setData({
				selected: 1, //数字是当前页面在tabbar的索引
			})
		}
	},
	getPersonCenterData(){
		console.log("进入到个人中心接口请求函数...")
		const _this =this;
		getPersonalCenterInfo({ bussinessId: app.globalData.bussinessId })
		.then((res) => {
			if (res.Success) {
				_this.setData({
					centerInfoData: res.Data,
				})
				// 是否授权完成
				if(res.Data.wechatPhone){
					app.globalData.isAuthAll = true
				}
				console.log('个人中心接口成功：', res)
			}
		})
		.catch((err) => {
			console.log('个人中心接口失败：', err)
			wx.showToast({
        title: err.Msg||'网络开小差了',
        icon: 'none',
        duration: 2000,
      })
		})
	},
	gotoMap: function (e) {
			const _this=this;
			const latitude= parseFloat(_this.data.storeInfo.tenantAddressLatitude);
			const longitude = parseFloat(_this.data.storeInfo.tenantAddressLongitude);
			console.log(latitude,longitude)
			wx.openLocation({
				latitude:latitude
				, longitude:longitude
				, name: _this.data.storeInfo.tenantName,
				address: _this.data.storeInfo.tenantDetailedAddress
				, success: function (res) {
					console.log(res)
				}
				,fail:function(err){
					console.log(err)
					wx.showToast({
						title: err.Msg||'网络开小差了',
						icon: 'none',
						duration: 2000,
					})
				}
			})
			console.log(e);
	},
	handleToOrderList(e){
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
			curClickAuthBtn:e.currentTarget.dataset.type
		})
		baseInfoJudge(()=>{
			// 用户信息授权成功，刷新页面
			app.store.setState({
				active: e.currentTarget.dataset.type,
			});
			wx.navigateTo({
				url: '/pages/orderList/index?accountInfo=' + JSON.stringify(111)
			})
		})
	},
	handleToCall() {
		const getPhone=this.data.storeInfo.tenantAppointmentPhone?this.data.storeInfo.tenantAppointmentPhone:'4000168168'
		wx.showActionSheet({
				itemList: [getPhone],
				success(res) {
						wx.makePhoneCall({
								phoneNumber: getPhone
						})
				},
				fail(res) {
						// console.log('wx.showActionSheet拉起异常', res.errMsg)
						// wx.showToast({
						// 	title: res.Msg||'网络开小差了',
						// 	icon: 'none',
						// 	duration: 2000,
						// })
				}
		})
	},
	// 手机号授权成功，更新页面
	hupdatePageFunc(){
		// 我的页面授权按钮的类型：curClickAuthBtn、orderList
		const getCurType=app.store.getState().curClickAuthBtn
		switch(getCurType){
			case 'defalutAuthBtn':
				this.getPersonCenterData()
			break;
			case 'myCar':
				this.getPersonCenterData()
				wx.navigateTo({
					url: '/pages/myLoveCar/index?type=look&source=my'
				})
			break;
			case 'myCoupon':
				this.getPersonCenterData()
				wx.navigateTo({
          url: '/pages/myCoupon/index'
        })
			break;
			case 'History':
				this.getPersonCenterData()
				wx.navigateTo({
					url: '/pages/historyStorePage/index'
				})
			break;
			default:
				app.store.setState({
					active: getCurType,
				});
				wx.navigateTo({
					url: '/pages/orderList/index?accountInfo=' + JSON.stringify(111)
				})
			break;
		}
	},
	getUserProfile(e) {
		const _this = this
	 // 是否可点击判断，授权接口api不支持在节流回调里调用
	 if(this.data.isClicked){return false}
	 this.setData({
		 isClicked: true,
	 })
	 setTimeout(()=>{
		 _this.setData({
			 isClicked: false
		 })
	 },2000)
		app.store.setState({
			curClickAuthBtn:'defalutAuthBtn'
		})
		baseInfoJudge(()=>{
			// 用户信息授权成功，刷新页面
			_this.getPersonCenterData()
			console.log("刷新页面...")
		})
	},
	/**
	 * 生命周期函数--监听页面隐藏
	 */
	onHide: function () {},

	/**
	 * 生命周期函数--监听页面卸载
	 */
	onUnload: function () {},

	/**
	 * 页面相关事件处理函数--监听用户下拉动作
	 */
	onPullDownRefresh: function () {},

	/**
	 * 页面上拉触底事件的处理函数
	 */
	onReachBottom: function () {},
})
