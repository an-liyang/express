import { getRequest } from './../../apis/common.js'

// 请求全局基础性信息
export const getRequestUserInfo = async (store) => {
	if (store.getState().isBaseInfoLoaded) {
		console.log(
			'当前状态已存在，不再请求接口，直接返回状态值',
			store.getState().isBaseInfoLoaded
		)
		return Promise.resolve(store.getState().isBaseInfoLoaded)
	}
	return await new Promise((resolve, reject) => {
		// 请求用户信息接口
		getRequest()
			.then((res) => {
				console.log('模拟请求基础用户信息成功=========', res)
				store.setState({
					isBaseInfoLoaded: true,
				})
				resolve(store.getState().isBaseInfoLoaded)
			})
			.catch((err) => {
				console.log('模拟请求基础用户信息失败=========', err)
				store.setState({
					isBaseInfoLoaded: false,
				})
				reject(store.getState().isBaseInfoLoaded)
			})
	})
}
