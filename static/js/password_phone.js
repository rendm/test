$(document).ready(function () {
    $("#password").on('click', function () {

    });
    validateRule();
});

$.validator.setDefaults({
    submitHandler: function () {
        findPassword();
    }
});

$("#mail").on('click', function () {
    //$("#iframepage",parent.document).attr('src','password_mail');
    window.location.href='./password_mail.html'
});

$("#login").on('click', function () {
    //$("#iframepage",parent.document).attr('src','logintest');
    window.location.href='./logintest.html'
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
function findPassword() {
    var jsonStr = JSON.stringify($('#signupForm').serializeObject());  //json字符串

    $.ajax({
        type: "POST",
        url:share+ "/findPassword",
        data: jsonStr,// 你的formid
        crossDomain: true,
        dataType:"json",
        contentType:"application/json; charset=utf-8",
        xhrFields: {
            withCredentials: true
        },
        success: function (data) {
            if (data.code == 200) {
                sessionStorage.setItem("phone", data.data.mobile);
                sessionStorage.setItem("code", data.data.code);
                // setCookie("phone", data.data.phone);
                // setCookie("code", data.data.code);
                // window.location.href = ("/password_reset");
                window.location.href = ("./password_resetphone.html");
            } else {
                layer.msg("验证码错误！")
            }
        }
    });

}

function validateRule() {
    var icon = "<i class='fa fa-times-circle'></i> ";
    $("#signupForm").validate({
        onfocusout: function (element) {
            $(element).valid();
        },
        rules: {
            mobile: {
                required: true,
                minlength: 11,
                isMobile: true
            },
            code: {
                required: true
            }
        },
        messages: {
            mobile: {
                required: icon + "请输入您的手机号",
                minlength: icon + "手机号不能少于11个字符",
                isMobile: icon + "手机号码格式不正确"
            },
            code: {
                required: icon + "请输入短信验证码"
            }
        }
    })
}


//手机号码验证
jQuery.validator.addMethod("isMobile", function (value, element) {
    var length = value.length;
    var mobile = /^(13[0-9]{9})|(18[0-9]{9})|(14[0-9]{9})|(17[0-9]{9})|(15[0-9]{9})$/;
    return this.optional(element) || (length == 11 && mobile.test(value));
}, "请正确填写手机号码");

//倒计时
var countdown = 60;

function settime() {
    var val = $('#getCode');
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


//发送短信验证码
$('#getCode').click(function () {
    //手机号正则
    var phoneReg = /(^1[3|4|5|7|8]\d{9}$)|(^09\d{8}$)/;
    var phone = $.trim($('#mobile').val());
    if (phone == null || phone == '') {
        layer.msg("请输入手机号!");
        return false;
    } else if (!phoneReg.test(phone)) {
        layer.msg('手机号码格式不正确！');
        return false;
    } else {
        var jsonStr = JSON.stringify($('#signupForm').serializeObject());  //json字符串
        $.ajax({
            type: "POST",
            crossDomain: true,
            xhrFields: {
                withCredentials: true
            },
            dataType:"json",
            contentType:"application/json; charset=utf-8",
            url: share+"/getCode",
            data: jsonStr,// 你的formid
            success: function (data) {
                settime();
                //console.log('发送验证码')
            }
        });
    }
});

function setCookie(name, value) {
    var Days = 30; //此 cookie 将被保存 30 天
    var exp = new Date();
    exp.setTime(exp.getTime() + Days * 24 * 60 * 60 * 1000);
    document.cookie = name + "=" + escape(value) + ";expires=" + exp.toGMTString();
    location.href = "./password_reset.html"; //接收页面.
}