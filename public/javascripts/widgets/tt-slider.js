(function(TT) {
	TT.Slider = function(options) {
		var _self = {},
			_options = $.extend({
				target: 'body',
				steps: 10
			}, options);
		
		var $container,
				$selected,
				$handle1,
				$handle2;
		
		var _min = -4,
			_max = 100;
		
		function _updateSelected() {
			var left = $handle1.data('left') + 4,
				width = $handle2.data('left') - $handle1.data('left');
			$selected.css({ left:left, width:width });
		}
		
		function _startTracking($handle, startX, index) {
			var x = $handle.data('left'),
				min = index === 1 ? $handle1.data('left') : _min,
				max = index === 0 ? $handle2.data('left') : _max;
				
			$('body').bind('mousemove', function(evt) {
				var d = evt.pageX - startX,
					newX = x + d;
				if(newX < min) { newX = min; }
				if(newX > max) { newX = max; }
				$handle.data('left', newX).css('left', newX + 'px');
				_updateSelected();
			});
		}
		
		function _setupEvents() {
			var tracking = false;
			$handle1.bind('mousedown', function(evt) {
				tracking = true;
				_startTracking($handle1, evt.pageX, 0);
			});
			$handle2.bind('mousedown', function(evt) {
				tracking = true;
				_startTracking($handle2, evt.pageX, 1);
			});
			$('body').bind('mouseup', function() {
				if(tracking) {
					tracking = false;
					$('body').unbind('mousemove');
				}
			});
		}
		
		_self.init = function() {
			$container = $('<div class="tt-slider"><div class="tt-slider-bg" /></div>').appendTo(_options.target);
			
			var w = $container.width(),
				stepWidth = w / _options.steps;
			
			_max = w - 6;
			
			$selected = $('<div class="tt-slider-bg-selected" />').appendTo($container);
			
			$handle1 = $('<span class="tt-slider-handle first" />').appendTo($container).data('left', -4).css('left', _min);
			$handle2 = $('<span class="tt-slider-handle last" />').appendTo($container).data('left', _max).css('left', _max);
			
			_setupEvents();
		};
		
		return _self;
	};
})(TinyTime);