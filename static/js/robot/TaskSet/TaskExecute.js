


var robottaskid='',hardwareno='',taskType='';

$(function(){

   //alert(333);

   robottaskid=getQueryString('robottaskid');
   hardwareno=getQueryString('hardwareno');
   taskType=getQueryString('taskType');
   var ex_task_reload=sessionStorage.getItem('ex_task_reload');
   //alert(ex_task_reload);
  //alert(taskType);

    if(taskType=='wlcm_task'){
        //alert('迎宾');
        $('#taskName').text('迎宾');
        $('.d-taskEx').hide();
        $('#exMode').hide();
        $('#exContent').hide();
    }else if(taskType=='ex_task' || ex_task_reload==1){

        $('#taskName').text('定点讲解');
        $('.d-taskNotEx').hide();
        $('#exMode').attr('style','visibility: visible;');
        $('#exContent').attr('style','visibility: visible;');
        sessionStorage.setItem('ex_task_reload', 0);
    }else if(taskType=='sending_task'){
        $('#taskName').text('送物');
        $('#span1').hide();
        $('#span2').hide();
        $('#ExecuteTime').hide();
        $('#lbl').text('机器人将执行送货任务！');
        $('.d-taskEx').hide();
        $('#exMode').hide();
        $('#exContent').hide();
    }else if(taskType=='ad_task'){
        $('#taskName').text('广告');
        // $('.d-taskEx').hide();
        // $('#exMode').hide();
        // $('#exContent').hide();
        $('.d-taskEx').hide();
        $('#exMode').hide();
        $('#exContent').hide();
    }

    var executeMode=$('input[name="executeMode"]:checked').val();

    if(executeMode==1){
        $('#lblExMode1').show();
        $('#lblExMode2').hide();
    }else if(executeMode==2){
        $('#lblExMode1').hide();
        $('#lblExMode2').show();
    }


    // alert(robottaskid);
    // alert(hardwareno);


   $('#ok').click(function () {

       //debugger

       var obj={};
       var hardwareno_arr=new Array();
       obj.robottaskid=robottaskid;
       hardwareno_arr.push(hardwareno);
       obj.hardwareno=hardwareno_arr;

       if(taskType=='wlcm_task' || taskType=='ad_task'){

           if($('#ExecuteTime').val()==''){
               layer.msg('请选择有效的执行时间!');
               return false;
           }

           obj.executeTime=$('#ExecuteTime').val();
       }

       if(taskType=='ex_task'){
           var executeType=$('input:radio[name*="executeMode"]:checked').val();
           obj.executeType=executeType;
           if(executeType==1){ //按时间
               obj.executeTime=$('#ex-ExecuteTime').val();
               if($('#ex-ExecuteTime').val()==''){
                   layer.msg('请选择有效的执行时间!');
                   return false;
               }

           }else if(executeType==2){ //按次数
               obj.executeCount=$('#executeCount').val();
               if($('#executeCount').val()==''){
                   layer.msg('请选择有效的执行次数!');
                   return false;
               }
           }

           sessionStorage.setItem('ex_task_reload', 1);
       }else if(taskType=='ad_task') {
           $('#exContent').hide();
       }

       var jsonStr=JSON.stringify(obj);
       //console.info('jsonStr'); console.info(jsonStr);
       //alert(jsonStr);

       $.ajax({
           type : "post",
           url : share+"/irobotweb/robottask/control/runtask",
           data :jsonStr,
           crossDomain: true,
           async:false,
           dataType:"json",
           contentType:"application/json; charset=utf-8",
           xhrFields: {
               withCredentials: true
           },
           error : function(request) {
               parent.layer.alert("Connection error",function () {
                   //alert(222);
                   window.parent.location.reload();
                   var index = parent.layer.getFrameIndex(window.name);
                   parent.layer.close(index);
               });
           },
           success : function(data) {
               // console.log('执行返回的消息');console.log(data);
               //alert(333);
               // debugger
               if (data.code == 200) {

                   parent.layer.alert(data.msg,function () {
                       window.parent.location.reload();
                       if(taskType=='ad_task') {
                           $('#exContent').hide();
                       }
                       var index = parent.layer.getFrameIndex(window.name);
                       parent.layer.close(index);
                   });
               }else {
                   //alert(222);
                   //layer.alert(data.code);
                   //layer.alert('执行失败！');
                   parent.layer.alert(data.msg,function () {
                      // alert(222);
                       window.parent.location.reload();
                       var index = parent.layer.getFrameIndex(window.name);
                       parent.layer.close(index);
                   });
               }
           }
       });
   });

    $('input:radio[name="executeMode"]').click(function () {
        var executeMode=$(this).val();
        if(executeMode==1){
            $('#lblExMode1').show();
            $('#lblExMode2').hide();
        }else if(executeMode==2){
            $('#lblExMode1').hide();
            $('#lblExMode2').show();
        }
    });


});

//根据名称获取地址栏里的参数
function getQueryString(name) {
    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
    var r = window.location.search.substr(1).match(reg);
    if (r != null) return unescape(r[2]);
    return null;
}