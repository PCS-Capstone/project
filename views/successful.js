/*========================================
            Successful Submission View
=========================================*/

var SuccessfulSubmission = Backbone.View.extend({
	tagName: 'section',
  className: 'success',
  // template: Handlebars.compile( $('#template-successful-submission').html()),

  render: function() {
    currentView = this;
    // this.$el.html( this.template() );
    this.$el.prependTo('#master');
  },

  initialize: function( options ) {
  	_.extend(this, options)
  	this.render();
  }

  // google: function(xLat, xLng) {
  // /* --------------------------------------------------------
  //    Google() is run following successful sighting submission;
  //     It displays local animal services agencies in google map; and
  //     Gives general guidance from the humane society/animal services should the animal be in person's possession
  // ----------------------------------------------------------*/
  //   var map;
  //   var request;
  //   var place;
  //   var infoWindow;
  //   var marker;
  //
  //   //Shows entire new successful submission view,  and appends google map
  //   $('#successfulSubmission').removeClass('display-none').appendTo(this.$el);
  //   //Removes sighting form
  //   $('#upload-form').remove();
  //   //Adds Google Map of Animal Services/Shelters
  //   $('#map').appendTo('#map-submit-container').removeClass('display-none');
  //
  //   //Creates new Goole Map
  //   (function () {
  //     map = new google.maps.Map(document.getElementById('map'), {
  //       center: {lat: xLat, lng: xLng},
  //       zoom: 12
  //     });
  //     infowindow = new google.maps.InfoWindow();
  //     callback();
  //   })();
  //
  //   //Sets options of Google Places Request;
  //     //For each result, a marker is made
  //   function callback() {
  //     request = {
  //       location: new google.maps.LatLng(xLat, xLng),
  //       radius: '100',
  //       query: ['animal services', 'humane society']
  //     };
  //
  //   //Creates markers and attaches event listener to load infowindow upon marker click
  //   function createMarker(place) {
  //     marker = new google.maps.Marker({
  //       map: map,
  //       position: place.geometry.location
  //     });
  //     google.maps.event.addListener(marker, 'click', function() {
  //       infowindow.setContent(place.name);
  //       infowindow.open(map, this);
  //     });
  //   }
  //
  //   //Creates markers for each result returned by the Google Places request declared below
  //   function getResults(results, status) {
  //     console.log(results);
  //     if (status == google.maps.places.PlacesServiceStatus.OK) {
  //       for (var i = 0; i < results.length; i++) {
  //         createMarker(results[i]);
  //       }
  //     }
  //   }
  //   service = new google.maps.places.PlacesService(map);
  //   service.textSearch(request, getResults);
  //   }
  // }
});
