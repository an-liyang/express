// pages/couponCenter/index.js
const app = getApp()
import { getCouponList } from '../../apis/couponRelationApi.js'
Page({
  /**
   * 页面的初始数据
   */
  data: {
    couponParams:{
			current: 1,
			pageSize: 10,
			total: null,
    },
    couponList: [],
    isMore: true,
    templateId: '', //当前点击id
    isClicked: false, // 是否点击领取
  },
  // 跳转券详情
  toGetCouponDetail: function (e) {
    console.log("------------------跳转券详情")
    wx.navigateTo({
      url: '/pages/couponDetail/index?templateId='+e.currentTarget.dataset.id+'&source=list',
    });
  },
  // 领取成功回调，修改状态值
  receiveChange(e){
    // console.log(e.detail);
    this.data.couponList.forEach((item,index)=>{
      if(item.templateId==e.detail.id){
        let change = "couponList["+ index +"].isReceived";
        let change1 = "couponList["+ index +"].couponCode";
        let change2 = "couponList["+ index +"].isShowBtn";
        this.setData({
          [change]: true,
          [change1]: e.detail.code,
          [change2]: true
        })
      }
    })
  },
  // 获取列表
  requestCoupon(){
    console.log("领券中心请求券列表函数...")
    const _this = this
    getCouponList(_this.data.couponParams)
      .then((res) => {
        if (res.Success) {
          // loading关闭
          setTimeout(()=>{
            app.store.setState({
              isShowLoading:false,
            })
          },200)
          // 领取状态
          res.Data.records.forEach((item)=>{
            item['isReceived'] = false;
            item['couponCode'] = "";
            item['isShowBtn'] = true;
          })
          _this.setData({
            couponList: [..._this.data.couponList,...res.Data.records],
            'couponParams.current': res.Data.current + 1,
            'couponParams.total': res.Data.total,
          })
          if (_this.data.couponParams.total && _this.data.couponList.length >= _this.data.couponParams.total) {
            console.log('数据加载完毕...')
            _this.setData({
              isMore: false,
            })
          }
        }
        console.log('优惠券请求成功:', res)
      })
      .catch((err) => {
        console.log('优惠券请求失败:', err)
        wx.showToast({
          title: err.Msg||'网络开小差了',
          icon: 'none',
          duration: 2000,
        })
      })
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    console.log("领取中心onShow...")
    // loading开启
    app.store.setState({
      isShowLoading:true,
    })
    this.setData({
      'couponList':[],
      'couponParams.current':1,
      'couponParams.total':null
    })
    this.requestCoupon()
  },
	/**
 * 页面相关事件处理函数--监听用户下拉动作
 */
onPullDownRefresh: async function () {
  this.setData({
    'couponParams.current': 1,
    'couponParams.total': null,
    isMore: true,
    couponList: Array.from([]),
  })
  // loading开启
  app.store.setState({
    isShowLoading:true,
  })
  await this.requestCoupon()
  // 停止下拉刷新
  wx.stopPullDownRefresh()
},
  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: async function () {
    const _this = this
		if (_this.data.couponParams.total && _this.data.couponList.length >= _this.data.couponParams.total) {
			console.log("数据加载完毕...")
			app.store.setState({
				isMore: false
			})
			return;
    }
    // 停止下拉刷新
    wx.stopPullDownRefresh();
    // loading开启
    app.store.setState({
      isShowLoading:true,
    })
    await _this.requestCoupon()
  },
})