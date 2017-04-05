$(function(){
	var itemInfo = {

		id: location.href.split('?id=').pop(),

		init: function(){
			this.initData();
		},

		initData: function(){
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
		}
	};

	itemInfo.init();
})