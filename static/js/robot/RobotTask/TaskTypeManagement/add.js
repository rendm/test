
$(function () {
    load();
    validateRule();
    validateRuleAdd();
});

function load() {
    $('#exampleTable').bootstrapTable( {
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
                        field: 'taskPararmsName',
                        align: 'center',
                        title: '参数中文名称'
                    },
                    {
                        field: 'taskPararms',
                        align: 'center',
                        title: '参数代码'
                    },
                    {
                        field: 'pararmsType',
                        align: 'center',
                        title: '参数类型'
                    },
                    {
                        field: 'defaultValue',
                        align: 'center',
                        title: '参数值'
                    },

                    /*{
                        field: 'valuename',
                        align: 'center',
                        title: '参数值名称'
                    },*/

                    {
                        field: 'remark',
                        align: 'center',
                        title: '备注'
                    },
                    {
                        title: '操作',
                        field: 'id',
                        align: 'center',
                        formatter: function (id) {
                            var e = '<a  class="btn btn-primary btn-sm '  + '" href="#" mce_href="#" title="编辑" onclick="setting(\''
                                + id
                                + '\')"><i class="fa fa-edit"></i></a> ';    
                            var d = '<a class="btn btn-warning btn-sm '  + '" href="#" title="删除"  mce_href="#" onclick="remove(\''
                                + id
                                + '\')"><i class="fa fa-remove"></i></a> ';
                                return  e+d ;
                        }
                    }]
            });
}

 //更多显示  上面框框显示
 $('#btnmore').on('click',function(){
     var top = document.getElementById("userinfo").style.marginTop;
     document.getElementById("userinfo").style.marginTop=0;                                                                                                                                                                                                                                                                                                                                            
    //console.log(top,'top');

    if (top == "0px"){
        document.getElementById("userinfo").style.marginTop=-200+'px';
    }
 })
//  function addtable(data){
//     $('#exampleTable').bootstrapTable('append', data)
//     $('#exampleTable').bootstrapTable('scrollTo', 'bottom')
//  }
// data.splice(2,1)  //从下标为2的开始删除  删除一个
var dataArray =[];

//点击增加跳出增加的框框
$("#add").on('click',function(){
    $("#taskPararmsName").val(''); //参数中文名称
    $("#taskPararms").val('');    //参数代码
    $("#pararmsType").val('');    //参数类型
    $("#remark").val('');         //备注
    $("#defaultValue").val('');   //参数值
    $("#valuename").val('');      //参数值名称
    $("#increasebox").css({display:"block"});
});

// 点击删除
function remove(id){
    //console.log(dataArray);
    layer.confirm('确定要删除选中的记录？',{
        btn: ['确定', '取消']
    }, function (){
        dataArray.splice(id,1);
        $('#exampleTable').bootstrapTable('load', dataArray);
        layer.closeAll('dialog');
    })
}

// var increasedata= sessionStorage.getItem('add');
//     console.log(increasedata,'存的数据')
//  加加的确定 
var idnum = 0;
$("#importdy").on('click',function(e){
    //console.log(dataArray,'确定加加');

    if (!$("#increaseForm").valid()) {
        return false; //验证不通过，不允许提交
    }


    var pushdata = {
        taskPararmsName:$("#taskPararmsName").val(),
        taskPararms:$("#taskPararms").val(),
        pararmsType:$("#pararmsType").val(),
        remark:$("#remark").val(),
        defaultValue:$("#defaultValue").val(),
        valuename:$("#valuename").val(),
        id:idnum++
    };

    //console.log(idnum,'id的值');
    dataArray.push(pushdata);
    //console.log(dataArray,"添加之后的数组");
    $('#exampleTable').bootstrapTable('load', dataArray);
    $("#increasebox").css({display:"none"});
    e.preventDefault();
})

//替换起始下标为1，长度为1的一个值为‘ttt’，len设置的1 
// var arr = ['a','b','c','d'];
// arr.splice(1,1,'ttt');
// console.log(arr);  
//  点击添加修改
function setting(id){
    sessionStorage.setItem('addeditid',id)//保存修改的下标
    //console.log(id);
    $("#taskPararmsNameedit").val(dataArray[id].taskPararmsName); //参数中文名称
    $("#taskPararmsedit").val(dataArray[id].taskPararms);     //参数代码
    $("#pararmsTypeedit").val(dataArray[id].pararmsType);    //参数类型
    $("#remarkedit").val(dataArray[id].remark);         //备注
    $("#defaultValueedit").val(dataArray[id].defaultValue);   //参数值
    $("#valuenameedit").val(dataArray[id].valuename);      //参数值名称
    $("#addedit").css({display:"block"});
}

//修改确定
$("#importdyedit").on('click',function(e){
     //console.log(dataArray);
     var standardid= sessionStorage.getItem('addeditid');
     var editadta = {
        taskPararmsName:$("#taskPararmsNameedit").val(),
        taskPararms:$("#taskPararmsedit").val(),
        pararmsType:$("#pararmsTypeedit").val(),
        remark:$("#remarkedit").val(),
        defaultValue:$("#defaultValueedit").val(),
        valuename:$("#valuenameedit").val(),
        id:standardid
     }
     dataArray.splice(standardid,1,editadta);
     //console.log(dataArray[standardid],'修改过后的');
     var qwe = dataArray;
     $('#exampleTable').bootstrapTable('load', qwe);
    $("#addedit").css({display:"none"});
    e.preventDefault();
});

//修改取消
$("#canceledit").on('click',function(e){
    //console.log(dataArray);
    $('#exampleTable').bootstrapTable('load', dataArray);
    $("#addedit").css({display:"none"});
    e.preventDefault();
});

//增加取消
$("#cancel").on('click',function(e){
    $("#increasebox").css({display:"none"});
    e.preventDefault();

});

//确定增加
$("#okt").on('click',function(){
    //console.log('这里是编辑保存');
    //console.log();

    if (!$("#signupFormadd").valid()) {
        return false; //验证不通过，不允许提交
    }

    var ajaxdata = {
        "taskTypeName":$("#taskTypeName").val(),//任务类型名称
        "taskType":$("#taskType").val(),//任务类型代码
        "taskParamsDOList":dataArray
    };
    //console.log(JSON.stringify(ajaxdata));

    $.ajax({
        type : "post",
        url : share+"/irobotweb/sys/tasktype/add",
        data :JSON.stringify(ajaxdata),// 你的formid
        async : false,
        crossDomain: true,
        dataType:'json',
        contentType:"application/json; charset=utf-8",
        xhrFields: {
            withCredentials: true
        },
        error : function(request) {
            parent.layer.alert("Connection error");
        },
        success : function(data) {
            //console.log(data,'asjgakjsdgq增加激活返回的code码');
            if(data.code == 200){
               // parent.location.reload();
                parent.layer.alert("操作成功",function () {
                    window.parent.location.reload();
                    var index = parent.layer.getFrameIndex(window.name);
                    parent.layer.close(index);
                });

            }
            else
            {
                layer.msg(data.msg);
            }
        }
    });
})

$("#dangert").on('click',function(){
    //parent.location.reload();
    var index = parent.layer.getFrameIndex(window.name); // 获取窗口索引
    parent.layer.close(index);
});

//验证方法
function validateRule() {
    var icon = "<i class='fa fa-times-circle'></i> ";
    $("#signupFormadd").validate({
        onfocusout: function (element) { $(element).valid(); },
        rules: {
            taskTypeName: {
                required: true
            },
            taskType: {
                required: true
            },
        },
        messages: {
            taskTypeName: {
                required: icon + "请输入任务类型"
            },
            taskType: {
                required: icon + "请输入任务类型代码",
            },
        }
    })
}

//验证方法-添加任务类型参数
function validateRuleAdd() {
    var icon = "<i class='fa fa-times-circle'></i> ";
    $("#increaseForm").validate({
        onfocusout: function (element) { $(element).valid(); },
        rules: {
            taskPararmsName: {
                required: true
            },
            taskPararms: {
                required: true
            },
            pararmsType: {
                required: true
            },
            defaultValue: {
                required: true
            }
        },
        messages: {
            taskPararmsName: {
                required: icon + "请输入参数中文名称"
            },
            taskPararms: {
                required: icon + "请输入参数代码",
            },
            pararmsType: {
                required: icon + "请选择参数类型",
            },
            defaultValue: {
                required: icon + "请输入参数值",
            },
        }
    })
}




