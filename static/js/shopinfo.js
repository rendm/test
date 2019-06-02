


var developerid_selected=0;
var query_type=0;//查询类别 0-开发者，1-用户
var shopinfo_shopname='',shopinfo_shopcontacts='',shopinfo_mobile='';


//点击放大镜创建元素调用
function establish(genid,element1,type){
    //alert('传过来的开发者id='+genid);
    developerid_selected=genid;
    query_type=type;

    var $getElement = ' <div class="packaging-shadewe">'+
        '<div>'+
        '<div class="packaging-conceal">'+
        // '<div >'+
        //     '<span></span>'+

        // '</div>'+
        '<div class="row packaging-headback" style="margin-bottom: 10px">'+
        '<div class="col-sm-9"> <input type="text" class="form-control" id="packagin-result2" disabled> </div>'+
        '<div class="col-sm-3"> <button type="button" class="btn btn-primary" id="delelement">确定</button>' +
        '<button type="button" class="btn btn-danger col-sm-offset-1" id="closeelement">关闭</button></div>'+
        '</div>'+
        '<div class="row">'+
        '<div class="col-sm-3"><input placeholder="请输入店铺名称" type="text" class="searchshopname form-control"></div>'+
        '<div class="col-sm-3"><input placeholder="请输入店铺联系人"  type="text" class="searchshopcontacts form-control"></div>'+
        '<div class="col-sm-3"><input placeholder="请输入店铺联系手机"  type="text" class="searchmobile form-control"></div>'+
        '<div class="col-sm-3"> <button type="button" class="btn btn-success" onclick="inquirebtnfn()">查询</button></div>'+
        '</div>'+
        '<table id="packaging-table" data-mobile-responsive="true">'+
        '</table>' +

        '</div>'+
        '</div>'+
        '</div>';

    $(".gray-bg").append($getElement);
    $(".packaging-shadewe").width($('.gray-bg').width());
    $(".packaging-shadewe").height($('.gray-bg').height());
    load();

    $("#packaging-table").on("click-row.bs.table", function (e, row, ele) {
        element1.val(row.shopName);
        $("#packagin-result2").val(row.shopName);
        element1.attr("genid",row.shopId);

        //if(loadRoleByDev!=undefined){
            //loadRoleByDev(row.genid);
        //}
    })

    $getElement='';
    //删除创建元素
    $("#delelement").on('click',function(){
        $("#shopName-error").remove();
        $(".packaging-shadewe").remove();
    })

    //关闭创建元素
    $("#closeelement").on('click',function(){
        element1.val("");
        element1.attr("genid");
        $(".packaging-shadewe").remove();
    })

}
//展示店铺信息
function load(){

    //var url_1=share+'/irobotweb/sys/user/query/developer';
    var url=share+'/irobotweb/sys/shop/query/list';//查询店铺的接口

    //console.info('shopinfo_shopname'); console.info(shopinfo_shopname);
    //console.info('shopinfo_shopcontacts'); console.info(shopinfo_shopcontacts);
    //console.info('shopinfo_mobile'); console.info(shopinfo_mobile);


    $('#packaging-table').bootstrapTable('destroy');
    $('#packaging-table').bootstrapTable( {
        ajaxOptions: {
            xhrFields: {        //跨域
                withCredentials: true
            },
            crossDomain: true,
            jsonp: "callback",
            jsonpCallback: "success_jsonpCallback",
        },
        type : "GET",
        url: url,
        iconSize: 'outline',
        toolbar: '#exampleToolbar',
        striped: true,            //设置为true会有隔行变色效果
        dataType: "jsonp",        //服务器返回的数据类型
        pagination: true,         //设置为true会在底部显示分页条
        singleSelect: false,      //设置为true将禁止多选
        pageSize: 10,             //如果设置了分页，每页数据条数
        pageNumber: 1,            //如果设置了分布，首页页码
        pageList: [10, 25, 50, 100],
        queryParamsType: '',
        sidePagination: "server", // 设置在哪里进行分页，可选值为"client" 或者
        paginationLoop: false,
        paginationPreText:"上一页",
        paginationNextText:"下一页",
        paginationShowPageGo: true,     //显示跳转
        async:false,
        showJumpto: true,
        height: $(window).height()-300,
        queryParams: function (params) {
            //这里的键的名字和控制器的变量名必须一直，这边改动，控制器也需要改成一样的
            var temp = {
                rows: params.pageSize,     //页面大小
                page: params.pageNumber,   //页码
                sortOrder: 'asc',
                shopName: shopinfo_shopname,          //店铺名称
                shopcontacts: shopinfo_shopcontacts,  //店铺联系人
                mobile: shopinfo_mobile,              //联系人手机
            };

            return temp;
        },

        // //请求服务器数据时，你可以通过重写参数的方式添加一些额外的参数，例如 toolbar 中的参数如果
        // queryParamsType = 'limit' ,返回参数必须包含
        // limit, offset, search, sort, order 否则, 需要包含:
        // pageSize, pageNumber, searchText, sortName,
        // sortOrder.
        // 返回false将会终止请求

        columns: [


            {
                field: 'shopName',
                align: 'center',
                title: '店铺名称'
            },
            {
                field: 'shopcontacts',
                align: 'center',
                title: '店铺联系人'
            },
            {
                field: 'mobile',
                align: 'center',
                title: '店铺联系手机'
            }
            ]
    });
}




function inquirebtnfn(){

    shopinfo_shopname=$('.searchshopname').val();
    shopinfo_shopcontacts=$('.searchshopcontacts').val();
    shopinfo_mobile=$('.searchmobile').val();

    load();
}































