(function (w, d) {
    var page = {
        init: function () {
            // 顶部购物车
            this.$cartBox = $('.cart-box')
            this.$cartCount = $('.cart-count')
            this.$cartContent = $('.cart-content')
            this.cartTimer = null
            this.handleCart()
            // 搜索框
            this.handSearch()

            // 焦点区域
            this.$categories = $('.categories')
            this.$parentCategories = $('.parent-categories')
            this.$childCategories = $('.child-categories')
            this.childcache = {}
            this.categoriesTimer = null
            this.handCategories()

            // 轮播图
            this.$swiper = $('#swiper')
            this.handCarousel()

            //热销区域
            this.$productList = $('.hot .product-list')
            this.$win = $(w)
            this.handProductList()

            //楼层区域
            this.$floor = $('.floor')
            this.handFloor()
            // 电梯
            this.$elevator = $('.elevator')
            this.handElevator()
        },
        // 顶部购物车
        handleCart: function () {
            var _this = this
            // 显示购物车中商品数量
            this.loadCartsCount()
            // 当鼠标进入购物车时
            this.$cartBox.on('mouseenter', function () {
                if (this.cartTimer) {
                    clearTimeout(this.cartTimer)
                }
                this.cartTimer = setTimeout(function () {
                    // 显示下拉购物车
                    _this.$cartContent.show()
                    //添加等待框动画
                    _this.$cartContent.html('<div class="loader"></div>')
                    // 发送ajax请求
                    utils.ajax({
                        method: 'GET',
                        url: '/carts',
                        success: function (data) {
                            if (data.code == 0) {
                                // 如果状态码为0则请求成功，渲染请求内容
                                _this.renderCart(data.data.cartList)
                            } else {
                                //请求失败
                                _this.$cartContent.html('<span class="empty-cart">请求失败,请稍后再试</span>')
                            }
                        },
                        error: function () {
                            _this.$cartContent.html('<span class="empty-cart">请求失败,请稍后再试</span>')
                        }
                    })
                }, 300)
            })
            // 鼠标离开时隐藏下拉购物车
            this.$cartBox.on('mouseleave', function () {
                if (this.cartTimer) {
                    clearTimeout(this.cartTimer)
                }
                _this.$cartContent.hide()
            })
        },
        // 改变购物车数字
        loadCartsCount: function () {
            var _this = this
            utils.ajax({
                method: 'GET',
                url: '/carts/count',
                success: function (data) {
                    if (data.code == 0) {
                        _this.$cartCount.html(data.data)
                    }
                }
            })
        },
        // 渲染购物车下拉框
        renderCart: function (list) {
            var len = list.length
            if (len > 0) {
                var html = '';
                html += '<span class="cart-tip">最近加入的宝贝</span>'
                html += '<ul>'
                for (var i = 0; i < len; i++) {
                    html += '<li class="cart-item clearfix">'
                    html += '<a href="#" target="_blank">'
                    html += '<img src=" ' + list[i].product.mainImage + '" alt="">'
                    html += '<span class="text-ellipsis">' + list[i].product.name + '</span>'
                    html += '</a>'
                    html += '<span class="product-count">x' + list[i].count + '</span><span class="product-price">' +
                        list[i].product.price + '</span>'
                    html += '</li>'
                }
                html += '</ul>'
                html += '<span class="line"></span>'
                html += '<a href="/cart.html" class="btn cart-btn">查看我的购物车</a>'
                this.$cartContent.html(html)

            } else {
                this.$cartCount.html('<span class="empty-cart">购物车中还没有商品,赶快去添加吧</span>')
            }
        },
        //搜索框
        handSearch: function () {
            $('.serach-box').search({
                searchInputSelector: '.search-input input',
                searchBtnSelector: '.search-btn',
                searchLayerSelector: '.search-layer',
                url: '/products/search',
                isAutocomplete: true
            })
        },
        // 焦点区域
        handCategories: function () {
            var _this = this
            // 获取父级分类
            this.getParentitems()

            // 利用事件代理监听父元素中子元素的切换
            this.$parentCategories.on('mouseover', '.parent-categories-item', function () {
                var $elem = $(this)
                // 防抖
                if (_this.categoriesTimer) {
                    clearTimeout(_this.categoriesTimer)
                }
                $elem.addClass('active').siblings().removeClass('active')
                _this.categoriesTimer = setTimeout(function () {
                    //     // 显示右侧面板
                    _this.$childCategories.show()

                    //     // 获取触发事件元素的ID
                    var pid = $elem.data('id')
                    if (_this.childcache[pid]) {
                        // 渲染面板内容
                        _this.renderChildCategoies(_this.childcache[pid])
                    } else {
                        //     // 获取要生成的面板内容
                        _this.getChildCategories(pid)
                    }
                }, 300)
            })
                .on('mouseleave', function () {
                    if (_this.categoriesTimer) {
                        clearTimeout(_this.categoriesTimer)
                    }
                    _this.$childCategories.hide().html('')
                    _this.$parentCategories.find('.parent-categories-item').removeClass('active')
                })
        },
        //获取父级分类
        getParentitems: function () {
            var _this = this
            utils.ajax({
                url: '/categories/arrayCategories',
                success: function (data) {
                    if (data.code == 0) {
                        _this.renderParentCategories(data.data)
                    } else {
                        _this.$parentCategories.html(data.messgae)
                    }
                },
                error: function () {
                    _this.$parentCategories.html(data.messgae)
                }
            })
        },
        // 获取子级分类
        getChildCategories: function (pid) {
            var _this = this
            utils.ajax({
                url: '/categories/childArrayCategories',
                data: {
                    pid: pid
                },
                success: function (data) {
                    if (data.code == 0) {
                        // 缓存子类数据
                        _this.childcache[pid] = data.data
                        // 渲染面板内容
                        _this.renderChildCategoies(data.data)
                    }
                }
            })
        },
        // 渲染父级内容
        renderParentCategories: function (list) {
            var _this = this
            var len = list.length
            var html = '<ul>'
            for (var i = 0; i < len; i++) {
                html += `<li class="parent-categories-item" data-id=${list[i]._id}>${list[i].name}</li>`
            }
            html += '</ul>'
            _this.$parentCategories.html(html)
        },
        // 渲染面板内容
        renderChildCategoies: function (list) {
            var len = list.length
            var html = '<ul>'
            for (var i = 0; i < len; i++) {
                html += ` 
               <li class="child-item">
                   <a href="#">
                       <img src="${list[i].icon}" alt="">
                       <p>${list[i].name}</p>
                   </a>
               </li>`
            }
            html += '</ul>'
            this.$childCategories.html(html)
        },

        // 轮播图内容
        handCarousel: function () {
            var _this = this
            utils.ajax({
                url: '/ads/positionAds',
                data: {
                    position: 1
                },
                success: function (data) {
                    if (data.code == 0) {
                        _this.renderCarousel(data.data)
                    }
                }
            })
        },
        // 渲染轮播图界面
        renderCarousel: function (list) {
            var imgs = list.map(function (value) {
                return value.imageUrl
            })
            // 使用插件生成轮播图
            this.$swiper.carousel({
                imgs: imgs,
                width: 800,
                height: 440,
                playInterval: 0,
                type: 'slide',
                loadingurl: './images/load.gif'
            })
        },
        // 热销商品区域
        handProductList: function () {
            var _this = this
            // 防抖处理
            this.$productList.betterFn = utils.debounce(function () {
                //判断是否出现在可视区，如果出现在可视区，就发送请求
                if (utils.isVisibility(_this.$productList)) {
                    utils.ajax({
                        method: 'GET',
                        url: '/products/hot',
                        success: function (data) {
                            _this.renderProductItem(data.data)
                        }
                    })
                }
            }, 300)
            // 绑定触发事件
            this.$win.on('scroll resize load', _this.$productList.betterFn)
        },
        // 渲染热销界面
        renderProductItem: function (list) {
            var _this = this
            var html = ''
            for (var i = 0, len = list.length; i < len; i++) {
                html += `<li class="product-item clo-1">
                <a href="#" class=""><img data-src="${list[i].mainImage}"  src="./images/load.gif">
                    <p class="product-name">${list[i].name}</p>
                    <p class="product-price-box"><span class="product-price">&yen;${list[i].price}</span><span class="product-num">${list[i].payNums}人已经购买</span></p>
                </a>
            </li>`
            }
            this.$productList.html(html)
            // 加载图片
            this.$productList.find('.product-item img').each(function () {
                var $img = $(this)
                var imgSrc = $img.data('src')
                utils.loadImage(imgSrc, function () {
                    $img.attr('src', imgSrc)
                })
            })
            // 移除事件
            this.$win.off('scroll resize load', _this.$productList.betterFn)
        },
        // 楼层区域
        handFloor: function () {
            var _this = this
            // 防抖处理
            this.$floor.betterFn = utils.debounce(function () {
                // 判断是否出现在可视区
                if (utils.isVisibility(_this.$floor)) {
                    utils.ajax({
                        method: 'GET',
                        url: '/floors',
                        success: function (data) {
                            if (data.code == 0) {
                                _this.renderFloor(data.data)
                            }
                        }
                    })
                }
            }, 300)
            // 绑定触发事件
            this.$win.on('scroll resize load', _this.$floor.betterFn)
        },
        // 渲染楼层结构
        renderFloor: function (list) {
            var _this = this
            // 楼层结构
            var html = ''
            // 电梯结构
            var elevatorHtml = ''
            for (var i = 0, len = list.length; i < len; i++) {
                html += `<div class="floor-wrap clearfix f">
                <div class="floor-title">
                    <a href="#" class="link">
                        <h2>F${list[i].num} ${list[i].title}</h2>
                    </a>
                </div>
                <ul class="floor-list ">
                `
                for (var j = 0, len2 = list[i].products.length; j < len2; j++) {
                    var product = list[i].products[j]
                    html += `<li class="floor-item clo-1">
                    <a href="#"><img data-src="${product.mainImage}" src="./images/load.gif"></a>
                    <p class="product-name">${product.name}</p>
                    <p class="product-price-box">
                    <span class="product-price">&yen;${product.price}</span>
                    <span class="product-num">${product.payNums}人已购买</span>
                    </p>
                </li>`
                }
                html += `</ul>
            </div>`
                elevatorHtml += `<a href="javascript:;" class="elevator-item">
            <span class="elevator-item-num">F${list[i].num}</span>
            <span class="elevator-item-text text-ellipsis" data-num="${i}">${list[i].title}</span>
            </a>`
            }
            elevatorHtml += `<a href="javascript:;" class="backToTop">
            <span class="elevator-item-num"><i class="iconfont icon-arrow-up"></i></span>
            <span class="elevator-item-text text-ellipsis" id="backToTop">顶部</span>
        </a>`
            // 楼层结构
            this.$floor.html(html)
            // 结构加载完毕，清除事件
            this.$win.off('scroll load resize', _this.$floor.betterFn)
            this.handFloorImage()
            // 电梯结构
            this.$elevator.html(elevatorHtml)
        },
        handFloorImage: function () {
            var _this = this
            var $floors = $('.floor-wrap')
            //已经加载图片的楼层个数
            var totalLoadedNum = 0
            //需要加载图片的楼层个数
            var totalNum = $floors.length
            $floors.betterFn = utils.debounce(function () {
                // 遍历楼层
                $floors.each(function () {
                    $floor = $(this)
                    // 判断是否出现在可视区
                    if (utils.isVisibility($floor)) {
                        var $imgs = $floor.find('img')
                        $imgs.each(function () {
                            var $img = $(this)
                            var imgSrc = $img.data('src')
                            utils.loadImage(imgSrc, function () {
                                $img.attr('src', imgSrc)
                            })
                        })
                        totalLoadedNum++
                        if (totalLoadedNum == totalNum) {
                            $floors.trigger('end')
                        }
                    }
                })
            }, 300)
            // 绑定触发事件
            this.$win.on('scroll resize load', $floors.betterFn)
            $floors.on('end', function () {
                // 清除事件
                _this.$win.off('scroll resize load', $floors.betterFn)
            })
        },
        handElevator: function () {
            var _this = this
            // 点击电梯，到达指定楼层
            this.$elevator.on('click', '.elevator-item-text', function () {
                $elem = $(this)
                if ($elem.attr('id') == 'backToTop') {
                    $('html,body').animate({
                        scrollTop: 0
                    })
                } else {
                    $('html,body').animate({
                        scrollTop: $('.floor-wrap').eq($elem.data('num')).offset().top
                    })
                }
            })

            // 页面加载完毕，根据楼层显示电梯状态
            var betterFn = utils.debounce(function () {
                _this.setElevator()
            }, 300)
            this.$win.on('scroll resize load', betterFn)
        },
        setElevator: function () {
            var num = this.getFloornum()
            // console.log(num)
            if (num == -1) {
                this.$elevator.hide()
            } else {
                this.$elevator
                    .show()
                    .find('.elevator-item ')
                    .removeClass('elevator-active')
                    .eq(num)
                    .addClass('elevator-active')
            }
        },
        // 获取楼层号
        getFloornum: function () {
            var _this = this
            // 设置默认楼层号
            var num = -1
            $('.floor-wrap').each(function (index) {
                console.log(index)
                $floor = $(this)
                if ($floor.offset().top > _this.$win.scrollTop() + _this.$win.height() / 2) {
                    num = index - 1
                    return false
                }
            })
            return num
        }
    }

    page.init()
})(window, document);