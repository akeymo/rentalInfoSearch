$(function(){
	var searchList = {

		city: $.getUrlParam('city'),

		init: function(){ 
			this.bindEvent();
			this.initData();
		},

		bindEvent: function(){
			var own = this;
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
				if(target == 'region-all'){

				}
				$('#regionlist li').removeClass('li-cur');
				$(this).addClass('li-cur');
				$('.blockinfo').hide();
				$('#blockinfo-'+target).show();
				e.stopPropagation();
			})
		},

		initData: function(options){
			var bigArea,smallArea,lowPrice,upPrice,roomType;
			if(options && options.bigArea){
				bigArea = options.bigArea
			}
			if(options && options.smallArea){
				smallArea = options.smallArea
			}
			if(options && options.lowPrice){
				lowPrice = options.lowPrice
			}
			if(options && options.upPrice){
				upPrice = options.upPrice
			}
			if(options && options.roomType){
				roomType = options.roomType
			}
			$.get('/users/ajax/getItemList?pageStart=1&pageSize=10',function(data){
				if(data.success){
					new Vue({
						el: '#item-wrap',
						data: {
							dataMap: data.data,
						},
						methods: {

						}
					})
				}
			})
		}
	}

	searchList.init();
})