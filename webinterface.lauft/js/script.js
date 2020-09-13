//Global / Event Listners etc.
window.onload = setup
window.onresize = resetNav
document.getElementById('myRange').addEventListener('input',volumeChange)

// Global Constants
var localLib = "/home/osmc/Music"

// Window On Load Setup
async function setup() {
    // Connect to JSON RPC
    await initConnect()
    // Update the media player every second
        setInterval(function() {
        currentPlayerBar()
    },1000)
}

// Main Content Window Update (MUSIC LIST & SETTINGS)
async function mainUpdate(option) {
    var mainContainer = document.getElementsByClassName('main-content-window')[0]
    switch (option) {
        // Local Media
        case 0: {
            // Setting the id for different content windows by numbers to be easily accessed later
            mainContainer.setAttribute('id','0')
            // Title of the window
            var head = document.createElement('h1')
            var textnode = document.createTextNode('Local Media')
            head.appendChild(textnode)
            // Get the Folders (Playlists) from Local Media
            const localFolders = await localMedia(localLib)
            // List of Folders  
            var listFolders = document.createElement('ul')
            listFolders.setAttribute('id','music-list')
            // Display Folders in the main content window
            for (let index = 0; index < localFolders.files.length; index++) {
                // Folder Title
                var listItem = document.createElement('li')
                var textnode = document.createTextNode(localFolders.files[index].label)
                listItem.appendChild(textnode)
                listItem.addEventListener('click',function() { 
                    openNBrowse(localFolders.files[index].file,localFolders.files[index].label)
                })
                listFolders.appendChild(listItem)
            }
            // Clear the previous data inside main-content-window
            mainContainer.textContent = ""
            // Add the new data inside main-content-window
            mainContainer.appendChild(head)
            mainContainer.appendChild(listFolders)
            
            // Function to add Playlists
            async function openNBrowse (playlistPath,playlistName) {
                // Clear the previous data inside main-content-window
                mainContainer.textContent = ""
                // Title of the window
                var head = document.createElement('h1')
                var textnode = document.createTextNode(playlistName)
                head.appendChild(textnode)
                // Clear Playlist
                await clearPlaylist()
                // Add all the Tracks to the playlist
                await addToPlaylist(playlistPath)
                // Get the playlist
                var playlist = await currentPlaylist()
                // List of Music  
                var listMusic = document.createElement('dl')
                listMusic.setAttribute('id','song-list')
                // Display Tracks in the current order of Playlist
                for (let index = 0; index < playlist.items.length; index++) {
                    // Span tag for playing the specific song on click
                    var clickToPlay = document.createElement('span')
                    clickToPlay.setAttribute("onclick","openNPlay("+index+")")
                    // Music Title 
                    var listItem = document.createElement('dt')
                    listItem.setAttribute('class','music')
                    listItem.setAttribute('id',playlist.items[index].label)
                    var textnode = document.createTextNode(playlist.items[index].label)
                    listItem.appendChild(textnode)
                    // Music Extra Details (Duration etc.)
                    var itemDesc = document.createElement('dd')
                    var textnode = document.createTextNode('NaN')
                    itemDesc.appendChild(textnode)
                    clickToPlay.appendChild(listItem)
                    clickToPlay.appendChild(itemDesc)
                    listMusic.appendChild(clickToPlay)
                }
                // Add the new data inside main-content-window
                mainContainer.appendChild(head)
                mainContainer.appendChild(listMusic)
            }
            break;
        }
        // Network Media
        case 1: {
            mainContainer.setAttribute('id','1')
            // Title of the window
            var head = document.createElement('h1')
            var textnode = document.createTextNode('Network Media')
            head.appendChild(textnode)

            // Get the Folders (Playlists) from Network Media ( Google Drive )
            const networkFolders = await networkMedia()
            // List of Folders
            var listFolders = document.createElement('ul')
            listFolders.setAttribute('id','music-list')
            // Display Folders in the main content window
            for (let index = 0; index < networkFolders.files.length; index++) {
                // Folder Title
                var listItem = document.createElement('li')
                var textnode = document.createTextNode(networkFolders.files[index].label)
                listItem.appendChild(textnode)
                listItem.addEventListener('click',function() { 
                    openNBrowse(networkFolders.files[index].file,networkFolders.files[index].label)
                })
                listFolders.appendChild(listItem)
            }
            // Clear the previous data inside main-content-window
            mainContainer.textContent = ""
            // Add the new data inside main-content-window
            mainContainer.appendChild(head)
            mainContainer.appendChild(listFolders)

            // Function to add Playlists
            async function openNBrowse (playlistPath,playlistName) {
                // Clear the previous data inside main-content-window
                mainContainer.textContent = ""
                // Title of the window
                var head = document.createElement('h1')
                var textnode = document.createTextNode(playlistName)
                head.appendChild(textnode)
                // Clear Playlist
                await clearPlaylist()
                // Add all the Tracks to the playlist
                await addToPlaylist(playlistPath)
                // Get the playlist
                var playlist = await currentPlaylist()
                // List of Music
                var listMusic = document.createElement('dl')
                listMusic.setAttribute('id','song-list')
                // Display Tracks in the current order of Playlist
                for (let index = 0; index < playlist.items.length; index++) {
                    // Span tag for playing the specific song on click
                    var clickToPlay = document.createElement('span')
                    clickToPlay.setAttribute("onclick","openNPlay("+index+")")
                    // Music Title 
                    var listItem = document.createElement('dt')
                    listItem.setAttribute('class','music')
                    // Extract Track id and set as tag id
                    var file = playlist.items[index].file
                    var trackId = file.slice( file.search('item_id=')+8, file.search('&driveid=') ) 
                    listItem.setAttribute('id',trackId)
                    var textnode = document.createTextNode(playlist.items[index].label)
                    listItem.appendChild(textnode)
                    // Music Extra Details (Duration etc.)
                    var itemDesc = document.createElement('dd')
                    var textnode = document.createTextNode('NaN')
                    itemDesc.appendChild(textnode)
                    clickToPlay.appendChild(listItem)
                    clickToPlay.appendChild(itemDesc)
                    listMusic.appendChild(clickToPlay)
                }
                // Add the new data inside main-content-window
                mainContainer.appendChild(head)
                mainContainer.appendChild(listMusic)
            }
            break;
        }
        case 2: {
            mainContainer.setAttribute('id','2')
            // Title of the window
            var head = document.createElement('h1')
            var textnode = document.createTextNode('Play Music')
            head.appendChild(textnode)
            // Clear the previous data inside main-content-window
            mainContainer.textContent = ""
            mainContainer.appendChild(head)

            // Get the Main Folders: Listen Now & Browse Stations
            const mainFolders = await playFolders("plugin://plugin.audio.googlemusic.exp/")
            displayFolders(mainFolders)

            // Function to fetch new folders and send to displayFolders
            async function nextWindow(directory,title) {
                var head = document.createElement('h1')
                var textnode = document.createTextNode(title)
                head.appendChild(textnode)
                // Clear the previous data inside main-content-window
                mainContainer.textContent = ""
                mainContainer.appendChild(head)
                var newfolders = await playFolders(directory)
                displayFolders(newfolders,title,directory)
            }
            
            // Function  to Display Folders
            async function displayFolders(folders,title,directory) {
                // List of Folders
                var listFolders = document.createElement('ul')
                listFolders.setAttribute('id','music-list')
                // Display Folders in the main content window
                for (let index = 0; index < folders.files.length; index++) {
                    // Check if this folder contains music
                    if ( folders.files[index].file.search('action=play_song') != -1 ) {
                        openNBrowse( directory, title )
                        break;
                    }
                    // Folder Title
                    var listItem = document.createElement('li')
                    var textnode = document.createTextNode(folders.files[index].label)
                    listItem.appendChild(textnode)
                    listItem.addEventListener('click',function() {
                        nextWindow(folders.files[index].file,folders.files[index].label)
                    })
                    listFolders.appendChild(listItem)
                }
                // Add the new folders inside main-content-window
                mainContainer.appendChild(listFolders)
            }
            // Function to add Playlists
            async function openNBrowse (playlistPath,playlistName) {
                // Clear the previous data inside main-content-window
                mainContainer.textContent = ""
                // Title of the window
                var head = document.createElement('h1')
                var textnode = document.createTextNode(playlistName)
                head.appendChild(textnode)
                // Clear Playlist
                await clearPlaylist()
                // Add all the Tracks to the playlist
                await addToPlaylist(playlistPath)
                // Get the playlist
                var playlist = await currentPlaylist()
                // List of Music
                var listMusic = document.createElement('dl')
                listMusic.setAttribute('id','song-list')
                // Display Tracks in the current order of Playlist
                for (let index = 0; index < playlist.items.length; index++) {
                    // Span tag for playing the specific song on click
                    var clickToPlay = document.createElement('span')
                    clickToPlay.setAttribute("onclick","openNPlay("+index+")")
                    // Music Title 
                    var listItem = document.createElement('dt')
                    listItem.setAttribute('class','music')
                    // Extract Track id and set as tag id
                    var file = playlist.items[index].file
                    var trackId = file.slice( file.search('item_id=')+8, file.search('&driveid=') ) 
                    listItem.setAttribute('id',trackId)
                    var textnode = document.createTextNode(playlist.items[index].label)
                    listItem.appendChild(textnode)
                    // Music Extra Details (Duration etc.)
                    var itemDesc = document.createElement('dd')
                    var textnode = document.createTextNode('NaN')
                    itemDesc.appendChild(textnode)
                    clickToPlay.appendChild(listItem)
                    clickToPlay.appendChild(itemDesc)
                    listMusic.appendChild(clickToPlay)
                }
                // Add the new data inside main-content-window
                mainContainer.appendChild(head)
                mainContainer.appendChild(listMusic)
            }
            break;
        }
        case 3: {
            mainContainer.setAttribute('id','4')
            var head = document.createElement('h1')
            var textnode = document.createTextNode('Settings')
            head.appendChild(textnode)
            var list = document.createElement('ul')
            list.setAttribute('id','settings-list')
            var listItem = document.createElement('li')
            var textnode = document.createTextNode('Reboot')
            listItem.appendChild(textnode)
            // Attching on click event to reboot button
            listItem.setAttribute('onclick','reboot()')
            list.appendChild(listItem)
            mainContainer.textContent = ""
            mainContainer.appendChild(head)
            mainContainer.appendChild(list)
            break;
        }
        default:
            break;
    }
}

// Now Playing Bar Updates + Active Music Color Change in Music List
// state: track details from currentPlayerBar
// t = current time of seeek Bar
// tt = total time of the seek Bar
async function nowPlayingBar(track, t, tt) {
    // Get the Title Display Area Of Now Playing Bar
    var title = document.getElementById('title')
    // Get the container for seek bar
    var container = document.getElementById('seek')
    // Setup Time variables and percentage
    var currentSeconds = (t.hours*3600)+(t.minutes*60)+(t.seconds)
    var totalSeconds = (tt.hours*3600)+(tt.minutes*60)+(tt.seconds)
    // Set the thumbnail if there is one available otherwise change to default image or if no Track is Playing
    var path = encodeURIComponent(track.item.thumbnail)
    if (path) {
        document.getElementById('thumb').style.backgroundImage = 'url(\'image/'+path+'\')'
    } else {
        document.getElementById('thumb').style.backgroundImage = 'url(\'../resources/icon.png\')'
    }
    // Get Track's Label (File name/ Title)
    var label = track.item.label
    // As a backup if playlist is not available
    title.innerHTML = label
    // If a Track is playing, display the title and change the color of this track in music list
    if (label) {
        // Getting all the Music <dt> tags in the PLaylist
        var list = document.getElementsByClassName('music')
        for (let index = 0; index < list.length; index++) {
            // If the current the Track is found in the List by mathcing labels
            if ( label == list[index].innerHTML ) {
                // Remove the active class / Black selection from previous music in the playlist if any
                if (document.getElementsByClassName('active').length != 0 ) {
                    // Toggle all to off
                    Array.from(document.getElementsByClassName('active')).forEach(element => {
                        element.classList.toggle('active', false)
                    });
                }
                // Toggle the current Track in Playlist to active class and store the text in label
                list[index].classList.toggle('active', true)
                title.innerHTML = list[index].innerHTML
            }
        }
        // Checks if the seek bar alrealy exists or not (only create it if not exists)
        if (!document.getElementById('currentTime')) {
            container.innerHTML = ''
            var currentTime = document.createElement('span')
            currentTime.setAttribute('id','currentTime')
            var textnode = document.createTextNode('00:00')
            currentTime.appendChild(textnode)
            var seekBarContainer = document.createElement('div')
            var seekBar = document.createElement('input')
            seekBar.setAttribute('id','progress')
            seekBar.setAttribute('type','range')
            seekBar.setAttribute('min','0')
            seekBar.setAttribute('max','100')
            seekBar.setAttribute('value','0')
            seekBar.setAttribute('title','0')
            seekBar.setAttribute('oninput','seek(value)')
            seekBar.addEventListener('input',seekChange)
            var totalTime = document.createElement('span')
            totalTime.setAttribute('id','totalTime')
            totalTime.style.float = 'right'
            var textnode = document.createTextNode('00:00')
            totalTime.appendChild(textnode)
            container.appendChild(currentTime)
            seekBarContainer.appendChild(seekBar)
            container.appendChild(seekBarContainer)
            container.appendChild(totalTime)
        }
    } else {
        // If no track is playing, change the title back to "Now Playing"
        title.innerHTML = 'Now Playing'
        // If no track is playing, remove seek bar
        container.innerHTML = ''
        // Get the list of music in the playlist to disable all the active (black background-color) tracks if any
        var list = document.getElementsByClassName('music')
        Array.from(list).forEach(element =>{
            // Toggle active class to false
            element.classList.toggle('active', false)
        });
    }
    // Updating the seek Bar
    if ( document.getElementById('progress') ) {
        document.getElementById('currentTime').innerText = duration(currentSeconds)
        document.getElementById('progress').value = Math.trunc((currentSeconds/totalSeconds)*100)
        seekChange()
        document.getElementById('totalTime').innerText = duration(totalSeconds)
    }
}

// Current Player Media Buttons and Volume State
async function currentPlayerBar() {
    // Send Batch Update Request
    var state = await updatePlayer()
    var player = state[0].result
    nowPlayingBar(state[2].result,player.time,player.totaltime)
    // Updating the state of Play/Pause Button
    if ( player.speed == 0 ) {
        document.getElementById('play_pause').setAttribute('src','images\\play_button.png')
    }
    else if (player.speed == 1) {
        document.getElementById('play_pause').setAttribute('src','images\\pause_button.png')
    }
    // Updating the state of Loop Button
    if ( player.repeat == "off") {
        document.getElementById('loop').setAttribute('src','images\\loop_off_button.png')
    }
    else if ( player.repeat == "one") {
        document.getElementById('loop').setAttribute('src','images\\loop_one_button.png')
    }
    else if ( player.repeat == "all") {
        document.getElementById('loop').setAttribute('src','images\\loop_all_button.png')
    }
    // Updating the state of Shuffle Button
    if ( player.shuffled == true) {
        document.getElementById('shuffle').setAttribute('src','images\\shuffle_on_button.png')
    }
    else if ( player.shuffled == false ) {
        document.getElementById('shuffle').setAttribute('src','images\\shuffle_off_button.png')
    }
    // Update the volume slider for current volume
    var application = state[1].result
    document.getElementById('myRange').value = application.volume
    volumeChange()
}

// Seek Bar Time Display Formatting
function time(timeObject) {
    var hours = timeObject.hours
    var minutes = timeObject.minutes
    var seconds = timeObject.seconds
    if ( hours !=0 ) {
        if ( hours == 1) {
            return ( hours+'hour' )
        }
        else {
            return ( hours+'hours' )
        }
    }
    else {
        if ( minutes >= 10 ) {
            return ( minutes+':'+seconds )
        }
        else {
            if ( seconds >= 10 ) {
                return ( '0'+minutes+':'+seconds )
            }
            else {
                return ( '0'+minutes+':0'+seconds )
            }
        }
    }
}

// Duration / Time / Display in <dd> of Music Playlist (Not used at the moment)
function duration(length = 0) {
    if (length >= 3600) {
        var result
        var hour = Math.trunc(length/3600)
        hour == 1 ? result = hour+'hour' : result = hour+'hours'
        return result
    } else if (length >= 600) {
        var mins = Math.trunc(length/60)
        var result = mins+'mins'
        return result
    } else if (length >= 60) {
        var result
        var min = Math.trunc(length/60)
        var secs = Math.trunc(((length/60)-min)*60)
        secs.toString().length == 2 ? result = '0'+min+':'+secs : result = '0'+min+':0'+secs
        return result
    } else if (length >= 10) {
        var result = '00:'+length
        return result

    } else {
        var result = '00:0'+length
        return result
    }
}

// Toggle the Navigation Menu when clicking toggle button by chaging width (Mobile Devices)
function navToggle() {
    var toggleButton = document.getElementById('menu')
    if (toggleButton.style.width == '250px') {
        toggleButton.style.width = '0'
        toggleButton.style.border = '0px'
    } else {
        toggleButton.style.width = '250px'
        toggleButton.style.borderRight = '3px solid #41b6e6'
    }
}

// Reset the Navigation Menu when window larger than 786px or for Tablets and Laptops
function resetNav() {
    if (window.innerWidth >= 768) {
        document.getElementById('menu').style.width = '250px'
    }
    else {
        document.getElementById('menu').style.width = '0px'
    }
}

//Seek Bar Background Change according to seek value
function seekChange() {
    // percent modifyer is just to make sure the gradient breakboint is not visible outside the thumb
    var percent = Number(document.querySelector('.seek input').value)
    document.getElementById('progress').style.background = 'linear-gradient(to right, #41b6e6CC 0%, #41b6e6CC ' + ( percent < 50 ? percent+0.5 : percent-0.5 ) + '%, #d3d3d3 ' + ( percent < 50 ? percent+0.5 : percent-0.5 ) + '%, #d3d3d3 100%)'
    document.getElementById('progress').setAttribute('title',percent+'%')
}

//Volume Slider Background Change according to volume value
function volumeChange() {
    document.getElementById('myRange').style.background = 'linear-gradient(to right, #41b6e6 0%, #41b6e6 ' + document.getElementById('myRange').value + '%, #d3d3d3 ' + document.getElementById('myRange').value + '%, #d3d3d3 100%)'
    document.getElementById('myRange').setAttribute('title',document.getElementById('myRange').value)
}