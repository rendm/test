var robotid;
var hardwareno;
var mapid;
var taskDOList;
var left_click_x, left_click_y, dot_arr, mapfile, mapfile_width, mapfile_height, robot_x, robot_y, zoom_ratio;
var canvas = document.getElementById("canvas");//获取画布
var canvas_draw;
var manual_status = true;
var sizeX = 0, sizeY = 0, moveX = 0, moveY = 0;

var color_arr = ['Red', 'Brown', 'LimeGreen',
    'CornflowerBlue', 'Crimson', 'DarkCyan',
    'DarkGoldenRod', 'DarkGreen', 'DarkSalmon',
    'DarkSeaGreen', 'DeepPink', 'DodgerBlue',
    'ForestGreen', 'Fuchsia', 'GreenYellow',
    'IndianRed', 'Chocolate'];

var color_arr_new = ['DarkCyan', 'Navy', 'Fuchsia', 'blue', 'IndianRed', '#ff0000']; //依次为 迎宾点 取物点 送物点 普通点 充电点


var config = {
    //width: 600,        // 设置canvas的宽
    //height: 700,        // 设置canvas的高
    //imgSrc: 'data:image/png;base64,' + mapfile,    // 图片路径
    imgSrc: '',
    maxScale: 4.0,        // 最大放大倍数
    minScale: 0.1,        // 最小放大倍数
    step: 0.1            // 每次放大、缩小 倍数的变化值
};

var imgStatus = {
    'scale': 1.0,
    'rotate': 0
};

$(function () {
    //$('#btnSmall').hide();
    //zoom_ratio=0.05;
    robotid = sessionStorage.getItem('controlid');
    var robotName = sessionStorage.getItem('robotName');
    $('#s-robotid').text('ID:' + robotid);
    if (robotName != null && robotName != '') {
        $('#s-robotname').text('名称:' + robotName);
    }

    //计算地图每次缩放的幅度及偏移量begin
    var proportion = 1;

    var window_width = $(window).width();
    var window_height = $(window).height();
    var img_width = $('#base-img').width();
    var img_height = $('#base-img').height();

    if (window_width / img_width < window_height / img_height)
        proportion = $(window).width() / img_width;
    else
        proportion = $(window).height() / img_height;

    var back_width = $('#base-img').width() * proportion;
    var back_height = $('#base-img').height() * proportion;
    //放大缩小操作时的尺寸变化
    sizeX = Math.round(back_width / 10);//94.9
    sizeY = Math.round(back_height / 10);//94.9
    //放大缩小操作时的位置变化
    moveX = Math.round(sizeX / 2);//47.45
    moveY = Math.round(sizeY / 2);//47.45
    //计算地图每次缩放的幅度及偏移量end

    initmap(robotid);

    $('#poI-coordinate').hide();
    $('#drawmap-main').hide();
    $('#top-point-info').hide();

    //canvas绘图begin
    // config.imgSrc=mapfile;
    // config.width=mapfile_width;
    // config.height=mapfile_height;
    // console.info('mapfile='+mapfile);
    // console.info('mapfile_width='+mapfile_width);
    // console.info('mapfile_height='+mapfile_height);

    //drawCanvasImg(1);
    //canvas绘图end

    // $('#base-img').smartZoom({ 'containerClass': 'zoomableContainer' });
    // $('.zoomableContainer').attr('style','left:-205px');
    // $('#btnBig,#btnSmall').bind("click", zoomButtonClickHandler);
    // alert($('.zoomableContainer').attr('style'));

    $('[name="status"]').bootstrapSwitch({
        onText: "开",
        offText: "关",
        onColor: "success",
        offColor: "warning",
        size: "mini",
        handleWidth: 50,
        labelWidth: 20,
        onInit: function (event, state) {
            //state=true;
            //alert(state);
            //console.info('state');console.info(state.currentTarget);
            //alert($(state.currentTarget).val());

        },
        onSwitchChange: function (event, state) {
            if (state == true) {
                //alert(555);
                //console.info('$(this)'); console.info($(this));
                $(this).val("1");//关
                manual_status = false;
                $('#click-up').removeClass('c-point');
                $('#click-right').removeClass('c-point');
                $('#click-down').removeClass('c-point');
                $('#click-left').removeClass('c-point');
            } else {
                //alert(666);
                $(this).val("2");//开
                manual_status = true;
                $('#click-up').addClass('c-point');
                $('#click-right').addClass('c-point');
                $('#click-down').addClass('c-point');
                $('#click-left').addClass('c-point');
            }
        }
    })

});
var openflag = true;

//绘制canvas图片
function drawCanvasImg(r) {

    //debugger
    var config1 = {
        //width: 600,        // 设置canvas的宽
        //height: 700,        // 设置canvas的高
        imgSrc: '',
        imgSrc: 'data:image/png;base64,' + mapfile,    // 图片路径
        width: mapfile_width,        // 设置canvas的宽
        height: mapfile_height,        // 设置canvas的高
        maxScale: 4.0,        // 最大放大倍数
        minScale: 0.1,        // 最小放大倍数
        step: 0.1            // 每次放大、缩小 倍数的变化值
    };

    var imgStatus1 = {
        'scale': 1.0,
        'rotate': 0
    };

    var x = mapfile_width;
    var y = mapfile_height;
    var img = new Image();
    //img.src = config.imgSrc;
    img.src = 'data:image/png;base64,' + mapfile;



    img.onload = function () {
        //alert('图片加载');

        //debugger
        var ctx = $('#canvas')[0].getContext("2d");

        lastStatus = {
            "imgX": -1 * img.width / 2,
            "imgY": -1 * img.height / 2,
            'mouseX': 0,
            'mouseY': 0,
            'translateX': canvas.width / 2,
            'translateY': canvas.height / 2,
            'scale': 1.0,
            'rotate': 0
        };

        var imgX = lastStatus.imgX - (x - lastStatus.translateX) / lastStatus.scale;
        var imgY = lastStatus.imgY - (y - lastStatus.translateY) / lastStatus.scale;
        //alert(canvas.width+','+canvas.height);
        ctx.beginPath();
        //source-over
        // destination-over
        // source-atop
        // destination-atop
        // source-in
        // destination-in
        // source-out
        // destination-out
        // lighter
        // copy
        // xor

        //ctx.globalCompositeOperation="source-over";//点位是空白的，不显示
        ctx.globalCompositeOperation = "destination-over";//点位显示，有点重叠，是效果最好的一种
        //ctx.globalCompositeOperation="source-atop";//图片不显示，点位空白
        //ctx.globalCompositeOperation="destination-atop";//放大有效果，但不正确
        //ctx.globalCompositeOperation="source-in";//图片空白
        //ctx.globalCompositeOperation="destination-in";//图片也是空白
        //
        //
        //ctx.globalCompositeOperation="source-out";//点位不显示
        //ctx.globalCompositeOperation="destination-out";//什么都不显示
        //ctx.globalCompositeOperation="lighter";//点位是白的，图片是正确的
        //ctx.globalCompositeOperation="copy";//点位也不显示
        //ctx.globalCompositeOperation="xor";//点位也不显示1

        ctx.clearRect(0, 0, x, y);
        ctx.save();
        ctx.translate(x, y);
        ctx.rotate(imgStatus.rotate * Math.PI / 180);
        ctx.scale(imgStatus.scale, imgStatus.scale);
        ctx.drawImage(img, imgX - (x / 2), imgY - (y / 2), img.width, img.height);
        // console.info('坐标位置:');
        // console.info(imgX-(x/2));
        // console.info(imgY-(y/2));
        // console.info('图片大小:');
        // console.info(img.width);
        // console.info(img.height);

        //drawDot(canvas_draw,2.5,-6.5,'巡航点','red');//绘制固定点
        //drawRobotPosition(canvas_draw,data.x,data.y);   //绘制机器人点位图
        ctx.restore();

        lastStatus = {
            'imgX': imgX,
            'imgY': imgY,
            'translateX': x,
            'translateY': y,
            'scale': imgStatus.scale,
            'rotate': imgStatus.rotate
        };

        //drawDot(canvas_draw,-4.73,2.19,'巡航点1','red');
    };
}

//放大/缩小的方法
function zoomButtonClickHandler(e) {
    //alert(555);
    var scaleToAdd = 0.8;

    if (e.target.id == 'btnSmall') {
        $('#btnSmall').hide(); $('#btnBig').show();
        zoom_ratio += 0.02228;
        scaleToAdd = -scaleToAdd;
    } else {
        $('#btnSmall').show(); $('#btnBig').hide();
        zoom_ratio -= 0.02228;
    }

    //alert(scaleToAdd);

    //alert(zoom_ratio);
    $('#base-img').smartZoom('zoom', scaleToAdd);
    initmap(robotid);
    //drawRobotPosition(canvas_draw,robot_x,robot_y);//resolution_ratio  分辨率系数
}


//根据mapid获取坐标信息
function getMapCoordinate() {

    //console.info('taskDOList');console.info(taskDOList);

    if (!$.isEm(taskDOList)) {
        mapid = taskDOList.mapId;       //地图id

        if (!$.isEm(mapid)) {
            var url = share + 'irobotweb/sys/mappoi/query/mapids?mapid=' + mapid;
            $.ajax({
                url: url,
                crossDomain: true,
                type: "get",
                async: false,
                dataType: "json",
                xhrFields: {
                    withCredentials: true
                },
                success: function (data) {
                    // console.info('坐标信息');
                    // console.info(data);
                    dot_arr = data.data;//获取固定点的数组
                },
                error: function (request) {
                    layer.alert("Connection error");
                },
            });
        }
    }
}

//根据数据库中的固定点坐标来绘制点的位置
function drawDotByDb() {

    if (dot_arr != null && dot_arr.length > 0) {
        //var canvasDom= getCanvas(canvas.width,canvas.height);
        //console.info('canvas.width');console.info(canvas.width);
        //console.info('canvas.height');console.info(canvas.height);

        for (var i = 0; i < dot_arr.length; i++) {
            var x = parseFloat(dot_arr[i].x);
            var y = parseFloat(dot_arr[i].y);
            //console.info('x='+x+',y='+y);
            //drawDot(canvas_draw,x,y,dot_arr[i].poiName,color_arr[i]);//绘制固定点
            drawDot(canvas_draw, x, y, dot_arr[i].poiName, dot_arr[i].poiType);
        }
    }
}

//$('body').not('#poI-coordinate'),click(function () {
//alert(666);
//alert($('#poI-coordinate').css('display'));
//if($('#poI-coordinate').css('display')=='block'){
//$('#poI-coordinate').hide();
//}
//});

//放大地图
$('#btnBig').click(function () {

    //alert('放大前宽度='+$('#base-img').width()+',放大幅度='+sizeX);
    //alert('moveX='+moveX+',moveY='+moveY);
    if ($('#base-img').width() > 1000) {
        layer.msg('已放大至最大尺寸!');
        return;
    }

    var offs = $("#base-img").offset();
    console.info('offset-left=' + offs.left + ',offset-top=' + offs.top);
    //alert($('#base-img').width());
    var width_new = $('#base-img').width() + sizeX;
    var height_new = $('#base-img').height() + sizeY;

    $('#base-img').width(width_new);
    $('#base-img').height(height_new);
    $("#base-img").offset(function (n, c) {
        newPos = new Object();

        newPos.left = c.left - moveX;
        newPos.top = c.top - moveY;
        //console.info('newPos.left=' + newPos.left);
        //console.info('newPos.top=' + newPos.top);
        return newPos;
    });

    //alert('放大后宽度='+$('#base-img').width());
    // canvas.width = data.mapDO.width;
    // canvas.height = data.mapDO.height;

    $('#canvas').width(width_new);
    $('#canvas').height(height_new);
    $("#canvas").offset(function (n, c) {
        newPos = new Object();

        newPos.left = c.left - moveX;
        newPos.top = c.top - moveY;
        //console.info('newPos.left=' + newPos.left);
        //console.info('newPos.top=' + newPos.top);
        return newPos;
    });

});

//缩小地图
$('#btnSmall').click(function () {

    if ($('#base-img').width() < 500) {
        layer.msg('已缩小至最小尺寸!');
        return;
    }
    //var offs = $("#base-img").offset();
    //console.info('offset-left=' + offs.left + ',offset-top=' + offs.top);
    //alert($('#base-img').width());
    //alert(sizeX);alert(sizeY);

    var width_new = $('#base-img').width() - sizeX;
    var height_new = $('#base-img').height() - sizeY;

    $('#base-img').width(width_new);
    $('#base-img').height(height_new);

    $("#base-img").offset(function (n, c) {
        newPos = new Object();

        newPos.left = c.left + moveX;
        newPos.top = c.top + moveY;
        //console.info('newPos.left=' + newPos.left);
        //console.info('newPos.top=' + newPos.top);
        return newPos;
    });

    $('#canvas').width(width_new);
    $('#canvas').height(height_new);

    $("#canvas").offset(function (n, c) {
        newPos = new Object();
        newPos.left = c.left + moveX;
        newPos.top = c.top + moveY;
        return newPos;
    });

    //alert('缩小后宽度='+$('#base-img').width());
});

$(".poi").on('click', function () {

    if (mapid != null) {
        if (openflag) {
            $.ajax({
                url: share + '/irobotweb/sys/mappoi/query/mapids?mapid=' + mapid,
                type: "get",
                cache: false,
                crossDomain: true,
                xhrFields: {
                    withCredentials: true
                },
                success: function (json) {
                    if (json.code == 200) {
                        var html = "";
                        $.each(json.data, function (n, value) {
                            //alert(n+' '+value.poiName);
                            html = html + '<p><small>' + value.poiName + '</small>';
                            html = html + '<span><small>X:' + value.x + '</small>';
                            html = html + '<small>Y:' + value.y + '</small>';
                            html = html + '<small>Yaw:' + value.yaw + '</small></span></p>';
                            // $("#poI-coordinate").toggle();
                        });
                        //$("#poI-coordinate").html(html);
                        openflag = false;
                    }

                }
            });
        } else {
            $("#poI-coordinate").html("");
            openflag = true;

        }


    }

});

$('.set-item').click(function () {
    //alert(333);
    $('#poI-coordinate').show();
});

$('#poI-coordinate p').click(function () {
    //alert(666);
    $('#poI-coordinate').hide();
});

//点击canvas
//$('#canvas').click(function () {
//left_click_x=$("#messagex").html();
//left_click_y=$("#messagey").html();
//alert(left_click_x+','+left_click_y);
//});

//左键事件
function clickLeft(e) {
    e.preventDefault();
    e.stopPropagation();

    left_click_x = $("#messagex").html();
    left_click_y = $("#messagey").html();
    //console.info(left_click_x+','+left_click_y);
    //console.info('dot_arr');console.info(dot_arr);
    var dot_clicked = cal_left_menu(left_click_x, left_click_y);
    //console.info('dot_clicked');console.info(dot_clicked);

    if (dot_clicked != null && dot_clicked != undefined) {
        $("#left-hand").css({
            "display": "block",
            "left": e.clientX - 380,
            "top": e.clientY - 55
        });
    }
}

//根据左键点击的坐标计算是否显示左键处理菜单
function cal_left_menu(left_click_x, left_click_y) {


    if (dot_arr != null && dot_arr.length > 0) {
        var dot_clicked;

        for (var i = 0; i < dot_arr.length; i++) {
            if (dot_arr[i].poiName == '充电点') {
                //console.info('left_click_x='+left_click_x+',dot_arr[i].x='+parseFloat(dot_arr[i].x));
                //console.info('left_click_y='+left_click_y+',dot_arr[i].y='+parseFloat(dot_arr[i].y));
            }

            var abs_x = Math.abs(parseFloat(dot_arr[i].x) - left_click_x);
            var abs_y = Math.abs(parseFloat(dot_arr[i].y) - left_click_y);
            if (dot_arr[i].poiName == '充电点') {
                //console.info('abs_x='+abs_x+',abs_y='+abs_y);
            }

            if (abs_x <= 0.38 && abs_y <= 0.38) { //使用0.4也可以
                dot_clicked = dot_arr[i];
                break;
            }
        }
        return dot_clicked;
    }
}

//左键菜单-删除
$('.delete-point').click(function () {
    leftClickDelete();
});

//页面头部-删除点位-最新
$('#delPoint').click(function () {
    //alert(666);

    var pointId = $("#top-point-info").attr('pointId');

    if (pointId != null && pointId != '') {

        layer.confirm('确定要删除该点位？', {
            btn: ['确定', '取消']
        }, function () {
            var url = share + "/irobotweb/sys/mappoi/delete?id=" + pointId;

            $.ajax({
                url: url,
                type: "DELETE",
                crossDomain: true,
                xhrFields: {
                    withCredentials: true
                },
                success: function (data) {

                    //console.info('删除返回消息');console.info(data);

                    if (data.code == 200) {

                        parent.layer.alert('删除成功', function () {
                            //window.location.reload();
                            window.location.href = "./control.html";
                        });

                    } else {
                        layer.msg(data.msg);
                    }
                }
            });
        });
    }
});

//页面头部-编辑点位-最新
$('#editPoint').click(function () {
    sessionStorage.setItem('poiId', $("#left-hand").attr('pointId'));
    sessionStorage.setItem('poiName', $("#left-hand").attr('poiName'));
    sessionStorage.setItem('poiType', $("#left-hand").attr('poiType'));
    sessionStorage.setItem('poiX', $("#left-hand").attr('poiX'));
    sessionStorage.setItem('poiY', $("#left-hand").attr('poiY'));
    sessionStorage.setItem('poiYaw', $("#left-hand").attr('poiYaw'));
    sessionStorage.setItem('mapId', $("#left-hand").attr('mapId'));

    layer.open({
        type: 2,
        title: '编辑点位',
        maxmin: true,
        shadeClose: false,
        area: ['800px', '400px'],
        content: './edit.html'  // iframe的url
    });
});

//左键菜单-编辑
$('.edit-point').click(function () {
    //alert('编辑');

    //$("#left-hand")
    //attr('pointId',dot_clicked.id).attr('poiName',dot_clicked.poiName).attr('poiType',dot_clicked.poiType);
    sessionStorage.setItem('poiId', $("#left-hand").attr('pointId'));
    sessionStorage.setItem('poiName', $("#left-hand").attr('poiName'));
    sessionStorage.setItem('poiType', $("#left-hand").attr('poiType'));
    sessionStorage.setItem('poiX', $("#left-hand").attr('poiX'));
    sessionStorage.setItem('poiY', $("#left-hand").attr('poiY'));
    sessionStorage.setItem('poiYaw', $("#left-hand").attr('poiYaw'));
    sessionStorage.setItem('mapId', $("#left-hand").attr('mapId'));

    layer.open({
        type: 2,
        title: '编辑点位',
        maxmin: true,
        shadeClose: false,
        area: ['800px', '400px'],
        content: './edit.html'  // iframe的url
    });

    $("#left-hand").css({
        "display": "none"
    });
});

//处理左键菜单和右键菜单的隐藏
$('.center-img').click(function (e) {

    var target = $(e.target);
    //左键-删除
    if (target.is('.delete-point') || target.is('.edit-point')) {
        return;
    }
    else {
        //console.info(999);
        left_click_x = $("#messagex").html();
        left_click_y = $("#messagey").html();
    }

    //console.info('target');console.info(target);
    var dot_clicked = cal_left_menu(left_click_x, left_click_y);
    //console.info('点击点位的x,y坐标:x='+left_click_x+',y='+left_click_y);
    //console.info('左键选中的点555:dot_clicked');console.info(dot_clicked);

    if (!target.is('.edit-point') && !target.is('.delete-point') && dot_clicked == undefined) {
        $("#left-hand").css({
            "display": "none"
        });

        $('#top-point-info').hide();
    }

    if (!target.is('.move') && !target.is('.set')) {
        $("#right-hand").css({
            "display": "none"
        });
    }

    if (dot_clicked != null && dot_clicked != undefined) {

        //alert(dot_clicked.poiName);
        //alert(dot_clicked.poiType);
        $('#s-poiName').text(dot_clicked.poiName);
        if (dot_clicked.poiType == 'wlcmpoint') {
            $('#s-poiType').text('迎宾点');
        } else if (dot_clicked.poiType == 'takepoint') {
            $('#s-poiType').text('取物点');
        } else if (dot_clicked.poiType == 'sendingpoint') {
            $('#s-poiType').text('送物点');
        } else if (dot_clicked.poiType == 'poipoint') {
            $('#s-poiType').text('普通点');
        } else if (dot_clicked.poiType == 'chargepoint') {
            $('#s-poiType').text('充电点');
        } else {
            $('#s-poiType').text('普通点');
        }

        //$('#s-poiType').text(dot_clicked.poiType);

        //alert('显示');
        $('#top-point-info').show().attr('pointId', dot_clicked.id)
            .attr('poiName', dot_clicked.poiName)
            .attr('poiType', dot_clicked.poiType)
            .attr('poiX', dot_clicked.x)
            .attr('poiY', dot_clicked.y)
            .attr('poiYaw', dot_clicked.yaw)
            .attr('mapId', dot_clicked.mapId);

        $("#left-hand").css({
            "display": "none",//新的文档不需要左键菜单
            "left": e.clientX - 380,
            "top": e.clientY - 55
        }).attr('pointId', dot_clicked.id)
            .attr('poiName', dot_clicked.poiName)
            .attr('poiType', dot_clicked.poiType)
            .attr('poiX', dot_clicked.x)
            .attr('poiY', dot_clicked.y)
            .attr('poiYaw', dot_clicked.yaw)
            .attr('mapId', dot_clicked.mapId);
    }

    if (!target.is('#canvas')) {

        $("#left-hand").css({
            "display": "none"
        });

        $("#right-hand").css({
            "display": "none"
        });
    } else {
        //alert('aaaaaaa点中了');
    }
    //console.info('target');console.info(target);
    //alert(target);
    //e?e.stopPropagation():event.cancelBubble = true;
});



//左键-删除-方法
function leftClickDelete() {

    var pointId = $("#left-hand").attr('pointId');

    if (pointId != null && pointId != '') {
        //alert(333);
        var url = share + "/irobotweb/sys/mappoi/delete?id=" + pointId;

        $.ajax({
            url: url,
            type: "DELETE",
            crossDomain: true,
            xhrFields: {
                withCredentials: true
            },
            success: function (data) {

                console.info('删除返回消息'); console.info(data);

                if (data.code == 200) {

                    parent.layer.alert('删除成功', function () {
                        //window.location.reload();
                        window.location.href = "./control.html";
                    });

                } else {
                    layer.msg(data.msg);
                }
            }
        });
    }

    $("#left-hand").css({
        "display": "none"
    });
}

//绘制地图
$('.drawmap').click(function () {
    $('#drawmap-main').show();
});

//储物仓开门
$('.opendoor').click(function () {
    $('#drawmap-main').hide();
});

//储物仓关门
$('.closedoor').click(function () {
    $('#drawmap-main').hide();
});

//充电
$('.recharge').click(function () {
    $('#drawmap-main').hide();
});

//取消充电
$('.cancel-recharge').click(function () {
    $('#drawmap-main').hide();
});

$('.menu').click(function () {
    $('#drawmap-main').hide();
});

//进入页面加载数据
function initmap(robotid) {

    //alert(robotid);
    //alert(share + 'irobotweb/sys/map/initrobotstatus?robotid='+robotid);

    $.ajax({
        url: share + 'irobotweb/sys/map/initrobotstatus?robotid=' + robotid,
        type: "get",
        cache: false,
        async: false,
        crossDomain: true,
        xhrFields: {
            withCredentials: true
        },
        success: function (json) {
            var data = json.data;

            if (json.code == 200) {
                hardwareno = data.macaddress;//机器人硬件地址
                if (!$.isEm(data.mapDO) && !$.isEm(data.mapDO.mapId)) {
                    mapid = data.mapDO.mapId;
                } else {
                    mapid = 0;
                }

                taskDOList = data.mapDO;

                //console.info('taskDOList');
                //console.info(taskDOList);
                //(hardwareno,'hardwarenohardwarenohardwareno')

                $("#id").html(robotid);
                $("#name").html(data.name);
                $("#macaddress").html(data.macaddress);

                $("#x").val(data.x);
                $("#y").val(data.y);
                $("#yaw").val(data.yaw);//角度
                $("#vx").val(data.vx);
                $("#vy").val(data.vy);
                $("#vtheta").val(data.vtheta);

                //base
                if (data.base == 0) {
                    $("#base").attr("class", "green");
                } else if (data.base == 1) {
                    $("#base").attr("class", "red");
                }
                //laswer 雷达
                if (data.laswer == 0) {
                    $("#laswer").attr("class", "green");
                } else if (data.laswer == 1) {
                    $("#laswer").attr("class", "red");
                }

                //odom
                if (data.odom == 0) {
                    $("#odom").attr("class", "green");
                } else if (data.odom == 1) {
                    $("#odom").attr("class", "red");
                }

                //uwb
                if (data.uwb == 0) {
                    $("#uwb").attr("class", "green");
                } else if (data.uwb == 1) {
                    $("#uwb").attr("class", "red");
                }

                //导航状态  moveStatus
                initmoveStatus(data.movestatus);
                initchargestatus(data.chargestatus);
                initlocstatus(data.locstatus);

                if (!$.isEm(data.mapDO)) {
                    mapfile = data.mapDO.mapfile;
                    mapfile_width = data.mapDO.width;
                    mapfile_height = data.mapDO.height;

                    //document.getElementById('base-img').setAttribute('src', 'data:image/png;base64,' + data.mapDO.mapfile);
                    $('#base-img').attr('src', 'data:image/png;base64,' + data.mapDO.mapfile);

                    $("#base-img").css({
                        "width": data.mapDO.width,
                        "height": data.mapDO.height
                    });

                    canvas.width = data.mapDO.width;
                    canvas.height = data.mapDO.height;
                }

                canvas_draw = getCanvas(canvas.width, canvas.height);
                //var canvasDom= getCanvas(canvas.width,canvas.height);
                robot_x = data.x;
                robot_y = data.y;
                drawRobotPosition(canvas_draw, robot_x, robot_y);   //绘制机器人点位图
                //drawDot(canvas_draw,-4.73,2.19,'巡航点1','red');//绘制固定点

                //鼠标移动，实时显示坐标信息
                canvas.onmousemove = function (e) {
                    var location = getLocation(e.clientX, e.clientY);
                    // message.innerHTML = "x=" + location.x + " ,y=" + location.y;
                    $("#messagey").html(location.y);
                    $("#messagex").html(location.x);

                    left_click_x = $("#messagex").html();
                    left_click_y = $("#messagey").html();
                    var dot_clicked = cal_left_menu(left_click_x, left_click_y);
                    //console.info('left_click_x='+left_click_x+',left_click_y='+left_click_x);

                    if (dot_clicked != null && dot_clicked != undefined) {
                        $("#canvas").css('cursor', 'pointer');
                    } else {
                        $("#canvas").css('cursor', 'default');
                    }
                };

                connect(hardwareno);
            } else {
                alert('获取失败');
                alert(json.msg);
            }
        }

    });
    getMapCoordinate();//获取poi点位坐标
    drawDotByDb();//绘制点位
    getTasks();//获取任务信息
}

//根据mapid获取任务列表
function getTasks() {

    var url = share + 'irobotweb/sys/robottask/query/mapid?mapid=' + mapid;
    //alert(url);
    $.ajax({
        url: url,
        crossDomain: true,
        type: "get",
        async: false,
        dataType: "json",
        xhrFields: {
            withCredentials: true
        },
        success: function (data) {
            // console.info('任务信息');
            // console.info(data);

            var wlcm_task_arr = {}, ex_task_arr = {}, sending_task_arr = {}, ad_task_arr = {};
            var task_arr = data.data;

            if (task_arr != null) {
                //过滤不同任务类型的数组
                wlcm_task_arr = task_arr.filter(function (element, index, self) {
                    return element.taskType == 'wlcm_task';
                });

                ex_task_arr = task_arr.filter(function (element, index, self) {
                    return element.taskType == 'ex_task';
                });

                sending_task_arr = task_arr.filter(function (element, index, self) {
                    return element.taskType == 'sending_task';
                });

                ad_task_arr = task_arr.filter(function (element, index, self) {
                    return element.taskType == 'ad_task';
                });
            }

            //console.info('ex_task_arr'); console.info(ex_task_arr);
            //console.info('sending_task_arr'); console.info(sending_task_arr);
            //console.info('ad_task_arr'); console.info(ad_task_arr);

            //var add_html='';
            if (wlcm_task_arr != null && wlcm_task_arr.length > 0) {
                var add_html_0 = '<p class="task-name" style="margin-top: 2px;">迎宾任务</p>';
                add_html_0 += '<ul>';
                for (var i = 0; i < wlcm_task_arr.length; i++) {
                    add_html_0 += '<li onclick="taskExecute(' + wlcm_task_arr[i].id + ',' + "'wlcm_task'" + ')" style="cursor: pointer;">' + wlcm_task_arr[i].taskName + '</li>';
                }
                add_html_0 += '</ul>';
                $('.d-task-list').append(add_html_0);
            }
            if (ex_task_arr != null && ex_task_arr.length > 0) {
                //alert('定点讲解任务');
                var add_html_1 = '<p class="task-name" style="margin-top: 2px;">定点讲解任务</p>';
                add_html_1 += '<ul>';
                for (var i = 0; i < ex_task_arr.length; i++) {
                    add_html_1 += '<li onclick="taskExecute(' + ex_task_arr[i].id + ',' + "'ex_task'" + ')" style="cursor: pointer;">' + ex_task_arr[i].taskName + '</li>';
                }
                add_html_1 += '</ul>';
                $('.d-task-list').append(add_html_1);
            }
            if (sending_task_arr != null && sending_task_arr.length > 0) {
                //alert('送物任务');
                var add_html_2 = '<p class="task-name" style="margin-top: 2px;">送物任务</p>';
                add_html_2 += '<ul>';
                for (var i = 0; i < sending_task_arr.length; i++) {
                    add_html_2 += '<li onclick="taskExecute(' + sending_task_arr[i].id + ',' + "'sending_task'" + ')" style="cursor: pointer;">' + sending_task_arr[i].taskName + '</li>';
                }
                add_html_2 += '</ul>';
                $('.d-task-list').append(add_html_2);
            }
            if (ad_task_arr != null && ad_task_arr.length > 0) {
                //alert('广告任务');
                var add_html_3 = '<p class="task-name" style="margin-top: 2px;">广告任务</p>' + '<ul>';
                add_html_3 += '<ul>';
                for (var i = 0; i < ad_task_arr.length; i++) {
                    add_html_3 += '<li onclick="taskExecute(' + ad_task_arr[i].id + ',' + "'ad_task'" + ')" style="cursor: pointer;">' + ad_task_arr[i].taskName + '</li>';
                }
                add_html_3 += '</ul>';
                $('.d-task-list').append(add_html_3);
            }

            //console.info('add_html');console.info(add_html);
        },
        error: function (request) {
            layer.alert("Connection error");
        },
    });
}

//任务执行
function taskExecute(taskId, taskType) {
    var title = '', width = '405px', height = '205px';

    if (taskType == 'wlcm_task') {
        //alert('迎宾任务');
        title = '迎宾时间';
    } else if (taskType == 'ex_task') {
        //alert('解说任务');
        title = '定点讲解';
        width = '475px'; height = '270px';
    } else if (taskType == 'sending_task') {
        //alert('送物任务');
        title = '送物';
    } else if (taskType == 'ad_task') {
        //alert('广告任务');
        title = '广告时间';
    }

    //alert(taskId);
    //alert(hardwareno);

    layer.open({
        type: 2,
        title: title,

        shadeClose: false,
        area: ['1000px', '750px'],
        content: '../TaskSet/TaskExecute.html?robottaskid=' + taskId + '&hardwareno=' + hardwareno + '&taskType=' + taskType,
        end: function () {
            //alert(666);
            //var task_set_resourceinfo = sessionStorage.getItem('task_set_resourceinfo');
            //BigSc.html(task_set_resourceinfo);
            //sessionStorage.setItem('task_set_resourceinfo', '');//获取到值以后将session清空
        }
    });
}

//获取到画布
function getCanvas(width, height) {
    var canvasDom;
    if (!canvasDom) {
        var dom = $('#canvas')[0];
        if (dom) {
            canvasDom = dom.getContext("2d");
        }
    }

    canvasDom.translate(width / 2, height / 2);
    canvasDom.clearRect(-width / 2, -height / 2, width, height);
    //canvasDom.translate(width / 1, height / 1);
    //canvasDom.clearRect(-width / 1, -height / 1, width, height);
    return canvasDom;
}

//绘制机器人的位置-水滴图
function drawRobotPosition(canvas, x, y) {
    //var xd = x /0.05-10;     //-39.745599999999996
    //var xd = x /zoom_ratio+165;
    //var yd = -(y /zoom_ratio +20); //15.763399999999997

    var xd = x / 0.05 - 10;     //-39.745599999999996
    var yd = -(y / 0.05 + 20); //15.763399999999997
    console.log(x,y,'单位')
    var imgdd = document.getElementById("water-location");//图片信息
    canvas.beginPath();
    //canvasDom.arc(0,0,5,0,2*Math.PI);
    //canvas.scale(2,2);
    canvas.drawImage(imgdd, xd, yd, 20, 20);
    canvas.stroke();
}

//绘制圆点-固定点位
function drawDot(canvas, x, y, text, poiType){
    canvas.beginPath();
    //绘制一个点begin
    var xd = x / 0.05;
    var yd = -(y / 0.05);
    // var xd = x /zoom_ratio+165;
    // var yd = -(y /zoom_ratio);

    //console.info('xd='+xd+',yd='+yd);
    //canvas.fillStyle=color;
    //alert(poiType);

    // wlcmpoint    迎宾点
    // takepoint    取物点
    // sendingpoint 送物点
    // poipoint     普通点
    // chargepoint  充电点

    if (poiType == 'wlcmpoint') {
        canvas.fillStyle = color_arr_new[0];
    } else if (poiType == 'takepoint') {
        canvas.fillStyle = color_arr_new[1];
    } else if (poiType == 'sendingpoint') {
        canvas.fillStyle = color_arr_new[2];
    } else if (poiType == 'poipoint') {
        canvas.fillStyle = color_arr_new[3];
    } else if (poiType == 'chargepoint') {
        canvas.fillStyle = color_arr_new[4];
    } else {
        canvas.fillStyle = color_arr_new[4];
    }

    //设置字体样式
    canvas.font = "10px bold 宋体";
    //绘制文字
    //canvas.fillText("("+xd1+","+yd1+")",xd1,yd1);
    canvas.fillText(text, xd + 5, yd - 5);

    canvas.arc(xd, yd, 3, Math.PI * 2, 0, true);
    canvas.closePath();
    canvas.fill();
    //绘制一个点end
    //canvas.stroke();
}

//根据名称获取地址栏里的参数
function getQueryString(name) {
    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
    var r = window.location.search.substr(1).match(reg);
    if (r != null) return unescape(r[2]);
    return null;
}

//鼠标右击  触发的结果
//阻止右击事件
window.onload = function () {
    document.oncontextmenu = function (e) {
        //  var e = event || window.event;
        return false;//取消右键点击的默认事件
    }
    document.onclick = function (e) {
        // ('90鼠标左击')
    }
}

//右键事件
function clickRight(e) {
    e.preventDefault();
    e.stopPropagation();

    //var targetId = $(e.target.id);
    //alert(e.target.id);
    //console.info('右键target');console.info(target);
    //('iwqyuwqpy火狐右击');
    //alert(555);
    if (e.target.id == 'canvas') {
        $("#right-hand").css({
            "display": "block",
            "left": e.clientX - 380,
            "top": e.clientY - 55
        });

        $('#top-point-info').hide();

        var xxd = e.clientX - 380 - $("#canvas").width() / 2;
        var yyd = e.clientY - 55 - $("#canvas").width() / 2;
        var locationxy = getLocation(e.clientX, e.clientY);
        sessionStorage.setItem('x', locationxy.x);
        sessionStorage.setItem('y', locationxy.y);
        sessionStorage.setItem('xd', $("#x").val());
        //($("#x").val(),'框框里面的x值')
        sessionStorage.setItem('yd', $("#y").val());
        sessionStorage.setItem('mapid', mapid);
    }
}

$("#bg-img").on('mousedown', function (event) {

    var e = event || window.event;
    //('e.which');(e.which);
    //console.log('e.button');console.log(e.button);

    if (e.button == 2) {
        clickRight(e);
    }
    else if (e.which === 3) {
        clickRight(e);
    }

    if (e.button == 0) {
        //clickLeft(e);
    }
    else if (e.which === 1) {
        //clickLeft(e);
    }
});

//右键-移动到该点位
$(".move").on('click', function (event) {
    //console.log('移动');

    $("#right-hand").css({
        "display": "none",
    });
});

//右键-设置
$(".set").on('click', function (event) {
    //console.log('设置');
    layer.open({
        type: 2,
        title: '新增点位',
        maxmin: true,
        shadeClose: false,
        area: ['800px', '520px'],
        content: './manual.html'  // iframe的url
    });

    $("#right-hand").css({
        "display": "none",
    });
});

//立即停止-调用成功
$('.stop-task').click(function () {
    var url = share + '/irobotweb/task/control/shutdowntask';
    //alert(robotid);
    //alert(hardwareno);
    //console.info('taskDOList');
    //console.info(taskDOList);

    //"taskSerialId": 0,
    //"taskType": "string",
    //"taskTypeName": "string",
    //"taskname": "string",
    //"timeout": "string",
    //"updateTime": "string",
    //"updateUserId": "string",
    //updateUserName: "string"

    var param = {};
    param.robothadware = hardwareno;//机器人硬件地址
    param.robotid = robotid;        //机器人id
    jsonStr = JSON.stringify(param);

    $.ajax({
        url: url,
        type: "POST",
        crossDomain: true,
        xhrFields: {
            withCredentials: true
        },
        dataType: "json",
        contentType: "application/json; charset=utf-8",
        data: jsonStr,
        success: function (data) {

            //console.info('立即停止接口返回消息');
            //console.info(data);

            if (data.code == 0) {
                parent.layer.msg(data.msg);
                window.location.reload();
            } else {
                parent.layer.alert(data.msg);
            }
        },
        error: function (request) {
            layer.alert("Connection error");
        }
    });

});

//充电-调用成功
$('.recharge').click(function () {
    var url = share + '/irobotweb/task/control/charingtask';

    var param = {};
    param.hardwareno = hardwareno;//机器人硬件地址
    param.name = robotid;        //机器人id
    jsonStr = JSON.stringify(param);

    $.ajax({
        url: url,
        crossDomain: true,
        type: "POST",
        xhrFields: {
            withCredentials: true
        },
        dataType: "json",
        contentType: "application/json; charset=utf-8",
        data: jsonStr,
        success: function (data) {

            console.info('充电接口返回消息');
            console.info(data);

            if (data.code == 0) {
                parent.layer.msg(data.msg);
                window.location.reload();
            } else {
                parent.layer.alert(data.msg);
            }
        },
        error: function (request) {
            layer.alert("Connection error");
        }
    });
});

//取消充电-暂时先调用立即停止的接口
$('.cancel-recharge').click(function () {
    var url = share + '/irobotweb/task/control/shutdowntask';

    var param = {};
    param.robothadware = hardwareno;//机器人硬件地址
    param.robotid = robotid;        //机器人id
    jsonStr = JSON.stringify(param);

    $.ajax({
        url: url,
        crossDomain: true,
        type: "POST",
        xhrFields: {
            withCredentials: true
        },
        dataType: "json",
        contentType: "application/json; charset=utf-8",
        data: jsonStr,
        success: function (data) {

            console.info('立即停止接口返回消息');
            console.info(data);

            if (data.code == 0) {
                parent.layer.msg(data.msg);
                window.location.reload();
            } else {
                parent.layer.alert(data.msg);
            }
        },
        error: function (request) {
            layer.alert("Connection error");
        },
    });
});

//绘制地图接口-开始绘制地图、中断绘制地图、完成绘制地图
$('.drawmap-item').click(function () {
    //alert($(this).text());
    var draw_txt = $(this).text();
    var url = '';
    var url_start = share + '/irobotweb/sys/map/startbuildmap';  //开始扫图
    var url_cancel = share + '/irobotweb/sys/map/cancelbuildmap';//中断扫图
    var url_end = share + '/irobotweb/sys/map/endbuildmap';      //完成扫图

    var param = {};
    param.mapid = taskDOList.mapId;       //地图id
    param.mapname = taskDOList.mapName;   //机器人id
    param.robothadware = hardwareno;     //机器人硬件地址
    param.robotid = robotid;             //机器人id
    param.message = '';             //机器人id

    //console.info('taskDOList');
    //console.info(taskDOList);

    jsonStr = JSON.stringify(param);
    //console.info('jsonStr');
    //console.info(jsonStr);

    if (draw_txt == '开始绘制地图') {
        url = share + '/irobotweb/sys/map/startbuildmap';
    } else if (draw_txt == '中断绘制地图') {
        url = share + '/irobotweb/sys/map/cancelbuildmap';

    } else if (draw_txt == '完成绘制地图') {
        url = share + '/irobotweb/sys/map/endbuildmap';
    }

    $.ajax({
        url: url,
        crossDomain: true,
        type: "POST",
        xhrFields: {
            withCredentials: true
        },
        dataType: "json",
        contentType: "application/json; charset=utf-8",
        data: jsonStr,
        success: function (data) {

            console.info('绘制地图接口返回消息');
            console.info(data);

            if (data.code == 0) {
                parent.layer.msg(data.msg);
                window.location.reload();
            } else {
                parent.layer.alert(data.msg);
            }
        },
        error: function (request) {
            layer.alert("Connection error");
        },
    });

});

var stompClient = null;
var indicator = null;

function connect(hardwareno) {
    var ctrlNodesArr = [] ////路径上报的点位
    var ctrlNodesArr2 = [] ////路径上报的点位
    var dom = $('#canvas')[0]
    var x = [], y = [];
    var socket = new SockJS(share + "/ws");
    var canvasDom;
    var reg = new RegExp(":", "g");//g,表示全部替换。
    var queue1 = '/user/' + hardwareno.replace(reg, "") + '/queue/message'
    stompClient = Stomp.over(socket);
    stompClient.connect({}, function (frame) {
        stompClient.subscribe(queue1, function (response) {
            if (!canvasDom) {
                if (dom) {
                    canvasDom = dom.getContext("2d");
                }
            }
            var str = JSON.parse(response.body)
            // console.log(canvasDom, '这是画布的个数DDDDDDDD')
            if (str.event == 'getCurrentMapInfo') { //地图
                var bodydata = str.data;
                var img = str.data.base64;

                //document.getElementById('base-img').setAttribute('src', 'data:image/png;base64,' + img);
                $('#base-img').attr('src', 'data:image/png;base64,' + img);

                $("#base-img").css({
                    "width": bodydata.mapInfoBean.width,
                    "height": bodydata.mapInfoBean.height
                });

                canvas.width = bodydata.mapInfoBean.width;
                canvas.height = bodydata.mapInfoBean.height;
                canvasDom.translate($("#canvas").width() / 2, $("#canvas").height() / 2)
                //canvasDom.arc(0,0,3,0,2*Math.PI);
                canvasDom.stroke();
            } else if (str.event == 'mapNowPoint') {//点位上报

                var pos = str.data.pos;
                var vel = str.data.vel;
                var xd = pos.x / 0.05 - 10;
                var yd = -(pos.y / 0.05 + 20);
                $("#x").val(pos.x);
                $("#y").val(pos.y);
                $("#yaw").val(pos.yaw);
                $(".vx").val(vel.x);
                $(".vy").val(vel.y);
                $(".vtheta").val(vel.yaw);

                var imgdd = document.getElementById("water-location");
                canvasDom.clearRect(-$("#canvas").width() / 2, -$("#canvas").height() / 2, $("#canvas").width(), $("#canvas").height());

                if (ctrlNodesArr2 != null) {
                    var bezier4 = new BezierMaker(dom, ctrlNodesArr2, 'blue');

                    bezier4.drawBezier();
                }

                canvasDom.beginPath();
                canvasDom.strokeStyle = "pink";
                canvasDom.arc(pos.x / 0.05, -pos.y / 0.05, 3, 0, 2 * Math.PI, true);

                //canvasDom.scale(50,50);

                canvasDom.drawImage(imgdd, xd, yd, 20, 20);
                canvasDom.stroke();
            } else if (str.event == 'mapRealPath') { //运动路径上报

                canvasDom.strokeStyle = "pink";
                canvasDom.fillStyle = 'red';
                canvasDom.lineWidth = 2
                canvasDom.beginPath();
                for (var i = 0; i < str.data.path.length; i++) {
                    var path = str.data.path[i];
                    x.push(path.x / 0.05)
                    y.push(-(path.y / 0.05))
                }

                for (j = 0; j < x.length; j++) {
                    var obj = {
                        x: x[j],
                        y: y[j],
                    }
                    ctrlNodesArr2.push(obj)
                }
                console.log(ctrlNodesArr2);

                // ctrlNodesArr2.forEach(function(item, index){ //找到前一个点到下一个点中间的控制点
                //     canvasDom.arc(item.x,item.y,1,0,2*Math.PI);
                // })
                // canvasDom.stroke();

                var bezier4 = new BezierMaker(dom, ctrlNodesArr2, 'blue');

                bezier4.drawBezier();


            } else if (str.event == 'mapMoveStatus') {  //运动状态上报

                console.log(str.data.type, '运动状态上报');
                initmoveStatus(str.data.status);

            } else if (str.event == 'mapChargeStatus') { //充电状态上报
                initchargestatus(str.data.status)
                console.log(str.data.chargeStatu, '充电状态上报')
            } else if (str.event == 'mapBaseStatus') { //底盘基本状态上报

                var data = str.data;
                //base
                if (data.base == 0) {
                    $("#base").attr("class", "green");
                } else if (data.base == 1) {
                    $("#base").attr("class", "red");
                }
                //laswer 雷达
                if (data.laswer == 0) {
                    $("#laswer").attr("class", "green");
                } else if (data.laswer == 1) {
                    $("#laswer").attr("class", "red");
                }
                //odom
                if (data.odom == 0) {
                    $("#odom").attr("class", "green");
                } else if (data.odom == 1) {
                    $("#odom").attr("class", "red");
                }
                //uwb
                if (data.uwb == 0) {
                    $("#uwb").attr("class", "green");
                } else if (data.uwb == 1) {
                    $("#uwb").attr("class", "red");
                }
            } else if (str.event == 'mapLocalStatus') {//底盘定位状态上报(代表底盘当前是否定位成功)
                console.log(str.data.status, '底盘定位状态上报(代表底盘当前是否定位成功)')
                initlocstatus(str.data.statu);


                //status：int 当前状态
            } else if (str.event == 'mapEmergencyButtonStatus') {//底盘急停开关的状态
                console.log(str.data.chargeStatu, '充电状态上报')
            } else if (str.event == 'mapReportStatus') {//底盘运行信息
                console.log(str.data.chargeStatu, '充电状态上报')
            }
        });
    });
}

function disconnect() {
    if (stompClient != null) {
        stompClient.disconnect();
    }

    //console.log("Disconnected");
}

//websocked  连接上

//  鼠标按下  鼠标长按
var timeStart, timeEnd, time;//申明全局变量

//获取此刻时间
function getTimeNow() {
    var now = new Date();
    return now.getTime();
}

// 触发移动的接口函数
function triggermove(message) {
    //alert(robotid);
    var movedata = {
        "message": message,
        "robothadware": hardwareno,       //硬件地址   mac 地址
        "robotid":robotid
    };
    stompClient.send("/app/service/web", {}, JSON.stringify(movedata));
}

//结束移动的接口函数
//up上 down下 left左 right右
//鼠标按下时触发
//可以传参数
function holdDown(message) {
    timeStart = getTimeNow();//获取鼠标按下时的时间
    //setInterval会每100毫秒执行一次
    time = setInterval(function () {
        timeEnd = getTimeNow();//也就是每100毫秒获取一次时间
        //如果此时检测到的时间与第一次获取的时间差有1000毫秒
        triggermove(message)
        if (timeEnd - timeStart > 1000) {
            clearInterval(time);//便不再继续重复此函数 （clearInterval取消周期性执行）
            triggermove(message)
        }
    }, 200);
}

//鼠标抬起
function holdUp() {
    clearInterval(time);//如果按下时间不到1000毫秒便弹起，
    triggermove("stop");
    //console.log('hhh哈哈哈')
}

//页面鼠标
$("#click-up").on('mousedown', function () {
    //console.log('上');
    if (manual_status) {
        triggermove("up");
    }
});

$("#click-up").on('mouseup', function () {
    //console.log('上');
    if (manual_status) {
        holdUp();
    }
});

$("#click-down").on('mousedown', function () {
    //console.log('下');
    if (manual_status) {
        triggermove("down");
    }
});

$("#click-down").on('mouseup', function () {
    //console.log('下');
    if (manual_status) {
        holdUp();
    }
});

$("#click-left").on('mousedown', function () {
    //console.log('左')
    triggermove("left");
});

$("#click-left").on('mouseup', function () {
    //console.log('左');
    holdUp()
});

$("#click-right").on('mousedown', function () {
    //console.log('右');
    triggermove("right");
});

$("#click-right").on('mouseup', function () {
    //console.log('右');
    holdUp();
})

//键盘控制
document.onkeydown = function (e) {
    e = window.event || e;
    switch (e.keyCode) {
        case 37: //左键
            //console.log('左');
            triggermove("left");
            break;
        case 38: //向上键
            //console.log('上');
            triggermove("up");
            break;
        case 39: //右键
            //console.log('右');
            triggermove("right");
            break;
        case 40: //向下键
            //console.log('下');
            triggermove("down");
            break;
        default:
            break;
    }
}

//键盘点击
document.onkeyup = function (e) {
    e = window.event || e;
    switch (e.keyCode) {
        case 37: //左键
            //console.log('抬起左');
            holdUp();
            break;
        case 38: //向上键
            //console.log('抬起上');
            holdUp();
            break;
        case 39: //右键
            //console.log('抬起右');
            holdUp();
            break;
        case 40: //向下键
            //console.log('抬起下');
            holdUp();
            break;
        default:
            break;
    }
}

function initmoveStatus(movestatus) {
    movestatus = parseInt(movestatus);
    switch (movestatus) {
        case 0:
            $("#movestatus").val('开机待命中');
            break;
        case 1:
            $("#movestatus").val('导航结束(上次失败)');
            break;
        case 2:
            $("#movestatus").val('导航结束(上次成功)');
            break;
        case 3:
            $("#movestatus").val('移动中');
            break;
        case 4:
            $("#movestatus").val('前方有障碍');
            break;
        case 5:
            $("#movestatus").val('目的地不遮挡');
            break;
        case 6:
            $("#movestatus").val('用户取消导航');
            break;
        case 7:
            $("#movestatus").val('切换新目标点');
            break;
        case 8:
            $("#movestatus").val('因异常导航失败');
            break;
        case 9:
            $("#movestatus").val('');
            break;
        case 10:
            $("#movestatus").val('脱离轨迹');
            break;
    }
}

function initchargestatus(chargestatus) {
    chargestatus = parseInt(chargestatus)
    //充电状态  chargestatus
    switch (chargestatus) {
        case 0:
            $("#chargestatus").val('正常运行(未充电)');
            break;
        case 1:
            $("#chargestatus").val('连接底座充电');
            break;
        case 2:
            $("#chargestatus").val('连接电缆充电');
            break;
        case 3:
            $("#chargestatus").val('和充电座对接');
            break;
        case 4:
            $("#chargestatus").val('脱离充电座');
            break;
        case 5:
            $("#chargestatus").val('已充满但还在链接');
            break;
    }
}

function initlocstatus(locstatus) {
    //din定位  locstatus
    locstatus = parseInt(locstatus);
    switch (locstatus) {
        case 0:
            $("#locstatus").val('定位正常');
            break;
        case 1:
            $("#locstatus").val('准备定位中');
            break;
        case 2:
            $("#locstatus").val('未构建地图');
            break;
        case 3:
            $("#locstatus").val('构建地图中');
            break;
        case 4:
            $("#locstatus").val('UWB错误');
            break;
        case 5:
            $("#locstatus").val('回环检测');
            break;
    }
}

function getLocation(x, y) {
    var bbox = canvas.getBoundingClientRect();
    //原像素
    var xd = (x - bbox.left) * (canvas.width / bbox.width);
    var yd = (y - bbox.top) * (canvas.height / bbox.height);
    //平移
    xd = xd - canvas.width / 2;
    yd = yd - canvas.height / 2;

    // x: (xd+10)*0.05,
    // y: (yd-20)*0.05
    //保留4位小数
    xd = String(xd * 0.05).replace(/^(.*\..{4}).*$/, "$1");
    yd = String(-yd * 0.05).replace(/^(.*\..{4}).*$/, "$1");

    return {
        x: xd,
        y: yd

        /*
         * 此处不用下面两行是为了防止使用CSS和JS改变了canvas的高宽之后是表面积拉大而实际
         * 显示像素不变而造成的坐标获取不准的情况
        x: (x - bbox.left),
        y: (y - bbox.top)
        */
    };
}

//返回
$("#backtrack").on('click', function () {
    //window.history.back(-1);
    //window.parent.location.href = "./index.html";
    //http://localhost:63342/irobot-web-app/templates/index.html
    //http://localhost:63342/irobot-web-app/templates/robot/RobotOperation/control.html

    sessionStorage.setItem('robotOperation_back', 1);
    //var protocol=window.location.protocol;
    //var port=window.location.host;
    var href = window.location.href;
    var href_back = href.replace('robot/RobotOperation/', '').replace('control', 'index');
    //alert(protocol+'//'+port+"/irobot-web-app/templates/index.html");
    window.location.href = href_back;

});



