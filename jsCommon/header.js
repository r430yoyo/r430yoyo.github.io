var isSearchShow = false;
var isLanguageShow = false;

initLanguageArea();

function initLanguageArea() {	
	isLanguageShow = false;
	$('.navibar-480px .language-area').hide();
	
	if (lstLanguage.length == 1) {
		// Desktop
		var strLanguageUrl = lstLanguage[0].StrPath;
		var intIndexOfHttp = strLanguageUrl.indexOf("http");
		$("#desktop-language-container").html(
			"<a href=\"" + lstLanguage[0].StrPath + (intIndexOfHttp >= 0 ? "" : "index.html") + "\">" + lstLanguage[0].strLanguage + "</a>"
		);
		
		// Mobile
		$(".mobile-lang-toggle > a").attr("href", lstLanguage[0].StrPath + (intIndexOfHttp >= 0 ? "" : "index.html"))
		$(".mobile-lang-toggle:last-child > a").html(lstLanguage[0].strLanguage);
	} else {
		// Desktop
		var strDesktopInnerHtml = " <span class=\"glyphicon glyphicon-globe\" aria-hidden=\"true\" style=\"font-size:0.8em; margin-right:-5px\"></span><span class=\"dropdown\"><a href=\"#\" class=\"dropdown-toggle\" data-toggle=\"dropdown\" role=\"button\" aria-haspopup=\"true\" aria-expanded=\"false\">";
		strDesktopInnerHtml += "Language" + "<span class=\"caret\"></span></a><ul class=\"dropdown-menu pull-left\">";
		for (var i=0; i<lstLanguage.length; i++) {
			var strLanguageUrl = lstLanguage[i].StrPath;
			var intIndexOfHttp = strLanguageUrl.indexOf("http");
			if (lstLanguage[i].hasOwnProperty("isOutterLink") && lstLanguage[i]["isOutterLink"]) {
				strDesktopInnerHtml += "<li><a href=\"";
				strDesktopInnerHtml += lstLanguage[i].StrPath + "\" target=\"_blank\">" + lstLanguage[i].strLanguage + "</a></li>";
			} else {
				strDesktopInnerHtml += "<li><a href=\"";
				strDesktopInnerHtml += lstLanguage[i].StrPath + (intIndexOfHttp >= 0 ? "" : "index.html") + "\">" + lstLanguage[i].strLanguage + "</a></li>";
			}
		}
		strDesktopInnerHtml += "</ul></span>";
		$("#desktop-language-container").html(strDesktopInnerHtml);
		
		// Mobile
		$(".mobile-lang-toggle:last-child").html(strLangLabel);
		var strInnerHtml = "";
		for (var i=0; i<lstLanguage.length; i++) {
			var strLanguageUrl = lstLanguage[i].StrPath;
			var intIndexOfHttp = strLanguageUrl.indexOf("http");
			if (lstLanguage[i].hasOwnProperty("isOutterLink") && lstLanguage[i]["isOutterLink"]) {
				strInnerHtml += "<div class=\"col-xs-4\"><a href=\"";
				strInnerHtml += lstLanguage[i].StrPath + "\" target=\"_blank\">" + lstLanguage[i].strLanguage + "</a></div>";
			} else {
				strInnerHtml += "<div class=\"col-xs-4\"><a href=\"";
				strInnerHtml += lstLanguage[i].StrPath + (intIndexOfHttp >= 0 ? "" : "index.html") + "\">" + lstLanguage[i].strLanguage + "</a></div>";
			}
		}
		$(".navibar-480px .language-area").html(strInnerHtml);
		initLanguageToggle();
	}
}

function initLanguageToggle() {
	if (strCurrentScreenMode == "Mobile") {
		$(".navibar-480px .mobile-lang-toggle").click(showHideLanguage);
	} else {
		$(".navibar-480px .mobile-lang-toggle").unbind("click");
	}
}

function showHideLanguage() {
	if (isLanguageShow) {
		$('.navibar-480px .language-area').hide();
	} else {
		$('.navibar-480px .language-area').show();
		$('.navibar-480px .search-area').hide();
		isSearchShow = false;
	}
	isLanguageShow = !isLanguageShow;
}