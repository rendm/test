$(document).ready(function (){
    var model_showid = sessionStorage.getItem('model_showid');
    setContent(model_showid);
    fetch(share+'/irobotweb/sys/taskmodel/query/ids?taskmodelid=255',{
        method: 'get',
        credentials: 'include',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
        },
    })
    .then(response => response.json())
    .then(data => {
      // data就是我们请求的repos
      console.log(data)
    });

    
});
    // 调取内容ajax，设置内
    function setContent(showid) {
        $.ajax({
            url: share + '/irobotweb/sys/taskmodel/query/ids?taskmodelid=' + showid,
            crossDomain: true,
            type: "get",
            dataType: "json",
            xhrFields: {
                withCredentials: true
            },
            success: function (json) {
                console.log(json.data, '这是详情的数据内容')
                var showdata = json.data;

                var  typedata = '<option  value="' + showdata.taskTypeId + '">' + showdata.taskTypeName + '</option>';

                $('#type').append(typedata)
                $("#taskTypeName").val(showdata.taskName) //任务模板名称
         

                initstyle(showdata.taskTypeId);

                var map=$("#tasktype").find("#map");
                if(map.length>0)
                {
                    $("#map").val(showdata.mapid);
                    initmappoi(showdata.mapid);

                    
                }
                 
                var  taskmodels =showdata.taskModelDetailsDOList;
                taskmodels.forEach(function (item) {
                    if("pointname"==item.taskPararms  ||"startpointname"==item.taskPararms||"endpointname"==item.taskPararms)
                    {
                        $("#pointname option[text="+item.value+"]").attr("selected",true); 
                        $("#startpointname option[text="+item.value+"]").attr("selected",true); 
                        $("#endpointname option[text="+item.value+"]").attr("selected",true); 
                      

                    }else{
                        $("#"+item.taskPararms).val(item.value);
                    }
    
                })


            disableForm("signupForm","disabled");
            },
            error: function (request) {
                layer.alert("Connection error");
            },
        });
    }
   
 // 调取内容ajax，设置内
 function initstyle(tasktypeid) {
    $.ajax({
        url: share + '/irobotweb/sys/tasktype/query/ids?tasktypeid=' + tasktypeid,
        crossDomain: true,
        type: "get",
        dataType: "json",
        async:false,
        xhrFields: {
            withCredentials: true
        },
        success: function (json) {
           
            var typedata = json.data;
            var type= typedata.taskType;
            html =generotasktype(typedata);
            $("#tasktype").html(html);
                
            if(type=="video")
            { 
                getresoure("2");       
            }
        
            
            if(type=="audio")
            { 
                getresoure("1");       
            }
        
            if(type=="picture")
            { 
                getresoure("0");
              
            }


            var map=$("#tasktype").find("#map");
            if(map.length>0)
            {
                initmap();
            }
        
        },
        error: function (request) {
            layer.alert("Connection error");
        },
    });
}



function initmap()
{   
//地图
$.ajax({
    url: share + '/irobotweb/sys/map/query/listpart',
    type: "get",
    dataType: "json",
    //cache: false,
    async:false,
    crossDomain: true,
    xhrFields: {  
        withCredentials: true
    },
   
    success: function (json) {
       // console.log(json, '地图的呀')//mapName
        var mapdata = json;
        var oph = '';
        mapdata.forEach(function (item) {
            oph += '<option value="' + item.mapId + '">' + item.mapName + '</option>';
        })
        $("#map").html(oph);
    },
    error: function (json) {

    }
  }) 
}



 //初始化点位
 let initmappoi=function(mapid)
 {
     $.ajax({
         url: share + '/irobotweb/sys/mappoi/query/mapids?mapid='+mapid,
         type: "get",
         //cache: false,
         async:false,
         crossDomain: true,
         xhrFields: {  
             withCredentials: true
         },
         success: function (json) {
             console.log(json.data, '地图的呀')//mapName
             var oph = '';
             json.data.forEach(function (item) {
                 oph += '<option value="' + item.poiName + '">' + item.poiName + '</option>';
             })
            $("#pointname").html(oph);
            $("#startpointname").html(oph);
            $("#endpointname").html(oph);
         },
         error: function (json) {
     
         }
     })
 }
 



//初始化资源
function getresoure(type)
{
    $.ajax({
        url: share + '/irobotweb/sys/resource/query/list/type?type='+type,
        crossDomain: true,
        type: "get",
        //dataType:"jsonp",
        async:false,
        xhrFields: {
            withCredentials: true
        },
        jsonpCallback: "success_jsonpCallback",
        success: function (data) {
            //console.log(data.data, '视频列表')
            var videodata = data.data;// 视频
            var opda = '';
            videodata.forEach(function (item) {
                opda += '<option  value="' + item.ossurl + '">' + item.filename + '</option>';
             //   console.log(item)

            })
            if("0"==type){
                $("#pictureurl").html(opda);
            }
            if("1"==type){
                $("#audiourl").html(opda);
            }
            if("2"==type){
                $("#videourl").html(opda);
            }
           
        },
        error: function (error) {

        }
    });
}


// 一般情况;
//点位特殊;
function generotasktype(tasktypeDO)
{  
    var html='' ;

   switch(tasktypeDO.taskType)
   {
       case "point":
            
      

            html  =html +  '<div class="form-group">' +
            '<label class="col-sm-3 control-label">选择地图：</label>' +
            '<div class="col-sm-8" class="margin-top">' +
            '<select id="map" name="map" class="form-control"  >' +
             
            '</select>' +
            '</div>' +
            '</div>' +
            '<div class="form-group">' +
            '<label class="col-sm-3 control-label">目的地点：</label>' +
            '<div class="col-sm-8" class="margin-top">' +
            '<select id="pointname" name="pointname" class="form-control"  >' +
            '</select>' +
            '</div>' +
            '</div>';



       break;

       case "chargepoint":

      

            html  =html +  '<div class="form-group">' +
            '<label class="col-sm-3 control-label">选择地图：</label>' +
            '<div class="col-sm-8" class="margin-top">' +
            '<select id="map" name="map" class="form-control"  >' +
          
            '</select>' +
            '</div>' +
            '</div>' +
            '<div class="form-group">' +
            '<label class="col-sm-3 control-label">充电点：</label>' +
            '<div class="col-sm-8" class="margin-top">' +
            '<select id="pointname" name="pointname" class="form-control"  >' +
            '</select>' +
            '</div>' +
            '</div>';

           
            
      
       break;

       case "songhuo":

      
            html  =html +  '<div class="form-group">' +
       '<label class="col-sm-3 control-label">选择地图：</label>' +
       '<div class="col-sm-8" class="margin-top">' +
       '<select id="map" name="map" class="form-control"  >' +
    
       '</select>' +
       '</div>' +
       '</div>' +
       '<div class="form-group">' +
       '<label class="col-sm-3 control-label">起始点：</label>' +
       '<div class="col-sm-8" class="margin-top">' +
       '<select id="startpointname" name="startpointname" class="form-control"  >' +
       '</select>' +
       '</div>' +
       '</div>' +
       '<div class="form-group">' +
       '<label class="col-sm-3 control-label">结束点：</label>' +
       '<div class="col-sm-8" class="margin-top">' +
       '<select id="endpointname" name="endpointname" class="form-control"  >' +
       '</select>' +
       '</div>' +
       '</div>';          
         
       break;      
   }


   $.each(tasktypeDO.taskParamsDOList,function(n,value) {
    html =html +gettaskparams(value);
  });
   return html ;

}

  function  gettaskparams(taskparams)
  {
      var html='' ;
        
    switch(taskparams.pararmsType)
    {
        case "text":

         html =html+ '<div class="form-group"><label class="col-sm-3 control-label">' + taskparams.taskPararmsName + '：</label>' +
        '<div class="col-sm-8">' +
        '<input id="'+taskparams.taskPararms +'" name="cased" class="form-control" type="text" >' +
        '</div></div>';    
        break;

        case "videourl":

         html = html+'<div class="form-group"><label class="col-sm-3 control-label">' + taskparams.taskPararmsName + '：</label>' +
        '<div class="col-sm-8">' +
        '<select id="videourl" name="videourl" class="form-control"  >' +

        '</select>' +
        '</div></div>';

        break;


        case "audiourl":

        html = html+'<div class="form-group"><label class="col-sm-3 control-label">' + taskparams.taskPararmsName + '：</label>' +
       '<div class="col-sm-8">' +
       '<select id="audiourl" name="audiourl" class="form-control"  >' +

       '</select>' +
       '</div></div>';

       break;

        case "pictureurl":

        html =html+ '<div class="form-group"><label class="col-sm-3 control-label">' + taskparams.taskPararmsName + '：</label>' +
        '<div class="col-sm-8">' +
        '<select id="pictureurl" name="pictureurl" class="form-control"  >' +

        '</select>' +
        '</div></div>';

        break;

        case "emojitype":

        html = html+ '<div class="form-group"><label class="col-sm-3 control-label">' + taskparams.taskPararmsName + '：</label>' +
        '<div class="col-sm-8">' +
        '<select id="emojitype" name="emojitype" class="form-control"  >' +
        '<option value="0">常亮</option>' +
        '<option value="1">闪烁</option>' +
        '</select>' +
        '</div></div>';

        break;

        case "shilingtype":
        html = html+ '<div class="form-group"><label class="col-sm-3 control-label">' + taskparams.taskPararmsName + '：</label>' +
        '<div class="col-sm-8">' +
        '<select id="shilingtype" name="shilingtype" class="form-control"  >' +
        '<option value="0">常亮</option>' +
        '<option value="1">闪烁</option>' +
        '<option value="2">呼吸</option>' +
        '</select>' +
        '</div></div>';
        break;

        case "emoji":
        html = html+ '<div class="form-group"><label class="col-sm-3 control-label">' + taskparams.taskPararmsName + '：</label>' +
        '<div class="col-sm-8">' +
        '<select id="emoji" name="emoji" class="form-control"  >' +
        '</select>' +
        '</div></div>';
        break;

        case "":

        break;

        default:
        html =html+ '<div class="form-group"><label class="col-sm-3 control-label">' + taskparams.taskPararmsName + '：</label>' +
        '<div class="col-sm-8">' +
        '<input id="'+taskparams.taskPararms +'" name="cased" class="form-control" type="text" >' +
        '</div></div>';    
        break;


    } 

    return  html ;

  }



  //禁用form表单中所有的input[文本框、复选框、单选框],select[下拉选],多行文本框[textarea]  
  
function disableForm(formId,isDisabled) {  
      
    var attr="disable";  
    if(!isDisabled){  
       attr="enable";  
    }  
    $("form[id='"+formId+"'] :text").attr("disabled",isDisabled);  
    $("form[id='"+formId+"'] textarea").attr("disabled",isDisabled);  
    $("form[id='"+formId+"'] select").attr("disabled",isDisabled);  
    $("form[id='"+formId+"'] :radio").attr("disabled",isDisabled);  
    $("form[id='"+formId+"'] :checkbox").attr("disabled",isDisabled);  
      
}  