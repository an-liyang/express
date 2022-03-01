// components/comScorllView/index.js
Component({
	/**
	 * 组件的属性列表
	 */
	properties: {
		triggered: { // 属性名
      type: Boolean,
      value: false
		},
		height:{
			type:Number,
			value:1334
		}
	},
	/**
	 * 组件的初始数据
	 */
	data: {

	},
	lifetimes: {
		attached: function () {
		},
	},
	/**
	 * 组件的方法列表
	 */
	methods: {
		onRefresh() {
			this.triggerEvent('refreshEvent')
		},
		onBottmRefresh(){
			this.triggerEvent('bottmRefreshEvent')
		}
	},
})
