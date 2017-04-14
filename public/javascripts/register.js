$(function(){
	var register = {
		init: function(){
			this.bindEvent();
		},

		bindEvent: function(){
			$('#register').on('click',function(){
				var username = $('#username').val();
				var password = $('#password').val();
				if(!!!username){
					alert("请输入用户名！");
					return;
				}
				if(!!!password){
					alert("请输入密码！");
					return;
				}
				password = $.md5(password);
				$.get('users/ajax/register?username='+username+'&password='+password,function(data){
					if(data.success){
						window.location.href = '/login';
					}else{
						alert("注册失败！");
					}
				})
			})
		}
	};

	register.init();
})