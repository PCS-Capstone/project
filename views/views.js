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
    this.$el.html( this.template() );
    $('#master').html(this.$el);
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
    var searchValues = {
         date : $('input[name="date"]').val(),
      address : $('input[name="address"]').val(),
       radius : $('input[name="radius"]').val(),
   animalType : $('option:selected').val(),
       colors : $('input[name="color-group"]:checked').map( function(){ return this.value } ).toArray(),
         size : $('input[name="size-group"]:checked').val()
    }

    this.remove();

    app.collection.fetch({data : searchValues, success: function() 
      { new ListView ({
        collection : app.collection, 
        searchValues : searchValues
        });
      }});
  }
});

var ListView = Backbone.View.extend({
  tagName: 'div',
  className: 'list-view',
  template: Handlebars.compile( $('#template-listview').html() ),

  render: function() {
    console.log('ListView Render', this.collection)
    var self = this;
    this.collection.forEach(function(pet) {
      var lostPetView = new LostPetView({
          model: pet
      });
      self.$el.append(lostPetView.$el);
    });

    this.$el.html( this.template(this.searchValues) )
    this.$el.appendTo('#master');
  },
  initialize: function( options ) {
    console.log('ListView initialize', this.collection)
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
    MapView.render();
  }

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
})

// searchValues:

// date = string
// address = string
// radius = string
// animal-type = string 
// color-group = array of strings
// size-group = string