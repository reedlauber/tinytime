(function(TT) {
	TT.Reset = TT.Component2({
		id: 'forgot-reset',
		fields: [
			{ id:'password', prop:'password', label:'Password', required:true },
			{ id:'password2', prop:'password2', label:'Password Confirm', required:true }
		]
	}, function(o, p, $reset) {
		TT.Form({
			data: { email: $reset.attr('data-email'), token: $reset.attr('data-token')  },
			fields: o.fields,
			context: o.target,
			submit: '#' + o.id + '-btn',
			onSubmit: function(data) {
				TT.Data.post('/forgot/reset', data, function() {
					window.location.href = '/login?email=' + $reset.attr('data-email');
				});
			}
		});
	});
})(TinyTime);