/*========================================
           Found a Pet Views
========================================*/

/*  Photo Prompt
--------------------*/
var UploadSightingView = Backbone.View.extend({

    tagName: 'div',
  className: 'upload',

   template: Handlebars.compile( $('#template-upload-sighting').html() ),
  render: function(){
    this.$el.html( this.template() );
    $('#master').append(this.$el);
  },

  initialize: function( options ){
    _.extend( this, options );
    this.render();
  },

  events: {
    'change #upload-photo' : 'populateFields',
    'submit #upload-form'  : 'submitForm'
  },

  google: function() {
    $('#upload-form').remove();
    $('#map').removeClass('display-none');

    var map;
    var request;
    var place;
    var infoWindow;
    var placeLoc;
    var marker;

    (function () {
      map = new google.maps.Map(document.getElementById('map'), {
        center: {lat: 45.522337, lng: -122.676865},
        zoom: 12
      });
      infowindow = new google.maps.InfoWindow();
      callback();
    })();

    function callback() {
      console.log('callback');
      request = {
        location: new google.maps.LatLng(45.522337,-122.676865),
        radius: '1000',
        keyword: ['animal shelter']
      };

    function createMarker(place) {
      placeLoc = place.geometry.location;
      marker = new google.maps.Marker({
        map: map,
        position: place.geometry.location
      });

      google.maps.event.addListener(marker, 'click', function() {
        infowindow.setContent(place.name);
        infowindow.open(map, this);
      });
    }

    function hello(results, status) {
      if (status == google.maps.places.PlacesServiceStatus.OK) {
        for (var i = 0; i < results.length; i++) {
          createMarker(results[i]);
        }
      }
    }
    service = new google.maps.places.PlacesService(map);
    service.nearbySearch(request, hello);
    }
  },

  populateFields : function() {

      var $locationField = $('#uploadLocation');
          var $dateField = $('#uploadDate');
          var $timeField = $('#uploadTime');
    var $animalTypeField = $('#uploadSpecies');
         var $imageField = $('#upload-photo');
       var $imagePreview = $('#previewHolder');

    function readFromExif ( exifData ) {

       function degToDec (latLngArray) {
        var decimal = (latLngArray[0] + (latLngArray[1]/ 60) + (latLngArray[2]/ 3600));
        return decimal
       }

      var latDecimal = degToDec(exifData.GPSLatitude)
      var lngDecimal = degToDec(exifData.GPSLongitude)

      // google places to fill out address based on latDecimal / lngDecimal
      var address = {lat: latDecimal, lng: lngDecimal}

      // var exifDateTime = exifData.DateTime

      var displayDate = exifData.DateTime.split(' ')[0];
      var displayTime = exifData.DateTime.split(' ')[1];

      displayDate = (displayDate.split(':'))
      displayDate = displayDate[1] + "/" + displayDate[2] + "/" + displayDate[0]

      displayTime = (displayTime.split(':'))
      displayTime = displayTime[0] + ":" + displayTime[1]

      var animalType;// = justVisualMethod( image )

      $locationField.val( address );
      $dateField.val( displayDate );
      $timeField.val( displayTime );
      $animalTypeField.val( animalType );
    }

    function previewImage ( inputElement ) {
      var image  = inputElement[0].files[0];
      var reader = new FileReader();

      reader.onload = function(event) {
        $imagePreview.attr('src', event.target.result);
      };

      reader.readAsDataURL( image );
    }

    function getExifData ( ){
      var image = $imageField[0].files[0];

      EXIF.getData(image, function() {
        var xf = EXIF( this ).EXIFwrapped.exifdata;
        readFromExif(xf);
      });
    }

    previewImage( $imageField );
    getExifData();

  },

  submitForm : function(event) {

    event.preventDefault();
    var requestObject = {};

    //get the file from the input field
    //run EXIF with the file
    //expose the result to a callback (async)
    function getExifData ( makeObjectFunction, shipObjectFunction ){
      console.log( 'running addExif' )
      var image = document.getElementsByName('photo')[0].files[0];

      EXIF.getData(image, function() {
        var xf = EXIF( this ).EXIFwrapped.exifdata;
        console.log( 'xf=', xf );
        makeObjectFunction( { exifData : xf }, shipObjectFunction );
      });
    }

    // get all the values from the search form
    // save them as properties on the requestObject
    function buildDataForServer ( asyncParams, callback ) {
      requestObject.imageUrl = 
        $('#previewHolder')
          .attr('src');
      requestObject.location = 
        $('#uploadLocation')
          .val();
      requestObject.displayDate = 
        $('#uploadDate')
          .val();
      requestObject.displayTime = 
        $('#uploadTime')
          .val();
      requestObject.dateTime = 
        asyncParams.exifData.DateTime;
      requestObject.animalType = 
        $('#uploadSpecies')
          .val();
      requestObject.description = 
        $('uploadDescription')
          .val();
      requestObject.colors = 
        $('input[name="color-group"]:checked')
          .map(function() {
            return this.value;
          })
          .toArray();
      requestObject.exifData = 
        asyncParams.exifData
      console.log( 'ready to send:', requestObject );

      callback();
    } 

    //send it off
    function sendToServer () {
      $.ajax({
        method: "POST",
        url: "/pet",
        data: { data : JSON.stringify(requestObject) },
        success: function(data) {
          self.google();
          console.log(data);
        }
      });
    }

    getExifData( buildDataForServer, sendToServer );
  }
});