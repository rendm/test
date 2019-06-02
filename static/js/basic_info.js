
var basic_roleId='';



//角色渲染
$.ajax({
    url: share+'/irobotweb/sys/role/getRoles',
    type: "get",
    dataType: "json",
    cache: false,
    crossDomain: true,
    xhrFields: {
        withCredentials: true
    },
    success: function (json) {
        var optionsd='';
        for(var i =0;i<json.length;i++){
            optionsd+='<option text='+json[i].roleId+'  value = '+json[i].roleId+'>'+json[i].roleName+'</option>'
        }
        $('#role').append(optionsd);
    }

});


$(function () {


    $.ajax({
        url: share + 'irobotweb/sys/user/query/userDO',
        crossDomain: true,
        type: "get",
        dataType: "json",
        xhrFields: {
            withCredentials: true
        },
        success: function (data) {
            if((data.data.isenterpriseauth!=null || data.data.isperosnalauth!=null) && data.data.roleId!=1){
                $("#name").val(data.data.name);
            }
            else if(data.data.roleId==1){
                $("#name").val(data.data.name);
            }
            else{
                $("#name").val('');
            }
            $("#role").val(data.data.roleName);//角色信息
            basic_roleId=data.data.roleId;
            $("#username").val(data.data.genid);
            $("#phone").val(data.data.mobile);
            $("#email").val(data.data.email);
            $("#department").val(data.data.deptName);
            $("#job").val(data.data.job);
            $("#userId").val(data.data.userId);
            $("#companyname").val(data.data.companyName);
            //省市区   初始化
            $('#uploadImg').attr('src', data.data.headimg);
            var province =data.data.provinceName;

            if (province!=null && province.length>0 )
            {
                $("#datogg").distpicker('destroy');
                $('#datogg').distpicker({          //再初始化
                    province: data.data.provinceName,
                    city: data.data.cityName,
                    district: data.data.areaName
                });
            }

            else {
                $("#datogg").distpicker('destroy');
                $('#datogg').distpicker({
                    autoSelect: false
                });


            }

            // $('#datogg').distpicker("destroy"); //先删除
            // $('#datogg').distpicker({         //再初始化
            //     province: data.data.province,
            //     city: data.data.city,
            //     district: data.data.district
            // });
            // var province_empty=data.data.province == '' || data.data.province==null;
            // var city_empty=data.data.city == '' || data.data.city==null;
            // var district_empty=data.data.district == '' || data.data.district==null;
            //
            // if (province_empty && city_empty && district_empty) {
            //     $('#province option:first').attr('selected', 'selected');
            //     $('#city option:first').attr('selected', 'selected');
            //     $('#district option:first').attr('selected', 'selected');
            //     //$('#datogg').distpicker();
            // }
			
            $("#address").val(data.data.liveAddress);
        },
        error: function (request) {
            layer.alert("Connection error");
        },
    });

    $.fn.serializeObject = function () {
        var o = {};
        var a = this.serializeArray();
        $.each(a, function () {
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
    //保存按钮  (修改用户接口)
    $('#btnsu').on('click', function (e) {
        var update_obj=$('#basicInfoForm').serializeObject();
        update_obj.roleId=basic_roleId;
        var jsonStr = JSON.stringify(update_obj); //json字符串
        $.ajax({
            url: share + '/irobotweb/sys/user/update',
            crossDomain: true,
            type: "POST",
            xhrFields: {
                withCredentials: true
            },
            dataType: "json",
            contentType: "application/json; charset=utf-8",
            data: jsonStr,
            success: function (data) {
                //console.log(data,'这里是提交按钮')
                if (data.code == 0) {
                    parent.layer.msg(data.msg);
                    window.location.reload();
                } else {
                    parent.layer.alert(data.msg);
                }
            },
            error: function (request) {
                layer.alert("Connection error");
            },
        });
        e.preventDefault();
    })

    //链接至图片裁剪页面
    $('#test-upload-normal').on('click', function (){
        parent.layer.open({
            type: 2,
            title: '修改头像',
            fixed: false, //不固定
            shadeClose: true,
            area: ['1000px', '750px'],
            content: './account/image.html',
            end: function () {
                //location.reload();
                //刷新页面
                $.ajax({
                    url: share + 'irobotweb/sys/user/query/userDO',
                    crossDomain: true,
                    type: "get",
                    dataType: "json",
                    xhrFields: {
                        withCredentials: true
                    },
                    success: function (data) {
                        //实时更新显示的图片
                        $('#uploadImg').attr('src', data.data.headimg);
                        $(window.parent.document).find('#uploadImg').attr('src', data.data.headimg);
                    },
                    error: function (request) {
                        layer.alert("Connection error");
                    },
                });
            }
        });
    })

})

