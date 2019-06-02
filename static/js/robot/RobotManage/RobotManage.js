
load();

var robot_name='',shop_name='',robot_hardwareno='',developer_name='';

function load() {

    $('#exampleTable').bootstrapTable( {
                ajaxOptions: {
                    xhrFields: {        //跨域
                        withCredentials: true
                    },
                    crossDomain: true,
                    jsonp: "callback",
                    jsonpCallback: "success_jsonpCallback",
                },
                type : "GET",
                url: share+'/irobotweb/sys/robot/query/list', //irobotweb/sys/robot/query/list
                iconSize: 'outline',
                toolbar: '#exampleToolbar',
                striped: true, // 设置为true会有隔行变色效果
                dataType: "jsonp", // 服务器返回的数据类型
                pagination: true, // 设置为true会在底部显示分页条
                singleSelect: false, // 设置为true将禁止多选
                pageSize: 10, // 如果设置了分页，每页数据条数
                pageNumber: 1, // 如果设置了分布，首页页码
                pageList: [10, 25, 50, 100],
                queryParamsType: '',
                sidePagination: "server", // 设置在哪里进行分页，可选值为"client" 或者
                paginationLoop: false,
                paginationPreText:"上一页",
                paginationNextText:"下一页",
                paginationShowPageGo: true, //显示跳转
                showJumpto: true,
                height: $(window).height()-127,
                queryParams: function (params){
                    //这里的键的名字和控制器的变量名必须一直，这边改动，控制器也需要改成一样的
                    var temp = {
                        rows: params.pageSize,     //页面大小 
                        page: params.pageNumber,   //页码
                            //排序列名
                        sortOrder: 'asc',
                        robotName: robot_name,                                 //机器人名称搜索框
                        hardwearNo: $.trim($('#robothardwareno').val()),  //机器人硬件地址
                        shopName: $.trim($('#shopname').val()),                //所属店铺名称
                        developerName: $.trim($('#developername').val()),      //所属开发者
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
                    // {
                    //     checkbox: true
                    // },
                    {
                        align: 'center',
                        title: '序号',// 列标题
                        formatter: function (value, row, index) {
                            var pageSize = $('#exampleTable').bootstrapTable('getOptions').pageSize;     //通过table的#id 得到每页多少条
                            var pageNumber = $('#exampleTable').bootstrapTable('getOptions').pageNumber; //通过table的#id 得到当前第几页
                            return pageSize * (pageNumber - 1) + index + 1;    // 返回每条的序号： 每页条数 *（当前页 - 1 ）+ 序号
                        }
                    },
                    {
                        field: 'id',
                        align: 'center',
                        title: '机器人编号'
                    },
                    {
                        field: 'hardwearNo', 
                        align: 'center',
                        title: '机器人硬件地址'
                    },
                    {
                        field: 'robotName',
                        align: 'center',
                        title: '机器人名称'
                    },
                    {
                        field: 'typeNo',
                        align: 'center',
                        title: '机器人型号'
                    },
                    {
                        field: 'manufactureTime',
                        align: 'center',
                        title: '出厂日期',
                        formatter: function (value, row, index) { //转换成yyyy-mm-dd的格式
                            var date=getNowFormatDate(value,0);
                            //var date=new Date(value);
                            return date;
                        }
                    },
                    {
                        field: 'shopName',
                        align: 'center',
                        title: '所属店铺'
                    },
                    {
                        field: 'developerName',
                        align: 'center',
                        title: '所属开发者'
                    },
                    {
                        field: 'isActive',
                        align: 'center',
                        title: '是否激活',
                        formatter: function (isActive,row,index) {
                            // 
                            if(isActive == 1){
                               return '<span class ="label label-primary">已激活</span>'
                            }else if(isActive == 0){
                                return '<span class ="label label-danger">未激活</span>'
                            }
                        }
                    },
                    {
                        title: '操作',
                        field: 'isActive',
                        align: '',
                        formatter: function (isActive, id, index) {
                            var c = '<a  class="btn btn-primary btn-sm '  + '" href="#" mce_href="#" title="详细" onclick="show(\''
                                + id.id
                                + '\')"><i class="fa fa-search "></i></a> ';
                            var e = '<a  class="btn btn-primary btn-sm '  + '" href="#" mce_href="#" title="编辑" onclick="setting(\''
                                + id.id
                                + '\')">参数设置</a> ';    
                            // var d = '<a class="btn btn-warning btn-sm '  + '" href="#" title="删除"  mce_href="#" onclick="control(\''
                            //     + id.id
                            //     + '\')">运行控制</a> ';
                            var f = '<a class="btn btn-success btn-sm '  + '" href="#" title="激活"  mce_href="#" onclick="activate(\''
                                + id.id
                                + '\')">激活</a> ';
                                //console.log(isActive);
                            if(isActive == "1"){
                                // 激活成功
                                return c + e;
                             }else if(isActive == "0"){
                                 //未激活
                                return  c + e + f ;
                             }else{
                                return c + e;
                             }
                            
                        }
                    }]
            });
}

//将日期格式转换
function getNowFormatDate(t,f) {
    var date = new Date(t);
    var seperator1 = "-";
    var seperator2 = ":";
    var month = date.getMonth() + 1;
    var strDate = date.getDate();
    if (month >= 1 && month <= 9) {
        month = "0" + month;
    }
    if (strDate >= 0 && strDate <= 9) {
        strDate = "0" + strDate;
    }

    var currentdate='';
    if(f==1) //时分秒
    {
        currentdate = date.getFullYear() + seperator1 + month + seperator1 + strDate
            + " " + date.getHours() + seperator2 + date.getMinutes()
            + seperator2 + date.getSeconds();
    }
    else
    {
        currentdate = date.getFullYear() + seperator1 + month + seperator1 + strDate;
    }
    return currentdate;
}

//查询点击
$('#btnreload').on('click',function(){
    robot_name=$.trim($('#robotName').val());
    $('#exampleTable').bootstrapTable('destroy');
    load();
});

//提交-更多的查询条件
$('#btnsum').on('click', function () {
    robot_name=$.trim($('#robotName_more').val());
    $('#exampleTable').bootstrapTable('destroy');
    load();
});

//重置 清空查询框里的条件数据
$('#btnreset').click(function () {
    var input_arr = $('.layui-input');
    $.each(input_arr, function () {
        $(this).val('');
    });
});


//查看详情
function show(id) {
    sessionStorage.setItem('showid', id);
    layer.open({
        type: 2,
        title: '详情',
        maxmin: true,
        shadeClose: false,
        area: ['900px', '700Px'],
        content:'./show.html'  // iframe的url
    });
}
//编辑
function setting(id) {
    sessionStorage.setItem('editid', id);
    layer.open({
        type: 2,
        title: '参数设置',
        maxmin: true,
        shadeClose: false,
        area: ['900px', '700Px'],
        content:'./edit.html'  // iframe的url
    });
}

//运行控制
function control(id) {
    layer.open({
        type: 2,
        title: '运行控制',
        maxmin: true,
        shadeClose: false, // 点击遮罩关闭层
        area: ['800px', '520px'],
        content: './control.html' 
    });
}


 //更多显示  上面框框显示
 $('#btnmore').on('click',function(){
     //console.log("更多显示");
     var top = document.getElementById("userinfo").style.marginTop;
     document.getElementById("userinfo").style.marginTop=0;                                                                                                                                                                                                                                                                                                                                            
    //console.log(top,'top');
    if (top == "0px"){
        document.getElementById("userinfo").style.marginTop=-200+'px';
    }
 });

 //激活页面
function activate(id){
    sessionStorage.setItem('activateid', id);
    layer.open({
        type: 2,
        title: '激活·',
        maxmin: true,
        shadeClose: false, // 点击遮罩关闭层
        area: ['800px', '520px'],
        content: './activation.html'
    });
}

$("#add").on('click',function(){
    layer.open({
        type: 2,
        title: '增加',
        maxmin: true,
        shadeClose: false, // 点击遮罩关闭层
        area: ['900px', '700Px'],
        content: './add.html'
    });
})