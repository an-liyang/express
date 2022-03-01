// pages/couponDetail/index.js
const app = getApp()
import { getCouponDetail, reciveCoupon, couponTemplateId} from '../../apis/couponRelationApi.js'
import { baseInfoJudge } from '../../utils/functional/index.js'
import { login } from './../../utils/functional/loginAuth.js'
import { getScene } from '../../utils/util.js'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    couponDetail: {},
    isClicked: false,
    curId:null,
    source: '' //跳转来源
  },
  // 使用优惠券
  toUseCoupon() {
    wx.navigateTo({
      url: `/pages/couponAvailableGoods/index?code=${this.data.couponDetail.couponCode}&id=${this.data.couponDetail.templateId}`,
    })
  },
  // 领取优惠券
  requestReciveCoupon() {
    const _this = this;
    const getParams={
      templateId:_this.data.couponDetail.templateId,
      couponType:_this.data.couponDetail.couponType,//券类型
      deductionAmount:_this.data.couponDetail.deductionAmount,//减免金额
      metAmount:_this.data.couponDetail.metAmount,//满足金额
      discountRatio:_this.data.couponDetail.discountRatio//折扣
    }
    reciveCoupon(getParams).then(res=>{
      wx.showToast({
        title: res.Msg,
        icon: 'none',
        duration: 2000,
      })
      console.log('领取优惠券:',res);
      if(res.Success){
        _this.setData({
          "couponDetail.isReceived": true,
          "couponDetail.couponCode": res.Data.couponCode
        })
      }else{
        setTimeout(()=>{
          if(this.data.source=='home'){
            wx.reLaunch({
              url: '/pages/servicePage/index'
            });
          }else{
            if(getCurrentPages() && getCurrentPages().length && getCurrentPages().length>=2){
              wx.navigateBack({
                delta: 1
              })
            }else{
              wx.redirectTo({
                url: '/pages/couponCenter/index'
              });
            }
          }
        },2000)
      }
    }).catch((err) => {
      console.log('优惠券领取失败:', err)
    })
  },
  // 立即领取，判断授权。修改状态值---临时状态
  toRecived() {
    const _this = this
    console.log('isAuthAll-------------------',app.globalData.isAuthAll)
    console.log('isClicked-----------------',_this.data.isClicked)
    if(_this.data.isClicked){return false}
      _this.setData({
        isClicked: true,
      })
      setTimeout(()=>{
        _this.setData({
          isClicked: false
        })
      },2000)
      if(app.globalData.isAuthAll){
        this.requestReciveCoupon()
      }else{
        // 标注当前授权按钮的类型，用以手机授权成功的页面更新回调
        app.store.setState({
          curClickAuthBtn: 'getCoupon'
        })
        baseInfoJudge(()=>{
          // 用户信息授权成功，刷新页面
          app.store.setState({
            active: 'getCoupon',
          });
          this.requestReciveCoupon()
        })
      }

  },
  	// 手机号授权成功
	updatePageFunc() {
	// 首页授权按钮的类型：boundCar
		const getCurType=app.store.getState().curClickAuthBtn
		if(getCurType=='getCoupon') {
			app.store.setState({
				active: 'getCoupon',
      });
      this.requestReciveCoupon()
		}
  },
  // 获取优惠券详情
  requestCouponGoodsDetail(id){
    app.store.setState({
      isShowLoading:true
    })
    getCouponDetail({templateId:id}).then(res=>{
      if(res.Success){
        console.log("券详情--：",res)
        this.setData({
          couponDetail: res.Data,
          "couponDetail.isReceived": false
        })
      }else{
        wx.showToast({
          title: res.Msg,
          icon: 'none',
          duration: 2000,
        })
        setTimeout(()=>{
          if(this.data.source=='home'){
            wx.reLaunch({
              url: '/pages/servicePage/index'
            });
          }else{
            if(getCurrentPages() && getCurrentPages().length && getCurrentPages().length>=2){
              wx.navigateBack({
                delta: 1
              })
            }else{
              wx.redirectTo({
                url: '/pages/couponCenter/index'
              });
            }
            
          }
        },2000)
      }
      setTimeout(()=>{
        app.store.setState({
          isShowLoading:false
        })
      },200)
    }).catch(err=>{
      // console.log(err);
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
  onLoad: function (options) {
    // 记录跳转来源
    this.setData({
      source: options.source
    })
    // console.log('跳转详情的来源',this.data.source);
    if(options.scene){
      const getObj = getScene(options.scene)
      login().then(res => {
        console.log('扫码进入优惠券参数：',getObj);
        couponTemplateId({ k: getObj.k }).then(res1=>{
          if(res1.Success){
            this.setData({
              curId:res1.Data.templateId
            })
            app.getStoreInfo()
            this.requestCouponGoodsDetail(res1.Data.templateId)
          }
        })
      })
    }else{
      login().then(res => {
        app.getStoreInfo()
        this.setData({
          curId:options.templateId
        })
        this.requestCouponGoodsDetail(options.templateId)
      })
    }
  },
  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh:function(){
    app.getStoreInfo()
    this.requestCouponGoodsDetail(this.data.curId)
    // 停止下拉刷新
		wx.stopPullDownRefresh()
  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
  },
  // 分享功能
  onShareAppMessage: function () {
    console.log('进入优惠券详情页的分享事件...',app.globalData.bussinessId,wx.getStorageSync('bussinessId'))
    let _this = this;
    let url = "pages/couponDetail/index";
    url += "?bussinessId=" + app.globalData.bussinessId + '&templateId=' + _this.data.couponDetail.templateId;
    // 1 满减 2 折扣  
    let rules = _this.data.couponDetail.couponType==1?
    `满${_this.data.couponDetail.metAmount}减${_this.data.couponDetail.deductionAmount}`:
    `${_this.data.couponDetail.discountRatio}折`
    return {
      title: `快来领取【${rules}】的优惠券，手慢无`,
      path: url,
      imageUrl: 'http://img1.bitauto.com/das/chehou_sass/sass_wx/coupon/coupon-share-icon.png',
    }
  },
})