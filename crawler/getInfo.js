var http = require('http');
var superagent = require('superagent');
var cheerio = require('cheerio');
var async = require('async');
var DataToMysql = require('./mysql.js');

/*url读取58同城详情页解析对象*/
let rental58InfosObj = (function(){
	/*解析出来的数据存储在该map中*/
	// let rentalInfosMap = new Map();

	let szUrlPipe = [];/*管道数组，将得到url压入，由定时器按时读取访问解析。*/

	let iNum = 0;
	(function func(){
		iNum++;

		
		if (iNum >  6+Math.random()*3) {
			setTimeout(func, 5 * 5000 * (1+Math.random()));
			
			iNum = 0;
		}
		else{
			if (szUrlPipe.length) {
                console.log("58同城详情页 还剩余 ： "+ szUrlPipe.length +'条');
				analysis(szUrlPipe.shift());
			}
			// else{
			// 	DataToMysql.closeConnect();
			// }
			setTimeout(func, 1000 * (5+Math.random()));
		}
	})();
	

	/*根据url访问并解析返回值*/
	function analysis(_url){

		let html = '';

		http.get(_url, function(res){
			res.on('data', function(chuck){
				html += chuck;
			});

			res.on('end', function(){
				try{
                    let $ = cheerio.load(html);
					if (!$('h1.c_333')){
						return;
					}
					console.log(_url);
					var infoList = $('.house-desc-item ul.f14 li');
					var houseTypeList = infoList[1].children[1].children[0].data;
					houseTypeList = houseTypeList.split("                                ");
					var areaList = infoList.eq(4).find('.c_333.ah');
					var descData = '';
					$('.house-word-introduce p').each(function(){
						descData += $(this).text();
					})

					var locationStr = $('.view-more-detailmap a').attr('href');
					locationStr = locationStr.split('?')[1];
					locationStr = locationStr.split('&')[0];
					locationStr = locationStr.split(',');

					// var obj = {
					// 	title: $('h1.c_333').text(),
					// 	img: $('#smainPic').attr('src'),
					// 	rent: $('.f36').text(),
					// 	payStyle: $('.house-pay-way .c_333').text(),
					// 	rentStyle: infoList[0].children[1].children[0].data,
					// 	floor: infoList[2].children[1].children[0].data,
					// 	roomType: houseTypeList[0],
					// 	area: houseTypeList[1],
					// 	decorate: houseTypeList[2],
					// 	village: infoList.eq(3).find('.c_333.ah').text(),
					// 	bigArea: areaList.eq(0).text(),
					// 	smallArea: areaList.eq(1).text(),
					// 	desc: descData,
					// 	lat: locationStr[0].split('=')[1],
					// 	lng: locationStr[1]
					// }

					var dataArr = [_url,$('h1.c_333').text(),$('#smainPic').attr('src'),$('.f36').text(),$('.house-pay-way .c_333').text(),
									infoList[0].children[1].children[0].data,infoList[2].children[1].children[0].data,houseTypeList[0],
									houseTypeList[1],houseTypeList[2],infoList.eq(3).find('.c_333.ah').text(),areaList.eq(0).text(),
									areaList.eq(1).text(),descData,locationStr[0].split('=')[1],locationStr[1],$('.house-update-info').text().trim().substr(0,10)]

					// console.log(dataArr);
					DataToMysql.insertData(dataArr);
				}catch(e){
					console.log('get rental infos or rentalInfosMap set error!');
				}
			})
		})
	}

	return {
		push(myurl){
			// 屏蔽品牌公寓类型或者会跳转的url
			if(myurl.indexOf('pinpaigongyu')>0 || myurl.indexOf('sh.58.com')<0) return;	

			szUrlPipe.push(myurl);
		}
	}
})();

/*url读取安居客详情页解析对象*/
let rentalAnjuInfosObj = (function(){
	/*解析出来的数据存储在该map中*/
	// let rentalInfosMap = new Map();

	let szUrlPipe = [];/*管道数组，将得到url压入，由定时器按时读取访问解析。*/

	let iNum = 0;
	(function func(){
		iNum++;

		/*反爬虫策略：随机访问，每8次休息一次，休息时间为5分钟*/
		if (iNum > 6+Math.random()*3) {
			setTimeout(func, 5 * 3000 * (1+Math.random()));
			
			iNum = 0;
		}
		else{
			if (szUrlPipe.length) {
                console.log("安居客详情页 还剩余 ： "+ szUrlPipe.length +'条');
				analysis(szUrlPipe.shift());
			}
			// else{
			// 	DataToMysql.closeConnect();
			// }
			setTimeout(func, 1000 * (5+Math.random()));
		}
	})();
	

	/*根据url访问并解析返回值*/
	function analysis(_url){

		superagent
		.get(_url)
		.set({
			'user-agent':'Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/54.0.2840.99 Safari/537.36',
		})
		.end(function(err,res){
			try{
                let $ = cheerio.load(res.text);
				if(!$('.tit>h3.fl')){
					return;
				}
				console.log(_url);
				var descData = '';
				$('.pro_con p').each(function(){
					descData += $(this).text();
				});

				var locationStr = $('.map_hd a').eq(0).attr('href');
				locationStr = locationStr.split('#')[1];
				locationStr = locationStr.split('&');

				var dataArr = [_url,$('.tit>h3.fl').text(),$('.picMove>li>a>img').eq(0).attr('src'),$('.f26').text(),
								$('.p_phrase').eq(1).find('dd').text().split(" ")[0],$('.p_phrase').eq(3).find('dd').text(),
								$('.p_phrase').eq(9).find('dd').text(),$('.p_phrase').eq(2).find('dd').text(),$('.p_phrase').eq(7).find('dd').text(),
								$('.p_phrase').eq(6).find('dd').text(),$('.p_phrase').eq(4).find('a').eq(0).text(),$('.p_phrase').eq(5).find('a').eq(0).text(),
								$('.p_phrase').eq(5).find('a').eq(1).text(),descData,locationStr[0].split('=')[1],locationStr[1].split('=')[1],$('.text-mute').text().split('发布时间：')[1]];

				DataToMysql.insertData(dataArr);

			}catch(e){
				console.log('get rental infos or rentalInfosMap set error!');
			}
		})
	}

	return {
		push(myurl){
			// 屏蔽品牌公寓类型或者会跳转的url
			// if(myurl.indexOf('pinpaigongyu')>0 || myurl.indexOf('sh.58.com')<0) return;	

			szUrlPipe.push(myurl);
		}
	}
})();

/***********************************
*函数名 getUrl
*函数功能描述 ：设置url池
*函数参数 ：
*函数返回值 ：
***********************************/
var my58page = 1;
var anjukePage = 1;
// var my58Urls = [];	//58同城url池
// var myAnjuUrls = [];	//安居客url池
var myUrls = [];	//URL池

let getUrl = (function(){
	var a = [];	//随机数池
	for (var i = 0; i < 10; i++) {
		// myUrls.push('http://sh.58.com/chuzu/pn'+my58page+'/?PGTID=0d3090a7-0000-20f5-c341-c6efe1bb018d&ClickID='+my58page);
		// my58page++;
		var iNum = parseInt(Math.random()*100)%2;
		if (a.length > 4) {
			if(a.slice(a.length-5,a.length).indexOf(iNum) == -1){
				a.push (iNum);
				if(iNum == 0){
					myUrls.push('http://sh.58.com/chuzu/?PGTID=0d100000-0000-2fbc-46d8-01d91badf6f9&ClickID='+my58page);
					my58page++;
				}else{
					myUrls.push('http://sh.zu.anjuke.com/fangyuan/p'+(anjukePage++)+'/'); 
				}
			}else{
				a.push((iNum+1)%2)
				if(iNum == 0){
					myUrls.push('http://sh.58.com/chuzu/?PGTID=0d100000-0000-2fbc-46d8-01d91badf6f9&ClickID='+my58page);
					my58page++;
				}else{
					myUrls.push('http://sh.zu.anjuke.com/fangyuan/p'+(anjukePage++)+'/'); 
				}
			}
		}else{
			a.push (iNum);
			if(iNum == 0){
				myUrls.push('http://sh.58.com/chuzu/?PGTID=0d100000-0000-2fbc-46d8-01d91badf6f9&ClickID='+my58page);
				my58page++;
			}else{
				myUrls.push('http://sh.zu.anjuke.com/fangyuan/p'+(anjukePage++)+'/'); 
			}
			
		}	
	}
})();

/**************************************
*函数名 updateUrl
*函数功能描述 ：获取详情页的url
*函数参数 ：无
*函数返回值 ：无
**************************************/
var concurrencyCount = 0;
let updateUrl = function(listUrl,callback){

	let _html = '';	

	if(listUrl){
		
		if(listUrl.indexOf('58.com')>= 0){
			
			http.get(listUrl, function(res){
				// console.log(res.status);
				res.on('data', function(chunk){
					_html += chunk;
				});

				res.on('end', function(){
					let $ = cheerio.load(_html);
					console.log($('div.des > h2 > a').length);
					for(let i = 0; i < $('div.des > h2 > a').length; i++){
						rental58InfosObj.push($('div.des > h2 > a')[i].attribs.href);
					}
				})
			})
		}

		if(listUrl.indexOf('anjuke') >= 0){
			
			superagent
				.get(listUrl)
				.set({
					'user-agent':'Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/54.0.2840.99 Safari/537.36',
				})
				.end(function(err,res){
					// console.log(res.status);
                    if (res){
                        let $ = cheerio.load(res.text);
                        console.log($('div.zu-info > h3 > a').length);
                        for(let i = 0; i < $('div.zu-info > h3 > a').length; i++){
                            rentalAnjuInfosObj.push($('div.zu-info > h3 > a')[i].attribs.href);
                        }
                    }
				})
		}

		var delay = 5000;  
	    concurrencyCount++;  
	    console.log('现在的并发数是', concurrencyCount, '，正在抓取的是', listUrl, '，耗时' + delay + '毫秒');  
	    setTimeout(function(){  
	        concurrencyCount--;  
	        callback(null);  
	    },delay);	
	}  	
	
};

// 控制并发，并发数最高不超过1
async.mapLimit(myUrls,1,function(url,callback){  
    updateUrl(url,callback);
    //var date = new Date();
    //var number = 1000*(parseInt((Math.random()*10)));
    //console.log(number);
    //while (true){
    //    if (date.getTime() < new Date().getTime() - number){
    //    break;
    //    }
    //}

},function(err,result){  
    if(err){
    	console.log("这条请求失败啦！");
    }else{
    	console.log("全部请求已完成！");
    }
});

module.exports = {
	init(){
		updateUrl();	
	}
}


