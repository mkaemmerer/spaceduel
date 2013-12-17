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
    
    return sum([moveUp, moveDown, moveLeft, moveRight]);
  }
  function sum(vectors){
    return vectors.reduce(function(v, memo){
      return memo.combine(v, function(v1, v2){
        return v1.plus(v2);
      })
    }, new Bacon.constant(V2.zero));
  };


  window.Player1Controls = {
    movement: directional_keys(KEYS['Up'], KEYS['Down'], KEYS['Left'], KEYS['Right'])
  };
  window.Player2Controls = {
    movement: directional_keys(KEYS['W'], KEYS['S'], KEYS['A'], KEYS['D'])
  };
})()