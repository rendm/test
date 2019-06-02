$(document).ready(function () {
    //监听浏览器  改变
    $(window).on('resize', function() { 
        //  console.log($(window).width())
         if($(window).width()<=770){
            $("h3").hide();
         }
    })
    $('.main_del').hide();
    var robotOperation_back=sessionStorage.getItem('robotOperation_back');

    //var lis=$('#side-menu').find('li');
    //alert(lis.length);
    // console.info('lis');console.info(lis);
    // for(i=0;i<lis.length;i++){
    //     var outerText=lis[i].outerText;
    //
    //     //alert(lis[i].outerText);
    //     if(outerText.indexOf('机器人运行')>=0){
    //         $(lis[i]).find('a')[0].click();
    //         sessionStorage.setItem('robot1', 1);
    //     }
    //
    //     if(outerText.indexOf('机器人地图')>=0){
    //         $(lis[i]).find('a')[0].click();
    //         sessionStorage.setItem('robot2', 1);
    //     }
    // }

    if(robotOperation_back==1){
        var tab_arr_str=sessionStorage.getItem('tab_arr');
        //console.info('tab_arr_str');console.info(tab_arr_str);
        var tab_arr=tab_arr_str.split(',');
        if(tab_arr!=null && tab_arr.length>0){
          for(var j=0;j<tab_arr.length;j++){
              //alert($.trim(tab_arr[j]));
              if($.trim(tab_arr[j])!='机器人运行'){
                  menuItem($.trim(tab_arr[j]));
              }
          }
            menuItem('机器人运行');
        }

        //$(this).addClass('active').siblings('.J_menuTab').removeClass('active');

        // menuItem('机器人地图');
        // menuItem('机器人运行');
        // loadMenuBack(106,'店铺管理');
        // loadMenuBack(106,'店铺管理');
        // loadMenuBack(124,'机器人运行');
        $('.J_menuTab').click(function () {
            //$('.J_iframe').attr('src', $('#iframe').attr('src'));
            //alert($(this).attr('data-id'));
            var menu_url=$(this).attr('data-id');
            var iframes=$('.J_iframe');
            for(var i=0;i<iframes.length;i++){
                if($(iframes[i]).attr('src')==menu_url){
                    $(iframes[i]).attr('src', $(iframes[i]).attr('src'));
                }
            }
        });

        $('.J_menuTab').each(function () {
            if ($(this).text().indexOf('机器人运行')>=0) {
                if (!$(this).hasClass('active')) {
                    $(this).addClass('active').siblings('.J_menuTab').removeClass('active');
                }
            }
        });

        sessionStorage.setItem('robotOperation_back',0);
    }

});

function loadMenuBack(id,name) {

    $('#top-searchname').val(name+' ('+id+')');
    $('#menuId').val(id);
    $('.main_del').show();
    // document.getElementById("btn2").onclick();
    menuItem(name);
}


//left导航栏
//获取用户的信息
function getUserInfo() {
  $.ajax({
    url: share + 'irobotweb/sys/user/query/userDO',
    crossDomain: true,
    type: "get",
    dataType: "json",
    async: false,
    xhrFields: {
      withCredentials: true
    },
    success: function (json) {//.userId
        console.log(json,'获取用户信息')
      if (json.code==200 ||json.code==0){
          sessionStorage.removeItem('user');
          sessionStorage.setItem('user', JSON.stringify(json.data));
          if (json.data == "" || json.data == null || json.data == undefined) { // "",null,undefined
              $("#userName").text(json.data.mobile);
          } else {
              $("#userName").text(json.data.name);
          }

          $('#uploadImg').attr('src',json.data.headimg);
          var status = json.data.userId;
          cshide(status)
      }

    },
    error: function (request){
      layer.alert("Connection error");
    },
  });
}
getUserInfo();

function cshide(status){
  $.ajax({
      url: share + '/irobotweb/sys/menu/query/listMenuTree/' + status,
      crossDomain: true,
      type: "get",
      dataType: "json",
      async: false,
      xhrFields: {
          withCredentials: true
      },
      success: function (json){
        var subject ="";//主导航栏
        for(var i= 0;i<json.length;i++){
            var subjectChilder = '';
            for(var j=0;j<json[i].children.length;j++){
                //console.log(json[i].children[j].text)
                subjectChilder +='<li> <a class="J_menuItem" href=".'+json[i].children[j].attributes.url+'" >'+json[i].children[j].text+'</a></li>';
            }
            subject += '<li class="active"><a href="#"><i class="'+json[i].attributes.icon+'"></i><span class="nav-label">'+json[i].text+'</span> <span class="fa arrow"></span></a> <ul class="nav nav-second-level ">'+subjectChilder+'</ul> </li>'
        }
        $('#side-menu').append(subject)
      }
  }); 
}

//横栏显示插件
function connect() {
    var sock = new SockJS("/endpointChat"); 
    var stomp = Stomp.over(sock);
    stomp.connect('guest', 'guest', function (frame){
        /**  订阅了/user/queue/notifications 发送的消息,这里雨在控制器的 convertAndSendToUser 定义的地址保持一致, 
         *  这里多用了一个/user,并且这个user 是必须的,使用user 才会发送消息到指定的用户。 
         *  */
        stomp.subscribe("/user/queue/notifications", handleNotification);
        stomp.subscribe('/topic/getResponse', function (response) { //订阅/topic/getResponse 目标发送的消息。这个是在控制器的@SendTo中定义的。
            toastr.options = {
                "closeButton": true,//是否显示关闭按钮（提示框右上角关闭按钮）
                "debug": false,//是否为调试
                "progressBar": true,//是否显示进度条（设置关闭的超时时间进度条）
                "positionClass": "toast-bottom-right",//消息框在页面显示的位置
                "onclick": null, //点击消息框自定义事件
                "showDuration": "400", //显示动作时间 
                "hideDuration": "1000", //隐藏动作时间
                "timeOut": "7000", //自动关闭超时时间 
                "extendedTimeOut": "1000",//延长时间
                "showEasing": "swing", //显示宽松
                "hideEasing": "linear", //隐藏宽松
                "showMethod": "fadeIn",//显示方法
                "hideMethod": "fadeOut"//隐藏方法
            }
            toastr.info(JSON.parse(response.body).responseMessage);//toastr 提示方式  toastr.info普通提示 
        });
    });

    function handleNotification(message) {
        wrapper.notify();
        toastr.info(message.body);
    }
}


//connect();

// var wrapper = new Vue({
//     el: '#wrapper',
//     data: {
//         total: '',
//         rows: '',
//     },
//     methods: {
//         notify: function () {
//             $.getJSON('/oa/notify/message', function (r) {
//                 wrapper.total = r.total;
//                 wrapper.rows = r.rows;
//             });
//         },
//         personal: function () {
//             layer.open({
//                 type: 2,
//                 title: '个人设置',
//                 maxmin: true,
//                 shadeClose: false,
//                 area: ['800px', '600px'],
//                 content: '/sys/user/personal'
//             });
//         }
//     },
// })
function removeinput() {
    // deptId= $('#deptId').val();
    $("#top-searchname").val("");
    $("#menuId").val("");
    $('.main_del').hide();
};

//退出按钮调用后台接口清除session信息
$('#a_loginout').click(function () {
    $.ajax({
        type : "POST",
        url :share+"/logout",
        //data : jsonStr,/// 你的formid
        dataType:"json",
        contentType:false,
        crossDomain: true,
        async:false,
        xhrFields: {
            withCredentials: true
        },
        error : function(request) {
            alert("Connection error");
        },
        success : function(data) {

            if (data.code == 0) {
                parent.location.href='./login.html';

            } else {
                layer.msg(data.msg);
            }
        }
    });

});
                
                // $("#top-searchname").autoComplete({
                //     minChars: 0,
                //     renderItem: function (item, search){
                //         search = search.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
                //         var re = new RegExp("(" + search.split(' ').join('|') + ")", "gi");
                //         return '<div class="autocomplete-suggestion" data-langname="'+item[0]+'" data-lang="'+item[1]+'" data-val="'+search+'"> '+item[0].replace(re, "<b>$1</b>")+'</div>';
                //     },
                //     onSelect: function(e, term, item){
                //         //console.log('Item "'+item.data('langname')+' ('+item.data('lang')+')" selected by '+(e.type == 'keydown' ? 'pressing enter or tab' : 'mouse click')+'.');
                //         $('#top-searchname').val(item.data('langname')+' ('+item.data('lang')+')');
                //         $('#menuId').val(item.data('lang'));
                //         menuItem(item.data('langname'));
                //     },
                //     source: function (request, response){
                //         console.log($("#top-searchname").val(),'daadadadd打印的呀')
                //         var menuname = $("#top-searchname").val();
                //         //<a href="javascript:;" data-id="index_v1.html" class="active J_menuTab">首页</a>
                //
                //         if(menuname !== ''){
                //             $.ajax({
                //                 url: share+'/irobotweb/sys/menu/query/menuname?name='+menuname,
                //                 crossDomain: true,
                //                 type: 'get',
                //                 xhrFields: {
                //                     withCredentials: true,
                //                 },
                //                 dataType:"json",
                //                 contentType:"application/json; charset=utf-8",
                //                 success: function(data) {
                //                     $("#top-searchname").val("")
                //                     console.log(data,'请求到的数据')
                //                     var str = '';
                //                     var str1 = '';
                //                     data.forEach(function(item,index){
                //                         console.log(item.url)
                //                         str +='<a href="javascript:;" class="J_menuTab active" data-id=".'+item.url+'">'+item.name+' <i class="fa fa-times-circle"></i></a>'
                //                         str1 += '<iframe class="J_iframe" name="iframe0" width="100%" height="100%" src=".'+item.url+'"  frameborder="0" data-id="'+item.url+'" seamless></iframe>';
                //                     })
                //                     $('.J_menuTab').removeClass('active');
                //                     console.log(str)
                //                     $('.J_mainContent').find('iframe.J_iframe').hide().parents('.J_mainContent').append(str1);//#content-main
                //                     var loading = layer.load();
                //                     $('.J_mainContent iframe:visible').load(function () {
                //                         //iframe加载完成后隐藏loading提示
                //                         layer.close(loading);
                //                     });
                //                     $('.J_menuTabs .page-tabs-content').append(str);
                //                     scrollToTab($('.J_menuTab.active'));
                //
                //                 },
                //                 error: function(data) {
                //                     console.log(data, 'error')
                //                 },
                //
                //             });
                //         }
                //
                //     },
                //     delay: 0//延迟500ms便于输入
                //     // select: function (event, ui) {
                //     //     $("#deptId").val(ui.item[1]);
                //     // }
                // });
                
                
            $("#top-searchname").autoComplete({
            minChars: 0,
            renderItem: function (item, search){
                search = search.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
                var re = new RegExp("(" + search.split(' ').join('|') + ")", "gi");
                //console.log(item[0])
                return '<div class="autocomplete-suggestion" data-langname="'+item[0]+'" data-lang="'+item[1]+'" data-val="'+search+'"> '+item[0].replace(re, "<b>$1</b>")+'</div>';
            },
    
    
            onSelect: function(e, term, item){
                //alert(item.data('lang'));
                //console.log('Item "'+item.data('langname')+' ('+item.data('lang')+')" selected by '+(e.type == 'keydown' ? 'pressing enter or tab' : 'mouse click')+'.');
                $('#top-searchname').val(item.data('langname')+' ('+item.data('lang')+')');
                $('#menuId').val(item.data('lang'));
                $('.main_del').show();
                // document.getElementById("btn2").onclick();
                menuItem(item.data('langname'));
            },
            source: function (request, response) {
                $.ajax({
                    url:  share+'/irobotweb/sys/menu/query/menuname/menu',
                    type: "get",
                    dataType: "json",
                    cache: false,
                    async: true,
                    xhrFields: {
                        withCredentials: true,
                    },
                    crossDomain: true,
                    data: {
                        "name": request
                    },
                    success: function (json) {
                        //console.log(js)
                        if (json != null) {
                            var suggestions = [];
                            for(var i =0 ;i < json.length;i++){
    
                                var jsonarray= [];
                                jsonarray.push(json[i].name);
                                jsonarray.push( json[i].menuId);
    
                                suggestions.push(jsonarray);
                            }
                            response(suggestions);
                        }
    
                    }
    
                });
            },
            delay: 0//延迟500ms便于输入
            // select: function (event, ui) {
            //     $("#deptId").val(ui.item[1]);
            // }
        });
                
                   
                
        function menuItem(name) {

            //alert(name);

            var J_menu;
            $('.J_menuItem').each(function () {
    
                if ($(this).text() == name) {
                    J_menu =$(this);
                }
    
            });
            // 获取标识数据
            var dataUrl = J_menu.attr('href'),
                dataIndex =J_menu.data('index'),
                menuName = $.trim(J_menu.text()),
                flag = true;
            if (dataUrl == undefined || $.trim(dataUrl).length == 0)return false;
    
            // 选项卡菜单已存在
            $('.J_menuTab').each(function () {
                if ($(this).data('id') == dataUrl) {
                    if (!$(this).hasClass('active')) {
                        $(this).addClass('active').siblings('.J_menuTab').removeClass('active');
                        scrollToTab(this);
                        // 显示tab对应的内容区
                        $('.J_mainContent .J_iframe').each(function () {
                            if ($(this).data('id') == dataUrl) {
                                $(this).show().siblings('.J_iframe').hide();
                                return false;
                            }
                        });
                    }
                    flag = false;
                    return false;
                }
            });
    
            // 选项卡菜单不存在
            if (flag) {
                var str = '<a href="javascript:;" class="active J_menuTab" data-id="' + dataUrl + '">' + menuName + ' <i class="fa fa-times-circle"></i></a>';
                $('.J_menuTab').removeClass('active');
    
                // 添加选项卡对应的iframe
                var str1 = '<iframe class="J_iframe" name="iframe' + dataIndex + '" width="100%" height="100%" src="' + dataUrl + '" frameborder="0" data-id="' + dataUrl + '" seamless></iframe>';
                $('.J_mainContent').find('iframe.J_iframe').hide().parents('.J_mainContent').append(str1);
    

                $('.J_menuTabs .page-tabs-content').append(str);
                scrollToTab($('.J_menuTab.active'));
            }
            return false;
        }
                
                
                    //滚动到指定选项卡
            function scrollToTab(element) {
                var marginLeftVal = calSumWidth($(element).prevAll()), marginRightVal = calSumWidth($(element).nextAll());
                // 可视区域非tab宽度
                var tabOuterWidth = calSumWidth($(".content-tabs").children().not(".J_menuTabs"));
                //可视区域tab宽度
                var visibleWidth = $(".content-tabs").outerWidth(true) - tabOuterWidth;
                //实际滚动宽度
                var scrollVal = 0;
                if ($(".page-tabs-content").outerWidth() < visibleWidth) {
                    scrollVal = 0;
                } else if (marginRightVal <= (visibleWidth - $(element).outerWidth(true) - $(element).next().outerWidth(true))) {
                    if ((visibleWidth - $(element).next().outerWidth(true)) > marginRightVal) {
                        scrollVal = marginLeftVal;
                        var tabElement = element;
                        while ((scrollVal - $(tabElement).outerWidth()) > ($(".page-tabs-content").outerWidth() - visibleWidth)) {
                            scrollVal -= $(tabElement).prev().outerWidth();
                            tabElement = $(tabElement).prev();
                        }
                    }
                } else if (marginLeftVal > (visibleWidth - $(element).outerWidth(true) - $(element).prev().outerWidth(true))) {
                    scrollVal = marginLeftVal - $(element).prev().outerWidth(true);
                }
                $('.page-tabs-content').animate({
                    marginLeft: 0 - scrollVal + 'px'
                }, "fast");
            }
        
            function calSumWidth(elements) {
                var width = 0;
                $(elements).each(function () {
                    width += $(this).outerWidth(true);
                });
                return width;
            }

            if(sessionStorage.getItem('default') == '显示'){
               // $("a").attr('')
               if($("a").attr('data-id') == "./robot/RobotOperation/RobotOperation.html"){
                $("a").addClass('active')
               }
            }
            $(".putbtn").on('click',function(){
                //console.log($("#side-menu").width());
                var width = $("#side-menu").width();
                //alert(width);

                if(width<100){
                    //console.log("大")
                    $("h3").show();
                    $(this).attr('title','收起菜单');
                }else{
                    //console.log("小")
                    $("h3").hide();
                    $(this).attr('title','展开菜单');
                }
            })
