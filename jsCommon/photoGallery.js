var gallery = null;
var lstPhotoJson = [];
var lstAlbumInfo = null;

/* 建立相簿之用途 */
var intCurrentAlbumIndex = 0;
var intCurrentAlbumPageIndex = 0;
var intTotalPhotoNum = 0;  //所有相簿張數
var intCurrentFrameId = 0;
var intCurrentPagerIndex = 0;
var strDefaultPhoto = null;
var isNeedSearchRemainPhoto = false;

//相簿內批次圖片載入時要用的 
var intMaxPhotoNum = 30; //相簿一開始載入時最大顯示張數
var intPhotoNumOffset = 10; //當瀏覽到最後一頁要多載入幾張相片

var options = {
	countPerPage: 8, // 每一頁呈現幾筆
	countPager:5 // 呈現幾個頁數選項, 3 表示 [<] [1] [2] [3] [>] or  [<] [4] [5] [6] [>] ...
}

//console.log("[photoGallery] strCurrentScreenMode:", strCurrentScreenMode);

if ($(window).width() <= 768) {
	options['countPerPage'] = 1;
}

var fotoramaImgObserver = new MutationObserver(function(mutations) {
	mutations.forEach(function(mutation) {
		var addNodes = mutation.addedNodes;
		if (addNodes && addNodes.length) {
			addNodes.forEach(function(el){
				if (el.tagName === "IMG") {
					var navWrap = el.closest(".fotorama__nav-wrap");
					var stageWrap = el.closest(".fotorama__stage__frame");
					if (navWrap) {
						var imgFrames = navWrap.querySelectorAll(".fotorama__nav__frame");
						Array.from(imgFrames).forEach(function(nel, nidx){
							if (nel.querySelector("img") === el) {
								el.setAttribute("alt", lstPhotoJson[nidx].strTitle || "無標題");
							}
						});
					} else if (stageWrap) {
						var originAlt = el.getAttribute("alt");
						el.setAttribute("alt", originAlt || "無標題");
					}
				}
			});
		}
	}); 
});
fotoramaImgObserver.observe(document.querySelector("#fotorama"), { childList: true, subtree: true } );

/* initial */
$(document).ready(function(){
	HoldOn.open({
		theme:"sk-rect",//If not given or inexistent theme throws default theme sk-rect
		message: "<h4>Loading...</h4>",
		content:"Your HTML Content", // If theme is set to "custom", this property is available
									 // this will replace the theme by something customized.
		backgroundColor:"black",//Change the background color of holdon with javascript
							   // Keep in mind is necessary the .css file too.
		textColor:"white" // Change the font color of the message
	});
	
	$('.fotorama').on('fotorama:ready', function (e, fotorama, extra) {
		//HoldOn.close();
		$('.fotorama').off('fotorama:ready');
		//setTimeout(HoldOn.close, 2000);
	});

	var pathList = location.pathname.split("/").slice(0, 2);
	pathList.push("gallery");

	$.ajax({
		url: pathList.join("/") + "/photoAlbumInfo.js?radsrc=" + (new Date().toString()),
		type: "get",
		dataType: 'text',
		cache: false,
		success: function (strJs) {
			eval(strJs);
			if (lstPhotoAlbum == null) {
				HoldOn.close();
				return;
			}
			
			if (lstPhotoAlbum.length == 0) {
				HoldOn.close();
			} else {
				lstAlbumInfo = lstPhotoAlbum;
				initialFotorama();
			}
		},
		error: function (xhr, ajaxOptions, thrownError) {
			console.log("fail to load");
			HoldOn.close();
		}
	});
});

function initialFotorama() {
	$gallery = $('.fotorama').fotorama();
	gallery = $gallery.data('fotorama');
		
	intCurrentAlbumIndex = extractParameterFromUrl("album") || $(".albumList").attr("selected-idx") || null;
	
	if (intCurrentAlbumIndex == null || intCurrentAlbumIndex >= lstAlbumInfo.length || intCurrentAlbumIndex < 0) {
		intCurrentAlbumIndex = 0;
	}
	
	strDefaultPhoto = extractParameterFromUrl("img");
	
	if (strDefaultPhoto != null) {
		isNeedSearchRemainPhoto = true;
	}
	
	// 20160427 bigcookie update 註冊 fotorama onload 事件，載入第一張圖片的文字資訊
	setOnloadEventHandle();
	
	// 20160427 bigcookie update 註冊 fotorama show 事件，載入圖片的文字資訊
	setShowEventHandle();
	
	//20151115 roy updated 批次載入圖片
	setShowendEventHandle();
	
	setTimeout(buildPhotos, 1000)
}

var loadedOnceFlag = false;
function setOnloadEventHandle() {
	//register event fotorama:load to show firat photo
	$('.fotorama').on('fotorama:load', function (e, fotorama, extra) {
		if (!loadedOnceFlag) {
			showText(fotorama.activeIndex);
			loadedOnceFlag = true;
		}	
	});		
}

function setShowEventHandle() {
	// register event fotorama:show to show text
	$('.fotorama').on('fotorama:show', function (e, fotorama, extra) {
		showText(fotorama.activeIndex);
	});	
}

/*20151114 roy updated 一開始只載入部分圖片，判斷目前瀏覽位置，當瀏覽到最後一張圖時才載入後續圖片 */
function setShowendEventHandle()
{
	// Listen to the events
	$('.fotorama').on('fotorama:showend ',         // End of the show transition
		function (e, fotorama, extra) {
			intCurrentFrameId = fotorama.activeIndex;
			console.log('[photoGallery] setShowendEventHandle / Current Frame Id =', intCurrentFrameId, ",intMaxPhotoNum-5 =", intMaxPhotoNum-5, ", fotorama.size =", fotorama.size);
			
			// roy: 有超過我們設定的最大張數才需要判斷重新載入
			// 20160428 bigcookie update: 當目前顯示的圖片 index 加 5 超過目前的總張數時往後載入更多圖片
			if(intCurrentFrameId >= intMaxPhotoNum-5) {
				intMaxPhotoNum = intMaxPhotoNum+intPhotoNumOffset; //增加載入的圖片數量限制
				loadPhoto(fotorama.size);
			}
		}
	);
	
}

// refresh photo
function buildPhotos() {		
	var strLoadFile = lstAlbumInfo[intCurrentAlbumIndex].strPhotoJsonUrl;
	// var strLoadFile = intCurrentAlbumIndex < lstAlbumInfo.length? lstAlbumInfo[intCurrentAlbumIndex].strPhotoJsonUrl: lstAlbumInfo[0].strPhotoJsonUrl;

	showAlbumTitle(intCurrentAlbumIndex);
	
	var pathList = location.pathname.split("/").slice(0, 2);
	pathList.push("gallery");
	pathList.push(strLoadFile);

	$.ajax({
		url: pathList.join("/") + "?radsrc=" + (new Date().toString()),
		type: "get",
		dataType: 'json',
		cache: false,
		success: function (jsonObject) {
			if ($.isArray(jsonObject)) {
				lstPhotoJson = jsonObject;
				intTotalPhotoNum = lstPhotoJson.length; //設定照片總張數
			}
			loadPhoto(0);
		},
		error: function (xhr, ajaxOptions, thrownError) {
			console.log("fail to load");
		}
	});
		
	// 產生相簿
	buildAlbumList(Math.floor(intCurrentAlbumIndex/options.countPerPage));
	buildAlbumPager(Math.floor(intCurrentAlbumIndex/(options.countPerPage * options.countPager)));
}

// show photo and description
function loadPhoto(intStartIndex) {
	var intDefaultPhotoIndex = -1;
	
	for(var i = intStartIndex; i < intTotalPhotoNum; ++i) {
		if(i >= intMaxPhotoNum) break; //20151113 roy updated
		var strThumbPath = lstPhotoJson[i].strThumbnailUrl;
		strThumbPath = strThumbPath.substr(0, strThumbPath.lastIndexOf(".")) + ".thumbnail"; //20151113 roy updated
		//console.log(strThumbPath);
		
		gallery.push({
			img: lstPhotoJson[i].strPhotoUrl,
			thumb: strThumbPath   //20151113 roy updated
		});
		
		if (strDefaultPhoto != null) {
			if (strDefaultPhoto == lstPhotoJson[i].strPhotoUrl) {
				intDefaultPhotoIndex = i;
				strDefaultPhoto = null;
			}
		}
	}
	
	// console.log('[photoGallery] loadPhoto / Current Frame Id =', intCurrentFrameId, ",intMaxPhotoNum-5 =", intMaxPhotoNum-5, ", fotorama.size =", gallery.size);
	// console.log("[photoGallery] loadPhoto / gallery.activeIndex =", gallery.activeIndex);
	
	// 在大圖後插入文字框 div@class='text'
	$(".photo-text-container").remove();
	$(".fotorama__stage").after("<div class='photo-text-container'><div class='photo-counter'>"+ (gallery.activeIndex+1).toString() +" / "+ intTotalPhotoNum.toString() +"</div><div class='photo-title'>"+ lstPhotoJson[gallery.activeIndex].strTitle +"</div><div class='photo-description'>"+ lstPhotoJson[gallery.activeIndex].strDescription +"</div></div>");
	
	// 找到符合 Default Photo 的 index，跳至該圖片
	if (intDefaultPhotoIndex != -1) {
		gallery.show(intDefaultPhotoIndex);
		intDefaultPhotoIndex = -1;
		isNeedSearchRemainPhoto = false;
	}
	
	// 找不到符合 Default Photo 的 index
	if (intDefaultPhotoIndex == -1 && isNeedSearchRemainPhoto) {
		if (i == intTotalPhotoNum) {
			// 已經載入最後一張，不需往下載入
			isNeedSearchRemainPhoto = false;
		} else {
			// 還沒載入最後一張所以繼續往下載入
			intMaxPhotoNum = intMaxPhotoNum+intPhotoNumOffset;
			loadPhoto(gallery.size);
		}
	}
	
	// 已經找到 Default Photo 的 index
	if (intDefaultPhotoIndex == -1 && !isNeedSearchRemainPhoto) {
		HoldOn.close();
	}
}

// 產生相簿
function buildAlbumList(_pageIndex) {
	intCurrentAlbumPageIndex = _pageIndex;
	var count = lstAlbumInfo.length;
	var intPageCount = Math.floor(count / options.countPerPage) + (count % options.countPerPage == 0? 0: 1);
	var intStartIndex = intCurrentAlbumPageIndex * options.countPerPage;
	var intEndIndex = intStartIndex + options.countPerPage;
	
	// $(".albumList").empty();
	var albumListWrap = $(".albumList");
	var albums = albumListWrap.children(".album");
	if ( albums.length ) {
		// set all none
		albums.css("display", "none").removeClass("album-selected");
		albums.each(function(){
			var jqthis = $(this),
				dataId = parseInt(jqthis.attr("data-id"));

			if ( dataId >= intStartIndex && dataId < intEndIndex ) {
				if ( dataId == intCurrentAlbumIndex ) jqthis.addClass("album-selected");
				jqthis.css("display", "");
			}
		});
	} else {
		// init
		var newAlbums = albumListWrap.children("a[album-idx]");
		if ( newAlbums.length ) {
			// new version
			// do new version
			newAlbums.each(function(idx){
				var selfjq = $(this);
				var strAlbum = "<a class='album col-lg-3 col-md-4 col-sm-6' style='display:none;' data-id='" + idx + 
					"' href='" + selfjq.attr("href") + 
					"'><div class='img-wrap'><img src='" + selfjq.attr("cover") + 
					"' alt='' /></div><h5>" + selfjq.text() + "</h5></a>";
				var jqAlbum = $(strAlbum);
				if ( idx >= intStartIndex && idx < intEndIndex ) {
					if ( idx == intCurrentAlbumIndex ) jqAlbum.addClass("album-selected");
					jqAlbum.css("display", "");
				}
				albumListWrap.append(jqAlbum);
			});
			newAlbums.remove();
		} else {
			// old version
			var hrefbase = location.pathname + "?album=";
			// render all, shows current albums hide others.
			for (var i = 0; i < count; i++){
				var strAlbum = "<a class='album col-lg-3 col-md-4 col-sm-6' style='display:none;' data-id='" + i + "' href='" + hrefbase + i + "'><div class='img-wrap'><img src='" + lstAlbumInfo[i].strCoverUrl + "' alt='' /></div><h5>" + lstAlbumInfo[i].strTitle + "</h5></a>";
				var jqAlbum = $(strAlbum);
				if ( i >= intStartIndex && i < intEndIndex ) {
					if ( i == intCurrentAlbumIndex ) jqAlbum.addClass("album-selected");
					jqAlbum.css("display", "");
				}
				$(".albumList").append(jqAlbum);
			}
		}
	}
}

// 產生相簿頁面切換區
function buildAlbumPager(_pagerIndex) {
	intCurrentPagerIndex = _pagerIndex;
	var count = lstAlbumInfo.length;
	var intPageCount = Math.floor(count / options.countPerPage) + (count % options.countPerPage == 0? 0: 1);
	var intPagerCount = Math.floor(intPageCount / options.countPager) + (intPageCount % options.countPager == 0? 0: 1);
	var intStartIndex = intCurrentPagerIndex * options.countPager;
	var intEndIndex = intStartIndex + options.countPager;
	
	//console.log(count, intPageCount, intPagerCount, intStartIndex, intEndIndex);
	
	$(".albumPager").empty();
	var strInnerHtml = "<nav><ul class='pagination'>";
	
	// 是否加 [<]
	if (_pagerIndex > 0) {
		strInnerHtml += "<li><a class='pager' data-id='<' style='cursor: pointer;' aria-label='Previous'><span aria-hidden='true'>&laquo;</span></a></li>";
	}
	for (var i = intStartIndex; i < intEndIndex && i < intPageCount; ++i) {
		if (intCurrentAlbumPageIndex == i) {
			strInnerHtml += "<li class='active'><a class='pager' style='cursor: pointer;' data-id='" + i + "' >" + (i+1) + "</a></li>";
		} else {
			strInnerHtml += "<li><a class='pager' style='cursor: pointer;' data-id='" + i + "'>" + (i+1) + "</a></li>";
		}
	}
	// 是否加 [>]
	if (_pagerIndex < (intPagerCount - 1)) {
		strInnerHtml += "<li><a class='pager' data-id='>' aria-label='Next' style='cursor: pointer;'><span aria-hidden='true'>&raquo;</span></a></li>";
	}
	
	strInnerHtml += "</ul></nav>"
	
	$(".albumPager").append(strInnerHtml);
	
	$(".pager").click(function(){
		changeAlbumList($(this).attr("data-id"));
	});
}

function changeAlbumList(data) {
	if (data == ">") {
		buildAlbumPager(intCurrentPagerIndex + 1);
		return;
	}
	if (data == "<") {
		buildAlbumPager(intCurrentPagerIndex - 1);
		return;
	}
	intCurrentAlbumPageIndex = data;
	buildAlbumPager(intCurrentPagerIndex);
	buildAlbumList(data);
}

function showAlbumTitle(index) {
	$(".album-title").html(lstAlbumInfo[index].strTitle);
}

// show photo description
function showText(index) {
	var strCounterText = (index + 1).toString() + " / " + intTotalPhotoNum.toString();
	$(".photo-title").html(lstPhotoJson[index].strTitle);
	$(".photo-counter").html(strCounterText);
	$(".photo-description").html(lstPhotoJson[index].strDescription);
	$(".fotorama__stage img").attr("alt", lstPhotoJson[index].strTitle || "無標題");
}

// extrcat parameter key from url
function extractParameterFromUrl(key) {
	var strParameters = decodeURIComponent(window.location.search.substring(1));
	var lstKeyValue = strParameters.split('&');
	for (var i = 0; i < lstKeyValue.length; i++) {
		lstTemp = lstKeyValue[i].split('=');
		if (lstTemp[0] === key) {
			return lstTemp[1] === undefined ? null : lstTemp[1];
		}
	}
	return null;
}
