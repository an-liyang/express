// pages/servicePage/components/coupon-list/index.js
const app = getApp()

Component({
  /**
   * 组件的属性列表
   */
  properties: {

  },

  /**
   * 组件的初始数据
   */
  data: {
    tips1: 'http://img1.bitauto.com/das/chehou_sass/sass_wx/coupon/store-active-icon.png',
    tips2: 'http://img1.bitauto.com/das/chehou_sass/sass_wx/coupon/online-active-icon.png',
    tips3: 'http://img1.bitauto.com/das/chehou_sass/sass_wx/coupon/both-active-icon.png'
  },

  /**
   * 组件的方法列表
   */
  methods: {
    // 跳转领券中心
    toGetCoupon: function () {
      wx.navigateTo({
        url: '/pages/couponCenter/index',
      });
    },
    // 跳转券详情
    toGetCouponDetail: function (e) {
      wx.navigateTo({
        url: '/pages/couponDetail/index?templateId='+e.currentTarget.dataset.id+'&source=home',
      });
    },
  }
})
