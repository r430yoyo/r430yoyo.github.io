var strOtherOverSeaOfficesUrl = "http://www.roc-taiwan.org/portalOfDiplomaticMission_tc.html";
//var strOtherOverSeaOfficesUrl = "http://www.taiwanembassy.org/dept.asp?mp=2&codemeta=locationIDE";

function createOfficeMenu() {
	if (typeof lstOffice === "undefined") {
		return;
	}
	var strLocationPathname = location.pathname;
	var lstResult = strLocationPathname.split("/");
	
	if (lstResult.length <= 0) {
		strOtherOverSeaOfficesUrl = "http://www.roc-taiwan.org/portalOfDiplomaticMission_en.html";
		//strOtherOverSeaOfficesUrl = "http://www.taiwanembassy.org/dept.asp?mp=1&codemeta=locationIDE";
	} else {
		var strCountryCode = lstResult[1];
		if (strCountryCode.indexOf("_") >= 1) {
			strOtherOverSeaOfficesUrl = "http://www.roc-taiwan.org/portalOfDiplomaticMission_en.html";
			//strOtherOverSeaOfficesUrl = "http://www.taiwanembassy.org/dept.asp?mp=1&codemeta=locationIDE";
		}
	}
	
	if (lstOffice.length == 1) {
		$(".dropup ul").removeClass("dropdown-menu");	
	
		$("#dropdownMenu1").click(function(ev) {
			if (lstOffice.length == 1) {
				window.open(strOtherOverSeaOfficesUrl, '_blank');
			}
		});
		
		return;
	}
	
	var strInnerHTML = "";
	for (var i=0; i<lstOffice.length; i++) {
		if (i == lstOffice.length-1 && lstOffice.length != 1) {
			strInnerHTML += "<li role=\"separator\" class=\"divider\"></li>";
		}
		if (i == lstOffice.length-1) {
			//console.log("i == lstOffice.length-1", i, lstOffice.length);
			strInnerHTML += "<li><a target=\"_blank\" href=\"" + strOtherOverSeaOfficesUrl + "\">" + lstOffice[i].strName + "</a></li>";
			//console.log(strOtherOverSeaOfficesUrl);
		} else {
			strInnerHTML += "<li><a target=\"_blank\" href=\"" + lstOffice[i].strPath + "index.html" + "\">" + lstOffice[i].strName + "</a></li>";
		}
	}
	//console.log(strInnerHTML);
	$("#officeDropdown").html(strInnerHTML);
}
