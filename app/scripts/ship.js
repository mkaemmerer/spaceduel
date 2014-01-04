(function(){
  'use strict';

  //Imports:
  var Bacon  = require('baconjs')
    , P2     = require('./core/vector').P2
    , __     = require('./core/math')
    , Sprite = require('./graphics/sprite').Sprite
    , Laser        = require('./laser')
    , LaserAudio   = Laser.LaserAudio
    , LaserDisplay = Laser.LaserDisplay
    , Explosion        = require('./explosion')
    , ExplosionDisplay = Explosion.ExplosionDisplay
    , ExplosionAudio   = Explosion.ExplosionAudio;


  function Ship(world, collisions, options){
    this.world      = world;
    this.collisions = collisions;
    this.messages   = new Bacon.Bus();

    this.team  = options.team;
    this.size  = 50;
    this.speed = 100;

    this.initialize(options);
    this.bindEvents(options);
  }
  Ship.prototype.initialize = function(options){
    var velocity = options.controls.movement.times(this.speed)
      , position = velocity.integrate(options.position)
      , self     = this;

    this.created = Bacon.once(null);

    this.destroyed = this.messages
      .filter(function(msg){ return msg.type === 'hit'; })
      .take(1);

    this.status    = Bacon.combineTemplate({
        position: position,
        forward:  Bacon.constant(options.forward)
      })
      .takeUntil(this.destroyed);

    this.explode   = this.status
      .sampledBy(this.destroyed)
      .map(explode);

    this.fire = options.controls.fire
      .map(this.status)
      .map(shoot)
      .takeUntil(this.destroyed);
    //Add a fake listener to prevent this from getting silenced... not sure why this is needed
    this.fire.onValue(function(){});

    function shoot(status){
      return new Laser(self.world, self.collisions, {
        position: status.position,
        forward:  status.forward,
        team:     options.team
      });
    }
    function explode(status){
      return new Explosion(self.world, self.collisions, {
        position: status.position
      });
    }
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
      width:  ship.size,
      height: ship.size,
      color:  color
    });
    this.stage.add(this.sprite);

    this.bindEvents(ship);
  }
  ShipDisplay.prototype.bindEvents = function(ship){
    var self = this;

    ship.status
      .map('.position')
      .skipDuplicates(P2.equals)
      .onValue(this.sprite.move.bind(this.sprite));

    ship.fire.onValue(function(laser){
      new LaserDisplay(laser, self.stage);
    });

    ship.explode.onValue(function(explosion){
      new ExplosionDisplay(explosion, self.stage);
    });

    ship.destroyed.onValue(this.destroy.bind(this));
  };
  ShipDisplay.prototype.destroy = function(){
    this.sprite.destroy();
  };


  function ShipAudio(ship, audio){
    this.audio = audio;
    this.bindEvents(ship);
  }
  ShipAudio.prototype.bindEvents = function(ship){
    var self = this;

    ship.explode.onValue(function(explosion){
      new ExplosionAudio(explosion, self.audio);
    });

    ship.fire.onValue(function(laser){
      new LaserAudio(laser, self.audio);
    });
  };


  //Exports:
  if (typeof module !== "undefined" && module !== null) {
    module.exports = Ship;
    module.exports.Ship        = Ship;
    module.exports.ShipDisplay = ShipDisplay;
    module.exports.ShipAudio   = ShipAudio;
  } else {
    window.Ship        = Ship;
    window.ShipDisplay = ShipDisplay;
    window.ShipAudio   = ShipAudio;
  }
})();
