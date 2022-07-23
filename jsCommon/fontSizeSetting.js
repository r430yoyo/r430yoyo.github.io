var strCurrentFontSize = "small";

$(document).ready(function(){
	strCurrentFontSize = getCookie("fontSize");
	switch (strCurrentFontSize) {
		case "large":
			setLargeFont();
			break;
		case "medium":
			setMediumFont();
			break;
		case "small":
			setSmallFont();
			break;
		default:
			setSmallFont();
	}
});

if (document.getElementById("largeFont")) document.getElementById("largeFont").addEventListener("click", setLargeFont);
if (document.getElementById("mediumFont")) document.getElementById("mediumFont").addEventListener("click", setMediumFont);
if (document.getElementById("smallFont")) document.getElementById("smallFont").addEventListener("click", setSmallFont);

function setLargeFont() {
	strCurrentFontSize = "large";
	setFontSizeCookie();
	$("html").css("font-size", "121%");
	setLinkStyle();
}

function setMediumFont() {
	strCurrentFontSize = "medium";
	setFontSizeCookie();
	$("html").css("font-size", "110%");
	setLinkStyle();
}

function setSmallFont() {
	strCurrentFontSize = "small";
	setFontSizeCookie();
	$("html").css("font-size", "100%");
	setLinkStyle();
}

function setLinkStyle() {
	$("#largeFont").css("text-decoration", "none");
	$("#mediumFont").css("text-decoration", "none");
	$("#smallFont").css("text-decoration", "none");
	$("#" + strCurrentFontSize + "Font").css("text-decoration", "underline");
}

function getCookie(cname) {
    var name = cname + "=";
	// console.log("[fontSetting] cookie: ", document.cookie);
    var ca = document.cookie.split(';');
    for(var i=0; i<ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0)==' ') c = c.substring(1);
        if (c.indexOf(name) == 0) return c.substring(name.length,c.length);
    }
    return "";
}

function setFontSizeCookie() {
	var cookieToSave = "fontSize=" + strCurrentFontSize + ";path=/";
	document.cookie = cookieToSave;
}