/*========================================
            Error with Upload View
=========================================*/

var Error = Backbone.View.extend({
	tagName: 'section',
  className: 'error',
   template: Handlebars.compile( $('#template-upload-error').html()),

  render: function() {
    this.$el.html( this.template() )
    this.$el.prependTo('#master');
  },

  initialize: function( options ) {
  	_.extend(this, options)
  	this.render();
  },

  events: {
  	'click #error': 'reTry'
  },

  reTry: function(){
    this.remove();
    var uploadForm = new UploadSightingView({
      lat: 0,
      lng: 0
    });
  }
	
})