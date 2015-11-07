var Router = Backbone.Router.extend({
	routes: {
		      '' : 'index',
		'search' : 'search',
	  'sighting' : 'sighting',
	   'results' : 'results',
	 'noResults' : 'noResults',
	'successful' : 'successful',
		 'error' : 'error'
	},

	index: function() {
		console.log('index');
		new HomePageView({});
	},

	search: function() {
		console.log('search');
		new SearchFormView({});
	},

	sighting: function() {
		console.log('sighting');
		new UploadSightingView({});
	},

	results: function() {
		console.log('results');
		new ResultsView({collection : app.collection});
	},

	noResults: function() {
		console.log('no results');
		new NoResultsFound({});
	}, 

	error: function() {
		console.log('error');
		new Error({});
	},

	successful: function(){
		console.log('success');
		new SuccessfulSubmission({});
	}
});


// make a global currentView property that sets the current view
// so every time a back button is pressed it removes the current view
// and renders new view from the route
