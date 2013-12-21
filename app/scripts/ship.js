!(function(){
  function Ship(stage, collisions, options){
    this.stage      = stage;
    this.collisions = collisions;
    this.messages   = new Bacon.Bus();

    this.team = options.team;

    this.initialize(options);
    this.bindEvents(options);
  };
  Ship.prototype.initialize = function(options){
    var controls = options.controls
      , velocity = controls.movement.times(100)
      , position = velocity.integrate(options.position)
      , self     = this;

    this.destroyed = this.messages
      .filter(function(msg){ return msg.type == 'hit'; })
      .take(1);

    this.status    = Bacon.combineTemplate({
        position: position,
        forward:  Bacon.constant(options.forward)
      })
      .takeUntil(this.destroyed);

    this.fire      = this.status
      .sampledBy(controls.fire)
      .map(shoot)
      .takeUntil(this.destroyed);

    function shoot(status){
      return new Laser(self.stage, self.collisions, {
        position: status.position,
        forward:  status.forward,
        team:     options.team
      });
    };
  };
  Ship.prototype.bindEvents = function(options){
    var layer = options.team + '_ships';
    this.collisions.register(this, layer);
    this.destroyed.onValue(this.destroy.bind(this));
  };
  Ship.prototype.destroy = function(){
    this.messages.end();
  };


  function ShipDisplay(ship, stage){
    var color = ship.team;

    this.stage  = stage;
    this.sprite = new Sprite(this.stage, {
      width:  50,
      height: 50,
      color:  color
    });
    this.stage.add(this.sprite);

    this.bindEvents(ship);
  };
  ShipDisplay.prototype.bindEvents = function(ship){
    var self = this;

    ship.status
      .map('.position')
      .skipDuplicates(P2.equals)
      .onValue(this.sprite.move.bind(this.sprite));

    ship.fire
      .onValue(function(bullet){
        new LaserDisplay(bullet, self.stage);
      });

    ship.status
      .onEnd(this.destroy.bind(this));
  };
  ShipDisplay.prototype.destroy = function(){
    this.sprite.destroy();
  };


  function ShipAudio(ship, audio){
    this.audio = audio;
    this.bindEvents(ship);
  };
  ShipAudio.prototype.bindEvents = function(ship){
    var self = this;

    ship.status
      .onEnd(function(){
        self.audio.play('explode.mp3');
      });

    ship.fire
      .onValue(function(){
        self.audio.play('laser.mp3');
      });
  };

  window.Ship        = Ship;
  window.ShipDisplay = ShipDisplay;
  window.ShipAudio   = ShipAudio;
})();
