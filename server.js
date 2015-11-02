var express = require('express');
var bodyParser = require('body-parser');
var logger = require('morgan');
var pretty = require('prettyjson');

var config = require('./config');
var db = require('orchestrate')(config.dbkey);

var app = express();

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({limit: '50mb', extended: true}));
app.use(express.static(__dirname));

//==================================
//   CLOUD STORAGE CODE HERE
var cloudinary = require('cloudinary');
var uploader   = cloudinary.uploader;

cloudinary.config( config.cloudinary );
//==================================


app.get('/', function (request, response){
  response.sendFile( __dirname + '/public/index.html' );
});

app.get('/pet', function (request, response) {
  console.log(request.query)

  var search = request.query;
  search.location = JSON.parse(search.location);

  var query = "value.animalType: (" + search.animalType + ")" + 
  "AND value.location:NEAR:{latitude:" + search.location.lat +
  " longitude:" + search.location.lng + " radius:" + search.radius + "mi" + "}" +
  "AND value.dateTime: [" + search.startDate  + " TO " + search.endDate + "]"
   
  if (search.colors) {
    query += "AND value.colors: (" + search.colors + ")"
  }

	db.search('test', query)

	.then(function(result) {
		response.send(result.body.results);
	})
	.fail(function(err){
		console.log('error');
	});
});

app.post('/pet', function(request, response) {
  // console.log(upload)
  // console.log('request.file =', request.file);
  // console.log('data.file =', request.body.data.file )
  var data = JSON.parse(request.body.data);
  console.log('location: ', data.location);
  // console.log( typeof data)
  // console.log( 'image url=', data.imageUrl );

  uploader.upload( data.imageUrl, function (result)  {
    //console.log('return after upload: ', result);

    data.imageUrl = result.url;
    // console.log( data )
    // console.log( data.imageUrl );
    db.post('test', data)
      .then(function (result) {
        console.log( 'confirmed!: ', pretty.render( JSON.parse( result.request.body ) ) );
      }).fail(function(err){
        console.log(err);
    });
  });
  response.send('server received form submission');
});

app.listen(3000);
console.log( 'listening on PORT:3000' );
