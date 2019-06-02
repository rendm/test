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
        queryParams: function (params) {
            //这里的键的名字和控制器的变量名必须一直，这边改动，控制器也需要改成一样的
            var temp = {
                rows: params.pageSize,     //页面大小
                page: params.pageNumber,   //页码
                sortOrder: 'asc',
                mapName: $.trim($('#name').val())

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
                field: 'mapId',
                align: 'center',
                title: '地图唯一ID'
            },
            {
                field: 'mapName',
                align: 'center',
                title: '地图名称'
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
                field: 'mapfile',
                align: 'center',
                title: '原始图',
                formatter: function (value, row, mapId){
                    return '<img src="data:image/png;base64,' + value + '" class="images" border="5px" style="height: 40px; width: 50px" onclick=showImage(this) />';
                }
            },
            {
                field: 'showMapFile',
                align: 'center',
                title: '展示图',
                formatter: function (value, row, mapId) {
                    return '<img src="data:image/png;base64,' + value + '" class="images" border="5px" style="height: 40px; width: 50px" onclick=showImage(this)  />';
                }
            },
            {
                field: 'isUse',
                align: 'center',
                title: '是否当前地图',
                formatter: function (value, row, index) {
                    if (value == '0') {
                        return '<span class="label label-danger">否</span>';
                    } else if (value == '1') {
                        return '<span class="label label-primary">是</span>';
                    }
                }
            },
            {
                field: 'remark',
                align: 'center',
                title: '备注'
            },
            {
                title: '操作',
                field: 'id',
                align: 'center',
                formatter: function (value, row, index) {
                    var c = '<a  class="btn btn-primary btn-sm ' + '" href="#" mce_href="#" title="上传" onclick="show(\''
                        + row.mapid
                        + '\')"><i class="fa fa-search "></i></a> ';
                    var d = '<a  class="btn btn-primary btn-sm ' + '" href="#" mce_href="#" title="删除" onclick="remove(\''
                        + row.mapid
                        + '\')"><i class="fa fa-edit "></i></a> ';
                    var e = '<a class="btn btn-warning btn-sm ' + '" href="#" title="使用本地图"  mce_href="#" onclick="setcurrentmap(\''
                        + row.mapid
                        + '\')"><i class="fa fa-user"></i></a> ';
                    return c + d + e;
                }
            }]
    });
}

//查询点击
$('#btnreload').on('click', function () {
    $('#exampleTable').bootstrapTable('destroy');
    load();
})

//上传
function show(id) {
    sessionStorage.setItem('mapid', id);
    layer.open({
        type: 2,
        title: '上传',
        maxmin: true,
        shadeClose: false,
        area: ['1000px', '600px'],
        content: './add.html'  // iframe的url
    });
}

function equipment(id) {

    layer.open({
        type: 2,
        title: '绑定状态',
        maxmin: true,
        shadeClose: false,
        area: ['1400px', '750px'],
        content: './equipment.html'  // iframe的url
    });
}

$('#btnsum').on('click', function () {
    $('#exampleTable').bootstrapTable('destroy');
    load();
})

//点击放大图片  还没写i
function showImage(a) {
    // var path = $(a).attr("name");
    // console.log(path,'1232133')

    //var src = a.attr('src')
    console.log(a.getAttribute('src'), '这是id')

    sessionStorage.setItem('imgsrc', a.getAttribute('src'));
    parent.layer.open({
        type: 2,
        title: '修改头像',
        fixed: false, //不固定
        shadeClose: true,
        area: ['800px', '600px'],
        //content: "/irobotweb/account/quer/checkimage?pathkey=" + path
        content: './img.html'
    });
}

//删除
function remove(id) {
    var objdata = {"mapid": id};
    layer.confirm('确定要删除选中的记录？', {
        btn: ['确定', '取消']
    }, function () {
        $.ajax({
            url: share + "/irobotweb/sys/map/deletemap",
            type: "POST",
            data: JSON.stringify(objdata),
            async: false,
            processData: false,
            contentType: 'application/json; charset=utf-8',
            crossDomain: true,
            crossDomain: true,
            xhrFields: {
                withCredentials: true
            },
            success: function (r) {
                if (r.code == 0) {
                    layer.msg(r.msg);
                    window.location.reload()
                } else {
                    layer.msg(r.msg);
                }
            }
        });
    })
}

//设置当前地图
function setcurrentmap(id) {
    var objdata = {"mapid": id};
    $.ajax({
        url: share + "/irobotweb/sys/map/setcurrentmap",
        type: "POST",
        data: JSON.stringify(objdata),
        async: false,
        processData: false,
        contentType: 'application/json; charset=utf-8',
        crossDomain: true,
        crossDomain: true,
        xhrFields: {
            withCredentials: true
        },
        success: function (r) {
            if (r.code == 0) {
                layer.msg(r.msg);
                window.location.reload()
            } else {
                layer.msg(r.msg);
            }
        }
    });
}
