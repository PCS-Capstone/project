var express = require('express');
var bodyParser = require('body-parser');
var logger = require('morgan');
var config = require('./config')
var db = require('orchestrate')(config.dbkey);

var app = express();

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended : false}));
app.use(express.static(__dirname));

app.get('/pet', function(request, response) {
	console.log('server get', request.query)
	console.log(typeof request.query)

	var query = "value.animalType: (" + request.query.animalType + ") AND value.size: (" + request.query.size + ")"


//results.path.key
//results.value["propName"]

	db.search('sighting', query) // params?  data?  body?
	.then(function(result){
		console.log(result.body.results)
		response.send(result.body.results);
	})
	.fail(function(err){
		console.log(err);
	});
})


app.listen(3000)