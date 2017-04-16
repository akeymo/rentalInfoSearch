var sqlConnect = require('../server/mysql.js');

var jsonWrite = function (res, ret) {
    if(typeof ret === 'undefined') {
        res.json({
            code:'400',
            message: '操作失败！',
            success:false
        });
    } else {
        res.json(ret);
    }
};

exports.getItemList = function(req,res,next){
	// 获取结果列表
	// 参数：pageStart,pageSize,bigArea, smallArea, lowPrice, upPrice, roomType

	var params = req.query || req.params;

	if(!params.pageStart || !params.pageSize){

		jsonWrite(res,{
			code: '400',
			message: '参数不能为空!',
			success: false
		}) 

		return; 
	}

	var thisItem = ((params.pageStart-1)*params.pageSize);

	var sql = 'select id,url,title,img,rent,rentStyle,roomType,area,bigArea,smallArea from rentalData where 1=1';
	
	if(params.bigArea){
		params.bigArea = decodeURIComponent(params.bigArea);
		sql += ' and bigArea=\'' + params.bigArea + '\'';
	}
	if(params.smallArea){
		params.smallArea = decodeURIComponent(params.smallArea);
		sql += ' and smallArea=\'' + params.smallArea + '\'';
	}
	if(params.lowPrice && params.upPrice){
		sql += ' and (rent+0) >=' + parseInt(params.lowPrice) + ' and (rent+0) <=' + parseInt(params.upPrice);
	}
	if(params.roomType){
		sql += ' and roomType like \'' + params.roomType + '室%\'';
	}

	sql += ' limit ' + thisItem +' , '+params.pageSize;
	console.log(sql);
	
	sqlConnect.query(sql,function(err,results,fields){
		var returnObj = {
			code: '200',
			message: 'success',
			success: true,
			data: '',
		};

		if(err){
			console.log('[SELECT ERROR] - ',err.message);
			sqlConnect.end();

			jsonWrite(res,{
				code: '500',
				message: '查询失败!',
				success: false
			})  

		}else{
			jsonWrite(res,{
				code: '200',
				message: 'success',
				success: true,
				data: results
			})  
		}
	});
}

exports.getItemInfo = function(req,res,next){
	// 获取结果信息
	// 参数id

	var params = req.query || req.params;
	
	if(!params.id){
		jsonWrite(res,{
			code: '400',
			message: '参数id不能为空!',
			success: false
		}) 

		return; 
	}

	var sql = 'select id,title,img,rent,payStyle,rentStyle,floor,roomType,area,decorate,village,bigArea,smallArea,`desc`,lat,lng from rentalData where id='+params.id;
	sqlConnect.query(sql,function(err,results,fields){
		if(err){
			jsonWrite(res,{
				code: '500',
				message: '查询失败!',
				success: false
			}) 

		}else{
			jsonWrite(res,{
				code: '200',
				message: 'success',
				success: true,
				data: results
			})  
		}
	});
}

exports.isCollect = function(req,res,next){
	// 是否收藏
	// 参数userId和itemId
	var params = req.query || req.params;
	// params.userId = parseInt(params.userId);
	// params.itemId = parseInt(params.itemId);
	var sql = 'select id from rental_collect where userId='+params.userId+' and itemId='+params.itemId;
	sqlConnect.query(sql,function(err,results,fields){
		if(err){
			jsonWrite(res,{
				code: '500',
				message: '查询失败!',
				success: false
			}) 

		}else{
			if(!!results.length){
				jsonWrite(res,{
					code: '200',
					message: 'success',
					success: true,
					data: true
				})  
			}else{
				jsonWrite(res,{
					code: '200',
					message: 'success',
					success: true,
					data: false
				})  
			}
			
		}
	});
}

exports.addCollect = function(req,res,next){
	// 添加/取消收藏
	// 参数userId和itemId
	var params = req.query || req.params;
	if(!params.userId || !params.itemId){
		jsonWrite(res,{
			code: '400',
			message: '参数不能为空！',
			success: false
		}) 

		return; 
	}

	var sql = 'select id from rental_collect where userId='+params.userId+' and itemId='+params.itemId;
	sqlConnect.query(sql,function(err,results,fields){
		if(err){
			jsonWrite(res,{
				code: '500',
				message: '查找失败!',
				success: false
			}) 

		}else{
			if(!!results.length){
				sql = 'delete from rental_collect where userId='+params.userId+' and itemId='+params.itemId;
				sqlConnect.query(sql,function(err,results,fields){
					if(err){
						jsonWrite(res,{
							code: '500',
							message: '取消收藏失败!',
							success: false
						}) 
					}else{
						jsonWrite(res,{
							code: '200',
							message: '取消收藏成功！',
							success: true
						}) 
					}
				})
			}else{
				sql = 'insert into rental_collect (userId,itemId) values ('+params.userId+','+params.itemId+')';
				sqlConnect.query(sql,function(err,results,fields){
					if(err){
						jsonWrite(res,{
							code: '500',
							message: '添加收藏失败!',
							success: false
						}) 
					}else{
						jsonWrite(res,{
							code: '200',
							message: '添加收藏成功！',
							success: true
						}) 
					}
				})
			}
		}
	});
}

exports.removeCollect = function(req,res,next){
	// 删除收藏
	// 参数userId和itemId
	var params = req.query || req.params;
	if(!params.userId || !params.itemId){
		jsonWrite(res,{
			code: '400',
			message: '参数不能为空！',
			success: false
		}) 

		return; 
	}

	var sql = 'delete from rental_collect where userId='+params.userId+' and itemId='+params.itemId;
	sqlConnect.query(sql,function(err,results,fields){
		if(err){
			jsonWrite(res,{
				code: '500',
				message: '删除收藏失败!',
				success: false
			}) 
		}else{
			jsonWrite(res,{
				code: '200',
				message: '删除收藏成功！',
				success: true
			}) 
		}
	})
}

exports.getCollectList = function(req,res,next){
	// 获取收藏列表
	var params = req.query || req.params;
	var sql = 'SELECT rentaldata.id,rentaldata.url,rentaldata.title,rentaldata.img,rentaldata.rent,rentaldata.rentStyle,rentaldata.roomType,rentaldata.area,rentaldata.bigArea,rentaldata.smallArea FROM rentaldata WHERE rentaldata.id in (SELECT rental_collect.itemId FROM rental_collect WHERE userId='+params.userId+')';
	sqlConnect.query(sql,function(err,results,fields){
		if(err){
			jsonWrite(res,{
				code: '500',
				message: '查询失败!',
				success: false
			}) 
		}else{
			jsonWrite(res,{
				code: '200',
				message: '查询成功！',
				success: true,
				data:results
			})
		}
	})
}

exports.login = function(req,res,next){
	// 登录
	var params = req.query || req.params;
	var sql = 'select userId from rental_user where `username`=\''+params.username+'\' and `password`=\''+params.password+'\'';	
	sqlConnect.query(sql,function(err,results,fields){
		if(err){
			jsonWrite(res,{
				code: '500',
				message: '登录失败！',
				success: false
			}) 
		}else{
			if(!!results){
				jsonWrite(res,{
					code: '200',
					message: '登录成功！',
					success: true,
					data:results
				})
			}else{
				jsonWrite(res,{
					code: '400',
					message: '登录失败！',
					success: false
				})
			}
		}
	})
}

exports.register = function(req,res,next){
	// 注册
	var params = req.query || req.params;
	var sql = 'insert into rental_user(`username`,`password`) values('+'\''+params.username+'\''+',\''+params.password+'\')';
	sqlConnect.query(sql,function(err,results,fields){
		if(err){
			jsonWrite(res,{
				code: '500',
				message: '注册失败!',
				success: false
			}) 
		}else{
			jsonWrite(res,{
				code: '200',
				message: '注册成功！',
				success: true,
				data:results
			})
		}
	})
}

exports.getDataMapPrice = function(req,res,next){
	// 价格数据图（最高价，最低价，平均价）
	var params = req.query || req.params;
	var sql = 'SELECT AVG(rent+0) avg,MAX(rent+0) max,MIN(rent+0) min FROM rentaldata WHERE 1=1';
	if(params.bigArea != 'all'){
		params.bigArea = decodeURIComponent(params.bigArea);
		sql += ' and bigArea=\'' + params.bigArea + '\'';  
	}
	
	sqlConnect.query(sql,function(err,results,fields){
		if(err){
			jsonWrite(res,{
				code: '500',
				message: '查询失败!',
				success: false
			}) 
		}else{
			jsonWrite(res,{
				code: '200',
				message: '查询成功！',
				success: true,
				data: results
			})
		}
	})
}

exports.getPriceScatter = function(req,res,next){
	// 获取区域价格数据，散点图用
	var params = req.query || req.params;
	var sql = 'SELECT rent,area FROM rentaldata where 1=1';
	if(params.bigArea != 'all'){
		params.bigArea = decodeURIComponent(params.bigArea);
		sql += ' and bigArea=\'' + params.bigArea + '\'';  
	}
	sqlConnect.query(sql,function(err,results,fields){
		if(err){
			jsonWrite(res,{
				code: '500',
				message: '查询失败!',
				success: false
			}) 
		}else{
			var dataMap = [];
			if(results.length){
				for(var i=0,len=results.length;i<len;i++){
					var _dataMap = [];
					var _area = results[i].area.replace(/平米/,'');
					_dataMap.push(_area.trim());
					_dataMap.push(results[i].rent);
					dataMap.push(_dataMap);
				}
			}
			jsonWrite(res,{
				code: '200',
				message: '查询成功！',
				success: true,
				data: dataMap
			})
		}
	})
}

exports.getMapData = function(req,res,next){
	var sql = 'SELECT id,img,lng,lat FROM rentaldata';
	sqlConnect.query(sql,function(err,results,fields){
		if(err){
			jsonWrite(res,{
				code: '500',
				message: '查询失败!',
				success: false
			}) 
		}else{
			jsonWrite(res,{
				code: '200',
				message: '查询成功！',
				success: true,
				data: results
			})
		}
	})
}