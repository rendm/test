var robotid;
var hardwareno;
var mapid;
var taskDOList;
var left_click_x,left_click_y,dot_arr;
var canvas=document.getElementById("canvas");//获取画布
var canvas_draw;

var color_arr = ['Red','Brown','LimeGreen',
    'CornflowerBlue','Crimson','DarkCyan',
    'DarkGoldenRod','DarkGreen','DarkSalmon',
    'DarkSeaGreen','DeepPink','DodgerBlue',
    'ForestGreen','Fuchsia','GreenYellow',
    'IndianRed','Chocolate'];


var color_arr_new = ['DarkCyan','Navy','Fuchsia','blue','IndianRed','#ff0000']; //依次为 迎宾点 取物点 送物点 普通点 充电点

$(function(){
    //robotid = sessionStorage.getItem('controlid');
    //robotid='43eae0c0ddc44bddb749d1b2f43bd9f9';//另一个robotid='5cef45c0d5de492aac629ddf9688bc64'  //待修改
    //alert('点位设置');
    initmap();
    $('#poI-coordinate').hide();
    $('#drawmap-main').hide();
});
var openflag=true;

//根据mapid获取坐标信息
function getMapCoordinate() {

    var mapid=sessionStorage.getItem('mapid');

    //alert(mapid);
    var url=share+'/irobotweb/sys/mappoi/query/mapids?mapid='+mapid;

    $.ajax({
        url:url,
        crossDomain: true,
        type: "get",
        async:false,
        dataType: "json",
        xhrFields: {
            withCredentials: true
        },
        success: function (data) {
            // console.info('坐标信息');
            // console.info(data);
            dot_arr=data.data;//获取固定点的数组
        },
        error: function (request) {
            layer.alert("Connection error");
        },
    });
}

//根据数据库中的固定点坐标来绘制点的位置
function drawDotByDb() {

    //alert('开始绘制了');
    //console.info('dot_arr是否为空');console.info(dot_arr);

    if(dot_arr!=null && dot_arr.length>0){
        for(var i=0;i<dot_arr.length;i++){
            var x=parseFloat(dot_arr[i].x);
            var y=parseFloat(dot_arr[i].y);
            //console.info('x='+x+',y='+y);
            //drawDot(canvas_draw,x,y,dot_arr[i].poiName,color_arr[i]);//绘制固定点
            drawDot(canvas_draw,x,y,dot_arr[i].poiName,dot_arr[i].poiType);//绘制固定点
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

$(".poi").on('click', function (){

    if (mapid!=null ){
        if (openflag){
            $.ajax({
                url: share + '/irobotweb/sys/mappoi/query/mapids?mapid=' + mapid,
                type: "get",
                cache: false,
                crossDomain: true,
                xhrFields: {
                    withCredentials: true
                },
                success: function (json){
                    if (json.code==200){
                        console.log(json.data);
                        var html="";
                        $.each(json.data,function(n,value) {
                            //alert(n+' '+value.poiName);
                            html =html + '<p><small>' +value.poiName+'</small>';
                            html =html + '<span><small>X:' +value.x +'</small>';
                            html =html + '<small>Y:' +value.y +'</small>';
                            html =html + '<small>Yaw:' +value.yaw +'</small></span></p>';
                            // $("#poI-coordinate").toggle();
                        });
                        //$("#poI-coordinate").html(html);
                        openflag=false;
                    }
                }
            });
        }else
        {
            $("#poI-coordinate").html("");
            openflag=true;
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

    left_click_x=$("#messagex").html();
    left_click_y=$("#messagey").html();
    //console.info(left_click_x+','+left_click_y);
    //console.info('dot_arr');console.info(dot_arr);
    var dot_clicked=cal_left_menu(left_click_x,left_click_y);
    //console.info('dot_clicked');console.info(dot_clicked);

    if(dot_clicked!=null && dot_clicked!=undefined){
        $("#left-hand").css({
            "display": "block",
            "left": e.clientX - 380,
            "top": e.clientY - 55
        });
    }
}

//根据左键点击的坐标计算是否显示左键处理菜单
function cal_left_menu(left_click_x,left_click_y) {

    if(dot_arr!=null && dot_arr.length>0){
        var dot_clicked;

        for(var i=0;i<dot_arr.length;i++){
            if(dot_arr[i].poiName=='充电点'){
                //console.info('left_click_x='+left_click_x+',dot_arr[i].x='+parseFloat(dot_arr[i].x));
                //console.info('left_click_y='+left_click_y+',dot_arr[i].y='+parseFloat(dot_arr[i].y));
            }

            var abs_x=Math.abs(parseFloat(dot_arr[i].x)-left_click_x);
            var abs_y=Math.abs(parseFloat(dot_arr[i].y)-left_click_y);
            if(dot_arr[i].poiName=='充电点'){
                //console.info('abs_x='+abs_x+',abs_y='+abs_y);
            }

            if(abs_x<=0.38 && abs_y<=0.38){ //使用0.4也可以
                dot_clicked=dot_arr[i];
                break;
            }
        }
        return dot_clicked;
    }
}

//左键菜单-删除
$('.delete-point').click(function () {
    layer.confirm('确定要删除该点位？', {
        btn: ['确定', '取消']
    }, function () {
        leftClickDelete();
    });
});

//左键菜单-编辑
$('.edit-point').click(function () {
    //alert('编辑');

    //$("#left-hand")
    //attr('pointId',dot_clicked.id).attr('poiName',dot_clicked.poiName).attr('poiType',dot_clicked.poiType);
    sessionStorage.setItem('poiId',$("#left-hand").attr('pointId'));
    sessionStorage.setItem('poiName',$("#left-hand").attr('poiName'));
    sessionStorage.setItem('poiType',$("#left-hand").attr('poiType'));
    sessionStorage.setItem('poiX',$("#left-hand").attr('poiX'));
    sessionStorage.setItem('poiY',$("#left-hand").attr('poiY'));
    sessionStorage.setItem('mapId',$("#left-hand").attr('mapId'));
    sessionStorage.setItem('poiYaw',$("#left-hand").attr('poiYaw'));

    layer.open({
        type: 2,
        title: '编辑点位',
        maxmin: true,
        shadeClose: false,
        area: ['800px', '400px'],
        content: '../RobotOperation/edit.html'  // iframe的url
    });

    $("#left-hand").css({
        "display": "none"
    });
});

//处理左键菜单和右键菜单的隐藏
$('.center-img').click(function (e) {

    var target = $(e.target);
    //左键-删除
    if(target.is('.delete-point') || target.is('.edit-point')){
        return;
    }
    else
    {
        //console.info(999);
        left_click_x=$("#messagex").html();
        left_click_y=$("#messagey").html();
    }

    //console.info('target');console.info(target);

    var dot_clicked=cal_left_menu(left_click_x,left_click_y);
    //console.info('点击点位的x,y坐标:x='+left_click_x+',y='+left_click_y);
    //console.info('左键选中的点555:dot_clicked');console.info(dot_clicked);

    if(!target.is('.edit-point') && !target.is('.delete-point') && dot_clicked==undefined){
        $("#left-hand").css({
            "display": "none"
        });
    }

    if(!target.is('.move') && !target.is('.set')){
        $("#right-hand").css({
            "display": "none"
        });
    }

    if(dot_clicked!=null && dot_clicked!=undefined){

        //alert(666);

        $("#left-hand").css({
            "display": "block",
            "left": e.clientX,
            "top": e.clientY - 55
        }).attr('pointId',dot_clicked.id)
            .attr('poiName',dot_clicked.poiName)
            .attr('poiType',dot_clicked.poiType)
            .attr('poiX',dot_clicked.x)
            .attr('poiY',dot_clicked.y)
            .attr('poiYaw',dot_clicked.yaw)
            .attr('mapId',dot_clicked.mapId);

    }


    if(!target.is('#canvas')){

        $("#left-hand").css({
            "display": "none"
        });

        $("#right-hand").css({
            "display": "none"
        });
    }else
    {
        //alert('aaaaaaa点中了');
    }
});

//左键-删除-方法
function leftClickDelete() {

    var pointId=$("#left-hand").attr('pointId');

    if(pointId!=null && pointId!=''){
        //alert(333);
        var url=share+"/irobotweb/sys/mappoi/delete?id="+pointId;

        $.ajax({
            url: url,
            type: "DELETE",
            crossDomain: true,
            xhrFields: {
                withCredentials: true
            },
            success: function (data) {

                console.info('删除返回消息');console.info(data);

                if (data.code == 200) {

                    // parent.layer.alert('删除成功',function () {
                    //     window.location.reload();
                    //     var index = parent.layer.getFrameIndex(window.name);
                    //     parent.layer.close(index);
                    // });

                    layer.msg('删除成功');
                    initmap();
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


$('.menu').click(function () {
    $('#drawmap-main').hide();
});

//页面加载数据
function initmap(){

    var mapid=sessionStorage.getItem('mapid');

    $.ajax({
        url: share + '/irobotweb/sys/map/get?mapid='+mapid,
        type: "get",
        cache: false,
        async:false,
        crossDomain: true,
        xhrFields: {
            withCredentials: true
        },
        success: function (json) {
            var data =json.data;

            // console.log('页面加载的数据');
            // console.log(data);

            if(json.code == 200){
                mapid=data.mapId;
                var mapname=data.mapName;
                $("#mapname").html(mapname);
                document.getElementById('base-img').setAttribute('src', 'data:image/png;base64,' + data.mapfile);
                //console.info('base64');console.info('data:image/png;base64,' + data.mapDO.mapfile);

                $("#base-img").css({
                    /* "width": data.width,
                     "height": data.height,*/
                    "width": data.width,
                    "height": data.height,
                    "margin-bottom":300
                });

                canvas.width = data.width;
                canvas.height = data.height;
                canvas_draw= getCanvas(canvas.width,canvas.height);

                // drawRobotPosition(canvas_draw,data.x,data.y);   //绘制机器人点位图
                // //drawDot(canvas_draw,-4.73,2.19,'巡航点1','red');//绘制固定点
                //
                // //鼠标移动，实时显示坐标信息
                canvas.onmousemove = function (e) {
                    var location = getLocation(e.clientX, e.clientY);
                    // message.innerHTML = "x=" + location.x + " ,y=" + location.y;
                    $("#messagey").html(location.y);
                    $("#messagex").html(location.x);

                    left_click_x=$("#messagex").html();
                    left_click_y=$("#messagey").html();
                    var dot_clicked=cal_left_menu(left_click_x,left_click_y);
                    //console.info('left_click_x='+left_click_x+',left_click_y='+left_click_x);

                    if(dot_clicked!=null && dot_clicked!=undefined){
                        $("#canvas").css('cursor','pointer');
                    }else{
                        $("#canvas").css('cursor','default');
                    }
                };

                //connect(hardwareno);

            }else{
                alert('获取失败');
                alert(json.msg);
            }
        }

    });

    getMapCoordinate();//获取poi点位坐标
    drawDotByDb();//绘制点位
}

//获取到画布
function getCanvas(width,height) {

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
function drawRobotPosition(canvas,x,y) {

    var xd = x /0.05-10;     //-39.745599999999996
    var yd = -(y /0.05 +20); //15.763399999999997

    var imgdd = document.getElementById("water-location");//图片信息
    canvas.beginPath();
    //canvasDom.arc(0,0,5,0,2*Math.PI);
    canvas.drawImage(imgdd, xd, yd, 20, 20);
    canvas.stroke();
}

//绘制圆点-固定点位
function drawDot(canvas,x,y,text,poiType) {
    canvas.beginPath();
    //绘制一个点begin
    var xd = x /0.05;
    var yd = -(y /0.05);

    //console.info('xd='+xd+',yd='+yd);

    //canvas.fillStyle=color;

    // wlcmpoint    迎宾点
    // takepoint    取物点
    // sendingpoint 送物点
    // poipoint     普通点
    // chargepoint  充电点

    if(poiType=='wlcmpoint'){
        canvas.fillStyle=color_arr_new[0];
    }else if(poiType=='takepoint'){
        canvas.fillStyle=color_arr_new[1];
    }else if(poiType=='sendingpoint'){
        canvas.fillStyle=color_arr_new[2];
    }else if(poiType=='poipoint'){
        canvas.fillStyle=color_arr_new[3];
    }else if(poiType=='chargepoint'){
        canvas.fillStyle=color_arr_new[4];
    }else{
        canvas.fillStyle=color_arr_new[4];
    }


    //设置字体样式
    canvas.font = "10px bold 宋体";
    //绘制文字
    //canvas.fillText("("+xd1+","+yd1+")",xd1,yd1);
    canvas.fillText(text,xd+5,yd-5);

    canvas.arc(xd,yd,4,Math.PI*2,0,true);
    canvas.closePath();
    canvas.fill();
    //绘制一个点end
    //canvas.stroke();
}

//鼠标右击  触发的结果
//阻止右击事件
// window.onload = function () {
//     document.oncontextmenu = function (e) {
//         //  var e = event || window.event;
//         return false;//取消右键点击的默认事件
//     }
//     document.onclick = function(e){
//         // console.log('90鼠标左击')
//     }
// }

//右键事件
function clickRight(e) {
    e.preventDefault();
    e.stopPropagation();
    //console.log('iwqyuwqpy火狐右击');
    //alert(555);

    $("#right-hand").css({
        "display": "block",
        "left": e.clientX,
        "top": e.clientY - 55
    });

    $("#left-hand").css({
        "display": "none"
    });

    var xxd = e.clientX - 380 - $("#canvas").width() / 2;
    var yyd = e.clientY - 55 - $("#canvas").width() / 2;
    var locationxy  =getLocation(e.clientX,e.clientY);
    sessionStorage.setItem('x', locationxy.x);
    sessionStorage.setItem('y', locationxy.y);
    sessionStorage.setItem('xd', $("#x").val());
    //console.log($("#x").val(),'框框里面的x值')
    sessionStorage.setItem('yd', $("#y").val());
    //sessionStorage.setItem('mapid', mapid);
}

$("#bg-img2").on('mousedown', function(event){

    var e = event || window.event;
    //console.log('e.which');console.log(e.which);
    //console.log('e.button');console.log(e.button);
    //alert('右键点击了');

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
    var mapid=getQueryString('mapid');
    //alert(mapid);
    sessionStorage.setItem('mapid', mapid);

    layer.open({
        type: 2,
        title: '设置点位',
        maxmin: true,
        shadeClose: false,
        area: ['800px', '520px'],
        content: '../RobotOperation/manual.html?mapset=1'  // iframe的url
    });

    $("#right-hand").css({
        "display": "none",
    });
});

//绘制地图接口-开始绘制地图、中断绘制地图、完成绘制地图
$('.drawmap-item').click(function () {
    //alert($(this).text());
    var draw_txt=$(this).text();
    var url='';
    var url_start=share+'/irobotweb/sys/map/startbuildmap';  //开始扫图
    var url_cancel=share+'/irobotweb/sys/map/cancelbuildmap';//中断扫图
    var url_end=share+'/irobotweb/sys/map/endbuildmap';      //完成扫图

    var param={};
    param.mapid=taskDOList.mapId;       //地图id
    param.mapname=taskDOList.mapName;   //机器人id
    param.robothadware=hardwareno;     //机器人硬件地址
    param.robotid=robotid;             //机器人id
    param.message='';             //机器人id

    //console.info('taskDOList');
    //console.info(taskDOList);

    jsonStr=JSON.stringify(param);
    //console.info('jsonStr');
    //console.info(jsonStr);

    if(draw_txt=='开始绘制地图'){
        url=share+'/irobotweb/sys/map/startbuildmap';
    }else if(draw_txt=='中断绘制地图'){
        url=share+'/irobotweb/sys/map/cancelbuildmap';

    }else if(draw_txt=='完成绘制地图'){
        url=share+'/irobotweb/sys/map/endbuildmap';
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
var  indicator =null;

function connect(hardwareno) {
    var ctrlNodesArr = [] ////路径上报的点位
    var ctrlNodesArr2 = [] ////路径上报的点位
    var dom = $('#canvas')[0]
    var x = [], y = [];
    var socket = new SockJS(share + "/ws");
    var canvasDom;
    var reg = new RegExp(":","g");//g,表示全部替换。
    var queue1 ='/user/'+hardwareno.replace(reg,"")+'/queue/message'
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
                document.getElementById('base-img').setAttribute('src', 'data:image/png;base64,' + img);
                $("#base-img").css({
                    "width": bodydata.mapInfoBean.width,
                    "height": bodydata.mapInfoBean.height
                })
                canvas.width = bodydata.mapInfoBean.width;
                canvas.height = bodydata.mapInfoBean.height;
                canvasDom.translate($("#canvas").width() / 2, $("#canvas").height() / 2)
                //canvasDom.arc(0,0,3,0,2*Math.PI);
                canvasDom.stroke();
            } else if (str.event == 'mapNowPoint') {//点位上报

                var pos = str.data.pos;
                var vel =str.data.vel;
                var xd = pos.x / 0.05 - 10;
                var yd = -(pos.y / 0.05 + 20);
                $("#x").val(pos.x)
                $("#y").val(pos.y)
                $("#yaw").val(pos.yaw)
                $(".vx").val(vel.x)
                $(".vy").val(vel.y)
                $(".vtheta").val(vel.yaw)
                var imgdd = document.getElementById("water-location");

                canvasDom.clearRect(-$("#canvas").width() / 2, -$("#canvas").height() / 2, $("#canvas").width(), $("#canvas").height());

                if (ctrlNodesArr2!=null){
                    var bezier4 = new BezierMaker(dom, ctrlNodesArr2, 'blue');

                    bezier4.drawBezier();
                }
                canvasDom.beginPath();
                canvasDom.strokeStyle = "pink";
                canvasDom.arc(pos.x / 0.05, -pos.y / 0.05, 3, 0, 2*Math.PI, true);
                canvasDom.drawImage(imgdd, xd, yd, 20, 20);
                canvasDom.stroke();
            } else if (str.event == 'mapRealPath') { //运动路径上报

                canvasDom.strokeStyle = "pink";
                canvasDom.fillStyle = 'red';
                canvasDom.lineWidth = 2
                canvasDom.beginPath();
                for (var i = 0; i < str.data.path.length; i++) {
                    var path = str.data.path[i];
                    x.push(path.x/0.05)
                    y.push(-(path.y/0.05))
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

                var data =str.data;
                //base
                if(data.base == 0){
                    $("#base").attr("class","green");
                }else if(data.base == 1){
                    $("#base").attr("class","red");
                }
                //laswer 雷达
                if(data.laswer == 0){
                    $("#laswer").attr("class","green");
                }else if(data.laswer == 1){
                    $("#laswer").attr("class","red");
                }
                //odom
                if(data.odom == 0){
                    $("#odom").attr("class","green");
                }else if(data.odom == 1){
                    $("#odom").attr("class","red");
                }
                //uwb
                if(data.uwb == 0){
                    $("#uwb").attr("class","green");
                }else if(data.uwb == 1){
                    $("#uwb").attr("class","red");
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

function disconnect(){
    if (stompClient != null){
        stompClient.disconnect();
    }

    //console.log("Disconnected");
}

//根据名称获取地址栏里的参数
function getQueryString(name) {
    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
    var r = window.location.search.substr(1).match(reg);
    if (r != null) return unescape(r[2]);
    return null;
}

//  鼠标按下  鼠标长按
var timeStart, timeEnd, time;//申明全局变量

//获取此刻时间
function getTimeNow(){
    var now = new Date();
    return now.getTime();
}

// 触发移动的接口函数
function triggermove(message){
    var movedata = {
        "message": message,
        "robothadware": hardwareno,       //硬件地址   mac 地址
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
    triggermove("up");
});

$("#click-up").on('mouseup', function () {
    //console.log('上');
    holdUp();
});

$("#click-down").on('mousedown', function () {
    //console.log('下');
    triggermove("down");
});

$("#click-down").on('mouseup', function () {
    //console.log('下');
    holdUp();
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
    switch (e.keyCode){
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
    switch(movestatus)
    {
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
    chargestatus=parseInt(chargestatus)
    //充电状态  chargestatus
    switch(chargestatus) {
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
    locstatus =parseInt(locstatus);
    switch(locstatus) {
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
    var xd =(x - bbox.left) * (canvas.width / bbox.width);
    var yd =(y - bbox.top) * (canvas.height / bbox.height);
    //平移
    xd =xd -canvas.width/2;
    yd =yd -canvas.height/2;

    // x: (xd+10)*0.05,
    // y: (yd-20)*0.05
    //保留4位小数
    xd = String(xd*0.05).replace(/^(.*\..{4}).*$/,"$1");
    yd = String(-yd*0.05).replace(/^(.*\..{4}).*$/,"$1");

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

    sessionStorage.setItem('robotOperation_back',1);
    //var protocol=window.location.protocol;
    //var port=window.location.host;
    var href=window.location.href;
    var href_back=href.replace('robot/RobotOperation/','').replace('control','index');
    //alert(protocol+'//'+port+"/irobot-web-app/templates/index.html");
    window.location.href=href_back;

});