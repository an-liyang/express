import { login } from './loginAuth.js'
import { userAuth } from './userAuth.js'

export const baseInfoJudge = (callback) => {
	login()
	return userAuth(callback) // getUserProfile Api不支持异步回调
	// return login().then((res) => {
	// 	userAuth(callback)
	// })
}
