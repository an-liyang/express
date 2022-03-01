// components/authPhoneTip/index.js
const app = getApp()
import { phoneAuth } from './../../utils/functional/phoneAuth.js'
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
			if(app.store.getState().curClickAuthBtn=='defalutAuthBtn'){
				this.triggerEvent('updatePageFunc')
			}
			app.store.setState({
				'isTipMask':false
			})
		},
		noop() {
		},
		toAuthPhone(e) {
			const _this = this
			phoneAuth(e)
				.then((res) => {
					_this.triggerEvent('updatePageFunc')
					app.store.setState({
						'isTipMask':false,
					})
				})
				.catch((err) => {
					app.store.setState({
						'isTipMask':false,
					})
					wx.showToast({
						title: '授权失败',
						icon: 'success',
						duration: 2000,
					})
				})
		},
	},
})
