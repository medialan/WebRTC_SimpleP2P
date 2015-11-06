var fs      = require("fs");
var https   = require("https");
var express = require("express");
var io      = require("socket.io");

// setup https express WebServer and WebSocket Server
var app = express();
var webServer = https.createServer(
    {
        key  : fs.readFileSync("server.key"),
        cert : fs.readFileSync("server.crt")
    }, app).listen(7000);
app.use(express.static(__dirname + "/static/"));
var SocketServer = io.listen(webServer);

var PeerASockIO = null, PeerBSockIO = null;

SocketServer.on('connection', function (socket) {
    if ((PeerASockIO != null) && (PeerBSockIO != null)) return;    
    if (PeerASockIO == null) PeerASockIO = socket; else PeerBSockIO = socket;		
    
    socket.on('disconnect', function () {
        if (socket == PeerASockIO) PeerASockIO = null;
        if (socket == PeerBSockIO) PeerBSockIO = null;
    });
    
    socket.on('msg', function (msg) {
        if ((PeerASockIO == null) || (PeerBSockIO == null)) return;
        
        var remSock = PeerBSockIO;
        if (socket == PeerBSockIO) remSock = PeerASockIO;
        remSock.emit('msg', msg);	
    });
});