BL.Com.Storage = function (e, t, n) {
    var r = this;
    r.fileName = e || "",
    r.expiresDay = t || 0,
    r.isIE = navigator.userAgent.indexOf("MSIE") != -1 && !window.opera,
    r.isInit = !1,
    r.target = document.documentElement,
    r.type = n || "json",
    r.init();
};
BL.Com.Storage.prototype = {
    init: function () {
        var e = this;
        !window.localStorage && e.isIE && (e.isInit || (document.documentElement.addBehavior("#default#userdata"), e.isInit = !0))
    },
    set: function (e, t, n) {
        var r = this;
        n = n || r.type, n == "json" && (t = BL.Com.JSON.stringify(t));
        if (window.localStorage)
            localStorage.setItem(e, t);
        else if (r.isIE) {
            var i = r.target,
                s = r.fileName;
            i.load(s), i.setAttribute(e, t), i.expires = (new Date((new Date).getTime() + r.expiresDay * 864e5)).toUTCString(), i.save(s)
        }
    },
    get: function (e, t) {
        var n = this;
        t = t || n.type;
        if (window.localStorage)
            return t == "json" ? BL.Com.JSON.parse(localStorage.getItem(e)) : localStorage.getItem(e);
        if (n.isIE) {
            var r = n.target,
                i = n.fileName;
            try {
                return r.load(i), t == "json" ? BL.Com.JSON.parse(n.target.getAttribute(e)) : n.target.getAttribute(e)
            } catch (s) {
                return null;
            }
        }
    },
    remove: function (e) {
        var t = this;
        if (window.localStorage)
            localStorage.removeItem(e);
        else if (t.isIE) {
            var n = t.target,
                r = t.fileName;
            n.load(r);
            n.removeAttribute(e);
            n.expires = (new Date((new Date).getTime() - 1)).toUTCString();
            n.save(r);
        }
    }
},
function (e, t) {
    typeof exports == "object" ? 
        module.exports = t() : 
        typeof define == "function" && define.amd ? define([], t) : e.MODULE_A = t()
}(this, function () {
    return BL.Com.Storage;
});