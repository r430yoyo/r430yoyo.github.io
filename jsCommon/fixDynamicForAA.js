
var shouldAddAltElements = ["AREA"];
var bodyStyles = getComputedStyle(document.body);
var baseFontSize = parseInt(bodyStyles.fontSize);
var fontSizeRe = /font-size:[\s]*([0-9]+)(px|pt)?/g;

var bodyObserverCallTimes = 0;
var bodyObserverPreCallTimes = -1;
var bodyObserverDetectInt = null;

var headObserverCallTimes = 0;
var headObserverPreCallTimes = -1;
var headObserverDetectInt = null;

function replaceFontSizeToEM(text) {
	if (fontSizeRe.test(text)) {
		return text.replaceAll(fontSizeRe, function(p1, p2, p3){
			var px = parseInt(p2);
			if (p3 && p3 == "pt") {
				px = px / 0.75;
			}
		    return "font-size:" + (px / baseFontSize).toFixed(3) + "em";
		});	
	}
	return text;
} 

// for body detect iframe
bodyElementObserver = new MutationObserver(function(mutations) {
	mutations.forEach(function(mutation) {
		var addNodes = mutation.addedNodes;
		if (addNodes && addNodes.length) {
			bodyObserverCallTimes++;
			addNodes.forEach(function(el){
				if (el.tagName === "IFRAME") {
					el.setAttribute("title", "這是嵌入式頁框無法查看內容");
				} 
				if (el.querySelectorAll) {
					var shouldAddNodes = el.querySelectorAll(shouldAddAltElements.join(","));
					Array.from(shouldAddNodes).forEach(function(nel){
						nel.setAttribute && nel.setAttribute("alt", "這是" + nel.tagName + "標籤");
					}); 
					var shouldReplacedStylesNodes = el.querySelectorAll("*[style]");
					Array.from(shouldReplacedStylesNodes).forEach(function(nel) {
						var originStyle = nel.getAttribute("style");
						if (originStyle) {
							nel.setAttribute("style", replaceFontSizeToEM(originStyle));
						}
					});
					// for recaptcha
					var shouldAddTitleNodes = el.querySelectorAll("textarea[id=g-recaptcha-response");
					Array.from(shouldAddTitleNodes).forEach(function(nel) {
						nel.setAttribute("title", "This is recaptcha response");
					});
					// for map content
					var imageElments = el.querySelectorAll("img");
					var mapContentFound = imageElments.length ? imageElments[0].closest("#map-content") : null;
					if (mapContentFound) {
						Array.from(imageElments).forEach(function(nel){
							nel.setAttribute("alt", nel.getAttribute("alt") || "no alt");
						});
					}
				}
			});
		}
	}); 
});
bodyElementObserver.observe(document.body, { childList: true, subtree: true } );

bodyObserverDetectInt = setInterval(function(){
	if (bodyObserverCallTimes == bodyObserverPreCallTimes) {
		// should stop
		bodyElementObserver.disconnect();
		clearInterval(bodyObserverDetectInt);
		bodyObserverDetectInt = null;
	}
	bodyObserverPreCallTimes = bodyObserverCallTimes;
}, 10000);

// for head detect style sheets
headElementObserver = new MutationObserver(function(mutations) {
	mutations.forEach(function(mutation) {
		var addNodes = mutation.addedNodes;
		if (addNodes && addNodes.length) {
			headObserverCallTimes++;
			addNodes.forEach(function(el){
				if (el.tagName === "STYLE") {
					el.innerText = replaceFontSizeToEM(el.innerText);
				}
			});
		}
	})
});
headElementObserver.observe(document.head, { childList: true, subtree: true } );

headObserverDetectInt = setInterval(function(){
	if (headObserverCallTimes == headObserverPreCallTimes) {
		// should stop
		headElementObserver.disconnect();
		clearInterval(headObserverDetectInt);
		headObserverDetectInt = null;
	}
	headObserverPreCallTimes = headObserverCallTimes;
}, 10000);
