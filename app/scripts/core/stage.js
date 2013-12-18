!(function(){
  function Stage(){
    this.width  = 300;
    this.height = 300;
    this.dt     = 1000/60;

    this.canvas  = new Kinetic.Stage({
      container: 'canvas',
      width:  this.width,
      height: this.height
    });
  };
  Stage.prototype.add = function(object){
    this.canvas.add(object.sprite.layer);
  };

  window.Stage = new Stage();
})();