!(function(){
  function Sprite(){
    this.layer = new Kinetic.Layer();
    this.draw();
  };
  Sprite.prototype.draw = function(){
    this.shape = new Kinetic.Rect({
      x: 0,
      y: 0,
      width: 50,
      height: 50,
      offset: {x: 25, y: 25},
      fill: 'crimson',
      stroke: 'black',
      strokeWidth: 4
    });
    this.layer.add(this.shape);
  };
  Sprite.prototype.move = function(p){
    this.shape.setPosition(p.x, Stage.height - p.y);
    this.layer.draw();
  };
  Sprite.prototype.destroy = function(){
    this.layer.destroy();
  };

  window.Sprite = Sprite;
})();
