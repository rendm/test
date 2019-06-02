

$().ready(function() {
    var mapid =  sessionStorage.getItem('mapid');
    var mapset=getQueryString('mapset');

    if(mapset==1){
       $('#acquireqw').hide();
    }

    validateRule();
});

$.validator.setDefaults({
    submitHandler : function() {
        save();
    }
});

function save() {

    var add_info=$("#signupForm").serializeObject();
    var mapid =  sessionStorage.getItem('mapid');


    var jsonStr = {
        'mapId':mapid,
		 'poiType':$("#poitype").val(),
		 'poiName':$("#poiname").val(),
         'x':$("#x").val(),
         'y':$("#y").val(),
         'yaw':$("#yaw").val()

	}



    $.ajax({
        type : "post",
        url : share+"/irobotweb/sys/mappoi/add",
        data :JSON.stringify(jsonStr),// 你的formid
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
            //console.log(data,'增加之后返回的字段')
            if (data.code == 200) {
                //layer.alert("添加成功！");
                //window.parent.location.href = "./control.html";

                parent.layer.alert("添加成功",function () {
                    window.parent.location.reload();
                    var index = parent.layer.getFrameIndex(window.name);
                    parent.layer.close(index);
                });
            }

        }
    });
}

function validateRule() {
    var icon = "<i class='fa fa-times-circle'></i> ";
    $("#signupForm").validate({
        rules : {
        	poiname:
				{
                    required : true,
                    rangelength:[1,50]
				},

            x : {
                required : true,
                number:true
            },
            y : {
                required : true,
                number:true
            },
            yaw : {
                number:true
            }
        },
        messages : {
            poiname : {
                required : icon + "请输入点位名称",
                rangelength:icon + "字符长度介于【0,50】"
            },
            x : {
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
            }
        }
    })
}

//根据名称获取地址栏里的参数
function getQueryString(name) {
    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
    var r = window.location.search.substr(1).match(reg);
    if (r != null) return unescape(r[2]);
    return null;
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
var parentsidx = window.parent.document.getElementById("messagex").innerHTML,
parentsidy = window.parent.document.getElementById("messagey").innerHTML;
$("#x").val(parentsidx);
$("#y").val(parentsidy);
$("#yaw").val("0.0");

// $("#manualqw").on('click',function(e){
//     $("#x").val(parentsidx);
//     $("#y").val(parentsidy);
//     $("#yaw").val("0.0");
// 	return false
// })

$("#acquireqw").on('click',function(e){
	//机器人当前点位置
    var currentx = window.parent.document.getElementById("X").innerHTML,
    currenty = window.parent.document.getElementById("Y").innerHTML,
    currentyaw = window.parent.document.getElementById("Yaw").innerHTML
	$("#x").val(currentx);
	$("#y").val(currenty);
	$("#yaw").val(currentyaw);
	return false
})
$("#countermandbtn").on('click',function(){
    //关闭ifram弹层
    var index = parent.layer.getFrameIndex(window.name); //先得到当前iframe层的索引
    parent.layer.close(index); //再执行关闭
})