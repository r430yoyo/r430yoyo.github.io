var strJsonFileFolder = "";
var strJsonFileNamePrefix = "";
var intTotalJsonNumber = 0;
var intFirstJsonContainNumber = 0;
var intStartJsonIndex = 0;
var intCurrentJsonIndex = 0;

var intCurrentPage = 0;
var intTotalPage = 0;
var lstPageData = [];
var intCurrentPagerIndex = 0;
var intCountPerJson = 50;

var isYearPaging = false;
var lstYearPageNumbers = [];
var intStartYear = (new Date()).getFullYear();
var intYearIndex = 0;

var options = {
	intCountPerPage: 50, // 每一頁呈現幾筆
	intCountPager:7, // 呈現幾個頁數選項, 3 表示 [<] [1] [2] [3] [>] or  [<] [4] [5] [6] [>] ...
	intCountYearPager: 5
}

$(document).ready(initPageList);

// 處理離開 Page List 的 back 事件
$(function ()
{
	var date = new Date();
    var time = date.getTime();

    if ($("#reloadValue").val().length === 0)
    {
        $("#reloadValue").val(time);
    }
    else
    {
        $("#reloadValue").val(time);
		intCurrentPage = 0;
		intCurrentPagerIndex = 0;
		lstPageData = [];
		//console.log("[pageList] on document ready / lstPageData:", lstPageData);
    }
});

// 處理沒有離開 Page List 的 back 事件
$(window).bind('hashchange', function() {
	/* things */
	var strJumpPageNumber = extractStrPageNumberFromCurrentUrl();
	if (strJumpPageNumber != "") {
		if (isYearPaging) {
			var intJumpPageNumber = parseInt(strJumpPageNumber), yidx;
			if (!isNaN(intJumpPageNumber) && 
				intJumpPageNumber != lstYearPageNumbers[intYearIndex] && 
				(yidx = lstYearPageNumbers.indexOf(intJumpPageNumber)) > 0) {
				changeYearList(yidx);
			}
		} else {
			if (parseInt(strJumpPageNumber) != intCurrentPage) {
				changeList(strJumpPageNumber);
			}
		}
	}
});

function extractStrPageNumberFromCurrentUrl() {
	var strCurrentUrl = window.location.href;
	var intLastIndexOfNumberSign = strCurrentUrl.lastIndexOf("#");
	var strReturnResult = "0";
	
	if (intLastIndexOfNumberSign >= 0) {
		strReturnResult = strCurrentUrl.slice(intLastIndexOfNumberSign+1, strCurrentUrl.length);
	}
	
	return strReturnResult;
}

function initPageList() {
	if (typeof strJsonPath === "undefined" || strJsonPath == "") {
		return;
	}

	isYearPaging = window.strPageNumbers && intCountPerJson == -1;
	
	extractFileName();	
	//return;
	
	if (isYearPaging) {
		lstYearPageNumbers = JSON.parse(strPageNumbers) || [];
		intStartYear = lstYearPageNumbers[0] || intStartYear;

		var strJumpPageNumber = extractStrPageNumberFromCurrentUrl();
		var intJumpPageNumber = parseInt(strJumpPageNumber);
		var intJumpYear = isNaN(intJumpPageNumber) ? intStartYear : 
			lstYearPageNumbers.indexOf(intJumpPageNumber) >= 0 ? intJumpPageNumber : intStartYear;
		intYearIndex = lstYearPageNumbers.indexOf(intJumpYear);
		loadYearJson(strJsonFileFolder + strJsonFileNamePrefix + "-" + intJumpYear + ".json");
	} else {
		intCurrentPage = 0;
		loadJson(strJsonPath, true);	
	}
}


function extractFileName () {
	var intLastIndexOfSlash = strJsonPath.lastIndexOf("/");
	var strJsonFileName = "";
	var intIndexOfMinus = 0;
	var intIndexOfDot = 0;
	
	if (intLastIndexOfSlash >= 0) {
		strJsonFileFolder = strJsonPath.slice(0, intLastIndexOfSlash+1);
		strJsonFileName = strJsonPath.slice(intLastIndexOfSlash+1, strJsonPath.length);
	} else {
		strJsonFileName = strJsonPath;
	}
	
	intIndexOfMinus = strJsonFileName.indexOf("-");
	intIndexOfDot = strJsonFileName.indexOf(".");
		
	if (intIndexOfMinus >= 0) {
		strJsonFileNamePrefix = strJsonFileName.slice(0, intIndexOfMinus);
		intTotalJsonNumber = parseInt(strJsonFileName.slice(intIndexOfMinus+1, intIndexOfDot))+1;
		intStartJsonIndex = intTotalJsonNumber-1;
		intCurrentJsonIndex = intTotalJsonNumber-1;
	} else {
		strJsonFileNamePrefix = strJsonFileName.slice(0, intIndexOfDot);
		intStartJsonIndex = 0;
		intCurrentJsonIndex = 0;
		intTotalJsonNumber = 1;
	}
	
	//console.log ("[pageList] extractFileName / strJsonFileFolder, strJsonFileName, strJsonFileNamePrefix, intTotalJsonNumber", strJsonFileFolder, strJsonFileName, strJsonFileNamePrefix, intTotalJsonNumber);
	//console.log("[pageList] extractFileName / intTotalJsonNumber, intStartJsonIndex, intCurrentJsonIndex", intTotalJsonNumber, intStartJsonIndex, intCurrentJsonIndex);
}

function loadJson(strFile, isInit) {
	HoldOn.open({
		theme:"sk-rect",//If not given or inexistent theme throws default theme sk-rect
		message: "<h4>Loading...</h4>",
		content:"Your HTML Content", // If theme is set to "custom", this property is available
									 // this will replace the theme by something customized.
		backgroundColor:"black",//Change the background color of holdon with javascript
							   // Keep in mind is necessary the .css file too.
		textColor:"white" // Change the font color of the message
	});
	
	if(isInit === undefined) { isInit = false; }
	
	$.getJSON(strFile, function(lstData) {
		if (isInit) {
			intFirstJsonContainNumber = lstData.length;
			var i = 1;
			intTotalPage = Math.ceil(((intTotalJsonNumber-1)*intCountPerJson + intFirstJsonContainNumber) / options.intCountPerPage);
			//console.log ((intTotalJsonNumber-1)*intCountPerJson + intFirstJsonContainNumber, intTotalPage);
		}
		onLoadJsonComplete(lstData);
		//console.log("[pageList] Load " + strJsonPath + " success!");
	})
	.fail(function() {
		//console.log("[pageList] Load " + strJsonPath + "] error!");
		HoldOn.close();
	})	
}

function loadYearJson(strFile) {
	HoldOn.open({
		theme:"sk-rect",//If not given or inexistent theme throws default theme sk-rect
		message: "<h4>Loading...</h4>",
		content:"Your HTML Content", // If theme is set to "custom", this property is available
									 // this will replace the theme by something customized.
		backgroundColor:"black",//Change the background color of holdon with javascript
							   // Keep in mind is necessary the .css file too.
		textColor:"white" // Change the font color of the message
	});

	$.getJSON(strFile, function(lstData){
		onLoadYearJsonComplete(lstData);
	})
	.fail(function() {
		//console.log("[pageList] Load " + strJsonPath + "] error!");
		HoldOn.close();
	});
}

function onLoadJsonComplete(lstData) {
	if (intStartJsonIndex != intCurrentJsonIndex) {
		// bigcookie: 不是第一個載入的 Json 檔案，所以直接 Merge 就可以
		//console.log("[pageList] onLoadJsonComplete / 不是第一個載入的 Json 檔案，所以直接 Merge");
		//console.log("[pageList] onLoadJsonComplete (intStartJsonIndex != intCurrentJsonIndex) / before merge lstPageData:", lstPageData);
		$.merge(lstPageData, lstData.reverse());
		//console.log("[pageList] onLoadJsonComplete (intStartJsonIndex != intCurrentJsonIndex) / after merge lstPageData:", lstPageData);
	} else {
		// bigcookie: 第一個載入的 Json 檔案，要計算開始的 index
		//console.log("[pageList] onLoadJsonComplete / 第一個載入的 Json 檔案，要計算開始的 index");
		var intCurrentJsonItemSum = caculateCurrentJsonItemSum ();
		//console.log("[pageList] onLoadJsonComplete / intCurrentPage, intCurrentJsonItemSum:", intCurrentPage, intCurrentJsonItemSum);
		//console.log("[pageList] onLoadJsonComplete / intCurrentPage * options.intCountPerPage:", intCurrentPage * options.intCountPerPage);
		var intStartSliceIndex = intCurrentPage * options.intCountPerPage - intCurrentJsonItemSum;
		//console.log("[pageList] onLoadJsonComplete / intStartSliceIndex:", intStartSliceIndex);
		//console.log("[pageList] onLoadJsonComplete (intStartJsonIndex == intCurrentJsonIndex) / before merge lstPageData:", lstPageData);
		$.merge(lstPageData, lstData.reverse().slice(intStartSliceIndex));
		//console.log("[pageList] onLoadJsonComplete (intStartJsonIndex == intCurrentJsonIndex) / after merge lstPageData:", lstPageData);
	}
	
	//console.log("[pageList] onLoadJsonComplete / isNeedLoadAnotherJsonFile, intCurrentJsonIndex:", isNeedLoadAnotherJsonFile(), intCurrentJsonIndex);
	if (isNeedLoadAnotherJsonFile() && intCurrentJsonIndex > 0) {
		intCurrentJsonIndex--;
		var strJsonFile = strJsonFileFolder + strJsonFileNamePrefix + ((intCurrentJsonIndex > 0) ? "-" + intCurrentJsonIndex : "") + ".json";
		//console.log("[pageList] onLoadJsonComplete / strJsonFile:", strJsonFile);
		
		loadJson(strJsonFile);
		return;
	}
	
	createList();
	var strJumpPageNumber = extractStrPageNumberFromCurrentUrl();
	if (strJumpPageNumber != "") {
		if (parseInt(strJumpPageNumber) != intCurrentPage) {
			changeList(strJumpPageNumber);
		}
	}
}

function onLoadYearJsonComplete(lstData) {
	$.merge(lstPageData, lstData.reverse());
	// kino: Make intcountperpage always greather than page data length in order to create full list.
	options.intCountPerPage = lstPageData.length + 1;
	createList();
}

function caculateCurrentJsonItemSum () {
	var intTotalJsonItemSum = 0;
	
	for (var i=intTotalJsonNumber-1; i>intStartJsonIndex; i--) {
		if (i == intTotalJsonNumber-1) {
			intTotalJsonItemSum += intFirstJsonContainNumber;
		} else {
			intTotalJsonItemSum += intCountPerJson;
		}
	}
	//console.log("[pageList] caculateCurrentJsonItemSum / intTotalJsonNumber, intStartJsonIndex:", intTotalJsonNumber, intStartJsonIndex);
	return intTotalJsonItemSum;
}

function isNeedLoadAnotherJsonFile() {
	//console.log("[pageList] isNeedLoadAnotherJsonFile / lstPageData.length, options.intCountPerPage:", lstPageData.length, options.intCountPerPage);
	if (lstPageData.length < options.intCountPerPage) {
		return true;
	}
	return false;
}

function getDisplayDateMethod() {
	var strDisplayDate = "PostDateAndModifyDate";
	if (intSecondMenuId != -1 || intMainMenuId != -1) {
		if (dicSetting.hasOwnProperty("dicCatDateDisplayType")) {
			if (dicSetting["dicCatDateDisplayType"].hasOwnProperty(intSecondMenuId.toString())) strDisplayDate = dicSetting["dicCatDateDisplayType"][intSecondMenuId.toString()];
			else if (dicSetting["dicCatDateDisplayType"].hasOwnProperty(intMainMenuId.toString())) strDisplayDate = dicSetting["dicCatDateDisplayType"][intMainMenuId.toString()];
		}
	}
	return strDisplayDate;
}

function createList() {
	var intEndIndex = (options.intCountPerPage > lstPageData.length) ? lstPageData.length : options.intCountPerPage;
	var strInnerHtml = "<hr class=\"page-list-top-hr\">";
	
	var strDisplayMethod = getDisplayDateMethod();

	function getListDateDisplay(item){
		if (strDisplayMethod == "OnlyModifyDate") return item.strModDate;
		else if (strDisplayMethod == "PostDateAndModifyDate" && item.strModDate) {
			return item.strDate + " (" + item.strModDate + ")";
		}
		return item.strDate;
	}
	
	for (var i=0; i<intEndIndex; i++) {
		strInnerHtml += "<div class=\"row page-list-column\">";
		strInnerHtml += "<div class=\"col-md-11 page-list-date\">" + getListDateDisplay(lstPageData[i]) + "</div>";
		strInnerHtml += "<div class=\"col-md-1\"></div>";
		strInnerHtml += "<div class=\"col-md-11\"><a href=\"" + lstPageData[i].strUrl + "\"" + " target=\"" + lstPageData[i].strTarget + "\"" + ">";
		strInnerHtml += lstPageData[i].strTitle + "</a></div>";
		strInnerHtml += "<div class=\"col-md-12\"><hr></div></div>";		
	}
	
	strInnerHtml += "<hr class=\"page-list-bottom-hr\">";
	
	$(".page_content").html(strInnerHtml);
	
	if (isYearPaging) {
		buildYearListPager();
	} else {
		buildListPager();
	}
	HoldOn.close();
	// force scroll to top
	$(window).scrollTop(0);
}

function buildListPager() {
	var intStartIndex = intCurrentPage;
	var intEndIndex = intCurrentPage;
		
	if (options.intCountPager - 1 > 0) {
		var intDivNumber = Math.floor((options.intCountPager - 1)/2);
		intStartIndex = (intCurrentPage - intDivNumber >= 0) ? (intCurrentPage - intDivNumber) : 0;
		intEndIndex = (intCurrentPage + intDivNumber < intTotalPage-1) ? (intCurrentPage + intDivNumber)+1 : intTotalPage;
		//console.log(intStartIndex, intEndIndex);
	}
		
	$(".albumPager").empty();
	var strInnerHtml = "<nav><ul class='pagination'>";

	// 是否加 [<<]
	if (intCurrentPage > 3) {
		strInnerHtml += "<li><a class='pager' data-id='<<' href='#" + (intCurrentPage-4) + "' aria-label='Previous'><span aria-hidden='true'>&laquo;</span></a></li>";
	}

	// 是否加 [<]
	if (intCurrentPage > 0) {
		strInnerHtml += "<li><a class='pager' data-id='<' href='#" + (intCurrentPage-1) + "' aria-label='Previous'><span aria-hidden='true'>&lsaquo;</span></a></li>";
	}
	
	for (var i = intStartIndex; i < intEndIndex; ++i) {
		if (intCurrentPage == i) {
			strInnerHtml += "<li class='active'><a class='pager' data-id='" + i + "' href='#" + i + "' >" + (i+1) + "</a></li>";
		} else {
			strInnerHtml += "<li><a class='pager' data-id='" + i + "' href='#" + i + "'>" + (i+1) + "</a></li>";
		}
	}
	// 是否加 [>]
	if (intCurrentPage < (intTotalPage - 1)) {
		strInnerHtml += "<li><a class='pager' data-id='>' href='#" + (intCurrentPage+1) + "' aria-label='Next'><span aria-hidden='true'>&rsaquo;</span></a></li>";
	}

	// 是否加 [>>]
	if (intCurrentPage < (intTotalPage - 4)) {
		strInnerHtml += "<li><a class='pager' data-id='>>' href='#" + (intCurrentPage+4) + "' aria-label='Next'><span aria-hidden='true'>&raquo;</span></a></li>";
	}
	
	strInnerHtml += "</ul></nav>"
	
	$(".albumPager").append(strInnerHtml);
	
	$(".pager").click(function(){
		changeList($(this).attr("data-id"));
	});
}

function buildYearListPager() {
	var intStartIndex = intYearIndex;
	var intEndIndex = intYearIndex;
		
	if (options.intCountYearPager - 1 > 0) {
		var intDivNumber = Math.floor((options.intCountYearPager - 1)/2);
		intStartIndex = (intYearIndex - intDivNumber >= 0) ? (intYearIndex - intDivNumber) : 0;
		intEndIndex = (intYearIndex + intDivNumber < lstYearPageNumbers.length-1) ? (intYearIndex + intDivNumber)+1 : lstYearPageNumbers.length;
	}

	$(".albumPager").empty();
	var strInnerHtml = "<nav><ul class='pagination'>";

	// 是否加 [<<]
	if (intYearIndex > 2) {
		strInnerHtml += "<li><a class='pager' data-id='<<' href='#" + lstYearPageNumbers[intYearIndex-3] + "' aria-label='Previous'><span aria-hidden='true'>&laquo;</span></a></li>";
	}

	// 是否加 [<]
	if (intYearIndex > 0) {
		strInnerHtml += "<li><a class='pager' data-id='<' href='#" + lstYearPageNumbers[intYearIndex-1] + "' aria-label='Previous'><span aria-hidden='true'>&lsaquo;</span></a></li>";
	}

	for (var i = intStartIndex; i < intEndIndex; ++i) {
		var intYear = lstYearPageNumbers[i];
		if (intYearIndex == i) {
			strInnerHtml += "<li class='active'><a class='pager' data-id='" + i + "' href='#" + intYear + "' >" + intYear + "</a></li>";
		} else {
			strInnerHtml += "<li><a class='pager' data-id='" + i + "' href='#" + intYear + "'>" + intYear + "</a></li>";
		}
	}

	// 是否加 [>]
	if (intYearIndex < lstYearPageNumbers.length - 1) {
		strInnerHtml += "<li><a class='pager' data-id='>' href='#" + lstYearPageNumbers[intYearIndex+1] + "' aria-label='Next'><span aria-hidden='true'>&rsaquo;</span></a></li>";
	}

	// 是否加 [>>]
	if (intYearIndex < lstYearPageNumbers.length - 3) {
		strInnerHtml += "<li><a class='pager' data-id='>>' href='#" + lstYearPageNumbers[intYearIndex+3] + "' aria-label='Next'><span aria-hidden='true'>&raquo;</span></a></li>";
	}

	strInnerHtml += "</ul></nav>"
	
	$(".albumPager").append(strInnerHtml);
	
	$(".pager").click(function(){
		changeYearList($(this).attr("data-id"));
	});
}

function changeList(data) {
	//	var intNewPage = data;
	//console.log(data);
	
	if (data == ">") {
		intCurrentPage = (intCurrentPage + 1 < intTotalPage) ? intCurrentPage + 1 : intTotalPage-1;
	} else if (data == "<") {
		intCurrentPage = (intCurrentPage - 1 > 0) ? intCurrentPage - 1 : 0;
	} else if (data == ">>") {
		intCurrentPage = (intCurrentPage + 5 < intTotalPage) ? intCurrentPage + 4 : intTotalPage-1;
	} else if (data == "<<") {
		intCurrentPage = (intCurrentPage - 4 > 0) ? intCurrentPage - 4 : 0;
	} else {
		intCurrentPage = parseInt(data);
	}
	
	//intCurrentPage = intNewPage;
	lstPageData = [];
	
	setStartJsonIndex();
	var strJsonFile = strJsonFileFolder + strJsonFileNamePrefix + ((intCurrentJsonIndex > 0) ? "-" + intCurrentJsonIndex : "") + ".json";
	//console.log("[pageList] changeList / strJsonFile:", strJsonFile);
	loadJson(strJsonFile);
}

function changeYearList(data){
	if (data == ">") {
		intYearIndex = (intYearIndex + 1 < lstYearPageNumbers.length) ? intYearIndex + 1 : lstYearPageNumbers.length-1;
	} else if (data == "<") {
		intYearIndex = (intYearIndex - 1 > 0) ? intYearIndex - 1 : 0;
	} else if (data == ">>") {
		intYearIndex = (intYearIndex + 4 < lstYearPageNumbers.length) ? intYearIndex + 3 : lstYearPageNumbers.length-1;
	} else if (data == "<<") {
		intYearIndex = (intYearIndex - 3 > 0) ? intYearIndex - 3 : 0;
	} else {
		intYearIndex = parseInt(data);
	}

	// reset
	lstPageData = [];

	loadYearJson(strJsonFileFolder + strJsonFileNamePrefix + "-" + lstYearPageNumbers[intYearIndex] + ".json")
}

function setStartJsonIndex() {
	for (var i=0; i<intTotalJsonNumber; i++) {
		if ((i * intCountPerJson + intFirstJsonContainNumber) > intCurrentPage*options.intCountPerPage) {
			intStartJsonIndex = intTotalJsonNumber - i - 1;
			intCurrentJsonIndex = intTotalJsonNumber - i - 1;
			//console.log("[pageList] setStartJsonIndex / intStartJsonIndex, intCurrentJsonIndex:", intStartJsonIndex, intCurrentJsonIndex);
			break;
		}
	}
}
