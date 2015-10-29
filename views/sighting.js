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

    /* Creates Datepicker feature
    */
    for (var i = 1; i <= 12; i++) {
      var $hourSelectOption = $('<option class="form-control">');
      $hourSelectOption.attr('id', 'hourSelectOption' + i);
      $hourSelectOption.attr('value', ""+ i);
      $hourSelectOption.html(i);
      $('#hour-select').append($hourSelectOption);
    }

    for (var j = 0; j < 60; j++) {
      var $minuteSelectOption = $('<option class="form-control">');
      $minuteSelectOption.attr('id', 'minuteSelectOption' + j);

      if (j < 10) {
        $minuteSelectOption.attr('value', "0" + j);
        $minuteSelectOption.html("0" + j);
      }
      else {
        $minuteSelectOption.attr('value', "" + j);
        $minuteSelectOption.html(j);
      }

      $('#minute-select').append($minuteSelectOption);
    }

  },

  initialize: function( options ){
    _.extend( this, options );
    this.render();
  },

  events: {
    'change #upload-photo' : 'populateFields',
    'submit #upload-form'  : 'submitForm',
    'click #uploadDate' : 'datepickerForm'
  },

  datepickerForm: function() {
    /* Creates Datepicker feature
    */
      $('#uploadDateDiv').datepicker('show')
        .on('changeDate', function(ev){
          console.log(ev.date);
          $('#uploadDateDiv').datepicker('hide');
          if (ev.date.valueOf() < startDate.valueOf()){
          }
        });
  },

  google: function() {
    $('#upload-form').remove();
    $('#map').removeClass('display-none').addClass('col-xs-12');

    var map;
    var request;
    var place;
    var infoWindow;
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
      request = {
        location: new google.maps.LatLng(45.522337,-122.676865),
        radius: '1000',
        keyword: ['animal shelter']
      };

    function createMarker(place) {
      marker = new google.maps.Marker({
        map: map,
        position: place.geometry.location
      });

      google.maps.event.addListener(marker, 'click', function() {
        infowindow.setContent(place.name);
        infowindow.open(map, this);
      });
    }

    function getResults(results, status) {
      if (status == google.maps.places.PlacesServiceStatus.OK) {
        for (var i = 0; i < results.length; i++) {
          createMarker(results[i]);
        }
      }
    }
    service = new google.maps.places.PlacesService(map);
    service.nearbySearch(request, getResults);
    }
  },

  populateFields : function() {

      var $locationField = $('#uploadLocation');
          var $dateField = $('#uploadDate');
          var $timeField = $('#uploadTime');
    var $animalTypeField = $('#uploadSpecies');
         var $imageField = $('#upload-photo');
       var $imagePreview = $('#previewHolder');

       var self = this;
       var address;
       var geocoder;

    //In case someone uploads a non-geotagged photo and then swaps it  for one with geotagged data, this clears the map
    if ($('#locationMap')) {
      $('#locationMap').remove();
    }
    //Clears data field each time new photo is uploaded
    $('#uploadDate').val('');
    //Shows image preview
    $('#previewHolder').removeClass('display-none');

    function readFromExif ( exifData ) {
      console.log('exif', exifData)
      exifData.Orientation = 1
      console.log('exif orient', exifData.Orientation)
      console.log('post change', exifData)
      if ( !(exifData.GPSLatitude) || !(exifData.GPSLongitude) ) {
        self.googleAutocomplete();
      }
      else {
        function degToDec (latLngArray) {
          console.log('longitude negative? ', latLngArray[0])
          var decimal = (latLngArray[0] + (latLngArray[1]/ 60) + (latLngArray[2]/ 3600));
          return decimal;
        }

        var latDecimal = degToDec(exifData.GPSLatitude);

        if (exifData.GPSLongitudeRef === "W") {
          var lngDecimal = (-(degToDec(exifData.GPSLongitude)));
        } else {
          var lngDecimal = degToDec(exifData.GPSLongitude)
        }

        // google places to fill out address based on latDecimal / lngDecimal
        address = {lat: latDecimal, lng: lngDecimal};
        self.lat = address.lat;
        self.lng = address.lng;


        var displayDate = exifData.DateTime.split(' ')[0];
        var displayTime = exifData.DateTime.split(' ')[1];
        console.log(displayTime);

        displayDate = (displayDate.split(':'))
        displayDate = displayDate[1] + "/" + displayDate[2] + "/" + displayDate[0]

        displayTime = (displayTime.split(':'))

        if(parseInt(displayTime[0]) > 12) {
          displayTime = (displayTime[0] - 12) + ":" + displayTime[1] + "pm"
        } else if (displayTime[0][0] === 0) {
          displayTime = (displayTime[0][1]) + ":" + displayTime[1] + "am"
        } else {
          displayTime = displayTime[0] + ":" + displayTime[1]
        }
      }

        $locationField.val( address );
        $dateField.val( displayDate );
        $timeField.val( displayTime );
        $animalTypeField.val( animalType );
        codeAddress();
    }

    function codeAddress() {
      geocoder = new google.maps.Geocoder;
      geocoder.geocode( { 'location': {lat: self.lat, lng: self.lng } }, function(results, status) {
        $('#uploadLocation').val(results[0].formatted_address);
      });
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
        console.log('xf orient pre', xf.Orientation)
        xf.Orientation = 1
        console.log('xf orient post', xf.Orientation)
        console.log('xf', xf)
        readFromExif(xf);
      });
    }

    previewImage( $imageField );
    getExifData();

  },

  time: function(){
    console.log('time');
    var time = ($('#uploadTime').val());
    time = time.split(':');

    var timeOfDay = $('#uploadTimeAmPm').val();
    console.log('am/pm', $('#uploadTimeAmPm').val());
    if(timeOfDay === "pm") {

      if(parseInt(time[0]) === 12) {
        time = ($('#uploadTime').val());
      } else {
        time[0] = (parseInt(time[0]) + 12);
        time = time[0] + ":" + time[1];
      }
    } else {

      if(parseInt(time[0]).length === 1) {
        time = "0" + time[0] + ":" + time[1];
      } else if(parseInt(time[0]) === 12) {
        time[0] = "00";
        time = time[0] + ":" + time[1];
      } else {
        time = ($('#uploadTime').val());
      }

    }

    console.log(time);

  },

  submitForm : function(event) {
    event.preventDefault();

    var self = this;
    console.log( 'this.lat/long=', self.lat, '/', self.lng);
    var requestObject = {};
    self.time();
    //get the file from the input field
    //run EXIF with the file
    //expose the result to a callback (async)
    function getExifData ( makeObjectFunction, shipObjectFunction ){
      console.log( 'running addExif' );
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

      if(asyncParams.exifData.DateTime) {
        var dateTime = asyncParams.exifData.DateTime.split(' ')[0].split(':').join('-');
        requestObject.dateTime = dateTime;
      }

      requestObject.imageUrl =
        $('#previewHolder')
          .attr('src');
      requestObject.location = {
            lat: self.lat,
            lng: self.lng
      };
      requestObject.prettyLocation = 
        this.
      requestObject.displayDate =
        $('#uploadDate')
          .val();
      requestObject.displayTime =
        $('#uploadTime')
          .val();
      requestObject.animalType =
        $('#uploadSpecies')
          .val();
      requestObject.description =
        $('#uploadDescription')
          .val();
      requestObject.colors =
        $('input[name="color-group"]:checked')
          .map(function() {
            return this.value;
          })
          .toArray();
      // requestObject.exifData =
      //   asyncParams.exifData;
      requestObject.address =
        $('#uploadLocation').val();
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

    this.remove();
    // var success = new SuccessfulSubmission({})
    var error = new Error({});
  },
  googleAutocomplete: function() {
    /*------------------------------------------------------------------------
      In case the exif geolocation data is abset, this entire function adds a:
        --Google Autocomplete Input Field and Map to the form's loation field.
    ------------------------------------------------------------------------*/
    /* Builds new elements:
        --Form Location field
        --Location Map
    */
    $('#uploadLocation').val('');
    $('<div id="locationMap" class="col-xs-12" style="height:300px"></div>').insertAfter('#uploadLocation');

    var autocomplete;
    var map;
    var request;
    var place;
    var infoWindow;
    var marker;
    var geocoder;
    var location = {};

    var self = this;

    /* Builds Google Autocomplete Input field
    */
    //Sets options for Google Autocomplete
    (function() {
      var options = {
        types: 'geocode',
        componentRestrictions: {
          country: 'USA'
        }
      };
      //Creates instance of Google Autocomplete
      autocomplete = new google.maps.places.Autocomplete(
      /** @type {!HTMLInputElement} */(document.getElementById('uploadLocation')), options);
    })();

    //When a Google Autcomplete Location is selected, captures lat/long and creates marker
      //This function is triggered as a listener on the autcomplete (declared immediately after codeAddress function)
    function fillInAddress() {
      place = autocomplete.getPlace();
      self.lat = place.geometry.location.lat();
      self.lng = place.geometry.location.lng();
      createMarker();
    }

    //Creates new markers
    function createMarker(xMapClickEvent) {
      //Clears existing marker when new marker is added
      if (marker) {
        marker.setMap(null);
      }
      //Builds and Appends Marker
      marker = new google.maps.Marker({
        map: map,
        position: {lat: self.lat, lng: self.lng},
        animation: google.maps.Animation.DROP,
        draggable:true
      });
      //Provides drag functionality to marker;
        //Sets marker creation and captures lat/long when drag is complete
      google.maps.event.addListener(marker,'dragend',function(event) {
        self.lat = event.latLng.lat();
        self.lng = event.latLng.lng();
        codeAddress();
      });
      codeAddress();
      map.setZoom(11);
      map.setCenter({lat: self.lat, lng: self.lng});
    }

    //Uses Geocoder to convert lat/long into Street Address to display in location input field
      //Geocoder sends a request using lat/long;
      //Takes first (formatted address) result and sets location input form field to value
    function codeAddress() {
      geocoder.geocode( { 'location': {lat: self.lat, lng: self.lng}}, function(results, status) {
        $('#uploadLocation').val(results[0].formatted_address);
      });
    }
    autocomplete.addListener('place_changed', fillInAddress);

    /* Creates Google Map*/
    (function () {
      map = new google.maps.Map(document.getElementById('locationMap'), {
        center: {lat: 45.522337, lng: -122.676865},
        zoom: 12
      });
      //Adds click and drop pin capability to Google Map
        //Saves value of lat/long to Location variable (at top)
      map.addListener('click', function(mapClickEvent) {
        // location.lat = mapClickEvent.latLng.lat();
        // location.lng = mapClickEvent.latLng.lng();
        self.lat = mapClickEvent.latLng.lat();
        self.lng = mapClickEvent.latLng.lng();
        createMarker(mapClickEvent);
      });
      //Creates Google Geocoder, which is needed by the codeAddress() function:
        //This is needed to convert lat/long into Street Address, to display in location's input field for user
      geocoder = new google.maps.Geocoder;
    })();
  }
});
