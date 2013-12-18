!(function(){
  var dt = Stage.dt;

  function Bullet(p,v){
    this.sprite   = new Sprite();
    
    this.velocity = Bacon.constant(v).map(scaleSpeed);
    this.position = this.velocity.integrate(p);

    this.initialize();
    Stage.add(this);
  };
  Bullet.prototype.initialize = function(){
    var out_of_bounds = function(p){
      return p.x < 0 || p.y < 0 || p.x > Stage.width || p.y > Stage.height;
    };

    this.position
      .skipDuplicates(P2.equals)
      .takeWhile(function(p){ return !out_of_bounds(p); })
      .onValue(this.sprite.move.bind(this.sprite));

    this.position
      .filter(out_of_bounds)
      .take(1)
      .onValue(this.destroy.bind(this));
  };
  Bullet.prototype.destroy = function(){
    this.sprite.destroy();
  };


  function scaleSpeed(v){
    var speed = 200;
    return v.times(S(speed));
  };

  window.Bullet = Bullet;
})();