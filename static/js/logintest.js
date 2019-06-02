
    $(document).ready(function () {
        // 登录按钮
        $("#login").on('click', function () {
            $("#signupForm").submit(); 
        });
        validateRule();
    });

    $.validator.setDefaults({
        submitHandler: function () {
            login();
        }
    });    //忘记密码按钮
    $("#forgetPwd").on('click', function () {
       // $("#iframepage", parent.location.href).attr('src', 'password_phone.html');
       //$("#iframepage").attr('src', 'password_phone.html')
       window.location.href="./password_phone.html";
    });
    // 免费注册按钮
    $("#register").on('click', function () {
        //$(window).attr('location','//www.jb51.net');
        //$("#iframepage", parent.document).attr('src', './register.html');
        window.location.href="./register.html";
    });

    var counterror = 1;
    var verifyCode
    function login() {
        if (counterror > 3) {
            $("#imageDiv").show();
            var code = $('#imageCode').val();
            if (verifyCode) {
                var res = verifyCode.validate(document.getElementById("imageCode").value);
                if (code == null || code == '') {
                    parent.layer.msg("请输入验证码");
                    return;
                }
                if (res) {
                }
                else {
                    parent.layer.msg("验证码错误");
                    $('#imageCode').val('');
                    return;
                }
            } else {
                verifyCode = new GVerify("v_container");
            }


        }
        $.ajax({
            type: "POST",
            crossDomain: true,
            url: share+'login',
            data: $('#signupForm').serialize(),
            xhrFields: {
                withCredentials: true
            },
            beforeSend: function () {
                // l_index = layer.load(1, {
                //     shade: [0.1,'#fff'] //0.1透明度的白色背景
                // });
                l_index = layer.load(1);
            },

            success: function (r) {
                console.log(r,'logintest登录')
                layer.close(l_index);
                if (r.code == 200) {

                    layer.close(l_index);
                    //parent.location.href = '/index';
                    window.parent.location.href="./index.html"
                }else if(r.code == 1048){
                    window.location.href="./verificationphone.html"
                } else {
                    counterror++;
                    layer.msg(r.msg);
                }
            },
            error: function (XMLHttpRequest, textStatus, errorThrown) {
                //              $("#p_test").innerHTML = "there is something wrong!";
                //                alert(XMLHttpRequest.status);
                //                alert(XMLHttpRequest.readyState);
                                alert(textStatus);
            }
        });

    }

    function validateRule(){
        var icon = "<i class='fa fa-times-circle'></i> ";
        $("#signupForm").validate({
            onfocusout: function (element) {
                $(element).valid();
            },
            rules: {
                username: {
                    required: true,
                    isMobile: true,
                },
                password: {
                    required: true
                }
            },
            messages: {
                username: {
                    required: icon + "请输入您的用户名",
                    isMobile: icon + "请正确输入手机号或邮箱",
                },
                password: {
                    required: icon + "请输入您的密码",
                }
            }
        })

    }
    /**登录：回车键登录*/
    $(document).keyup(function (event) {
        if (event.keyCode == 13) {
            validateRule();
			login();
        }
    });

    //手机号码验证
    jQuery.validator.addMethod("isMobile", function (value, element) {
        var length = value.length;
        var mobile = /^(13[0-9]{9})|(18[0-9]{9})|(14[0-9]{9})|(17[0-9]{9})|(15[0-9]{9})$/;
        var mail = /^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/;
        return this.optional(element) || (mail.test(value) || mobile.test(value));
    }, "请正确输入手机号或邮箱");
   