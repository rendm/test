
$("#resetPassword").on('click',function(){
    //  /firstlogin
    var getcode= {
        "mobile":$('#mobile').val(),
        "code":$('#code').val(),
    }
    var jsondata = JSON.stringify(getcode);
    $.ajax({
        type: "GET",
        url:share+ "/firstlogin",
        data: getcode,// 你的formid
        crossDomain: true,
        // dataType:"json",
        // contentType:"application/json; charset=utf-8",
        xhrFields: {
            withCredentials: true
        },
        success: function (data) {
            console.log(data,'datadatadata第一次登陆返回')
            if (data.code == 200) {
                window.parent.location.href = ("./index.html");
            } else {
                layer.msg("验证码错误！")
            }
        }
    });
})
//发送验证码
$("#gain").on('click',function(){
    var phoneReg = /(^1[3|4|5|7|8]\d{9}$)|(^09\d{8}$)/;
        var phone = $.trim($('#mobile').val());
        if (phone == null || phone == '') {
            layer.msg("请输入手机号");
            return false;
        } else if (!phoneReg.test(phone)) {
            layer.msg('请输入有效的手机号码！');
            return false;
        } else {
            var str = {
                "mobile":$('#mobile').val()
            }
            var jsonStr = JSON.stringify(str);  //json字符串
            console.log(jsonStr,str) //url: share+"/getCode",
            $.ajax({
                type: "POST",
                url: share+"/getCode",
                data: jsonStr,// 你的formid//所有input框 里面的值
                crossDomain: true,
                dataType:"json",
                contentType: "application/json; charset=utf-8",
                xhrFields: {
                    withCredentials: true
                },
                error: function (request) {
                    parent.layer.alert("Connection error");
                },
                success: function (data) {
                    settime();
                    console.log('发送验证码')
                    console.log(data)
                }
            });
        }
})
var countdown = 60;
function settime() {
    var val = $('#gain');
    if (countdown == 0) {
        val.attr("disabled",false);
        val.val ("获取验证码") ;
        countdown = 60;
        return false;
    } else {
        val.attr("disabled", true);
        val.val ("重新发送(" + countdown + ")") ;
        countdown--;
    }
    setTimeout(function () {
        settime(val);
    }, 1000);
}

$("#login").on('click', function () {
    //$("#iframepage",parent.document).attr('src','logintest');
    window.location.href='./logintest.html'
});