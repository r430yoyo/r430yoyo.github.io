var isCurrentPageIsHome = true;
var strCurrentScreenMode = "Desktop";
var isShowFlag = true;
var dicSetting = {};

function getRelatedPath(){
	var paths = location.pathname.split('/');
	var res = "";
	while(paths.length - 3){
		res += "../";
		paths.pop();
	}
	return res;
}

var relatedPathFromHome = getRelatedPath();

$(document).ready(loadJs);

function loadJs() {
	$.getScript("/jsCommon/fontSizeSetting.js");

	if (typeof isHome === "undefined") {
		isCurrentPageIsHome = false;
	}
	
	if ($('.test-width').is(':hidden')) {
		strCurrentScreenMode = "Mobile";
	}
	
	loadSetting();

	if (isCurrentPageIsHome) {
		$.getScript("/jsCommon/bannerImageController.js");
		$.getScript("/jsCommon/index.js");
		if (strCurrentScreenMode == "Desktop") {
			$('<link/>', {
			   rel: 'stylesheet',
			   type: 'text/css',
			   href: '/cssCommon/calender.css'
			}).appendTo('head');
		}
	}

	$.getScript("/jsCommon/header.js");
	
	$.getScript("/jsCommon/menuView.js", function () {
		createMenu();
	});

	$.getScript("/jsCommon/otherOverseaOfficesView.js", function () {
		createOfficeMenu();
	});
	
	$.getScript("/jsCommon/pageContent.js", function () {
		displayDate();
	});
	
	initResizeHandler();
	
	bindShareRegionEvents();
	
	// initGa();
	
	var strCustomizeJsUrl = relatedPathFromHome + "js/customize.js";
	$.getScript(strCustomizeJsUrl)
		.fail(function () {
			console.log("[jsInclude] load customize js Fail!");
		});

	checkCookie();
}

function loadSetting() {
	var strSettingUrl = relatedPathFromHome + "js/setting.json";
	$.getJSON(strSettingUrl, function (dicData) {
		// console.log("[jsInClude] loadSetting " + strSettingUrl + " success!");
		if (typeof dicData != "object" || dicData == "") {
		} else {
			dicSetting = dicData;
			 if (dicSetting.hasOwnProperty("isShowFlag")) isShowFlag = dicSetting["isShowFlag"];
		}
		initMenuBackgroundImage();
		initHeaderFlag();
    })
	.fail(function () {
	    console.log("[jsInClude] loadSetting " + strSettingUrl + " error!");
		initHeaderFlag();
		dicSetting = {};
	})
}

function initHeaderFlag() {
	if (isShowFlag) {
		if ($("#flag")) $("#flag").fadeIn();
		if ($("#logo-text")) $("#logo-text").fadeIn();
	} else {
		if ($("#flag")) $("#flag").hide();
		if ($("#logo-text")) $("#logo-text").hide();
	}
}

function initMenuBackgroundImage() {
	if (isShowFlag) {
		$("#centerMenu").css("background-image", "url('/imgAssets/version2/menu_bg_01.jpg')");
	} else {
		$("#centerMenu").css("background-image", "url('/imgAssets/version2/menu_bg_00.jpg')");
	}
}

function initResizeHandler() {
	$(window).resize(onResize);
}

function onResize() {
	console.log("[jsInclude] onResize / $('.test-width').is(':hidden')", $('.test-width').is(':hidden'));	
	if ($('.test-width').is(':hidden') && strCurrentScreenMode == "Desktop") {
		strCurrentScreenMode = "Mobile";
		reinitialize();
	} else if (!$('.test-width').is(':hidden') && strCurrentScreenMode == "Mobile"){
		strCurrentScreenMode = "Desktop";
		reinitialize();
	}
}

function reinitialize() {
	console.log("[jsInclude] reinitialize.");
	if (isCurrentPageIsHome) {
		indexInitWhenResize();
	}
	menuReinitiateWhenResize();
	//initSearchToggle();
	initLanguageToggle();
}

function bindShareRegionEvents(){
	$(".print-icon-wrap").click(function(){ window.print(); });

	function regionBlur(){
		$(".share-float-wrap").hide();
	}
	document.body.addEventListener('click', regionBlur);

	$(".share-icon-wrap").click(function(event){
		event.stopPropagation();
		$(this).children(".share-float-wrap").show();
	});
}

function initGa() {
// 	(function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){
// 		(i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),
// 		m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)
// 	})(window,document,'script','//www.google-analytics.com/analytics.js','ga');

// 	ga('create', 'UA-71885452-1', 'auto');
// 	ga('send', 'pageview');
}

function checkCookie(){
	
	var langTextMap = {
		'zh': {
			template: '我們使用cookie改善您在我們網站的使用體驗。請造訪我們的<a href="{url}">隱私權保護聲明</a>以便瞭解更多資訊。使用我們的網站，即表示您同意我們使用cookie。',
			button: '接受'
		},
		'en': {
			template: 'We use cookies to improve user experience. To find out more, please see our <a href="{url}">privacy policy</a>. By using this site, you have agreed to our use of cookies in accordance with our policy.',
			button: 'Accept'
		},
		getContent: function(lang, id){
			var widget = this[lang] || this['en'];
			return widget.template.replace("{url}", relatedPathFromHome + "post/" + id + ".html");
		},
		getButton: function(lang){
			var widget = this[lang] || this['en'];
			return widget.button;
		}
	};

	function _getCookie(name) {
		var parts = document.cookie.split(';')
			.map(function(item){ 
				var splits = item.replace(" ","").split('=');
				return { key: splits[0], value: splits[1] };
			})
			.filter(function(item){
				return item.key == name;
			});
		if (parts.length) return parts[0].value;
		return null;
	}
	function _setCookie(name,value,days) {
	    if (days) {
	        var date = new Date();
	        date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
	        var expires = "; expires=" + date.toGMTString();
	    }
	    else var expires = "";
	    document.cookie = name + "=" + value + expires + "; path=/";
	}

	function getPathInfo(){
		var pathRe = /^\/([a-z]+)(_([a-z]+))?\//;
		var matches = location.pathname.match(pathRe);
		var res = {};
		if ( matches ) {
			res.lang = matches[3] || ( navigator.language || navigator.userLanguage );
			res.path = matches[1];
		}
		return res;
	}

	var currentCookie = _getCookie("_gdpr_cookie_usage_confirm");
	var currentPathInfo = getPathInfo();

	// for migration
	if ( currentCookie == "yes" ) {
		tempObj = {};
		tempObj[currentPathInfo.path] = "yes";
		currentCookie = JSON.stringify(tempObj);
		_setCookie("_gdpr_cookie_usage_confirm", currentCookie, 365);
	}

	function renderCookieConfirm(){
		var userLang = currentPathInfo.lang;
		if ( userLang ) {
			var shortCode = userLang.substr(0, 2);

			var tpl = '<div class="row not-print gdpr-cookie-wrap">' + 
			    '<div class="col-md-6 col-md-offset-3 gdpr-cookie-inner">' +
			    	'<div class="col-xs-10">' +
			    		langTextMap.getContent(shortCode, window.privacyPolicyId) + 
			    	'</div>' +
			    	'<div class="col-xs-2">' +
			    		'<button type="button" class="btn btn-default gdpr-cookie-btn">' + langTextMap.getButton(shortCode) + '</button>' +
			    	'</div>' +
			    '</div>' +
			'</div>';

			var gdprEl = $(tpl);

			$(document.body).append(gdprEl);

			gdprEl.find("button").click(function(){

				var insertJson = currentCookie ? JSON.parse(currentCookie) : {};

				insertJson[currentPathInfo.path] = "yes";

				_setCookie("_gdpr_cookie_usage_confirm", JSON.stringify(insertJson), 365);

				gdprEl.hide();
			});
		}
	}

	if ( window.privacyPolicyId ) {
		var checkJson = currentCookie ? JSON.parse(currentCookie) : {};
		if( checkJson[currentPathInfo.path] != "yes" ){
			renderCookieConfirm();
		}
	}
}
