//Start game server:
var Server = require('./game_server');
Server.start();

//Start asset server:
var http    = require("http");
var connect = require("connect");
var static_server = connect()
  .use(connect.static("./dist"));
var port          = process.env.PORT || 5000;

http.createServer(static_server).listen(port);
