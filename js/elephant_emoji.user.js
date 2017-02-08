// ==UserScript==
// @name         大象表情收藏插件 ElephantEmoji
// @namespace    https://github.com/xxcanghai/elephant_emoji
// @version      1.0
// @description  为美团IM大象增加收藏表情等功能
// @author       xxcanghai@gmail.com
// @include      *www.baidu.com*
// @include      *x.sankuai.com/*
// @exclude      
// @grant        none
// @require      file:///D:/WebSite/xxcanghai/elephant_emoji/js/elephant_emoji.js
// ==/UserScript==

(function () {
    'use strict';

    console.info("welcome ElephantEmoji !!!~222");
    var jquerySrc = "https://code.jquery.com/jquery-1.12.4.js";
    var elephantSrc = "";
    var t = new Date().getTime();

    if (typeof window["jQuery"] == "undefined") {
        var jqueryScript = document.createElement("script");
        jqueryScript.onload = function (e) {
            console.info("jquery loaded!", $);
            loadElephantEmoji();
        };
        jqueryScript.src = jquerySrc;
        document.getElementsByTagName("body")[0].appendChild(jqueryScript);
    } else {
        loadElephantEmoji();
    }

    function loadElephantEmoji() {
        if(elephantSrc.length==0) return;
        var $ = jQuery;
        var $script = $("<script>").attr("src", elephantSrc + "?_=" + t);
        $("body").append($script);
    }
})();

// @require      file:///D:/WebSite/xxcanghai/elephant_emoji/js/elephant_emoji.js
//mac file:///Users/jicanghai/WebSite/xxcanghai/elephant_emoji/js/elephant_emoji.js
//window file:///D:/WebSite/xxcanghai/elephant_emoji/js/elephant_emoji.js