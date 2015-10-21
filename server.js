var express = require('express');
var bodyParser = require('body-parser');
var logger = require('morgan');
// var db = require('orchestrate')(config.dbkey);

var app = express();

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended : false}));
app.use(express.static(__dirname));

app.get('/pet', function(request, response) {
	console.log('server get', request.query.size)
})

app.post('/pet', function(request, response) {
	console.log(request.body)
})
	// db.search('pets', req.params.data) // params?  data?  body?
	// .then(function(result){
	// 	var data = (result.body.results);
	// 	var allData = data.map(function(element, index, array) {
	// 		return({
	// 			animalType: element.value.animalType, //required
 //          		colors: element.value.colors,
 //           		size: element.value.size,
 //    			description: element.value.description,
 //             	id: element.value.id, //required
 //       			location: {       //required
 //           			lat: element.value.location.lat, 
 //          			long: element.value.location.lat
 //       			},
 //          		date: element.value.date, //required
 //      			imageUrl: element.value.imageURL    //require
	// 		});
	// 	});
	// 	res.send(allData);
	// })
	// .fail(function(err){
	// 	console.log(err);
	// });

//results.path.key
//results.value["propName"]

app.listen(3000)