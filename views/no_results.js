/*========================================
            No Results Found View
=========================================*/

var NoResultsFound = Backbone.View.extend({
	tagName: 'section',
  className: 'no-results',
   template: Handlebars.compile( $('#template-no-results').html()),

  render: function() {
    currentView = this;
    this.$el.html( this.template({}) )
    this.$el.prependTo('#master');
  },

  initialize: function( options ) {
  	_.extend(this, options)
  	this.render();
  },

  events: {
  	"click #no-results": "searchAgain"
  },

  searchAgain: function() {
  	var self = this;

  	this.remove();
  	var editSearch = new SearchFormView({
    	searchParameters : self.searchParameters
    })
  }
})