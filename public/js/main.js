var app = {};
var router = new Router();
app.searchParameters = {};
var currentView;

var counter = 0;

$(document).ready( function() {
  Backbone.history.start({pushState: true});
  router.navigate('', {trigger: true});

  app.collection = new lostPetsCollection();

});

window.addEventListener('popstate', function(e) {
	console.log(e)
	console.log("location " + document.location + ", state: " + JSON.stringify(e.state));

	if( counter === 0 ){
		console.log('counter', counter);
		// currentView.remove();
		counter += 1;
    	router.navigate(Backbone.history.getFragment(), {trigger: true, replace: true});

	} else {
		console.log('counter', counter)
		currentView.remove();
		counter += 1;
		router.navigate(Backbone.history.getFragment(), {trigger: true, replace: true});
	}
});
