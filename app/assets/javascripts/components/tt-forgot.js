(function(TT) {
	TT.Forgot = TT.Component2({
		id: 'forgot',
		fields: [
			{ id:'email', prop:'email', label:'Email Address', required:true }
		]
	}, function(o, p) {
		TT.Form({
			fields: o.fields,
			context: o.target,
			submit: '#' + o.id + '-btn',
			onSubmit: function(data) {
				TT.Data.post('/forgot', data, function() {
					$(TT).trigger('message', ['A password reset link has been sent. Please check your email.']);
				});
			}
		});
	});
})(TinyTime);