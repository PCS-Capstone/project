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
    formData.imageUrl = $('#upload-photo').val();
    formData.location = $('#uploadLocation').val();
    formData.date = $('#uploadDate').val();
    formData.animalType = $('#uploadSpecies').val();
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
    var $uploadSpeciesLabel = $('<label for="uploadSpecies">').html('<p> Type of Animal </p>');
    var $uploadSpecies = $('<select id="uploadSpecies" name="animalType">').html(
      '<option value=""> </option> <option value="Dog"> Dog </option>   <option value="Cat"> Cat </option>'
    );
    //Size
    var $uploadSize = $('<fieldset>');
    var $uploadSizeLegend = $('<legend> Please select size: </legend>');

    var $uploadSmall = $('<input id="uploadSmall" type="radio" name="size" value="Small">');
    var $uploadSmallLabel = $('<label for="uploadSmall">').html('Small');

    var $uploadMedium = $('<input id="uploadMedium" type="radio" name="size" value="Medium">');
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

