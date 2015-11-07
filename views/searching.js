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

    $("[name=animal-type]").val(app.searchParameters.animalType);
    $("[name=address]").val(app.searchParameters.address);
    $("[name=radius]").val(app.searchParameters.radius);
    $("[name=start-date]").val(app.searchParameters.startDate);
    $("[name=end-date]").val(app.searchParameters.endDate);
    $("[name=color-group]").val(app.searchParameters.colors);
  },

  render: function(){
    currentView = this;
    console.log('searchParams', app.searchParameters)
    // console.log('self.location', self.location)

    if (app.searchParameters !== undefined) {
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
        types: ['geocode'],
        componentRestrictions: {country: 'USA'}
      };

    var autocomplete = new google.maps.places.Autocomplete(
      ( document.getElementById('address-bar') ), options);

    autocomplete.addListener('place_changed', convertToLatLng);

    function convertToLatLng (){
      //console.log( 'changed place' );
      place = autocomplete.getPlace();
      app.searchParameters.location = { lat: place.geometry.location.lat(), lng: place.geometry.location.lng() }
      console.log( 'location:', app.searchParameters.location );
    }
  },

  events: {
    'submit form' : 'renderSearchResults',
    'click #start-date' : 'datepicker',
    'click #end-date' : 'datepicker'
  },

  datepicker: function(event) {
    console.log(event.target.id);
    $('#' + event.target.id).datepicker('show')
      .on('changeDate', function(ev){
        console.log(ev.date);
        $('#' + event.target.id).datepicker('hide');
      });
  },

  renderSearchResults: function(event){
    var self = this;
    var month = ['January', 'February', 'March', 'April', 'May', 'June', 'July',
                  'August', 'September', 'October', 'November', 'December'];

    event.preventDefault();

    var shortAddress = $('input[name="address"]').val().split(',')
    shortAddress.splice((shortAddress.length)-1)

    // var prettyStartDate = $('input[name="start-date"]').val().split('-');
    // prettyStartDate = (month[(prettyStartDate[1]) -1] + " " + prettyStartDate[2] +
    //   ', ' + prettyStartDate[0])
    // console.log('pretty date', prettyStartDate)

    // var prettyEndDate = $('input[name="end-date"]').val().split('-');
    // prettyEndDate = (month[(prettyEndDate[1]) -1] + " " + prettyEndDate[2] +
    //   ', ' + prettyEndDate[0])

    app.searchParameters = {
        startDate : $('input[name="start-date"]').val(),
          endDate : $('input[name="end-date"]').val(),
  prettyStartDate : prettyStartDate,
    prettyEndDate : prettyEndDate,
          address : shortAddress,
         location : JSON.stringify(app.searchParameters.location),
           radius : $('input[name="radius"]').val(),
       animalType : $('option:selected').val(),
           colors : $('input[name="color-group"]:checked').map( function(){ return this.value } ).toArray()
    }

    this.remove();
    console.log('location', app.searchParameters.location)
    // console.log( 'searchForm on submit location:', self.location)

    // only works upon first try, does not work with edit because
    // there's only one fetch call.
    // We want to use conditional prior to ResultsView being rendered
    // if there are no search results found
    // where do we put it?
    app.collection.fetch({data : app.searchParameters,
      success: function(collection, response, options)
      {console.log('success', response); router.navigate('results', {trigger: true})},
      error: function(collection, response, options)
      {console.log('error', response); router.navigate('noResults', {trigger: true})}
    });
  }
});


/*  Search Results
--------------------*/
var ResultsView = Backbone.View.extend({

    tagName: 'div',
  className: 'results-view',
   template: Handlebars.compile( $('#template-results-list').html()),
    mapView: {},

  render: function() {
    console.log('resutls view')
    currentView = this;
    this.$el.html( this.template(app.searchParameters) )
    this.$el.prependTo('#master');

    var self = this;

    console.log(app.searchParameters);
    console.log( 'searchParameters.location: ', app.searchParameters.location);

    console.log('JSON PARSE', JSON.parse(app.searchParameters.location));

    self.mapView = new MapView({
      collection : this.collection,
      center: app.searchParameters.location,
      parent: self
    });

    self.collection.forEach(function(pet) {
      console.log('collection', self.collection)
      var tileView = new TileView({
          model: pet,
          parent: self,
          mapView: self.mapView
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

    app.searchParameters.location = JSON.parse(app.searchParameters.location);

    this.remove();
    router.navigate('search', {trigger : true, replace: true})

  },

  showMapView: function(event) {

    var self = this;
    $('.lost-pet').hide();
    $('#map').show();
    google.maps.event.trigger(self.mapView.map, 'resize'); //magically fixes window resize problem http://stackoverflow.com/questions/13059034/how-to-use-google-maps-event-triggermap-resize

    self.mapView.map.setZoom(15);
    // console.log( self.searchParameters.location );
    // console.log( typeof self.searchParameters.location)
    self.mapView.map.setCenter( JSON.parse(app.searchParameters.location) );
    self.mapView.markers.forEach( function(marker){
      marker.setMap(self.mapView.map);
    })
  //   console.log('ResultsView.showMapView()')
  //   // console.log( 'searchParams:', this.searchParameters );
  //   // console.log( 'searchParams.location:', this.searchParameters.location );

  //   var $tileView = $('.lost-pet');
  //   $tileView.remove();

    var $mapButton = $(event.target);
    $mapButton.toggle();

    var $tileButton = $('#tile-button');
    $tileButton.toggle();
  },

  showListView: function() {
    var self = this;
    $('#map').hide();
    $('.lost-pet').show();
  //   var $mapView = $('#map')
  //   $mapView.remove();

    var $tileButton = $(event.target);
    $tileButton.toggle();

    var $mapButton = $('#map-button');
    $mapButton.toggle();

  //   var self = this;

  //   this.collection.forEach(function(pet) {
  //     var tileView = new TileView({
  //         model: pet,
  //         parent: self,
  //         mapView: self.mapView
  //     });

  //     self.$el.append(tileView.$el)
  //   });

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
    console.log( 'Initialize TileView' )
    _.extend( this, options );
    this.listenTo(this.model, 'remove', this.selfDestruct)

    this.render();
  },

  events: {
    "click .btn-description" : "showDescription",
    "click .btn-info" : "showMiniMap"
  },

  selfDestruct: function() {
    // console.log('self destruct tile view')
    this.remove();
  },

  showMiniMap : function() {
    var self = this;
    //console.log( this.mapView.map );
    // if ( $('#map').css('display') === 'none' ){
      $('#map').show()
    // }
    google.maps.event.trigger(self.mapView.map, 'resize');
    this.mapView.map.setCenter(this.model.get('value').location);
    this.mapView.map.setZoom(20);
    this.mapView.markers.forEach( function(marker){

      // console.log( marker.modelId );
      // console.log( self.model.get('path').key );
      if ( marker.modelId !== self.model.get('path').key ) {
        marker.setMap(null);
      } else {
        marker.setMap(self.mapView.map);
      }
      // var markerLat = marker.position.lat();
      // var markerLng = marker.position.lng();

      // var location = self.model.get('value').location;
      // var modelLat = location.lat;
      // var modelLng = location.lng;

      // console.log(markerLat);
      // console.log(modelLat);
      // console.log(markerLat!==modelLat);

      // console.log(markerLng);
      // console.log(modelLng);
      // console.log(markerLng!==modelLng);

      // (markerLat !== modelLat) || (markerLng !== modelLng) ? marker.setMap(null) : console.log(marker.map);

    })
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
   markers: [],
  // template: Handlebars.compile( $('#template-map').html() ),

  render: function(){
    // console.log('Rendeirng MapView');
    // console.log('MapView.$el', this.$el);
    // var $closeButton = $('<button id="close-button" class="btn btn-default btn-danger">').html('x');
    // this.$el.append($closeButton);
    // this.$el.toggleClass('hidden');
    this.$el.hide();
    this.$el.appendTo('.results-view');
    console.log('MapView.render()' );
    console.log('==============\n', document.getElementById('map') )
    this.loadMap();
  },

  initialize: function( options ){
    console.log( 'Initialize MapView')
    _.extend( this, options );
    this.listenTo(this.model, 'remove', this.selfDestruct);
    this.render();

  },

  events: {
    // 'click close-button' : 'hideMap'
  },

  selfDestruct: function() {
    // console.log('self destruct map view');
    this.remove();
  },

  loadMap: function(){
    //console.log( 'loadmap MapView')
    // console.log( 'MapView.loadMap()' );
    // console.log( 'loadMap center: ', this.center );

    var center = JSON.parse( this.center );
    // console.log( 'MapView.center = ', this.center)
    //console.log( '#map before making Gmap =', document.getElementById('map') );
    // console.log( 'MapView.map=', this.map)
    // console.log( 'google works=', google.maps.Map)
    this.map = new google.maps.Map(document.getElementById('map'), {
      center: center,
      // center: {"lat":45.528932,"lng":-122.68564600000002},
      zoom: 15, //need to incorporate radius math.
      disableDefaultUI: true
    });

    //console.log( 'MapView.map', this.map );
    //console.log( this.map.center );
    // console.log( 'MapView.map DOM', document.getElementById('map') );

    this.populateMap();
  },

  populateMap: function(){
    //console.log( 'populateMap MapView')
    // console.log( 'MapView.populateMap()' );
    var self = this;
    var template = Handlebars.compile($ ('#template-infowindow').html())
    // console.log( 'map =', self.map );
    //var image = 'public/images/binoculars.png'
    //loop through the collection
    //make a marker for each model in the collection

    // each not forEach? Backbone colleciton method
    //_.each (this.collection, )
    this.collection.each( function( model ){
      // console.log( 'loop => model attributes:', model.attributes );
      // console.log( 'function?', model.get );
      //console.log( 'loop => model:', model.get('value').location )
      //console.log(model)
      var marker = new google.maps.Marker({
        position: model.get('value').location, //are these being altered??
        //icon: image,
        map: self.map,
        modelId: model.get('path').key
        // animation: google.maps.Animation.DROP
      });
      //console.log(model.get('path').key);
      //console.log(marker.modelId);

      self.markers.push(marker);

      var infowindow = new google.maps.InfoWindow({
        content: template(model.get('value'))
        // content: '<img src="' + model.get('value').imageUrl + '" style="max-width:75px">' + model.get('value').colors + ' ' + model.get('value').animalType + ' @ ' + model.get('value').dateTime + '</br>' + model.get('value').description
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
