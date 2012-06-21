(function(TT) {
	TT.Manager = function(options) {
		var _self = {},
			_options = $.extend({
				target: '#content',
				components: {}
			}, options);
		
		var $container;

		function _setupEvents() {
			$(TT).bind('message', function(evt, message, opts) {
				if(typeof message === 'object') {
					var m = '<ul class="">';
					$.each(message, function(p, v) {
						if($.isArray(v)) {
							m += '<li>' + v.join('</li><li>') + '</li>';
						} else {
							m += '<li>' + v + '</li>';
						}
					});
					m += '</ul>';
					message = m;
				}
				opts = opts || {};
				var $msg = $('<div class="alert alert-block tt-form-msg tt-shadow"></div>').html(message).appendTo('body').hide();
				if(opts.style) {
					$msg.addClass(opts.style)
				}
				$msg.slideDown();
				setTimeout(function() {
					$msg.slideUp(function() {
						$msg.remove();
						$msg = null;
					});
				}, 5000);
			});
		}

		_self.init = function() {
			$container = $(_options.target);
			_self.username = $container.attr('data-username');
			_self.slug = $container.attr('data-slug');
			_self.token = $container.attr('data-token');
			if(_self.username && _self.slug) {
				TT.Data.prefix = '/' + _self.username + '/' + _self.slug;
			}

			_setupEvents();
			
			$.each(_options.components, function(n, c) {
				c.init(_self);
			});
			
			return _self;
		};
		
		return _self;
	};
})(TinyTime);