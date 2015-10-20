var HomePageView = Backbone.View.extend({
  tagName: 'div',
  className: 'home',
  render: function(){
    
    var $title       = $('<h1>').html('Lost a Pet?');
    var $foundButton = $('<button id="found-button">').html( 'Found a Pet' );
    var $lostButton  = $('<button id="lost-button">').html( 'Lost a Pet' );
    
    this.$el.append( [$title, $foundButton, $lostButton] );
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

var UploadSightingView = Backbone.View.extend({
  tagName: 'section',
  className: 'upload',
  //template: Handlebars.compile( $('#hbs1').html() ),
  render: function(){
    console.log( 'found a pet button works!' );
  },
  initialize: function( options ){
    _.extend( options );
    this.render();
  },
  events: {

  }
});

var SearchFormView = Backbone.View.extend({
  tagName: 'section',
  className: 'search',

  template: Handlebars.compile( $('#template-searchform').html() ),

  render: function(){

    this.$el.html( this.template({name: "Testing"}) );

    $('#master').html(this.$el);
  },
  initialize: function( options ){
    _.extend( options );
    this.render();
  },
  events: {
    'submit form' : 'renderSearchResults'
  },

  renderSearchResults: function(event){
    event.preventDefault();
    var searchValues = {
         date : $('input[name="date"]').val(),
      address : $('input[name="address"]').val(),
       radius : $('input[name="radius"]').val(),
   animalType : $('option:selected').val(),
       colors : $('input[name="color-group"]:checked').map( function(){ return this.value } ).toArray(),
         size : $('input[name="size-group"]:checked').val()
    }

    //take the serach form values an
    //var collection = new collection({ search values })
    

    this.remove();
    var searchResultsPage = new SearchResultsListView( { searchValues: searchValues } );
  }
});

var SearchResultsListView = Backbone.View.extend({
  tagName: 'div',
  className: 'list-view',

  template: Handlebars.compile( $('#template-listview').html() ),

  render: function() {
    var self = this;

    var lostPetView = new LostPetView({
      model: lostPet
    });
    this.$el.html( this.template(this.searchValues) )
    this.$el.appendTo('#master');
  },
  initialize: function( options ) {
    
    _.extend( this, options );
    

    this.render();
  }, 
  events: {
    "click #edit" : "editSearch",
    "click #map" : "mapView"
  },
  editSearch: function() {
    this.remove();
    SearchFormView.render();
  },
  mapView: function() {
    this.remove();
    SearchResultsMapView.render();
  }

})

var SearchResultsMapView = Backbone.View.extend({
  
})

var LostPetView = Backbone.View.extend({
  tagName: 'div',
  className: 'lost-pet',
  template: Handlebars.compile($ ('#template-lostpetview').html()),
  render: function() {
    
  }
})

var MapView = Backbone.View.extend({
  tagName: 'div',
  id: 'map',
  template: Handlebars.compile( $('#template-map').html() ),
  render: function(){
    console.log('render running', this);
    // this.initMap(); // How do I call the cdn at will?
    this.$el.appendTo('#master');
  },
  initialize: function(){
    console.log('init running');
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
})

// searchValues:

// date = string
// address = string
// radius = string
// animal-type = string 
// color-group = array of strings
// size-group = string