var DOMContentLoaded = function() {
    if (document.addEventListener) {
        document.removeEventListener("DOMContentLoaded", DOMContentLoaded, false);
        readyComplete();
    } else if (document.readyState === "complete") {
        document.detachEvent("DOMContentLoaded", DOMContentLoaded);
        readyComplete();
    }
};
if (document.readyState === "complete") {
    setTimeout(readyComplete);
} else if (document.addEventListener) {
    document.addEventListener("DOMContentLoaded", DOMContentLoaded, false);
} else {
    document.attachEvent("onreadystatechange", DOMContentLoaded);
}
/*var top = false;
try {
    top = window.frameElement == null && document.documentElement;
} catch (e) {

}
if (top && top.doScroll) {
    (function doScrollCheck() {
        try {
            document.documentElement.doScroll("left");
        } catch (e) {
            return setTimeout(doScrollCheck, 50);
        }
        readyComplete();
    })();
}*/

var readyComplete = (function() {
    if ($('#ac-wrap')) $('#ac-wrap').remove();
    $('#nav_wrapper span:not(".nav_more")').find("a").each(function(i, dom) {
        var orignUrl = $(dom).attr("href");
        $(dom).click(function() {
            var value = $('#q').val() || $('#search_input').val() ||
                $("input[searchbox-id]").val(),
                _this = $(this);
            if (value) {
                if (_this.attr('id') == 'nav_image_link') {
                    setNewUrl(_this,orignUrl,'/imagesearch.htm?q=',value);
                } else if (_this.attr('id') == 'nav_web_link') {
                    setNewUrl(_this,orignUrl,'/search/pagesearch.htm?q=',value);
                } else if (_this.attr('id') == 'nav_news_link') {
                    setNewUrl(_this,orignUrl,'/search?wd=',value);
                } else if (_this.attr('id') == 'nav_video_link') {
                    setNewUrl(_this,orignUrl,'/search/so?q=',value);
                } else if (_this.attr('id') == 'nav_journal_link') {
                    setNewUrl(_this,orignUrl,'/paper/search?wd=',value);
                } else if (_this.attr("id") == "nav_wenda_link") {
                    setNewUrl(_this,orignUrl,'/question/search.html?q=',value);
                } else if(_this.attr("id") == "nav_music_link"){
                	setNewUrl(_this,orignUrl,'/#/sou-result.html?q=',value);
                }else {
                    setNewUrl(_this,orignUrl,'?q=',value);
                }
            }
        });
    });

    function setNewUrl($this,orignUrl,suffix,keyword){
        $this.attr("href",orignUrl + suffix + encodeURIComponent(keyword));
    }

    var _div = document.createElement('div');
    _div.id = "ac-wrap";
    _div.className = "ac-wrap";
    _div.style.display = "none";
    var _ul = document.createElement('ul');
    _ul.id = "sug";
    _div.appendChild(_ul);
    document.body.appendChild(_div);

    var url = 'http://www.chinaso.com/search/suggest',
        city;
    //"http://www.chinaso.com/baike/pagesearchword.htm";
    /*if(location.hostname.indexOf("house")!=-1) url = "http://house.chinaso.com/houseSugestionWord";
    var href = location.href;
        var end;
        if(href.indexOf(".html")) end = href.indexOf(".html");
        else if(href.indexOf("?")) end = href.indexOf("?");
        var city = href.substring(href.lastIndexOf("/")+1, href.indexOf(".html"));*/
    if (location.hostname.indexOf("house") != -1) {
        url = "http://house.chinaso.com/houseSugestionWord";
        var cityJson = {
            "北京": "beijing",
            "上海": "shanghai",
            "天津": "tianjin",
            "广州": "guangzhou",
            "杭州": "hangzhou",
            "武汉": "wuhan",
            "深圳": "shenzhen",
            "苏州": "suzhou",
            "重庆": "chongqing"
        };
        var cityString = $.trim($(".city_1").text());
        city = cityJson[cityString];
    } else if (location.hostname.indexOf("tuan") != -1) {
        return !1;
    }

    var inputField = document.getElementById("q");
    if (!inputField) inputField = document.getElementById("search_input");

    var conf = {
        num: 10,
        url: url,
        id: "q",
        isResize: true,
        formId: "flpage",
        sug: document.getElementById("ac-wrap"),
        inputField: inputField,
        checkInterval: 200,
        cache: {
            length: function() {
                var length = -1;
                for (var i in this) {
                    length++;
                }
                return length;
            }
        },
        cachesize: 200,
        dom: "search",
        city: city
    };
    if (typeof pg !== 'undefined') {
        if(inputField) {
        	var sug = new pg.Sug(conf);
        }
    }

    if (inputField && !location.hash) {
        inputField.focus();
    }
    
});