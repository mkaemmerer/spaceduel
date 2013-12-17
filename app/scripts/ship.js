!(function(){
  var width  = 300,
      height = 300,
      dt     = 1000/60;

  function Ship(controls){
    this.controls = controls;
    this.sprite   = new Sprite();

    this.bindControls();
  }
  Ship.prototype.bindControls = function(){
    this.velocity = this.controls.map(setSpeed);
    this.position = this.velocity.scan(P2(0,0), integrate);

    this.position.onValue(this.sprite.move.bind(this.sprite));
  }

  function setSpeed(v){
    var speed = 100;
    return v.times(S(speed * dt/1000));
  }
  function integrate(p,v){
    return p.offset(v);
  };

  window.Ship = Ship;
})();