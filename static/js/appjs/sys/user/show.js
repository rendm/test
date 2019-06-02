//    获取请求到的内容

var userkey = sessionStorage.getItem('usershowid');

$.ajax({
    url: share+'/irobotweb/sys/user/edit/'+userkey,
    type: "get",
    dataType: "json",
    cache: false,
    crossDomain: true,
    xhrFields: {
        withCredentials: true
    },
    success: function (json) {
        //console.log(json,'具体获取')
        var sixs = JSON.parse(json[0]);
        //console.log(sixs,'具体的详细信息');
        console.log('用户详情信息');
        console.log(sixs);


        $('#name').val(sixs.name);
        $('#username').val(sixs.username);
        $('#email').val(sixs.email);
        $('#mobile').val(sixs.mobile);
        $("#roleww").text(sixs.roleName);
       //$("#deww").text(sixs.deptName);
        $('#role').val(sixs.roleName);
        $("#address").val(sixs.liveAddress);    //详细地址
        $("#companyname").val(sixs.companyName);//企业名称
        //身份
        if(sixs.position=='superadmin'){
            $('#position').val('超级管理员');
        }else if(sixs.position=='admin'){
            $('#position').val('管理员');
        }else if(sixs.position=='developer'){
            $('#position').val('开发者');
        }else if(sixs.position=='subdeveloper'){
            $('#position').val('子开发者');
        }else if(sixs.position=='shopmanager'){
            $('#position').val('用户');
        }else if(sixs.position=='subshopmanager'){
            $('#position').val('子用户');
        }

        //开发者账号
        $('#developerid').val(sixs.developerName);
        //用户账号
        $('#customerid').val(sixs.cuserName);

        //地区
        var area='';
        if(sixs.province!=undefined && sixs.province!=null && sixs.province!=''){
            area+=sixs.province;
        }
        if(sixs.city!=undefined && sixs.city!=null && sixs.city!=''){
            area+='-'+sixs.city;
        }
        if(sixs.district!=undefined && sixs.district!=null && sixs.district!=''){
            area+='-'+sixs.district;
        }

        $('#area').val(area);

       if(sixs.status == 0){ //禁用
        $("#forbidden").attr("checked",'checked')
       }else if(sixs.status == 1){  //正常
        $("#normal").attr("checked",'checked')
       }
    }

});

//http://192.168.1.11:9090    /irobotweb/sys/dept/getDepts  //开发者
$.ajax({
    url: share+'/irobotweb/sys/dept/getDepts',
    type: "get",
    dataType: "json",
    cache: false,
    crossDomain: true,
    xhrFields: {
        withCredentials: true
    },
    success: function (json) {
		// console.log(json)
		//<option th:each="dept:${dept}" th:value="${dept.deptId}"  th:text="${dept.name}"></option>
		var options='';
		for(var i =0;i<json.length;i++){
			//console.log(json[i].name)
			options+='<option text='+json[i].deptId+' value = '+json[i].deptId+'>'+json[i].name+'</option>'
		}
		$('#deptId').append(options);
		//deptId
    }

});

//角色渲染
$.ajax({
    url: share+'/irobotweb/sys/role/getRoles',
    type: "get",
    dataType: "json",
    cache: false,
    crossDomain: true,
    xhrFields: {
        withCredentials: true
    },
    success: function (json) {
		 //console.log(json)
		//<option th:each="dept:${dept}" th:value="${dept.deptId}"  th:text="${dept.name}"></option>
		//<option th:each="role:${roles}" th:value="${role.roleId}"  th:text="${role.roleName}"></option>
		var optionsd='';
		for(var i =0;i<json.length;i++){
			//console.log(json[i].name)
			optionsd+='<option text='+json[i].roleId+'  value = '+json[i].roleId+'>'+json[i].roleName+'</option>'
		}
		$('#role').append(optionsd);
    }

});