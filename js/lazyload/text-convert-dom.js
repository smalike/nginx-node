/**
 * 元素延迟加载功能组件，页面文本缓存数据方式
 * 完成页面延迟加载，利用滚动条位置触发显示元素
 * 目前使用的是 textarea 保存文本内容（但是不局限于 textarea）
 * @TODO 没有利用容器元素的显示区域去判断应该显示的元素，会引发不必要的元素加载
 */
var TextConvertDom = {
    
    /**
     * 初始化函数
     * 完成延迟加载元素事件绑定
     * 利用自定义事件 showview 处理手动触发显示内容功能
     * @param {Object} setting 功能参数设定
     */
    initialize: function (setting) {
        var T = this;
        T.defaults = {
        
            // 目标加载项偏移值
            // 会在指定偏移值内加载
            offset: 100,
        
            // 指定延迟加载元素
            eles: ".lazy_text_wrapper",
        
            // 数据加载完成处理函数
            done: function () {}
        };
        T.defaults = $.extend(T.defaults, setting);
        $(T.defaults.eles).on("showview", function () {
            T.showview(this);
        });
        $(window).on("scroll resize", function () {
            T.isShow();
        });
        T.isShow();
    },
    
    /**
     * 是否执行加载内容
     * 自上而下的方式判断可见元素的加载状态
     */
    isShow: function () {
        var T = this,
            $eles = $(T.defaults.eles),
            i, len = $eles.length,
            $ele, dom = (typeof document.compatMode != 'undefined' && document.compatMode != 'BackCompat') ? 
                document.documentElement : 
                document.body,
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
     * 根据指定延迟加载元素，转换存储的文本缓存数据
     * 这里删除了存储缓存数据的包装元素（应该是 textarea）
     * @param {DOM} cur 执行加载目标元素
     */
    showview: function (cur) {
        var T = this,
            $cur = $(cur),
            $curView = $($.parseHTML($cur.val()));
        $curView.insertBefore($cur);
        T.publish($curView, $cur.data());
        $cur.remove();
    },
    
    /**
     * 执行数据加载完成自定义处理函数
     * @param {DOM} $cur 延迟加载目标元素
     */
    publish: function ($cur, dataObj) {
        this.defaults.done($cur, dataObj);
    }
};