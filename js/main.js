var isRandom = true;
var offerName = '';
var offer = '';
var initialPoint = undefined;
var finalPoint = undefined;
var App = {};
App.info = undefined;
App.content = undefined;
App.elementHeader = undefined;
App.elementFooter = undefined;
App.elementMain = undefined;
App.elementArticle = undefined;
App.elementDayNavigation = undefined;
App.elementMainNavigation = undefined;
App.elementMainLeft = undefined;
App.elementMainRight = undefined;
App.elementMainHide = undefined;
App.elementLogoImage = undefined;
App.elementTitlePage = undefined;
App.elementInfoPage = undefined;
App.elementFooterInfo = undefined;
App.elementFooterRSS = undefined;
App.elementPrevPage = undefined;
App.elementHomePage = undefined;
App.elementNextPage = undefined;
App.elementSearch = undefined;
App.currentItem = undefined;
App.currentItemIndex = -1;
App.currentScriptIndex = -1;
App.mode = 'items';
App.elementsPerPage = 4;
App.currentCountColumn = 4;
App.currentCountRow = 1;
App.dataStart = 0;
App.dataLimit = App.elementsPerPage;
App.dataAll = [];
App.maxSize = 0;
App.countScript = 0;
App.arrayScript = [];
App.preLoad = 0;
App.currentSearch = "";
App.currentHash = "";
App.isPreLoadPageToCurrentHash = false;
App.isMainNavigationShow = false;
App.arraySearch = [];
App.phraseSearch = "";
App.dataPath = "";
App.currentDay = "";
App.currentHashDay = "";

function compareSearchReverse(itemA, itemB) {
	if (itemA.search > itemB.search) return -1;
	if (itemA.search < itemB.search) return 1;
}

function sortDataAll() {
	App.dataAll.sort(compareSearchReverse);
}

function sortArraySearch() {
	App.arraySearch.sort(compareSearchReverse);
}

function getMaxSize() {
	App.maxSize = App.dataAll.length;
	sortDataAll();
	App.info.html('<p>' + App.maxSize + ' items</p>');
}

function addArrayToDataAll(array) {
	for (var i = 0; i < array.length; i++) {
		App.dataAll.push(array[i]);
	}
	App.countScript++;
}

function getRandomIndex(max, min) {
	return Math.floor(min + Math.random() * (max + 1 - min));
}

function getRandomHash(item, index) {
	var prefix = item.end.substr(0, 4);
	var min = parseInt(item.end.substr(4, 8), 10);
	var max = parseInt(item.start.substr(4, 8), 10);
	var result = getRandomIndex(max, min)
	return '' + prefix + ('00000000' + result).slice(-8);
}

function addDataToArrayScript(data) {
	var currentScriptIndex = -1;
	var currentDay = '';
	var currentHashDay = '';
	var array = data.files;
	var currentFileIndex = 0;
	if (isRandom) {
		if ((App.currentHash == '') && (App.currentSearch == '')) {
			currentFileIndex = getRandomIndex(array.length - 1, 0);
			App.currentHash = getRandomHash(array[currentFileIndex]);
		}
	}
	for (var i = 0; i < array.length; i++) {
		var currentFile = array[i].file;
		var currentStart = array[i].start;
		var currentEnd = array[i].end;
		if (i == currentFileIndex) {
			currentScriptIndex = currentFileIndex;
			//currentDay = currentFile.substr(13, 10);
			currentDay = currentFile.substr(13, 4);
			currentHashDay = currentStart;
		}
		if (App.currentSearch != '') {
			if ((App.currentSearch <= currentStart) && (App.currentSearch >= currentEnd)) {
				currentScriptIndex = i;
				App.currentScriptIndex = currentScriptIndex;
				//currentDay = currentFile.substr(13, 10);
				currentDay = currentFile.substr(13, 4);
				currentHashDay = currentStart;
			}
		}
		if (App.currentScriptIndex == -1) {
			if (App.currentHash != '') {
				if ((App.currentHash <= currentStart) && (App.currentHash >= currentEnd)) {
					currentScriptIndex = i;
					App.currentScriptIndex = currentScriptIndex;
					//currentDay = currentFile.substr(13, 10);
					currentDay = currentFile.substr(13, 4);
					currentHashDay = currentStart;
				}
			}
		}
		array[i].file = '' + App.dataPath + currentFile;
		App.arrayScript.push(array[i]);
	}
	if (App.currentScriptIndex == -1) {
		App.currentScriptIndex = currentScriptIndex;
	}
	App.currentDay = currentDay;
	App.currentHashDay = currentHashDay;
	/*
	var textDayNavigation = '';
	textDayNavigation += '<div id="slider"><input id="slide" type="range" min="0" max="' + (App.arrayScript.length - 1) + '" step="1" value="' + App.currentScriptIndex + '" onchange="updateSlider(this.value)" /></div>';
	App.elementDayNavigation.html(textDayNavigation);
	*/
	var textDayNavigation = '';
	textDayNavigation += '<ol class="itemsDay">';
	for (var i = 0; i < App.arrayScript.length; i++) {
		var currentFile = array[i].file;
		//var currentDay = currentFile.substr(13, 10);
		var currentDay = currentFile.substr(13, 4);
		var currentDayLink = location.pathname;
		if (App.phraseSearch != '') {
			currentDayLink += '?search=' + App.phraseSearch;
		}
		currentDayLink += '#' + array[i].start;
		textDayNavigation += '<li><a href="' + currentDayLink + '"><span id="' + array[i].start + '" class="itemDay" title="' + currentDay + '" onclick="updateSlider(' + i + ')"></span></a></li>';
	}
	textDayNavigation += '</ol>';
	App.elementDayNavigation.html(textDayNavigation);
	for (var i = 0; i < App.arrayScript.length; i++) {
		if (i == App.currentScriptIndex) {
			$.getScript(App.arrayScript[i].file, function () {
				getMaxSize();
				preLoadPageToCurrentHash();
				if (!App.isPreLoadPageToCurrentHash) {
					getStartPage();
				}
			}).fail(function () {
				App.countScript++;
			});
			break;
		}
	}
}

function updateSlider(currentScriptIndex) {
	App.maxSize = 0;
	App.dataAll = [];
	App.arraySearch = [];
	App.currentScriptIndex = currentScriptIndex;
	var currentScript = App.arrayScript[currentScriptIndex];
	//App.currentDay = currentScript.file.substr(13, 10);
	App.currentDay = currentScript.file.substr(13, 4);
	App.currentHash = currentScript.start;
	App.currentHashDay = currentScript.start;
	$.getScript(currentScript.file, function () {
		getMaxSize();
		preLoadPageToCurrentHash();
		if (!App.isPreLoadPageToCurrentHash) {
			getStartPage();
		}
	}).fail(function () {
		App.countScript++;
	});
}

function addClassActive() {
	if (App.currentHashDay != '') {
		$('li span').each(function (i) {
			$(this).removeClass('active');
		});
		$('#' + App.currentHashDay).addClass('active');
	}
}

function updateSliderPrevValue() {
	var maxScriptIndex = App.arrayScript.length - 1;
	if (App.currentScriptIndex > 0) {
		App.currentScriptIndex--;
	}
	else {
		App.currentScriptIndex = maxScriptIndex;
	}
	addClassActive();
	//$("#slide").attr("value", App.currentScriptIndex);
	updateSlider(App.currentScriptIndex);
}

function updateSliderNextValue() {
	var maxScriptIndex = App.arrayScript.length - 1;
	if (App.currentScriptIndex < maxScriptIndex) {
		App.currentScriptIndex++;
	}
	else {
		App.currentScriptIndex = 0;
	}
	addClassActive();
	//$("#slide").attr("value", App.currentScriptIndex);
	updateSlider(App.currentScriptIndex);
}

function parseUrlQuery() {
	var currentSearch = {};
	if (window.location.search) {
		var pair = (window.location.search.substr(1)).split("&");
		for (var i = 0; i < pair.length; i++) {
			var param = pair[i].split("=");
			currentSearch[param[0]] = param[1];
		}
	}
	return currentSearch;
}

function preLoadPageToCurrentHash() {
	if (App.phraseSearch != '') {
		findToSearch(App.dataAll, App.phraseSearch);
		App.dataStart = 0;
		App.dataLimit = App.elementsPerPage;
		createPage(App.dataStart, App.dataLimit);
		App.isPreLoadPageToCurrentHash = true;
	}
	var currentArrayData = App.dataAll;
	if (App.arraySearch.length > 0) {
		currentArrayData = App.arraySearch;
	}
	if (App.currentSearch != '') {
		var result = findCurrentSearchToArray(currentArrayData);
		var currentItem = result.item;
		var currentItemIndex = result.index;
		if (typeof currentItem !== "undefined") {
			App.currentItem = currentItem;
			App.currentItemIndex = currentItemIndex;
			createPageItem(currentItem);
			App.isPreLoadPageToCurrentHash = true;
			return;
		}
	}
	if (App.currentHash != '') {
		var result = findCurrentHashToArray(currentArrayData);
		var currentItem = result.item;
		var currentItemIndex = result.index;
		if (typeof currentItem !== "undefined") {
			addClassActive();
			App.currentItem = currentItem;
			App.currentItemIndex = currentItemIndex;
			getElementsPerPage();
			App.dataStart = App.currentItemIndex;
			App.dataLimit = App.dataStart + App.elementsPerPage;
			createPage(App.dataStart, App.dataLimit);
			App.isPreLoadPageToCurrentHash = true;
		}
	}
}

function preLoadPage() {
	/*
	if (App.countScript < App.arrayScript.length) {
		App.info.html('<p>Load data ' + (App.countScript / App.arrayScript.length * 100).toFixed(2) + '%</p>');
	}
	else {
		clearInterval(App.preLoad);
		getMaxSize();
		if (!App.isPreLoadPageToCurrentHash) {
			preLoadPageToCurrentHash();
		}
	}
	*/
}

function findCurrentSearchToArray(currentArrayData) {
	var result = {
		"item": undefined
		, "index": -1
	};
	try {
		result.item = currentArrayData.find(findCurrentSearch);
		result.index = currentArrayData.indexOf(result.item);
	}
	catch (e) {
		for (var i = 0; i < currentArrayData.length; i++) {
			var item = currentArrayData[i];
			if (findCurrentSearch(item)) {
				result.item = item;
				result.index = i;
				break;
			}
		}
	}
	return result;
}

function findCurrentHashToArray(currentArrayData) {
	var result = {
		"item": undefined
		, "index": -1
	};
	try {
		result.item = currentArrayData.find(findCurrentHash);
		result.index = currentArrayData.indexOf(result.item);
	}
	catch (e) {
		for (var i = 0; i < currentArrayData.length; i++) {
			var item = currentArrayData[i];
			if (findCurrentHash(item)) {
				result.item = item;
				result.index = i;
				break;
			}
		}
	}
	return result;
}

function findCurrentSearch(item) {
	return item.search == App.currentSearch;
}

function findCurrentHash(item) {
	return item.search == App.currentHash;
}

function progressRefresh() {
	$(".progress").css({
		"width": "" + (App.dataLimit / App.maxSize * 100) + "%"
	});
}

function createPageItem(item) {
	App.mode = 'item';
	App.content.html('');
	var textContent = '';
	var currentImage = '';
	var item_url = '';
	var item_title = '';
	var item_search = '';
	var item_link = '';
	try {
		currentImage = item.image;
		item_url = item.url;
		item_title = item.title;
		item_search = item.search;
		item_link = '#' + item_search;
	}
	catch (e) {}

	var isLocal = false;
	try {
		if (item.l == 1) {
			isLocal = true;
		}
	}
	catch (e) {}
	if (isLocal) {
		currentImage = 'https://superdealsbg.github.io/image/' + item_search.slice(0, 4) + '/' + item_search.substr(4, 8) + '.jpg';
	}

	$("meta[name='description']").attr("content", item_title);
	$("meta[name='keywords']").attr("content", "SuperDealsBG, " + item_title.split("  ").join(" ").split(" ").join(", "));
	$("meta[property='og\\:type']").attr("content", "article");
	$("meta[property='og\\:title']").attr("content", "SuperDeals");
	$("meta[property='og\\:description']").attr("content", item_title);
	$("meta[property='og\\:image']").attr("content", currentImage);
	$("meta[property='og\\:url']").attr("content", "https://superdealsbg.github.io/" + offer + "?item=" + item_search);
	$("meta[name='twitter\\:card']").attr("content", "summary_large_image");
	$("link[rel='canonical']").attr("href", "https://superdealsbg.github.io/" + offer + "?item=" + item_search);
	document.title = 'SuperDeals - ' + item_title;
	var currentDescription = $("meta[property='og\\:description']").attr("content");
	var currentTitle = currentDescription.substr(0, 100) + '... ' + '#SuperDeals';
	var currentUrl = $("link[rel='canonical']").attr("href");

	var textScryptLD = '';
	textScryptLD += '<script type="application/ld+json">';
	textScryptLD += '{';
	textScryptLD += '"@context": "http://schema.org/",';
	textScryptLD += '"@type": "Recipe",';
	textScryptLD += '"name": "' + item_title + '",';
	textScryptLD += '"image": "' + currentImage + '",';
	textScryptLD += '"url": "' + 'https://superdealsbg.github.io/' + offer + '?item=' + item_search + '"';
	textScryptLD += '}';
	textScryptLD += '</script>';
	$("head").append(textScryptLD);

	var textSocial = '';
	textSocial += '<center><div class="ya-share2" data-services="facebook,twitter,gplus,pinterest,tumblr,viber,whatsapp,skype,telegram,vkontakte,blogger,delicious,digg,reddit,evernote,linkedin,lj,pocket,qzone,renren,sinaWeibo,surfingbird,tencentWeibo,odnoklassniki,moimir,collections" data-title:twitter="' + currentTitle + '" data-image="' + currentImage + '" data-url="' + currentUrl + '" data-limit="10" data-direction="horizontal" data-popup-direction="top" data-lang="en"></div></center>';
	textSocial += '<script src="js/social/es5-shims.min.js"></script>';
	textSocial += '<script src="js/social/share.js"></script>';
	var textReclame = '';
	textReclame += '<hr color="#ccc" noshade>';
	textReclame += '<center><ol class="items-top-horizontal">';
	textReclame += '<li><a target="_blank" href="https://goo.gl/1tUykV"><img src="img/Nicehash-logo.png" title="Largest Crypto-Mining Marketplace" alt="Largest Crypto-Mining Marketplace"></a></li>';
	textReclame += '<li><a target="_blank" href="https://goo.gl/o11NBx"><img src="img/LocalBitcoins-logo.png" title="Buy and sell bitcoins near you" alt="Buy and sell bitcoins near you"></a></li>';
	textReclame += '<li><a target="_blank" href="https://goo.gl/v2kFq4"><img src="img/Telegram-logo.png" title="Telegram - SuperDeals" alt="Telegram - SuperDeals"></a></li>';
	textReclame += '</ol><br></center>';
	textContent += '<a href="../' + offer + '#' + item_search + '"><h1>' + item_title + '</h1></a>';
	textContent += '<ol class="item">';
	textContent += '<li><a id="' + item_search + '" href="' + item_url + '" target="_blank"><div class="img_wrapper"><img src="' + currentImage + '" title="' + item_title + '" alt="' + item_title + '"></div><p>SEE MORE</p></a></li>';
	//textContent += '<li><a id="' + item_search + '" href="../' + offer + '#' + item_search + '" onclick="getCurrentItemURL(); return false;" target="_blank"><div class="img_wrapper"><img src="' + currentImage + '" title="' + item_title + '" alt="' + item_title + '"></div><p>SEE MORE</p></a></li>';
	textContent += '</ol>';
	textContent += textSocial;
	textContent += textReclame;
	try {
		App.content.append(textContent);
		//lazyLoad();
	}
	catch (e) {}
	location.hash = '#' + item_search;
}

function createPage(dataStart, dataLimit) {
	var location_hash = '';
	App.mode = 'items';
	App.content.html('');
	var textContent = '';
	textContent += '<ol class="items">';
	for (var i = dataStart; i < dataLimit; i++) {
		try {
			if (App.phraseSearch != '') {
				//if (App.arraySearch.length > 0) {
				var item = App.arraySearch[i];
				App.maxSize = App.arraySearch.length;
			}
			else {
				var item = App.dataAll[i];
				App.maxSize = App.dataAll.length;
			}
			var item_search = item.search;
			var currentImage = '';

			var isLocal = false;
			try {
				if (item.l == 1) {
					isLocal = true;
				}
			}
			catch (e) {}
			if (isLocal) {
				currentImage = 'image/' + item_search.slice(0, 4) + '/' + item_search.substr(4, 8) + '.jpg';
			}
			else {
				if (currentImage == '') {
					currentImage = item.image;
					if (currentImage.toLowerCase().indexOf("alicdn.com".toLowerCase()) >= 0) {
						currentImage = currentImage.replace(".jpg", ".jpg_80x80.jpg")
					}
				}
			}

			if (location_hash == '') {
				location_hash = item_search;
			}
			var item_link = location.pathname + '?item=' + item_search;
			if (App.phraseSearch != '') {
				item_link += '&search=' + App.phraseSearch;
			}
			/*
			//{black
			item_link = item.url;
			//}black
			*/
			textContent += '<li><a id="' + item_search + '" href="' + item_link + '" target="_blank"><div class="img_wrapper"><img class="lazy_load" src="data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7" data-src="' + currentImage + '" title="' + item.title + '" alt="' + item.title + '"></div></a></li>';
		}
		catch (err) {
			//console.log(err.toString());
			break;
		}
	}
	textContent += '</ol>';
	App.content.append(textContent);
	progressRefresh();
	lazyLoad();
	if (App.phraseSearch != '') {
		//if (App.arraySearch.length > 0) {
		App.info.html('<p>"<b>' + App.phraseSearch + '</b>" - ' + App.maxSize + ' items (' + App.currentDay + ')</p>');
	}
	else {
		App.info.html('<p>' + App.maxSize + ' items (' + App.currentDay + ')</p>');
	}
	if (App.currentHash != '') {
		try {
			var searchResult = App.currentItem;
			$("meta[name='description']").attr("content", searchResult.title);
			$("meta[name='keywords']").attr("content", "SuperDealsBG, " + searchResult.title.split("  ").join(" ").split(" ").join(", "));
			$("meta[property='og\\:type']").attr("content", "article");
			$("meta[property='og\\:title']").attr("content", "SuperDeals");
			$("meta[property='og\\:description']").attr("content", searchResult.title);
			$("meta[property='og\\:image']").attr("content", searchResult.image);
			$("meta[property='og\\:url']").attr("content", "https://superdealsbg.github.io/" + offer + "#" + searchResult.search);
			$("meta[name='twitter\\:card']").attr("content", "summary_large_image");
			$("link[rel='canonical']").attr("href", "https://superdealsbg.github.io/" + offer + "#" + searchResult.search);
			document.title = 'SuperDeals - ' + searchResult.title;
		}
		catch (e) {
			defaultHeaderMetaProperty();
		}
	}
	else {
		defaultHeaderMetaProperty();
	}
	location.hash = '#' + location_hash;
	if (location_hash != '') {
		addClassActive();
	}
}

function defaultHeaderMetaProperty() {
	var searchResult_title = "Save BIG on top quality items on Banggood...";
	$("meta[name='description']").attr("content", searchResult_title);
	$("meta[name='keywords']").attr("content", "SuperDealsBG, SuperDeals, SuperDeal, Banggood, online shopping, gadgets, electronics");
	$("meta[property='og\\:type']").attr("content", "website");
	$("meta[property='og\\:title']").attr("content", "SuperDeals");
	$("meta[property='og\\:description']").attr("content", searchResult_title);
	$("meta[property='og\\:image']").attr("content", "https://superdealsbg.github.io/images/SuperDeals-250x250.png");
	$("meta[property='og\\:url']").attr("content", "https://superdealsbg.github.io/");
	$("meta[name='twitter\\:card']").attr("content", "summary");
	$("link[rel='canonical']").attr("href", "https://superdealsbg.github.io/");
	document.title = 'SuperDeals';
}

function imgLoaded(img) {
	$(img).parent().addClass('loaded');
};

function lazyLoad() {
	var $images = $('.lazy_load');
	$images.each(function () {
		var $img = $(this);
		$img.on('load', imgLoaded($img[0])).attr('src', $img.attr('data-src')).attr('data-src', '');
	});
};

function openURL(href, targetBlank) {
	var a = document.createElement("a");
	a.href = href;
	if (targetBlank) {
		a.target = "_blank";
	}
	document.body.appendChild(a);
	a.click();
	document.body.removeChild(a);
	my_ga('send', 'event', 'openURL', 'click', href);
}

function getCurrentItemURL() {
	openURL(App.currentItem.url, true);
}

function getMainStartPage() {
	openURL("/", false);
}

function getSuperDealsTwitterPage() {
	openURL("https://mobile.twitter.com/dealssuper01/lists/superdeals", true);
}

function getSuperDealsPage() {
	openURL("/", true);
}

function getInfoPage() {
	openURL("/about", false);
}

function getRSSPage() {
	openURL("http://feeds.feedburner.com/BG/SuperDeals", true);
}

function getSuperDealsTelegramPage() {
	openURL("http://telegram.me/SuperDeals", true);
}

function getElementsPerPage() {
	var currentSize = 82;
	App.currentCountColumn = Math.floor(($('#content').width() / currentSize)) || 4;
	App.currentCountRow = Math.floor($('body').height() / currentSize) || 1;
	var currentElementsPerPage = App.currentCountColumn * App.currentCountRow;
	if (App.isMainNavigationShow) {
		currentElementsPerPage = currentElementsPerPage - (App.currentCountColumn * 0) || App.currentCountColumn;
	}
	else {
		currentElementsPerPage = currentElementsPerPage - (App.currentCountColumn * 2) || App.currentCountColumn;
	}
	App.elementsPerPage = currentElementsPerPage;
}

function reloadCurrentPageItem() {
	createPageItem(App.currentItem);
}

function getPrevPageItem() {
	if (App.currentItemIndex > 0) {
		App.currentItemIndex--;
	}
	else {
		App.currentItemIndex = App.maxSize - 1;
	}
	if (App.arraySearch.length > 0) {
		App.currentItem = App.arraySearch[App.currentItemIndex];
	}
	else {
		App.currentItem = App.dataAll[App.currentItemIndex];
	}
	createPageItem(App.currentItem);
}

function getNextPageItem() {
	if (App.currentItemIndex < App.maxSize - 1) {
		App.currentItemIndex++;
	}
	else {
		App.currentItemIndex = 0;
	}
	if (App.arraySearch.length > 0) {
		App.currentItem = App.arraySearch[App.currentItemIndex];
	}
	else {
		App.currentItem = App.dataAll[App.currentItemIndex];
	}
	createPageItem(App.currentItem);
}

function reloadCurrentPage() {
	if (App.mode == 'item') {
		reloadCurrentPageItem();
	}
	else {
		getElementsPerPage();
		App.dataLimit = App.dataStart + App.elementsPerPage;
		createPage(App.dataStart, App.dataLimit);
	}
}

function getPrevPage() {
	if (App.mode == 'item') {
		getPrevPageItem();
	}
	else {
		getElementsPerPage();
		App.dataStart = App.dataLimit - (2 * App.elementsPerPage);
		if (App.dataStart >= 0) {
			App.dataLimit = App.dataLimit - App.elementsPerPage;
		}
		else {
			updateSliderPrevValue();
			return;
			//App.dataStart = App.maxSize - App.elementsPerPage;
			//App.dataLimit = App.maxSize;
		}
		createPage(App.dataStart, App.dataLimit);
	}
}

function getStartPage() {
	getElementsPerPage();
	App.dataStart = 0;
	App.dataLimit = App.elementsPerPage;
	createPage(App.dataStart, App.dataLimit);
}

function getHomePage() {
	if (location != location.pathname) {
		location = location.pathname;
	}
	else {
		getStartPage();
	}
}

function getNextPage() {
	if (App.mode == 'item') {
		getNextPageItem();
	}
	else {
		getElementsPerPage();
		App.dataStart = App.dataLimit;
		if (App.maxSize > App.dataStart) {
			App.dataLimit = App.dataLimit + App.elementsPerPage;
		}
		else {
			updateSliderNextValue();
			return;
			//App.dataStart = 0;
			//App.dataLimit = App.elementsPerPage;
		}
		createPage(App.dataStart, App.dataLimit);
	}
}

function findToSearch(array, value) {
	App.arraySearch = [];
	if (value.length > 1) {
		var arrayValue = value.split(" ");
		for (var i = 0; i < array.length; i++) {
			var isSearch = true;
			for (var y = 0; y < arrayValue.length; y++) {
				if (array[i].title.toLowerCase().indexOf(arrayValue[y].toLowerCase()) < 0) {
					isSearch = false;
					break;
				}
			}
			if (isSearch) {
				App.arraySearch.push(array[i]);
			}
		}
		if (App.arraySearch.length > 0) {
			App.currentItemIndex = 0;
			App.maxSize = App.arraySearch.length;
			sortArraySearch();
		}
	}
}

function clearFindToSearch() {
	getElementsPerPage();
	App.arraySearch = [];
	App.phraseSearch = "";
	App.maxSize = App.dataAll.length;
	App.currentItemIndex = 0;
	App.dataStart = 0;
	App.dataLimit = App.elementsPerPage;
	createPage(App.dataStart, App.dataLimit);
}

function hideHeaderAndFooter() {
	App.isMainNavigationShow = true;
	//$(App.elementDayNavigation).addClass('hide');
	$(App.elementMain).addClass('expand no-footer');
	$(App.elementMainNavigation).removeClass('hide');
	$(App.elementHeader).addClass('hide');
	$(App.elementFooter).addClass('hide');
	reloadCurrentPage();
}

function showHeaderAndFooter() {
	App.isMainNavigationShow = false;
	//$(App.elementDayNavigation).removeClass('hide');
	$(App.elementMain).removeClass('expand no-footer');
	$(App.elementMainNavigation).addClass('hide');
	$(App.elementHeader).removeClass('hide');
	$(App.elementFooter).removeClass('hide');
	reloadCurrentPage();
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
	ga(a, b, c, d, e);
}

$(document).ready(function () {
	//alert(location);
	App.phraseSearch = '';
	App.currentSearch = '';
	App.currentHash = '';
	if (window.location.search != '') {
		var currentSearch = parseUrlQuery();
		if (typeof currentSearch.item !== "undefined") {
			App.currentSearch = currentSearch.item;
		}
		if (typeof currentSearch.search !== "undefined") {
			App.phraseSearch = currentSearch.search;
		}
	}
	if (window.location.hash != '') {
		//App.currentHash = (window.location.hash).replace("#", "").slice(0, 16);
		App.currentHash = (window.location.hash).replace("#", "").slice(0, 12);
	}
	if ((App.currentSearch != '') && (App.currentHash != '')) {
		if (App.currentSearch !== App.currentHash) {
			location.search = '?item=' + App.currentHash;
			return;
		}
	}
	var textHeader = '<header>';
	var textFooter = '<footer>';
	var textMainContent = '<main title="&larr;prev &uarr;home next&rarr;">';
	var textMainNavigation = '<div id="mainNavigation" class="hide">';
	var textDayNavigation = '<div id="dayNavigation"></div>';
	var textArticle = '<article class="dayNav">';
	App.mode = 'items';
	if (App.currentSearch != '') {
		App.mode = 'item';
		$("article").addClass('hide');
		textHeader = '<header class="hide">';
		textFooter = '<footer class="hide">';
		textMainContent = '<main class="expand no-footer" title="&larr;prev &uarr;home next&rarr;">';
		textMainNavigation = '<div id="mainNavigation">';
		textDayNavigation = '<div id="dayNavigation" class="hide"></div>';
		textArticle = '<article>';
	}
	var textMain = '';
	textMain += '<div class="progress"></div>';
	textMain += textHeader;
	textMain += '<div id="headerPage">';
	textMain += '<span class="logoImage"></span>';
	textMain += '<span class="titlePage">SuperDeals</span>';
	textMain += '<span class="titleOffer">' + offerName + '</span>';
	textMain += '<span id="infoPage"></span>';
	textMain += '</div>';
	textMain += '<div id="navigation">';
	textMain += '<table style="width:100%;position:absolute;top:34px;">';
	textMain += '<tr><td><div id="inputSearch"><input id="search" name="search" type="text" placeholder="Search..."></div></td></tr>';
	textMain += '<tr><td><div id="info"></div></td></tr>';
	textMain += '<tr><td><div id="navPage"><span id="prevPage" title="&larr;prev"></span>&nbsp;&nbsp;&nbsp;<span id="homePage" title="&uarr;home"></span>&nbsp;&nbsp;&nbsp;<span id="nextPage" title="next&rarr;"></span></div></td></tr>';
	textMain += '</table>';
	textMain += '</div>';
	textMain += '</header>';
	textMain += textMainNavigation;
	textMain += '<span id="mainLeft" title="&larr;prev"></span>';
	textMain += '<span id="mainRight" title="next&rarr;"></span>';
	textMain += '<span class="logoImage"></span>';
	textMain += '<span class="titlePage">SuperDeals</span>';
	textMain += '<span class="titleOffer">' + offerName + '</span>';
	if (App.mode == 'items') {
		textMain += '<span id="mainHide"></span>';
	}
	textMain += '</div>';
	textMain += textMainContent;
	textMain += textDayNavigation;
	textMain += textArticle;
	textMain += '<div id="content"></div>';
	textMain += '</article>';
	textMain += '</main>';
	textMain += textFooter;
	textMain += '<div id="footerPage">';
	textMain += '<span id="footerInfo">SuperDeals &copy; 2017</span>';
	textMain += '<span id="footerRSS"></span>';
	textMain += '</div>';
	textMain += '</footer>';
	$("#main").html(textMain);
	App.info = $("#info");
	App.content = $("#content");
	App.elementHeader = $("header");
	App.elementFooter = $("footer");
	App.elementMain = $("main");
	App.elementArticle = $("article");
	App.elementDayNavigation = $("#dayNavigation");
	App.elementMainNavigation = $("#mainNavigation");
	App.elementMainLeft = $("#mainLeft");
	App.elementMainRight = $("#mainRight");
	App.elementMainHide = $("#mainHide");
	App.elementLogoImage = $(".logoImage");
	App.elementTitlePage = $(".titlePage");
	App.elementInfoPage = $("#infoPage");
	App.elementFooterInfo = $("#footerInfo");
	App.elementFooterRSS = $("#footerRSS");
	App.elementPrevPage = $("#prevPage");
	App.elementHomePage = $("#homePage");
	App.elementNextPage = $("#nextPage");
	App.elementSearch = $("#search");
	/*
	//{black
	$(App.elementHeader).addClass('hide');
	$(App.elementFooter).addClass('hide');
	$(App.elementDayNavigation).addClass('hide');
	$(App.elementMainNavigation).addClass('hide');
	$(App.elementMain).addClass('no-header no-footer');
	App.isMainNavigationShow = true;
	//}black
	*/
	$.getScript('' + App.dataPath + 'js/data/data.js', function () {
		//App.preLoad = setInterval(preLoadPage, 500);
		preLoadPage();
	});
	App.elementLogoImage.click(function () {
		getMainStartPage();
		my_ga('send', 'event', 'getMainStartPage', 'click', 'elementLogoImage');
	});
	App.elementTitlePage.click(function () {
		getSuperDealsPage();
		my_ga('send', 'event', 'getSuperDealsPage', 'click', 'elementTitlePage');
	});
	App.elementInfoPage.click(function () {
		hideHeaderAndFooter();
		my_ga('send', 'event', 'hideHeaderAndFooter', 'click', 'elementInfoPage');
	});
	App.elementFooterInfo.click(function () {
		getInfoPage();
		my_ga('send', 'event', 'getInfoPage', 'click', 'elementFooterInfo');
	});
	App.elementFooterRSS.click(function () {
		getRSSPage();
		my_ga('send', 'event', 'getRSSPage', 'click', 'elementFooterRSS');
	});
	App.info.click(function () {
		clearFindToSearch();
		//location.hash = '';
		//location.search = '';
		my_ga('send', 'event', 'clearFindToSearch', 'click', 'info: (' + App.maxSize + ' items)');
	});
	App.elementPrevPage.click(function () {
		getPrevPage();
		my_ga('send', 'event', 'getPrevPage', 'click', 'elementPrevPage');
	});
	App.elementHomePage.click(function () {
		getHomePage();
		my_ga('send', 'event', 'getHomePage', 'click', 'elementHomePage');
	});
	App.elementNextPage.click(function () {
		getNextPage();
		my_ga('send', 'event', 'getNextPage', 'click', 'elementNextPage');
	});
	App.elementSearch.change(function () {
		getElementsPerPage();
		App.phraseSearch = App.elementSearch.val();
		findToSearch(App.dataAll, App.phraseSearch);
		App.elementSearch.val("");
		App.elementSearch.blur();
		App.dataStart = 0;
		App.dataLimit = App.elementsPerPage;
		createPage(App.dataStart, App.dataLimit);
		//location.hash = '';
		//location.search = 'search=' + App.phraseSearch;
		my_ga('send', 'event', 'findToSearch', 'change', 'elementSearch: ("' + App.phraseSearch + '" - ' + App.maxSize + ' items)');
	});
	App.elementMainLeft.click(function () {
		getPrevPage();
		my_ga('send', 'event', 'getPrevPage', 'click', 'elementMainLeft');
	});
	App.elementMainRight.click(function () {
		getNextPage();
		my_ga('send', 'event', 'getNextPage', 'click', 'elementMainRight');
	});
	App.elementMainHide.click(function () {
		showHeaderAndFooter();
		my_ga('send', 'event', 'showHeaderAndFooter', 'click', 'elementMainHide');
	});
	try {
		document.addEventListener('click', function (e) {
			var target = e && e.target || event.srcElement;
			var currentAnchor = target.parentNode.parentNode;
			if (currentAnchor.tagName == "A") {
				//location.hash = currentAnchor.id;
				my_ga('send', 'event', 'item', 'click', currentAnchor.href);
			}
		});
	}
	catch (e) {
		my_ga('send', 'event', 'addEventListener', 'Error-click', e);
	}
	try {
		document.addEventListener('touchstart', function (event) {
			//event.preventDefault();
			//event.stopPropagation();
			initialPoint = event.changedTouches[0];
		});
	}
	catch (e) {
		my_ga('send', 'event', 'addEventListener', 'Error-touchstart', e);
	}
	try {
		document.addEventListener('touchend', function (event) {
			//event.preventDefault();
			//event.stopPropagation();
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
		});
	}
	catch (e) {
		my_ga('send', 'event', 'addEventListener', 'Error-wheel', e);
	}

});
$(document).keydown(function (eventObject) {
	if (eventObject.which == 37) {
		getPrevPage();
		my_ga('send', 'event', 'getPrevPage', 'keydown', 'document');
	}
	if (eventObject.which == 38 || eventObject.which == 36) {
		getHomePage();
		my_ga('send', 'event', 'getHomePage', 'keydown', 'document');
	}
	if (eventObject.which == 39) {
		getNextPage();
		my_ga('send', 'event', 'getNextPage', 'keydown', 'document');
	}
	///*
	//{black
	if (eventObject.which == 112) {
		getInfoPage();
		my_ga('send', 'event', 'getInfoPage', 'keydown', 'document');
	}
	//}black
	//*/
});
$(window).resize(function () {
	reloadCurrentPage();
	my_ga('send', 'event', 'reloadCurrentPage', 'resize', 'window: (' + $(window).width() + 'x' + $(window).height() + ')');
});