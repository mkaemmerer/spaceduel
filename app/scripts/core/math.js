!(function(){
  var dt = 1000/60;

  Bacon.Property.prototype.integrate = function(start){
    return this.sample(dt)
      .map(scale)
      .scan(start, add);

    function scale(v){
      return v.times(S(dt/1000));
    };
    function add(p,v){
      return p.offset(v);
    };
  };
})();