var lstIntRowIndexNotHide = [0, 1];
var intNumOfMainMenuRows = 2;
var intIndexOfSecondMenu = -1;
var isCenterMenuShow = false;
var intNumColumnOfRowForSecMenu = 4;
var isMenuShowing = false;
var isSecondMenuShow = false;

function createMenu() {
	intNumOfMainMenuRows = Math.ceil(lstMainMenu.length / 3);
	if (strCurrentScreenMode == "Mobile") {
		checkRowInitialToShow();
		createMobileMenu();
		if (isCurrentPageIsHome) {
			//createMobileMenu();
		} else {
			//createMobileSecondMenu();
		}
	} else {
		createDesktopMenu();
	}
}

function createMobileMenu() {
	$(".mobile-menu-toggle").click(showMenu);
	//return;
	$(".center-menu").removeClass("container-fluid");
	var intIndexOfMainMenuId = -1;
	var strInnerHtml = "<div class=\"col-md-1 top-column close-menu-toggle\"><span class=\"glyphicon glyphicon-remove\" aria-hidden=\"true\"></span></div>";
	strInnerHtml += "<div class=\"col-md-12 search-area\"><form action=\"" + relatedPathFromHome + "search/\">";
//  strInnerHtml += "<label for=\"usr\"></label>";
	strInnerHtml += "<input type=\"text\" class=\"search-box\" name=\"query\" id=\"usr\" placeholder=\"搜尋\"><input type=\"Submit\" value=\"搜尋\" class=\"submit-button\" alt=\"Submit\" width=\"19\" height=\"19\" align=\"top\">";
	strInnerHtml += "</form></div>";

	for (var i=0; i<lstMainMenu.length; i++) {
		strInnerHtml += "<div class=\"col-md-12 menu-column";
		if (lstSecondMenu[i] && lstSecondMenu[i].length > 0) {
			strInnerHtml += "\"><div class=\"row\"><div class=\"menu-with-submenu";
			
			if (lstMainMenu[i].id == intMainMenuId) {
				intIndexOfMainMenuId = i;
				strInnerHtml += " menu-column-selected";
			}
			
			strInnerHtml += "\"><a href=\"" + lstMainMenu[i].url + "\"" + ((lstMainMenu[i].external) ? (" target=\"_blank\"") : ("")) + ">";
			strInnerHtml += lstMainMenu[i].strName;
			strInnerHtml += "</a></div>";
			strInnerHtml += "<div class=\"submenu-toggle\" data-id=\"" + "submenu" + i + "\"" + " id=\"" + "submenu" + i + "-toggle\">";
			strInnerHtml += "<span class=\"glyphicon glyphicon-chevron-down\" aria-hidden=\"true\"></span></div></div></div>"
			if (lstSecondMenu[i].length > 0) strInnerHtml = createMobileSecondMenu(i, strInnerHtml);
		} else {
			if (lstMainMenu[i].id == intMainMenuId) strInnerHtml += " menu-column-selected";
			strInnerHtml += "\"><a href=\"" + lstMainMenu[i].url + "\"" + ((lstMainMenu[i].external) ? (" target=\"_blank\"") : ("")) + ">";
			strInnerHtml += lstMainMenu[i].strName;
			strInnerHtml += "</a></div>";
		}
	}
	//console.log("[menuView] createMobileMenu: ", strInnerHtml);
	document.getElementById("centerMenu").innerHTML = strInnerHtml;
	$(".center-menu .search-box").attr("placeholder", strSearchKeyworkLabel);
	$(".center-menu .submit-button").attr("value", strSearchLabel);
	$(".submenu-toggle").click(function(){
		openSubmenu($(this).attr("data-id"));
	});
	if (intIndexOfMainMenuId != -1) {
		openSubmenu("submenu" + intIndexOfMainMenuId);
	}
	$(".close-menu-toggle").click(hideMenu);
}

function createMobileSecondMenu(intIndex, strInnerHtml) {
	//console.log("[menuView] createMobileSecondMenu / intIndex, strInnerHtml: ", intIndex, strInnerHtml);
	strInnerHtml += "<div class=\"submenu\" id=\"submenu" + intIndex + "\">";
	for (var i=0; i<lstSecondMenu[intIndex].length; i++) {
		strInnerHtml += "<div class=\"col-md-12 menu-column second-menu-column";
		if (lstSecondMenu[intIndex][i].id == intSecondMenuId) strInnerHtml += " menu-column-selected";
		strInnerHtml += "\"><a href=\"" + lstSecondMenu[intIndex][i].url + "\"" + ((lstSecondMenu[intIndex][i].external) ? (" target=\"_blank\"") : ("")) + ">";
		strInnerHtml += "- " + lstSecondMenu[intIndex][i].strName;
		strInnerHtml += "</a></div>";
	}
	strInnerHtml += "</div>";
	
	return strInnerHtml;	
}

function openSubmenu(submenuId) {
	if ($('#' + submenuId).is(':hidden')) {
		$('#' + submenuId + '-toggle > span').removeClass("glyphicon-chevron-down");
		$('#' + submenuId + '-toggle > span').addClass("glyphicon-chevron-up");
		$('#' + submenuId).show();
		//$('#' + submenuId).slideDown("slow");
		
	} else {
		$('#' + submenuId + '-toggle > span').removeClass("glyphicon-chevron-up");
		$('#' + submenuId + '-toggle > span').addClass("glyphicon-chevron-down");
		$('#' + submenuId).hide();
		//$('#' + submenuId).slideUp("slow");
	}
}

function createDesktopMenu() {
	//return;
	$(".center-menu").addClass("container-fluid");
	$(".center-menu").show();
	$("#menuToggle").attr("width", 54);
	$("#menuToggle").attr("height", 24);
	setMenuToggleSrcOpen();
	
	checkRowInitialToShow();
	
	if (!isCurrentPageIsHome) {
		$(".center-menu").css("min-height", "0px");	
	}

	var strInnerHtml = "";

	for (i=0; i<intNumOfMainMenuRows; i++) {
		strInnerHtml += "<div class=\"row\" style=\"display:none;\">";
		
		for (j=0; j<3; j++) {
			var isSelectedMenu = false;
			if ((i*3+j) > lstMainMenu.length-1) {
				strInnerHtml += "<div class=\"col-sm-4 col-md-4 menu-column\"></div>";
			} else {
				if (lstMainMenu[i*3+j].id == intMainMenuId) isSelectedMenu = true;
				strInnerHtml += "<div class=\"col-sm-4 col-md-4 menu-column";
				if (isSelectedMenu) strInnerHtml += " menu-column-selected";
				strInnerHtml += "\"><a href=\"" + lstMainMenu[i*3+j].url + "\"" + ((lstMainMenu[i*3+j].external) ? (" target=\"_blank\"") : ("")) + ">";
				strInnerHtml += lstMainMenu[i*3+j].strName;
				strInnerHtml += "</a></div>";
			}
		}
		
		strInnerHtml += "</div>"
	}
	
	strInnerHtml += "<div class=\"row\"";
	if (!isCurrentPageIsHome) strInnerHtml += " style=\"display:none;\"";
	strInnerHtml += "><div class=\"col-md-12 menu-column\"></div></div>";	
	document.getElementById("centerMenu").innerHTML = strInnerHtml;
	
	if (isCurrentPageIsHome) firstTimeShowColumn();
	
	$(".toggle-container").click(showHideMenu);
	bindEventToToggle();
	
	createSecondMenu();
}

function bindEventToToggle() {
	$(".toggle-container").mouseenter(goShowMenu);
}

function unbindEventFromToggle() {
	$(".toggle-container").unbind("mouseenter");
}

function checkRowInitialToShow() {
	if (intMainMenuId == -1) {
		lstIntRowIndexNotHide[0] = 0;
		if (intNumOfMainMenuRows > 1) lstIntRowIndexNotHide[1] = 1;
	} else {
		for (i=0; i<lstMainMenu.length; i++) {
			if (lstMainMenu[i].id == intMainMenuId) {
				var intCurrentRow = Math.floor(i/3);
				lstIntRowIndexNotHide[0] = intCurrentRow;
				if ((intNumOfMainMenuRows) > (intCurrentRow + 1) ) {
					lstIntRowIndexNotHide[1] = intCurrentRow + 1;
				} else {
					if (intCurrentRow != 0)	lstIntRowIndexNotHide[1] = intCurrentRow - 1;
				}
				intIndexOfSecondMenu = i;
			}
		}
	}
}

function createSecondMenu() {
	$(".second-menu-bg").show();
	var strInnerHtml = "";
	var strColDivClassName = "col-sm-4" + " col-md-" + String(12/intNumColumnOfRowForSecMenu);
	
	if (intMainMenuId == -1 || lstSecondMenu[intIndexOfSecondMenu] == null || lstSecondMenu[intIndexOfSecondMenu].length <= 0) {
		strInnerHtml += "";
		$(".second-menu-bg").css("border", "none");
		$(".second-menu-bg").css("background-color", "transparent");
		$(".second-menu-bg").css("background", "none");
	} else {
		var intNumOfSecondMenuRows = Math.ceil(lstSecondMenu[intIndexOfSecondMenu].length / intNumColumnOfRowForSecMenu);
		for (i=0; i<intNumOfSecondMenuRows; i++) {
			strInnerHtml += "<div class=\"col-md-12 second-menu\">";
			for (j=0; j<intNumColumnOfRowForSecMenu; j++) {
				var isSelectedMenu = false;
				if ((i*intNumColumnOfRowForSecMenu+j) > lstSecondMenu[intIndexOfSecondMenu].length-1) {
					strInnerHtml += "<div class=\"" + strColDivClassName + " second-menu-column\"></div>";
				} else {
					strInnerHtml += "<div class=\"" + strColDivClassName;
					if (lstSecondMenu[intIndexOfSecondMenu][i*intNumColumnOfRowForSecMenu+j].id == intSecondMenuId) isSelectedMenu = true;
					if (isSelectedMenu) strInnerHtml += " second-menu-column-selected";
					else strInnerHtml += " second-menu-column";
					strInnerHtml += "\"><a href=\"" + lstSecondMenu[intIndexOfSecondMenu][i*intNumColumnOfRowForSecMenu+j].url + "\"" + ((lstSecondMenu[intIndexOfSecondMenu][i*intNumColumnOfRowForSecMenu+j].external) ? (" target=\"_blank\"") : ("")) + ">";
					strInnerHtml += lstSecondMenu[intIndexOfSecondMenu][i*intNumColumnOfRowForSecMenu+j].strName;
					strInnerHtml += "</a></div>";
				}
			}
			
			strInnerHtml += "</div>"
		}
		document.getElementById("secondMenu").innerHTML = strInnerHtml;
	}
	
}

function setMenuToggleSrcOpen() {
	$("#menuToggleOpenUp").show();
	$("#menuToggleOpenDown").show();
	$("#menuToggleClose").hide();
}

function setMenuToggleSrcClose() {
	$("#menuToggleOpenUp").hide();
	$("#menuToggleOpenDown").hide();
	$("#menuToggleClose").show();
}

function showHideMenu(ev) {
	if (isCenterMenuShow) {
		goHideMenu();
	} else {
		goShowMenu();
	}
}

function showHideSecondMenu() {
	if (isSecondMenuShow) {
		hideMenu();
	} else {
		showMenu();
	}
	isSecondMenuShow = !isSecondMenuShow;
}

function goHideMenu() {
	unbindEventFromToggle();
	isCenterMenuShow = false;
	hideMenu();
	setMenuToggleSrcOpen();
}

function goShowMenu() {
	unbindEventFromToggle();
	isCenterMenuShow = true;
	showMenu()
	setMenuToggleSrcClose();
}

function firstTimeShowColumn() {
	$( "#centerMenu > .row" )
		.filter(function(index) {return (lstIntRowIndexNotHide.indexOf(index) >= 0)})
		.fadeIn(700);
}

function showMenu() {
	if (strCurrentScreenMode == "Mobile") {
		$(".center-menu").show("slide", { direction: "right" }, 500, completeShowMenu);
		/*
		if (isCurrentPageIsHome) {
			$(".center-menu").show("slide", { direction: "right" }, 500, completeShowMenu);
		} else {
			$( ".second-menu-bg" ).slideDown(500);
		}
		*/
	} else {
		$( "#centerMenu > .row" ).slideDown(700, bindEventToToggle);
	}
}

function completeShowMenu() {
	$("body").addClass("stop-scroll");
	console.log("[menuView] completeShowMenu / menu width:", $(".center-menu").outerWidth());
}

function hideMenu() {
	if (strCurrentScreenMode == "Mobile") {
		$("body").removeClass("stop-scroll");
		$(".center-menu").hide("slide", { direction: "right" }, 500);
		/*
		if (isCurrentPageIsHome) {
			$("body").removeClass("stop-scroll");
			$(".center-menu").hide("slide", { direction: "right" }, 500);
		} else {
			$( ".second-menu-bg" ).slideUp(500);
		}
		*/
	} else {
		$( "#centerMenu > .row" )
			.filter(function(index) {return (!isCurrentPageIsHome || (lstIntRowIndexNotHide.indexOf(index) < 0 && index != intNumOfMainMenuRows))})
			.slideUp(700, bindEventToToggle);
	}
}

function menuReinitiateWhenResize() {
	isCenterMenuShow = false;
	isMenuShowing = false;
	isSecondMenuShow = false;
	$(".mobile-menu-toggle").unbind("click");
	$(".close-menu-toggle").unbind("click");
	$(".toggle-container").unbind("click");
	$(".toggle-container").unbind("mouseenter");
	createMenu();
}
