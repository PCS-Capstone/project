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
  render: function(){
    var $uploadForm = $('<form id="upload-form">');
    var $uploadPhoto = $('<input id="upload-photo" name="photo" type="file"> </input>');

    $uploadForm.append($uploadPhoto);
    $(this.$el).append($uploadForm);
    $('#master').append(this.$el);

  },
  initialize: function( options ){
    _.extend( options );
    this.render();
  },
  events: {
    'change #upload-photo' : 'uploadPhoto',
    'submit #upload-form' : 'submitForm'
  },
  submitForm: function(event) {
    event.preventDefault();
    // var finalData = {};
    // var formData = $('#upload-form').serializeArray();
    // formData.forEach(function(val, index, array) {
    //   for (var key in val) {
    //     finalData[val.name] = val.value ;
    //   }
    // });
    // finalData.photoUrl = $('#upload-photo').val();
    // finalData = JSON.stringify(finalData);
    // finalData.location = Number(finalData.location);
    // console.log(finalData);

    var formData = {};
    formData.photoURL = $('#upload-photo').val();
    formData.location = $('#uploadLocation').val();
    formData.date = $('#uploadDate').val();
    formData.species = $('#uploadSpecies').val();
    formData.size = $('input[name="size"]:checked').val();

     var xColors = $('input[name="color"]:checked').map(function() {
       return this.value;
     }).toArray();

    formData.colors = xColors;

    $.ajax({
      method: "POST",
      url: "/pet",
      data: { data : JSON.stringify(formData) },
      success: function(data) {
        console.log(data);
      }
    })
    .done(function( msg ) {
    });
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
    var $uploadSpecies = $('<select id="uploadSpecies" name="species">').html(
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

    var $uploadBrown = $('<input id="uploadBrown" type="checkbox" name="color" value="brown">');
    var $uploadBrownLabel = $('<label for="uploadBrown">').html('Brown');

    var $uploadBlack = $('<input id="uploadBlack" type="checkbox" name="color" value="black">');
    var $uploadBlackLabel = $('<label for="uploadBlack">').html('Black');

    $uploadColorLegend.append($uploadBrown, $uploadBrownLabel, $uploadBlack, $uploadBlackLabel);
    $uploadColor.html($uploadColorLegend);
    //Description
    var $uploadDescription = $('<textarea id="uploadDescription" name="description">');
    var $uploadDescriptionLabel = $('<label for="uploadDescription">').html('Enter description:');
    //Submit and Append Form
    var $uploadSubmit = $('<input type="submit" value="submit">');

    $('#upload-form').append($uploadLocationLabel, $uploadLocation, $uploadDateLabel, $uploadDate, $uploadSpeciesLabel, $uploadSpecies, $uploadSize, $uploadColor, $uploadDescriptionLabel, $uploadDescription, $uploadSubmit );
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
    var searchParameters = {
         date : $('input[name="date"]').val(),
      address : $('input[name="address"]').val(),
       radius : $('input[name="radius"]').val(),
   animalType : $('option:selected').val(),
       colors : $('input[name="color-group"]:checked').map( function(){ return this.value } ).toArray(),
         size : $('input[name="size-group"]:checked').val()
    }
    console.log( searchParameters );

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
  className: 'search-header',
   template: Handlebars.compile( $('#template-results-list').html() ),

  render: function() {
    var self = this;
    this.collection.forEach(function(pet) {
      var lostPetView = new LostPetView({
          model: pet
      });
    });

    this.$el.html( this.template(this.searchParameters) )
    this.$el.prependTo('#master');
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
    this.remove();
    SearchFormView.render();
  },
  mapView: function() {
    this.remove();
    MapView.render();
  }
});


var LostPetView = Backbone.View.extend({

    tagName: 'div',
  className: 'lost-pet',
   template: Handlebars.compile($ ('#template-lostpetview').html()),

  render: function() {
    console.log('lpv render', this.model)
    this.$el.html( this.template(this.model.get('value')) );
    this.$el.appendTo('#master');
  },
  initialize: function( options ) {
    _.extend( this, options );
    this.render();
  },

  events: {
    "click #edit" : "editSearch",
    "click #map"  : "mapView"
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
