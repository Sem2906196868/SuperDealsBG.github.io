function lazyLoad() {
	var images = document.querySelectorAll('.lazy_load');
	for (var i = 0; i < images.length; i++) {
		var image = images[i];
		var dataSrc = image.getAttribute('data-src');
		if (dataSrc != '') {
			image.src = dataSrc;
			image.setAttribute('data-src', '');
		}
	}	
};
