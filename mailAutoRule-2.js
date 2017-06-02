requirejs(['https://content.banggood.cn/Content/config.js'], function () {
  requireBundle([
    '@edit'
    ], function() {
    //取消
    $('#btnClose').bindClose();
    // $('#btnNext').bindSubmit();
  // });
  requirejs(['ui'], function(ui) {
    //上一步
    $('#btnPrev').click(function(){
      window.location.href = "mailAutoRule-1.html";
    });
    //下一步
    $('#btnNext').click(function(){
      var flag = true;
      $('.checkbox-inline.require').each(function(){
        var child = $(this).find('.checkbox-msg').children().not('.prefix_tit').not('.tit').length;
        if (!child) {
          flag = false;
          transForm(this);
          ui.message.error({
            title: '失败提示',
            content: $(this).find('.checkbox-msg').find('.tit').text()
          });
          return false;
        }
      })
      if (flag) {
        window.location.href = "mailAutoRule-3.html";
      }
    });


    /* 
    * 左模块
    */
    //初始高度
    var current = $('#form-mail label').eq(0);
    var _showMore = 55;
    var minHeight = current.find('.checkbox-msg').height();
    // var Init = {
    //   initOption: function (){

    //   },
    //   initOptionData: function (){

    //   }
    // };
    //初始化已选条件
    if (getStorage(mailAutoRule_step1)) {
      var selectList = getStorage(mailAutoRule_step1);
      for (_k in selectList) {
        var _s = '#'+_k;
        if ($(_s).length > 0) {
          for (_v in selectList[_k]) {
            $(_s).find('.check-bar').each(function(_ind, _ele){
              if ($(this).attr('value') == selectList[_k][_v]) {
                selectOption($(this).parent());
              }
            })
          }
          if ($('#'+$(_s).attr('toform')).find('label').length <= 0) {
            $('#'+$(_s).attr('toform')).hide();
          }
        }
      }
    }

    //初始化数据
    var storageArr = getStorage(mailAutoRule_step2);
    if (storageArr) {
      for (key in storageArr) {
        if (storageArr[key].length) {

          var textControl = $('.form-select #'+key);
          var dtlink = textControl.parent().data('link');
          textControl.find('.tit').addClass('hidden');

          if (dtlink == 'multiSelect_temp') {
            for (i in storageArr[key]) {
              for (_key in storageArr[key][i]) {
                textControl.append('<span class="group-title">'+ _key +'</span>');
                
                for (j in storageArr[key][i][_key]) {
                  textControl.append('<a class="group_item">'+ storageArr[key][i][_key][j].text +';</a>');

                  if (!keywordHide(textControl)) {
                    keywordHideRest(textControl);
                  } 
                }
              }
            }

          } else if (dtlink == 'keyWord_temp') {
            for (_i in storageArr[key]) {
              var _html = '<a>'+ storageArr[key][_i] +';</a>';
              textControl.append(_html);
              keywordLength(textControl);
              if (!keywordHide(textControl)) {
                keywordHideRest(textControl);
              }
            }

          } else if (dtlink == 'Date_temp' || dtlink == 'Value_temp') {
            for (i in storageArr[key]) {
              dateShow(storageArr[key][i], textControl);
            }
          }
        } 
      }
    }

    //隐藏右边栏
    $('.side-bar').click(function(){
      $(this).toggleClass('active');
      if ($(this).parent().hasClass('active')) {

        $(this).parent().next().show();
      } else {
        $(this).parent().next().hide();
      }
      $(this).parent().toggleClass('active');

      $('.form-select').find('.checkbox-msg').each(function(){
        if (!keywordHide($(this))) {
          keywordHideRest($(this));
        } else {
          $(this).parent().height('auto');
          $(this).find('.showmore').remove();
          $(this).find('.hidemore').remove();
          $(this).css({'padding-right': 0});
        }
      })
    });

    //展开可选条件
    $(document).on('click', '#form-group-bar .pro-arrow', function () {
        $(this).find('i').toggleClass('fa-angle-up');
        $(this).find('i').toggleClass('fa-angle-down');
        $(this).parents('#form-group-bar').next().slideToggle(100);
    });

    //默认先加载
    var cookieKey = $('.form-select .form-group-item.active .checkbox-inline').find('.checkbox-msg').attr('id');
    transForm($('.form-select .form-group-item.active .checkbox-inline'));
    
    //切换右侧条件
    $(document).delegate('.form-select .checkbox-inline', 'click', function(){
      if ($('.container-form').hasClass('active')) {
        $('.side-bar').click();
      }
      if ($(this).find('.prefix_tit').text() == $('#form-head-tit').find('.prefix_tit').text()) {
        return false;
      } else {
        transForm(this);
      }
    });

    //切换
    function transForm (_this) {
      console.log(33)
      var _Link = $(_this).data('link');
      var _Class = $(_this).find('.checkbox-msg').attr('id');
      var Id = $(_this).find('.checkbox-msg').attr('id');
      cookieKey = Id;
      
      //添加选中状态
      if ($(_this).closest('.group-toggle')) {
        $('.group-toggle').removeClass('active');
        $(_this).closest('.group-toggle').addClass('active');
        // $(_this).closest('.group-toggle').find('.checkbox-inline').css({'margin-bottom': '-2px'});
      }
      //获取title
      $('#form-head-tit').html($(_this).find('.prefix_tit').prop('outerHTML')+$(_this).find('.tit').prop('outerHTML'));
      
      if ($('#form-head-tit .tit').hasClass('hidden')) {
        $('#form-head-tit .tit').removeClass('hidden');
      }

      $('#form_main').find('.form-content').children().hide();
      if ($('#form_main').find('.'+_Class).length) {
        $('#form_main').find('.'+_Class).show();

      } else {
        if (_Link) {

          for (i in template_Arr) {
            for (temp_name in template_Arr[i]) {
              if (_Link == temp_name) {
                $('#form_main .form-content').append($(template_Arr[i][temp_name]).addClass(_Class));

                // 动态加入页面的元素需要手动触发重新生成表单验证规则，
                // 要不自定义的验证信息获取不到。
                // $('form').removeData('validator unobtrusiveValidation');
                // $.validator.unobtrusive.parse($('form'));

                fillData(_Link, _this);

                if (temp_name == 'multiSelect_temp') {
                  $.MultiSelectControl_c({
                    groupId: _Class,
                    hiddenId: 'MailAutomatic_inputhidden',
                    textId: Id,
                    showPanelClass: 'sear-click',
                    hidewinClass: '',       //关闭窗口class名称
                    cookieId: Id,
                    cookieCount: 8,
                    ajaxLoad: true,
                    // ajaxUrl: 'https://easale.banggood.cn/SCBeBay/ProductManagerUniteRelate/ProductManagerMultiSelect',
                    ajaxUrl: baseUrl + Id + '.htm'
                  });
                }
                return false;
              }
            } 
          }
        }
      } 
    }

    //切换读取并填充cookie数据
    function fillData (_linkName, _that){
      var cookieData = getStorage(mailAutoRule_step2, cookieKey);

      if(typeof cookieData == 'undefined' || cookieData == '') {
        return false;
      } else {
        switch (_linkName) {
          case 'keyWord_temp':
            keyWord_fd($('#form_main .'+$('.form-select label.active').find('.checkbox-msg').attr('id')+' .count-num'), _that, cookieData);
            break;
          case 'Date_temp':
          case 'Value_temp':
            Range_fd($('#form_main .'+$('.form-select label.active').find('.checkbox-msg').attr('id')+' .form-range'), _that, cookieData);
            break;
          default: break;
        }
      }  
    }

    //不同模板的不同数据添加方法
    //关键词添加
    function keyWord_fd (_c, _that, _cookieData){
      keywordCount(_c, _cookieData.length);
      if (_cookieData.length > 0 && _c.find('.form-keyword').is(':hidden')) {
        _c.find('.form-keyword').removeClass('hidden');
      }
      $(_that).find('.checkbox-msg').find('a:not(.tit)').remove();
      $('.'+$(_that).find('.checkbox-msg').attr('id')).find('li').remove();
      for (i in _cookieData) {
        addKeyword($('.'+$(_that).find('.checkbox-msg').attr('id')+' .addKeyWords'), $(_that).find('.checkbox-msg'), _cookieData[i]);
        if (!keywordHide($(_that).find('.checkbox-msg'))) {
          keywordHideRest($(_that).find('.checkbox-msg'));
        }
      }
    }

    //范围选择
    function Range_fd (_c, _that, _cookieData){
      $(_that).find('.checkbox-msg').children().not('.tit').not('.prefix_tit').remove();
      for (i in _cookieData) {
        var cur = _c.find('.'+ _cookieData[i]._id);
        cur.find('.check-bar').addClass('active');
        cur.find('.date_range_select').val(_cookieData[i].range);
        cur.find('.date-Input').val(_cookieData[i].days);
        dateShow(_cookieData[i]);
      }
    }

    //勾选 ---- 可选条件()
    $('.form-optional').delegate('.checkbox-inline','click', function(){
      selectOption(this);
    });

    //选择条件
    function selectOption (_this){
      var formSelector = $(_this).data('for');
      var dataText = $(_this).data('link');
      var dataLink = dataText ? 'data-link='+ dataText : '';
      var dataFor = formSelector == 'form-order' ? 'data-for="order-select"' : 'data-for="mail-select"';
      
      if (!$(_this).parent().siblings().length) {
        $(_this).parents('.form-group').hide();
      }
      if ($('#'+ formSelector).is(':hidden')) {
        $('#'+ formSelector).show();
      }
      
      var msg = $(_this).find('.checkbox-msg').prop('outerHTML');
      var html = '<label class="form-group-item group-toggle">'+
                    '<div class="checkbox-inline"'+ dataLink +'>'+
                      '<i class="fa fa-fw fa-times"'+ dataFor +'></i>'+ msg +
                    '</div>'+
                  '</label>';
      
      $('#'+ formSelector).find('.form-group-bd').append(html);
      $(_this).parent().remove();
    }

    //删除已选条件
    $('.form-select').delegate('.fa.fa-fw.fa-times', 'click', function(e){
      if ($(this).hasClass('disabled')) {
        return false;
      } else {
        //删除选中状态的条件，右边栏默认切换为下一条件，如果选中条件为最后一条，默认显示第一条
        var tt = $(this).parent().parent();

        if (tt.hasClass('active')) {
          if (tt.next().length) {
            tt.next().addClass('active');
            var that = tt.next().find('.checkbox-inline');
          } else if ($(tt).parents('.form-group').next('.form-group').length) {
            $(tt).parents('.form-group').next('.form-group').find('label').eq(0).addClass('active');
            var that = $(tt).parents('.form-group').next('.form-group').find('label').eq(0).find('.checkbox-inline');
          } else {
            $('#form-account').find('label').addClass('active');
            var that = $('#form-account').find('label').find('.checkbox-inline');
          }

          transForm(that);
        }

        e.stopPropagation();
        deleteOption(this);
        deleteOption_storage(this);
      }
    });

    //删除条件
    function deleteOption (_this) {
      var formSelector = $(_this).data('for');
      var dataText = $(_this).parent().data('link');
      var dataLink = dataText ? 'data-link='+ dataText : '';
      var dataFor = formSelector == 'order-select' ? 'data-for="form-order"' : 'data-for="form-mail"';
      
      if (!$(_this).parent().parent().siblings().length) {
        $(_this).parents('.form-group').hide();
      }
      if ($('#'+ formSelector).is(':hidden')) {
        $('#'+ formSelector).show();
      }
      
      var _cur = $(_this).next('.checkbox-msg');
      var msg = _cur.find('.prefix_tit').prop('outerHTML') + _cur.find('.tit').prop('outerHTML');
      var html = '<label class="form-group-item">'+
                    '<div class="checkbox-inline"'+ dataFor + dataLink +'>'+
                      '<div class="check-bar"></div>'+ 
                       '<div class="checkbox-msg" id="'+ _cur.attr('id') +'">'+ msg +'</div>'+
                    '</div>'+
                  '</label>';
      $('#'+ formSelector).find('.form-group-bd').append(html);
      $('#'+ formSelector).find('.form-group-bd').find('.tit').removeClass('hidden');
      $(_this).parent().parent().remove();
      $('#form_main .form-content').find('.'+$(_this).parent().find('.checkbox-msg').attr('id')).remove();
    }

    //删除该条件的数据
    function deleteOption_storage (_that){
      var _id = $(_that).next('.checkbox-msg').attr('id');
      var obj = getStorage(mailAutoRule_step2);
      delete obj[_id];
      storage.setItem(mailAutoRule_step2, JSON.stringify(obj));
    }

    //展开更多的关键字
    $('.form-select').delegate('.showmore', 'click', function(){
      showMoreWord(this);
    });

    //收起更多的关键字
    $('.form-select').delegate('.hidemore', 'click', function(){
      hideMoreWord(this);
    });

    //全部展开
    $('#allopen').click(function(){
      $('.form-select').find('.showmore:not(:hidden)').each(function(){
        showMoreWord(this);
      })
    });

    //全部折叠
    $('#allfold').click(function(){
      $('.form-select').find('.hidemore').each(function(){
        hideMoreWord(this);
      })
    });

    //展开
    function showMoreWord (_that){
      $(_that).parent().parent().height('auto');
      $(_that).parent().find('.tit').after('<span class="hidemore">收起</span>');
      $(_that).remove();
    }

    //收起
    function hideMoreWord (_that){
      $(_that).parent().parent().height(minHeight * 2 - 2);
      $(_that).parent().find('.tit').after('<span class="showmore">展示更多</span>');
      $(_that).remove();
    }


    /* 
    * 右模块
    */
    /* 
    * 邮件问题标签模块
    */
    $(document).delegate('.check-null', 'click', function(){
      $('.form-select label.active').find('.checkbox-msg').css({'padding-right': 0});
      $('.form-select label.active').find('.checkbox-msg').parent().height('auto');
    });
    //回车添加关键词
    $(document).on('keydown',function(event){
      var oEvent = event || window.event;
      if (oEvent.keyCode == '13') {
        stopDefault(oEvent);
        $('.'+$('.form-select label.active').find('.checkbox-msg').attr('id')+' .addKeyWords').click();
      }
    });

    //按钮添加关键词
    $('#form_main').delegate('.addKeyWords', 'click', function(){
      var keyword = $(this).parents('.clearfix').find('.keywordContCol').val();
      var currentOption = $('.form-select label.active').find('.checkbox-msg');
      var formContent = $(this).parents('.'+currentOption.attr('id'));
      
      if (keyword != '' && keyword != 'undefined') {
        if (keywordCompare(formContent, keyword)) {
          var wordArr = addKeyword(this, currentOption, keyword);
          var countEle = formContent.find('.count-num');
          var count = (countEle.text() *1);
          count++;
          keywordCount(countEle, count);
          setStorage(mailAutoRule_step2, cookieKey, wordArr);
          
          if (!keywordHide(currentOption)) {
            keywordHideRest(currentOption);
          }
          
        } else {
          return false;
        }
      }
    });

    //添加关键词
    function addKeyword (_this, _cur, _keyword){
      var keyWordArr = [];
      var formSelector = $(_this).parents('.form-search').next();
      var wordsList = $(_this).parents('.'+_cur.attr('id')).find('.select_words_list');
      var html = '<li><span class="key-content">'+ _keyword +'</span><span class="remove"><i class="fa fa-fw fa-times"></i></span></li>';
      wordsList.append(html);

      if (formSelector.is(':hidden')) {
        formSelector.removeClass('hidden');
        formSelector.show();
      }

      var _html = '<a>'+ _keyword +';</a>';
      _cur.find('.tit').addClass('hidden');
      _cur.append(_html);
      wordsList.find('.key-content').each(function(){
        keyWordArr.push($(this).text());
      })
      keywordLength(_cur);
      return keyWordArr;
    }

    //关键词个数
    function keywordCount (_this, _c){
      $(_this).text(_c);
    }

    //关键词添加重复检测
    function keywordCompare (_this, _k){
      var keywordList = $(_this).find('.select_words_list li');
      
      if (keywordList.length == '0') {
        return true;
      } else {
        var flag = true;
        keywordList.each(function(_ind, _ele){
          if ($(this).find('.key-content').text() == _k) {
            flag = false;
            ui.message.info({
              content: '不能重复添加'
            });
            return false;
          }
        });
        if (flag) {
          return true;
        } else {
          return false;
        }
        
      }
    }

    //长度限制
    function keywordLength (_curr){
      var cur_parent = _curr.parent().parent();
      var cur_a = _curr.find('a:not(.tit)').eq(-1);
      if (cur_a.outerWidth(true) >= cur_parent.width() + cur_parent.offset().left - _curr.offset().left - _showMore) {
        var text = _curr.find('a').eq(-1).text();
        cur_a.text(text.substring(0,text.length/4)+'...;');
      }
    }

    //删除已添加关键字
    $('#form_main').delegate('.fa.fa-fw.fa-times', 'click', function(e){
      var wordArr = [];
      var _index = $(this).parent().parent().index();
      var currentOption = $('.form-select label.active').find('.checkbox-msg');
      var countEle = $(this).parents('.'+currentOption.attr('id')).find('.count-num');
      var count = (countEle.text() *1);
      count--;
      if (count < 0) {
        count = 0;
      }
      if (count == 0) {
        currentOption.find('.tit').removeClass('hidden');
      }

      $(this).parents('ul').children().not(':eq('+_index+')').each(function(){
        wordArr.push($(this).text());
      })

      if (!wordArr.length) {
        var obj = getStorage(mailAutoRule_step2);
        delete obj[cookieKey];
        storage.setItem(mailAutoRule_step2, JSON.stringify(obj));
      } else {
        setStorage(mailAutoRule_step2, cookieKey, wordArr);
      }
      
      delKeyword(_index, currentOption);
      keywordCount(countEle, count);
      deleteOption(this); 
      
    });
    //删除左侧关键词
    function delKeyword (_i, _this){
      var cur_keyword = $(_this).find('a:not(.tit)').eq(_i);
      cur_keyword.remove();
      if ($(_this).height() <= minHeight * 2) {
        $(_this).parent().height('auto');

        $(_this).find('span.hidemore').remove();
        $(_this).find('span.showmore').remove();
        $(_this).css({'padding-right': 0});
      }
        
    }
    
    //检测左边关键词高度, 与以下 keywordHideRest 一起使用
    function keywordHide (_cur){
      if (_cur.height() > minHeight*2) {
          return false;
      } else {
        return true;
      }
    }

    //显示展示更多按钮
    function keywordHideRest (_cur){
      if (!_cur.find('.showmore').length && !_cur.find('.hidemore').length) {

        _cur.parent().height(minHeight * 2 - 2);
        _cur.css({'padding-right': 56});
        if(_cur.find('.showmore').length){
          _cur.find('.showmore').removeClass('hidden');
        }else{
          _cur.find('.tit').after('<span class="showmore">展示更多</span>');
        }
      } 
    }

    /* 
    * 订单发货时间模块 
    */
    //勾选 ---- 订单发货时间范围
    $('#form_main').delegate('.check-bar', 'click', function(){
      // $(this).siblings('.date_input').find('.date-Input').valid();
        var flag1 = dateRange($(this).next().find('.date_range_select').children('option:selected'), $(this));
        var flag2 = dateInput($(this).siblings('.date_input').find('.date-Input'), $(this));

        if ($(this).hasClass('disabled')) {
          return false;
        }

        if ($(this).hasClass('active')) {
          if ((flag1.range == "=")) {
            $(this).parent().siblings().find('.check-bar').removeClass('disabled');
          }

          $(this).removeClass('active');
          dateHide(flag1._id);
          delRangeCookie(flag1._id);

        } else {
          $(this).addClass('active');
          
          if (flag1 && flag2) {
            if (ruleInput($(this).siblings('.date_input').find('.date-Input')) == true) {
              $(this).siblings('.date_input').find('.date-Input').removeClass('input-validation-error').addClass('valid');
              $(this).siblings('.date_input').find('.date-Input').parent().find('.valid-text>span').html('');

              if (dateCompare(this)) {
                if ((flag1.range == "=")) { 
                  if ($(this).parent().siblings().find('.check-bar').hasClass('active')) {
                    $(this).parent().siblings().find('.check-bar').click();
                  }
                  $(this).parent().siblings().find('.check-bar').addClass('disabled');

                } else {
                  $(this).parent().siblings().find('.check-bar').removeClass('disabled');
                }
                var _obj = {
                    _id: flag1._id,
                  range: flag1.range,
                   days: flag2.days
                };
                dateShow(_obj);
                setRangeCookie(_obj);
              }
            } else if (typeof ruleInput($(this).siblings('.date_input').find('.date-Input')) == 'string') {
              $(this).siblings('.date_input').find('.date-Input').addClass('input-validation-error');
              $(this).parent().find('.date_input .valid-text>span').html('<span for="dateRangeUpper" generated="true" class="">'+ ruleInput($(this).siblings('.date_input').find('.date-Input')) +'</span>');
              
            } else{
              $(this).siblings('.date_input').find('.date-Input').addClass('input-validation-error');
              $(this).parent().find('.date_input .valid-text>span').html('<span for="dateRangeUpper" generated="true" class="">'+ $(this).siblings('.date_input').find('.date-Input').data('val-required') +'</span>');
            }
               
          }
          if (!flag1) {
            $(this).siblings('.date_range').find('.date_range_select').addClass('input-validation-error');
            $(this).parent().find('.date_range .valid-text>span').html('<span for="dateRangeUpper" generated="true" class="">不能为空。</span>');
          }
          if (!flag2) {
            $(this).siblings('.date_input').find('.date-Input').addClass('input-validation-error');
              $(this).parent().find('.date_input .valid-text>span').html('<span for="dateRangeUpper" generated="true" class="">不能为空。</span>');
          }
        }
    }); 

    //发货指定范围
    $('#form_main').delegate('.date_range_select', 'change', function(){
      // $(this).parents('.date_range').siblings('.date_input').find('.date-Input').valid();
      var flag1 = dateCheck($(this).parent().parent().prev());
      var flag2 = dateInput($(this).parent().parent().next().find('.date-Input'), $(this));

      if ($(this).children('option:selected').val() == '0') {
        if (flag1) {
          $(this).addClass('input-validation-error').removeClass('valid');
          $(this).parent().find('.valid-text>span').html('<span for="dateRangeUpper" generated="true" class="">不能为空。</span>');
        }
        dateHide(flag2._id);
        delRangeCookie(flag2._id);
        
      } else {
        $(this).removeClass('input-validation-error').addClass('valid');
        $(this).parent().find('.valid-text>span').html('');
        if (flag1 && flag2) {
          if (ruleInput($(this).parents('.date_range').siblings('.date_input').find('.date-Input')) == true) {
            $(this).parents('.date_range').siblings('.date_input').find('.date-Input').removeClass('input-validation-error').addClass('valid');
            $(this).parents('.date_range').siblings('.date_input').find('.date-Input').parent().find('.valid-text>span').html('');
            if (dateCompare(this)) {
              if ($(this).val() == "=") {
                if ($(this).parents('.date_range').parent().siblings().find('.check-bar').hasClass('active')) {
                  $(this).parents('.date_range').parent().siblings().find('.check-bar').click();
                }
                $(this).parents('.date_range').parent().siblings().find('.check-bar').addClass('disabled');
                
              } else {
                $(this).parents('.date_range').parent().siblings().find('.check-bar').removeClass('disabled');
              }
              flag2.range = $(this).children('option:selected').val();
              dateShow(flag2);
              setRangeCookie(flag2);
            }
          } else if (typeof ruleInput($(this).parents('.date_range').siblings('.date_input').find('.date-Input')) == 'string') {
            $(this).parents('.date_range').siblings('.date_input').find('.date-Input').addClass('input-validation-error');
            $(this).parents('.date_range').siblings('.date_input').find('.valid-text>span').html('<span for="dateRangeUpper" generated="true" class="">'+ ruleInput($(this).parents('.date_range').siblings('.date_input').find('.date-Input')) +'</span>');
            
          } else {
            $(this).parents('.date_range').siblings('.date_input').find('.date-Input').addClass('input-validation-error');
            $(this).parents('.date_range').siblings('.date_input').find('.valid-text>span').html('<span for="dateRangeUpper" generated="true" class="">'+ $(this).parents('.date_range').siblings('.date_input').find('.date-Input').data('val-required') +'</span>');
          }
            
        }
      }
    });  

    //发货时间
    $('#form_main').delegate('.date-Input', 'change', function(){
      $(this).valid();
      var flag1 = dateRange($(this).parent().parent().prev().find('.date_range_select').children('option:selected'), $(this));
      var flag2 = dateCheck($(this).parent().parent().siblings('.check-bar'));

      if ($(this).val() == '') {
        if ((flag1.range == "=")) {
          $(this).parents('.date_input').parent().siblings().find('.check-bar').removeClass('disabled');
        }
        if (flag2) {
          $(this).addClass('input-validation-error').removeClass('valid');
          $(this).parent().find('.valid-text>span').html('<span for="dateRangeUpper" generated="true" class="">不能为空。</span>');
        }
        dateHide(flag1._id);
        delRangeCookie(flag1._id);
      } else {
        $(this).removeClass('input-validation-error').addClass('valid');
        $(this).parent().find('.valid-text>span').html('');

        if (flag1 && flag2) {
          if (ruleInput($(this)) == true) {

            $(this).removeClass('input-validation-error').addClass('valid');
            $(this).parent().find('.valid-text>span').html('');
            if (dateCompare(this)) {
              if ((flag1.range == "=")) { 
                if ($(this).parents('.date_input').parent().siblings().find('.check-bar').hasClass('active')) {
                  $(this).parents('.date_input').parent().siblings().find('.check-bar').click();
                }
                $(this).parents('.date_input').parent().siblings().find('.check-bar').addClass('disabled');

              } else {
                $(this).parents('.date_input').parent().siblings().find('.check-bar').removeClass('disabled');
              }
              flag1.days = $(this).val();
              dateShow(flag1);
              setRangeCookie(flag1);
            } 
          } else if (typeof ruleInput($(this)) == 'string') {
            $(this).removeClass('valid').addClass('input-validation-error');
            $(this).parent().find('.valid-text>span').html('<span for="dateRangeUpper" generated="true" class="">'+ ruleInput($(this)) +'</span>');
            
          } else {
            $(this).removeClass('valid').addClass('input-validation-error');
            $(this).parent().find('.valid-text>span').html('<span for="dateRangeUpper" generated="true" class="">'+ $(this).data('val-required') +'</span>');
          }
        }
      } 
    }); 

    //删除范围选择数据并保存到cookie
    function delRangeCookie (id){
      var rangeCookie = getStorage(mailAutoRule_step2, cookieKey);
      for (i in rangeCookie) {
        if (rangeCookie[i]._id == id) {
          rangeCookie.splice(i, 1);
          if (rangeCookie.length) {
            setStorage(mailAutoRule_step2, cookieKey, rangeCookie);
          } else {
            var obj = getStorage(mailAutoRule_step2);
            delete obj[cookieKey];
            storage.setItem(mailAutoRule_step2, JSON.stringify(obj));
          }
          
          break;
        }
      }
    }

    //保存范围选择数据到cookie
    function setRangeCookie (obj){
      var rangeArr = [];
      var rangeCookie = getStorage(mailAutoRule_step2, cookieKey);
      if (typeof rangeCookie == 'undefined' || rangeCookie == '') {
        rangeArr.push(obj);
        
      } else {
        var flag = true;
        rangeArr = rangeCookie;
        for (i in rangeArr) {
          if (rangeArr[i]._id == obj._id) {
            flag = false;
            rangeArr[i] = obj;
            break;
          }
        }
        if (flag) {
          rangeArr.push(obj);
        }
      }
      
      setStorage(mailAutoRule_step2, cookieKey, rangeArr);
    }

    //发货范围 --- 勾选
    function dateCheck (_th){
      if (_th.hasClass('active')) {
        return true;
      } else {
        return false;
      }
    } 

    //发货范围 --- 上下限
    function dateRange (_th, _tr){
      if (_th.val() == "0") {
        return false;
      } else {
        return {_id: _tr.data('range'), range: _th.val()};
      }
    }

    //发货范围 --- 判断上下限的大小
    function dateCompare(_that){
      if ($(_that).parents('.form-date').find('.check-bar.active').length == '2') {
          var upper = $(_that).parents('.form-date').find('.upper input[type=text]').val();
          var lower = $(_that).parents('.form-date').find('.lower input[type=text]').val();

        if (upper == '' || lower == '') {
          return true;
        } else {
          if (upper *1 >= lower *1) {
            ui.message.info({
              content: '下限不能大于上限'
            });
            // $('#dateRangeLower').val(upper*1+1)
            return false;
          } else {
            return true;
          }
        }
      } 
      else {
        return true;
      }
    }

    //发货范围 --- 时间
    function dateInput (_th, _tr){
      var _val = _th.val();
      if (_val == '' || _val == 'undefined') {
        return false;
      } else {
        // if (ruleInput(_th)) {
          return {_id: _tr.data('range'), days: _th.val()};
        // } else {
        //   return false;
        // }
      }
    }

    function ruleInput (_th){
      var _val = _th.val();

      if (_val.search(/[\u4E00-\u9FA5]|[A-Za-z]/gi) > -1) {
        return '不能输入中文或字符';
      } else if (_val.indexOf('-')>-1) {
        return '请输入不小于0的数值';
      } else {
        if (_th.data('rule').match(/value/gi)) {
          if (_val.search(/\-/)>-1 || _val.indexOf('.') != _val.lastIndexOf('.')) {
            // console.log('价值格式不正确')
            return false;
            
          } else {
            return true;
          }
        } else {
          if (_val.search(/\-|\./)>-1) {
            // console.log('时间格式不正确')
            return false;
            
          } else {
            return true;
          }
        }
      } 
    }

    //添加范围信息
    function dateShow (_msg, _cur){
      if (_cur) {
        var currentOption = _cur;
      } else {
        var currentOption = $('.form-select label.active').find('.checkbox-msg');
      }
      
      var unitType = currentOption.attr('id');
      if (unitType.match(/date/gi)) {
        unitType = '(天)';
      } else {
        unitType = '(美元)';
      }

      currentOption.find('.tit').addClass('hidden');
      if (currentOption.find('a:not(:hidden)').length > 0) {

        if (currentOption.find('a[id_value="'+ _msg._id +'"]').length > 0) {
          currentOption.find('a[id_value="'+_msg._id +'"]').text(_msg.range + _msg.days);
        } else {
          var currentdays = currentOption.find('a:not(:hidden)').text().match(/\d+/g)[0];
          if (currentdays*1 >= _msg.days*1) {
            var t_html = '<a id_value="'+ _msg._id +'">'+ _msg.range + _msg.days +'</a><span class="range_and">且</span>';
            currentOption.find('a:not(:hidden)').before(t_html);
          } else {
            var t_html = '<span class="range_and">且</span><a id_value="'+ _msg._id +'">'+ _msg.range + _msg.days +'</a>';
            currentOption.find('a:not(:hidden)').after(t_html);
          }
        } 
      } else {
        var html = '<a id_value="'+ _msg._id +'">'+ _msg.range + _msg.days +'</a><span class="unit_type">'+ unitType +'</span>';
        currentOption.append(html);
      }
      
    }

    //删除范围信息
    function dateHide (_i){
      var currentOption = $('.form-select label.active').find('.checkbox-msg');
      if (currentOption.find('a:not(:hidden)').length > 0) {
        currentOption.find('a[id_value="'+_i+'"]').siblings('.range_and').remove();
        currentOption.find('a[id_value="'+_i+'"]').remove();
        if (currentOption.find('a:not(:hidden)').length < 1) {
          currentOption.find('.unit_type').remove();
          currentOption.find('.tit').removeClass('hidden');
        }
      }
    }
});
  });
});