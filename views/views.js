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

  renderSearchResults: function(){
    var searchValues = {
         date : $('input[name=date]').val(),
      address : $('input[name=address]').val(),
       radius : $('input[name=radius]').val(),
   animalType : $('input[name=animal-type]:selected').val(),
       colors : $('input[name=color-group]:checked').map( function(){ return this.value } ),
         size : $('input[name=size-group]:checked').val()
    }
    this.remove();
    var searchResultsPage = new SearchResultsListView( { searchValues: searchValues } );
  }
});