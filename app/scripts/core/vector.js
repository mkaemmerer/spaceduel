!(function(){
  //Scalar
  function Scalar(s){
    if(!(this instanceof Scalar)) return new Scalar(s);

    this.s = s;
  };
  Scalar.times = function(s, v){
    return new Vector2(s.s * v.dx, s.s * v.dy);
  };
  Scalar.prototype.times = function(v){
    return Scalar.times(this, v);
  };

  //Point
  function Position2(x,y){
    if(!(this instanceof Position2)) return new Position2(x,y);

    this.x = x;
    this.y = y;
  };
  Position2.offset = function(p, v){
    return new Position2(p.x + v.dx, p.y + v.dy);
  };
  Position2.prototype.offset = function(v){
    return Position2.offset(this, v);
  };

  //Vector
  function Vector2(dx,dy){
    if(!(this instanceof Vector2)) return new Vector2(dx, dy);

    this.dx = dx;
    this.dy = dy;
  };
  Vector2.zero = new Vector2(0,0);
  Vector2.plus = function(v1,v2){
    return new Vector2(v1.dx + v2.dx, v1.dy + v2.dy);
  };
  Vector2.prototype.plus = function(v2){
    return Vector2.plus(this, v2);
  };
  Vector2.times = function(v,s){
    return Scalar.times(s,v);
  };
  Vector2.prototype.times = function(s){
    return Vector2.times(this, s);
  };


  window.S  = window.Scalar    = Scalar;
  window.P2 = window.Position2 = Position2;
  window.V2 = window.Vector2   = Vector2;
})();