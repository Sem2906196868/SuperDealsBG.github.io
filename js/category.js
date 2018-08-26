var tableSuperdeals = undefined;

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

function getListCategory(categories) {
	var arrayCategory = [];
	for (var key in categories) {
		var currentCategory = categories[key];
		var currentCategory_parentId = currentCategory.parentId;
		var parentCategory = categories[currentCategory_parentId];
		var currentCategory_count = currentCategory.count;
		if (currentCategory_count !=0) {
			if ((currentCategory_parentId !='0') && (typeof(parentCategory) !== 'undefined')) {
				arrayCategory.push('' + parentCategory.name + ' / ' + currentCategory.name + ' (' + currentCategory_count + ')' + '[*]' + key);
			} else {
				arrayCategory.push('' + currentCategory.name + ' (' + currentCategory_count + ')' + '[*]' + key);
			}
		}
	}
	arrayCategory.sort();
	var strCategory = '';
	for (i = 0; i < arrayCategory.length; i++) { 
		var categoryTemp = arrayCategory[i].split('[*]');
		var categoryName = categoryTemp[0];
		var categoryID = categoryTemp[1];
		strCategory += '<option value="' + categoryID + '">' + categoryName + '</option>';
	}
	$('select').append(strCategory);
	getCategoryData();
}

function getCategoryData() {
	var x = document.getElementById('listCategory');
	var i = x.selectedIndex;
	var category_name = x.options[i].text;
	var category_id = x.options[i].value;
	//alert('' + category_name + ' - ' + category_id);
	$('h1').html(category_name);

	$('#content').addClass('hide');
	$('.loader').removeClass('hide');
	$.getJSON("" + category_id + ".json", function(result){
		var items = [];
		for (var key in result) {
			var item = result[key];
			item.id = key;
			var arrayItem = [];
			var item_title = '' + item.name + ' (' + item.id + ')';
			arrayItem.push('<a href="' + item.url + '" target="_blank"><div class="img_wrapper"><img class="lazy_load" src="data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7" data-src="' + item.picture + '" title="' + item_title + '" alt="' + item_title + '"></div></a>');
			arrayItem.push('<a href="' + item.url + '" target="_blank">' + item_title + '</a>');
			arrayItem.push(item.price);
			items.push(arrayItem);
		}
		$('.loader').addClass('hide');
		$('#content').removeClass('hide');
		if (tableSuperdeals != undefined){
			tableSuperdeals.destroy();
		}
		tableSuperdeals = $('#superdeals').DataTable( {
			data: items,
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

}

$(document).ready(function() {

	$('#main').append(
		'<center>'
		+'<a href="/"><span id="logo"><img src="../images/SuperDeals-600x60.png" width="600" height="60" title="SuperDeals" alt="SuperDeals"></span></a>'
		+'<h1>All category</h1>'
		+'<select id="listCategory" onchange="getCategoryData()"></select>'
		+'<br><br>'
		+'<div id="content"><table id="superdeals" class="display" width="100%"></table></div>'
		+'<br>'
		+'<div class="loader"></div>'
		+'<br>'
		+'</center>'
	);

	$.getJSON("categories.json", function(categories){
		getListCategory(categories);
	});

});
