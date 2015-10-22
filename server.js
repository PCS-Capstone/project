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

//==================================
// MULTIPART FORM ENCODER CODE HERE
var multer = require('multer');
var upload = multer({dest:'./uploads/'})
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

  console.log("animalType", request.query.animalType)
  var query = "value.location:NEAR:{latitude:"+request.query.lat+" longitude: "+request.query.lng+
    " radius: "+request.query.radius+"mi} AND value.animalType: (" + request.query.animalType + ") AND
    value.colors: (" + request.query.colors + ")"

	db.search('shelter', query)
	.then(function(result) {
		console.log(result.body.results);
		response.send(result.body.results);
	})
	.fail(function(err){
		console.log('error');
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

app.post('/photoUpload', upload.single('image'), function (req,res){
  console.log('req.file =', req.file);
  
  uploader.upload( req.file.path, function (result)  {
    console.log('return after upload: ', result);
  });
});

app.listen(3000);
