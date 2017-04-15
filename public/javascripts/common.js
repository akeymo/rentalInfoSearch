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
                        sessionStorage.setItem('userLocation',addComp.city);
                    }   
                    console.log(addComp.city);
                    return addComp.city;
                });  
            } else {
                console.log('定位失败，原因：' + this.getStatus());
            }
        }, { enableHighAccuracy: true });
    };

    // 获取url参数
    $.getUrlParam = function(name) {
        var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
        var r = window.location.search.substr(1).match(reg);
        if (r != null) return unescape(r[2]);
        return null;
    };
    // 添加url参数
    $.UrlUpdateParams = function (url, name, value) {
        var r = url;
        if (r != null && r != 'undefined' && r != "") {
            value = encodeURIComponent(value);
            var reg = new RegExp("(^|)" + name + "=([^&]*)(|$)");
            var tmp = name + "=" + value;
            if (url.match(reg) != null) {
                r = url.replace(eval(reg), tmp);
            }else {
                if (url.match("[\?]")) {
                    r = url + "&" + tmp;
                }else{
                    r = url + "?" + tmp;
                }
            }
        }
        return r;
    }


})(window.jQuery);

var buffer = function(o){
    $(o).animate({
        "opacity":1
    }).parent().css({
        "backgroundImage":"none"
    });
};

var ScrollOrderPagination = function(o) {
    this.hasNext = true;
    this.currentPage = (o.data && o.data.currentPage) || 1;
    this.showCount = (o.data && o.data.showCount) || 10;

    this.scrollEl = o.scrollEl;
    this.height = o.height;

    this.destory = function() {
        m.scrollEl.off("scroll.pagination");
    };

    var m = this;

    if (!m.scrollEl) {
        $.alert('请设置滑动元素');
    }

    if (!m.height || m.height / 1 <= 0) {
        $.alert('请设置滑动范围高度');
    }

    m.ajax = function () {
        var nextObj = $.extend(o.data, {
            currentPage: m.currentPage,
            showCount: m.showCount,
            callbackFn: function(hasNext) {
                m.hasNext = hasNext;
                m.load.hide();
            }
        });
        m.load.show();
        o.nextPage(nextObj);
    };

    m.next = function() {
        if (m.hasNext) {
            m.hasNext = false;
            m.currentPage = m.currentPage / 1 + 1;
            if (typeof o.nextPage == 'function') {
                m.ajax();
            } else {
                $.alert('未定义分页数据核心函数');
            }
        }
    };

    m.scrollEl.on("scroll.pagination", function() {
        if ( o.load.css('display') != 'none' ) return;
        var top = document.documentElement.scrollHeight || document.body.scrollHeight,
            height = $(window).scrollTop() + $(window).height();

        if (top <= height && m.hasNext && m.load.css('display') === 'none') {
            m.load.show();
            m.next();
        }
    });

    m.createLoad = function () {
        var divNode = document.createElement('div');

        divNode.setAttribute('class', 'loading-tip');
        divNode.innerText = '正在加载';

        $('body').append(divNode);
    };

    m.init = function() {
        m = $.extend(m, o.data);
        m.hasNext = true;
        m.currentPage = o.data.currentPage || 1;
        m.showCount = o.data.showCount || 10;

        if (!o.load) {
            m.createLoad();
        }

        m.load = o.load || $('.load');
        m.ajax();
    };

    m.init();
};

$(function(){
    $('.clickPersonal').on('click',function(){
        var flag = window.localStorage.getItem('userId');
        if(!!flag){
            window.location.href = '/personal';
        }else{
            window.location.href = '/login';
        }
    })
})