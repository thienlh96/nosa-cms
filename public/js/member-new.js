//https://nongsanvn.herokuapp.com/getMemberCMS
var idatadetail = null;
var cboProvincial = document.getElementById("cboProvincial");
var cboPosition = document.getElementById("cboPosition");
var cboDistricts = document.getElementById("cboDistricts");
var cboWards = document.getElementById("cboWards");
var Mydistrict = '';
var Myprovincial = '';
var Myward = '';
var Mylevel = 4;
var datatable;
function cboLevelChange(event) {
    var value = event.value;
    if (value == '1') {
        setDataPosition(arrPosition[0], arrLayer[0]);
    } else if (value == '2') {
        setDataPosition(arrPosition[1], arrLayer[1]);
    } else if (value == '3') {
        setDataPosition(arrPosition[2], arrLayer[2]);
    } else if (value == '4') {
        setDataPosition(arrPosition[3], arrLayer[3]);
    } else {
        setDataPosition(arrPosition[4], arrLayer[4]);
    }
    /// xử lý chức danh kiêm nhiệm
    var valuePosition = cboPosition[cboPosition.selectedIndex].text;
};

function setDataPosition(position, layer) {
    while (cboPosition.length > 0) {
        cboPosition.remove(0);
    }
    var o = new Option("Tất cả", "0");
    //o.selected=true;
    $("#cboPosition").append(o);
    for (var i = 0, len = position.length; i < len; ++i) {
        var o = new Option(position[i], layer[i]);
        $("#cboPosition").append(o);
    }
    var value = cboPosition[cboPosition.selectedIndex].text;
    var valueLevel = cboLevel[cboLevel.selectedIndex].value;
};

function loadPosition() {
    var position1 = [];
    var arrLayer1 = [];
    var position2 = [];
    var arrLayer2 = [];
    var position3 = [];
    var arrLayer3 = [];
    var position4 = [];
    var arrLayer4 = [];
    var position5 = [];
    var arrLayer5 = [];
    var objPosition;
    $.ajax({
        dataType: "json",
        url: "/getPosition",
        data: objPosition,
        success: function (data) {
            objPosition = data;
            for (var i = 0, len = objPosition.length; i < len; ++i) {
                var value = objPosition[i].Level;
                if (value == '1') {
                    position1.push(objPosition[i].Name);
                    arrLayer1.push(objPosition[i].Layer);
                } else if (value == '2') {
                    position2.push(objPosition[i].Name);
                    arrLayer2.push(objPosition[i].Layer);
                } else if (value == '3') {
                    position3.push(objPosition[i].Name);
                    arrLayer3.push(objPosition[i].Layer);
                } else if (value == '4') {
                    position4.push(objPosition[i].Name);
                    arrLayer4.push(objPosition[i].Layer);
                } else {
                    position5.push(objPosition[i].Name);
                    arrLayer5.push(objPosition[i].Layer);
                }
            }
            arrPosition = [position1, position2, position3, position4, position5];
            arrLayer = [arrLayer1, arrLayer2, arrLayer3, arrLayer4, arrLayer5];
            setDataPosition(arrPosition[0], arrLayer[0]);
        }
    });
};
loadPosition();

function LoadCboProvincials() {
    var selectElemRef = document.getElementById("cboProvincial");
    var objProvincials;
    $.ajax({
        dataType: "json",
        url: "/getProvincial",
        data: objProvincials,
        success: function (data) {
            objProvincials = data;
            var html = '';
            while (selectElemRef.length > 0) {
                selectElemRef.remove(0);
            }
            var o = new Option("Tất cả", "0");
            //o.selected=true;
            $("#cboProvincial").append(o);
            for (var i = 1, len = objProvincials.length + 1; i < len; ++i) {
                var o = new Option(objProvincials[i - 1].Name, objProvincials[i - 1]._id);
                $("#cboProvincial").append(o);
            }
            if (cboProvincial.length > 1) {
                document.getElementById("cboProvincial").selectedIndex = 0;
            }
        },
        error: function (err) {
            if (err.responseText == 'Unauthorized') {
                alert("Bạn đã bị time out");
            
            }
        }
    });
};
function onCboProvincialsChange(event) {
    if (event.selectedIndex > 0) {
        var value = event.value;
        LoadCboDistricts(value);
    }
};
function LoadCboDistricts(idProvincial,name) {
    var selectElemRef = document.getElementById("cboDistricts");
    var objDistricts;
    $.ajax({
        dataType: "json",
        url: "/getDistrict?idProvincial=" + idProvincial,
        data: objDistricts,
        success: function (data) {
            objDistricts = data;
            while (selectElemRef.length > 0) {
                selectElemRef.remove(0);
            }
            var o = new Option("Tất cả", "0");
            $("#cboDistricts").append(o);
            for (var i = 1, len = objDistricts.length + 1; i < len; ++i) {
                var o = new Option(objDistricts[i - 1].Name, objDistricts[i - 1]._id);
                $("#cboDistricts").append(o);
            }
            if (objDistricts.length > 1) {
                document.getElementById("cboDistricts").selectedIndex = 0;
                onCboDistrictsChange(document.getElementById("cboDistricts"));
            }
        },
        error: function (err) {
            if (err.responseText == 'Unauthorized') {
                alert("Bạn đã bị time out");
            }
        }
    });
};
function onCboDistrictsChange(event) {
    if (event.selectedIndex > 0) {
        var value = event.value;
        LoadCboWards(value);
    }
};
function LoadCboWards(idDistrict) {
    var selectElemRef = document.getElementById("cboWards");
    var objWards;
    $.ajax({
        dataType: "json",
        url: "/getWards?idDistrict=" + idDistrict,
        data: objWards,
        success: function (data) {
            objWards = data;
            while (selectElemRef.length > 0) {
                selectElemRef.remove(0);
            }
            var o = new Option("Tất cả", "0");
            $("#cboWards").append(o);
            for (var i = 1, len = objWards.length + 1; i < len; ++i) {
                var o = new Option(objWards[i - 1].Name, objWards[i - 1]._id);
                $("#cboWards").append(o);
            }
            if (objWards.length > 1) {
                document.getElementById("cboWards").selectedIndex = 0;
            }
        },
        error: function (err) {
            if (err.responseText == 'Unauthorized') {
                alert("Bạn đã bị time out");
               
            }
        }
    });
};
info = $.ajax({
    dataType: "json",
    url: "/Info",
    type: "GET",
    dataType: "json",
    data: {},
    success: function (data) {
        level = data.Level;
        ward = data.Ward;
        provincial = data.Provincial;
        district = data.District;
        Mylevel=level;
        Myprovincial=provincial;
        Mydistrict=district;
        Myward=ward;
        i = 1;
        while (level > i) {
            cboLevel.remove(i-1);
            i++;
        }
        if(level==1){
            LoadCboProvincials();
        }
        if (level ==2 ) {
            var o = new Option(provincial, provincial);
            cboProvincial.innerHTML = '<option value="0"></option>';
            cboProvincial.append(o);
            cboProvincial.disabled = true;
            cboProvincial.selectedIndex=1;
            $.ajax({
                dataType: "json",
                url: "/getProvincial",
                success: function (data) {
                    objProvincials = data;
                    for (var i = 1, len = objProvincials.length + 1; i < len; ++i) {
                        console.log(objProvincials[i - 1].Name, provincial);
                        if (objProvincials[i - 1].Name == provincial) {
                            LoadCboDistricts(objProvincials[i - 1]._id);
                            break;
                        }
                    }
                }
            });
        }
        if (level ==3) {
            var o = new Option(provincial, provincial);
            cboProvincial.innerHTML = '<option value="0"></option>';
            cboProvincial.append(o);
            cboProvincial.disabled = true;
            cboProvincial.selectedIndex = 1;
            o = new Option(district, district);
            cboDistricts.innerHTML = '<option value="0"></option>';
            cboDistricts.append(o);
            cboDistricts.disabled = true;
            cboDistricts.selectedIndex=1;
            $.ajax({
                dataType: "json",
                url: "/getDistrict",
                data: {
                    idProvincial: 'ALL'
                },
                success: function (data) {
                    for (var i = 1, len = data.length + 1; i < len; ++i) {
                        if (data[i - 1].Name == district) {
                            LoadCboWards(data[i - 1]._id);
                            break;
                        }
                    }
                }
            });
        }
        if (level ==4) {
            var o = new Option(provincial, provincial);
            cboProvincial.innerHTML = '<option value="0"></option>';
            cboProvincial.append(o);
            cboProvincial.disabled = true;
            cboProvincial.selectedIndex = 1;
            o = new Option(district, district);
            cboDistricts.innerHTML = '<option value="0"></option>';
            cboDistricts.append(o);
            cboDistricts.disabled = true;
            cboDistricts.selectedIndex = 1;
            var o = new Option(ward, ward);
            cboWards.innerHTML = '<option value="0"></option>';
            cboWards.append(o);
            cboWards.disabled = true;
            cboWards.selectedIndex=1;
        }
        SearchMember();
    },
    error: function (err) {
        alert('Mời bạn sử dụng chatbot để lấy đường dẫn đăng nhập và mã otp mới');
    }
});


function sendMess() {

    var name = "";
    var provincial = "";
    var districts = "";
    var wards = "";
    var position = "";
    var layer = "";
    var level = "";
    if ($('#txtName').val() != "" && $('#txtName').val() != undefined)
        name = $("#txtName").val();
    if (cboProvincial.selectedIndex != 0)
        provincial = cboProvincial[cboProvincial.selectedIndex].text;
    if (cboDistricts.selectedIndex != 0)
        districts = cboDistricts[cboDistricts.selectedIndex].text;
    if (cboWards.selectedIndex != 0)
        wards = cboWards[cboWards.selectedIndex].text;
    level = cboLevel.value;
    if (cboPosition.selectedIndex != 0)
        position = cboPosition[cboPosition.selectedIndex].text;

    if (txtMess.value == undefined || txtMess.value == "") {
        alert("Bạn phải nhập nội dung tin nhắn");
        txtMess.focus();
        return;
    };
    var mess = {};
    mess.Msg = txtMess.value;
    mess.phone = $("#txtPhone").val();
    mess.name = name;
    mess.provincial = provincial;
    mess.districts = districts;
    mess.wards = wards;
    mess.position = position;
    mess.level = level;
    mess.layer = "";
    //alert(objAi.Id);
    $.ajax({
        type: 'POST',
        data: JSON.stringify(mess),
        contentType: 'application/json',
        url: '/sendbroadcast.bot',
        success: function (data) {

            //console.log('success');
            alert(data.ss);
            console.log(data);

        },
        error: function (err) {
            if (err.responseText = -'Unauthorized')
                alert("Bạn đã bị time out");
            window.location.href = 'login.html';
        }
    });



}
function SearchMember() {
    if (datatable == null) {
        datatable = $('#grvResult').DataTable({
            scrollY: 400,
            scrollX: true,
            scrollCollapse: true,
            select: true,
            dom: 'Bfrtip',
            columnDefs: [{
                "searchable": false,
                "orderable": false,
                "targets": 0
            }],
            order: [
                [2, 'asc']
            ],
            buttons: [{
                    extend: 'excelHtml5',
                },
                {
                    extend: 'pdfHtml5',
                }
            ],
            ajax: {
                dataType: "json",
                url: "/getMemberCMS",
                beforeSend: loadStart,
                complete: loadStop,
                data: function (d) {
                    var name = "";
                    var provincial = "";
                    var districts = "";
                    var wards = "";
                    var position = "";
                    var level = "";
                    if ($('#txtName').val() != "" && $('#txtName').val() != undefined)
                        name = $("#txtName").val();
                    if (cboProvincial.selectedIndex != 0)
                        provincial = cboProvincial[cboProvincial.selectedIndex].text;
                    if (cboDistricts.selectedIndex != 0)
                        districts = cboDistricts[cboDistricts.selectedIndex].text;
                    if (cboWards.selectedIndex != 0)
                        wards = cboWards[cboWards.selectedIndex].text;
                    level = cboLevel.value;
                    if (cboPosition.selectedIndex != 0)
                        position = cboPosition[cboPosition.selectedIndex].text;
                    if (Mylevel == 2) {
                        provincial = Myprovincial;
                    }
                    if (Mylevel == 3) {
                        district = Mydistrict;
                    }
                    if (Mylevel >= 4) {
                        ward = Myward;
                    }
                    d.phone = $("#txtPhone").val();
                    d.name = name;
                    d.position = position;
                    d.provincial = provincial;
                    d.districts = districts;
                    d.wards = wards;
                    d.level = level;
                },
                error: function (err) {
                    if (err.responseText == 'Unauthorized') {
                        alert("Bạn đã bị time out");

                    }
                },
                dataSrc: ""
            },
            columns: [{
                    defaultContent: ""
                },
                {
                    data: 'ImgUrl',
                    render: function (data, type, row, meta) {
                        return '<img src="' + data + '" height="80" width="80">';
                    }
                },
                {
                    data: 'Name',
                    render: function (data, type, row, meta) {
                        return '<a href="#">' + data + '</a>';
                    }
                },
                {
                    data: 'Birthday',
                    render: function (data, type, row, meta) {
                        return GetBirthDay(row.Birthday);
                    }
                },
                {
                    data: 'Position',
                    defaultContent: ""
                },
                {
                    data: 'Provincial',
                    defaultContent: ""
                },
                {
                    data: 'District',
                    defaultContent: ""
                },
                {
                    data: 'Ward',
                    defaultContent: ""
                },
                {
                    data: 'Phone',
                    defaultContent: ""
                },
                {
                    data: 'Email',
                    defaultContent: ""
                },
                {
                    data: 'Blood_type',
                    defaultContent: ""
                },
                {
                    data: 'Hobby',
                    defaultContent: ""
                },
                {
                    data: 'Work',
                    defaultContent: ""
                },


            ]
        });
        datatable.on('order.dt search.dt', function () {
            datatable.column(0, {
                search: 'applied',
                order: 'applied'
            }).nodes().each(function (cell, i) {
                cell.innerHTML = i + 1;
            });
        }).draw();
    } else {
        datatable.ajax.reload();
        datatable.draw();
    }
};
function loadStart() {
    $('#loading').show();
    $('#col-sm-12').hide();
}

function loadStop() {
    $('#loading').hide();
    $('#col-sm-12').show();
}
