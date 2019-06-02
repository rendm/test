var resourceeditid = sessionStorage.getItem('resourceeditid');

//详情
$.ajax({
    url: share+'/irobotweb/sys/resource/query/ids?resourceid='+resourceeditid,
    crossDomain: true,
    type: "get",
    dataType:"json",
    xhrFields: {
    withCredentials: true
    },
    contentType:"application/json; charset=utf-8",
    success: function (data) {
        var jsondata = data.data;
        $("#remark").val(jsondata.remark)
        $("#filename").val(jsondata.filename)
    },
    error:function(error){
    //console.log(error.responseText,'error')
    }
    });
//验证方法
function validateRule(){
    var icon = "<i class='fa fa-times-circle'></i> ";
    $("#signupForm").validate({
        onfocusout: function (element) { $(element).valid(); },
        rules: {
            // remark: {
            //     required: true
            // },
            filename: {
                required: true
            },
            /*fileUpload:{
                    required: true
                }*/

        },
        messages: {
            // remark: {
            //     required: icon + "请输入备注",
            // },
            filename: {
                required: icon + "请输入资源名称",
            },
            /*fileUpload: {
                required: icon + "请上传资源文件",
            },*/
        }
    })
}
validateRule()
$('#ok').on('click', function () {
    if (!$("#signupForm").valid()) {
        return; //验证不通过，不允许提交
    }
    var data_json = {
        id:resourceeditid,
        remark:$("#remark").val(),
        filename:$("#filename").val()
    };
    $.ajax({
        cache: true,
        type: "POST",
        url: share + "/irobotweb/sys/resource/update",
        data: JSON.stringify(data_json),// 你的formid 之前是formData
        async: false,
        processData: false,
        dataType: 'JSON',
        contentType: false,
        crossDomain: true,
        contentType:"application/json; charset=utf-8",
        xhrFields: {
            withCredentials: true
        },
        error: function (request) {
            parent.layer.msg("Connection error");
        },

        success: function (data) {
            //console.log(data,'返回状态');
            if (data.code == 0) {
                parent.layer.msg("修改成功");
                //window.parent.location.reload();
                var index = parent.layer.getFrameIndex(window.name); // 获取窗口索引
                parent.layer.close(index);
            }else {
                parent.layer.msg(data.msg);               
            }
        }
    });
})
$('#danger').on('click', function () {
    //window.parent.location.href = "./resource.html";
    var index = parent.layer.getFrameIndex(window.name);
   parent.layer.close(index);
});