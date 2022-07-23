var isMapShow = false;

initMarquee();
checkOverflow();
initMap();
initBanner();

$(document).ready(function(){
	if (strCurrentScreenMode == "Desktop") {
		initCalendar();
	}
});

function initMarquee() {
	$.getJSON("js/headline.json", function(lstData) {
		if (lstData == null) return;
		if (lstData.length > 0) {
			$(".marquee-area").show();
			var strInnerHtml = "";
			for (var i=0; i<lstData.length; i++) {
				strInnerHtml += "<div class='swiper-slide'><a href=\"" + lstData[i].strUrl + "\"" + (lstData[i].isNeedBlankPage ? " target=\"_blank\"" : "") + "><p>";
				strInnerHtml += lstData[i].strHeadline + "</p></a></div>"
			}

			$("#swiper-marquee").html(strInnerHtml);

            const swiper_marquee = new Swiper('.swiper_marquee', {
                speed: 600,
                direction: 'vertical',
                loop: true,
                // If we need pagination
                pagination: {
                    el: '.page_marquee',
                    clickable: true,
                },
                navigation: {
                    nextEl: '.swiper-button-next',
                    prevEl: '.swiper-button-prev',
                },
                autoplay: {
                    delay: 3000,
                },
            });

		} else {
			$(".marquee-area").hide();
		}
	})
	.fail(function() {
		console.log("[index] initMarquee / load headline.json error!");
		$(".marquee-area").hide();
	})
}

function checkOverflow() {
	var isOverFlow = false;
	for (var j=0; j<$("#Announcements .list-column-content, #Events .list-column-content, #TaiwanNews .list-column-content").length; j++) {
		var element = $(".list-column-content")[j];
		isOverFlow = false;
		for(var i=0; i< element.childElementCount; i++){
			if (!isOverFlow && (element.children[i].offsetTop + element.children[i].offsetHeight > element.offsetTop + element.offsetHeight)) {
				isOverFlow = true;
			}

			if (isOverFlow) {
				$(element.children[i]).hide();
			}
		}
	}
}

function initCalendar() {
	$('#myCalendar').calendar({
		color: '#FFFFFF',
		color2: '#FFFFFF',
		lang: 'EN'
	});
}

function initMap () {
	isMapShow = false;
	var $map_toggle = $('#map .list-title');
	if ($map_toggle == null) return;

	if (strCurrentScreenMode == "Mobile") {
		$map_toggle.click(showHideMap);
	} else {
		$map_toggle.unbind("click");
		$('#map .row:last-child').show();
	}

	if (!dicSetting.hasOwnProperty("strAddress") || dicSetting["strAddress"] == "") {

	} else {
		var strAppendHtml = "<div class=\"map-address\">" + dicSetting["strAddress"] + "</div>";
		$("#map iframe").css("height", "80%");
		$("#map .list-column-container").append(strAppendHtml);
	}
}

function showHideMap() {
	if (isMapShow) {
		$('#map .row:last-child').hide();
	} else {
		$('#map .row:last-child').show();
	}
	isMapShow = !isMapShow;
}

function initBanner() {
	//alert($(window).width());
	if (strCurrentScreenMode == "Mobile") {
		var intViewportWidth = $('.als-viewport').outerWidth();
		var intScrollingItem = Math.floor(intViewportWidth / 138);
		$("#banner-list").als({
			visible_items: intScrollingItem,
			scrolling_items: intScrollingItem,
			orientation: "horizontal",
			circular: "no",
			autoscroll: "no",
			speed: 800,
			easing: "linear",
			direction: "right",
			start_from: 0
		});
	} else {
		$("#banner-list").als({
			visible_items: 7,
			scrolling_items: 1,
			orientation: "horizontal",
			circular: "no",
			autoscroll: "no",
			speed: 500,
			easing: "linear",
			direction: "right",
			start_from: 0
		});
	}
}

function resetBanner() {
	if (strCurrentScreenMode == "Mobile") {
		var intViewportWidth = $('.als-viewport').outerWidth();
		var intScrollingItem = Math.floor(intViewportWidth / 138);
		// console.log("[index] resetBanner / intScrollingItem:", intScrollingItem);
		$("#banner-list").als({
			scrolling_items: intScrollingItem,
			visible_items: intScrollingItem
		});
	} else {
		$("#banner-list").als({
			scrolling_items: intScrollingItem,
			visible_items: intScrollingItem
		});
	}
}

function indexInitWhenResize() {
	initMap ();
}
