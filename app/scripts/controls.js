!(function(){
  function directional_keys(up, down, left, right){
    var moveUp    = Input.keystate(up).map(function(s){
      return S(s).times(V2(0,1));
    });
    var moveDown  = Input.keystate(down).map(function(s){
      return S(s).times(V2(0,-1));
    });
    var moveLeft  = Input.keystate(left).map(function(s){
      return S(s).times(V2(-1,0));
    });
    var moveRight = Input.keystate(right).map(function(s){
      return S(s).times(V2(1,0));
    });

    return Bacon.Math.sum([moveUp, moveDown, moveLeft, moveRight], V2.zero);
  };

  function autofire(key){
    return Input.keystate(key)
      .sample(1)
      .filter(function(x){ return x == 1; })
      .debounceImmediate(300);
  };

  window.Player1Controls = {
    movement: directional_keys(KEYS['Up'], KEYS['Down'], KEYS['Left'], KEYS['Right']),
    fire:     autofire(KEYS['0'])
  };
  window.Player2Controls = {
    movement: directional_keys(KEYS['W'], KEYS['S'], KEYS['A'], KEYS['D']),
    fire:     autofire(KEYS['1'])
  };


  var socket = ServerConnection();
  window.ServerControls  = {
    movement: Bacon.constant(V2.zero),
    fire:     socket.receive
                .filter(function(message){
                  return message.type == "message";
                })
                .filter(function(message){
                  return message.data == "fire";
                })
                .map(function(){
                  return 1;
                })
  };
})();
