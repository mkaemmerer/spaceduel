!(function(){
  function Collisions(layer_info){
    this.layers = {};

    var self = this;
    for(var layer_name in layer_info){
      if(layer_info.hasOwnProperty(layer_name))
        this.layers[layer_name] = new CollisionLayer();
    }
    for(var name in this.layers){
      var layer = this.layers[name];

      layer_info[name].forEach(function(other_name){
        var other = self.layers[other_name];
        layer.collideWithLayer(other);
        other.collideWithLayer(layer);
      });
    }
  };
  Collisions.prototype.register   = function(object, layer_name){
    this.layers[layer_name].register(object);
  };


  function CollisionLayer(){
    this.objects       = [];
    this.collides_with = [];
  };
  CollisionLayer.prototype.collideWithLayer = function(layer){
    var contains = this.collides_with.reduce(function(memo, x){
      return memo || x === layer;
    }, false);

    if(!contains) this.collides_with.push(layer);
  };
  CollisionLayer.prototype.register     = function(object){
    var other_objects = this.collides_with.reduce(function(memo, layer){
      return memo.concat(layer.objects);
    }, []);

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
  CollisionLayer.prototype.unregister   = function(object){
    this.objects = this.objects.filter(function(x){
      return x !== object;
    });
  };


  function collisions(object1, object2){
    var position1 = object1.status
      .map('.position')
      .skipDuplicates(P2.equals);
    var position2 = object2.status
      .map('.position')
      .skipDuplicates(P2.equals);

    var distance = (object1.size + object2.size)/2;

    var hits = Bacon.combineAsArray(position1, position2)
      .filter(function(ps){
        return checkCollision(distance, ps[0], ps[1]);
      });

    var hits1 = hits
      .map(function(){
        return { type: 'hit', other: object2 };
      });

    var hits2 = hits
      .map(function(){
        return { type: 'hit', other: object1 };
      });

    return [hits1, hits2];
  };
  function checkCollision(distance, p1, p2){
    var between = V2.fromTo(p1,p2);
    return between.magnitude() < distance;
  };

  window.Collisions = Collisions;
})();
