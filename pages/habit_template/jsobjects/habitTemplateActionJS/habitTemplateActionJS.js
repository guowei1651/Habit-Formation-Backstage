export default {
	async modalSubmit() {
		console.log("modalSubmit", habit_template_form.data);
		if (habit_template_form.data.id) {
			this.updateHabitTemplate()
		} else {
			this.createHabitTemplate() 
		}
	},
	createHabitTemplate() {
		console.log('create', habit_template_form.data)
		var param = {
			'prompt':habit_template_form.data.promptInput,
			'ext_info':habit_template_form.data.extInfoInput,
			'ext_desc':habit_template_form.data.extDescInput,
			'display_chart1':habit_template_form.data.display_chart1,
			'display_chart2':habit_template_form.data.display_chart2,
			'display_chart3':habit_template_form.data.display_chart3,
			'display_chart4':habit_template_form.data.display_chart4,
			'take_habit_from_repetitions':habit_template_form.data.repetitionsInput
		}
		createHabitTemplate.run(param).then((resp)=>{
			habitTemplateViewJS.successHabitTemplate()
		}, (err)=>{
			showAlert("创建失败，请稍后重试。"+err)
		}).catch((err)=>{
			showAlert("创建失败，请稍后重试："+err)
		})
	},
	updateHabitTemplate() {
		console.log('update', habit_template_form.data)
		var param = {
			'id': habit_template_form.data.id,
			'prompt':habit_template_form.data.promptInput,
			'ext_info':habit_template_form.data.extInfoInput,
			'ext_desc':habit_template_form.data.extDescInput,
			'display_chart1':habit_template_form.data.display_chart1,
			'display_chart2':habit_template_form.data.display_chart2,
			'display_chart3':habit_template_form.data.display_chart3,
			'display_chart4':habit_template_form.data.display_chart4,
			'take_habit_from_repetitions':habit_template_form.data.repetitionsInput
		}
		updateHabitTemplate.run(param).then((resp)=>{
			habitTemplateViewJS.successHabitTemplate()
		}, (err)=>{
			showAlert("修改失败，请稍后重试。"+err)
		}).catch((err)=>{
			showAlert("修改失败，请稍后重试："+err)
		})
	}
}