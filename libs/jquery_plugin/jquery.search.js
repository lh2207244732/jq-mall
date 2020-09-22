;
(function($) {
    // 创建一个对象用于缓存数据
    var cache = {
        data: {

        },
        // 添加数据
        addData: function(key, value) {
            this.data[key] = value
        },
        // 获取数据
        getData: function(key) {
            return this.data[key]
        }
    }

    function Search($elem, options) {
        //罗列属性
        this.$elem = $elem
        this.$searchInput = $(options.searchInputSelector)
        this.$searchBtn = $(options.searchBtnSelector)
        this.$searchLayer = $(options.searchLayerSelector)
        this.url = options.url
        this.isAutocomplete = options.isAutocomplete
        this.searchTimer = null
        this.jqXHR = null
            // 初始化
        this.init()
            // 判断是否配置自动提示功能
        if (this.isAutocomplete) {
            this.autocomplete()
        }

    }
    Search.prototype = {
            constructor: Search,
            init: function() {
                // 绑定点击提交事件
                this.$searchBtn.on('click', $.proxy(this.submitSearch, this))
            },
            // 点击提交搜索内容
            submitSearch: function() {
                console.log(this)
                var keyword = this.$searchInput.val()
                window.location.href = './list.html?keyword=' + keyword
            },
            // 输入自动提示
            autocomplete: function() {

                this.$searchInput
                    // 监听输入事件
                    .on('input', function() {
                        //    防止多次输入时多次发送请求，只执行最后一次
                        if (this.searchTimer) {
                            clearTimeout(this.searchTimer)
                        }
                        this.searchTimer = setTimeout(function() {
                            this.getSearchData()
                        }.bind(this), 300)
                    }.bind(this))
                    // 阻止事件冒泡
                    .on('click', function(ev) {
                        ev.stopPropagation()
                    })
                    // 监听获取焦点事件
                    .on('focus', function() {
                        this.$searchLayer.show()
                    }.bind(this))
                    //点击其他地方隐藏提示框
                $(document).on('click', function() {
                        this.$searchLayer.hide()
                    }.bind(this))
                    // 利用事件委托处理提示层的点击提交
                var _this = this
                this.$searchLayer.on('click', '.search-item', function() {
                    var keyword = $(this).html()
                    _this.$searchInput.val(keyword)
                    _this.submitSearch()
                })
            },
            // 获取提示框内容
            getSearchData: function() {
                var _this = this
                var keyword = this.$searchInput.val()
                if (cache.getData(keyword)) {
                    // 如果缓存中有，则不向下执行
                    _this.renderSearch(cache.getData(keyword))
                    return
                }
                // 如果存在没有完成的请求，就中止上一次请求
                if (this.jqXHR) {
                    this.jqXHR.abort()
                }
                if (!keyword) {
                    // 如果没有值，则隐藏提示框
                    _this.$searchLayer.html('')
                    _this.searchLayer.hide()
                } else {
                    this.jqXHR = utils.ajax({
                        url: this.url,
                        data: {
                            keyword: keyword
                        },
                        success: function(data) {
                            if (data.code == 0) {
                                // 缓存数据
                                cache.addData(keyword, data.data)
                                _this.renderSearch(data.data)
                            }
                        },
                        error: function() {
                            _this.$searchLayer.html('')
                        },
                        complete: function() {
                            this.jqXHR = null
                        }
                    })
                }
            },
            // 渲染提示框
            renderSearch: function(list) {
                var len = list.length
                var html = ''
                for (var i = 0; i < len; i++) {
                    html += `<li class="search-item">${list[i].name}</li>`
                }
                this.$searchLayer.show()
                this.$searchLayer.html(html)
            }
        }
        // 设置默认值
    Search.DEFAULTS = {
        searchInputSelector: '.search-input input',
        searchBtnSelector: '.search-btn',
        searchLayerSelector: '.search-layer',
        url: '/products/search',
        isAutocomplete: false
    }
    $.fn.extend({
        search: function(options) {
            return this.each(function() {
                $elem = $(this)
                    //单例模式
                var search = $elem.data('search')
                if (!search) {
                    options = $elem.extend({}, Search.DEFAULTS, options)
                    search = new Search($elem, options)
                    $elem.data('search', search)
                }
            })
        }
    })
})(jQuery)