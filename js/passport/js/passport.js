(function($){var _defaultops={errorCb:function(){alert("服务失败，请稍候再试!")},failCb:function(){alert("操作失败！")},sucCb:function(){alert("操作成功！")},finishCb:function(){}};$.fn.PassportLogin=function(params,options){var defaults={account:"",password:"",randCode:"",isrmpwd:"0",basePath:"",passurl:"https://passport.chinaso.com/login.htm"};params=$.extend(defaults,params);options=$.extend(_defaultops,options);passport(params,options,true)};$.fn.PassportRegPhone=function(params,options){var defaults={"user.msisdn":"","randCode":"","user.password":"",basePath:"",passurl:"https://passport.chinaso.com/user/smsRegist.htm"};params=$.extend(defaults,params);options=$.extend(_defaultops,options);passport(params,options,true)};$.fn.PassportRegMail=function(params,options){var defaults={"user.email":"","user.password":"","randCode":"",basePath:"",passurl:"https://passport.chinaso.com/user/mailRegist.htm"};params=$.extend(defaults,params);options=$.extend(_defaultops,options);passport(params,options,false)};$.fn.PassportLogoutWhy=function(params,options){var defaults={basePath:"",passurl:"http://passport.chinaso.com/logout.htm"};params=$.extend(defaults,params);var defaultLogoutOps={errorCb:function(){alert("服务失败，请稍候再试!")},failCb:function(){alert("退出失败，请稍候再试！")},sucCb:function(){alert("退出成功！")},finishCb:function(){}};options=$.extend(defaultLogoutOps,options);passport(params,options,true)};function passport(params,options,scall){var passurl=params["passurl"];$.ajax({url:passurl,type:"post",dataType:"jsonp",jsonp:"jsonpcallback",data:params,timeout:20000,success:function(data){var c=data.flag;if(c==0){if(scall){var turl=params.basePath+"ts.htm?u="+decodeURIComponent(data.url);if(data.logout){turl+="&logout=1"}window.location.href=decodeURIComponent(data.url)}else{options.sucCb()}}else{options.failCb(c)}},error:function(e){alert("服务暂时不可用，请稍后再试！")},complete:function(){options.finishCb()}})}function passport_nohandle_error(params,options,scall){var passurl=params["passurl"];$.ajax({data:params,timeout:20000,dataType:"jsonp",jsonp:"jsonpcallback",url:passurl,success:function(data){var c=data.flag;if(c==0){if(scall){var turl=params.basePath+"ts.htm?u="+decodeURIComponent(data.url);if(data.logout){turl+="&logout=1"}window.location.href=turl}else{options.sucCb()}}else{options.failCb(c)}},error:function(){alert("服务暂时不可用，请稍后再试！")},complete:function(){options.finishCb()}})}function set_sid(surl,error_cb,suc_cb){var params={};$.ajax({data:params,type:"POST",timeout:20000,dataType:"jsonp",jsonp:"jsonpcallback",url:surl,success:function(data){var c=data.flag;if(c==0){suc_cb()}else{error_cb()}},error:function(){suc_cb()}})}})(jQuery);