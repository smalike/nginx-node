//切换插件 2014-08-28
(function($){
	$.fn.extend({
		fadeSlide : function(options){
			var defaults = {
				fadeBtn : '.arr',//切换按钮
				fadeDots : '.fadeDots',//切换圆点序列（如有）
				fadeCon : '.fadeCon',//切换内容容器
				fadeCurClass : 'cur',//圆点选中类名
				dotsEvent : 'click',//圆点触发事件
				fadeTime : 300,//切换动画时长
				fadeRange : 15000,//切换间隔
				autoFade : false//自动切换
			}
			var options = $.extend(defaults, options),
				$fadeWrap = this,
				$fadeBtn = $fadeWrap.find(options.fadeBtn),
				$fadeDots = $fadeWrap.find(options.fadeDots),
				$fadeCon = $fadeWrap.find(options.fadeCon),
				len = $fadeCon.length,
				autoFlag = null;
			$fadeDots.on(options.dotsEvent, function(){				
				if(!$(this).hasClass(options.fadeCurClass))
					fadeOutFn($(this).index());
			});
			$fadeBtn.on('click', function(){
				var index = ($fadeWrap.find($('.' + options.fadeCurClass)).index() + (($(this).hasClass('next')) ? 1 : (-1))) % len;
				fadeOutFn(index);
			})
			$fadeWrap.on('mouseenter', function(){
				clearTimeout(autoFlag);
			}).on('mouseleave', function(){
				var $that = $(this);
				(!options.autoFade) || _setAutoFlag();
			})
			$(document).ready(function(){
				var $that = $(this);
				(!options.autoFade) || _setAutoFlag();
			});
			function autoFadeFn(direct){
				clearTimeout(autoFlag);
				var direct = direct || 'next', index = ($fadeWrap.find($('.' + options.fadeCurClass)).index() + ((direct == 'next') ? 1 : (-1))) % len;
				fadeOutFn(index);
				_setAutoFlag();
			}
			function _setAutoFlag(){
				autoFlag = setTimeout(function(){
					autoFadeFn('next')
				}, options.fadeRange);
			}
			function fadeOutFn(index){
				$fadeDots.removeClass(options.fadeCurClass).eq(index).addClass(options.fadeCurClass);
				$fadeCon.hide().eq(index).fadeIn(options.fadeTime);
			}
			return {
				fadeOutFn : fadeOutFn
			}
		},
		slideImage : function(options){
			//default
			var defaults = {
				slideEl : 'slide-li',
				slideElMg : 10,
				slideBtn : 'slide-arr',
				slideTime : 1000,
				slideRange : 7000,
				slideNum : 5,
				autoSlide : true,
				afterCallback: function () {},
				beforeCallback: function () {}
			};
			var inter, enable = true;
			var options = $.extend(defaults, options),
				$slideWrap = $(this),
				$slideEls = $slideWrap.find(options.slideEl),
				$slideList = $slideEls.parent(),
				slideWrapWidth = $slideWrap.width(),
				slideElWidth = $slideEls.width() + options.slideElMg,
				slideStep = options.slideNum * slideElWidth,
				$slideBtn = $slideWrap.find(options.slideBtn);
			
			$slideBtn.on('click', function(){
				if(!enable) return;
				if($(this).hasClass('next'))
					_slideToLeft();
				else
					_slideToRight();
			});
			$(document).ready(function(){
				$slideList.css({width : ($slideEls.length + options.slideNum) * slideElWidth, left : 0});
				_setAutoSlide();
			});
			$slideWrap.on('mouseenter', function(){//检测鼠标移入移出
				clearTimeout(inter);
			}).on('mouseleave', function(){
				_setAutoSlide();
			});
			function _setAutoSlide(){//自动滚动
				clearTimeout(inter);
				if(options.autoSlide){
					inter = setTimeout(function(){
						_slideToLeft();
						_setAutoSlide();
					}, options.slideRange);
				}
			}
			function _slideToLeft(){
				options.afterCallback.call($slideWrap);
				enable = false;
				var elClones = $slideWrap.find(options.slideEl).slice(0, options.slideNum);
				$slideList.append(elClones.clone());
				$slideList.animate({left : '-=' + slideStep}, options.slideTime, function(){
					elClones.remove();
					$slideList.css({ left : '+=' + slideStep});
					enable = true;
				});
				options.beforeCallback.call($slideWrap);
			}
			function _slideToRight(){
				options.afterCallback.call($slideWrap);
				enable = false;
				var elClones = $slideWrap.find(options.slideEl).slice('-' + options.slideNum);
				$slideList.prepend(elClones.clone());
				$slideList.css({left : '-=' + slideStep});
				$slideList.animate({left : '+=' + slideStep}, options.slideTime, function(){
					elClones.remove();
					enable = true;
				});
				options.beforeCallback.call($slideWrap);
			}			
		},
		rollText : function(options){//列表文字自动上滚
			var defaults = {
				rollList : 'ul',
				rollEls : 'li',
				rollNum : 1,
				rollTime : 1000,
				rollRange : 3000,
				autoRoll : true
			};
			var options = $.extend(defaults, options);
			var $rollWrap = $(this),
				$rollList = $rollWrap.find(options.rollList),
				autoInter;
			$rollWrap.on('mouseenter', function(){
				_clearAutoRoll();
			}).on('mouseleave', function(){
				_setAutoRoll();
			})
			$(document).ready(function(){
				_setAutoRoll();
			});
			function _setAutoRoll(){
				if(options.autoRoll){
					autoInter = setTimeout(function(){
						$rollList.each(function(){
							var $wrap = $(this);
							var $origs = $wrap.find(options.rollEls).slice(0, options.rollNum);
							$wrap.append($origs.clone());
							$origs.slideUp(options.rollTime, function(){
								$origs.remove();
							});
						});
						 _setAutoRoll();
					}, options.rollRange);
				}				
			}
			function _clearAutoRoll(){
				clearTimeout(autoInter);
			}
		},
		autoRoll : function(options){
			var defaults = {
				rollTitle : '.channel-wrap a',
				rollEls : '.juhe-con-wrap',
				rollConTime : 10000
			};

			var options = $.extend(defaults, options);
			var $rollWrap = $(this),
				$rollTitle = $rollWrap.find(options.rollTitle);
				$rollEls = $rollWrap.find(options.rollEls);
				$rollEleLength = $rollWrap.find(options.rollEls).length;
				$rollConTime = options.rollConTime;

			$(document).ready(function(){
				_autoContentRoll();
			});

			function bigImgIndex() {
				$rollEls.each(function(i, el) {
				  if ($(el).is(':visible')) {
				    bigIndex = i;
				  }
				});
				return bigIndex;
			}

			function _autoContentRoll(){	

				function slideRoll(){ 
					var conIndex = bigImgIndex();
					if ( conIndex == ($rollEleLength-1) ) {
						conIndex = -1;
					} 

					$rollTitle.eq(conIndex).removeClass('cur');
					$rollTitle.eq(conIndex + 1).addClass('cur');

					$rollEls.eq(conIndex).hide();
					$rollEls.eq(conIndex + 1).show();
				} 
				slideAction = setInterval(slideRoll, $rollConTime);
			} 

			$rollTitle.mouseover(function(){
					clearInterval(slideAction); 
					var conIndex = bigImgIndex();
					$rollTitle.removeClass('cur').eq($(this).index()).addClass('cur');
					$rollEls.hide().eq($(this).index()).fadeIn(300);
				}).mouseout(function(){
				   _autoContentRoll()
			});
		}

	});
})(jQuery);



//切换插件 2014-08-28
(function($){
	$.fn.extend({
		fadeSlide : function(options){
			var defaults = {
				fadeBtn : '.arr',//切换按钮
				fadeDots : '.fadeDots',//切换圆点序列（如有）
				fadeCon : '.fadeCon',//切换内容容器
				fadeCurClass : 'cur',//圆点选中类名
				dotsEvent : 'click',//圆点触发事件
				fadeTime : 300,//切换动画时长
				fadeRange : 15000,//切换间隔
				autoFade : false//自动切换
			}
			var options = $.extend(defaults, options),
				$fadeWrap = this,
				$fadeBtn = $fadeWrap.find(options.fadeBtn),
				$fadeDots = $fadeWrap.find(options.fadeDots),
				$fadeCon = $fadeWrap.find(options.fadeCon),
				len = $fadeCon.length,
				autoFlag = null;
			$fadeDots.on(options.dotsEvent, function(){				
				if(!$(this).hasClass(options.fadeCurClass))
					fadeOutFn($(this).index());
			});
			$fadeBtn.on('click', function(){
				var index = ($fadeWrap.find($('.' + options.fadeCurClass)).index() + (($(this).hasClass('next')) ? 1 : (-1))) % len;
				fadeOutFn(index);
			})
			$fadeWrap.on('mouseenter', function(){
				clearTimeout(autoFlag);
			}).on('mouseleave', function(){
				var $that = $(this);
				(!options.autoFade) || _setAutoFlag();
			})
			$(document).ready(function(){
				var $that = $(this);
				(!options.autoFade) || _setAutoFlag();
			});
			function autoFadeFn(direct){
				clearTimeout(autoFlag);
				var direct = direct || 'next', index = ($fadeWrap.find($('.' + options.fadeCurClass)).index() + ((direct == 'next') ? 1 : (-1))) % len;
				fadeOutFn(index);
				_setAutoFlag();
			}
			function _setAutoFlag(){
				autoFlag = setTimeout(function(){
					autoFadeFn('next')
				}, options.fadeRange);
			}
			function fadeOutFn(index){
				$fadeDots.removeClass(options.fadeCurClass).eq(index).addClass(options.fadeCurClass);
				$fadeCon.hide().eq(index).fadeIn(options.fadeTime);
			}
			return {
				fadeOutFn : fadeOutFn
			}
		},
		slideImage : function(options){
			//default
			var defaults = {
				slideEl : 'slide-li',
				slideElMg : 10,
				slideBtn : 'slide-arr',
				slideTime : 1000,
				slideRange : 7000,
				slideNum : 5,
				autoSlide : true,
				afterCallback: function () {},
				beforeCallback: function () {}
			};
			var inter, enable = true;
			var options = $.extend(defaults, options),
				$slideWrap = $(this),
				$slideEls = $slideWrap.find(options.slideEl),
				$slideList = $slideEls.parent(),
				slideWrapWidth = $slideWrap.width(),
				slideElWidth = $slideEls.width() + options.slideElMg,
				slideStep = options.slideNum * slideElWidth,
				$slideBtn = $slideWrap.find(options.slideBtn);
			
			$slideBtn.on('click', function(){
				if(!enable) return;
				if($(this).hasClass('next'))
					_slideToLeft();
				else
					_slideToRight();
			});
			$(document).ready(function(){
				$slideList.css({width : ($slideEls.length + options.slideNum) * slideElWidth, left : 0});
				_setAutoSlide();
			});
			$slideWrap.on('mouseenter', function(){//检测鼠标移入移出
				clearTimeout(inter);
			}).on('mouseleave', function(){
				_setAutoSlide();
			});
			function _setAutoSlide(){//自动滚动
				clearTimeout(inter);
				if(options.autoSlide){
					inter = setTimeout(function(){
						_slideToLeft();
						_setAutoSlide();
					}, options.slideRange);
				}
			}
			function _slideToLeft(){
				options.afterCallback.call($slideWrap);
				enable = false;
				var elClones = $slideWrap.find(options.slideEl).slice(0, options.slideNum);
				$slideList.append(elClones.clone());
				$slideList.animate({left : '-=' + slideStep}, options.slideTime, function(){
					elClones.remove();
					$slideList.css({ left : '+=' + slideStep});
					enable = true;
				});
				options.beforeCallback.call($slideWrap);
			}
			function _slideToRight(){
				options.afterCallback.call($slideWrap);
				enable = false;
				var elClones = $slideWrap.find(options.slideEl).slice('-' + options.slideNum);
				$slideList.prepend(elClones.clone());
				$slideList.css({left : '-=' + slideStep});
				$slideList.animate({left : '+=' + slideStep}, options.slideTime, function(){
					elClones.remove();
					enable = true;
				});
				options.beforeCallback.call($slideWrap);
			}			
		},
		rollText : function(options){//列表文字自动上滚
			var defaults = {
				rollList : 'ul',
				rollEls : 'li',
				rollNum : 1,
				rollTime : 1000,
				rollRange : 3000,
				autoRoll : true
			};
			var options = $.extend(defaults, options);
			var $rollWrap = $(this),
				$rollList = $rollWrap.find(options.rollList),
				autoInter;
			$rollWrap.on('mouseenter', function(){
				_clearAutoRoll();
			}).on('mouseleave', function(){
				_setAutoRoll();
			})
			$(document).ready(function(){
				_setAutoRoll();
			});
			function _setAutoRoll(){
				if(options.autoRoll){
					autoInter = setTimeout(function(){
						$rollList.each(function(){
							var $wrap = $(this);
							var $origs = $wrap.find(options.rollEls).slice(0, options.rollNum);
							$wrap.append($origs.clone());
							$origs.slideUp(options.rollTime, function(){
								$origs.remove();
							});
						});
						 _setAutoRoll();
					}, options.rollRange);
				}				
			}
			function _clearAutoRoll(){
				clearTimeout(autoInter);
			}
		},
		autoRoll : function(options){
			var defaults = {
				rollTitle : '.channel-wrap a',
				rollEls : '.juhe-con-wrap',
				rollConTime : 10000
			};

			var options = $.extend(defaults, options);
			var $rollWrap = $(this),
				$rollTitle = $rollWrap.find(options.rollTitle);
				$rollEls = $rollWrap.find(options.rollEls);
				$rollEleLength = $rollWrap.find(options.rollEls).length;
				$rollConTime = options.rollConTime;

			$(document).ready(function(){
				_autoContentRoll();
			});

			function bigImgIndex() {
				$rollEls.each(function(i, el) {
				  if ($(el).is(':visible')) {
				    bigIndex = i;
				  }
				});
				return bigIndex;
			}

			function _autoContentRoll(){	

				function slideRoll(){ 
					var conIndex = bigImgIndex();
					if ( conIndex == ($rollEleLength-1) ) {
						conIndex = -1;
					} 

					$rollTitle.eq(conIndex).removeClass('cur');
					$rollTitle.eq(conIndex + 1).addClass('cur');

					$rollEls.eq(conIndex).hide();
					$rollEls.eq(conIndex + 1).show();
				} 
				slideAction = setInterval(slideRoll, $rollConTime);
			} 

			$rollTitle.mouseover(function(){
					clearInterval(slideAction); 
					var conIndex = bigImgIndex();
					$rollTitle.removeClass('cur').eq($(this).index()).addClass('cur');
					$rollEls.hide().eq($(this).index()).fadeIn(300);
				}).mouseout(function(){
				   _autoContentRoll()
			});
		}

	});
})(jQuery);



//切换插件 2014-08-28
(function($){
	$.fn.extend({
		fadeSlide : function(options){
			var defaults = {
				fadeBtn : '.arr',//切换按钮
				fadeDots : '.fadeDots',//切换圆点序列（如有）
				fadeCon : '.fadeCon',//切换内容容器
				fadeCurClass : 'cur',//圆点选中类名
				dotsEvent : 'click',//圆点触发事件
				fadeTime : 300,//切换动画时长
				fadeRange : 15000,//切换间隔
				autoFade : false//自动切换
			}
			var options = $.extend(defaults, options),
				$fadeWrap = this,
				$fadeBtn = $fadeWrap.find(options.fadeBtn),
				$fadeDots = $fadeWrap.find(options.fadeDots),
				$fadeCon = $fadeWrap.find(options.fadeCon),
				len = $fadeCon.length,
				autoFlag = null;
			$fadeDots.on(options.dotsEvent, function(){				
				if(!$(this).hasClass(options.fadeCurClass))
					fadeOutFn($(this).index());
			});
			$fadeBtn.on('click', function(){
				var index = ($fadeWrap.find($('.' + options.fadeCurClass)).index() + (($(this).hasClass('next')) ? 1 : (-1))) % len;
				fadeOutFn(index);
			})
			$fadeWrap.on('mouseenter', function(){
				clearTimeout(autoFlag);
			}).on('mouseleave', function(){
				var $that = $(this);
				(!options.autoFade) || _setAutoFlag();
			})
			$(document).ready(function(){
				var $that = $(this);
				(!options.autoFade) || _setAutoFlag();
			});
			function autoFadeFn(direct){
				clearTimeout(autoFlag);
				var direct = direct || 'next', index = ($fadeWrap.find($('.' + options.fadeCurClass)).index() + ((direct == 'next') ? 1 : (-1))) % len;
				fadeOutFn(index);
				_setAutoFlag();
			}
			function _setAutoFlag(){
				autoFlag = setTimeout(function(){
					autoFadeFn('next')
				}, options.fadeRange);
			}
			function fadeOutFn(index){
				$fadeDots.removeClass(options.fadeCurClass).eq(index).addClass(options.fadeCurClass);
				$fadeCon.hide().eq(index).fadeIn(options.fadeTime);
			}
			return {
				fadeOutFn : fadeOutFn
			}
		},
		slideImage : function(options){
			//default
			var defaults = {
				slideEl : 'slide-li',
				slideElMg : 10,
				slideBtn : 'slide-arr',
				slideTime : 1000,
				slideRange : 7000,
				slideNum : 5,
				autoSlide : true,
				afterCallback: function () {},
				beforeCallback: function () {}
			};
			var inter, enable = true;
			var options = $.extend(defaults, options),
				$slideWrap = $(this),
				$slideEls = $slideWrap.find(options.slideEl),
				$slideList = $slideEls.parent(),
				slideWrapWidth = $slideWrap.width(),
				slideElWidth = $slideEls.width() + options.slideElMg,
				slideStep = options.slideNum * slideElWidth,
				$slideBtn = $slideWrap.find(options.slideBtn);
			
			$slideBtn.on('click', function(){
				if(!enable) return;
				if($(this).hasClass('next'))
					_slideToLeft();
				else
					_slideToRight();
			});
			$(document).ready(function(){
				$slideList.css({width : ($slideEls.length + options.slideNum) * slideElWidth, left : 0});
				_setAutoSlide();
			});
			$slideWrap.on('mouseenter', function(){//检测鼠标移入移出
				clearTimeout(inter);
			}).on('mouseleave', function(){
				_setAutoSlide();
			});
			function _setAutoSlide(){//自动滚动
				clearTimeout(inter);
				if(options.autoSlide){
					inter = setTimeout(function(){
						_slideToLeft();
						_setAutoSlide();
					}, options.slideRange);
				}
			}
			function _slideToLeft(){
				options.afterCallback.call($slideWrap);
				enable = false;
				var elClones = $slideWrap.find(options.slideEl).slice(0, options.slideNum);
				$slideList.append(elClones.clone());
				$slideList.animate({left : '-=' + slideStep}, options.slideTime, function(){
					elClones.remove();
					$slideList.css({ left : '+=' + slideStep});
					enable = true;
				});
				options.beforeCallback.call($slideWrap);
			}
			function _slideToRight(){
				options.afterCallback.call($slideWrap);
				enable = false;
				var elClones = $slideWrap.find(options.slideEl).slice('-' + options.slideNum);
				$slideList.prepend(elClones.clone());
				$slideList.css({left : '-=' + slideStep});
				$slideList.animate({left : '+=' + slideStep}, options.slideTime, function(){
					elClones.remove();
					enable = true;
				});
				options.beforeCallback.call($slideWrap);
			}			
		},
		rollText : function(options){//列表文字自动上滚
			var defaults = {
				rollList : 'ul',
				rollEls : 'li',
				rollNum : 1,
				rollTime : 1000,
				rollRange : 3000,
				autoRoll : true
			};
			var options = $.extend(defaults, options);
			var $rollWrap = $(this),
				$rollList = $rollWrap.find(options.rollList),
				autoInter;
			$rollWrap.on('mouseenter', function(){
				_clearAutoRoll();
			}).on('mouseleave', function(){
				_setAutoRoll();
			})
			$(document).ready(function(){
				_setAutoRoll();
			});
			function _setAutoRoll(){
				if(options.autoRoll){
					autoInter = setTimeout(function(){
						$rollList.each(function(){
							var $wrap = $(this);
							var $origs = $wrap.find(options.rollEls).slice(0, options.rollNum);
							$wrap.append($origs.clone());
							$origs.slideUp(options.rollTime, function(){
								$origs.remove();
							});
						});
						 _setAutoRoll();
					}, options.rollRange);
				}				
			}
			function _clearAutoRoll(){
				clearTimeout(autoInter);
			}
		},
		autoRoll : function(options){
			var defaults = {
				rollTitle : '.channel-wrap a',
				rollEls : '.juhe-con-wrap',
				rollConTime : 10000
			};

			var options = $.extend(defaults, options);
			var $rollWrap = $(this),
				$rollTitle = $rollWrap.find(options.rollTitle);
				$rollEls = $rollWrap.find(options.rollEls);
				$rollEleLength = $rollWrap.find(options.rollEls).length;
				$rollConTime = options.rollConTime;

			$(document).ready(function(){
				_autoContentRoll();
			});

			function bigImgIndex() {
				$rollEls.each(function(i, el) {
				  if ($(el).is(':visible')) {
				    bigIndex = i;
				  }
				});
				return bigIndex;
			}

			function _autoContentRoll(){	

				function slideRoll(){ 
					var conIndex = bigImgIndex();
					if ( conIndex == ($rollEleLength-1) ) {
						conIndex = -1;
					} 

					$rollTitle.eq(conIndex).removeClass('cur');
					$rollTitle.eq(conIndex + 1).addClass('cur');

					$rollEls.eq(conIndex).hide();
					$rollEls.eq(conIndex + 1).show();
				} 
				slideAction = setInterval(slideRoll, $rollConTime);
			} 

			$rollTitle.mouseover(function(){
					clearInterval(slideAction); 
					var conIndex = bigImgIndex();
					$rollTitle.removeClass('cur').eq($(this).index()).addClass('cur');
					$rollEls.hide().eq($(this).index()).fadeIn(300);
				}).mouseout(function(){
				   _autoContentRoll()
			});
		}

	});
})(jQuery);



//切换插件 2014-08-28
(function($){
	$.fn.extend({
		fadeSlide : function(options){
			var defaults = {
				fadeBtn : '.arr',//切换按钮
				fadeDots : '.fadeDots',//切换圆点序列（如有）
				fadeCon : '.fadeCon',//切换内容容器
				fadeCurClass : 'cur',//圆点选中类名
				dotsEvent : 'click',//圆点触发事件
				fadeTime : 300,//切换动画时长
				fadeRange : 15000,//切换间隔
				autoFade : false//自动切换
			}
			var options = $.extend(defaults, options),
				$fadeWrap = this,
				$fadeBtn = $fadeWrap.find(options.fadeBtn),
				$fadeDots = $fadeWrap.find(options.fadeDots),
				$fadeCon = $fadeWrap.find(options.fadeCon),
				len = $fadeCon.length,
				autoFlag = null;
			$fadeDots.on(options.dotsEvent, function(){				
				if(!$(this).hasClass(options.fadeCurClass))
					fadeOutFn($(this).index());
			});
			$fadeBtn.on('click', function(){
				var index = ($fadeWrap.find($('.' + options.fadeCurClass)).index() + (($(this).hasClass('next')) ? 1 : (-1))) % len;
				fadeOutFn(index);
			})
			$fadeWrap.on('mouseenter', function(){
				clearTimeout(autoFlag);
			}).on('mouseleave', function(){
				var $that = $(this);
				(!options.autoFade) || _setAutoFlag();
			})
			$(document).ready(function(){
				var $that = $(this);
				(!options.autoFade) || _setAutoFlag();
			});
			function autoFadeFn(direct){
				clearTimeout(autoFlag);
				var direct = direct || 'next', index = ($fadeWrap.find($('.' + options.fadeCurClass)).index() + ((direct == 'next') ? 1 : (-1))) % len;
				fadeOutFn(index);
				_setAutoFlag();
			}
			function _setAutoFlag(){
				autoFlag = setTimeout(function(){
					autoFadeFn('next')
				}, options.fadeRange);
			}
			function fadeOutFn(index){
				$fadeDots.removeClass(options.fadeCurClass).eq(index).addClass(options.fadeCurClass);
				$fadeCon.hide().eq(index).fadeIn(options.fadeTime);
			}
			return {
				fadeOutFn : fadeOutFn
			}
		},
		slideImage : function(options){
			//default
			var defaults = {
				slideEl : 'slide-li',
				slideElMg : 10,
				slideBtn : 'slide-arr',
				slideTime : 1000,
				slideRange : 7000,
				slideNum : 5,
				autoSlide : true,
				afterCallback: function () {},
				beforeCallback: function () {}
			};
			var inter, enable = true;
			var options = $.extend(defaults, options),
				$slideWrap = $(this),
				$slideEls = $slideWrap.find(options.slideEl),
				$slideList = $slideEls.parent(),
				slideWrapWidth = $slideWrap.width(),
				slideElWidth = $slideEls.width() + options.slideElMg,
				slideStep = options.slideNum * slideElWidth,
				$slideBtn = $slideWrap.find(options.slideBtn);
			
			$slideBtn.on('click', function(){
				if(!enable) return;
				if($(this).hasClass('next'))
					_slideToLeft();
				else
					_slideToRight();
			});
			$(document).ready(function(){
				$slideList.css({width : ($slideEls.length + options.slideNum) * slideElWidth, left : 0});
				_setAutoSlide();
			});
			$slideWrap.on('mouseenter', function(){//检测鼠标移入移出
				clearTimeout(inter);
			}).on('mouseleave', function(){
				_setAutoSlide();
			});
			function _setAutoSlide(){//自动滚动
				clearTimeout(inter);
				if(options.autoSlide){
					inter = setTimeout(function(){
						_slideToLeft();
						_setAutoSlide();
					}, options.slideRange);
				}
			}
			function _slideToLeft(){
				options.afterCallback.call($slideWrap);
				enable = false;
				var elClones = $slideWrap.find(options.slideEl).slice(0, options.slideNum);
				$slideList.append(elClones.clone());
				$slideList.animate({left : '-=' + slideStep}, options.slideTime, function(){
					elClones.remove();
					$slideList.css({ left : '+=' + slideStep});
					enable = true;
				});
				options.beforeCallback.call($slideWrap);
			}
			function _slideToRight(){
				options.afterCallback.call($slideWrap);
				enable = false;
				var elClones = $slideWrap.find(options.slideEl).slice('-' + options.slideNum);
				$slideList.prepend(elClones.clone());
				$slideList.css({left : '-=' + slideStep});
				$slideList.animate({left : '+=' + slideStep}, options.slideTime, function(){
					elClones.remove();
					enable = true;
				});
				options.beforeCallback.call($slideWrap);
			}			
		},
		rollText : function(options){//列表文字自动上滚
			var defaults = {
				rollList : 'ul',
				rollEls : 'li',
				rollNum : 1,
				rollTime : 1000,
				rollRange : 3000,
				autoRoll : true
			};
			var options = $.extend(defaults, options);
			var $rollWrap = $(this),
				$rollList = $rollWrap.find(options.rollList),
				autoInter;
			$rollWrap.on('mouseenter', function(){
				_clearAutoRoll();
			}).on('mouseleave', function(){
				_setAutoRoll();
			})
			$(document).ready(function(){
				_setAutoRoll();
			});
			function _setAutoRoll(){
				if(options.autoRoll){
					autoInter = setTimeout(function(){
						$rollList.each(function(){
							var $wrap = $(this);
							var $origs = $wrap.find(options.rollEls).slice(0, options.rollNum);
							$wrap.append($origs.clone());
							$origs.slideUp(options.rollTime, function(){
								$origs.remove();
							});
						});
						 _setAutoRoll();
					}, options.rollRange);
				}				
			}
			function _clearAutoRoll(){
				clearTimeout(autoInter);
			}
		},
		autoRoll : function(options){
			var defaults = {
				rollTitle : '.channel-wrap a',
				rollEls : '.juhe-con-wrap',
				rollConTime : 10000
			};

			var options = $.extend(defaults, options);
			var $rollWrap = $(this),
				$rollTitle = $rollWrap.find(options.rollTitle);
				$rollEls = $rollWrap.find(options.rollEls);
				$rollEleLength = $rollWrap.find(options.rollEls).length;
				$rollConTime = options.rollConTime;

			$(document).ready(function(){
				_autoContentRoll();
			});

			function bigImgIndex() {
				$rollEls.each(function(i, el) {
				  if ($(el).is(':visible')) {
				    bigIndex = i;
				  }
				});
				return bigIndex;
			}

			function _autoContentRoll(){	

				function slideRoll(){ 
					var conIndex = bigImgIndex();
					if ( conIndex == ($rollEleLength-1) ) {
						conIndex = -1;
					} 

					$rollTitle.eq(conIndex).removeClass('cur');
					$rollTitle.eq(conIndex + 1).addClass('cur');

					$rollEls.eq(conIndex).hide();
					$rollEls.eq(conIndex + 1).show();
				} 
				slideAction = setInterval(slideRoll, $rollConTime);
			} 

			$rollTitle.mouseover(function(){
					clearInterval(slideAction); 
					var conIndex = bigImgIndex();
					$rollTitle.removeClass('cur').eq($(this).index()).addClass('cur');
					$rollEls.hide().eq($(this).index()).fadeIn(300);
				}).mouseout(function(){
				   _autoContentRoll()
			});
		}

	});
})(jQuery);



//切换插件 2014-08-28
(function($){
	$.fn.extend({
		fadeSlide : function(options){
			var defaults = {
				fadeBtn : '.arr',//切换按钮
				fadeDots : '.fadeDots',//切换圆点序列（如有）
				fadeCon : '.fadeCon',//切换内容容器
				fadeCurClass : 'cur',//圆点选中类名
				dotsEvent : 'click',//圆点触发事件
				fadeTime : 300,//切换动画时长
				fadeRange : 15000,//切换间隔
				autoFade : false//自动切换
			}
			var options = $.extend(defaults, options),
				$fadeWrap = this,
				$fadeBtn = $fadeWrap.find(options.fadeBtn),
				$fadeDots = $fadeWrap.find(options.fadeDots),
				$fadeCon = $fadeWrap.find(options.fadeCon),
				len = $fadeCon.length,
				autoFlag = null;
			$fadeDots.on(options.dotsEvent, function(){				
				if(!$(this).hasClass(options.fadeCurClass))
					fadeOutFn($(this).index());
			});
			$fadeBtn.on('click', function(){
				var index = ($fadeWrap.find($('.' + options.fadeCurClass)).index() + (($(this).hasClass('next')) ? 1 : (-1))) % len;
				fadeOutFn(index);
			})
			$fadeWrap.on('mouseenter', function(){
				clearTimeout(autoFlag);
			}).on('mouseleave', function(){
				var $that = $(this);
				(!options.autoFade) || _setAutoFlag();
			})
			$(document).ready(function(){
				var $that = $(this);
				(!options.autoFade) || _setAutoFlag();
			});
			function autoFadeFn(direct){
				clearTimeout(autoFlag);
				var direct = direct || 'next', index = ($fadeWrap.find($('.' + options.fadeCurClass)).index() + ((direct == 'next') ? 1 : (-1))) % len;
				fadeOutFn(index);
				_setAutoFlag();
			}
			function _setAutoFlag(){
				autoFlag = setTimeout(function(){
					autoFadeFn('next')
				}, options.fadeRange);
			}
			function fadeOutFn(index){
				$fadeDots.removeClass(options.fadeCurClass).eq(index).addClass(options.fadeCurClass);
				$fadeCon.hide().eq(index).fadeIn(options.fadeTime);
			}
			return {
				fadeOutFn : fadeOutFn
			}
		},
		slideImage : function(options){
			//default
			var defaults = {
				slideEl : 'slide-li',
				slideElMg : 10,
				slideBtn : 'slide-arr',
				slideTime : 1000,
				slideRange : 7000,
				slideNum : 5,
				autoSlide : true,
				afterCallback: function () {},
				beforeCallback: function () {}
			};
			var inter, enable = true;
			var options = $.extend(defaults, options),
				$slideWrap = $(this),
				$slideEls = $slideWrap.find(options.slideEl),
				$slideList = $slideEls.parent(),
				slideWrapWidth = $slideWrap.width(),
				slideElWidth = $slideEls.width() + options.slideElMg,
				slideStep = options.slideNum * slideElWidth,
				$slideBtn = $slideWrap.find(options.slideBtn);
			
			$slideBtn.on('click', function(){
				if(!enable) return;
				if($(this).hasClass('next'))
					_slideToLeft();
				else
					_slideToRight();
			});
			$(document).ready(function(){
				$slideList.css({width : ($slideEls.length + options.slideNum) * slideElWidth, left : 0});
				_setAutoSlide();
			});
			$slideWrap.on('mouseenter', function(){//检测鼠标移入移出
				clearTimeout(inter);
			}).on('mouseleave', function(){
				_setAutoSlide();
			});
			function _setAutoSlide(){//自动滚动
				clearTimeout(inter);
				if(options.autoSlide){
					inter = setTimeout(function(){
						_slideToLeft();
						_setAutoSlide();
					}, options.slideRange);
				}
			}
			function _slideToLeft(){
				options.afterCallback.call($slideWrap);
				enable = false;
				var elClones = $slideWrap.find(options.slideEl).slice(0, options.slideNum);
				$slideList.append(elClones.clone());
				$slideList.animate({left : '-=' + slideStep}, options.slideTime, function(){
					elClones.remove();
					$slideList.css({ left : '+=' + slideStep});
					enable = true;
				});
				options.beforeCallback.call($slideWrap);
			}
			function _slideToRight(){
				options.afterCallback.call($slideWrap);
				enable = false;
				var elClones = $slideWrap.find(options.slideEl).slice('-' + options.slideNum);
				$slideList.prepend(elClones.clone());
				$slideList.css({left : '-=' + slideStep});
				$slideList.animate({left : '+=' + slideStep}, options.slideTime, function(){
					elClones.remove();
					enable = true;
				});
				options.beforeCallback.call($slideWrap);
			}			
		},
		rollText : function(options){//列表文字自动上滚
			var defaults = {
				rollList : 'ul',
				rollEls : 'li',
				rollNum : 1,
				rollTime : 1000,
				rollRange : 3000,
				autoRoll : true
			};
			var options = $.extend(defaults, options);
			var $rollWrap = $(this),
				$rollList = $rollWrap.find(options.rollList),
				autoInter;
			$rollWrap.on('mouseenter', function(){
				_clearAutoRoll();
			}).on('mouseleave', function(){
				_setAutoRoll();
			})
			$(document).ready(function(){
				_setAutoRoll();
			});
			function _setAutoRoll(){
				if(options.autoRoll){
					autoInter = setTimeout(function(){
						$rollList.each(function(){
							var $wrap = $(this);
							var $origs = $wrap.find(options.rollEls).slice(0, options.rollNum);
							$wrap.append($origs.clone());
							$origs.slideUp(options.rollTime, function(){
								$origs.remove();
							});
						});
						 _setAutoRoll();
					}, options.rollRange);
				}				
			}
			function _clearAutoRoll(){
				clearTimeout(autoInter);
			}
		},
		autoRoll : function(options){
			var defaults = {
				rollTitle : '.channel-wrap a',
				rollEls : '.juhe-con-wrap',
				rollConTime : 10000
			};

			var options = $.extend(defaults, options);
			var $rollWrap = $(this),
				$rollTitle = $rollWrap.find(options.rollTitle);
				$rollEls = $rollWrap.find(options.rollEls);
				$rollEleLength = $rollWrap.find(options.rollEls).length;
				$rollConTime = options.rollConTime;

			$(document).ready(function(){
				_autoContentRoll();
			});

			function bigImgIndex() {
				$rollEls.each(function(i, el) {
				  if ($(el).is(':visible')) {
				    bigIndex = i;
				  }
				});
				return bigIndex;
			}

			function _autoContentRoll(){	

				function slideRoll(){ 
					var conIndex = bigImgIndex();
					if ( conIndex == ($rollEleLength-1) ) {
						conIndex = -1;
					} 

					$rollTitle.eq(conIndex).removeClass('cur');
					$rollTitle.eq(conIndex + 1).addClass('cur');

					$rollEls.eq(conIndex).hide();
					$rollEls.eq(conIndex + 1).show();
				} 
				slideAction = setInterval(slideRoll, $rollConTime);
			} 

			$rollTitle.mouseover(function(){
					clearInterval(slideAction); 
					var conIndex = bigImgIndex();
					$rollTitle.removeClass('cur').eq($(this).index()).addClass('cur');
					$rollEls.hide().eq($(this).index()).fadeIn(300);
				}).mouseout(function(){
				   _autoContentRoll()
			});
		}

	});
})(jQuery);



//切换插件 2014-08-28
(function($){
	$.fn.extend({
		fadeSlide : function(options){
			var defaults = {
				fadeBtn : '.arr',//切换按钮
				fadeDots : '.fadeDots',//切换圆点序列（如有）
				fadeCon : '.fadeCon',//切换内容容器
				fadeCurClass : 'cur',//圆点选中类名
				dotsEvent : 'click',//圆点触发事件
				fadeTime : 300,//切换动画时长
				fadeRange : 15000,//切换间隔
				autoFade : false//自动切换
			}
			var options = $.extend(defaults, options),
				$fadeWrap = this,
				$fadeBtn = $fadeWrap.find(options.fadeBtn),
				$fadeDots = $fadeWrap.find(options.fadeDots),
				$fadeCon = $fadeWrap.find(options.fadeCon),
				len = $fadeCon.length,
				autoFlag = null;
			$fadeDots.on(options.dotsEvent, function(){				
				if(!$(this).hasClass(options.fadeCurClass))
					fadeOutFn($(this).index());
			});
			$fadeBtn.on('click', function(){
				var index = ($fadeWrap.find($('.' + options.fadeCurClass)).index() + (($(this).hasClass('next')) ? 1 : (-1))) % len;
				fadeOutFn(index);
			})
			$fadeWrap.on('mouseenter', function(){
				clearTimeout(autoFlag);
			}).on('mouseleave', function(){
				var $that = $(this);
				(!options.autoFade) || _setAutoFlag();
			})
			$(document).ready(function(){
				var $that = $(this);
				(!options.autoFade) || _setAutoFlag();
			});
			function autoFadeFn(direct){
				clearTimeout(autoFlag);
				var direct = direct || 'next', index = ($fadeWrap.find($('.' + options.fadeCurClass)).index() + ((direct == 'next') ? 1 : (-1))) % len;
				fadeOutFn(index);
				_setAutoFlag();
			}
			function _setAutoFlag(){
				autoFlag = setTimeout(function(){
					autoFadeFn('next')
				}, options.fadeRange);
			}
			function fadeOutFn(index){
				$fadeDots.removeClass(options.fadeCurClass).eq(index).addClass(options.fadeCurClass);
				$fadeCon.hide().eq(index).fadeIn(options.fadeTime);
			}
			return {
				fadeOutFn : fadeOutFn
			}
		},
		slideImage : function(options){
			//default
			var defaults = {
				slideEl : 'slide-li',
				slideElMg : 10,
				slideBtn : 'slide-arr',
				slideTime : 1000,
				slideRange : 7000,
				slideNum : 5,
				autoSlide : true,
				afterCallback: function () {},
				beforeCallback: function () {}
			};
			var inter, enable = true;
			var options = $.extend(defaults, options),
				$slideWrap = $(this),
				$slideEls = $slideWrap.find(options.slideEl),
				$slideList = $slideEls.parent(),
				slideWrapWidth = $slideWrap.width(),
				slideElWidth = $slideEls.width() + options.slideElMg,
				slideStep = options.slideNum * slideElWidth,
				$slideBtn = $slideWrap.find(options.slideBtn);
			
			$slideBtn.on('click', function(){
				if(!enable) return;
				if($(this).hasClass('next'))
					_slideToLeft();
				else
					_slideToRight();
			});
			$(document).ready(function(){
				$slideList.css({width : ($slideEls.length + options.slideNum) * slideElWidth, left : 0});
				_setAutoSlide();
			});
			$slideWrap.on('mouseenter', function(){//检测鼠标移入移出
				clearTimeout(inter);
			}).on('mouseleave', function(){
				_setAutoSlide();
			});
			function _setAutoSlide(){//自动滚动
				clearTimeout(inter);
				if(options.autoSlide){
					inter = setTimeout(function(){
						_slideToLeft();
						_setAutoSlide();
					}, options.slideRange);
				}
			}
			function _slideToLeft(){
				options.afterCallback.call($slideWrap);
				enable = false;
				var elClones = $slideWrap.find(options.slideEl).slice(0, options.slideNum);
				$slideList.append(elClones.clone());
				$slideList.animate({left : '-=' + slideStep}, options.slideTime, function(){
					elClones.remove();
					$slideList.css({ left : '+=' + slideStep});
					enable = true;
				});
				options.beforeCallback.call($slideWrap);
			}
			function _slideToRight(){
				options.afterCallback.call($slideWrap);
				enable = false;
				var elClones = $slideWrap.find(options.slideEl).slice('-' + options.slideNum);
				$slideList.prepend(elClones.clone());
				$slideList.css({left : '-=' + slideStep});
				$slideList.animate({left : '+=' + slideStep}, options.slideTime, function(){
					elClones.remove();
					enable = true;
				});
				options.beforeCallback.call($slideWrap);
			}			
		},
		rollText : function(options){//列表文字自动上滚
			var defaults = {
				rollList : 'ul',
				rollEls : 'li',
				rollNum : 1,
				rollTime : 1000,
				rollRange : 3000,
				autoRoll : true
			};
			var options = $.extend(defaults, options);
			var $rollWrap = $(this),
				$rollList = $rollWrap.find(options.rollList),
				autoInter;
			$rollWrap.on('mouseenter', function(){
				_clearAutoRoll();
			}).on('mouseleave', function(){
				_setAutoRoll();
			})
			$(document).ready(function(){
				_setAutoRoll();
			});
			function _setAutoRoll(){
				if(options.autoRoll){
					autoInter = setTimeout(function(){
						$rollList.each(function(){
							var $wrap = $(this);
							var $origs = $wrap.find(options.rollEls).slice(0, options.rollNum);
							$wrap.append($origs.clone());
							$origs.slideUp(options.rollTime, function(){
								$origs.remove();
							});
						});
						 _setAutoRoll();
					}, options.rollRange);
				}				
			}
			function _clearAutoRoll(){
				clearTimeout(autoInter);
			}
		},
		autoRoll : function(options){
			var defaults = {
				rollTitle : '.channel-wrap a',
				rollEls : '.juhe-con-wrap',
				rollConTime : 10000
			};

			var options = $.extend(defaults, options);
			var $rollWrap = $(this),
				$rollTitle = $rollWrap.find(options.rollTitle);
				$rollEls = $rollWrap.find(options.rollEls);
				$rollEleLength = $rollWrap.find(options.rollEls).length;
				$rollConTime = options.rollConTime;

			$(document).ready(function(){
				_autoContentRoll();
			});

			function bigImgIndex() {
				$rollEls.each(function(i, el) {
				  if ($(el).is(':visible')) {
				    bigIndex = i;
				  }
				});
				return bigIndex;
			}

			function _autoContentRoll(){	

				function slideRoll(){ 
					var conIndex = bigImgIndex();
					if ( conIndex == ($rollEleLength-1) ) {
						conIndex = -1;
					} 

					$rollTitle.eq(conIndex).removeClass('cur');
					$rollTitle.eq(conIndex + 1).addClass('cur');

					$rollEls.eq(conIndex).hide();
					$rollEls.eq(conIndex + 1).show();
				} 
				slideAction = setInterval(slideRoll, $rollConTime);
			} 

			$rollTitle.mouseover(function(){
					clearInterval(slideAction); 
					var conIndex = bigImgIndex();
					$rollTitle.removeClass('cur').eq($(this).index()).addClass('cur');
					$rollEls.hide().eq($(this).index()).fadeIn(300);
				}).mouseout(function(){
				   _autoContentRoll()
			});
		}

	});
})(jQuery);



//切换插件 2014-08-28
(function($){
	$.fn.extend({
		fadeSlide : function(options){
			var defaults = {
				fadeBtn : '.arr',//切换按钮
				fadeDots : '.fadeDots',//切换圆点序列（如有）
				fadeCon : '.fadeCon',//切换内容容器
				fadeCurClass : 'cur',//圆点选中类名
				dotsEvent : 'click',//圆点触发事件
				fadeTime : 300,//切换动画时长
				fadeRange : 15000,//切换间隔
				autoFade : false//自动切换
			}
			var options = $.extend(defaults, options),
				$fadeWrap = this,
				$fadeBtn = $fadeWrap.find(options.fadeBtn),
				$fadeDots = $fadeWrap.find(options.fadeDots),
				$fadeCon = $fadeWrap.find(options.fadeCon),
				len = $fadeCon.length,
				autoFlag = null;
			$fadeDots.on(options.dotsEvent, function(){				
				if(!$(this).hasClass(options.fadeCurClass))
					fadeOutFn($(this).index());
			});
			$fadeBtn.on('click', function(){
				var index = ($fadeWrap.find($('.' + options.fadeCurClass)).index() + (($(this).hasClass('next')) ? 1 : (-1))) % len;
				fadeOutFn(index);
			})
			$fadeWrap.on('mouseenter', function(){
				clearTimeout(autoFlag);
			}).on('mouseleave', function(){
				var $that = $(this);
				(!options.autoFade) || _setAutoFlag();
			})
			$(document).ready(function(){
				var $that = $(this);
				(!options.autoFade) || _setAutoFlag();
			});
			function autoFadeFn(direct){
				clearTimeout(autoFlag);
				var direct = direct || 'next', index = ($fadeWrap.find($('.' + options.fadeCurClass)).index() + ((direct == 'next') ? 1 : (-1))) % len;
				fadeOutFn(index);
				_setAutoFlag();
			}
			function _setAutoFlag(){
				autoFlag = setTimeout(function(){
					autoFadeFn('next')
				}, options.fadeRange);
			}
			function fadeOutFn(index){
				$fadeDots.removeClass(options.fadeCurClass).eq(index).addClass(options.fadeCurClass);
				$fadeCon.hide().eq(index).fadeIn(options.fadeTime);
			}
			return {
				fadeOutFn : fadeOutFn
			}
		},
		slideImage : function(options){
			//default
			var defaults = {
				slideEl : 'slide-li',
				slideElMg : 10,
				slideBtn : 'slide-arr',
				slideTime : 1000,
				slideRange : 7000,
				slideNum : 5,
				autoSlide : true,
				afterCallback: function () {},
				beforeCallback: function () {}
			};
			var inter, enable = true;
			var options = $.extend(defaults, options),
				$slideWrap = $(this),
				$slideEls = $slideWrap.find(options.slideEl),
				$slideList = $slideEls.parent(),
				slideWrapWidth = $slideWrap.width(),
				slideElWidth = $slideEls.width() + options.slideElMg,
				slideStep = options.slideNum * slideElWidth,
				$slideBtn = $slideWrap.find(options.slideBtn);
			
			$slideBtn.on('click', function(){
				if(!enable) return;
				if($(this).hasClass('next'))
					_slideToLeft();
				else
					_slideToRight();
			});
			$(document).ready(function(){
				$slideList.css({width : ($slideEls.length + options.slideNum) * slideElWidth, left : 0});
				_setAutoSlide();
			});
			$slideWrap.on('mouseenter', function(){//检测鼠标移入移出
				clearTimeout(inter);
			}).on('mouseleave', function(){
				_setAutoSlide();
			});
			function _setAutoSlide(){//自动滚动
				clearTimeout(inter);
				if(options.autoSlide){
					inter = setTimeout(function(){
						_slideToLeft();
						_setAutoSlide();
					}, options.slideRange);
				}
			}
			function _slideToLeft(){
				options.afterCallback.call($slideWrap);
				enable = false;
				var elClones = $slideWrap.find(options.slideEl).slice(0, options.slideNum);
				$slideList.append(elClones.clone());
				$slideList.animate({left : '-=' + slideStep}, options.slideTime, function(){
					elClones.remove();
					$slideList.css({ left : '+=' + slideStep});
					enable = true;
				});
				options.beforeCallback.call($slideWrap);
			}
			function _slideToRight(){
				options.afterCallback.call($slideWrap);
				enable = false;
				var elClones = $slideWrap.find(options.slideEl).slice('-' + options.slideNum);
				$slideList.prepend(elClones.clone());
				$slideList.css({left : '-=' + slideStep});
				$slideList.animate({left : '+=' + slideStep}, options.slideTime, function(){
					elClones.remove();
					enable = true;
				});
				options.beforeCallback.call($slideWrap);
			}			
		},
		rollText : function(options){//列表文字自动上滚
			var defaults = {
				rollList : 'ul',
				rollEls : 'li',
				rollNum : 1,
				rollTime : 1000,
				rollRange : 3000,
				autoRoll : true
			};
			var options = $.extend(defaults, options);
			var $rollWrap = $(this),
				$rollList = $rollWrap.find(options.rollList),
				autoInter;
			$rollWrap.on('mouseenter', function(){
				_clearAutoRoll();
			}).on('mouseleave', function(){
				_setAutoRoll();
			})
			$(document).ready(function(){
				_setAutoRoll();
			});
			function _setAutoRoll(){
				if(options.autoRoll){
					autoInter = setTimeout(function(){
						$rollList.each(function(){
							var $wrap = $(this);
							var $origs = $wrap.find(options.rollEls).slice(0, options.rollNum);
							$wrap.append($origs.clone());
							$origs.slideUp(options.rollTime, function(){
								$origs.remove();
							});
						});
						 _setAutoRoll();
					}, options.rollRange);
				}				
			}
			function _clearAutoRoll(){
				clearTimeout(autoInter);
			}
		},
		autoRoll : function(options){
			var defaults = {
				rollTitle : '.channel-wrap a',
				rollEls : '.juhe-con-wrap',
				rollConTime : 10000
			};

			var options = $.extend(defaults, options);
			var $rollWrap = $(this),
				$rollTitle = $rollWrap.find(options.rollTitle);
				$rollEls = $rollWrap.find(options.rollEls);
				$rollEleLength = $rollWrap.find(options.rollEls).length;
				$rollConTime = options.rollConTime;

			$(document).ready(function(){
				_autoContentRoll();
			});

			function bigImgIndex() {
				$rollEls.each(function(i, el) {
				  if ($(el).is(':visible')) {
				    bigIndex = i;
				  }
				});
				return bigIndex;
			}

			function _autoContentRoll(){	

				function slideRoll(){ 
					var conIndex = bigImgIndex();
					if ( conIndex == ($rollEleLength-1) ) {
						conIndex = -1;
					} 

					$rollTitle.eq(conIndex).removeClass('cur');
					$rollTitle.eq(conIndex + 1).addClass('cur');

					$rollEls.eq(conIndex).hide();
					$rollEls.eq(conIndex + 1).show();
				} 
				slideAction = setInterval(slideRoll, $rollConTime);
			} 

			$rollTitle.mouseover(function(){
					clearInterval(slideAction); 
					var conIndex = bigImgIndex();
					$rollTitle.removeClass('cur').eq($(this).index()).addClass('cur');
					$rollEls.hide().eq($(this).index()).fadeIn(300);
				}).mouseout(function(){
				   _autoContentRoll()
			});
		}

	});
})(jQuery);



//切换插件 2014-08-28
(function($){
	$.fn.extend({
		fadeSlide : function(options){
			var defaults = {
				fadeBtn : '.arr',//切换按钮
				fadeDots : '.fadeDots',//切换圆点序列（如有）
				fadeCon : '.fadeCon',//切换内容容器
				fadeCurClass : 'cur',//圆点选中类名
				dotsEvent : 'click',//圆点触发事件
				fadeTime : 300,//切换动画时长
				fadeRange : 15000,//切换间隔
				autoFade : false//自动切换
			}
			var options = $.extend(defaults, options),
				$fadeWrap = this,
				$fadeBtn = $fadeWrap.find(options.fadeBtn),
				$fadeDots = $fadeWrap.find(options.fadeDots),
				$fadeCon = $fadeWrap.find(options.fadeCon),
				len = $fadeCon.length,
				autoFlag = null;
			$fadeDots.on(options.dotsEvent, function(){				
				if(!$(this).hasClass(options.fadeCurClass))
					fadeOutFn($(this).index());
			});
			$fadeBtn.on('click', function(){
				var index = ($fadeWrap.find($('.' + options.fadeCurClass)).index() + (($(this).hasClass('next')) ? 1 : (-1))) % len;
				fadeOutFn(index);
			})
			$fadeWrap.on('mouseenter', function(){
				clearTimeout(autoFlag);
			}).on('mouseleave', function(){
				var $that = $(this);
				(!options.autoFade) || _setAutoFlag();
			})
			$(document).ready(function(){
				var $that = $(this);
				(!options.autoFade) || _setAutoFlag();
			});
			function autoFadeFn(direct){
				clearTimeout(autoFlag);
				var direct = direct || 'next', index = ($fadeWrap.find($('.' + options.fadeCurClass)).index() + ((direct == 'next') ? 1 : (-1))) % len;
				fadeOutFn(index);
				_setAutoFlag();
			}
			function _setAutoFlag(){
				autoFlag = setTimeout(function(){
					autoFadeFn('next')
				}, options.fadeRange);
			}
			function fadeOutFn(index){
				$fadeDots.removeClass(options.fadeCurClass).eq(index).addClass(options.fadeCurClass);
				$fadeCon.hide().eq(index).fadeIn(options.fadeTime);
			}
			return {
				fadeOutFn : fadeOutFn
			}
		},
		slideImage : function(options){
			//default
			var defaults = {
				slideEl : 'slide-li',
				slideElMg : 10,
				slideBtn : 'slide-arr',
				slideTime : 1000,
				slideRange : 7000,
				slideNum : 5,
				autoSlide : true,
				afterCallback: function () {},
				beforeCallback: function () {}
			};
			var inter, enable = true;
			var options = $.extend(defaults, options),
				$slideWrap = $(this),
				$slideEls = $slideWrap.find(options.slideEl),
				$slideList = $slideEls.parent(),
				slideWrapWidth = $slideWrap.width(),
				slideElWidth = $slideEls.width() + options.slideElMg,
				slideStep = options.slideNum * slideElWidth,
				$slideBtn = $slideWrap.find(options.slideBtn);
			
			$slideBtn.on('click', function(){
				if(!enable) return;
				if($(this).hasClass('next'))
					_slideToLeft();
				else
					_slideToRight();
			});
			$(document).ready(function(){
				$slideList.css({width : ($slideEls.length + options.slideNum) * slideElWidth, left : 0});
				_setAutoSlide();
			});
			$slideWrap.on('mouseenter', function(){//检测鼠标移入移出
				clearTimeout(inter);
			}).on('mouseleave', function(){
				_setAutoSlide();
			});
			function _setAutoSlide(){//自动滚动
				clearTimeout(inter);
				if(options.autoSlide){
					inter = setTimeout(function(){
						_slideToLeft();
						_setAutoSlide();
					}, options.slideRange);
				}
			}
			function _slideToLeft(){
				options.afterCallback.call($slideWrap);
				enable = false;
				var elClones = $slideWrap.find(options.slideEl).slice(0, options.slideNum);
				$slideList.append(elClones.clone());
				$slideList.animate({left : '-=' + slideStep}, options.slideTime, function(){
					elClones.remove();
					$slideList.css({ left : '+=' + slideStep});
					enable = true;
				});
				options.beforeCallback.call($slideWrap);
			}
			function _slideToRight(){
				options.afterCallback.call($slideWrap);
				enable = false;
				var elClones = $slideWrap.find(options.slideEl).slice('-' + options.slideNum);
				$slideList.prepend(elClones.clone());
				$slideList.css({left : '-=' + slideStep});
				$slideList.animate({left : '+=' + slideStep}, options.slideTime, function(){
					elClones.remove();
					enable = true;
				});
				options.beforeCallback.call($slideWrap);
			}			
		},
		rollText : function(options){//列表文字自动上滚
			var defaults = {
				rollList : 'ul',
				rollEls : 'li',
				rollNum : 1,
				rollTime : 1000,
				rollRange : 3000,
				autoRoll : true
			};
			var options = $.extend(defaults, options);
			var $rollWrap = $(this),
				$rollList = $rollWrap.find(options.rollList),
				autoInter;
			$rollWrap.on('mouseenter', function(){
				_clearAutoRoll();
			}).on('mouseleave', function(){
				_setAutoRoll();
			})
			$(document).ready(function(){
				_setAutoRoll();
			});
			function _setAutoRoll(){
				if(options.autoRoll){
					autoInter = setTimeout(function(){
						$rollList.each(function(){
							var $wrap = $(this);
							var $origs = $wrap.find(options.rollEls).slice(0, options.rollNum);
							$wrap.append($origs.clone());
							$origs.slideUp(options.rollTime, function(){
								$origs.remove();
							});
						});
						 _setAutoRoll();
					}, options.rollRange);
				}				
			}
			function _clearAutoRoll(){
				clearTimeout(autoInter);
			}
		},
		autoRoll : function(options){
			var defaults = {
				rollTitle : '.channel-wrap a',
				rollEls : '.juhe-con-wrap',
				rollConTime : 10000
			};

			var options = $.extend(defaults, options);
			var $rollWrap = $(this),
				$rollTitle = $rollWrap.find(options.rollTitle);
				$rollEls = $rollWrap.find(options.rollEls);
				$rollEleLength = $rollWrap.find(options.rollEls).length;
				$rollConTime = options.rollConTime;

			$(document).ready(function(){
				_autoContentRoll();
			});

			function bigImgIndex() {
				$rollEls.each(function(i, el) {
				  if ($(el).is(':visible')) {
				    bigIndex = i;
				  }
				});
				return bigIndex;
			}

			function _autoContentRoll(){	

				function slideRoll(){ 
					var conIndex = bigImgIndex();
					if ( conIndex == ($rollEleLength-1) ) {
						conIndex = -1;
					} 

					$rollTitle.eq(conIndex).removeClass('cur');
					$rollTitle.eq(conIndex + 1).addClass('cur');

					$rollEls.eq(conIndex).hide();
					$rollEls.eq(conIndex + 1).show();
				} 
				slideAction = setInterval(slideRoll, $rollConTime);
			} 

			$rollTitle.mouseover(function(){
					clearInterval(slideAction); 
					var conIndex = bigImgIndex();
					$rollTitle.removeClass('cur').eq($(this).index()).addClass('cur');
					$rollEls.hide().eq($(this).index()).fadeIn(300);
				}).mouseout(function(){
				   _autoContentRoll()
			});
		}

	});
})(jQuery);



//切换插件 2014-08-28
(function($){
	$.fn.extend({
		fadeSlide : function(options){
			var defaults = {
				fadeBtn : '.arr',//切换按钮
				fadeDots : '.fadeDots',//切换圆点序列（如有）
				fadeCon : '.fadeCon',//切换内容容器
				fadeCurClass : 'cur',//圆点选中类名
				dotsEvent : 'click',//圆点触发事件
				fadeTime : 300,//切换动画时长
				fadeRange : 15000,//切换间隔
				autoFade : false//自动切换
			}
			var options = $.extend(defaults, options),
				$fadeWrap = this,
				$fadeBtn = $fadeWrap.find(options.fadeBtn),
				$fadeDots = $fadeWrap.find(options.fadeDots),
				$fadeCon = $fadeWrap.find(options.fadeCon),
				len = $fadeCon.length,
				autoFlag = null;
			$fadeDots.on(options.dotsEvent, function(){				
				if(!$(this).hasClass(options.fadeCurClass))
					fadeOutFn($(this).index());
			});
			$fadeBtn.on('click', function(){
				var index = ($fadeWrap.find($('.' + options.fadeCurClass)).index() + (($(this).hasClass('next')) ? 1 : (-1))) % len;
				fadeOutFn(index);
			})
			$fadeWrap.on('mouseenter', function(){
				clearTimeout(autoFlag);
			}).on('mouseleave', function(){
				var $that = $(this);
				(!options.autoFade) || _setAutoFlag();
			})
			$(document).ready(function(){
				var $that = $(this);
				(!options.autoFade) || _setAutoFlag();
			});
			function autoFadeFn(direct){
				clearTimeout(autoFlag);
				var direct = direct || 'next', index = ($fadeWrap.find($('.' + options.fadeCurClass)).index() + ((direct == 'next') ? 1 : (-1))) % len;
				fadeOutFn(index);
				_setAutoFlag();
			}
			function _setAutoFlag(){
				autoFlag = setTimeout(function(){
					autoFadeFn('next')
				}, options.fadeRange);
			}
			function fadeOutFn(index){
				$fadeDots.removeClass(options.fadeCurClass).eq(index).addClass(options.fadeCurClass);
				$fadeCon.hide().eq(index).fadeIn(options.fadeTime);
			}
			return {
				fadeOutFn : fadeOutFn
			}
		},
		slideImage : function(options){
			//default
			var defaults = {
				slideEl : 'slide-li',
				slideElMg : 10,
				slideBtn : 'slide-arr',
				slideTime : 1000,
				slideRange : 7000,
				slideNum : 5,
				autoSlide : true,
				afterCallback: function () {},
				beforeCallback: function () {}
			};
			var inter, enable = true;
			var options = $.extend(defaults, options),
				$slideWrap = $(this),
				$slideEls = $slideWrap.find(options.slideEl),
				$slideList = $slideEls.parent(),
				slideWrapWidth = $slideWrap.width(),
				slideElWidth = $slideEls.width() + options.slideElMg,
				slideStep = options.slideNum * slideElWidth,
				$slideBtn = $slideWrap.find(options.slideBtn);
			
			$slideBtn.on('click', function(){
				if(!enable) return;
				if($(this).hasClass('next'))
					_slideToLeft();
				else
					_slideToRight();
			});
			$(document).ready(function(){
				$slideList.css({width : ($slideEls.length + options.slideNum) * slideElWidth, left : 0});
				_setAutoSlide();
			});
			$slideWrap.on('mouseenter', function(){//检测鼠标移入移出
				clearTimeout(inter);
			}).on('mouseleave', function(){
				_setAutoSlide();
			});
			function _setAutoSlide(){//自动滚动
				clearTimeout(inter);
				if(options.autoSlide){
					inter = setTimeout(function(){
						_slideToLeft();
						_setAutoSlide();
					}, options.slideRange);
				}
			}
			function _slideToLeft(){
				options.afterCallback.call($slideWrap);
				enable = false;
				var elClones = $slideWrap.find(options.slideEl).slice(0, options.slideNum);
				$slideList.append(elClones.clone());
				$slideList.animate({left : '-=' + slideStep}, options.slideTime, function(){
					elClones.remove();
					$slideList.css({ left : '+=' + slideStep});
					enable = true;
				});
				options.beforeCallback.call($slideWrap);
			}
			function _slideToRight(){
				options.afterCallback.call($slideWrap);
				enable = false;
				var elClones = $slideWrap.find(options.slideEl).slice('-' + options.slideNum);
				$slideList.prepend(elClones.clone());
				$slideList.css({left : '-=' + slideStep});
				$slideList.animate({left : '+=' + slideStep}, options.slideTime, function(){
					elClones.remove();
					enable = true;
				});
				options.beforeCallback.call($slideWrap);
			}			
		},
		rollText : function(options){//列表文字自动上滚
			var defaults = {
				rollList : 'ul',
				rollEls : 'li',
				rollNum : 1,
				rollTime : 1000,
				rollRange : 3000,
				autoRoll : true
			};
			var options = $.extend(defaults, options);
			var $rollWrap = $(this),
				$rollList = $rollWrap.find(options.rollList),
				autoInter;
			$rollWrap.on('mouseenter', function(){
				_clearAutoRoll();
			}).on('mouseleave', function(){
				_setAutoRoll();
			})
			$(document).ready(function(){
				_setAutoRoll();
			});
			function _setAutoRoll(){
				if(options.autoRoll){
					autoInter = setTimeout(function(){
						$rollList.each(function(){
							var $wrap = $(this);
							var $origs = $wrap.find(options.rollEls).slice(0, options.rollNum);
							$wrap.append($origs.clone());
							$origs.slideUp(options.rollTime, function(){
								$origs.remove();
							});
						});
						 _setAutoRoll();
					}, options.rollRange);
				}				
			}
			function _clearAutoRoll(){
				clearTimeout(autoInter);
			}
		},
		autoRoll : function(options){
			var defaults = {
				rollTitle : '.channel-wrap a',
				rollEls : '.juhe-con-wrap',
				rollConTime : 10000
			};

			var options = $.extend(defaults, options);
			var $rollWrap = $(this),
				$rollTitle = $rollWrap.find(options.rollTitle);
				$rollEls = $rollWrap.find(options.rollEls);
				$rollEleLength = $rollWrap.find(options.rollEls).length;
				$rollConTime = options.rollConTime;

			$(document).ready(function(){
				_autoContentRoll();
			});

			function bigImgIndex() {
				$rollEls.each(function(i, el) {
				  if ($(el).is(':visible')) {
				    bigIndex = i;
				  }
				});
				return bigIndex;
			}

			function _autoContentRoll(){	

				function slideRoll(){ 
					var conIndex = bigImgIndex();
					if ( conIndex == ($rollEleLength-1) ) {
						conIndex = -1;
					} 

					$rollTitle.eq(conIndex).removeClass('cur');
					$rollTitle.eq(conIndex + 1).addClass('cur');

					$rollEls.eq(conIndex).hide();
					$rollEls.eq(conIndex + 1).show();
				} 
				slideAction = setInterval(slideRoll, $rollConTime);
			} 

			$rollTitle.mouseover(function(){
					clearInterval(slideAction); 
					var conIndex = bigImgIndex();
					$rollTitle.removeClass('cur').eq($(this).index()).addClass('cur');
					$rollEls.hide().eq($(this).index()).fadeIn(300);
				}).mouseout(function(){
				   _autoContentRoll()
			});
		}

	});
})(jQuery);



//切换插件 2014-08-28
(function($){
	$.fn.extend({
		fadeSlide : function(options){
			var defaults = {
				fadeBtn : '.arr',//切换按钮
				fadeDots : '.fadeDots',//切换圆点序列（如有）
				fadeCon : '.fadeCon',//切换内容容器
				fadeCurClass : 'cur',//圆点选中类名
				dotsEvent : 'click',//圆点触发事件
				fadeTime : 300,//切换动画时长
				fadeRange : 15000,//切换间隔
				autoFade : false//自动切换
			}
			var options = $.extend(defaults, options),
				$fadeWrap = this,
				$fadeBtn = $fadeWrap.find(options.fadeBtn),
				$fadeDots = $fadeWrap.find(options.fadeDots),
				$fadeCon = $fadeWrap.find(options.fadeCon),
				len = $fadeCon.length,
				autoFlag = null;
			$fadeDots.on(options.dotsEvent, function(){				
				if(!$(this).hasClass(options.fadeCurClass))
					fadeOutFn($(this).index());
			});
			$fadeBtn.on('click', function(){
				var index = ($fadeWrap.find($('.' + options.fadeCurClass)).index() + (($(this).hasClass('next')) ? 1 : (-1))) % len;
				fadeOutFn(index);
			})
			$fadeWrap.on('mouseenter', function(){
				clearTimeout(autoFlag);
			}).on('mouseleave', function(){
				var $that = $(this);
				(!options.autoFade) || _setAutoFlag();
			})
			$(document).ready(function(){
				var $that = $(this);
				(!options.autoFade) || _setAutoFlag();
			});
			function autoFadeFn(direct){
				clearTimeout(autoFlag);
				var direct = direct || 'next', index = ($fadeWrap.find($('.' + options.fadeCurClass)).index() + ((direct == 'next') ? 1 : (-1))) % len;
				fadeOutFn(index);
				_setAutoFlag();
			}
			function _setAutoFlag(){
				autoFlag = setTimeout(function(){
					autoFadeFn('next')
				}, options.fadeRange);
			}
			function fadeOutFn(index){
				$fadeDots.removeClass(options.fadeCurClass).eq(index).addClass(options.fadeCurClass);
				$fadeCon.hide().eq(index).fadeIn(options.fadeTime);
			}
			return {
				fadeOutFn : fadeOutFn
			}
		},
		slideImage : function(options){
			//default
			var defaults = {
				slideEl : 'slide-li',
				slideElMg : 10,
				slideBtn : 'slide-arr',
				slideTime : 1000,
				slideRange : 7000,
				slideNum : 5,
				autoSlide : true,
				afterCallback: function () {},
				beforeCallback: function () {}
			};
			var inter, enable = true;
			var options = $.extend(defaults, options),
				$slideWrap = $(this),
				$slideEls = $slideWrap.find(options.slideEl),
				$slideList = $slideEls.parent(),
				slideWrapWidth = $slideWrap.width(),
				slideElWidth = $slideEls.width() + options.slideElMg,
				slideStep = options.slideNum * slideElWidth,
				$slideBtn = $slideWrap.find(options.slideBtn);
			
			$slideBtn.on('click', function(){
				if(!enable) return;
				if($(this).hasClass('next'))
					_slideToLeft();
				else
					_slideToRight();
			});
			$(document).ready(function(){
				$slideList.css({width : ($slideEls.length + options.slideNum) * slideElWidth, left : 0});
				_setAutoSlide();
			});
			$slideWrap.on('mouseenter', function(){//检测鼠标移入移出
				clearTimeout(inter);
			}).on('mouseleave', function(){
				_setAutoSlide();
			});
			function _setAutoSlide(){//自动滚动
				clearTimeout(inter);
				if(options.autoSlide){
					inter = setTimeout(function(){
						_slideToLeft();
						_setAutoSlide();
					}, options.slideRange);
				}
			}
			function _slideToLeft(){
				options.afterCallback.call($slideWrap);
				enable = false;
				var elClones = $slideWrap.find(options.slideEl).slice(0, options.slideNum);
				$slideList.append(elClones.clone());
				$slideList.animate({left : '-=' + slideStep}, options.slideTime, function(){
					elClones.remove();
					$slideList.css({ left : '+=' + slideStep});
					enable = true;
				});
				options.beforeCallback.call($slideWrap);
			}
			function _slideToRight(){
				options.afterCallback.call($slideWrap);
				enable = false;
				var elClones = $slideWrap.find(options.slideEl).slice('-' + options.slideNum);
				$slideList.prepend(elClones.clone());
				$slideList.css({left : '-=' + slideStep});
				$slideList.animate({left : '+=' + slideStep}, options.slideTime, function(){
					elClones.remove();
					enable = true;
				});
				options.beforeCallback.call($slideWrap);
			}			
		},
		rollText : function(options){//列表文字自动上滚
			var defaults = {
				rollList : 'ul',
				rollEls : 'li',
				rollNum : 1,
				rollTime : 1000,
				rollRange : 3000,
				autoRoll : true
			};
			var options = $.extend(defaults, options);
			var $rollWrap = $(this),
				$rollList = $rollWrap.find(options.rollList),
				autoInter;
			$rollWrap.on('mouseenter', function(){
				_clearAutoRoll();
			}).on('mouseleave', function(){
				_setAutoRoll();
			})
			$(document).ready(function(){
				_setAutoRoll();
			});
			function _setAutoRoll(){
				if(options.autoRoll){
					autoInter = setTimeout(function(){
						$rollList.each(function(){
							var $wrap = $(this);
							var $origs = $wrap.find(options.rollEls).slice(0, options.rollNum);
							$wrap.append($origs.clone());
							$origs.slideUp(options.rollTime, function(){
								$origs.remove();
							});
						});
						 _setAutoRoll();
					}, options.rollRange);
				}				
			}
			function _clearAutoRoll(){
				clearTimeout(autoInter);
			}
		},
		autoRoll : function(options){
			var defaults = {
				rollTitle : '.channel-wrap a',
				rollEls : '.juhe-con-wrap',
				rollConTime : 10000
			};

			var options = $.extend(defaults, options);
			var $rollWrap = $(this),
				$rollTitle = $rollWrap.find(options.rollTitle);
				$rollEls = $rollWrap.find(options.rollEls);
				$rollEleLength = $rollWrap.find(options.rollEls).length;
				$rollConTime = options.rollConTime;

			$(document).ready(function(){
				_autoContentRoll();
			});

			function bigImgIndex() {
				$rollEls.each(function(i, el) {
				  if ($(el).is(':visible')) {
				    bigIndex = i;
				  }
				});
				return bigIndex;
			}

			function _autoContentRoll(){	

				function slideRoll(){ 
					var conIndex = bigImgIndex();
					if ( conIndex == ($rollEleLength-1) ) {
						conIndex = -1;
					} 

					$rollTitle.eq(conIndex).removeClass('cur');
					$rollTitle.eq(conIndex + 1).addClass('cur');

					$rollEls.eq(conIndex).hide();
					$rollEls.eq(conIndex + 1).show();
				} 
				slideAction = setInterval(slideRoll, $rollConTime);
			} 

			$rollTitle.mouseover(function(){
					clearInterval(slideAction); 
					var conIndex = bigImgIndex();
					$rollTitle.removeClass('cur').eq($(this).index()).addClass('cur');
					$rollEls.hide().eq($(this).index()).fadeIn(300);
				}).mouseout(function(){
				   _autoContentRoll()
			});
		}

	});
})(jQuery);



//切换插件 2014-08-28
(function($){
	$.fn.extend({
		fadeSlide : function(options){
			var defaults = {
				fadeBtn : '.arr',//切换按钮
				fadeDots : '.fadeDots',//切换圆点序列（如有）
				fadeCon : '.fadeCon',//切换内容容器
				fadeCurClass : 'cur',//圆点选中类名
				dotsEvent : 'click',//圆点触发事件
				fadeTime : 300,//切换动画时长
				fadeRange : 15000,//切换间隔
				autoFade : false//自动切换
			}
			var options = $.extend(defaults, options),
				$fadeWrap = this,
				$fadeBtn = $fadeWrap.find(options.fadeBtn),
				$fadeDots = $fadeWrap.find(options.fadeDots),
				$fadeCon = $fadeWrap.find(options.fadeCon),
				len = $fadeCon.length,
				autoFlag = null;
			$fadeDots.on(options.dotsEvent, function(){				
				if(!$(this).hasClass(options.fadeCurClass))
					fadeOutFn($(this).index());
			});
			$fadeBtn.on('click', function(){
				var index = ($fadeWrap.find($('.' + options.fadeCurClass)).index() + (($(this).hasClass('next')) ? 1 : (-1))) % len;
				fadeOutFn(index);
			})
			$fadeWrap.on('mouseenter', function(){
				clearTimeout(autoFlag);
			}).on('mouseleave', function(){
				var $that = $(this);
				(!options.autoFade) || _setAutoFlag();
			})
			$(document).ready(function(){
				var $that = $(this);
				(!options.autoFade) || _setAutoFlag();
			});
			function autoFadeFn(direct){
				clearTimeout(autoFlag);
				var direct = direct || 'next', index = ($fadeWrap.find($('.' + options.fadeCurClass)).index() + ((direct == 'next') ? 1 : (-1))) % len;
				fadeOutFn(index);
				_setAutoFlag();
			}
			function _setAutoFlag(){
				autoFlag = setTimeout(function(){
					autoFadeFn('next')
				}, options.fadeRange);
			}
			function fadeOutFn(index){
				$fadeDots.removeClass(options.fadeCurClass).eq(index).addClass(options.fadeCurClass);
				$fadeCon.hide().eq(index).fadeIn(options.fadeTime);
			}
			return {
				fadeOutFn : fadeOutFn
			}
		},
		slideImage : function(options){
			//default
			var defaults = {
				slideEl : 'slide-li',
				slideElMg : 10,
				slideBtn : 'slide-arr',
				slideTime : 1000,
				slideRange : 7000,
				slideNum : 5,
				autoSlide : true,
				afterCallback: function () {},
				beforeCallback: function () {}
			};
			var inter, enable = true;
			var options = $.extend(defaults, options),
				$slideWrap = $(this),
				$slideEls = $slideWrap.find(options.slideEl),
				$slideList = $slideEls.parent(),
				slideWrapWidth = $slideWrap.width(),
				slideElWidth = $slideEls.width() + options.slideElMg,
				slideStep = options.slideNum * slideElWidth,
				$slideBtn = $slideWrap.find(options.slideBtn);
			
			$slideBtn.on('click', function(){
				if(!enable) return;
				if($(this).hasClass('next'))
					_slideToLeft();
				else
					_slideToRight();
			});
			$(document).ready(function(){
				$slideList.css({width : ($slideEls.length + options.slideNum) * slideElWidth, left : 0});
				_setAutoSlide();
			});
			$slideWrap.on('mouseenter', function(){//检测鼠标移入移出
				clearTimeout(inter);
			}).on('mouseleave', function(){
				_setAutoSlide();
			});
			function _setAutoSlide(){//自动滚动
				clearTimeout(inter);
				if(options.autoSlide){
					inter = setTimeout(function(){
						_slideToLeft();
						_setAutoSlide();
					}, options.slideRange);
				}
			}
			function _slideToLeft(){
				options.afterCallback.call($slideWrap);
				enable = false;
				var elClones = $slideWrap.find(options.slideEl).slice(0, options.slideNum);
				$slideList.append(elClones.clone());
				$slideList.animate({left : '-=' + slideStep}, options.slideTime, function(){
					elClones.remove();
					$slideList.css({ left : '+=' + slideStep});
					enable = true;
				});
				options.beforeCallback.call($slideWrap);
			}
			function _slideToRight(){
				options.afterCallback.call($slideWrap);
				enable = false;
				var elClones = $slideWrap.find(options.slideEl).slice('-' + options.slideNum);
				$slideList.prepend(elClones.clone());
				$slideList.css({left : '-=' + slideStep});
				$slideList.animate({left : '+=' + slideStep}, options.slideTime, function(){
					elClones.remove();
					enable = true;
				});
				options.beforeCallback.call($slideWrap);
			}			
		},
		rollText : function(options){//列表文字自动上滚
			var defaults = {
				rollList : 'ul',
				rollEls : 'li',
				rollNum : 1,
				rollTime : 1000,
				rollRange : 3000,
				autoRoll : true
			};
			var options = $.extend(defaults, options);
			var $rollWrap = $(this),
				$rollList = $rollWrap.find(options.rollList),
				autoInter;
			$rollWrap.on('mouseenter', function(){
				_clearAutoRoll();
			}).on('mouseleave', function(){
				_setAutoRoll();
			})
			$(document).ready(function(){
				_setAutoRoll();
			});
			function _setAutoRoll(){
				if(options.autoRoll){
					autoInter = setTimeout(function(){
						$rollList.each(function(){
							var $wrap = $(this);
							var $origs = $wrap.find(options.rollEls).slice(0, options.rollNum);
							$wrap.append($origs.clone());
							$origs.slideUp(options.rollTime, function(){
								$origs.remove();
							});
						});
						 _setAutoRoll();
					}, options.rollRange);
				}				
			}
			function _clearAutoRoll(){
				clearTimeout(autoInter);
			}
		},
		autoRoll : function(options){
			var defaults = {
				rollTitle : '.channel-wrap a',
				rollEls : '.juhe-con-wrap',
				rollConTime : 10000
			};

			var options = $.extend(defaults, options);
			var $rollWrap = $(this),
				$rollTitle = $rollWrap.find(options.rollTitle);
				$rollEls = $rollWrap.find(options.rollEls);
				$rollEleLength = $rollWrap.find(options.rollEls).length;
				$rollConTime = options.rollConTime;

			$(document).ready(function(){
				_autoContentRoll();
			});

			function bigImgIndex() {
				$rollEls.each(function(i, el) {
				  if ($(el).is(':visible')) {
				    bigIndex = i;
				  }
				});
				return bigIndex;
			}

			function _autoContentRoll(){	

				function slideRoll(){ 
					var conIndex = bigImgIndex();
					if ( conIndex == ($rollEleLength-1) ) {
						conIndex = -1;
					} 

					$rollTitle.eq(conIndex).removeClass('cur');
					$rollTitle.eq(conIndex + 1).addClass('cur');

					$rollEls.eq(conIndex).hide();
					$rollEls.eq(conIndex + 1).show();
				} 
				slideAction = setInterval(slideRoll, $rollConTime);
			} 

			$rollTitle.mouseover(function(){
					clearInterval(slideAction); 
					var conIndex = bigImgIndex();
					$rollTitle.removeClass('cur').eq($(this).index()).addClass('cur');
					$rollEls.hide().eq($(this).index()).fadeIn(300);
				}).mouseout(function(){
				   _autoContentRoll()
			});
		}

	});
})(jQuery);



//切换插件 2014-08-28
(function($){
	$.fn.extend({
		fadeSlide : function(options){
			var defaults = {
				fadeBtn : '.arr',//切换按钮
				fadeDots : '.fadeDots',//切换圆点序列（如有）
				fadeCon : '.fadeCon',//切换内容容器
				fadeCurClass : 'cur',//圆点选中类名
				dotsEvent : 'click',//圆点触发事件
				fadeTime : 300,//切换动画时长
				fadeRange : 15000,//切换间隔
				autoFade : false//自动切换
			}
			var options = $.extend(defaults, options),
				$fadeWrap = this,
				$fadeBtn = $fadeWrap.find(options.fadeBtn),
				$fadeDots = $fadeWrap.find(options.fadeDots),
				$fadeCon = $fadeWrap.find(options.fadeCon),
				len = $fadeCon.length,
				autoFlag = null;
			$fadeDots.on(options.dotsEvent, function(){				
				if(!$(this).hasClass(options.fadeCurClass))
					fadeOutFn($(this).index());
			});
			$fadeBtn.on('click', function(){
				var index = ($fadeWrap.find($('.' + options.fadeCurClass)).index() + (($(this).hasClass('next')) ? 1 : (-1))) % len;
				fadeOutFn(index);
			})
			$fadeWrap.on('mouseenter', function(){
				clearTimeout(autoFlag);
			}).on('mouseleave', function(){
				var $that = $(this);
				(!options.autoFade) || _setAutoFlag();
			})
			$(document).ready(function(){
				var $that = $(this);
				(!options.autoFade) || _setAutoFlag();
			});
			function autoFadeFn(direct){
				clearTimeout(autoFlag);
				var direct = direct || 'next', index = ($fadeWrap.find($('.' + options.fadeCurClass)).index() + ((direct == 'next') ? 1 : (-1))) % len;
				fadeOutFn(index);
				_setAutoFlag();
			}
			function _setAutoFlag(){
				autoFlag = setTimeout(function(){
					autoFadeFn('next')
				}, options.fadeRange);
			}
			function fadeOutFn(index){
				$fadeDots.removeClass(options.fadeCurClass).eq(index).addClass(options.fadeCurClass);
				$fadeCon.hide().eq(index).fadeIn(options.fadeTime);
			}
			return {
				fadeOutFn : fadeOutFn
			}
		},
		slideImage : function(options){
			//default
			var defaults = {
				slideEl : 'slide-li',
				slideElMg : 10,
				slideBtn : 'slide-arr',
				slideTime : 1000,
				slideRange : 7000,
				slideNum : 5,
				autoSlide : true,
				afterCallback: function () {},
				beforeCallback: function () {}
			};
			var inter, enable = true;
			var options = $.extend(defaults, options),
				$slideWrap = $(this),
				$slideEls = $slideWrap.find(options.slideEl),
				$slideList = $slideEls.parent(),
				slideWrapWidth = $slideWrap.width(),
				slideElWidth = $slideEls.width() + options.slideElMg,
				slideStep = options.slideNum * slideElWidth,
				$slideBtn = $slideWrap.find(options.slideBtn);
			
			$slideBtn.on('click', function(){
				if(!enable) return;
				if($(this).hasClass('next'))
					_slideToLeft();
				else
					_slideToRight();
			});
			$(document).ready(function(){
				$slideList.css({width : ($slideEls.length + options.slideNum) * slideElWidth, left : 0});
				_setAutoSlide();
			});
			$slideWrap.on('mouseenter', function(){//检测鼠标移入移出
				clearTimeout(inter);
			}).on('mouseleave', function(){
				_setAutoSlide();
			});
			function _setAutoSlide(){//自动滚动
				clearTimeout(inter);
				if(options.autoSlide){
					inter = setTimeout(function(){
						_slideToLeft();
						_setAutoSlide();
					}, options.slideRange);
				}
			}
			function _slideToLeft(){
				options.afterCallback.call($slideWrap);
				enable = false;
				var elClones = $slideWrap.find(options.slideEl).slice(0, options.slideNum);
				$slideList.append(elClones.clone());
				$slideList.animate({left : '-=' + slideStep}, options.slideTime, function(){
					elClones.remove();
					$slideList.css({ left : '+=' + slideStep});
					enable = true;
				});
				options.beforeCallback.call($slideWrap);
			}
			function _slideToRight(){
				options.afterCallback.call($slideWrap);
				enable = false;
				var elClones = $slideWrap.find(options.slideEl).slice('-' + options.slideNum);
				$slideList.prepend(elClones.clone());
				$slideList.css({left : '-=' + slideStep});
				$slideList.animate({left : '+=' + slideStep}, options.slideTime, function(){
					elClones.remove();
					enable = true;
				});
				options.beforeCallback.call($slideWrap);
			}			
		},
		rollText : function(options){//列表文字自动上滚
			var defaults = {
				rollList : 'ul',
				rollEls : 'li',
				rollNum : 1,
				rollTime : 1000,
				rollRange : 3000,
				autoRoll : true
			};
			var options = $.extend(defaults, options);
			var $rollWrap = $(this),
				$rollList = $rollWrap.find(options.rollList),
				autoInter;
			$rollWrap.on('mouseenter', function(){
				_clearAutoRoll();
			}).on('mouseleave', function(){
				_setAutoRoll();
			})
			$(document).ready(function(){
				_setAutoRoll();
			});
			function _setAutoRoll(){
				if(options.autoRoll){
					autoInter = setTimeout(function(){
						$rollList.each(function(){
							var $wrap = $(this);
							var $origs = $wrap.find(options.rollEls).slice(0, options.rollNum);
							$wrap.append($origs.clone());
							$origs.slideUp(options.rollTime, function(){
								$origs.remove();
							});
						});
						 _setAutoRoll();
					}, options.rollRange);
				}				
			}
			function _clearAutoRoll(){
				clearTimeout(autoInter);
			}
		},
		autoRoll : function(options){
			var defaults = {
				rollTitle : '.channel-wrap a',
				rollEls : '.juhe-con-wrap',
				rollConTime : 10000
			};

			var options = $.extend(defaults, options);
			var $rollWrap = $(this),
				$rollTitle = $rollWrap.find(options.rollTitle);
				$rollEls = $rollWrap.find(options.rollEls);
				$rollEleLength = $rollWrap.find(options.rollEls).length;
				$rollConTime = options.rollConTime;

			$(document).ready(function(){
				_autoContentRoll();
			});

			function bigImgIndex() {
				$rollEls.each(function(i, el) {
				  if ($(el).is(':visible')) {
				    bigIndex = i;
				  }
				});
				return bigIndex;
			}

			function _autoContentRoll(){	

				function slideRoll(){ 
					var conIndex = bigImgIndex();
					if ( conIndex == ($rollEleLength-1) ) {
						conIndex = -1;
					} 

					$rollTitle.eq(conIndex).removeClass('cur');
					$rollTitle.eq(conIndex + 1).addClass('cur');

					$rollEls.eq(conIndex).hide();
					$rollEls.eq(conIndex + 1).show();
				} 
				slideAction = setInterval(slideRoll, $rollConTime);
			} 

			$rollTitle.mouseover(function(){
					clearInterval(slideAction); 
					var conIndex = bigImgIndex();
					$rollTitle.removeClass('cur').eq($(this).index()).addClass('cur');
					$rollEls.hide().eq($(this).index()).fadeIn(300);
				}).mouseout(function(){
				   _autoContentRoll()
			});
		}

	});
})(jQuery);



//切换插件 2014-08-28
(function($){
	$.fn.extend({
		fadeSlide : function(options){
			var defaults = {
				fadeBtn : '.arr',//切换按钮
				fadeDots : '.fadeDots',//切换圆点序列（如有）
				fadeCon : '.fadeCon',//切换内容容器
				fadeCurClass : 'cur',//圆点选中类名
				dotsEvent : 'click',//圆点触发事件
				fadeTime : 300,//切换动画时长
				fadeRange : 15000,//切换间隔
				autoFade : false//自动切换
			}
			var options = $.extend(defaults, options),
				$fadeWrap = this,
				$fadeBtn = $fadeWrap.find(options.fadeBtn),
				$fadeDots = $fadeWrap.find(options.fadeDots),
				$fadeCon = $fadeWrap.find(options.fadeCon),
				len = $fadeCon.length,
				autoFlag = null;
			$fadeDots.on(options.dotsEvent, function(){				
				if(!$(this).hasClass(options.fadeCurClass))
					fadeOutFn($(this).index());
			});
			$fadeBtn.on('click', function(){
				var index = ($fadeWrap.find($('.' + options.fadeCurClass)).index() + (($(this).hasClass('next')) ? 1 : (-1))) % len;
				fadeOutFn(index);
			})
			$fadeWrap.on('mouseenter', function(){
				clearTimeout(autoFlag);
			}).on('mouseleave', function(){
				var $that = $(this);
				(!options.autoFade) || _setAutoFlag();
			})
			$(document).ready(function(){
				var $that = $(this);
				(!options.autoFade) || _setAutoFlag();
			});
			function autoFadeFn(direct){
				clearTimeout(autoFlag);
				var direct = direct || 'next', index = ($fadeWrap.find($('.' + options.fadeCurClass)).index() + ((direct == 'next') ? 1 : (-1))) % len;
				fadeOutFn(index);
				_setAutoFlag();
			}
			function _setAutoFlag(){
				autoFlag = setTimeout(function(){
					autoFadeFn('next')
				}, options.fadeRange);
			}
			function fadeOutFn(index){
				$fadeDots.removeClass(options.fadeCurClass).eq(index).addClass(options.fadeCurClass);
				$fadeCon.hide().eq(index).fadeIn(options.fadeTime);
			}
			return {
				fadeOutFn : fadeOutFn
			}
		},
		slideImage : function(options){
			//default
			var defaults = {
				slideEl : 'slide-li',
				slideElMg : 10,
				slideBtn : 'slide-arr',
				slideTime : 1000,
				slideRange : 7000,
				slideNum : 5,
				autoSlide : true,
				afterCallback: function () {},
				beforeCallback: function () {}
			};
			var inter, enable = true;
			var options = $.extend(defaults, options),
				$slideWrap = $(this),
				$slideEls = $slideWrap.find(options.slideEl),
				$slideList = $slideEls.parent(),
				slideWrapWidth = $slideWrap.width(),
				slideElWidth = $slideEls.width() + options.slideElMg,
				slideStep = options.slideNum * slideElWidth,
				$slideBtn = $slideWrap.find(options.slideBtn);
			
			$slideBtn.on('click', function(){
				if(!enable) return;
				if($(this).hasClass('next'))
					_slideToLeft();
				else
					_slideToRight();
			});
			$(document).ready(function(){
				$slideList.css({width : ($slideEls.length + options.slideNum) * slideElWidth, left : 0});
				_setAutoSlide();
			});
			$slideWrap.on('mouseenter', function(){//检测鼠标移入移出
				clearTimeout(inter);
			}).on('mouseleave', function(){
				_setAutoSlide();
			});
			function _setAutoSlide(){//自动滚动
				clearTimeout(inter);
				if(options.autoSlide){
					inter = setTimeout(function(){
						_slideToLeft();
						_setAutoSlide();
					}, options.slideRange);
				}
			}
			function _slideToLeft(){
				options.afterCallback.call($slideWrap);
				enable = false;
				var elClones = $slideWrap.find(options.slideEl).slice(0, options.slideNum);
				$slideList.append(elClones.clone());
				$slideList.animate({left : '-=' + slideStep}, options.slideTime, function(){
					elClones.remove();
					$slideList.css({ left : '+=' + slideStep});
					enable = true;
				});
				options.beforeCallback.call($slideWrap);
			}
			function _slideToRight(){
				options.afterCallback.call($slideWrap);
				enable = false;
				var elClones = $slideWrap.find(options.slideEl).slice('-' + options.slideNum);
				$slideList.prepend(elClones.clone());
				$slideList.css({left : '-=' + slideStep});
				$slideList.animate({left : '+=' + slideStep}, options.slideTime, function(){
					elClones.remove();
					enable = true;
				});
				options.beforeCallback.call($slideWrap);
			}			
		},
		rollText : function(options){//列表文字自动上滚
			var defaults = {
				rollList : 'ul',
				rollEls : 'li',
				rollNum : 1,
				rollTime : 1000,
				rollRange : 3000,
				autoRoll : true
			};
			var options = $.extend(defaults, options);
			var $rollWrap = $(this),
				$rollList = $rollWrap.find(options.rollList),
				autoInter;
			$rollWrap.on('mouseenter', function(){
				_clearAutoRoll();
			}).on('mouseleave', function(){
				_setAutoRoll();
			})
			$(document).ready(function(){
				_setAutoRoll();
			});
			function _setAutoRoll(){
				if(options.autoRoll){
					autoInter = setTimeout(function(){
						$rollList.each(function(){
							var $wrap = $(this);
							var $origs = $wrap.find(options.rollEls).slice(0, options.rollNum);
							$wrap.append($origs.clone());
							$origs.slideUp(options.rollTime, function(){
								$origs.remove();
							});
						});
						 _setAutoRoll();
					}, options.rollRange);
				}				
			}
			function _clearAutoRoll(){
				clearTimeout(autoInter);
			}
		},
		autoRoll : function(options){
			var defaults = {
				rollTitle : '.channel-wrap a',
				rollEls : '.juhe-con-wrap',
				rollConTime : 10000
			};

			var options = $.extend(defaults, options);
			var $rollWrap = $(this),
				$rollTitle = $rollWrap.find(options.rollTitle);
				$rollEls = $rollWrap.find(options.rollEls);
				$rollEleLength = $rollWrap.find(options.rollEls).length;
				$rollConTime = options.rollConTime;

			$(document).ready(function(){
				_autoContentRoll();
			});

			function bigImgIndex() {
				$rollEls.each(function(i, el) {
				  if ($(el).is(':visible')) {
				    bigIndex = i;
				  }
				});
				return bigIndex;
			}

			function _autoContentRoll(){	

				function slideRoll(){ 
					var conIndex = bigImgIndex();
					if ( conIndex == ($rollEleLength-1) ) {
						conIndex = -1;
					} 

					$rollTitle.eq(conIndex).removeClass('cur');
					$rollTitle.eq(conIndex + 1).addClass('cur');

					$rollEls.eq(conIndex).hide();
					$rollEls.eq(conIndex + 1).show();
				} 
				slideAction = setInterval(slideRoll, $rollConTime);
			} 

			$rollTitle.mouseover(function(){
					clearInterval(slideAction); 
					var conIndex = bigImgIndex();
					$rollTitle.removeClass('cur').eq($(this).index()).addClass('cur');
					$rollEls.hide().eq($(this).index()).fadeIn(300);
				}).mouseout(function(){
				   _autoContentRoll()
			});
		}

	});
})(jQuery);



//切换插件 2014-08-28
(function($){
	$.fn.extend({
		fadeSlide : function(options){
			var defaults = {
				fadeBtn : '.arr',//切换按钮
				fadeDots : '.fadeDots',//切换圆点序列（如有）
				fadeCon : '.fadeCon',//切换内容容器
				fadeCurClass : 'cur',//圆点选中类名
				dotsEvent : 'click',//圆点触发事件
				fadeTime : 300,//切换动画时长
				fadeRange : 15000,//切换间隔
				autoFade : false//自动切换
			}
			var options = $.extend(defaults, options),
				$fadeWrap = this,
				$fadeBtn = $fadeWrap.find(options.fadeBtn),
				$fadeDots = $fadeWrap.find(options.fadeDots),
				$fadeCon = $fadeWrap.find(options.fadeCon),
				len = $fadeCon.length,
				autoFlag = null;
			$fadeDots.on(options.dotsEvent, function(){				
				if(!$(this).hasClass(options.fadeCurClass))
					fadeOutFn($(this).index());
			});
			$fadeBtn.on('click', function(){
				var index = ($fadeWrap.find($('.' + options.fadeCurClass)).index() + (($(this).hasClass('next')) ? 1 : (-1))) % len;
				fadeOutFn(index);
			})
			$fadeWrap.on('mouseenter', function(){
				clearTimeout(autoFlag);
			}).on('mouseleave', function(){
				var $that = $(this);
				(!options.autoFade) || _setAutoFlag();
			})
			$(document).ready(function(){
				var $that = $(this);
				(!options.autoFade) || _setAutoFlag();
			});
			function autoFadeFn(direct){
				clearTimeout(autoFlag);
				var direct = direct || 'next', index = ($fadeWrap.find($('.' + options.fadeCurClass)).index() + ((direct == 'next') ? 1 : (-1))) % len;
				fadeOutFn(index);
				_setAutoFlag();
			}
			function _setAutoFlag(){
				autoFlag = setTimeout(function(){
					autoFadeFn('next')
				}, options.fadeRange);
			}
			function fadeOutFn(index){
				$fadeDots.removeClass(options.fadeCurClass).eq(index).addClass(options.fadeCurClass);
				$fadeCon.hide().eq(index).fadeIn(options.fadeTime);
			}
			return {
				fadeOutFn : fadeOutFn
			}
		},
		slideImage : function(options){
			//default
			var defaults = {
				slideEl : 'slide-li',
				slideElMg : 10,
				slideBtn : 'slide-arr',
				slideTime : 1000,
				slideRange : 7000,
				slideNum : 5,
				autoSlide : true,
				afterCallback: function () {},
				beforeCallback: function () {}
			};
			var inter, enable = true;
			var options = $.extend(defaults, options),
				$slideWrap = $(this),
				$slideEls = $slideWrap.find(options.slideEl),
				$slideList = $slideEls.parent(),
				slideWrapWidth = $slideWrap.width(),
				slideElWidth = $slideEls.width() + options.slideElMg,
				slideStep = options.slideNum * slideElWidth,
				$slideBtn = $slideWrap.find(options.slideBtn);
			
			$slideBtn.on('click', function(){
				if(!enable) return;
				if($(this).hasClass('next'))
					_slideToLeft();
				else
					_slideToRight();
			});
			$(document).ready(function(){
				$slideList.css({width : ($slideEls.length + options.slideNum) * slideElWidth, left : 0});
				_setAutoSlide();
			});
			$slideWrap.on('mouseenter', function(){//检测鼠标移入移出
				clearTimeout(inter);
			}).on('mouseleave', function(){
				_setAutoSlide();
			});
			function _setAutoSlide(){//自动滚动
				clearTimeout(inter);
				if(options.autoSlide){
					inter = setTimeout(function(){
						_slideToLeft();
						_setAutoSlide();
					}, options.slideRange);
				}
			}
			function _slideToLeft(){
				options.afterCallback.call($slideWrap);
				enable = false;
				var elClones = $slideWrap.find(options.slideEl).slice(0, options.slideNum);
				$slideList.append(elClones.clone());
				$slideList.animate({left : '-=' + slideStep}, options.slideTime, function(){
					elClones.remove();
					$slideList.css({ left : '+=' + slideStep});
					enable = true;
				});
				options.beforeCallback.call($slideWrap);
			}
			function _slideToRight(){
				options.afterCallback.call($slideWrap);
				enable = false;
				var elClones = $slideWrap.find(options.slideEl).slice('-' + options.slideNum);
				$slideList.prepend(elClones.clone());
				$slideList.css({left : '-=' + slideStep});
				$slideList.animate({left : '+=' + slideStep}, options.slideTime, function(){
					elClones.remove();
					enable = true;
				});
				options.beforeCallback.call($slideWrap);
			}			
		},
		rollText : function(options){//列表文字自动上滚
			var defaults = {
				rollList : 'ul',
				rollEls : 'li',
				rollNum : 1,
				rollTime : 1000,
				rollRange : 3000,
				autoRoll : true
			};
			var options = $.extend(defaults, options);
			var $rollWrap = $(this),
				$rollList = $rollWrap.find(options.rollList),
				autoInter;
			$rollWrap.on('mouseenter', function(){
				_clearAutoRoll();
			}).on('mouseleave', function(){
				_setAutoRoll();
			})
			$(document).ready(function(){
				_setAutoRoll();
			});
			function _setAutoRoll(){
				if(options.autoRoll){
					autoInter = setTimeout(function(){
						$rollList.each(function(){
							var $wrap = $(this);
							var $origs = $wrap.find(options.rollEls).slice(0, options.rollNum);
							$wrap.append($origs.clone());
							$origs.slideUp(options.rollTime, function(){
								$origs.remove();
							});
						});
						 _setAutoRoll();
					}, options.rollRange);
				}				
			}
			function _clearAutoRoll(){
				clearTimeout(autoInter);
			}
		},
		autoRoll : function(options){
			var defaults = {
				rollTitle : '.channel-wrap a',
				rollEls : '.juhe-con-wrap',
				rollConTime : 10000
			};

			var options = $.extend(defaults, options);
			var $rollWrap = $(this),
				$rollTitle = $rollWrap.find(options.rollTitle);
				$rollEls = $rollWrap.find(options.rollEls);
				$rollEleLength = $rollWrap.find(options.rollEls).length;
				$rollConTime = options.rollConTime;

			$(document).ready(function(){
				_autoContentRoll();
			});

			function bigImgIndex() {
				$rollEls.each(function(i, el) {
				  if ($(el).is(':visible')) {
				    bigIndex = i;
				  }
				});
				return bigIndex;
			}

			function _autoContentRoll(){	

				function slideRoll(){ 
					var conIndex = bigImgIndex();
					if ( conIndex == ($rollEleLength-1) ) {
						conIndex = -1;
					} 

					$rollTitle.eq(conIndex).removeClass('cur');
					$rollTitle.eq(conIndex + 1).addClass('cur');

					$rollEls.eq(conIndex).hide();
					$rollEls.eq(conIndex + 1).show();
				} 
				slideAction = setInterval(slideRoll, $rollConTime);
			} 

			$rollTitle.mouseover(function(){
					clearInterval(slideAction); 
					var conIndex = bigImgIndex();
					$rollTitle.removeClass('cur').eq($(this).index()).addClass('cur');
					$rollEls.hide().eq($(this).index()).fadeIn(300);
				}).mouseout(function(){
				   _autoContentRoll()
			});
		}

	});
})(jQuery);



//切换插件 2014-08-28
(function($){
	$.fn.extend({
		fadeSlide : function(options){
			var defaults = {
				fadeBtn : '.arr',//切换按钮
				fadeDots : '.fadeDots',//切换圆点序列（如有）
				fadeCon : '.fadeCon',//切换内容容器
				fadeCurClass : 'cur',//圆点选中类名
				dotsEvent : 'click',//圆点触发事件
				fadeTime : 300,//切换动画时长
				fadeRange : 15000,//切换间隔
				autoFade : false//自动切换
			}
			var options = $.extend(defaults, options),
				$fadeWrap = this,
				$fadeBtn = $fadeWrap.find(options.fadeBtn),
				$fadeDots = $fadeWrap.find(options.fadeDots),
				$fadeCon = $fadeWrap.find(options.fadeCon),
				len = $fadeCon.length,
				autoFlag = null;
			$fadeDots.on(options.dotsEvent, function(){				
				if(!$(this).hasClass(options.fadeCurClass))
					fadeOutFn($(this).index());
			});
			$fadeBtn.on('click', function(){
				var index = ($fadeWrap.find($('.' + options.fadeCurClass)).index() + (($(this).hasClass('next')) ? 1 : (-1))) % len;
				fadeOutFn(index);
			})
			$fadeWrap.on('mouseenter', function(){
				clearTimeout(autoFlag);
			}).on('mouseleave', function(){
				var $that = $(this);
				(!options.autoFade) || _setAutoFlag();
			})
			$(document).ready(function(){
				var $that = $(this);
				(!options.autoFade) || _setAutoFlag();
			});
			function autoFadeFn(direct){
				clearTimeout(autoFlag);
				var direct = direct || 'next', index = ($fadeWrap.find($('.' + options.fadeCurClass)).index() + ((direct == 'next') ? 1 : (-1))) % len;
				fadeOutFn(index);
				_setAutoFlag();
			}
			function _setAutoFlag(){
				autoFlag = setTimeout(function(){
					autoFadeFn('next')
				}, options.fadeRange);
			}
			function fadeOutFn(index){
				$fadeDots.removeClass(options.fadeCurClass).eq(index).addClass(options.fadeCurClass);
				$fadeCon.hide().eq(index).fadeIn(options.fadeTime);
			}
			return {
				fadeOutFn : fadeOutFn
			}
		},
		slideImage : function(options){
			//default
			var defaults = {
				slideEl : 'slide-li',
				slideElMg : 10,
				slideBtn : 'slide-arr',
				slideTime : 1000,
				slideRange : 7000,
				slideNum : 5,
				autoSlide : true,
				afterCallback: function () {},
				beforeCallback: function () {}
			};
			var inter, enable = true;
			var options = $.extend(defaults, options),
				$slideWrap = $(this),
				$slideEls = $slideWrap.find(options.slideEl),
				$slideList = $slideEls.parent(),
				slideWrapWidth = $slideWrap.width(),
				slideElWidth = $slideEls.width() + options.slideElMg,
				slideStep = options.slideNum * slideElWidth,
				$slideBtn = $slideWrap.find(options.slideBtn);
			
			$slideBtn.on('click', function(){
				if(!enable) return;
				if($(this).hasClass('next'))
					_slideToLeft();
				else
					_slideToRight();
			});
			$(document).ready(function(){
				$slideList.css({width : ($slideEls.length + options.slideNum) * slideElWidth, left : 0});
				_setAutoSlide();
			});
			$slideWrap.on('mouseenter', function(){//检测鼠标移入移出
				clearTimeout(inter);
			}).on('mouseleave', function(){
				_setAutoSlide();
			});
			function _setAutoSlide(){//自动滚动
				clearTimeout(inter);
				if(options.autoSlide){
					inter = setTimeout(function(){
						_slideToLeft();
						_setAutoSlide();
					}, options.slideRange);
				}
			}
			function _slideToLeft(){
				options.afterCallback.call($slideWrap);
				enable = false;
				var elClones = $slideWrap.find(options.slideEl).slice(0, options.slideNum);
				$slideList.append(elClones.clone());
				$slideList.animate({left : '-=' + slideStep}, options.slideTime, function(){
					elClones.remove();
					$slideList.css({ left : '+=' + slideStep});
					enable = true;
				});
				options.beforeCallback.call($slideWrap);
			}
			function _slideToRight(){
				options.afterCallback.call($slideWrap);
				enable = false;
				var elClones = $slideWrap.find(options.slideEl).slice('-' + options.slideNum);
				$slideList.prepend(elClones.clone());
				$slideList.css({left : '-=' + slideStep});
				$slideList.animate({left : '+=' + slideStep}, options.slideTime, function(){
					elClones.remove();
					enable = true;
				});
				options.beforeCallback.call($slideWrap);
			}			
		},
		rollText : function(options){//列表文字自动上滚
			var defaults = {
				rollList : 'ul',
				rollEls : 'li',
				rollNum : 1,
				rollTime : 1000,
				rollRange : 3000,
				autoRoll : true
			};
			var options = $.extend(defaults, options);
			var $rollWrap = $(this),
				$rollList = $rollWrap.find(options.rollList),
				autoInter;
			$rollWrap.on('mouseenter', function(){
				_clearAutoRoll();
			}).on('mouseleave', function(){
				_setAutoRoll();
			})
			$(document).ready(function(){
				_setAutoRoll();
			});
			function _setAutoRoll(){
				if(options.autoRoll){
					autoInter = setTimeout(function(){
						$rollList.each(function(){
							var $wrap = $(this);
							var $origs = $wrap.find(options.rollEls).slice(0, options.rollNum);
							$wrap.append($origs.clone());
							$origs.slideUp(options.rollTime, function(){
								$origs.remove();
							});
						});
						 _setAutoRoll();
					}, options.rollRange);
				}				
			}
			function _clearAutoRoll(){
				clearTimeout(autoInter);
			}
		},
		autoRoll : function(options){
			var defaults = {
				rollTitle : '.channel-wrap a',
				rollEls : '.juhe-con-wrap',
				rollConTime : 10000
			};

			var options = $.extend(defaults, options);
			var $rollWrap = $(this),
				$rollTitle = $rollWrap.find(options.rollTitle);
				$rollEls = $rollWrap.find(options.rollEls);
				$rollEleLength = $rollWrap.find(options.rollEls).length;
				$rollConTime = options.rollConTime;

			$(document).ready(function(){
				_autoContentRoll();
			});

			function bigImgIndex() {
				$rollEls.each(function(i, el) {
				  if ($(el).is(':visible')) {
				    bigIndex = i;
				  }
				});
				return bigIndex;
			}

			function _autoContentRoll(){	

				function slideRoll(){ 
					var conIndex = bigImgIndex();
					if ( conIndex == ($rollEleLength-1) ) {
						conIndex = -1;
					} 

					$rollTitle.eq(conIndex).removeClass('cur');
					$rollTitle.eq(conIndex + 1).addClass('cur');

					$rollEls.eq(conIndex).hide();
					$rollEls.eq(conIndex + 1).show();
				} 
				slideAction = setInterval(slideRoll, $rollConTime);
			} 

			$rollTitle.mouseover(function(){
					clearInterval(slideAction); 
					var conIndex = bigImgIndex();
					$rollTitle.removeClass('cur').eq($(this).index()).addClass('cur');
					$rollEls.hide().eq($(this).index()).fadeIn(300);
				}).mouseout(function(){
				   _autoContentRoll()
			});
		}

	});
})(jQuery);



//切换插件 2014-08-28
(function($){
	$.fn.extend({
		fadeSlide : function(options){
			var defaults = {
				fadeBtn : '.arr',//切换按钮
				fadeDots : '.fadeDots',//切换圆点序列（如有）
				fadeCon : '.fadeCon',//切换内容容器
				fadeCurClass : 'cur',//圆点选中类名
				dotsEvent : 'click',//圆点触发事件
				fadeTime : 300,//切换动画时长
				fadeRange : 15000,//切换间隔
				autoFade : false//自动切换
			}
			var options = $.extend(defaults, options),
				$fadeWrap = this,
				$fadeBtn = $fadeWrap.find(options.fadeBtn),
				$fadeDots = $fadeWrap.find(options.fadeDots),
				$fadeCon = $fadeWrap.find(options.fadeCon),
				len = $fadeCon.length,
				autoFlag = null;
			$fadeDots.on(options.dotsEvent, function(){				
				if(!$(this).hasClass(options.fadeCurClass))
					fadeOutFn($(this).index());
			});
			$fadeBtn.on('click', function(){
				var index = ($fadeWrap.find($('.' + options.fadeCurClass)).index() + (($(this).hasClass('next')) ? 1 : (-1))) % len;
				fadeOutFn(index);
			})
			$fadeWrap.on('mouseenter', function(){
				clearTimeout(autoFlag);
			}).on('mouseleave', function(){
				var $that = $(this);
				(!options.autoFade) || _setAutoFlag();
			})
			$(document).ready(function(){
				var $that = $(this);
				(!options.autoFade) || _setAutoFlag();
			});
			function autoFadeFn(direct){
				clearTimeout(autoFlag);
				var direct = direct || 'next', index = ($fadeWrap.find($('.' + options.fadeCurClass)).index() + ((direct == 'next') ? 1 : (-1))) % len;
				fadeOutFn(index);
				_setAutoFlag();
			}
			function _setAutoFlag(){
				autoFlag = setTimeout(function(){
					autoFadeFn('next')
				}, options.fadeRange);
			}
			function fadeOutFn(index){
				$fadeDots.removeClass(options.fadeCurClass).eq(index).addClass(options.fadeCurClass);
				$fadeCon.hide().eq(index).fadeIn(options.fadeTime);
			}
			return {
				fadeOutFn : fadeOutFn
			}
		},
		slideImage : function(options){
			//default
			var defaults = {
				slideEl : 'slide-li',
				slideElMg : 10,
				slideBtn : 'slide-arr',
				slideTime : 1000,
				slideRange : 7000,
				slideNum : 5,
				autoSlide : true,
				afterCallback: function () {},
				beforeCallback: function () {}
			};
			var inter, enable = true;
			var options = $.extend(defaults, options),
				$slideWrap = $(this),
				$slideEls = $slideWrap.find(options.slideEl),
				$slideList = $slideEls.parent(),
				slideWrapWidth = $slideWrap.width(),
				slideElWidth = $slideEls.width() + options.slideElMg,
				slideStep = options.slideNum * slideElWidth,
				$slideBtn = $slideWrap.find(options.slideBtn);
			
			$slideBtn.on('click', function(){
				if(!enable) return;
				if($(this).hasClass('next'))
					_slideToLeft();
				else
					_slideToRight();
			});
			$(document).ready(function(){
				$slideList.css({width : ($slideEls.length + options.slideNum) * slideElWidth, left : 0});
				_setAutoSlide();
			});
			$slideWrap.on('mouseenter', function(){//检测鼠标移入移出
				clearTimeout(inter);
			}).on('mouseleave', function(){
				_setAutoSlide();
			});
			function _setAutoSlide(){//自动滚动
				clearTimeout(inter);
				if(options.autoSlide){
					inter = setTimeout(function(){
						_slideToLeft();
						_setAutoSlide();
					}, options.slideRange);
				}
			}
			function _slideToLeft(){
				options.afterCallback.call($slideWrap);
				enable = false;
				var elClones = $slideWrap.find(options.slideEl).slice(0, options.slideNum);
				$slideList.append(elClones.clone());
				$slideList.animate({left : '-=' + slideStep}, options.slideTime, function(){
					elClones.remove();
					$slideList.css({ left : '+=' + slideStep});
					enable = true;
				});
				options.beforeCallback.call($slideWrap);
			}
			function _slideToRight(){
				options.afterCallback.call($slideWrap);
				enable = false;
				var elClones = $slideWrap.find(options.slideEl).slice('-' + options.slideNum);
				$slideList.prepend(elClones.clone());
				$slideList.css({left : '-=' + slideStep});
				$slideList.animate({left : '+=' + slideStep}, options.slideTime, function(){
					elClones.remove();
					enable = true;
				});
				options.beforeCallback.call($slideWrap);
			}			
		},
		rollText : function(options){//列表文字自动上滚
			var defaults = {
				rollList : 'ul',
				rollEls : 'li',
				rollNum : 1,
				rollTime : 1000,
				rollRange : 3000,
				autoRoll : true
			};
			var options = $.extend(defaults, options);
			var $rollWrap = $(this),
				$rollList = $rollWrap.find(options.rollList),
				autoInter;
			$rollWrap.on('mouseenter', function(){
				_clearAutoRoll();
			}).on('mouseleave', function(){
				_setAutoRoll();
			})
			$(document).ready(function(){
				_setAutoRoll();
			});
			function _setAutoRoll(){
				if(options.autoRoll){
					autoInter = setTimeout(function(){
						$rollList.each(function(){
							var $wrap = $(this);
							var $origs = $wrap.find(options.rollEls).slice(0, options.rollNum);
							$wrap.append($origs.clone());
							$origs.slideUp(options.rollTime, function(){
								$origs.remove();
							});
						});
						 _setAutoRoll();
					}, options.rollRange);
				}				
			}
			function _clearAutoRoll(){
				clearTimeout(autoInter);
			}
		},
		autoRoll : function(options){
			var defaults = {
				rollTitle : '.channel-wrap a',
				rollEls : '.juhe-con-wrap',
				rollConTime : 10000
			};

			var options = $.extend(defaults, options);
			var $rollWrap = $(this),
				$rollTitle = $rollWrap.find(options.rollTitle);
				$rollEls = $rollWrap.find(options.rollEls);
				$rollEleLength = $rollWrap.find(options.rollEls).length;
				$rollConTime = options.rollConTime;

			$(document).ready(function(){
				_autoContentRoll();
			});

			function bigImgIndex() {
				$rollEls.each(function(i, el) {
				  if ($(el).is(':visible')) {
				    bigIndex = i;
				  }
				});
				return bigIndex;
			}

			function _autoContentRoll(){	

				function slideRoll(){ 
					var conIndex = bigImgIndex();
					if ( conIndex == ($rollEleLength-1) ) {
						conIndex = -1;
					} 

					$rollTitle.eq(conIndex).removeClass('cur');
					$rollTitle.eq(conIndex + 1).addClass('cur');

					$rollEls.eq(conIndex).hide();
					$rollEls.eq(conIndex + 1).show();
				} 
				slideAction = setInterval(slideRoll, $rollConTime);
			} 

			$rollTitle.mouseover(function(){
					clearInterval(slideAction); 
					var conIndex = bigImgIndex();
					$rollTitle.removeClass('cur').eq($(this).index()).addClass('cur');
					$rollEls.hide().eq($(this).index()).fadeIn(300);
				}).mouseout(function(){
				   _autoContentRoll()
			});
		}

	});
})(jQuery);



//切换插件 2014-08-28
(function($){
	$.fn.extend({
		fadeSlide : function(options){
			var defaults = {
				fadeBtn : '.arr',//切换按钮
				fadeDots : '.fadeDots',//切换圆点序列（如有）
				fadeCon : '.fadeCon',//切换内容容器
				fadeCurClass : 'cur',//圆点选中类名
				dotsEvent : 'click',//圆点触发事件
				fadeTime : 300,//切换动画时长
				fadeRange : 15000,//切换间隔
				autoFade : false//自动切换
			}
			var options = $.extend(defaults, options),
				$fadeWrap = this,
				$fadeBtn = $fadeWrap.find(options.fadeBtn),
				$fadeDots = $fadeWrap.find(options.fadeDots),
				$fadeCon = $fadeWrap.find(options.fadeCon),
				len = $fadeCon.length,
				autoFlag = null;
			$fadeDots.on(options.dotsEvent, function(){				
				if(!$(this).hasClass(options.fadeCurClass))
					fadeOutFn($(this).index());
			});
			$fadeBtn.on('click', function(){
				var index = ($fadeWrap.find($('.' + options.fadeCurClass)).index() + (($(this).hasClass('next')) ? 1 : (-1))) % len;
				fadeOutFn(index);
			})
			$fadeWrap.on('mouseenter', function(){
				clearTimeout(autoFlag);
			}).on('mouseleave', function(){
				var $that = $(this);
				(!options.autoFade) || _setAutoFlag();
			})
			$(document).ready(function(){
				var $that = $(this);
				(!options.autoFade) || _setAutoFlag();
			});
			function autoFadeFn(direct){
				clearTimeout(autoFlag);
				var direct = direct || 'next', index = ($fadeWrap.find($('.' + options.fadeCurClass)).index() + ((direct == 'next') ? 1 : (-1))) % len;
				fadeOutFn(index);
				_setAutoFlag();
			}
			function _setAutoFlag(){
				autoFlag = setTimeout(function(){
					autoFadeFn('next')
				}, options.fadeRange);
			}
			function fadeOutFn(index){
				$fadeDots.removeClass(options.fadeCurClass).eq(index).addClass(options.fadeCurClass);
				$fadeCon.hide().eq(index).fadeIn(options.fadeTime);
			}
			return {
				fadeOutFn : fadeOutFn
			}
		},
		slideImage : function(options){
			//default
			var defaults = {
				slideEl : 'slide-li',
				slideElMg : 10,
				slideBtn : 'slide-arr',
				slideTime : 1000,
				slideRange : 7000,
				slideNum : 5,
				autoSlide : true,
				afterCallback: function () {},
				beforeCallback: function () {}
			};
			var inter, enable = true;
			var options = $.extend(defaults, options),
				$slideWrap = $(this),
				$slideEls = $slideWrap.find(options.slideEl),
				$slideList = $slideEls.parent(),
				slideWrapWidth = $slideWrap.width(),
				slideElWidth = $slideEls.width() + options.slideElMg,
				slideStep = options.slideNum * slideElWidth,
				$slideBtn = $slideWrap.find(options.slideBtn);
			
			$slideBtn.on('click', function(){
				if(!enable) return;
				if($(this).hasClass('next'))
					_slideToLeft();
				else
					_slideToRight();
			});
			$(document).ready(function(){
				$slideList.css({width : ($slideEls.length + options.slideNum) * slideElWidth, left : 0});
				_setAutoSlide();
			});
			$slideWrap.on('mouseenter', function(){//检测鼠标移入移出
				clearTimeout(inter);
			}).on('mouseleave', function(){
				_setAutoSlide();
			});
			function _setAutoSlide(){//自动滚动
				clearTimeout(inter);
				if(options.autoSlide){
					inter = setTimeout(function(){
						_slideToLeft();
						_setAutoSlide();
					}, options.slideRange);
				}
			}
			function _slideToLeft(){
				options.afterCallback.call($slideWrap);
				enable = false;
				var elClones = $slideWrap.find(options.slideEl).slice(0, options.slideNum);
				$slideList.append(elClones.clone());
				$slideList.animate({left : '-=' + slideStep}, options.slideTime, function(){
					elClones.remove();
					$slideList.css({ left : '+=' + slideStep});
					enable = true;
				});
				options.beforeCallback.call($slideWrap);
			}
			function _slideToRight(){
				options.afterCallback.call($slideWrap);
				enable = false;
				var elClones = $slideWrap.find(options.slideEl).slice('-' + options.slideNum);
				$slideList.prepend(elClones.clone());
				$slideList.css({left : '-=' + slideStep});
				$slideList.animate({left : '+=' + slideStep}, options.slideTime, function(){
					elClones.remove();
					enable = true;
				});
				options.beforeCallback.call($slideWrap);
			}			
		},
		rollText : function(options){//列表文字自动上滚
			var defaults = {
				rollList : 'ul',
				rollEls : 'li',
				rollNum : 1,
				rollTime : 1000,
				rollRange : 3000,
				autoRoll : true
			};
			var options = $.extend(defaults, options);
			var $rollWrap = $(this),
				$rollList = $rollWrap.find(options.rollList),
				autoInter;
			$rollWrap.on('mouseenter', function(){
				_clearAutoRoll();
			}).on('mouseleave', function(){
				_setAutoRoll();
			})
			$(document).ready(function(){
				_setAutoRoll();
			});
			function _setAutoRoll(){
				if(options.autoRoll){
					autoInter = setTimeout(function(){
						$rollList.each(function(){
							var $wrap = $(this);
							var $origs = $wrap.find(options.rollEls).slice(0, options.rollNum);
							$wrap.append($origs.clone());
							$origs.slideUp(options.rollTime, function(){
								$origs.remove();
							});
						});
						 _setAutoRoll();
					}, options.rollRange);
				}				
			}
			function _clearAutoRoll(){
				clearTimeout(autoInter);
			}
		},
		autoRoll : function(options){
			var defaults = {
				rollTitle : '.channel-wrap a',
				rollEls : '.juhe-con-wrap',
				rollConTime : 10000
			};

			var options = $.extend(defaults, options);
			var $rollWrap = $(this),
				$rollTitle = $rollWrap.find(options.rollTitle);
				$rollEls = $rollWrap.find(options.rollEls);
				$rollEleLength = $rollWrap.find(options.rollEls).length;
				$rollConTime = options.rollConTime;

			$(document).ready(function(){
				_autoContentRoll();
			});

			function bigImgIndex() {
				$rollEls.each(function(i, el) {
				  if ($(el).is(':visible')) {
				    bigIndex = i;
				  }
				});
				return bigIndex;
			}

			function _autoContentRoll(){	

				function slideRoll(){ 
					var conIndex = bigImgIndex();
					if ( conIndex == ($rollEleLength-1) ) {
						conIndex = -1;
					} 

					$rollTitle.eq(conIndex).removeClass('cur');
					$rollTitle.eq(conIndex + 1).addClass('cur');

					$rollEls.eq(conIndex).hide();
					$rollEls.eq(conIndex + 1).show();
				} 
				slideAction = setInterval(slideRoll, $rollConTime);
			} 

			$rollTitle.mouseover(function(){
					clearInterval(slideAction); 
					var conIndex = bigImgIndex();
					$rollTitle.removeClass('cur').eq($(this).index()).addClass('cur');
					$rollEls.hide().eq($(this).index()).fadeIn(300);
				}).mouseout(function(){
				   _autoContentRoll()
			});
		}

	});
})(jQuery);



//切换插件 2014-08-28
(function($){
	$.fn.extend({
		fadeSlide : function(options){
			var defaults = {
				fadeBtn : '.arr',//切换按钮
				fadeDots : '.fadeDots',//切换圆点序列（如有）
				fadeCon : '.fadeCon',//切换内容容器
				fadeCurClass : 'cur',//圆点选中类名
				dotsEvent : 'click',//圆点触发事件
				fadeTime : 300,//切换动画时长
				fadeRange : 15000,//切换间隔
				autoFade : false//自动切换
			}
			var options = $.extend(defaults, options),
				$fadeWrap = this,
				$fadeBtn = $fadeWrap.find(options.fadeBtn),
				$fadeDots = $fadeWrap.find(options.fadeDots),
				$fadeCon = $fadeWrap.find(options.fadeCon),
				len = $fadeCon.length,
				autoFlag = null;
			$fadeDots.on(options.dotsEvent, function(){				
				if(!$(this).hasClass(options.fadeCurClass))
					fadeOutFn($(this).index());
			});
			$fadeBtn.on('click', function(){
				var index = ($fadeWrap.find($('.' + options.fadeCurClass)).index() + (($(this).hasClass('next')) ? 1 : (-1))) % len;
				fadeOutFn(index);
			})
			$fadeWrap.on('mouseenter', function(){
				clearTimeout(autoFlag);
			}).on('mouseleave', function(){
				var $that = $(this);
				(!options.autoFade) || _setAutoFlag();
			})
			$(document).ready(function(){
				var $that = $(this);
				(!options.autoFade) || _setAutoFlag();
			});
			function autoFadeFn(direct){
				clearTimeout(autoFlag);
				var direct = direct || 'next', index = ($fadeWrap.find($('.' + options.fadeCurClass)).index() + ((direct == 'next') ? 1 : (-1))) % len;
				fadeOutFn(index);
				_setAutoFlag();
			}
			function _setAutoFlag(){
				autoFlag = setTimeout(function(){
					autoFadeFn('next')
				}, options.fadeRange);
			}
			function fadeOutFn(index){
				$fadeDots.removeClass(options.fadeCurClass).eq(index).addClass(options.fadeCurClass);
				$fadeCon.hide().eq(index).fadeIn(options.fadeTime);
			}
			return {
				fadeOutFn : fadeOutFn
			}
		},
		slideImage : function(options){
			//default
			var defaults = {
				slideEl : 'slide-li',
				slideElMg : 10,
				slideBtn : 'slide-arr',
				slideTime : 1000,
				slideRange : 7000,
				slideNum : 5,
				autoSlide : true,
				afterCallback: function () {},
				beforeCallback: function () {}
			};
			var inter, enable = true;
			var options = $.extend(defaults, options),
				$slideWrap = $(this),
				$slideEls = $slideWrap.find(options.slideEl),
				$slideList = $slideEls.parent(),
				slideWrapWidth = $slideWrap.width(),
				slideElWidth = $slideEls.width() + options.slideElMg,
				slideStep = options.slideNum * slideElWidth,
				$slideBtn = $slideWrap.find(options.slideBtn);
			
			$slideBtn.on('click', function(){
				if(!enable) return;
				if($(this).hasClass('next'))
					_slideToLeft();
				else
					_slideToRight();
			});
			$(document).ready(function(){
				$slideList.css({width : ($slideEls.length + options.slideNum) * slideElWidth, left : 0});
				_setAutoSlide();
			});
			$slideWrap.on('mouseenter', function(){//检测鼠标移入移出
				clearTimeout(inter);
			}).on('mouseleave', function(){
				_setAutoSlide();
			});
			function _setAutoSlide(){//自动滚动
				clearTimeout(inter);
				if(options.autoSlide){
					inter = setTimeout(function(){
						_slideToLeft();
						_setAutoSlide();
					}, options.slideRange);
				}
			}
			function _slideToLeft(){
				options.afterCallback.call($slideWrap);
				enable = false;
				var elClones = $slideWrap.find(options.slideEl).slice(0, options.slideNum);
				$slideList.append(elClones.clone());
				$slideList.animate({left : '-=' + slideStep}, options.slideTime, function(){
					elClones.remove();
					$slideList.css({ left : '+=' + slideStep});
					enable = true;
				});
				options.beforeCallback.call($slideWrap);
			}
			function _slideToRight(){
				options.afterCallback.call($slideWrap);
				enable = false;
				var elClones = $slideWrap.find(options.slideEl).slice('-' + options.slideNum);
				$slideList.prepend(elClones.clone());
				$slideList.css({left : '-=' + slideStep});
				$slideList.animate({left : '+=' + slideStep}, options.slideTime, function(){
					elClones.remove();
					enable = true;
				});
				options.beforeCallback.call($slideWrap);
			}			
		},
		rollText : function(options){//列表文字自动上滚
			var defaults = {
				rollList : 'ul',
				rollEls : 'li',
				rollNum : 1,
				rollTime : 1000,
				rollRange : 3000,
				autoRoll : true
			};
			var options = $.extend(defaults, options);
			var $rollWrap = $(this),
				$rollList = $rollWrap.find(options.rollList),
				autoInter;
			$rollWrap.on('mouseenter', function(){
				_clearAutoRoll();
			}).on('mouseleave', function(){
				_setAutoRoll();
			})
			$(document).ready(function(){
				_setAutoRoll();
			});
			function _setAutoRoll(){
				if(options.autoRoll){
					autoInter = setTimeout(function(){
						$rollList.each(function(){
							var $wrap = $(this);
							var $origs = $wrap.find(options.rollEls).slice(0, options.rollNum);
							$wrap.append($origs.clone());
							$origs.slideUp(options.rollTime, function(){
								$origs.remove();
							});
						});
						 _setAutoRoll();
					}, options.rollRange);
				}				
			}
			function _clearAutoRoll(){
				clearTimeout(autoInter);
			}
		},
		autoRoll : function(options){
			var defaults = {
				rollTitle : '.channel-wrap a',
				rollEls : '.juhe-con-wrap',
				rollConTime : 10000
			};

			var options = $.extend(defaults, options);
			var $rollWrap = $(this),
				$rollTitle = $rollWrap.find(options.rollTitle);
				$rollEls = $rollWrap.find(options.rollEls);
				$rollEleLength = $rollWrap.find(options.rollEls).length;
				$rollConTime = options.rollConTime;

			$(document).ready(function(){
				_autoContentRoll();
			});

			function bigImgIndex() {
				$rollEls.each(function(i, el) {
				  if ($(el).is(':visible')) {
				    bigIndex = i;
				  }
				});
				return bigIndex;
			}

			function _autoContentRoll(){	

				function slideRoll(){ 
					var conIndex = bigImgIndex();
					if ( conIndex == ($rollEleLength-1) ) {
						conIndex = -1;
					} 

					$rollTitle.eq(conIndex).removeClass('cur');
					$rollTitle.eq(conIndex + 1).addClass('cur');

					$rollEls.eq(conIndex).hide();
					$rollEls.eq(conIndex + 1).show();
				} 
				slideAction = setInterval(slideRoll, $rollConTime);
			} 

			$rollTitle.mouseover(function(){
					clearInterval(slideAction); 
					var conIndex = bigImgIndex();
					$rollTitle.removeClass('cur').eq($(this).index()).addClass('cur');
					$rollEls.hide().eq($(this).index()).fadeIn(300);
				}).mouseout(function(){
				   _autoContentRoll()
			});
		}

	});
})(jQuery);



//切换插件 2014-08-28
(function($){
	$.fn.extend({
		fadeSlide : function(options){
			var defaults = {
				fadeBtn : '.arr',//切换按钮
				fadeDots : '.fadeDots',//切换圆点序列（如有）
				fadeCon : '.fadeCon',//切换内容容器
				fadeCurClass : 'cur',//圆点选中类名
				dotsEvent : 'click',//圆点触发事件
				fadeTime : 300,//切换动画时长
				fadeRange : 15000,//切换间隔
				autoFade : false//自动切换
			}
			var options = $.extend(defaults, options),
				$fadeWrap = this,
				$fadeBtn = $fadeWrap.find(options.fadeBtn),
				$fadeDots = $fadeWrap.find(options.fadeDots),
				$fadeCon = $fadeWrap.find(options.fadeCon),
				len = $fadeCon.length,
				autoFlag = null;
			$fadeDots.on(options.dotsEvent, function(){				
				if(!$(this).hasClass(options.fadeCurClass))
					fadeOutFn($(this).index());
			});
			$fadeBtn.on('click', function(){
				var index = ($fadeWrap.find($('.' + options.fadeCurClass)).index() + (($(this).hasClass('next')) ? 1 : (-1))) % len;
				fadeOutFn(index);
			})
			$fadeWrap.on('mouseenter', function(){
				clearTimeout(autoFlag);
			}).on('mouseleave', function(){
				var $that = $(this);
				(!options.autoFade) || _setAutoFlag();
			})
			$(document).ready(function(){
				var $that = $(this);
				(!options.autoFade) || _setAutoFlag();
			});
			function autoFadeFn(direct){
				clearTimeout(autoFlag);
				var direct = direct || 'next', index = ($fadeWrap.find($('.' + options.fadeCurClass)).index() + ((direct == 'next') ? 1 : (-1))) % len;
				fadeOutFn(index);
				_setAutoFlag();
			}
			function _setAutoFlag(){
				autoFlag = setTimeout(function(){
					autoFadeFn('next')
				}, options.fadeRange);
			}
			function fadeOutFn(index){
				$fadeDots.removeClass(options.fadeCurClass).eq(index).addClass(options.fadeCurClass);
				$fadeCon.hide().eq(index).fadeIn(options.fadeTime);
			}
			return {
				fadeOutFn : fadeOutFn
			}
		},
		slideImage : function(options){
			//default
			var defaults = {
				slideEl : 'slide-li',
				slideElMg : 10,
				slideBtn : 'slide-arr',
				slideTime : 1000,
				slideRange : 7000,
				slideNum : 5,
				autoSlide : true,
				afterCallback: function () {},
				beforeCallback: function () {}
			};
			var inter, enable = true;
			var options = $.extend(defaults, options),
				$slideWrap = $(this),
				$slideEls = $slideWrap.find(options.slideEl),
				$slideList = $slideEls.parent(),
				slideWrapWidth = $slideWrap.width(),
				slideElWidth = $slideEls.width() + options.slideElMg,
				slideStep = options.slideNum * slideElWidth,
				$slideBtn = $slideWrap.find(options.slideBtn);
			
			$slideBtn.on('click', function(){
				if(!enable) return;
				if($(this).hasClass('next'))
					_slideToLeft();
				else
					_slideToRight();
			});
			$(document).ready(function(){
				$slideList.css({width : ($slideEls.length + options.slideNum) * slideElWidth, left : 0});
				_setAutoSlide();
			});
			$slideWrap.on('mouseenter', function(){//检测鼠标移入移出
				clearTimeout(inter);
			}).on('mouseleave', function(){
				_setAutoSlide();
			});
			function _setAutoSlide(){//自动滚动
				clearTimeout(inter);
				if(options.autoSlide){
					inter = setTimeout(function(){
						_slideToLeft();
						_setAutoSlide();
					}, options.slideRange);
				}
			}
			function _slideToLeft(){
				options.afterCallback.call($slideWrap);
				enable = false;
				var elClones = $slideWrap.find(options.slideEl).slice(0, options.slideNum);
				$slideList.append(elClones.clone());
				$slideList.animate({left : '-=' + slideStep}, options.slideTime, function(){
					elClones.remove();
					$slideList.css({ left : '+=' + slideStep});
					enable = true;
				});
				options.beforeCallback.call($slideWrap);
			}
			function _slideToRight(){
				options.afterCallback.call($slideWrap);
				enable = false;
				var elClones = $slideWrap.find(options.slideEl).slice('-' + options.slideNum);
				$slideList.prepend(elClones.clone());
				$slideList.css({left : '-=' + slideStep});
				$slideList.animate({left : '+=' + slideStep}, options.slideTime, function(){
					elClones.remove();
					enable = true;
				});
				options.beforeCallback.call($slideWrap);
			}			
		},
		rollText : function(options){//列表文字自动上滚
			var defaults = {
				rollList : 'ul',
				rollEls : 'li',
				rollNum : 1,
				rollTime : 1000,
				rollRange : 3000,
				autoRoll : true
			};
			var options = $.extend(defaults, options);
			var $rollWrap = $(this),
				$rollList = $rollWrap.find(options.rollList),
				autoInter;
			$rollWrap.on('mouseenter', function(){
				_clearAutoRoll();
			}).on('mouseleave', function(){
				_setAutoRoll();
			})
			$(document).ready(function(){
				_setAutoRoll();
			});
			function _setAutoRoll(){
				if(options.autoRoll){
					autoInter = setTimeout(function(){
						$rollList.each(function(){
							var $wrap = $(this);
							var $origs = $wrap.find(options.rollEls).slice(0, options.rollNum);
							$wrap.append($origs.clone());
							$origs.slideUp(options.rollTime, function(){
								$origs.remove();
							});
						});
						 _setAutoRoll();
					}, options.rollRange);
				}				
			}
			function _clearAutoRoll(){
				clearTimeout(autoInter);
			}
		},
		autoRoll : function(options){
			var defaults = {
				rollTitle : '.channel-wrap a',
				rollEls : '.juhe-con-wrap',
				rollConTime : 10000
			};

			var options = $.extend(defaults, options);
			var $rollWrap = $(this),
				$rollTitle = $rollWrap.find(options.rollTitle);
				$rollEls = $rollWrap.find(options.rollEls);
				$rollEleLength = $rollWrap.find(options.rollEls).length;
				$rollConTime = options.rollConTime;

			$(document).ready(function(){
				_autoContentRoll();
			});

			function bigImgIndex() {
				$rollEls.each(function(i, el) {
				  if ($(el).is(':visible')) {
				    bigIndex = i;
				  }
				});
				return bigIndex;
			}

			function _autoContentRoll(){	

				function slideRoll(){ 
					var conIndex = bigImgIndex();
					if ( conIndex == ($rollEleLength-1) ) {
						conIndex = -1;
					} 

					$rollTitle.eq(conIndex).removeClass('cur');
					$rollTitle.eq(conIndex + 1).addClass('cur');

					$rollEls.eq(conIndex).hide();
					$rollEls.eq(conIndex + 1).show();
				} 
				slideAction = setInterval(slideRoll, $rollConTime);
			} 

			$rollTitle.mouseover(function(){
					clearInterval(slideAction); 
					var conIndex = bigImgIndex();
					$rollTitle.removeClass('cur').eq($(this).index()).addClass('cur');
					$rollEls.hide().eq($(this).index()).fadeIn(300);
				}).mouseout(function(){
				   _autoContentRoll()
			});
		}

	});
})(jQuery);



//切换插件 2014-08-28
(function($){
	$.fn.extend({
		fadeSlide : function(options){
			var defaults = {
				fadeBtn : '.arr',//切换按钮
				fadeDots : '.fadeDots',//切换圆点序列（如有）
				fadeCon : '.fadeCon',//切换内容容器
				fadeCurClass : 'cur',//圆点选中类名
				dotsEvent : 'click',//圆点触发事件
				fadeTime : 300,//切换动画时长
				fadeRange : 15000,//切换间隔
				autoFade : false//自动切换
			}
			var options = $.extend(defaults, options),
				$fadeWrap = this,
				$fadeBtn = $fadeWrap.find(options.fadeBtn),
				$fadeDots = $fadeWrap.find(options.fadeDots),
				$fadeCon = $fadeWrap.find(options.fadeCon),
				len = $fadeCon.length,
				autoFlag = null;
			$fadeDots.on(options.dotsEvent, function(){				
				if(!$(this).hasClass(options.fadeCurClass))
					fadeOutFn($(this).index());
			});
			$fadeBtn.on('click', function(){
				var index = ($fadeWrap.find($('.' + options.fadeCurClass)).index() + (($(this).hasClass('next')) ? 1 : (-1))) % len;
				fadeOutFn(index);
			})
			$fadeWrap.on('mouseenter', function(){
				clearTimeout(autoFlag);
			}).on('mouseleave', function(){
				var $that = $(this);
				(!options.autoFade) || _setAutoFlag();
			})
			$(document).ready(function(){
				var $that = $(this);
				(!options.autoFade) || _setAutoFlag();
			});
			function autoFadeFn(direct){
				clearTimeout(autoFlag);
				var direct = direct || 'next', index = ($fadeWrap.find($('.' + options.fadeCurClass)).index() + ((direct == 'next') ? 1 : (-1))) % len;
				fadeOutFn(index);
				_setAutoFlag();
			}
			function _setAutoFlag(){
				autoFlag = setTimeout(function(){
					autoFadeFn('next')
				}, options.fadeRange);
			}
			function fadeOutFn(index){
				$fadeDots.removeClass(options.fadeCurClass).eq(index).addClass(options.fadeCurClass);
				$fadeCon.hide().eq(index).fadeIn(options.fadeTime);
			}
			return {
				fadeOutFn : fadeOutFn
			}
		},
		slideImage : function(options){
			//default
			var defaults = {
				slideEl : 'slide-li',
				slideElMg : 10,
				slideBtn : 'slide-arr',
				slideTime : 1000,
				slideRange : 7000,
				slideNum : 5,
				autoSlide : true,
				afterCallback: function () {},
				beforeCallback: function () {}
			};
			var inter, enable = true;
			var options = $.extend(defaults, options),
				$slideWrap = $(this),
				$slideEls = $slideWrap.find(options.slideEl),
				$slideList = $slideEls.parent(),
				slideWrapWidth = $slideWrap.width(),
				slideElWidth = $slideEls.width() + options.slideElMg,
				slideStep = options.slideNum * slideElWidth,
				$slideBtn = $slideWrap.find(options.slideBtn);
			
			$slideBtn.on('click', function(){
				if(!enable) return;
				if($(this).hasClass('next'))
					_slideToLeft();
				else
					_slideToRight();
			});
			$(document).ready(function(){
				$slideList.css({width : ($slideEls.length + options.slideNum) * slideElWidth, left : 0});
				_setAutoSlide();
			});
			$slideWrap.on('mouseenter', function(){//检测鼠标移入移出
				clearTimeout(inter);
			}).on('mouseleave', function(){
				_setAutoSlide();
			});
			function _setAutoSlide(){//自动滚动
				clearTimeout(inter);
				if(options.autoSlide){
					inter = setTimeout(function(){
						_slideToLeft();
						_setAutoSlide();
					}, options.slideRange);
				}
			}
			function _slideToLeft(){
				options.afterCallback.call($slideWrap);
				enable = false;
				var elClones = $slideWrap.find(options.slideEl).slice(0, options.slideNum);
				$slideList.append(elClones.clone());
				$slideList.animate({left : '-=' + slideStep}, options.slideTime, function(){
					elClones.remove();
					$slideList.css({ left : '+=' + slideStep});
					enable = true;
				});
				options.beforeCallback.call($slideWrap);
			}
			function _slideToRight(){
				options.afterCallback.call($slideWrap);
				enable = false;
				var elClones = $slideWrap.find(options.slideEl).slice('-' + options.slideNum);
				$slideList.prepend(elClones.clone());
				$slideList.css({left : '-=' + slideStep});
				$slideList.animate({left : '+=' + slideStep}, options.slideTime, function(){
					elClones.remove();
					enable = true;
				});
				options.beforeCallback.call($slideWrap);
			}			
		},
		rollText : function(options){//列表文字自动上滚
			var defaults = {
				rollList : 'ul',
				rollEls : 'li',
				rollNum : 1,
				rollTime : 1000,
				rollRange : 3000,
				autoRoll : true
			};
			var options = $.extend(defaults, options);
			var $rollWrap = $(this),
				$rollList = $rollWrap.find(options.rollList),
				autoInter;
			$rollWrap.on('mouseenter', function(){
				_clearAutoRoll();
			}).on('mouseleave', function(){
				_setAutoRoll();
			})
			$(document).ready(function(){
				_setAutoRoll();
			});
			function _setAutoRoll(){
				if(options.autoRoll){
					autoInter = setTimeout(function(){
						$rollList.each(function(){
							var $wrap = $(this);
							var $origs = $wrap.find(options.rollEls).slice(0, options.rollNum);
							$wrap.append($origs.clone());
							$origs.slideUp(options.rollTime, function(){
								$origs.remove();
							});
						});
						 _setAutoRoll();
					}, options.rollRange);
				}				
			}
			function _clearAutoRoll(){
				clearTimeout(autoInter);
			}
		},
		autoRoll : function(options){
			var defaults = {
				rollTitle : '.channel-wrap a',
				rollEls : '.juhe-con-wrap',
				rollConTime : 10000
			};

			var options = $.extend(defaults, options);
			var $rollWrap = $(this),
				$rollTitle = $rollWrap.find(options.rollTitle);
				$rollEls = $rollWrap.find(options.rollEls);
				$rollEleLength = $rollWrap.find(options.rollEls).length;
				$rollConTime = options.rollConTime;

			$(document).ready(function(){
				_autoContentRoll();
			});

			function bigImgIndex() {
				$rollEls.each(function(i, el) {
				  if ($(el).is(':visible')) {
				    bigIndex = i;
				  }
				});
				return bigIndex;
			}

			function _autoContentRoll(){	

				function slideRoll(){ 
					var conIndex = bigImgIndex();
					if ( conIndex == ($rollEleLength-1) ) {
						conIndex = -1;
					} 

					$rollTitle.eq(conIndex).removeClass('cur');
					$rollTitle.eq(conIndex + 1).addClass('cur');

					$rollEls.eq(conIndex).hide();
					$rollEls.eq(conIndex + 1).show();
				} 
				slideAction = setInterval(slideRoll, $rollConTime);
			} 

			$rollTitle.mouseover(function(){
					clearInterval(slideAction); 
					var conIndex = bigImgIndex();
					$rollTitle.removeClass('cur').eq($(this).index()).addClass('cur');
					$rollEls.hide().eq($(this).index()).fadeIn(300);
				}).mouseout(function(){
				   _autoContentRoll()
			});
		}

	});
})(jQuery);



//切换插件 2014-08-28
(function($){
	$.fn.extend({
		fadeSlide : function(options){
			var defaults = {
				fadeBtn : '.arr',//切换按钮
				fadeDots : '.fadeDots',//切换圆点序列（如有）
				fadeCon : '.fadeCon',//切换内容容器
				fadeCurClass : 'cur',//圆点选中类名
				dotsEvent : 'click',//圆点触发事件
				fadeTime : 300,//切换动画时长
				fadeRange : 15000,//切换间隔
				autoFade : false//自动切换
			}
			var options = $.extend(defaults, options),
				$fadeWrap = this,
				$fadeBtn = $fadeWrap.find(options.fadeBtn),
				$fadeDots = $fadeWrap.find(options.fadeDots),
				$fadeCon = $fadeWrap.find(options.fadeCon),
				len = $fadeCon.length,
				autoFlag = null;
			$fadeDots.on(options.dotsEvent, function(){				
				if(!$(this).hasClass(options.fadeCurClass))
					fadeOutFn($(this).index());
			});
			$fadeBtn.on('click', function(){
				var index = ($fadeWrap.find($('.' + options.fadeCurClass)).index() + (($(this).hasClass('next')) ? 1 : (-1))) % len;
				fadeOutFn(index);
			})
			$fadeWrap.on('mouseenter', function(){
				clearTimeout(autoFlag);
			}).on('mouseleave', function(){
				var $that = $(this);
				(!options.autoFade) || _setAutoFlag();
			})
			$(document).ready(function(){
				var $that = $(this);
				(!options.autoFade) || _setAutoFlag();
			});
			function autoFadeFn(direct){
				clearTimeout(autoFlag);
				var direct = direct || 'next', index = ($fadeWrap.find($('.' + options.fadeCurClass)).index() + ((direct == 'next') ? 1 : (-1))) % len;
				fadeOutFn(index);
				_setAutoFlag();
			}
			function _setAutoFlag(){
				autoFlag = setTimeout(function(){
					autoFadeFn('next')
				}, options.fadeRange);
			}
			function fadeOutFn(index){
				$fadeDots.removeClass(options.fadeCurClass).eq(index).addClass(options.fadeCurClass);
				$fadeCon.hide().eq(index).fadeIn(options.fadeTime);
			}
			return {
				fadeOutFn : fadeOutFn
			}
		},
		slideImage : function(options){
			//default
			var defaults = {
				slideEl : 'slide-li',
				slideElMg : 10,
				slideBtn : 'slide-arr',
				slideTime : 1000,
				slideRange : 7000,
				slideNum : 5,
				autoSlide : true,
				afterCallback: function () {},
				beforeCallback: function () {}
			};
			var inter, enable = true;
			var options = $.extend(defaults, options),
				$slideWrap = $(this),
				$slideEls = $slideWrap.find(options.slideEl),
				$slideList = $slideEls.parent(),
				slideWrapWidth = $slideWrap.width(),
				slideElWidth = $slideEls.width() + options.slideElMg,
				slideStep = options.slideNum * slideElWidth,
				$slideBtn = $slideWrap.find(options.slideBtn);
			
			$slideBtn.on('click', function(){
				if(!enable) return;
				if($(this).hasClass('next'))
					_slideToLeft();
				else
					_slideToRight();
			});
			$(document).ready(function(){
				$slideList.css({width : ($slideEls.length + options.slideNum) * slideElWidth, left : 0});
				_setAutoSlide();
			});
			$slideWrap.on('mouseenter', function(){//检测鼠标移入移出
				clearTimeout(inter);
			}).on('mouseleave', function(){
				_setAutoSlide();
			});
			function _setAutoSlide(){//自动滚动
				clearTimeout(inter);
				if(options.autoSlide){
					inter = setTimeout(function(){
						_slideToLeft();
						_setAutoSlide();
					}, options.slideRange);
				}
			}
			function _slideToLeft(){
				options.afterCallback.call($slideWrap);
				enable = false;
				var elClones = $slideWrap.find(options.slideEl).slice(0, options.slideNum);
				$slideList.append(elClones.clone());
				$slideList.animate({left : '-=' + slideStep}, options.slideTime, function(){
					elClones.remove();
					$slideList.css({ left : '+=' + slideStep});
					enable = true;
				});
				options.beforeCallback.call($slideWrap);
			}
			function _slideToRight(){
				options.afterCallback.call($slideWrap);
				enable = false;
				var elClones = $slideWrap.find(options.slideEl).slice('-' + options.slideNum);
				$slideList.prepend(elClones.clone());
				$slideList.css({left : '-=' + slideStep});
				$slideList.animate({left : '+=' + slideStep}, options.slideTime, function(){
					elClones.remove();
					enable = true;
				});
				options.beforeCallback.call($slideWrap);
			}			
		},
		rollText : function(options){//列表文字自动上滚
			var defaults = {
				rollList : 'ul',
				rollEls : 'li',
				rollNum : 1,
				rollTime : 1000,
				rollRange : 3000,
				autoRoll : true
			};
			var options = $.extend(defaults, options);
			var $rollWrap = $(this),
				$rollList = $rollWrap.find(options.rollList),
				autoInter;
			$rollWrap.on('mouseenter', function(){
				_clearAutoRoll();
			}).on('mouseleave', function(){
				_setAutoRoll();
			})
			$(document).ready(function(){
				_setAutoRoll();
			});
			function _setAutoRoll(){
				if(options.autoRoll){
					autoInter = setTimeout(function(){
						$rollList.each(function(){
							var $wrap = $(this);
							var $origs = $wrap.find(options.rollEls).slice(0, options.rollNum);
							$wrap.append($origs.clone());
							$origs.slideUp(options.rollTime, function(){
								$origs.remove();
							});
						});
						 _setAutoRoll();
					}, options.rollRange);
				}				
			}
			function _clearAutoRoll(){
				clearTimeout(autoInter);
			}
		},
		autoRoll : function(options){
			var defaults = {
				rollTitle : '.channel-wrap a',
				rollEls : '.juhe-con-wrap',
				rollConTime : 10000
			};

			var options = $.extend(defaults, options);
			var $rollWrap = $(this),
				$rollTitle = $rollWrap.find(options.rollTitle);
				$rollEls = $rollWrap.find(options.rollEls);
				$rollEleLength = $rollWrap.find(options.rollEls).length;
				$rollConTime = options.rollConTime;

			$(document).ready(function(){
				_autoContentRoll();
			});

			function bigImgIndex() {
				$rollEls.each(function(i, el) {
				  if ($(el).is(':visible')) {
				    bigIndex = i;
				  }
				});
				return bigIndex;
			}

			function _autoContentRoll(){	

				function slideRoll(){ 
					var conIndex = bigImgIndex();
					if ( conIndex == ($rollEleLength-1) ) {
						conIndex = -1;
					} 

					$rollTitle.eq(conIndex).removeClass('cur');
					$rollTitle.eq(conIndex + 1).addClass('cur');

					$rollEls.eq(conIndex).hide();
					$rollEls.eq(conIndex + 1).show();
				} 
				slideAction = setInterval(slideRoll, $rollConTime);
			} 

			$rollTitle.mouseover(function(){
					clearInterval(slideAction); 
					var conIndex = bigImgIndex();
					$rollTitle.removeClass('cur').eq($(this).index()).addClass('cur');
					$rollEls.hide().eq($(this).index()).fadeIn(300);
				}).mouseout(function(){
				   _autoContentRoll()
			});
		}

	});
})(jQuery);



//切换插件 2014-08-28
(function($){
	$.fn.extend({
		fadeSlide : function(options){
			var defaults = {
				fadeBtn : '.arr',//切换按钮
				fadeDots : '.fadeDots',//切换圆点序列（如有）
				fadeCon : '.fadeCon',//切换内容容器
				fadeCurClass : 'cur',//圆点选中类名
				dotsEvent : 'click',//圆点触发事件
				fadeTime : 300,//切换动画时长
				fadeRange : 15000,//切换间隔
				autoFade : false//自动切换
			}
			var options = $.extend(defaults, options),
				$fadeWrap = this,
				$fadeBtn = $fadeWrap.find(options.fadeBtn),
				$fadeDots = $fadeWrap.find(options.fadeDots),
				$fadeCon = $fadeWrap.find(options.fadeCon),
				len = $fadeCon.length,
				autoFlag = null;
			$fadeDots.on(options.dotsEvent, function(){				
				if(!$(this).hasClass(options.fadeCurClass))
					fadeOutFn($(this).index());
			});
			$fadeBtn.on('click', function(){
				var index = ($fadeWrap.find($('.' + options.fadeCurClass)).index() + (($(this).hasClass('next')) ? 1 : (-1))) % len;
				fadeOutFn(index);
			})
			$fadeWrap.on('mouseenter', function(){
				clearTimeout(autoFlag);
			}).on('mouseleave', function(){
				var $that = $(this);
				(!options.autoFade) || _setAutoFlag();
			})
			$(document).ready(function(){
				var $that = $(this);
				(!options.autoFade) || _setAutoFlag();
			});
			function autoFadeFn(direct){
				clearTimeout(autoFlag);
				var direct = direct || 'next', index = ($fadeWrap.find($('.' + options.fadeCurClass)).index() + ((direct == 'next') ? 1 : (-1))) % len;
				fadeOutFn(index);
				_setAutoFlag();
			}
			function _setAutoFlag(){
				autoFlag = setTimeout(function(){
					autoFadeFn('next')
				}, options.fadeRange);
			}
			function fadeOutFn(index){
				$fadeDots.removeClass(options.fadeCurClass).eq(index).addClass(options.fadeCurClass);
				$fadeCon.hide().eq(index).fadeIn(options.fadeTime);
			}
			return {
				fadeOutFn : fadeOutFn
			}
		},
		slideImage : function(options){
			//default
			var defaults = {
				slideEl : 'slide-li',
				slideElMg : 10,
				slideBtn : 'slide-arr',
				slideTime : 1000,
				slideRange : 7000,
				slideNum : 5,
				autoSlide : true,
				afterCallback: function () {},
				beforeCallback: function () {}
			};
			var inter, enable = true;
			var options = $.extend(defaults, options),
				$slideWrap = $(this),
				$slideEls = $slideWrap.find(options.slideEl),
				$slideList = $slideEls.parent(),
				slideWrapWidth = $slideWrap.width(),
				slideElWidth = $slideEls.width() + options.slideElMg,
				slideStep = options.slideNum * slideElWidth,
				$slideBtn = $slideWrap.find(options.slideBtn);
			
			$slideBtn.on('click', function(){
				if(!enable) return;
				if($(this).hasClass('next'))
					_slideToLeft();
				else
					_slideToRight();
			});
			$(document).ready(function(){
				$slideList.css({width : ($slideEls.length + options.slideNum) * slideElWidth, left : 0});
				_setAutoSlide();
			});
			$slideWrap.on('mouseenter', function(){//检测鼠标移入移出
				clearTimeout(inter);
			}).on('mouseleave', function(){
				_setAutoSlide();
			});
			function _setAutoSlide(){//自动滚动
				clearTimeout(inter);
				if(options.autoSlide){
					inter = setTimeout(function(){
						_slideToLeft();
						_setAutoSlide();
					}, options.slideRange);
				}
			}
			function _slideToLeft(){
				options.afterCallback.call($slideWrap);
				enable = false;
				var elClones = $slideWrap.find(options.slideEl).slice(0, options.slideNum);
				$slideList.append(elClones.clone());
				$slideList.animate({left : '-=' + slideStep}, options.slideTime, function(){
					elClones.remove();
					$slideList.css({ left : '+=' + slideStep});
					enable = true;
				});
				options.beforeCallback.call($slideWrap);
			}
			function _slideToRight(){
				options.afterCallback.call($slideWrap);
				enable = false;
				var elClones = $slideWrap.find(options.slideEl).slice('-' + options.slideNum);
				$slideList.prepend(elClones.clone());
				$slideList.css({left : '-=' + slideStep});
				$slideList.animate({left : '+=' + slideStep}, options.slideTime, function(){
					elClones.remove();
					enable = true;
				});
				options.beforeCallback.call($slideWrap);
			}			
		},
		rollText : function(options){//列表文字自动上滚
			var defaults = {
				rollList : 'ul',
				rollEls : 'li',
				rollNum : 1,
				rollTime : 1000,
				rollRange : 3000,
				autoRoll : true
			};
			var options = $.extend(defaults, options);
			var $rollWrap = $(this),
				$rollList = $rollWrap.find(options.rollList),
				autoInter;
			$rollWrap.on('mouseenter', function(){
				_clearAutoRoll();
			}).on('mouseleave', function(){
				_setAutoRoll();
			})
			$(document).ready(function(){
				_setAutoRoll();
			});
			function _setAutoRoll(){
				if(options.autoRoll){
					autoInter = setTimeout(function(){
						$rollList.each(function(){
							var $wrap = $(this);
							var $origs = $wrap.find(options.rollEls).slice(0, options.rollNum);
							$wrap.append($origs.clone());
							$origs.slideUp(options.rollTime, function(){
								$origs.remove();
							});
						});
						 _setAutoRoll();
					}, options.rollRange);
				}				
			}
			function _clearAutoRoll(){
				clearTimeout(autoInter);
			}
		},
		autoRoll : function(options){
			var defaults = {
				rollTitle : '.channel-wrap a',
				rollEls : '.juhe-con-wrap',
				rollConTime : 10000
			};

			var options = $.extend(defaults, options);
			var $rollWrap = $(this),
				$rollTitle = $rollWrap.find(options.rollTitle);
				$rollEls = $rollWrap.find(options.rollEls);
				$rollEleLength = $rollWrap.find(options.rollEls).length;
				$rollConTime = options.rollConTime;

			$(document).ready(function(){
				_autoContentRoll();
			});

			function bigImgIndex() {
				$rollEls.each(function(i, el) {
				  if ($(el).is(':visible')) {
				    bigIndex = i;
				  }
				});
				return bigIndex;
			}

			function _autoContentRoll(){	

				function slideRoll(){ 
					var conIndex = bigImgIndex();
					if ( conIndex == ($rollEleLength-1) ) {
						conIndex = -1;
					} 

					$rollTitle.eq(conIndex).removeClass('cur');
					$rollTitle.eq(conIndex + 1).addClass('cur');

					$rollEls.eq(conIndex).hide();
					$rollEls.eq(conIndex + 1).show();
				} 
				slideAction = setInterval(slideRoll, $rollConTime);
			} 

			$rollTitle.mouseover(function(){
					clearInterval(slideAction); 
					var conIndex = bigImgIndex();
					$rollTitle.removeClass('cur').eq($(this).index()).addClass('cur');
					$rollEls.hide().eq($(this).index()).fadeIn(300);
				}).mouseout(function(){
				   _autoContentRoll()
			});
		}

	});
})(jQuery);



//切换插件 2014-08-28
(function($){
	$.fn.extend({
		fadeSlide : function(options){
			var defaults = {
				fadeBtn : '.arr',//切换按钮
				fadeDots : '.fadeDots',//切换圆点序列（如有）
				fadeCon : '.fadeCon',//切换内容容器
				fadeCurClass : 'cur',//圆点选中类名
				dotsEvent : 'click',//圆点触发事件
				fadeTime : 300,//切换动画时长
				fadeRange : 15000,//切换间隔
				autoFade : false//自动切换
			}
			var options = $.extend(defaults, options),
				$fadeWrap = this,
				$fadeBtn = $fadeWrap.find(options.fadeBtn),
				$fadeDots = $fadeWrap.find(options.fadeDots),
				$fadeCon = $fadeWrap.find(options.fadeCon),
				len = $fadeCon.length,
				autoFlag = null;
			$fadeDots.on(options.dotsEvent, function(){				
				if(!$(this).hasClass(options.fadeCurClass))
					fadeOutFn($(this).index());
			});
			$fadeBtn.on('click', function(){
				var index = ($fadeWrap.find($('.' + options.fadeCurClass)).index() + (($(this).hasClass('next')) ? 1 : (-1))) % len;
				fadeOutFn(index);
			})
			$fadeWrap.on('mouseenter', function(){
				clearTimeout(autoFlag);
			}).on('mouseleave', function(){
				var $that = $(this);
				(!options.autoFade) || _setAutoFlag();
			})
			$(document).ready(function(){
				var $that = $(this);
				(!options.autoFade) || _setAutoFlag();
			});
			function autoFadeFn(direct){
				clearTimeout(autoFlag);
				var direct = direct || 'next', index = ($fadeWrap.find($('.' + options.fadeCurClass)).index() + ((direct == 'next') ? 1 : (-1))) % len;
				fadeOutFn(index);
				_setAutoFlag();
			}
			function _setAutoFlag(){
				autoFlag = setTimeout(function(){
					autoFadeFn('next')
				}, options.fadeRange);
			}
			function fadeOutFn(index){
				$fadeDots.removeClass(options.fadeCurClass).eq(index).addClass(options.fadeCurClass);
				$fadeCon.hide().eq(index).fadeIn(options.fadeTime);
			}
			return {
				fadeOutFn : fadeOutFn
			}
		},
		slideImage : function(options){
			//default
			var defaults = {
				slideEl : 'slide-li',
				slideElMg : 10,
				slideBtn : 'slide-arr',
				slideTime : 1000,
				slideRange : 7000,
				slideNum : 5,
				autoSlide : true,
				afterCallback: function () {},
				beforeCallback: function () {}
			};
			var inter, enable = true;
			var options = $.extend(defaults, options),
				$slideWrap = $(this),
				$slideEls = $slideWrap.find(options.slideEl),
				$slideList = $slideEls.parent(),
				slideWrapWidth = $slideWrap.width(),
				slideElWidth = $slideEls.width() + options.slideElMg,
				slideStep = options.slideNum * slideElWidth,
				$slideBtn = $slideWrap.find(options.slideBtn);
			
			$slideBtn.on('click', function(){
				if(!enable) return;
				if($(this).hasClass('next'))
					_slideToLeft();
				else
					_slideToRight();
			});
			$(document).ready(function(){
				$slideList.css({width : ($slideEls.length + options.slideNum) * slideElWidth, left : 0});
				_setAutoSlide();
			});
			$slideWrap.on('mouseenter', function(){//检测鼠标移入移出
				clearTimeout(inter);
			}).on('mouseleave', function(){
				_setAutoSlide();
			});
			function _setAutoSlide(){//自动滚动
				clearTimeout(inter);
				if(options.autoSlide){
					inter = setTimeout(function(){
						_slideToLeft();
						_setAutoSlide();
					}, options.slideRange);
				}
			}
			function _slideToLeft(){
				options.afterCallback.call($slideWrap);
				enable = false;
				var elClones = $slideWrap.find(options.slideEl).slice(0, options.slideNum);
				$slideList.append(elClones.clone());
				$slideList.animate({left : '-=' + slideStep}, options.slideTime, function(){
					elClones.remove();
					$slideList.css({ left : '+=' + slideStep});
					enable = true;
				});
				options.beforeCallback.call($slideWrap);
			}
			function _slideToRight(){
				options.afterCallback.call($slideWrap);
				enable = false;
				var elClones = $slideWrap.find(options.slideEl).slice('-' + options.slideNum);
				$slideList.prepend(elClones.clone());
				$slideList.css({left : '-=' + slideStep});
				$slideList.animate({left : '+=' + slideStep}, options.slideTime, function(){
					elClones.remove();
					enable = true;
				});
				options.beforeCallback.call($slideWrap);
			}			
		},
		rollText : function(options){//列表文字自动上滚
			var defaults = {
				rollList : 'ul',
				rollEls : 'li',
				rollNum : 1,
				rollTime : 1000,
				rollRange : 3000,
				autoRoll : true
			};
			var options = $.extend(defaults, options);
			var $rollWrap = $(this),
				$rollList = $rollWrap.find(options.rollList),
				autoInter;
			$rollWrap.on('mouseenter', function(){
				_clearAutoRoll();
			}).on('mouseleave', function(){
				_setAutoRoll();
			})
			$(document).ready(function(){
				_setAutoRoll();
			});
			function _setAutoRoll(){
				if(options.autoRoll){
					autoInter = setTimeout(function(){
						$rollList.each(function(){
							var $wrap = $(this);
							var $origs = $wrap.find(options.rollEls).slice(0, options.rollNum);
							$wrap.append($origs.clone());
							$origs.slideUp(options.rollTime, function(){
								$origs.remove();
							});
						});
						 _setAutoRoll();
					}, options.rollRange);
				}				
			}
			function _clearAutoRoll(){
				clearTimeout(autoInter);
			}
		},
		autoRoll : function(options){
			var defaults = {
				rollTitle : '.channel-wrap a',
				rollEls : '.juhe-con-wrap',
				rollConTime : 10000
			};

			var options = $.extend(defaults, options);
			var $rollWrap = $(this),
				$rollTitle = $rollWrap.find(options.rollTitle);
				$rollEls = $rollWrap.find(options.rollEls);
				$rollEleLength = $rollWrap.find(options.rollEls).length;
				$rollConTime = options.rollConTime;

			$(document).ready(function(){
				_autoContentRoll();
			});

			function bigImgIndex() {
				$rollEls.each(function(i, el) {
				  if ($(el).is(':visible')) {
				    bigIndex = i;
				  }
				});
				return bigIndex;
			}

			function _autoContentRoll(){	

				function slideRoll(){ 
					var conIndex = bigImgIndex();
					if ( conIndex == ($rollEleLength-1) ) {
						conIndex = -1;
					} 

					$rollTitle.eq(conIndex).removeClass('cur');
					$rollTitle.eq(conIndex + 1).addClass('cur');

					$rollEls.eq(conIndex).hide();
					$rollEls.eq(conIndex + 1).show();
				} 
				slideAction = setInterval(slideRoll, $rollConTime);
			} 

			$rollTitle.mouseover(function(){
					clearInterval(slideAction); 
					var conIndex = bigImgIndex();
					$rollTitle.removeClass('cur').eq($(this).index()).addClass('cur');
					$rollEls.hide().eq($(this).index()).fadeIn(300);
				}).mouseout(function(){
				   _autoContentRoll()
			});
		}

	});
})(jQuery);



//切换插件 2014-08-28
(function($){
	$.fn.extend({
		fadeSlide : function(options){
			var defaults = {
				fadeBtn : '.arr',//切换按钮
				fadeDots : '.fadeDots',//切换圆点序列（如有）
				fadeCon : '.fadeCon',//切换内容容器
				fadeCurClass : 'cur',//圆点选中类名
				dotsEvent : 'click',//圆点触发事件
				fadeTime : 300,//切换动画时长
				fadeRange : 15000,//切换间隔
				autoFade : false//自动切换
			}
			var options = $.extend(defaults, options),
				$fadeWrap = this,
				$fadeBtn = $fadeWrap.find(options.fadeBtn),
				$fadeDots = $fadeWrap.find(options.fadeDots),
				$fadeCon = $fadeWrap.find(options.fadeCon),
				len = $fadeCon.length,
				autoFlag = null;
			$fadeDots.on(options.dotsEvent, function(){				
				if(!$(this).hasClass(options.fadeCurClass))
					fadeOutFn($(this).index());
			});
			$fadeBtn.on('click', function(){
				var index = ($fadeWrap.find($('.' + options.fadeCurClass)).index() + (($(this).hasClass('next')) ? 1 : (-1))) % len;
				fadeOutFn(index);
			})
			$fadeWrap.on('mouseenter', function(){
				clearTimeout(autoFlag);
			}).on('mouseleave', function(){
				var $that = $(this);
				(!options.autoFade) || _setAutoFlag();
			})
			$(document).ready(function(){
				var $that = $(this);
				(!options.autoFade) || _setAutoFlag();
			});
			function autoFadeFn(direct){
				clearTimeout(autoFlag);
				var direct = direct || 'next', index = ($fadeWrap.find($('.' + options.fadeCurClass)).index() + ((direct == 'next') ? 1 : (-1))) % len;
				fadeOutFn(index);
				_setAutoFlag();
			}
			function _setAutoFlag(){
				autoFlag = setTimeout(function(){
					autoFadeFn('next')
				}, options.fadeRange);
			}
			function fadeOutFn(index){
				$fadeDots.removeClass(options.fadeCurClass).eq(index).addClass(options.fadeCurClass);
				$fadeCon.hide().eq(index).fadeIn(options.fadeTime);
			}
			return {
				fadeOutFn : fadeOutFn
			}
		},
		slideImage : function(options){
			//default
			var defaults = {
				slideEl : 'slide-li',
				slideElMg : 10,
				slideBtn : 'slide-arr',
				slideTime : 1000,
				slideRange : 7000,
				slideNum : 5,
				autoSlide : true,
				afterCallback: function () {},
				beforeCallback: function () {}
			};
			var inter, enable = true;
			var options = $.extend(defaults, options),
				$slideWrap = $(this),
				$slideEls = $slideWrap.find(options.slideEl),
				$slideList = $slideEls.parent(),
				slideWrapWidth = $slideWrap.width(),
				slideElWidth = $slideEls.width() + options.slideElMg,
				slideStep = options.slideNum * slideElWidth,
				$slideBtn = $slideWrap.find(options.slideBtn);
			
			$slideBtn.on('click', function(){
				if(!enable) return;
				if($(this).hasClass('next'))
					_slideToLeft();
				else
					_slideToRight();
			});
			$(document).ready(function(){
				$slideList.css({width : ($slideEls.length + options.slideNum) * slideElWidth, left : 0});
				_setAutoSlide();
			});
			$slideWrap.on('mouseenter', function(){//检测鼠标移入移出
				clearTimeout(inter);
			}).on('mouseleave', function(){
				_setAutoSlide();
			});
			function _setAutoSlide(){//自动滚动
				clearTimeout(inter);
				if(options.autoSlide){
					inter = setTimeout(function(){
						_slideToLeft();
						_setAutoSlide();
					}, options.slideRange);
				}
			}
			function _slideToLeft(){
				options.afterCallback.call($slideWrap);
				enable = false;
				var elClones = $slideWrap.find(options.slideEl).slice(0, options.slideNum);
				$slideList.append(elClones.clone());
				$slideList.animate({left : '-=' + slideStep}, options.slideTime, function(){
					elClones.remove();
					$slideList.css({ left : '+=' + slideStep});
					enable = true;
				});
				options.beforeCallback.call($slideWrap);
			}
			function _slideToRight(){
				options.afterCallback.call($slideWrap);
				enable = false;
				var elClones = $slideWrap.find(options.slideEl).slice('-' + options.slideNum);
				$slideList.prepend(elClones.clone());
				$slideList.css({left : '-=' + slideStep});
				$slideList.animate({left : '+=' + slideStep}, options.slideTime, function(){
					elClones.remove();
					enable = true;
				});
				options.beforeCallback.call($slideWrap);
			}			
		},
		rollText : function(options){//列表文字自动上滚
			var defaults = {
				rollList : 'ul',
				rollEls : 'li',
				rollNum : 1,
				rollTime : 1000,
				rollRange : 3000,
				autoRoll : true
			};
			var options = $.extend(defaults, options);
			var $rollWrap = $(this),
				$rollList = $rollWrap.find(options.rollList),
				autoInter;
			$rollWrap.on('mouseenter', function(){
				_clearAutoRoll();
			}).on('mouseleave', function(){
				_setAutoRoll();
			})
			$(document).ready(function(){
				_setAutoRoll();
			});
			function _setAutoRoll(){
				if(options.autoRoll){
					autoInter = setTimeout(function(){
						$rollList.each(function(){
							var $wrap = $(this);
							var $origs = $wrap.find(options.rollEls).slice(0, options.rollNum);
							$wrap.append($origs.clone());
							$origs.slideUp(options.rollTime, function(){
								$origs.remove();
							});
						});
						 _setAutoRoll();
					}, options.rollRange);
				}				
			}
			function _clearAutoRoll(){
				clearTimeout(autoInter);
			}
		},
		autoRoll : function(options){
			var defaults = {
				rollTitle : '.channel-wrap a',
				rollEls : '.juhe-con-wrap',
				rollConTime : 10000
			};

			var options = $.extend(defaults, options);
			var $rollWrap = $(this),
				$rollTitle = $rollWrap.find(options.rollTitle);
				$rollEls = $rollWrap.find(options.rollEls);
				$rollEleLength = $rollWrap.find(options.rollEls).length;
				$rollConTime = options.rollConTime;

			$(document).ready(function(){
				_autoContentRoll();
			});

			function bigImgIndex() {
				$rollEls.each(function(i, el) {
				  if ($(el).is(':visible')) {
				    bigIndex = i;
				  }
				});
				return bigIndex;
			}

			function _autoContentRoll(){	

				function slideRoll(){ 
					var conIndex = bigImgIndex();
					if ( conIndex == ($rollEleLength-1) ) {
						conIndex = -1;
					} 

					$rollTitle.eq(conIndex).removeClass('cur');
					$rollTitle.eq(conIndex + 1).addClass('cur');

					$rollEls.eq(conIndex).hide();
					$rollEls.eq(conIndex + 1).show();
				} 
				slideAction = setInterval(slideRoll, $rollConTime);
			} 

			$rollTitle.mouseover(function(){
					clearInterval(slideAction); 
					var conIndex = bigImgIndex();
					$rollTitle.removeClass('cur').eq($(this).index()).addClass('cur');
					$rollEls.hide().eq($(this).index()).fadeIn(300);
				}).mouseout(function(){
				   _autoContentRoll()
			});
		}

	});
})(jQuery);



//切换插件 2014-08-28
(function($){
	$.fn.extend({
		fadeSlide : function(options){
			var defaults = {
				fadeBtn : '.arr',//切换按钮
				fadeDots : '.fadeDots',//切换圆点序列（如有）
				fadeCon : '.fadeCon',//切换内容容器
				fadeCurClass : 'cur',//圆点选中类名
				dotsEvent : 'click',//圆点触发事件
				fadeTime : 300,//切换动画时长
				fadeRange : 15000,//切换间隔
				autoFade : false//自动切换
			}
			var options = $.extend(defaults, options),
				$fadeWrap = this,
				$fadeBtn = $fadeWrap.find(options.fadeBtn),
				$fadeDots = $fadeWrap.find(options.fadeDots),
				$fadeCon = $fadeWrap.find(options.fadeCon),
				len = $fadeCon.length,
				autoFlag = null;
			$fadeDots.on(options.dotsEvent, function(){				
				if(!$(this).hasClass(options.fadeCurClass))
					fadeOutFn($(this).index());
			});
			$fadeBtn.on('click', function(){
				var index = ($fadeWrap.find($('.' + options.fadeCurClass)).index() + (($(this).hasClass('next')) ? 1 : (-1))) % len;
				fadeOutFn(index);
			})
			$fadeWrap.on('mouseenter', function(){
				clearTimeout(autoFlag);
			}).on('mouseleave', function(){
				var $that = $(this);
				(!options.autoFade) || _setAutoFlag();
			})
			$(document).ready(function(){
				var $that = $(this);
				(!options.autoFade) || _setAutoFlag();
			});
			function autoFadeFn(direct){
				clearTimeout(autoFlag);
				var direct = direct || 'next', index = ($fadeWrap.find($('.' + options.fadeCurClass)).index() + ((direct == 'next') ? 1 : (-1))) % len;
				fadeOutFn(index);
				_setAutoFlag();
			}
			function _setAutoFlag(){
				autoFlag = setTimeout(function(){
					autoFadeFn('next')
				}, options.fadeRange);
			}
			function fadeOutFn(index){
				$fadeDots.removeClass(options.fadeCurClass).eq(index).addClass(options.fadeCurClass);
				$fadeCon.hide().eq(index).fadeIn(options.fadeTime);
			}
			return {
				fadeOutFn : fadeOutFn
			}
		},
		slideImage : function(options){
			//default
			var defaults = {
				slideEl : 'slide-li',
				slideElMg : 10,
				slideBtn : 'slide-arr',
				slideTime : 1000,
				slideRange : 7000,
				slideNum : 5,
				autoSlide : true,
				afterCallback: function () {},
				beforeCallback: function () {}
			};
			var inter, enable = true;
			var options = $.extend(defaults, options),
				$slideWrap = $(this),
				$slideEls = $slideWrap.find(options.slideEl),
				$slideList = $slideEls.parent(),
				slideWrapWidth = $slideWrap.width(),
				slideElWidth = $slideEls.width() + options.slideElMg,
				slideStep = options.slideNum * slideElWidth,
				$slideBtn = $slideWrap.find(options.slideBtn);
			
			$slideBtn.on('click', function(){
				if(!enable) return;
				if($(this).hasClass('next'))
					_slideToLeft();
				else
					_slideToRight();
			});
			$(document).ready(function(){
				$slideList.css({width : ($slideEls.length + options.slideNum) * slideElWidth, left : 0});
				_setAutoSlide();
			});
			$slideWrap.on('mouseenter', function(){//检测鼠标移入移出
				clearTimeout(inter);
			}).on('mouseleave', function(){
				_setAutoSlide();
			});
			function _setAutoSlide(){//自动滚动
				clearTimeout(inter);
				if(options.autoSlide){
					inter = setTimeout(function(){
						_slideToLeft();
						_setAutoSlide();
					}, options.slideRange);
				}
			}
			function _slideToLeft(){
				options.afterCallback.call($slideWrap);
				enable = false;
				var elClones = $slideWrap.find(options.slideEl).slice(0, options.slideNum);
				$slideList.append(elClones.clone());
				$slideList.animate({left : '-=' + slideStep}, options.slideTime, function(){
					elClones.remove();
					$slideList.css({ left : '+=' + slideStep});
					enable = true;
				});
				options.beforeCallback.call($slideWrap);
			}
			function _slideToRight(){
				options.afterCallback.call($slideWrap);
				enable = false;
				var elClones = $slideWrap.find(options.slideEl).slice('-' + options.slideNum);
				$slideList.prepend(elClones.clone());
				$slideList.css({left : '-=' + slideStep});
				$slideList.animate({left : '+=' + slideStep}, options.slideTime, function(){
					elClones.remove();
					enable = true;
				});
				options.beforeCallback.call($slideWrap);
			}			
		},
		rollText : function(options){//列表文字自动上滚
			var defaults = {
				rollList : 'ul',
				rollEls : 'li',
				rollNum : 1,
				rollTime : 1000,
				rollRange : 3000,
				autoRoll : true
			};
			var options = $.extend(defaults, options);
			var $rollWrap = $(this),
				$rollList = $rollWrap.find(options.rollList),
				autoInter;
			$rollWrap.on('mouseenter', function(){
				_clearAutoRoll();
			}).on('mouseleave', function(){
				_setAutoRoll();
			})
			$(document).ready(function(){
				_setAutoRoll();
			});
			function _setAutoRoll(){
				if(options.autoRoll){
					autoInter = setTimeout(function(){
						$rollList.each(function(){
							var $wrap = $(this);
							var $origs = $wrap.find(options.rollEls).slice(0, options.rollNum);
							$wrap.append($origs.clone());
							$origs.slideUp(options.rollTime, function(){
								$origs.remove();
							});
						});
						 _setAutoRoll();
					}, options.rollRange);
				}				
			}
			function _clearAutoRoll(){
				clearTimeout(autoInter);
			}
		},
		autoRoll : function(options){
			var defaults = {
				rollTitle : '.channel-wrap a',
				rollEls : '.juhe-con-wrap',
				rollConTime : 10000
			};

			var options = $.extend(defaults, options);
			var $rollWrap = $(this),
				$rollTitle = $rollWrap.find(options.rollTitle);
				$rollEls = $rollWrap.find(options.rollEls);
				$rollEleLength = $rollWrap.find(options.rollEls).length;
				$rollConTime = options.rollConTime;

			$(document).ready(function(){
				_autoContentRoll();
			});

			function bigImgIndex() {
				$rollEls.each(function(i, el) {
				  if ($(el).is(':visible')) {
				    bigIndex = i;
				  }
				});
				return bigIndex;
			}

			function _autoContentRoll(){	

				function slideRoll(){ 
					var conIndex = bigImgIndex();
					if ( conIndex == ($rollEleLength-1) ) {
						conIndex = -1;
					} 

					$rollTitle.eq(conIndex).removeClass('cur');
					$rollTitle.eq(conIndex + 1).addClass('cur');

					$rollEls.eq(conIndex).hide();
					$rollEls.eq(conIndex + 1).show();
				} 
				slideAction = setInterval(slideRoll, $rollConTime);
			} 

			$rollTitle.mouseover(function(){
					clearInterval(slideAction); 
					var conIndex = bigImgIndex();
					$rollTitle.removeClass('cur').eq($(this).index()).addClass('cur');
					$rollEls.hide().eq($(this).index()).fadeIn(300);
				}).mouseout(function(){
				   _autoContentRoll()
			});
		}

	});
})(jQuery);



//切换插件 2014-08-28
(function($){
	$.fn.extend({
		fadeSlide : function(options){
			var defaults = {
				fadeBtn : '.arr',//切换按钮
				fadeDots : '.fadeDots',//切换圆点序列（如有）
				fadeCon : '.fadeCon',//切换内容容器
				fadeCurClass : 'cur',//圆点选中类名
				dotsEvent : 'click',//圆点触发事件
				fadeTime : 300,//切换动画时长
				fadeRange : 15000,//切换间隔
				autoFade : false//自动切换
			}
			var options = $.extend(defaults, options),
				$fadeWrap = this,
				$fadeBtn = $fadeWrap.find(options.fadeBtn),
				$fadeDots = $fadeWrap.find(options.fadeDots),
				$fadeCon = $fadeWrap.find(options.fadeCon),
				len = $fadeCon.length,
				autoFlag = null;
			$fadeDots.on(options.dotsEvent, function(){				
				if(!$(this).hasClass(options.fadeCurClass))
					fadeOutFn($(this).index());
			});
			$fadeBtn.on('click', function(){
				var index = ($fadeWrap.find($('.' + options.fadeCurClass)).index() + (($(this).hasClass('next')) ? 1 : (-1))) % len;
				fadeOutFn(index);
			})
			$fadeWrap.on('mouseenter', function(){
				clearTimeout(autoFlag);
			}).on('mouseleave', function(){
				var $that = $(this);
				(!options.autoFade) || _setAutoFlag();
			})
			$(document).ready(function(){
				var $that = $(this);
				(!options.autoFade) || _setAutoFlag();
			});
			function autoFadeFn(direct){
				clearTimeout(autoFlag);
				var direct = direct || 'next', index = ($fadeWrap.find($('.' + options.fadeCurClass)).index() + ((direct == 'next') ? 1 : (-1))) % len;
				fadeOutFn(index);
				_setAutoFlag();
			}
			function _setAutoFlag(){
				autoFlag = setTimeout(function(){
					autoFadeFn('next')
				}, options.fadeRange);
			}
			function fadeOutFn(index){
				$fadeDots.removeClass(options.fadeCurClass).eq(index).addClass(options.fadeCurClass);
				$fadeCon.hide().eq(index).fadeIn(options.fadeTime);
			}
			return {
				fadeOutFn : fadeOutFn
			}
		},
		slideImage : function(options){
			//default
			var defaults = {
				slideEl : 'slide-li',
				slideElMg : 10,
				slideBtn : 'slide-arr',
				slideTime : 1000,
				slideRange : 7000,
				slideNum : 5,
				autoSlide : true,
				afterCallback: function () {},
				beforeCallback: function () {}
			};
			var inter, enable = true;
			var options = $.extend(defaults, options),
				$slideWrap = $(this),
				$slideEls = $slideWrap.find(options.slideEl),
				$slideList = $slideEls.parent(),
				slideWrapWidth = $slideWrap.width(),
				slideElWidth = $slideEls.width() + options.slideElMg,
				slideStep = options.slideNum * slideElWidth,
				$slideBtn = $slideWrap.find(options.slideBtn);
			
			$slideBtn.on('click', function(){
				if(!enable) return;
				if($(this).hasClass('next'))
					_slideToLeft();
				else
					_slideToRight();
			});
			$(document).ready(function(){
				$slideList.css({width : ($slideEls.length + options.slideNum) * slideElWidth, left : 0});
				_setAutoSlide();
			});
			$slideWrap.on('mouseenter', function(){//检测鼠标移入移出
				clearTimeout(inter);
			}).on('mouseleave', function(){
				_setAutoSlide();
			});
			function _setAutoSlide(){//自动滚动
				clearTimeout(inter);
				if(options.autoSlide){
					inter = setTimeout(function(){
						_slideToLeft();
						_setAutoSlide();
					}, options.slideRange);
				}
			}
			function _slideToLeft(){
				options.afterCallback.call($slideWrap);
				enable = false;
				var elClones = $slideWrap.find(options.slideEl).slice(0, options.slideNum);
				$slideList.append(elClones.clone());
				$slideList.animate({left : '-=' + slideStep}, options.slideTime, function(){
					elClones.remove();
					$slideList.css({ left : '+=' + slideStep});
					enable = true;
				});
				options.beforeCallback.call($slideWrap);
			}
			function _slideToRight(){
				options.afterCallback.call($slideWrap);
				enable = false;
				var elClones = $slideWrap.find(options.slideEl).slice('-' + options.slideNum);
				$slideList.prepend(elClones.clone());
				$slideList.css({left : '-=' + slideStep});
				$slideList.animate({left : '+=' + slideStep}, options.slideTime, function(){
					elClones.remove();
					enable = true;
				});
				options.beforeCallback.call($slideWrap);
			}			
		},
		rollText : function(options){//列表文字自动上滚
			var defaults = {
				rollList : 'ul',
				rollEls : 'li',
				rollNum : 1,
				rollTime : 1000,
				rollRange : 3000,
				autoRoll : true
			};
			var options = $.extend(defaults, options);
			var $rollWrap = $(this),
				$rollList = $rollWrap.find(options.rollList),
				autoInter;
			$rollWrap.on('mouseenter', function(){
				_clearAutoRoll();
			}).on('mouseleave', function(){
				_setAutoRoll();
			})
			$(document).ready(function(){
				_setAutoRoll();
			});
			function _setAutoRoll(){
				if(options.autoRoll){
					autoInter = setTimeout(function(){
						$rollList.each(function(){
							var $wrap = $(this);
							var $origs = $wrap.find(options.rollEls).slice(0, options.rollNum);
							$wrap.append($origs.clone());
							$origs.slideUp(options.rollTime, function(){
								$origs.remove();
							});
						});
						 _setAutoRoll();
					}, options.rollRange);
				}				
			}
			function _clearAutoRoll(){
				clearTimeout(autoInter);
			}
		},
		autoRoll : function(options){
			var defaults = {
				rollTitle : '.channel-wrap a',
				rollEls : '.juhe-con-wrap',
				rollConTime : 10000
			};

			var options = $.extend(defaults, options);
			var $rollWrap = $(this),
				$rollTitle = $rollWrap.find(options.rollTitle);
				$rollEls = $rollWrap.find(options.rollEls);
				$rollEleLength = $rollWrap.find(options.rollEls).length;
				$rollConTime = options.rollConTime;

			$(document).ready(function(){
				_autoContentRoll();
			});

			function bigImgIndex() {
				$rollEls.each(function(i, el) {
				  if ($(el).is(':visible')) {
				    bigIndex = i;
				  }
				});
				return bigIndex;
			}

			function _autoContentRoll(){	

				function slideRoll(){ 
					var conIndex = bigImgIndex();
					if ( conIndex == ($rollEleLength-1) ) {
						conIndex = -1;
					} 

					$rollTitle.eq(conIndex).removeClass('cur');
					$rollTitle.eq(conIndex + 1).addClass('cur');

					$rollEls.eq(conIndex).hide();
					$rollEls.eq(conIndex + 1).show();
				} 
				slideAction = setInterval(slideRoll, $rollConTime);
			} 

			$rollTitle.mouseover(function(){
					clearInterval(slideAction); 
					var conIndex = bigImgIndex();
					$rollTitle.removeClass('cur').eq($(this).index()).addClass('cur');
					$rollEls.hide().eq($(this).index()).fadeIn(300);
				}).mouseout(function(){
				   _autoContentRoll()
			});
		}

	});
})(jQuery);



//切换插件 2014-08-28
(function($){
	$.fn.extend({
		fadeSlide : function(options){
			var defaults = {
				fadeBtn : '.arr',//切换按钮
				fadeDots : '.fadeDots',//切换圆点序列（如有）
				fadeCon : '.fadeCon',//切换内容容器
				fadeCurClass : 'cur',//圆点选中类名
				dotsEvent : 'click',//圆点触发事件
				fadeTime : 300,//切换动画时长
				fadeRange : 15000,//切换间隔
				autoFade : false//自动切换
			}
			var options = $.extend(defaults, options),
				$fadeWrap = this,
				$fadeBtn = $fadeWrap.find(options.fadeBtn),
				$fadeDots = $fadeWrap.find(options.fadeDots),
				$fadeCon = $fadeWrap.find(options.fadeCon),
				len = $fadeCon.length,
				autoFlag = null;
			$fadeDots.on(options.dotsEvent, function(){				
				if(!$(this).hasClass(options.fadeCurClass))
					fadeOutFn($(this).index());
			});
			$fadeBtn.on('click', function(){
				var index = ($fadeWrap.find($('.' + options.fadeCurClass)).index() + (($(this).hasClass('next')) ? 1 : (-1))) % len;
				fadeOutFn(index);
			})
			$fadeWrap.on('mouseenter', function(){
				clearTimeout(autoFlag);
			}).on('mouseleave', function(){
				var $that = $(this);
				(!options.autoFade) || _setAutoFlag();
			})
			$(document).ready(function(){
				var $that = $(this);
				(!options.autoFade) || _setAutoFlag();
			});
			function autoFadeFn(direct){
				clearTimeout(autoFlag);
				var direct = direct || 'next', index = ($fadeWrap.find($('.' + options.fadeCurClass)).index() + ((direct == 'next') ? 1 : (-1))) % len;
				fadeOutFn(index);
				_setAutoFlag();
			}
			function _setAutoFlag(){
				autoFlag = setTimeout(function(){
					autoFadeFn('next')
				}, options.fadeRange);
			}
			function fadeOutFn(index){
				$fadeDots.removeClass(options.fadeCurClass).eq(index).addClass(options.fadeCurClass);
				$fadeCon.hide().eq(index).fadeIn(options.fadeTime);
			}
			return {
				fadeOutFn : fadeOutFn
			}
		},
		slideImage : function(options){
			//default
			var defaults = {
				slideEl : 'slide-li',
				slideElMg : 10,
				slideBtn : 'slide-arr',
				slideTime : 1000,
				slideRange : 7000,
				slideNum : 5,
				autoSlide : true,
				afterCallback: function () {},
				beforeCallback: function () {}
			};
			var inter, enable = true;
			var options = $.extend(defaults, options),
				$slideWrap = $(this),
				$slideEls = $slideWrap.find(options.slideEl),
				$slideList = $slideEls.parent(),
				slideWrapWidth = $slideWrap.width(),
				slideElWidth = $slideEls.width() + options.slideElMg,
				slideStep = options.slideNum * slideElWidth,
				$slideBtn = $slideWrap.find(options.slideBtn);
			
			$slideBtn.on('click', function(){
				if(!enable) return;
				if($(this).hasClass('next'))
					_slideToLeft();
				else
					_slideToRight();
			});
			$(document).ready(function(){
				$slideList.css({width : ($slideEls.length + options.slideNum) * slideElWidth, left : 0});
				_setAutoSlide();
			});
			$slideWrap.on('mouseenter', function(){//检测鼠标移入移出
				clearTimeout(inter);
			}).on('mouseleave', function(){
				_setAutoSlide();
			});
			function _setAutoSlide(){//自动滚动
				clearTimeout(inter);
				if(options.autoSlide){
					inter = setTimeout(function(){
						_slideToLeft();
						_setAutoSlide();
					}, options.slideRange);
				}
			}
			function _slideToLeft(){
				options.afterCallback.call($slideWrap);
				enable = false;
				var elClones = $slideWrap.find(options.slideEl).slice(0, options.slideNum);
				$slideList.append(elClones.clone());
				$slideList.animate({left : '-=' + slideStep}, options.slideTime, function(){
					elClones.remove();
					$slideList.css({ left : '+=' + slideStep});
					enable = true;
				});
				options.beforeCallback.call($slideWrap);
			}
			function _slideToRight(){
				options.afterCallback.call($slideWrap);
				enable = false;
				var elClones = $slideWrap.find(options.slideEl).slice('-' + options.slideNum);
				$slideList.prepend(elClones.clone());
				$slideList.css({left : '-=' + slideStep});
				$slideList.animate({left : '+=' + slideStep}, options.slideTime, function(){
					elClones.remove();
					enable = true;
				});
				options.beforeCallback.call($slideWrap);
			}			
		},
		rollText : function(options){//列表文字自动上滚
			var defaults = {
				rollList : 'ul',
				rollEls : 'li',
				rollNum : 1,
				rollTime : 1000,
				rollRange : 3000,
				autoRoll : true
			};
			var options = $.extend(defaults, options);
			var $rollWrap = $(this),
				$rollList = $rollWrap.find(options.rollList),
				autoInter;
			$rollWrap.on('mouseenter', function(){
				_clearAutoRoll();
			}).on('mouseleave', function(){
				_setAutoRoll();
			})
			$(document).ready(function(){
				_setAutoRoll();
			});
			function _setAutoRoll(){
				if(options.autoRoll){
					autoInter = setTimeout(function(){
						$rollList.each(function(){
							var $wrap = $(this);
							var $origs = $wrap.find(options.rollEls).slice(0, options.rollNum);
							$wrap.append($origs.clone());
							$origs.slideUp(options.rollTime, function(){
								$origs.remove();
							});
						});
						 _setAutoRoll();
					}, options.rollRange);
				}				
			}
			function _clearAutoRoll(){
				clearTimeout(autoInter);
			}
		},
		autoRoll : function(options){
			var defaults = {
				rollTitle : '.channel-wrap a',
				rollEls : '.juhe-con-wrap',
				rollConTime : 10000
			};

			var options = $.extend(defaults, options);
			var $rollWrap = $(this),
				$rollTitle = $rollWrap.find(options.rollTitle);
				$rollEls = $rollWrap.find(options.rollEls);
				$rollEleLength = $rollWrap.find(options.rollEls).length;
				$rollConTime = options.rollConTime;

			$(document).ready(function(){
				_autoContentRoll();
			});

			function bigImgIndex() {
				$rollEls.each(function(i, el) {
				  if ($(el).is(':visible')) {
				    bigIndex = i;
				  }
				});
				return bigIndex;
			}

			function _autoContentRoll(){	

				function slideRoll(){ 
					var conIndex = bigImgIndex();
					if ( conIndex == ($rollEleLength-1) ) {
						conIndex = -1;
					} 

					$rollTitle.eq(conIndex).removeClass('cur');
					$rollTitle.eq(conIndex + 1).addClass('cur');

					$rollEls.eq(conIndex).hide();
					$rollEls.eq(conIndex + 1).show();
				} 
				slideAction = setInterval(slideRoll, $rollConTime);
			} 

			$rollTitle.mouseover(function(){
					clearInterval(slideAction); 
					var conIndex = bigImgIndex();
					$rollTitle.removeClass('cur').eq($(this).index()).addClass('cur');
					$rollEls.hide().eq($(this).index()).fadeIn(300);
				}).mouseout(function(){
				   _autoContentRoll()
			});
		}

	});
})(jQuery);



//切换插件 2014-08-28
(function($){
	$.fn.extend({
		fadeSlide : function(options){
			var defaults = {
				fadeBtn : '.arr',//切换按钮
				fadeDots : '.fadeDots',//切换圆点序列（如有）
				fadeCon : '.fadeCon',//切换内容容器
				fadeCurClass : 'cur',//圆点选中类名
				dotsEvent : 'click',//圆点触发事件
				fadeTime : 300,//切换动画时长
				fadeRange : 15000,//切换间隔
				autoFade : false//自动切换
			}
			var options = $.extend(defaults, options),
				$fadeWrap = this,
				$fadeBtn = $fadeWrap.find(options.fadeBtn),
				$fadeDots = $fadeWrap.find(options.fadeDots),
				$fadeCon = $fadeWrap.find(options.fadeCon),
				len = $fadeCon.length,
				autoFlag = null;
			$fadeDots.on(options.dotsEvent, function(){				
				if(!$(this).hasClass(options.fadeCurClass))
					fadeOutFn($(this).index());
			});
			$fadeBtn.on('click', function(){
				var index = ($fadeWrap.find($('.' + options.fadeCurClass)).index() + (($(this).hasClass('next')) ? 1 : (-1))) % len;
				fadeOutFn(index);
			})
			$fadeWrap.on('mouseenter', function(){
				clearTimeout(autoFlag);
			}).on('mouseleave', function(){
				var $that = $(this);
				(!options.autoFade) || _setAutoFlag();
			})
			$(document).ready(function(){
				var $that = $(this);
				(!options.autoFade) || _setAutoFlag();
			});
			function autoFadeFn(direct){
				clearTimeout(autoFlag);
				var direct = direct || 'next', index = ($fadeWrap.find($('.' + options.fadeCurClass)).index() + ((direct == 'next') ? 1 : (-1))) % len;
				fadeOutFn(index);
				_setAutoFlag();
			}
			function _setAutoFlag(){
				autoFlag = setTimeout(function(){
					autoFadeFn('next')
				}, options.fadeRange);
			}
			function fadeOutFn(index){
				$fadeDots.removeClass(options.fadeCurClass).eq(index).addClass(options.fadeCurClass);
				$fadeCon.hide().eq(index).fadeIn(options.fadeTime);
			}
			return {
				fadeOutFn : fadeOutFn
			}
		},
		slideImage : function(options){
			//default
			var defaults = {
				slideEl : 'slide-li',
				slideElMg : 10,
				slideBtn : 'slide-arr',
				slideTime : 1000,
				slideRange : 7000,
				slideNum : 5,
				autoSlide : true,
				afterCallback: function () {},
				beforeCallback: function () {}
			};
			var inter, enable = true;
			var options = $.extend(defaults, options),
				$slideWrap = $(this),
				$slideEls = $slideWrap.find(options.slideEl),
				$slideList = $slideEls.parent(),
				slideWrapWidth = $slideWrap.width(),
				slideElWidth = $slideEls.width() + options.slideElMg,
				slideStep = options.slideNum * slideElWidth,
				$slideBtn = $slideWrap.find(options.slideBtn);
			
			$slideBtn.on('click', function(){
				if(!enable) return;
				if($(this).hasClass('next'))
					_slideToLeft();
				else
					_slideToRight();
			});
			$(document).ready(function(){
				$slideList.css({width : ($slideEls.length + options.slideNum) * slideElWidth, left : 0});
				_setAutoSlide();
			});
			$slideWrap.on('mouseenter', function(){//检测鼠标移入移出
				clearTimeout(inter);
			}).on('mouseleave', function(){
				_setAutoSlide();
			});
			function _setAutoSlide(){//自动滚动
				clearTimeout(inter);
				if(options.autoSlide){
					inter = setTimeout(function(){
						_slideToLeft();
						_setAutoSlide();
					}, options.slideRange);
				}
			}
			function _slideToLeft(){
				options.afterCallback.call($slideWrap);
				enable = false;
				var elClones = $slideWrap.find(options.slideEl).slice(0, options.slideNum);
				$slideList.append(elClones.clone());
				$slideList.animate({left : '-=' + slideStep}, options.slideTime, function(){
					elClones.remove();
					$slideList.css({ left : '+=' + slideStep});
					enable = true;
				});
				options.beforeCallback.call($slideWrap);
			}
			function _slideToRight(){
				options.afterCallback.call($slideWrap);
				enable = false;
				var elClones = $slideWrap.find(options.slideEl).slice('-' + options.slideNum);
				$slideList.prepend(elClones.clone());
				$slideList.css({left : '-=' + slideStep});
				$slideList.animate({left : '+=' + slideStep}, options.slideTime, function(){
					elClones.remove();
					enable = true;
				});
				options.beforeCallback.call($slideWrap);
			}			
		},
		rollText : function(options){//列表文字自动上滚
			var defaults = {
				rollList : 'ul',
				rollEls : 'li',
				rollNum : 1,
				rollTime : 1000,
				rollRange : 3000,
				autoRoll : true
			};
			var options = $.extend(defaults, options);
			var $rollWrap = $(this),
				$rollList = $rollWrap.find(options.rollList),
				autoInter;
			$rollWrap.on('mouseenter', function(){
				_clearAutoRoll();
			}).on('mouseleave', function(){
				_setAutoRoll();
			})
			$(document).ready(function(){
				_setAutoRoll();
			});
			function _setAutoRoll(){
				if(options.autoRoll){
					autoInter = setTimeout(function(){
						$rollList.each(function(){
							var $wrap = $(this);
							var $origs = $wrap.find(options.rollEls).slice(0, options.rollNum);
							$wrap.append($origs.clone());
							$origs.slideUp(options.rollTime, function(){
								$origs.remove();
							});
						});
						 _setAutoRoll();
					}, options.rollRange);
				}				
			}
			function _clearAutoRoll(){
				clearTimeout(autoInter);
			}
		},
		autoRoll : function(options){
			var defaults = {
				rollTitle : '.channel-wrap a',
				rollEls : '.juhe-con-wrap',
				rollConTime : 10000
			};

			var options = $.extend(defaults, options);
			var $rollWrap = $(this),
				$rollTitle = $rollWrap.find(options.rollTitle);
				$rollEls = $rollWrap.find(options.rollEls);
				$rollEleLength = $rollWrap.find(options.rollEls).length;
				$rollConTime = options.rollConTime;

			$(document).ready(function(){
				_autoContentRoll();
			});

			function bigImgIndex() {
				$rollEls.each(function(i, el) {
				  if ($(el).is(':visible')) {
				    bigIndex = i;
				  }
				});
				return bigIndex;
			}

			function _autoContentRoll(){	

				function slideRoll(){ 
					var conIndex = bigImgIndex();
					if ( conIndex == ($rollEleLength-1) ) {
						conIndex = -1;
					} 

					$rollTitle.eq(conIndex).removeClass('cur');
					$rollTitle.eq(conIndex + 1).addClass('cur');

					$rollEls.eq(conIndex).hide();
					$rollEls.eq(conIndex + 1).show();
				} 
				slideAction = setInterval(slideRoll, $rollConTime);
			} 

			$rollTitle.mouseover(function(){
					clearInterval(slideAction); 
					var conIndex = bigImgIndex();
					$rollTitle.removeClass('cur').eq($(this).index()).addClass('cur');
					$rollEls.hide().eq($(this).index()).fadeIn(300);
				}).mouseout(function(){
				   _autoContentRoll()
			});
		}

	});
})(jQuery);



//切换插件 2014-08-28
(function($){
	$.fn.extend({
		fadeSlide : function(options){
			var defaults = {
				fadeBtn : '.arr',//切换按钮
				fadeDots : '.fadeDots',//切换圆点序列（如有）
				fadeCon : '.fadeCon',//切换内容容器
				fadeCurClass : 'cur',//圆点选中类名
				dotsEvent : 'click',//圆点触发事件
				fadeTime : 300,//切换动画时长
				fadeRange : 15000,//切换间隔
				autoFade : false//自动切换
			}
			var options = $.extend(defaults, options),
				$fadeWrap = this,
				$fadeBtn = $fadeWrap.find(options.fadeBtn),
				$fadeDots = $fadeWrap.find(options.fadeDots),
				$fadeCon = $fadeWrap.find(options.fadeCon),
				len = $fadeCon.length,
				autoFlag = null;
			$fadeDots.on(options.dotsEvent, function(){				
				if(!$(this).hasClass(options.fadeCurClass))
					fadeOutFn($(this).index());
			});
			$fadeBtn.on('click', function(){
				var index = ($fadeWrap.find($('.' + options.fadeCurClass)).index() + (($(this).hasClass('next')) ? 1 : (-1))) % len;
				fadeOutFn(index);
			})
			$fadeWrap.on('mouseenter', function(){
				clearTimeout(autoFlag);
			}).on('mouseleave', function(){
				var $that = $(this);
				(!options.autoFade) || _setAutoFlag();
			})
			$(document).ready(function(){
				var $that = $(this);
				(!options.autoFade) || _setAutoFlag();
			});
			function autoFadeFn(direct){
				clearTimeout(autoFlag);
				var direct = direct || 'next', index = ($fadeWrap.find($('.' + options.fadeCurClass)).index() + ((direct == 'next') ? 1 : (-1))) % len;
				fadeOutFn(index);
				_setAutoFlag();
			}
			function _setAutoFlag(){
				autoFlag = setTimeout(function(){
					autoFadeFn('next')
				}, options.fadeRange);
			}
			function fadeOutFn(index){
				$fadeDots.removeClass(options.fadeCurClass).eq(index).addClass(options.fadeCurClass);
				$fadeCon.hide().eq(index).fadeIn(options.fadeTime);
			}
			return {
				fadeOutFn : fadeOutFn
			}
		},
		slideImage : function(options){
			//default
			var defaults = {
				slideEl : 'slide-li',
				slideElMg : 10,
				slideBtn : 'slide-arr',
				slideTime : 1000,
				slideRange : 7000,
				slideNum : 5,
				autoSlide : true,
				afterCallback: function () {},
				beforeCallback: function () {}
			};
			var inter, enable = true;
			var options = $.extend(defaults, options),
				$slideWrap = $(this),
				$slideEls = $slideWrap.find(options.slideEl),
				$slideList = $slideEls.parent(),
				slideWrapWidth = $slideWrap.width(),
				slideElWidth = $slideEls.width() + options.slideElMg,
				slideStep = options.slideNum * slideElWidth,
				$slideBtn = $slideWrap.find(options.slideBtn);
			
			$slideBtn.on('click', function(){
				if(!enable) return;
				if($(this).hasClass('next'))
					_slideToLeft();
				else
					_slideToRight();
			});
			$(document).ready(function(){
				$slideList.css({width : ($slideEls.length + options.slideNum) * slideElWidth, left : 0});
				_setAutoSlide();
			});
			$slideWrap.on('mouseenter', function(){//检测鼠标移入移出
				clearTimeout(inter);
			}).on('mouseleave', function(){
				_setAutoSlide();
			});
			function _setAutoSlide(){//自动滚动
				clearTimeout(inter);
				if(options.autoSlide){
					inter = setTimeout(function(){
						_slideToLeft();
						_setAutoSlide();
					}, options.slideRange);
				}
			}
			function _slideToLeft(){
				options.afterCallback.call($slideWrap);
				enable = false;
				var elClones = $slideWrap.find(options.slideEl).slice(0, options.slideNum);
				$slideList.append(elClones.clone());
				$slideList.animate({left : '-=' + slideStep}, options.slideTime, function(){
					elClones.remove();
					$slideList.css({ left : '+=' + slideStep});
					enable = true;
				});
				options.beforeCallback.call($slideWrap);
			}
			function _slideToRight(){
				options.afterCallback.call($slideWrap);
				enable = false;
				var elClones = $slideWrap.find(options.slideEl).slice('-' + options.slideNum);
				$slideList.prepend(elClones.clone());
				$slideList.css({left : '-=' + slideStep});
				$slideList.animate({left : '+=' + slideStep}, options.slideTime, function(){
					elClones.remove();
					enable = true;
				});
				options.beforeCallback.call($slideWrap);
			}			
		},
		rollText : function(options){//列表文字自动上滚
			var defaults = {
				rollList : 'ul',
				rollEls : 'li',
				rollNum : 1,
				rollTime : 1000,
				rollRange : 3000,
				autoRoll : true
			};
			var options = $.extend(defaults, options);
			var $rollWrap = $(this),
				$rollList = $rollWrap.find(options.rollList),
				autoInter;
			$rollWrap.on('mouseenter', function(){
				_clearAutoRoll();
			}).on('mouseleave', function(){
				_setAutoRoll();
			})
			$(document).ready(function(){
				_setAutoRoll();
			});
			function _setAutoRoll(){
				if(options.autoRoll){
					autoInter = setTimeout(function(){
						$rollList.each(function(){
							var $wrap = $(this);
							var $origs = $wrap.find(options.rollEls).slice(0, options.rollNum);
							$wrap.append($origs.clone());
							$origs.slideUp(options.rollTime, function(){
								$origs.remove();
							});
						});
						 _setAutoRoll();
					}, options.rollRange);
				}				
			}
			function _clearAutoRoll(){
				clearTimeout(autoInter);
			}
		},
		autoRoll : function(options){
			var defaults = {
				rollTitle : '.channel-wrap a',
				rollEls : '.juhe-con-wrap',
				rollConTime : 10000
			};

			var options = $.extend(defaults, options);
			var $rollWrap = $(this),
				$rollTitle = $rollWrap.find(options.rollTitle);
				$rollEls = $rollWrap.find(options.rollEls);
				$rollEleLength = $rollWrap.find(options.rollEls).length;
				$rollConTime = options.rollConTime;

			$(document).ready(function(){
				_autoContentRoll();
			});

			function bigImgIndex() {
				$rollEls.each(function(i, el) {
				  if ($(el).is(':visible')) {
				    bigIndex = i;
				  }
				});
				return bigIndex;
			}

			function _autoContentRoll(){	

				function slideRoll(){ 
					var conIndex = bigImgIndex();
					if ( conIndex == ($rollEleLength-1) ) {
						conIndex = -1;
					} 

					$rollTitle.eq(conIndex).removeClass('cur');
					$rollTitle.eq(conIndex + 1).addClass('cur');

					$rollEls.eq(conIndex).hide();
					$rollEls.eq(conIndex + 1).show();
				} 
				slideAction = setInterval(slideRoll, $rollConTime);
			} 

			$rollTitle.mouseover(function(){
					clearInterval(slideAction); 
					var conIndex = bigImgIndex();
					$rollTitle.removeClass('cur').eq($(this).index()).addClass('cur');
					$rollEls.hide().eq($(this).index()).fadeIn(300);
				}).mouseout(function(){
				   _autoContentRoll()
			});
		}

	});
})(jQuery);



//切换插件 2014-08-28
(function($){
	$.fn.extend({
		fadeSlide : function(options){
			var defaults = {
				fadeBtn : '.arr',//切换按钮
				fadeDots : '.fadeDots',//切换圆点序列（如有）
				fadeCon : '.fadeCon',//切换内容容器
				fadeCurClass : 'cur',//圆点选中类名
				dotsEvent : 'click',//圆点触发事件
				fadeTime : 300,//切换动画时长
				fadeRange : 15000,//切换间隔
				autoFade : false//自动切换
			}
			var options = $.extend(defaults, options),
				$fadeWrap = this,
				$fadeBtn = $fadeWrap.find(options.fadeBtn),
				$fadeDots = $fadeWrap.find(options.fadeDots),
				$fadeCon = $fadeWrap.find(options.fadeCon),
				len = $fadeCon.length,
				autoFlag = null;
			$fadeDots.on(options.dotsEvent, function(){				
				if(!$(this).hasClass(options.fadeCurClass))
					fadeOutFn($(this).index());
			});
			$fadeBtn.on('click', function(){
				var index = ($fadeWrap.find($('.' + options.fadeCurClass)).index() + (($(this).hasClass('next')) ? 1 : (-1))) % len;
				fadeOutFn(index);
			})
			$fadeWrap.on('mouseenter', function(){
				clearTimeout(autoFlag);
			}).on('mouseleave', function(){
				var $that = $(this);
				(!options.autoFade) || _setAutoFlag();
			})
			$(document).ready(function(){
				var $that = $(this);
				(!options.autoFade) || _setAutoFlag();
			});
			function autoFadeFn(direct){
				clearTimeout(autoFlag);
				var direct = direct || 'next', index = ($fadeWrap.find($('.' + options.fadeCurClass)).index() + ((direct == 'next') ? 1 : (-1))) % len;
				fadeOutFn(index);
				_setAutoFlag();
			}
			function _setAutoFlag(){
				autoFlag = setTimeout(function(){
					autoFadeFn('next')
				}, options.fadeRange);
			}
			function fadeOutFn(index){
				$fadeDots.removeClass(options.fadeCurClass).eq(index).addClass(options.fadeCurClass);
				$fadeCon.hide().eq(index).fadeIn(options.fadeTime);
			}
			return {
				fadeOutFn : fadeOutFn
			}
		},
		slideImage : function(options){
			//default
			var defaults = {
				slideEl : 'slide-li',
				slideElMg : 10,
				slideBtn : 'slide-arr',
				slideTime : 1000,
				slideRange : 7000,
				slideNum : 5,
				autoSlide : true,
				afterCallback: function () {},
				beforeCallback: function () {}
			};
			var inter, enable = true;
			var options = $.extend(defaults, options),
				$slideWrap = $(this),
				$slideEls = $slideWrap.find(options.slideEl),
				$slideList = $slideEls.parent(),
				slideWrapWidth = $slideWrap.width(),
				slideElWidth = $slideEls.width() + options.slideElMg,
				slideStep = options.slideNum * slideElWidth,
				$slideBtn = $slideWrap.find(options.slideBtn);
			
			$slideBtn.on('click', function(){
				if(!enable) return;
				if($(this).hasClass('next'))
					_slideToLeft();
				else
					_slideToRight();
			});
			$(document).ready(function(){
				$slideList.css({width : ($slideEls.length + options.slideNum) * slideElWidth, left : 0});
				_setAutoSlide();
			});
			$slideWrap.on('mouseenter', function(){//检测鼠标移入移出
				clearTimeout(inter);
			}).on('mouseleave', function(){
				_setAutoSlide();
			});
			function _setAutoSlide(){//自动滚动
				clearTimeout(inter);
				if(options.autoSlide){
					inter = setTimeout(function(){
						_slideToLeft();
						_setAutoSlide();
					}, options.slideRange);
				}
			}
			function _slideToLeft(){
				options.afterCallback.call($slideWrap);
				enable = false;
				var elClones = $slideWrap.find(options.slideEl).slice(0, options.slideNum);
				$slideList.append(elClones.clone());
				$slideList.animate({left : '-=' + slideStep}, options.slideTime, function(){
					elClones.remove();
					$slideList.css({ left : '+=' + slideStep});
					enable = true;
				});
				options.beforeCallback.call($slideWrap);
			}
			function _slideToRight(){
				options.afterCallback.call($slideWrap);
				enable = false;
				var elClones = $slideWrap.find(options.slideEl).slice('-' + options.slideNum);
				$slideList.prepend(elClones.clone());
				$slideList.css({left : '-=' + slideStep});
				$slideList.animate({left : '+=' + slideStep}, options.slideTime, function(){
					elClones.remove();
					enable = true;
				});
				options.beforeCallback.call($slideWrap);
			}			
		},
		rollText : function(options){//列表文字自动上滚
			var defaults = {
				rollList : 'ul',
				rollEls : 'li',
				rollNum : 1,
				rollTime : 1000,
				rollRange : 3000,
				autoRoll : true
			};
			var options = $.extend(defaults, options);
			var $rollWrap = $(this),
				$rollList = $rollWrap.find(options.rollList),
				autoInter;
			$rollWrap.on('mouseenter', function(){
				_clearAutoRoll();
			}).on('mouseleave', function(){
				_setAutoRoll();
			})
			$(document).ready(function(){
				_setAutoRoll();
			});
			function _setAutoRoll(){
				if(options.autoRoll){
					autoInter = setTimeout(function(){
						$rollList.each(function(){
							var $wrap = $(this);
							var $origs = $wrap.find(options.rollEls).slice(0, options.rollNum);
							$wrap.append($origs.clone());
							$origs.slideUp(options.rollTime, function(){
								$origs.remove();
							});
						});
						 _setAutoRoll();
					}, options.rollRange);
				}				
			}
			function _clearAutoRoll(){
				clearTimeout(autoInter);
			}
		},
		autoRoll : function(options){
			var defaults = {
				rollTitle : '.channel-wrap a',
				rollEls : '.juhe-con-wrap',
				rollConTime : 10000
			};

			var options = $.extend(defaults, options);
			var $rollWrap = $(this),
				$rollTitle = $rollWrap.find(options.rollTitle);
				$rollEls = $rollWrap.find(options.rollEls);
				$rollEleLength = $rollWrap.find(options.rollEls).length;
				$rollConTime = options.rollConTime;

			$(document).ready(function(){
				_autoContentRoll();
			});

			function bigImgIndex() {
				$rollEls.each(function(i, el) {
				  if ($(el).is(':visible')) {
				    bigIndex = i;
				  }
				});
				return bigIndex;
			}

			function _autoContentRoll(){	

				function slideRoll(){ 
					var conIndex = bigImgIndex();
					if ( conIndex == ($rollEleLength-1) ) {
						conIndex = -1;
					} 

					$rollTitle.eq(conIndex).removeClass('cur');
					$rollTitle.eq(conIndex + 1).addClass('cur');

					$rollEls.eq(conIndex).hide();
					$rollEls.eq(conIndex + 1).show();
				} 
				slideAction = setInterval(slideRoll, $rollConTime);
			} 

			$rollTitle.mouseover(function(){
					clearInterval(slideAction); 
					var conIndex = bigImgIndex();
					$rollTitle.removeClass('cur').eq($(this).index()).addClass('cur');
					$rollEls.hide().eq($(this).index()).fadeIn(300);
				}).mouseout(function(){
				   _autoContentRoll()
			});
		}

	});
})(jQuery);



//切换插件 2014-08-28
(function($){
	$.fn.extend({
		fadeSlide : function(options){
			var defaults = {
				fadeBtn : '.arr',//切换按钮
				fadeDots : '.fadeDots',//切换圆点序列（如有）
				fadeCon : '.fadeCon',//切换内容容器
				fadeCurClass : 'cur',//圆点选中类名
				dotsEvent : 'click',//圆点触发事件
				fadeTime : 300,//切换动画时长
				fadeRange : 15000,//切换间隔
				autoFade : false//自动切换
			}
			var options = $.extend(defaults, options),
				$fadeWrap = this,
				$fadeBtn = $fadeWrap.find(options.fadeBtn),
				$fadeDots = $fadeWrap.find(options.fadeDots),
				$fadeCon = $fadeWrap.find(options.fadeCon),
				len = $fadeCon.length,
				autoFlag = null;
			$fadeDots.on(options.dotsEvent, function(){				
				if(!$(this).hasClass(options.fadeCurClass))
					fadeOutFn($(this).index());
			});
			$fadeBtn.on('click', function(){
				var index = ($fadeWrap.find($('.' + options.fadeCurClass)).index() + (($(this).hasClass('next')) ? 1 : (-1))) % len;
				fadeOutFn(index);
			})
			$fadeWrap.on('mouseenter', function(){
				clearTimeout(autoFlag);
			}).on('mouseleave', function(){
				var $that = $(this);
				(!options.autoFade) || _setAutoFlag();
			})
			$(document).ready(function(){
				var $that = $(this);
				(!options.autoFade) || _setAutoFlag();
			});
			function autoFadeFn(direct){
				clearTimeout(autoFlag);
				var direct = direct || 'next', index = ($fadeWrap.find($('.' + options.fadeCurClass)).index() + ((direct == 'next') ? 1 : (-1))) % len;
				fadeOutFn(index);
				_setAutoFlag();
			}
			function _setAutoFlag(){
				autoFlag = setTimeout(function(){
					autoFadeFn('next')
				}, options.fadeRange);
			}
			function fadeOutFn(index){
				$fadeDots.removeClass(options.fadeCurClass).eq(index).addClass(options.fadeCurClass);
				$fadeCon.hide().eq(index).fadeIn(options.fadeTime);
			}
			return {
				fadeOutFn : fadeOutFn
			}
		},
		slideImage : function(options){
			//default
			var defaults = {
				slideEl : 'slide-li',
				slideElMg : 10,
				slideBtn : 'slide-arr',
				slideTime : 1000,
				slideRange : 7000,
				slideNum : 5,
				autoSlide : true,
				afterCallback: function () {},
				beforeCallback: function () {}
			};
			var inter, enable = true;
			var options = $.extend(defaults, options),
				$slideWrap = $(this),
				$slideEls = $slideWrap.find(options.slideEl),
				$slideList = $slideEls.parent(),
				slideWrapWidth = $slideWrap.width(),
				slideElWidth = $slideEls.width() + options.slideElMg,
				slideStep = options.slideNum * slideElWidth,
				$slideBtn = $slideWrap.find(options.slideBtn);
			
			$slideBtn.on('click', function(){
				if(!enable) return;
				if($(this).hasClass('next'))
					_slideToLeft();
				else
					_slideToRight();
			});
			$(document).ready(function(){
				$slideList.css({width : ($slideEls.length + options.slideNum) * slideElWidth, left : 0});
				_setAutoSlide();
			});
			$slideWrap.on('mouseenter', function(){//检测鼠标移入移出
				clearTimeout(inter);
			}).on('mouseleave', function(){
				_setAutoSlide();
			});
			function _setAutoSlide(){//自动滚动
				clearTimeout(inter);
				if(options.autoSlide){
					inter = setTimeout(function(){
						_slideToLeft();
						_setAutoSlide();
					}, options.slideRange);
				}
			}
			function _slideToLeft(){
				options.afterCallback.call($slideWrap);
				enable = false;
				var elClones = $slideWrap.find(options.slideEl).slice(0, options.slideNum);
				$slideList.append(elClones.clone());
				$slideList.animate({left : '-=' + slideStep}, options.slideTime, function(){
					elClones.remove();
					$slideList.css({ left : '+=' + slideStep});
					enable = true;
				});
				options.beforeCallback.call($slideWrap);
			}
			function _slideToRight(){
				options.afterCallback.call($slideWrap);
				enable = false;
				var elClones = $slideWrap.find(options.slideEl).slice('-' + options.slideNum);
				$slideList.prepend(elClones.clone());
				$slideList.css({left : '-=' + slideStep});
				$slideList.animate({left : '+=' + slideStep}, options.slideTime, function(){
					elClones.remove();
					enable = true;
				});
				options.beforeCallback.call($slideWrap);
			}			
		},
		rollText : function(options){//列表文字自动上滚
			var defaults = {
				rollList : 'ul',
				rollEls : 'li',
				rollNum : 1,
				rollTime : 1000,
				rollRange : 3000,
				autoRoll : true
			};
			var options = $.extend(defaults, options);
			var $rollWrap = $(this),
				$rollList = $rollWrap.find(options.rollList),
				autoInter;
			$rollWrap.on('mouseenter', function(){
				_clearAutoRoll();
			}).on('mouseleave', function(){
				_setAutoRoll();
			})
			$(document).ready(function(){
				_setAutoRoll();
			});
			function _setAutoRoll(){
				if(options.autoRoll){
					autoInter = setTimeout(function(){
						$rollList.each(function(){
							var $wrap = $(this);
							var $origs = $wrap.find(options.rollEls).slice(0, options.rollNum);
							$wrap.append($origs.clone());
							$origs.slideUp(options.rollTime, function(){
								$origs.remove();
							});
						});
						 _setAutoRoll();
					}, options.rollRange);
				}				
			}
			function _clearAutoRoll(){
				clearTimeout(autoInter);
			}
		},
		autoRoll : function(options){
			var defaults = {
				rollTitle : '.channel-wrap a',
				rollEls : '.juhe-con-wrap',
				rollConTime : 10000
			};

			var options = $.extend(defaults, options);
			var $rollWrap = $(this),
				$rollTitle = $rollWrap.find(options.rollTitle);
				$rollEls = $rollWrap.find(options.rollEls);
				$rollEleLength = $rollWrap.find(options.rollEls).length;
				$rollConTime = options.rollConTime;

			$(document).ready(function(){
				_autoContentRoll();
			});

			function bigImgIndex() {
				$rollEls.each(function(i, el) {
				  if ($(el).is(':visible')) {
				    bigIndex = i;
				  }
				});
				return bigIndex;
			}

			function _autoContentRoll(){	

				function slideRoll(){ 
					var conIndex = bigImgIndex();
					if ( conIndex == ($rollEleLength-1) ) {
						conIndex = -1;
					} 

					$rollTitle.eq(conIndex).removeClass('cur');
					$rollTitle.eq(conIndex + 1).addClass('cur');

					$rollEls.eq(conIndex).hide();
					$rollEls.eq(conIndex + 1).show();
				} 
				slideAction = setInterval(slideRoll, $rollConTime);
			} 

			$rollTitle.mouseover(function(){
					clearInterval(slideAction); 
					var conIndex = bigImgIndex();
					$rollTitle.removeClass('cur').eq($(this).index()).addClass('cur');
					$rollEls.hide().eq($(this).index()).fadeIn(300);
				}).mouseout(function(){
				   _autoContentRoll()
			});
		}

	});
})(jQuery);



//切换插件 2014-08-28
(function($){
	$.fn.extend({
		fadeSlide : function(options){
			var defaults = {
				fadeBtn : '.arr',//切换按钮
				fadeDots : '.fadeDots',//切换圆点序列（如有）
				fadeCon : '.fadeCon',//切换内容容器
				fadeCurClass : 'cur',//圆点选中类名
				dotsEvent : 'click',//圆点触发事件
				fadeTime : 300,//切换动画时长
				fadeRange : 15000,//切换间隔
				autoFade : false//自动切换
			}
			var options = $.extend(defaults, options),
				$fadeWrap = this,
				$fadeBtn = $fadeWrap.find(options.fadeBtn),
				$fadeDots = $fadeWrap.find(options.fadeDots),
				$fadeCon = $fadeWrap.find(options.fadeCon),
				len = $fadeCon.length,
				autoFlag = null;
			$fadeDots.on(options.dotsEvent, function(){				
				if(!$(this).hasClass(options.fadeCurClass))
					fadeOutFn($(this).index());
			});
			$fadeBtn.on('click', function(){
				var index = ($fadeWrap.find($('.' + options.fadeCurClass)).index() + (($(this).hasClass('next')) ? 1 : (-1))) % len;
				fadeOutFn(index);
			})
			$fadeWrap.on('mouseenter', function(){
				clearTimeout(autoFlag);
			}).on('mouseleave', function(){
				var $that = $(this);
				(!options.autoFade) || _setAutoFlag();
			})
			$(document).ready(function(){
				var $that = $(this);
				(!options.autoFade) || _setAutoFlag();
			});
			function autoFadeFn(direct){
				clearTimeout(autoFlag);
				var direct = direct || 'next', index = ($fadeWrap.find($('.' + options.fadeCurClass)).index() + ((direct == 'next') ? 1 : (-1))) % len;
				fadeOutFn(index);
				_setAutoFlag();
			}
			function _setAutoFlag(){
				autoFlag = setTimeout(function(){
					autoFadeFn('next')
				}, options.fadeRange);
			}
			function fadeOutFn(index){
				$fadeDots.removeClass(options.fadeCurClass).eq(index).addClass(options.fadeCurClass);
				$fadeCon.hide().eq(index).fadeIn(options.fadeTime);
			}
			return {
				fadeOutFn : fadeOutFn
			}
		},
		slideImage : function(options){
			//default
			var defaults = {
				slideEl : 'slide-li',
				slideElMg : 10,
				slideBtn : 'slide-arr',
				slideTime : 1000,
				slideRange : 7000,
				slideNum : 5,
				autoSlide : true,
				afterCallback: function () {},
				beforeCallback: function () {}
			};
			var inter, enable = true;
			var options = $.extend(defaults, options),
				$slideWrap = $(this),
				$slideEls = $slideWrap.find(options.slideEl),
				$slideList = $slideEls.parent(),
				slideWrapWidth = $slideWrap.width(),
				slideElWidth = $slideEls.width() + options.slideElMg,
				slideStep = options.slideNum * slideElWidth,
				$slideBtn = $slideWrap.find(options.slideBtn);
			
			$slideBtn.on('click', function(){
				if(!enable) return;
				if($(this).hasClass('next'))
					_slideToLeft();
				else
					_slideToRight();
			});
			$(document).ready(function(){
				$slideList.css({width : ($slideEls.length + options.slideNum) * slideElWidth, left : 0});
				_setAutoSlide();
			});
			$slideWrap.on('mouseenter', function(){//检测鼠标移入移出
				clearTimeout(inter);
			}).on('mouseleave', function(){
				_setAutoSlide();
			});
			function _setAutoSlide(){//自动滚动
				clearTimeout(inter);
				if(options.autoSlide){
					inter = setTimeout(function(){
						_slideToLeft();
						_setAutoSlide();
					}, options.slideRange);
				}
			}
			function _slideToLeft(){
				options.afterCallback.call($slideWrap);
				enable = false;
				var elClones = $slideWrap.find(options.slideEl).slice(0, options.slideNum);
				$slideList.append(elClones.clone());
				$slideList.animate({left : '-=' + slideStep}, options.slideTime, function(){
					elClones.remove();
					$slideList.css({ left : '+=' + slideStep});
					enable = true;
				});
				options.beforeCallback.call($slideWrap);
			}
			function _slideToRight(){
				options.afterCallback.call($slideWrap);
				enable = false;
				var elClones = $slideWrap.find(options.slideEl).slice('-' + options.slideNum);
				$slideList.prepend(elClones.clone());
				$slideList.css({left : '-=' + slideStep});
				$slideList.animate({left : '+=' + slideStep}, options.slideTime, function(){
					elClones.remove();
					enable = true;
				});
				options.beforeCallback.call($slideWrap);
			}			
		},
		rollText : function(options){//列表文字自动上滚
			var defaults = {
				rollList : 'ul',
				rollEls : 'li',
				rollNum : 1,
				rollTime : 1000,
				rollRange : 3000,
				autoRoll : true
			};
			var options = $.extend(defaults, options);
			var $rollWrap = $(this),
				$rollList = $rollWrap.find(options.rollList),
				autoInter;
			$rollWrap.on('mouseenter', function(){
				_clearAutoRoll();
			}).on('mouseleave', function(){
				_setAutoRoll();
			})
			$(document).ready(function(){
				_setAutoRoll();
			});
			function _setAutoRoll(){
				if(options.autoRoll){
					autoInter = setTimeout(function(){
						$rollList.each(function(){
							var $wrap = $(this);
							var $origs = $wrap.find(options.rollEls).slice(0, options.rollNum);
							$wrap.append($origs.clone());
							$origs.slideUp(options.rollTime, function(){
								$origs.remove();
							});
						});
						 _setAutoRoll();
					}, options.rollRange);
				}				
			}
			function _clearAutoRoll(){
				clearTimeout(autoInter);
			}
		},
		autoRoll : function(options){
			var defaults = {
				rollTitle : '.channel-wrap a',
				rollEls : '.juhe-con-wrap',
				rollConTime : 10000
			};

			var options = $.extend(defaults, options);
			var $rollWrap = $(this),
				$rollTitle = $rollWrap.find(options.rollTitle);
				$rollEls = $rollWrap.find(options.rollEls);
				$rollEleLength = $rollWrap.find(options.rollEls).length;
				$rollConTime = options.rollConTime;

			$(document).ready(function(){
				_autoContentRoll();
			});

			function bigImgIndex() {
				$rollEls.each(function(i, el) {
				  if ($(el).is(':visible')) {
				    bigIndex = i;
				  }
				});
				return bigIndex;
			}

			function _autoContentRoll(){	

				function slideRoll(){ 
					var conIndex = bigImgIndex();
					if ( conIndex == ($rollEleLength-1) ) {
						conIndex = -1;
					} 

					$rollTitle.eq(conIndex).removeClass('cur');
					$rollTitle.eq(conIndex + 1).addClass('cur');

					$rollEls.eq(conIndex).hide();
					$rollEls.eq(conIndex + 1).show();
				} 
				slideAction = setInterval(slideRoll, $rollConTime);
			} 

			$rollTitle.mouseover(function(){
					clearInterval(slideAction); 
					var conIndex = bigImgIndex();
					$rollTitle.removeClass('cur').eq($(this).index()).addClass('cur');
					$rollEls.hide().eq($(this).index()).fadeIn(300);
				}).mouseout(function(){
				   _autoContentRoll()
			});
		}

	});
})(jQuery);



//切换插件 2014-08-28
(function($){
	$.fn.extend({
		fadeSlide : function(options){
			var defaults = {
				fadeBtn : '.arr',//切换按钮
				fadeDots : '.fadeDots',//切换圆点序列（如有）
				fadeCon : '.fadeCon',//切换内容容器
				fadeCurClass : 'cur',//圆点选中类名
				dotsEvent : 'click',//圆点触发事件
				fadeTime : 300,//切换动画时长
				fadeRange : 15000,//切换间隔
				autoFade : false//自动切换
			}
			var options = $.extend(defaults, options),
				$fadeWrap = this,
				$fadeBtn = $fadeWrap.find(options.fadeBtn),
				$fadeDots = $fadeWrap.find(options.fadeDots),
				$fadeCon = $fadeWrap.find(options.fadeCon),
				len = $fadeCon.length,
				autoFlag = null;
			$fadeDots.on(options.dotsEvent, function(){				
				if(!$(this).hasClass(options.fadeCurClass))
					fadeOutFn($(this).index());
			});
			$fadeBtn.on('click', function(){
				var index = ($fadeWrap.find($('.' + options.fadeCurClass)).index() + (($(this).hasClass('next')) ? 1 : (-1))) % len;
				fadeOutFn(index);
			})
			$fadeWrap.on('mouseenter', function(){
				clearTimeout(autoFlag);
			}).on('mouseleave', function(){
				var $that = $(this);
				(!options.autoFade) || _setAutoFlag();
			})
			$(document).ready(function(){
				var $that = $(this);
				(!options.autoFade) || _setAutoFlag();
			});
			function autoFadeFn(direct){
				clearTimeout(autoFlag);
				var direct = direct || 'next', index = ($fadeWrap.find($('.' + options.fadeCurClass)).index() + ((direct == 'next') ? 1 : (-1))) % len;
				fadeOutFn(index);
				_setAutoFlag();
			}
			function _setAutoFlag(){
				autoFlag = setTimeout(function(){
					autoFadeFn('next')
				}, options.fadeRange);
			}
			function fadeOutFn(index){
				$fadeDots.removeClass(options.fadeCurClass).eq(index).addClass(options.fadeCurClass);
				$fadeCon.hide().eq(index).fadeIn(options.fadeTime);
			}
			return {
				fadeOutFn : fadeOutFn
			}
		},
		slideImage : function(options){
			//default
			var defaults = {
				slideEl : 'slide-li',
				slideElMg : 10,
				slideBtn : 'slide-arr',
				slideTime : 1000,
				slideRange : 7000,
				slideNum : 5,
				autoSlide : true,
				afterCallback: function () {},
				beforeCallback: function () {}
			};
			var inter, enable = true;
			var options = $.extend(defaults, options),
				$slideWrap = $(this),
				$slideEls = $slideWrap.find(options.slideEl),
				$slideList = $slideEls.parent(),
				slideWrapWidth = $slideWrap.width(),
				slideElWidth = $slideEls.width() + options.slideElMg,
				slideStep = options.slideNum * slideElWidth,
				$slideBtn = $slideWrap.find(options.slideBtn);
			
			$slideBtn.on('click', function(){
				if(!enable) return;
				if($(this).hasClass('next'))
					_slideToLeft();
				else
					_slideToRight();
			});
			$(document).ready(function(){
				$slideList.css({width : ($slideEls.length + options.slideNum) * slideElWidth, left : 0});
				_setAutoSlide();
			});
			$slideWrap.on('mouseenter', function(){//检测鼠标移入移出
				clearTimeout(inter);
			}).on('mouseleave', function(){
				_setAutoSlide();
			});
			function _setAutoSlide(){//自动滚动
				clearTimeout(inter);
				if(options.autoSlide){
					inter = setTimeout(function(){
						_slideToLeft();
						_setAutoSlide();
					}, options.slideRange);
				}
			}
			function _slideToLeft(){
				options.afterCallback.call($slideWrap);
				enable = false;
				var elClones = $slideWrap.find(options.slideEl).slice(0, options.slideNum);
				$slideList.append(elClones.clone());
				$slideList.animate({left : '-=' + slideStep}, options.slideTime, function(){
					elClones.remove();
					$slideList.css({ left : '+=' + slideStep});
					enable = true;
				});
				options.beforeCallback.call($slideWrap);
			}
			function _slideToRight(){
				options.afterCallback.call($slideWrap);
				enable = false;
				var elClones = $slideWrap.find(options.slideEl).slice('-' + options.slideNum);
				$slideList.prepend(elClones.clone());
				$slideList.css({left : '-=' + slideStep});
				$slideList.animate({left : '+=' + slideStep}, options.slideTime, function(){
					elClones.remove();
					enable = true;
				});
				options.beforeCallback.call($slideWrap);
			}			
		},
		rollText : function(options){//列表文字自动上滚
			var defaults = {
				rollList : 'ul',
				rollEls : 'li',
				rollNum : 1,
				rollTime : 1000,
				rollRange : 3000,
				autoRoll : true
			};
			var options = $.extend(defaults, options);
			var $rollWrap = $(this),
				$rollList = $rollWrap.find(options.rollList),
				autoInter;
			$rollWrap.on('mouseenter', function(){
				_clearAutoRoll();
			}).on('mouseleave', function(){
				_setAutoRoll();
			})
			$(document).ready(function(){
				_setAutoRoll();
			});
			function _setAutoRoll(){
				if(options.autoRoll){
					autoInter = setTimeout(function(){
						$rollList.each(function(){
							var $wrap = $(this);
							var $origs = $wrap.find(options.rollEls).slice(0, options.rollNum);
							$wrap.append($origs.clone());
							$origs.slideUp(options.rollTime, function(){
								$origs.remove();
							});
						});
						 _setAutoRoll();
					}, options.rollRange);
				}				
			}
			function _clearAutoRoll(){
				clearTimeout(autoInter);
			}
		},
		autoRoll : function(options){
			var defaults = {
				rollTitle : '.channel-wrap a',
				rollEls : '.juhe-con-wrap',
				rollConTime : 10000
			};

			var options = $.extend(defaults, options);
			var $rollWrap = $(this),
				$rollTitle = $rollWrap.find(options.rollTitle);
				$rollEls = $rollWrap.find(options.rollEls);
				$rollEleLength = $rollWrap.find(options.rollEls).length;
				$rollConTime = options.rollConTime;

			$(document).ready(function(){
				_autoContentRoll();
			});

			function bigImgIndex() {
				$rollEls.each(function(i, el) {
				  if ($(el).is(':visible')) {
				    bigIndex = i;
				  }
				});
				return bigIndex;
			}

			function _autoContentRoll(){	

				function slideRoll(){ 
					var conIndex = bigImgIndex();
					if ( conIndex == ($rollEleLength-1) ) {
						conIndex = -1;
					} 

					$rollTitle.eq(conIndex).removeClass('cur');
					$rollTitle.eq(conIndex + 1).addClass('cur');

					$rollEls.eq(conIndex).hide();
					$rollEls.eq(conIndex + 1).show();
				} 
				slideAction = setInterval(slideRoll, $rollConTime);
			} 

			$rollTitle.mouseover(function(){
					clearInterval(slideAction); 
					var conIndex = bigImgIndex();
					$rollTitle.removeClass('cur').eq($(this).index()).addClass('cur');
					$rollEls.hide().eq($(this).index()).fadeIn(300);
				}).mouseout(function(){
				   _autoContentRoll()
			});
		}

	});
})(jQuery);



//切换插件 2014-08-28
(function($){
	$.fn.extend({
		fadeSlide : function(options){
			var defaults = {
				fadeBtn : '.arr',//切换按钮
				fadeDots : '.fadeDots',//切换圆点序列（如有）
				fadeCon : '.fadeCon',//切换内容容器
				fadeCurClass : 'cur',//圆点选中类名
				dotsEvent : 'click',//圆点触发事件
				fadeTime : 300,//切换动画时长
				fadeRange : 15000,//切换间隔
				autoFade : false//自动切换
			}
			var options = $.extend(defaults, options),
				$fadeWrap = this,
				$fadeBtn = $fadeWrap.find(options.fadeBtn),
				$fadeDots = $fadeWrap.find(options.fadeDots),
				$fadeCon = $fadeWrap.find(options.fadeCon),
				len = $fadeCon.length,
				autoFlag = null;
			$fadeDots.on(options.dotsEvent, function(){				
				if(!$(this).hasClass(options.fadeCurClass))
					fadeOutFn($(this).index());
			});
			$fadeBtn.on('click', function(){
				var index = ($fadeWrap.find($('.' + options.fadeCurClass)).index() + (($(this).hasClass('next')) ? 1 : (-1))) % len;
				fadeOutFn(index);
			})
			$fadeWrap.on('mouseenter', function(){
				clearTimeout(autoFlag);
			}).on('mouseleave', function(){
				var $that = $(this);
				(!options.autoFade) || _setAutoFlag();
			})
			$(document).ready(function(){
				var $that = $(this);
				(!options.autoFade) || _setAutoFlag();
			});
			function autoFadeFn(direct){
				clearTimeout(autoFlag);
				var direct = direct || 'next', index = ($fadeWrap.find($('.' + options.fadeCurClass)).index() + ((direct == 'next') ? 1 : (-1))) % len;
				fadeOutFn(index);
				_setAutoFlag();
			}
			function _setAutoFlag(){
				autoFlag = setTimeout(function(){
					autoFadeFn('next')
				}, options.fadeRange);
			}
			function fadeOutFn(index){
				$fadeDots.removeClass(options.fadeCurClass).eq(index).addClass(options.fadeCurClass);
				$fadeCon.hide().eq(index).fadeIn(options.fadeTime);
			}
			return {
				fadeOutFn : fadeOutFn
			}
		},
		slideImage : function(options){
			//default
			var defaults = {
				slideEl : 'slide-li',
				slideElMg : 10,
				slideBtn : 'slide-arr',
				slideTime : 1000,
				slideRange : 7000,
				slideNum : 5,
				autoSlide : true,
				afterCallback: function () {},
				beforeCallback: function () {}
			};
			var inter, enable = true;
			var options = $.extend(defaults, options),
				$slideWrap = $(this),
				$slideEls = $slideWrap.find(options.slideEl),
				$slideList = $slideEls.parent(),
				slideWrapWidth = $slideWrap.width(),
				slideElWidth = $slideEls.width() + options.slideElMg,
				slideStep = options.slideNum * slideElWidth,
				$slideBtn = $slideWrap.find(options.slideBtn);
			
			$slideBtn.on('click', function(){
				if(!enable) return;
				if($(this).hasClass('next'))
					_slideToLeft();
				else
					_slideToRight();
			});
			$(document).ready(function(){
				$slideList.css({width : ($slideEls.length + options.slideNum) * slideElWidth, left : 0});
				_setAutoSlide();
			});
			$slideWrap.on('mouseenter', function(){//检测鼠标移入移出
				clearTimeout(inter);
			}).on('mouseleave', function(){
				_setAutoSlide();
			});
			function _setAutoSlide(){//自动滚动
				clearTimeout(inter);
				if(options.autoSlide){
					inter = setTimeout(function(){
						_slideToLeft();
						_setAutoSlide();
					}, options.slideRange);
				}
			}
			function _slideToLeft(){
				options.afterCallback.call($slideWrap);
				enable = false;
				var elClones = $slideWrap.find(options.slideEl).slice(0, options.slideNum);
				$slideList.append(elClones.clone());
				$slideList.animate({left : '-=' + slideStep}, options.slideTime, function(){
					elClones.remove();
					$slideList.css({ left : '+=' + slideStep});
					enable = true;
				});
				options.beforeCallback.call($slideWrap);
			}
			function _slideToRight(){
				options.afterCallback.call($slideWrap);
				enable = false;
				var elClones = $slideWrap.find(options.slideEl).slice('-' + options.slideNum);
				$slideList.prepend(elClones.clone());
				$slideList.css({left : '-=' + slideStep});
				$slideList.animate({left : '+=' + slideStep}, options.slideTime, function(){
					elClones.remove();
					enable = true;
				});
				options.beforeCallback.call($slideWrap);
			}			
		},
		rollText : function(options){//列表文字自动上滚
			var defaults = {
				rollList : 'ul',
				rollEls : 'li',
				rollNum : 1,
				rollTime : 1000,
				rollRange : 3000,
				autoRoll : true
			};
			var options = $.extend(defaults, options);
			var $rollWrap = $(this),
				$rollList = $rollWrap.find(options.rollList),
				autoInter;
			$rollWrap.on('mouseenter', function(){
				_clearAutoRoll();
			}).on('mouseleave', function(){
				_setAutoRoll();
			})
			$(document).ready(function(){
				_setAutoRoll();
			});
			function _setAutoRoll(){
				if(options.autoRoll){
					autoInter = setTimeout(function(){
						$rollList.each(function(){
							var $wrap = $(this);
							var $origs = $wrap.find(options.rollEls).slice(0, options.rollNum);
							$wrap.append($origs.clone());
							$origs.slideUp(options.rollTime, function(){
								$origs.remove();
							});
						});
						 _setAutoRoll();
					}, options.rollRange);
				}				
			}
			function _clearAutoRoll(){
				clearTimeout(autoInter);
			}
		},
		autoRoll : function(options){
			var defaults = {
				rollTitle : '.channel-wrap a',
				rollEls : '.juhe-con-wrap',
				rollConTime : 10000
			};

			var options = $.extend(defaults, options);
			var $rollWrap = $(this),
				$rollTitle = $rollWrap.find(options.rollTitle);
				$rollEls = $rollWrap.find(options.rollEls);
				$rollEleLength = $rollWrap.find(options.rollEls).length;
				$rollConTime = options.rollConTime;

			$(document).ready(function(){
				_autoContentRoll();
			});

			function bigImgIndex() {
				$rollEls.each(function(i, el) {
				  if ($(el).is(':visible')) {
				    bigIndex = i;
				  }
				});
				return bigIndex;
			}

			function _autoContentRoll(){	

				function slideRoll(){ 
					var conIndex = bigImgIndex();
					if ( conIndex == ($rollEleLength-1) ) {
						conIndex = -1;
					} 

					$rollTitle.eq(conIndex).removeClass('cur');
					$rollTitle.eq(conIndex + 1).addClass('cur');

					$rollEls.eq(conIndex).hide();
					$rollEls.eq(conIndex + 1).show();
				} 
				slideAction = setInterval(slideRoll, $rollConTime);
			} 

			$rollTitle.mouseover(function(){
					clearInterval(slideAction); 
					var conIndex = bigImgIndex();
					$rollTitle.removeClass('cur').eq($(this).index()).addClass('cur');
					$rollEls.hide().eq($(this).index()).fadeIn(300);
				}).mouseout(function(){
				   _autoContentRoll()
			});
		}

	});
})(jQuery);



//切换插件 2014-08-28
(function($){
	$.fn.extend({
		fadeSlide : function(options){
			var defaults = {
				fadeBtn : '.arr',//切换按钮
				fadeDots : '.fadeDots',//切换圆点序列（如有）
				fadeCon : '.fadeCon',//切换内容容器
				fadeCurClass : 'cur',//圆点选中类名
				dotsEvent : 'click',//圆点触发事件
				fadeTime : 300,//切换动画时长
				fadeRange : 15000,//切换间隔
				autoFade : false//自动切换
			}
			var options = $.extend(defaults, options),
				$fadeWrap = this,
				$fadeBtn = $fadeWrap.find(options.fadeBtn),
				$fadeDots = $fadeWrap.find(options.fadeDots),
				$fadeCon = $fadeWrap.find(options.fadeCon),
				len = $fadeCon.length,
				autoFlag = null;
			$fadeDots.on(options.dotsEvent, function(){				
				if(!$(this).hasClass(options.fadeCurClass))
					fadeOutFn($(this).index());
			});
			$fadeBtn.on('click', function(){
				var index = ($fadeWrap.find($('.' + options.fadeCurClass)).index() + (($(this).hasClass('next')) ? 1 : (-1))) % len;
				fadeOutFn(index);
			})
			$fadeWrap.on('mouseenter', function(){
				clearTimeout(autoFlag);
			}).on('mouseleave', function(){
				var $that = $(this);
				(!options.autoFade) || _setAutoFlag();
			})
			$(document).ready(function(){
				var $that = $(this);
				(!options.autoFade) || _setAutoFlag();
			});
			function autoFadeFn(direct){
				clearTimeout(autoFlag);
				var direct = direct || 'next', index = ($fadeWrap.find($('.' + options.fadeCurClass)).index() + ((direct == 'next') ? 1 : (-1))) % len;
				fadeOutFn(index);
				_setAutoFlag();
			}
			function _setAutoFlag(){
				autoFlag = setTimeout(function(){
					autoFadeFn('next')
				}, options.fadeRange);
			}
			function fadeOutFn(index){
				$fadeDots.removeClass(options.fadeCurClass).eq(index).addClass(options.fadeCurClass);
				$fadeCon.hide().eq(index).fadeIn(options.fadeTime);
			}
			return {
				fadeOutFn : fadeOutFn
			}
		},
		slideImage : function(options){
			//default
			var defaults = {
				slideEl : 'slide-li',
				slideElMg : 10,
				slideBtn : 'slide-arr',
				slideTime : 1000,
				slideRange : 7000,
				slideNum : 5,
				autoSlide : true,
				afterCallback: function () {},
				beforeCallback: function () {}
			};
			var inter, enable = true;
			var options = $.extend(defaults, options),
				$slideWrap = $(this),
				$slideEls = $slideWrap.find(options.slideEl),
				$slideList = $slideEls.parent(),
				slideWrapWidth = $slideWrap.width(),
				slideElWidth = $slideEls.width() + options.slideElMg,
				slideStep = options.slideNum * slideElWidth,
				$slideBtn = $slideWrap.find(options.slideBtn);
			
			$slideBtn.on('click', function(){
				if(!enable) return;
				if($(this).hasClass('next'))
					_slideToLeft();
				else
					_slideToRight();
			});
			$(document).ready(function(){
				$slideList.css({width : ($slideEls.length + options.slideNum) * slideElWidth, left : 0});
				_setAutoSlide();
			});
			$slideWrap.on('mouseenter', function(){//检测鼠标移入移出
				clearTimeout(inter);
			}).on('mouseleave', function(){
				_setAutoSlide();
			});
			function _setAutoSlide(){//自动滚动
				clearTimeout(inter);
				if(options.autoSlide){
					inter = setTimeout(function(){
						_slideToLeft();
						_setAutoSlide();
					}, options.slideRange);
				}
			}
			function _slideToLeft(){
				options.afterCallback.call($slideWrap);
				enable = false;
				var elClones = $slideWrap.find(options.slideEl).slice(0, options.slideNum);
				$slideList.append(elClones.clone());
				$slideList.animate({left : '-=' + slideStep}, options.slideTime, function(){
					elClones.remove();
					$slideList.css({ left : '+=' + slideStep});
					enable = true;
				});
				options.beforeCallback.call($slideWrap);
			}
			function _slideToRight(){
				options.afterCallback.call($slideWrap);
				enable = false;
				var elClones = $slideWrap.find(options.slideEl).slice('-' + options.slideNum);
				$slideList.prepend(elClones.clone());
				$slideList.css({left : '-=' + slideStep});
				$slideList.animate({left : '+=' + slideStep}, options.slideTime, function(){
					elClones.remove();
					enable = true;
				});
				options.beforeCallback.call($slideWrap);
			}			
		},
		rollText : function(options){//列表文字自动上滚
			var defaults = {
				rollList : 'ul',
				rollEls : 'li',
				rollNum : 1,
				rollTime : 1000,
				rollRange : 3000,
				autoRoll : true
			};
			var options = $.extend(defaults, options);
			var $rollWrap = $(this),
				$rollList = $rollWrap.find(options.rollList),
				autoInter;
			$rollWrap.on('mouseenter', function(){
				_clearAutoRoll();
			}).on('mouseleave', function(){
				_setAutoRoll();
			})
			$(document).ready(function(){
				_setAutoRoll();
			});
			function _setAutoRoll(){
				if(options.autoRoll){
					autoInter = setTimeout(function(){
						$rollList.each(function(){
							var $wrap = $(this);
							var $origs = $wrap.find(options.rollEls).slice(0, options.rollNum);
							$wrap.append($origs.clone());
							$origs.slideUp(options.rollTime, function(){
								$origs.remove();
							});
						});
						 _setAutoRoll();
					}, options.rollRange);
				}				
			}
			function _clearAutoRoll(){
				clearTimeout(autoInter);
			}
		},
		autoRoll : function(options){
			var defaults = {
				rollTitle : '.channel-wrap a',
				rollEls : '.juhe-con-wrap',
				rollConTime : 10000
			};

			var options = $.extend(defaults, options);
			var $rollWrap = $(this),
				$rollTitle = $rollWrap.find(options.rollTitle);
				$rollEls = $rollWrap.find(options.rollEls);
				$rollEleLength = $rollWrap.find(options.rollEls).length;
				$rollConTime = options.rollConTime;

			$(document).ready(function(){
				_autoContentRoll();
			});

			function bigImgIndex() {
				$rollEls.each(function(i, el) {
				  if ($(el).is(':visible')) {
				    bigIndex = i;
				  }
				});
				return bigIndex;
			}

			function _autoContentRoll(){	

				function slideRoll(){ 
					var conIndex = bigImgIndex();
					if ( conIndex == ($rollEleLength-1) ) {
						conIndex = -1;
					} 

					$rollTitle.eq(conIndex).removeClass('cur');
					$rollTitle.eq(conIndex + 1).addClass('cur');

					$rollEls.eq(conIndex).hide();
					$rollEls.eq(conIndex + 1).show();
				} 
				slideAction = setInterval(slideRoll, $rollConTime);
			} 

			$rollTitle.mouseover(function(){
					clearInterval(slideAction); 
					var conIndex = bigImgIndex();
					$rollTitle.removeClass('cur').eq($(this).index()).addClass('cur');
					$rollEls.hide().eq($(this).index()).fadeIn(300);
				}).mouseout(function(){
				   _autoContentRoll()
			});
		}

	});
})(jQuery);



//切换插件 2014-08-28
(function($){
	$.fn.extend({
		fadeSlide : function(options){
			var defaults = {
				fadeBtn : '.arr',//切换按钮
				fadeDots : '.fadeDots',//切换圆点序列（如有）
				fadeCon : '.fadeCon',//切换内容容器
				fadeCurClass : 'cur',//圆点选中类名
				dotsEvent : 'click',//圆点触发事件
				fadeTime : 300,//切换动画时长
				fadeRange : 15000,//切换间隔
				autoFade : false//自动切换
			}
			var options = $.extend(defaults, options),
				$fadeWrap = this,
				$fadeBtn = $fadeWrap.find(options.fadeBtn),
				$fadeDots = $fadeWrap.find(options.fadeDots),
				$fadeCon = $fadeWrap.find(options.fadeCon),
				len = $fadeCon.length,
				autoFlag = null;
			$fadeDots.on(options.dotsEvent, function(){				
				if(!$(this).hasClass(options.fadeCurClass))
					fadeOutFn($(this).index());
			});
			$fadeBtn.on('click', function(){
				var index = ($fadeWrap.find($('.' + options.fadeCurClass)).index() + (($(this).hasClass('next')) ? 1 : (-1))) % len;
				fadeOutFn(index);
			})
			$fadeWrap.on('mouseenter', function(){
				clearTimeout(autoFlag);
			}).on('mouseleave', function(){
				var $that = $(this);
				(!options.autoFade) || _setAutoFlag();
			})
			$(document).ready(function(){
				var $that = $(this);
				(!options.autoFade) || _setAutoFlag();
			});
			function autoFadeFn(direct){
				clearTimeout(autoFlag);
				var direct = direct || 'next', index = ($fadeWrap.find($('.' + options.fadeCurClass)).index() + ((direct == 'next') ? 1 : (-1))) % len;
				fadeOutFn(index);
				_setAutoFlag();
			}
			function _setAutoFlag(){
				autoFlag = setTimeout(function(){
					autoFadeFn('next')
				}, options.fadeRange);
			}
			function fadeOutFn(index){
				$fadeDots.removeClass(options.fadeCurClass).eq(index).addClass(options.fadeCurClass);
				$fadeCon.hide().eq(index).fadeIn(options.fadeTime);
			}
			return {
				fadeOutFn : fadeOutFn
			}
		},
		slideImage : function(options){
			//default
			var defaults = {
				slideEl : 'slide-li',
				slideElMg : 10,
				slideBtn : 'slide-arr',
				slideTime : 1000,
				slideRange : 7000,
				slideNum : 5,
				autoSlide : true,
				afterCallback: function () {},
				beforeCallback: function () {}
			};
			var inter, enable = true;
			var options = $.extend(defaults, options),
				$slideWrap = $(this),
				$slideEls = $slideWrap.find(options.slideEl),
				$slideList = $slideEls.parent(),
				slideWrapWidth = $slideWrap.width(),
				slideElWidth = $slideEls.width() + options.slideElMg,
				slideStep = options.slideNum * slideElWidth,
				$slideBtn = $slideWrap.find(options.slideBtn);
			
			$slideBtn.on('click', function(){
				if(!enable) return;
				if($(this).hasClass('next'))
					_slideToLeft();
				else
					_slideToRight();
			});
			$(document).ready(function(){
				$slideList.css({width : ($slideEls.length + options.slideNum) * slideElWidth, left : 0});
				_setAutoSlide();
			});
			$slideWrap.on('mouseenter', function(){//检测鼠标移入移出
				clearTimeout(inter);
			}).on('mouseleave', function(){
				_setAutoSlide();
			});
			function _setAutoSlide(){//自动滚动
				clearTimeout(inter);
				if(options.autoSlide){
					inter = setTimeout(function(){
						_slideToLeft();
						_setAutoSlide();
					}, options.slideRange);
				}
			}
			function _slideToLeft(){
				options.afterCallback.call($slideWrap);
				enable = false;
				var elClones = $slideWrap.find(options.slideEl).slice(0, options.slideNum);
				$slideList.append(elClones.clone());
				$slideList.animate({left : '-=' + slideStep}, options.slideTime, function(){
					elClones.remove();
					$slideList.css({ left : '+=' + slideStep});
					enable = true;
				});
				options.beforeCallback.call($slideWrap);
			}
			function _slideToRight(){
				options.afterCallback.call($slideWrap);
				enable = false;
				var elClones = $slideWrap.find(options.slideEl).slice('-' + options.slideNum);
				$slideList.prepend(elClones.clone());
				$slideList.css({left : '-=' + slideStep});
				$slideList.animate({left : '+=' + slideStep}, options.slideTime, function(){
					elClones.remove();
					enable = true;
				});
				options.beforeCallback.call($slideWrap);
			}			
		},
		rollText : function(options){//列表文字自动上滚
			var defaults = {
				rollList : 'ul',
				rollEls : 'li',
				rollNum : 1,
				rollTime : 1000,
				rollRange : 3000,
				autoRoll : true
			};
			var options = $.extend(defaults, options);
			var $rollWrap = $(this),
				$rollList = $rollWrap.find(options.rollList),
				autoInter;
			$rollWrap.on('mouseenter', function(){
				_clearAutoRoll();
			}).on('mouseleave', function(){
				_setAutoRoll();
			})
			$(document).ready(function(){
				_setAutoRoll();
			});
			function _setAutoRoll(){
				if(options.autoRoll){
					autoInter = setTimeout(function(){
						$rollList.each(function(){
							var $wrap = $(this);
							var $origs = $wrap.find(options.rollEls).slice(0, options.rollNum);
							$wrap.append($origs.clone());
							$origs.slideUp(options.rollTime, function(){
								$origs.remove();
							});
						});
						 _setAutoRoll();
					}, options.rollRange);
				}				
			}
			function _clearAutoRoll(){
				clearTimeout(autoInter);
			}
		},
		autoRoll : function(options){
			var defaults = {
				rollTitle : '.channel-wrap a',
				rollEls : '.juhe-con-wrap',
				rollConTime : 10000
			};

			var options = $.extend(defaults, options);
			var $rollWrap = $(this),
				$rollTitle = $rollWrap.find(options.rollTitle);
				$rollEls = $rollWrap.find(options.rollEls);
				$rollEleLength = $rollWrap.find(options.rollEls).length;
				$rollConTime = options.rollConTime;

			$(document).ready(function(){
				_autoContentRoll();
			});

			function bigImgIndex() {
				$rollEls.each(function(i, el) {
				  if ($(el).is(':visible')) {
				    bigIndex = i;
				  }
				});
				return bigIndex;
			}

			function _autoContentRoll(){	

				function slideRoll(){ 
					var conIndex = bigImgIndex();
					if ( conIndex == ($rollEleLength-1) ) {
						conIndex = -1;
					} 

					$rollTitle.eq(conIndex).removeClass('cur');
					$rollTitle.eq(conIndex + 1).addClass('cur');

					$rollEls.eq(conIndex).hide();
					$rollEls.eq(conIndex + 1).show();
				} 
				slideAction = setInterval(slideRoll, $rollConTime);
			} 

			$rollTitle.mouseover(function(){
					clearInterval(slideAction); 
					var conIndex = bigImgIndex();
					$rollTitle.removeClass('cur').eq($(this).index()).addClass('cur');
					$rollEls.hide().eq($(this).index()).fadeIn(300);
				}).mouseout(function(){
				   _autoContentRoll()
			});
		}

	});
})(jQuery);



//切换插件 2014-08-28
(function($){
	$.fn.extend({
		fadeSlide : function(options){
			var defaults = {
				fadeBtn : '.arr',//切换按钮
				fadeDots : '.fadeDots',//切换圆点序列（如有）
				fadeCon : '.fadeCon',//切换内容容器
				fadeCurClass : 'cur',//圆点选中类名
				dotsEvent : 'click',//圆点触发事件
				fadeTime : 300,//切换动画时长
				fadeRange : 15000,//切换间隔
				autoFade : false//自动切换
			}
			var options = $.extend(defaults, options),
				$fadeWrap = this,
				$fadeBtn = $fadeWrap.find(options.fadeBtn),
				$fadeDots = $fadeWrap.find(options.fadeDots),
				$fadeCon = $fadeWrap.find(options.fadeCon),
				len = $fadeCon.length,
				autoFlag = null;
			$fadeDots.on(options.dotsEvent, function(){				
				if(!$(this).hasClass(options.fadeCurClass))
					fadeOutFn($(this).index());
			});
			$fadeBtn.on('click', function(){
				var index = ($fadeWrap.find($('.' + options.fadeCurClass)).index() + (($(this).hasClass('next')) ? 1 : (-1))) % len;
				fadeOutFn(index);
			})
			$fadeWrap.on('mouseenter', function(){
				clearTimeout(autoFlag);
			}).on('mouseleave', function(){
				var $that = $(this);
				(!options.autoFade) || _setAutoFlag();
			})
			$(document).ready(function(){
				var $that = $(this);
				(!options.autoFade) || _setAutoFlag();
			});
			function autoFadeFn(direct){
				clearTimeout(autoFlag);
				var direct = direct || 'next', index = ($fadeWrap.find($('.' + options.fadeCurClass)).index() + ((direct == 'next') ? 1 : (-1))) % len;
				fadeOutFn(index);
				_setAutoFlag();
			}
			function _setAutoFlag(){
				autoFlag = setTimeout(function(){
					autoFadeFn('next')
				}, options.fadeRange);
			}
			function fadeOutFn(index){
				$fadeDots.removeClass(options.fadeCurClass).eq(index).addClass(options.fadeCurClass);
				$fadeCon.hide().eq(index).fadeIn(options.fadeTime);
			}
			return {
				fadeOutFn : fadeOutFn
			}
		},
		slideImage : function(options){
			//default
			var defaults = {
				slideEl : 'slide-li',
				slideElMg : 10,
				slideBtn : 'slide-arr',
				slideTime : 1000,
				slideRange : 7000,
				slideNum : 5,
				autoSlide : true,
				afterCallback: function () {},
				beforeCallback: function () {}
			};
			var inter, enable = true;
			var options = $.extend(defaults, options),
				$slideWrap = $(this),
				$slideEls = $slideWrap.find(options.slideEl),
				$slideList = $slideEls.parent(),
				slideWrapWidth = $slideWrap.width(),
				slideElWidth = $slideEls.width() + options.slideElMg,
				slideStep = options.slideNum * slideElWidth,
				$slideBtn = $slideWrap.find(options.slideBtn);
			
			$slideBtn.on('click', function(){
				if(!enable) return;
				if($(this).hasClass('next'))
					_slideToLeft();
				else
					_slideToRight();
			});
			$(document).ready(function(){
				$slideList.css({width : ($slideEls.length + options.slideNum) * slideElWidth, left : 0});
				_setAutoSlide();
			});
			$slideWrap.on('mouseenter', function(){//检测鼠标移入移出
				clearTimeout(inter);
			}).on('mouseleave', function(){
				_setAutoSlide();
			});
			function _setAutoSlide(){//自动滚动
				clearTimeout(inter);
				if(options.autoSlide){
					inter = setTimeout(function(){
						_slideToLeft();
						_setAutoSlide();
					}, options.slideRange);
				}
			}
			function _slideToLeft(){
				options.afterCallback.call($slideWrap);
				enable = false;
				var elClones = $slideWrap.find(options.slideEl).slice(0, options.slideNum);
				$slideList.append(elClones.clone());
				$slideList.animate({left : '-=' + slideStep}, options.slideTime, function(){
					elClones.remove();
					$slideList.css({ left : '+=' + slideStep});
					enable = true;
				});
				options.beforeCallback.call($slideWrap);
			}
			function _slideToRight(){
				options.afterCallback.call($slideWrap);
				enable = false;
				var elClones = $slideWrap.find(options.slideEl).slice('-' + options.slideNum);
				$slideList.prepend(elClones.clone());
				$slideList.css({left : '-=' + slideStep});
				$slideList.animate({left : '+=' + slideStep}, options.slideTime, function(){
					elClones.remove();
					enable = true;
				});
				options.beforeCallback.call($slideWrap);
			}			
		},
		rollText : function(options){//列表文字自动上滚
			var defaults = {
				rollList : 'ul',
				rollEls : 'li',
				rollNum : 1,
				rollTime : 1000,
				rollRange : 3000,
				autoRoll : true
			};
			var options = $.extend(defaults, options);
			var $rollWrap = $(this),
				$rollList = $rollWrap.find(options.rollList),
				autoInter;
			$rollWrap.on('mouseenter', function(){
				_clearAutoRoll();
			}).on('mouseleave', function(){
				_setAutoRoll();
			})
			$(document).ready(function(){
				_setAutoRoll();
			});
			function _setAutoRoll(){
				if(options.autoRoll){
					autoInter = setTimeout(function(){
						$rollList.each(function(){
							var $wrap = $(this);
							var $origs = $wrap.find(options.rollEls).slice(0, options.rollNum);
							$wrap.append($origs.clone());
							$origs.slideUp(options.rollTime, function(){
								$origs.remove();
							});
						});
						 _setAutoRoll();
					}, options.rollRange);
				}				
			}
			function _clearAutoRoll(){
				clearTimeout(autoInter);
			}
		},
		autoRoll : function(options){
			var defaults = {
				rollTitle : '.channel-wrap a',
				rollEls : '.juhe-con-wrap',
				rollConTime : 10000
			};

			var options = $.extend(defaults, options);
			var $rollWrap = $(this),
				$rollTitle = $rollWrap.find(options.rollTitle);
				$rollEls = $rollWrap.find(options.rollEls);
				$rollEleLength = $rollWrap.find(options.rollEls).length;
				$rollConTime = options.rollConTime;

			$(document).ready(function(){
				_autoContentRoll();
			});

			function bigImgIndex() {
				$rollEls.each(function(i, el) {
				  if ($(el).is(':visible')) {
				    bigIndex = i;
				  }
				});
				return bigIndex;
			}

			function _autoContentRoll(){	

				function slideRoll(){ 
					var conIndex = bigImgIndex();
					if ( conIndex == ($rollEleLength-1) ) {
						conIndex = -1;
					} 

					$rollTitle.eq(conIndex).removeClass('cur');
					$rollTitle.eq(conIndex + 1).addClass('cur');

					$rollEls.eq(conIndex).hide();
					$rollEls.eq(conIndex + 1).show();
				} 
				slideAction = setInterval(slideRoll, $rollConTime);
			} 

			$rollTitle.mouseover(function(){
					clearInterval(slideAction); 
					var conIndex = bigImgIndex();
					$rollTitle.removeClass('cur').eq($(this).index()).addClass('cur');
					$rollEls.hide().eq($(this).index()).fadeIn(300);
				}).mouseout(function(){
				   _autoContentRoll()
			});
		}

	});
})(jQuery);



//切换插件 2014-08-28
(function($){
	$.fn.extend({
		fadeSlide : function(options){
			var defaults = {
				fadeBtn : '.arr',//切换按钮
				fadeDots : '.fadeDots',//切换圆点序列（如有）
				fadeCon : '.fadeCon',//切换内容容器
				fadeCurClass : 'cur',//圆点选中类名
				dotsEvent : 'click',//圆点触发事件
				fadeTime : 300,//切换动画时长
				fadeRange : 15000,//切换间隔
				autoFade : false//自动切换
			}
			var options = $.extend(defaults, options),
				$fadeWrap = this,
				$fadeBtn = $fadeWrap.find(options.fadeBtn),
				$fadeDots = $fadeWrap.find(options.fadeDots),
				$fadeCon = $fadeWrap.find(options.fadeCon),
				len = $fadeCon.length,
				autoFlag = null;
			$fadeDots.on(options.dotsEvent, function(){				
				if(!$(this).hasClass(options.fadeCurClass))
					fadeOutFn($(this).index());
			});
			$fadeBtn.on('click', function(){
				var index = ($fadeWrap.find($('.' + options.fadeCurClass)).index() + (($(this).hasClass('next')) ? 1 : (-1))) % len;
				fadeOutFn(index);
			})
			$fadeWrap.on('mouseenter', function(){
				clearTimeout(autoFlag);
			}).on('mouseleave', function(){
				var $that = $(this);
				(!options.autoFade) || _setAutoFlag();
			})
			$(document).ready(function(){
				var $that = $(this);
				(!options.autoFade) || _setAutoFlag();
			});
			function autoFadeFn(direct){
				clearTimeout(autoFlag);
				var direct = direct || 'next', index = ($fadeWrap.find($('.' + options.fadeCurClass)).index() + ((direct == 'next') ? 1 : (-1))) % len;
				fadeOutFn(index);
				_setAutoFlag();
			}
			function _setAutoFlag(){
				autoFlag = setTimeout(function(){
					autoFadeFn('next')
				}, options.fadeRange);
			}
			function fadeOutFn(index){
				$fadeDots.removeClass(options.fadeCurClass).eq(index).addClass(options.fadeCurClass);
				$fadeCon.hide().eq(index).fadeIn(options.fadeTime);
			}
			return {
				fadeOutFn : fadeOutFn
			}
		},
		slideImage : function(options){
			//default
			var defaults = {
				slideEl : 'slide-li',
				slideElMg : 10,
				slideBtn : 'slide-arr',
				slideTime : 1000,
				slideRange : 7000,
				slideNum : 5,
				autoSlide : true,
				afterCallback: function () {},
				beforeCallback: function () {}
			};
			var inter, enable = true;
			var options = $.extend(defaults, options),
				$slideWrap = $(this),
				$slideEls = $slideWrap.find(options.slideEl),
				$slideList = $slideEls.parent(),
				slideWrapWidth = $slideWrap.width(),
				slideElWidth = $slideEls.width() + options.slideElMg,
				slideStep = options.slideNum * slideElWidth,
				$slideBtn = $slideWrap.find(options.slideBtn);
			
			$slideBtn.on('click', function(){
				if(!enable) return;
				if($(this).hasClass('next'))
					_slideToLeft();
				else
					_slideToRight();
			});
			$(document).ready(function(){
				$slideList.css({width : ($slideEls.length + options.slideNum) * slideElWidth, left : 0});
				_setAutoSlide();
			});
			$slideWrap.on('mouseenter', function(){//检测鼠标移入移出
				clearTimeout(inter);
			}).on('mouseleave', function(){
				_setAutoSlide();
			});
			function _setAutoSlide(){//自动滚动
				clearTimeout(inter);
				if(options.autoSlide){
					inter = setTimeout(function(){
						_slideToLeft();
						_setAutoSlide();
					}, options.slideRange);
				}
			}
			function _slideToLeft(){
				options.afterCallback.call($slideWrap);
				enable = false;
				var elClones = $slideWrap.find(options.slideEl).slice(0, options.slideNum);
				$slideList.append(elClones.clone());
				$slideList.animate({left : '-=' + slideStep}, options.slideTime, function(){
					elClones.remove();
					$slideList.css({ left : '+=' + slideStep});
					enable = true;
				});
				options.beforeCallback.call($slideWrap);
			}
			function _slideToRight(){
				options.afterCallback.call($slideWrap);
				enable = false;
				var elClones = $slideWrap.find(options.slideEl).slice('-' + options.slideNum);
				$slideList.prepend(elClones.clone());
				$slideList.css({left : '-=' + slideStep});
				$slideList.animate({left : '+=' + slideStep}, options.slideTime, function(){
					elClones.remove();
					enable = true;
				});
				options.beforeCallback.call($slideWrap);
			}			
		},
		rollText : function(options){//列表文字自动上滚
			var defaults = {
				rollList : 'ul',
				rollEls : 'li',
				rollNum : 1,
				rollTime : 1000,
				rollRange : 3000,
				autoRoll : true
			};
			var options = $.extend(defaults, options);
			var $rollWrap = $(this),
				$rollList = $rollWrap.find(options.rollList),
				autoInter;
			$rollWrap.on('mouseenter', function(){
				_clearAutoRoll();
			}).on('mouseleave', function(){
				_setAutoRoll();
			})
			$(document).ready(function(){
				_setAutoRoll();
			});
			function _setAutoRoll(){
				if(options.autoRoll){
					autoInter = setTimeout(function(){
						$rollList.each(function(){
							var $wrap = $(this);
							var $origs = $wrap.find(options.rollEls).slice(0, options.rollNum);
							$wrap.append($origs.clone());
							$origs.slideUp(options.rollTime, function(){
								$origs.remove();
							});
						});
						 _setAutoRoll();
					}, options.rollRange);
				}				
			}
			function _clearAutoRoll(){
				clearTimeout(autoInter);
			}
		},
		autoRoll : function(options){
			var defaults = {
				rollTitle : '.channel-wrap a',
				rollEls : '.juhe-con-wrap',
				rollConTime : 10000
			};

			var options = $.extend(defaults, options);
			var $rollWrap = $(this),
				$rollTitle = $rollWrap.find(options.rollTitle);
				$rollEls = $rollWrap.find(options.rollEls);
				$rollEleLength = $rollWrap.find(options.rollEls).length;
				$rollConTime = options.rollConTime;

			$(document).ready(function(){
				_autoContentRoll();
			});

			function bigImgIndex() {
				$rollEls.each(function(i, el) {
				  if ($(el).is(':visible')) {
				    bigIndex = i;
				  }
				});
				return bigIndex;
			}

			function _autoContentRoll(){	

				function slideRoll(){ 
					var conIndex = bigImgIndex();
					if ( conIndex == ($rollEleLength-1) ) {
						conIndex = -1;
					} 

					$rollTitle.eq(conIndex).removeClass('cur');
					$rollTitle.eq(conIndex + 1).addClass('cur');

					$rollEls.eq(conIndex).hide();
					$rollEls.eq(conIndex + 1).show();
				} 
				slideAction = setInterval(slideRoll, $rollConTime);
			} 

			$rollTitle.mouseover(function(){
					clearInterval(slideAction); 
					var conIndex = bigImgIndex();
					$rollTitle.removeClass('cur').eq($(this).index()).addClass('cur');
					$rollEls.hide().eq($(this).index()).fadeIn(300);
				}).mouseout(function(){
				   _autoContentRoll()
			});
		}

	});
})(jQuery);



//切换插件 2014-08-28
(function($){
	$.fn.extend({
		fadeSlide : function(options){
			var defaults = {
				fadeBtn : '.arr',//切换按钮
				fadeDots : '.fadeDots',//切换圆点序列（如有）
				fadeCon : '.fadeCon',//切换内容容器
				fadeCurClass : 'cur',//圆点选中类名
				dotsEvent : 'click',//圆点触发事件
				fadeTime : 300,//切换动画时长
				fadeRange : 15000,//切换间隔
				autoFade : false//自动切换
			}
			var options = $.extend(defaults, options),
				$fadeWrap = this,
				$fadeBtn = $fadeWrap.find(options.fadeBtn),
				$fadeDots = $fadeWrap.find(options.fadeDots),
				$fadeCon = $fadeWrap.find(options.fadeCon),
				len = $fadeCon.length,
				autoFlag = null;
			$fadeDots.on(options.dotsEvent, function(){				
				if(!$(this).hasClass(options.fadeCurClass))
					fadeOutFn($(this).index());
			});
			$fadeBtn.on('click', function(){
				var index = ($fadeWrap.find($('.' + options.fadeCurClass)).index() + (($(this).hasClass('next')) ? 1 : (-1))) % len;
				fadeOutFn(index);
			})
			$fadeWrap.on('mouseenter', function(){
				clearTimeout(autoFlag);
			}).on('mouseleave', function(){
				var $that = $(this);
				(!options.autoFade) || _setAutoFlag();
			})
			$(document).ready(function(){
				var $that = $(this);
				(!options.autoFade) || _setAutoFlag();
			});
			function autoFadeFn(direct){
				clearTimeout(autoFlag);
				var direct = direct || 'next', index = ($fadeWrap.find($('.' + options.fadeCurClass)).index() + ((direct == 'next') ? 1 : (-1))) % len;
				fadeOutFn(index);
				_setAutoFlag();
			}
			function _setAutoFlag(){
				autoFlag = setTimeout(function(){
					autoFadeFn('next')
				}, options.fadeRange);
			}
			function fadeOutFn(index){
				$fadeDots.removeClass(options.fadeCurClass).eq(index).addClass(options.fadeCurClass);
				$fadeCon.hide().eq(index).fadeIn(options.fadeTime);
			}
			return {
				fadeOutFn : fadeOutFn
			}
		},
		slideImage : function(options){
			//default
			var defaults = {
				slideEl : 'slide-li',
				slideElMg : 10,
				slideBtn : 'slide-arr',
				slideTime : 1000,
				slideRange : 7000,
				slideNum : 5,
				autoSlide : true,
				afterCallback: function () {},
				beforeCallback: function () {}
			};
			var inter, enable = true;
			var options = $.extend(defaults, options),
				$slideWrap = $(this),
				$slideEls = $slideWrap.find(options.slideEl),
				$slideList = $slideEls.parent(),
				slideWrapWidth = $slideWrap.width(),
				slideElWidth = $slideEls.width() + options.slideElMg,
				slideStep = options.slideNum * slideElWidth,
				$slideBtn = $slideWrap.find(options.slideBtn);
			
			$slideBtn.on('click', function(){
				if(!enable) return;
				if($(this).hasClass('next'))
					_slideToLeft();
				else
					_slideToRight();
			});
			$(document).ready(function(){
				$slideList.css({width : ($slideEls.length + options.slideNum) * slideElWidth, left : 0});
				_setAutoSlide();
			});
			$slideWrap.on('mouseenter', function(){//检测鼠标移入移出
				clearTimeout(inter);
			}).on('mouseleave', function(){
				_setAutoSlide();
			});
			function _setAutoSlide(){//自动滚动
				clearTimeout(inter);
				if(options.autoSlide){
					inter = setTimeout(function(){
						_slideToLeft();
						_setAutoSlide();
					}, options.slideRange);
				}
			}
			function _slideToLeft(){
				options.afterCallback.call($slideWrap);
				enable = false;
				var elClones = $slideWrap.find(options.slideEl).slice(0, options.slideNum);
				$slideList.append(elClones.clone());
				$slideList.animate({left : '-=' + slideStep}, options.slideTime, function(){
					elClones.remove();
					$slideList.css({ left : '+=' + slideStep});
					enable = true;
				});
				options.beforeCallback.call($slideWrap);
			}
			function _slideToRight(){
				options.afterCallback.call($slideWrap);
				enable = false;
				var elClones = $slideWrap.find(options.slideEl).slice('-' + options.slideNum);
				$slideList.prepend(elClones.clone());
				$slideList.css({left : '-=' + slideStep});
				$slideList.animate({left : '+=' + slideStep}, options.slideTime, function(){
					elClones.remove();
					enable = true;
				});
				options.beforeCallback.call($slideWrap);
			}			
		},
		rollText : function(options){//列表文字自动上滚
			var defaults = {
				rollList : 'ul',
				rollEls : 'li',
				rollNum : 1,
				rollTime : 1000,
				rollRange : 3000,
				autoRoll : true
			};
			var options = $.extend(defaults, options);
			var $rollWrap = $(this),
				$rollList = $rollWrap.find(options.rollList),
				autoInter;
			$rollWrap.on('mouseenter', function(){
				_clearAutoRoll();
			}).on('mouseleave', function(){
				_setAutoRoll();
			})
			$(document).ready(function(){
				_setAutoRoll();
			});
			function _setAutoRoll(){
				if(options.autoRoll){
					autoInter = setTimeout(function(){
						$rollList.each(function(){
							var $wrap = $(this);
							var $origs = $wrap.find(options.rollEls).slice(0, options.rollNum);
							$wrap.append($origs.clone());
							$origs.slideUp(options.rollTime, function(){
								$origs.remove();
							});
						});
						 _setAutoRoll();
					}, options.rollRange);
				}				
			}
			function _clearAutoRoll(){
				clearTimeout(autoInter);
			}
		},
		autoRoll : function(options){
			var defaults = {
				rollTitle : '.channel-wrap a',
				rollEls : '.juhe-con-wrap',
				rollConTime : 10000
			};

			var options = $.extend(defaults, options);
			var $rollWrap = $(this),
				$rollTitle = $rollWrap.find(options.rollTitle);
				$rollEls = $rollWrap.find(options.rollEls);
				$rollEleLength = $rollWrap.find(options.rollEls).length;
				$rollConTime = options.rollConTime;

			$(document).ready(function(){
				_autoContentRoll();
			});

			function bigImgIndex() {
				$rollEls.each(function(i, el) {
				  if ($(el).is(':visible')) {
				    bigIndex = i;
				  }
				});
				return bigIndex;
			}

			function _autoContentRoll(){	

				function slideRoll(){ 
					var conIndex = bigImgIndex();
					if ( conIndex == ($rollEleLength-1) ) {
						conIndex = -1;
					} 

					$rollTitle.eq(conIndex).removeClass('cur');
					$rollTitle.eq(conIndex + 1).addClass('cur');

					$rollEls.eq(conIndex).hide();
					$rollEls.eq(conIndex + 1).show();
				} 
				slideAction = setInterval(slideRoll, $rollConTime);
			} 

			$rollTitle.mouseover(function(){
					clearInterval(slideAction); 
					var conIndex = bigImgIndex();
					$rollTitle.removeClass('cur').eq($(this).index()).addClass('cur');
					$rollEls.hide().eq($(this).index()).fadeIn(300);
				}).mouseout(function(){
				   _autoContentRoll()
			});
		}

	});
})(jQuery);



//切换插件 2014-08-28
(function($){
	$.fn.extend({
		fadeSlide : function(options){
			var defaults = {
				fadeBtn : '.arr',//切换按钮
				fadeDots : '.fadeDots',//切换圆点序列（如有）
				fadeCon : '.fadeCon',//切换内容容器
				fadeCurClass : 'cur',//圆点选中类名
				dotsEvent : 'click',//圆点触发事件
				fadeTime : 300,//切换动画时长
				fadeRange : 15000,//切换间隔
				autoFade : false//自动切换
			}
			var options = $.extend(defaults, options),
				$fadeWrap = this,
				$fadeBtn = $fadeWrap.find(options.fadeBtn),
				$fadeDots = $fadeWrap.find(options.fadeDots),
				$fadeCon = $fadeWrap.find(options.fadeCon),
				len = $fadeCon.length,
				autoFlag = null;
			$fadeDots.on(options.dotsEvent, function(){				
				if(!$(this).hasClass(options.fadeCurClass))
					fadeOutFn($(this).index());
			});
			$fadeBtn.on('click', function(){
				var index = ($fadeWrap.find($('.' + options.fadeCurClass)).index() + (($(this).hasClass('next')) ? 1 : (-1))) % len;
				fadeOutFn(index);
			})
			$fadeWrap.on('mouseenter', function(){
				clearTimeout(autoFlag);
			}).on('mouseleave', function(){
				var $that = $(this);
				(!options.autoFade) || _setAutoFlag();
			})
			$(document).ready(function(){
				var $that = $(this);
				(!options.autoFade) || _setAutoFlag();
			});
			function autoFadeFn(direct){
				clearTimeout(autoFlag);
				var direct = direct || 'next', index = ($fadeWrap.find($('.' + options.fadeCurClass)).index() + ((direct == 'next') ? 1 : (-1))) % len;
				fadeOutFn(index);
				_setAutoFlag();
			}
			function _setAutoFlag(){
				autoFlag = setTimeout(function(){
					autoFadeFn('next')
				}, options.fadeRange);
			}
			function fadeOutFn(index){
				$fadeDots.removeClass(options.fadeCurClass).eq(index).addClass(options.fadeCurClass);
				$fadeCon.hide().eq(index).fadeIn(options.fadeTime);
			}
			return {
				fadeOutFn : fadeOutFn
			}
		},
		slideImage : function(options){
			//default
			var defaults = {
				slideEl : 'slide-li',
				slideElMg : 10,
				slideBtn : 'slide-arr',
				slideTime : 1000,
				slideRange : 7000,
				slideNum : 5,
				autoSlide : true,
				afterCallback: function () {},
				beforeCallback: function () {}
			};
			var inter, enable = true;
			var options = $.extend(defaults, options),
				$slideWrap = $(this),
				$slideEls = $slideWrap.find(options.slideEl),
				$slideList = $slideEls.parent(),
				slideWrapWidth = $slideWrap.width(),
				slideElWidth = $slideEls.width() + options.slideElMg,
				slideStep = options.slideNum * slideElWidth,
				$slideBtn = $slideWrap.find(options.slideBtn);
			
			$slideBtn.on('click', function(){
				if(!enable) return;
				if($(this).hasClass('next'))
					_slideToLeft();
				else
					_slideToRight();
			});
			$(document).ready(function(){
				$slideList.css({width : ($slideEls.length + options.slideNum) * slideElWidth, left : 0});
				_setAutoSlide();
			});
			$slideWrap.on('mouseenter', function(){//检测鼠标移入移出
				clearTimeout(inter);
			}).on('mouseleave', function(){
				_setAutoSlide();
			});
			function _setAutoSlide(){//自动滚动
				clearTimeout(inter);
				if(options.autoSlide){
					inter = setTimeout(function(){
						_slideToLeft();
						_setAutoSlide();
					}, options.slideRange);
				}
			}
			function _slideToLeft(){
				options.afterCallback.call($slideWrap);
				enable = false;
				var elClones = $slideWrap.find(options.slideEl).slice(0, options.slideNum);
				$slideList.append(elClones.clone());
				$slideList.animate({left : '-=' + slideStep}, options.slideTime, function(){
					elClones.remove();
					$slideList.css({ left : '+=' + slideStep});
					enable = true;
				});
				options.beforeCallback.call($slideWrap);
			}
			function _slideToRight(){
				options.afterCallback.call($slideWrap);
				enable = false;
				var elClones = $slideWrap.find(options.slideEl).slice('-' + options.slideNum);
				$slideList.prepend(elClones.clone());
				$slideList.css({left : '-=' + slideStep});
				$slideList.animate({left : '+=' + slideStep}, options.slideTime, function(){
					elClones.remove();
					enable = true;
				});
				options.beforeCallback.call($slideWrap);
			}			
		},
		rollText : function(options){//列表文字自动上滚
			var defaults = {
				rollList : 'ul',
				rollEls : 'li',
				rollNum : 1,
				rollTime : 1000,
				rollRange : 3000,
				autoRoll : true
			};
			var options = $.extend(defaults, options);
			var $rollWrap = $(this),
				$rollList = $rollWrap.find(options.rollList),
				autoInter;
			$rollWrap.on('mouseenter', function(){
				_clearAutoRoll();
			}).on('mouseleave', function(){
				_setAutoRoll();
			})
			$(document).ready(function(){
				_setAutoRoll();
			});
			function _setAutoRoll(){
				if(options.autoRoll){
					autoInter = setTimeout(function(){
						$rollList.each(function(){
							var $wrap = $(this);
							var $origs = $wrap.find(options.rollEls).slice(0, options.rollNum);
							$wrap.append($origs.clone());
							$origs.slideUp(options.rollTime, function(){
								$origs.remove();
							});
						});
						 _setAutoRoll();
					}, options.rollRange);
				}				
			}
			function _clearAutoRoll(){
				clearTimeout(autoInter);
			}
		},
		autoRoll : function(options){
			var defaults = {
				rollTitle : '.channel-wrap a',
				rollEls : '.juhe-con-wrap',
				rollConTime : 10000
			};

			var options = $.extend(defaults, options);
			var $rollWrap = $(this),
				$rollTitle = $rollWrap.find(options.rollTitle);
				$rollEls = $rollWrap.find(options.rollEls);
				$rollEleLength = $rollWrap.find(options.rollEls).length;
				$rollConTime = options.rollConTime;

			$(document).ready(function(){
				_autoContentRoll();
			});

			function bigImgIndex() {
				$rollEls.each(function(i, el) {
				  if ($(el).is(':visible')) {
				    bigIndex = i;
				  }
				});
				return bigIndex;
			}

			function _autoContentRoll(){	

				function slideRoll(){ 
					var conIndex = bigImgIndex();
					if ( conIndex == ($rollEleLength-1) ) {
						conIndex = -1;
					} 

					$rollTitle.eq(conIndex).removeClass('cur');
					$rollTitle.eq(conIndex + 1).addClass('cur');

					$rollEls.eq(conIndex).hide();
					$rollEls.eq(conIndex + 1).show();
				} 
				slideAction = setInterval(slideRoll, $rollConTime);
			} 

			$rollTitle.mouseover(function(){
					clearInterval(slideAction); 
					var conIndex = bigImgIndex();
					$rollTitle.removeClass('cur').eq($(this).index()).addClass('cur');
					$rollEls.hide().eq($(this).index()).fadeIn(300);
				}).mouseout(function(){
				   _autoContentRoll()
			});
		}

	});
})(jQuery);



//切换插件 2014-08-28
(function($){
	$.fn.extend({
		fadeSlide : function(options){
			var defaults = {
				fadeBtn : '.arr',//切换按钮
				fadeDots : '.fadeDots',//切换圆点序列（如有）
				fadeCon : '.fadeCon',//切换内容容器
				fadeCurClass : 'cur',//圆点选中类名
				dotsEvent : 'click',//圆点触发事件
				fadeTime : 300,//切换动画时长
				fadeRange : 15000,//切换间隔
				autoFade : false//自动切换
			}
			var options = $.extend(defaults, options),
				$fadeWrap = this,
				$fadeBtn = $fadeWrap.find(options.fadeBtn),
				$fadeDots = $fadeWrap.find(options.fadeDots),
				$fadeCon = $fadeWrap.find(options.fadeCon),
				len = $fadeCon.length,
				autoFlag = null;
			$fadeDots.on(options.dotsEvent, function(){				
				if(!$(this).hasClass(options.fadeCurClass))
					fadeOutFn($(this).index());
			});
			$fadeBtn.on('click', function(){
				var index = ($fadeWrap.find($('.' + options.fadeCurClass)).index() + (($(this).hasClass('next')) ? 1 : (-1))) % len;
				fadeOutFn(index);
			})
			$fadeWrap.on('mouseenter', function(){
				clearTimeout(autoFlag);
			}).on('mouseleave', function(){
				var $that = $(this);
				(!options.autoFade) || _setAutoFlag();
			})
			$(document).ready(function(){
				var $that = $(this);
				(!options.autoFade) || _setAutoFlag();
			});
			function autoFadeFn(direct){
				clearTimeout(autoFlag);
				var direct = direct || 'next', index = ($fadeWrap.find($('.' + options.fadeCurClass)).index() + ((direct == 'next') ? 1 : (-1))) % len;
				fadeOutFn(index);
				_setAutoFlag();
			}
			function _setAutoFlag(){
				autoFlag = setTimeout(function(){
					autoFadeFn('next')
				}, options.fadeRange);
			}
			function fadeOutFn(index){
				$fadeDots.removeClass(options.fadeCurClass).eq(index).addClass(options.fadeCurClass);
				$fadeCon.hide().eq(index).fadeIn(options.fadeTime);
			}
			return {
				fadeOutFn : fadeOutFn
			}
		},
		slideImage : function(options){
			//default
			var defaults = {
				slideEl : 'slide-li',
				slideElMg : 10,
				slideBtn : 'slide-arr',
				slideTime : 1000,
				slideRange : 7000,
				slideNum : 5,
				autoSlide : true,
				afterCallback: function () {},
				beforeCallback: function () {}
			};
			var inter, enable = true;
			var options = $.extend(defaults, options),
				$slideWrap = $(this),
				$slideEls = $slideWrap.find(options.slideEl),
				$slideList = $slideEls.parent(),
				slideWrapWidth = $slideWrap.width(),
				slideElWidth = $slideEls.width() + options.slideElMg,
				slideStep = options.slideNum * slideElWidth,
				$slideBtn = $slideWrap.find(options.slideBtn);
			
			$slideBtn.on('click', function(){
				if(!enable) return;
				if($(this).hasClass('next'))
					_slideToLeft();
				else
					_slideToRight();
			});
			$(document).ready(function(){
				$slideList.css({width : ($slideEls.length + options.slideNum) * slideElWidth, left : 0});
				_setAutoSlide();
			});
			$slideWrap.on('mouseenter', function(){//检测鼠标移入移出
				clearTimeout(inter);
			}).on('mouseleave', function(){
				_setAutoSlide();
			});
			function _setAutoSlide(){//自动滚动
				clearTimeout(inter);
				if(options.autoSlide){
					inter = setTimeout(function(){
						_slideToLeft();
						_setAutoSlide();
					}, options.slideRange);
				}
			}
			function _slideToLeft(){
				options.afterCallback.call($slideWrap);
				enable = false;
				var elClones = $slideWrap.find(options.slideEl).slice(0, options.slideNum);
				$slideList.append(elClones.clone());
				$slideList.animate({left : '-=' + slideStep}, options.slideTime, function(){
					elClones.remove();
					$slideList.css({ left : '+=' + slideStep});
					enable = true;
				});
				options.beforeCallback.call($slideWrap);
			}
			function _slideToRight(){
				options.afterCallback.call($slideWrap);
				enable = false;
				var elClones = $slideWrap.find(options.slideEl).slice('-' + options.slideNum);
				$slideList.prepend(elClones.clone());
				$slideList.css({left : '-=' + slideStep});
				$slideList.animate({left : '+=' + slideStep}, options.slideTime, function(){
					elClones.remove();
					enable = true;
				});
				options.beforeCallback.call($slideWrap);
			}			
		},
		rollText : function(options){//列表文字自动上滚
			var defaults = {
				rollList : 'ul',
				rollEls : 'li',
				rollNum : 1,
				rollTime : 1000,
				rollRange : 3000,
				autoRoll : true
			};
			var options = $.extend(defaults, options);
			var $rollWrap = $(this),
				$rollList = $rollWrap.find(options.rollList),
				autoInter;
			$rollWrap.on('mouseenter', function(){
				_clearAutoRoll();
			}).on('mouseleave', function(){
				_setAutoRoll();
			})
			$(document).ready(function(){
				_setAutoRoll();
			});
			function _setAutoRoll(){
				if(options.autoRoll){
					autoInter = setTimeout(function(){
						$rollList.each(function(){
							var $wrap = $(this);
							var $origs = $wrap.find(options.rollEls).slice(0, options.rollNum);
							$wrap.append($origs.clone());
							$origs.slideUp(options.rollTime, function(){
								$origs.remove();
							});
						});
						 _setAutoRoll();
					}, options.rollRange);
				}				
			}
			function _clearAutoRoll(){
				clearTimeout(autoInter);
			}
		},
		autoRoll : function(options){
			var defaults = {
				rollTitle : '.channel-wrap a',
				rollEls : '.juhe-con-wrap',
				rollConTime : 10000
			};

			var options = $.extend(defaults, options);
			var $rollWrap = $(this),
				$rollTitle = $rollWrap.find(options.rollTitle);
				$rollEls = $rollWrap.find(options.rollEls);
				$rollEleLength = $rollWrap.find(options.rollEls).length;
				$rollConTime = options.rollConTime;

			$(document).ready(function(){
				_autoContentRoll();
			});

			function bigImgIndex() {
				$rollEls.each(function(i, el) {
				  if ($(el).is(':visible')) {
				    bigIndex = i;
				  }
				});
				return bigIndex;
			}

			function _autoContentRoll(){	

				function slideRoll(){ 
					var conIndex = bigImgIndex();
					if ( conIndex == ($rollEleLength-1) ) {
						conIndex = -1;
					} 

					$rollTitle.eq(conIndex).removeClass('cur');
					$rollTitle.eq(conIndex + 1).addClass('cur');

					$rollEls.eq(conIndex).hide();
					$rollEls.eq(conIndex + 1).show();
				} 
				slideAction = setInterval(slideRoll, $rollConTime);
			} 

			$rollTitle.mouseover(function(){
					clearInterval(slideAction); 
					var conIndex = bigImgIndex();
					$rollTitle.removeClass('cur').eq($(this).index()).addClass('cur');
					$rollEls.hide().eq($(this).index()).fadeIn(300);
				}).mouseout(function(){
				   _autoContentRoll()
			});
		}

	});
})(jQuery);



//切换插件 2014-08-28
(function($){
	$.fn.extend({
		fadeSlide : function(options){
			var defaults = {
				fadeBtn : '.arr',//切换按钮
				fadeDots : '.fadeDots',//切换圆点序列（如有）
				fadeCon : '.fadeCon',//切换内容容器
				fadeCurClass : 'cur',//圆点选中类名
				dotsEvent : 'click',//圆点触发事件
				fadeTime : 300,//切换动画时长
				fadeRange : 15000,//切换间隔
				autoFade : false//自动切换
			}
			var options = $.extend(defaults, options),
				$fadeWrap = this,
				$fadeBtn = $fadeWrap.find(options.fadeBtn),
				$fadeDots = $fadeWrap.find(options.fadeDots),
				$fadeCon = $fadeWrap.find(options.fadeCon),
				len = $fadeCon.length,
				autoFlag = null;
			$fadeDots.on(options.dotsEvent, function(){				
				if(!$(this).hasClass(options.fadeCurClass))
					fadeOutFn($(this).index());
			});
			$fadeBtn.on('click', function(){
				var index = ($fadeWrap.find($('.' + options.fadeCurClass)).index() + (($(this).hasClass('next')) ? 1 : (-1))) % len;
				fadeOutFn(index);
			})
			$fadeWrap.on('mouseenter', function(){
				clearTimeout(autoFlag);
			}).on('mouseleave', function(){
				var $that = $(this);
				(!options.autoFade) || _setAutoFlag();
			})
			$(document).ready(function(){
				var $that = $(this);
				(!options.autoFade) || _setAutoFlag();
			});
			function autoFadeFn(direct){
				clearTimeout(autoFlag);
				var direct = direct || 'next', index = ($fadeWrap.find($('.' + options.fadeCurClass)).index() + ((direct == 'next') ? 1 : (-1))) % len;
				fadeOutFn(index);
				_setAutoFlag();
			}
			function _setAutoFlag(){
				autoFlag = setTimeout(function(){
					autoFadeFn('next')
				}, options.fadeRange);
			}
			function fadeOutFn(index){
				$fadeDots.removeClass(options.fadeCurClass).eq(index).addClass(options.fadeCurClass);
				$fadeCon.hide().eq(index).fadeIn(options.fadeTime);
			}
			return {
				fadeOutFn : fadeOutFn
			}
		},
		slideImage : function(options){
			//default
			var defaults = {
				slideEl : 'slide-li',
				slideElMg : 10,
				slideBtn : 'slide-arr',
				slideTime : 1000,
				slideRange : 7000,
				slideNum : 5,
				autoSlide : true,
				afterCallback: function () {},
				beforeCallback: function () {}
			};
			var inter, enable = true;
			var options = $.extend(defaults, options),
				$slideWrap = $(this),
				$slideEls = $slideWrap.find(options.slideEl),
				$slideList = $slideEls.parent(),
				slideWrapWidth = $slideWrap.width(),
				slideElWidth = $slideEls.width() + options.slideElMg,
				slideStep = options.slideNum * slideElWidth,
				$slideBtn = $slideWrap.find(options.slideBtn);
			
			$slideBtn.on('click', function(){
				if(!enable) return;
				if($(this).hasClass('next'))
					_slideToLeft();
				else
					_slideToRight();
			});
			$(document).ready(function(){
				$slideList.css({width : ($slideEls.length + options.slideNum) * slideElWidth, left : 0});
				_setAutoSlide();
			});
			$slideWrap.on('mouseenter', function(){//检测鼠标移入移出
				clearTimeout(inter);
			}).on('mouseleave', function(){
				_setAutoSlide();
			});
			function _setAutoSlide(){//自动滚动
				clearTimeout(inter);
				if(options.autoSlide){
					inter = setTimeout(function(){
						_slideToLeft();
						_setAutoSlide();
					}, options.slideRange);
				}
			}
			function _slideToLeft(){
				options.afterCallback.call($slideWrap);
				enable = false;
				var elClones = $slideWrap.find(options.slideEl).slice(0, options.slideNum);
				$slideList.append(elClones.clone());
				$slideList.animate({left : '-=' + slideStep}, options.slideTime, function(){
					elClones.remove();
					$slideList.css({ left : '+=' + slideStep});
					enable = true;
				});
				options.beforeCallback.call($slideWrap);
			}
			function _slideToRight(){
				options.afterCallback.call($slideWrap);
				enable = false;
				var elClones = $slideWrap.find(options.slideEl).slice('-' + options.slideNum);
				$slideList.prepend(elClones.clone());
				$slideList.css({left : '-=' + slideStep});
				$slideList.animate({left : '+=' + slideStep}, options.slideTime, function(){
					elClones.remove();
					enable = true;
				});
				options.beforeCallback.call($slideWrap);
			}			
		},
		rollText : function(options){//列表文字自动上滚
			var defaults = {
				rollList : 'ul',
				rollEls : 'li',
				rollNum : 1,
				rollTime : 1000,
				rollRange : 3000,
				autoRoll : true
			};
			var options = $.extend(defaults, options);
			var $rollWrap = $(this),
				$rollList = $rollWrap.find(options.rollList),
				autoInter;
			$rollWrap.on('mouseenter', function(){
				_clearAutoRoll();
			}).on('mouseleave', function(){
				_setAutoRoll();
			})
			$(document).ready(function(){
				_setAutoRoll();
			});
			function _setAutoRoll(){
				if(options.autoRoll){
					autoInter = setTimeout(function(){
						$rollList.each(function(){
							var $wrap = $(this);
							var $origs = $wrap.find(options.rollEls).slice(0, options.rollNum);
							$wrap.append($origs.clone());
							$origs.slideUp(options.rollTime, function(){
								$origs.remove();
							});
						});
						 _setAutoRoll();
					}, options.rollRange);
				}				
			}
			function _clearAutoRoll(){
				clearTimeout(autoInter);
			}
		},
		autoRoll : function(options){
			var defaults = {
				rollTitle : '.channel-wrap a',
				rollEls : '.juhe-con-wrap',
				rollConTime : 10000
			};

			var options = $.extend(defaults, options);
			var $rollWrap = $(this),
				$rollTitle = $rollWrap.find(options.rollTitle);
				$rollEls = $rollWrap.find(options.rollEls);
				$rollEleLength = $rollWrap.find(options.rollEls).length;
				$rollConTime = options.rollConTime;

			$(document).ready(function(){
				_autoContentRoll();
			});

			function bigImgIndex() {
				$rollEls.each(function(i, el) {
				  if ($(el).is(':visible')) {
				    bigIndex = i;
				  }
				});
				return bigIndex;
			}

			function _autoContentRoll(){	

				function slideRoll(){ 
					var conIndex = bigImgIndex();
					if ( conIndex == ($rollEleLength-1) ) {
						conIndex = -1;
					} 

					$rollTitle.eq(conIndex).removeClass('cur');
					$rollTitle.eq(conIndex + 1).addClass('cur');

					$rollEls.eq(conIndex).hide();
					$rollEls.eq(conIndex + 1).show();
				} 
				slideAction = setInterval(slideRoll, $rollConTime);
			} 

			$rollTitle.mouseover(function(){
					clearInterval(slideAction); 
					var conIndex = bigImgIndex();
					$rollTitle.removeClass('cur').eq($(this).index()).addClass('cur');
					$rollEls.hide().eq($(this).index()).fadeIn(300);
				}).mouseout(function(){
				   _autoContentRoll()
			});
		}

	});
})(jQuery);



//切换插件 2014-08-28
(function($){
	$.fn.extend({
		fadeSlide : function(options){
			var defaults = {
				fadeBtn : '.arr',//切换按钮
				fadeDots : '.fadeDots',//切换圆点序列（如有）
				fadeCon : '.fadeCon',//切换内容容器
				fadeCurClass : 'cur',//圆点选中类名
				dotsEvent : 'click',//圆点触发事件
				fadeTime : 300,//切换动画时长
				fadeRange : 15000,//切换间隔
				autoFade : false//自动切换
			}
			var options = $.extend(defaults, options),
				$fadeWrap = this,
				$fadeBtn = $fadeWrap.find(options.fadeBtn),
				$fadeDots = $fadeWrap.find(options.fadeDots),
				$fadeCon = $fadeWrap.find(options.fadeCon),
				len = $fadeCon.length,
				autoFlag = null;
			$fadeDots.on(options.dotsEvent, function(){				
				if(!$(this).hasClass(options.fadeCurClass))
					fadeOutFn($(this).index());
			});
			$fadeBtn.on('click', function(){
				var index = ($fadeWrap.find($('.' + options.fadeCurClass)).index() + (($(this).hasClass('next')) ? 1 : (-1))) % len;
				fadeOutFn(index);
			})
			$fadeWrap.on('mouseenter', function(){
				clearTimeout(autoFlag);
			}).on('mouseleave', function(){
				var $that = $(this);
				(!options.autoFade) || _setAutoFlag();
			})
			$(document).ready(function(){
				var $that = $(this);
				(!options.autoFade) || _setAutoFlag();
			});
			function autoFadeFn(direct){
				clearTimeout(autoFlag);
				var direct = direct || 'next', index = ($fadeWrap.find($('.' + options.fadeCurClass)).index() + ((direct == 'next') ? 1 : (-1))) % len;
				fadeOutFn(index);
				_setAutoFlag();
			}
			function _setAutoFlag(){
				autoFlag = setTimeout(function(){
					autoFadeFn('next')
				}, options.fadeRange);
			}
			function fadeOutFn(index){
				$fadeDots.removeClass(options.fadeCurClass).eq(index).addClass(options.fadeCurClass);
				$fadeCon.hide().eq(index).fadeIn(options.fadeTime);
			}
			return {
				fadeOutFn : fadeOutFn
			}
		},
		slideImage : function(options){
			//default
			var defaults = {
				slideEl : 'slide-li',
				slideElMg : 10,
				slideBtn : 'slide-arr',
				slideTime : 1000,
				slideRange : 7000,
				slideNum : 5,
				autoSlide : true,
				afterCallback: function () {},
				beforeCallback: function () {}
			};
			var inter, enable = true;
			var options = $.extend(defaults, options),
				$slideWrap = $(this),
				$slideEls = $slideWrap.find(options.slideEl),
				$slideList = $slideEls.parent(),
				slideWrapWidth = $slideWrap.width(),
				slideElWidth = $slideEls.width() + options.slideElMg,
				slideStep = options.slideNum * slideElWidth,
				$slideBtn = $slideWrap.find(options.slideBtn);
			
			$slideBtn.on('click', function(){
				if(!enable) return;
				if($(this).hasClass('next'))
					_slideToLeft();
				else
					_slideToRight();
			});
			$(document).ready(function(){
				$slideList.css({width : ($slideEls.length + options.slideNum) * slideElWidth, left : 0});
				_setAutoSlide();
			});
			$slideWrap.on('mouseenter', function(){//检测鼠标移入移出
				clearTimeout(inter);
			}).on('mouseleave', function(){
				_setAutoSlide();
			});
			function _setAutoSlide(){//自动滚动
				clearTimeout(inter);
				if(options.autoSlide){
					inter = setTimeout(function(){
						_slideToLeft();
						_setAutoSlide();
					}, options.slideRange);
				}
			}
			function _slideToLeft(){
				options.afterCallback.call($slideWrap);
				enable = false;
				var elClones = $slideWrap.find(options.slideEl).slice(0, options.slideNum);
				$slideList.append(elClones.clone());
				$slideList.animate({left : '-=' + slideStep}, options.slideTime, function(){
					elClones.remove();
					$slideList.css({ left : '+=' + slideStep});
					enable = true;
				});
				options.beforeCallback.call($slideWrap);
			}
			function _slideToRight(){
				options.afterCallback.call($slideWrap);
				enable = false;
				var elClones = $slideWrap.find(options.slideEl).slice('-' + options.slideNum);
				$slideList.prepend(elClones.clone());
				$slideList.css({left : '-=' + slideStep});
				$slideList.animate({left : '+=' + slideStep}, options.slideTime, function(){
					elClones.remove();
					enable = true;
				});
				options.beforeCallback.call($slideWrap);
			}			
		},
		rollText : function(options){//列表文字自动上滚
			var defaults = {
				rollList : 'ul',
				rollEls : 'li',
				rollNum : 1,
				rollTime : 1000,
				rollRange : 3000,
				autoRoll : true
			};
			var options = $.extend(defaults, options);
			var $rollWrap = $(this),
				$rollList = $rollWrap.find(options.rollList),
				autoInter;
			$rollWrap.on('mouseenter', function(){
				_clearAutoRoll();
			}).on('mouseleave', function(){
				_setAutoRoll();
			})
			$(document).ready(function(){
				_setAutoRoll();
			});
			function _setAutoRoll(){
				if(options.autoRoll){
					autoInter = setTimeout(function(){
						$rollList.each(function(){
							var $wrap = $(this);
							var $origs = $wrap.find(options.rollEls).slice(0, options.rollNum);
							$wrap.append($origs.clone());
							$origs.slideUp(options.rollTime, function(){
								$origs.remove();
							});
						});
						 _setAutoRoll();
					}, options.rollRange);
				}				
			}
			function _clearAutoRoll(){
				clearTimeout(autoInter);
			}
		},
		autoRoll : function(options){
			var defaults = {
				rollTitle : '.channel-wrap a',
				rollEls : '.juhe-con-wrap',
				rollConTime : 10000
			};

			var options = $.extend(defaults, options);
			var $rollWrap = $(this),
				$rollTitle = $rollWrap.find(options.rollTitle);
				$rollEls = $rollWrap.find(options.rollEls);
				$rollEleLength = $rollWrap.find(options.rollEls).length;
				$rollConTime = options.rollConTime;

			$(document).ready(function(){
				_autoContentRoll();
			});

			function bigImgIndex() {
				$rollEls.each(function(i, el) {
				  if ($(el).is(':visible')) {
				    bigIndex = i;
				  }
				});
				return bigIndex;
			}

			function _autoContentRoll(){	

				function slideRoll(){ 
					var conIndex = bigImgIndex();
					if ( conIndex == ($rollEleLength-1) ) {
						conIndex = -1;
					} 

					$rollTitle.eq(conIndex).removeClass('cur');
					$rollTitle.eq(conIndex + 1).addClass('cur');

					$rollEls.eq(conIndex).hide();
					$rollEls.eq(conIndex + 1).show();
				} 
				slideAction = setInterval(slideRoll, $rollConTime);
			} 

			$rollTitle.mouseover(function(){
					clearInterval(slideAction); 
					var conIndex = bigImgIndex();
					$rollTitle.removeClass('cur').eq($(this).index()).addClass('cur');
					$rollEls.hide().eq($(this).index()).fadeIn(300);
				}).mouseout(function(){
				   _autoContentRoll()
			});
		}

	});
})(jQuery);



//切换插件 2014-08-28
(function($){
	$.fn.extend({
		fadeSlide : function(options){
			var defaults = {
				fadeBtn : '.arr',//切换按钮
				fadeDots : '.fadeDots',//切换圆点序列（如有）
				fadeCon : '.fadeCon',//切换内容容器
				fadeCurClass : 'cur',//圆点选中类名
				dotsEvent : 'click',//圆点触发事件
				fadeTime : 300,//切换动画时长
				fadeRange : 15000,//切换间隔
				autoFade : false//自动切换
			}
			var options = $.extend(defaults, options),
				$fadeWrap = this,
				$fadeBtn = $fadeWrap.find(options.fadeBtn),
				$fadeDots = $fadeWrap.find(options.fadeDots),
				$fadeCon = $fadeWrap.find(options.fadeCon),
				len = $fadeCon.length,
				autoFlag = null;
			$fadeDots.on(options.dotsEvent, function(){				
				if(!$(this).hasClass(options.fadeCurClass))
					fadeOutFn($(this).index());
			});
			$fadeBtn.on('click', function(){
				var index = ($fadeWrap.find($('.' + options.fadeCurClass)).index() + (($(this).hasClass('next')) ? 1 : (-1))) % len;
				fadeOutFn(index);
			})
			$fadeWrap.on('mouseenter', function(){
				clearTimeout(autoFlag);
			}).on('mouseleave', function(){
				var $that = $(this);
				(!options.autoFade) || _setAutoFlag();
			})
			$(document).ready(function(){
				var $that = $(this);
				(!options.autoFade) || _setAutoFlag();
			});
			function autoFadeFn(direct){
				clearTimeout(autoFlag);
				var direct = direct || 'next', index = ($fadeWrap.find($('.' + options.fadeCurClass)).index() + ((direct == 'next') ? 1 : (-1))) % len;
				fadeOutFn(index);
				_setAutoFlag();
			}
			function _setAutoFlag(){
				autoFlag = setTimeout(function(){
					autoFadeFn('next')
				}, options.fadeRange);
			}
			function fadeOutFn(index){
				$fadeDots.removeClass(options.fadeCurClass).eq(index).addClass(options.fadeCurClass);
				$fadeCon.hide().eq(index).fadeIn(options.fadeTime);
			}
			return {
				fadeOutFn : fadeOutFn
			}
		},
		slideImage : function(options){
			//default
			var defaults = {
				slideEl : 'slide-li',
				slideElMg : 10,
				slideBtn : 'slide-arr',
				slideTime : 1000,
				slideRange : 7000,
				slideNum : 5,
				autoSlide : true,
				afterCallback: function () {},
				beforeCallback: function () {}
			};
			var inter, enable = true;
			var options = $.extend(defaults, options),
				$slideWrap = $(this),
				$slideEls = $slideWrap.find(options.slideEl),
				$slideList = $slideEls.parent(),
				slideWrapWidth = $slideWrap.width(),
				slideElWidth = $slideEls.width() + options.slideElMg,
				slideStep = options.slideNum * slideElWidth,
				$slideBtn = $slideWrap.find(options.slideBtn);
			
			$slideBtn.on('click', function(){
				if(!enable) return;
				if($(this).hasClass('next'))
					_slideToLeft();
				else
					_slideToRight();
			});
			$(document).ready(function(){
				$slideList.css({width : ($slideEls.length + options.slideNum) * slideElWidth, left : 0});
				_setAutoSlide();
			});
			$slideWrap.on('mouseenter', function(){//检测鼠标移入移出
				clearTimeout(inter);
			}).on('mouseleave', function(){
				_setAutoSlide();
			});
			function _setAutoSlide(){//自动滚动
				clearTimeout(inter);
				if(options.autoSlide){
					inter = setTimeout(function(){
						_slideToLeft();
						_setAutoSlide();
					}, options.slideRange);
				}
			}
			function _slideToLeft(){
				options.afterCallback.call($slideWrap);
				enable = false;
				var elClones = $slideWrap.find(options.slideEl).slice(0, options.slideNum);
				$slideList.append(elClones.clone());
				$slideList.animate({left : '-=' + slideStep}, options.slideTime, function(){
					elClones.remove();
					$slideList.css({ left : '+=' + slideStep});
					enable = true;
				});
				options.beforeCallback.call($slideWrap);
			}
			function _slideToRight(){
				options.afterCallback.call($slideWrap);
				enable = false;
				var elClones = $slideWrap.find(options.slideEl).slice('-' + options.slideNum);
				$slideList.prepend(elClones.clone());
				$slideList.css({left : '-=' + slideStep});
				$slideList.animate({left : '+=' + slideStep}, options.slideTime, function(){
					elClones.remove();
					enable = true;
				});
				options.beforeCallback.call($slideWrap);
			}			
		},
		rollText : function(options){//列表文字自动上滚
			var defaults = {
				rollList : 'ul',
				rollEls : 'li',
				rollNum : 1,
				rollTime : 1000,
				rollRange : 3000,
				autoRoll : true
			};
			var options = $.extend(defaults, options);
			var $rollWrap = $(this),
				$rollList = $rollWrap.find(options.rollList),
				autoInter;
			$rollWrap.on('mouseenter', function(){
				_clearAutoRoll();
			}).on('mouseleave', function(){
				_setAutoRoll();
			})
			$(document).ready(function(){
				_setAutoRoll();
			});
			function _setAutoRoll(){
				if(options.autoRoll){
					autoInter = setTimeout(function(){
						$rollList.each(function(){
							var $wrap = $(this);
							var $origs = $wrap.find(options.rollEls).slice(0, options.rollNum);
							$wrap.append($origs.clone());
							$origs.slideUp(options.rollTime, function(){
								$origs.remove();
							});
						});
						 _setAutoRoll();
					}, options.rollRange);
				}				
			}
			function _clearAutoRoll(){
				clearTimeout(autoInter);
			}
		},
		autoRoll : function(options){
			var defaults = {
				rollTitle : '.channel-wrap a',
				rollEls : '.juhe-con-wrap',
				rollConTime : 10000
			};

			var options = $.extend(defaults, options);
			var $rollWrap = $(this),
				$rollTitle = $rollWrap.find(options.rollTitle);
				$rollEls = $rollWrap.find(options.rollEls);
				$rollEleLength = $rollWrap.find(options.rollEls).length;
				$rollConTime = options.rollConTime;

			$(document).ready(function(){
				_autoContentRoll();
			});

			function bigImgIndex() {
				$rollEls.each(function(i, el) {
				  if ($(el).is(':visible')) {
				    bigIndex = i;
				  }
				});
				return bigIndex;
			}

			function _autoContentRoll(){	

				function slideRoll(){ 
					var conIndex = bigImgIndex();
					if ( conIndex == ($rollEleLength-1) ) {
						conIndex = -1;
					} 

					$rollTitle.eq(conIndex).removeClass('cur');
					$rollTitle.eq(conIndex + 1).addClass('cur');

					$rollEls.eq(conIndex).hide();
					$rollEls.eq(conIndex + 1).show();
				} 
				slideAction = setInterval(slideRoll, $rollConTime);
			} 

			$rollTitle.mouseover(function(){
					clearInterval(slideAction); 
					var conIndex = bigImgIndex();
					$rollTitle.removeClass('cur').eq($(this).index()).addClass('cur');
					$rollEls.hide().eq($(this).index()).fadeIn(300);
				}).mouseout(function(){
				   _autoContentRoll()
			});
		}

	});
})(jQuery);



//切换插件 2014-08-28
(function($){
	$.fn.extend({
		fadeSlide : function(options){
			var defaults = {
				fadeBtn : '.arr',//切换按钮
				fadeDots : '.fadeDots',//切换圆点序列（如有）
				fadeCon : '.fadeCon',//切换内容容器
				fadeCurClass : 'cur',//圆点选中类名
				dotsEvent : 'click',//圆点触发事件
				fadeTime : 300,//切换动画时长
				fadeRange : 15000,//切换间隔
				autoFade : false//自动切换
			}
			var options = $.extend(defaults, options),
				$fadeWrap = this,
				$fadeBtn = $fadeWrap.find(options.fadeBtn),
				$fadeDots = $fadeWrap.find(options.fadeDots),
				$fadeCon = $fadeWrap.find(options.fadeCon),
				len = $fadeCon.length,
				autoFlag = null;
			$fadeDots.on(options.dotsEvent, function(){				
				if(!$(this).hasClass(options.fadeCurClass))
					fadeOutFn($(this).index());
			});
			$fadeBtn.on('click', function(){
				var index = ($fadeWrap.find($('.' + options.fadeCurClass)).index() + (($(this).hasClass('next')) ? 1 : (-1))) % len;
				fadeOutFn(index);
			})
			$fadeWrap.on('mouseenter', function(){
				clearTimeout(autoFlag);
			}).on('mouseleave', function(){
				var $that = $(this);
				(!options.autoFade) || _setAutoFlag();
			})
			$(document).ready(function(){
				var $that = $(this);
				(!options.autoFade) || _setAutoFlag();
			});
			function autoFadeFn(direct){
				clearTimeout(autoFlag);
				var direct = direct || 'next', index = ($fadeWrap.find($('.' + options.fadeCurClass)).index() + ((direct == 'next') ? 1 : (-1))) % len;
				fadeOutFn(index);
				_setAutoFlag();
			}
			function _setAutoFlag(){
				autoFlag = setTimeout(function(){
					autoFadeFn('next')
				}, options.fadeRange);
			}
			function fadeOutFn(index){
				$fadeDots.removeClass(options.fadeCurClass).eq(index).addClass(options.fadeCurClass);
				$fadeCon.hide().eq(index).fadeIn(options.fadeTime);
			}
			return {
				fadeOutFn : fadeOutFn
			}
		},
		slideImage : function(options){
			//default
			var defaults = {
				slideEl : 'slide-li',
				slideElMg : 10,
				slideBtn : 'slide-arr',
				slideTime : 1000,
				slideRange : 7000,
				slideNum : 5,
				autoSlide : true,
				afterCallback: function () {},
				beforeCallback: function () {}
			};
			var inter, enable = true;
			var options = $.extend(defaults, options),
				$slideWrap = $(this),
				$slideEls = $slideWrap.find(options.slideEl),
				$slideList = $slideEls.parent(),
				slideWrapWidth = $slideWrap.width(),
				slideElWidth = $slideEls.width() + options.slideElMg,
				slideStep = options.slideNum * slideElWidth,
				$slideBtn = $slideWrap.find(options.slideBtn);
			
			$slideBtn.on('click', function(){
				if(!enable) return;
				if($(this).hasClass('next'))
					_slideToLeft();
				else
					_slideToRight();
			});
			$(document).ready(function(){
				$slideList.css({width : ($slideEls.length + options.slideNum) * slideElWidth, left : 0});
				_setAutoSlide();
			});
			$slideWrap.on('mouseenter', function(){//检测鼠标移入移出
				clearTimeout(inter);
			}).on('mouseleave', function(){
				_setAutoSlide();
			});
			function _setAutoSlide(){//自动滚动
				clearTimeout(inter);
				if(options.autoSlide){
					inter = setTimeout(function(){
						_slideToLeft();
						_setAutoSlide();
					}, options.slideRange);
				}
			}
			function _slideToLeft(){
				options.afterCallback.call($slideWrap);
				enable = false;
				var elClones = $slideWrap.find(options.slideEl).slice(0, options.slideNum);
				$slideList.append(elClones.clone());
				$slideList.animate({left : '-=' + slideStep}, options.slideTime, function(){
					elClones.remove();
					$slideList.css({ left : '+=' + slideStep});
					enable = true;
				});
				options.beforeCallback.call($slideWrap);
			}
			function _slideToRight(){
				options.afterCallback.call($slideWrap);
				enable = false;
				var elClones = $slideWrap.find(options.slideEl).slice('-' + options.slideNum);
				$slideList.prepend(elClones.clone());
				$slideList.css({left : '-=' + slideStep});
				$slideList.animate({left : '+=' + slideStep}, options.slideTime, function(){
					elClones.remove();
					enable = true;
				});
				options.beforeCallback.call($slideWrap);
			}			
		},
		rollText : function(options){//列表文字自动上滚
			var defaults = {
				rollList : 'ul',
				rollEls : 'li',
				rollNum : 1,
				rollTime : 1000,
				rollRange : 3000,
				autoRoll : true
			};
			var options = $.extend(defaults, options);
			var $rollWrap = $(this),
				$rollList = $rollWrap.find(options.rollList),
				autoInter;
			$rollWrap.on('mouseenter', function(){
				_clearAutoRoll();
			}).on('mouseleave', function(){
				_setAutoRoll();
			})
			$(document).ready(function(){
				_setAutoRoll();
			});
			function _setAutoRoll(){
				if(options.autoRoll){
					autoInter = setTimeout(function(){
						$rollList.each(function(){
							var $wrap = $(this);
							var $origs = $wrap.find(options.rollEls).slice(0, options.rollNum);
							$wrap.append($origs.clone());
							$origs.slideUp(options.rollTime, function(){
								$origs.remove();
							});
						});
						 _setAutoRoll();
					}, options.rollRange);
				}				
			}
			function _clearAutoRoll(){
				clearTimeout(autoInter);
			}
		},
		autoRoll : function(options){
			var defaults = {
				rollTitle : '.channel-wrap a',
				rollEls : '.juhe-con-wrap',
				rollConTime : 10000
			};

			var options = $.extend(defaults, options);
			var $rollWrap = $(this),
				$rollTitle = $rollWrap.find(options.rollTitle);
				$rollEls = $rollWrap.find(options.rollEls);
				$rollEleLength = $rollWrap.find(options.rollEls).length;
				$rollConTime = options.rollConTime;

			$(document).ready(function(){
				_autoContentRoll();
			});

			function bigImgIndex() {
				$rollEls.each(function(i, el) {
				  if ($(el).is(':visible')) {
				    bigIndex = i;
				  }
				});
				return bigIndex;
			}

			function _autoContentRoll(){	

				function slideRoll(){ 
					var conIndex = bigImgIndex();
					if ( conIndex == ($rollEleLength-1) ) {
						conIndex = -1;
					} 

					$rollTitle.eq(conIndex).removeClass('cur   ');
					$rollTitle.eq(conIndex + 1).addClass('cur');

					$rollEls.eq(conIndex).hide();
					$rollEls.eq(conIndex + 1).show();
				} 
				slideAction = setInterval(slideRoll, $rollConTime);
			} 

			$rollTitle.mouseover(function(){
					clearInterval(slideAction); 
					var conIndex = bigImgIndex();
					$rollTitle.removeClass('cur').eq($(this).index()).addClass('cur');
					$rollEls.hide().eq($(this).index()).fadeIn(300);
				}).mouseout(function(){
				   _autoContentRoll()
			});
		}

	});
})(jQuery);



    