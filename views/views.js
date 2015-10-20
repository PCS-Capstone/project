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
  tagName: 'div',
  className: 'upload',
  render: function(){

    var $uploadForm = $('<form id="upload-form">');
    var $uploadPhoto = $('<input id="upload-photo" type="file"> </input>');

    $uploadForm.append($uploadPhoto);
    $(this.$el).append($uploadForm);
    $('#master').append(this.$el);

  },
  initialize: function( options ){
    _.extend( options );
    this.render();
  },
  events: {
    'change #upload-photo' : 'uploadPhoto'
  },
  uploadPhoto: function() {
  //Sighting Form
    //Location
    var $uploadLocationLabel = $('<label for="uploadLocation">').html("<p> Location: </p>");
    var $uploadLocation = $('<input id="uploadLocation" type="text" name="location">');
    //Date
    var $uploadDateLabel = $('<label for="uploadDate">').html('<p> Date: </p>');
    var $uploadDate = $('<input id="uploadDate" type="text" name="date">');
    //Species
    var $uploadSpeciesLabel = $('<label for="uploadSpecies">').html('<p> Species </p>');
    var $uploadSpecies = $('<select id="uploadSpecies name="species">').html(
      '<option value=""> </option> <option value="dog"> Dog </option>   <option value="cat"> Cat </option>'
    );
    //Size
    var $uploadSize = $('<fieldset>');
    var $uploadSizeLegend = $('<legend> Please select size: </legend>');

    var $uploadSmall = $('<input id="uploadSmall" type="radio" name="size" value="small">');
    var $uploadSmallLabel = $('<label for="uploadSmall">').html('Small');

    var $uploadMedium = $('<input id="uploadMedium" type="radio" name="size" value="medium">');
    var $uploadMediumLabel = $('<label for="uploadMedium">').html('Medium');

    var $uploadLarge = $('<input id="uploadMedium" type="radio" name="size" value="Large">');
    var $uploadLargeLabel = $('<label for="uploadLarge">').html('Large');

    $uploadSizeLegend.append($uploadSmall, $uploadSmallLabel, $uploadMedium, $uploadMediumLabel, $uploadLarge, $uploadLargeLabel);
    $uploadSize.html($uploadSizeLegend);
    //Color
    var $uploadColor = $('<fieldset>');
    var $uploadColorLegend = $('<legend> Please select color: </legend>');

    var $uploadBrown = $('<input id="uploadBrown" type="checkbox" name="color">');
    var $uploadBrownLabel = $('<label for="uploadBrown">').html('Brown');

    $uploadColorLegend.append($uploadBrown, $uploadBrownLabel);
    $uploadColor.html($uploadColorLegend);
    //Description
    var $uploadDescription = $('<textarea id="uploadDescription" name="description">');
    var $uploadDescriptionLabel = $('<label for="uploadDescription">').html('Enter description:');
    //Submit and Append Form
    var $uploadSubmit = $('<input type="submit" value="submit">');

    $('#upload-form').append($uploadLocationLabel, $uploadLocation, $uploadDateLabel, $uploadDate, $uploadSpeciesLabel, $uploadSpecies, $uploadSize, $uploadColor, $uploadDescriptionLabel, $uploadDescription, $uploadSubmit );
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
    // var coll = app.collection.fetch({data: {filter : searchValues}});
    var searchResultsPage = new ListView({
      collection : new lostPetsCollection({data:searchValues}),
      searchValues : searchValues
    });

  }
});

var ListView = Backbone.View.extend({
  tagName: 'div',
  className: 'list-view',
  template: Handlebars.compile( $('#template-listview').html() ),

  render: function() {
    // console.log(this.collection)
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
