(function(TT) {
	TT.AddInstance = TT.Component2({ 
		id:'admin-instance-new', 
		fields:[
			{ id:'name', prop:'name', label:'Project Name' },
			{ id:'entries', prop:'entries', label:'Entries' }
		]
	}, function(o, p) {
		$('#' + o.id + '-btn').click(function() {
			var userId = $('#' + o.id).attr('data-user-id');

			TT.Form.validate(o.fields, o.target, function(valid, messages) {
				if(valid) {
					var data = TT.Form.getValues(o.fields, o.target);
					TT.Data.save('/admin/users/' + userId + '/instances', data, function(instance) {
						window.location.href = '/admin/users/' + userId;
					});
				}
			});
			return false;
		});
	});
})(TinyTime);