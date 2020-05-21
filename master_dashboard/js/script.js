document.getElementById('myRange').addEventListener('input',volumeChange)
const serverURL = 'localhost'
var connection = new WebSocket('ws://'+serverURL+':9090/jsonrpc')
connection.onopen = function () {
    console.log('URL: '+connection.url+' CONNECTED: '+(connection.readyState==1?'YES':'NO'));
    connection.send(JSON.stringify(
        [
            {"jsonrpc": "2.0", "method": "Player.GetProperties", "params": { "playerid": 0, "properties": [ "speed" ] }, "id": 1},
            {"jsonrpc": "2.0", "method": "Application.GetProperties", "params": { "properties": [ "volume" ] }, "id": 2},
            {"jsonrpc": "2.0", "method": "Player.GetItem", "params": { "playerid": 0, "properties": ["title","thumbnail"] }, "id": 3}
        ]
    ))
};
connection.onerror = function (error) {
    console.log('URL: '+connection.url+' ERROR: ',error);
};
async function SEND(method,params) {
    console.log('Client('+serverURL+'): '+method,params)
    connection.send(JSON.stringify({"jsonrpc": "2.0", "method": method, "params": params}))
}
connection.onmessage = async function (e) {
    if(e.data) {
        var listen = JSON.parse(e.data)
        //console.log(listen)
        if(listen.method) {
            var task = listen.method
            var props = listen.params.data
            console.log('Server('+serverURL+'): ' + task,props);
            if (task == "Application.OnVolumeChanged") {
                document.getElementById('myRange').value = props.volume
                volumeChange()
            }
            else if (task == "Player.OnPause") {
                document.getElementById('play_pause').classList.toggle('play',true)
            }
            else if (task == "Player.OnPlay") {
                document.getElementById('play_pause').classList.toggle('play',false)
                if(props.item.title) {
                    document.getElementById('title').innerText = props.item.title
                    console.log('Now Playing('+serverURL+'): '+props.item.title)
                }
                else { 
                    document.getElementById('title').innerText = "No Title Found"
                    console.log('Now Playing('+serverURL+'): '+'No Title Found')
                }
                connection.send(JSON.stringify({"jsonrpc": "2.0", "method": "Player.GetItem", "params": { "playerid": 0, "properties": ["thumbnail"] }, "id": 1}))
            }
            else if (task == "Player.OnStop") {
                document.getElementById('title').innerText = "Now Playing"
                document.getElementById('play_pause').classList.toggle('play',true)
                document.getElementById('thumb').style.backgroundImage = 'url(\'https://lauft.work/wp-content/themes/LAUFT/img/lauft_trio_reverse.svg\')';
            }
        }
        else if (!listen.length) {
            if(listen.result.item.thumbnail) { document.getElementById('thumb').style.backgroundImage = 'url(\'http://'+serverURL+'/image/'+encodeURIComponent(listen.result.item.thumbnail)+'\')' }
        }
        else {
            if (listen[0].result.speed == 1) { document.getElementById('play_pause').classList.toggle('play',false) }
            if(String(listen[1].result.volume)) { document.getElementById('myRange').value = listen[1].result.volume;volumeChange() }
            if(listen[2].result.item.title) { document.getElementById('title').innerText = listen[2].result.item.title;console.log('Now Playing('+serverURL+'): '+listen[2].result.item.title) }
            if(listen[2].result.item.thumbnail) { document.getElementById('thumb').style.backgroundImage = 'url(\'http://'+serverURL+'/image/'+encodeURIComponent(listen[2].result.item.thumbnail)+'\')' }
        }
    }
};
async function volumeChange() {
    var slider = document.getElementById('myRange')
    slider.style.background = 'linear-gradient(to right, #41b6e6 0%, #41b6e6 ' + slider.value + '%, #d3d3d3 ' + slider.value + '%, #d3d3d3 100%)'
}
async function volume() {
    var method = "Application.SetVolume"
    var params = { "volume": Number(document.getElementById('myRange').value) }
    SEND(method,params)
}
async function playPause() {
    var method = "Player.PlayPause"
    var params = { "playerid": 0 }
    SEND(method,params)
}
async function stop() {
    var method = "Player.Stop"
    var params = { "playerid": 0 }
    SEND(method,params)
}
async function previous() {
    var method = "Player.GoTo"
    var params = { "playerid": 0, "to": "previous" }
    SEND(method,params)
}
async function next() {
    var method = "Player.GoTo"
    var params = { "playerid": 0, "to": "next" }
    SEND(method,params)
}
async function reboot() {
    var method = "System.Reboot"
    var params = {}
    SEND(method,params)
}