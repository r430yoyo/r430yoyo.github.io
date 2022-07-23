var lstBannerImageUrl = null;
var intBannerImageIndex = 0;

function cycleImages(){
	// var $active = $('.bgImageContainer .active');
	// var $next = ($active.next().length > 0) ? $active.next() : $('.bgImageContainer img:first');
	// $next.css('z-index',2);//move the next image up the pile
	// $active.fadeOut(1500,function(){//fade out the top image
		// $active.css('z-index',1).show().removeClass('active');//reset the z-index and unhide the image
		// $next.css('z-index',3).addClass('active');//make the next image the top one
	// });
	var $active = $('.bgImageContainer .active');
	var $next = $('.bgImageContainer .next');
	
	intBannerImageIndex = (intBannerImageIndex == lstBannerImageUrl.length-1) ? 0 : intBannerImageIndex+1;
	
	$next.css("background-image", "url(" + lstBannerImageUrl[intBannerImageIndex] + ".webp)");
	$active.fadeOut(1500,function(){//fade out the top image
		$active.css('z-index',1).show().removeClass('active').addClass("next");//reset the z-index and unhide the image
		$next.css('z-index',2).removeClass('next').addClass('active');//make the next image the top one
	});
}

$(document).ready(function(){
	// run every 7s
	
	if (typeof isIe8 !== "undefined") {
		return;
	}

	var $active = $('.bgImageContainer .active');
	if ($active == null || strCurrentScreenMode == "Mobile") return; // no banner
	
	$.ajax({
		url: "js/bannerImageInfo.json",
		type: "get",
		dataType: "json",
		success: function (jsonObject) {
			var $active = $('.bgImageContainer .active');
			$active.css("background-image", "url(" + jsonObject[0] + ".webp)");
			startCycleBannerImage(jsonObject);
		},
		error: function (xhr, ajaxOptions, thrownError) {
			//console.log("[bannerImageController] fail to load customize banner image json");
			$.ajax({
				url: "/jsCommon/bannerImageInfo.json",
				type: "get",
				dataType: 'json',
				success: function (jsonObject) {
					var $active = $('.bgImageContainer .active');
					$active.css("background-image", "url(" + jsonObject[0] + ".webp)");
					startCycleBannerImage(jsonObject);
				},
				error: function (xhr, ajaxOptions, thrownError) {
					//console.log("[bannerImageController] fail to load global banner image json");
				}
			});
		}
	});
});

function startCycleBannerImage(lstBannerImageUrlReturn) {
	lstBannerImageUrl = lstBannerImageUrlReturn;
	//console.log("[bannerImageController] lstBannerImageUrl:", lstBannerImageUrl);
	if (lstBannerImageUrl.length > 1) setInterval('cycleImages()', 7000);
}


