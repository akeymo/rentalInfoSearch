$(function(){
	var dataMapObj = {

		area: 'all',

		init: function(){
			this.initData();
			this.bindEvent();
		},

		initData: function(){
			var own = this;
			$.get('/users/ajax/getDataMapPrice?bigArea='+own.area, function(data){
				// 最高价，最低价，平均价
				if(data.success){
					if(data.data.length){

					}
				}
			})
		},

		bindEvent: function(){
			var own = this;
		}
	};

	dataMapObj.init();
})