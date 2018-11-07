var express = require('express');
var router = express.Router();
var Cryptojs = require("crypto-js"); //Toanva add

var objDb = require('../object/database.js');
const bodyParser = require('body-parser');
const session = require('express-session');
const request = require('request');
function creatCond(cond,req){
	if (req.session.Level == 2) {
		cond.$and.push({Provincial:req.session.Provincial});
	}
	if (req.session.Level == 3) {
		cond.$and.push({
			District: req.session.District
		});
	}
	if (req.session.Level == 4) {
		cond.$and.push({
			Ward: req.session.Ward
		});
	}
	return cond;
}
router.use(session({
	secret: 'nsvn119',
	saveUninitialized: true,
	resave: true,
	cookie: {
		expires: new Date(Date.now() + (60 * 1000 * 60))
	} /// Set time out 1h
}));
router.use(bodyParser.urlencoded({
	extended: false,
	limit: '10mb',
	parameterLimit: 10000
}))
router.use(bodyParser.json());
var auth = function (req, res, next) {
	if (req.session)
		return next();
	else
		return res.sendStatus(401);
};
var authFace = function (req, res, next) {
	//console.log("Session :",req.session);
	console.log("Session faceUser :", req.session.faceUser);
	if (req.session && req.session.faceUser)
		return next();
	else
		return res.sendStatus(401);
};
var authKsv = function (req, res, next) {
	if (req.session && req.session.ksv)
		return next();
	else
		return res.sendStatus(401);
};
// App Secret can be retrieved from the App Dashboard
const APP_SECRET = (process.env.MESSENGER_APP_SECRET) ?
	process.env.MESSENGER_APP_SECRET :
	config.get('appSecret');

// Arbitrary value used to validate a webhook
const VALIDATION_TOKEN = (process.env.MESSENGER_VALIDATION_TOKEN) ?
	(process.env.MESSENGER_VALIDATION_TOKEN) :
	config.get('validationToken');

// Generate a page access token for your page from the App Dashboard
const PAGE_ACCESS_TOKEN = (process.env.MESSENGER_PAGE_ACCESS_TOKEN) ?
	(process.env.MESSENGER_PAGE_ACCESS_TOKEN) :
	config.get('pageAccessToken');
router.get('/', function (req, res, next) {
	res.sendFile('index.html', {
		root: "views/cms"
	});
});
router.get('/index', function (req, res, next) {
	res.sendFile('index.html', {
		root: "views/cms"
	});
});
router.get('/mess', function (req, res, next) {
	res.sendFile('mess.html', {
		root: "views/cms"
	});
});
router.get('/report', function (req, res, next) {
	res.render('report');
});
router.get('/member', function (req, res, next) {
	res.sendFile('member.html', {
		root: "views/cms"
	});
});
router.get('/mlogin', function (req, res, next) {
	res.sendFile('unitlogin.html', {
		root: "views/cms"
	});
});
router.post('/unitloginCMS', function (req, res) {
	let body = req.body;
	var bytes = Cryptojs.AES.decrypt(body.data, req.sessionID);
	var decryptedData = JSON.parse(bytes.toString(Cryptojs.enc.Utf8));
	if (!decryptedData.OTP || !decryptedData.psid) {
		console.log("loginCMS failed");
		res.send('Mật khẩu hoặc tài khoản không đúng');
	} else {
		console.log("loginCMS OTP:", decryptedData.OTP);
		console.log("loginCMS psid:", decryptedData.psid);
		var query = {
			_id: decryptedData.psid,
			OTP: Number(decryptedData.OTP),
			BlockStatus: 'PENDING'
		};
		objDb.getConnection(function (client) {
			objDb.findMemberOTP(query, client, function (results) {
				if (results != null ) {
					console.log("loginCMS success");
					var objBtcOtp = {};
					objBtcOtp.psid = decryptedData.psid;
					objBtcOtp.OTP = decryptedData.OTP;
					objDb.updateMemberOtp(objBtcOtp, client, function (results) {
						client.close();
					});
					req.session.Name = results.Name;
					req.session.psid = results._id;
					req.session.Provincial = results.Provincial;
					req.session.Level = results.Level;
					req.session.Ward = results.Ward;
					req.session.District = results.District;
					console.log("session.admin", req.session.admin);
					req.session.faceUser = true;
					res.json({
						result: results[0],
						success: "true",
						message: 'Đăng nhập thành công'
					});
				} else {
					client.close();
					console.log("unitloginCMS failed");
					res.json({
						success: "false",
						message: 'Mật khẩu hoặc tài khoản không đúng'
					});
				}
			});
		});
	}
});
router.get('/Info',(req,res) => {
	res.send({
		Level: req.session.Level,
		Provincial: req.session.Provincial,
		District: req.session.District,
		Ward: req.session.Ward,
	});
});
router.get('/getCountryCount', (req, res) => {
	if (req.session == null) {
		return res.sendStatus(401);
	}
	if(req.session.Level==1){
		objDb.getConnection(function (client) {
			objDb.countMemberGbCountry(client, function (results) {
				console.log("getCountryCount");
				client.close();
				res.send(results);
			});
		});
	}else
		res.json({
			success: "false",
			message: 'Bạn không có quyền xem.'
		});
});
router.get('/getProvincialCount', (req, res) =>{
	if (req.session == null ) {
		return res.sendStatus(401);
	}
	if(req.session.Level<3){
		var cond=creatCond({$and: [ {$or: [{Level: 3}, {Level: 2}]}]},req);
		if(req.session.Level==1)
			cond.$and.push({Provincial:req.query.Provincial});
		objDb.getConnection(function (client) {
			objDb.countMemberGbProvincial( cond,client, function (results) {
				console.log("getProvincialCount");
				client.close();		
				res.send(results);

			});
		});
	} else
		res.json({
			success: "false",
			message: 'Bạn không có quyền xem.'
		});
});
router.get('/getDistrictCount', (req, res) => {
	if (req.session == null) {
		return res.sendStatus(401);
	}
	if(req.session.Level<=3){
		var cond=creatCond({$and: [ {$or: [{Level: 3}, {Level: 4}]}]},req);
		if(req.session.Level<3)
			cond.$and.push({District:req.query.District});
		objDb.getConnection(function (client) {
			objDb.countMemberGbDistrict( cond,client, function (results) {
				console.log("getDistrictCount");
				client.close();
				res.send(results);

			});
	});
	}else
		res.json({
			success: "false",
			message: 'Bạn không có quyền xem.'
		});
});
router.get('/getWardCount', (req, res) => {
	if (req.session == null) {
		return res.sendStatus(401);
	}
	if(req.session.Level<5){
		var cond=creatCond({$and: [ {$or: [{Level: 4}, {Level: 5}]}]},req);
		if(req.session.Level<4)
			cond.$and.push({Ward:req.query.Ward});
		objDb.getConnection(function (client) {
			objDb.countMemberGbWard(cond, client, function (results) {
				console.log("getWardCount");
				client.close();
				res.send(results);
			});
		});
	}else
		res.json({
			success: "false",
			message: 'Bạn không có quyền xem.'
		});
});
router.get('/getMemberBranch', (req, res) => {
	if (req.session == null) {
		return res.sendStatus(401);
	}
	objDb.getConnection(function (client) {
		objDb.getMemberBranch(req.query.Ward, client, function (results) {
			console.log("getMemberBranch");
			client.close();
			res.send(results);
		});
	});
});
router.get('/getProvincial', (req, res) => {
	var query = {};
	objDb.getConnection(function (client) {
		objDb.findProvincial(query, client, function (results) {
			client.close();
			res.send(results);

		});
	});
});
router.get('/getProvincialTemp', (req, res) => {
	var query = {};
	objDb.getConnection(function (client) {
		objDb.findProvincialTemp(query, client, function (results) {
			client.close();
			res.send(results);

		});
	});
});
router.get('/getDistrict', (req, res) => {
	var query;
	if (req.query.idProvincial == 'ALL') {
		query = {};

	} else {
		query = {
			"IdProvince": req.query.idProvincial
		};
	}
	console.log(query);
	objDb.getConnection(function (client) {
		objDb.findDistrict(query, client, function (results) {
			client.close();
			res.send(results);

		});
	});
	//res.send(req.query.idProvincial);
});
router.get('/getWards', (req, res) => {

	var query;
	if (req.query.idDistrict == 'ALL') {
		query = {};

	} else {
		query = {
			"IdDistrict": req.query.idDistrict
		};
	}
	objDb.getConnection(function (client) {
		objDb.findWards(query, client, function (results) {
			console.log("getWards");
			client.close();
			res.send(results);

		});
	});
	//res.send(req.query.idProvincial);
});
router.get('/getBranch', (req, res) => {
	var query;
	if (req.query.idWards == 'ALL') {
		query = {};

	} else {
		query = {
			"IdWards": req.query.idWards
		};
	}
	console.log("getBranch query:", query);
	objDb.getConnection(function (client) {
		objDb.findBranch(query, client, function (results) {
			console.log("getBranch");
			client.close();
			res.send(results);

		});
	});
	//res.send(req.query.idProvincial);
});
router.post('/getkeyCMS', function (req, res) {
	let body = req.body;
	if (req.session.cms_key == null) {
		req.session.cms_key = req.sessionID;
		res.send(req.sessionID);
	} else {
		res.send(req.session.cms_key);
	}
});
router.get('/getPosition', (req, res) => {
	var query = {};
	objDb.getConnection(function (client) {
		objDb.findPosition(query, client, function (results) {
			client.close();
			res.send(results);

		});
	});
});
router.get('/getMemberByGroup', auth, (req, res) => {
	if (req.session == null) {
		return res.sendStatus(401);
	}
	//res.setHeader('X-Frame-Options', 'ALLOW-FROM ' + router_URL);
	var code = req.query.code;
	var options = {};
	var pipeline = [];
	if (code == "GeoCode") {
		pipeline = [{
			"$group": {
				"_id": {
					"Provincial": "$Provincial",
					"GeoCodeProvincial": "$GeoCodeProvincial"
				},
				"COUNT(_id)": {
					"$sum": 1
				}
			}
		}, {
			"$project": {
				"_id": 0,
				"Total": "$COUNT(_id)",
				"Provincial": "$_id.Provincial",
				"GeoCodeProvincial": "$_id.GeoCodeProvincial"
			}
		}];

	} else if (code == "Position") {
		pipeline = [{
			"$group": {
				"_id": {
					"Position": "$Position"
				},
				"COUNT(_id)": {
					"$sum": 1
				}
			}
		}, {
			"$project": {
				"_id": 0,
				"Total": "$COUNT(_id)",
				"Position": "$_id.Position"
			}
		}];
	}
	console.log("getMemberByGroup", code);
	objDb.getConnection(function (client) {
		objDb.findMembersByGroup(pipeline, options, client, function (results) {
			client.close();
			res.send(results);

		});
	});
});
router.get('/getMemberOnline', (req, res) => {
	res.setHeader('X-Frame-Options', 'ALLOW-FROM ' + SERVER_URL);
	try {
		var cDate = new Date();
		var eDate = new Date();
		eDate.setMinutes(cDate.getMinutes() + 15);

		var query = {
			ExpiredDate: {
				$gte: cDate,
				$lte: eDate
			}
		};
		console.log("getMemberOnline query : ", query);
		objDb.getConnection(function (client) {
			objDb.findMemberOnline(query, client, function (results) {
				client.close();
				res.send(results);
			});
		});
	} catch (err) {
		console.error("getMemberOnline:", err);
		res.send(null);
	}
});
router.get('/getMemberConnect', (req, res) => {
	res.setHeader('X-Frame-Options', 'ALLOW-FROM ' + SERVER_URL);
	try {
		var query = {};
		console.log("getMemberConnect query : ", query);
		objDb.getConnection(function (client) {
			objDb.findMemberOnline(query, client, function (results) {
				client.close();
				res.send(results);

			});
		});
	} catch (err) {
		console.error("getMemberConnect:", err);
		res.send(null);
	}
});
router.get('/getListMemberApprovedById', authFace, (req, res) => {

	var psid = req.query.psid;
	console.log("getListMemberApprovedById psid: ", psid);

	var query = {
		_id: psid
	};
	console.log("getListMemberApprovedById query: ", query);
	objDb.getConnection(function (client) {
		objDb.findMembers(query, client, function (results) {
			if (results.length > 0) {
				results = results[0];
				var queryDetail = {};
				///// layerDelegatelayer- Delegate , được ủy quyền để tăng 1 cấp layer
				var layerDelegate = Number(results.Layer) - Number(results.Delegate);
				if (layerDelegate < 0) {
					layerDelegate = 0; // chỉ cho Ủy quyền đến cấp admin
				}
				console.log("getListMemberApprovedById layerDelegate: ", layerDelegate);
				if (results.BlockStatus == "ACTIVE") {

					Object.assign(queryDetail, {
						BlockStatus: 'ACTIVE'
					});
					Object.assign(queryDetail, {
						ApprovedId: psid
					});
					console.log("getListMemberApprovedById query detail", queryDetail);
					objDb.findMembers(queryDetail, client, function (resultsList) {
						client.close();
						res.send(resultsList);
					});
				} else {
					//client.close();
					res.send(null);
				}


			} else {
				client.close();
				res.send(results);
			}
		});
	});
});
router.get('/getListMemberById', authFace, (req, res) => {
	if (req.session == null) {
		return res.sendStatus(401);
	}
	var psid = req.query.psid;
	console.log("getListMemberById psid: ", psid);

	var query = {
		_id: psid
	};
	console.log("getListMemberById query: ", query);
	objDb.getConnection(function (client) {
		objDb.findMembers(query, client, function (results) {
			if (results.length > 0) {
				results = results[0];
				var queryDetail = {};
				///// layerDelegatelayer- Delegate , được ủy quyền để tăng 1 cấp layer
				if (results.Delegate == null) {
					results.Delegate = 0;
				}
				var layerDelegate = Number(results.Layer) - Number(results.Delegate);
				if (layerDelegate < 0) {
					layerDelegate = 0; // chỉ cho Ủy quyền đến cấp admin
				}
				console.log("getListMemberById layerDelegate: ", layerDelegate);
				if (results.BlockStatus == "ACTIVE" && layerDelegate == results.Level) {
					console.log("getListMemberById Level : ", results.Level);
					///// layer = layerDelegate+1 để thấy dưới 1 cấp
					var layer = layerDelegate + 1;

					if (results.Level == 1 || results.Level == 0) {
						results.Provincial = "";
						results.District = "";
						results.Ward = "";

					}
					if (results.Layer != undefined & results.Layer != "" & layer != 1 && layer != 0) {
						Object.assign(queryDetail, {
							Layer: Number(layer)
						});
					}
					if (layer != 1 && layer != 0) {
						if (results.Provincial != undefined && results.Provincial != "" && results.Provincial != "NA") {
							Object.assign(queryDetail, {
								Provincial: results.Provincial
							});
						}
						if (results.District != undefined && results.District != "" && results.District != "NA") {
							Object.assign(queryDetail, {
								District: results.District
							});
						}
						if (results.Ward != undefined && results.Ward != "" && results.Ward != "NA") {
							Object.assign(queryDetail, {
								Ward: results.Ward
							});
						}
					}
					Object.assign(queryDetail, {
						BlockStatus: 'ACTIVE'
					});
					console.log("getListMemberById query detail", queryDetail);
					objDb.findMembers(queryDetail, client, function (resultsList) {
						client.close();
						res.send(resultsList);
					});
				} else {
					client.close();
					res.send(null);
				}


			} else {
				client.close();
				res.send(results);
			}
		});
	});
});
router.get('/getListMemberDelegate', authFace, (req, res) => {
	if (req.session == null) {
		return res.sendStatus(401);
	}
	var psid = req.query.psid;
	console.log("getListMemberDelegate psid: ", psid);

	var query = {
		_id: psid
	};
	console.log("getListMemberDelegate query: ", query);
	objDb.getConnection(function (client) {
		objDb.findMembers(query, client, function (results) {
			if (results.length > 0) {
				results = results[0];
				var queryDetail = {};
				///// layerDelegatelayer- Delegate , được ủy quyền để tăng 1 cấp layer
				if (results.Delegate == null) {
					results.Delegate = 0;
				}
				//var layerDelegate=Number(results.Layer)-Number(results.Delegate);
				//if(layerDelegate<0)
				//{
				//	layerDelegate=0;// chỉ cho Ủy quyền đến cấp admin
				//}
				//console.log("getListMemberDelegate layerDelegate: ", layerDelegate);
				if (results.BlockStatus == "ACTIVE" && results.Layer == results.Level) {
					console.log("getListMemberDelegate Level : ", results.Level);
					///// layer+1 để thấy dưới 1 lớp
					var layer = Number(results.Layer) + 1;

					if (results.Level == 1 || results.Level == 0) {
						results.Provincial = "";
						results.District = "";
						results.Ward = "";

					}
					////// Chỉ lấy ra thành viên cùng cấp
					Object.assign(queryDetail, {
						Level: results.Level
					});
					///// Lấy ra thành viên cùng lớp
					if (results.Layer != undefined & results.Layer != "" & layer != 1 && layer != 0) {
						Object.assign(queryDetail, {
							Layer: Number(layer)
						});
					}
					if (layer != 1 && layer != 0) {
						if (results.Provincial != undefined && results.Provincial != "" && results.Provincial != "NA") {
							Object.assign(queryDetail, {
								Provincial: results.Provincial
							});
						}
						if (results.District != undefined && results.District != "" && results.District != "NA") {
							Object.assign(queryDetail, {
								District: results.District
							});
						}
						if (results.Ward != undefined && results.Ward != "" && results.Ward != "NA") {
							Object.assign(queryDetail, {
								Ward: results.Ward
							});
						}
					}
					Object.assign(queryDetail, {
						BlockStatus: 'ACTIVE'
					});
					console.log("getListMemberDelegate query detail", queryDetail);
					objDb.findMembers(queryDetail, client, function (resultsList) {
						client.close();
						res.send(resultsList);
					});
				} else {
					client.close();
					res.send(null);
				}


			} else {
				client.close();
				res.send(results);
			}
		});
	});
});
router.get('/getListMemberKsv', authFace, (req, res) => {
	if (req.session == null) {
		return res.sendStatus(401);
	}
	var psid = req.query.psid;
	console.log("getListMemberKsv psid: ", psid);

	var query = {
		_id: psid
	};
	console.log("getListMemberKsv query: ", query);
	objDb.getConnection(function (client) {
		objDb.findMembers(query, client, function (results) {
			if (results.length > 0) {
				results = results[0];

				var queryDetail = {
					_id: {
						$ne: psid
					}
				}; /////Loại bỏ chính mình ra khỏi danh sách
				////layerDelegatelayer- Delegate , được ủy quyền để tăng 1 cấp layer
				if (results.Delegate == null) {
					results.Delegate = 0;
				}
				var layerDelegate = Number(results.Layer) - Number(results.Delegate);
				if (layerDelegate < 0) {
					layerDelegate = 0; // chỉ cho Ủy quyền đến cấp admin
				}
				console.log("getListMemberKsv layerDelegate: ", layerDelegate);
				if (results.BlockStatus == "ACTIVE" && results.Layer == results.Level) {
					console.log("getListMemberDelegate Level : ", results.Level);
					///// layer+1 + va + ủy quyền để thấy dưới 1 lớp
					var layer = layerDelegate + 1;
					//var layer = Number(results.Layer) + 1;

					if (results.Level == 1 || results.Level == 0) {
						results.Provincial = "";
						results.District = "";
						results.Ward = "";

					}
					////// Chỉ lấy ra thành viên cùng cấp
					//					Object.assign(queryDetail, {
					//						Level: results.Level
					//					});
					///// Lấy ra thành viên cùng lớp

					if (results.Level == 1) {
						////// Lấy cả layer = 1 và layer =2
						Object.assign(queryDetail, {
							$or: [{
								Layer: 2
							}, {
								Layer: 1
							}]
						});
					} else {
						/// Lấy leyer dưới 1 cấp
						if (results.Layer != undefined && results.Layer != "" && layer != 1 && layer != 0) {
							Object.assign(queryDetail, {
								Layer: Number(layer)
							});
						}
					}
					if (layer != 1 && layer != 0) {
						if (results.Provincial != undefined && results.Provincial != "" && results.Provincial != "NA") {
							Object.assign(queryDetail, {
								Provincial: results.Provincial
							});
						}
						if (results.District != undefined && results.District != "" && results.District != "NA") {
							Object.assign(queryDetail, {
								District: results.District
							});
						}
						if (results.Ward != undefined && results.Ward != "" && results.Ward != "NA") {
							Object.assign(queryDetail, {
								Ward: results.Ward
							});
						}
					}
					//					Object.assign(queryDetail, {
					//						BlockStatus: 'ACTIVE'
					//					});
					console.log("getListMemberDelegate query detail", queryDetail);
					objDb.findMembers(queryDetail, client, function (resultsList) {
						client.close();
						res.send(resultsList);
					});
				} else {
					client.close();
					res.send(null);
				}


			} else {
				client.close();
				res.send(results);
			}
		});
	});
});
router.get('/getMember', authFace, (req, res) => {
	if (req.session == null) {
		return res.sendStatus(401);
	}
	//res.setHeader('X-Frame-Options', 'ALLOW-FROM '+router_URL);
	var name = req.query.name;
	var psid = req.query.psid;
	var provincial = req.query.provincial;
	var districts = req.query.districts;
	var wards = req.query.wards;
	var position = req.query.position;
	var level = req.query.level;
	var layer = req.query.layer;
	console.log("getMember layer: ", layer);
	if (psid == null || psid == 'all')
		psid = "";
	if (name == null || name == 'all')
		name = "";
	if (provincial == null || provincial == 'all' || provincial == 'NA')
		provincial = "";
	if (districts == null || districts == 'all' || districts == 'NA')
		districts = "";
	if (wards == null || wards == 'all' || wards == 'NA')
		wards = "";
	if (position == null || position == 'all' || position == 'NA')
		position = "";
	if (level == null || level == 'all' || level == 'NA')
		level = "";
	if (layer == null || layer == 'all' || layer == 'NA')
		layer = "";
	//var reqQuery=  req.query.strQuery
	var query = {};
	if (name != "") {
		//{ "Name": {'$regex': '.*nam.*'}}
		name = ".*" + name + ".*";
		Object.assign(query, {
			Name: {
				$regex: name
			}
		});
	}
	if (psid != "") {
		Object.assign(query, {
			_id: psid
		});
	}
	if (layer != undefined & layer != "" & Number(layer) != 1 && Number(layer) != 0) {
		Object.assign(query, {
			Layer: Number(layer)
		});
	}
	if (Number(layer) != 1 && Number(layer) != 0) {
		if (provincial != "") {
			Object.assign(query, {
				Provincial: provincial
			});
		}
		if (districts != "") {
			Object.assign(query, {
				District: districts
			});
		}
		if (wards != "") {
			Object.assign(query, {
				Ward: wards
			});
		}
		if (position != "") {
			Object.assign(query, {
				Position: position
			});
		}
	}
	console.log("GetMember query", query);
	objDb.getConnection(function (client) {
		objDb.findMembers(query, client, function (results) {
			client.close();
			res.send(results);

		});
	});
});
router.get('/getMemberCMS', auth, (req, res) => {
	if (req.session == null) {
		return res.sendStatus(401);
	}
	var name = req.query.name;
	var psid = req.query.psid;
	var provincial = req.query.provincial;
	var districts = req.query.districts;
	var wards = req.query.wards;
	var position = req.query.position;
	var level = req.query.level;
	var layer = req.query.layer;
	var blockstatus = req.query.blockstatus;
	var phone = req.query.phone;
	console.log('getMemberCMS');
	if (psid == null || psid == 'all')
		psid = "";
	if (name == null || name == 'all')
		name = "";
	if (provincial == null || provincial == 'all' || provincial == 'NA')
		provincial = "";
	if (districts == null || districts == 'all' || districts == 'NA')
		districts = "";
	if (wards == null || wards == 'all' || wards == 'NA')
		wards = "";
	if (position == null || position == 'all' || position == 'NA')
		position = "";
	if (level == null || level == 'all' || level == 'NA')
		level = "";
	if (layer == null || layer == 'all' || layer == 'NA')
		layer = "";
	if (blockstatus == null || blockstatus == 'all')
		blockstatus = "";
	if (phone == null || phone == 'all')
		phone = "";
	if (name != "") {
		name = ".*" + name + ".*";
		Object.assign(query, {
			Name: {
				$regex: name
			}
		});
	}
	if (psid != "") {
		Object.assign(query, {
			_id: psid
		});
	}
	if (blockstatus != "") {
		Object.assign(query, {
			BlockStatus: blockstatus
		});
	}

	if (phone != "") {
		phone = ".*" + phone + ".*";
		Object.assign(query, {
			Phone: {
				$regex: phone
			}
		});
	}
	if (level != "") {
		Object.assign(query, {
			Level: parseInt(level)
		});
	}
	if (provincial != "") {
		Object.assign(query, {
			Provincial: provincial
		});
	}
	if (districts != "") {
		Object.assign(query, {
			District: districts
		});
	}
	if (wards != "") {
		Object.assign(query, {
			Ward: wards
		});
	}
	if (position != "") {
		Object.assign(query, {
			Position: position
		});
	}
	console.log("GetMemberCMS query", query);
	objDb.getConnection(function (client) {
		objDb.findMembers(query, client, function (results) {
			client.close();
			res.send(results);
		});
	});
});
router.get('/getKycMembers', authKsv, (req, res) => {
	if (req.session == null) {
		return res.sendStatus(401);
	}
	res.setHeader('X-Frame-Options', 'ALLOW-FROM ' + router_URL);
	var query = {};
	//	var name = req.query.name;
	var provincial = req.query.provincial;
	var districts = req.query.districts;
	var wards = req.query.wards;

	if (provincial == null || provincial == 'all')
		provincial = "";
	if (districts == null || districts == 'all')
		districts = "";
	if (wards == null || wards == 'all')
		wards = "";
	//	var position = req.query.position;
	//	//var reqQuery=  req.query.strQuery
	//	
	//	if (name != "") {
	//		//{ "Name": {'$regex': '.*nam.*'}}
	//		name = ".*" + name + ".*";
	//		Object.assign(query, {
	//			Name: {
	//				$regex: name
	//			}
	//		});
	//	}
	if (provincial != "") {
		Object.assign(query, {
			Provincial: provincial
		});
	}
	if (districts != "") {
		Object.assign(query, {
			Districts: districts
		});
	}
	if (wards != "") {
		Object.assign(query, {
			Wards: wards
		});
	}
	//	if (position != "") {
	//		Object.assign(query, {
	//			Position: position
	//		});
	//	}
	console.log("getKycMembers query", query);
	objDb.getConnection(function (client) {
		objDb.findKycMembers(query, client, function (results) {
			client.close();
			res.send(results);

		});
	});
});
server.post('/sendbroadcast.bot', auth, (req, res) => {
	let body = req.body;
	var msg = body.Msg;
	var provincial = body.provincial;
	var districts = body.districts;
	var wards = body.wards;
	var position = body.position;
	var level = body.level;
	var layer = body.layer;
	var blockstatus = body.blockstatus;
	var name = body.name;
	var phone = body.phone;
	if (name == null || name == 'all')
		name = "";
	if (provincial == null || provincial == 'all' || provincial == 'NA')
		provincial = "";
	if (districts == null || districts == 'all' || districts == 'NA')
		districts = "";
	if (wards == null || wards == 'all' || wards == 'NA')
		wards = "";
	if (position == null || position == 'all' || position == 'NA')
		position = "";
	if (level == null || level == 'all' || level == 'NA')
		level = "";
	if (layer == null || layer == 'all' || layer == 'NA')
		layer = "";
	if (blockstatus == null || blockstatus == 'all')
		blockstatus = "";
	if (phone == null || phone == 'all')
		phone = "";

	var query = {};
	if (name != "") {
		name = ".*" + name + ".*";
		Object.assign(query, {
			Name: {
				$regex: name
			}
		});
	}
	if (phone != "") {
		phone = ".*" + phone + ".*";
		Object.assign(query, {
			Phone: {
				$regex: phone
			}
		});
	}
	if (blockstatus != "") {
		Object.assign(query, {
			BlockStatus: blockstatus
		});
	}
	if (level != "") {
		Object.assign(query, {
			Level: parseInt(level)
		});
	}
	if (provincial != "") {
		Object.assign(query, {
			Provincial: provincial
		});
	}
	if (districts != "") {
		Object.assign(query, {
			District: districts
		});
	}
	if (wards != "") {
		Object.assign(query, {
			Ward: wards
		});
	}
	if (position != "") {
		Object.assign(query, {
			Position: position
		});
	}
	var mess = {};
	console.log("Send broadcast query: ", query);
	objDb.getConnection(function (client) {
		objDb.findMembers(query, client, function (results) {
			//	   res.send(results);
			//console.log(results);
			console.log('Total Broadcast send: ', results.length);
			client.close();
			for (var i = 0; i < results.length; i++) {
				var quickReplies = [{
					content_type: "text",
					title: "Đồng ý",
					payload: "confirm",
					image_url: SERVER_URL + "/img/OkLike.png"
				}, {
					content_type: "text",
					title: "Hỗ trợ",
					payload: "help",
					image_url: SERVER_URL + "/img/helps.png"
				}, {
					content_type: "text",
					title: "Hướng dẫn",
					payload: "guide",
					image_url: SERVER_URL + "/img/guide.png"
				}];
				msg = msg + ". Hãy cùng tiếp tục trò chuyện với Nosa nhé!"
				///sendQuickMessage(senderID, msg, quickReplies);
				sendQuickMessage(results[i]._id, msg, quickReplies)
			}
			mess.ss = "Số lượng tin nhắn bạn đã gửi thành công là : " + results.length + " tin";
			res.send(mess);
		});
	});


});
function sendQuickMessage(recipientId, msg, quickReplies) {
	var messageData = {
		recipient: {
			id: recipientId
		},
		message: {
			text: msg,
			quick_replies: quickReplies
		}

	};
	callSendAPI(messageData);
};
function callSendAPI(messageData) {
	///console.log("callSendAPI",request) ;

	//console.log("callSendAPI:",messageData.recipient.id)
	request({
			uri: 'https://graph.facebook.com/v3.1/me/messages',
			qs: {
				access_token: PAGE_ACCESS_TOKEN
			},
			method: 'POST',
			json: messageData

		},
		function (error, response, body) {
			if (!error && response.statusCode == 200) {


				var recipientId = body.recipient_id;
				var messageId = body.message_id;
				//sendTypingOff(recipientId);
				if (messageId) {
					console.log("Successfully sent message with id %s to recipient %s",
						messageId, recipientId);
				} else {
					console.log("Successfully called Send API for recipient %s",
						recipientId);
				}

			} else {
				console.error("Failed calling Send API", response.statusCode, response.statusMessage, body.error);
				console.error(response.error);
			}
		});
};

module.exports = router;
