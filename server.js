var express = require('express');
var bodyParser = require('body-parser');
var logger = require('morgan');
var config = require('./config.js');
var db = require('orchestrate')(config.dbkey);

var app = express();

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended : false}));
app.use(express.static(__dirname));

app.get('/pet', function(request, response) {
	console.log('server get', request.query.size);
});

app.post('/pet', function(request, response) {
  console.log(request.body.data);
  var data = JSON.parse(request.body.data);

  db.post('lostPet', data)
    .then(function (result) {
      response.end("sighting uploaded in db");
    }).fail(function(err){
		    console.log(err);
	});


});

app.listen(3000)
