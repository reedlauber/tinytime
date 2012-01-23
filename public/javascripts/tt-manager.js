(function(TT) {
	TT.Manager = function(options) {
		var _self = {},
			_options = $.extend({
				target: '#content',
				components: {}
			}, options);
		
		var $container;

		_self.init = function() {
			$container = $(_options.target);
			_self.username = $container.attr('data-username');
			_self.slug = $container.attr('data-slug');
			_self.token = $container.attr('data-token');
			TT.Data.prefix = '/' + _self.username + '/' + _self.slug;
			
			$.each(_options.components, function(n, c) {
				c.init(_self);
			});
			
			return _self;
		};
		
		return _self;
	};
})(TinyTime);