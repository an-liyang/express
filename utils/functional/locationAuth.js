// 地理位置授权
export const setLocation = () => {
	return new Promise((resolve, reject) => {
		wx.getSetting({
			success: function (data) {
				console.log('data', data)
				if (data.authSetting['scope.userLocation'] === true) {
					//如果设置成功
					wx.getLocation({
						type: 'gcj02',
						success: function () {
							wx.getLocation({
								type: 'gcj02',
								success({ latitude, longitude }) {
									resolve({
										latitude,
										longitude,
									})
								},
								fail() {
									reject()
								},
							})
						},
						fail: function () {
							reject()
						},
					})
				} else {
					reject()
				}
			},
		})
	})
}
