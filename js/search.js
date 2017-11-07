var App = {};
App.arrayScript = [];
App.dataAll = [];

function loadScripts(scripts, callback) {
	var deferred = $.Deferred();
	function loadScript(scripts, callback, i) {
		$.ajax({
			url: scripts[i],
			dataType: "script",
			cache: true,
			success: function() {
				if (i + 1 < scripts.length) {
					loadScript(scripts, callback, i + 1);
				} else {
					if (callback) {
						callback();
					}
					deferred.resolve();
				}
			}
		});
	}
	loadScript(scripts, callback, 0);
	return deferred;
}

function addDataToArrayScript(data) {
	var array = data.files;
	for (var i = 0; i < array.length; i++) {
		if (i > 3) { 
			break; 
		}
		App.arrayScript.push(array[i].file);
	}
}

function addArrayToDataAll(array) {
	for (var i = 0; i < array.length; i++) {
		var item = array[i];
		var arrayItem = [];
		arrayItem.push('<a href="../?item=' + item.search + '" target="_blank"><div class="img_wrapper"><img class="lazy_load" src="data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7" data-src="' + item.image + '"></div></a>');
		arrayItem.push('<a href="' + item.url + '" target="_blank">' + item.title + '</a>');
		arrayItem.push(item.price);
		App.dataAll.push(arrayItem);
	}
}

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
	$('<link>').appendTo('head').attr({
		type: 'text/css', 
		rel: 'stylesheet',
		href: 'css/jquery.dataTables.css'
	});
	$.getScript('js/data/data.js', function () {
		$.when(loadScripts(App.arrayScript), loadScripts(['js/jquery.dataTables.js'])).done(function() {
			var tableSuperdeals = $('#superdeals').DataTable( {
				data: App.dataAll,
				order: [],
				columns: [
					{ title: "" },
					{ title: "" },
					{ title: "" }
				],
				"drawCallback": function(settings) {
					lazyLoad();
				}		
			});
		});		
	});
});
