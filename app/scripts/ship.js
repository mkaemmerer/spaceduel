!(function(){
  function Ship(stage, collisions, options){
    this.stage      = stage;
    this.collisions = collisions;
    this.messages   = new Bacon.Bus();

    this.initialize(options);
    this.bindEvents();

    this.collisions.register(this);
  };
  Ship.prototype.initialize = function(options){
    var controls = options.controls
      , velocity = controls.movement.times(100)
      , position = velocity.integrate(options.position)
      , self     = this;

    this.destroyed = this.messages
      .filter(function(msg){ return msg.type == "hit"; })
      .take(1);

    this.status    = Bacon.combineTemplate({
        position: position,
        forward:  Bacon.constant(options.forward)
      })
      .takeUntil(this.destroyed);

    this.fire      = this.status
      .sampledBy(controls.fire)
      .map(function(status){
        return new Bullet(self.stage, self.collisions, {
          position: status.position,
          forward:  status.forward
        });
      })
      .takeUntil(this.destroyed);
  };
  Ship.prototype.bindEvents = function(){
    this.destroyed
      .onValue(this.destroy.bind(this));
  };
  Ship.prototype.destroy = function(){
    this.messages.end();
  };


  function ShipDisplay(ship, stage){
    this.stage  = stage;
    this.sprite = new Sprite(this.stage, {width: 50, height: 50});
    this.stage.add(this.sprite);

    this.initialize(ship);
  };
  ShipDisplay.prototype.initialize = function(ship){
    var self = this;

    ship.status
      .map(".position")
      .skipDuplicates(P2.equals)
      .onValue(this.sprite.move.bind(this.sprite));

    ship.fire
      .onValue(function(bullet){
        new BulletDisplay(bullet, self.stage);
      });

    ship.destroyed
      .onValue(this.destroy.bind(this));
  };
  ShipDisplay.prototype.destroy = function(){
    this.sprite.destroy();
  };

  window.Ship        = Ship;
  window.ShipDisplay = ShipDisplay;
})();
