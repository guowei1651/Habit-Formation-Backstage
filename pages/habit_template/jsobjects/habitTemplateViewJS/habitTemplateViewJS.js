export default {
	clearHabitTemplateFrom(){
		if (habit_template_form && habit_template_form.data) {
			habit_template_form.data['id'] = null
			habit_template_form.data['display_chart1'] = undefined
			habit_template_form.data['display_chart2'] = undefined
			habit_template_form.data['display_chart3'] = undefined
			habit_template_form.data['display_chart4'] = undefined
		}

		title.setText('创建模版')
		promptInput.setValue('')
		repetitionsInput.setValue(1)
		extInfoInput.setValue('')
		extDescInput.setValue('')
		displayChartImage1.setImage('')
		displayChartImage2.setImage('')
		displayChartImage3.setImage('')
		displayChartImage4.setImage('')

		this.promptInputonTextChanged()
	},
	fillHabitTemplateFrom(row){
		if (habit_template_form && habit_template_form.data) {
			habit_template_form.data['id'] = row.id
			habit_template_form.data['display_chart1'] = row.display_chart1
			habit_template_form.data['display_chart2'] = row.display_chart2
			habit_template_form.data['display_chart3'] = row.display_chart3
			habit_template_form.data['display_chart4'] = row.display_chart4
		}
		title.setText('修改'+row.id+'号模版')
		promptInput.setValue(row.prompt)
		repetitionsInput.setValue(row.take_habit_from_repetitions)
		extInfoInput.setValue(row.ext_info)
		extDescInput.setValue(row.ext_desc)

		displayChartImage1.setImage(row.display_chart1)
		displayChartImage2.setImage(row.display_chart2)
		displayChartImage3.setImage(row.display_chart3)
		displayChartImage4.setImage(row.display_chart4)

		this.promptInputonTextChanged()
	},
	promptInputonTextChanged () {
		if (promptInput.text.length > 0) {
			generateImageButton.setDisabled(false)
		} else {
			generateImageButton.setDisabled(true)
		}
	},
	createHabitTemplate(){
		this.clearHabitTemplateFrom()
		showModal(habit_template_modal.name)
	},
	successHabitTemplate() {
		console.log('success Habit Template')
		closeModal(habit_template_modal.name)
		getHabitTemplates.run()
	},
	selectRow(row) {
		this.fillHabitTemplateFrom(row)
		showModal(habit_template_modal.name)
	},
	displayImage(file) {
		if (!displayChartImage1.image) {
			displayChartImage1.setImage(file)
			return
		}
		if (!displayChartImage2.image) {
			displayChartImage2.setImage(file)
			return
		}
		if (!displayChartImage3.image) {
			displayChartImage3.setImage(file)
			return
		}
		if (!displayChartImage4.image) {
			displayChartImage4.setImage(file)
			return
		}
	},
	uploadFile(file) {
		if (!file) {
			file = "http://vision-poster.oss-cn-shanghai.aliyuncs.com/jianguo.wjg%2F%E9%80%9A%E7%94%A8%E6%B5%B7%E6%8A%A5%E4%B8%93%E9%A1%B9%2Fresults_cache_dashscope%2F2025-01-08%2F2025-01-08-07-26-27_8879b989-6e98-43d5-8b12-3592bc79b7d3_0.render.png?OSSAccessKeyId=LTAI5tR9bWsP5EXAHGXGRYwE&Expires=1736407588&Signature=HaxuDKl%2Fc2eg4OmpEQvkR5FpaEs%3D"
		}
		console.log("upload file: ", file)
		fetch(file,{mode:"no-cors"}).then((resp)=>{
			console.log("download succesed", resp)
			console.log("ok:", resp.ok)
			console.log("redirected:",resp.redirected)
			console.log("headers:", resp.headers)
			console.log("status:", resp.status)
			console.log("type:", resp.type)
			return resp.blob()
		}).then(blob=>{
			var md = forge.md.sha256.create();
			md.update(file);
			const fileName = md.digest().toHex() + ".png";
			var param = {
				'name': fileName,
				'file': blob
			}
			save_image.run(param)
		}).catch((err)=>{
			console.log("download error!", err)
		})
	},
	getGrenateImageResult(taskId, timerName) {
		console.log("getGrenateImageResult:",taskId)
		generate_result.run({'taskId':taskId}).then((resp)=>{
			console.log("调用'获取结果'成功 ", resp)
			const apiResult = resp.output
			// RUNNING：处理中
			if ("RUNNING" == apiResult.task_status) {
				console.log("获取结果，还在运行，taskId:", taskId)
				return
			}
			// PENDING：排队中
			if ("PENDING" == apiResult.task_status) {
				console.log("获取结果，还在排队中，taskId:", taskId)
				return
			}
			// SUSPENDED：挂起
			if ("SUSPENDED" == apiResult.task_status) {
				console.log("获取结果，还在挂起中，taskId:", taskId)
				return
			}
			// FAILED：执行失败
			if ("FAILED" == apiResult.task_status) {
				console.log("获取结果，失败了。", apiResult.message)
				showAlert("获取结果，失败了。" + apiResult.message, 'warning')
			}
			// SUCCEEDED：执行成功
			if ("SUCCEEDED" == apiResult.task_status) {
				console.log("获取结果，成功了。", apiResult.render_urls)

				this.uploadFile(apiResult.render_urls[0])
				this.displayImage(apiResult.render_urls[0])
			}
			clearInterval(timerName)
		}, (err)=>{
			console.log("获取结果失败 ", err)
			showAlert("获取结果失败 " + err, 'warring')
			clearInterval(timerName)
		}).catch((err)=>{
			console.log("获取结果失败:", err)
			showAlert("获取结果失败 " + err, 'warring')
			clearInterval(timerName)
		})
	},
	grenateImageButton(){
		var data = habit_template_form.data
		var param = {
			'prompt':data.promptInput,
			'ext_desc':data.extDescInput
		}
		var arrayExtInfo = Object.keys(Array.from(data.extInfoInput))
		var key, count = 0;
		for(key in arrayExtInfo) {
			if(arrayExtInfo.hasOwnProperty(key)) {
				count++;
			}
		}
		console.log("data.extInfoInput:",arrayExtInfo)
		console.log("data.extInfoInput.lenght:",count)
		if (!!data.extInfoInput && count <= 30) {
			param['ext_info'] = data.extInfoInput
			param['body_info'] = ''
		} else {
			param['ext_info'] = ''
			param['body_info'] = data.extInfoInput
		}

		var self = this
		generation_image.run(param).then((resp)=>{
			showAlert("生成图片正在进行", 'info')
			console.log("生成图片正在进行", resp)

			const apiResult = resp.output
			if ("PENDING" != apiResult.task_status) {
				showAlert("生成图片失败，请稍后重试", 'warning')
				console.log("生成图片生成结果不同", resp)
				return ;
			}

			const generation_image_timer_name = "generation_image_timer_name"
			setInterval(()=>{
				self.getGrenateImageResult(apiResult.task_id, generation_image_timer_name)
			}, 30000, generation_image_timer_name)
		},(err)=>{
			showAlert(err.message, 'warning')
			console.error("生成发生错误，",err)
		}).catch((err)=>{
			showAlert(err.message, 'warning')
			console.error("生成发生错误，",err)
		})
	}
}