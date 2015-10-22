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




app.get('/pet', function(request, response) {
	var query = "value.animalType: (" + request.query.animalType + ")";
  console.log('db query=', query);
	db.search('sighting', query) // params?  data?  body?
	.then(function(result) {
		//console.log(result.body.results);
		response.send(result.body.results);
	})
	.fail(function(err){
		console.log(err);
	});
});

app.post('/pet', function(request, response) {
  // console.log(upload)
  // console.log(request.body.data);
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
        console.log( result );
      }).fail(function(err){
        console.log(err);
    });
  });
});

app.listen(3000);
