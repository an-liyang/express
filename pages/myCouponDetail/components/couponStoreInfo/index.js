// pages/myCouponDetail/components/couponStoreInfo/index.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    obj:{
      type:Object,
      value:{}
    }
  },

  /**
   * 组件的初始数据
   */
  data: {

  },

  /**
   * 组件的方法列表
   */
  methods: {
  gotoMap: function (e) {
    const _this=this;
    const latitude= parseFloat(_this.properties.obj.tenantAddressLatitude);
    const longitude = parseFloat(_this.properties.obj.tenantAddressLongitude);
    console.log(latitude,longitude)
    wx.openLocation({
      latitude:parseFloat(_this.properties.obj.tenantAddressLatitude)
      , longitude: parseFloat(_this.properties.obj.tenantAddressLongitude)
      , name: _this.properties.obj.tenantName,
      address: _this.properties.obj.tenantDetailedAddress
      , success: function (res) {
        console.log(res)
      }
      ,fail:function(err){
        console.log(err)
        wx.showToast({
          title: err.Msg||'网络开小差了',
          icon: 'none',
          duration: 2000,
        })
      }
    })
    console.log(e);
  },
  handleToCall() {
		const getPhone=this.properties.obj.tenantAppointmentPhone
		wx.showActionSheet({
				itemList: [getPhone],
				success(res) {
						wx.makePhoneCall({
								phoneNumber: getPhone
						})
				},
				fail(res) {
						console.log('wx.showActionSheet拉起异常', res.errMsg)
				}
		})
	},
  }
})
