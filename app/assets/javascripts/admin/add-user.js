// =require_self

(function(TT) {
	TT.AddUser = function(options) {
		var _c = TT.Component({
			id:'admin-users-new',
			fields: [
				{ id:'username', prop:'username', label:'Username', required:true },
				{ id:'email', prop:'email', label:'Email Address', required:true },
				{ id:'password', prop:'password', label:'Password', required:true }
			]
		}, options);

		_c.oninit = function() {
			$('#admin-users-new-btn').click(function() {
				TT.Form.validate(_c.options.fields, _c.options.target, function(valid, messages) {
					if(valid) {
						var user = TT.Form.getValues(_c.options.fields, _c.options.id);
						TinyTime.Data.save('/admin/users', user, function(resp) {
							window.location.href = '/admin/users';
						});
					}
				});
				return false;
			});
		};

		return _c.pub;
	};
})(TinyTime);