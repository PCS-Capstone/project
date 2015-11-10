var app = {};
var router = new Router();
app.searchParameters = {};
var currentView;

var counter = 0;

$(document).ready( function(){
  Backbone.history.start({pushState: true});
  router.navigate('', {trigger: true});

  app.collection = new lostPetsCollection();

});

window.addEventListener('popstate', function(e) {
  if (counter != 0) {
    counter += 1;
    currentView.remove();
    router.navigate(Backbone.history.getFragment(), {trigger: true, replace: true});
  }
  else {
    counter += 1;
    router.navigate(Backbone.history.getFragment(), {trigger: true, replace: true});
  }
});

counter += 1;
