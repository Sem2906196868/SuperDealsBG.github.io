var App = {};
App.channels = [];
App.channels.push({
	name: "SuperDeals",
	min: 510000,
	max: 567209,
	step: 5,
	value: 510000
});
App.channels.push({
	name: "ThisIsInterestin",
	min: 4,
	max: 237156,
	step: 5,
	value: 4
});
App.currentChannel = App.channels[0];
App.currentHash = '';



function getRandomMessage() {
	App.currentChannel.value = Math.floor(Math.random() * (App.currentChannel.max - App.currentChannel.min + 1)) + App.currentChannel.min;
}

function getStartMessage() {
	App.currentChannel.value = $("#rangeMessage")[0].valueAsNumber;
}

function setRangeMessage() {
	var rangeMessage = $("#rangeMessage")[0];
	rangeMessage.min = App.currentChannel.min;
	rangeMessage.max = App.currentChannel.max;
	rangeMessage.step = App.currentChannel.step;
	rangeMessage.value = App.currentChannel.value;
}

function getCurrentChannel() {
	var searchChannel = $("#searchChannel")[0];
	var searchText = searchChannel.value;
	if (searchText != '') {
		App.currentChannel = {name: searchText,	min: 1,	max: 1000, step: 5,	value: 1};
		App.channels.push(App.currentChannel);
		searchChannel.value = '';
		searchText = '';
		$("#imgChannel").attr("alt", App.currentChannel.name);
		$("#nameChannel").text(App.currentChannel.name);
		setRangeMessage();
		getPage();
	}
}

function getRandomPage() {
	getRandomMessage();
	getPage();
}

function getPrevPage() {
	App.currentChannel.value = App.currentChannel.value - App.currentChannel.step;
	getPage();

}

function getNextPage() {
	App.currentChannel.value = App.currentChannel.value + App.currentChannel.step;
	getPage();
}

function preRenderPage() {

	var textContent = '';
	textContent += `
<nav class="navbar fixed-top navbar-light bg-light">
<a id="elementNavbarBrand" class="navbar-brand" href=""><img id="imgChannel" src="telegram.png" width="30" height="30" class="d-inline-block align-top" alt="` + App.currentChannel.name + `"> <span id="nameChannel">` + App.currentChannel.name + `</span></a>
<ul class="pagination">
<li class="page-item form-inline">
<span>
<input name="searchChannel" id="searchChannel" class="form-control" type="search" placeholder="Search" aria-label="Search">
</span>
<a id="elementSearch" class="page-link bg-light" href="" title="Search"><i class="material-icons">search</i></a>
</li>
</ul>
<ul class="pagination justify-content-end">
<li class="page-item"><a id="elementPrevPage" class="page-link bg-light" href="" title="Previous"><i class="material-icons">keyboard_arrow_left</i></a></li>
<li class="page-item"><a id="elementNextPage" class="page-link bg-light" href="" title="Next"><i class="material-icons">keyboard_arrow_right</i></a></li>
</ul>
</nav>`;

	textContent += '<center>';
	textContent += '<div class="range-message"><input type="range" name="rangeMessage" id="rangeMessage" oninput="getStartMessage();" onchange="getPage();" min="' + App.currentChannel.min + '" max="' + App.currentChannel.max + '" step="' + App.currentChannel.step + '" value="' + App.currentChannel.value + '"></div>';
	textContent += '<div id="main" class="container-fluid">';
	textContent += '</div>';
	textContent += '</center>';
	$("#app").html(textContent);

}

function getPage() {

	if (App.currentChannel.value < App.currentChannel.min) {
		App.currentChannel.value = App.currentChannel.min;
	}
	if (App.currentChannel.value > App.currentChannel.max - App.currentChannel.step) {
		App.currentChannel.value = App.currentChannel.max - App.currentChannel.step;
	}
	App.currentHash = App.currentChannel.value;

	var textContent = '';
	textContent += '<div class="posts">';
	for (var i = 0; i < App.currentChannel.step; i++) {
		//textContent +='<iframe src="https://t.me/' + App.currentChannel.name + '/' + (App.currentChannel.value + i) + '?embed=1" scrolling="no" frameborder="0"></iframe>';
		textContent +='<s' + 'cript async src="https://telegram.org/js/telegram-widget.js" data-telegram-post="' + App.currentChannel.name + '/' + (App.currentChannel.value + i) + '" data-width="10%"></s' + 'cript>';
	}
	textContent +='</div>';

	$("#main").html(textContent);
	$("#rangeMessage")[0].value = App.currentChannel.value;
	$('body').bootstrapMaterialDesign();
	document.title = '' + App.currentChannel.name + ' - ' + App.currentHash;
	location.hash = '#' + App.currentHash;

}

function addOnWheel(elem, handler) {
	if (elem.addEventListener) {
		if ('onwheel' in document) {
			// IE9+, FF17+
			elem.addEventListener("wheel", handler);
		}
		else if ('onmousewheel' in document) {
			elem.addEventListener("mousewheel", handler);
		}
		else {
			// 3.5 <= Firefox < 17
			elem.addEventListener("MozMousePixelScroll", handler);
		}
	}
	else { // IE8-
		//elem.attachEvent("onmousewheel", handler);
	}
}

function my_ga(a, b, c, d, e) {
	//ga(a, b, c, d, e);
}

$(document).ready(function(){

	if (window.location.hash != '') {
		try {
			App.currentHash = parseInt((window.location.hash).replace("#", ""));
			App.currentChannel.value = App.currentHash;
		} catch (e) {
			getRandomMessage();
			App.currentHash = App.currentChannel.value;
		}
	} else {
		getRandomMessage();
		App.currentHash = App.currentChannel.value;
	}

	preRenderPage();
	getPage();

	var elementNavbarBrand = $("#elementNavbarBrand");
	var elementSearch = $("#elementSearch");
	var elementPrevPage = $("#elementPrevPage");
	var elementNextPage = $("#elementNextPage");

	elementNavbarBrand.click(function (event) {
		event.preventDefault();
		event.stopPropagation();
		getRandomPage();
		elementNavbarBrand.blur();
		//my_ga('send', 'event', 'getRandomPage', 'click', 'elementNavbarBrand');
	});
	elementSearch.click(function (event) {
		event.preventDefault();
		event.stopPropagation();
		getCurrentChannel();
		elementSearch.blur();
		//my_ga('send', 'event', 'getCurrentChannel', 'click', 'elementSearch');
	});
	elementPrevPage.click(function (event) {
		event.preventDefault();
		event.stopPropagation();
		getPrevPage();
		elementPrevPage.blur();
		//my_ga('send', 'event', 'getPrevPage', 'click', 'elementPrevPage');
	});
	elementNextPage.click(function (event) {
		event.preventDefault();
		event.stopPropagation();
		getNextPage();
		elementNextPage.blur();
		//my_ga('send', 'event', 'getNextPage', 'click', 'elementNextPage');
	});

	var initialPoint = undefined;
	var finalPoint = undefined;
	try {
		document.addEventListener('touchstart', function (event) {
			initialPoint = event.changedTouches[0];
		});
	}
	catch (e) {
		//my_ga('send', 'event', 'addEventListener', 'Error-touchstart', e);
	}
	try {
		document.addEventListener('touchend', function (event) {
			finalPoint = event.changedTouches[0];
			var xAbs = Math.abs(initialPoint.pageX - finalPoint.pageX);
			var yAbs = Math.abs(initialPoint.pageY - finalPoint.pageY);
			if (xAbs > 20 || yAbs > 20) {
				if (xAbs > yAbs) {
					if (finalPoint.pageX < initialPoint.pageX) {
						getNextPage();
						//my_ga('send', 'event', 'getNextPage', 'touchend', 'document');
						/*swipe left*/
					}
					else {
						getPrevPage();
						//my_ga('send', 'event', 'getPrevPage', 'touchend', 'document');
						/*swipe right*/
					}
				}
				else {
					if (finalPoint.pageY < initialPoint.pageY) {
						/*swipe up*/
					}
					else {
						/*swipe down*/
					}
				}
			}
		});
	}
	catch (e) {
		//my_ga('send', 'event', 'addEventListener', 'Error-touchend', e);
	}

	try {
		addOnWheel(document, function (event) {
			var delta = event.deltaY || event.detail || event.wheelDelta;
			if (delta > 0) {
				getNextPage();
				//my_ga('send', 'event', 'getNextPage', 'wheel', 'document');
			}
			else {
				getPrevPage();
				//my_ga('send', 'event', 'getPrevPage', 'wheel', 'document');
			}
			event.preventDefault();
		});
	}
	catch (e) {
		//my_ga('send', 'event', 'addEventListener', 'Error-wheel', e);
	}

}); 

$(document).keydown(function (event) {
	if (event.which == 37) {
		getPrevPage();
	}
	if (event.which == 38 || event.which == 36) {
		getRandomPage();
	}
	if (event.which == 39) {
		getNextPage();
	}
});
