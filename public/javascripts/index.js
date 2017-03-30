$(function(){
	var home = {

		location: sessionStorage.getItem('userLocation') ? sessionStorage.getItem('userLocation') : $.getWapLocation(),
		cityMap: {
			'上海市': 'shanghai',
			'武汉市': 'wuhan',
		},

		init: function(){
			$('#curLocation').text(this.location);
			this.bindEvent();
		},

		bindEvent: function(){
			var own = this;
			$('#searchBtn').on('click',function(){
				var curCity;
				if($('#cityList option:selected').val() == 0){
					curCity = $('#curLocation').text();
				}else{
					curCity = $('#cityList option:selected').text()
				}
				window.location.href = '/searchList?city='+own.cityMap[curCity];
			})
		}
	}

	home.init();
})