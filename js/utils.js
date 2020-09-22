var baseUrl = 'http://127.0.0.1:3000'
var utils = {
    ajax: function(options) {
        options.url = baseUrl + options.url
        $.ajax(options)
    },
    //判断元素是否在可视区
    isVisibility: function($elem) {
        var $win = $(window)
        return ($elem.offset().top < $win.scrollTop() + $win.height() && $elem.offset().top + $elem.height() > $win.scrollTop())
    },
    //防抖处理
    debounce: function(fn, delay) {
        var timer = 0;
        // 返回一个函数
        return function() {
            if (timer) {
                // 每次事件被触发，清除之前的定时器
                clearTimeout(timer)
            }
            // 开启一个新的定时器
            setTimeout(fn, delay)
        }
    },
    // 加载图片处理
    loadImage: function(imgUrl, success) {
        //创建一个图片对象
        var img = new Image()
            // 当图片获取完成时，执行
        img.onload = function() {
                typeof success === 'function' && success()
            }
            // 通过地址获取图片（异步）
        img.src = imgUrl
    }
}