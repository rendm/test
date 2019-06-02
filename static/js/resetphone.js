$(document).ready(function () {
    $("#password").on('click', function () {
    });
    validateRule();
});

var userJsonStr = sessionStorage.getItem('user');
var user = JSON.parse(userJsonStr);

var jsonMobile = user.mobile;

var genid = user.genid;


$("#notarize").on('click', function (e) {
    var oldphone = $("#oldphone").val();
    var phone = $("#phone").val();
    var validcode = $("#validcode").val();
    var data = {"genid": genid, "phonenum": phone, "validcode": validcode};
    if (!$("#signupForm").valid()) {
        return;
    }
    $.ajax({
        url: share + 'irobotweb/account/securitysetting/updatephone/gid',
        crossDomain: true,
        type: 'POST',
        data: data,
        dataType: 'JSON',
        xhrFields: {
            withCredentials: true
        },
        success: function (res) {
            if (res.code == 200) {
                layer.alert("<em style='color:green'>" + "绑定手机成功！", function () {

                    window.open("./securitysetting.html", '_self');
                })
            }
            else {
                layer.alert("<em style='color:red'>" + res.msg)
            }
        },
        error: function (data) {
        }
    })
    e.preventDefault()
})

function validateRule() {
    var icon = "<i class='fa fa-times-circle'></i> ";
    $("#signupForm").validate({
        onfocusout: function (element) {
            $(element).valid();
        },
        rules: {
            oldphone: {
                required: true,
                minlength: 11,
                isMobile: true,
                isoldMobile: true
            },
            phone: {
                required: true,
                minlength: 11,
                isMobile: true,
                remote: {
                    crossDomain: true,
                    xhrFields: {
                        withCredentials: true
                    },
                    url: share + "/irobotweb/sys/user/query/exist", // 后台处理程序
                    dataType: "json",
                    type: "post", // 数据发送方式
                    data: { // 要传递的数据
                        mobile: function () {
                            //return JSON.stringify($("#mobile").serializeObject());
                            return $("#phone").val();
                        }
                    }
                }
            },
            validcode: {
                required: true
            }
        },
        messages: {
            oldphone: {
                required: icon + "请输入旧手机号",
                minlength: icon + "不能小于11个字符",
                isMobile: icon + "请正确填写手机号码",
                isoldMobile: icon + "旧手机号不正确"
            },
            phone: {
                required: icon + "请输入新手机号",
                minlength: icon + "不能小于11个字符",
                isMobile: icon + "请正确填写手机号码",
                remote: icon + "该手机号码已经存在"
            },
            validcode: {
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


//旧手机号码验证
jQuery.validator.addMethod("isoldMobile", function (value, element) {
    //var oldphone  =[[${user.mobile}]];
    console.log(oldphone)
    console.log(value)
    return value == jsonMobile;
}, "旧手机号不正确");

//发送短信验证码
$('#getCode').click(function () {
    //手机号正则
    var phoneReg = /(^1[3|4|5|7|8]\d{9}$)|(^09\d{8}$)/;
    var phone = $.trim($('#phone').val());
    if (phone == null || phone == '') {
        layer.msg("请输入手机号");
        return false;
    } else if (!phoneReg.test(phone)) {
        layer.msg('请输入有效的手机号码！');
        return false;
    } else {
        var data = {
            mobile: $("#phone").val()
        }
        var jsonStr = JSON.stringify(data);  //json字符串
        console.log($('#signupForm').serialize(), "发送手机号传的")
        $.ajax({
            type: "POST",
            url: share + "/getCode",
            crossDomain: true,
            xhrFields: {
                withCredentials: true
            },
            dataType: "json",
            contentType: "application/json; charset=utf-8",
            data: jsonStr,// 你的formid
            success: function (data) {
                settime();
            }
        });
    }
});

//倒计时
var countdown = 60;

function settime() {
    var val = $('#getCode');
    if (countdown == 0) {
        val.attr("disabled", false);
        val.val("获取验证码");
        countdown = 60;
        return false;
    } else {
        val.attr("disabled", true);
        val.val("重新发送(" + countdown + ")");
        countdown--;
    }
    setTimeout(function () {
        settime(val);
    }, 1000);
}


