var _ = require('lodash');
var bodyParser = require('body-parser');
var express = require('express');
var router = express.Router();

var app = express();
var server = app.listen(80);

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.disable('x-powered-by');
app.use('/api', router);
app.use('/', express.static(__dirname + '/dist'));
app.use('/css', express.static(__dirname + '/app/assets/css'));
app.use('/fonts', express.static(__dirname + '/app/assets/fonts'));
app.use('/imgs', express.static(__dirname + '/app/assets/images'));

router.route('/test')
    .get(function (req, res) {
        res.json('Welcome to express API');
    })
;
