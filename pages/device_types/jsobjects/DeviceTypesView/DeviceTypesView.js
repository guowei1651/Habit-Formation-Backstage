export default {
	actionUpdateDeviceTypes () {
		var data = deviceTypeDatilForm.data
		console.log("数据", JSON.stringify(data))
		// update
		var param = {
			name: data.nameInput,
			applicable_models: data.applicableModelsInput,
			description: data.descriptionInput
		}

		var promise = null
		if (data.idInput) {
			// update
			param['id']= data.idInput
			console.log("updateDeviceTypeById param", JSON.stringify(param))
			promise=updateDeviceTypeById.run(param)
		} else {
			// insert
			console.log("insertDeviceType param", JSON.stringify(param))
			promise=insertDeviceType.run(param)
		}
		promise.then((response)=>{
			console.log(response)
			findDeviceTypes.run()
			closeModal(deviceTypeDatilModal.name)
		}, (err)=>{
			showAlert("发生错误，请稍后重试" + JSON.stringify(err), "error")
		}).catch((err)=>{
			showAlert("发生错误，请稍后重试" + JSON.stringify(err), "error")
		})
	},
	showCreateModal () {
		titleText.setText('修改设备类型')
		idInput.setValue(0)
		nameInput.setValue('')
		applicableModelsInput.setValue('')
		descriptionInput.setValue('')
		showModal(deviceTypeDatilModal.name)
	},
	showUpdateModal (row) {
		console.log(row)
		titleText.setText('修改设备类型')
		idInput.setValue(row.id)
		nameInput.setValue(row.name)
		applicableModelsInput.setValue(row.applicable_models)
		descriptionInput.setValue(row.description)
		showModal(deviceTypeDatilModal.name)
	}
}