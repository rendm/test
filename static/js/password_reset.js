$(document).ready(function () {
        $("#resetPassword").on('click', function () {

        });
        validateRule();
    });

   $("#resetPassword").on('click',function(e){

      //alert($('#signupForm').valid());
      if(!$('#signupForm').valid()){
          return;
      }

        //sessionStorage.getItem
        var phone = sessionStorage.getItem("phone");
        var email=sessionStorage.getItem("email");
        var code = sessionStorage.getItem("code")
        // var phone = getCookie("phone");
        // var email=getCookie("email");
        // var code = getCookie("code")
        var password = $("#password").val();
        var datanum = {mobile: phone,email:email, code: code, newPassword: password};
        //console.log(JSON.stringify(datanum));
        $.ajax({
            type: "POST",
            url: share+"/resetpasswordByemail",
            data:JSON.stringify(datanum),
            dataType:"json",
            contentType:"application/json; charset=utf-8",
            success: function (data) {
                //console.log(data)
                if (data.code == 200) {
                    layer.alert("<em style='color:red'>"+"重置密码成功！",function (){
                        window.open("./login.html",'_self');
                    })
                }else{
                    layer.alert("<em style='color:red'>"+"重置密码失败！",function (){
                        //window.open("./login.html",'_self');
                    })
                }
            }
        });
        e.preventDefault()
   })

    function validateRule(){
        var icon = "<i class='fa fa-times-circle'></i> ";
        $("#signupForm").validate({
            onfocusout: function(element) { $(element).valid(); },
            rules: {
                password: {
                    required: true,
                    minlength: 6
                },
                pwd: {
                    required: true,
                    minlength: 6,
                    equalTo: "#password"
                }
            },
            messages: {
                password: {
                    required: icon + "请输入您的密码",
                    minlength: icon + "密码不能少于6个字符"
                },
                pwd: {
                    required: icon + "请输入确认密码",
                    minlength: icon + "密码不能少于6个字符",
                    equalTo: icon + "两次输入的密码不一致"
                }
            }
        })
    }

    function getCookie(name) {
        var arr = document.cookie.match(new RegExp("(^| )" + name + "=([^;]*)(;|$)"));
        if (arr != null) return unescape(arr[2]);
        return null;
    }



    $("#login").on('click', function () {
        $("#iframepage",parent.document).attr('src','./logintest.html');
    });