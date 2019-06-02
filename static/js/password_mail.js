
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

    $("#phone").on('click', function () {
        //$("#iframepage",parent.document).attr('src','./password_phone.html');
        window.location.href='./password_phone.html'
    });

    $("#login").on('click', function () {
        //$("#iframepage",parent.document).attr('src','logintest');
        window.location.href='./logintest.html';
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

    function findPassword(){
        var jsonStr = JSON.stringify($('#signupForm').serializeObject());  //json字符串
        $.ajax({
            type: "POST",
            url: share+"/findPasswordByMail",
            data: jsonStr,// 你的formid
            dataType:"json",
            contentType:"application/json; charset=utf-8",
            success: function (data) {
                if (data.code == 200) {
                    
                    sessionStorage.setItem("email", data.data.email);
                    sessionStorage.setItem("code", data.data.code);
                    // setCookie("email", data.data.email);
                    // setCookie("code", data.data.code);
                     window.location.href = ("./password_reset.html");
                } else {
                    layer.msg("验证码错误！")
                }
            }
        });

    }

    function validateRule() {
        var icon = "<i class='fa fa-times-circle'></i> ";
        $("#signupForm").validate({
            onfocusout: function(element) { $(element).valid(); },
            rules: {
                email: {
                    required: true,
                    email: true
                },
                code: {
                    required: true
                }
            },
            messages: {
                email: {
                    required: icon + "请输入邮箱",
                    email: icon + "邮箱格式不正确"
                },
                code: {
                    required: icon + "请输入验证码"
                }
            }
        })
    }


    //发送邮件验证码
    $('#getCode').click(function () {
        //邮箱正则
        var pattern = /^([a-zA-Z0-9]+[_|\_|\.]?)*[a-zA-Z0-9]+@([a-zA-Z0-9]+[_|\_|\.]?)*[a-zA-Z0-9]+\.[a-zA-Z]{2,3}$/;
        var email = $.trim($('#email').val());
        if (email == null || email == '') {
            layer.msg("请输入邮箱");
            return false;
        } else if (!pattern.test(email)) {
            layer.msg('邮箱格式不正确！');
            return false;
        } else {
            var jsonStr = JSON.stringify($('#signupForm').serializeObject());  //json字符串
            $.ajax({
                type: "POST",
                crossDomain: true,
                url: share+"/getEmailCode",
                dataType:"json",
                contentType:"application/json; charset=utf-8",
                data:jsonStr,// 你的formid
                xhrFields: {
                    withCredentials: true
                },
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

    function setCookie(name, value) {
        var Days = 30; //此 cookie 将被保存 30 天
        var exp = new Date();
        exp.setTime(exp.getTime() + Days * 24 * 60 * 60 * 1000);
        document.cookie = name + "=" + escape(value) + ";expires=" + exp.toGMTString();
        location.href = "./password_reset.html"; //接收页面.
    }
