(function(){
  'use strict';

  function Stage(options){
    this.width  = options.width;
    this.height = options.height;
    this.dt     = 1000/60;

    this.canvas  = new Kinetic.Stage({
      container: 'canvas',
      width:  this.width,
      height: this.height
    });
  }
  Stage.prototype.add = function(sprite){
    this.canvas.add(sprite.layer);
  };


  //Exports:
  if (typeof module !== "undefined" && module !== null) {
    module.exports = Stage;
    module.exports.Stage = Stage;
  } else {
    window.Stage         = Stage;
  }
})();
