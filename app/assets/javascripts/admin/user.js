(function(TT) {
	TT.User = TT.Component2({
		id: 'admin-user'
	}, function(o, p) {
		var userId = $('#' + o.id).attr('data-id');

		$('#' + o.id + '-instances .close').click(function() {
			var $li = $(this).parent(),
				id = $li.attr('data-id');

			TT.Data.del('/admin/users/' + userId + '/instances/' + id, function() {
				$li.fadeOut(function() {
					$li.remove();
				});
			});
		});
	});
})(TinyTime);