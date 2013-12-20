!(function(){
  function Ship(stage, options){
    this.stage  = stage;
    this.sprite = new Sprite(this.stage, {width: 50, height: 50});
    
    this.initialize(options);
    this.stage.add(this.sprite);
  };
  Ship.prototype.initialize = function(options){
    var controls = options.controls
      , velocity = controls.movement.times(100)
      , position = velocity.integrate(options.position);
    
    this.forward = options.forward;

    position
      .skipDuplicates(P2.equals)
      .onValue(this.sprite.move.bind(this.sprite));

    position
      .sampledBy(controls.fire)
      .onValue(this.fire.bind(this));
  };
  Ship.prototype.destroy = function(){
    this.sprite.destroy();
  };
  Ship.prototype.fire = function(p){
    new Bullet(this.stage, {
      position: p,
      velocity: this.forward
    });
  };

  window.Ship = Ship;
})();