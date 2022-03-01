// const app = getApp()
import { getGoodsList } from './../../apis/goodsRelationApis.js'
import { getDefaultCar } from './../../apis/carRelationApis.js'
import { getCouponList, goodsCouponList } from './../../apis/couponRelationApi.js'
export const serviceModule = {
	state: {
		// 商品列表
		goodsListParams: {
			current: 1,
			pageSize: 10,
			total: null,
		},
		goodsListData: [],
		isMore: true,
		isHasCar: false, // 是否绑车
		defaultCar: {}, // 默认爱车
		storeInfo: {}, // 商户信息
		// 优惠券列表-首页
		couponListParams: {
			current: 1,
			pageSize: 5,
			total: null,
		},
		couponListData: [],
		// 商品可用优惠券
		goodsCouponListParams: {
			spuIds: []
		}
	},
	methods: {
		// 商品标签
		requestGoodsCouponList() {
			goodsCouponList(getApp().store.getState().goodsCouponListParams)
				.then((res) => {
					if (res.Success) {
						res.Data = res.Data || []
						getApp().store.getState().goodsListData.forEach((item,index)=>{
							res.Data.forEach((items)=>{
								if(item.spuId == items.spuId){
									let change = "goodsListData["+ index +"].coupons";
									getApp().store.setState({
										[change]: items.list
									})
								}
							})
						})
					}
					// console.log(getApp().store.getState().goodsListData,9999);
					// console.log('商品优惠券:', res)
				})
				.catch((err) => {
					console.log('商品优惠券:', err)
				})
			},
		// 优惠券
		requestCouponList() {
			getCouponList(getApp().store.getState().couponListParams)
				.then((res) => {
					if (res.Success) {
						getApp().store.setState({
							couponListData: res.Data.records.length<=3?res.Data.records:res.Data.records.slice(0,3),
						})
					}
					console.log('优惠券请求成功:', res)
				})
				.catch((err) => {
					console.log('优惠券请求失败:', err)
				})
		},
		// 默认车辆
		requestDefaultCar() {
			getDefaultCar()
				.then((res) => {
					if (res.Success) {
						if (res.Data.id) {
							getApp().store.setState({
								defaultCar: res.Data,
								isHasCar: true,
							})
						} else {
							getApp().store.setState({
								isHasCar: false,
							})
						}
					}
					console.log('默认车辆请求成功:', res)
				})
				.catch((err) => {
					console.log('默认车辆请求失败:', err)
				})
		},
		// 商品列表
		requestGoodsList() {
			getApp().store.setState({
				'goodsCouponListParams.spuIds': []
			})
			getGoodsList(getApp().store.getState().goodsListParams)
				.then((res) => {
					if (res.Success) {
						res.Data.list&&res.Data.list.forEach(item => {
							// console.log(item.spuId);
							getApp().store.setState({
								'goodsCouponListParams.spuIds': [...getApp().store.getState().goodsCouponListParams.spuIds,item.spuId]
							})
						});
						this.requestGoodsCouponList()
						getApp().store.setState({
							isRequest: true,
							isShowLoading:false,
							'goodsListParams.current': res.Data.pageIndex + 1,
							'goodsListParams.total': res.Data.total,
							goodsListData: [
								...getApp().store.getState().goodsListData,
								...Array.from(res.Data.list),
							],
						})
						if (
							getApp().store.getState().goodsListParams.total &&
							getApp().store.getState().goodsListData.length >=
								getApp().store.getState().goodsListParams.total
						) {
							console.log('数据加载完毕...')
							getApp().store.setState({
								isMore: false,
							})
						}
					}
					console.log('商品列表请求成功:', res)
				})
				.catch((err) => {
					console.log('商品列表请求失败:', err)
				})
		},
	},
}
