BL.Com.Toolbar = (function (BL) {
    var CONST = {
            content: "",

            // 组件id
            CID: "jToolbar",

            // 注册id
            REGID: "jToolbarReg",

            // 登陆id
            LGID: "jToolbarLogin",

            // 返回首页id
            BACKID: "jToolbarBack",

            // 收藏id
            FID: "jToolbarFav",

            // 设置主页id
            HPID: "jToolbarHomepage",

            // 天气id
            WID: "jToolbarWeather",

            // 日期id
            TID: "jToolbarTime",

            // 用户名id
            UNID: "jToolbarUserName",

            // 退出id
            EXITID: "jToolbarExit",

            // 用户区id
            UAREA: "jToolbarUser",
            COOKIE_LOGIN: "chinasoticket_titlename",
            COOKIE_USER_NAME: "chinasoticket_titlename",
            EXCEPT_URLS: ['www.chinaso.com', 'report.chinaso.com', 'map.chinaso.com', 'video.chinaso.com', 'image.chinaso.com', '123.chinaso.com', 'news.chinaso.com', 'music.chinaso.com', 'tuan.chinaso.com', 'focus.chinaso.com']
        },
        CONF = {
            URL_UNAME: "http://www.chinaso.com/",

            // 新域名
            URL_UNAME: "http://www.chinaso.com/",

            // 用户名网址
            URL_LOGIN: "https://passport.chinaso.com/login",

            // 登陆域名
            URL_REG: "http://my.chinaso.com/reg/index.htm",

            // 注册域名
            URL_PASSPORT_BASE: "https://passport.chinaso.com/",
            URL_EXIT: "https://passport.chinaso.com/",

            // 退出域名
            URL_AJAX_EXIT: "https://passport.chinaso.com/logout",
            VSTAR_PATH: "http://my.chinaso.com/",
            PASSPORT_PATH: "https://passport.chinaso.com/",
            URL_INDEX: "http://www.chinaso.com",
            URL_WEATHER: "http://www.chinaso.com/weather/query/"
        },
        cookieUtil = BL.Util.Cookie,
        timeUtil = BL.Util.Time,
        fav = BL.Util.FavSite,
        ev = BL.Util.Event,
        pageRankElems,
        timeArr;


//    cookieUtil.set(CONST.COOKIE_LOGIN,"dd",null,".panguso.com","/");
//    cookieUtil.set(CONST.COOKIE_USER_NAME,"wxm@163.com",null,".panguso.com","/");

    function isLogin() {
        var lgc = cookieUtil.get(CONST.COOKIE_LOGIN, true);
        if (lgc !== null) {
            return true;
        } else {
            return false;
        }
    }

    //  function getPageRank() {
    // var elems = BL.Util.Dom.getElementsByClassName("top_data"),
    //   fragment = document.createDocumentFragment(),
    //   navs = CONST.TOP_NAV,
    //   len = navs.length,
    //   i,
    //   elem,
    //   nav,
    //   txt;
    // if (elems.length > 0) {
    //   for (i = 0; i < len; i++) {
    // 	elem = document.createElement("a"),
    // 	nav = navs[i],
    // 	txt = document.createTextNode(nav.channal);
    // 	elem.href = nav.url;
    // 	elem.appendChild(txt);
    // 	fragment.appendChild(elem);
    //   };
    //   elems[0].innerHTML = "";
    //   elems[0].appendChild(fragment);
    // }
    // return elems;
    //  }

    pageRankElems = [] /*getPageRank()暂时取消二级页面判断显示导航，默认全部显示天气信息*/ ;

    /***
     * 判断是不是主页。chenbc 2013-11-28
     **/
    function isHomePage() {
        if (/^http:\/\/((www\.chinaso\.com\/index.+)|(chinaso\.com\/)|(my\.chinaso\.com.+)|(www\.chinaso\.com\/?))$/.test(location.href)) {
            return true;
        } else {
            return false;
        }
    }

    function getUserState() {
        var uarea = document.getElementById(CONST.UAREA),
            uname,
            html,
            weatherother,
            downloadA,
            downloadDiv,
            weatherother = '<div class="weather_other">' + '<i id="wo_switch">其它城市天气</i>' + '<div class="wo_box hide">' + '<div class="wo_box_wrap">' + '</div>' + '<div class="wo_tab"><a href="#" class="cur">热门城市</a><a href="#">省市</a></div>' + '<div class="wo_cont_box">' + '<div class="wo_cont">' + '<div class="h6"></div>' + '<ul class="list15" id="hotCity">' + '</ul>' + '<div class="h6 clear"></div>' + '</div>' + '<div class="wo_cont hide">' + '<div class="wo_sel_box">' + '<select multiple="multiple" name="s_province" id="s_province">' + '</select>' + '</div>' + '<div class="wo_sel_box">' + '<select multiple="multiple" id="s_city" name="s_city">' + '</select>' + '</div>' + '<div class="clear"></div>' + '</div>' + '</div>' + '<div class="wo_submit"><p><a class="btn3 mgr5" target="_blank" style="display:none;" id="weatherSubmit">确认</a><a class="btn4" id="cancelSel">关闭</a></p></div>' + '</div>' + '</div>',
            jFHTML = getJFHtml();
        //weatherother = '';
        /*
         旧版下载地址：http://m.chinaso.com/wsdownload.html
         新版下载地址：http://www.chinaso.com/home/app_download.html
         */
        // 删除“返回首页”修改：downloadA删除 <span>|</span> - jlj
        downloadA = '<a href="http://m.chinaso.com/wsdownload.html" class="a_download" target="_blank">移动客户端</a>';
        var downloadA2 = '<a href="http://m.chinaso.com/wsdownload.html" class="a_download" target="_blank">移动客户端</a>';
//        var appApplication = '<a href="http://app.chinaso.com" class="a_download app-red" target="_blank">国搜应用</a>';
        var versionSel = '<a href="javascript:void(0)" class="a_version">版本选择<i class="arrow_down"></i></a>';
        downloadDiv = ''; //'''<div class="download_box hide"><dl class="list18"><dt>选择下载平台</dt><dd><a href="http://news.chinaso.com/download/chinasoNews_web.apk">Android版</a></dd><dd><a href="http://news.chinaso.com/download/chinasoNews_web.ipa">iOS版</a></dd></dl></div>'
        if (isHomePage()) { /***主页**/
            if (isLogin()) { /***登陆状态**/
            uname = cookieUtil.get(CONST.COOKIE_USER_NAME, true) || "";
                //uname = uname.substring(0, uname.indexOf("@"));
                html = '<div id="jToolbarUser" class="account">' + '<div class="skinOpen">' +
                    '<a href="http://www.chinaso.com" class="a_index">中国搜索首页</a><span class="a_index_span">|</span><b class="head_pic"></b><b class="user"><a target="_blank" title="点击进入用户中心" href="http://my.chinaso.com/conf/index.htm" class="a_user">' + uname +
                    '<i class="arrow_down"></i></a></b><span>|</span><a href="http://app.chinaso.com" class="a_app" target="_blank">手机助手</a><span>|</span>' +
//                    appApplication + '<span>|</span>' + 
                    downloadA2 + jFHTML + '<span>|</span><a target="_blank" id="jToolbarHomepage" href="http://www.chinaso.com" ' +
                    'onclick="setHome(this, \'http:\/\/www.chinaso.com\');">设国搜为主页</a>' + '</div>' +

//                  downloadDiv +
                    '<div class="quit_box hide"><ul class="list51">' +
                    '<li><a target="_blank" href="http://wenda.chinaso.com/user/score.html">我的问答</a></li>' +
                    '<li><a target="_blank" href="http://forum.chinaso.com/home.php?mod=space&do=pm">我的社区</a></li>' +
                    '<li><a target="_blank" href="http://baike.chinaso.com/wiki/user-profile.html">我的百科</a></li>' +
                    '<li class="last"><a id="jToolbarExit" href="javascript:void(0);">退出</a></li></ul></div></div>' +
                    '<div class="fl top_data">' + '<span id="jToolbarTime">' + setTimeArea() + '</span><a href="http://www.chinaso.com/search/pagesearch.htm?q=%E5%86%9C%E5%8E%86" target="_blank" class="date_lunar">' +
                    getCurCNDDate() + '</a><i>|</i><span id="jToolbarWeather"></span></div>' + weatherother;
            } else { /***非登陆**/
            var redirect = window.location.href;
                var loginUrl = CONF.URL_LOGIN + "?service=" + encodeURIComponent(redirect);
                //var registerUrl = CONF.URL_REG + "?url=" + encodeURIComponent(encodeURIComponent(encodeURIComponent(redirect))) + "#register";
                html = '<div id="jToolbarUser" class="account">' + '<div class="skinOpen"><a href="http://www.chinaso.com" class="a_index">中国搜索首页</a><span class="a_index_span">|</span>' + '<a id="jToolbarLogin" href="' + loginUrl + '" class="a_login">一键登录</a><span>|</span><a href="http://app.chinaso.com" class="a_app" target="_blank">手机助手</a><span>|</span>' +
                        // versionSel
                        //				+ appApplication +'<span>|</span>' +
                    downloadA2 + jFHTML + '<span>|</span><a target="_blank" id="jToolbarHomepage" href="http://www.chinaso.com"' + '  onclick="setHome(this, \'http:\/\/www.chinaso.com\');">设国搜为主页</a>' + '</div>' +

                        // downloadDiv +
                    '</div>' +
                    '<div class="fl top_data">' + '<span id="jToolbarTime">' + setTimeArea() + '</span><a href="http://www.chinaso.com/search/pagesearch.htm?q=%E5%86%9C%E5%8E%86" target="_blank" class="date_lunar">' + getCurCNDDate() + '</a><i>|</i><span id="jToolbarWeather"></span></div>' + weatherother;
            }
        } else { /***非主页**/
            if (isLogin()) { /***登陆状态**/
            uname = cookieUtil.get(CONST.COOKIE_USER_NAME, true) || "";
                //uname = uname.substring(0, uname.indexOf("@"));
                /*<a href="' + CONF.URL_INDEX + '">返回首页</a>*/
                html = '<div id="jToolbarUser" class="account">' + '<div class="skinOpen"><a href="http://www.chinaso.com" class="a_index">中国搜索首页</a><span class="a_index_span">|</span>' + '<b class="head_pic"></b><b class="user"><a target="_blank" title="点击进入用户中心" href="http://my.chinaso.com/conf/index.htm" class="a_user">' + uname + '<i class="arrow_down"></i></a></b><span>|</span><a href="http://app.chinaso.com" class="a_app" target="_blank">手机助手</a><span>|</span>' +
                        //                    appApplication + '<span>|</span>' +
                    downloadA + '<span>|</span><a target="_blank" id="jToolbarHomepage" href="http://www.chinaso.com"' + ' onclick="setHome(this, \'http:\/\/www.chinaso.com\');">设国搜为主页</a>' + '</div>' +
//                    downloadDiv + 
                    '<div class="quit_box hide noindex_pos">' + '<ul class="list51">' +
                    '<li><a target="_blank" href="http://wenda.chinaso.com/user/score.html">我的问答</a></li>' +
                    '<li><a target="_blank" href="http://forum.chinaso.com/home.php?mod=space&do=pm">我的社区</a></li>' +
                    '<li><a target="_blank" href="http://baike.chinaso.com/wiki/user-profile.html">我的百科</a></li>' +
                    '<li class="last"><a id="jToolbarExit" href="javascript:void(0);">退出</a></li></ul>' +
                    '</div>' + '</div>' + '<div class="fl top_data">';
                if (pageRankElems.length > 0) {
                    html += pageRankElems[0].innerHTML;
                    html += '</div>';
                } else {
                    html += '<span id="jToolbarTime">' + setTimeArea() +
                        '</span><a target="_blank" href="http://www.chinaso.com/search/pagesearch.htm?q=%E5%86%9C%E5%8E%86" class="date_lunar">' + getCurCNDDate() + '</a><i>|</i><span id="jToolbarWeather"></span></div>' + weatherother;
                }

                /*$(document).on('click', '#jToolbarExit', function() {
                 $(this).PassportLogoutWhy({
                 'basePath': CONF.VSTAR_PATH,
                 'passurl': CONF.URL_EXIT + '/logout/doLogout.htm'
                 }, {
                 sucCb: function() {
                 BL.Com.Toolbar.update();
                 },
                 errorCb: function() {
                 BL.Com.Toolbar.update();
                 }
                 });
                 });*/

            } else { /***非登陆**/
            var redirect = window.location.href;
                var loginUrl = CONF.URL_LOGIN + "?service=" + encodeURIComponent(redirect);
                //var registerUrl = CONF.URL_REG + "?url=" + encodeURIComponent(encodeURIComponent(encodeURIComponent(redirect))) + "#register";
                /*<a href="' + CONF.URL_INDEX + '">返回首页</a>  注册 修改<span>|</span>*/
                html = '<div id="jToolbarUser" class="account">' + '<div class="skinOpen"><a href="http://www.chinaso.com" class="a_index">中国搜索首页</a><span class="a_index_span">|</span><a id="jToolbarLogin" href="' + loginUrl + '" class="a_login">一键登录</a><span>|</span><a href="http://app.chinaso.com" class="a_app" target="_blank">手机助手</a><span>|</span>' +
//                    appApplication + '<span>|</span>' + 
                    downloadA + '<span>|</span><a target="_blank" id="jToolbarHomepage" href="http://www.chinaso.com"' + ' onclick="setHome(this, \'http:\/\/www.chinaso.com\');">设国搜为主页</a></div>' +
//                    downloadDiv + 
                    '</div>' + '<div class="fl top_data">';
                if (pageRankElems.length > 0) {
                    html += pageRankElems[0].innerHTML;
                } else {
                    html += '<span id="jToolbarTime">' + setTimeArea() + '</span><a target="_blank" href="http://www.chinaso.com/search/pagesearch.htm?q=%E5%86%9C%E5%8E%86" class="date_lunar">' +
                        getCurCNDDate() + '</a><i>|</i><span id="jToolbarWeather"></span>';
                }
                html += '</div>' + weatherother;
            }
        }
        html = '<div class="top_con">' + html + '</div>';
        return html;
    }

    /**
     * 获取简繁切换的html.
     */
    function getJFHtml(){
        var returnHtml = '<span>|</span><a id="simpleHref" href="http://www.chinaso.com/">'+
                decodeURIComponent("%E7%AE%80%E4%BD%93%E7%89%88")+'</a><span>|</span><a id="traditionalHref"'
                + ' href="http://big5.chinaso.com/big5/www.chinaso.com/">繁體版</a>';
        return returnHtml;
    }

    /***
     * 将请求中的关键字进行转码，避免中文乱码问题。songxg 2012-11-11
     **/
    function encodeKeyword(url) {
        var arr = url.split('&');
        for (var i = 0, l = arr.length; i < l; i++) {
            if (arr[i].indexOf('q') != -1) {
                var kw = arr[i].substring(arr[i].indexOf('q'));
                var convertKw = encodeURI(kw);
                arr[i] = arr[i].replace(kw, convertKw);
            }
        }

        return arr.join('&');
    }

    function updateUserState() {
        var u = document.getElementById(CONST.CID),
            wh;
        if (u) {
            wh = document.getElementById(CONST.WID).innerHTML;
            u.innerHTML = getUserState();
            document.getElementById(CONST.WID).innerHTML = wh;
            BL.Com.OperationAndExtend.initWeatherEvent();
        }
    }

    function render() {
        var toolbar = document.getElementById(CONST.CID);
        var content = getUserState();
        var wrapper = '<div class="top" id="jToolbar">' + content + '</div>';
        if (typeof toolbar === undefined) {
            document.writeln(wrapper);
        } else {
            toolbar.innerHTML = content;
        }
        if (pageRankElems.length <= 0) {
            /*BL.Com.City.getCurrentCity();*/
            BL.Com.Weather.getWeatherData();
        }

        //添加垂直频道导航.
        addVerticalNav();
    }

    function addVerticalNav(){
        var exceptURL = CONST.EXCEPT_URLS,
            curURL = window.location.href,
            flag = true;
        for(var i = 0, len = exceptURL.length; i < len; i++){
            if(curURL.indexOf(exceptURL[i]) > -1 || isHomePage()){
                flag = false;
                break;
            }
        }
        if(flag) {
            BL.Util.JSONP('http://www.chinaso.com/static/json/nav/data.json', null, 'BL.Com.Toolbar.buildChinasoNavs');
        }
    }

    function buildChinasoNavs(navHtml){
        setTimeout(function(){
            $('#'+CONST.CID).after(navHtml);
        }, 20);
    }

    /*function logout() {
        //BL.Util.JSONP(CONF.URL_AJAX_EXIT, "BL.Com.Toolbar.updateUserState");
        location.href = CONF.URL_AJAX_EXIT+'?service=' + encodeURIComponent(window.location.href);
    }

    /!***注册用户相关事件**!/
    function bindUserEvent() {
        var exit = document.getElementById(CONST.EXITID);
        if (exit) {
            ev.addHandler(exit, "click", logout);
        }
    }*/

    function unBindUserEvent() {
        var exit = document.getElementById(CONST.EXITID);
        if (exit) {
            ev.removeHandler(exit, "click", logout);
        }
    }

    function getCurDate() {
        return timeArr[0] + " " + timeUtil.getDay();
    }

    function getCurCNDDate() {
        return timeArr[1];
    }

    function setTimeArea() {
        timeArr = timeUtil.getFormatDate();
        var d = getCurDate();
        /***var o = document.getElementById(CONST.TID);
         if(o){
	   o.innerHTML = d;
	 }**/
        return d;
    }

    function getWheather(city, callback) {
        /***@example{s.src = "http://www.chinaso.com/weather/query/BL.Com.Toolbar.updateWheatherState?city=北京";}**/
        city = city || "北京";
        callback = callback || "updateWheatherState";
        var params = callback + "?city=" + city;
        BL.Util.JSONP(CONF.URL_WEATHER + params);
    }

    function updateWheatherState(weatherData) {
        BL.Com.Weather.fillStorageWeatherData(weatherData);
        return formatWeatherData(weatherData);
    }

    function formatWeatherData(weatherData) {
        var city,
            forcast,
            airQuality,
            aqiClass,
            aqiText,
            w,
            o,
            disApi = "";
        if (weatherData) {
            city = weatherData.cityExt;
            forcast = weatherData.forcast;
            airQuality = weatherData.airQuality || {};
            /***@view{<span>北京：晴 33 ～23℃</span><span class="air_quality">空气质量：86</span><em>轻度污染</em>}**/
            if (airQuality.aqi >= 0 && airQuality.aqi <= 50) {
                aqiClass = "you";
                aqiText = "优";
            } else if (airQuality.aqi > 50 && airQuality.aqi <= 100) {
                aqiClass = "liang";
                aqiText = "良";
            } else if (airQuality.aqi > 100 && airQuality.aqi <= 150) {
                aqiClass = "qingdu";
                aqiText = "轻度污染";
            } else if (airQuality.aqi > 150 && airQuality.aqi <= 200) {
                aqiClass = "zhongdu";
                aqiText = "中度污染";
            } else if (airQuality.aqi > 200 && airQuality.aqi <= 300) {
                aqiClass = "zhongdu2";
                aqiText = "重度污染";
            } else if (airQuality.aqi > 300) {
                aqiClass = "yanzhong";
                aqiText = "严重污染";
            }

            o = document.getElementById(CONST.WID);

            if(aqiText){
                disApi = '空气质量：<em class="' + aqiClass + '">' + aqiText + '</em></a>';
                w = '<a target="_blank" href="http://www.chinaso.com/search/pagesearch.htm?q=%E5%A4%A9%E6%B0%94%E9%A2%84%E6%8A%A5">' +
                    city.city + ' ：' + forcast.weathers[0].weather + " " + forcast.weathers[0].temp +
                    '</a><a target="_blank" href="http://www.chinaso.com/search/pagesearch.htm?q=%E7%A9%BA%E6%B0%94%E8%B4%A8%E9%87%8F" class="air_quality">' + disApi;
            }else{
                w = '<a target="_blank" href="http://www.chinaso.com/search/pagesearch.htm?q=%E5%A4%A9%E6%B0%94%E9%A2%84%E6%8A%A5" style="margin-right:0;">' +
                    city.city + ' ：' + forcast.weathers[0].weather + " " + forcast.weathers[0].temp +
                    '</a>';
            }
            if (o) {
                o.innerHTML = w;
            }
        }
        return w;
    }

    // 整理去掉收藏功能
    //  function bindFavEvent() {
    // var f = document.getElementById(CONST.FID);
    // if (f) {
    //   ev.addHandler(f, "click", function() {
    // 	// mark.add(f);
    // 	fav.add(window.location.href, document.title);
    //   });
    // }
    //  }

    function bindUserCenter() {
        var userTimeId;
        $('.account .user, .account .quit_box').on('mouseenter', function() {
            clearTimeout(userTimeId);

            // 每次修改头部结构都要重新定义退出right值。
            // 这里用依靠定义法，获得依靠目标left值，定义给quit位置 - jlj
            $('.account .quit_box').css({
                left: $(this).position().left
            }).show();
            return false;
        });

        $(".account .user, .account .quit_box").on('mouseleave', function(e) {
            userTimeId = setTimeout(function () {
                $(".account .quit_box").hide();
            }, 200);
        });
    }

    function bindExitEvent() {

        $('#jToolbarExit').on('click', function () {
            /*$(this).PassportLogoutWhy({
                'basePath': CONF.VSTAR_PATH,
                'passurl': CONF.URL_EXIT + 'logout/doLogout.htm',
                'curUrl': encodeURIComponent(window.location.href)
            }, {
                sucCb: function () {
                    if (/^.*my.chinaso.com.*$/ig.test(location.host)) {
                        window.location.href = CONF.URL_UNAME;
                    }
                    BL.Com.Toolbar.update();
                },
                errorCb: function () {
                    BL.Com.Toolbar.update();
                }
            });
            BL.Com.City.loadindex = 1;
            return false;*/
            location.href = CONF.URL_AJAX_EXIT+'?service=' + encodeURIComponent(window.location.href);
        });
    }



    function init(conf) {

        render();

        /***CONF = $.extend(CONF,conf);**/

        /***bindUserEvent();**/
        /***收藏网址**/
            // bindFavEvent(); 取消该功能
        bindExitEvent();
        bindUserCenter();

        return this;
    }

    /***登陆退出事件**/

    return {
        init: init,
        update: updateUserState,
        conf: CONF,
        updateWheatherState: updateWheatherState,
        formatWeatherData: formatWeatherData,
        getWheather: getWheather,
        isLogin: isLogin,
        pageRankElems: pageRankElems,
        buildChinasoNavs: buildChinasoNavs
    }

})(BL);