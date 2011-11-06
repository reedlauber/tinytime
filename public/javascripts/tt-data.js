(function(TT) {
	TT.Data = {};
	
	var _d = {};
	
	_d.ajax = function (url, method, data, success, error, customParams) {
        // this removes nulls because they serialize as "null" not "", which will be interpreted as a string.
        if (data && typeof data === 'object') {
            $.each(data, function (p, v) {
                if (v === null) {
                    data[p] = undefined;
                }
            });
        }

        function errorFn(resp, status) {
            // This object gets passed through the custom error function so it can communicate back
            var errEvt = { message: true, resp: resp };
            if (error && typeof error === 'function') {
                error.call(TT.Data, errEvt);
            }
            if (errEvt.message && status !== 'abort') {
                $(TT).trigger('message', [resp.message || 'Something bad happened with your request.', { error: true}]);
            }
        }

        var ajaxOpts = $.extend({
            url: url,
            type: method,
            data: data,
            dataType: 'json',
            success: function (resp) {
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
	
	TT.Data.save = function(path, data, success, error) {
		_d.ajax(path, 'POST', data, success, error);
	};
	
	TT.Data.del = function(path, success, error) {
		_d.ajax(path, 'DELETE', {}, success, error);
	};
})(TinyTime);