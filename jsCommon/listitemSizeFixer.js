
window.addEventListener("DOMContentLoaded", function(event) {
	if (strCurrentScreenMode == "Desktop") {
		var allContactItems = document.querySelectorAll(".list-row .contact .contact-column");

		var groups = [];
		var groupCount = 4;
		for(var i = 0, len = allContactItems.length, loop = Math.ceil(len / groupCount); i < loop ; i++ ){
			var idx = i * groupCount;
			groups.push( Array.prototype.slice.call(allContactItems, idx, idx + groupCount) );
		} 

		groups.forEach(function(group){
			var maxHeight = group.reduce(function(res, next){ return Math.max(res, $(next).height()); }, 0);
			$(group).height(maxHeight);
		});
	}
});
