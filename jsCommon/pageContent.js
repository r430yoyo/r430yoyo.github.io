function displayDate() {
	var strDisplayDate = "PostDateAndModifyDate";
	
	if (typeof strPostDate === "undefined") {
		return;
	}
	
	if (intSecondMenuId != -1 || intMainMenuId != -1) {
		if (dicSetting.hasOwnProperty("dicCatDateDisplayType")) {
			if (dicSetting["dicCatDateDisplayType"].hasOwnProperty(intSecondMenuId.toString())) strDisplayDate = dicSetting["dicCatDateDisplayType"][intSecondMenuId.toString()];
			else if (dicSetting["dicCatDateDisplayType"].hasOwnProperty(intMainMenuId.toString())) strDisplayDate = dicSetting["dicCatDateDisplayType"][intMainMenuId.toString()];
		}
	}
	
	var strInnerHtml = "";
	
	if (strDisplayDate == "OnlyPostDate") {
		strInnerHtml = strPostDateLabel + strPostDate;
	}
	
	if (strDisplayDate == "OnlyModifyDate") {
		if (strModifyDate != "") strInnerHtml = strModifyDateLabel + strModifyDate;
		else strInnerHtml = strPostDateLabel + strPostDate;
	}

	if (strDisplayDate == "PostDateAndModifyDate") {
		strInnerHtml = strPostDateLabel + strPostDate;
		if (strModifyDate != "") strInnerHtml += " (" + strModifyDateLabel + strModifyDate + ")";
	}
	
	$(".content-date").html(strInnerHtml);
}

var contentBase = document.querySelector(".page-content");

var contentShouldReplaced = contentBase.querySelectorAll("*[style]");
Array.from(contentShouldReplaced).forEach(function(nel) {
	var originStyle = nel.getAttribute("style");
	if (originStyle) {
		nel.setAttribute("style", replaceFontSizeToEM(originStyle));
	}
});

var contentAnchorShouldRemoved = contentBase.querySelectorAll("a");
Array.from(contentAnchorShouldRemoved).forEach(function(nel) {
	if (nel.innerHTML.trim() === '') {
		nel.remove();
	} else if (nel.innerText.trim() === '') {
		// is not image ?
		if (!nel.querySelector("img")) {
			nel.outerHTML = nel.innerHTML;
		} else {
			var containImages = nel.querySelectorAll("img");
			Array.from(containImages).forEach(function(imgel) {
				if (!imgel.getAttribute("alt")) {
					imgel.setAttribute("alt", "無標題");
				}
			});
		}
	}
});

var contentIframeShouldAddTitle = contentBase.querySelectorAll("iframe");
Array.from(contentIframeShouldAddTitle).forEach(function(nel) {
	nel.setAttribute("title", "這是嵌入式頁框無法查看內容");
});

var contentHeaderElementShouldReplace = contentBase.querySelectorAll("h1,h2,h3,h4,h5,h6");
Array.from(contentHeaderElementShouldReplace).forEach(function(nel){
	if (nel.innerHTML.trim() === "" && nel.innerText.trim() === "") {
		var p = document.createElement("p");
		nel.replaceWith(p);
	}
});
