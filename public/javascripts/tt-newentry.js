(function(TT) {
	TT.NewEntry = function(options) {
		var _self = {},
			_options = $.extend({
				id: 'newentry',
				target: '#content',
				fields: [
					{ id:'newentry-time', prop:'minutes', required:true },
					{ id:'newentry-desc', prop:'desc', required:true },
					{ id:'newentry-tags', prop:'tags' }
				]
			}, options),
			_manager;
		
		var _numRe = /^[\d\.]+$/g,
			_dayRe = /[0-9\.]d/,
			_hourRe = /[0-9\.]h/,
			_minRe = /[0-9\.]m/;
		function _parseTime(val) {
			var mins = 0.0;
			
			// check if it's just a number
			if(_numRe.test(val)) {
				mins = Math.floor(parseFloat(val));
			} else {
				var parts = val.split(' ');
				$.each(parts, function(i, part) {
					if(_dayRe.test(part)) {
						var d = parseFloat(part.replace('d', ''));
						mins += (d * 24 * 60);
					} else if(_hourRe.test(part)) {
						var h = parseFloat(part.replace('h', ''));
						mins += (h * 60);
					} else if(_minRe.test(part)) {
						var m = Math.floor(parseFloat(part.replace('m', '')));
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
			$('input', '#' + _options.id).val('');
			$('.tt-newentry-workdate-label').html('Today');
			$('#newentry-workdate input').val($('#newentry-workdate').attr('data-date'));
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
		
				TT.Data.save('/entries', entry, function(resp) {
					_resetForm();
					$(TT).trigger('entry-created', [resp]);
				});
			}
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