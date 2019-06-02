
    var taskschedluerid = sessionStorage.getItem('taskschedluerid');
    console.log(taskschedluerid,'shopshowidshopshowidshopshowid')
    $.ajax({
        url: share+'/irobotweb/sys/taskscheduler/query/ids?jobid='+taskschedluerid,
        crossDomain: true,
        type: "get",
        dataType: "json",
        xhrFields: {
            withCredentials: true
        },
        success: function (data) {
            console.log(data.data,'数据的呀')

            $("#jobName").val(data.data.jobName)
            $("#taskSerialName").val(data.data.taskSerialName)
            $("#robothardwareno").val(data.data.robothardwareno)
            $("#robotname").val(data.data.robotname)

            $("#jobCron").val(data.data.jobCron)

            if(data.data.jobStatus == 0){
                $("#delFlag1").attr("checked",'checked')
            }else{
                $("#delFlag2").attr("checked",'checked')
            }
           
        },
    });

   
    
