var express = require('express');
var bodyParser = require('body-parser');
var logger = require('morgan');

var config = require('./config');
var db = require('orchestrate')(config.dbkey);

var app = express();

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({limit: '50mb', extended: true}));
app.use(express.static(__dirname));

//==================================
// MULTIPART FORM ENCODER CODE HERE
// var multer = require('multer');
// var upload = multer({dest:'./uploads/'})
// var upload = multer({});
//==================================

//==================================
//   CLOUD STORAGE CODE HERE
var cloudinary = require('cloudinary');
var uploader   = cloudinary.uploader;

cloudinary.config({
  cloud_name: "dxiaaofss",
     api_key: "779484679453537",
  api_secret: "WR-ESHlfepbHtul_9S5MR7iEVCs"
});
//==================================


app.get('/', function (request, response){
  response.sendFile( __dirname + 'index.html' );
});

app.get('/pet', function (request, response) {

  var search = request.query;

  // var query =
  // "value.location:NEAR:" +
  // "{"+
  //   "latitude: "  + search.location.lat +
  //   " longitude: " + search.location.lng +
  //   " radius: "   + search.radius +
  //   "mi"+
  // "} " +
  // "AND value.animalType: (" + search.animalType + ") "   +
  // "AND value.colors: ("     + search.colors     + ") "   +
  // "AND value.date: ["       + search.startDate  + " TO " + search.endDate + "]"

  var query = "value.dateTime: [" + search.startDate  + " TO " + search.endDate + "]"

  console.log('start date', search.startDate)
  console.log('end date', search.endDate)

	db.search('sighting', query)

	.then(function(result) {
		//console.log(result.body.results);
		response.send(result.body.results);
	})
	.fail(function(err){
		console.log('error');
	});
});

app.post('/pet', function(request, response) {
  // console.log(upload)
  console.log('location: ', request.body.data.location);
  // console.log('request.file =', request.file);
  // console.log('data.file =', request.body.data.file )
  var data = JSON.parse(request.body.data);
  // console.log( typeof data)
  // console.log( 'image url=', data.imageUrl );

  uploader.upload( data.imageUrl, function (result)  {
    //console.log('return after upload: ', result);

    data.imageUrl = result.url;
    // console.log( data )
    // console.log( data.imageUrl );

    db.post('sighting', data)
      .then(function (result) {
        console.log( result.body.results );
      }).fail(function(err){
        console.log(err);
    });
  });
});

app.listen(3000);
