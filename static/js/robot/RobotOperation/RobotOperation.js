
$(function () {
    load();
});

function load() {//   /irobotweb/sys/robot/query/list

    //alert(share+'/irobotweb/sys/robot/query/list');
    //alert($.trim($('#robotName').val()));

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
                url: share+'/irobotweb/sys/robot/query/list',
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
                queryParams: function (params) {
                    //这里的键的名字和控制器的变量名必须一直，这边改动，控制器也需要改成一样的
                    var temp = {
                        rows: params.pageSize,     //页面大小
                        page: params.pageNumber,   //页码
                            //排序列名
                        sortOrder: 'asc',
                        robotName: $.trim($('#robotName').val()),//机器人名称
                        shopname:$.trim($('#shopName').val())   //店铺名称
                    };
                    return temp;
                },
                // 请求服务器数据时，你可以通过重写参数的方式添加一些额外的参数，例如 toolbar 中的参数如果
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
                    // {
                    //     field: 'id',
                    //     align: 'center',
                    //     title: '机器人id'
                    // },
                    {
                        field: 'robotName',
                        align: 'center',
                        title: '机器人名称'
                    },
                    {
                        field: 'currentmap',
                        align: 'center',
                        title: '当前所用地图'
                    },
                    // {
                    //     field: 'hardwearNo',
                    //     align: 'center',
                    //     title: '机器人硬件地址'
                    // },
                    {
                        field: 'shopname',
                        align: 'center',
                        title: '店铺名称'
                    },
                    {
                        field: 'onlinestats',
                        align: 'center',
                        title: '机器人状态',
                        // formatter: function (value,row,index){
                        formatter: function (status){
                            // 0离线  1在线 2维修
                            if(status == "0"){
                                //return '<span style="color:red">离线</span>';
                                return '<span class ="label label-danger">离线</span>';
                            }else if(status == "1"){
                                return '<span class ="label label-primary">在线</span>';
                            }

                            if(status == "1"){
                                return '<span class ="label label-primary">在线</span>';
                            }else{
                                return '<span class ="label label-danger">离线</span>';
                            }
                        }
                    },
                    // {
                    //     field: 'hardwearNo',
                    //     align: 'center',
                    //     title: '原始缩略图',
                    //     formatter: function (hardwearNo){
                    //         sessionStorage.setItem('robothadware',hardwearNo);
                    //     }
                    // },
                    // {
                    //     field: 'task',
                    //     align: 'center',
                    //     title: '当前任务'
                    // },
                    // {
                    //     field: 'status',
                    //     align: 'center',
                    //     title: '在线状态',
                    //     formatter: function (value,row,index){
                    //         // 0表示图片，1表示音频，2表示视频，3表示其他
                    //         if(value == "0"){
                    //            // return '<img src="" alt="">'
                    //            return '<span class ="border-green"></span>'
                    //         }else if(value == "1"){
                    //             return '<span class ="border-red"></span>'
                    //         }
                    //     }
                    // },
                    {
                        title: '操作',
                        field: 'id',
                        align: 'center',
                        formatter: function (a, id, index) {
                            var c = '<a  class="btn btn-primary btn-sm  '  + '" href="#" mce_href="#" title="更换地图" onclick="change(\''
                                + id.id
                                + '\')"><i class="fa fa-map  fa-fw"></i></a> ';

                            var e = '<a  class="btn btn-primary btn-sm '  + '" href="#" mce_href="#" title="参数设置" onclick="setting(\''
                                + id.id
                                + '\')"><i class="fa fa-cog  fa-fw"></i></a> ';

                            var d = '<a  class="btn btn-primary btn-sm '  + '" href="#" mce_href="#" title="运行控制" onclick="control(\''
                                + id.id+','+id.robotName
                                + '\')"><i class="fa fa-television  fa-fw"></i></a> ';

                            var f = '<a  class="btn btn-primary btn-sm '  + '" href="#" mce_href="#" title="运行控制" onclick="controlNew(\''
                                + id.id+','+id.robotName
                                + '\')"><i class="fa fa-television  fa-fw"></i></a> ';
                           
                            //return  c + e + d+f;
                            return  e +f;
                            //return  c + e + d;
                        }
                    }]
            });
}

//查询点击
$('#btnreload').on('click',function(){
    $('#exampleTable').bootstrapTable('destroy');
    load();
});

//参数设置
function setting(id){
    sessionStorage.setItem('settingid', id);
    layer.open({
        type: 2,
        title: '参数设置',
        shadeClose: false,
        area: ['1000px', '750px'],
        content:'./setting.html'  // iframe的url
    });
}

//运行控制
function control(id){

    //alert(id);

    var openedTabs=$(window.parent.document).find('.J_menuTab');
    var tab_arr=new Array();
    for(var i=0;i<openedTabs.length;i++){
        if($(openedTabs[i]).text()!='首页'){
            tab_arr.push($(openedTabs[i]).text());
        }
    }

    sessionStorage.setItem('tab_arr', tab_arr);

    //console.info('tab_arr');console.info(tab_arr);
    //alert(openedTabs.length);

    var index=id.indexOf(',');
    var id_value=id.substring(0,index);
    var robotName=id.substring(index+1,id.length);
    //alert(robotName);

    sessionStorage.setItem('controlid', id_value);
    console.log(id_value,'opid')
    sessionStorage.setItem('robotName', robotName);
    window.parent.location.href='./control.html';

    // layer.open({
    //     type: 2,
    //     title: '运行控制',
    //     maxmin: true,
    //     shadeClose: false, // 点击遮罩关闭层
    //     area: ['800px', '520px'],
    //     content: './control.html'
    // });


}

//运行控制
function controlNew(id){
    //alert(id);
    var openedTabs=$(window.parent.document).find('.J_menuTab');
    var tab_arr=new Array();
    for(var i=0;i<openedTabs.length;i++){
        if($(openedTabs[i]).text()!='首页'){
            tab_arr.push($(openedTabs[i]).text());
        }
    }
    sessionStorage.setItem('tab_arr', tab_arr);
    //console.info('tab_arr');console.info(tab_arr);
    //alert(openedTabs.length);

    var index=id.indexOf(',');
    var id_value=id.substring(0,index);
    var robotName=id.substring(index+1,id.length);
    //alert(robotName);
    //6c7e02bc183646c2a814320ebad95896
    sessionStorage.setItem('controlidnew', id_value);
    sessionStorage.setItem('robotName', robotName);
    console.log(id_value,'idnew')
    window.parent.location.href='./ControlNew.html';
    // layer.open({
    //     type: 2,
    //     title: '运行控制',
    //     maxmin: true,
    //     shadeClose: false, // 点击遮罩关闭层
    //     area: ['800px', '520px'],
    //     content: './control.html'
    // });


}

 //  任务设置
 function plan(id){
    console.log('任务设置id:',id)
    //任务设置
    layer.open({
        type: 2,
        title: '任务设置',
        shadeClose: false,
        area: ['1000px', '750px'],
        content:'./plan.html'  // iframe的url
    });
 }

 //更多显示  上面框框显示
 $('#btnmore').on('click',function(){
     var top = document.getElementById("userinfo").style.marginTop;
     document.getElementById("userinfo").style.marginTop=0;
    if (top == "0px"){
        document.getElementById("userinfo").style.marginTop=-200+'px';
    }
 });
// 更换地图
function change(id){
    // sessionStorage.setItem('changeid', id);
    // layer.open({
    //     type: 2,
    //     title: '更换地图',
    //     shadeClose: false, // 点击遮罩关闭层
    //     area: ['1000px', '750px'],
    //     content: './changemap.html'  
    // });
}