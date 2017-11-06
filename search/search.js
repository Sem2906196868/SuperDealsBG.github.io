function imgLoaded(img) {
	$(img).parent().addClass('loaded');
};

function lazyLoad() {
	var $images = $('.lazy_load');
	$images.each(function () {
		var $img = $(this);
		if ($img.attr('data-src') != '') {
			$img.on('load', imgLoaded($img[0])).attr('src', $img.attr('data-src')).attr('data-src', '');
		}
	});
};

$(document).ready(function() {
	$.getScript('data-table.js', function () {
		var tableSuperdeals = $('#superdeals').DataTable( {
			data: dataSet,
			columns: [
				{ title: "" },
				{ title: "" },
				{ title: "" }
			],
			"drawCallback": function(settings) {
				lazyLoad();
			}		
		});
		tableSuperdeals.rows().every( function () {
			var d = this.data();
			d[0]='<a href="../?item=' + d[0] + '" target="_blank"><div class="img_wrapper"><img class="lazy_load" src="data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7" data-src="' + d[3] + '"></div></a>';
			d[1]='<a href="' + d[4] + '" target="_blank">' + d[1] + '</a>';
			d[3]='';
			d[4]='';
			this.invalidate();
		} );
		tableSuperdeals.draw();
	});
});
