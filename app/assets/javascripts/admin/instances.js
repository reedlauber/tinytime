//=require_self

(function(TT) {
	TT.Instances = TT.Component2({
		id: 'admin-projects'
	}, function(o, p) {
		$('#' + o.id + '-clean-btn').click(function() {
			TT.Data.post('/admin/instances/clean', function(resp) {
				window.location.reload();
			});
		});
	});
})(TinyTime);