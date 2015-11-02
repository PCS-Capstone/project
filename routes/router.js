// var Router = Backbone.Router.extend({
// 	routes: {
// 		'' : 'index',
// 		'show/:id' : 'show',
// 		'download/*random' : 'download',
// 		'search/:query': 'search',
// 		'*default': 'default'
// 	},

// 	index: function(){
// 		$(document.body).append("Index route has been called..");
// 	},
 
// 	show: function(id) {
// 		$(document.body).append("Show route has been called..with id equals : ", id);
// 	}, 

// 	download: function(random) {
// 		$(document.body).append("download route has been called.. with random equals : ", random);
// 	},

// 	search: function(query){
// 		$(document.body).append("Search route has been called.. with query equals : ",   query);
// 	},

// 	default: function(def){
// 		$(document.body).append("This route is not hanled.. you tried to access: ", def);

// 	}
// });

// new Router();
// Backbone.history.start();

var Router = Backbone.Router.extend({
	routes: {
		'' : 'index',
		'search' : 'search',
		'sighting' : 'sighting'
	},

	index: function() {
		console.log('index')
	},

	search: function() {
		console.log('search')
	},

	sighting: function() {
		console.log('sighting')
	}
});

