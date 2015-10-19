var lostPet = Backbone.Model.extend({
  defaults: {
           type: "Animal", //required
          color: "colorName",
           size: "Medium",
    description: "",
             id: 0, //required
       location: {       //required
           lat: 0, 
          long: 0
       },
          date: Date.now(), //required
      imageUrl: ""    //required
  }
});

var searchResults = Backbone.Collection.extend({
      model: lostPet,
        url: '/serverRoute',
 initialize: function(){
        this.fetch();
      }
});