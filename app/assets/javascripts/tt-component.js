(function(TT) {
	TT.Component = function(defaults, options) {
		options = options || defaults;
		var _c = {
			options: $.extend({ target:'#content' }, defaults, options),
			pub: {}
		};
		
		_c.pub.init = function(manager) {
			_c.manager = manager;
			
			if(_c.oninit) {
				_c.oninit.call(_c);
			}
			
			return _c.pub;
		};
		
		return _c;
	};

	TT.Component2 = function(defaults, oninit) {
		if(typeof defaults === 'function') {
			oninit = defaults;
			defaults = {};
		}

		var _c = { options: $.extend({ target:'#content' }, defaults) },
			_p = {};

		return function(options) {
			_c.options = $.extend(_c.options, options);

			_p.init = function(manager) {
				_c.manager = manager;

				if(typeof oninit === 'function') {
					oninit.call(_c, _c.options, _p);
				}

				return _p;
			};

			return _p;
		};
	};
})(TinyTime);