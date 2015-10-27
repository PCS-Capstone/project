/*========================================
                HOMEPAGE
========================================*/

var HomePageView = Backbone.View.extend({
    tagName: 'div',
  className: 'home',
  render: function(){
    // var $title       = $('<h1>').html('Lost a Pet?');
    var $foundButton = $('<button id="found-button" class="btn btn-default btn-lg">').html( 'Found a Pet' );
    var $lostButton  = $('<button id="lost-button" class="btn btn-default btn-lg">').html( 'Lost a Pet' );

    this.$el.append( [ $foundButton, $lostButton] );
    this.$el.appendTo( '#master' );
  },
  initialize: function( options ){
    _.extend( options );
    this.render();
  },

  events: {
    'click #found-button' : 'renderUploadPage',
    'click #lost-button'  : 'renderSearchForm'
  },
  renderUploadPage: function(){
    this.remove();
    var uploadForm = new UploadSightingView({
      lat: 0,
      lng: 0
    });
  },
  renderSearchForm: function(){
    this.remove();
    var searchForm = new SearchFormView({});
  }
});



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

      if ( !(exifData.GPSLatitude) || !(exifData.GPSLatitude) ) {
        self.googleAutocomplete();
      }

       function degToDec (latLngArray) {
        var decimal = (latLngArray[0] + (latLngArray[1]/ 60) + (latLngArray[2]/ 3600));
        return decimal;
       }

      var latDecimal = degToDec(exifData.GPSLatitude);
      var lngDecimal = degToDec(exifData.GPSLongitude);

      // google places to fill out address based on latDecimal / lngDecimal
      address = {lat: latDecimal, lng: lngDecimal};
      self.lat = address.lat;
      self.lng = address.lng;

      var date = exifData.DateTime;
      var animalType;// = justVisualMethod( image )

      $dateField.val( date );
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
        readFromExif(xf);
      });
    }

    previewImage( $imageField );
    getExifData();

  },

  submitForm : function(event) {
    event.preventDefault();

    var self = this;
    var requestObject = {};

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
      requestObject.imageUrl =
        $('#previewHolder')
          .attr('src');
      requestObject.location = {
        lat: self.lat,
        lng: self.lng
      };
      requestObject.date =
        $('#uploadDate')
          .val();
      requestObject.animalType =
        $('#uploadSpecies')
          .val();
      requestObject.size =
        $('input[name="size"]:checked')
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
        asyncParams.exifData;
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
  },
  googleAutocomplete: function() {
    /*------------------------------------------------------------------------
      In case the exif geolocation data is abset, this entire function adds a:
        --Google Autocomplete Input Field and Map to the form's loation field.
    ------------------------------------------------------------------------*/
    /*
      Builds new elements:
        --Form Location field
        --Location Map
    */
    $('#uploadLocation').val('');
    $('<div id="locationMap" class="col-xs-12 col-md-8 col-md-offset-2" style="height:300px"></div>').insertAfter('#uploadLocation');

    var autocomplete;
    var map;
    var request;
    var place;
    var infoWindow;
    var marker;
    var geocoder;
    var location = {};

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
      location.lat = place.geometry.location.lat();
      location.lng = place.geometry.location.lng();
      self.lat = place.geometry.location.lat();
      self.lng = place.geometry.location.lng();
      createMarker();
    }

    //Creates new markers
    function createMarker(xMapClickEvent) {
      console.log(location);
      //Clears existing marker when new marker is added
      if (marker) {
        marker.setMap(null);
      }
      //Builds and Appends Marker
      marker = new google.maps.Marker({
        map: map,
        position: location,
        animation: google.maps.Animation.DROP,
        draggable:true
      });
      //Provides drag functionality to marker;
        //Sets marker creation and captures lat/long when drag is complete
      google.maps.event.addListener(marker,'dragend',function(event) {
        location.lat = event.latLng.lat();
        location.lng = event.latLng.lng();
        self.lat = event.latLng.lat();
        self.lng = event.latLng.lng();
        codeAddress();
      });
      codeAddress();
      map.setZoom(11);
      map.setCenter(location);
    }

    //Uses Geocoder to convert lat/long into Street Address to display in location input field
      //Geocoder sends a request using lat/long;
      //Takes first (formatted address) result and sets location input form field to value
    function codeAddress() {
      geocoder.geocode( { 'location': location}, function(results, status) {
        $('#uploadLocation').val(results[0].formatted_address);
      });
    }
    autocomplete.addListener('place_changed', fillInAddress);

    /*
      Creates Google Map
    */
    (function () {
      map = new google.maps.Map(document.getElementById('locationMap'), {
        center: {lat: 45.522337, lng: -122.676865},
        zoom: 12
      });
      //Adds click and drop pin capability to Google Map
        //Saves value of lat/long to Location variable (at top)
      map.addListener('click', function(mapClickEvent) {
        location.lat = mapClickEvent.latLng.lat();
        location.lng = mapClickEvent.latLng.lng();
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



/*========================================
            Lost a Pet Views
=========================================*/

/*  Search Form
--------------------*/
var SearchFormView = Backbone.View.extend({

    tagName: 'section',
  className: 'search',
   template: Handlebars.compile( $('#template-searchform').html() ),

  prePopulate : function(){
    console.log('prepopulate $el', $(this.$el));
    console.log('animal-type from template - before temp', $("select[name='animal-type']"));
    console.log('prepopulate', this.searchParameters.address);

    this.$el.html( this.template());
    $('#master').html(this.$el);

    $("[name=animal-type]").val(this.searchParameters.animalType);
    $("[name=address]").val(this.searchParameters.address);
    $("[name=radius]").val(this.searchParameters.radius);
    $("[name=date]").val(this.searchParameters.date);
    $("[name=color-group]").val(this.searchParameters.colors);
    $("[value="+this.searchParameters.size+"]").prop("checked", true);
  },
  render: function(){
    if (this.searchParameters !== undefined) {
      console.log('edited search')
      this.prePopulate();
    } else {
      console.log('new search')
      this.$el.html( this.template() );
      $('#master').html(this.$el);
    }

  },
  initialize: function( options ){
    _.extend( this, options );
    this.render();
  },

  events: {
    'submit form' : 'renderSearchResults'
  },

  renderSearchResults: function(event){
    event.preventDefault();
    var searchParameters = {
         date : $('input[name="date"]').val(),
      address : $('input[name="address"]').val(),
       radius : $('input[name="radius"]').val(),
   animalType : $('option:selected').val(),
       colors : $('input[name="color-group"]:checked').map( function(){ return this.value } ).toArray(),
         size : $('input[name="size-group"]:checked').val()
    }

    this.remove();

    app.collection.fetch({data : searchParameters, success: function()
      { new ListView ({
        collection : app.collection,
        searchParameters : searchParameters
        });
      }});
  }
});



/*  Search Results
--------------------*/
var ListView = Backbone.View.extend({

    tagName: 'div',
  className: 'list-view',
   template: Handlebars.compile( $('#template-results-list').html()),

  render: function() {

    this.$el.html( this.template(this.searchParameters) )
    this.$el.prependTo('#master');

    var self = this;

    this.collection.forEach(function(pet) {
      var lostPetView = new LostPetView({
          model: pet
      });

      self.$el.append(lostPetView.$el)
    });

  },
  initialize: function( options ) {
    _.extend( this, options );
    this.render();
  },
  events: {
    "click #edit" : "editSearch",
    "click #map"  : "mapView"
  },
  editSearch: function() {
    var self = this;
    this.remove();
    console.log('listview', this.searchParameters)
    var editSearch = new SearchFormView({
      searchParameters : self.searchParameters
    })
    // SearchFormView.render();
  },
  mapView: function() {
    this.remove();
    var mapView = new MapView({});
  }
});


var LostPetView = Backbone.View.extend({

    tagName: 'div',
  className: 'lost-pet',
   template: Handlebars.compile($ ('#template-lostpetview').html()),

  render: function() {
    this.$el.html( this.template(this.model.get('value')) );
  },
  initialize: function( options ) {
    _.extend( this, options );
    this.render();
  },

  events: {
    "click .btn-description" : "showDescription"
  },

  showDescription : function(event){
    var $button = $(event.target);
    $button.closest('.lost-pet').find('.description').slideToggle();
    if ( $button.html() === '+' ){
      $button.html( '-' );
    }
    else {
      $button.html( '+' );
    }
  }


});

var MapView = Backbone.View.extend({

        id: 'map',
   tagName: 'div',
  template: Handlebars.compile( $('#template-map').html() ),

  render: function(){
    // this.initMap(); // How do I call the cdn at will?
    this.$el.appendTo('#master');
  },
  initialize: function(){
    this.render();
  },

  events: {

  },
  initMap: function(){
    map = new google.maps.Map(this.$el, {
      center: {lat: -34.397, lng: 150.644},
      zoom: 8
    });
  }

});
