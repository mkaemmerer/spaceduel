(function(){
  'use strict';

  function Explosion(world, collisions, options){
    this.world      = world;
    this.collisions = collisions;
    this.messages   = new Bacon.Bus();

    this.size = 0;

    this.initialize(options);
    this.bindEvents(options);
  }
  Explosion.prototype.initialize = function(options){
    var position = Bacon.constant(options.position);

    this.created   = Bacon.once(null);
    this.destroyed = Bacon.later(500, null);

    this.status = Bacon.combineTemplate({
        position: position,
      })
      .takeUntil(this.destroyed);
  };
  Explosion.prototype.bindEvents = function(options){
    this.destroyed.onValue(this.destroy.bind(this));
  };
  Explosion.prototype.destroy = function(){
    this.messages.end();
  };


  function ExplosionDisplay(explosion, stage){
    this.stage  = stage;
    this.sprite = new Sprite(this.stage, {width: 60, height: 60, color: 'yellow'});
    this.stage.add(this.sprite);

    this.bindEvents(explosion);
  }
  ExplosionDisplay.prototype.bindEvents = function(explosion){
    explosion.status
      .map('.position')
      .skipDuplicates(P2.equals)
      .onValue(this.sprite.move.bind(this.sprite));

    explosion.destroyed.onValue(this.destroy.bind(this));
  };
  ExplosionDisplay.prototype.destroy = function(){
    this.sprite.destroy();
  };


  function ExplosionAudio(explosion, audio){
    this.audio = audio;
    this.bindEvents(explosion);
  }
  ExplosionAudio.prototype.bindEvents = function(explosion){
    var self = this;
    explosion.created.onValue(function(){
      self.audio.play('explode.mp3');
    });
  };

  window.Explosion        = Explosion;
  window.ExplosionDisplay = ExplosionDisplay;
  window.ExplosionAudio   = ExplosionAudio;
})();
