/*========================================
            Successful Submission View
=========================================*/

var SuccessfulSubmission = Backbone.View.extend({
	tagName: 'section',
  className: 'success',
   template: Handlebars.compile( $('#template-successful-submission').html()),

  render: function() {
    this.$el.html( this.template() )
    this.$el.prependTo('#master');
  },

  initialize: function( options ) {
  	_.extend(this, options)
  	this.render();
  }
})
