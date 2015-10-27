// <<<<<<< HEAD
// var MapView = Backbone.View.extend({
//        map: {},
//         id: 'map',
//    tagName: 'div',
//   // template: Handlebars.compile( $('#template-map').html() ),

//   render: function(){
//     console.log('MapView $el', this.$el)
//     this.$el.appendTo('.list-view');
//     this.loadMap();
//   },

//   initialize: function( options ){
//     _.extend( this, options )
//     this.render();
//   },

//   events: {

//   },

//   loadMap: function(){
//     var center = {lat: 45.542094, lng: -122.9346037}; //searchParams.address + math

//     this.map = new google.maps.Map(document.getElementById('map'), {
//       center: center,
//       zoom: "",//searchParams.raidus + math,
//       disableDefaultUI: true
//     });

//   },

//   populateMap: function(){
//     console.log( 'making pins' );
//     var self = this;
//     //var image = 'public/images/binoculars.png'
//     //loop through the collection
//     //make a marker for each model in the collection
//     this.collection.forEach( function( sighting ){

//       var marker = new google.maps.Marker({
//         position: sighting.get( 'location' ),
//         //icon: image,
//         map: self.map
//         // animation: google.maps.Animation.DROP
//       });

//       var infowindow = new google.maps.InfoWindow({
//         content: sighting.get('animalType') + ' @' + sighting.get('date')
//       });

//       marker.addListener('mouseover', function() {
//         infowindow.open(marker.get('map'), marker);
//       });

//       marker.addListener('mouseout', function(){
//         infowindow.close(marker.get('map'), marker);
//       })

//     })
//   }

// });
// =======
// >>>>>>> 9907e179b2e51bca7cb0200412a9b6cc56f28541
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
    var uploadForm = new UploadSightingView({});
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

      if(displayTime[0] > 12) {
        displayTime = (displayTime[0] - 12) + ":" + displayTime[1] + "pm"
      } else if (displayTime[0][0] === 0) {
        displayTime = (displayTime[0][1]) + ":" + displayTime[1] + "am"
      } else {
        displayTime = displayTime[0] + ":" + displayTime[1]
      }

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
      var dateTime = asyncParams.exifData.DateTime.split(' ')[0].split(':').join('-')

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
        dateTime 
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
    this.$el.html( this.template());
    $('#master').html(this.$el);

    $("[name=animal-type]").val(this.searchParameters.animalType);
    $("[name=address]").val(this.searchParameters.address);
    $("[name=radius]").val(this.searchParameters.radius);
    $("[name=start-date]").val(this.searchParameters.date);
    $("[name=end-date]").val(this.searchParameters.date);
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

    var options = {
        types: 'geocode',
        componentRestrictions: {
          country: 'USA'
        }
      };

    autocomplete = new google.maps.places.Autocomplete(
      ( document.getElementById('address-bar') ), options);

    autocomplete.addListener('place_changed', convertToLatLng);

    function convertToLatLng (){
      //console.log( 'changed place' );
      place = autocomplete.getPlace();
      var location = { lat: place.geometry.location.lat(), lng: place.geometry.location.lng() }
      console.log( 'location:', location );
      $('#latlng-storage').val( JSON.stringify( location ) );
      console.log( 'latlng-storage.val() = ', $('#latlng-storage').val() );
    }
  },

  events: {
    'submit form' : 'renderSearchResults'
  },

  renderSearchResults: function(event){
    console.log( 'doing it' );
    event.preventDefault();
    var searchParameters = {
    startDate : $('input[name="start-date"]').val(),
      endDate : $('input[name="end-date"]').val(),
     location : $('#latlng-storage').val(),
       radius : $('input[name="radius"]').val(),
   animalType : $('option:selected').val(),
       colors : $('input[name="color-group"]:checked').map( function(){ return this.value } ).toArray()
    }

    this.remove();

    app.collection.fetch({data : searchParameters, success: function()
      { new ResultsView ({
        collection : app.collection,
        searchParameters : searchParameters
        });
      }});
  }
});


/*  Search Results
--------------------*/
var ResultsView = Backbone.View.extend({

    tagName: 'div',
  className: 'list-view',
   template: Handlebars.compile( $('#template-results-list').html()),

  render: function() {
    this.$el.html( this.template(this.searchParameters) )
    this.$el.prependTo('#master');

    var self = this;

    this.collection.forEach(function(pet) {
      var tileView = new TileView({
          model: pet,
          parent: self
      });

      self.$el.append(tileView.$el)
    });

  },

  initialize: function( options ) {
    console.log( 'running' );
    _.extend( this, options );
    this.render();
  },

  events: {
           "click #edit" : "editSearch",
    "click #map-button"  : "mapView",
    "click #tile-button" : "listView"
  },

  editSearch: function() {
    var self = this
    var model;

    while(model = this.collection.first()){
      this.collection.remove(model);
    }

    this.remove();
    
    var editSearch = new SearchFormView({
      searchParameters : self.searchParameters
    })

  },

  mapView: function(event) {
    var $tileView = $('.lost-pet')
    $tileView.remove();

    var $mapButton = $(event.target);
    $mapButton.toggle();

    var $tileButton = $('#tile-button');
    $tileButton.toggle();

    var mapView = new MapView({ collection : this.collection });
  },

  listView: function() {
    var $mapView = $('#map')
    $mapView.remove();

    var $tileButton = $(event.target);
    $tileButton.toggle();

    var $mapButton = $('#map-button');
    $mapButton.toggle();

    var self = this;

    this.collection.forEach(function(pet) {
      var tileView = new TileView({
          model: pet,
          parent: self
      });

      self.$el.append(tileView.$el)
    });
  }

});

var TileView = Backbone.View.extend({

    tagName: 'div',
  className: 'lost-pet',
   template: Handlebars.compile($ ('#template-tile-view').html()),

  render: function() {
    this.$el.html( this.template(this.model.get('value')) );
  },

  initialize: function( options ) {
    _.extend( this, options );
    this.listenTo(this.model, 'remove', this.selfDestruct)

    this.render();
  },

  events: {
    "click .btn-description" : "showDescription"
  },


  selfDestruct: function() {
    console.log('self destruct tile view')
    this.remove();
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
       map: {},
        id: 'map',
   tagName: 'div',
  // template: Handlebars.compile( $('#template-map').html() ),

  render: function(){
    console.log('MapView $el', this.$el)
    this.$el.appendTo('.list-view');
    this.loadMap();
  },

  initialize: function( options ){
    _.extend( this, options );
    this.listenTo(this.model, 'remove', this.selfDestruct);
    this.render();
  },

  events: {

  },

  selfDestruct: function() {
    console.log('self destruct map view')
    this.remove();
  }, 

  loadMap: function(){
    var center = {lat: 45.542094, lng: -122.9346037};

    this.map = new google.maps.Map(document.getElementById('map'), {
      center: center,
      zoom: 8,
      disableDefaultUI: true
    });
  },

  populateMap: function(){
    console.log( 'making pins' );
    var self = this;
    //var image = 'public/images/binoculars.png'
    //loop through the collection
    //make a marker for each model in the collection
    this.collection.forEach( function( sighting ){

      var marker = new google.maps.Marker({
        position: sighting.get( 'location' ),
        //icon: image,
        map: self.map
        // animation: google.maps.Animation.DROP
      });

      var infowindow = new google.maps.InfoWindow({
        content: sighting.get('animalType') + ' @' + sighting.get('date')
      });

      marker.addListener('mouseover', function() {
        infowindow.open(marker.get('map'), marker);
      });

      marker.addListener('mouseout', function(){
        infowindow.close(marker.get('map'), marker);
      })

    })
  }

});