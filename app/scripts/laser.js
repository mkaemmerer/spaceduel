!(function(){
  'use strict';

  function Laser(world, collisions, options){
    this.world      = world;
    this.collisions = collisions;
    this.messages   = new Bacon.Bus();

    this.team = options.team;
    this.size = 0;

    this.initialize(options);
    this.bindEvents(options);
  }
  Laser.prototype.initialize = function(options){
    var world    = this.world;
    var velocity = Bacon.constant(options.forward).times(200)
      , position = velocity.integrate(options.position);

    this.created = Bacon.once(null);

    var escaped = position
      .filter(world.outOfBounds.bind(world), 50)
      .toEventStream();
    var hit     = this.messages
      .filter(function(msg){ return msg.type === 'hit'; });
    this.destroyed = escaped.merge(hit).take(1);

    this.status = Bacon.combineTemplate({
        position: position,
        forward:  Bacon.constant(options.forward)
      })
      .takeUntil(this.destroyed);
  };
  Laser.prototype.bindEvents = function(options){
    var layer = options.team + '_lasers';
    this.collisions.register(this, layer);
    this.destroyed.onValue(this.destroy.bind(this));
  };
  Laser.prototype.destroy = function(){
    this.messages.end();
  };


  function LaserDisplay(laser, stage){
    this.stage  = stage;
    this.sprite = new Sprite(this.stage, {width: 5, height: 5});
    this.stage.add(this.sprite);

    this.bindEvents(laser);
  }
  LaserDisplay.prototype.bindEvents = function(laser){
    laser.status
      .map('.position')
      .skipDuplicates(P2.equals)
      .onValue(this.sprite.move.bind(this.sprite));

    laser.destroyed.onValue(this.destroy.bind(this));
  };
  LaserDisplay.prototype.destroy = function(){
    this.sprite.destroy();
  };


  function LaserAudio(laser, audio){
    this.audio = audio;
    this.bindEvents(laser);
  }
  LaserAudio.prototype.bindEvents = function(laser){
    var self = this;

    laser.created.onValue(function(){
      self.audio.play('laser.mp3');
    });
  };

  window.Laser        = Laser;
  window.LaserDisplay = LaserDisplay;
  window.LaserAudio   = LaserAudio;
})();
