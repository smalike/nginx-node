 /**
  * File Contents Outline : 更改频道样式
  * Author :  wuxiumei（wuxiumei@panguso.com）
  * Function: 主要修改导航中当前频道（包含样式）及频道链接
  */
 (function() {
    var CHANNELS = {
        house:{ //房产搜索
            title:"房产",
            sid:"nav_house",
            lid:"nav_house_link",
            url:"http://house.chinaso.com",
            sprefix:"",
            useable:false,
            current:true        
        },
        tuan:{ //房产搜索
            title:"团购",
            sid:"nav_tuan",
            lid:"nav_tuan_link",
            url:"http://tuan.chinaso.com",
            sprefix:"",
            useable:false,
            current:true        
        },
        news:{ //新闻搜索
            title:"新闻",
            sid:"nav_news",
            lid:"nav_news_link",
            url:"http://news.chinaso.com",
            sprefix:"",
            useable:true    
        },
        www:{ //网页搜索
            title:"网页",
            sid:"nav_web",
            lid:"nav_web_link",
            url:"http://www.chinaso.com",
            sprefix:"search/pagesearch.htm",
            useable:true    
        },
        map:{ //地图搜索
            title:"地图",
            sid:"nav_map",
            lid:"nav_map_link",
            url:"http://map.chinaso.com",
            sprefix:"",
            useable:true
        },
        china123:{ //导航搜索
            title:"导航",
            sid:"nav_123",
            lid:"nav_123_link",
            url:"http://123.chinaso.com",
            sprefix:"",
            useable:true    
        },
        image:{ //图片搜索
            title:"图片",
            sid:"nav_image",
            lid:"nav_image_link",
            url:"http://image.chinaso.com",
            sprefix:"imagesearch.htm",
            useable:true    
        },
        shitu:{ //国搜识图
            title:"识图",
            sid:"nav_shitu",
            lid:"nav_shitu_link",
            url:"http://shitu.chinaso.com",
            sprefix:"",
            useable:true
        },
        video:{ //视频搜索
            title:"视频",
            sid:"nav_video",
            lid:"nav_video_link",
            url:"http://video.chinaso.com",
            sprefix:"",
            useable:true    
        },
        music:{ //音乐搜索
            title:"音乐",
            sid:"nav_music",
            lid:"nav_music_link",
            url:"http://music.chinaso.com",
            sprefix:"",
            useable:true    
        },
        learning:{ //学术搜索
            title:"学术",
            sid:"nav_xueshu",
            lid:"nav_xueshu_link",
            url:"http://learning.chinaso.com",
            sprefix:"",
            useable:true/*,
            showincur:true*/ //是否仅在本频道下展示该nav
        },
        paper:{ //报刊搜索
            title:"报刊",
            sid:"nav_paper",
            lid:"nav_paper_link",
            url:"http://paper.chinaso.com",
            sprefix:"",
            useable:false
        },
        wenda:{ //问答搜索
            title:"问答",
            sid:"nav_wenda",
            lid:"nav_wenda_link",
            url:"http://wenda.chinaso.com",
            sprefix:"",
            useable:true    
        },
        forum:{
            title:"社区",
            sid:"nav_forum",
            lid:"nav_forum_link",
            url:"http://forum.chinaso.com",
            sprefix:"",
            useable:true    
        },
        baike:{ //百科搜索
            title:"百科",
            sid:"nav_baike",
            lid:"nav_baike_link",
            url:"http://baike.chinaso.com",
            sprefix:"",
            useable:true
        },
        cert:{ //国搜认证
            title:"认证",
            sid:"nav_cert",
            lid:"nav_cert_link",
            url:"http://cert.chinaso.com",
            sprefix:"",
            useable:true
        },
        app:{ //国搜应用
            title:"App",
            sid:"nav_app",
            lid:"nav_app_link",
            url:"http://app.chinaso.com",
            sprefix:"",
            useable:false
        },
        more:{ //国搜更多
            title:"更多",
            sid:"nav_more",
            lid:"nav_more_link",
            url:"http://www.chinaso.com/home/product.html",
            sprefix:"",
            useable:false
        }
    },  
    /*
    * 频道和频道div的id对应关系，用于从URL中得到当前的频道Id
    * 用于未配置当前频道时，当前频道的标红处理
    */
    SITE_MAPPING = {
        'news': 'news',
        'report': 'news',
        'focus': 'news',
        'forum': 'forum',
        'search': 'www',
        'image': 'image',
        'video': 'video',
        'paper': 'paper',
        'music': 'music',
        'www': 'www',
        'wenda': 'wenda',
        'map': 'map',
        'app': 'app',
        '123': 'china123',
        'my': 'my',
        'house': 'house',
        'baike': 'baike',
        'cert': 'cert',
        'learning': 'learning'
    },
    WRAPPER_ID = "nav_wrapper",
    POS_INDEX_STYLE = "nav_index",
    POS_RESULT_STYLE = "nav_result",
    CURRENT_CHANNEL_STYLE = "cur",
    DEFAULT_CHANNEL = "www";

    function render() {
        var nav = document.getElementById(WRAPPER_ID),
            html = "",
            i,
            channelObj;
        if (!nav) {
            channelObj = CHANNELS[channel];
            html = '<div class="nav" id="nav_wrapper">';
            if (channelObj && channelObj["current"]) {
                html += '<span id="' + channelObj.sid + '"><a href="' + channelObj.url + '" id="' + channelObj.lid + '">'
                    + channelObj.title + '</a></span>'
            }
            for (i in CHANNELS) {
                if (CHANNELS.hasOwnProperty(i) && CHANNELS[i].useable === true) {
                    if (CHANNELS[i].sid === 'nav_more') {
                        html += '<span id="' + CHANNELS[i].sid + '"><a target="_blank" href="' + CHANNELS[i].url + '" id="' + CHANNELS[i].lid + '">' + CHANNELS[i].title + '</a></span>';
                    } else {
                        html += '<span id="' + CHANNELS[i].sid + '"><a href="' + CHANNELS[i].url + '" id="' + CHANNELS[i].lid + '">' + CHANNELS[i].title + '</a></span>';
                    }
                }/* else if (CHANNELS[i].url.indexOf(window.location.host) > -1 && channelObj && CHANNELS[i].useable === false && CHANNELS[i].showincur === true) {
                    html += '<span id="' + channelObj.sid + '">' + channelObj.title + '</span>'
                }*/
            }

            html += "</div>";
            document.writeln(html);
            var verticalClearTimeId;
        }
    }

    /**
     * 获取元素样式
     */
    function getClassNames(element) {
        return element.className.replace(/\s+/, ' ').split(' ');
    }

    /**
     * 判断元素是否有该样式
     */
    function hasClassName(element, className) {
        var classes = getClassNames(element);
        for (var i = 0; i < classes.length; i++) {
            if (classes[i] === className) {
                return true;
            }
        }
        return false;
    }

    /**
     * 为元素添加样式
     */
    function addClassName(element, className) {
        element.className += (element.className ? ' ' : '') + className;
        return true;
    }

    /**
     * 元素移除样式
     */
    function removeClassName(element, className) {
        var classes = getClassNames(element);
        var length = classes.length
        for (var i = length - 1; i >= 0; i--) {
            if (classes[i] === className) {
                delete(classes[i]);
            }
        }
        element.className = classes.join(' ');
        return (length == classes.length ? false : true);
    }
    
    /**
     * 获取当前URL
     */
    function getCurrentURL(){
         return window.location.href;
    }

    //设置默认频道为网页搜索
    var channel = DEFAULT_CHANNEL,
    //设置默认的位置是结果页
    posStyle = POS_RESULT_STYLE,
    pgKeyword = "",
    channelId = "",
    channelObj = null;

    function getLocation() {
        var curHost = getCurrentURL();
        var end = curHost.indexOf('.');
        if(end!=-1){
            var start = curHost.indexOf('http://');
            //huangxiaoli添加繁体版频道判断.
            if(curHost.indexOf('big5') < 0){
                if(start!=-1){
                    start = start + 7;
                }else if(curHost.indexOf('https://')!=-1){
                    start = curHost.indexOf('https://')+ 8;
                }else{
                    start = 0;
                }
            }else{
                var curHosts = curHost.split('/big5/'),
                    preURL = curHosts[0],
                    normalURL = curHosts[1];
                start = preURL.length + '/big5/'.length;
                end = start + normalURL.indexOf('.');
            }
            var localChanl = curHost.substring(start,end);
            var curChanl = SITE_MAPPING[localChanl];
            if(curChanl){
                if (curChanl === "www") {
                    if (/^http:\/\/((www\.chinaso\.com.+)|(my\.chinaso\.com.+))$/.test(location.href)) {
                        channel = curChanl;
                    } else {
                        channel = "verticalSearch";
                    }
                } else {
                    channel = curChanl;
                }
            }else if(localChanl !== "www"){
                channel = "verticalSearch";
            }
        }
        return channel;
    }
             
     
    function setNav(){
        if(channel !== "" && channel in CHANNELS){
             channelObj = CHANNELS[channel];
             channelId = channelObj.sid;
        }else{
             //throw new Error("The channnel "+ channel + "is not exist in conf!");
        }
        //设置频道位置样式
        var wrapper = document.getElementById(WRAPPER_ID);
        //去除其他样式
        if(hasClassName(wrapper, POS_RESULT_STYLE)){
            removeClassName(wrapper, POS_RESULT_STYLE);
        }
        if(hasClassName(wrapper, POS_INDEX_STYLE)){
            removeClassName(wrapper, POS_INDEX_STYLE);
        }
        addClassName(wrapper, posStyle);
        
        //去除其他当前频道样式
        var ulBox = document.getElementById(WRAPPER_ID);
        var list = ulBox.getElementsByTagName("span");
        for (var i = 0; i < list.length; i++) {
            if (hasClassName(list[i], CURRENT_CHANNEL_STYLE)) {
                removeClassName(list[i], CURRENT_CHANNEL_STYLE);
            }
        }

        //设置当前频道标红样式
        if(channelObj) {
            var chal = document.getElementById(channelObj.sid);
        }
        if(!!chal){
            addClassName(chal, CURRENT_CHANNEL_STYLE);
            var chalText = chal.innerHTML || "";
            if(chalText!=""){
                //去掉链接，改为文本  update lihao 14-06-11
                var _text = chalText.replace(/\<\/(a|A)\>/, '');
                    _text = _text.replace(/\<(a|A).+\>/, '');
                chal.innerHTML = _text;
            }
        }
    }

    function init(){
        getLocation();
        render();
        setNav();
    }
      
    init();
 })();