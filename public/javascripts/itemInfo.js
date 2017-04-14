$(function(){
	var itemInfo = {

		id: location.href.split('?id=').pop(),

		userId: window.localStorage.getItem('userId') ? window.localStorage.getItem('userId') : '',

		init: function(){
			this.initData();
			this.bindEvent();
		},

		initData: function(){
			var own = this;
			$.get('/users/ajax/getItemInfo?id='+this.id,function(data){
				if(data.success){
					new Vue({
						el: '#content',
						data: {
							dataMap: data.data[0],
						},
						methods: {

						}
					})
				}
			})

			if(!!own.userId){
				$.get('/users/ajax/isCollect?userId='+own.userId+'&itemId='+own.id,function(data){
					if(data.success){
						if(data.data){
							$('.collectbtn').removeClass('collect').addClass('collected');
						}else{
							$('.collectbtn').removeClass('collected').addClass('collect');
						}
					}
				})
			}else{
				$('.collectbtn').removeClass('collected').addClass('collect');
			}
		},

		bindEvent: function(){
			var own = this;
			$('body').delegate('.collectbtn','click', function(){
				var _this = $(this);
				if(!!!own.userId){
					window.location.href = '/login?fallback=itemInfo?id='+own.id;
				}else{
					$.get('/users/ajax/addCollect?userId='+own.userId+'&itemId='+own.id,function(data){
						if(data.success){
							alert(data.message);
							if(_this.hasClass('collected')){
								$('.collectbtn').removeClass('collected').addClass('collect');
							}else if(_this.hasClass('collect')){
								$('.collectbtn').removeClass('collect').addClass('collected');
							}
						}
					})
				}

			})
		}
	};

	itemInfo.init();
})