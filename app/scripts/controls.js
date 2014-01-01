!(function(){
  'use strict';

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

  window.NoControls = {
    movement: Bacon.constant(V2.zero),
    fire:     Bacon.never()
  };
  window.Keyboard1Controls = {
    movement: directional_keys(KEYS['Up'], KEYS['Down'], KEYS['Left'], KEYS['Right']),
    fire:     autofire(KEYS['0'])
  };
  window.Keyboard2Controls = {
    movement: directional_keys(KEYS['W'], KEYS['S'], KEYS['A'], KEYS['D']),
    fire:     autofire(KEYS['1'])
  };


  window.ServerControls  = function(socket){
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
})();
