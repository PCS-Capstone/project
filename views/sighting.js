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
    /* For the form's hours and minutes, this creates the options of 1-12(hour) and 0-59(minute)
    */
    for (var j = 0; j < 60; j++) {
      var $minuteSelectOption = $('<option class="form-control">');
      $minuteSelectOption.attr('id', 'minuteSelectOption' + j);
      //This adds an initial zero if the minute number is below 10 (i.e. 01, 02, 03...)
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
    'click #uploadDate' : 'datepickerForm',
    'click #upload-photo-div button' : 'uploadPhoto',
    'click #uploadLocationButton' : 'googleAutocomplete'
  },
  uploadPhoto: function() {
    $('#upload-photo').trigger('click');
  },

  datepickerForm: function() {
    /* Creates Datepicker feature
    */
      $('#uploadDateDiv').datepicker('show')
        .on('changeDate', function(ev){
          console.log(ev.date);
          $('#uploadDateDiv').datepicker('hide');
        });
  },

  google: function() {
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

    var $imageField = $('#upload-photo');
    var $imagePreview = $('#previewHolder');

    var self = this;
    var geocoder;
    var displayDate;
    var displayTime;

    //In case someone uploads a non-geotagged photo and then swaps it  for one with geotagged data, this clears the map
    if ($('#locationMap')) {
      $('#locationMap').remove();    }
    //Clears data field each time new photo is uploaded
    $('#uploadDate').val('');

    function codeAddress(xLat, xLng) {
      // console.log('code address running');
      geocoder = new google.maps.Geocoder;
      geocoder.geocode( { 'location': {lat: xLat, lng: xLng } }, function(results, status) {
        $('#uploadLocation').val(results[0].formatted_address);
      });
    }

    //Shows image preview
    // $('#previewHolder').removeClass('display-none');

    function readFromExif ( exifData ) {
      if ( !(exifData.GPSLatitude) || !(exifData.GPSLongitude) ) {
        self.googleAutocomplete();
      }
      else {
        $('#uploadLocationButton').removeClass("display-none");
      
        function degToDec(latLngArray) {
          // console.log('longitude negative? ', latLngArray[0]);
          var decimal = (latLngArray[0] + (latLngArray[1]/ 60) + (latLngArray[2]/ 3600));
          return decimal;
        }

        var latDecimal = degToDec(exifData.GPSLatitude);
        // console.log(latDecimal);

        if (exifData.GPSLongitudeRef === "W") {
          var lngDecimal = (-(degToDec(exifData.GPSLongitude)));
        }
        else {
          var lngDecimal = degToDec(exifData.GPSLongitude);
        }
        // google places to fill out address based on latDecimal / lngDecimal
        self.lat = latDecimal;
        self.lng = lngDecimal;
        //Run codeAddress() to display street address in form's location input field
        codeAddress(self.lat, self.lng);
      }

      if (exifData.DateTime) {

        displayDate = exifData.DateTime.split(' ')[0];
        displayTime = exifData.DateTime.split(' ')[1];
        console.log('displayTime = ' + displayTime);

        displayDate = (displayDate.split(':'));
        displayDate = displayDate[0] + "-" + displayDate[2] + "-" + displayDate[1];

        displayTime = (displayTime.split(':'))

      }

      console.log('exif orient', exifData.Orientation)
      if(exifData.Orientation === 6) {
        $('#previewHolder').addClass('rotate90');
      }

      if (parseInt(displayTime[0]) > 12) {

        $("#pm").prop("checked", true);

        //Compile 0-12 hour format
        var hour = displayTime[0] - 12;
        var minute = displayTime[1];

        $('#hour-select').val(hour);
        $('#minute-select').val(minute);
        displayTime = (displayTime[0] - 12) + ":" + displayTime[1] + "pm";
      }
      else if (displayTime[0][0] === 0) {
        displayTime = (displayTime[0][1]) + ":" + displayTime[1] + "am";
      }
      else {
        displayTime = displayTime[0] + ":" + displayTime[1];
      }

      $dateField.val( displayDate );
    }

    function previewImage ( inputElement ) {
      var image  = inputElement[0].files[0];
      var reader = new FileReader();

      reader.onload = function(event) {
        $('#upload-photo-div').remove();
        $imagePreview.attr('src', event.target.result);
        //Shows image preview
        $imagePreview.removeClass('display-none');

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

    getExifData();
    previewImage( $imageField );

    $('#previewHolder').removeClass('display-none');

  },

  time: function(){
    //*** Reformat to fit new time options ***//
    //*** id = hour-select and minute-select ***//

    // console.log('time');
    // var time = ($('#uploadTime').val());
    // time = time.split(':');

    // var timeOfDay = $('#uploadTimeAmPm').val();
    // console.log('am/pm', $('#uploadTimeAmPm').val());
    // if(timeOfDay === "pm") {

    //   if(parseInt(time[0]) === 12) {
    //     time = ($('#uploadTime').val());
    //   } else {
    //     time[0] = (parseInt(time[0]) + 12);
    //     time = time[0] + ":" + time[1];
    //   }
    // } else {

    //   if(parseInt(time[0]).length === 1) {
    //     time = "0" + time[0] + ":" + time[1];
    //   } else if(parseInt(time[0]) === 12) {
    //     time[0] = "00";
    //     time = time[0] + ":" + time[1];
    //   } else {
    //     time = ($('#uploadTime').val());
    //   }

    // }

    // console.log(time);

  },

  submitForm : function(event) {
    event.preventDefault();

    var self = this;
    console.log( 'this.lat/long=', self.lat, '/', self.lng);
    var requestObject = {};
    // self.time();
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
        console.log('dateTime = ' + dateTime);
      }

      requestObject.imageUrl = $('#previewHolder').attr('src');
      requestObject.location = {
        lat: self.lat,
        lng: self.lng
      };
      requestObject.address = $('#uploadLocation').val();
      requestObject.displayDate = $('#uploadDate').val();
      requestObject.displayTime = '' + $('#hour-select').val() + ':' + $('#minute-select').val() + ' ' + $('input[name="am-pm"]:checked').val();
      requestObject.animalType = $("#uploadSpecies option:selected").val();
      requestObject.description = $('#uploadDescription').val();
      requestObject.colors = $('input[name="color-group"]:checked').map(function() {
        return this.value;
      }).toArray();
      requestObject.exifData = asyncParams.exifData;

      callback();
    }

    console.log(requestObject);

    //send it off
    function sendToServer () {
      $.ajax({
        method: "POST",
        url: "/pet",
        data: { data : JSON.stringify(requestObject) },
        success: function(data) {
          $('#upload-form').remove();
          $('#previewHolder').remove();
          self.google();
          console.log(data);
        }
      });
    }

    getExifData( buildDataForServer, sendToServer );

    // this.remove();
    // // var success = new SuccessfulSubmission({})
    // var error = new Error({});
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

    // $('#uploadLocation').val('');
    $('#uploadLocationButton').remove();
    $('<div id="locationMap" class="col-xs-12" style="height:300px"></div>').insertAfter('#uploadLocation');

    var autocomplete;
    var map;
    var request;
    var place;
    var infoWindow;
    var marker;
    var geocoder;

    var self = this;

    /*
      Builds Google Autocomplete Input field
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
      map.setZoom(12);
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

    /* ----------------
     Creates Google Map
    ------------------- */
    (function () {

      var centerLat;
      var centerLng;

      if (navigator.geolocation) {
          navigator.geolocation.getCurrentPosition(showPosition);
      }
      else {
        map = new google.maps.Map(document.getElementById('locationMap'), {
          center: {lat: 39.5, lng: -98.35},
          zoom: 4
        });
        mapListener();
      }

      function showPosition(position) {
        centerLat = position.coords.latitude;
        centerLng = position.coords.longitude;
        map = new google.maps.Map(document.getElementById('locationMap'), {
          center: {lat: centerLat, lng: centerLng},
          zoom: 12
        });
        mapListener();
      }

      function mapListener() {
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
      }

    })();
  }

});
