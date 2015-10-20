var Datum = Backbone.Model.extend({
  defaults: {
    position: {
      lat: 40,
      lng: 50
    }
  }

});

var Collection = Backbone.Collection.extend({
  model: Datum
});

var array = [1,2,3,4,5,6,7,8,9,10];

var data = array.map( function(){
  return { 
    "position": {
      lat: 20 + (Math.random() * 50 ) * Math.random(), 
      lng: 30 + (Math.random() * 50 ) * Math.random() 
    },
    "name": ( Math.floor( 10 * Math.random() ) ) + ' little piggies'
  }
});

var locations = new Collection(data);





