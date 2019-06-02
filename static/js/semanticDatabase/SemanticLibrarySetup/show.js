var semanticid = sessionStorage.getItem('semanticid');
var questionname='';
load();
function load() {
    $('#table').bootstrapTable( {
        ajaxOptions: {
            xhrFields: {        //跨域
                withCredentials: true
            },
            crossDomain: true,
            jsonp: "callback",
            jsonpCallback: "success_jsonpCallback",
        },
        type : "GET",
        url: share+'/irobotweb/speech/intgvoicedb/list',
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
        height: $(window).height()-227,
        queryParams: function (params){
            //这里的键的名字和控制器的变量名必须一直，这边改动，控制器也需要改成一样的
            var temp = {
                rows: params.pageSize,     //页面大小
                page: params.pageNumber,   //页码
                voicedbid: semanticid,
                //排序列名
                sortOrder: 'asc',
               // voicedbname: $.trim($('#genid').val()),//id搜索框
               question:questionname
            };
            return temp;
        },

        columns: [

            {
                align: 'center',
                title: '序号',// 列标题
                formatter: function (value, row, index) {
                    var pageSize = $('#table').bootstrapTable('getOptions').pageSize;     //通过table的#id 得到每页多少条
                    var pageNumber = $('#table').bootstrapTable('getOptions').pageNumber; //通过table的#id 得到当前第几页
                    return pageSize * (pageNumber - 1) + index + 1;    // 返回每条的序号： 每页条数 *（当前页 - 1 ）+ 序号
                }
            },
            {
                field: 'question',
                align: 'center',
                title: '问题'
            },
            {
                field: 'answer',
                align: 'left',
                title: '答案',
                class:'colStyle',
                formatter:paramsMatter
            },
            {
                title: '操作',
                field: 'id',
                align: '',
                formatter: function (value, row, index) {

                    var e = '<a  class="btn btn-primary btn-sm '  + '" href="#" mce_href="#" title="编辑" onclick="edit(\''
                        + row.id
                        + '\')"><i class="fa fa-edit "></i></a> ';

                    var f = '<a class="btn btn-danger btn-sm"  href="#" mce_href="#" title="删除" onclick="remove(\''
                        + row.id
                        + '\')"><i class="fa fa-trash fa-fw"></i></a>';
                    return  e+f;
                }
            }]
    });
}



//编辑
function edit(id) {
    sessionStorage.setItem('editid', id);
    console.log()
    layer.open({
        type: 2,
        title: '编辑',
        shadeClose: false,
        area: ['800px', '600px'],
        content:'./showedit.html'  // iframe的url
    });
}



//删除
function remove(id) {
    layer.confirm('确定要删除选中的记录？', {
        btn: ['确定', '取消']
    }, function () {
        $.ajax({
            url: share+"/irobotweb/speech/intgvoicedb/delete?id="+id,
            type: "DELETE",
            crossDomain: true,
            xhrFields: {
                withCredentials: true
            },
            success: function (r) {
                if (r.code == 200) {
                    layer.msg(r.msg);
                    window.location.reload();
                } else {
                    layer.msg(r.msg);
                }
            }
        });
    })
}



$("#btnadd").on('click',function(){
    sessionStorage.setItem('showaddid', semanticid);
    layer.open({
        type: 2,
        title: '添加',
        shadeClose: false, // 点击遮罩关闭层
        area: ['800px', '600px'],
        content: './showadd.html'
    });
})




function paramsMatter(value, row, index) {
    var title =value.substring(0,30);
    var span=document.createElement('span');
    span.setAttribute('title',value);
  //  span.setAttribute('class','colStyle');
    span.innerHTML = title;
    return span.outerHTML;
}
//查询
$("#btnreload").on('click',function(){
     console.log($("#genid").val(),'撸啦啦噜啦啦噜啦啦')
    questionname = $("#genid").val();
    $('#table').bootstrapTable('destroy');
    load();
    $("#genid").val('')
})

//模板下载template
$("#template").on('click',function(){

    window.location.href= share+'/irobotweb/upload/getmodel'; //点击下载
})

//批量上传文件
var file_batch = $('#file_batch');

file_batch.on('change', function (e) {

    var event = event ? event : window.event;
    var obj = event.srcElement ? event.srcElement : event.target;
    var customer_list_formData = new FormData();
    customer_list_formData.append('avatar_file', obj.files[0]);
    customer_list_formData.append('voicedbid', semanticid);

    //上传文件
    $.ajax({
        url: share + "/irobotweb/upload/excel",
        crossDomain: true,
        type: "POST",

        contentType: false,
        processData: false,
        async: false,

        xhrFields: {
            withCredentials: true
        },
        data: customer_list_formData,

        success: function (data) {
            if (data.code == 1 || data.code ==200 ) {
                parent.layer.msg("更新成功");
                window.location.reload();
            } else {
                parent.layer.alert(data.msg);
                window.location.reload();
            }
        },
        error: function (request) {
            layer.alert("Connection error");
        },
    });
});

