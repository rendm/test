

var developerid_selected=0;
var query_type=0;//查询类别 0-开发者，1-用户


//点击放大镜创建元素调用
function establish(genid,element1,type){

    //alert('传过来的开发者id='+genid);
    developerid_selected=genid;
    query_type=type;

    var $getElement = ' <div class="packaging-shadewe">'+
                            '<div>'+
                                '<div class="packaging-conceal">'+

                                    // '<div class="form-group">'+
                                    //     '<input type="text" class="packagin-result2 form-control" disabled>'+
                                    //     '<span class="iconfont icon-ziyuanldpi delelement" ></span>'+
                                    // '</div>'+
                                    '<div class="row " style="margin-bottom: 10px">'+
                                    '<div class="col-sm-9"> <input type="text" class="form-control" id="packagin-result2" disabled> </div>'+
                                    '<div class="col-sm-3"> <button type="button" class="btn btn-primary" id="delelement">确定</button>' +
                                    '<button type="button" class="btn btn-danger col-sm-offset-1" id="closeelement">关闭</button></div>'+
                                    '</div>'+
                                    '<div class="row">'+
                                    '<div class="col-sm-3"><input placeholder="请输入姓名" type="text" class="searchname form-control "> </div>'+
                                    '<div class="col-sm-3"><input placeholder="请输入手机号"  type="text" class="searchphone form-control "></div>'+
                                    '<div class="col-sm-3"><input placeholder="请输入邮箱"  type="text" class="searchemail form-control "></div>'+
                                        '<div class="col-sm-3"> <button type="button" class="btn btn-success" onclick="inquirebtnfn()">查询</button></div>'+
                                    '</div>'+
                                    '<div class="row "> <div style="padding-top: 15px;padding-left: 15px"> <table id="packaging-table" data-mobile-responsive="true">'+
                                    '</table></div></div>' +
                                '</div>'+
                            '</div>'+
                            
                        '</div>';

    $(".gray-bg").append($getElement);
    $(".packaging-shadewe").width($('.gray-bg').width());
    $(".packaging-shadewe").height($('.gray-bg').height());
    load();
    
    $("#packaging-table").on("click-row.bs.table", function (e, row, ele) {
        element1.val(row.name);

        $("#packagin-result2").val(row.name);
        element1.attr("genid",row.genid);

        // if(loadRoleByDev!=undefined){
        //         //     loadRoleByDev(row.genid);
        //         // }
    })
    $getElement='';
    //删除创建元素
    $("#delelement").on('click',function(){

        element1.change();
        $(".packaging-shadewe").remove();
    })


    //关闭创建元素
    $("#closeelement").on('click',function(){
        element1.val("");
        element1.attr("genid","");
        $(".packaging-shadewe").remove();
    })
}
//表格
function load(){

   //alert(query_type);
    var url=share+'/irobotweb/sys/user/query/developer';
    if(query_type==1){
        url=share+'/irobotweb/sys/user/query/shop?developerid='+developerid_selected;
    }

    $('#packaging-table').bootstrapTable({
        striped: true,
        url: url,
        columns: [
            {
                field: 'name',
                align: 'center',
                title: '姓名'
            },
            {
                field: 'mobile',
                align: 'center',
                title: '手机号'
            },
            {
                field: 'email',
                align: 'center',
                title: '邮箱'
            }
        ]
    });
}


//查询按钮-获取开发者和用户
function inquirebtnfn(genid){

    //alert('传过来的开发者id='+developerid_selected);
    var url=share+'/irobotweb/sys/user/query/developer';
    if(query_type==1){
        url=share+'/irobotweb/sys/user/query/shop?developerid='+developerid_selected;
    }

    $.ajax({
        url: url,
        crossDomain: true,
        type: "get",
        dataType: "json",
        xhrFields: {
            withCredentials: true
        },
        data:{
            "name":$(".searchname").val(),
            "email":$(".searchemail").val(),
            "mobile":$(".searchphone").val(),
            "genid":genid
        },
        success: function (data){ 
            console.log(data)
            // $('#packaging-table').bootstrapTable('destroy');
            $('#packaging-table').bootstrapTable('load',data.data)
        },
        error: function (request){
            layer.alert("Connection error");
        },
    });
}

