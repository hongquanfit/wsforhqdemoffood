var app = require('express')();
var websocketServer = require('websocket').server;
var http = require('http');
var port = process.env.PORT || 1337;

var clients = [];
var server = http.createServer((req, res) =>{

});
server.listen(1337, () => {
    console.log("Server is listening on port ", port);
});

var wsServer = new websocketServer({
    httpServer: server,
    path: "/suggest"
});

wsServer.on('request', (request) => {
    var conn = request.accept(null, request.origin);
    clients.push(conn);
    conn.on('message', (message) => {
        var d =  new Date().toLocaleString("vi-AS", {timeZone: "Asia/Bangkok"});
        if (message.type === "utf8") {
            // JSON.stringify
            var object = JSON.parse(message.utf8Data);
            if (object.takeNewestFood) {
                console.log(object);
                var food = object.takeNewestFood;
                if (clients.length > 0) {
                    for(let i = 0; i < clients.length; i++) {
                        clients[i].sendUTF(JSON.stringify({
                            type: "newFoodData",
                            data: food
                        }));
                    }
                }
            }
        }
    });
});
