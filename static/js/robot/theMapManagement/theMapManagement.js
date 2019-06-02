var prefix = "/irobotweb/sys/user";

load();

var map_name='';

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
                type : "GET",
                url: share+'/irobotweb/sys/map/query/list', //
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
                paginationShowPageGo: true,     //显示跳转
                showJumpto: true,
                height: $(window).height()-127,
                queryParams: function (params){
                    //这里的键的名字和控制器的变量名必须一直，这边改动，控制器也需要改成一样的
                    var temp = {
                        rows: params.pageSize,     //页面大小
                        page: params.pageNumber,   //页码
                            //排序列名
                        sortOrder: 'asc',
                        mapName: map_name,//id搜索框
                        shopname:$.trim($('#shopname').val()),//所属店铺
                        developername:$.trim($('#developername').val()) //所属开发者
                        // // email: $.trim($('#email').val()),//邮箱搜索
                        // // mobile: $.trim($('#mobile').val())//手机号搜索

                        // type:$.trim($('#type').val()),//资源类型搜索   狂不对
                        // userType:$.trim($('#userType').val()),//资源用途搜索   狂不对
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
                        formatter: function (value, row, index){
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
                            return mapName;
                        }
                    },
                    // {
                    //     field: 'resolution',
                    //     align: 'center',
                    //     title: '地图分辨率'
                    // },
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
                        title: '原始缩略图',
                        formatter: function (value,row,index){
                            //document.getElementById('base-img').setAttribute('src', 'data:image/png;base64,' + img);
                            return '<img id="mapfile" src="data:image/png;base64,'+row.mapfile+'" draggable="false" style="width: 40px;height: 30px;cursor: pointer;" onclick="showOrignPic('+row.mapId+')" />';
                        }
                    },
                    {
                        field: 'showMapFile',
                        align: 'center',
                        title: '展示图',
                        formatter: function (value,row,index){
                            return '<img id="showMapFile" src="data:image/png;base64,'+row.showMapFile+'" draggable="false" style="width: 40px;height: 30px;cursor: pointer;" onclick="showOrignPicShow('+row.mapId+')"/>';
                        }
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
                        field: 'mapId',
                        align: 'center',
                        formatter: function (mapId){
                            console.log(mapId)
                            var a = '<a  class="btn btn-primary btn-sm' + '" href="#" mce_href="#" title="同步机器人" onclick="binding(\''
                                + mapId
                                + '\')"><i class="fa fa-android fa-fw "></i></a> ';
                                var b = '<a  class="btn btn-primary btn-sm  ' + '" href="#" mce_href="#" title="详情" onclick="details(\''
                                + mapId
                                + '\')"><i class="fa fa-search fa-fw" aria-hidden="true" ></i></a> ';
                                var c = '<a  class="btn btn-primary btn-sm ' + '" href="#" mce_href="#" title="上传展示地图" onclick="uploading(\''
                                + mapId+ '\')"><i class="fa fa-upload fa-fw "></i></a> ';

                            var d = '<a  class="btn btn-primary btn-sm ' + '" href="#" mce_href="#" title="点位设置" onclick="poiSeting(\''
                                + mapId+ '\')"><i class="fa fa-cog  fa-fw"></i></a> ';

                                var e= '<a  class="btn btn-danger btn-sm' + '" href="#" mce_href="#" title="删除" onclick="empty(\''
                                + mapId+ '\')"><i class="fa fa-trash fa-fw"></i></a> ';

                            return a+b+c+d+e;
                        }
                    }]
            });
}

//查询点击
$('#btnreload').on('click',function(e){
    map_name=$.trim($('#genid').val());

    $('#exampleTable').bootstrapTable('destroy');
    load();
    e.preventDefault()
});

//点击显示原图
function showOrignPic(mapid) {

    //console.info('mapid');console.info(mapid);
    //alert(mapid);

    layer.open({
        type: 2,
        shade: false,
        title: false, //不显示标题
        area:['600px','700px'],
        content:'./showMap.html?mapid='+mapid+'&type=0'
    });
}

//点击展示图显示大图
function showOrignPicShow(mapid) {
    layer.open({
        type: 2,
        shade: false,
        title: false, //不显示标题
        area:['600px','700px'],
        content:'./showMap.html?mapid='+mapid+'&type=1'
    });
}

//同步机器人
function binding(id){
    sessionStorage.setItem('id', id);
    // console.log(id,'idd');
    // console.log('绑定机器人');
    layer.open({
        type: 2,
        title: '同步机器人',
        shadeClose: false,
        area: ['1000px', '750px'],
        content:'./selectiveRobot.html?mapid='+id
    });
}

//详情
function details(id) {
    sessionStorage.setItem('mapid', id);
    layer.open({
        type: 2,
        title: '详情',
        shadeClose: false, // 点击遮罩关闭层
        area: ['1000px', '750px'],
        content: './details.html' 
    });
}

//上传展示地图
function uploading(id){
    //console.log('上传展示地图');
    sessionStorage.setItem('mapid', id);
    layer.open({
        type: 2,
        title: '上传展示地图',
        shadeClose: false, // 点击遮罩关闭层
        area: ['1000px', '750px'],
        content: './uploadeDisplayMap.html' 
    });
}

//点位设置
function poiSeting(id) {

    //alert(id);
    sessionStorage.setItem('mapid', id);
    layer.open({
        type: 2,
        title: '点位设置',
        shadeClose: false,
        area: ['1000px', '750px'],
        content: './pointSet.html?mapid='+id
    });
}

//删除地图
function empty(id){

    //alert(id);

    var obj={};
    obj.mapid=id;
    obj.mapname='';
    obj.message='';
    obj.robothadware='';
    obj.robotid='';

    var jsonStr=JSON.stringify(obj);
    //console.info('jsonStr');console.info(jsonStr);

    layer.confirm('确定要删除选中的记录？', {
        btn: ['确定', '取消']
    }, function () {
        $.ajax({
            url: share+"/irobotweb/sys/map/deletemap",
            data :jsonStr,
            type: "DELETE",
            dataType:"json",
            contentType: "application/json; charset=utf-8",
            crossDomain: true,
            xhrFields: {
                withCredentials: true
            },
            success: function (r) {
                if (r.code == 0 || r.code == 200) {
                    //layer.msg(r.msg);
                    //window.location.reload();
                    layer.msg('删除成功');
                    $('#exampleTable').bootstrapTable('destroy');
                    load();
                } else {
                    layer.msg(r.msg);
                }
            }
        });
    })
}
