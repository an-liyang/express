// pages/goodsDetail/components/goodsAvaCoupon/index.js
const app = getApp()
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    skuId: {
      type: String,
      value: ''
    },
    spuId:{
      type:String,
      value:''
    }
  },
  /**
   * 组件的初始数据
   */
  data: {
    skuId: {
      type: String,
      value: ''
    }
  },
  /**
   * 组件的方法列表
   */
  methods: {
    // 刷新数据
    isReRequest(){
      app.store.setState({
        'goodsCouponParams.current': 1,
        'goodsCouponParams.total': null,
        goodsAvaCouponListData: Array.from([]),
        isMoreCoupon: true
      })
      this.requestGoodsAvaCoupon(this.properties.skuId)
    },
    closeCoupon() {
      this.triggerEvent('closeCoupon')
    },
    loadMore(){
      // this.triggerEvent('closeCoupon')
      // 加载更多
      if(app.store.$state.goodsCouponParams.total == app.store.$state.goodsAvaCouponListData.length ){
        app.store.setState({
          isMoreCoupon: false
        })
        return false
      }
      this.requestGoodsAvaCoupon(this.properties.skuId)
    },
    receiveChange(e){
      console.log(app.store.$state.goodsAvaCouponListData,e.detail);
      app.store.$state.goodsAvaCouponListData.forEach((item,index)=>{
        if(item.templateId==e.detail.id){
          let change = "goodsAvaCouponListData["+ index +"].isReceived";
          let change1 = "goodsAvaCouponListData["+ index +"].couponCode";
          let change2 = "goodsAvaCouponListData["+ index +"].isShowBtn";
          app.store.setState({
            [change]: true,
            [change1]: e.detail.code,
            [change2]: false
          })
        }
      })
    },
  }
})
