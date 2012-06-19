(function(TT) {
	TT.Form = function(options) {
		var _self = {
				onSubmit: options.onSubmit || function() {}
			},
			_context = options.context || '#content',
			_fields = options.fields || [],
			_data = options.data || {},
			_submitBtn = options.submit || '';

		if(_submitBtn && typeof _self.onSubmit === 'function') {
			$(_submitBtn).click(function() {
				if(_self.validate()) {
					var data = TT.Form.getValues(_fields, _context, _data);
					_self.onSubmit(data);
				}
			});
		}

		_self.validate = function() {
			var isValid = true;
			TT.Form.validate(_fields, _context, function(valid, messages) {
				if(!valid) {
					TT.Form.showValidationMessage(messages);
				}
				isValid = valid;
			});
			return isValid;
		};

		return _self;
	};

	TT.Form.showValidationMessage = function(messages) {
		var msgs = '<ul><li>' + messages.join('</li><li>') + '</li></ul>';
		$(TT).trigger('message', [msgs, { style:'error' }]);
	};

	TT.Form.getValues = function(fields, context, data) {
		data = data || {};
		$.each(fields, function(i, field) {
			var $field = field.$field || $('#' + field.id, context);
			field.$field = $field;
			if($field.length) {
				data[field.prop || field.id] = $field.val();
			}
		});
		return data;
	};

	TT.Form.validate = function(fields, context, callback) {
		var valid = true,
			messages = [];

		$.each(fields, function(i, field) {
			// get field controlr
			$field = field.$field || $('#' + field.id, context);
			field.$field = $field;

			// only do validation if the field exists and is not hidden
			if($field.length && $field.is(':visible')) {
				// do required check
				if(field.required && !$field.val()) {
					valid = false;
					$field.addClass('error');
					if(field.label) {
						messages.push('<strong>' + field.label + '</strong> is required.');
					}
				}
			}
		});

		if(typeof callback == 'function') {
			callback(valid, messages);
		}
	};
})(TinyTime);