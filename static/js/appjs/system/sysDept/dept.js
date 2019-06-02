
var $table = $('#table');
var prefix = "/irobotweb/sys/dept"
$(function() {
    load();
});

function load() {
    $table.bootstrapTable({
        ajaxOptions: {
            xhrFields: {        //跨域
                withCredentials: true
            },
            crossDomain: true,
            jsonp: "callback",
            jsonpCallback: "success_jsonpCallback",
        },
        url:share+'/irobotweb/sys/dept/query/list',
        method: 'get',
        // contentType : "application/x-www-form-urlencoded",
        height: $(window).height()-127,
        striped: true,
        idField: 'deptId',
        dataType : "jsonp", // 服务器返回的数据类型
        pagination: true,                   //是否显示分页（*）
        sortable: true,                     //是否启用排序
        sortOrder: "asc",                   //排序方式
        sidePagination: "server",           //分页方式：client客户端分页，server服务端分页（*）
        pageNumber: 1,                      //初始化加载第一页，默认第一页,并记录
        pageSize: 10,                     //每页的记录行数（*）
        pageList: [13, 25, 50, 100],        //可供选择的每页的行数（*）
        search: false,                      //是否显示表格搜索
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
                page:  params.pageNumber,   //页码
                sort: 'dept_id',      //排序列名
                sortOrder: 'asc', //排位命令（desc，asc）
                deptid: $('#deptId').val(),
            };
            return temp;
        },
        columns : [
            {
                field : 'Number',
                title : '序号',
                formatter : function(value, row, index) {
                    //return index + 1;
                   // return tableIndexNum(index);
                    var page = $table.bootstrapTable("getPage");
                    return page.pageSize * (page.pageNumber - 1) + index + 1;

                },

                align : 'center',
                valign : 'center',
                width : '50px'

            },


            {
                title : '部门ID',
                field : 'deptId',
                visible : false,
                align : 'left',
                valign : 'center',


            },
            {

                field : 'name',
                title : '部门名称',
                valign : 'center',
                witth :20,
                halign :"center"
            },
            {
                field : 'orderNum',
                title : '显示序列',
                align : 'center',
                valign : 'center',
                width : '50px'
            },
            {
                field : 'delFlag',
                title : '状态',
                align : 'center',
                valign : 'center',
                formatter: 'statusFormatter',
                width : '100px'

            },
            {
                title : '操作',
                field : 'id',
                align : 'center',
                valign : 'center',
                formatter : 'operationFormatter',
                width : '200px'
            }
        ],
        // bootstrap-table-tree-column.js 插件配置
        // treeShowField: 'name',
        // parentIdField: 'pid'
        // bootstrap-table-tree-column.js 插件配置

        // bootstrap-table-treegrid.js 插件配置

        treeShowField: 'name',
        parentIdField: 'parentId',
        onLoadSuccess: function(data) {
            console.log(data);
            console.log('load');
            // jquery.treegrid.js
            $table.treegrid({
                //初始化时树的状态
                // 'expanded' - 所有节点都展开
                // 'collapsed' - 所有节点都折叠
                initialState: 'expanded',
                treeColumn: 1,
                expanderExpandedClass: 'glyphicon  glyphicon-chevron-down',
                expanderCollapsedClass: 'glyphicon glyphicon-chevron-right',
                onChange: function() {
                    $table.bootstrapTable('resetWidth');
                }
            });
            //只展开树形的第一级节点
           //  $table.treegrid('getRootNodes').treegrid('expand');
        }

        // bootstrap-table-treetreegrid.js 插件配置
    });

};




// 格式化状态
function statusFormatter(item, row, index) {
    if (item == 1) {
        return '<span class="label label-primary">正常</span>';

    } else if (item == 0) {
        return '<span class="label label-danger">禁用</span>';
    }
}

function operationFormatter(item, row,index) {
    var e = '<a class="btn btn-primary btn-sm ' + s_edit_h + '" href="#" mce_href="#" title="编辑" onclick="edit(\''
        + row.deptId
        + '\')"><i class="fa fa-edit"></i></a> ';
    var a = '<a class="btn btn-primary btn-sm ' + s_add_h + '" href="#" title="增加下級"  mce_href="#" onclick="add(\''
        + row.deptId
        + '\')"><i class="fa fa-plus"></i></a> ';
    var d = '<a class="btn btn-warning btn-sm ' + s_remove_h + '" href="#" title="删除"  mce_href="#" onclick="removeone(\''
        + row.deptId
        + '\')"><i class="fa fa-remove"></i></a> ';
    var f = '<a class="btn btn-success btn-sm＂ href="#" title="备用"  mce_href="#" onclick="resetPwd(\''
        + row.deptId
        + '\')"><i class="fa fa-key"></i></a> ';
    return e + a + d;
}


function reLoad() {
    // deptId= $('#deptId').val();
    $table.bootstrapTable('destroy');
    load();
    $("#deptId").val("");
}

function removeinput() {
    // deptId= $('#deptId').val();
    $("#deptId").val("");
    $("#deptname").val("");

}





function add(pId) {
    sessionStorage.setItem('deptaddid', pId);
    layer.open({
        type : 2,
        title : '增加',
        maxmin : true,
        shadeClose : false, // 点击遮罩关闭层
        area : [ '800px', '520px' ],
        content : './add.html' 
    });
}
function edit(id) {
    sessionStorage.setItem('depteditid', id);
    layer.open({
        type : 2,
        title : '编辑',
        maxmin : true,
        shadeClose : false, // 点击遮罩关闭层
        area : [ '800px', '520px' ],
        content : './edit.html' // iframe的url
    });
}
function removeone(id) {
    sessionStorage.setItem('deptremoveid', id);
    layer.confirm('确定要删除选中的记录？', {
        btn : [ '确定', '取消' ]
    }, function() {
        $.ajax({
            url : share+prefix + "/delete",
            type : "post",
            data : {
                'deptId' : id
            },
            crossDomain: true,
            xhrFields: {
                withCredentials: true
            },
            success : function(r) {
                if (r.code == 0) {
                    layer.msg(r.msg);
                    reLoad();
                } else {
                    layer.msg(r.msg);
                }
            }
        });
    })
}



    $("#deptname").autoComplete({
        minChars: 0,
        renderItem: function (item, search){
            search = search.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
            var re = new RegExp("(" + search.split(' ').join('|') + ")", "gi");
            console.log(item[0])
            return '<div class="autocomplete-suggestion" data-langname="'+item[0]+'" data-lang="'+item[1]+'" data-val="'+search+'"> '+item[0].replace(re, "<b>$1</b>")+'</div>';
        },


        onSelect: function(e, term, item){
       // console.log('Item "'+item.data('langname')+' ('+item.data('lang')+')" selected by '+(e.type == 'keydown' ? 'pressing enter or tab' : 'mouse click')+'.');
        $('#deptname').val(item.data('langname')+' ('+item.data('lang')+')');
        $('#deptId').val(item.data('lang'));
        menuItem(item.data('langname'));
       },
        source: function (request, response) { 
            $.ajax({
                url: share+'/irobotweb/sys/dept/query/name',
                type: "get",
                dataType: "json",
                cache: false,
                async: true,
                crossDomain: true,
                xhrFields: {
                    withCredentials: true
                },
                data: {
                    "name": request
                },
                success: function (json) {
                    console.log(json)
                    if (json != null) {
                        var suggestions = [];
                        for(var i =0 ;i < json.length;i++){

                            var jsonarray= [];
                            jsonarray.push(json[i].name);
                            jsonarray.push( json[i].deptId);

                            suggestions.push(jsonarray);
                        }
                        response(suggestions);
                    }

                }

            });
          //  e.preventDefault()
        },
        delay: 0//延迟500ms便于输入
        // select: function (event, ui) {
        //     $("#deptId").val(ui.item[1]);
        // }
    });

