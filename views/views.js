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
  //template: Handlebars.compile( $('#hbs2').html() ),
  render: function(){
    console.log( 'lost a pet button works!' );
  },
  initialize: function( options ){
    _.extend( options );
    this.render();
  },
  events: {

  }
});

var SearchResultsListView = Backbone.View.extend({
  tagName: 'section',
  className: 'list-view',
  template: Handlebars.compile( $ (#template-listview).html({this.searchValues}))
  render: function() {
    var lostPetView = new LostPetView({
      model: lostPet
    })
  },
  initialize: function( options ) {
    _.extend( options )
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
  template: Handlebars.compile($ (#template-lostpetview).html())
  render: function() {
    
  }
})

// searchValues:

// date = string
// address = string
// radius = string
// animal-type = string 
// color-group = array of strings
// size-group = string