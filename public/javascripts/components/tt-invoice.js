(function(TT) {
	TT.Invoice = function() {
		var _c = TT.Component({ id:'invoice' });
		
		var $total,
			$entries;
		
		var _entriesTmpl = ['<table class="tt-entries-table zebra-striped">',
							'{{#entries}}',
							'<tr data-minutes="{{minutes}}">',
								'<td class="tt-entry-grouplabel span3">{{group}}</td>',
								'<td class="tt-entry-desc">',
									//'{{#tags}}<span class="label notice">{{tags}}</span>{{/tags}}',
									'{{description}}',
								'</td>',
								'<td class="tt-entry-time span2">{{time}}</td>',
							'</tr>',
							'{{/entries}}',
						  '</table>'].join('');
		
		function _processEntries(entries) {
			var groupLabel = '', minutes = 0;
			$.each(entries, function(i, entry) {
				var dateLabel = TT.Util.recentDateLabel(entry.work_date);
				dateLabel = Date.parse(entry.work_date).toString('yyyy-MM-dd');
				if(dateLabel != groupLabel) {
					groupLabel = dateLabel;
					entry.group = groupLabel;
				}
				minutes += entry.minutes;
				entry.time = TT.Util.relativeTime(entry.minutes);
			});
			
			$total.html(TT.Util.relativeTime(minutes));
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
		}
		
		_c.oninit = function() {
			$total = $('.tt-invoice-total span');
			$entries = $('#' + _c.options.id + '-entries');
			
			var $invoice = $('#' + _c.options.id);
			var rank = $invoice.attr('data-rank')
			
			TT.Data.get('/' + _c.manager.token + '/invoices/' + rank, function(resp) {
				_processEntries(resp);
				_renderEntries(resp);
				_setupEvents();
			});
		};
		
		return _c.pub;
	};
})(TinyTime);