/**
 * Created by huangxiaoli on 2015/5/4.
 */
(function (factory) {
    if (typeof define === "function" && define.amd) {

        // AMD. Register as an anonymous module.
        define("DT", ["jquery"], function (require, exports, module) {
            var $ = require("jquery");
            factory($);
        });
        require("DT");
    } else {

        // Browser globals
        factory(jQuery);
    }
}(function ($) {
    var DT = window.DT || {};
    DT.CONF = {
        URL_LOGIN: "http://my.chinaso.com/login/index.htm",
        URL_REG: "http://my.chinaso.com/reg/index.htm",
        VSTAR_PATH: "http://my.chinaso.com/",
        URL_EXIT: "https://passport.chinaso.com/",
        URL_UNAME: "http://www.chinaso.com/",
        LOGIN_REG_TMPL: '<div class="skinOpen">{#homeUrl}<a id="" target="_blank" class="register a_index" href="http://m.chinaso.com/wsdownload.html">国搜新闻APP</a><span>|</span><a id="jToolbarLogin" href="{#loginUrl}" class="login">一键登录</a></div>',
        USER_TMPL: '<div class="skinOpen"><b class="head_pic"></b><a href="http://my.chinaso.com/conf/index.htm" title="点击进入用户中心" target="_blank" class="a_user">{#uname}<i class="arrow_down"></i></a></div>' +
        '<div class="quit_box hide noindex_pos"><ul class="list51">' +
        '<li><a target="_blank" href="http://wenda.chinaso.com/user/score.html">我的问答</a></li>' +
        '<li><a target="_blank" href="http://forum.chinaso.com/home.php?mod=spacecp&ac=credit">我的社区</a></li>' +
        '<li><a target="_blank" href="http://baike.chinaso.com/wiki/user-doccontri-create.html">我的百科</a></li>' +
        '<li class="last"><a id="jToolbarExit" class="quit last" href="javascript:void(0);">退出</a></li></ul></div>',
        NAC_TMPL: '',
        NAV_HOME: '<a href="http://www.chinaso.com">中国搜索首页</a><span class="a_index_span">|</span>'
    };
    DT.CONST = {
        CID: "jToolbar",
        SECONDID: "ID-Toolbar-Wrap",
        USERAREAID: "jToolbarUser",
        COOKIE_LOGIN: "chinasoticket_titlename",
        COOKIE_USER_NAME: "chinasoticket_titlename"
    };

    DT.defaults = {

        // allList: 所有频道及频道对应的访问url.
        allList: {
            国情: {
                url: "http://nation.chinaso.com/", //频道对应的域名.
                idx: 1, //cookie中存放的index值.
                isDefault: true, //无cookie时是否默认展示，下线后需要改为false或者无需默认展示也可改为false.
                isOffLine: false //是否下线，若下线，需要改为false.
            },
            地方: {
                url: "http://local.chinaso.com/",
                idx: 2,
                isDefault: true,
                isOffLine: false
            },
            法治: {
                url: "http://law.chinaso.com/",
                idx: 4,
                isDefault: true,
                isOffLine: false
            },
            报刊: {
                url: "http://paper.chinaso.com/",
                idx: 7,
                isDefault: true,
                isOffLine: false
            },
            互联网: {
                url: "http://internet.chinaso.com/",
                idx: 8,
                isDefault: true,
                isOffLine: false
            },
            房产: {
                url: "http://house.chinaso.com/beijing.html",
                idx: 13,
                isDefault: true,
                isOffLine: false
            },
            汽车: {
                url: "http://auto.chinaso.com/",
                idx: 14,
                isDefault: true,
                isOffLine: false
            },
            家居: {
                url: "http://home.chinaso.com/",
                idx: 15,
                isDefault: true,
                isOffLine: false
            },
            美食: {
                url: "http://food.chinaso.com/",
                idx: 16,
                isDefault: true,
                isOffLine: false
            },
            团购: {
                url: "http://tuan.chinaso.com/",
                idx: 17,
                isDefault: true,
                isOffLine: false
            },
            认证: {
                url: "http://cert.chinaso.com/",
                idx: 20,
                isDefault: true,
                isOffLine: false
            },
            河南: {
                url: "http://hn.chinaso.com/",
                idx: 21,
                isDefault: true,
                isOffLine: false
            },
            大连: {
                url: "http://dl.chinaso.com/",
                idx: 22,
                isDefault: true,
                isOffLine: false
            },
            旅游: {
                url: "http://trip.chinaso.com/",
                idx: 18,
                isDefault: false,
                isOffLine: true
            },
            智城: {
                url: "http://icity.chinaso.com/",
                idx: 19,
                isDefault: false,
                isOffLine: true
            },
            国际: {
                url: "http://world.chinaso.com/",
                idx: 3,
                isDefault: true,
                isOffLine: false
            },
            财经: {
                url: "http://finance.chinaso.com/",
                idx: 5,
                isDefault: true,
                isOffLine: false
            },
            军事: {
                url: "http://mil.chinaso.com",
                idx: 6,
                isDefault: true,
                isOffLine: false
            },
            社会: {
                url: "http://society.chinaso.com/",
                idx: 9,
                isDefault: true,
                isOffLine: false
            },
            科技: {
                url: "http://tech.chinaso.com/",
                idx: 10,
                isDefault: true,
                isOffLine: false
            },
            体育: {
                url: "http://sports.chinaso.com/",
                idx: 11,
                isDefault: true,
                isOffLine: false
            },
            娱乐: {
                url: "http://ent.chinaso.com/",
                idx: 12,
                isDefault: true,
                isOffLine: false
            }
        },
        // itemsCookieName: 存放的cookie名称，默认为：'myChinasoItems'.
        itemsCookieName: 'myChinasoItems',
        // defalutNum: 默认展示的频道数目，除了固定频道：中国搜索，首页，新闻搜索，国搜报道外，初始值为10.
        defalutNum: 11,
        //最少要选择的频道个数.
        selNum: 0, 
        // noNavList: 只展示登陆注册的频道，如：['123.chinaso.com', 'http://map.chinaso.com/'].
        noNavList: ['123.chinaso.com', 'map.chinaso.com/', 'news.chinaso.com']
    };

    //初始化总方法.
    DT.initialize = function (opt) {
        this.defaults = $.extend(this.defaults, opt);
        this.build(); //构建右侧用户登录注册结构.
        this.bindEvent(); //绑定用户登录注册事件.

        var isNeedNav = this.isNeedNav(); //是否需要显示左侧频道导航.
        if (isNeedNav) this.initNav(); //若需要导航结构，构建导航，并添加方法.
    };

    //初始化已有频道.
    DT.initNav = function () {
        var _self = this,
            list = _self.getChooseList(), //若cookie中有频道则默认展示其频道，否则展示默认频道.
            $wrapper = $("#" + _self.CONST.SECONDID),
            html = '<div class="fl top_nav_data"><div class="top_nav_data fl"><ul id="ID-ToolbarMyItems">',
            chooseList = [];

        //添加所有频道.
        html += _self.buildNavsHtml(list, chooseList);

        html += '</ul></div>';
        html += '<div class="top_nav_set fl top_nav_set_hover" id="ID-ToolbarSetItems"><a href="javascript:void(0);" class="dragSetBtn">设置</a><div class="macTitleSet hide clearb">' +
            '<div class="macSetSel connectedSortable ui-sortable"></div><p class="tc"><i></i>拖动也可以进行排序</p>' +
            '<div class="macSetIng connectedSortable ui-sortable"></div><div class="clearb tc">' +
            '<a href="javascript:;" class="bthMacQA">确认</a><a href="javascript:;" class="bthMacQB">取消</a></div>' +
            '<div class="tipYel clearb">温馨提示：根据您的喜好，还可以拖拽栏目顺序。</div></div></div></div>';

        $wrapper.append($(html));
        if($wrapper.find('.top_nav_more_hover').length > 0 ) _self.bindNavEvent.hoverMoreItems(); //更多按钮hover事件添加.
        _self.bindNavEvent.buildSetItems(chooseList); //添加设置隐藏框中的内容.
    };

    //获取默认列表.
    //@return list: 返回cookie中选中的频道或者默认频道,格式如：["国际","军事","食品"]
    DT.getChooseList = function () {
        var T = this,
            list = [],
            opt = T.defaults,
            cookieStr = T.Cookie.getCookie(opt.itemsCookieName, true),
            allList = opt.allList;
        if (cookieStr === null) {
            for (var key in allList) {
                var cur = allList[key];
                if (!cur.isOffLine && cur.isDefault) {
                    list.push(key);
                }
            }
        } else if (cookieStr !== "") {
            var tmpList = cookieStr.split(',');
            for (var i = 0, len = tmpList.length; i < len; i++) {
                var cur = tmpList[i];
                for (var key in allList) {
                    var item = allList[key];
                    if (item.idx == cur) {
                        list.push(key);
                        break;
                    }
                }
            }
        }
        return list;
    };

    //根据默认数据或者cookie列表中的数据，生成导航列表.
    DT.buildNavsHtml = function(list, arr){
        var _self = this,
            opt = _self.defaults,
            len = list.length,
            html = '<li class="fwb"><a href="http://www.chinaso.com/" target="_blank">中国搜索首页</a></li>' +
                '<li><a href="http://news.chinaso.com/" target="_blank">新闻搜索</a></li>' +
                '<li><a href="http://report.chinaso.com/" target="_blank">国搜报道</a></li>';

        //添加所有频道.
        for (var i = 0; i < len; i++) {
            var key = list[i];
            if (!opt.allList[key].isOffLine) {
                var curURL = opt.allList[key].url;
                if(arr) arr.push(key);

                if (i < opt.defalutNum) {
                    if (i !== len - 1) {
                        html += '<li><a href="' + curURL + '" target="_blank">' + key + '</a></li>';
                    } else {
                        html += '<li class="no"><a href="' + curURL + '" target="_blank">' + key + '</a></li>';
                    }
                } else {
                    if (i === opt.defalutNum) {
                        html += '<li class="top_nav_more top_nav_more_hover no"><a href="javascript:void(0);">更多</a><ul id="navMoreItems" class="hide">';
                        if (i !== len - 1) {
                            html += '<li class="bl"><a href="' + curURL + '" target="_blank">' + key + '</a></li>';
                        } else {
                            html += '<li class="bl br"><a href="' + curURL + '" target="_blank">' + key + '</a></li></ul></li>';
                        }
                    } else {
                        if (i !== len - 1) {
                            html += '<li><a href="' + curURL + '" target="_blank">' + key + '</a></li>';
                        } else {
                            html += '<li class="br"><a href="' + curURL + '" target="_blank">' + key + '</a></li></ul></li>';
                        }
                    }
                }
            }
        }
        return html;
    };

    //判断是否需要频道导航.
    DT.isNeedNav = function () {
        var loc = window.location.href,
            exceptNavs = DT.defaults.noNavList,
            len = exceptNavs.length;
        for (var i = 0; i < len; i++) {
            if (loc.indexOf(exceptNavs[i]) >= 0) {
                return false;
            }
        }
        return true;
    };

    //toolbar频道导航事件绑定.
    DT.bindNavEvent = function () {
        return {

            //更多按钮的hover事件添加：鼠标划入展示更多频道，划出隐藏.
            hoverMoreItems: function () {
                $('.top_nav_more_hover').hover(function () {
                    var T = $(this);
                    T.addClass('top_nav_more_link');
                    T.find('#navMoreItems').removeClass('hide');
                }, function () {
                    var T = $(this);
                    T.removeClass('top_nav_more_link');
                    T.find('#navMoreItems').addClass('hide');
                });
            },

            //根据频道列表展示已选和未选频道.
            buildSetItems: function (chooseItems) {
                var _parent = DT,
                    _self = this,
                    opt = _parent.defaults,
                    $outerWrapper = $("#ID-ToolbarSetItems"),
                    $setBtn = $outerWrapper.find('.dragSetBtn'),
                    $wrapper = $outerWrapper.find('.macTitleSet'),
                    $choose = $wrapper.find('.macSetSel'),
                    $notChoose = $wrapper.find('.macSetIng'),
                    allList = opt.allList,
                    chooseHtml = '',
                    notChooseHtml = '',
                    $btnMacQB = $wrapper.find(".bthMacQB"),
                    $btnMacQA = $wrapper.find(".bthMacQA");

                //输出所有选中的频道.
                for (var i = 0, chooseLen = chooseItems.length; i < chooseLen; i++) {
                    chooseHtml += '<a href="javascript:;" title="点击取消选中" class="macSetRed">' + chooseItems[i] + '<i class="icoClo"></i></a>';
                }

                //输出所有未选中的频道.
                for (var key in allList) {
                    if (!allList[key].isOffLine && _parent.Tools.arrayIndexOf(key, chooseItems) < 0) {
                        notChooseHtml += '<a href="javascript:;" title="点击选中" class="macSetGary">' + key + '<i class="icoAdd"></i></a>';
                    }
                }
                $choose.html($(chooseHtml));
                $notChoose.html($(notChooseHtml));

                $setBtn.on('click', function (e) {
                    _parent.Dom.stopPropagation(e); //阻止事件冒泡.

                    $outerWrapper.toggleClass('top_nav_set_hover');
                    $outerWrapper.toggleClass('top_nav_set_link');
                    $wrapper.toggleClass('hide');
                    return false;
                });

                //点击取消选中该频道.
                $choose.on("click", "a", function (e) {
                    _parent.Dom.stopPropagation(e); //阻止事件冒泡.

                    /*if ($wrapper.find(".macSetSel a").length <= opt.selNum) {
                        //_self.error($wrapper.find("p.tc"));
                        $wrapper.find(".macSetSel").sortable("option", "connectWith", false);
                        return false;
                    }*/
                    $(this).remove().appendTo($wrapper.find(".macSetIng"))
                        .removeClass("macSetRed").addClass("macSetGary").attr("title", "点击选中")
                        .find("i").removeClass("icoClo").addClass("icoAdd");
                    return false;
                });

                //点击选中该频道.
                $notChoose.on("click", "a", function (e) {
                    _parent.Dom.stopPropagation(e); //阻止事件冒泡.

                    $(this).remove().appendTo($wrapper.find(".macSetSel"))
                        .removeClass("macSetGary").addClass("macSetRed").attr("title", "点击取消选中")
                        .find("i").removeClass("icoAdd").addClass("icoClo");

                    //_self.clearError($wrapper.find("p.tc"));
                    //$wrapper.find(".macSetSel").sortable("option", "connectWith", ".macSetIng");
                    return false;
                });

                //点击取消按钮.
                $btnMacQB.on("click", function (e) {
                    _parent.Dom.stopPropagation(e); //阻止事件冒泡.

                    _self._hideSetBox(); //隐藏设置box.
                    return false;
                });

                //点击确认按钮.
                $btnMacQA.on("click", function (e) {
                    _parent.Dom.stopPropagation(e); //阻止事件冒泡.

                    var maxIndex = $wrapper.find(".macSetSel a").length - 1,
                        result = "";

                    _self._hideSetBox(); //隐藏设置box.

                    $wrapper.find(".macSetSel a").text(function (index, content) {
                        result += (index === maxIndex) ? content : content + ",";
                    });
                    _self._setItemsList(result);
                    return false;
                });

                //点击页面空白处隐藏设置box.
                _self.hideSetBoxByClick();
            },

            //初始化设置的drag事件.
            _initDrag: function () {
                var _parent = DT,
                    $category = $("#ID-ToolbarSetItems"),
                    $categorySet = $category.find(".macTitleSet"),
                    selPro = {tolerance: "pointer", connectWith: ".connectedSortable", helper: 'clone'},
                    ingPro = {tolerance: "pointer", connectWith: ".connectedSortable", helper: 'clone'};

                //T.clearErrorId = null;//设置setTimeout的时间标识.

                $categorySet.find(".macSetSel").sortable(selPro).disableSelection().bind("sortstop", function (e, ui) {
                    var $cur = $(this);
                    if ($cur.find("a").length <= _parent.defaults.selNum) {
                        $cur.sortable("option", "connectWith", false);

                        //T.error($categorySet.find('p.tc'));
                    }
                    $categorySet.find(".macSetIng").sortable("option", "connectWith", ".macSetSel");
                    if ($(ui.item[0]).closest(".macSetIng").length) {
                        $(ui.item[0]).removeClass("macSetRed").addClass("macSetGary").attr("title", "点击选中")
                            .find("i").removeClass("icoClo").addClass("icoAdd");
                    }
                });
                $categorySet.find(".macSetIng").sortable(ingPro).disableSelection().bind("sortstop", function (e, ui) {
                    $categorySet.find(".macSetSel").sortable("option", "connectWith", ".macSetIng");
                    if ($(ui.item[0]).closest(".macSetSel").length) {
                        $(ui.item[0]).removeClass("macSetGary").addClass("macSetRed").attr("title", "点击取消选中")
                            .find("i").removeClass("icoAdd").addClass("icoClo");

                        //T.clearError($categorySet.find('p.tc'));
                    }
                });
            },

            //确定后将选中的频道写入到cookie.
            _setItemsList: function (list) {
                var _parent = DT,
                    cookieList = [];
                if (typeof list === "string" && list !== "") {
                    list = list.split(",");
                }
                var len = list.length;
                if (len) {
                    for (var i = 0; i < len; i++) {
                        var val = list[i],
                            idx = this._getItemIdx(val);
                        if (idx >= 0) {
                            cookieList.push(idx);
                        }
                    }
                }
                _parent.Cookie.setCookie(_parent.defaults.itemsCookieName, cookieList, '', 'chinaso.com', '/');
                this._updateNav(list); //更新页面导航展示.
            },

            //获取某一个频道的idx值.
            _getItemIdx: function (item) {
                var items = DT.defaults.allList;
                for (var key in items) {
                    if (key === item) {
                        return items[key].idx;
                    }
                }
                return -1;
            },

            /*//提示错误.
            error: function ($tip) {
                var _parent = DT,
                    T = this;
                clearTimeout(T.clearErrorId);
                $tip.find("i").html('请您至少选择' + _parent.defaults.defalutNum + '项');
                T.clearErrorId = setTimeout(function () {
                    T.clearError($tip);
                }, 2000);
            },

            //取消错误提示.
            clearError: function ($tip) {
                var _parent = DT;
                clearTimeout(T.clearErrorId);
                $tip.find("i").html("");
            },*/

            //更新导航.
            _updateNav: function (list) {
                list = list || [];
                var $wrapper = $('#ID-ToolbarMyItems'),
                    html = DT.buildNavsHtml(list); //获取频道列表的html结构.

                $wrapper.html($(html));
                if($wrapper.find('.top_nav_more_hover').length > 0) this.hoverMoreItems(); //更多按钮hover事件添加.
            },

            //隐藏弹出的设置层.
            _hideSetBox: function () {
                var $outWrapper = $('#ID-ToolbarSetItems'),
                    $wrapper = $outWrapper.find('.macTitleSet ');
                $wrapper.addClass('hide');
                $outWrapper.addClass('top_nav_set_hover');
                $outWrapper.removeClass('top_nav_set_link');

                $wrapper.on('click', function (e) {
                    DT.Dom.stopPropagation(e);
                });
            },

            //点击页面中的空白处，隐藏设置box.
            hideSetBoxByClick: function () {
                var T = this;
                $(document).on('click', function () {
                    T._hideSetBox();
                });
            }
        };
    }();

    DT.build = function () {
        var _html;
        if (DT.Cookie.isLogin()) {
            var uname = DT.Cookie.getCookie(DT.CONST.COOKIE_USER_NAME, true) || "";
            _html = DT.CONF.USER_TMPL.replace("{#uname}", uname);
        } else {
            var redirect = window.location.href,
                loginUrl = DT.CONF.URL_LOGIN + "?url=" + encodeURIComponent(encodeURIComponent(encodeURIComponent(redirect))),
                registerUrl = DT.CONF.URL_REG + "?url=" + encodeURIComponent(encodeURIComponent(encodeURIComponent(redirect))) + "#register";
            _html = DT.CONF.LOGIN_REG_TMPL.replace("{#loginUrl}", loginUrl).replace("{#registerUrl}", registerUrl);
            if (DT.isNeedNav()) {
                _html = _html.replace('{#homeUrl}', '');
            } else {
                _html = _html.replace('{#homeUrl}', DT.CONF.NAV_HOME);
            }
        }

        //生成all_top_con Div和accountDiv.
        var jWrapper = document.createElement("div");
        jWrapper.className = "all_top_con";
        jWrapper.id = DT.CONST.SECONDID;
        var userEle = document.createElement("div");
        userEle.className = "account";
        userEle.id = DT.CONST.USERAREAID;
        jWrapper.appendChild(userEle);

        document.getElementById(DT.CONST.CID).appendChild(jWrapper);
        userEle.innerHTML = DT.CONF.NAC_TMPL + _html;
    };

    //绑定登录注册事件.
    DT.bindEvent = function () {
        $("#jToolbar .quit").on('click', function () {
            $(this).PassportLogoutWhy({
                'basePath': DT.CONF.VSTAR_PATH,
                'passurl': DT.CONF.URL_EXIT + 'logout/doLogout.htm',
                'curUrl': encodeURIComponent(window.location.href)
            }, {
                sucCb: function () {
                    if (/^.*my.chinaso.com.*$/ig.test(window.location.host)) {
                        window.location.href = DT.CONF.URL_UNAME;
                    }
                    DT.build();
                },
                errorCb: function () {
                    DT.build();
                }
            });
            return false;
        });
        $('#jToolbar .more-link').on({
            mouseover: function () {
                DT.Dom.hideBox();
                $("#jToolbar .more-list").show();
            }
        });
        $('#' + DT.CONST.USERAREAID + ' .a_user').on('mouseover', function () {
            $('#' + DT.CONST.USERAREAID + ' .quit_box').removeClass('hide');
            return false;
        });
        $(document).on('mouseover', function (e) {
            if (!$(e.target).closest(".quit_box").length) {
                $('#' + DT.CONST.USERAREAID + ' .quit_box').addClass('hide');
            }
        });
    };

    //Dom公共方法.
    DT.Dom = function () {
        return {
            /* hideBox: function () {
             $("#jToolbar .hide").not(function () {
             if ($(this).parents(".hide").length) {
             return this;
             }
             }).hide();
             },*/

            //阻止事件冒泡.
            stopPropagation: function (event) {
                event = event || window.event;
                if (event.stopPropagation) {
                    event.stopPropagation();
                } else {
                    event.cancelBubble = true;
                }
            }
        };
    }();

    //cookie公共方法.
    DT.Cookie = function () {
        return {
            isLogin: function () {
                var lgc = this.getCookie(DT.CONST.COOKIE_LOGIN, true);
                if (lgc !== null) {
                    return true;
                } else {
                    return false;
                }
            },
            getCookie: function (name, decode) {
                var cookies = document.cookie,
                    arr,
                    reg = new RegExp("(^|)" + name + "=([^;]*)(;|$)");
                arr = cookies.match(reg);
                if (arr) {
                    if (decode === true) {
                        return this.decodeStr(arr[2]);
                    } else {
                        return arr[2];
                    }
                } else {
                    return null;
                }
            },
            setCookie: function (name, value, expires, domain, path, secure) {
                var c = encodeURIComponent(name) + "=" + encodeURIComponent(value),
                    d = null,
                    days = 30;
                if (expires instanceof Date) {
                    c += ";expires=" + expires.toGMTString();
                } else {
                    /***不设置此参数，默认30天**/
                    d = new Date();
                    d.setTime(d.getTime() + days * 24 * 60 * 60 * 1000);
                    c += ";expires =" + d.toGMTString();
                }
                if (path) {
                    c += ";path=" + path;
                }
                if (domain) {
                    c += ";domain=" + domain;
                }
                if (secure) {
                    c += ";secure";
                }
                document.cookie = c;
            },
            decodeStr: function (str) {
                var ret = "",
                    i, len = str.length;
                for (i = 0; i < len; i++) {
                    var chr = str.charAt(i);
                    if (chr == "+") {
                        ret += " ";
                    } else if (chr == "%") {
                        var asc = str.substring(i + 1, i + 3);
                        if (parseInt("0x" + asc) > 0x7f) {
                            ret += decodeURI("%" + str.substring(i + 1, i + 9));
                            i += 8;
                        } else {
                            ret += String.fromCharCode(parseInt("0x" + asc));
                            i += 2;
                        }
                    } else {
                        ret += chr;
                    }
                }
                return ret;
            },
            deleteCookie: function (name, domain, path, secure) {
                var c = encodeURIComponent(name) + "=" + encodeURIComponent("a");
                var date = new Date();
                date.setTime(date.getTime() - 10000);
                c += ";expires =" + date.toGMTString();
                if (path) {
                    c += ";path=" + path;
                }
                if (domain) {
                    c += ";domain=" + domain;
                }
                if (secure) {
                    c += ";secure";
                }
                document.cookie = c;
            }
        };
    }();

    //公用方法.
    DT.Tools = function () {
        return {

            //获取当前项在数组中的index值.兼容ie9以下浏览器.
            arrayIndexOf: function (el, arr) {

                //if(typeof arr !== 'object') return -1;
                for (var i = 0, n = arr.length; i < n; i++) {
                    if (arr[i] === el) {
                        return i;
                    }
                }
                return -1;
            }
        };
    }();

    //导航初始化.
    DT.initialize();
    //若页面中引入了sortable组件则直接添加拖拽方法，否则先加载sortable组件，然后在加载完成后回调拖拽方法.
    if (typeof $.fn.sortable !== "function") {
        BL.Util.JSONP("http://www.chinaso.com/common/base/js/chinaso-sortable.js", '', DT.bindNavEvent._initDrag);
    } else {
        //添加拖拽事件.
        DT.bindNavEvent._initDrag();
    }
}));