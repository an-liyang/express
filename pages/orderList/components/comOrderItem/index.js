// components/comOrderItem/index.js
import { makePay } from './../../../../apis/payRelationApis.js'
import { calcTimeDistance } from './../../../../utils/util.js'
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    objData: {
      type: Object,
      value: {
        orderNo: null,
        createStime: null,
        tenantName: null,
        orderExpireTime: null,
        orderStatus: null,//订单状态订单状态(10 待支付  20 待服务  80 已作废\已关闭  82 已过期  83 已完成 其中80、82都属于已关闭）
        spuLogo: null,
        spuTitle: null,
        skuSalesSpecification: null,
        orderAmount: null,
        actualPayment: null,
        skuSalesPrice: null,
        spuType: null
      }
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    timer: null,
    expireTime: null,
    skuSalesSpecifications:[]
  },
  lifetimes: {
    // 生命周期函数，可以为函数，或一个在methods段中定义的方法名
    attached: function () {
      const _this = this;
      _this.setData({
        expireTime: ''
      })
      if(_this.properties.objData.skuSalesSpecifications){
        _this.setData({
          'skuSalesSpecifications':_this.properties.objData.skuSalesSpecifications.split(',')
        })
      }
      
      if (_this.properties.objData.orderStatus == '10' && _this.properties.objData.orderExpireTime) {
        _this.timer = setInterval(() => {
          var expireTime =_this.properties.objData.orderExpireTime.replace(/-/g, "/");
          var expireDate = new Date(expireTime)
          if(_this.data.expireTime=='00:00:00'){
            clearInterval(_this.timer)
          }
          if (expireDate > new Date()) {
            _this.setData({
              expireTime: calcTimeDistance(expireTime)
            })
          }
          else {
            _this.setData({
              expireTime: '00:00:00'
            });
            clearInterval(_this.timer);
          }
        }, 1000)
      }

    },
    moved: function () {
      if (this.properties.objData.orderStatus == '10') {
        clearInterval(this.timer)
        this.timer = null
        this.setData({
          expireTime: null
        })
      }
    },
    detached: function () {
      if (this.properties.objData.orderStatus == '10') {
        clearInterval(this.timer)
        this.timer = null
        this.setData({
          expireTime: null
        })
      }
    },
  },
  /**
   * 组件的方法列表
   */
  methods: {
    async clickToOrderDetail(e) {
      // 商品类型  1免费 2收费
      wx.navigateTo({
        url: `/pages/orderDetail/index?orderNo=${e.currentTarget.dataset.orderno}&spuType=${e.currentTarget.dataset.sputype}`,
      })
    }
  }
})
