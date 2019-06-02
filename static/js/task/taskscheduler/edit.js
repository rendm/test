
$(function(){
    var taskschedluerid = sessionStorage.getItem('taskschedluerid');
    $('#base_save').on('click',function(){
        $.ajax({
            url: share+'/irobotweb/sys/taskscheduler/update',
            crossDomain: true,
            type: "PUT",
            xhrFields: {
                withCredentials: true
            },
            data: JSON.stringify($('#basicInfoForm').serialize()),
            success: function (data) {
                console.log(data,'这里是提交按钮')
                if (data.code == 1) {
                    parent.layer.msg("更新成功");
                    window.parent.location.reload()
                } else {
                    parent.layer.alert(data.msg)
                }
            },
            error: function (request) {
                layer.alert("Connection error");
            },
        });
    })
    
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

    $("#cancel").on('click',function(){
        window.parent.location.reload()
    })
})

