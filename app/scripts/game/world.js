(function(){
  'use strict';

  //Imports:
  var Bacon  = require('baconjs');


  function World(options){
    this.width  = options.width;
    this.height = options.height;

    this.messages = new Bacon.Bus();
  }
  World.prototype.outOfBounds = function(size, p){
    return p.x < -size || p.y < -size || p.x > this.width + size || p.y > this.height + size;
  };


  //Exports:
  if (typeof module !== "undefined" && module !== null) {
    module.exports       = World;
    module.exports.World = World;
  } else {
    window.World = World;
  }
})();
