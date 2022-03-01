// components/authPhoneTip/index.js
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
	data: {},
	// 组件所在页面的生命周期函数
	pageLifetimes: {
		show: function () {},
		hide: function () {},
		resize: function () {},
	},
	/**
	 * 组件的方法列表
	 */
	methods: {
		onClickHide() {
			// this.triggerEvent('updatePageFunc')
			app.store.setState({
				'isConfirmMask':false
			})
		},
		noop() {
		},
		ok() {
			this.triggerEvent('confirm')
		}
	},
})
