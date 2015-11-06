var app = {};
var router = new Router();
app.searchParameters = {};
var currentView;

$(document).ready( function(){
  Backbone.history.start({pushState: true});
  router.navigate('', {trigger: true});

  app.collection = new lostPetsCollection();

});

window.addEventListener('popstate', function(e) {
	currentView.remove();
    router.navigate(Backbone.history.getFragment(), {trigger: true, replace: true});
});