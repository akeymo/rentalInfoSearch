var sqlConnect = require('../server/mysql.js');

var jsonWrite = function (res, ret) {
    if(typeof ret === 'undefined') {
        res.json({
            code:'1',
            message: '操作失败',
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
			message: 'pageStart or pageSize is null!',
			success: false
		}) 

		return; 
	}

	var thisItem = ((params.pageStart-1)*params.pageSize)+1;

	var sql = 'select id,title,img,rent,rentStyle,roomType,area,village,smallArea from rentalData where 1=1';
	
	if(params.bigArea){
		sql += ' and bigArea=' + params.bigArea;
	}
	if(params.smallArea){
		sql += ' and smallArea=' + params.smallArea;
	}
	if(params.lowPrice && !params.upPrice){
		sql += ' and rent >=' + params.lowPrice + ' and rent <=' + params.upPrice;
	}
	if(params.roomType){
		sql += ' and roomType=' + params.roomType;
	}

	sql += ' limit ' + thisItem +' , '+params.pageSize;
	
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
				message: 'select error!',
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

	var params = req.query || req,params;
	
	if(!params.id){
		jsonWrite(res,{
			code: '400',
			message: 'id is null!',
			success: false
		}) 

		return; 
	}

	var sql = 'select id,title,img,rent,payStyle,rentStyle,floor,roomType,area,decorate,village,bigArea,smallArea,`desc`,lat,lng from rentalData where id='+id;
	sqlConnect.query(sql,function(err,results,fields){
		if(err){
			jsonWrite(res,{
				code: '500',
				message: 'select error!',
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