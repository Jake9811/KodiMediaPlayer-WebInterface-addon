var connection = new WebSocket('ws://localhost:9090/jsonrpc')
console.log(connection)

// When the connection is open, send some data to the server
connection.onopen = function () {
  connection.send('{"jsonrpc": "2.0", "method": "Player.PlayPause", "params": { "playerid": 0 }, "id": 1}');
};

// Log errors
connection.onerror = function (error) {
  console.log('WebSocket Error ' + error);
};

// Log messages from the server
connection.onmessage = function (e) {
  console.log('Server: ' + e.data);
};