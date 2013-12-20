!(function(){
  function Bullet(stage, options){
    this.stage  = stage;
    this.sprite = new Sprite(this.stage, {width: 5, height: 5});
    
    this.initialize(options);
    this.stage.add(this.sprite);
  };
  Bullet.prototype.initialize = function(options){
    var stage    = this.stage;
    var velocity = Bacon.constant(options.velocity).times(200)
      , position = velocity.integrate(options.position);

    position
      .skipDuplicates(P2.equals)
      .takeWhile(function(p){ return !out_of_bounds(p); })
      .onValue(this.sprite.move.bind(this.sprite));

    position
      .filter(out_of_bounds)
      .take(1)
      .onValue(this.destroy.bind(this));
    
    function out_of_bounds(p){
      return p.x < -50 || p.y < -50 || p.x > stage.width + 50 || p.y > stage.height + 50;
    };
  };
  Bullet.prototype.destroy = function(){
    this.sprite.destroy();
  };

  window.Bullet = Bullet;
})();