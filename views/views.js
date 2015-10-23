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
    _.extend( options );
    this.render();
  },

  events: {
    'change #upload-photo' : 'populateFields',
    'submit #upload-form'  : 'submitForm'
  },

  populateFields : function() {

      var $locationField = $('#uploadLocation');
          var $dateField = $('#uploadDate');
    var $animalTypeField = $('#uploadSpecies');
         var $imageField = $('#upload-photo');
       var $imagePreview = $('#previewHolder');

    function readFromExif ( exifData ) {
      var address;//= googlePlacesMethod( exifData.GPSLatitude + exifData.GPSLongtitude )
      var date = exifData.DateTime;
      var animalType;// = justVisualMethod( image )

      $locationField.val( address );
      $dateField.val( date );
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
        asyncParams.exifData
      console.log( 'ready to send:', requestObject );
    } 

    //send it off
    function sendToServer () {
      $.ajax({
        method: "POST",
        url: "/pet",
        data: { data : JSON.stringify(requestObject) },
        success: function(data) {
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
    console.log('prepopulate $el', $(this.$el));
    console.log('animal-type from template - before temp', $("select[name='animal-type']"));
    console.log('prepopulate', this.searchParameters.address);

    this.$el.html( this.template());
    $('#master').html(this.$el);

    $("[name=animal-type]").val(this.searchParameters.animalType);
    $("[name=address]").val(this.searchParameters.address);
    $("[name=radius]").val(this.searchParameters.radius);
    $("[name=start-date]").val(this.searchParameters.startDate);
    $("[name=end-date]").val(this.searchParameters.endDate);
    $("[name=color-group]").val(this.searchParameters.colors);

    // $("[value="+this.searchParameters.size+"]").prop("checked", true);  
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
    startDate : $('input[name="start-date"]').val(),
      endDate : $('input[name="end-date"]').val(),
      address : $('input[name="address"]').val(),
          // lat : $('input[name="lat"]').val(), // obtain from googlePlaces API from search form
          // lng : $('input[name="lng"]').val(),
       radius : $('input[name="radius"]').val(),
   animalType : $('option:selected').val(),
       colors : $('input[name="color-group"]:checked').map( function(){ return this.value } ).toArray()
         // size : $('input[name="size-group"]:checked').val()
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
   template: Handlebars.compile( $('#template-results-list').html() ),

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

// searchParameters:

// date = string
// address = string
// radius = string
// animal-type = string
// color-group = array of strings
// size-group = string
