(function(TT) {
	TT.Entries = function(options) {
		var _self = {},
			_options = $.extend({
				id: 'entries',
				target: '#content'
			}, options),
			_manager,
			_groups = [],
			_groupKeys = {},
			_entries = [],
			_uninvoicedMinutes = 0,
			_totalMinutes = 0;
		
		var $entries,
			$summary;

		var _rowTmpl = ['<tr data-id="{{id}}">',
							'<td class="tt-entry-time span3">{{time}}</td>',
							'<td class="tt-entry-desc">',
								'{{#tags}}<span class="label notice">{{tags}}</span>{{/tags}}',
								'{{description}}',
							'</td>',
							'<td class="tt-entry-last">',
								'{{#invoice_id}}<span class="label">Invoiced</span>{{/invoice_id}}',
								'{{^invoice_id}}<a href="javascript:void(0)" class="tt-entry-del close">&times;</a>{{/invoice_id}}',
							'</td>',
						'</tr>'].join('');
		var _groupTmpl = ['<section class="tt-entry-group" data-date="{{work_date}}">',
							'<h2>{{label}}</h2>',
							'<table class="tt-entries-table zebra-striped">',
								'{{#entries}}',
								_rowTmpl,
								'{{/entries}}',
							'</table>',
							'<footer>{{total}}</footer>',
						'</section>'].join('');
		
		function _groupEntries() {
			var today = Date.today().toString(TT.dateFormat);
			
			var groups = [{ work_date:today, entries:[] }];
				
			_groupKeys[today] = 0;
		
			$.each(_entries, function(i, entry) {
				var group, idx;
				if(entry.work_date in _groupKeys) {
					idx = _groupKeys[entry.work_date];
					group = groups[idx];
				} else {
					idx = groups.length;
					_groupKeys[entry.work_date] = idx;
					group = { work_date:entry.work_date, entries:[] };
					groups.push(group);
				}
				
				group.entries.push(entry);
			});
			
			return groups;
		}
		
		function _updateGrandTotal() {
			var totalHtml = TT.Util.relativeTime(_totalMinutes);
			$('.tt-summary-time').html(totalHtml);
		}
		
		function _renderGroups() {
			$entries.empty();
			_totalMinutes = 0;
			_uninvoicedMinutes = 0;
			$.each(_groups, function(i, group) {
				group.minutes = 0;
				$.each(group.entries, function(j, entry) {
					entry.time = TT.Util.relativeTime(entry.minutes);
					group.minutes += entry.minutes;
					_totalMinutes += entry.minutes;
					if(!entry.invoice_id) {
						_uninvoicedMinutes += entry.minutes;
					}
				});
				
				group.label = TT.Util.recentDateLabel(group.work_date, true);
				group.total = TT.Util.relativeTime(group.minutes);
				var groupHtml = TT.template(_groupTmpl, group);
				$entries.append(groupHtml);
			});
			
			_updateGrandTotal();
		}
		
		function _removeEntry($row, deleted, deletedIdx) {
			// Hide row
			$row.fadeOut(function() {
				$row.remove();
			
				// Update grand total
				_totalMinutes -= deleted.minutes;
				_updateGrandTotal();
		
				// Find group, update totals
				var group = _groups[_groupKeys[deleted.work_date]];

				// Find copy of entry in group and remove
				var groupEntryIdx = -1;
				$.each(group.entries, function(i, entry) {
					if(entry.id === deleted.id) {
						groupEntryIdx = i;
						return false;
					}
				});
				if(groupEntryIdx > -1) {
					group.entries.splice(groupEntryIdx, 1);
				}
			
				// If group is now empty, remove it
				if(!group.entries.length && group.label !== 'Today') {
					$('.tt-entry-group[data-date=' + group.work_date + ']').remove();
					_groups.splice(_groupKeys[deleted.work_date]);
					// Rebuild groups lookup because they reference groups by index, and one has been removed;
					_groupKeys = {};
					$.each(_groups, function(i, group) {
						_groupKeys[group.work_date] = i;
					});
				} else {	
					group.minutes -= deleted.minutes;
					group.total = TT.Util.relativeTime(group.minutes);
					$('.tt-entry-group[data-date=' + group.work_date + '] footer').html(group.total);
				}
			
				// Remove entry from master array
				if(deletedIdx > -1) {
					_entries.splice(deletedIdx, 1);
				}	
			});
		}
		
		function _setupEvents() {
			$('.tt-entries-table').live('click', function(evt) {
				if($(evt.target).hasClass('close')) {
					var $row = $(evt.target).parents('tr');
					var id = parseInt($row.attr('data-id'), 10);
					
					var entryIdx = -1;
					$.each(_entries, function(i, entry) {
						if(entry.id === id) {
							entryIdx = i;
							return false;
						}
					});
					var entry = _entries[entryIdx];
					
					if(entry) {
						TT.Data.del('/' + _manager.token + '/entries/' + id, function(resp) {
							if(resp.success) {
								_removeEntry($row, entry, entryIdx);
							} else {
								alert(resp.message);
							}
						});
					}
				}
			});
			
			$(TT).bind('entry-created', function(evt, entry) {
				entry.time = TT.Util.relativeTime(entry.minutes);
				_totalMinutes += entry.minutes;
				
				if(entry.work_date in _groupKeys) {
					var group = _groups[_groupKeys[entry.work_date]];
					group.minutes += entry.minutes;
					group.total = TT.Util.relativeTime(group.minutes);
					var $group = $('section[data-date=' + entry.work_date + ']'),
						$table = $('table', $group),
						$footer = $('footer', $group);
						
					var rowHtml = TT.template(_rowTmpl, entry);
					$(rowHtml).prependTo($table).hide().fadeIn();
					$footer.html(group.total);
				} else {
					_groupKeys[entry.work_date] = _groups.length;
					var label = TT.Util.recentDateLabel(entry.work_date, true);
					var group = { work_date:entry.work_date, entries:[entry], label:label, minutes:entry.minutes };
					group.total = TT.Util.relativeTime(group.minutes);
					_groups.push(group);
					var groupHtml = TT.template(_groupTmpl, group);
					$entries.append(groupHtml);
				}
				
				_updateGrandTotal();
				_entries.push(entry);
			});
		}
		
		_self.init = function(manager) {
			_manager = manager;
			
			$entries = $('#' + _options.id, _options.target);
			$summary = $('#summary', _options.target);
			
			TT.Data.get('/' + _manager.token + '/entries', function(resp) {
				_entries = resp;
				TT.Util.groupEntries(_entries, function(groups, groupKeys) {
					_groups = groups;
					_groupKeys = groupKeys;
					_renderGroups();
				}, true);
			});
			
			_setupEvents();
			
			return _self;
		};
		
		return _self;
	};
})(TinyTime);