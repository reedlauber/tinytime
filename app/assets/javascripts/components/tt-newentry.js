(function(TT) {
	TT.NewEntry = function(options) {
		var _self = {},
			_options = $.extend({
				id: 'newentry',
				target: '#content',
				fields: [
					{ id:'newentry-time', prop:'minutes', required:true },
					{ id:'newentry-desc', prop:'desc', required:true, submit:true },
					{ id:'newentry-tags', prop:'tags', submit:true }
				]
			}, options),
			_manager;
		
		var _numRe = /^[\d\.]+$/g,			   // e.g. "45"
			_timeRe = /^[0-9]{1,2}:[0-9]{2}$/, // e.g. "02:15" or "2:15" = 2h 15m
			_dayRe = /[0-9\.]d/,			   // e.g. "1d" = 1 day
			_hourRe = /[0-9\.]h/,			   // e.g. "1h" = 1 hour
			_minRe = /[0-9\.]m/;			   // e.g. "1m" = 1 minute
			
		function _parseTime(val) {
			var mins = 0.0,
				parts,
				h, m, d;
			
			// check if it's just a number
			if(_numRe.test(val)) {
				mins = Math.floor(parseFloat(val));
			} else if(_timeRe.test(val)) {
				parts = val.split(':');
				h = parseInt(parts[0]);
				m = parseInt(parts[1]);
				if(!$.isNaN(h) && !$.isNaN(m)) {
					mins += (h * 60);
					mins += m;
				}
			} else {
				parts = val.split(' ');
				$.each(parts, function(i, part) {
					if(_dayRe.test(part)) {
						d = parseFloat(part.replace('d', ''));
						mins += (d * 24 * 60);
					} else if(_hourRe.test(part)) {
						h = parseFloat(part.replace('h', ''));
						mins += (h * 60);
					} else if(_minRe.test(part)) {
						m = Math.floor(parseFloat(part.replace('m', '')));
						mins += m;
					}
				});
			}
			
			return mins;
		}
		
		function _require(field) {
			if(field.required) {
				var valid = !!$('#' + field.id).val();
				if(!valid) {
					$('#' + field.id).parent().addClass('error');
				}
				return valid;
			}
			return true;
		}	

		function _resetForm() {
			$('#' + _options.id + '-time, #' + _options.id + '-desc').val('');
			$('#newentry-workdate input').val($('#newentry-workdate').attr('data-date'));
			$('#' + _options.fields[0].id).focus();
		}
		
		function _readForm() {
			$('.error', '#' + _options.id).removeClass('error');
		
			var valid = true,
				entry = { token:_manager.token, work_date:$('#newentry-workdate').attr('data-date') };
				
			$.each(_options.fields, function(i, field) {
				if(_require(field)) {
					entry[field.prop] = $('#' + field.id).val();
				} else {
					valid = false;
				}
			});
			
			if(valid) {
				entry.minutes = _parseTime(entry.minutes);
		
				TT.Data.add('/entries', entry, function(resp) {
					_resetForm();
					$(TT).trigger('entry-created', [resp]);
				});
			}
		}
		
		function _setupForm() {
			$.each(_options.fields, function(i, field) {
				if(field.submit) {
					$('#' + field.id).keyup(function(evt) {
						if(evt.which === 13) {
							$('#' + _options.id + '-btn').click();
						}
					});
				}
			});
		}
		
		function _parseUserDate(val) {
			var dt = Date.parse(val),
				ret = { date:Date.today().toString(TT.dateFormat), label:'Today' };
			
			if(dt) {
				dt = dt.clearTime();
				if(dt <= Date.today()) {
					ret.date = dt.toString(TT.dateFormat);
					ret.label = TT.Util.recentDateLabel(dt);
				}
			}
			
			return ret;
		}
		
		function _setupEvents() {
			$('#' + _options.id + '-btn').click(function() {
				try {
					_readForm();
				} catch(e) {
					TT.log(e);
				}
				
				return false;
			});
			
			var $label = $('.tt-newentry-workdate-label').click(function() {
				$(this).hide();
				$('#newentry-workdate input').show();
			});
			
			$('#newentry-workdate input').blur(function() {
				var val = $(this).val();
				var newDate = _parseUserDate(val);
				if(newDate) {
					$label.html(newDate.label);
					$('#newentry-workdate').attr('data-date', newDate.date);
				}
				
				$(this).hide();
				$label.show();
			});
			
			$(TT).bind('timer-stopped', function(evt, seconds) {
				var h = Math.floor(seconds / (60 * 60));
				seconds -= h * 60 * 60;
				var m = Math.round(seconds / 60);
				var t = '';
				if(h) {
					t = h + 'h';
				}
				if(m) {
					t += h ? ' ' : '';
					t += m + 'm';
				}
				$('#' + _options.fields[0].id).val(t);
				if(t) {
					$('#' + _options.fields[1].id).focus();
				}
			});
		}
		
		_self.init = function(manager) {
			_manager = manager;
			
			_resetForm();
			
			_setupEvents();
			
			return _self;
		};
		
		return _self;
	};
})(TinyTime);