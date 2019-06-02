var prefix = "/irobotweb/sys/map";
load()

function load() {
    $('#exampleTable').bootstrapTable({
        ajaxOptions: {
            xhrFields: {        //跨域
                withCredentials: true
            },
            crossDomain: true,
            jsonp: "callback",
            jsonpCallback: "success_jsonpCallback",
        },
        type: "GET",
        url: share + '/irobotweb/sys/map/query/list',
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
        paginationPreText: "上一页",
        paginationNextText: "下一页",
        paginationShowPageGo: true,     //显示跳转
        showJumpto: true,
        height: $(window).height() - 127,
        queryParams: function (params){
            //这里的键的名字和控制器的变量名必须一直，这边改动，控制器也需要改成一样的
            var temp = {
                rows: params.pageSize,     //页面大小
                page: params.pageNumber,   //页码
                sortOrder: 'asc',
                mapName: $.trim($("input[name='mapName']").val()),
                robotName: $.trim($('#robotname').val())

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
                align: 'center',
                title: '序号',// 列标题
                formatter: function (value, row, index) {
                    var pageSize = $('#exampleTable').bootstrapTable('getOptions').pageSize;     //通过table的#id 得到每页多少条
                    var pageNumber = $('#exampleTable').bootstrapTable('getOptions').pageNumber; //通过table的#id 得到当前第几页
                    return pageSize * (pageNumber - 1) + index + 1;    // 返回每条的序号： 每页条数 *（当前页 - 1 ）+ 序号
                }
            },
            {
                field: 'mapName',
                align: 'center',
                title: '地图名称',
                formatter: function (mapName){
                    return mapName
                }
            },
            {
                field: 'resolution',
                align: 'center',
                title: '地图分辨率'
            },
            {
                field: 'height',
                align: 'center',
                title: '地图高'
            },
            {
                field: 'width',
                align: 'center',
                title: '地图宽'
            },
            {
                field: 'showMapResolution',
                align: 'center',
                title: '原始缩略图'
            },
            {
                field: 'showMapname',
                align: 'center',
                title: '展示图'
            },
            {
                field: 'shopname',
                align: 'center',
                title: '所属店铺'
            },
            {
                field: 'developername',
                align: 'center',
                title: '所属开发者'
            },
            {
                field: 'remark',
                align: 'center',
                title: '备注',

            },
            {
                title: '操作',
                field: 'id',
                align: 'center',
                formatter: function (value, row, index){ 
                    var a = '<a  class="btn btn-primary btn-sm ' + '" href="#" mce_href="#" title="绑定机器人" onclick="binding(\''
                        + row.robotId
                        + '\')">绑定机器人</a> ';
                        var b = '<a  class="btn btn-primary btn-sm ' + '" href="#" mce_href="#" title="详细" onclick="show(\''
                        + row.robotId
                        + '\')">详细</a> ';
                        var c = '<a  class="btn btn-primary btn-sm ' + '" href="#" mce_href="#" title="上传展示地图" onclick="uploading(\''
                        + row.robotId
                        + '\')">上传展示地图</a> ';
                        var d = '<a  class="btn btn-primary btn-sm ' + '" href="#" mce_href="#" title="删除" onclick="delete(\''
                        + row.robotId
                        + '\')">刪除</a> ';
                    return a+b+c+d;
                }
            }]
    });
}

//查询点击
$('#btnreload').on('click', function (){
    $('#exampleTable').bootstrapTable('destroy');
    load();
})

//查看详情
function show(id) {
    sessionStorage.setItem('robotId', id);
    layer.open({
        type: 2,
        title: '查看详情',
        maxmin: true,
        shadeClose: false,
        area: ['1400px', '750px'],
        content: './change.html'  // iframe的url
    });
}


//更多显示
$('#btnmore').on('click', function () {
    console.log("更多显示")
    var top = document.getElementById("userinfo").style.marginTop;

    document.getElementById("userinfo").style.marginTop = 0;
    console.log(top, 'top')
    if (top == "0px") {
        console.log(123213)
        document.getElementById("userinfo").style.marginTop = -200 + 'px';
    }
})
$('#btnsum').on('click', function () {
    $('#exampleTable').bootstrapTable('destroy'); 
    load();
})

