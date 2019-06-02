$().ready( function() {

    var user=$.user();

    // alert(user.position);
    // alert(user.isperosnalauth);
    // alert(user.isenterpriseauth);

    //企业认证的信息根据  开发者实名认证后显示
    if((user.position=="developer"||user.position=="subdeveloper" ) && (user.isperosnalauth=='Y' || user.isenterpriseauth=='Y')){
        $('#authForm').show();
        load();
    }
    else{
        //layer.msg('未通过实名认证，暂无权限!');
        //layer.alert('未通过实名认证，暂无权限!');
        layer.open({
            title:'提示',
            //type:1,
            offset:['30%','35%'],
            content:'未通过实名认证，暂无权限!',
            end:function () {
                var a_arr=$(window.parent.document).find('.J_menuTabs .page-tabs-content').find('a');
                for(var i=0;i<a_arr.length;i++){
                    if($.trim(a_arr[i].innerText)=='企业信息'){
                        a_arr[i].remove();
                    }
                }
            }
        });

        $('#authForm').hide();
        //$('#authForm').show();//测试用
        return false;
    }

    hiddenimg1();
    hiddenimg2();
    hiddenimg3();


    var role_selected=$('input[type=radio][name=companyUserrole]:checked').val();
    showImg(role_selected);

  //用户角色选择后触发 选“法定代表人”和“被授权人”
    $('input[type=radio][name=companyUserrole]').change(function() {
        showImg(this.value);
    });


    //重置功能
    $(".btn-cancel").on('click',function(){
        //alert(555);

        //企业营业执照
        $("#prompt31").css("display", "block");
        document.getElementById('img31').src = '../../static/img/business_license.png';
        $("#img31").css("display", "none");

        //法人身份证正面
        $("#prompt32").css("display", "block");
        document.getElementById('img32').src ='../../static/img/idcard_0.png';
        $("#img32").css("display", "none");

        //法人身份证背面
        $("#prompt33").css("display", "block");
        document.getElementById('img33').src ='../../static/img/idcard_1.png';
        $("#img33").css("display", "none");

        companyFormData = new FormData();
    })


});


//加载数据
function load() {
    $.ajax({
        url: share+'/irobotweb/account/enterpriseauth/getEnterpriseAuthDO',
        type: "get",
        dataType: "json",
        cache: false,
        crossDomain: true,
        xhrFields: {
            withCredentials: true
        },
        data: {
        },

        success: function (json) {
            var enterpriseAuthDO = json;

            //console.info('enterpriseAuthDO.isCheck:' + enterpriseAuthDO);

            if (enterpriseAuthDO != null) {

                //console.info('enterpriseAuthDO.isCheck:' + enterpriseAuthDO.isCheck);
                //console.info('enterpriseAuthDO.isPass:' + enterpriseAuthDO.isPass);

                if (enterpriseAuthDO.isCheck == "Y" && enterpriseAuthDO.isPass == "N") {

                    $("#textmsg").html("您提交的证件未通过审核，请联系管理员查看原因，或重新上传。");

                } else {

                    $("#companyName").attr("value", enterpriseAuthDO.companyName);
                    $("#companyCard").attr("value", enterpriseAuthDO.companyCard);
                    var companyUserrolevalue = enterpriseAuthDO.companyUserrole;

                    if (companyUserrolevalue == "法定代表人") {
                        $("input[name='companyUserrole'][value='法定代表人']").attr("checked", true);
                    }

                    if (companyUserrolevalue == "被授权人") {
                        $("input[name='companyUserrole'][value='被授权人']").attr("checked", true);
                    }

                    $(":input").attr("disabled", "disabled");
                    $(":input").addClass("mydisabled");
                    $("#uploadimage").css("display", "none");
                    $("#buttons").css("display", "none");

                    if(enterpriseAuthDO.isCheck=="N")
                    {
                        $("#textmsg").html("您已提交了企业验证信息，我们将在1~2个工作日内对您的身份进行审核，请耐心等待。");
                    }
                    else{

                        if(enterpriseAuthDO.isPass=="Y")
                        {
                            $("#textmsg").html("您已通过企业实名认证。");
                            $("#textmsg").css("color","green");
                        }
                    }
                }
            }
        }
    });
}

//根据选择的角色控制图片框显示
function showImg(role_selected) {
    if(role_selected=='法定代表人'){
        //只显示企业营业执照的图片
        $('.d_business_license').show();
        $('.d_legal_person').hide();
    }
    else{
        $('.d_business_license').show();
        $('.d_legal_person').show();
    }
}

var companyFormData = new FormData();//身份证FormData
    $(document).ready(function () {
        $("#auth").on('click', function () {
            // $("#signupForm").submit();
        });
        validateRule();
    });

    $.validator.setDefaults({
        submitHandler: function () {
            auth();
        }
    });

    $.fn.serializeObject = function()
    {
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

    function auth() {

        var jsonStr = JSON.stringify($("#authForm").serializeObject());
        var formData = new FormData();
        var  files= $("input[name='files']");

        $("input[name='files']").each(function(j,item){
            // 你要实现的业务逻辑
            //formData.append('files',item.files[0]);
        });

        formData.append('enterpriseAuthDO',new Blob([jsonStr],
            {
            type: "application/json"
        }
        ));

        companyFormData.append("companyName", $("#companyName").val());    //企业名称
        companyFormData.append("companyCard", $("#companyCard").val());    //企业证件号
        companyFormData.append("companyUserrole", $("input[name='companyUserrole']:checked").val()); //用户角色
        
        $.ajax({
            url: share + "irobotweb/account/enterpriseauth/uploadenterpriseauth",

            crossDomain: true,
            type:'POST',
            dataType:'JSON',
            //contentType: "multipart/form-data",
            contentType: false,
            processData: false,
            async: false,

            data: companyFormData,
            xhrFields: {
                withCredentials: true
            },
            xhrFields: {
                withCredentials: true
            },
            success: function (data) {
                    console.log(data)
                if (data) { if(data.code==200)
                    {
                        layer.alert("<em style='color:red'>" + "提交审核成功！", {icon: 1}, function () {
                            window.location.reload(); //刷新页面
                        })
                    }else
                    {
                        layer.alert(data.msg);
                    }
                }
            }
        });
    }

    function validateRule() {
        var icon = "<i class='fa fa-times-circle'></i> ";
        $("#authForm").validate({
            rules: {
                companyName: {
                    required: true,
                },
                companyCard: {
                    required: true,
                    CheckSocialCreditCode:true

                },
                companyUserrole: {
                    required: true,
                }

            },
            messages: {
                companyName: {
                    required: icon + "请输入企业名称姓名",

                },
                companyCard: {
                    required: icon + "请输入统一社会信用代码",
                    CheckSocialCreditCode:icon+"统一社会信用代码不正确"

                },
                companyUserrole: {
                    required: icon + "请选择角色",
                }
            }
        })
    }

    //企业营业执照-选择图片后触发
    function changepic() {
        $("#prompt31").css("display", "none");
        var reads = new FileReader();
        f = document.getElementById('file').files[0];        
        companyFormData.append('files', f);//追加至FormData
        reads.readAsDataURL(f);
        reads.onload = function (e) {
            document.getElementById('img31').src = this.result;
            $("#img31").css("display", "block");
        };
    }

    //法人身份证正面-选择图片后触发
    function changepic2() {

        $("#prompt32").css("display", "none");
        var reads = new FileReader();
        f = document.getElementById('file2').files[0];
        companyFormData.append('files', f);//追加至FormData
        reads.readAsDataURL(f);
        reads.onload = function (e) {
            document.getElementById('img32').src = this.result;
            $("#img32").css("display", "block");
        };
    }

    //法人身份证背面-选择图片后触发
    function changepic3() {

        $("#prompt33").css("display", "none");
        var reads = new FileReader();
        f = document.getElementById('file3').files[0];
        companyFormData.append('files', f);//追加至FormData
        reads.readAsDataURL(f);
        reads.onload = function (e) {
            document.getElementById('img33').src = this.result;
            $("#img33").css("display", "block");
        };
    }

    function showImg1(argument) {
        $("#img31").css("display", "none");
        $("#prompt31").css("display", "block");
    }

    function showImg2(argument) {
        $("#img32").css("display", "none");
        $("#prompt32").css("display", "block");
    }

    function showImg3(argument) {
        $("#img33").css("display", "none");
        $("#prompt33").css("display", "block");
    }

    function hiddenimg1(){
        var src=$("#img31").attr("src");

        if(src!="#")
        {
            $("#img31").css("display", "block");
            $("#prompt31").css("display", "none");
        }
    }

    function hiddenimg2(){
        var src=$("#img32").attr("src");
        if(src!="#")
        {
            $("#img32").css("display", "block");
            $("#prompt32").css("display", "none");
        }
    }

    function hiddenimg3(){

        var src=$("#img33").attr("src");
        if(src !="#")
        {
            $("#img33").css("display", "block");
            $("#prompt33").css("display", "none");
        }

    }

    jQuery.validator.addMethod("CheckSocialCreditCode", function (value, element) {

        var Code =  $("#companyCard").val();

         var patrn = /^[0-9A-Z]+$/;
        //18位校验及大写校验
        if ((Code.length != 18) || (patrn.test(Code) == false)) {
            return false;
        } else {
            var Ancode;//统一社会信用代码的每一个值
            var Ancodevalue;//统一社会信用代码每一个值的权重
            var total = 0;
            var weightedfactors = [1, 3, 9, 27, 19, 26, 16, 17, 20, 29, 25, 13, 8, 24, 10, 30, 28];//加权因子
            var str = '0123456789ABCDEFGHJKLMNPQRTUWXY';
            //不用I、O、S、V、Z
            for (var i = 0; i < Code.length - 1; i++) {
                Ancode = Code.substring(i, i + 1);
                Ancodevalue = str.indexOf(Ancode);
                total = total + Ancodevalue * weightedfactors[i];
                //权重与加权因子相乘之和
            }
            var logiccheckcode = 31 - total % 31;
            if (logiccheckcode == 31) {
                logiccheckcode = 0;
            }
            var Str = "0,1,2,3,4,5,6,7,8,9,A,B,C,D,E,F,G,H,J,K,L,M,N,P,Q,R,T,U,W,X,Y";
            var Array_Str = Str.split(',');
            logiccheckcode = Array_Str[logiccheckcode];
            var checkcode = Code.substring(17, 18);
            if (logiccheckcode != checkcode) {
                return false;
            }
            return true;
        }



    }, "社会统一信用代码不正确");

    function CheckSocialCreditCode(Code) {
        var patrn = /^[0-9A-Z]+$/;
        //18位校验及大写校验
        if ((Code.length != 18) || (patrn.test(Code) == false)) {
            return false;
        } else {
            var Ancode;//统一社会信用代码的每一个值
            var Ancodevalue;//统一社会信用代码每一个值的权重
            var total = 0;
            var weightedfactors = [1, 3, 9, 27, 19, 26, 16, 17, 20, 29, 25, 13, 8, 24, 10, 30, 28];//加权因子
            var str = '0123456789ABCDEFGHJKLMNPQRTUWXY';
            //不用I、O、S、V、Z
            for (var i = 0; i < Code.length - 1; i++) {
                Ancode = Code.substring(i, i + 1);
                Ancodevalue = str.indexOf(Ancode);
                total = total + Ancodevalue * weightedfactors[i];
                //权重与加权因子相乘之和
            }
            var logiccheckcode = 31 - total % 31;
            if (logiccheckcode == 31) {
                logiccheckcode = 0;
            }
            var Str = "0,1,2,3,4,5,6,7,8,9,A,B,C,D,E,F,G,H,J,K,L,M,N,P,Q,R,T,U,W,X,Y";
            var Array_Str = Str.split(',');
            logiccheckcode = Array_Str[logiccheckcode];
            var checkcode = Code.substring(17, 18);
            if (logiccheckcode != checkcode) {
                return false;
            }
            return true;
        }
    }





