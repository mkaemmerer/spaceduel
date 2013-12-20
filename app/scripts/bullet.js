!(function(){
  function Bullet(stage, collisions, options){
    this.stage      = stage;
    this.collisions = collisions;
    this.messages   = new Bacon.Bus();

    this.initialize(options);
  };
  Bullet.prototype.initialize = function(options){
    var stage    = this.stage;
    var velocity = Bacon.constant(options.forward).times(200)
      , position = velocity.integrate(options.position);

    this.status = Bacon.combineTemplate({
      position: position,
      forward:  Bacon.constant(options.forward)
    });

    this.destroyed = this.status
      .map(".position")
      .filter(out_of_bounds)
      .take(1);

    function out_of_bounds(p){
      return p.x < -50 || p.y < -50 || p.x > stage.width + 50 || p.y > stage.height + 50;
    };
  };
  Bullet.prototype.destroy = function(){
    this.messages.end();
    this.sprite.destroy();
  };


  function BulletDisplay(bullet, stage){
    this.stage  = stage;
    this.sprite = new Sprite(this.stage, {width: 5, height: 5});
    this.stage.add(this.sprite);

    this.initialize(bullet);
  };
  BulletDisplay.prototype.initialize = function(bullet){
    bullet.status
      .map(".position")
      .skipDuplicates(P2.equals)
      .onValue(this.sprite.move.bind(this.sprite));

    bullet.destroyed
      .onValue(this.destroy.bind(this));
  };
  BulletDisplay.prototype.destroy = function(){
    this.sprite.destroy();
  };

  window.Bullet        = Bullet;
  window.BulletDisplay = BulletDisplay;
})();
