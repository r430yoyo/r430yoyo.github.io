var strShortcutJsonUrl = "js/shortcut.json";

$(document).ready(loadShortcut);

function loadShortcut() {
	$.getJSON(strShortcutJsonUrl, function (lstShortcut) {
		//console.log("[shortcutController] loadShortcut " + strShortcutJsonUrl + " success!");
		createShortcut(lstShortcut);
	})
	.fail(function () {
		console.log("[shortcutController] loadShortcut " + strShortcutJsonUrl + " error!");
	});
}

function createShortcut(lstShortcut) {
	var $shortcut = $('.shortcut');
	
	if ($shortcut == null) return; // no shortcut div in document
	
	if (!$.isArray(lstShortcut) || lstShortcut.length == 0) return; // no shorcut
	
	var strInnerHtml = "";
	
	for (var i=0; i<lstShortcut.length; i++) {
		var item = lstShortcut[i];
		var toBlank = item.isNeedBlankPage && parseInt(item.isNeedBlankPage);
		strInnerHtml += "<div class='shortcut-container'>";
		strInnerHtml += "<div class='shortcut-content'>";
		strInnerHtml += "<span class='glyphicon " + item.strIconName + "' aria-hidden='true'></span></div>";
		strInnerHtml += "<div class='shortcut-content'><a href='" + item.strUrl + "'" + ((toBlank)  ? " target='_blank'" : "") + ">";
		strInnerHtml += item.strName;
		strInnerHtml += "</a></div>";
		strInnerHtml += "</div>";
	}
	
	var strWidth = (204.8 * lstShortcut.length).toString() + "px";
	$shortcut.css("width", strWidth);
	
	$shortcut.html(strInnerHtml);
}
