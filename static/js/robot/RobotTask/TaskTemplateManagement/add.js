//  初始化
//  /irobotweb/sys/tasktype/query/list
//获得下拉框
//http://192.168.0.113:9090/irobotweb/sys/user/query/developer   //  开发者接口  developerid  "name  不传"
//http://192.168.0.113:9090/irobotweb/sys/user/query/shop       //店铺接口shopId  shopName
//1   by value:(taskPararms:值,taskPararmsName:名)  //2 by value:(x:横坐标,y:纵坐标,raw:角度)
$(document).ready(function () {

});
// 封装出来的ajax
let lastAjax = function (arraydata) {
    console.log(JSON.stringify(arraydata), '传的参数打印看看')
    var jsonstring = {
        "shopid": $("#shopId").val(),//店铺id
        "shopname": $("#shopId").find("option:selected").text(),//店铺name
        "developerid": $("#developerid").val(),//开发者id
        "developername": $("#developerid").find("option:selected").text(),//开发者name
        "taskName": $("#taskTypeName").val(),//任务模板名称
        "taskTypeId": $("#type").val(),//任务类型id
        "taskTypeName": $("#type").find("option:selected").text(),//任务类型name
        "taskType": $("#type").find("option:selected").attr('task'),//任务类型code
        "taskModelDetailsDOList": arraydata
    }
    var jsonStr = JSON.stringify(jsonstring); //json字符串
    $.ajax({
        type: "POST",
        url: share + "/irobotweb/sys/taskmodel/add",
        data: jsonStr,// 你的formid//所有input框 里面的值
        crossDomain: true,
        //dataType:"json",
        contentType: "application/json; charset=utf-8",
        xhrFields: {
            withCredentials: true
        },
        error: function (request) {
            parent.layer.alert("Connection error");
        },
        success: function (data) {
            console.log(data, 'ajax的请求保存返回')
            if (data.code == 200) {
                parent.location.reload(); 
            }
        }
    });
}

//开发者
// $.ajax({
//     url: share + '/irobotweb/sys/user/query/developer',
//     type: "get",
//     dataType: "json",
//     //cache: false,
//     crossDomain: true,
//     xhrFields: {
//         withCredentials: true
//     },
//     success: function (json) {
//         console.log(json, '开发者name')
//         var op = '';
//         json.forEach(function (item) {
//             console.log(item.name)
//             op += '<option value="' + item.developerid + '">' + item.name + '</option>';
//         })
//         $("#developerid").html(op)
//     }
// })

//店铺
// $.ajax({
//     url: share + '/irobotweb/sys/user/query/shop',
//     type: "get",
//     dataType: "json",
//     //cache: false,
//     crossDomain: true,
//     xhrFields: {
//         withCredentials: true
//     },
//     success: function (json) {
//         var oph = '';
//         json.forEach(function (item) {
//             oph += '<option value="' + item.shopId + '">' + item.shopName + '</option>';
//         })
//         $("#shopId").html(oph)
//     }
// })
//地图
$.ajax({
    url: share + '/irobotweb/sys/map/query/list',
    type: "get",
    dataType: "jsonp",
    //cache: false,
    crossDomain: true,
    xhrFields: {  
        withCredentials: true
    },
    jsonpCallback: "success_jsonpCallback",
    success: function (json) {
        console.log(json.rows, '地图的呀')//mapName
        var mapdata = json.rows;
        var oph = '';
        mapdata.forEach(function (item) {
            oph += '<option value="' + item.mapId + '">' + item.mapName + '</option>';
        })
        $("#maptype").html(oph)
    },
    error: function (json) {

    }
})
//任务类型
$.ajax({
    url: share + '/irobotweb/sys/tasktype/query/list',
    crossDomain: true,
    type: "get",
    dataType: "jsonp",
    xhrFields: {
        withCredentials: true
    },
    jsonpCallback: "success_jsonpCallback",
    success: function (data) {
        var initialize = data.rows;
        console.log(initialize, '任务类型')
        var typedata = '';
        initialize.forEach(function (item, index) {
            typedata += '<option task="' + item.taskType + '" pursuant="' + index + '" value="' + item.taskTypeId + '">' + item.taskTypeName + '</option>';
        })
        // taskParamsDOList.pararmsType
        $("#type").html(typedata)
    },
    error: function (error) {
        //console.log(error.responseText,'error')
    }
});


$("#type").on('change', function (){
    var eqi = $("#type").find("option:selected").attr('pursuant')
    console.log(eqi, '下标选中的')
    $.ajax({
        url: share + '/irobotweb/sys/tasktype/query/list',
        crossDomain: true,
        type: "get",
        dataType: "jsonp",
        xhrFields: {
            withCredentials: true
        },
        jsonpCallback: "success_jsonpCallback",
        success: function (data) {
            var initialize = data.rows;
            var value = initialize[eqi].taskParamsDOList;
            console.log(value, '参数asasasasa')
            if (value.length >= 1) {
                console.log(value[0].pararmsType, '参数详情')
                if (value[0].pararmsType == 'text') {
                    //样式
                    var text = $("#type").find("option:selected").text();
                    if (text == '亮灯任务') {
                        console.log('亮灯任务的呀')
                        var texthtml = '<label class="col-sm-3 control-label">' + text + '：</label>' +
                            '<div class="col-sm-8">' +
                            '<select id="lighttype" name="lighttype" class="form-control"  >' +
                            '<option value="0">常亮</option>' +
                            '<option value="1">闪烁</option>' +
                            '<option value="2">呼吸</option>' +
                            '</select>' +
                            '</div>';
                        $("#thde").html(texthtml);
                    } else {
                        var texthtml = '<label class="col-sm-3 control-label">' + text + '：</label>' +
                            '<div class="col-sm-8">' +
                            '<input id="cased" name="cased" class="form-control" type="text" >' +
                            '</div>';
                        $("#thde").html(texthtml);
                    }
                    //选中下拉框的文本
                } else if (value[0].pararmsType == 'poi') {
                    var ptcontent = '<div class="form-group">' +
                        '<label class="col-sm-3 control-label">选择地图：</label>' +
                        '<div class="col-sm-8" class="margin-top">' +
                        '<select id="maptype" name="maptype" class="form-control"  >' +

                        '</select>' +
                        '</div>' +
                        '</div>' +
                        '<div class="form-group">' +
                        '<label class="col-sm-3 control-label">目的地点：</label>' +
                        '<div class="col-sm-8" class="margin-top">' +
                        '<select id="bourntype" name="bourntype" class="form-control"  >' +
                        '<option value="0">充电点</option>' +
                        '</select>' +
                        '</div>' +
                        '</div>';
                    $("#thde").html(ptcontent);
                    //地图
                    $.ajax({
                        url: share + '/irobotweb/sys/map/query/list',
                        type: "get",
                        dataType: "jsonp",
                        //cache: false,
                        crossDomain: true,
                        xhrFields: {
                            withCredentials: true
                        },
                        jsonpCallback: "success_jsonpCallback",
                        success: function (json) {
                            console.log(json.rows, '地图的呀')//mapName
                            var mapdata = json.rows;
                            var oph = '';
                            mapdata.forEach(function (item) {
                                oph += '<option value="' + item.mapId + '">' + item.mapName + '</option>';
                            })
                            $("#maptype").html(oph)
                        },
                        error: function (json) {

                        }
                    })
                } else if (value[0].pararmsType == 'imgurl') {
                    var text = $("#type").find("option:selected").text(); //选中下拉框的文本
                    var texthtml = '<label class="col-sm-3 control-label">' + text + '：</label>' +
                        '<div class="col-sm-8">' +
                        '<select id="imgtype" name="imgtype" class="form-control"  >' +

                        '</select>' +
                        '</div>';
                    $("#thde").html(texthtml);
                    $.ajax({
                        url: share + '/irobotweb/sys/resource/query/list/type?type=img',
                        crossDomain: true,
                        type: "get",
                        //dataType:"jsonp",
                        xhrFields: {
                            withCredentials: true
                        },
                        jsonpCallback: "success_jsonpCallback",
                        success: function (data) {
                            console.log(data.data, '视频列表')
                            var imgdata = data.data;// 视频
                            var opda = '';
                            imgdata.forEach(function (item) {
                                opda += '<option  value="' + item.ossurl + '">' + item.filename + '</option>';
                                console.log(item)

                            })
                            console.log(opda)
                            $("#imgtype").html(opda)
                        },
                        error: function (error) {

                        }
                    });

                } else if (value[0].pararmsType == 'videourl') {
                    var text = $("#type").find("option:selected").text(); //选中下拉框的文本
                    var texthtml = '<label class="col-sm-3 control-label">' + text + '：</label>' +
                        '<div class="col-sm-8">' +
                        '<select id="videotype" name="videotype" class="form-control"  >' +

                        '</select>' +
                        '</div>';
                    $("#thde").html(texthtml);
                    $.ajax({
                        url: share + '/irobotweb/sys/resource/query/list/type?type=video',
                        crossDomain: true,
                        type: "get",
                        //dataType:"jsonp",
                        xhrFields: {
                            withCredentials: true
                        },
                        jsonpCallback: "success_jsonpCallback",
                        success: function (data) {
                            console.log(data.data, '视频列表')
                            var videodata = data.data;// 视频
                            var opda = '';
                            videodata.forEach(function (item) {
                                opda += '<option  value="' + item.ossurl + '">' + item.filename + '</option>';
                                console.log(item)

                            })
                            console.log(opda)
                            $("#videotype").html(opda)
                        },
                        error: function (error) {

                        }
                    });
                } else if (value[0].pararmsType == 'audiourl') {
                    console.log('audiourl')
                    var text = $("#type").find("option:selected").text(); //选中下拉框的文本
                    var texthtml = '<label class="col-sm-3 control-label">' + text + '：</label>' +
                        '<div class="col-sm-8">' +
                        '<select id="audiotype" name="audiotype" class="form-control"  >' +

                        '</select>' +
                        '</div>';
                    $("#thde").html(texthtml);
                    $.ajax({
                        url: share + '/irobotweb/sys/resource/query/list/type?type=audio',
                        crossDomain: true,
                        type: "get",
                        //dataType:"jsonp",
                        xhrFields: {
                            withCredentials: true
                        },
                        jsonpCallback: "success_jsonpCallback",
                        success: function (data) {
                            console.log(data.data, '列表')
                            var audiodata = data.data;// 视频
                            var opda = '';
                            audiodata.forEach(function (item) {
                                opda += '<option  value="' + item.ossurl + '">' + item.filename + '</option>';
                                console.log(item)

                            })
                            console.log(opda)
                            $("#audiotype").html(opda)
                        },
                        error: function (error) {

                        }
                    });
                }
            } else {
                var texthtml = '<label class="col-sm-3 control-label">' + text + '：</label>' +
                    '<div class="col-sm-8">' +
                    '<input id="cased" name="cased" class="form-control" type="text" >' +
                    '</div>';
                $("#thde").html(texthtml);
            }
            console.log()

        },
        error: function (error) {
            //console.log(error.responseText,'error')
        }
    });
})


// var pursuant;
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

//便利对象
// function displayProp(obj){   
//     var names="";    
//     for(var name in obj){    
//       names+=name+": "+obj[name]+", ";  
//       console.log(name,'打印的属性')
//     }  
//     alert(names);  
//   } 

$("#ok").on('click', function (e) {
    //地图id
    var mapid = $("#maptype").val();
    var arraydata = [];
    var eqi = $("#type").find("option:selected").attr('pursuant')
    $.ajax({
        url: share + '/irobotweb/sys/tasktype/query/list',
        crossDomain: true,
        type: "get",
        dataType: "jsonp",
        xhrFields: {
            withCredentials: true
        },
        jsonpCallback: "success_jsonpCallback",
        success: function (data) {
            var initialize = data.rows;
            var value = initialize[eqi].taskParamsDOList;
            var text = $("#type").find("option:selected").text();
            if (value.length >= 1) {
                console.log(value[0].pararmsType, '参数详情')
                if (value[0].pararmsType == 'text') {
                    if (text == '亮灯任务') {
                        var transfer = {
                            value:$("#lighttype").find("option:selected").text(),
                            taskPararms:text,
                            taskPararmsName: text
                        }
                        arraydata.push(transfer)
                    } else {
                        var textdata = {
                            value:$("#cased").val(),
                            taskPararms: text,
                            taskPararmsName: text
                        }
                        arraydata.push(textdata)
                    }
                    //选中下拉框的文本
                } else if (value[0].pararmsType == 'poi'){
                    console.log('点位传值')
                    $.ajax({
                        url: share + '/irobotweb/sys/mappoi/query/mapids?mapid=' + mapid,
                        crossDomain: true,
                        type: "get",
                        //dataType:"jsonp",
                        xhrFields: {
                            withCredentials: true
                        },
                        jsonpCallback: "success_jsonpCallback",
                        success: function (data) {
                            console.log(data, '地图位置')
                            var poiname = data.data[0];
                            console.log(poiname)
                            if (data.data.length >= 1) {
                               
                                const cox = poiname.x;
                                const coy = poiname.y;
                                const coyaw = poiname.yaw;
                                var dwx={
                                    value:cox,
                                    taskPararms:"x",
                                    taskPararmsName:"x"
                                }
                                arraydata.push(dwx)
                                var dwy={
                                    value:coy,
                                    taskPararms:"y",
                                    taskPararmsName:"y"
                                }
                                arraydata.push(dwy)
                                var dwyaw={
                                    value:coyaw,
                                    taskPararms:"yaw",
                                    taskPararmsName:"yaw",
                                }
                                arraydata.push(dwyaw)
                                var mapimg={
                                    value:poiname.mapId,
                                    taskPararms:"mapId",
                                    taskPararmsName:"mapId",
                                    status:0
                                 }
                                arraydata.push(mapimg)
                                var idimg={
                                    value:poiname.id,
                                    taskPararms:"id",
                                    taskPararmsName:"id",
                                 }
                                 arraydata.push(idimg)
                                console.log(arraydata,'点位添加')
                            } else {
                                console.log('空数组')
                            }
                            lastAjax(arraydata)
                        },
                        error: function (error) {
                        }
                    })
                    return 
                } else if (value[0].pararmsType == 'imgurl') {
                    var textdata = {
                        value:$("#imgtype").val(),
                        taskPararms:text,
                        taskPararmsName: $("#imgtype").find("option:selected").text()
                    }
                    arraydata.push(textdata)

                } else if (value[0].pararmsType == 'videourl'){
                    var textdata = {
                        value:$("#videotype").val(),
                        taskPararms: text,
                        taskPararmsName: $("#videotype").find("option:selected").text()
                    }
                    arraydata.push(textdata)
                } else if (value[0].pararmsType == 'audiourl'){
                    var textdata = {
                        value:$("#audiotype").val(),
                        taskPararms: text,
                        taskPararmsName: $("#audiotype").find("option:selected").text()
                    }
                    arraydata.push(textdata)
                }
            } else {
                var textdata = {
                    value:$("#cased").val(),
                    taskPararms: text,
                    taskPararmsName: text
                }
                arraydata.push(textdata)
            }
            lastAjax(arraydata)
        },
        error: function (error) {

        }
    });
    // console.log(arraydata,'外面打印传的参数打印看看')
    // 1	点位任务	POINT_TASK   //
    // 2	亮灯任务	ShlingsTask  //
    // 3	说话任务	SpeakTask  //
    // 4	视频任务	VideoTask  //
    // 5	表情任务	EMOJI_TASK
    // 6	图片任务	PICTURE_TASK
    // 7	送货任务	SONGHUO_TASK
    // 8	驻留任务	STAY_TASK
    e.preventDefault()
})
//点击取消
$("#danger").on('click', function () {
    parent.location.reload();
})