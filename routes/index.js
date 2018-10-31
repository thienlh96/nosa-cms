var express = require('express');
var router = express.Router();
const { MessengerClient } = require('messaging-api-messenger');
var config = require('config');

// App Secret can be retrieved from the App Dashboard
const APP_SECRET = config.get('appSecret');

// Arbitrary value used to validate a webhook
const VALIDATION_TOKEN = config.get('validationToken');

// Generate a page access token for your page from the App Dashboard
const PAGE_ACCESS_TOKEN = config.get('pageAccessToken');

//const client = MessengerClient.connect();
const client = MessengerClient.connect({
  accessToken: PAGE_ACCESS_TOKEN,
  version: '3.1',
});

/* GET home page. */
router.get('/', function(req, res, next) {
	res.sendFile('login.html', {
		root: "views"
	});
});

module.exports = router;
