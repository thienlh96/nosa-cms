var express = require('express');
var router = express.Router();
var Cryptojs = require("crypto-js"); //Toanva add

var objDb = require('../object/database.js');
const bodyParser = require('body-parser');
const session = require('express-session');
var id='';
var district='';
var provincial='';
var ward='';
var level=4;
function creatCond(cond){
	if(level==2){
		cond.$and.push({Provincial:provincial});
	}
	if(level==3){
		cond.$and.push({District:district});
	}
	if(level==4){
		cond.$and.push({Ward:ward});
	}
	return cond;
}
function verifyRequestSignature(req, res, buf) {
	var signature = req.headers["x-hub-signature"];

	if (!signature) {
		// For testing, let's log an error. In production, you should throw an 
		// error.
		console.error("Couldn't validate the signature.");
	} else {
		var elements = signature.split('=');
		var method = elements[0];
		var signatureHash = elements[1];

		var expectedHash = crypto.createHmac('sha1', APP_SECRET)
			.update(buf)
			.digest('hex');

		if (signatureHash != expectedHash) {
			throw new Error("Couldn't validate the request signature.");
		}
	}
};
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
router.use(bodyParser.json({
	verify: verifyRequestSignature,
	limit: '10mb'
}));
router.use(bodyParser.json());
var auth = function (req, res, next) {
	// if (req.session && req.session.admin)
	// 	return next();
	// else
	// 	return res.sendStatus(401);
	return next();
};
/* GET users listing. */
router.get('/', function (req, res, next) {
	res.sendFile('login.html', {
		root: "views/cms"
	});
});
router.get('/view', function (req, res, next) {
	res.render('report', {
		'level':'1'
	});
});
router.get('/login', auth, (req, res) => {
	id = req.query.id+'';
	var query={"_id":id};
	console.log(query);
	objDb.getConnection(function (client) {
		objDb.findMember(query, client, function (results) {
			client.close();
			if (results !== null) {
				console.log("loginCMS success");
				id = results._id;
				provincial = results.Provincial;
				district = results.District;
				ward = results.Ward;
				level = results.Level;
				res.render('report', {
					'level': ''
				});
			} else {
				res.json({
					success: "false",
					message: 'Mật khẩu hoạc tài khoản không đúng'
				});
			}
		});
	});
});
router.get('/Info',(req,res) => {
	res.send({Level:level,Provincial:provincial,District:district,Ward:ward});
});
router.get('/getCountryCount', (req, res) => {
	if(level==1){
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
	if(level<3){
		var cond=creatCond({$and: [ {$or: [{Level: 3}, {Level: 2}]}]});
		if(level==1)
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
	if(level<=3){
		var cond=creatCond({$and: [ {$or: [{Level: 3}, {Level: 4}]}]});
		if(level<3)
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
	name = req.query.Ward;
	if(level<5){
		var cond=creatCond({$and: [ {$or: [{Level: 4}, {Level: 5}]}]});
		if(level<4)
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
	if (req.query.idProvincial != 'ALL' && typeof (req.query.idProvincial) == 'string') {
		query = {
			"Name": req.query.idWards
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
module.exports = router;
