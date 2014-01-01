!(function(){
  'use strict';

  function World(options){
    this.width  = options.width;
    this.height = options.height;

    this.messages = new Bacon.Bus();
  }
  World.prototype.outOfBounds = function(size, p){
    return p.x < -size || p.y < -size || p.x > this.width + size || p.y > this.height + size;
  };

  window.World = World;
})();
