var app = {};

$(document).ready( function(){
  console.log( 'running' );
  new HomePageView();
  // new MapView();
  app.collection = new lostPetsCollection();
});
