//适配
(function(win, doc) {

    var docEl = doc.documentElement,
        fontEl = doc.createElement('style'),
        metaEl = doc.querySelector('meta[name="viewport"]'),
        head = doc.head,
        dpr = win.devicePixelRatio || 1,
        rem = docEl.clientWidth * dpr / 10,
        maxScale = scale = 1 / dpr;

    if (navigator.userAgent.toLowerCase().match(/chinaredstar/ig) || navigator.userAgent.toLowerCase().match(/MicroMessenger/ig)) {
        maxScale = 1.0;
    }

    metaEl.setAttribute('content', 'width=' + dpr * docEl.clientWidth + ',initial-scale=' + scale + ',maximum-scale=' + maxScale + ', minimum-scale=' + scale + ',user-scalable=no');

    docEl.setAttribute('data-dpr', dpr);

    fontEl.setAttribute('data-root', rem);
    fontEl.innerHTML = 'html{font-size:' + rem + 'px!important;}';
    head.appendChild(fontEl);

    win.rem2px = function(v) {
        v = parseFloat(v);
        return v * rem;
    }

    win.px2rem = function(v) {
        v = parseFloat(v);
        return v / rem;
    }

    win.px2px = function(v) {
        v = parseFloat(v);
        return v / 75 * rem;
    }

    win.dpr = dpr;
    win.rem = rem;
})(window, document);

;(function($) {
    /**
     * 获取定位信息
     */
    $.getWapLocation = function() {
        var wapLocation = new BMap.Geolocation();
        var wapCity = new BMap.Geocoder();

        // getCurrentPosition 方法用于返回用户当前位置
        wapLocation.getCurrentPosition(function(r) {
            if (this.getStatus() === 0) {
                var pt = r.point;
                wapCity.getLocation(pt, function(rs){    
                    var addComp = rs.addressComponents;
                    if(!sessionStorage.getItem('userLocation')){
                        sessionStorage.setItem('userLocation',addComp.province);
                    }   
                    console.log(addComp.province);
                    return addComp.province;
                });  
            } else {
                console.log('定位失败，原因：' + this.getStatus());
            }
        }, { enableHighAccuracy: true });
    };

    $.getUrlParam = function(name) {
        var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
        var r = window.location.search.substr(1).match(reg);
        if (r != null) return unescape(r[2]);
        return null;
    }


})(window.jQuery);
