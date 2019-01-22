window.fn = {};

var username = "";
var password = "";
var customerData ={id:'', name:''};
var customerDataArray = [];
var listOfCustomerIds = [];

window.fn.open = function() {
  var menu = document.getElementById("menu");
  menu.open();
};

window.fn.load = function(page) {
  var content = document.getElementById("content");
  var menu = document.getElementById("menu");
  content.load(page).then(menu.close.bind(menu));
  if (page === "home.html") {
    getCustomers();
  }
};

function addCustomer() {
  if (
    $("#FirstName").val() != "" &&
    $("#LastName").val() != "" &&
    $("#Email").val() != "" &&
    $("#PhoneNumber").val() != "" &&
    $("#Commission").val() != ""
  ) {
    var customer = {
      FirstName: $("#FirstName").val(),
      LastName: $("#LastName").val(),
      Email: $("#Email").val(),
      PhoneNumber: $("#PhoneNumber").val(),
      Commission: $("#Commission").val(),
      Product: $("#Product").val()
    };
    SiteUtils.loading("Saving...");
    $.ajax({
      type: "POST",
      url: "http://localhost:52551/api/createcustomer",
      data: customer,
      headers: {
        Authorization: "Basic " + btoa(username + ":" + password)
      },
      success: function(result) {
        SiteUtils.loadingOff();
        fn.load("home.html");
        getCustomers();
        ons.notification.alert(result);
      },
      error: function(result) {
        SiteUtils.loadingOff();
        ons.notification.alert(result);
      }
    });
  } else {
    ons.notification.alert("Some required fields have not been filled.");
  }
}

function updateCustomer() {
  if (
    $("#FirstName").val() != "" &&
    $("#LastName").val() != "" &&
    $("#Email").val() != "" &&
    $("#PhoneNumber").val() != "" &&
    $("#Commission").val() != ""
  ) {
    var customer = {
      CustomerId: $("#CustomerId").val(),
      FirstName: $("#FirstName").val(),
      LastName: $("#LastName").val(),
      Email: $("#Email").val(),
      PhoneNumber: $("#PhoneNumber").val(),
      Commission: $("#Commission").val(),
      Product: $("#Product").val()
    };
    SiteUtils.loading("Updating...");
    $.ajax({
      type: "POST",
      url: "http://localhost:52551/api/updatecustomer",
      data: customer,
      headers: {
        Authorization: "Basic " + btoa(username + ":" + password)
      },
      success: function(result) {
        SiteUtils.loadingOff();
        fn.load("home.html");
        getCustomers();
        ons.notification.alert(result);
      },
      error: function(result) {
        SiteUtils.loadingOff();
        ons.notification.alert(result);
      }
    });
  } else {
    ons.notification.alert("Some required fields have not been filled.");
  }
}

function getCustomers() {
  SiteUtils.loading("Please wait...");
  $.ajax({
    type: "GET",
    url: "http://localhost:52551/api/getallcustomers",
    headers: {
      Authorization: "Basic " + btoa(username + ":" + password)
    },
    success: function(result) {
      $("#Customers").empty();
      $("#Customers").append("<ons-list-header style='font-size:20px'; font-weight:bold>Customer list</ons-list-header>");
      $.each(result, function(index, row) {
        $("#Customers").append(
          "<ons-list-item class='Customer-record' tappable onclick='drillDown(" +
            row.CustomerId +
            ")'>" +
            row.FullName +
            "</ons-list-item>"
        );
      });
      SiteUtils.loadingOff();
    }
  });
}

function search() {
  var query = $("#searchQuery").val();
  query = query == "" ? "All" : query;
  SiteUtils.loading("Please wait...");
  $.ajax({
    type: "GET",
    url: "http://localhost:52551/api/getcustomerbyquery/" + query,
    headers: {
      Authorization: "Basic " + btoa(username + ":" + password)
    },
    success: function(result) {
      $("#Customers").empty();
      $("#Customers").append("<ons-list-header style='font-size:20px'; font-weight:bold>Customer list</ons-list-header>");
      $.each(result, function(index, row) {
        index++;
        $("#Customers").append(
          "<ons-list-item class='Customer-record' tappable onclick='drillDown(" +
            row.CustomerId +
            ")'>" +
            row.FullName +
            "</ons-list-item>"
        );
      });
      SiteUtils.loadingOff();
    }
  });
}

function login() {
  if($("#Username").val() != "" && $("#Password").val() != ""){
    username = $("#Username").val();
    password = $("#Password").val();
    var user = {
      Username: $("#Username").val(),
      Password: $("#Password").val()
    };
    SiteUtils.loading("Logging in...");
    $.ajax({
      type: "POST",
      url: "http://localhost:52551/api/security/login",
      data: user,
      headers: {
        Authorization: "Basic " + btoa(user.Username + ":" + user.Password)
      },
      success: function(result) {
        SiteUtils.loadingOff();
        fn.load("home.html");
      },
      error: function(result) {
        SiteUtils.loadingOff();
        if(result.status != "0"){
          ons.notification.alert(result.responseText);
        }
      },
      complete: function(jqXHR) {
        SiteUtils.loadingOff();
        if (jqXHR.status == "401") {
          ons.notification.alert("Username/Password mismatch");
          return;
        }
        if (jqXHR.status == "0"){
          ons.notification.alert("Error: Connection lost");
          return;
        }
      }
    });
  }
  else{
    ons.notification.alert("Some required fields have not been filled.");
  }
}

function validate(tag) {
  if ($("#" + tag).val() == "") {
    $("#" + tag).addClass("required");
  } else {
    $("#" + tag).removeClass("required");
  }
}

function showConfirm(action) {
  if (action == 1) {
    ons.notification.confirm("Save customer?").then(function(response) {
      if (response == 1) {
        addCustomer();
      } else {
        return;
      }
    });
  }
   else {
    ons.notification.confirm("Update customer?").then(function(response) {
      if (response == 1) {
        updateCustomer();
      } else {
        return;
      }
    });
  }
}

function drillDown(customerId) {
  SiteUtils.loading("Please wait...");
  $.ajax({
    type: "GET",
    url: "http://localhost:52551/api/getcustomer/" + customerId,
    headers: {
      Authorization: "Basic " + btoa(username + ":" + password)
    },
    success: function(result) {
      SiteUtils.loadingOff();
      fn.load("add.html");
      $(document).ready(function() {
        populateFields(result);
      });
    }
  });
}

function populateFields(result) {
  $("#CustomerId").val(result.CustomerId);
  $("#FirstName").val(result.FirstName);
  $("#LastName").val(result.LastName);
  $("#Email").val(result.Email);
  $("#PhoneNumber").val(result.PhoneNumber);
  $("#Commission").val(result.Commission);
  $("#Product").val(result.Product);
  $("#btnAddOrUpdateCustomer").text("Update");
  $("#btnAddOrUpdateCustomer").attr("onclick", "showConfirm(2)");
}

function deleteCustomer(){
  ons.notification.confirm("Delete customer(s)?").then(function(response) {
    if (response == 1) {
      SiteUtils.loading("Deleting...");
      $.ajax({
        type: "POST",
        url: "http://localhost:52551/api/deletecustomer",
        data:{'':listOfCustomerIds},
        headers: {
          Authorization: "Basic " + btoa(username + ":" + password)
        },
        success: function(result) {
          SiteUtils.loadingOff();
          ons.notification.alert(result);
          //reset everything
          getCustomers();
          $("#select").text("Select");
          $("#selectAll").hide();
          listOfCustomerIds = [];
          $("#btnRemove").hide();
        }
      });
    } else {
      return;
    }
  });
}

function select(){
  if($("#select").text().trim() == "Edit"){ //btnSelect
    $("#select").text("Cancel");
    $("#searchQuery").attr("disabled", true);
    $("#btnAdd").attr("disabled", true);
    $("#select").css("font-size","15px");
    $("#selectAll").show();
    customerData ={id:'', name:''};
    customerDataArray = [];
     var customers = document.getElementsByClassName('Customer-record');
     $.each(customers, function(index,row) {
       customerData ={id:'', name:''};
       var arrayToGetIndex = row.outerHTML.split(" ")[4].split("=")[1].split("(");
       var id = arrayToGetIndex[1].replace(")","").replace("\"", "");
       customerData.id = id;
       customerData.name = row.innerText.trim();
       customerDataArray.push(customerData);
     });
    $("#Customers").empty();
    $("#Customers").append("<ons-list-header style='font-size:20px'; font-weight:bold>Customer list</ons-list-header>");
    $.each(customerDataArray, function(index,row) {
      $("#Customers").append(
        "<ons-list-item class='Customer-record' onclick='selected(" +row.id +")' tappable> <input id="+row.id+" class='checkmark' type='checkbox'/>" +
          row.name +
          "</ons-list-item>"
      );
    })
  }
  else{ //btnCancel
    $("#select").text("Edit");
    $("#searchQuery").attr("disabled", false);
    $("#btnAdd").attr("disabled", false);
    $("#selectAll").hide();
    listOfCustomerIds = [];
    if( $("#btnRemove").show()){
      $("#btnRemove").hide();
    }
    $("#Customers").empty();
    $("#Customers").append("<ons-list-header style='font-size:20px'; font-weight:bold>Customer list</ons-list-header>");
    $.each(customerDataArray, function(index,row) {
      $("#Customers").append(
        "<ons-list-item class='Customer-record' tappable onclick='drillDown(" +row.id +")'>" +
          row.name +
          "</ons-list-item>"
      );
    });
  }
}

function selected(id){
if(!listOfCustomerIds.includes(id)){
  $("#" + id).attr("checked", true);
  listOfCustomerIds.push(id);
}
else{
  listOfCustomerIds.splice( listOfCustomerIds.indexOf(id), 1 );
  $("#" + id).attr("checked", false);
}
if(listOfCustomerIds.length > 0){
  $("#btnRemove").show();
}
else{
  $("#btnRemove").hide();
}
}

function selectAll(){
  var customers = document.getElementsByClassName('Customer-record');
  $.each(customers, function(index,row) {
    var arrayToGetIndex = row.outerHTML.split(" ")[4].split("=")[1].split("(");
    var id = arrayToGetIndex[1].replace(")","").replace("\"", "");
    if(!listOfCustomerIds.includes(id)){
      $("#" + id).attr("checked", true);
      listOfCustomerIds.push(parseInt(id));
    }
    if(listOfCustomerIds.length > 0){
      $("#btnRemove").show();
    }
  });
}

