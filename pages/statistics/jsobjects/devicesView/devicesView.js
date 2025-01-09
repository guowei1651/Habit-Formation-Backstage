export default {
	DeviceTypes:[],
	onload () {
		findAllDeviceTypes.run()

		var self = this
		findAllDeviceTypes.data.map(deviceType => {
			self.DeviceTypes[deviceType.id.toString()] = {
				'name':deviceType.name, 
				'allow_deletion': deviceType.allow_deletion
			}
		})

		console.log("最终结果", JSON.stringify(self.DeviceTypes))
	}
}