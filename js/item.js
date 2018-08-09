function getOriginalImage() {
	var imgs = document.getElementsByTagName("img");
	for (var i = 0; i < imgs.length; i++) {
		var currentImage = imgs[i].src;
		if (currentImage.toLowerCase().indexOf("alicdn.com".toLowerCase()) >= 0) {
			currentImage.replace(".jpg_350x350.jpg", ".jpg").replace(".jpg_220x220.jpg", ".jpg");
			imgs[i].src = currentImage;
			break;
		}
	}
}

window.addEventListener("load", function(e) {
	getOriginalImage();
});