$(function(){
	var searchList = {

		city: $.getUrlParam('city'),
		pagination: '',
		bigArea: '',
		smallArea: '',
		lowPrice: '',
		upPrice: '',
		roomType: '',
		myVue: new Vue({
			el: '#item-wrap',
			data:{
				dataMap: []
			},
		}),

		init: function(){ 
			this.bindEvent();
			this.initList();
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
					own.bigArea = '';
					own.smallArea = '';
					own.initList();
					$(document).click();
				}
				$('#regionlist li').removeClass('li-cur');
				$(this).addClass('li-cur');
				$('.blockinfo').hide();
				$('#blockinfo-'+target).show();
				e.stopPropagation();
			})

			$('.blockinfo li').on('click',function(e){
				var target = $(this).text();
				$('#chooseArea').text(target);
				if(target == '全部'){
					own.bigArea = '';
					own.smallArea = '';
					$('#chooseArea').text('区域');
				}else{
					own.bigArea = $('#regionlist li.cur').text();
					own.smallArea = target;
				}
				own.initList();
				$(document).click();
				e.stopPropagation();
			})

			$('.priceinfo li').on('click', function(e){
				var target = $(this).text();
				var targetUp = $(this).attr('data-upPrice');
				var tartgetLow = $(this).attr('data-lowPrice');
				if(targetUp=='0' && tartgetLow=='0'){
					own.upPrice = '';
					own.lowPrice = '';
					$('#choosePrice').text('价格');
				}else{
					own.upPrice = targetUp;
					own.lowPrice = tartgetLow;
					$('#choosePrice').text(target);
				}
				own.initList();
				$(document).click();
				e.stopPropagation();
			})

			$('.houseinfo li').on('click', function(e){
				var target = $(this).text();
				var targetNum = $(this).attr('data-houseType');
				if(targetNum == 0){
					own.roomType = '';
					$('#chooseRoomType').text('房型');
				}else{
					own.roomType = targetNum;
					$('#chooseRoomType').text(target);
				}
				own.initList();
				$(document).click();
				e.stopPropagation();
			})
		},

		initData: function(o){
			var own = this;
			$.get('/users/ajax/getItemList?pageStart='+o.currentPage+'&pageSize='+o.pageSize+'&bigArea='+own.bigArea+'&smallArea='+own.smallArea+'&upPrice='+own.upPrice+'&lowPrice='+own.lowPrice+'&roomType='+own.roomType, function(data){
				if(data.success){
					if(o.currentPage == 1){
						own.myVue.dataMap = [];
					}
					own.myVue.dataMap = own.myVue.dataMap.concat(data.data);
					var total = data.data && data.data.length;
                    if (total && total == 10) {
                        o.callbackFn(true);
                    } else {
                        o.callbackFn(false);
                    }
				}
			})
		},

		initList: function() {
            var own = this;

            if (this.pagination) {
                this.pagination.destory();
            }
            this.pagination = new ScrollOrderPagination({
                data: {
                    currentPage: 1,
                    pageSize: 10,
                },
                scrollEl: $(document),
                height: $(window).height(),
                load: $('.loading-tip'),
                nextPage: function (o) {
                    own.initData(o);
                }
            });

        },
	}

	searchList.init();
})