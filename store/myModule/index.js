// const app = getApp()
import {allOrder,unPaid,unService,closed,finished,orderNumber} from './../../apis/orderRelationApis.js'
export const myModule = {
	state: {
		active:'total',
		orderListParams:{
			pageNo:1,
			pageSize:10,
			total:null
		},
		orderListData:[],
		orderDetailData:{
		},
		phoneInputTip:'',
		usernameInputTip:'',
		createOrderParams:{
			userName:'',
      orderCarNo:'',
      bussinessId:'',
      orderPhone:'',
      spuId:'DP202104291000000838000025',
      skuId:'DK202104291000000838000026',
			orderAmount:'0.01',
			salePrice:'',
			orderRemark:''
		},
		isOrderLoad:false,
		isShowCarKey:false,
		carKeyDefaultVal:'京',
		expireTime:null,//订单详情页订单过期时间
		isConfirmMask:false,
		unPaidNumber:'',
    unServiceNumber:''
	},
	methods: {
		dealGoodsDetailData(res){
			wx.getStorage({
				key: 'storeInfo',
				success (info) {
					let getDisNum=null
					if(res.defaultSkuInfo.skuSalesOldPrice&&res.spuType!=1){
						getDisNum=res.defaultSkuInfo.skuSalesOldPrice-res.defaultSkuInfo.skuSalesPrice
					}else{
						getDisNum=res.defaultSkuInfo.skuSalesPrice
					}
					getApp().store.setState({
						'orderDetailData.amount': 1,
						'orderDetailData.contactWay': info.data.tenantAppointmentPhone,
						'orderDetailData.tenantAppointmentPhone':info.data.tenantAppointmentPhone,
						'orderDetailData.tenantAddressLatitude': info.data.tenantAddressLatitude,
						'orderDetailData.tenantAddressLongitude': info.data.tenantAddressLongitude,
						'orderDetailData.tenantBussinessHours': info.data.tenantBussinessHours,
						'orderDetailData.tenantDetailedAddress': info.data.tenantDetailedAddress,
						'orderDetailData.tenantName': info.data.tenantName,
						'orderDetailData.disCounts': getDisNum,
						'orderDetailData.isEffective': res.isEffective,
						'orderDetailData.orderAmount': res.defaultSkuInfo.skuSalesPrice,
						'orderDetailData.receivingWay': res.spuReceivingWay,
						'orderDetailData.skuSalesOldPrice':res.defaultSkuInfo.skuSalesOldPrice,
						'orderDetailData.skuSalesSpecifications': [],//规格
						'orderDetailData.spuLogo': res.spuImages[0],
						'orderDetailData.spuSalesService': res.spuSalesService,
						'orderDetailData.spuTitle': res.spuTitle,
						'orderDetailData.spuType': res.spuType
					})
				}
			})
		},
		handleGetNumber(){
      orderNumber({name:'wu'}).then(res=>{
        console.log(res)
        if(res.Success){
          getApp().store.setState({
            unPaidNumber:res.Data.unPaidNumber,
            unServiceNumber:res.Data.unServiceNumber
          })
        }
      }).catch(err=>{
        console.log("获取数量失败",err)
      })
    },
		async handleOrderList(type){
			if(type){
				getApp().store.setState({
					active: type,
				});
			}
			const getActive=getApp().store.getState().active;
			console.log('getActive===',getActive)
			switch (getActive){
				case 'total':
					this.requestAllOrder()
					break;
				case 'pay':
					this.requestUnPaid()
					break;
				case 'service':
					this.requestUnService()
					break;
				case 'close':
					this.requestClosed()
					break;
				case 'finish':
					this.requestFinished()
					break;
				default:
					getApp().store.setState({
						'orderListParams.pageNo':1,
						'orderListParams.total':null,
						orderListData:Array.from([])
					})
					break;
			}
		},
		requestAllOrder(){
			allOrder(getApp().store.getState().orderListParams).then(res=>{
				if(res.Success){
					getApp().store.setState({
						isRequest: true,
						'orderListParams.pageNo':res.Data.pageNo+1,
						'orderListParams.total':res.Data.total,
						orderListData:[...getApp().store.getState().orderListData,...Array.from(res.Data.list)]
					})
					if((res.Data.list &&res.Data.list.length<=0)||!res.Data.list){
						getApp().store.setState({
							isOrderLoad:true
						})
					}
					setTimeout(()=>{
						getApp().store.setState({
							isShowLoading:false
						})
					},500)
				}
				console.log("全部订单请求成功:",res)
			}).catch(err=>{
				console.log("全部订单请求失败:",err)
				wx.showToast({
					title: err.Msg||'网络开小差了',
					icon: 'none',
					duration: 2000,
				})
			})
		},
		requestUnPaid(){
			unPaid(getApp().store.getState().orderListParams).then(res=>{
				if(res.Success){
					getApp().store.setState({
						isRequest: true,
						'orderListParams.pageNo':res.Data.pageNo+1,
						'orderListParams.total':res.Data.total,
						orderListData:[...getApp().store.getState().orderListData,...Array.from(res.Data.list)]
					})
					if((res.Data.list &&res.Data.list.length<=0)||!res.Data.list){
						getApp().store.setState({
							isOrderLoad:true
						})
					}
					setTimeout(()=>{
						getApp().store.setState({
							isShowLoading:false
						})
					},500)
				}
				console.log("待支付订单请求成功:",res)
			}).catch(err=>{
				console.log("待支付订单请求失败:",err)
				wx.showToast({
					title: err.Msg||'网络开小差了',
					icon: 'none',
					duration: 2000,
				})
			})
		},
		requestUnService(){
			unService(getApp().store.getState().orderListParams).then(res=>{
				if(res.Success){
					getApp().store.setState({
						isRequest: true,
						'orderListParams.pageNo':res.Data.pageNo+1,
						'orderListParams.total':res.Data.total,
						orderListData:[...getApp().store.getState().orderListData,...Array.from(res.Data.list)]
					})
					if((res.Data.list &&res.Data.list.length<=0)||!res.Data.list){
						getApp().store.setState({
							isOrderLoad:true
						})
					}
					setTimeout(()=>{
						getApp().store.setState({
							isShowLoading:false
						})
					},500)
				}
				console.log("待服务订单请求成功:",res)
			}).catch(err=>{
				console.log("待服务订单请求失败:",err)
				wx.showToast({
					title: err.Msg||'网络开小差了',
					icon: 'none',
					duration: 2000,
				})
			})
		},
		requestClosed(){
			closed(getApp().store.getState().orderListParams).then(res=>{
				if(res.Success){
					getApp().store.setState({
						isRequest: true,
						'orderListParams.pageNo':res.Data.pageNo+1,
						'orderListParams.total':res.Data.total,
						orderListData:[...getApp().store.getState().orderListData,...Array.from(res.Data.list)]
					})
					if((res.Data.list &&res.Data.list.length<=0)||!res.Data.list){
						getApp().store.setState({
							isOrderLoad:true
						})
					}
					setTimeout(()=>{
						getApp().store.setState({
							isShowLoading:false
						})
					},500)
				}
				console.log("已关闭订单请求成功:",res)
			}).catch(err=>{
				console.log("已关闭订单请求失败:",err)
				wx.showToast({
					title: err.Msg||'网络开小差了',
					icon: 'none',
					duration: 2000,
				})
			})
		},
		requestFinished(){
			finished(getApp().store.getState().orderListParams).then(res=>{
				if(res.Success){
					getApp().store.setState({
						isRequest: true,
						'orderListParams.pageNo':res.Data.pageNo+1,
						'orderListParams.total':res.Data.total,
						orderListData:[...getApp().store.getState().orderListData,...Array.from(res.Data.list)]
					})
					if((res.Data.list &&res.Data.list.length<=0)||!res.Data.list){
						getApp().store.setState({
							isOrderLoad:true
						})
					}
					setTimeout(()=>{
						getApp().store.setState({
							isShowLoading:false
						})
					},500)
				}
				console.log("已完成订单请求成功:",res)
			}).catch(err=>{
				console.log("已完成订单请求失败:",err)
				wx.showToast({
					title: err.Msg||'网络开小差了',
					icon: 'none',
					duration: 2000,
				})
			})
		}
	},
}
