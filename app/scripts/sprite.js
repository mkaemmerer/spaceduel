!(function(){
  var width  = 300,
      height = 300,
      dt     = 1000/60;

  function Sprite(){
    this.layer = new Kinetic.Layer();
    this.shape = new Kinetic.Rect({
      x: 0,
      y: 0,
      width: 50,
      height: 50,
      fill: 'crimson',
      stroke: 'black',
      strokeWidth: 4
    });

    this.layer.add(this.shape);
  }
  Sprite.prototype.move = function(p){
    this.shape.setPosition(p.x, height - p.y);
    this.layer.draw();
  }

  window.Sprite = Sprite;
})();