!(function(){
  function Sprite(stage, options){
    this.stage = stage;
    this.layer = new Kinetic.Layer();

    this.draw(options);
    this.stage.add(this);
  };
  Sprite.prototype.draw = function(options){
    this.shape = new Kinetic.Rect({
      x: 0,
      y: 0,
      width:  options.width,
      height: options.height,
      offset: {x: options.width/2, y: options.height/2},
      fill:   options.color || 'black',
      stroke: 'black',
      strokeWidth: 4
    });
    this.layer.add(this.shape);
  };
  Sprite.prototype.move = function(p){
    this.shape.setPosition(p.x, this.stage.height - p.y);
    this.layer.draw();
  };
  Sprite.prototype.destroy = function(){
    this.layer.destroy();
  };

  window.Sprite = Sprite;
})();
