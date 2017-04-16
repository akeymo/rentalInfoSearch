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

			// 长按删除
			var timeOutEvent=0;
			$('body').delegate('.itemPro', 'touchstart', function() {
				var _this = $(this);
				var itemId = $(this).find('a').attr('data-id');
				timeOutEvent = setTimeout(function(){
					timeOutEvent = 0;   
	    			var checkRemove = confirm('确定要删除收藏吗？');
	    			if(checkRemove){
	    				$.get('/users/ajax/removeCollect?userId='+own.userId+'&itemId='+itemId,function(data){
	    					if(data.success){
	    						_this.remove();
	    					}else{
	    						alert(data.message);
	    					}
	    				})
	    			}
				},500);  
			});
			$('body').delegate('.itemPro', 'touchmove', function(e) {
				clearTimeout(timeOutEvent);   
		        timeOutEvent = 0;   
		        e.preventDefault();    
			});
			$('body').delegate('.itemPro', 'touchend', function() {
				clearTimeout(timeOutEvent);    
			});
		},
	};

	personal.init();
})