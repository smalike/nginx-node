/**
 * 公共组件 - 网页底部文本渲染
 * 考虑外站引用和嵌套问题，由配置页面改为 js 代码添加，应用本本文件即可
 * 主要添加 关于我们、和版权信息等内容
 * 
 * TODO：
 * 1.重复代码没有抽象出来
 * 2.公共组件不应该依赖jquery组件
 */
;(function(){
    
    // 最终添加页面文本字符
	var html = '',
        
        // 存储版权信息
        str = '',
        
        // 底部具体文本字符内容
        footer_str = '',
        
        // 当前页面 URL 地址，用来区分不同频道显示不同底部信息
        curHref = window.location.href,
        
        // 关于我们等链接信息字符文本
		hrefs = '<a href="http://www.chinaso.com/home/aboutus.html" target="_blank">关于我们</a>'+
				'<span>|</span>'+
				'<a href="http://www.chinaso.com/home/contactus.html" target="_blank">联系我们</a>'+
				'<span>|</span>'+
				'<a href="http://www.chinaso.com/home/say_chinaso_wzslsq.html" target="_blank">对国搜说</a>'+
				'<span>|</span>'+
				'<a href="http://www.chinaso.com/home/cooperate.html" target="_blank">合作伙伴</a>'+
				'<span>|</span>'+
				'<a href="http://www.chinaso.com/home/product.html" target="_blank">产品中心</a>'+
				'<span>|</span>'+
				'<a href="http://hr.chinaso.com" target="_blank">国搜招聘</a>'+
				'<span>|</span>'+
				'<a href="http://www.chinaso.com/home/link.html" target="_blank">链接国搜</a>'+
				'<span>|</span>'+
				'<a href="http://www.chinaso.com/home/service.html" target="_blank">服务协议</a>'+
				'<span>|</span>'+
				'<a href="http://zhanzhang.chinaso.com" target="_blank">站长之家</a>'+
				'<span>|</span>'+
				'<a href="http://net.china.com.cn/index.htm" target="_blank">暴恐音视频举报专区</a>',
        
        // 著名信息字符
		contact_str = '<p>'+ hrefs +
				'<span class="copyright">&copy;2015 中国搜索</span>'+
				'</p>'+'<div class="foot_text">'+
				'本网页所呈现之内容，如无特别注明，均系系统自动抓取而得，不代表中国搜索之立场。如有意见或投诉，请点击页面下方的"对国搜说"，欢迎及时反馈。'+
				'</div>',
        
        // 普通版权信息
		noExp_str = '<div class="footer footIndex">'+
				'<p>'+ hrefs + 
				'<span class="copyright">&copy;2015 中国搜索</span>'+
				'</p>'+
				'<div class="footerBot"><span class="mgr17">京ICP证：140400号</span><span class="mgr17">互联网新闻信息服务许可：1012014003号</span><span>京公网安备：110402440036</span></div>'+
				'</div>',
        
        // 处理 IE 问题添加处理类
        // TODO：目测与 noExp_str 提供的字符除特殊类外没有特殊区别，可以提供变量解决字符全重写问题
		noExp_str_small = '<div class="footer footIndex footerPoI">'+
				'<p>'+ hrefs + 
				'<span class="copyright">&copy;2015 中国搜索</span>'+
				'</p>'+
				'<div class="footerBot"><span class="mgr17">京ICP证：140400号</span><span class="mgr17">互联网新闻信息服务许可：1012014003号</span><span>京公网安备：110402440036</span></div>'+
				'</div>';

	if(curHref.match(/http:\/\/news.chinaso.com/)){
		str = '<p><span class="mgr17">京公网安备：110402440036号</span><span>互联网新闻信息服务许可：1012014003号</span></p>';
		footer_str = contact_str + str;
//		document.write('<div class="footer f_n">'+footer_str +'</div>');
        html += '<div class="footer f_n">'+footer_str +'</div>';
	}else if(curHref.match(/http:\/\/(www\.)?chinaso.com[\/|\/index.html]/)) {
        
		//兼容IE8不支持响应式高度的问题.
		if ($(window).height() < 680) {
			footer_str = noExp_str_small;
		}else{
			footer_str = noExp_str;
		};		
//		document.write(footer_str);
        html += footer_str;
	}else{
		str = '<p><span>京ICP证：140400号</span></p>';
		footer_str = contact_str + str;
//		document.write('<div class="footer f_n">'+footer_str +'</div>');
        html += '<div class="footer f_n">'+footer_str +'</div>';
	}
    
    // 修改 write 行为
    // 根据当前 script 元素位置添加 footer 内容
    var script = document.scripts,
        node = script[script.length - 1],
        pBody = node.parentNode;
    pBody.insertBefore($(html)[0], node);
//    document.write(html);
	
	//兼容IE8不支持响应式高度的问题.
	$(window).resize(function(){
		var winH = $(window).height(),
			$footer = $('div.footIndex');
		if (winH < 680) {
			if(!$footer.hasClass('footerPoI')){
				$footer.addClass('footerPoI');
			}
		}else{
			$footer.removeClass('footerPoI');
		};
	});

//	var footer = document.getElementById("id_footer");
//	footer && footer.parentNode.removeChild(footer);
})();