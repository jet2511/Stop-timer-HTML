function urlSettings() {
    var urlParametersTemplate = { "ns": null, "nslen": "0", "countdown": "00:00:00", "autoplay": "false", "language": "english", "mute": "false", "display": null, "widescreen": null };
    var urlParameters = JSON.parse(JSON.stringify(urlParametersTemplate));
    for (var key in urlParameters) urlParameters[key] = null;
    var getParameterByName = function(name, url) { name = name.replace(/[\[\]]/g, "\\$&"); var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"); var results = regex.exec(url); if (!results) return null; if (!results[2]) return ''; return decodeURIComponent(results[2].replace(/\+/g, " ")); }
    var iterate = function(parameters, url) {
        for (var key in parameters) {
            var paramVal = getParameterByName(key, url);
            if (paramVal != null) { parameters[key] = paramVal; }
        }
        return parameters;
    }
    if (onOS()) {
        if (window.location.href == window.parent.location.href) { urlParameters = iterate(urlParameters, window.location.href); } else if (window.parent.location.href.match(/\?./)) {
            urlParameters = iterate(urlParameters, window.location.href);
            urlParameters = iterate(urlParameters, window.parent.location.href);
        } else { urlParameters = iterate(urlParameters, window.location.href); }
    } else { urlParameters = iterate(urlParameters, window.location.href); }
    for (var key in urlParameters) {
        if (urlParameters[key] == null) { urlParameters[key] = urlParametersTemplate[key]; }
    }
    if (parseInt(urlParameters.nslen) > 0) urlParameters.nslen--;
    if (urlParameters.display === "false" || urlParameters.display === null) { urlParameters.timerType = null; } else { urlParameters.timerType = urlParameters.display; }
    if (urlParameters.widescreen === "false" || urlParameters.widescreen === null) { urlParameters.wideScreen = true; } else { urlParameters.wideScreen = urlParameters.widescreen; }
    return urlParameters;
};

function onOS() { try { return (document.location.hostname === window.parent.location.hostname); } catch (e) { return false; } };

function isIE() { var ua = window.navigator.userAgent; var msie = ua.indexOf("MSIE "); return (msie > 0 || !!navigator.userAgent.match(/Trident.*rv\:11\./)) ? true : false; return false; };

function createIEevent(type) {
    var event = document.createEvent("Event");
    event.initEvent(type, false, true);
    return event;
};
createjs.Tween.pausedTweenObjs = [];
createjs.Tween.pauseAllTweens = function() {
    createjs.Tween.pausedTweenObjs.length = 0;
    var i = 0,
        tweenObjs = createjs.Tween._tweens.slice().reverse(),
        tweenObj;
    for (; tweenObj = tweenObjs[i++];) {
        createjs.Tween.pausedTweenObjs.push(tweenObj);
        tweenObj.setPaused(true);
    }
};
createjs.Tween.resumeAllTweens = function() {
    var i = 0,
        tweenObj;
    for (; tweenObj = createjs.Tween.pausedTweenObjs[i++];)
        tweenObj.setPaused(false);
    createjs.Tween.pausedTweenObjs.length = 0;
};
! function(a) {
    var b = /iPhone/i,
        c = /iPod/i,
        d = /iPad/i,
        e = /(?=.*\bAndroid\b)(?=.*\bMobile\b)/i,
        f = /Android/i,
        g = /(?=.*\bAndroid\b)(?=.*\bSD4930UR\b)/i,
        h = /(?=.*\bAndroid\b)(?=.*\b(?:KFOT|KFTT|KFJWI|KFJWA|KFSOWI|KFTHWI|KFTHWA|KFAPWI|KFAPWA|KFARWI|KFASWI|KFSAWI|KFSAWA)\b)/i,
        i = /Windows Phone/i,
        j = /(?=.*\bWindows\b)(?=.*\bARM\b)/i,
        k = /BlackBerry/i,
        l = /BB10/i,
        m = /Opera Mini/i,
        n = /(CriOS|Chrome)(?=.*\bMobile\b)/i,
        o = /(?=.*\bFirefox\b)(?=.*\bMobile\b)/i,
        p = new RegExp("(?:Nexus 7|BNTV250|Kindle Fire|Silk|GT-P1000)", "i"),
        q = function(a, b) { return a.test(b) },
        r = function(a) {
            var r = a || navigator.userAgent,
                s = r.split("[FBAN");
            if ("undefined" != typeof s[1] && (r = s[0]), s = r.split("Twitter"), "undefined" != typeof s[1] && (r = s[0]), this.apple = { phone: q(b, r), ipod: q(c, r), tablet: !q(b, r) && q(d, r), device: q(b, r) || q(c, r) || q(d, r) }, this.amazon = { phone: q(g, r), tablet: !q(g, r) && q(h, r), device: q(g, r) || q(h, r) }, this.android = { phone: q(g, r) || q(e, r), tablet: !q(g, r) && !q(e, r) && (q(h, r) || q(f, r)), device: q(g, r) || q(h, r) || q(e, r) || q(f, r) }, this.windows = { phone: q(i, r), tablet: q(j, r), device: q(i, r) || q(j, r) }, this.other = { blackberry: q(k, r), blackberry10: q(l, r), opera: q(m, r), firefox: q(o, r), chrome: q(n, r), device: q(k, r) || q(l, r) || q(m, r) || q(o, r) || q(n, r) }, this.seven_inch = q(p, r), this.any = this.apple.device || this.android.device || this.windows.device || this.other.device || this.seven_inch, this.phone = this.apple.phone || this.android.phone || this.windows.phone, this.tablet = this.apple.tablet || this.android.tablet || this.windows.tablet, "undefined" == typeof window) return this
        },
        s = function() { var a = new r; return a.Class = r, a };
    "undefined" != typeof module && module.exports && "undefined" == typeof window ? module.exports = r : "undefined" != typeof module && module.exports && "undefined" != typeof window ? module.exports = s() : "function" == typeof define && define.amd ? define("isMobile", [], a.isMobile = s()) : a.isMobile = s()
}(this);;
(function($) {
    var re = /([^&=]+)=?([^&]*)/g;
    var decodeRE = /\+/g;
    var decode = function(str) { return decodeURIComponent(str.replace(decodeRE, " ")); };
    $.parseParams = function(query) {
        var params = {},
            e;
        while (e = re.exec(query)) {
            var k = decode(e[1]),
                v = decode(e[2]);
            if (k.substring(k.length - 2) === '[]') {
                k = k.substring(0, k.length - 2);
                (params[k] || (params[k] = [])).push(v);
            } else params[k] = v;
        }
        return params;
    };
})(jQuery);