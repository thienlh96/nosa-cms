var express = require('express');
var router = express.Router();
var config = require('config');
var Cryptojs = require("crypto-js");
var objDb = require('./object/database.js');
const bodyParser = require('body-parser');
const session = require('express-session');

router.use(bodyParser.json());
/* GET home page. */
router.get('/', function (req, res, next) {
    res.sendFile('login.html', {
    	root: "views/cms"
    });
});

module.exports = router;
