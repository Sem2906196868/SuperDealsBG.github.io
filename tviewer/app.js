var App = {};
App.channels = [];

App.channels.push({
	name: "SuperDeals",
	min: 510000,
	max: 567489,
	step: 5,
	value: 510000
});
App.channels.push({
	name: "ThisIsInterestin",
	min: 237000,
	max: 237238,
	step: 5,
	value: 237000
});

App.currentChannel = App.channels[0];
App.currentHash = '';



function getRandomMessage() {
	App.currentChannel.value = Math.floor(Math.random() * (App.currentChannel.max - App.currentChannel.min + 1)) + App.currentChannel.min;
}

function getStartMessage() {
	App.currentChannel.value = $('#rangeMessage')[0].valueAsNumber;
}

function setRangeMessage() {
	var rangeMessage = $('#rangeMessage')[0];
	rangeMessage.min = App.currentChannel.min;
	rangeMessage.max = App.currentChannel.max;
	rangeMessage.step = App.currentChannel.step;
	rangeMessage.value = App.currentChannel.value;
}

function searchChannelInArray(array, searchFor, property) {
	var retVal = -1;
	var self = array;
	for(var index=0; index < self.length; index++){
		var item = self[index];
		if (item.hasOwnProperty(property)) {
			if (item[property].toLowerCase() === searchFor.toLowerCase()) {
				retVal = index;
				return retVal;
			}
		}
	};
	return retVal;
}

function getCurrentChannel() {
	var searchChannel = $('#searchChannel')[0];
	var searchText = searchChannel.value;
	if (searchText != '') {
		var searchIndex = searchChannelInArray(App.channels, searchText, 'name');
		if (searchIndex == -1) {
			if (searchText.toLowerCase() === 'SuperDeals'.toLowerCase()) {
				App.currentChannel = {name: 'SuperDeals', min: 510000,	max: 567489, step: 5, value: 510000};
			} else if (searchText.toLowerCase() === 'ThisIsInterestin'.toLowerCase()) {
				App.currentChannel = {name: 'ThisIsInterestin', min: 237000,	max: 237238, step: 5, value: 237000};
			} else {
				App.currentChannel = {name: searchText,	min: 1,	max: 1000, step: 5,	value: 1};
			}
			App.channels.push(App.currentChannel);
		} else {
			App.currentChannel = App.channels[searchIndex];
		}
		searchChannel.value = '';
		searchText = '';
		var currentChannelName = App.currentChannel.name;
		var logoChannel = $('#logoChannel');
		logoChannel.attr('title', currentChannelName);
		logoChannel.text(currentChannelName.charAt(0).toUpperCase());
		$('#nameChannel').text(' ' + currentChannelName);

		var textListChannel = "";
		for (i = 0; i < App.channels.length; i++) {
			textListChannel += '<button class="dropdown-item list-channel-item" type="button">' + App.channels[i].name + '</button>';
		}
		$("#listChannel").html(textListChannel);

		var listChannelItem = $('.list-channel-item');
		listChannelItem.click(function (event) {
			var nameChannel = $(this).text();
			App.currentChannel = App.channels[searchChannelInArray(App.channels, nameChannel, 'name')];
			var currentChannelName = App.currentChannel.name;
			var logoChannel = $('#logoChannel');
			logoChannel.attr('title', currentChannelName);
			logoChannel.text(currentChannelName.charAt(0).toUpperCase());
			$('#nameChannel').text(' ' + currentChannelName);
			setRangeMessage();
			getPage();
			//my_ga('send', 'event', 'selectChannel: ' + nameChannel, 'click', 'listChannelItem');
		});

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

function renderDialogAddChannel() {
	$('#modalDialog').html(`
<div class="modal fade" id="modalDialogAddChannel" tabindex="-1" role="dialog" aria-labelledby="modalDialogAddChannelLabel" aria-hidden="true">
<div class="modal-dialog modal-dialog-centered" role="document">
<div class="modal-content">
<div class="modal-header">
<h5 class="modal-title" id="modalDialogAddChannelLabel">Add channel</h5>
<button type="button" class="close" data-dismiss="modal" aria-label="Close">
<span aria-hidden="true">&times;</span>
</button>
</div>
<div class="modal-body">
<span>
<input name="searchChannel" id="searchChannel" class="form-control" type="text" id="search" placeholder="Enter telegram public channel name...">
<small class="text-muted">Example: 
<a href="" class="btnAddChannel badge badge-pill badge-light">Durov</a>, 
<a href="" class="btnAddChannel badge badge-pill badge-light">SuperDeals</a>, 
<a href="" class="btnAddChannel badge badge-pill badge-light">ThisIsInterestin</a>, 
<a href="" class="btnAddChannel badge badge-pill badge-light">ReceptiVkusno</a>, 
<a href="" class="btnAddChannel badge badge-pill badge-light">AndroidResId</a> etc.</small>
</span>
</div>
<div class="modal-footer">
<button type="button" class="btn btn-secondary" data-dismiss="modal">Close</button>
<button id="btnDialogAddChannelSave" type="button" class="btn btn-primary" data-dismiss="modal">Add channel</button>
</div>
</div>
</div>
</div>
`);

	var searchChannel = $('#searchChannel');
	var btnAddChannel = $('.btnAddChannel');
	btnAddChannel.click(function (event) {
		var nameChannel = $(this).text();
		event.preventDefault();
		event.stopPropagation();
		searchChannel.val(nameChannel);
		btnAddChannel.blur();
		//my_ga('send', 'event', 'searchChannel: ' + nameChannel, 'click', 'btnAddChannel');
	});

	$('#modalDialogAddChannel').on('hidden.bs.modal', function (e) {
		$('#modalDialog').html('');
	});	
	$('#btnDialogAddChannelSave').click(function (event) {
		getCurrentChannel();
		//my_ga('send', 'event', 'getCurrentChannel', 'click', 'btnDialogAddChannelSave');
	});
}
function renderDialogSettings() {
	var currentChannelName = App.currentChannel.name;
	$('#modalDialog').html(`
<div class="modal fade" id="modalDialogSettings" tabindex="-1" role="dialog" aria-labelledby="modalDialogSettingsLabel" aria-hidden="true">
<div class="modal-dialog modal-dialog-centered" role="document">
<div class="modal-content">
<div class="modal-header">
<h5 class="modal-title" id="modalDialogSettingsLabel">Settings</h5>
<button type="button" class="close" data-dismiss="modal" aria-label="Close">
<span aria-hidden="true">&times;</span>
</button>
</div>
<div class="modal-body">

<span class="letter-circle" title="` + currentChannelName + `">` + currentChannelName.charAt(0).toUpperCase() + `</span><span id="nameChannel"> ` + currentChannelName + `</span><br/><br/>
<form>
<div class="form-group">
<label for="currentChannelMin" class="bmd-label-floating">Min message</label>
<input type="number" class="form-control" id="currentChannelMin" name="currentChannelMin" min="1" value="` + App.currentChannel.min + `">
<span class="bmd-help">` + currentChannelName + ` channel min message</span>
</div>
<div class="form-group">
<label for="currentChannelMax" class="bmd-label-floating">Max message</label>
<input type="number" class="form-control" id="currentChannelMax" name="currentChannelMax" min="1" value="` + App.currentChannel.max + `">
<span class="bmd-help">` + currentChannelName + ` channel max message</span>
</div>
<div class="form-group">
<label for="currentChannelValue" class="bmd-label-floating">Current message</label>
<input type="number" class="form-control" id="currentChannelValue" name="currentChannelValue" min="1" value="` + App.currentChannel.value + `">
<span class="bmd-help">` + currentChannelName + ` channel current message</span>
</div>
<div class="form-group">
<label for="currentChannelStep" class="bmd-label-floating">Step messages</label>
<input type="number" class="form-control" id="currentChannelStep" name="currentChannelStep" min="1" max="10" step="1" value="` + App.currentChannel.step + `">
<span class="bmd-help">` + currentChannelName + ` channel step messages</span>
</div>
</form>

</div>
<div class="modal-footer">
<button type="button" class="btn btn-secondary" data-dismiss="modal">Close</button>
<button id="btnDialogSettingsSave" type="button" class="btn btn-primary" data-dismiss="modal">Save settings</button>
</div>
</div>
</div>
</div>
`);
	$('#modalDialog').bootstrapMaterialDesign();

	$('#modalDialogSettings').on('hidden.bs.modal', function (e) {
		$('#modalDialog').html('');
	});
	$('#btnDialogSettingsSave').click(function (event) {
		alert('modalDialogSettingsSave');
		//TODO Save settings...
		//my_ga('send', 'event', 'renderDialogSettingsSave', 'click', 'btnDialogSettingsSave');
	});
}
function renderDialogAbout() {
	$('#modalDialog').html(`
<div class="modal fade" id="modalDialogAbout" tabindex="-1" role="dialog" aria-labelledby="modalDialogAboutLabel" aria-hidden="true">
<div class="modal-dialog modal-dialog-centered" role="document">
<div class="modal-content">
<div class="modal-header">
<h5 class="modal-title" id="modalDialogAboutLabel">About</h5>
<button type="button" class="close" data-dismiss="modal" aria-label="Close">
<span aria-hidden="true">&times;</span>
</button>
</div>
<div class="modal-body">
<center>
<h4>TViewer</h4>
<br/>
<img src="telegram.svg" width="120" height="120" class="img-fluid rounded" alt="TViewer">
<br/><br/>
<p>Telegram public channel viewer</p>
</center>
</div>
<div class="modal-footer">
<button type="button" class="btn btn-secondary" data-dismiss="modal">Close</button>
</div>
</div>
</div>
</div>
`);

	$('#modalDialogAbout').on('hidden.bs.modal', function (e) {
		$('#modalDialog').html('');
	});	
}

function preRenderPage() {

	var currentChannelName = App.currentChannel.name;
	var textContent = '';
	textContent += `
<header>

<nav class="navbar fixed-top navbar-light bg-light">
<a class="navbar-brand" href="">
<div class="dropdown-toggle" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
<span id="logoChannel" class="letter-circle" title="` + currentChannelName + `">` + currentChannelName.charAt(0).toUpperCase() + `</span><span id="nameChannel"> ` + currentChannelName + `</span>
</div>
<div class="dropdown-menu" style="max-height:320px;width:auto;overflow:auto;">
<button id="btnDialogAddChannel" type="button" class="dropdown-item" data-toggle="modal" data-target="#modalDialogAddChannel">Add channel</button>
<div class="dropdown-divider"> </div>
<h6 class="dropdown-header">Select channel</h6>
<div id="listChannel"></div>
</div>
</a>
<!-- 
<a id="elementNavbarBrand" class="navbar-brand" href=""><img id="logoBrand" src="telegram.svg" width="30" height="30" class="d-inline-block align-top" title="TViewer" alt="TViewer"><span id="nameBrand"> TViewer</span></a> 
-->
<div class="form-inline">
<button id="elementPrevPage" class="btn bmd-btn-icon" type="button" title="Previous"><i class="material-icons">keyboard_arrow_left</i></button>
<button id="elementNextPage" class="btn bmd-btn-icon" type="button" title="Next"><i class="material-icons">keyboard_arrow_right</i></button>
<div class="dropdown pull-xs-right">
<button class="btn bmd-btn-icon dropdown-toggle" type="button" id="lr1" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false" title="Menu">
<i class="material-icons">more_vert</i>
</button>
<div class="dropdown-menu dropdown-menu-right" aria-labelledby="lr1" style="left:-150px">
<button id="btnDialogSettings" type="button" class="dropdown-item" data-toggle="modal" data-target="#modalDialogSettings">Settings</button>
<div class="dropdown-divider"> </div>
<button id="btnDialogAbout" type="button" class="dropdown-item" data-toggle="modal" data-target="#modalDialogAbout">About</button>
</div>
</div>
</div>
</nav>
</header>
<div id="modalDialog"></div>
`;

	textContent += `
<center>
<div class="range-message" style="display: inline-flex;">


<span style="width: 100%;">
<input type="range" name="rangeMessage" id="rangeMessage" oninput="getStartMessage();" onchange="getPage();" min="` + App.currentChannel.min + `" max="` + App.currentChannel.max + `" step="` + App.currentChannel.step + `" value="` + App.currentChannel.value + `">
</span>

</div>
<main id="main" role="main" class="container-fluid"></main>
</center>
`;
	$("#app").html(textContent);

	var textListChannel = "";
	for (i = 0; i < App.channels.length; i++) {
		textListChannel += '<button class="dropdown-item list-channel-item" type="button">' + App.channels[i].name + '</button>';
	}
	$("#listChannel").html(textListChannel);

	var listChannelItem = $('.list-channel-item');
	listChannelItem.click(function (event) {
		var nameChannel = $(this).text();
		App.currentChannel = App.channels[searchChannelInArray(App.channels, nameChannel, 'name')];
		var currentChannelName = App.currentChannel.name;
		var logoChannel = $('#logoChannel');
		logoChannel.attr('title', currentChannelName);
		logoChannel.text(currentChannelName.charAt(0).toUpperCase());
		$('#nameChannel').text(' ' + currentChannelName);
		setRangeMessage();
		getPage();
		//my_ga('send', 'event', 'selectChannel: ' + nameChannel, 'click', 'listChannelItem');
	});

}

function getPage() {

	if (App.currentChannel.value < App.currentChannel.min) {
		App.currentChannel.value = App.currentChannel.min;
	}
	if (App.currentChannel.value > App.currentChannel.max - App.currentChannel.step) {
		App.currentChannel.max = App.currentChannel.value + App.currentChannel.step;
	}
	App.currentHash = App.currentChannel.value;

	var textContent = '';
	textContent += '<div class="posts">';
	//textContent += '<div class="card"><div class="card-body">';
	for (var i = 0; i < App.currentChannel.step; i++) {
		//textContent +='<iframe src="https://t.me/' + App.currentChannel.name + '/' + (App.currentChannel.value + i) + '?embed=1" scrolling="no" frameborder="0"></iframe>';
		textContent +='<s' + 'cript async src="https://telegram.org/js/telegram-widget.js" data-telegram-post="' + App.currentChannel.name + '/' + (App.currentChannel.value + i) + '" data-width="10%"></s' + 'cript>';
	}
	//textContent += '</div></div>';
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
	var elementPrevPage = $("#elementPrevPage");
	var elementNextPage = $("#elementNextPage");

	elementNavbarBrand.click(function (event) {
		event.preventDefault();
		event.stopPropagation();
		getRandomPage();
		elementNavbarBrand.blur();
		//my_ga('send', 'event', 'getRandomPage', 'click', 'elementNavbarBrand');
	});
	elementPrevPage.click(function (event) {
		getPrevPage();
		elementPrevPage.blur();
		//my_ga('send', 'event', 'getPrevPage', 'click', 'elementPrevPage');
	});
	elementNextPage.click(function (event) {
		getNextPage();
		elementNextPage.blur();
		//my_ga('send', 'event', 'getNextPage', 'click', 'elementNextPage');
	});

	$(".navbar-brand").click(function (event) {
		event.preventDefault();
	});
	$("#btnDialogAddChannel").click(function (event) {
		renderDialogAddChannel();
		//my_ga('send', 'event', 'renderDialogAddChannel', 'click', 'btnDialogAddChannel');
	});
	$("#btnDialogSettings").click(function (event) {
		renderDialogSettings();
		//my_ga('send', 'event', 'renderDialogSettings', 'click', 'btnDialogSettings');
	});
	$("#btnDialogAbout").click(function (event) {
		renderDialogAbout();
		//my_ga('send', 'event', 'renderDialogAbout', 'click', 'btnDialogAbout');
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
			if (event.target.className == "posts") {
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
			}
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
