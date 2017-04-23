$(function(){
	var mapModel = {
		init: function(){
			var screenW = $(document).width();
			var screenH = $(document).height();
			$('#container').css({
				width: screenW,
				height: screenH
			});
			this.initMap();
			this.initData();
			this.bindEvent();
		},

		initMap: function(){
			var map = new BMap.Map("container");          // 创建地图实例  
			map.centerAndZoom("上海", 15);
			//向地图中添加缩放控件
			map.addControl(new BMap.NavigationControl({anchor:BMAP_ANCHOR_TOP_LEFT,type:BMAP_NAVIGATION_CONTROL_ZOOM}));
			map.addControl(new BMap.MapTypeControl());   //添加地图类型控件
			map.enableScrollWheelZoom();   //开启鼠标滚轮缩放
			map.enableContinuousZoom();
			map.enablePinchToZoom();
			window.map = map;
		},

		initData: function(){
			$.get('/users/ajax/getMapData',function(data){
				if(data.success){
					if(data.data.length){
						for(var i=0,len=data.data.length;i<len;i++){
							(function(arg){
								var point = new BMap.Point(data.data[i].lng,data.data[i].lat);
								var myIcon = new BMap.Icon("../images/house.png",new BMap.Size(30,30),{});
								var marker = new BMap.Marker(point,{icon:myIcon});
								var _id = data.data[i].id;
								var _img = data.data[i].img;
								map.addOverlay(marker);
								marker.addEventListener("click", function(){    
									/*点击房屋图标后弹出的信息框*/
									var opts = {
									  	width : 200,    
									  	height: 200,      
									  	enableMessage:true,
									}
									var infoWindow = new BMap.InfoWindow('<a href="/itemInfo?id='+_id+'"><img class="infoImg" title="点击访问" src="'+_img+'"></img></a>', opts);       
									map.openInfoWindow(infoWindow,point); //开启信息窗口
								});
							})(i);
						}
					}
				}
			})
		},

		bindEvent: function(){
			$('#switchNormal').on('click',function(){
				window.location.href = '/searchList';
			})
		},
	};

	mapModel.init();
})