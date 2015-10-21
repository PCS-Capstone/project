var app = {};

$(document).ready( function(){
  new HomePageView();
  // new MapView();
  app.collection = new lostPetsCollection();
});