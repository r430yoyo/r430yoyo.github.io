
(function(scope){

	function MapMgr(){}

	var _map = null;
	var _infoWindow = null;
	var _markers = [];
	var _bounds = null;
	var _disabled = false;

	MapMgr.init = function(){
		if(_disabled) return;
		_map = new google.maps.Map(document.getElementById("map-content"), {
			center: {lat: 23.6978, lng: 120.9605},
			zoom: 3
		});
		_map.setOptions({ minZoom: 3, maxZoom: 5, scrollwheel: false});
		// _bounds = new google.maps.LatLngBounds();
		_infoWindow = new google.maps.InfoWindow();
		_bounds = new google.maps.LatLngBounds();
		_markers = [];
	};

	MapMgr.clearMarkers = function(){
		if(_disabled) return;
		(_markers || []).forEach(function(item){ item.setMap(null); });
		_bounds = null;
		_markers = [];
		_infoWindow = null;
	};

	MapMgr.addInfo = function(content, position){
		if(_disabled) return;
		if(!_infoWindow) _infoWindow = new google.maps.InfoWindow();
		if(!_bounds) _bounds = new google.maps.LatLngBounds();

		var marker = new google.maps.Marker({
			map: _map,
			position: new google.maps.LatLng(parseFloat(position.lat), parseFloat(position.lng))
			// icon: icon.icon,	// image
			// shadow: icon.shadow	// image
		});

		google.maps.event.addListener(marker, 'click', (function(html, mark) {
			return function() {
				_infoWindow.setContent(html); 
				_infoWindow.open(_map, mark);
			}
		})(content, marker));

		_markers.push(marker);
		_bounds.extend(marker.getPosition());
	};

	MapMgr.fitBounds = function(){
		if(_disabled) return;
		if(_bounds) _map.fitBounds(_bounds);
	};

	MapMgr.disable = function(toDisable){
		if(toDisable !== false){
			var dom = document.getElementById("map-content");
			if(dom) $(dom).remove();
			this.clearMarkers();
			_map = null;
			_disabled = true;
		}else{
			_disabled = false;
			var dom = document.getElementById("map-content");
			if(!dom) $(".map-wrap").append('<div id="map-content"></div>');
			this.init();
		}
	}

	scope.MapMgr = MapMgr;

})(window);
