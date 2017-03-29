var express = require('express');
var service = require('../server/rental-web-server.js');
var router = express.Router();

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

router.get('/ajax/getItemList',function(req,res,next){
	service.getItemList(req,res);
});

router.get('/ajax/getItemInfo',function(req,res,next){
	service.getItemInfo(req,res);
});

module.exports = router;
