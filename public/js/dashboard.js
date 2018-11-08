var piechartBlockStatus;
var piechartGeoCode;
var piechartPosition;
var isComplate = true;
var level;
$.ajax({
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
		google.charts.setOnLoadCallback(onInit);
	},
	error: function (err) {
		alert('Mời bạn sử dụng chatbot để lấy đường dẫn đăng nhập và mã otp mới');
	}
});

function onInit() {
	piechartGeoCode = new google.visualization.PieChart(document.getElementById('dvGeoCode'));
	piechartPosition = new google.visualization.PieChart(document.getElementById('dvPosition'));
	lblTotalUser = document.getElementById('lblTotalUser');
	getData();
};

function getData() {

	var objBlockStatus;
	var objGeoCode;
	$.ajax({
		dataType: "json",
		url: "/getMemberByGroup?code=GeoCode",
		data: objGeoCode,
		success: function (data) {
			objGeoCode = data;
			drawGeoCode(objGeoCode);
		},
		error: function (err) {
			alert('Mời bạn sử dụng chatbot để lấy đường dẫn đăng nhập và mã otp mới');
		}
	});

	var objPosition;
	$.ajax({
		dataType: "json",
		url: "/getMemberByGroup?code=Position",
		data: objPosition,
		success: function (data) {
			objPosition = data;
			drawPosition(objPosition);
		},
		error: function (err) {
			alert('Mời bạn sử dụng chatbot để lấy đường dẫn đăng nhập và mã otp mới');
		}
	});
};

function drawGeoCode(objGeoCode) {

	var dataProduct = new google.visualization.DataTable();
	dataProduct.addColumn('string', 'Trạng thái');
	dataProduct.addColumn('number', 'Thành viên');

	//var total=0; 
	var len = objGeoCode.length;
	total=0;
	var str='Toàn Quốc';
	for (var i = 0; i < len; ++i) {
		//var o = new Option(objProvincials[i-1].Name,  objProvincials[i-1]._id);
		var name = objGeoCode[i].Provincial;
		if (name == "NA") {
			if (level == 2) {
				name = 'Cấp tỉnh';
				str=provincial;
			}
			if (level == 3) {
				name == 'Cấp huyện';
				str=district;
			}
			if (level == 4) {
				name = 'Cấp xã';
				str=ward;
			}
		}
		total += objGeoCode[i].Total;
		//var geoCode=objBlockStatus[i-1].GeoCode;
		dataProduct.addRow([name, objGeoCode[i].Total]);
		//total=total+objBlockStatus[j].Total;
	}
	lblTotalUser=str+ ' có tổng số ' + total +' người đã kết nối vơi hệ thống.'


	var piechartProduct = {
		title: 'Thành viên phân bổ theo khu vực',
		width: 450,
		height: 300,
		is3D: true
	};
	piechartGeoCode.draw(dataProduct, piechartProduct);
};

function drawPosition(objPosition) {

	var dataProduct = new google.visualization.DataTable();
	dataProduct.addColumn('string', 'Trạng thái');
	dataProduct.addColumn('number', 'Thành viên');

	//var total=0; 
	var len = objPosition.length;
	for (var i = 0; i < len; ++i) {
		//var o = new Option(objProvincials[i-1].Name,  objProvincials[i-1]._id);
		var name = objPosition[i].Position;
		//var geoCode=objBlockStatus[i-1].GeoCode;
		dataProduct.addRow([name, objPosition[i].Total]);
		//total=total+objBlockStatus[j].Total;
	}
	var piechartProduct = {
		title: 'Thành viên phân bổ theo chức vụ',
		width: 447,
		height: 300,
		is3D: true
	};
	piechartPosition.draw(dataProduct, piechartProduct);
};
