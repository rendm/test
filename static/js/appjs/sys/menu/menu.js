


have();
function have(){
    $('#exampleTable').bootstrapTable({
        ajaxOptions: {
            xhrFields: {       //跨域
                withCredentials: true
            },
            crossDomain: true,
            jsonp: "callback",
            jsonpCallback: "success_jsonpCallback",
        },
        type : "GET",
        url: share+'/irobotweb/sys/menu/query/list',
        height: $(window).height()-127,
        striped: true,
        idField: 'menuId',
        dataType : "jsonp",                 // 服务器返回的数据类型
        pagination: true,                   //是否显示分页（*）
        sortable: true,                     //是否启用排序
        // sortOrder: "asc",                   //排序方式
        sidePagination: "server",           //分页方式：client客户端分页，server服务端分页（*）
        pageNumber: 1,                      //初始化加载第一页，默认第一页,并记录
        pageSize: 10,                     //每页的记录行数（*）
        pageList: [13, 25, 50, 100],        //可供选择的每页的行数（*）
        search: false,                      //是否显示表格搜索
        iconSize: 'outline',
        paginationLoop: false,
        paginationPreText:"上一页",
        paginationNextText:"下一页",
        paginationShowPageGo: true,     //显示跳转
        showJumpto: true,
        queryParamsType:'',
        //得到查询的参数
        queryParams : function (params) {
            //这里的键的名字和控制器的变量名必须一直，这边改动，控制器也需要改成一样的
            var temp = {
                rows: params.pageSize,                         //页面大小
                page:  params.pageNumber,       //页码
                sort: 'menu_id,order_num',      //排序列名
                sortOrder: 'asc',               //排位命令（desc，asc）
                
                name: $('#menuname').val()
            };
            return temp;
        },
        columns : [
            {
                align: 'center',
                title: '序号', // 列标题
                formatter: function (value, row, index) {
                   var qw= $('#exampleTable').bootstrapTable("getPage").pageSize;
                   var qqe = $('#exampleTable').bootstrapTable("getPage").pageNumber;
                     return qw * (qqe - 1) + index + 1;   // 返回每条的序号： 每页条数 *（当前页 - 1 ）+ 序号
                }
            },
            {
                title: '编号',
                field: 'menuId',
                visible: false,
                align: 'center',
                valign: 'center',
                width: '5%'
            },
            {
                title: '名称',
                valign: 'center',
                field: 'name',
                width: '20%',
                formatter: function (name){
                    return name
                }
            },
            {
                title: '图标',
                field: 'icon',
                align: 'center',
                valign: 'center',
                width : '5%',
                formatter: function (item, row,index){
                    return item == null ? ''
                        : '<i class="' + item
                        + ' fa-lg"></i>';
                }
            },
            {
                title: '类型',
                field: 'type',
                align: 'center',
                valign: 'center',
                width : '10%',
                formatter: function (item, row,index) {
                    if (item === 0) {
                        return '<span class="label label-primary">目录</span>';
                    }
                    if (item === 1) {
                        return '<span class="label label-success">菜单</span>';
                    }
                    if (item === 2) {
                        return '<span class="label label-warning">按钮</span>';
                    }
                }
            },
            {
                title: '地址',
                valign: 'center',
                width : '20%',
                field: 'url'
            },
            {
                title: '权限标识',
                valign: 'center',
                width : '20%',
                field: 'perms'
            },
            {
                title: '操作',
                field: 'id',
                align: 'center',
                valign: 'center',
                formatter: function (item, row,index) {
                    var e = '<a class="btn btn-primary btn-sm '
                        + s_edit_h
                        + '"  title="编辑" onclick="edit(\''
                        + row.menuId
                        + '\')"><i class="fa fa-edit"></i></a> ';
                    var p = '<a class="btn btn-primary btn-sm '
                        + s_add_h
                        + '"  title="添加下级" onclick="chadd(\''
                        + row.menuId
                        + '\')"><i class="fa fa-plus"></i></a> ';
                    var d = '<a class="btn btn-danger btn-sm '
                        + s_remove_h
                        + '"  title="删除"   onclick="remove(\''
                        + row.menuId
                        + '\')"><i class="fa fa-trash fa-fw"></i></a> ';
                    return e + p + d;
                }
            }],


        treeShowField: 'name',
        parentIdField: 'parentId',
        onLoadSuccess: function(data) {
            // console.log(data);
            $('#exampleTable').treegrid({
                //初始化时树的状态
                // 'expanded' - 所有节点都展开
                // 'collapsed' - 所有节点都折叠
                initialState: 'expanded',
                treeColumn: 1,
                expanderExpandedClass: 'glyphicon  glyphicon-chevron-down',
                expanderCollapsedClass: 'glyphicon glyphicon-chevron-right',
                onChange: function(){
                    $('#exampleTable').bootstrapTable('resetWidth');
                }
            });
            //只展开树形的第一级节点
            //  $('#exampleTable').treegrid('getRootNodes').treegrid('expand');
        }

        // bootstrap-table-treetreegrid.js 插件配置
    });

};
load()
function load() {
    $('#inexist').bootstrapTable({
                columns: [
                    {
                        align: 'center',
                        title: '序号', // 列标题
                        formatter: function (value, row, index) {
                           var qw= $('#exampleTable').bootstrapTable("getPage").pageSize;
                           var qqe = $('#exampleTable').bootstrapTable("getPage").pageNumber;
                             return qw * (qqe - 1) + index + 1;   // 返回每条的序号： 每页条数 *（当前页 - 1 ）+ 序号
                        }
                    },
                    {
                        title: '编号',
                        field: 'menuId',
                        visible: false,
                        align: 'center',
                        valign: 'center',
                        width: '5%'
                    },
                    {
                        title: '名称',
                        valign: 'center',
                        field: 'name',
                        width: '20%',
                        formatter: function (name){
                            console.log(name,'suoy1所以name')
                            return name
                        }
                    },
                    {
                        title: '图标',
                        field: 'icon',
                        align: 'center',
                        valign: 'center',
                        width : '5%',
                        formatter: function (item, row,index){
                            return item == null ? ''
                                : '<i class="' + item
                                + ' fa-lg"></i>';
                        }
                    },
                    {
                        title: '类型',
                        field: 'type',
                        align: 'center',
                        valign: 'center',
                        width : '10%',
                        formatter: function (item, row,index) {
                            if (item === 0) {
                                return '<span class="label label-primary">目录</span>';
                            }
                            if (item === 1) {
                                return '<span class="label label-success">菜单</span>';
                            }
                            if (item === 2) {
                                return '<span class="label label-warning">按钮</span>';
                            }
                        }
                    },
                    {
                        title: '地址',
                        valign: 'center',
                        width : '20%',
                        field: 'url'
                    },
                    {
                        title: '权限标识',
                        valign: 'center',
                        width : '20%',
                        field: 'perms'
                    },
                    {
                        title: '操作',
                        field: 'id',
                        align: 'center',
                        valign: 'center',
                        formatter: function (item, row,index) {
                            var e = '<a class="btn btn-primary btn-sm '
                                + s_edit_h
                                + '"  title="编辑" onclick="edit(\''
                                + row.menuId
                                + '\')"><i class="fa fa-edit"></i></a> ';
                            var p = '<a class="btn btn-primary btn-sm '
                                + s_add_h
                                + '"  title="添加下级" onclick="chadd(\''
                                + row.menuId
                                + '\')"><i class="fa fa-plus"></i></a> ';
                            var d = '<a class="btn btn-danger btn-sm '
                                + s_remove_h
                                + '"  title="删除"   onclick="remove(\''
                                + row.menuId
                                + '\')"><i class="fa fa-trash fa-fw"></i></a> ';
                            return e + p + d;
                        }
                    }
                ]
            });
}
//have  //inexistence
$("#searchbtn").on('click',function(){
    var menuname = $('#menuname').val();
    console.log(menuname)
    if(  menuname == '' || menuname == null){
        $('#exampleTable').bootstrapTable('destroy');
        have();
        $("#have").css({"display":"block"})
        $("#inexistence").css({"display":"none"})
    }else{
            $.ajax({
                url: share+'/irobotweb/sys/menu/query/menuname?name='+menuname,
                crossDomain: true,
                type: 'get',
                xhrFields: {
                  withCredentials: true,
                },
                dataType:"json",
                contentType:"application/json; charset=utf-8",
                success: function(data) {
                   console.log(data,'请求到的数据')
                   $('#inexist').bootstrapTable('load',data)
                   $('#inexist').bootstrapTable('getData')
                   $("#have").css({"display":"none"})
                   $("#inexistence").css({"display":"block"})
                },
                error: function(data) {
                  console.log(data, 'error')
                },
               })
               $('#menuname').val('');
    }
   
    // 
    
})


function removeinput(){
    // deptId= $('#deptId').val();
    $("#menuname").val("");
    $("#menuId").val("");
}


//
function chadd(pId) {
    sessionStorage.setItem('menuchaddid', pId);
    layer.open({
        type: 2,
        title: '添加',
        shadeClose: false, // 点击遮罩关闭层
        area: ['1000px', '750px'],
        content: './chadd.html' // iframe的url
    });
}
function add(pId) {
    sessionStorage.setItem('menuaddid', pId);
    layer.open({
        type: 2,
        title: '添加',
        shadeClose: false, // 点击遮罩关闭层
        area: ['1000px', '750px'],
        content: './add.html' // iframe的url
    });
}
function remove(id) {
    layer.confirm('确定要删除选中的记录？', {
        btn: ['确定', '取消']
    }, function (){
        $.ajax({
            url:share+ '/irobotweb/sys/menu/delete',
            type: "post",
            crossDomain: true,
            xhrFields: {
                withCredentials: true
            },
            data: {
                'id': id
            },
            success: function (data) {
                console.log(data)
                if (data.code == 200) {
                    layer.msg("删除成功");
                    window.location.reload()
                } else {
                    layer.msg(data.msg);
                }
            }
        });
    })
}

function edit(id) {
    sessionStorage.setItem('menueditid', id);
    layer.open({
        type: 2,
        title: '编辑',
        shadeClose: false, // 点击遮罩关闭层
        area: ['1000px', '750px'],
        content: './edit.html'  // iframe的url
    });
}
$(function() {
    $("#menuname").autoComplete({
        minChars: 0,
        renderItem: function (item, search){
            search = search.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
            var re = new RegExp("(" + search.split(' ').join('|') + ")", "gi");
            console.log(item[0],'item[0]item[0]item[0]item[0]item[0]'+re)
            return '<div class="autocomplete-suggestion" data-langname="'+item[0]+'" data-lang="'+item[1]+'" data-val="'+search+'"> '+item[0].replace(re, "<b>$1</b>")+'</div>';
        },


        onSelect: function(e, term, item){
            console.log('Item "'+item.data('langname')+' ('+item.data('lang')+')" selected by '+(e.type == 'keydown' ? 'pressing enter or tab' : 'mouse click')+'.');
            $('#menuname').val(item.data('langname'));
            $('#menuId').val(item.data('lang'));
        },
        source: function (request, response) {
            $.ajax({
                url: share+'/irobotweb/sys/menu/query/menuname',
                type: "get",
                dataType: "json",
                crossDomain: true,
                xhrFields: {
                    withCredentials: true
                },
                cache: false,
                async: true,
                data: {
                    "name": request
                },
                success: function (json) {
                    if (json != null) {
                        var suggestions = [];
                        for(var i =0 ;i < json.length;i++){
                            var jsonarray= [];
                            jsonarray.push(json[i].name);
                            jsonarray.push( json[i].menuId);
                            suggestions.push(jsonarray);
                        }
                        response(suggestions);
                    }

                }

            });
        },
        delay: 0,//延迟500ms便于输入
        // select: function (event, ui) {
        //     $("#deptId").val(ui.item[1]);
        // }
    });
});
//所有菜单列表名称
