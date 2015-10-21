var MapView = Backbone.View.extend({
  id: 'map',

  //a place to hold the map object so it's available between methods
  map: {},

  //this is google maps set up stuff
  loadMap: function(){
    var center = {lat: 25, lng: 35};
    //generate the map plane
    this.map = new google.maps.Map(document.getElementById('map'), {
      center: center,
      zoom: 2,
      disableDefaultUI: true
    });
    
    this.populateMap();
  },

  //abstract the pin creation out of the map generation
  populateMap: function(){
    console.log( 'making pins' );
    var self = this;
    //var image = 'public/images/binoculars.png'
    //loop through the collection
    //make a marker for each model in the collection
    this.collection.forEach( function( location ){

      var marker = new google.maps.Marker({
        position: location.get( 'position' ),
        //icon: image,
        map: self.map
        // animation: google.maps.Animation.DROP
      });

      var infowindow = new google.maps.InfoWindow({
        content: location.get('name')
      });

      marker.addListener('mouseover', function() {
        infowindow.open(marker.get('map'), marker);
      });

      marker.addListener('mouseout', function(){
        infowindow.close(marker.get('map'), marker);
      })

    })
  },

  //make sure the el lives in the dom before using it with maps
  //gotta render first, so that the map can attach to the el during loadMap
  // gotta append the button here because the google map render function empties the html of our $el
  render: function(){
    this.$el.appendTo('body');
    this.loadMap();

    var $button = $('<button id="make-pin">').html('ADD A PIN');
    this.$el.append( $button );
  },


  initialize: function(){
    this.render();
    
    this.listenTo(this.collection, 'update', this.populateMap );
  },

  //if you append the button to the body instead of $el, the backbone event listeners don't work
  events: {
    'click #make-pin' : 'newPin'
  },
  //this just copies the initial random data function into a view method, so i can call it easily from the console
  newPin: function(){
    console.log( 'collection length when you clicked:', this.collection.length)
    this.collection.add({ 
      "position": {
        lat: 20 + (Math.random() * 50 ) * Math.random(), 
        lng: 30 + (Math.random() * 50 ) * Math.random() 
      },
      "name": ( Math.floor( 10 * Math.random() ) ) + ' little piggies'
    });
  }
});

//make a map view! give it some data for pins!
var mapInstance = new MapView( {collection: locations} );