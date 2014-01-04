(function(){
  'use strict';

  //Imports:
  var Bacon  = require('baconjs')
    , Input  = require('./core/input')
    , KEYS   = Input.KEYS
    , V2     = require('./core/vector').V2;


  function directional_keys(up, down, left, right){
    var moveUp    = Input.keystate(up).times(V2(0,1));
    var moveDown  = Input.keystate(down).times(V2(0,-1));
    var moveLeft  = Input.keystate(left).times(V2(-1,0));
    var moveRight = Input.keystate(right).times(V2(1,0));

    return Bacon.Math.sum([moveUp, moveDown, moveLeft, moveRight], V2.zero);
  }

  function autofire(key){
    return Input.keystate(key)
      .sample(1)
      .filter(function(x){ return x === 1; })
      .debounceImmediate(300);
  }


  var Controls = {};
  Controls.NoControls = function(){
    return {
      movement: Bacon.constant(V2.zero),
      fire:     Bacon.never()
    };
  };
  Controls.Keyboard1Controls = function(){
    return {
      movement: directional_keys(KEYS['Up'], KEYS['Down'], KEYS['Left'], KEYS['Right']),
      fire:     autofire(KEYS['0'])
    };
  };
  Controls.Keyboard2Controls = function(){
    return {
      movement: directional_keys(KEYS['W'], KEYS['S'], KEYS['A'], KEYS['D']),
      fire:     autofire(KEYS['1'])
    };
  };
  Controls.ServerControls  = function(socket){
    function messageType(type){ return function(data){ return data.type === type; }; }

    return {
      movement: socket.receive
                  .filter(messageType('move'))
                  .map(function(data){
                    var direction = data.direction;
                    return V2(direction.dx, direction.dy);
                  })
                  .toProperty(V2.zero),
      fire:     socket.receive
                  .filter(messageType('fire'))
                  .map(function(){ return 1; })
    };
  };


  function Controller(){
    this.change   = new Bacon.Bus();

    this.movement = this.change
        .toProperty(Controls.NoControls())
        .flatMapLatest(function(controls){ return controls.movement; })
        .toProperty(V2.zero);

    this.fire     = this.change
        .toProperty(Controls.NoControls())
        .flatMapLatest(function(controls){ return controls.fire; });
  }
  Controller.prototype.setControls = function(controls){
    this.change.push(controls);
  };


  //Exports:
  if (typeof module !== "undefined" && module !== null) {
    module.exports = Controls;
    module.exports.Controls   = Controls;
    module.exports.Controller = Controller;
  } else {
    window.Controls   = Controls;
    window.Controller = Controller;
  }
})();
