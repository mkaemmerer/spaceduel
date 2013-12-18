!(function(){
  var dt = Stage.dt;

  function Ship(p, controls){
    this.sprite   = new Sprite();
    
    this.controls = controls;
    
    this.initialize();
    Stage.add(this);
  };
  Ship.prototype.initialize = function(){
    var start_position = P2(0,0);

    this.velocity = this.controls.movement.map(scaleSpeed);
    this.position = this.velocity.integrate(start_position);

    this.position
      .skipDuplicates(P2.equals)
      .onValue(this.sprite.move.bind(this.sprite));

    this.position
      .sampledBy(this.controls.fire)
      .onValue(this.fire.bind(this));
  };
  Ship.prototype.destroy = function(){
    this.sprite.destroy();
  };
  Ship.prototype.fire = function(p){
    new Bullet(p, V2(0, 1));
  };

  function scaleSpeed(v){
    var speed = 100;
    return v.times(S(speed));
  };

  window.Ship = Ship;
})();