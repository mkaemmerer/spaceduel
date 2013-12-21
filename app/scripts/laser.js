!(function(){
  function Laser(stage, collisions, options){
    this.stage      = stage;
    this.collisions = collisions;
    this.messages   = new Bacon.Bus();

    this.team = options.team;

    this.initialize(options);
    this.bindEvents(options);
  };
  Laser.prototype.initialize = function(options){
    var stage    = this.stage;
    var velocity = Bacon.constant(options.forward).times(200)
      , position = velocity.integrate(options.position);

    var escaped = position
      .filter(out_of_bounds)
      .toEventStream();
    var hit     = this.messages
      .filter(function(msg){ return msg.type == 'hit'; });
    this.destroyed = escaped.merge(hit).take(1);

    this.status = Bacon.combineTemplate({
        position: position,
        forward:  Bacon.constant(options.forward)
      })
      .takeUntil(this.destroyed);

    function out_of_bounds(p){
      return p.x < -50 || p.y < -50 || p.x > stage.width + 50 || p.y > stage.height + 50;
    };
  };
  Laser.prototype.bindEvents = function(options){
    var layer = options.team + '_bullets';
    this.collisions.register(this, layer);
    this.destroyed.onValue(this.destroy.bind(this));
  };
  Laser.prototype.destroy = function(){
    this.messages.end();
  };


  function LaserDisplay(bullet, stage){
    this.stage  = stage;
    this.sprite = new Sprite(this.stage, {width: 5, height: 5});
    this.stage.add(this.sprite);

    this.bindEvents(bullet);
  };
  LaserDisplay.prototype.bindEvents = function(bullet){
    bullet.status
      .map('.position')
      .skipDuplicates(P2.equals)
      .onValue(this.sprite.move.bind(this.sprite));

    bullet.status
      .onEnd(this.destroy.bind(this));
  };
  LaserDisplay.prototype.destroy = function(){
    this.sprite.destroy();
  };

  window.Laser        = Laser;
  window.LaserDisplay = LaserDisplay;
})();
