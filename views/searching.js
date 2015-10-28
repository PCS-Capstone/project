
/*========================================
            Lost a Pet Views
=========================================*/

/*  Search Form
--------------------*/
var SearchFormView = Backbone.View.extend({
    tagName: 'section',
  className: 'search',
   template: Handlebars.compile( $('#template-searchform').html() ),
   location: {},

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
      // console.log('edited search')
      this.prePopulate();
    } else {
      // console.log('new search')
      this.$el.html( this.template() );
      $('#master').html(this.$el);
    }

  },

  initialize: function( options ){
    var self = this;
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
      self.location = { lat: place.geometry.location.lat(), lng: place.geometry.location.lng() }
      // console.log( 'location:', self.location );
    }
  },

  events: {
    'submit form' : 'renderSearchResults'
  },

  renderSearchResults: function(event){
    // console.log( 'doing it' );
    var self = this;
    // console.log(self);
    // console.log( 'searchForm on submit location:', self.location)

    event.preventDefault();
    var searchParameters = {
    startDate : $('input[name="start-date"]').val(),
      endDate : $('input[name="end-date"]').val(),
     location : JSON.stringify( self.location ),
       radius : $('input[name="radius"]').val(),
   animalType : $('option:selected').val(),
       colors : $('input[name="color-group"]:checked').map( function(){ return this.value } ).toArray()
    }

    this.remove();
    // console.log( 'searchForm on submit location:', self.location)

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

    console.log( 'ResultsView.searchParamaters.location: ', this.searchParameters.location);
    var mapView = new MapView({ collection : this.collection, center: this.searchParameters.location });

    this.collection.forEach(function(pet) {
      var tileView = new TileView({
          model: pet,
          parent: self,
          mapView: mapView
      });
      self.$el.append(tileView.$el)
    });

    
  },

  initialize: function( options ) {
    console.log( 'Initializing ResultsView' );
    _.extend( this, options );
    this.render();
  },

  events: {
           "click #edit" : "editSearch",
    "click #map-button"  : "showMapView",
    "click #tile-button" : "showListView"
  },

  editSearch: function() {
    var self = this;
    var model;

    while(model = this.collection.first()){
      this.collection.remove(model);
    }

    this.remove();

    var editSearch = new SearchFormView({
      searchParameters : self.searchParameters
    })

  },

  showMapView: function(event) {
    console.log('ResultsView.showMapView()')
    // console.log( 'searchParams:', this.searchParameters );
    // console.log( 'searchParams.location:', this.searchParameters.location );

    var $tileView = $('.lost-pet');
    $tileView.remove();

    var $mapButton = $(event.target);
    $mapButton.toggle();

    var $tileButton = $('#tile-button');
    $tileButton.toggle();

    $('#map').toggleClass('hidden');
  },

  showListView: function() {
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
  
  makeMap: function() {
    // console.log( 'building map' );
    // var self = this;
    
    // var center = this.model.get('value').location;
    // // console.log( 'center of map: ', center );
    // // console.log( 'typeof center: ', typeof center );
    
    // center = JSON.stringify(center);
    // // console.log( 'center of map: ', center );
    // // console.log( 'typeof center: ', typeof center );
    
    // center = JSON.parse(center);
    // // console.log( 'center of map: ', center );
    // // console.log( 'typeof center: ', typeof center );

    // console.log(this.mapView);
    // console.log(this.mapView.map);
    // mapView.map.center = center;
    // console.log(this.mapView.map.center);
    // mapView.map.zoom = 18;
    // console.log(this.mapView.map.zoom);
    // //change map object center to match this center
    // $('#map').toggleClass('zoomed');
  },

  render: function() {
    // console.log( this.model.get('value') );
    // console.log( this.model.get('value').location );
    // console.log( typeof this.model.get('value').location );

    this.$el.html( this.template(this.model.get('value')) );
  },

  initialize: function( options ) {
    _.extend( this, options );
    this.listenTo(this.model, 'remove', this.selfDestruct)

    this.render();
    // this.makeMap();
  },

  events: {
    "click .btn-description" : "showDescription",
    "click .btn-info"        : "showMiniMap"
  },


  showMiniMap : function(event) {

    console.log( 'building map' );
    var self = this;
    
    var center = this.model.get('value').location;
    // console.log( 'center of map: ', center );
    // console.log( 'typeof center: ', typeof center );
    
    center = JSON.stringify(center);
    // console.log( 'center of map: ', center );
    // console.log( 'typeof center: ', typeof center );
    
    center = JSON.parse(center);
    // console.log( 'center of map: ', center );
    // console.log( 'typeof center: ', typeof center );

    console.log(this.mapView);
    console.log(this.mapView.map);
    
    this.mapView.map.center = center;
    console.log(this.mapView.map.center);
    
    this.mapView.map.zoom = 18;
    console.log(this.mapView.map.zoom);
    //change map object center to match this center
    $('#map').toggleClass('hidden');
    $('#map').toggleClass('zoomed');

    // console.log( event.target );
    // console.log( '.mapContainer', $(event.target).closest('.lost-pet').find('.mapContainer')[0] );
    // // console.log( $(event.target).closest('.lost-pet')[0] );
    // // console.log($(event.target).closest('.lost-pet') );
    // $(event.target).closest('.lost-pet').find('.mapContainer').toggleClass('visible');
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
    console.log('Rendeirng MapView');
    console.log('MapView.$el', this.$el);
    var $closeButton = $('<button id="close-button" class="btn btn-default btn-danger">').html('x');
    this.$el.append($closeButton);
    this.$el.toggleClass('hidden');
    this.$el.appendTo('.list-view');
    this.loadMap();
  },

  initialize: function( options ){
    _.extend( this, options );
    this.listenTo(this.model, 'remove', this.selfDestruct);
    this.render();
  },

  events: {
    'click close-button' : 'hideMap'
  },

  selfDestruct: function() {
    console.log('self destruct map view');
    this.remove();
  },

  loadMap: function(){
    console.log( 'MapView.loadMap()' );
    // console.log( 'loadMap center: ', this.center );
    var center = JSON.parse( this.center );
    console.log( 'MapView.center = ', this.center)

    this.map = new google.maps.Map(document.getElementById('map'), {
      center: center,
      // center: {"lat":45.528932,"lng":-122.68564600000002},
      zoom: 15, //need to incorporate radius math.
      disableDefaultUI: true
    });
    console.log( 'MapView.map', this.map );
    console.log( this.map.center );
    console.log( 'MapView.map DOM', document.getElementById('map') );

    this.populateMap();
  },

  hideMap : function() {
    this.$el.toggleClass('hidden');
  },

  populateMap: function(){
    console.log( 'MapView.populateMap()' );
    var self = this;
    //var image = 'public/images/binoculars.png'
    //loop through the collection
    //make a marker for each model in the collection

    // each not forEach? Backbone colleciton method
    //_.each (this.collection, ) 
    this.collection.each( function( model ){
      // console.log( 'loop => model attributes:', model.attributes );
      // console.log( 'function?', model.get );
      //console.log( 'loop => model:', model.get('value').location )
      var marker = new google.maps.Marker({
        position: model.get('value').location,
        //icon: image,
        map: self.map
        // animation: google.maps.Animation.DROP
      });

      var infowindow = new google.maps.InfoWindow({
        content: model.get('value').colors + ' ' + model.get('value').animalType + ' @ ' + model.get('value').dateTime + '</br>' + model.get('value').description
      });

      marker.addListener('mouseover', function() {
        infowindow.open(marker.get('map'), marker);
      });

      marker.addListener('mouseout', function(){
        infowindow.close(marker.get('map'), marker);
      });

    });
  }

});