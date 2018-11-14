var piechartBlockStatus;
var piechartGeoCode;
var piechartPosition;
var piechartConcurrently
var columnChartRegister
var isComplate = true; //dvConcurrently
var district = '';
var provincial = '';
var ward = '';
var IdDistrict;
var IdWards;
var IdProvincial;
var level = 0;
var listGeocode={};
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
		IdProvincial = data.IdProvince;
		IdDistrict= data.IdDistrict;
		IdWards = data.IdWards;
		var url = '';
		if (level == 1) url = '/getProvincial';
		if (level == 2) url = '/getDistrict?idProvincial=' + IdProvincial;
		if (level == 3) url = '/getWards?idDistrict=' + IdDistrict;
		$.ajax({
			dataType: "json",
			url: url,
			success: function (data) {
				listGeocode = data;
				google.charts.setOnLoadCallback(drawGeoCode);
				google.charts.setOnLoadCallback(drawdvRegister);
				google.charts.setOnLoadCallback(onInit);
			},
			error: function (err) {
				alert('Mời bạn sử dụng chatbot để lấy đường dẫn đăng nhập và mã otp mới');
			}
		});
	},
	error: function (err) {
		alert('Mời bạn sử dụng chatbot để lấy đường dẫn đăng nhập và mã otp mới');
	}
});

function onInit() {
	piechartPosition = new google.visualization.PieChart(document.getElementById('dvPosition'));
	piechartConcurrently = new google.visualization.PieChart(document.getElementById('dvConcurrently'));
	columnChartRegister = new google.visualization.ColumnChart(document.getElementById('dvRegister'));
	getData();
};

function getData() {
	$.ajax({
		dataType: "json",
		url: "/getMemberByGroup?code=GeoCode",
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
	var objIsConcurrently
	$.ajax({
		dataType: "json",
		type: 'GET',
		data: {},
		url: "/getCountIsConcurrently",
		success: function (data) {
			objIsConcurrently = data;
			drawdvConcurrently(objIsConcurrently);
		},
		error: function (err) {
			alert('Mời bạn sử dụng chatbot để lấy đường dẫn đăng nhập và mã otp mới');
		}
	});
	$.ajax({
		dataType: "json",
		type: 'GET',
		data: {},
		url: "/getCountRegisterByDate",
		success: function (data) {
			drawdvRegister(data);
		},
		error: function (err) {
			alert('Mời bạn sử dụng chatbot để lấy đường dẫn đăng nhập và mã otp mới');
		}
	});
};

// function drawGeoCode(objGeoCode) {

// 	var dataProduct = new google.visualization.DataTable();
// 	dataProduct.addColumn('string', '');
// 	dataProduct.addColumn('number', '');

// 	//var total=0; 
// 	var len = objGeoCode.length;
// 	total=0;
// 	var str='Toàn Quốc';
// 	for (var i = 0; i < len; ++i) {
// 		//var o = new Option(objProvincials[i-1].Name,  objProvincials[i-1]._id);
// 		var name = objGeoCode[i].Provincial;
// 		if (name == "NA") {
// 			if (level == 2) {
// 				name = 'Cấp tỉnh';
// 				str=provincial;
// 			}
// 			if (level == 3) {
// 				name == 'Cấp huyện';
// 				str=district;
// 			}
// 			if (level == 4) {
// 				name = 'Cấp xã';
// 				str=ward;
// 			}
// 		}
// 		total += objGeoCode[i].Total;
// 		//var geoCode=objBlockStatus[i-1].GeoCode;
// 		dataProduct.addRow([name, objGeoCode[i].Total]);
// 		//total=total+objBlockStatus[j].Total;
// 	}
// 	document.getElementById('lblTotalUser').innerHTML= str + ' có tổng số ' + total + ' người đã kết nối vơi hệ thống.'
// 	var piechartProduct = {
// 		title: 'Thành viên phân bổ theo khu vực',
// 		chartArea: {
// 			width: 450,
// 			height: 300,
// 		},
// 		hAxis: {
// 			title: 'Số người đăng ký',
// 			minValue: 0
// 		},
// 		vAxis: {
// 			title: 'Khu vực'
// 		},
// 		bars: 'horizontal',
// 	};
// 	piechartGeoCode.draw(dataProduct, piechartProduct);
// };

function drawGeoCode(objGeoCode) {
	var len = objGeoCode.length;
	total = 0;
	var str = 'Toàn Quốc';
	var arr=[['', '', {type: 'number', role: 'annotation'}]];
	for (var i = 0; i < len; ++i) {
		//var o = new Option(objProvincials[i-1].Name,  objProvincials[i-1]._id);
		var name = objGeoCode[i].Provincial;
		if (name == "NA") {
			if (level == 2) {
				name = 'Cấp tỉnh';
				str = provincial;
			}
			if (level == 3) {
				name == 'Cấp huyện';
				str = district;
			}
			if (level == 4) {
				name = 'Cấp xã';
				str = ward;
			}
		}
		for(a=0; a<listGeocode.length; a++){
			if(listGeocode[a].Name==name){
				listGeocode[a]=0;
			}
		}
		total += objGeoCode[i].Total;
		//var geoCode=objBlockStatus[i-1].GeoCode;
		arr.push([name, objGeoCode[i].Total, objGeoCode[i].Total]);
		//total=total+objBlockStatus[j].Total;
	}
	for (a = 0; a < listGeocode.length; a++) {
		if (listGeocode[a]!=0)
			arr.push([listGeocode[a].Name, 0, 0]);
	}
	document.getElementById('lblTotalUser').innerHTML = str + ' có tổng số ' + total + ' người đã kết nối vơi hệ thống.'
	var data = google.visualization.arrayToDataTable(arr);
	var options = {
		title: 'Thành viên phân bổ theo khu vực',
		
		bar: { groupWidth: '90%' },
	};
	var chart = new google.visualization.ColumnChart(document.getElementById('dvGeoCode'));
	chart.draw(data, options);
	console.log(listGeocode);
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

function drawdvConcurrently(objIsConcurrently) {

	var dataProduct = new google.visualization.DataTable();
	dataProduct.addColumn('string', 'Trạng thái');
	dataProduct.addColumn('number', 'Thành viên');
	var t1=0;
	var t2=0;
	//var total=0; 
	var len = objIsConcurrently.length;
	for (var i = 0; i < len; ++i) {
		//var o = new Option(objProvincials[i-1].Name,  objProvincials[i-1]._id);
		if (objIsConcurrently[i].IsConcurrently==null)
			t1 += objIsConcurrently[i].count;
		else
			t2 += objIsConcurrently[i].count;
		//var geoCode=objBlockStatus[i-1].GeoCode;
		//total=total+objBlockStatus[j].Total;
	}
	dataProduct.addRow(['Cán bộ Không kiêm nhiệm', t1]);
	dataProduct.addRow(['Cán bộ kiêm nhiệm', t2]);
	var piechartProduct = {
		title: 'Tỉ lệ cán bộ hội kiêm nhiệm',
		width: 447,
		height: 300,
		is3D: true
	};
	piechartConcurrently.draw(dataProduct, piechartProduct);
};

function drawdvRegister(data) {

	var arr=[['', '', {type: 'number', role: 'annotation'}]];
	//var total=0; 
	var len = data.length;
	for (var i = 0; i < len; ++i) {
		//var o = new Option(objProvincials[i-1].Name,  objProvincials[i-1]._id);
		var date = dateFromDay(data[i]._id).toLocaleDateString();
		//var geoCode=objBlockStatus[i-1].GeoCode;
		arr.push([date, data[i].Total, data[i].Total]);
		//total=total+objBlockStatus[j].Total;
	}
	var data = google.visualization.arrayToDataTable(arr);
	var options = {
		title: 'Tổng số thành viên đăng ký theo ngày',
		bar: {
			groupWidth: '90%'
		},
	};
	var chart = new google.visualization.ColumnChart(document.getElementById('dvRegister'));
	chart.draw(data, options);
};

function dateFromDay(day) {
	var now= new Date();
	var date = new Date(now.getFullYear(),0, day); // initialize a date in `year-01-01`
	return new Date(date.setDate(day)); // add the number of days
}
