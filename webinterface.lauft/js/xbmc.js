// Play/Pause : Toggle Play or Pause State, returns speed = '0' for Pause and speed = '1' for Play
async function playPause() {
    var method = "Player.PlayPause"
    var params = { "playerid": 0 }
    await getMessage(method,params)
}

// Stop 
async function stop() {
    var method = "Player.Stop"
    var params = { "playerid": 0 }
    await sendMessage(method,params)
}

// Next Track in Playlist
async function next() {
    var method = "Player.GoTo"
    var params = { "playerid": 0, "to": "next" }
    await sendMessage(method,params)
}

// Previous Track in Playlist
async function previous() {
    var method = "Player.GoTo"
    var params = { "playerid": 0, "to": "previous" }
    await sendMessage(method,params)
}

// Loop / Repeat
async function loop() {
    var method = "Player.SetRepeat"
    var params = { "playerid": 0, "repeat": "cycle" }
    await sendMessage(method,params)
    // Request Loop state to change the button img
    method = "Player.GetProperties"
    params = { "playerid": 0, "properties": ["repeat"] }
    await getMessage(method,params)
}

// Shuffle
async function shuffle() {
    var method = "Player.SetShuffle"
    var params = { "playerid": 0, "shuffle": "toggle" }
    await sendMessage(method,params)
    // Request Shuffle state to change the button img
    method = "Player.GetProperties"
    params = { "playerid": 0, "properties": ["shuffled"] }
    await getMessage(method,params)
}

// Volume Change
function volume() {
    var volumeValue = document.getElementById('myRange').value
    var method = "Application.SetVolume"
    var params = { "volume": Number(volumeValue) }
    sendMessage(method,params)
}

// Play Specific Track from Playlist
async function openNPlay(index) {
    var method = "Player.Open"
    var params = { "item": { "playlistid": 0, "position": index } }
    await sendMessage(method,params)
}

// Clear Playlist
async function clearPlaylist() {
    var method = "Playlist.Clear"
    var params = { "playlistid": 0 }
    await sendMessage(method,params)
}
// Add to Playlist
async function addToPlaylist(path) {
    var method = "Playlist.Add"
    var params = { "playlistid": 0, "item": { "directory": path } }
    await sendMessage(method,params)
}

// Local Media Library
async function localMedia(localLib) {
    var method = "Files.GetDirectory"
    var params = { "directory": localLib }
    var result = await getMessage(method,params)
    return result
}

// Get current order of music in the playlist
async function currentPlaylist() {
    var method = "Playlist.GetItems"
    var params = { "playlistid": 0, "properties": [ "title","year","duration","thumbnail","file" ] }
    var result = await getMessage(method,params)
    return result
}

// Get current state of Player to update the player Buttons
async function currentPlayer() {
    var method = "Player.GetProperties"
    var params = { "playerid": 0, "properties": [ "speed","repeat","shuffled","percentage","time","totaltime" ] }
    var result = await getMessage(method,params)
    return result
}

// Get current state of Application to update Volume
async function currentApplication() {
    var method = "Application.GetProperties"
    var params = { "properties": [ "volume" ] }
    var result = await getMessage(method,params)
    return result
}

// Get currently PLaying Track from Media Player
async function nowPlaying() {
    var method = "Player.GetItem"
    var params = { "playerid": 0, "properties": ["title", "duration", "thumbnail", "file"] }
    var result = await getMessage(method,params)
    console.log('Now Playing: ', result.label)
    return result
}

// Batch Request of currentPlayer(), currentApplication(), nowPlaying()
async function updatePlayer() {
    var method_1 = "Player.GetProperties"; var method_2 = "Application.GetProperties"; var method_3 = "Player.GetItem";
    var params_1 = { "playerid": 0, "properties": [ "speed","repeat","shuffled","percentage","time","totaltime" ] }
    var params_2 = { "properties": [ "volume" ] }
    var params_3 = { "playerid": 0, "properties": ["title", "duration", "thumbnail", "file"] }
    var result = await updateState(method_1,params_1,method_2,params_2,method_3,params_3)
    return result
}

// Reboot the system running Kodi
async function reboot() {
    var method = "System.Reboot"
    var params = {}
    await sendMessage(method,params)
}

// Seek the running Track{
async function seek(percent) {
    var method = "Player.Seek"
    var params = { "playerid": 0, "value": Number(percent) }
    await sendMessage(method,params)
}

// Addon Functions
async function getAddons() {
    var method = "Addons.GetAddons"
    var params = {}
    await getMessage(method,params)
}

async function getAddon() {
    var method = "Addons.GetAddonDetails"
    var params = { "addonid": "plugin.googledrive", "properties": [ "name", "version", "summary", "description", "path", "author", "thumbnail", "disclaimer", "fanart", "dependencies", "broken", "extrainfo", "rating", "enabled", "installed" ] }
    await getMessage(method,params)
}

async function executeAddon() {
    var method = "Addons.ExecuteAddon"
    var params = { "addonid": "plugin.googledrive" }
    await getMessage(method,params)
}

// Network Media (Google Drive)
async function networkMedia() {
    // Get the Drive path (Configured for the first available drive)
    var method = "Files.GetDirectory"
    var params = { "directory": "plugin://plugin.googledrive/" , "media": "music" }
    var result = await getMessage(method,params)
    // Get the My Drive path
    params = { "directory": result.files[0].file }
    result = await getMessage(method,params)
    // Get the Folders (Playlists)
    params = { "directory": result.files[0].file.slice(0,-5)+"audio", "media": "music" }
    result = await getMessage(method,params)
    // Changing the content type to audio in the directory string
    return result
}

// User Profiles 
async function getProfiles() {
    var method = "Profiles.GetProfiles"
    var params = { "properties": [ "thumbnail","lockmode" ] }
    var result = await getMessage(method,params)
    console.log(result)
}

async function loadProfile(name,passwd) {
    var method = "Profiles.LoadProfile"
    var params = { "profile": name, "promt": true, "password": { "encryption": "none", "value": passwd } }
    await sendMessage(method,params)
}
// Google Play Music Setup
async function playFolders(directory) {
    var method = "Files.GetDirectory"
    var params = { "directory": directory }
    var result = await getMessage(method,params)
    return result
}