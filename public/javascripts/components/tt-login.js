(function(TT) {
	TT.LogIn = function(options) {
		var _c = TT.Component({ id:'login' }, options);

		_c.oninit = function() {
			TT.Form({
				context: '#' + _c.options.id,
				fields: [
					{ id:'username', label:'Username', required:true },
					{ id:'password', label:'Password', required:true }
				],
				submit: '#' + _c.options.id + '-btn',
				onSubmit: function(data) {
					TT.Data.prefix = '';
					TT.Data.save('/login', data, function(resp) {
						window.location.href = '/';
					});
				}
			});
		};

		return _c.pub;
	};
})(TinyTime);