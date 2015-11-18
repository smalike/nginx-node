/**
 * 公共组建 —— 搜索词频道导航
 * 启动搜索词联想功能
 * 根据搜索框内容，修改频道导航为频道搜索链接，携带文本框搜索词
 */
var readyComplete = (function() {
    if ($('#ac-wrap')) $('#ac-wrap').remove();
    
    // 绑定事件，切换地址
    $('#nav_wrapper span:not(".nav_more")').find("a").each(function(i, dom) {
        var orignUrl = $(dom).attr("href");
        $(dom).click(function() {
            var value = $('#q').val() || $('#search_input').val() ||
                $("input[searchbox-id]").val(),
                _this = $(this);
            if (value) {
                var _id = _this.attr('id');
                switch(_id){
                    case 'nav_image_link':
                        setNewUrl(_this,'','http://image.chinaso.com/so?q=',value);
                        break;
                    case 'nav_web_link':
                        setNewUrl(_this,orignUrl,'/search/pagesearch.htm?q=',value);
                        break;
                    case 'nav_news_link':
                        setNewUrl(_this,'','http://news.chinaso.com/search?wd=',value);
                        break;
                    case 'nav_video_link':
                        setNewUrl(_this,orignUrl,'/search/so?q=',value);
                        break;
                    case 'nav_music_link':
                        setNewUrl(_this,orignUrl,'/sou-result.html?q=',value);
                        break;
                    case 'nav_wenda_link':
                        setNewUrl(_this,orignUrl,'/question/search.html?q=',value);
                        break;
                    case 'nav_baike_link':
                        setNewUrl(_this,orignUrl,'/wiki/search?q=',value);
                        break;
                    case 'nav_app_link':
                        setNewUrl(_this,orignUrl,'/chinaso-app/core/search?word=',value);
                        break;
                    case 'nav_forum_link':
                        setNewUrl(_this,orignUrl,'/search.php?mod=forum&searchsubmit=true&srchtxt=',value);
                        break;
                    case 'nav_xueshu_link':
                        setNewUrl(_this,orignUrl,'/search/academic.htm?q=',value);
                        break;
                    default: 
                        setNewUrl(_this,orignUrl,'?q=',value);
                };
            }
        });
    });

    /**
     * 设置搜索导航频道链接
     * @param {DOM}    $this    需要修改的频道节点元素
     * @param {String}  orignUrl 原链接地址
     * @param {String} suffix   前缀，索搜地址链接路径
     * @param {String} keyword  搜索词
     */
    function setNewUrl($this,orignUrl,suffix,keyword){
        $this.attr("href",orignUrl + suffix + encodeURIComponent(keyword));
    }

    // 设置搜索框联想提示准备工作
    // 创建容器元素
    var _div = document.createElement('div');
    _div.id = "ac-wrap";
    _div.className = "ac-wrap";
    _div.style.display = "none";
    var _ul = document.createElement('ul');
    _ul.id = "sug";
    _div.appendChild(_ul);
    document.body.appendChild(_div);
    var city;

    // 定义索搜联想查询接口
    var url = 'http://www.chinaso.com/search/suggest';//"http://www.chinaso.com/baike/pagesearchword.htm";
    /*if(location.hostname.indexOf("house")!=-1) url = "http://house.chinaso.com/houseSugestionWord";
    var href = location.href;
        var end;
        if(href.indexOf(".html")) end = href.indexOf(".html");
        else if(href.indexOf("?")) end = href.indexOf("?");
        var city = href.substring(href.lastIndexOf("/")+1, href.indexOf(".html"));*/
    
    // 如果是房产频道，则重新定义搜索联想接口
    if (location.hostname.indexOf("house") !== -1) {
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
    } else if (location.hostname.indexOf("tuan") !== -1 || location.hostname.indexOf("music") !== -1) {
        
        // 如果为团购频道||音乐频道，则不启动搜索联想功能
        return !1;
    }

    var inputField = document.getElementById("q");
    if (!inputField) inputField = document.getElementById("search_input");

    // 搜索联想功能配置信息
    var conf = {
        num: 10,
        
        // 搜索联想接口
        url: url,
        
        // 搜索关键词元素 ID
        id: "q",
        isResize: true,
        
        // 表单 ID
        formId: "flpage",
        
        // 联想词展示容器 ID
        sug: document.getElementById("ac-wrap"),
        
        // 搜索词 DOM 对象
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
        
        // 搜索联想词缓存数量
        cachesize: 200,
        
        // 功能容器
        dom: "search",
        
        // 城市信息
        city: city
    };
    if (typeof pg !== 'undefined') {
        if(inputField) {
            
            // 启动搜索联想功能
            var sug = new pg.Sug(conf);
        }
    }

    if (inputField && !location.hash) {
        inputField.focus();
    }
    
});

// 模块组建兼容处理
;(function (callback) {
    if (typeof define !== "undefined") {
        define("searchbox_implement", ["searchbox_autoComplate"], function (require) {
            require("searchbox_autoComplate");
            return callback();
        });
    } else {
        if (typeof $ === "undefined" || typeof pg === 'undefined') {
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
        } else {
            callback();
        }
    }
}(readyComplete));
