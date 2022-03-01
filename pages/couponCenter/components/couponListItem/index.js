// components/discountCouponItem/index.js
const app = getApp()
import { reciveCoupon } from '../../../../apis/couponRelationApi.js'
import { baseInfoJudge } from '../../../../utils/functional/index.js'
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    couponItem: {            // 属性名
      type: Object,     // 类型（必填），目前接受的类型包括：String, Number, Boolean, Object, Array, null（表示任意类型）
      value: {}    // 属性初始值（可选），如果未指定则会根据类型选择一个
    },
    isCallBack: {
      type: Boolean,
      value: false
    },
    spuId:{
      type:String,
      value:''
    },
    skuId:{
      type:String,
      value:''
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    tips1: 'http://img1.bitauto.com/das/chehou_sass/sass_wx/coupon/store-active-icon.png',
    tips2: 'http://img1.bitauto.com/das/chehou_sass/sass_wx/coupon/online-active-icon.png',
    tips3: 'http://img1.bitauto.com/das/chehou_sass/sass_wx/coupon/both-active-icon.png',
    templateId: ''
  },
  /**
   * 组件的方法列表
   */
  methods: {
    // 使用优惠券
    toUseCoupon(e) {
      console.log("------------点击‘去使用’按钮")
      wx.navigateTo({
        url: `/pages/couponAvailableGoods/index?code=${e.currentTarget.dataset.couponcode}&id=${e.currentTarget.dataset.templateid}`,
      })
    },
    // 领取优惠券
    requestReciveCoupon() {
      const _this = this;
      const getParams={
        templateId:_this.data.templateId,
        spuId:_this.properties.spuId,
        skuId:_this.properties.skuId,
        couponType:_this.properties.couponItem.couponType,//券类型
        deductionAmount:_this.properties.couponItem.deductionAmount,//减免金额
        metAmount:_this.properties.couponItem.metAmount,//满足金额
        discountRatio:_this.properties.couponItem.discountRatio//折扣
      }
      console.log('商品详情参数',this.properties.couponItem)
      reciveCoupon(getParams).then(res=>{
        console.log("领取状态：",res)
        wx.showToast({
          title: res.Msg||'系统异常',
          icon: 'none',
          duration: 2000,
        })
        if(res.Success){
          _this.triggerEvent('receiveChange',{id:_this.data.templateId,code:res.Data.couponCode})
        }else{
          // 是否需要回调处理
          if(_this.properties.isCallBack){
            _this.triggerEvent('isReRequest')
          }
        }
      }).catch((err) => {
        console.log('优惠券领取失败:', err)
      })
    },
    // 立即领取。领取优惠券接口，修改状态值---临时状态
    toReceive(e){
      // console.log(e.detail,999);
      const _this = this
      if(_this.data.isClicked){return false}
      _this.setData({
        isClicked: true,
        templateId: e.currentTarget.dataset.id
      })
      setTimeout(()=>{
        _this.setData({
          isClicked: false
        })
      },2000)
      if(app.globalData.isAuthAll){
        _this.requestReciveCoupon()
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
          _this.requestReciveCoupon()
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
  }
})
