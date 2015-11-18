
// JSONP对象
// 处理异步请求jsonp方式
BL.Util.JSONP = function(url, callback, callbackFn) {
	var s = document.createElement("script"),
		first = document.getElementsByTagName("script")[0];
	s.type = "text/javascript";
	s.src = !callback ? url : url + (url.indexOf("?") == -1 ? "?" : "&") + "jsonpcallback=" + callback;
	first.parentNode.insertBefore(s, first);

	if(typeof callbackFn === 'function'){
		if(s.readyState){
			s.onreadystatechange = function() {
				var r = s.readyState;
				if (r === 'loaded' || r === 'complete') {
					s.onreadystatechange = null;
					callbackFn();
				}
			};
		}else{
			s.onload = function(){
			    callbackFn();
			};
		}
	}
};