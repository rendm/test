$(function() {

  //点击保存
  $("#base_save").on("click", function() {
    $.ajax({
      url: share + "/irobotweb/sys/taskscheduler/add",
      crossDomain: true,
      type: "POST",
      xhrFields: {
        withCredentials: true
      },
      contentType: "application/json",
      data: JSON.stringify($("#basicInfoForm").serializeObject()),
      success: function(data) {

        console.info('保存返回的消息');
          console.info(data);

        if (data.code == 200) {
          parent.layer.msg(data.msg);
          window.parent.location.reload();
        } else {
          parent.layer.alert(data.msg);
        }
      },
      error: function(request) {
        layer.alert("Connection error");
      }
    });
  });

  //$("#cancel").on("click", function() {
    //console.log("");
    //window.parent.location.reload();
  //});
});

$.fn.serializeObject = function() {
  var o = {};
  var a = this.serializeArray();
  $.each(a, function() {
    if (o[this.name]) {
      if (!o[this.name].push) {
        o[this.name] = [o[this.name]];
      }
      o[this.name].push(this.value || "");
    } else {
      o[this.name] = this.value || "";
    }
  });
  return o;
};

$("#corntype").change(function(e) {
  //console.log($(this).children("option:selected").val());

  var selected = $(this).children("option:selected");

  if (selected.val() == 1) {
    // addhtml('second','秒');
    // addhtml('min','分');
    // addhtml('hour','小时');
    $("#cornform").html("");
    $("#jobcorn").attr("disabled", true);
    $("#jobcornname").attr("disabled", true);

    addhtml2();

  } else if (selected.val() == 2) {
    $("#cornform").html("");
    $("#jobcorn").attr("disabled", true);
    $("#jobcornname").attr("disabled", true);

    addhtml3();

  } else if (selected.val() == 3) {
    $("#cornform").html("");
    $("#jobcorn").attr("disabled", false);
    $("#jobcornname").attr("disabled", false);
  }
});

$(document).on("change", "#cornunit", function() {
  //console.log("cornunit");
  //console.log($("#cornunit").children("option:selected").val());

  var selected = $("#cornunit").children("option:selected");
  if (selected.val() == 1) {
    var html;
    for (s = 0; s <= 59; s++) {
      html += '<option value="' + s + '">' + s + "</option>";
    }

    $("#corntime").append(html);
  } else if (selected.val() == 2) {
    var html;
    for (s = 0; s <= 59; s++) {
      html += '<option value="' + s + '">' + s + "</option>";
    }

    $("#corntime").append(html);
  } else if (selected.val() == 3) {
    var html;
    for (s = 0; s <= 23; s++) {
      html += '<option value="' + s + '">' + s + "</option>";
    }

    $("#corntime").append(html);
  }
});

$(document).on("change", "#corntime", function() {
  //console.log("corntime");
  //console.log($("#corntime").children("option:selected").val());

  var corntype = $("#corntype").children("option:selected").val();
  var cornunitvalue = $("#cornunit").children("option:selected").val();
  var cornunittext = $("#cornunit").children("option:selected").text();
  var corntime = $("#corntime").children("option:selected").val();

  var jobcorn = "";
  var jobcorname = "";
  if (corntype == "1") {
    jobcorname = "每隔" + corntime + cornunittext + "执行一次";
  }
  if (cornunitvalue == 1) {
    jobcorn = "0/" + corntime + " * * * * ?";
  }
  if (cornunitvalue == 2) {
    jobcorn = "0 0/" + corntime + " * * * ?";
  }

  if (cornunitvalue == 1) {
    jobcorn = "0 0 0/" + corntime + " * * ?";
  }

  $("#jobcornname").val(jobcorname);
  $("#jobcorn").val(jobcorn);

  //console.log($("#jobcornname").val());
  //console.log($("#jobcorn").val());
});

$(document).on("change", "#corntime", function() {});

/**
 *
 * @param {id} x
 * @param {name} y
 */

function addhtml(id, name) {
  var html;
  html = '<div class="form-group">';
  html = html + '<label class="col-sm-3 control-label">' + name + ":</label>";
  html = html + '<div class="col-sm-8">';
  html =
    html +
    '<input type="text" class="layui-input  " id="' +
    id +
    '" name="' +
    id +
    '"  placeholder="' +
    name +
    '" />';
  html = html + "</div></div>";
  $("#cornform").append(html);
}

function addhtml3() {
  var html;
  html = '<div class="form-group">';
  html = html + '<label class="col-sm-3 control-label">秒:</label>';
  html = html + '<div class="col-sm-8">';
  html +=
    '<select name="seconds" id="seconds"  lay-filter="myselect"  class="form-control "  >';

  for (s = 0; s <= 59; s++) {
    html += '<option value="' + s + '">' + s + "</option>";
  }
  html += "</select>";

  html = html + "</div></div>";

  var minutes;
  minutes = '<div class="form-group">';
  minutes = minutes + '<label class="col-sm-3 control-label">分:</label>';
  minutes = minutes + '<div class="col-sm-8">';
  minutes +=
    '<select name="minutes" id="minutes"  lay-filter="myselect"  class="form-control "  >';

  for (s = 0; s <= 59; s++) {
    minutes += '<option value="' + s + '">' + s + "</option>";
  }
  minutes += "</select>";

  minutes = minutes + "</div></div>";

  var hours;
  hours = '<div class="form-group">';
  hours = hours + '<label class="col-sm-3 control-label">时:</label>';
  hours = hours + '<div class="col-sm-8">';
  hours +=
    '<select name="hours" id="hours"  lay-filter="myselect"  class="form-control "  >';

  for (s = 0; s <= 59; s++) {
    hours += '<option value="' + s + '">' + s + "</option>";
  }
  hours += "</select>";

  hours = hours + "</div></div>";

  var days;
  days = '<div class="form-group">';
  days = days + '<label class="col-sm-3 control-label">天:</label>';
  days = days + '<div class="col-sm-8">';
  days +=
    '<select name="hours" id="hours"  lay-filter="myselect"  class="form-control "  >';

  for (s = 0; s <= 59; s++) {
    days += '<option value="' + s + '">' + s + "</option>";
  }
  days += "</select>";

  days = days + "</div></div>";

  $("#cornform").append(html);
  $("#cornform").append(minutes);
  $("#cornform").append(hours);
  $("#cornform").append(days);
}

function addhtml2() {
  var html;
  html = '<div class="form-group">';
  html = html + '<label class="col-sm-3 control-label">时间单位 :</label>';
  html = html + '<div class="col-sm-8">';
  html +=
    '<select name="cornunit" id="cornunit"  lay-filter="myselect"  class="form-control "  >';
  html +=
    '<option value="0">请选择单位</option><option value="1">秒</option><option value="2">分</option><option value="3">时</option>';
  html += "</select>";
  html += "</div></div>";
  html += '<div class="form-group">';
  html += '<label class="col-sm-3 control-label">值 :</label>';
  html += '<div class="col-sm-8">';
  html +=
    ' <select name="corntime" id="corntime"  lay-filter="myselect"  class="form-control "  >';
  //  html += '<option value="' + 0+ '">' + 0 + '</option>';

  html = html + "</select></div></div>";

  $("#cornform").append(html);
}

function generateCron() {
  if ($("#corn").selected.val() == 1) {
    //console.log("corntime");
    //console.log($("#corntime").children("option:selected").val());

    var seconds = $("#seconds").children("option:selected").val();
    var minutes = $("#minutes").children("option:selected").val();
    var hours = $("#hours").children("option:selected").val();
    var days = $("#days").children("option:selected").val();

    var jobcorn = "";
    var jobcorname = "";
  }
}
