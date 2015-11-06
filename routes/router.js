var Router = Backbone.Router.extend({
	routes: {
		'' : 'index',
		'search' : 'search',
		'sighting' : 'sighting',
		'results' : 'results',
		'noResults' : 'noResults'
	},

	index: function() {
		console.log('index');
		new HomePageView({});
	},

	search: function() {
		console.log('search');
		new SearchFormView({parentView : null});
	},

	sighting: function() {
		console.log('sighting');
		new UploadSightingView({ lat: 0, lng: 0, parentView : null});
	},

	results: function() {
		console.log('results');
		new ResultsView({collection : app.collection, parentView : null});
	},

	noResults: function() {
		console.log('no results');
		new NoResultsFound({parentView : null});
	}
});


// make a global currentView property that sets the current view
// so every time a back button is pressed it removes the current view
// and renders new view from the route
