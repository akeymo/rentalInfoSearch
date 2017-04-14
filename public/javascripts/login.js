$(function(){
	var login = {

		backpage: $.getUrlParam('fallback') ? $.getUrlParam('fallback') : 'personal',

		init: function(){
			this.bindEvent();
		},

		bindEvent: function(){
			var own = this;
			$('#register').on('click',function(){
				window.location.href = '/register';
			})

			$('#submit').on('click',function(){
				var username = $('#username').val();
				var password = $('#password').val();
				if(!!!username){
					alert('请输入用户名！');
					return;
				}
				if(!!!password){
					alert('请输入密码！');
					return;
				}
				password = $.md5(password);
				$.get('/users/ajax/login?username='+username+'&password='+password,function(data){
					if(data.success){
						window.localStorage.setItem('userId',data.data[0].userId);
						window.location.href = '/' + own.backpage;
					}else{
						alert("登录失败！");
						return;
					}
				})
			})
		},
	};

	login.init();
})