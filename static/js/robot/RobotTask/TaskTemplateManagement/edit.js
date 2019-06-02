//引入
document.write("<script language=javascript src='/js/2.js'><\/script>");


$(document).ready(function (){
    var editid = sessionStorage.getItem('model_editid');
    console.log(editid,'editideditid')
    // 调取内容ajax，设置内容
    //  编辑添加
    let lastAjax = function (arraydata) {
        console.log(JSON.stringify(arraydata), '传的参数打印看看')
        var jsonstring = {
            "taskModeId":showid,
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
            type: "PUT",
            url: share + "/irobotweb/sys/taskmodel/update",
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
                    //parent.location.reload();
                    //关闭iframe弹层
                    var index = parent.layer.getFrameIndex(window.name); // 获取窗口索引
                        parent.layer.close(index);
                    parent.layer.msg("修改成功") 
                }
            }
        });
    }
    function setContent(initialize){
        var tasktype;
        $.ajax({
            url: share + '/irobotweb/sys/taskmodel/query/ids?taskmodelid=' + editid,
            crossDomain: true,         
            type: "get",
            dataType: "json",
            xhrFields: {
                withCredentials: true
            },
            success: function (data){
                console.log(data.data, '这是详情的数据内容')
                var showdata = data.data;
                $('#type option').attr('selected', false)
                $("#type option:contains('" + showdata.taskTypeName + "')").attr("selected", "selected");//任务类型

                //$("#developerName").val(showdata.developername)  //开发者姓名
                $('#developerid option').attr('selected', false)
                $("#developerid option:contains('" + showdata.developername + "')").attr("selected", "selected");//开发者姓名

                //$("#shopName").val(showdata.shopname) //店铺名称  
                $('#shopId option').attr('selected', false)
                $("#shopId option:contains('" + showdata.shopname + "')").attr("selected", "selected");//店铺名称
                $("#taskTypeName").val(showdata.taskName) //任务模板名称
                var valuetext;
                if(showdata.taskModelDetailsDOList.length>0){
                    valuetext =showdata.taskModelDetailsDOList[0].value
                }
                 tasktype = showdata.taskTypeName;
                // 处理不同的选项对应的不同
                initialize.forEach(function (item, index) {
                    console.log('item',item)
                    if (item.taskTypeName != tasktype) return
                    var value = item.taskParamsDOList;
                    var texthtml
                    console.log(value, '属于什么poi  text  url')
                    if (value.length < 1) {
                        texthtml = '<label class="col-sm-3 control-label">' + tasktype + '：</label>' +
                            '<div class="col-sm-8">' +
                            '<input id="cased" name="cased" value="'+valuetext+'" class="form-control" type="text" >' +
                            '</div>';
                    } else if (value.length >= 1) {
                        if (value[0].pararmsType == 'text') {
                            if (tasktype == '亮灯任务') {
                                console.log('亮灯任务的呀')
                                texthtml = '<label class="col-sm-3 control-label">' + tasktype + '：</label>' +
                                    '<div class="col-sm-8">' +
                                    '<select id="lighttype" name="lighttype" class="form-control"  >' +
                                    '<option value="0">常亮</option>' +
                                    '<option value="1">闪烁</option>' +
                                    '<option value="2">呼吸</option>' +
                                    '</select>' +
                                    '</div>';
                            } else {
                                texthtml = '<label class="col-sm-3 control-label">' + tasktype + '：</label>' +
                                    '<div class="col-sm-8">' +
                                    '<input id="cased" name="cased" value="'+valuetext+'" class="form-control" type="text" >' +
                                    '</div>';
                            }
                            //选中下拉框的文本
                        } else if (value[0].pararmsType == 'poi') {
                            texthtml = '<div class="form-group">' +
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
                            //地图
                            setTimeout(() => {
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
                            }, 1);
                        } else if (value[0].pararmsType == 'imgurl') {
                            texthtml = '<label class="col-sm-3 control-label">' + tasktype + '：</label>' +
                                '<div class="col-sm-8">' +
                                '<select id="imgtype" name="imgtype" class="form-control"  >' +

                                '</select>' +
                                '</div>';
                            setTimeout(() => {
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
                                        var imgdata = data.data;// 视频
                                        var opda = '';
                                        imgdata.forEach(function (item) {
                                            opda += '<option  value="' + item.ossurl + '">' + item.filename + '</option>';

                                        })
                                        $("#imgtype").html(opda)
                                    },
                                    error: function (error) {

                                    }
                                });
                            }, 1);

                        } else if (value[0].pararmsType == 'videourl') {
                            texthtml = '<label class="col-sm-3 control-label">' + tasktype + '：</label>' +
                                '<div class="col-sm-8">' +
                                '<select id="videotype" name="videotype" class="form-control"  >' +

                                '</select>' +
                                '</div>';
                                setTimeout(() => {
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
                                        var videodata = data.data;// 视频
                                        var opda = '';
                                        videodata.forEach(function (item) {
                                            opda += '<option  value="' + item.ossurl + '">' + item.filename + '</option>';
                                        })
                                        $("#videotype").html(opda)
                                    },
                                    error: function (error) {

                                    }
                                });
                            }, 1);
                        } else if (value[0].pararmsType == 'audiourl') {
                            texthtml = '<label class="col-sm-3 control-label">' + tasktype + '：</label>' +
                                '<div class="col-sm-8">' +
                                '<select id="audiotype" name="audiotype" class="form-control"  >' +

                                '</select>' +
                                '</div>';
                            setTimeout(() => {
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
                                        var audiodata = data.data;// 视频
                                        var opda = '';
                                        audiodata.forEach(function (item) {
                                            opda += '<option  value="' + item.ossurl + '">' + item.filename + '</option>';

                                        })
                                        $("#audiotype").html(opda)
                                    },
                                    error: function (error) {

                                    }
                                });
                            }, 1);
                        }else{
                            console.log('eleelseelseelselelseelseelseelse')
                            var texthtml = '<label class="col-sm-3 control-label">' + text + '：</label>' +
                            '<div class="col-sm-8">' +
                            '<input id="cased" name="cased" value="'+valuetext+'" class="form-control" type="text" >' +
                            '</div>';
                        }
                    }
                    $("#thde").html(texthtml);
                })
            },
            error: function (request) {
                layer.alert("Connection error");
            },
        });
    }
    //任务类型  列表
    $.ajax({
        url: share + '/irobotweb/sys/tasktype/query/list',
        crossDomain: true,
        type: "get",
        dataType: "jsonp",
        xhrFields: {
            withCredentials: true
        },
        jsonp: "jsonpCallback",
        jsonpCallback: "success_jsonpCallback",
        success: function (data) {
            var initialize = data.rows;
            console.log(initialize, '任务类型')
            var typedata = '';
            initialize.forEach(function (item, index) {
                
                typedata += '<option  task="' + item.taskType + '" pursuant="' + index + '" value="' + item.taskTypeId + '">' + item.taskTypeName + '</option>';
            })
            $("#type").html(typedata)
            setContent(initialize) // 调取内容ajax，设置内容
            // ---------------
            // ---------------


            
        },
        error: function (error) {
        }
    });

    //开发者 列表
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
    //         json.data.forEach(function (item) {
    //             console.log(item.name)
    //             op += '<option value="' + item.developerid + '">' + item.name + '</option>';
    //         })
    //         $("#developerid").html(op)
    //     }
    // })
    //店铺  列表
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
    //         json.data.forEach(function (item) {
    //             oph += '<option value="' + item.shopId + '">' + item.shopName + '</option>';
    //         })
    //         $("#shopId").html(oph)
    //     }
    // })



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
                var text = $("#type").find("option:selected").text();
                if (value.length >= 1) {
                    console.log(value[0].pararmsType, '参数详情')
                    if (value[0].pararmsType == 'text') {
                        //样式
                        
                        console.log(text,'text')
                        if (text == '亮灯任务') {
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
                    }else{
                        var texthtml = '<label class="col-sm-3 control-label">' + text + '：</label>' +
                        '<div class="col-sm-8">' +
                        '<input id="cased" name="cased" class="form-control" type="text" >' +
                        '</div>';
                    $("#thde").html(texthtml);
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
                            taskPararmsName: text
                        }
                        arraydata.push(textdata)
    
                    } else if (value[0].pararmsType == 'videourl') {
                        var textdata = {
                            value:$("#videotype").val(),
                            taskPararms: text,
                            taskPararmsName: text
                        }
                        arraydata.push(textdata)
                    } else if (value[0].pararmsType == 'audiourl') {
                        var textdata = {
                            value:$("#audiotype").val(),
                            taskPararms: text,
                            taskPararmsName: text
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
        var index = parent.layer.getFrameIndex(window.name); // 获取窗口索引
        parent.layer.close(index);
    })

});


