var upperlimit = sessionStorage.getItem("upperlimit");
console.log(upperlimit,'upperlimitupperlimitupperlimit')
var hint;
validateRule();
$().ready(function () {
    if(upperlimit == '无上限'){
        hint='单个文件不可以超过30M'
    }else{
        hint = '单个文件不可以超过30M';
    }
    $('#type_desc').text(hint);
    $('#type').on('change',function(){
        if($(this).val()==1){
            $('#type_desc').text('请选择mp3,wma,wav等格式的音频文件(不可以超过30M)');
        }
        else if($(this).val()==2){
            $('#type_desc').text('请选择wmv,avi,dat,rm,rmvb,mp4等格式的视频文件(不可以超过30M)');
        }
        else{
            $('#type_desc').text(hint);
        }
    });
});


function getCheckedRoles(){
    var adIds = "";
    $("input:checkbox[name=role]:checked").each(function(i){
        if (0 == i) {
            adIds = $(this).val();
        } else {
            adIds += ("," + $(this).val());
        }
    });
    return adIds;
}

var resource_formData = new FormData(); //定义全局的FormData对象
// console.log(new FormData($('#file')[0]),'上传的文件')
//“确定”按钮点击后
$('#ok').on('click', function () {
    if (!$("#signupForm").valid()) {
        return; //验证不通过，不允许提交
    }
    var file=$('input[type="file"]');
    //console.log(file,'传的文件');
    var formData = new FormData();
    formData.append('avatar_file', file);
    resource_formData.append("filename", $("#filename").val());
    resource_formData.append("type", $("#type").val());
    resource_formData.append("remark", $("#remark").val());
    if($('#aim').val()=='' || $('#aim').val()==null){
        layer.alert('请选择资源文件!');
        return false;
    }
    console.log(resource_formData,'resource_formDataresource_formDataresource_formData')
    $.ajax({
        cache: true,
        type: "POST",
        url: share + "/irobotweb/sys/resource/add",
        data: resource_formData,// 你的formid 之前是formData
        async: false,
        processData: false,
        dataType: 'JSON',
        contentType: false,
        crossDomain: true,
        xhrFields: {
            withCredentials: true
        },
        error: function (request) {
            parent.layer.alert("Connection error");
        },
        success: function (data) {
            console.log(data,'返回状态');
            if (data.code == 200) {
                // parent.layer.msg("添加成功");
                // var index = parent.layer.getFrameIndex(window.name); // 获取窗口索引
                // parent.layer.close(index);
                parent.layer.alert("添加成功",function(){
                    var index = parent.layer.getFrameIndex(window.name);
                    parent.layer.close(index);
                    window.parent.location.reload();
                });
            } else if (data.code == -1) {
                parent.layer.alert('资源累计大小超过上限，请检查！');
            }
            else {
                parent.layer.alert(data.msg);               
            }
        }
    });
})

//验证方法
function validateRule() {
    var icon = "<i class='fa fa-times-circle'></i> ";
    $("#signupForm").validate({
        onfocusout: function (element) { $(element).valid(); },
        rules: {
            name: {
                required: true
            },
            shopId: {
                required: true
            },
            filename: {
                required: true,
                maxlength: 40
            },
            remark:
                {
                    maxlength: 40
                }

        },
        messages: {
            name: {
                required: icon + "请输入所属开发者"
            },
            shopId: {
                required: icon + "请输入所属店铺名称",
            },
            filename: {
                required: icon + "请输入资源名称",
                maxlength : icon + "资源名称不能多于40个字",
            },
            remark: {
                required: icon + "备注字数不能多于40个字",
            },
        }
    })
}

var file = $('#file'), aim = $('#aim');

file.on('change', function (e) {
    //e.currentTarget.files 是一个数组，如果支持多个文件，则需要遍历
    var name = e.currentTarget.files[0].name;
    aim.val(name);
    var theFile = this.files[0];
    var name = theFile.name;
    var formData = new FormData();
    formData['myfile'] = theFile;
    resource_formData.append('avatar_file', theFile);
});

$('#danger').on('click', function () {
   // window.parent.location.href = "./resource.html";
   var index = parent.layer.getFrameIndex(window.name);
   parent.layer.close(index);
});



