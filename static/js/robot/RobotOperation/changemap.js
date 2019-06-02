var robotid = sessionStorage.getItem('changeid');
load();
var robothadwared =sessionStorage.getItem('robothadware'); ;//机器人硬件地址
var map_name='';
var mapNames;
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
                            mapNames = mapName;
                            return mapName
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
                        title: '地图高(px)'
                    },
                    {
                        field: 'width',
                        align: 'center',
                        title: '地图宽(px)'
                    },
                    {
                        field: 'mapfile',
                        align: 'center',
                        title: '原始缩略图',
                        formatter: function (mapfile){
                            //robothadware
                            //document.getElementById('base-img').setAttribute('src', 'data:image/png;base64,' + img);
                            return '<img id="mapfile" src="data:image/png;base64,'+mapfile+'" style="width: 40px;height: 30px;"/>';
                        }
                    },
                   
                    {
                        field: 'showMapFile',
                        align: 'center',
                        title: '展示图',
                        formatter: function (showMapFile){
                            return '<img id="showMapFile" src="data:image/png;base64,'+showMapFile+'" style="width: 40px;height: 30px;"/>';
                        }
                    },
                    {
                        field: 'isUse',
                        align: 'center',
                        title: '是否可用当前地图',
                        formatter: function (whether){

                            // 0 不用  1 可用
                           // if(whether ==0){
                           //     return '<a  class="btn btn-primary btn-sm " href="#" mce_href="#">否</a> '
                           // }else if(whether ==1){
                           //  return '<a  class="btn btn-primary btn-sm " href="#" mce_href="#">是</a> '
                           // }


                            if(whether ==0){
                                return '<span class ="label label-danger">否</span>';
                            }else {
                                return '<span class ="label label-primary">是</span>';
                            }
                        }
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
                            var a = '<a  class="btn btn-primary btn-sm " href="#" mce_href="#" title="使用该地图" onclick="binding(\''
                                + mapId + '\')"><i class="fa fa-map  fa-fw"></i></a> ';
                           
                            return a ;
                        }
                    }]
            });
}
function reLoad() {
	$('#exampleTable').bootstrapTable('refresh');
}
//查询点击
$('#btnreload').on('click',function(e){
    map_name=$.trim($('#genid').val());
    $('#exampleTable').bootstrapTable('destroy');
    load();
    e.preventDefault()
});

//使用该地图
function binding(mapId){
    var data ={
        "robotid":robotid,
        "mapid":mapId,
        "mapname":mapNames,
        "robothadwared":robothadwared
    };
    var datastringd = JSON.stringify(data);
    layer.confirm('确定要使用本地图嘛？', {
		btn : [ '确定', '取消' ]
	}, function() {
		$.ajax({
			url : share + "/irobotweb/sys/map/setcurrentmap",
            type: "POST",
            crossDomain: true,
            xhrFields: {
                withCredentials: true
            },
            dataType: "json",
            contentType: "application/json; charset=utf-8",
			data : datastringd,
			success : function(r) {
				if (r.code == 200) {
					layer.msg(r.msg);
					reLoad();
				} else {
					layer.msg(r.msg);
				}
			}
		});
	})
}
