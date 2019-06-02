    $(document).ready(function () {
        $("#resetPassword").on('click', function () {
        });
        validateRule();
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
    var jsonEmail;
    var genid;
    var userJsonStr = sessionStorage.getItem('user');
    var user = JSON.parse(userJsonStr);
    jsonEmail = user.email;
    genid =user.genid;

   $("#notarize").on('click',function(e){
       var email =$("#email").val();
       var validcode =$("#validcode").val();
       var data ={"genid":genid,"email":email,"validcode":validcode};
       // var jsonStr = JSON.stringify(data);  //json字符串

       if(!$("#signupForm").valid()){
           return;
       }

       $.ajax({
           url:share+'irobotweb/account/securitysetting/updateemail/gid',
           type:'POST',
           data:data,
           dataType:'JSON',
           async: false,
            xhrFields: {
                withCredentials: true
            },
           success:function(res){
               console.log(res)
               if(res.code==200){
                   layer.alert("<em style='color:red'>"+"绑定邮箱成功！",function () {
                       window.open("./security_setting.html",'_self');
                   })
               }
               else{
                   layer.alert("<em style='color:red'>"+res.msg)
               }

           },
           error:function (data) {

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
                oldemail: {
                    required: true,
                    email: true,
                    isoldemail:true
                },

                email: {
                    required: true,
                    email: true,
                    remote: {
                        url: share + "/irobotweb/sys/user/query/exist", // 后台处理程序
                        crossDomain: true,
                        xhrFields: {
                            withCredentials: true
                        },
                        type: "post", // 数据发送方式
                        dataType: "json",
                        data: { // 要传递的数据
                            email: function () {
                                //var data = JSON.stringify($("#email").serializeObject())
                                var data = $("#email").val();
                                return data
                            }
                        }
                    }
                },
                validcode: {
                    required: true
                }
            },
            messages: {

                oldemail: {
                    required: icon + "请输入邮箱",
                    email: icon + "请输入正确的邮箱格式",
                    isoldemail:icon + "请输入正确的旧邮箱地址"
                },
                email: {
                    required: icon + "请输入邮箱",
                    email: icon + "请输入正确的邮箱格式",
                    remote: icon + "该邮箱已经存在"
                },
                validcode: {
                    required: icon + "请输入验证码"
                }
            }
        })
    }



    //旧手机号码验证
    jQuery.validator.addMethod("isoldemail", function (value, element) {

        return  value== jsonEmail ;
    }, "旧邮箱不正确");

    //发送邮件验证码
    $('#getCode').click(function (e) {
        //邮箱正则
        var pattern = /^([a-zA-Z0-9]+[_|\_|\.]?)*[a-zA-Z0-9]+@([a-zA-Z0-9]+[_|\_|\.]?)*[a-zA-Z0-9]+\.[a-zA-Z]{2,3}$/;
        var email = $.trim($('#email').val());
        if (email == null || email == '') {
            layer.msg("请输入邮箱");
            return false;
        } else if (!pattern.test(email)) {
            layer.msg('请输入有效的邮箱！');
            return false;
        } else {
           //'点击确定获取邮箱')
            var data ={
                email:$("#email").val()
            }
            var jsonStr = JSON.stringify(data);  //json字符串
            //jsonStr,'传输')
            $.ajax({
                type: "POST",
                url: share+"/getEmailCode",
                data:jsonStr,// 你的formid
                crossDomain: true,
                xhrFields: {
                    withCredentials: true
                },
                dataType:"json",
                contentType:"application/json; charset=utf-8",
                success: function (data) {
                    settime();
                }
            });
            e.preventDefault()
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
