/**
 * 版本更新提示
 */
export const versionUpdate = () => {
	if (wx.canIUse('getUpdateManager')) {
		const updateManager = wx.getUpdateManager()
		updateManager.onCheckForUpdate(function (res) {
			console.log(res.hasUpdate) // 请求完新版本信息的回调 true说明有更新
		})
		updateManager.onUpdateReady(function () {
			wx.showModal({
				title: '更新检测', // 此处可自定义提示标题
				content: '检测到新版本，即将重启小程序', // 此处可自定义提示消息内容
				success: function (res) {
					if (res.confirm) {
						// 新的版本已经下载好，调用 applyUpdate 应用新版本并重启
						updateManager.applyUpdate()
					}
				},
				showCancel: false,
			})
		})
		updateManager.onUpdateFailed(function () {
			// 新的版本下载失败
			wx.showModal({
				title: '更新提示',
				content: '新版本下载失败',
				showCancel: false,
			})
		})
	}
}
