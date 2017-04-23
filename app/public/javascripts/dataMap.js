$(function(){
	var dataMapObj = {

		priceArea: 'all',
		priceScatterArea: 'all',

		init: function(){
			this.initPie();
			this.initPriceData();
			this.initPricescatter();
			this.bindEvent();
		},

		initPie: function(){
			$.get('/users/ajax/getPieData', function(data){
				// 饼状图
				if(data.success){
					if(data.data.length){
						var myChart = echarts.init(document.getElementById('pieChart'));
						var option = {
							tooltip: {
						        trigger: 'item',
						        formatter: "{a} <br/>{b}: {c} ({d}%)"
						    },

						    legend: {
						        orient: 'vertical',
						        x: 'left',
						        // data:['南汇','卢湾','嘉定','奉贤','宝山','崇明','徐汇','普陀','杨浦','松江','浦东','虹口','金山','长宁','闵行','闸北','青浦','静安','黄浦']
						    },
						    series: [
						        {
						            name:'访问来源',
						            type:'pie',
						            radius: ['50%', '70%'],
						            avoidLabelOverlap: false,
						            label: {
						                normal: {
						                    show: false,
						                    position: 'center'
						                },
						                emphasis: {
						                    show: true,
						                    textStyle: {
						                        fontSize: '30',
						                        fontWeight: 'bold'
						                    }
						                }
						            },
						            labelLine: {
						                normal: {
						                    show: false
						                }
						            },
						            data:data.data
						        }
						    ]
						}
						myChart.setOption(option);
					}
				}
			});
		},

		initPriceData: function(){
			var own = this;
			
			$.get('/users/ajax/getDataMapPrice?bigArea='+encodeURIComponent(own.priceArea), function(data){
				// 最高价，最低价，平均价
				if(data.success){
					if(data.data.length){
						var dataArr = [];
						var _data = data.data[0];
						for(var key in _data){
							dataArr.push(parseInt(_data[key]));
						}
						var myChart = echarts.init(document.getElementById('maxMinAvg'));
						var option = {
							title:{
								text: '租房基本价格信息',
								textStyle:{
									fontSize:28
								}
							},
							textStyle:{
								fontSize:16,
							},
							tooltip:{},
							legeng:{
								data:['价格']
							},
							xAxis:{
								axisLabel:{
									textStyle:{
										fontSize:20
									}
								},
								data:['平均价格','最高价','最低价']
							},
							yAxis:{
								splitNumber: 10,
								axisLabel:{
									textStyle:{
										fontSize:14
									}
								},
							},
							series:[
								{
									name: '租房基本价格信息',
									type: 'bar',
									data: dataArr,
									itemStyle: {  
				                        normal: {  
				                            label: {  
				                                show: true,
				                            },
				                            color: new echarts.graphic.LinearGradient(
						                        0, 0, 0, 1,
						                        [
						                            {offset: 0, color: '#2378f7'},
						                            {offset: 0.7, color: '#2378f7'},
						                            {offset: 1, color: '#83bff6'}
						                        ]
						                    )  
				                        },
				                    },  
								}
							]
						};
						myChart.setOption(option);
					}
				}
			})
		},

		initPricescatter: function(){
			var own = this;

			$.get('/users/ajax/getPriceScatter?bigArea='+own.priceScatterArea,function(data){
				if(data.success){
					if(data.data.length){
						var myChart = echarts.init(document.getElementById('scatter'));
						var option = {
							title: {
								text: '区域面积-价格分布图',
								textStyle:{
									fontSize:28
								}
							},
							tooltip:{
								axisPointer:{
						            show: true,
						            type : 'cross',
						            lineStyle: {
						                type : 'dashed',
						                width : 1
						            }
						        }
							},
							xAxis:[
								{
									type: 'value',
									scale:true,
									axisLabel : {
						                formatter: '{value}平',
										textStyle:{
											fontSize:20
										}
						            },
						            splitLine: {
						                show: false
						            },

								}
							],
							yAxis:[
								{
									type : 'value',
						            scale:true,
						            axisLabel : {
						                formatter: '{value}',
										textStyle:{
											fontSize:14
										}
						            },
						            splitLine: {
						                show: false
						            }
								}
							],
							series:[
								{
									type: 'scatter',
									data:data.data
								}
							]
						}
						myChart.setOption(option);
					}
				}
			})
		},

		bindEvent: function(){
			var own = this;
			$('.max-min-avg .cityList').on('change',function(){
				own.priceArea = $(this).val();
				own.initPriceData();
			})

			$('.scatter-wrap .cityList').on('change',function(){
				own.priceScatterArea = $(this).val();
				own.initPricescatter();
			})
		}
	};

	dataMapObj.init();
})