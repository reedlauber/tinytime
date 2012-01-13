(function(TT) {
	TT.Util = {};
	
	TT.dateFormat = 'yyyy-MM-dd';
	TT.dateShortFormat = 'ddd MMM dd';
	TT.dateLongFormat = 'dddd, MMMM dd, yyyy';
	
	var _recentDates = {};
	_recentDates[Date.today().toString(TT.dateFormat)] = 'Today';
	_recentDates[Date.today().addDays(-1).toString(TT.dateFormat)] = 'Yesterday';
	for(var d = -2, dt; d > -8; d--) {
		dt = Date.today().addDays(d);
		_recentDates[dt.toString(TT.dateFormat)] = 'Last ' + dt.toString('dddd');
	}
	
	TT.Util.recentDateLabel = function(date, longFormat) {
		var dateStr;
		if(typeof date === 'string') {
			dateStr = date;
			date = Date.parse(date);
		} else {
			dateStr = date.toString(TT.dateFormat);
		}
		var format = longFormat ? TT.dateLongFormat : TT.dateShortFormat;
		return _recentDates[dateStr] || date.toString(format);
	};
	
	var relativeTimeStyles = {
		single: { hours:'h', minutes:'m', secconds:'s' },
		"short": { hours:' hr', minutes:' min', seconds:' sec' },
		"long": { hours:' hour', minutes:' minute', seconds:' second' }
	};
	TT.Util.relativeTime = function(minutes, style) {
		style = style || 'single';
		if(!style in relativeTimeStyles) {
			style = 'single';
		}
		var pluralize = style != 'single';
		var s = relativeTimeStyles[style];
		
		if(minutes > (59)) { // more than 1 hr
			var h = Math.floor(minutes / 60),
				m = minutes - (h * 60);
				
			return h + s.hours + (pluralize && h > 1 ? 's' : '') + 
					(m > 0 ? ' ' + (m + s.minutes + (pluralize && m > 1 ? 's' : '')) : '')
		} else {
			return minutes + s.minutes;
		}
	};
	
	TT.Util.groupEntries = function(entries, callback, addToday) {
		var today = Date.today().toString(TT.dateFormat);
		
		var groups = [],
			groupKeys = {};
		
		if(addToday) {
			groups.push({ work_date:today, entries:[] });
			groupKeys[today] = 0;
		}
	
		$.each(entries, function(i, entry) {
			var group, idx;
			if(entry.work_date in groupKeys) {
				idx = groupKeys[entry.work_date];
				group = groups[idx];
			} else {
				idx = groups.length;
				groupKeys[entry.work_date] = idx;
				group = { work_date:entry.work_date, entries:[] };
				groups.push(group);
			}
			
			group.entries.push(entry);
		});
		
		if(typeof callback === 'function') {
			callback(groups, groupKeys);
		}
	};
	
	TT.Util.formatMoney = function(val, requireCents) {
		if(typeof val != 'number') {
			return '';
		}
		
		val = Math.round(val * 100).toString();
		var dollars = val.substring(0, val.length - 2);
		var cents = val.substr(val.length - 2);
		var commas = Math.floor((dollars.length - 1) / 3);
		if(commas > 0) {
			var c = 0, offset = dollars.length % 3;
			while(commas--) {
				c = ((commas + 1) * 3) - offset;
				dollars = dollars.substring(0, c) + ',' + dollars.substr(c);
			}
		}
		return '$' + dollars + (requireCents || cents !== '00' ? '.' + cents : '');
	};
})(TinyTime);