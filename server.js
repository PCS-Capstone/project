var express = require('express');
var bodyParser = require('body-parser');
var logger = require('morgan');

var config = require('./config');

var db = require('orchestrate')(config.dbkey);

var app = express();

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended : false}));
app.use(express.static(__dirname));

app.get('/pet', function(request, response) {
	var query = "value.animalType: (" + request.query.animalType + ") AND value.size: (" + request.query.size + ")";
	db.search('sighting', query) // params?  data?  body?
	.then(function(result) {
		console.log(result.body.results);
		response.send(result.body.results);
	})
	.fail(function(err){
		console.log(err);
	});
});

app.post('/pet', function(request, response) {
  console.log(request.body.data);
  var data = JSON.parse(request.body.data);
  db.post('sighting', data)
    .then(function (result) {
      response.end("sighting uploaded in db");
    }).fail(function(err){
		    console.log(err);
	});

});

app.listen(3000);
