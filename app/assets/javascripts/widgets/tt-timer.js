(function(TT) {
	TT.Timer = function(options) {
		var _c = TT.Component({ id:'timer', target:'.tt-extras' }, options);
		
		var $timer,
				$time,
				$btns,
					$start,
					$pause,
					$stop;
		
		function _padLeft(val) {
			if(val.toString().length < 2) {
				return '0' + val;
			}
			return val.toString();
		}
		
		function _formatTime(h, m, s) {
			var t = '';
			if(h) {
				t += _padLeft(h) + ':';
			}
			if(m) {
				t += _padLeft(m) + ':';
			}
			t += _padLeft(s);
			return t;
		}
		
		var _interval, _start, _saved = 0, _running;
		function _runTimer() {
			_start = new Date();
			_interval = setInterval(function() {
				var diff = new Date() - _start + _saved;
				diff = Math.floor(diff / 1000);
				var h = Math.floor(diff / (60 * 60));
				diff -= (h * 60 * 60);
				var m = Math.floor(diff / 60);
				diff -= (m * 60);
				var s = diff;
				$time.html(_formatTime(h, m, s));
			}, 500);
			_running = true;
		}
		
		function _stopTimer() {
			clearInterval(_interval);
			_saved = new Date() - _start + _saved;
			_running = false;
		}
		
		function _resetTimer() {
			_saved = 0;
			$time.html('00');
		}
		
		function _setupEvents() {
			$start.click(function() {
				$time.show();
				$start.hide();
				$pause.show();
				$stop.show();
				$timer.addClass('active');
				_resetTimer();
				_runTimer();
			});
			
			$pause.click(function() {
				if(_running) {
					_stopTimer();
					$pause.text('Run');
				} else {
					_runTimer();
					$pause.text('Pause');
				}
			});
			
			$stop.click(function() {
				$time.html('<span class="tt-expand-reveal-inline tt-timer-time-last">last</span> ' + $time.html());
				$start.show();
				$pause.hide().text('Pause');
				$stop.hide();
				$timer.removeClass('active');
				_stopTimer();
				$(TT).trigger('timer-stopped', [Math.floor(_saved / 1000)]);
			});
		}
		
		_c.oninit = function() {
			$timer = $('<div id="' + _c.options.id + '" class="tt-expand tt-box tt-timer tt-requireinstance" />').prependTo(_c.options.target).append('<h3>Timer</h3>');
			
			$time = $('<div class="tt-timer-time">00</div>').appendTo($timer);
			
			$btns = $('<div class="tt-expand-reveal tt-timer-btns" />').appendTo($timer);
			$start = $('<span class="btn btn-success btn-small">Start</span>').appendTo($btns);
			$pause = $('<span class="btn btn-info btn-small">Pause</span>').appendTo($btns).hide();
			$stop = $('<span class="btn btn-danger btn-small">Stop</span>').appendTo($btns).hide();
			
			_setupEvents();
		};
		
		return _c.pub;
	};
})(TinyTime);