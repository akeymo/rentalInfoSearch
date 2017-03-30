$(function(){
	var searchList = {

		city: $.getUrlParam('city'),

		init: function(){ 
			this.bindEvent();
		},

		bindEvent: function(){
			$(document).on('click',function(){
				$('.fade').hide();
				$('#optionList').hide();
				$('.list-info-wrap').hide();
			})

			$('.choose-panel li').on('click',function(e){
				var target = $(this).attr('data-type');
				$('.list-info-wrap').hide();
				$('.fade').show();
				$('#optionList').show();
				$('#'+target).show();
				e.stopPropagation();
			})

			$('#regionlist li').on('click',function(e){
				var target = $(this).attr('data-type');
				$('#regionlist li').removeClass('li-cur');
				$(this).addClass('li-cur');
				$('.blockinfo').hide();
				$('#blockinfo-'+target).show();
				e.stopPropagation();
			})
		},
	}

	searchList.init();
})