var app = {};
var router = new Router();
$(document).ready( function(){
  console.log( 'running' );
  new HomePageView();
  Backbone.history.start();
  app.collection = new lostPetsCollection();
});
