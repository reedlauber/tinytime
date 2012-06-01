// require_self

(function(TT) {
	TT.SignUp = function(options) {
		var _c = TT.Component({ id:'signup' }, options);

		_c.oninit = function() {
			TT.Form({
				context: '#' + _c.options.id, 
				submit: '#' + _c.options.id + '-btn',
				fields: [
					{ id:'username', prop:'username', label:'Username', required:true },
					{ id:'email', prop:'email', label:'Email', required:true },
					{ id:'password', prop:'password', label:'Password', required:true }
				],
				onSubmit: function(data) {
					TT.Data.prefix = '';
					TT.Data.add('/account', data, function(resp) {
						window.location.href = '/' + resp.username;
					});
				}
			});
		};

		return _c.pub;
	};
})(TinyTime);