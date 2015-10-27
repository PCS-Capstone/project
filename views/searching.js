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
      console.log('edited search')
      this.prePopulate();
    } else {
      console.log('new search')
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
      console.log( 'location:', self.location );
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
     location : JSON.stringify( this.location ),
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

  mapView: function(event) {
    console.log( 'searchParams:', this.searchParameters );
    console.log( 'searchParams.location:', this.searchParameters.location );

    var $tileView = $('.lost-pet');
    $tileView.remove();

    var $mapButton = $(event.target);
    $mapButton.toggle();

    var $tileButton = $('#tile-button');
    $tileButton.toggle();

    var mapView = new MapView({ collection : this.collection, center: this.searchParameters.location });
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
    console.log('MapView $el', this.$el);
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
    console.log('self destruct map view');
    this.remove();
  },

  loadMap: function(){
    console.log( 'loadMap center: ', this.center );
    var center = JSON.parse( this.center );

    this.map = new google.maps.Map(document.getElementById('map'), {
      center: center,
      zoom: 15, //need to incorporate radius math.
      disableDefaultUI: true
    });

    this.populateMap();
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
      });

    });
  }

});