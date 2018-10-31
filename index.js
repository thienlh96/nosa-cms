var express = require('express');
var router = express.Router();
var Cryptojs = require("crypto-js");
var objDb = require('../object/database.js');
const bodyParser = require('body-parser');
const session = require('express-session');

router.use(bodyParser.json());

/* GET users listing. */
router.get('/', function (req, res, next) {
	res.sendFile('login.html', {
		root: "views"
	});
});

router.get('/member', function (req, res, next) {
	res.sendFile('member.html', {
		root: "views"
	});
});

router.get('/chart', function (req, res, next) {
	res.sendFile('chart.html', {
		root: "views"
	});
});

router.get('/logoutCMS', function (req, res) {
	req.session.destroy();
	res.send("logout success!");
});

router.post('/loginCMS', function (req, res) {
	let body = req.body;
	var bytes = Cryptojs.AES.decrypt(body.data, req.sessionID);
	var decryptedData = JSON.parse(bytes.toString(Cryptojs.enc.Utf8));
	if (!decryptedData.UserName || !decryptedData.Password) {
		console.log("loginCMS failed");
		res.send('Mật khẩu hoạc tài khoản không đúng');
	} else {
		console.log("loginCMS:", decryptedData.UserName);
		var query = {
			UserName: decryptedData.UserName,
			Password: Cryptojs.MD5(decryptedData.Password).toString()
		}
		objDb.getConnection(function (client) {
			objDb.findUsers(query, client, function (results) {
				client.close();
				if (results !== null && results.length > 0) {
					console.log("loginCMS success");
					req.session.user = body.UserName;
					req.session.admin = true;
					console.log("session.admin", req.session.admin);
					req.session.faceUser = true;
					res.json({
						success: "true",
						message: 'Đăng nhập thành công'
					});
				} else {
					console.log("loginCMS failed");
					res.json({
						success: "false",
						message: 'Mật khẩu hoạc tài khoản không đúng'
					});
				}
			});
		});
	}
});


module.exports = router;
