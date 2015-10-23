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
    // 'change #upload-photo' : 'uploadPhoto',
    'submit #upload-form' : 'submitForm'
  },
  submitForm: function(event) {
    event.preventDefault();

    var formData = {};
    formData.imageUrl = $('#upload-photo').val();
    formData.location = $('#uploadLocation').val();
    formData.date = $('#uploadDate').val();
    formData.animalType = $('#uploadSpecies').val();
    formData.size = $('input[name="size"]:checked').val();
    formData.description = $('uploadDescription').val();

     var xColors = $('input[name="color"]:checked').map(function() {
       return this.value;
     }).toArray();

    formData.colors = xColors;

    var self = this;

    $.ajax({
      method: "POST",
      url: "/pet",
      data: { data : JSON.stringify(formData) }
    })
    .done(function( msg ) {
      self.google();
    });
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
  uploadPhoto: function(event) {
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
