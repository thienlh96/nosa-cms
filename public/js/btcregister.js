//var psid = document.getElementById("psid").value;
//Chức danh


var cboType = document.getElementById("cboType");

var txtFullName = document.getElementById("txtFullName");
var stName = document.getElementById("stName");

var stBirthday = document.getElementById("stBirthday");
var txtDay = document.getElementById("txtBirthday");




var stProvincial = document.getElementById("stProvincial");
var txtProvincial = document.getElementById("txtProvincial");
var cboProvincial = document.getElementById("cboProvincial");

var stTeam = document.getElementById("stTeam");
var txtTeam = document.getElementById("txtTeam");
var cboTeam = document.getElementById("cboTeam");


var stPhone = document.getElementById('stPhone');
var txtPhone = document.getElementById('txtPhone');

var stEmail = document.getElementById('stEmail');
var txtEmail = document.getElementById('txtEmail');
var btnSend = document.getElementById('btnSend');
var reader;
var progress = document.querySelector('.percent');
var dataImg;
var nameImg;
//var position1 = ["Chủ tịch", "P. Chủ tịch thường trực", "P. Chủ tịch", "UV thường trực Đoàn chủ tịch", "Chánh văn phòng", "Phó chánh văn phòng", "Cán bộ văn phòng", "Trưởng Cổng Thánh Gióng", "Trưởng Trung tâm tình nguyện", "Trưởng Trung tâm hỗ trợ thanh niên khởi nghiệp"];
//var arrLayer1 = [1, 1, 1, 2, 2, 2, 2,2, 2, 2];

//var position2 = ["Chủ tịch", "P. Chủ tịch", "Ủy viên ban thư ký hội", "Chánh văn phòng", "Cán bộ văn phòng"];
//var arrLayer2 = [2, 3,3,3,3];

//var position3 = ["Chủ tịch", "P. Chủ tịch"];
//var arrLayer3= [3, 4];

//var position4 = ["Chủ tịch", "P. Chủ tịch"];
//var arrLayer4= [4, 5];

//var position5 = ["Chi hội trưởng", "Tổ trưởng", "Đội trưởng", "Chủ nhiệm CLB", "Trưởng nhóm"];
//var arrLayer5 = [5,5, 5, 5,5];
var arrPosition=[];
var arrLayer=[];
function getParamValue(param) {
    var urlParamString = location.search.split(param + "=");
    if (urlParamString.length <= 1) 
	{
		return "";
	}
    else {
        var tmp = urlParamString[1].split("&");
        return tmp[0];
    }
};
function resizeInCanvas(img) {
	/////////  3-3 manipulate image
	var perferedWidth = 500;
	var ratio = perferedWidth / img.width;
	var canvas = $("<canvas>")[0];
	canvas.width = img.width * ratio;
	canvas.height = img.height * ratio;
	var ctx = canvas.getContext("2d");
	ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
	//////////4. export as dataUrl
	return canvas.toDataURL();
};

function abortRead() {
	reader.abort();
}

function errorHandler(evt) {
	switch (evt.target.error.code) {
		case evt.target.error.NOT_FOUND_ERR:
			alert('File Not Found!');
			break;
		case evt.target.error.NOT_READABLE_ERR:
			alert('File is not readable');
			break;
		case evt.target.error.ABORT_ERR:
			break; // noop
		default:
			alert('An error occurred reading this file.');
	};
}

function updateProgress(evt) {
	
	if (evt.lengthComputable) {
		var percentLoaded = Math.round((evt.loaded / evt.total) * 100);
		// Increase the progress bar length.
		if (percentLoaded < 100) {
			progress.style.width = percentLoaded + '%';
			progress.textContent = percentLoaded + '%';
		}
	}
}

function handleFileSelect(evt) {
	// Reset progress indicator on new file selection.
	progress.style.width = '0%';
	progress.textContent = '0%';

	reader = new FileReader();
	reader.onerror = errorHandler;
	reader.onprogress = updateProgress;
	reader.onabort = function (e) {
		alert('File read cancelled');
	};
	reader.onloadstart = function (e) {
		document.getElementById('progress_bar').className = 'loading';
	};
	reader.onload = function (e) {
			// Ensure that the progress bar displays 100% at the end.
			progress.style.width = '100%';
			progress.textContent = '100%';
			var img = new Image();
			img.onload = function () {
				dataImg = resizeInCanvas(img).replace(/^data:image\/[a-z]+;base64,/, "");
				//dataImg= dataImg.replace(/^data:image\/[a-z]+;base64,/, "");
				//onRedSS();
			};
			//dataImg=e.target.result.replace(/^data:image\/[a-z]+;base64,/, "");;
			img.src = e.target.result;
			setTimeout("document.getElementById('progress_bar').className='';", 2000);

		}
		// Read in the image file as a binary string.
	reader.readAsDataURL(evt.target.files[0]);
}
//document.getElementById('txtAvatar').addEventListener('change', handleFileSelect, false);

function onRedSS() {
	alert(dataImg);
};

function LoadCboProvincials() {
	var selectElemRef = document.getElementById("cboProvincial");
	var objProvincials;
	$.ajax({
		dataType: "json",
		url: "/getProvincial?p=1",
		data: objProvincials,
		success: function (data) {
			objProvincials = data;
			var html = '';
			//var x = document.getElementById("mySelect");
			//removeOptions($("#cboProvincial"));
			
			for (var i = 0, len = objProvincials.length; i < len; ++i) {
				var o = new Option(objProvincials[i].Name, objProvincials[i]._id);
				//o.selected=true;
				$("#cboProvincial").append(o);
			}
			if (cboProvincial.length > 1) {
				document.getElementById("cboProvincial").selectedIndex = 0;
				onCboProvincialsChange(document.getElementById("cboProvincial"));
				document.getElementById("txtProvincial").value = document.getElementById("cboProvincial")[0].text;
			}
		}
	});
};

function onCboProvincialsChange(event) {
	
	var value = event.value;
	document.getElementById("txtProvincial").value = event[event.selectedIndex].text;
	///LoadCboDistricts(value);
};

function LoadCboTeam() {
	var selectElemRef = document.getElementById("cboTeam");
	var obj;
	$.ajax({
		dataType: "json",
		url: "/getTeam",
		data: obj,
		success: function (data) {
			obj = data;
		
			for (var i = 0, len = obj.length; i < len; ++i) {
				var o = new Option(obj[i].Name, obj[i]._id);
				//o.selected=true;
				$("#cboTeam").append(o);
			}
			if (obj.length > 1) {
				document.getElementById("cboTeam").selectedIndex = 0;
				onCboTeamChange(document.getElementById("cboTeam"));
				document.getElementById("txtTeam").value = document.getElementById("cboTeam")[0].text;
			}
		}
	});
};

function onCboTeamChange(event) {

	var id = event.value;
	document.getElementById("txtTeam").value = event[event.selectedIndex].text;
	//alert(event);
	var value = cboTeam[cboTeam.selectedIndex].text;
	//LoadCboWards(id);
};
function onCboTypeChange(event) {
	var value= event.value;
	if(event.value=='Cấp Trung Ương'){
		stProvincial.style.display = "none";
		txtProvincial.value = 'NA';
		stTeam.style.display = "inline";
	   
   }else if(event.value=='Cấp tỉnh'){
		stProvincial.style.display = "inline";
		stTeam.style.display = "none";
		txtTeam.value = 'NA';
	}else{
		stProvincial.style.display = "none";
		stTeam.style.display = "none";
	}
};


LoadCboTeam();
LoadCboProvincials();
function SaveObject() {
	btnSend.disabled = true;
	btnSend.style.color = '#5d98fb';
	var psid;
	var objMember = {};
	if(document.getElementById("psid").value!="" && document.getElementById("psid").value!=undefined)
	{
		psid = document.getElementById("psid").value;
	}else
	{
		psid= getParamValue("psid");
	}
	//var file_data = txtImage.prop("files")[0]; 
	
	if (cboType.selectedIndex==0) {
		alert("Bạn phải chọn cấp cán bộ");
		btnSend.disabled = false;
		btnSend.style.color = '#FFFFFF';
		cboType.focus();
		return;
	};
	if (cboType.selectedIndex==1 && cboTeam.selectedIndex==0) {
		alert("Bạn phải chọn ban");
		btnSend.disabled = false;
		btnSend.style.color = '#FFFFFF';
		cboTeam.focus();
		return;
	};
	if (cboType.selectedIndex==2 && cboProvincial.selectedIndex==0) {
		alert("Bạn phải chọn Tỉnh/TP");
		btnSend.disabled = false;
		btnSend.style.color = '#FFFFFF';
		cboProvincial.focus();
		return;
	};
	if (txtFullName.value == undefined || txtFullName.value == "") {
		alert("Bạn phải nhập tên");
		btnSend.disabled = false;
		btnSend.style.color = '#FFFFFF';
		txtFullName.focus();
		return;
	};

	if (txtPhone.value == undefined || txtPhone.value == "") {
		alert("Bạn phải nhập số ĐT");
		btnSend.disabled = false;
		btnSend.style.color = '#FFFFFF';
		txtPhone.focus();
		return;
	};
	if (txtEmail.value == undefined || txtEmail.value == "") {
		alert("Bạn phải nhập Email");
		btnSend.disabled = false;
		btnSend.style.color = '#FFFFFF';
		txtEmail.focus();
		return;
	};

	


	var mydate = txtBirthday.valueAsDate;
	var inputDate = new Date(mydate.toISOString());

	
	objMember.psid = psid;
	objMember.Name = txtFullName.value;	
	objMember.Birthday =  mydate.getDate()+'/'+(mydate.getMonth()+1)+'/'+mydate.getFullYear();
	objMember.Phone = txtPhone.value;
	objMember.Email = txtEmail.value;
	//objMember.Position="Khác";
	
	//objMember.IsConcurrently ='';
	//objMember.Concurrently = '';
	
	objMember.Type = cboType.value;
	objMember.Team = txtTeam.value;
	objMember.TeamId = cboTeam.value;
	objMember.Provincial = txtProvincial.value;
	
	//objMember.Districts = txtDistricts.value;
	//objMember.Wards = txtWards.value;
	//objMember.Branch = '';

	//objMember.Branch = txtBranch.value;
	if(cboType.selectedIndex==1)
	{
		objMember.Level=1;
		objMember.Layer=1;
	}
	if(cboType.selectedIndex==2)
	{
		objMember.Level=2;
		objMember.Layer=2;
	}
	//objMember.DataImg = dataImg;
	//objMember.ImgName = txtAvatar.files[0].name;
	//objProduct.Status="Active";
	var form = new FormData();
	form.append('psid', objMember.psid);
	form.append('Name', objMember.Name);
	form.append('Birthday', objMember.Birthday);
	form.append('Phone', objMember.Phone);
	form.append('Email', objMember.Email);
	
	form.append('Level', objMember.Level);
	form.append('Layer', objMember.Layer);
	form.append('Provincial', objMember.Provincial);
	form.append('Team', objMember.Team);
	form.append('TeamId', objMember.TeamId);
	form.append('Type', objMember.Type);


	$.ajax({
		type: 'POST',
		data: form,
		contentType: false,
		processData: false,
		url: '/btcregisterspostback.bot',
		success: function (data) {
			//alert("Thêm mới sản phẩm thành công!")
			//console.log('success');
			btnSend.disabled = false;
			btnSend.style.color = '#FFFFFF';
			console.log(data);
			alert("Thêm mới thành công");
			MessengerExtensions.requestCloseBrowser(function success() {
				console.log("Webview closing");
			}, function error(err) {
				console.log("getElementById Err:" + err);
			});

		},
		error: function (err) {
			btnSend.disabled = false;
			btnSend.style.color = '#FFFFFF';
			alert("Lỗi :", err);
		}
	});

};
