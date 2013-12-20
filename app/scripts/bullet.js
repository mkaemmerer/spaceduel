!(function(){
  function Bullet(stage, options){
    this.stage  = stage;
    this.sprite = new Sprite(this.stage, {width: 5, height: 5});
    this.messages = new Bacon.Bus();
    
    this.initialize(options);
    this.stage.add(this.sprite);
  };
  Bullet.prototype.initialize = function(options){
    var stage    = this.stage;
    var velocity = Bacon.constant(options.forward).times(200)
      , position = velocity.integrate(options.position);

    this.status = Bacon.combineTemplate({
      position: position,
      forward:  Bacon.constant(options.forward)
    });

    var destroyed = this.status
      .map(".position")
      .filter(out_of_bounds)
      .take(1)

    destroyed
      .onValue(this.destroy.bind(this));
    
    this.status
      .map(".position")
      .skipDuplicates(P2.equals)
      .takeUntil(destroyed)
      .onValue(this.sprite.move.bind(this.sprite));
    
    function out_of_bounds(p){
      return p.x < -50 || p.y < -50 || p.x > stage.width + 50 || p.y > stage.height + 50;
    };
  };
  Bullet.prototype.destroy = function(){
    this.sprite.destroy();
  };

  window.Bullet = Bullet;
})();