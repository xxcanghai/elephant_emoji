namespace xxcanhgai {


    /**
     * 载入jquery
     * 
     * @export
     * @param {() => void} [onload=function () { }]
     */
    function loadJQuery(onload: () => void = function () { }) {
        var jquerySrc = "http://apps.bdimg.com/libs/jquery/2.1.1/jquery.min.js";
        var t = new Date().getTime();

        if (typeof window["jQuery"] == "undefined") {
            var jqueryScript = document.createElement("script");
            jqueryScript.onload = function (e) {
                // console.info("jquery loaded!", $);
                onload();
            };
            jqueryScript.src = jquerySrc;
            document.getElementsByTagName("body")[0].appendChild(jqueryScript);
        } else {
            onload();
        }
    }

    /**
     * 执行初始化
     * 
     * @export
     */
    export function init() {
        loadJQuery(() => {
            $(() => {
                var timerid = setInterval(() => {
                    if ($(".smiley-container").length > 0) {
                        realyInit();
                        clearInterval(timerid);
                    }
                }, 10);
            });
        });
    }

    function realyInit() {
        bind();
        console.info("elephant_emoji ready!");
    }

    function bind() {
        $(".smiley-container").click(delayBind(smiley_container_click));
    }

    function smiley_container_click(e) {
        var $smiley_tabbar = $(".smiley-tabbar");
        var $tabbar_item = $('<div class="tabbar-item elephant_emoji" title="表情收藏"><img src="https://file.sankuai.com/pan/im/1/image/AQdD8ukZtwpb_PAKXwAAElX88AsC@640w_1l?w=640&h=642" style="width: 20px; height: 20px;"></div>')
        if ($(".tabbar-item.elephant_emoji").length > 0) return;
        $smiley_tabbar.find(".tabbar-item").last().after($tabbar_item);
    }

    /**
     * 返回将函数延迟指定时间的新函数
     * 
     * @param {Function} [fn=function () { }]
     * @param {number} [time=10]
     * @returns
     */
    function delayBind(fn: Function = function () { }, time = 10) {
        return function () {
            var that = this;
            var args = [].slice.call(arguments);
            setTimeout(function () {
                return fn.apply(that, args);
            }, time);
        }
    }
}
xxcanhgai.init();