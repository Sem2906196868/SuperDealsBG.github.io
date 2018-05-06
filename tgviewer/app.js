var App = {};
App.name = 'TGViewer';
App.step = 6;
App.channels = [];
App.currentChannel = {};
App.currentHash = '';



function getRandomMessage() {
	if (!$.isEmptyObject(App.currentChannel)) {
		App.currentChannel.value = Math.floor(Math.random() * (App.currentChannel.max - App.currentChannel.min + 1)) + App.currentChannel.min;
	}	
}

function getStartMessage() {
	if (!$.isEmptyObject(App.currentChannel)) {
		App.currentChannel.value = $('#rangeMessage')[0].valueAsNumber;
	}
}

function setRangeMessage() {
	if (!$.isEmptyObject(App.currentChannel)) {
		var rangeMessage = $('#rangeMessage')[0];
		rangeMessage.step = App.step;
		rangeMessage.min = App.currentChannel.min;
		rangeMessage.max = App.currentChannel.max;
		rangeMessage.value = App.currentChannel.value;
	}
}

function searchElementIndexInArray(array, searchFor, property) {
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

function renderLogoApp(element) {
	if (!$.isEmptyObject(App.currentChannel)) {
		var currentChannelName = App.currentChannel.name;
		$(element).html('<span class="letter-circle" title="' + currentChannelName + '">' + currentChannelName.charAt(0).toUpperCase() + '</span><span class="logo-app">' + currentChannelName + '</span>');
	} else {
		var currentAppName = App.name;
		$(element).html('<img src="telegram.svg" width="30" height="30" class="d-inline-block align-top" title="' + currentAppName + '" alt="' + currentAppName + '"><span class="logo-app">' + currentAppName + '</span>');
	}
}
function renderListChannel() {
	if (App.channels.length > 0) {
		var textListChannel = '';
		textListChannel += '<div class="dropdown-divider"> </div>';
		textListChannel += '<h6 class="dropdown-header">Select channel</h6>';
		for (i = 0; i < App.channels.length; i++) {
			textListChannel += '<button class="dropdown-item list-channel-item" type="button">' + App.channels[i].name + '</button>';
		}
		$("#listChannel").html(textListChannel);
		if (textListChannel != '') {
			var listChannelItem = $('.list-channel-item');
			listChannelItem.click(function (event) {
				var nameChannel = $(this).text();
				App.currentChannel = App.channels[searchElementIndexInArray(App.channels, nameChannel, 'name')];
				renderLogoApp('#logoApp');
				toggleDeleteChannel();
				setRangeMessage();
				getPage();
				//my_ga('send', 'event', 'selectChannel: ' + nameChannel, 'click', 'listChannelItem');
			});
		}
	} else {
		$("#listChannel").html('');
	}
	toggleDeleteChannel();
}

function toggleDeleteChannel() {
	if (!$.isEmptyObject(App.currentChannel)) {
		$("#deleteChannel").html('<button id="btnDeleteChannel" type="button" class="dropdown-item"><i class="material-icons my-icon-dropdown">delete</i> Delete channel</button>');
		$('#btnDeleteChannel').click(function (event) {
			deleteCurrentChannel();
			my_ga('send', 'event', 'deleteCurrentChannel', 'click', 'btnDeleteChannel');
		});
	} else {
		$("#deleteChannel").html('');
	}
}

function deleteCurrentChannel(){
	if (!$.isEmptyObject(App.currentChannel)) {
		if (App.channels.length > 0) {
			App.channels.splice(searchElementIndexInArray(App.channels, App.currentChannel.name, 'name'), 1);
			App.currentChannel = {};
			App.currentHash = '';
			renderLogoApp('#logoApp');
			renderListChannel();
			getPage();
		}
	}
}

function addCurrentChannelSettings(currentChannelName) {
	var nameValue = currentChannelName;
	var minValue = 1;
	var maxValue = 1000;
	if (currentChannelName.toLowerCase() === 'SuperDeals'.toLowerCase()) {
		nameValue = 'SuperDeals';
		minValue = 510000;
		maxValue = 568000;
	} else if (currentChannelName.toLowerCase() === 'ThisIsInterestin'.toLowerCase()) {
		nameValue = 'ThisIsInterestin';
		minValue = 237000;
		maxValue = minValue + 1000;
	}
	App.currentChannel = {name: nameValue, min: minValue, max: maxValue, value: minValue};
}
function getCurrentChannel() {
	var searchChannel = $('#searchChannel')[0];
	var searchText = searchChannel.value;
	if (searchText != '') {
		var searchElementIndex = searchElementIndexInArray(App.channels, searchText, 'name');
		if (searchElementIndex == -1) {
			addCurrentChannelSettings(searchText);
			App.channels.push(App.currentChannel);
		} else {
			App.currentChannel = App.channels[searchElementIndex];
		}
		searchChannel.value = '';
		searchText = '';
		renderLogoApp('#logoApp');
		renderListChannel();
		setRangeMessage();
		getPage();
	}
}

function getRandomPage() {
	getRandomMessage();
	getPage();
}

function getPrevPage() {
	if (!$.isEmptyObject(App.currentChannel)) {
		App.currentChannel.value = App.currentChannel.value - App.step;
		getPage();
	}
}

function getNextPage() {
	if (!$.isEmptyObject(App.currentChannel)) {
		App.currentChannel.value = App.currentChannel.value + App.step;
		getPage();
	}
}

function getTextSearchChannel() {
	return `
<span>
<input name="searchChannel" id="searchChannel" class="form-control" type="text" id="search" placeholder="Enter telegram public channel name...">
<small class="text-muted">Example: 
<a href="" class="btnAddChannel badge badge-pill badge-light">Durov</a>, 
<a href="" class="btnAddChannel badge badge-pill badge-light">SuperDeals</a>, 
<a href="" class="btnAddChannel badge badge-pill badge-light">ThisIsInterestin</a>, 
<a href="" class="btnAddChannel badge badge-pill badge-light">ReceptiVkusno</a>, 
<a href="" class="btnAddChannel badge badge-pill badge-light">AndroidResId</a> etc.</small>
</span>
`;
}
function renderDialogAddChannel() {
	var textDialog = `
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
` + getTextSearchChannel() + `
</div>
<div class="modal-footer">
<button type="button" class="btn btn-secondary" data-dismiss="modal">Close</button>
<button id="btnDialogAddChannelSave" type="button" class="btn btn-primary" data-dismiss="modal">Add channel</button>
</div>
</div>
</div>
</div>
`;
	$('#modalDialog').html(textDialog);
	var searchChannel = $('#searchChannel');
	var btnAddChannel = $('.btnAddChannel');
	btnAddChannel.click(function (event) {
		var nameChannel = $(this).text();
		event.preventDefault();
		event.stopPropagation();
		searchChannel.val(nameChannel);
		btnAddChannel.blur();
		my_ga('send', 'event', 'searchChannel: ' + nameChannel, 'click', 'btnAddChannel');
	});
	$('#modalDialogAddChannel').on('shown.bs.modal', function (e) {
		searchChannel.trigger('focus');
		searchChannel.select();
	});	
	$('#modalDialogAddChannel').on('hidden.bs.modal', function (e) {
		$('#modalDialog').html('');
	});	
	$('#btnDialogAddChannelSave').click(function (event) {
		getCurrentChannel();
		my_ga('send', 'event', 'getCurrentChannel', 'click', 'btnDialogAddChannelSave');
	});
}
function renderDialogSettings() {
	var textDialog = `
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
<div id="logoAppDialog"></div>
<br/>
<div>
<div class="form-group">
<label for="appStep" class="bmd-label-floating">Step messages</label>
<input type="number" class="form-control" id="appStep" name="appStep" min="1" max="10" step="1" value="` + App.step + `">
<span class="bmd-help">App step messages</span>
</div>
</div>
`;
	if (!$.isEmptyObject(App.currentChannel)) {
		var currentChannelName = App.currentChannel.name;
		textDialog +=`
<div>
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
</div>
`;
	}
	textDialog +=`
</div>
<div class="modal-footer">
<button type="button" class="btn btn-secondary" data-dismiss="modal">Close</button>
<button id="btnDialogSettingsSave" type="button" class="btn btn-primary" data-dismiss="modal">Save settings</button>
</div>
</div>
</div>
</div>
`;
	$('#modalDialog').html(textDialog);
	renderLogoApp('#logoAppDialog');
	$('#modalDialog').bootstrapMaterialDesign();
	$('#modalDialogSettings').on('shown.bs.modal', function (e) {
		$('#appStep').trigger('focus');
		$('#appStep').select();
	});	
	$('#modalDialogSettings').on('hidden.bs.modal', function (e) {
		$('#modalDialog').html('');
	});
	$('#btnDialogSettingsSave').click(function (event) {

		//TODO add validation value settings...

		App.step = parseInt($('#appStep').val());
		if (!$.isEmptyObject(App.currentChannel)) {
			App.currentChannel.min = parseInt($('#currentChannelMin').val());
			App.currentChannel.max = parseInt($('#currentChannelMax').val());
			App.currentChannel.value = parseInt($('#currentChannelValue').val());
			App.currentHash = App.currentChannel.value;
			location.hash = '#' + App.currentHash;
		}
		setAppCashe();
		my_ga('send', 'event', 'renderDialogSettingsSave', 'click', 'btnDialogSettingsSave');
	});
}
function renderDialogAbout() {
	var textDialog = `
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
<h4>` + App.name + `</h4>
<br/>
<img src="telegram.svg" width="120" height="120" class="img-fluid rounded" alt="` + App.name + `">
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
`;
	$('#modalDialog').html(textDialog);
	$('#modalDialogAbout').on('hidden.bs.modal', function (e) {
		$('#modalDialog').html('');
	});	
}

function preRenderPage() {
	var textContent = `
<header>
<nav class="my-navbar navbar fixed-top navbar-light bg-light">
<a class="navbar-brand" href="">
<!-- <div class="dropdown-toggle my-dropdown-toggle" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false"> -->
<div class="my-dropdown-toggle" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
<div id="logoApp"></div>
</div>
<div id="dropdownMenuChannel" class="dropdown-menu">
<button id="btnDialogAddChannel" type="button" class="dropdown-item" data-toggle="modal" data-target="#modalDialogAddChannel"><i class="material-icons my-icon-dropdown">add</i> Add channel</button>
<div id="deleteChannel"></div>
<button id="btnDialogSettings" type="button" class="dropdown-item" data-toggle="modal" data-target="#modalDialogSettings"><i class="material-icons my-icon-dropdown">settings</i> Settings</button>
<div id="listChannel"></div>
<div class="dropdown-divider"> </div>
<button id="btnDialogAbout" type="button" class="dropdown-item" data-toggle="modal" data-target="#modalDialogAbout"><i class="material-icons my-icon-dropdown">info</i> About</button>
</div>
</a>
<div class="form-inline">
<button id="elementPrevPage" class="btn bmd-btn-icon" type="button" title="Previous"><i class="material-icons">keyboard_arrow_left</i></button>
<button id="elementNextPage" class="btn bmd-btn-icon" type="button" title="Next"><i class="material-icons">keyboard_arrow_right</i></button>
</div>
</nav>
</header>
<div id="modalDialog"></div>
<div id="mainPage">
<center>
<div class="range-message">
<input type="range" name="rangeMessage" id="rangeMessage" oninput="getStartMessage();" onchange="getPage();" min="` + App.currentChannel.min + `" max="` + App.currentChannel.max + `" step="` + App.step + `" value="` + App.currentChannel.value + `">
</div>
<main id="main" role="main" class="container-fluid"></main>
</center>
</div>
`;
	$("#app").html(textContent);
	renderLogoApp('#logoApp');
	renderListChannel();
}

function getPage() {
	if (!$.isEmptyObject(App.currentChannel)) {
		if (App.currentChannel.value < App.currentChannel.min) {
			App.currentChannel.value = App.currentChannel.min;
		}
		if (App.currentChannel.value > App.currentChannel.max - App.step) {
			App.currentChannel.max = App.currentChannel.value + App.step;
		}
		App.currentHash = App.currentChannel.value;
		var textContent = '';
		textContent += '<div class="posts">';
		for (var i = 0; i < App.step; i++) {
			//textContent += '<iframe src="https://t.me/' + App.currentChannel.name + '/' + (App.currentChannel.value + i) + '?embed=1" scrolling="no" frameborder="0"></iframe>';
			textContent += '<s' + 'cript async src="https://telegram.org/js/telegram-widget.js" data-telegram-post="' + App.currentChannel.name + '/' + (App.currentChannel.value + i) + '" data-width="10%"></s' + 'cript>';
		}
		textContent += '</div>';
		textContent += `
<nav class="my-pagination">
<ul class="pagination justify-content-center">
<li class="page-item"><span id="elementPrevPageFooter" class="page-link">Previous</span></li>
<li class="page-item"><span id="elementPrevNextDivider" class="page-link-disabled">|</span></li>
<li class="page-item"><span id="elementNextPageFooter" class="page-link">Next</span></li>
</ul>
</nav>
`;
		$("#main").html(textContent);
		$("#rangeMessage")[0].value = App.currentChannel.value;
		$(".range-message").show();
		$('body').bootstrapMaterialDesign();
		document.title = '' + App.currentChannel.name + ' - ' + App.currentHash;
		location.hash = '#' + App.currentHash;
		$("#elementPrevPageFooter").click(function (event) {
			getPrevPage();
			my_ga('send', 'event', 'getPrevPage', 'click', 'elementPrevPageFooter');
		});
		$("#elementNextPageFooter").click(function (event) {
			getNextPage();
			my_ga('send', 'event', 'getNextPage', 'click', 'elementNextPageFooter');
		});
	} else {
		App.currentHash = '';
		var textInformationMessage = (App.channels.length > 0) ? 'Select channel to view' : 'No channels to view';
		var textContent = `
<div style="position:absolute;top:50%;left:50%;transform:translate(-50%,-50%);text-align:center;">
<img src="telegram.svg" width="120" height="120" class="img-fluid rounded" alt="TViewer">
<br/><br/>
<p>` + textInformationMessage + `</p>
<div>
`;
		$("#main").html(textContent);
		$(".range-message").hide();
		$('body').bootstrapMaterialDesign();
		document.title = '' + App.name;
		location.hash = '';
	}
	setAppCashe();
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

function setMenuHeight() {
	var menuHeight = 260;
	try {
		menuHeight = window.innerHeight - 60;
	} catch (e) {
	}
	$('#dropdownMenuChannel').css('max-height', menuHeight);
}

function setAppCashe() {
	try {
		var strAppCashe = localStorage.getItem('App');
		var strAppCurrent = JSON.stringify(App)
		if (strAppCashe !== strAppCurrent) {
			localStorage.setItem('App', strAppCurrent);
		}
	} catch (e) {
		console.log(e);
	}
}
function getAppCashe() {
	try {
		var strAppCashe = localStorage.getItem('App');
		if (strAppCashe != null) {
			App = JSON.parse(strAppCashe);
		}
	} catch (e) {
		console.log(e);
	}
}

function my_ga(a, b, c, d, e) {
	//ga(a, b, c, d, e);
}

$(document).ready(function(){

	getAppCashe();

	//TODO add search channel...

	var isRandomMessage = false;
	if (window.location.hash != '') {
		try {
			App.currentHash = parseInt((window.location.hash).replace("#", ""));
			if (!$.isEmptyObject(App.currentChannel)) {
				App.currentChannel.value = App.currentHash;
			}
		} catch (e) {
			isRandomMessage = true;
		}
	} else {
		isRandomMessage = true;
	}
	if (isRandomMessage) {
		getRandomMessage();
		if (!$.isEmptyObject(App.currentChannel)) {
			App.currentHash = App.currentChannel.value;
		} else {
			App.currentHash = '';
		}
	}

	preRenderPage();
	getPage();

	var elementPrevPage = $("#elementPrevPage");
	elementPrevPage.click(function (event) {
		getPrevPage();
		elementPrevPage.blur();
		my_ga('send', 'event', 'getPrevPage', 'click', 'elementPrevPage');
	});
	var elementNextPage = $("#elementNextPage");
	elementNextPage.click(function (event) {
		getNextPage();
		elementNextPage.blur();
		my_ga('send', 'event', 'getNextPage', 'click', 'elementNextPage');
	});

	$(".navbar-brand").click(function (event) {
		event.preventDefault();
		setMenuHeight();
	});
	$("#btnDialogAddChannel").click(function (event) {
		renderDialogAddChannel();
		my_ga('send', 'event', 'renderDialogAddChannel', 'click', 'btnDialogAddChannel');
	});
	$("#btnDialogSettings").click(function (event) {
		renderDialogSettings();
		my_ga('send', 'event', 'renderDialogSettings', 'click', 'btnDialogSettings');
	});
	$("#btnDialogAbout").click(function (event) {
		renderDialogAbout();
		my_ga('send', 'event', 'renderDialogAbout', 'click', 'btnDialogAbout');
	});

	var initialPoint = undefined;
	var finalPoint = undefined;
	try {
		document.addEventListener('touchstart', function (event) {
			initialPoint = event.changedTouches[0];
		});
	}
	catch (e) {
		my_ga('send', 'event', 'addEventListener', 'Error-touchstart', e);
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
						my_ga('send', 'event', 'getNextPage', 'touchend', 'document');
						/*swipe left*/
					}
					else {
						getPrevPage();
						my_ga('send', 'event', 'getPrevPage', 'touchend', 'document');
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
		my_ga('send', 'event', 'addEventListener', 'Error-touchend', e);
	}

	try {
		addOnWheel(document, function (event) {
			if (event.target.className == "posts") {
				var delta = event.deltaY || event.detail || event.wheelDelta;
				if (delta > 0) {
					getNextPage();
					my_ga('send', 'event', 'getNextPage', 'wheel', 'document');
				}
				else {
					getPrevPage();
					my_ga('send', 'event', 'getPrevPage', 'wheel', 'document');
				}
				event.preventDefault();
			}
		});
	}
	catch (e) {
		my_ga('send', 'event', 'addOnWheel', 'Error-wheel', e);
	}

}); 

$(document).keydown(function (event) {
	if (event.which == 37) {
		getPrevPage();
		my_ga('send', 'event', 'getPrevPage', 'keydown', 'document');
	}
	if (event.which == 38 || event.which == 36) {
		getRandomPage();
		my_ga('send', 'event', 'getRandomPage', 'keydown', 'document');
	}
	if (event.which == 39) {
		getNextPage();
		my_ga('send', 'event', 'getNextPage', 'keydown', 'document');
	}
});

$(window).resize(function() {
	setMenuHeight();
});
