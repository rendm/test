

var task_resource_filename = '', current_edit_id = 0, current_map_id = 0,current_poi_id=0;
var resource_type = 0;var welcomeguest_poiname='',welcomeguest_poiid='';

$(function () {

    current_edit_id = getQueryString('editid');
    current_map_id = sessionStorage.getItem('TaskSetMapId');
    //if ($.isEm(current_map_id)) current_map_id = 22;
    //alert(current_map_id);
    if (!$.isEm(current_edit_id)) edit_load(current_edit_id);

    var content_border_arr = $('.content-border');
    var arr_len = content_border_arr.length;
    //console.info('content_border_arr');console.info();

    if (arr_len == 1) {
        //alert('一个内容块');
        $('.content-border .b-delete').hide();//如果只有一个内容div时，则隐藏删除按钮
    }

    //取消按钮点击
    $('#adddanger').on('click', function () {
        //window.parent.location.href = "./RobotManage.html";
        var index = parent.layer.getFrameIndex(window.name); // 获取窗口索引
        parent.layer.close(index);
    });

    //返回
    $("#base_return").on('click', function () {
        var index = parent.layer.getFrameIndex(window.name); // 获取窗口索引
        parent.layer.close(index);
    });

    //为内容中的添加按钮添加事件
    $('body').on('click', '.content_add', function () {

        var content_border_arr = $('.content-border');
        var arr_len = content_border_arr.length;
        if (arr_len >= 1) {
            $('.content-border .b-delete').show();
        }

        var resourceType = 'typews' + (arr_len+1).toString();
        var content_add_id = 'content_add_id' + (arr_len+1).toString();
        var content_label_id = 'content-label-id' + (arr_len+1).toString();
        var voice_id = 'voice' + (arr_len+1).toString();
        var emoticon_id = 'emoticon' + (arr_len+1).toString();

        //console.info('resourceType');console.info(resourceType);

        $(this).hide();

        var html_add = '<label class="col-sm-3 control-label" id=' + content_label_id + '></label>' +
            '<div class="col-sm-8 content-border mt-3" id=' + content_add_id + '>' +
            '<div class="form-group">' +
            '<label class="col-sm-3 control-label">语音:</label>' +
            '<div class="col-sm-8">' +
            '<textarea id=' + voice_id + ' class="form-control voice" type="text"></textarea>' +
            '</div>' +
            '</div>' +
            '<div class="form-group">' +
            '<label class="col-sm-3 control-label">表情:</label>' +
            '<div class="col-sm-8">' +

            '<div class="packaging-exhibition">' +
            '<input id=' + emoticon_id + ' name="emoticon" class="form-control emoticon" type="text">' +
            '<span class="iconfont icon-fangdajing packaging-fangdajing" onclick="selectEmoji(this)"></span>' +
            '</div>' +
            '</div>' +
            '</div>' +

            '<div class="form-group">' +
            '<label class="col-sm-3 control-label">资源类型:</label>' +
            '<div class="col-sm-8">' +
            '<label class="radio-inline">' +
            '<input type="radio" name=' + resourceType + ' value="0" checked="checked"/>图片' +
            '</label>' +
            '<label class="radio-inline">' +
            '<input type="radio" name=' + resourceType + ' value="2"/>视频' +
            '</label>' +
            '<label class="findlabel" >' +
            '<button class="seekResource">查找资源</button>' +
            '</label>' +
            '</div>' +
            '</div>' +

            '<div class="form-group">' +
            '<label class="col-sm-3 control-label">大屏展示:</label>' +
            '<div class="col-sm-8">' +
            '<div class="BigSc">' +
            '</div>' +
            '</div>' +
            '</div>' +

            '<div class="form-group" class="d-delay">' +
            '<label class="col-sm-3 control-label">图片延时播放:</label>' +
            '<div class="col-sm-8">' +
            '<input type="number" class="delayTime" min="1" max="1000" />' +
            '<label class="control-label" style="margin-left:-1px">秒</label>' +
            '</div>' +
            '</div>' +

            '<label class="col-sm-3 control-label"></label>' +
            '<div class="col-sm-8">' +
            '<button type="button" class="btn btn-primary content_add">' +
            '<i class="fa fa-plus" aria-hidden="true"></i>' +
            '</button>' +
            '<button type="button" class="btn btn-danger ml-3 b-delete" title="" >' +
            '<i class="fa fa-minus" aria-hidden="true"></i>' +
            '</button>' +
            '<button type="button" class="btn btn-default ml-3 content-up" title="" >' +
            '<i class="fa fa-angle-up" aria-hidden="true"></i>' +
            '</button>' +
            '<button type="button" class="btn btn-default ml-3 content-down" title="" >' +
            '<i class="fa fa-angle-down" aria-hidden="true"></i>' +
            '</button>' +
            '</div>';


        $('#d-content').append(html_add);

        var content_border_arr = $('.content-border');
        var arr_len = content_border_arr.length;

        if (arr_len == 1) {
            //alert('一个内容块');
            $('.content-border .content_add').show();
            $('.content-border .b-delete').hide();
        }

        if (arr_len > 1) {
            $('.content-border:first').find('.content-down').show();
            $('.content-border:last').find('.content_add').show();
        }
    });

    //删除操作
    $('body').on('click', '.b-delete', function () {
        //alert('点击了删除');
        var delete_id = $(this).parent().parent().attr('id');
        var delete_label = $(this).parent().parent().prev().attr('id');
        //console.info('delete_label');console.info(delete_label);
        $('#' + delete_id).remove();
        $('#' + delete_label).remove();

        var content_border_arr = $('.content-border');
        var arr_len = content_border_arr.length;
        //console.info('content_border_arr');console.info();

        if (arr_len == 1) {
            $('.content-border .content_add').show();
            $('.content-border .b-delete').hide();

        }

        if (arr_len > 1) {
            $('.content-border:last').find('.content_add').show();
        }

        //$('.control-label').text('');
        $('.content-border:first').prev().text('内容:');//防止第一个label被删除后内容为空

    });

    //向上移动
    $('body').on('click', '.content-up', function () {

        var div_current = $(this).parent().parent();//当前的div
        var prev_label = div_current.prev();        //当前div前面的label
        var prev_prev_label = div_current.prev().prev().prev();//当前div前面的label的div前面的label
        prev_prev_label.before(prev_label);        //先移动label
        prev_prev_label.before(div_current);       //再移动div

        //var div_move_id=$(this).parent().parent().attr('id');
        //var prev_label=$('#'+div_move_id).prev();
        //var prev_prev_label=$('#'+div_move_id).prev().prev().prev();
        //prev_prev_label.before(prev_label);        //先移动label
        //prev_prev_label.before($('#'+div_move_id));//再移动div

        var content_border_arr = $('.content-border');
        var arr_len = content_border_arr.length;
        if (arr_len > 1) {
            $('.content-border').find('.content_add').hide();//先隐藏所有的加号
            $('.content-border:last').find('.content_add').show();//只显示最后一个div中的加号
        }

        $('label[id*="content-label-id"]').text('');
        $('.content-border:first').prev().text('内容:');
    });

    //向下移动
    $('body').on('click', '.content-down', function () {
        var div_current = $(this).parent().parent();//当前的div
        var prev_label = div_current.prev();//当前的div前面的label
        var next_next_div = div_current.next().next();//当前div后面的div
        next_next_div.after(div_current);//先移动div
        next_next_div.after(prev_label);

        var content_border_arr = $('.content-border');
        var arr_len = content_border_arr.length;
        if (arr_len > 1) {
            $('.content-border').find('.content_add').hide();//先隐藏所有的加号
            $('.content-border:last').find('.content_add').show();//只显示最后一个div中的加号
        }

        $('label[id*="content-label-id"]').text('');
        $('.content-border:first').prev().text('内容:');
    });

    //查找资源--最新
    $('body').on('click', '.seekResource', function (e) {
        e.preventDefault();//触发事件的是button，所以要加这一句
        var task_set_resource_type = $(this).parent().parent().find("input[name*='typews']:checked").val();
        sessionStorage.setItem('task_set_resource_type', task_set_resource_type);

        var BigSc = $(this).parent().parent().parent().next().find('.BigSc').html(123);
        //console.info('BigSc');console.info(BigSc);

        layer.open({
            type: 2,
            title: '选择资源',
            maxmin: true,
            shadeClose: false,
            area: ['860px', '570px'],
            content: './resourceInfo.html',  //iframe的url
            end: function () {
                //alert(666);
                var task_set_resourceinfo = sessionStorage.getItem('task_set_resourceinfo');
                BigSc.html(task_set_resourceinfo);
                sessionStorage.setItem('task_set_resourceinfo', '');//获取到值以后将session清空
            }
        });

    });

    //查找资源
    $(".seekResource1").on('click', function (e) {
        $("#BigSc").html(" ");
        var task_set_resource_type = $('input[name="typews"]:checked').val();
        sessionStorage.setItem('task_set_resource_type', task_set_resource_type);

        e.preventDefault();//触发事件的是button，所以要加这一句

        layer.open({
            type: 2,
            title: '选择资源',
            maxmin: true,
            shadeClose: false,
            area: ['860px', '570px'],
            content: './resourceInfo.html',  //iframe的url
            end: function () {
                //alert(666);
                var task_set_resourceinfo = sessionStorage.getItem('task_set_resourceinfo');
                $("#BigSc").html(task_set_resourceinfo);
                sessionStorage.setItem('task_set_resourceinfo', '');//获取到值以后将session清空
            }
        });
    });

    //移除选中的图片或视频
    $(document).on('click', function (e) {
        //console.log($(e.target).attr("class") )
        if ($(e.target).attr("class") == 'fork') {
            $(e.target).parent().remove()
        }
    });

    //展示图片延时输入框
    $(document).on('click', 'input:radio[name*="typews"]', function () {


        if ($(this).val() == 0) {
            $(this).parent().parent().parent().prev().prev().find('.voice').attr("disabled",false);
            $(this).parent().parent().parent().next().next().show();
        } else {
            //选择视频后，语音输入框禁用
            $(this).parent().parent().parent().prev().prev().find('.voice').attr("disabled",true);
            $(this).parent().parent().parent().next().next().hide();
        }

        $(this).parent().parent().parent().next().find('.BigSc').text('');
    });

    //送物点失去焦点事件
    $('#deliveryPoiName').mouseout(function () {
       //alert('失去焦点了');

        if($('#deliveryPoiName').val()==''){
            //alert(333);
            $('#deliveryPoiName').addClass('error');
            //$('#lbl_sending').addClass('error');
            $('#lbl_sending').show().addClass('error').attr('style','width:90px;height:18px;');
            return false;
        }

    });

    $('.BigSc').sortable();
    $(".BigSc").disableSelection();

    validateRule();

    // var map_id_selected=$('#map').find('option:selected').val();
    // if($.isEm(map_id_selected)){
    //   $('#btn-select-point').hide();
    // }
    // else{
    //     $('#btn-select-point').show();
    // }

    $('#lbl_sending').hide();
});

$.fn.serializeObject = function () {
    var o = {};
    var a = this.serializeArray();
    $.each(a, function () {
        if (o[this.name] !== undefined) {
            if (!o[this.name].push) {
                o[this.name] = [o[this.name]];
            }
            o[this.name].push(this.value || '');
        } else {
            o[this.name] = this.value || '';
        }
    });
    return o;
};

//根据名称获取地址栏里的参数
function getQueryString(name) {
    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
    var r = window.location.search.substr(1).match(reg);
    if (r != null) return unescape(r[2]);
    return null;
}

//编辑页面加载数据
function edit_load(editid) {

    //alert(share+'/irobotweb/sys/robottask/query/ids?taskid='+ editid);

    $.ajax({
        url: share + '/irobotweb/sys/robottask/query/ids?taskid=' + editid,
        crossDomain: true,
        type: "get",
        dataType: "json",
        xhrFields: {
            withCredentials: true
        },
        success: function (data) {

            // console.log('编辑页面任务信息');
            // console.log(data,'你好我是送礼物的');

            var load_data = data.data;
            $('#taskName').val(load_data.taskName);//任务名称

            //$('#point').val(load_data.robotTaskDetailsDOList[0].poiName);//点位名称  共用的字段
            //var task_id_arr=new Array();
            //var task_id_arr_new=new Array();

            var arr_old = load_data.robotTaskDetailsDOList;

            $('#takePoiId').val(arr_old[0].takePoiId);//取物点id
            $('#takePoiName').val(arr_old[0].takePoiName);//取物点名称
            $('#deliveryPoiId').val(arr_old[0].deliveryPoiId);//送物点id
            $('#deliveryPoiName').val(arr_old[0].deliveryPoiName);//送物点名称

            $('#voice').val(arr_old[0].voice);//语音
            $('#emoticon').val(arr_old[0].emoji);//表情
            $('#delayTime').val(arr_old[0].delayTime);//图片延时


            //资源类型
            if (arr_old[0].resourceType == 0) {
                $("input[value='0']").attr('checked', 'true');
            }
            else if (arr_old[0].resourceType == 2) {
                //alert('视频');
                $('#first-delay').hide();
                $('#voice').attr("disabled",true);
                $("input[value='2']").attr('checked', 'true');
            }

            $('#content_add_id').find('.BigSc').html(resourceHtml(arr_old[0].resourceId, arr_old[0].resourceName));

            if (arr_old.length > 1) {

                for (var i = 1; i < arr_old.length; i++) { //注意，此处i的初始值是1，索引为0的项已经在上面使用了
                    var content_html = joinContent(arr_old[i], i);
                    $('#d-content').append(content_html);
                }

                $('.content-border .b-delete').show();
                //alert(333);
                $('.content-border').find('.content_add').hide();//先隐藏所有的加号
                $('.content-border:last').find('.content_add').show();//只显示最后一个div中的加号
            }
        },
        error: function (request) {
            layer.alert("Connection error");
        },
    });
}

//拼接内容
function joinContent(obj, i) {

    var resourceType = 'typews' + i.toString();
    var content_add_id = 'content_add_id' + i.toString();
    var content_label_id = 'content-label-id' + i.toString();
    var voice_id = 'voice' + i.toString();
    var emoticon_id = 'emoticon' + i.toString();
    var h_pic = '', h_video = '', h_big = '', delay_html = '', delay_time = 0;
    var voice_disable='';

    if (obj.resourceType == '0') {
        //resourceType
        //alert(obj.delayTime);
        h_pic = '<input type="radio" name=' + resourceType + ' value="0" checked="checked" />图片';
        h_video = '<input type="radio" name=' + resourceType + ' value="2"/>视频';

        if (!$.isEm(obj.delayTime)) {
            delay_time = parseInt(obj.delayTime);
        }

        delay_html = '<div class="form-group" class="d-delay">' +
            '<label class="col-sm-3 control-label">图片延时播放:</label>' +
            '<div class="col-sm-8">' +
            '<input type="number" class="delayTime" min="1" max="1000"  value=' + delay_time + ' />' +
            '<label class="control-label" style="margin-left:-1px">秒</label>' +
            '</div>' +
            '</div>';

        //alert(delay_html);

    } else {
        voice_disable='disabled';
        h_pic = '<input type="radio" name=' + resourceType + ' value="0"/>图片';
        h_video = '<input type="radio" name=' + resourceType + ' value="2" checked="checked"/>视频';
    }

    h_big = resourceHtml(obj.resourceId, obj.resourceName);

    var html_content = '<label class="col-sm-3 control-label" id=' + content_label_id + '></label>' +
        '<div class="col-sm-8 content-border mt-3" id=' + content_add_id + '>' +
        '<div class="form-group">' +
        '<label class="col-sm-3 control-label">语音:</label>' +
        '<div class="col-sm-8">' +
        '<textarea id=' + voice_id + ' class="form-control voice"  type="text"'+'disabled='+voice_disable+'>' + obj.voice + '</textarea>' +
        '</div>' +
        '</div>' +
        '<div class="form-group">' +
        '<label class="col-sm-3 control-label">表情:</label>' +
        '<div class="col-sm-8">' +

        '<div class="packaging-exhibition">' +
        '<input id=' + emoticon_id + ' name="emoticon" class="form-control emoticon" type="text" value=' + obj.emoji + '>' +
        '<span class="iconfont icon-fangdajing packaging-fangdajing" onclick="selectEmoji(this)"></span>' +
        '</div>' +

        '</div>' +
        '</div>' +

        '<div class="form-group">' +
        '<label class="col-sm-3 control-label">资源类型:</label>' +
        '<div class="col-sm-8">' +
        '<label class="radio-inline">' +
        h_pic +
        '</label>' +
        '<label class="radio-inline">' +
        h_video +
        '</label>' +
        '<label class="findlabel" >' +
        '<button class="seekResource">查找资源</button>' +
        '</label>' +
        '</div>' +
        '</div>' +

        '<div class="form-group">' +
        '<label class="col-sm-3 control-label">大屏展示:</label>' +
        '<div class="col-sm-8">' +
        '<div class="BigSc">' + h_big +
        '</div>' +
        '</div>' +
        '</div>' +

        delay_html +

        '<label class="col-sm-3 control-label"></label>' +
        '<div class="col-sm-8">' +
        '<button type="button" class="btn btn-primary content_add">' +
        '<i class="fa fa-plus" aria-hidden="true"></i>' +
        '</button>' +
        '<button type="button" class="btn btn-danger ml-3 b-delete" title="" >' +
        '<i class="fa fa-minus" aria-hidden="true"></i>' +
        '</button>' +
        '<button type="button" class="btn btn-default ml-3 content-up" title="" >' +
        '<i class="fa fa-angle-up" aria-hidden="true"></i>' +
        '</button>' +
        '<button type="button" class="btn btn-default ml-3 content-down" title="" >' +
        '<i class="fa fa-angle-down" aria-hidden="true"></i>' +
        '</button>' +
        '</div>';

    return html_content;
}

//生成资源的字符串
function resourceHtml(ids, names) {
    var r_html = '';
    if(ids!='' && names!=null){
        var id_arr = ids.split(',');
        var name_arr = names.split(',');


        for (var i = 0; i < id_arr.length; i++) {
            r_html += '<span class="filenamespan" filenameid = "' + id_arr[i] + '">' +
                name_arr[i] +
                '<small class="fork">×</small>' +
                '</span>';
        }
    }

    return r_html;
}

//处理内容中的公共内容部分
function contentCommon(arr, arr_id) {
    var arr_result = new Array();
    //console.info('arr');console.info(arr);
    //console.info('arr_id');console.info(arr_id);

    if (arr != null && arr.length > 0 && arr_id != null && arr_id.length > 0) {
        for (var i = 0; i < arr_id.length; i++) {
            var arr_new = arr.filter(function (element, index, self) {
                return element.voice == arr_id[i];
            });

            var item = {};
            item.poiName = arr_new[0].poiName;
            item.voice = arr_new[0].voice;
            item.emoji = arr_new[0].emoji;
            item.resourceType = arr_new[0].resourceType;//资源类型
            var bigSc_arr = new Array();

            //大屏展示的内容处理
            for (var j = 0; j < arr.length; j++) {
                var bigSc_item = {};
                if (arr[j].voice == arr_id[i]) {
                    bigSc_item.id = arr[j].id;
                    bigSc_item.taskId = arr[j].taskId;
                    bigSc_item.resourceId = arr[j].resourceId;
                    bigSc_item.resourceName = arr[j].resourceName;
                    bigSc_arr.push(bigSc_item);
                }
            }

            item.bigSc_arr = bigSc_arr;//大屏展示的内容
            arr_result.push(item);
        }
    }

    //console.info('arr_result');console.info(arr_result);
    return arr_result;
}

//资源展示
function resourceLoad() {

    //alert('资源展示方法');

    $('#resourceTable').bootstrapTable({
        ajaxOptions: {
            xhrFields: {        //跨域
                withCredentials: true
            },
            crossDomain: true,
            jsonp: "callback",
            jsonpCallback: "success_jsonpCallback",
        },
        type: "GET",
        url: share + '/irobotweb/sys/resource/query/list', //
        iconSize: 'outline',
        toolbar: '#exampleToolbar',
        striped: true, // 设置为true会有隔行变色效果
        dataType: "jsonp", // 服务器返回的数据类型
        pagination: true, // 设置为true会在底部显示分页条
        singleSelect: false, // 设置为true将禁止多选
        pageSize: 10, // 如果设置了分页，每页数据条数
        pageNumber: 1, // 如果设置了分布，首页页码
        pageList: [10, 25, 50, 100],
        queryParamsType: '',
        sidePagination: "server", // 设置在哪里进行分页，可选值为"client" 或者
        paginationLoop: false,
        paginationPreText: "上一页",
        paginationNextText: "下一页",
        paginationShowPageGo: true,     //显示跳转
        showJumpto: true,
        height: $(window).height() - 327,
        queryParams: function (params) {
            //这里的键的名字和控制器的变量名必须一直，这边改动，控制器也需要改成一样的
            var temp = {
                rows: params.pageSize,     //页面大小
                page: params.pageNumber,   //页码
                //排序列名
                // sortOrder: 'asc',
                filename: task_resource_filename, //资源名称
                type: resource_type,         //资源类型
                //userType: resource_userType  //资源用途
            };
            return temp;
        },
        columns: [
            {
                checkbox: true
            },
            {
                field: 'filename',
                align: 'center',
                title: '文件名称'
            },
            {
                field: 'row',
                align: 'center',
                title: '资源展示',
                formatter: function (value, row, index) {
                    // 0表示图片，1表示音频，2表示视频，3表示其他
                    if (row.type == "0") {
                        return '<img src="' + row.ossurl + '" alt="" style="width:50px;height=auto;">'
                    } else if (row.type == "2") {

                    }
                }
            },
        ]
    });
}

//将日期格式转换
function getNowFormatDate(t, f) {
    var date = new Date(t);
    var seperator1 = "-";
    var seperator2 = ":";
    var month = date.getMonth() + 1;
    var strDate = date.getDate();
    if (month >= 1 && month <= 9) {
        month = "0" + month;
    }
    if (strDate >= 0 && strDate <= 9) {
        strDate = "0" + strDate;
    }

    var currentdate = '';
    if (f == 1) //时分秒
    {
        currentdate = date.getFullYear() + seperator1 + month + seperator1 + strDate
            + " " + date.getHours() + seperator2 + date.getMinutes()
            + seperator2 + date.getSeconds();
    }
    else {
        currentdate = date.getFullYear() + seperator1 + month + seperator1 + strDate;
    }

    return currentdate;
}

//确定按钮点击
$("#addok").on('click', function (e) {

    if($('#deliveryPoiName').val()==''){
        //alert(333);
        $('#deliveryPoiName').addClass('error');
        //$('#lbl_sending').addClass('error');
        $('#lbl_sending').show().addClass('error').attr('style','width:90px;height:18px;');
        return false;
    }

    if (!$("#signupFormadd").valid()) {
        //$('#lbl_sending').attr('display','block');
        return false; //验证不通过，不允许提交
    }

    var obj = {};
    var robotTaskDetailsDOList = new Array();

    //obj.mapid=$('#map').find('option:selected').val();
    obj.mapId = current_map_id;
    obj.taskName = $('#taskName').val();//任务名称
    // 迎宾 wlcm_task
    // 解说 ex_task
    // 送物 sending_task
    // 广告 ad_task
    obj.taskType = 'sending_task';     //任务类型

    var divs = $('div[id*="content_add_id"]');
    //alert(divs.length);
    // console.info('divs[0]'); console.info(divs[0]);
    // console.info('divs[1]'); console.info(divs[1]);

    var d_number=0;
    for(var k = 0; k < divs.length; k++){
        var r_type=$(divs[k]).find("input[name*='typews']:checked").val();
        var d_time=$(divs[k]).find('.delayTime').val();

        if(r_type==0 && d_time==''){
            d_number++;
        }
    }

    if(d_number>0){
        layer.msg('请输入图片延时播放时间!');
        return false;
    }



    if (divs != null && divs.length > 0) {
        for (i = 0; i < divs.length; i++) {
            var content_child = {};
            content_child.priority = i;
            content_child.takePoiName = $('#takePoiName').val();//取物点名称
            content_child.takePoiId = $('#takePoiId').val();//取物点id
            content_child.deliveryPoiName = $('#deliveryPoiName').val();//送物点名称
            content_child.deliveryPoiId = $('#deliveryPoiId').val();//送物点id
            content_child.voice = $(divs[i]).find('.voice').val();  //语音
            content_child.emoji = $(divs[i]).find('.emoticon').val();//表情
            content_child.resourceType = $(divs[i]).find("input[name*='typews']:checked").val();//资源类型
            content_child.delayTime = $(divs[i]).find('.delayTime').val(); //图片延时播放时间

            //var showscrnid = new Array();
            var recourceIds = '', recourceNames = '';

            $(divs[i]).find('.filenamespan').each(function () {
                //showscrnid.push($(this).attr('filenameid'));//添加至数组
                recourceIds += $(this).attr('filenameid') + ',';
                recourceNames += $(this).text().replace('×', '') + ',';
            });

            var reg = /,$/gi;
            content_child.resourceId = recourceIds.replace(reg, "");
            content_child.resourceName = recourceNames.replace(reg, "");
            robotTaskDetailsDOList.push(content_child);
        }
    }

    obj.robotTaskDetailsDOList = robotTaskDetailsDOList;

    if (!$("#signupFormadd").valid()) {
        //return false; //验证不通过，不允许提交
    }


    var url = '', ajax_type = '', ok_result = '';
    if ($.isEm(current_edit_id)) {
        url = share + "/irobotweb/sys/robottask/add";
        ajax_type = 'post';
        ok_result = '添加成功';
    }
    else {
        obj.id = current_edit_id;
        url = share + "/irobotweb/sys/robottask/update";
        ajax_type = 'put';
        ok_result = '修改成功';
    }

    var jsonStr = JSON.stringify(obj); //json字符串
    console.info('保存的信息'); console.info(jsonStr);

    $.ajax({
        type: ajax_type,
        url: url,
        data: jsonStr,
        crossDomain: true,
        async: false,
        dataType: "json",
        contentType: "application/json; charset=utf-8",
        xhrFields: {
            withCredentials: true
        },
        error: function (request) {
            parent.layer.alert("Connection error");
        },
        success: function (data) {
            //console.log(data,'增加之后返回的字段');

            console.info('保存返回的信息'); console.info(data);

            if (data.code == 200) {
                //layer.alert("添加成功！")
                //window.parent.location.href = "./RobotManage.html"
            }

            if (data.code == 200) {

                parent.layer.alert(ok_result, function () {
                    window.parent.location.reload();
                    var index = parent.layer.getFrameIndex(window.name);
                    parent.layer.close(index);
                });
            }
            else {
                layer.msg(data.msg);
            }
        }
    });

    e.preventDefault()
});

//取消按钮点击
$('#adddanger').on('click', function () {
    //window.parent.location.href = "./RobotManage.html";
    var index = parent.layer.getFrameIndex(window.name); // 获取窗口索引
    parent.layer.close(index);
});

$('#map').on('change', function () {
    //var map_id = $(this).find('option:selected').val();
    //alert(map_id);
    var map_id_selected = $(this).find('option:selected').val();
    //alert(map_id_selected);

    if ($.isEm(map_id_selected)) {
        //$('#btn-select-point').hide();
    }
    else {

        //$('#btn-select-point').show();
    }

});

//弹出页面选择点位
function selectPoint(v) {
    //var map_id = $('#map').find('option:selected').val();
    sessionStorage.setItem('task_set_map_id', current_map_id);
    //console.info('点位id');
    //console.info($(v).parent().prev().attr('id'));
    var content_url='./PointSelect.html?poiType=takepoint';

    if($(v).parent().prev().attr('id')=='deliveryPoiName'){
        content_url='./PointSelect.html?poiType=sendingpoint';
    }


    layer.open({
        type: 2,
        title: '选择点位',
        maxmin: true,
        shadeClose: false,
        area: ['900px', '700px'],
        content: content_url,  // iframe的url
        end: function () {
            //alert(666);
            // var ex_poiname = sessionStorage.getItem('welcomeguest_poiname');
            // var ex_poiid= sessionStorage.getItem('welcomeguest_poiid');

            $(v).parent().prev().val(welcomeguest_poiname);
            $(v).parent().prev().prev().val(welcomeguest_poiid);
            //console.info('$(v).prev()');console.info($(v).prev());
            //sessionStorage.setItem('welcomeguest_poiname', ''); sessionStorage.setItem('welcomeguest_poiid', '');
        }
    });
}

//选择表情
function selectEmoji(v) {
    layer.open({
        type: 2,
        title: '选择表情',
        maxmin: true,
        shadeClose: false,
        area: ['570px', '400px'],
        content: './emoji.html',  // iframe的url
        end: function () {
            //alert(666);
            var welcomeguest_emoji = sessionStorage.getItem('welcomeguest_emoji');
            //alert(welcomeguest_emoji);
            //console.info($(v).prev());
            $(v).prev().val(welcomeguest_emoji);
        }
    });
}

//验证方法
function validateRule() {
    var icon = "<i class='fa fa-times-circle'></i> ";

    $("#signupFormadd").validate({
        onfocusout: function (element) { $(element).valid(); },
        rules: {
            taskName: {
                required: true
            },
            // deliveryPoiName:{
            //     required: true
            // }
        },
        messages: {
            taskName: {
                required: icon + "请输入任务名称"
            },
            // deliveryPoiName: {
            //     required: icon + "请选择送物点"
            // }
        }
    })
}

