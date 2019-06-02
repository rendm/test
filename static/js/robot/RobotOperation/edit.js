
var poiId,poiName,poiType,poiX,poiY,mapId,poiYaw;

$().ready(function() {
    poiX = window.parent.document.getElementById("right-hand").getAttribute("poiX");
    poiY = window.parent.document.getElementById("right-hand").getAttribute("poiY");
    poiYaw = window.parent.document.getElementById("right-hand").getAttribute("poiYaw");
    poiName = window.parent.document.getElementById("right-hand").getAttribute("poiName");
    poiType =  window.parent.document.getElementById("right-hand").getAttribute('poiType');
    // console.log(window.parent.document.getElementById("right-hand").getAttribute("poiName"),'获取属性')

    // sessionStorage.setItem('poiId',$("#left-hand").attr('pointId'));
    // sessionStorage.setItem('poiName',$("#left-hand").attr('poiName'));
    // sessionStorage.setItem('poiType',$("#left-hand").attr('poiType'));
    // sessionStorage.setItem('poiX',$("#left-hand").attr('poiX'));
    // sessionStorage.setItem('poiY',$("#left-hand").attr('poiY'));
    // sessionStorage.setItem('poiYaw',$("#left-hand").attr('poiYaw'));
    // sessionStorage.setItem('mapId',$("#left-hand").attr('mapId'));


    // poiId =  sessionStorage.getItem('poiId');
    // poiName =  sessionStorage.getItem('poiName');
    // poiType =  sessionStorage.getItem('poiType');
    // poiX =  sessionStorage.getItem('poiX');
    // poiY =  sessionStorage.getItem('poiY');
    // mapId =  sessionStorage.getItem('mapId');
    // poiYaw =  sessionStorage.getItem('poiYaw');

    validateRule();

    $('#x').val(poiX);
    $('#y').val(poiY);
    $('#yaw').val(poiYaw);
    $('#poiname').val(poiName);
    $("#poitype").val(poiType);

});

$.validator.setDefaults({
    submitHandler : function() {
        save();
    }
});

$('#ok').click(function () {
    save();
});

function save() {

    //var add_info=$("#signupForm").serializeObject();
    //var mapid =  sessionStorage.getItem('mapid');

    if(!$('#signupForm').valid()){
        return;
    }


    var jsonStr = {
        'mapId':mapId,
        'poiType':$("#poitype").val(),
        'poiName':$("#poiname").val(),
        'id':poiId,
        'x':$("#x").val(),
        'y':$("#y").val(),
        'yaw':$("#yaw").val()
    };

    console.info('JSON.stringify(jsonStr)');console.info(JSON.stringify(jsonStr));

    $.ajax({
        type : "post",
        url : share+"/irobotweb/sys/mappoi/update",
        data :JSON.stringify(jsonStr),
        crossDomain: true,
        async:false,
        dataType:"json",
        contentType:"application/json; charset=utf-8",
        xhrFields: {
            withCredentials: true
        },
        error : function(request) {
            parent.layer.alert("Connection error");
        },
        success : function(data) {
            if (data.code == 200) {

                parent.layer.alert("修改成功",function () {
                    window.parent.location.reload();
                    var index = parent.layer.getFrameIndex(window.name);
                    parent.layer.close(index);
                });
            }
        }
    });
}

//验证
function validateRule() {
    var icon = "<i class='fa fa-times-circle'></i> ";
    $("#signupForm").validate({
        rules : {
            poiname:
                {
                    required : true,
                    rangelength:[1,50]
                },

            /*x : {
                required : true,
                number:true
            },
            y : {
                required : true,
                number:true
            },
            yaw : {
                number:true
            }*/
        },
        messages : {
            poiname : {
                required : icon + "请输入点位名称",
                rangelength:icon + "字符长度介于【0,50】"
            },

            /*x : {
                required : icon + "请输入x坐标",
                number:icon + "必须是数字"
            },
            y : {
                required : icon + "请输入y坐标",
                number:icon + "必须是数字"
            },
            yaw : {
                required : icon + "请输入角度",
                number:icon + "必须是数字"
            }*/
        }
    })
}


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




$("#manualqw").on('click',function(e){
    //设位当前点

    var x =  sessionStorage.getItem('x');// abs x+2/r
    var y = sessionStorage.getItem('y');// abs y-2/r
    $("#x").val(x);
    $("#y").val(y);
    $("#yaw").val("0.0");

    return false
})

$("#acquireqw").on('click',function(e){
    //机器人当前点位置
    var xd =  sessionStorage.getItem('xd');
    var yd = sessionStorage.getItem('yd');
    $("#x").val(xd);
    $("#y").val(yd);
    $("#yaw").val("0.0");

    return false
})

//取消按钮
$('#cancelbtn').click(function () {
    //window.parent.location.href = "./theMapManagement.html";
    var index = parent.layer.getFrameIndex(window.name); // 获取窗口索引
    parent.layer.close(index);
});