(function ($) {

    var settings = {
        groupId: 'pm_group',                        //整个控件区块ID（注意：不能重复，否则使用会引起错误）
        hiddenId: 'product_manager',                //要填充的隐藏域ID
        textId: 'pmText',                           //要填充的文本框ID
        showPanelClass: 'sear-click',               //弹出框的class名称
        hidewinClass: '',                           //关闭窗口的class名称
        hasSearch: true,                            //是否有搜索区域
        //searchTextId: 'pmsearchText',             //搜索文本框ID
        //searchButtonId: 'pmsearchButton',         //搜索按钮ID
        useCookie: true,                            //是否使用Cookie
        cookieId: '',                               //保存数据到Cookie的主键
        cookieName: 'commonUse_cookie',            //要记录的常用Cookie名称
        cookieCount: 8,                             //要记录的Cookie数量
        ajaxLoad: true,                             //是否发起Ajax请求加载
        ajaxUrl: ''                                 //Ajax请求地址
        //ajaxHtmlDivId: 'pro-manager-list'         //Ajax返回页面的DIV的ID
    }

    $.extend($, {
        MultiSelectControl_c: function (args) {

            args = $.extend({}, settings, args);
            var _cookieValue = "";
            var _selectedIds = [];

            var _ajax_response_div_class = ".ajax_response_list";   //ajax请求页面的顶部标签的class名称

            var $textControl = null;                    //文本框控件
            var $hiddenControl = null;                  //隐藏域控件
            var $serchTextControl = null;               //搜索文本框
            var $searchButtonControl = null;            //搜索按钮
            
            Init();

            //初始化相关控件
            function initControl() {
                $textControl = $('#' + args.textId);
                $hiddenControl = $('#' + args.hiddenId);
                $serchTextControl = $("." + args.groupId + ' .pro-search .button .input-group input');
                $searchButtonControl = $("." + args.groupId + ' .pro-search .button .input-group button');  //$("#" + args.searchButtonId);
                bindEvent();
            }

            //绑定控件事件
            function bindEvent() {
                //搜索，高亮
                if (args.hasSearch) {
                    $searchButtonControl.on('click', function () {
                        debugger;
                        $('.' + args.groupId + ' .checkbox-inline').each(function () {
                            if (!$serchTextControl.val()) {
                                $(this).show();
                            } else {
                                var matchSize = $(this).find("span.hight-light").length;
                                if (matchSize > 0) {
                                    $(this).show();
                                } else {
                                    $(this).hide();
                                }
                            }
                        });
                    });

                    $serchTextControl.on("keyup", function (e) {
                        // debugger;
                        // if (e.keyCode != 13) {
                        if ($.trim($serchTextControl.val()).length >= 1) {
                            var reg = new RegExp("(" + $serchTextControl.val() + ")", "gi");

                            $('.' + args.groupId + ' .checkbox-inline span').each(function () {
                                if ($(this).parent().hasClass('hidden')) {
                                    $(this).parent().removeClass('hidden');
                                }
                                
                                $(this).find('span.hight-light').replaceWith(function () {
                                    return $(this).text();
                                });
                                if (reg.test($(this).text())) {
                                    $(this).html($(this).text().replace(reg, "<span class='hight-light'>$1</span>"));
                                    var proArrow = $(this).parent().parent().parent().find(".pro-arrow i");
                                    if (!proArrow.hasClass("fa-angle-up")) {
                                        proArrow.removeClass().addClass("fa fa-angle-up");
                                        proArrow.parent().parent().next().show(100);
                                    }
                                } 
                                else {
                                    $(this).parent().addClass('hidden');
                                }

                            });

                            $('.' + args.groupId + ' .checkAll').addClass('ele-disabled').prop('disabled', true).css('cursor', 'not-allowed');
                            $('.' + args.groupId + ' .check-all').addClass('ele-disabled').prop('disabled', true).css('cursor', 'not-allowed');

                        } else {
                            $('.' + args.groupId + ' .checkbox-inline span span.hight-light').replaceWith(function () {
                                return $(this).text();
                            });
                            $('.' + args.groupId + ' .checkbox-inline').removeClass('hidden');
                            $('.' + args.groupId + ' .checkAll').removeClass('ele-disabled').prop('disabled', false).css('cursor', 'pointer');
                            $('.' + args.groupId + ' .check-all').removeClass('ele-disabled').prop('disabled', false).css('cursor', 'pointer');

                        } 

                        // } else {
                        //     $searchButtonControl.click();
                        // }

                        e.stopPropagation();
                        return false;
                    });
                }

                // 全选
                $('.' + args.groupId + ' .checkAll').on('click', function () {
                    if ($(this).hasClass('ele-disabled')) return false;

                    if ($(this).hasClass('active')) {
                        $(this).parent().next().find('input[type=checkbox]').prop('checked', false);
                        $(this).parent().next().find('label').removeClass('active');
                        $(this).removeClass('active');
                    } else {
                        $(this).parent().next().find('input[type=checkbox]').prop('checked', true);
                        $(this).parent().next().find('label').addClass('active');
                        $(this).addClass('active');
                    }

                    var pmCheckParent = $(this).parent().parent().hasClass('cookie-group') ? $('.' + args.groupId + ' .pro-group .pro-group-bd') : $('.' + args.groupId + ' .cookie-group .pro-group-bd');
                    $(this).parent().next().find('input[type=checkbox]').each(function () {
                        var check = $(this);
                        var pmCheck = pmCheckParent.find(' input[type=checkbox][value="' + check.val() + '"]');
                        pmCheck.prop('checked', check.prop('checked'));
                        var temp = check.prop('checked') ? pmCheck.parent().addClass('active') : pmCheck.parent().removeClass('active');
                    });
                        
                    fillText();
                });

                // 按钮全选
                $('.' + args.groupId + ' .check-all').on('click', function () {
                    if ($(this).hasClass('ele-disabled')) return false;

                    $('.' + args.groupId + ' input[type=checkbox]').prop('checked', true);
                    $('.' + args.groupId + ' .checkbox-inline').addClass('active');
                    $('.' + args.groupId + ' .checkAll').addClass('active');
                        
                    fillText();
                });

                // 按钮清空
                $('.' + args.groupId + ' .check-null').on('click', function () {
                    $('.' + args.groupId + ' input[type=checkbox]').prop('checked', false);
                    $('.' + args.groupId + ' .checkbox-inline').removeClass('active');
                    $('.' + args.groupId + ' .checkAll').removeClass('active');
                        
                    fillText();
                });

                //点击展开关闭
                $('.' + args.groupId + ' .pro-arrow').on('click', function () {
                    $(this).find('i').toggleClass('fa-angle-up');
                    $(this).find('i').toggleClass('fa-angle-down');
                    $(this).parent().next().slideToggle(100);
                });

                //checkbox选中
                $('.' + args.groupId).delegate('.checkbox-inline input[type=checkbox]', 'click', function () {
                    var selectItemParent = $(this).parent().parent().parent().hasClass('cookie-group') ? $('.' + args.groupId + " .pro-group .pro-group-bd") : $('.' + args.groupId + " .cookie-group .pro-group-bd");
                    var checks = $(this);
                    var selectItem = selectItemParent.find('.checkbox-inline input[type=checkbox][value="' + checks.val() + '"]');
                    
                    if (!checks.prop('checked')) {
                        checks.prop('checked', false);
                        $(this).parent().removeClass('active');

                        selectItem.prop('checked', false);
                        selectItem.parent().removeClass('active');

                    } else {
                        checks.prop('checked', true);
                        $(this).parent().addClass('active');

                        selectItem.prop('checked', true);
                        selectItem.parent().addClass('active');
                    }
                        
                    fillText();
                });

                // //解决iframe跨域
                // try {
                //     //点击空白处时关闭弹窗
                //     if (top.document) {
                //         $(top.document).on('mousedown', function (e) {
                //             closeWin($(e.target));
                //         });
                //     }
                // } catch (e) { }
            }

            //填充文本框
            function fillText() {
                // $textControl.children().not('.prefix_tit').not('.tit').remove();
                $textControl.children().not('.prefix_tit').not('.tit').not('.hidemore').not('.showmore').remove();
                var minHeight = $textControl.height();
                var num = 0;
                var allChoose = true;//判断全选是否选中
                var titFlag = true;//title只添加一次
                _selectedIds = [];
                var proGroup = $('.' + args.groupId + ' .pro-group');

                var selectArr = [];
                var selectIdArr = [];
                proGroup.each(function () {
                    var title = $(this).find('.pro-group-tit strong').text();
                    var selectObj = {};
                    var select_obj_arr = [];
                    var selectObj_id = {};
                    var select_id_arr = [];
                    var selectFlag = true;
                    
                    $(this).find('.checkbox-inline input[type=checkbox]').each(function () {
                        var checks = $(this);

                        if (checks.prop('checked')) {
                            var value = $.trim(checks.val());
                            var text = $.trim(checks.parent().text());

                            if ($.inArray(value, _selectedIds) == -1) {//去重
                                if (num == 0) {
                                    _cookieValue = (value + ',' + text);
                                } else {
                                    _cookieValue = (num < args.cookieCount) ? (_cookieValue + ';' + value + ',' + text) : _cookieValue;
                                }

                                num++;
                                _selectedIds.push(value);

                                select_obj_arr.push(text);
                                selectObj[title] = select_obj_arr;
                                select_id_arr.push({ value: value, text: text });
                                selectObj_id[title] = select_id_arr;

                                if (selectFlag && args.groupId == 'Account_text') {//Account_text类型才需要group-title
                                    $textControl.append('<span class="group-title">' + title + '</span>');
                                }
                                selectFlag = false;
                                $textControl.append('<a class="group_item" title="' + text + '">' + text + ';</a>');
                            }
                        } else {
                            allChoose = false;
                        }
                    })

                    if (!selectFlag) {
                        selectArr.push(selectObj);
                        selectIdArr.push(selectObj_id);
                    }
                        
                })

                writeCookie();

                if (selectIdArr.length) {
                    setStorage(mailAutoRule_step2, args.cookieId, selectIdArr);
                } else {
                    var obj = getStorage(mailAutoRule_step2);
                    delete obj[args.cookieId];
                    storage.setItem(mailAutoRule_step2, JSON.stringify(obj));
                }
                    
                if (!$textControl.find('.hidemore').length && !$textControl.find('.showmore').length) {
                  if($textControl.height() > minHeight * 2)  {
                      $textControl.parent().height(minHeight * 2 - 2);
                      $textControl.css({'padding-right': 56});
                      $textControl.find('.tit').after('<span class="showmore">展示更多</span>');
                  } else {
                      $textControl.parent().height('auto');
                  }
                } else if ($textControl.find('.hidemore').length && !$textControl.find('.showmore').length) {
                  $textControl.parent().height('auto');
                  if($textControl.height() <= minHeight * 2)  {
                      $textControl.css({'padding-right': 0});
                      $textControl.find('.hidemore').remove();
                  }
                }

                if (num) {
                    $textControl.parent().parent().find('.tit').addClass('hidden');
                } else {
                    $textControl.css({'padding-right': 0});
                    $textControl.parent().parent().find('.tit').removeClass('hidden');
                    $textControl.children().not('.prefix_tit').not('.tit').remove();
                }

                $('.'+args.showPanelClass).find('.count-num').text(num);

                groupCheckAll();

                //全选不填充隐藏域
                if (allChoose) {
                    $hiddenControl.val('');
                    _cookieValue = '';
                }
            }

            //检测左边关键词高度, 与以下 keywordHideRest 一起使用
            //初始高度
            function keywordHide (_cur){
              if (_cur.height() > _minHeight*2) {
                  return false;
              } else {
                return true;
              }
            }

            //显示展示更多按钮
            function keywordHideRest (_cur){
              if (!_cur.find('.showmore').length && !_cur.find('.hidemore').length) {
                _cur.parent().height(_minHeight * 2 - 2);
                
              } 
            }

            //检查各个分组的全选选项是否选中
            function groupCheckAll() {
                var allChoose = true;
                if ($('.' + args.groupId + " .cookie-group .pro-group-bd input[type=checkbox]") && $('.' + args.groupId + " .cookie-group .pro-group-bd input[type=checkbox]").length > 0) {
                    $('.' + args.groupId + " .cookie-group .pro-group-bd input[type=checkbox]").each(function () {
                        if (!$(this).prop("checked")) {
                            allChoose = false;
                            return;
                        }
                    });
                    allChoose && $('.' + args.groupId + " .cookie-group .pro-group-bd input[type=checkbox]").length > 0 ? $('.' + args.groupId + ' .cookie-group .checkAll').addClass("active") : $('.' + args.groupId + ' .cookie-group .checkAll').removeClass("active");
                }

                $('.' + args.groupId + " .pro-group").each(function () {
                    allChoose = true;
                    $(this).find("input[type=checkbox]").each(function () {
                        if (!$(this).prop("checked")) {
                            allChoose = false;
                            return;
                        }
                    });

                    allChoose && $(this).find("input[type=checkbox]").length > 0 ? $(this).find('.checkAll').addClass("active") : $(this).find('.checkAll').removeClass("active");
                });
            }

            function Init () {
                var $dropdown = $('.' + args.groupId + ' .' + args.showPanelClass);
                $dropdown.show();
                if ($dropdown.outerWidth() + $dropdown.offset().left > $(window).width()) {
                    $dropdown.css('right', 0).parent().css('position', 'relative');
                }

                $(this).prop('readonly', 'readonly').css('background-color', 'white');

                if (args.ajaxLoad) {
                    $.ajax({
                        url: args.ajaxUrl,
                        type: 'get',
                        dataType: 'html',
                        beforeSend: function (xhr) {
                            $dropdown.html("<div>加载中...</div>");
                        },
                        success: function (data) {
                            $dropdown.html($(data).filter(_ajax_response_div_class).html());
                            readCookie();
                            initControl();
                            var _num = 0;
                            var maxCount = $('.pro-group').find('input[type=checkbox]').length;
                            //读取cookie
                            var itemArr = getStorage(mailAutoRule_step2, args.cookieId);
                            var arr_length = 0;
                            for (i in itemArr) {
                                for(key in itemArr[i]) {
                                    arr_length += itemArr[i][key].length;
                                }
                            }
                            
                            if (typeof itemArr != 'undefined' && itemArr != '') {
                                if(arr_length == maxCount) {
                                    $('.' + args.groupId + ' .check-all').click();
                                } else {
                                    if (itemArr.length) {
                                        for (i in itemArr) {
                                            for(key in itemArr[i]) {
                                                for (j in itemArr[i][key]) {
                                                    _num++;
                                                    var _that = $('.' + args.groupId + ' .checkbox-inline input[value="'+ itemArr[i][key][j].value +'"]');
                                                    _that.prop('checked', true);
                                                    _that.parent().addClass('active');
                                                }
                                            }
                                        }
                                        $('.'+args.showPanelClass).find('.count-num').text(_num);
                                        groupCheckAll();
                                    }
                                }

                            }
                        },
                        error: function (xhr, text) {
                            $dropdown.html("<div style='color:red;'>出错了！</div>");
                        }
                    });
                } else {
                    readCookie();
                    initControl();
                }
            }

            //读取Cookie
            function readCookie() {
                if (args.useCookie) {
                    //读取cookie
                    var cookieItmes = $.cookie(args.cookieId) ? $.cookie(args.cookieId).toString().split(';') : [];
                    $('.' + args.groupId + ' .cookie-group .pro-group-bd').empty();
                    $('.' + args.groupId + ' .cookie-group .pro-group-tit .checkAll').removeClass('active');
                    var count = 0;
                   
                    for (var index in cookieItmes) {
                        if ((count++) < args.cookieCount) {
                            var item = cookieItmes[index].split(',');
                            if (item && item.length == 2) {
                                if ($.inArray(item[0], _selectedIds) > -1) {
                                    var html = '<label class="checkbox-inline active"><input type="checkbox" value="' + item[0] + '" checked="true"><span>' + item[1] + '</span></label>';
                                    $('.' + args.groupId + ' .cookie-group .pro-group-bd').append(html);
                                } else {
                                    var html = '<label class="checkbox-inline"><input type="checkbox" value="' + item[0] + '"><span>' + item[1] + '</span></label>';
                                    $('.' + args.groupId + ' .cookie-group .pro-group-bd').append(html);
                                }

                            }
                        }
                    }

                    groupCheckAll();

                    //常用为空时，展开分组
                    if (count == 0) {
                        var proArrow = $('.'+ args.groupId +' .pro-arrow i');
                        proArrow.eq(1).removeClass().addClass('fa fa-angle-up');
                        //全部展开
                        // proArrow.parent().parent().next().show(100);
                        //展开一个
                        proArrow.eq(1).parent().parent().next().show(100);
                    }
                }
            }

            //写入Cookie
            function writeCookie() {
                if (args.useCookie) {
                    //存入Cookie
                    if (_cookieValue && _cookieValue.split(';').length >= args.cookieCount) {
                        $.cookie(args.cookieId, _cookieValue, { expires: 365, path: '/' });
                    } else {
                        var newItems = _cookieValue ? _cookieValue.split(';') : [];
                        var oldItems = $.cookie(args.cookieId) ? $.cookie(args.cookieId).split(';') : [];

                        for (var index in oldItems) {
                            if ($.inArray(oldItems[index], newItems) <= -1 && newItems.length < args.cookieCount) {
                                newItems.push(oldItems[index]);
                            }
                        }
                        
                        $.cookie(args.cookieId, newItems.join(';'), { expires: 365, path: '/' });
                    }
                }
            }
        }
    });

})(jQuery);
