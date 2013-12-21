!(function(){
  var dt = 1000/60;


  Bacon.Property.prototype.integrate = function(start){
    return this.sample(dt)
      .map(scale, dt/1000)
      .scan(start, add);
  };

  Bacon.Property.prototype.times = function(factor){
    return this.map(scale, factor);
  };

  Bacon.Property.prototype.plus  = function(property){
    return this.combine(property, add);
  };

  Bacon.Math = {};
  Bacon.Math.sum = function(values, initial){
    return values.reduce(function(v, memo){
      return memo.combine(v, add);
    }, new Bacon.constant(initial));
  };

  //A polymorphic scale function
  function scale(s,x){
    if(x instanceof V2)
      return scaleVector(S(s),x);
    else
      return scaleNumber(s,x);
  };
  function scaleNumber(s,x){
    return x*s;
  };
  function scaleVector(s,v){
    return v.times(s);
  };

  //A polymorphic add function
  function add(x,y){
    if(x instanceof P2 && y instanceof V2)
      return addPointVector(x,y);
    if(x instanceof V2 && y instanceof V2)
      return addVectors(x,y);
    else
      return addNumbers(x,y);
  };
  function addNumbers(x,y){
    return x+y;
  };
  function addVectors(v1,v2){
    return v1.plus(v2);
  };
  function addPointVector(p,v){
    return p.offset(v);
  };
})();
