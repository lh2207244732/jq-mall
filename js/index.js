(function(w, d) {
    var page = {
        init: function() {
            // 顶部购物车
            this.$cartBox = $('.cart-box')
            this.$cartCount = $('.cart-count')
            this.$cartContent = $('.cart-content')
            this.handleCart()
                // 搜索框
                // this.$searchInput = $('.search-input')
                // this.$searchVal = $('.search-input input')
                // this.$searchBtn = $('.search-btn')
                // this.$searchLayer = $('.search-layer')
                // this.handSearch()
                // 焦点区域
            this.$categories = $('.categories')
            this.$parentCategories = $('.parent-categories')
            this.$childCategories = $('.child-categories')
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
            this.$elevator = $('.elevator')
            this.handFloor()
                // this.handElevator()
                // this.searchInput = d.querySelector('.search-input')
                // this.searchVal = d.querySelector('.search-input input')
                // this.searchBtn = d.querySelector('.search-btn')
                // this.searchLayer = d.querySelector('.search-layer')
                // this.categories = d.querySelector('.categories')
                // this.parentCategories = d.querySelector('.parent-categories')
                // this.childCategories = d.querySelector('.child-categories')
                // this.productList = d.querySelector('.hot .product-list')
                // this.floor = d.querySelector('.floor')
                // this.elevator = d.querySelector('.elevator')
                // this.searchTimer = null
                // this.categoriesTimer = null
                // this.elevatorTimer = null
                // this.elevatorItem = null
                // this.floors = null
                // this.handleCart()
                // this.handSearch()
                // this.handCategories()
                // this.handCarousel()
                // this.handProductList()
                // this.handFloor()
                // this.handElevator()
        },
        // 顶部购物车
        handleCart: function() {
            var _this = this
                // 显示购物车中商品数量
            this.loadCartsCount()
                // 当鼠标进入购物车时
            this.$cartBox.on('mouseenter', function() {
                    // 显示下拉购物车
                    _this.$cartContent.show()
                        //添加等待框动画
                    _this.$cartContent.html('<div class="loader"></div>')
                        // 发送ajax请求
                    utils.ajax({
                        method: 'GET',
                        url: '/carts',
                        success: function(data) {
                            if (data.code == 0) {
                                // 如果状态码为0则请求成功，渲染请求内容
                                _this.renderCart(data.data.cartList)
                            } else {
                                //请求失败
                                _this.$cartContent.html('<span class="empty-cart">请求失败,请稍后再试</span>')
                            }
                        },
                        error: function() {
                            _this.$cartContent.html('<span class="empty-cart">请求失败,请稍后再试</span>')
                        }
                    })
                })
                // 隐藏下拉购物车
            this.$cartBox.on('mouseleave', function() {
                _this.$cartContent.hide()
            })
        },
        // 改变购物车数字
        loadCartsCount: function() {
            var _this = this
            utils.ajax({
                method: 'GET',
                url: '/carts/count',
                success: function(data) {
                    if (data.code == 0) {
                        _this.$cartCount.html(data.data)
                    }
                }
            })
        },
        // 渲染购物车下拉框
        renderCart: function(list) {
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
        handSearch: function() {
            var _this = this
                // 监听点击搜索事件
            this.$searchBtn.on('click', function() {
                    _this.handClick()
                })
                // this.searchBtn.addEventListener('click', function() {
                //         _this.handClick()
                //     }, false)
                // 监听输入事件,自动提示
            this.searchVal.addEventListener('input', function() {
                    // 防抖，多次输入，只执行最后一次
                    if (_this.searchTimer) {
                        console.log(111);
                        clearInterval(_this.searchTimer)
                    }
                    _this.searchTimer = setTimeout(function() {
                        _this.getSearchData()
                    }, 500)
                }, false)
                // 点击其他地方时，隐藏下拉框
            d.addEventListener('click', function() {
                    utils.hide(_this.searchLayer)
                }, false)
                // 阻止输入框的点击操作冒泡
            this.searchVal.addEventListener('click', function(ev) {
                    ev.stopPropagation()
                }, false)
                // 监听重新获取光标时
            this.searchVal.addEventListener('focus', function() {
                // 获取输入框内容
                var keyword = _this.searchVal.value
                if (!keyword) {
                    _this.searchLayer.innerHTML = ''
                    utils.hide(_this.searchLayer)
                } else {
                    // 显示下拉框
                    utils.show(_this.searchLayer)
                }
            }, false)


        },
        getSearchData: function() {
            var _this = this
            var keyword = this.searchVal.value
            if (!keyword) {
                _this.searchLayer.innerHTML = ''
                utils.hide(_this.searchLayer)
            } else {
                utils.ajax({
                    url: '/products/search',
                    data: {
                        keyword: keyword
                    },
                    success: function(data) {
                        if (data.code == 0) {
                            _this.renderSearch(data.data)
                        }
                    }
                })
            }
        },
        renderSearch: function(list) {
            var len = list.length
            var html = ''
            for (var i = 0; i < len; i++) {
                html += `<li class="search-item">${list[i].name}</li>`
            }
            utils.show(this.searchLayer)
            this.searchLayer.innerHTML = html
        },
        //点击搜索提交搜索内容
        handClick: function() {
            var keyword = this.searchVal.value
            w.location.href = './list.html?keyword=' + keyword
        },


        handCategories: function() {
            var _this = this
                // 获取父级分类
            this.getParentitems()

            // 利用事件代理监听父元素中子元素的切换
            this.$parentCategories.on('mouseover', '.parent-categories-item', function() {
                    // 储存本次鼠标移入的元素返回的jQuery对象
                    var $elem = $(this)
                    if (_this.categoriesTimer) {
                        clearTimeout(_this.categoriesTimer)
                    }
                    setTimeout(function() {
                        //     // 获取触发事件元素的ID
                        var pid = $elem.data('id')
                            //     // 显示右侧面板
                        _this.$childCategories.show()
                            //     // 获取要生成的面板内容
                        _this.getChildCategories(pid)

                    }, 100)
                })
                // this.parentCategories.addEventListener('mouseover', function(ev) {
                //         //添加防抖
                //         if (_this.categoriesTimer) {
                //             clearTimeout(_this.categoriesTimer)
                //         }
                //         setTimeout(function() {
                //             var elem = ev.target
                //             if (elem.className == 'parent-categories-item') {
                //                 // 获取触发事件元素的ID
                //                 var pid = elem.getAttribute('data-id')
                //                     // 显示右侧面板
                //                 utils.show(_this.childCategories)
                //                     // 获取要生成的面板内容
                //                 _this.getChildCategories(pid)
                //             }
                //         }, 100)
                //     }, false)
                //     //监听鼠标移出事件
                // this.categories.addEventListener('mouseleave', function() {
                //     //清除右侧内容并隐藏右侧内容
                //     _this.childCategories.innerHTML = ''
                //     utils.hide(_this.childCategories)
                // }, false)
        },
        //获取父级分类
        getParentitems: function() {
            var _this = this
            utils.ajax({
                url: '/categories/arrayCategories',
                success: function(data) {
                    if (data.code == 0) {
                        //渲染父级分类内容
                        _this.renderParentCategories(data.data)
                    } else {
                        _this.$parentCategories.html(data.messgae)
                    }
                },
                error: function() {
                    _this.$parentCategories.html(data.messgae)
                }
            })
        },
        // 获取子级分类
        getChildCategories: function(pid) {
            var _this = this
            utils.ajax({
                url: '/categories/childArrayCategories',
                data: {
                    pid: pid
                },
                success: function(data) {
                    if (data.code == 0) {
                        // 渲染面板内容
                        console.log(111)
                        _this.renderChildCategoies(data.data)
                    }
                }
            })
        },
        // 渲染父级内容
        renderParentCategories: function(list) {
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
        renderChildCategoies: function(list) {
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
        handCarousel: function() {
            var _this = this
            utils.ajax({
                url: '/ads/positionAds',
                data: {
                    position: 1
                },
                success: function(data) {
                    if (data.code == 0) {
                        _this.renderCarousel(data.data)
                    }
                }
            })
        },
        // 渲染轮播图界面
        renderCarousel: function(list) {
            var imgs = list.map(function(value) {
                    return value.imageUrl
                })
                // 使用插件生成轮播图
            this.$swiper.carousel({
                imgs: imgs,
                width: 800,
                height: 440,
                playInterval: 0,
                type: 'fade'
            })
        },
        // 热销商品区域
        handProductList: function() {
            var _this = this
                // 用防抖函数包装
            var betterFn = utils.debounce(function() {
                    // 判断是否已经加载过
                    if (_this.$productList.data('isLoaded')) {
                        return
                    }
                    //判断是否出现在可视区
                    if (utils.isVisibility(_this.$productList)) {
                        utils.ajax({
                            method: 'GET',
                            url: '/products/hot',
                            success: function(data) {
                                // 渲染热销界面
                                _this.renderProductItem(data.data)
                            }
                        })
                    }

                }, 300)
                // 绑定触发事件
            this.$win.on('scroll resize load', betterFn)
        },
        // 渲染热销界面
        renderProductItem: function(list) {
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
                //保存加载状态
            this.$productList.data('isLoaded', true)
                // 加载图片

        },
        // 楼层区域
        handFloor: function() {
            var _this = this
            utils.ajax({
                method: 'GET',
                url: '/floors',
                success: function(data) {
                    if (data.code == 0) {
                        _this.renderFloor(data.data)
                    }
                }
            })
        },
        // 渲染楼层结构
        renderFloor: function(list) {
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
                // 电梯结构
            this.$elevator.html(elevatorHtml)
            this.floors = d.querySelectorAll('.floor-wrap')
            this.elevatorItems = d.querySelectorAll('.elevator-item')
        },
        handElevator: function() {
            var _this = this
                // 点击电梯，到达指定楼层
            this.$elevator.on('click', function(ev) {
                    var elem = ev.target
                    var num = elem.getAttribute('data-num')
                    if (elem.id == 'backToTop') {
                        d.documentElement.scrollTop = 0
                    } else if (elem.className == 'elevator-item-text text-ellipsis') {
                        var floor = _this.floors[num]
                        d.documentElement.scrollTop = floor.offsetTop
                    }
                })
                // 页面加载完毕，电梯状态
            w.addEventListener('load', betterSetElevator, false)
            var betterSetElevator = function() {
                    if (_this.elevatorTimer) {
                        clearTimeout(_this.elevatorTimer)
                    }
                    _this.elevatorTimer = setTimeout(function() {
                        _this.setElevator()
                    }, 200)
                }
                // 监听滚动条事件
            w.addEventListener('scroll', betterSetElevator, false)
        },
        setElevator: function() {
            var _this = this
            var res = this.getFloornum()
            if (res == -1) {
                // 如果在-1层，隐藏电梯
                utils.hide(_this.elevator)
            } else {
                // 显示电梯
                utils.show(_this.elevator)
                    // 遍历电梯
                for (var i = 0, len = _this.elevatorItems.length; i < len; i++) {
                    if (res == i) {
                        console.log(i)
                        _this.elevatorItems[i].className = 'elevator-item elevator-active'
                    } else {
                        _this.elevatorItems[i].className = 'elevator-item'
                    }
                }
            }
        },
        getFloornum: function() {
            // 设置默认楼层号
            var num = -1

            for (var i = 0, len = this.floors.length; i < len; i++) {
                num = i
                var floors = this.floors[i]
                if (floors.offsetTop > d.documentElement.scrollTop) {
                    num = i - 1
                    break
                }
            }

            return num
        }
    }
    page.init()
})(window, document);