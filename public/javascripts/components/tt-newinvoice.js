(function(TT) {
	TT.NewInvoice = function() {
		var _c = TT.Component({ id:'newinvoice' }),
			_slider = TT.Slider({ target:'#' + _c.options.id + '-range' }),
			_minutes = { all:0, range:0, entries:0 },
			_entryIds = { all:'', range:'', entries:'' },
			_selectedType = 'all';
		
		var $total,
			$entries;
		
		var _entriesTmpl = ['<div class="tt-newinvoice-total">Total <span>0h</span></div>',
							'<table>',
							'{{#entries}}',
							'<tr data-minutes="{{minutes}}">',
								'<td class="tt-entry-group span3">{{group}}</td>',
								'<td class="tt-entry-choose span1"><input type="checkbox" /></td>',
								'<td class="tt-entry-time span2">{{time}}</td>',
								'<td class="tt-entry-desc">',
									'{{#tags}}<span class="label notice">{{tags}}</span>{{/tags}}',
									'{{description}}',
								'</td>',
							'</tr>',
							'{{/entries}}',
						  '</table>'].join('');
		
		function _updatePrice() {
			var rate = parseFloat($('#' + _c.options.id + '-rate').val());
			if(rate > 0) {
				var price = _minutes[_selectedType] / 60 * rate;
				$('.tt-newinvoice-price').html('$' + price.toFixed(2));
			}
		}
		
		function _processEntries(entries) {
			var groupLabel = '', ids = [], minutes = 0;
			$.each(entries, function(i, entry) {
				var dateLabel = TT.Util.recentDateLabel(entry.work_date);
				if(dateLabel != groupLabel) {
					groupLabel = dateLabel;
					entry.group = groupLabel;
				}
				minutes += entry.minutes;
				entry.time = TT.Util.relativeTime(entry.minutes);
				ids.push(entry.id);
			});
			
			_minutes.all = _minutes.range = minutes;
			_entryIds.all = ids.join(',');
			_entryIds.range = ids.join(',');
			
			$total.html(TT.Util.relativeTime(minutes));
			_updatePrice();
		}
		
		function _renderEntries(entries) {
			$entries.html(TT.template(_entriesTmpl, { entries:entries }));
			
			var total = 0;
			$('tr', $entries).click(function() {
				var checked = $('.tt-entry-choose input', this).attr('checked') === 'checked';
				var minutes = parseInt($(this).attr('data-minutes'), 0);
				if(checked) {
					$('.tt-entry-choose input', this).removeAttr('checked');
					total -= minutes;
				} else {
					$('.tt-entry-choose input', this).attr('checked', 'checked');
					total += minutes;
				}
				$(this).toggleClass('selected');
			});
		}
		
		function _setupEvents() {
			$('.tt-newinvoice-actions .btn.info').removeClass('disabled');
			$('.tt-newinvoice-actions .btn.success').removeClass('disabled');
			
			$('.tt-newinvoice-btns .btn').click(function() {
				if(!$(this).hasClass('disabled')) {
					$('.tt-newinvoice-btns .info').removeClass('info');
					_selectedType = $(this).addClass('info').attr('rel');
					$('.tt-newinvoice-section').hide();
					$('.tt-newinvoice-section[rel=' + _selectedType + ']').show();
				}
			});
			
			$('#' + _c.options.id + '-create-btn').click(function() {
				if(!$(this).hasClass('disabled')) {
					var rate = parseFloat($('#' + _c.options.id + '-rate:visible').val()) || 0.0;
					var invoice = {
						title: Date.today().toString('yyyy-MM-dd'),
						rate: rate,
						entries: _entryIds[_selectedType]
					};
					TT.Data.save('/invoices', invoice, function(resp) {
						window.location.href = '/' + _c.manager.username + '/' + _c.manager.slug + '/' + _c.manager.token;
					});
				}
			});
			
			$('.tt-newinvoice-summary-includerate').toggle(function() {
				$('.tt-newinvoice-summary-rate').show();
				$(this).text('Hide Rate');
				$('#' + _c.options.id + '-rate').focus();
			}, function() {
				$('.tt-newinvoice-summary-rate').hide();
				$(this).text('Include Rate');
			});
			
			$('#' + _c.options.id + '-rate').keyup(function() {
				_updatePrice();
			});
		}
		
		_c.oninit = function() {
			$total = $('.tt-newinvoice-total span');
			$entries = $('#' + _c.options.id + '-entries');
			
			_slider.init();
			
			TT.Data.get('/entries?paid=false', function(resp) {
				if(resp.length) {
					_processEntries(resp);
					_renderEntries(resp);
					_setupEvents();
				} else {
					$('.tt-newinvoice-summary').hide();
					$('#' + _c.options.id).append('There is no uninvoiced time for this timesheet.');
				}
			});
		};
		
		return _c.pub;
	};
})(TinyTime);