var express = require("express");
var io      = require('socket.io');

var app = express();
app.use(express.static(__dirname + "/static/"));
var SocketServer = io.listen(app.listen(7000));

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