firstColl = new Meteor.Collection("firstDb");
secondColl = new Meteor.Collection("secondDb");

if (Meteor.isClient) {
  Meteor.autosubscribe(function () {
      Meteor.subscribe('firstDb');
      Meteor.subscribe('secondDb');
  });



  Template.hello.greeting = function () {
    return "Welcome to observebug.";
  };

  Template.hello.events({
    'click input' : function () {
      firstColl.insert({asdf:'qwer'});
    }
  });


  firstColl.find().observe({
    _suppress_initial: true,
    added: function(x,y) {
      console.log('client observe added')
    },
    removed: function() {
    }
  }); 




}

if (Meteor.isServer) {
  Meteor.publish("firstDb", function(page,resultsCount,sortDirection,sortType) {
    return firstColl.find()  
  });



  /**/
    //THIS IS BAD CODE.  SWAP COMMENTING WITH THE SECTION BELOW.
    Meteor.publish('secondDb', function(params) {
      return (function(){
        firstColl.find().observe({
          _suppress_initial: true,
          added: function(x,y) {
            console.log('server observe added')
          }
        });     
        return secondColl.find({});
      })()
    });
  

  /*
  //THIS IS GOOD CODE.  SWAP COMMENTING WITH THE CODE INDICATED ABOVE.
  firstColl.find().observe({
    _suppress_initial: true,
    added: function(x,y) {
      console.log('server observe added')
    }
  });
  Meteor.publish('secondDb', function(params) {
    return secondColl.find({});
  });
  */



  //-------

}
