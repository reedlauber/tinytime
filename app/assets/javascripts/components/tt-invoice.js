(function(TT) {
	TT.Invoice = function() {
		var _c = TT.Component({ id:'invoice' });
		
		var $invoice,
				$entries,
				$total,
				$totalDue;
		
		var _entriesTmpl = ['<table class="tt-entries-table zebra-striped">',
							'{{#entries}}',
							'<tr data-minutes="{{minutes}}">',
								'<td class="tt-entry-grouplabel span3">{{group}}</td>',
								'<td class="tt-entry-desc">',
									'{{description}}',
								'</td>',
								'<td class="tt-entry-time span2">{{time}}</td>',
							'</tr>',
							'{{/entries}}',
						  '</table>'].join('');
		
		function _processEntries(entries) {
			var rate = parseFloat($invoice.attr('data-rate'));
			if(isNaN(rate)) {
				rate = 0.0;
			}
			
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
			
			$total.html(TT.Util.relativeTime(minutes, 'long'));
			
			if(rate > 0.0) {
				var totalDue = Math.round(minutes / 60) * rate;
				$totalDue.html(TT.Util.formatMoney(totalDue, true));
				$('.tt-invoice-totaldue-outer').show();
			}
		}
		
		function _renderEntries(entries) {
			$entries.html(TT.template(_entriesTmpl, { entries:entries }));
		}
		
		_c.oninit = function() {
			$invoice = $('#' + _c.options.id);
			$total = $('.tt-invoice-total span');
			$totalDue = $('.tt-invoice-totaldue span');
			$entries = $('#' + _c.options.id + '-entries');
			
			var rank = $invoice.attr('data-rank');
			
			TT.Data.get('/invoices/' + rank, function(resp) {
				_processEntries(resp);
				_renderEntries(resp);
			});
		};
		
		return _c.pub;
	};
})(TinyTime);