
    var prefix = "irobotweb/sys/check";

    $(document).ready(function () {

        validateRule();


        var isPassVal=$('input[type=radio][name=isPass]:checked').val();
        showReasonDesc(isPassVal);

        $('input[type=radio][name=isPass]').change(function () {
            showReasonDesc($(this).val());
        });
    });

    //根据审核状态控制原因
    function showReasonDesc(isPassVal) {
        if(isPassVal=='N'){
            $('.reason_desc').show();
        }
        else{
            $('.reason_desc').hide();
        }
    }

    var type = sessionStorage.getItem('checktype');
    var id = sessionStorage.getItem('checkid');
    //console.log(type);

    function aj(type,id){
        $.ajax({
            url:share+'/irobotweb/sys/check/tocheck/'+type+'/'+id+'',
            type:'get',
            crossDomain: true,
            xhrFields: {
                withCredentials: true
            },
            success:function(data){
                //console.log('data');
                //console.log(data);

            }
        })
       
    }
    aj(type,id);

    $("#put").on('click',function(e){
        if (type == 1) {
            check(id);
        } else if(type ==2) {
            enterprise(id);
            
        }
        e.preventDefault()
    })

    function check(value){
        $("#sole").val(value);
        $.ajax({
            type: "POST",
            url: share+"/irobotweb/sys/check/submitpersonalcheck",
            crossDomain: true,
            xhrFields: {
                withCredentials: true
            },
            data: $('#signupForm').serialize(),// 你的formid
            async: false,
            success: function (data) {
                //console.log(data);
                layer.alert("<em style='color:red'>" + "审核完成！", {icon: 1}, function () {
                    parent.location.href='./check.html' //刷新页面
                })
            }
        });
       
    }

    function enterprise(value){
        $("#sole").val(value)
        $.ajax({
            type: "POST",
            url: share+"/irobotweb/sys/check/submitenterprisecheck",
            crossDomain: true,
            xhrFields: {
                withCredentials: true
            },
            data: $('#signupForm').serialize(),// 你的formid
            async: false,
            success: function (data) {
                //console.log(data);
                layer.alert("<em style='color:red'>" + "审核完成！", {icon: 1}, function () {
                    parent.location.href='./check.html' //刷新页面
                })
            }
        });
       
    }

    function validateRule() {
        var icon = "<i class='fa fa-times-circle'></i> ";
        $("#signupForm").validate({
            rules: {
                password: {
                    required: true,
                    minlength: 6
                }
            },
            messages: {
                password: {
                    required: icon + "请输入您的密码",
                    minlength: icon + "密码必须6个字符以上"
                }
            }
        })
    }