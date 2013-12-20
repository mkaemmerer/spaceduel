!(function(){
  function Collisions(){
    this.objects  = [];
  };
  Collisions.prototype.register   = function(object){
    var other_objects = this.objects;

    var self = this;
    other_objects.forEach(function(other){
      var hits = collisions(object, other);

      var unsub_object = object.messages.plug(hits[0]);
      other.destroyed.delay(1).onValue(unsub_object);

      var unsub_other  = other.messages.plug(hits[1]);
      object.destroyed.delay(1).onValue(unsub_other);
    });

    object.destroyed.onValue(function(){ self.unregister(object); });
    this.objects.push(object);
  };
  Collisions.prototype.unregister = function(object){
    //???
  };

  function collisions(object1, object2){
    var position1 = object1.status
      .map(".position")
      .skipDuplicates(P2.equals);
    var position2 = object2.status
      .map(".position")
      .skipDuplicates(P2.equals);

    var hits = Bacon.combineAsArray(position1, position2)
      .filter(function(ps){
        return checkCollision(ps[0], ps[1]);
      });

    var hits1 = hits
      .map(function(){
        return { type: "hit", other: object2, one: 1 };
      });

    var hits2 = hits
      .map(function(){
        return { type: "hit", other: object1, two: 2 };
      });

    return [hits1, hits2];
  };
  function checkCollision(p1, p2){
    var between = V2.fromTo(p1,p2);
    return between.magnitude() < 50;
  };

  window.Collisions = Collisions;
})();
