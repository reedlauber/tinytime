(function(TT) {
	TT.Data = {
		prefix: ''
	};
	
	var _d = {};
	
	var $notice = $('.tt-header-notice');
	_d.showNotice = function() {
		$notice.addClass('tt-header-notice-saving').text('Saving...').slideDown();
	};
	_d.hideNotice = function() {
		$notice.removeClass('tt-header-notice-saving').text('Saved.');
		setTimeout(function() {
			$notice.slideUp('fast');
		}, 3000);
	};
	
	_d.ajax = function (url, method, data, success, error, customParams, notice) {
        // this removes nulls because they serialize as "null" not "", which will be interpreted as a string.
        if (data && typeof data === 'object') {
            $.each(data, function (p, v) {
                if (v === null) {
                    data[p] = undefined;
                }
            });
        }

        function errorFn(resp, status) {
			if(notice) {
				_d.hideNotice();
			}
            // This object gets passed through the custom error function so it can communicate back
            var errEvt = { message: true, resp: resp };
            if (error && typeof error === 'function') {
                error.call(TT.Data, errEvt);
            }
            if (errEvt.message && status !== 'abort') {
                $(TT).trigger('message', [resp.message || 'Something bad happened with your request.', { style:'error' }]);
            }
        }

		if(notice) {
			_d.showNotice();
		}

		url = TT.Data.prefix + url;

        var ajaxOpts = $.extend({
            url: url,
            type: method,
            data: data,
            dataType: 'json',
            success: function (resp) {
				if(notice) {
					_d.hideNotice();
				}
                if (resp && resp.success === false) {
                    errorFn(resp);
                } else if (success && typeof success === 'function') {
                    success.call(TT.Data, resp);
                }
            },
            error: errorFn
        }, customParams);

        return $.ajax(ajaxOpts);
    };
	
	TT.Data.get = function(path, success, error) {
		_d.ajax(path, 'GET', {}, success, error);
	};

	TT.Data.add = function(path, data, success, error) {
		_d.ajax(path, 'PUT', data, success, error, null, true);
	};
	
	TT.Data.save = function(path, data, success, error) {
		_d.ajax(path, 'POST', data, success, error, null, true);
	};
	
	TT.Data.del = function(path, data, success, error) {
		if(typeof data == 'function') {
			error = success
			success = data
			data = {}
		}
		_d.ajax(path, 'DELETE', data, success, error, null, true);
	};
})(TinyTime);