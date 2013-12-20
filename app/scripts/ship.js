!(function(){
  function Ship(stage, collisions, options){
    this.stage      = stage;
    this.collisions = collisions;
    this.sprite     = new Sprite(this.stage, {width: 50, height: 50});
    this.messages   = new Bacon.Bus();

    this.initialize(options);
    this.bindEvents();

    this.stage.add(this.sprite);
    this.collisions.register(this);
  };
  Ship.prototype.initialize = function(options){
    var controls = options.controls
      , velocity = controls.movement.times(100)
      , position = velocity.integrate(options.position);

    this.status  = Bacon.combineTemplate({
      position: position,
      forward:  Bacon.constant(options.forward)
    });

    this.fire    = this.status
      .sampledBy(controls.fire);

    this.destroyed = this.messages
      .filter(function(msg){ return msg.type == "hit"; })
      .take(1)
      .delay(1);
  };
  Ship.prototype.bindEvents = function(){
    var self = this;

    this.status
      .map(".position")
      .skipDuplicates(P2.equals)
      .onValue(this.sprite.move.bind(this.sprite));

    this.fire
      .onValue(function(status){
        new Bullet(self.stage, {
          position: status.position,
          forward:  status.forward
        });
      });

    this.destroyed
      .onValue(this.destroy.bind(this));
  };
  Ship.prototype.destroy = function(){
    this.messages.end();
    this.sprite.destroy();
  };

  window.Ship = Ship;
})();
