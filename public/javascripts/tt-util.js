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
	
	TT.Util.relativeTime = function(minutes) {
		if(minutes > (59)) { // more than 1 hr
			var h = Math.floor(minutes / 60),
				m = minutes - (h * 60);
			return h + 'h' + (m > 0 ? ' ' + m + 'm' : '')
		} else {
			return minutes + 'm';
		}
	};
})(TinyTime);