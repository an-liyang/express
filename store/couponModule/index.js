import { getCouponList, goodsCouponList } from './../../apis/couponRelationApi.js'
import { goodsAvaCouponList } from './../../apis/couponRelationApi.js'

export const couponModule ={
  state:{
    isShowCouponMask:false,
    isAnimation:true,
    payOrderCouponDefaultClick:0,
    payOrderCouponTemporaryClick:0,
    payOrderCouponDefaultObj:{},//当前已选中且已确认的选中项
    payOrderCouponTemporaryObj:{},//当前已选中还未确认的选中项
    payOderCouponList:[],
    getSpuType:null,//1：免费下单页  2：付费下单页
    // 商品可用优惠券列表
    goodsCouponParams:{ 
      skuId: '',
			current: 1,
      pageSize: 5,
			total: 0,
    },
    goodsAvaCouponListData: [],
    isMoreCoupon: true
  },
  methods:{
    // 商品可用优惠-券列表
    requestGoodsAvaCoupon(skuId){
      getApp().store.setState({
        'goodsCouponParams.skuId': skuId
      })
      // loading开启
      getApp().store.setState({
        isShowLoading:true,
      })
      goodsAvaCouponList(getApp().store.getState().goodsCouponParams).then(res=>{
        console.log('获取优惠券列表成功',res);
        // loading关闭
        setTimeout(()=>{
          getApp().store.setState({
            isShowLoading:false,
          })
        },200)
        if(res.Success){
          // 领取状态
          res.Data.records.forEach((item)=>{
            item['isReceived'] = false;
            item['couponCode'] = "";
            item['isShowBtn'] = true;
          })
          getApp().store.setState({
            'goodsCouponParams.current': res.Data.current + 1,
            'goodsCouponParams.total': res.Data.total,
            goodsAvaCouponListData: [...getApp().store.getState().goodsAvaCouponListData,...res.Data.records]
          })
          // 加载更多
          if(getApp().store.getState().goodsCouponParams.total == getApp().store.getState().goodsAvaCouponListData.length ){
            getApp().store.setState({
              isMoreCoupon: false
            })
          }
        }
      }).catch(err=>{
        console.log('获取优惠券列表失败',err);
      })
    },
  }
}