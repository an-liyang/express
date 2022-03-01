// pages/couponAvailableGoods/index.js
const app = getApp()
import { goodsCouponList, couponAvaGoodsList,userReceivedCouponDetail } from '../../apis/couponRelationApi.js'
Page({

  /**
   * 页面的初始数据
   */
  data: {		
    // 商品可用优惠券
		goodsCouponListParams: {
			spuIds: []
    },
    // 商品列表
		goodsListParams: {
			current: 1,
			pageSize: 10,
      total: null,
      couponCode: ''
		},
    goodsListData: [],
    isMore: true,
    // 优惠券详情
    params:{
      templateId:'',
      couponCode:''
    },
    detailData: {}
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
    // 销毁本页面不用保留
		wx.redirectTo({
			url: `/pages/goodsDetail/index?spuId=${e.currentTarget.dataset.spuid}&bussinessId=${app.globalData.bussinessId}`,
		});
	},
  // 优惠券详情
  getDetailData(){
    userReceivedCouponDetail(this.data.params).then(res=>{
      if(res.Success){
        res.Data.couponStartTime = res.Data.couponStartTime.replace(/-/g,'.');
        res.Data.couponEndTime = res.Data.couponEndTime.replace(/-/g,'.');
        this.setData({
          detailData:Object.assign({},res.Data),
        })
      }
      console.log('券详情获取成功:',res)
    }).catch(err=>{
      console.log('券详情获取失败:',err)
      wx.showToast({
        title: err.Msg||'网络开小差了',
        icon: 'none',
        duration: 2000,
      })
    })
  },
  // 商品标签
  requestGoodsAvaCouponList() {
    const _this = this
    goodsCouponList(_this.data.goodsCouponListParams)
      .then((res) => {
        if (res.Success) {
          res.Data = res.Data || []
          _this.data.goodsListData.forEach((item,index)=>{
            res.Data.forEach((items)=>{
              if(item.spuId == items.spuId){
                let change = "goodsListData["+ index +"].coupons";
                _this.setData({
                  [change]: items.list
                })
              }
            })
          })
        }
        // console.log(_this.data.goodsListData,9999);
        console.log('商品优惠券:', res)
      })
      .catch((err) => {
        console.log('商品优惠券:', err)
        wx.showToast({
          title: err.Msg||'网络开小差了',
          icon: 'none',
          duration: 2000,
        })
      })
    },
		// 商品列表
		requestCouponAvaGoodsList() {
      const _this = this
			_this.setData({
				'goodsCouponListParams.spuIds': []
      })
      app.store.setState({
        isShowLoading:true
      })
			couponAvaGoodsList(_this.data.goodsListParams)
				.then((res) => {
					if (res.Success) {
            setTimeout(()=>{
              app.store.setState({
                isShowLoading:false
              })
            },200)
						res.Data.records&&res.Data.records.forEach(item => {
							// console.log(item.spuId);
							_this.setData({
								'goodsCouponListParams.spuIds': [..._this.data.goodsCouponListParams.spuIds,item.spuId]
							})
            });
            if(_this.data.goodsCouponListParams.spuIds.length>0){
              _this.requestGoodsAvaCouponList()
            }
						_this.setData({
							'goodsListParams.current': res.Data.current + 1,
							'goodsListParams.total': res.Data.total,
							goodsListData: [
								..._this.data.goodsListData,
								...Array.from(res.Data.records),
							],
						})
						if (
							_this.data.goodsListParams.total &&
							_this.data.goodsListData.length >=
								_this.data.goodsListParams.total
						) {
							console.log('数据加载完毕...')
							_this.setData({
								isMore: false,
							})
						}
					}
					console.log('商品列表请求成功:', res)
				})
				.catch((err) => {
          // console.log('商品列表请求失败:', err)
          wx.showToast({
            title: err.Msg||'网络开小差了',
            icon: 'none',
            duration: 2000,
          })
				})
		},
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: async function (options) {
    // console.log(options.couponCode,88888888);
    this.setData({
      "params.templateId": options.id,
      "params.couponCode": options.code,
      "goodsListParams.couponCode": options.code,
      'goodsListParams.current': 1,
      'goodsListParams.total': null,
    })
    await this.getDetailData()
    await this.requestCouponAvaGoodsList()
  },

	/**
 * 页面相关事件处理函数--监听用户下拉动作
 */
onPullDownRefresh: async function () {
  this.setData({
    'goodsListParams.current': 1,
    'goodsListParams.total': null,
    isMore: true,
    goodsListData: Array.from([]),
  })
  await this.requestCouponAvaGoodsList()
  // 停止下拉刷新
  wx.stopPullDownRefresh()
},
  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: async function () {
    const _this = this
		if (_this.data.goodsListParams.total && _this.data.goodsListData.length >= _this.data.goodsListParams.total) {
      console.log("数据加载完毕...")
			_this.setData({
				isMore: false
      })
			return;
    }
    // 停止下拉刷新
    wx.stopPullDownRefresh();
    await _this.requestCouponAvaGoodsList()
  },
})