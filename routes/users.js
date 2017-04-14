var express = require('express');
var service = require('../server/rental-web-server.js');
var router = express.Router();

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

//获取列表信息 
router.get('/ajax/getItemList',function(req,res,next){
	service.getItemList(req,res);
});
// 获取详情页信息
router.get('/ajax/getItemInfo',function(req,res,next){
	service.getItemInfo(req,res);
});
// 判断是否收藏
router.get('/ajax/isCollect',function(req,res,next){
	service.isCollect(req,res);
});
// 删除收藏，个人中心用
router.get('/ajax/removeCollect',function(req,res,next){
	service.removeCollect(req,res);
});
// 添加/取消收藏，详情页用
router.get('/ajax/addCollect',function(req,res,next){
	service.addCollect(req,res);
});
// 登录
router.get('/ajax/login',function(req,res,next){
	service.login(req,res);
});
// 注册
router.get('/ajax/register',function(req,res,next){
	service.register(req,res);
});
// 获取收藏列表
router.get('/ajax/getCollectList',function(req,res,next){
	service.getCollectList(req,res);
});
// 获取价格数据图（最高价、最低价、平均价）
router.get('/ajax/getDataMapPrice',function(req,res,next){
	service.getDataMapPrice(req,res);
});

module.exports = router;
