
// toolbar基本操作
BL.Com.OperationAndExtend = function() {
	/*****************************
	 * 页面交互方法
	 *
	 ******************************/
	return {
		/***
		 * 天气背景样式对应常量
		 * @deprecated
		 **/
		cityDataText: new Array(),
		maxNum: 3,
		/***最多选择多少个城市**/
		selCity: 0,
		/***选择城市数**/
		init: function($) {
			var t = this;
			if (BL.Com.Toolbar.pageRankElems.length <= 0) {
				t.selectCityExtend();
				t.initWeatherEvent();
			}
//			t.initBaseEvent();
		},
		selectCityExtend: function() {
			$.fn.singleSelect = function(settings) {
				var defaultSettings = {
					id: '',
					width: '',
					valItem: '',
					txtItem: '',
					selectItem: '',
					render: null,
					changeFunction: null
				};

				/*** 合并默认参数和用户自定义参数 **/
				settings = $.extend(defaultSettings, settings);

				return this.each(function() {
					var selObject = $(this); /***获取当前对象**/
					var selId = selObject.attr("id"); /***得到select id属性**/
					var valArray = new Array(); /***保存value**/
					var txtArray = new Array(); /***保存text**/
					var firstOption = selObject.find("option").eq(0);
					var flag = false;
					if (firstOption.val() == "tellhow") {
						flag = true;
					}
					/***遍历取出里面的所有value和Text**/
					selObject.find("option").each(function(index) {
						if (flag) {
							if (index > 0) {
								/***从第二项开始**/
								valArray[index - 1] = $.trim($(this).val());
								txtArray[index - 1] = $.trim($(this).text());
								if ($(this).attr("selected")) {
									settings.selectItem = $.trim($(this).val());
								}
							}
						} else {
							valArray[index] = $.trim($(this).val());
							txtArray[index] = $.trim($(this).text());
							if ($(this).attr("selected")) {
								settings.selectItem = $.trim($(this).val());
							}
						}
					});
					var selParent = selObject.parent();
					selObject.remove(); /***移除select**/
					settings.id = selId;
					settings.valItem = valArray;
					settings.txtItem = txtArray;
					settings.render = selParent;
					/***初始化下拉列表**/
					$.initSingleSelect(settings);
				});
			};
			/***得到选中的下拉列表值**/
			$.fn.getsingleSelectValue = function() {
				var $cId = this.attr("id");
				var $id = "#" + $cId + "_singleSelect_content";
				var $selectDiv = $($id).find(".singleSelectCheckDiv_select");
				var $selectVel = $selectDiv.find(".singleSelectCheckValue");
				return $.trim($selectVel.html());
			};
			/***得到选中的下拉列表内容**/
			$.fn.getsingleSelectText = function() {
				var $cId = this.attr("id");
				var $id = "#" + $cId + "_singleSelect_input";
				return $.trim($($id).val());
			};
			/***得到所有下拉列表的值**/
			$.fn.getAllSingleSelectValue = function() {
				var $cId = this.attr("id");
				var valarray = new Array();
				$("#" + $cId + "_singleSelect_content .singleSelectCheckValue").each(function(index) {
					valarray[index] = $.trim($(this).html());
				});
				return valarray;
			};
			/***得到所有下拉列表的内容**/
			$.fn.getAllSingleSelectText = function() {
				var $cId = this.attr("id");
				var valarray = new Array();
				$("#" + $cId + "_singleSelect_content .singleSelectCheckSpan").each(function(index) {
					valarray[index] = $.trim($(this).html());
				});
				return valarray;
			};
			/***动态修改单选下拉列表的值**/
			$.fn.changeSingleSelectContent = function(settings) {
				/***默认参数**/
				var defaultSettings = {
					valItem: '',
					txtItem: '',
					selectItem: '',
					changeFunction: null
				};

				/***合并默认参数和用户自定义参数**/
				settings = $.extend(defaultSettings, settings);
				var $cId = this.attr("id");
				/***清空输入框内的值**/
				var selInput = $("#" + $cId + "_singleSelect_input");
				selInput.val("");
				/***清空列表中的内容**/
				var $content = $("#" + $cId + "_singleSelect_content");
				$content.children().remove();
				/***设置高度**/
				if (settings.valItem.length > 8) {
					$content.css("height", 8 * 27); /***设置高**/
				} else {
					$content.css("height", settings.valItem.length * 27); /***设置高**/
				}
				if (settings.selectItem !== null && settings.selectItem !== "") {
					settings.selectItem = $.trim(settings.selectItem);
				}
				if (settings.changeFunction === null || settings.changeFunction === "") {
					var strFunc = $.trim($("#" + $cId).attr("title"));
					settings.changeFunction = strFunc;
				}
				var len = settings.valItem.length;
				var htmlArray = [];
				$.each(settings.valItem, function(i) {
					var selectStr = "";
					var itemv = settings.valItem[i];
					var itemt = settings.txtItem[i];
					if (settings.selectItem !== "" && settings.selectItem !== null) {
						if (itemv == settings.selectItem) {
							selInput.val(itemt);
							selectStr = " singleSelectCheckDiv_select";
						}
					}
					htmlArray[i] = '<div class="singleSelectCheckDiv' + selectStr + '" onmouseenter="BL.Com.OperationAndExtend.singleSelectItemMouseEnter(\'' + $cId + '\',this,event)" onclick="BL.Com.OperationAndExtend.singleSelectClickItem(\'' + $cId + '\',this,\'' + settings.changeFunction + '\')"><span class="singleSelectCheckValue" style="display:none;">' + itemv + '</span><span style="float:left;margin-left:5px;margin-top:5px;" class="singleSelectCheckSpan">' + itemt + '</span></div>';
				});
				$content.append(htmlArray.join(""));
				/***关闭缓冲**/
				$("#" + $cId).singleSelectLoaddingOff();
			};
			/***动态创建多选下拉列表**/
			$.fn.createSingleSelect = function(settings) {
				/***默认参数**/
				var defaultSettings = {
					id: '',
					width: '',
					valItem: '',
					txtItem: '',
					selectItem: '',
					render: null,
					changeFunction: null
				};
				/***合并默认参数和用户自定义参数**/
				settings = $.extend(defaultSettings, settings);
				if (settings.render === null) {
					settings.render = this;
				}
				/***初始化下拉列表**/
				$.initSingleSelect(settings);
			};
			/***初始化下拉列表**/
			$.initSingleSelect = function(settings) {
				if (settings.id === '' || settings.render === null) {
					return;
				}
				settings.selectItem = $.trim(settings.selectItem);
				var strFunc = "";
				if (settings.changeFunction !== null && settings.changeFunction !== "") {
					strFunc = settings.changeFunction;
				}
				var selHtml = '<div style="display:none;" id="' + settings.id + '" title="' + strFunc + '"></div><div style="margin-left:2px;"><div style="display: none; position: absolute; z-index: 500; font-size: 12px; padding-left: 5px;padding-top: 3px;color: #FBA33C;width: 100%;height: 21px;filter: Alpha(opacity=60);background-color: white;" id="' + settings.id + '_singleSelect_loader">数据加载中...</div><input type="text" class="input3" style="width:' + settings.width + '" id="' + settings.id + '_singleSelect_input" onkeyup="BL.Com.OperationAndExtend.singleSelectInputKeyUp(\'' + settings.id + '\',this,event)"/>';
				settings.render.append(selHtml); /***替换新的**/
				var selHeight = 0;
				if (settings.valItem.length > 8) {
					selHeight = 8 * 27;
				} else {
					selHeight = settings.valItem.length * 27;
				}
				var selInput = $("#" + settings.id + "_singleSelect_input");
				var cWidth = selInput.width() + 24; /***下拉列表的宽**/
				var htmlArray = [];
				htmlArray[0] = '<div class="singleSelect-content hide" id="' + settings.id + '_singleSelect_content" style="height:' + selHeight + 'px;width:' + cWidth + 'px;">';
				var len = settings.valItem.length;
				$.each(settings.valItem, function(i) {
					var selectStr = "";
					var itemv = settings.valItem[i];
					var itemt = settings.txtItem[i];
					if (settings.selectItem != "" && settings.selectItem != null) {
						if (itemv == settings.selectItem) {
							selInput.val(itemt);
							selectStr = " singleSelectCheckDiv_select";
						}
					}
					htmlArray[i + 1] = '<div class="singleSelectCheckDiv' + selectStr + '" onmouseenter="BL.Com.OperationAndExtend.singleSelectItemMouseEnter(\'' + settings.id + '\',this,event)" onclick="BL.Com.OperationAndExtend.singleSelectClickItem(\'' + settings.id + '\',this,\'' + settings.changeFunction + '\')"><span class="singleSelectCheckValue" style="display:none;">' + itemv + '</span><span style="float:left;margin-left:5px;margin-top:5px;" class="singleSelectCheckSpan">' + itemt + '</span></div>';
				});
				htmlArray[len + 2] = "</div>";
				$("body").append(htmlArray.join("")); /***展示内容**/
			};
			/***缓冲打开**/
			$.fn.singleSelectLoaddingOn = function() {
				var $cId = this.attr("id");
				var $load = $("#" + $cId + "_singleSelect_loader"); /***缓冲div**/
				if ($load.is(":hidden")) {
					var $parent = $load.parent();
					$load.css("left", $parent.offset().left);
					$load.css("top", $parent.offset().top);
					$load.css("width", $parent.width() - 2);
					$load.show();
				}
			};
			/***缓冲关闭**/
			$.fn.singleSelectLoaddingOff = function() {
				var $cId = this.attr("id");
				var $load = $("#" + $cId + "_singleSelect_loader"); /***缓冲div**/
				if (!$load.is(":hidden")) {
					$load.hide();
				}
			};
			/***清空下拉列表的值**/
			$.fn.singleSelectInputClear = function() {
				var $cId = this.attr("id");
				$("#" + $cId + "_singleSelect_input").val("");
				$("#" + $cId + " .singleSelectCheckDiv").removeClass("singleSelectCheckDiv_select");
			};
			/***更改下拉列表框的内容**/
			$.fn.singleSelectInputSetText = function(txt) {
				var $cId = this.attr("id");
				var flag = false;
				$("#" + $cId + "_singleSelect_content .singleSelectCheckDiv").removeClass("singleSelectCheckDiv_select");
				$("#" + $cId + "_singleSelect_content .singleSelectCheckSpan").each(function() {
					if ($.trim($(this).html()) == txt) {
						$(this).parent().addClass("singleSelectCheckDiv_select");
						$("#" + $cId + "_singleSelect_input").val(txt);
						flag = true;
					}
				});
				if (!flag) {
					$("#" + $cId + "_singleSelect_input").val(txt);
				}
			};
			/***下拉列表聚焦**/
			$.fn.singleSelectInputFocus = function() {
				var $cId = this.attr("id");
				$("#" + $cId + "_singleSelect_input").focus();
			};
		},

        // 不推荐使用，使用 toolbar.js 中 bindUserCenter 方法替代
		initBaseEvent: function() {
			var t = this;

			$('.a_user').on('mouseover', function() {
				t.hideBox();
                
				// 每次修改头部结构都要重新定义退出right值。
				// 这里用依靠定义法，获得依靠目标left值，定义给quit位置 - jlj
				$('.quit_box').css({
					left: this.offsetLeft
				}).show();
				return false;
			});

			// 移入空白处
			$(document).on('mouseover', function(e) {
				if ($(e.target).closest(".wo_box").length === 0 && $(e.target).closest(".singleSelect-content").length === 0) {
					$(".wo_box").hide();
					$(".singleSelect-content").hide();
				}
				if ($(e.target).closest(".acc_box").length === 0) {
					$(".acc_box").hide();
				}
				if ($(e.target).closest(".download_box").length === 0) {
					$(".download_box").hide();
				}
				if ($(e.target).closest(".skin_box").length === 0) {
					$(".skin_box").hide();
				}
				if ($(e.target).closest(".quit_box").length === 0) {
					$(".quit_box").hide();
				}
			});
		},
		initWeatherEvent: function() {
			var t = this;

			/***显示其它城市天气**/
			$('#wo_switch').on('mouseenter', function () {
				t.hideBox();
				$('.wo_box').show();
				//if (BL.Com.Toolbar.isLogin()) {
				BL.Com.City.renderBack();
				//}
				return false;
			});
            
            // 移入空白处
//            $(".weather_other").on('mouseover', function(e) {
//                if ($(e.target).closest(".wo_box").length === 0 && $(e.target).closest(".singleSelect-content").length === 0) {
//                    $(".wo_box").hide();
//                    $(".singleSelect-content").hide();
//                }
//            });
            $(".weather_other").on('mouseleave', function(e) {
//                if ($(e.target).closest(".wo_box").length === 0 && $(e.target).closest(".singleSelect-content").length === 0) {
                    $(".wo_box").hide();
                    $(".singleSelect-content").hide();
//                }
            });
            
			/***热门城市 省市切换**/
			$('.wo_tab a').on('click', function () {
				var num = $('.wo_tab a').index(this);
				$('.wo_tab a').removeClass('cur').eq(num).addClass('cur');
				$('.wo_cont').hide().eq(num).show();

				var submitBtn = $('#weatherSubmit');
				if (num === 1) {
					submitBtn.show();
				} else {
					submitBtn.hide();
				}

				return false;
			});
			/***点击确认按钮**/
			$('#weatherSubmit').on('click', function () {
				var selectCities = $('#s_city').val(),
					selectCity = selectCities && selectCities.length > 0 ? $('#s_city').val()[0] : '';
				if(selectCity){
					$(this).attr('href', 'http://www.chinaso.com/search/pagesearch.htm?q=' + encodeURIComponent(selectCity + '天气预报'));
				}else{
					alert('请选择一个城市');
					return false;
				}
			});

			/***取消选择**/
			$('#cancelSel').on('click', function() {
				$(".wo_box").hide();
			});
		},

		hideBox: function() {
			$("#jToolbar .hide, .singleSelect-content").not(function() {
				if ($(this).parents(".hide").length > 0) {
					return this;
				}
			}).hide();
		}
	}
}();

BL.Com.OperationAndExtend.init($);