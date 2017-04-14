$(function(){
	var personal = {

		userId: window.localStorage.getItem('userId') ? window.localStorage.getItem('userId') : window.location.href = '/login',

		init: function(){
			this.initData();
			this.bindEvent();
		},

		initData: function(){
			var own = this;
			$.get('/users/ajax/getCollectList?userId='+own.userId, function(data){
				if(data.success){
					if(data.data.length){
						new Vue({
							el: '#item-wrap',
							data: {
								dataMap: data.data,
							},
						})
					}
				}
			})
		},

		bindEvent: function(){
			var own = this;
			$('#logoff').on('click',function(){
				if(own.userId){
					window.localStorage.removeItem('userId');
					window.location.href = '/';
				}
			})
		},
	};

	personal.init();
})