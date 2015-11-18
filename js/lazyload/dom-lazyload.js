/**
 * 元素延迟加载功能组件，异步请求数据方式
 * 完成页面延迟加载，利用滚动条位置触发显示元素
 * @param {Object} setting 调用对象具体设定
 * @TODO 没有利用容器元素的显示区域去判断应该显示的元素，会引发不必要的元素加载
 */
function DomLazyload(setting) {
    var T = this;
    setting = setting || {};
    T.defaults = {
        
        // 指定延迟加载元素
        eles: ".lazy_wrapper",
        
        // 等待加载类
        // 会显示等待加载效果
        // 加载完成后会被删除
        loadingCls: "wrapper_loading",
        
        // 延迟加载导航路由
        // 包含各个延迟加载元素的请求地址等信息
        lazyNav: "#lazy_nav",
        
        // 请求类型
        fatchType: "GET",
        
        // 请求数据格式
        fatchDataType: "html",
        
        // 目标加载项偏移值
        // 会在指定偏移值内加载
        offset: 100,
        
        // 延迟加载项是否存在过多请求
        isFatchUrls: true,
        
        // 数据加载完成处理函数
        done: function () {}
    };
    T.defaults = $.extend(T.defaults, setting);
    T.init();
    T.isShow();
}

DomLazyload.prototype = {
    
    /**
     * 初始化函数
     * 完成延迟加载元素事件绑定
     * 利用自定义事件 showview 处理手动触发显示内容功能
     */
    init: function () {
        var T = this;
        $(T.defaults.eles).on("showview", function () {T.showview(this);});
        $(window).on("scroll resize", function (e) {
            T.isShow();
        });
    },
    
    /**
     * 是否执行加载内容
     * 自上而下的方式判断可见元素的加载状态
     */
    isShow: function () {
        var T = this,
            $eles = $(T.defaults.eles),
            i,
            len = $eles.length,
            $ele,
            dom = (typeof document.compatMode != 'undefined' && document.compatMode != 'BackCompat') ?  document.documentElement : document.body,
            scrollY = ~~(dom.scrollTop ? dom.scrollTop : window.scrollY);
        for (i = 0; i < len; i++) {
            $ele = $eles.eq(i);
            if (!$ele.data("isshow") && scrollY > $ele.offset().top - T.defaults.offset - dom.clientHeight) {
                $ele.data("isshow", 1);
                $ele.trigger("showview");
            }
        }
    },
    
    /**
     * 根据指定延迟加载元素，获得请求地址，执行数据请求
     * 请求完成后填充元素内容，最后执行数据加载完成自定义处理函数
     * @param {DOM} cur 执行加载目标元素
     */
    showview: function (cur) {
        var T = this,
            $cur = $(cur);
        
        // 判断是否存在多个请求数据源
        if (T.defaults.isFatchUrls) {
            T.fatchMore($cur, T.getUrlArr(cur));
        } else {
            T.fatch(T.getUrl(cur), T.defaults.fatchType, T.defaults.fatchDataType).done(function (html) {
                $cur.removeClass(T.defaults.loadingCls);
                $cur.append(html);
                T.publish($cur);
            });
        }
    },
    
    /**
     * 根据延迟加载元素的索引获得获得请求地址集合
     * @param   {DOM}   cur 延迟加载元素
     * @returns {Array} 请求地址集合
     */
    getUrlArr: function (cur) {
        var T = this,
            url;
        url = $(T.defaults.lazyNav).find("a").eq($(cur).index(T.defaults.eles)).attr("href");
        return url.split(",");
    },
    
    /**
     * 根据延迟加载元素的索引获得获得请求地址
     * @param   {DOM}   cur 延迟加载元素
     * @returns {String} 请求地址
     */
    getUrl: function (cur) {
        var T = this;
        return $(T.defaults.lazyNav).find("a").eq($(cur).index(T.defaults.eles)).attr("href");
    },
    
    /**
     * 处理一次多个请求的完成状态
     * @param   {Array}   urls 地址数据集合
     * @returns {Promise} 异步执行对象
     */
    asyncEvent: function (urls) {
        var T = this,
            i,
            len = urls.length,
            resolveCount = len,
            dfd = new jQuery.Deferred,
            jsonArr = [];
        for (i = 0; i < len; i++) {
            (function (i) {
                T.fatch(urls[i], T.defaults.fatchType, T.defaults.fatchDataType).done(function (html) {
                    jsonArr[i] = html;
                    if (!--resolveCount) {
                        dfd.resolve(jsonArr.join(""));
                    }
                });
            }(i));
        }
        return dfd.promise();
    },
    
    /**
     * 执行延迟对象的多个请求
     * @param {DOM}   $cur 延迟加载对象
     * @param {Array} urls 请求地址集合
     */
    fatchMore: function ($cur, urls) {
        var T = this;
        $.when(T.asyncEvent(urls)).done(function (a) {
            $cur.removeClass(T.defaults.loadingCls);
            $cur.append(a);
            T.publish($cur);
        });
    },
    
    /**
     * 发送异步请求
     * @param   {String} url      请求地址
     * @param   {String} type     请求类型
     * @param   {String} dataType 请求数据类型
     * @returns {Object} 异步请求对象
     */
    fatch: function (url, type, dataType) {
        return $.ajax({
            url: url,
            type: type,
            dataType: dataType
        });
    },
    
    /**
     * 执行数据加载完成自定义处理函数
     * @param {DOM} $cur 延迟加载目标元素
     */
    publish: function ($cur) {
        this.defaults.done($cur);
    }
};