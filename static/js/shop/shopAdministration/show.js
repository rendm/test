
    $('#uploadImg').attr('src',share+'/irobotweb/account/query/headimage')

    var shopshowid = sessionStorage.getItem('shopshowid');

    $.ajax({
        url: share+'/irobotweb/sys/shop/query/ids?shopid='+shopshowid,
        crossDomain: true,
        type: "get",
        dataType: "json",
        async:false,
        xhrFields: {
            withCredentials: true
        },

        success: function (data) {


            $("#shopId").val(data.data.shopId);
            $("#shopName").val(data.data.shopName);
            $("#shopcontacts").val(data.data.shopcontacts);
            $("#mobile").val(data.data.mobile);
            $("#phone").val(data.data.phone);
            $("#email").val(data.data.email);
            $("#address").val(data.data.address);
            $("#industry").val(data.data.industry);
            //$("#industr").val(data.data.industr);//店铺主营 去掉该字段

            $("#deviceDeveloperId").val(data.data.deviceDeveloperId);
            $("#parentShopId").val(data.data.parentShopId);
            $("#shopmanagerId").val(data.data.shopmanagerId);

            var province =data.data.provinceName;

            if (province!=null && province.length>0 )
            {   $("#datogg").distpicker('destroy');
                $('#datogg').distpicker({          //再初始化
                    province: data.data.provinceName,
                    city: data.data.cityName,
                    district: data.data.areaName
                });
            } else {
                $("#datogg").distpicker('destroy');
                $('#datogg').distpicker({
                    autoSelect: false
                });


            }

            //所属开发者
            $('#deviceDeveloperId').val(data.data.developerName);
            //所属用户
            $('#shopmanager').val(data.data.shopuserName);

            if(data.data.status == true){
                $("#delFlag1").attr("checked",'checked')
            }else{
                $("#delFlag2").attr("checked",'checked')
            }
           // load();
            robotBind();

            shopManager();

        },
    });


        function load() {

            setTimeout(function(){
                robotBind();
            },10);

            setTimeout(function(){
                shopManager();
            },100);
        }

        //机器人绑定列表
        function robotBind() {
            var shopshowid = sessionStorage.getItem('shopshowid');
            $('#exampleTable').bootstrapTable( {
                ajaxOptions: {
                    xhrFields: {        //跨域
                        withCredentials: true
                    },
                    crossDomain: true,
                    async:false,
                    jsonp: "callback",
                    jsonpCallback: "success_jsonpCallback",
                },
                type : "GET",
                url: share +'/irobotweb/sys/robot/query/list',
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
                height: $(window).height()-400,
                queryParams: function (params) {
                    //这里的键的名字和控制器的变量名必须一直，这边改动，控制器也需要改成一样的
                    var temp = {
                        rows: params.pageSize,                         //页面大小
                        page: params.pageNumber,   //页码
                        sortOrder: 'asc',
                        shopid:shopshowid
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
                    //{
                    //    field: 'name',
                    //    align: 'center',
                    //    title: '设备名称'
                    //},
                    {
                        field: 'robotName',
                        align: 'center',
                        title: '机器人名称'
                    },
                    {
                        field: 'hardwearNo',
                        align: 'center',
                        title: '硬件编号'
                    },
                    {
                        field: 'status',
                        align: 'center',
                        title: '状态',
                        align: 'center',
                        formatter: function (value, row, index) {

                                return '<span class="label label-primary">已绑定</span>';

                        }
                    }]
            });
        }

        //店铺管理者列表
        function shopManager() {


            var shopid = sessionStorage.getItem('shopshowid');
            
            var url=share + '/irobotweb/sys/shop/shopmanagerlist?shopid='+shopid;
            //alert(url);
            //alert(shopid);
            $('#shopmanagerTable').bootstrapTable( {
                ajaxOptions: {
                    xhrFields: {        //跨域
                        withCredentials: true
                    },
                    crossDomain: true,
                    async:false,
                    jsonp: "callback",
                    jsonpCallback: "success_jsonpCallback1",
                },
                type : "GET",
                url: url,
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
                height: $(window).height()-400,
                queryParams: function (params) {
                    //这里的键的名字和控制器的变量名必须一直，这边改动，控制器也需要改成一样的
                    var temp = {
                        rows: params.pageSize,                         //页面大小
                        page: params.pageNumber,
                        sortOrder: 'asc',
                        shopid: shopid
                    };
                    return temp;
                },
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
                        field: 'shopmanager',
                        align: 'center',
                        title: '管理者ID'
                    },
                    {
                        field: 'shopmanagername',
                        align: 'center',
                        title: '管理者姓名'
                    }]
            });
        }
    


