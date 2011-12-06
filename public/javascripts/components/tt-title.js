(function(TT) {
	TT.Title = function(options) {
		var _self = {},
			_options = $.extend({
				id: 'title',
				target: '#content'
			}, options),
			_manager;
		
		var $title,
			$input;
		
		function _updateTitle(callback) {
			var val = $input.val();
			if(!val) {
				val = 'Untitled';
			}
			if(val != $title.text()) {
				TT.Data.save('/' + _manager.token, { name:val }, function() {
					$title.text(val);
					callback();
				}, function() {
					callback();
				});
			} else {
				callback();
			}
		}
		
		_self.init = function(manager) {
			_manager = manager;
			
			$title = $('#' + _options.id + '-label', _options.target);
			$input = $('#' + _options.id + '-input', _options.target);
			
			$title.click(function() {
				$title.hide();
				$input.show().focus();
			});
			$input.blur(function() {
				_updateTitle(function() {
					$input.hide();
					$title.show();
				});
			});
			
			return _self;
		};
		
		return _self;
	};
})(TinyTime);