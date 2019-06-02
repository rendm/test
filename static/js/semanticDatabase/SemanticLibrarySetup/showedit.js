$().ready(function() {
    validateRule();
});

$.validator.setDefaults({
    submitHandler : function() {
        update();
    }
});
function update() {

    var add_info=$("#signupForm").serializeObject();

    var jsonStr = JSON.stringify(add_info); //json字符串

    $.ajax({
        type : "POST",
        url : share+"/irobotweb/speech/intgvoicedb/update",
        data : jsonStr,// 你的formid
        async : false,
        crossDomain: true,
        xhrFields: {
            withCredentials: true
        },
        dataType:"json",
        contentType:"application/json; charset=utf-8",
        error : function(request) {
            parent.layer.alert("Connection error");
        },
        success : function(data) {
            if (data.code == 200) {
                parent.layer.msg("操作成功");
                window.parent.location.reload();
                var index = parent.layer.getFrameIndex(window.name); // 获取窗口索引
                parent.layer.close(index);

            } else {
                parent.layer.alert(data.msg)
            }

        }
    });

}
function validateRule() {
    var icon = "<i class='fa fa-times-circle'></i> ";
    $("#signupForm").validate({
        rules : {
            question : {
                required : true,
                rangelength:[1,50]
            },
            answer : {
                required : true,
                rangelength:[1,50]
            }
        },
        messages : {
            question : {
                required : icon + "请输入问题",
                rangelength:icon + "字符长度介于【0,50】"
            },
            answer : {
                required : icon + "请输入答案",
                rangelength:icon + "字符长度介于【0,50】"
            }
        }
    })
}
var pid =sessionStorage.getItem('editid');
$("#parentId").val(pid)
$.ajax({
    url: share+'/irobotweb/speech/intgvoicedb/query/ids?id='+pid,
    type: "get",
    dataType: "json",
    cache: false,
    crossDomain: true,
    xhrFields: {
        withCredentials: true
    },
    error : function(request) {
        parent.layer.alert("Connection error");
    },
    success: function (json) {
        console.log(json);
        if (json.code=200)
        {
            var data=json.data;
            $('#question').val(data.question)
            $('#answer').val(data.answer)
            $('#id').val(data.id)
        }else
        {
            alert(json.msg)
        }



    }

});


$.fn.serializeObject = function(){
    var o = {};
    var a = this.serializeArray();
    $.each(a, function() {
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

//点击取消
$("#btn-cancel").on('click',function(){
    console.log('取消')
    //关闭ifram弹层
    var index = parent.layer.getFrameIndex(window.name); //先得到当前iframe层的索引
    parent.layer.close(index); //再执行关闭
})