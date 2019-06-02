var prefix = "/irobotweb/sys/user";
load();

function load() {
    $('#exampleTable').bootstrapTable({
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
                        field: 'pararmsName',
                        align: 'center',
                        title: '参数值名称',
                        formatter: function (taskTypeId) {
                            if (taskTypeId == '0') {
                                var c =  '<span class="label label-danger">禁用</span>';
                            } else if (taskTypeId == '1') {
                                var e = '<span class="label label-primary">正常</span>';
                            }else if (taskTypeId == '2') {
                                var d = '<span class="label label-primary">正常</span>';
                            }
                                return  c + e + d ;
                             
                        }
                    },*/

                    {
                        title: '备注',
                        field: 'remark',
                        align: 'center',

                        /*formatter: function (taskTypeId) {
                            if (taskTypeId == '0') {
                                var c =  '<span class="label label-danger">禁用</span>';
                            } else if (taskTypeId == '1') {
                                var e = '<span class="label label-primary">正常</span>';
                            }else if (taskTypeId == '2') {
                                var d = '<span class="label label-primary">正常</span>';
                            }
                            
                                 //未激活
                                return  c + e + d ;
                             
                        }*/
                    }]
            });
}
var showids = sessionStorage.getItem("manageshowid");
//console.log(showids,'显示id');
//  /irobotweb/sys/tasktype/query/ids

$.ajax({
    url: share+'/irobotweb/sys/tasktype/query/ids?tasktypeid='+showids,
    crossDomain: true,
    type: "get",
    dataType: "json",
    xhrFields: {
        withCredentials: true
    },
    success: function (data) { 
        var datajson = data.data;
        //console.log(datajson,'iyrqwy');
      $("#taskTypeName").val(datajson.taskTypeName);
      $("#taskType").val(datajson.taskType);
      // taskParamsDOList

        console.log('详情页面加载的参数信息');
        console.log(datajson.taskParamsDOList);

      $('#exampleTable').bootstrapTable('append', datajson.taskParamsDOList);
      $('#exampleTable').bootstrapTable('scrollTo', 'bottom');
    },
    error: function (request) {
        layer.alert("Connection error");
    },
});

//激活页面
// /** 主键  task_type_id **/
// private String taskTypeId;

// /** 任务类型名称  task_type_name **/
// private String taskTypeName;

// /** 任务类型  task_type **/
// private String taskType;

// /** 默认值  default_value **/
// private String defaultValue;

// /** 创建时间  create_time **/
// private String createTime;

// /** 创建人ID  create_user_id **/
// private String createUserId;

// /** 创建人姓名  create_user_name **/
// private String createUserName;

// /** 修改时间  update_time **/
// private String updateTime;

// /** 修改人ID  update_user_id **/
// private String updateUserId;

// /** 修改人姓名  update_user_name **/
// private String updateUserName;

// /** 状态  status **/
// private String status;

// /** 备注  remark **/
// private String remark;