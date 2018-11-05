//https://nongsanvn.herokuapp.com/getProductCMS
var cboProvincial = document.getElementById("cboProvincial");
var cboDistricts = document.getElementById("cboDistricts");
var cboWards = document.getElementById("cboWards");
var datatable = $('#grvResult').DataTable({
    scrollY: 400,
    scrollX: true,
    scrollCollapse: true,
    select: true,
    dom: 'Bfrtip',
    buttons: [{
            extend: 'excelHtml5',
        },
        {
            extend: 'pdfHtml5',
        }
    ],
});
level1 = {
    title: 'Danh sách 63 tỉnh thành và 4 đơn vị tương đương',
    col1: 'TW và Tỉnh - Đơn vị tương đương',
    col2: 'Chức danh',
    col3: 'Số lượng người điểm danh',
    level: '1',
};
level2 = {
    title: 'Danh sách các huyện và đơn vị tương đương',
    col1: 'Tỉnh và Huyện - Đơn vị tương đương',
    col2: 'Chức danh',
    col3: 'Số lượng người điểm danh',
    level: '2',
};
level3 = {
    title: 'Danh sách xã và đơn vị tương đương',
    col1: 'Huyện và xã - Đơn vị tương đương',
    col2: 'Chức danh',
    col3: 'Số lượng người điểm danh',
    level: '3',
};
level4 = {
    title: 'Danh sách các tổ ,thôn và đơn vị tương đương',
    col1: 'Xã ,tổ và thôn - Đơn vị tương đương',
    col2: 'Chức danh',
    col3: 'Số lượng người điểm danh',
    level: '4',
};
level5 = {
    title: 'Danh sách điểm danh',
    col1: 'Họ và tên',
    col2: 'Chức danh',
    col3: 'Xã',
    level: '5',
};
var objInfo;
var district = '';
var provincial = '';
var ward = '';
var level = 4;
function drawTable(objMembers) {
    for (var i = 0; i < objMembers.length; i++) {
        arr = Object.values(objMembers[i]);
        var pos = '';
        Object.keys(arr[2]).forEach(function (k) {
            pos+= k + " (" + arr[2][k] + ") ,";
        });
        datatable.row.add([arr[0], pos, arr[1]]).draw(false);
    }
    datatable.draw();
}
function render(level){
    document.getElementById('col1').innerText = level.col1;
    document.getElementById('col2').innerText = level.col2;
    document.getElementById('title').innerText = level.title;
    document.getElementById('col3').innerText = level.col3;
}
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
            var o = new Option("Tất cả - Chọn Tỉnh/TP", "0");
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
                window.location.href = 'login.html';
            }
        }
    });
};

function onCboProvincialsChange(event) {
    if (event.selectedIndex > 0) {
        var value = event.value;
        var name = event.options[event.selectedIndex].text;
        $.ajax({
            dataType: "json",
            url: "/getProvincialCount",
            data: {Provincial:name},
            success: function (data) {
                render(level2);
                datatable.clear();
                drawTable(data);
            }
        });
        LoadCboDistricts(value);
    }else{
        $.ajax({
            dataType: "json",
            url: "/getCountryCount",
            data: {},
            success: function (data) {
                render(level1);
                datatable.clear();
                drawTable(data);
            }
        });
    }
};

function LoadCboDistricts(idProvincial) {
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
            var o = new Option("Tất cả - Chọn Quận/Huyện", "0");
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
                window.location.href = 'login.html';
            }
        }
    });
};

function onCboDistrictsChange(event) {
    if (event.selectedIndex > 0) {
        var value = event.value;
        name = event.options[event.selectedIndex].text;
        LoadCboWards(value);
        $.ajax({
            dataType: "json",
            url: "/getDistrictCount",
            data: {
                District: name
            },
            success: function (data) {
                render(level3);
                datatable.clear();
                drawTable(data);
            }
        });
    }else{
        $.ajax({
            dataType: "json",
            url: "/getProvincialCount",
            data: {
                Provincial: provincial
            },
            success: function (data) {
                render(level2);
                datatable.clear();
                drawTable(data);
            }
        });
        LoadCboWards();
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
            var o = new Option("Tất cả- Chọn Xã/Phường", "0");
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
                window.location.href = 'login.html';
            }
        }
    });
};
function onCboWardsChange(event) {
    name = event.options[event.selectedIndex].text;
    if (event.selectedIndex > 0) {
        var value = event.value;
        $.ajax({
            dataType: "json",
            url: "/getWardCount",
            data: {
                Ward: name
            },
            success: function (data) {
                render(level4);
                datatable.clear();
                drawTable(data);
            }
        });
    }else{
        $.ajax({
            dataType: "json",
            url: "/getDistrictCount",
            data: {
                District: district
            },
            success: function (data) {
                render(level3);
                datatable.clear();
                drawTable(data);
            }
        });
        LoadCboDistricts();
    }
};
function LoadWeb(){
    if(level==1){
        LoadCboProvincials();
        $.ajax({
            dataType: "json",
            url: "/getCountrycount",
            success: function (data) {
                render(level1);
                datatable.clear();
                drawTable(data);
            }
        });
    }
    if(level==2){
        cboProvincial = document.getElementById("cboProvincial");
        var o = new Option(provincial, "0");
        cboProvincial.remove(0);
        cboProvincial.append(o);
        cboProvincial.disabled=true;
        $.ajax({
            dataType: "json",
            url: "/getProvincialCount",
            data: {
                Provincial: provincial
            },
            success: function (data) {
                render(level2);
                datatable.clear();
                drawTable(data);
            }
        });
        $.ajax({
            dataType: "json",
            url: "/getProvincial",
            success: function (data) {
                objProvincials=data;
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
    if (level == 3) {
        var cboProvincial = document.getElementById("cboProvincial");
        var o = new Option(provincial, "0");
        cboProvincial.remove(0);
        cboProvincial.append(o);
        cboProvincial.disabled = true;
        var cboDistricts = document.getElementById("cboDistricts");
        o = new Option(district, "0");
        cboDistricts.remove(0);
        cboDistricts.append(o);
        cboDistricts.disabled = true;
        $.ajax({
            dataType: "json",
            url: "/getDistrictCount",
            data: {
                District: district
            },
            success: function (data) {
                render(level3);
                datatable.clear();
                drawTable(data);
            }
        });
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
    if (level == 4) {
        cboProvincial = document.getElementById("cboProvincial");
        var o = new Option(provincial, "0");
        cboProvincial.remove(0);
        cboProvincial.append(o);
        cboProvincial.disabled = true;
        cboDistricts = document.getElementById("cboDistricts");
        o = new Option(district, "0");
        cboDistricts.remove(0);
        cboDistricts.append(o);
        cboDistricts.disabled = true;
        o = new Option(ward, "0");
        cboWards.remove(0);
        cboWards.append(o);
        cboWards.disabled = true;
        $.ajax({
            dataType: "json",
            url: "/getWardCount",
            data: {
                Ward: ward
            },
            success: function (data) {
                render(level4);
                datatable.clear();
                drawTable(data);
            }
        });
    }
    if (level == 5) {
        cboProvincial = document.getElementById("cboProvincial");
        var o = new Option(provincial, "0");
        cboProvincial.remove(0);
        cboProvincial.append(o);
        cboProvincial.disabled = true;
        cboDistricts = document.getElementById("cboDistricts");
        o = new Option(district, "0");
        cboDistricts.remove(0);
        cboDistricts.append(o);
        cboDistricts.disabled = true;
        o = new Option(ward, "0");
        cboWards.remove(0);
        cboWards.append(o);
        cboWards.disabled = true;
        $.ajax({
            dataType: "json",
            url: "/getMemberBranch",
            data: {
                Ward: ward
            },
            success: function (data) {
                render(level5);
                datatable.clear();
                for (var i = 0; i < data.length; i++) {
                    arr = Object.values(data[i]);
                    datatable.row.add([arr[0], arr[1], arr[2]]).draw(false);
                }
                datatable.draw();
            }
        });
    }
}
info = $.ajax({
    dataType: "json",
    url: "/Info",
    type: "GET",
    dataType: "json",
    data: {},
    success: function (data) {
        level=data.Level;
        ward=data.Ward;
        provincial=data.Provincial;
        district=data.District;
        LoadWeb();
    }
});