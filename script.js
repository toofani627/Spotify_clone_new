let currentSong = new Audio();
let currentfolder = '';
let previousSelected = null;
async function fetchSongsList() {
    // Define folders to check for songs
    const songFolders = ['1', '2', '3', '4', 'english songs'];
    const songs = [];


    // Fetching Folder List
    let baseUrl = '';
    if (window.location.href.includes('github.io')) {
        baseUrl = window.location.href.split('/').slice(0, -1).join('/');
    } else {
        baseUrl = window.location.origin;
    }

    try {
        // Fetch info.json from each folder
        for (const folder of songFolders) {
            try {
                const response = await fetch(`${baseUrl}/songs/${folder}/info.json`);
                if (!response.ok) {
                    console.warn(`Could not fetch info for folder ${folder}`);
                    continue;
                }
                const songInfo = await response.json();
                songs.push({
                    id: folder,
                    ...songInfo
                });
            } catch (error) {
                console.warn(`Error fetching data for folder ${folder}:`, error);
            }
        }

        return songs;
    } catch (error) {
        console.error('Error fetching songs:', error);
        return [];
    }
}

// Fetching Songs





// Usage example

async function displaySongs() {
    const Folders = await fetchSongsList();

    function loadCards() {
        const titles = [];
        const descriptions = [];

        for (const folder of Folders) {
            // Check if folder has title and description
            if (folder.title && folder.description) {
                titles.push(folder.title);
                descriptions.push(folder.description);
            }
        }

        console.log("Folder Titles:", titles);
        console.log("Folder Descriptions:", descriptions);

        for (let i = 0; i < titles.length; i++) {
            let cardContainer = document.querySelector('.cardContainer')
            cardContainer.innerHTML = cardContainer.innerHTML + ` <div class="card" data-id="${Folders[i].id - 1}">   
                <div class="play_btn">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 44 44"
                    width="40"
                    height="40"
                  >
                    <!-- Updated green circle as the background -->
                    <circle cx="22" cy="22" r="22" fill="rgb(3, 255, 61)" />
                    <!-- Original SVG icon, scaled and centered -->
                    <g transform="translate(10, 10)">
                      <path
                        d="M18.8906 12.846C18.5371 14.189 16.8667 15.138 13.5257 17.0361C10.296 18.8709 8.6812 19.7884 7.37983 19.4196C6.8418 19.2671 6.35159 18.9776 5.95624 18.5787C5 17.6139 5 15.7426 5 12C5 8.2574 5 6.3861 5.95624 5.42132C6.35159 5.02245 6.8418 4.73288 7.37983 4.58042C8.6812 4.21165 10.296 5.12907 13.5257 6.96393C16.8667 8.86197 18.5371 9.811 18.8906 11.154C19.0365 11.7084 19.0365 12.2916 18.8906 12.846Z"
                        stroke="black"
                        stroke-width="1.5"
                        stroke-linejoin="round"
                        fill="none"
                      />
                    </g>
                  </svg>
                </div>
                <img src="songs/${Folders[i].id}/cover.jpg" alt="card-img" />
                <h2>${titles[i]}</h2>
                <p>${descriptions[i]}</p>
              </div>`

        }
    }

    loadCards();

    function loadingSongList() {
        Array.from(document.getElementsByClassName('card')).forEach((card, index) => {
            card.addEventListener('click', () => {
                let folderId = card.getAttribute('data-id');
                currentfolder = folderId;
                console.log(folderId);
                let folder = Folders[folderId].songs;
                const titles = [];
                const artists = [];
                const Song_location = [];
                for (const key in folder) {
                    const { title, artist, file } = folder[key];
                    titles.push(title);
                    artists.push(artist);
                    Song_location.push(`songs/${parseInt(folderId) + 1}/${file}`);
                }
                console.log(Song_location)
                let songsUL = document.querySelector('.songs_list').querySelector('ul');
                console.log(songsUL);
                songsUL.innerHTML = '';
                for (let i = 0; i < titles.length; i++) {
                    songsUL.innerHTML = songsUL.innerHTML + `<li class="song_li">
                       <div class="library_li_info">
                       <img src="svg/images/music.png" alt="" class="img1"> 
                       <div class="info">
                       <div class="song_name">${titles[i]}</div>
                       <div class="artist_name">${artists[i]}</div>
                       </div>
                       </div>
                       <img src="svg/playbtn.svg" alt="img2" class="img2 play_img" />
                       </li>`
                }




                function playSong() {
                    Array.from(document.querySelector('.songs_list').getElementsByTagName('li')).forEach((e, index) => {
                        e.addEventListener('click', Element => {
                            const songName = e.querySelector('.info').firstElementChild.innerHTML;
                            console.log('Playing:', songName);

                            // Get the file name from Song_location
                            const trackPath = Song_location[index];
                            const trackName = trackPath.split('/').pop(); // Gets the file name from path

                            // Play the song with proper URL format
                            currentSong.src = trackPath;
                            currentSong.play()
                                .then(() => {
                                    // Update UI elements
                                    document.querySelector('.song-info').innerHTML = songName; // Handle 
                                    play.src = 'svg/images/play.svg';
                                    const playImg = e.querySelector('.play_img');
                                    if (playImg) {
                                        playImg.src = 'svg/images/play.svg';
                                    }
                                    // Update highlighted song
                                    if (previousSelected) {
                                        previousSelected.classList.remove('highlighted');
                                    }
                                    e.classList.add('highlighted');
                                    previousSelected = e;
                                })

                        });
                    });
                }



                playSong();



            })

        });

    }

    loadingSongList();
    // ...existing code...

    function formatTime(seconds) {
        let minutes = Math.floor(seconds / 60);
        let secs = Math.floor(seconds % 60);

        // Ensure two-digit format using padStart
        let formattedMinutes = minutes.toString().padStart(2, '0');
        let formattedSeconds = secs.toString().padStart(2, '0');

        return `${formattedMinutes}:${formattedSeconds}`;
    }

    loadingSongList();

    play.addEventListener('click', () => {
        console.log('clicked');
        if (currentSong.paused) {
            currentSong.play();
            play.src = 'svg/images/play.svg'

        } else {
            play.src = 'svg/playbtn.svg'
            currentSong.pause()
        }

    })

    currentSong.addEventListener("timeupdate", () => {
        document.querySelector(".timeline").innerHTML = `${formatTime(currentSong.currentTime)}  /  ${formatTime(currentSong.duration)}`

        // Update circle position
        document.querySelector('.circle').style.left = (currentSong.currentTime / currentSong.duration) * 100 + '%'
    });
    // ...existing code...

    document.querySelector('.hamburger').addEventListener('click', () => {
        document.querySelector('.left').style.left = '0%'


    })

    document.querySelector('.ham_close').addEventListener('click', () => {
        document.querySelector('.left').style.left = '-100%'
    })





    console.log('Fetched songs:', Folders);
    let song = Folders[0].songs.song1.file;
    console.log(song);
    // document.addEventListener('click', function () {
    //     currentfolder = Folders[0].id;
    //     // Fix the path by adding 'songs' directory
    //     currentSong.src = `songs/${currentfolder}/${song}`;
    //     currentSong.play();
    //     console.log("successfully played song from folder: " + currentfolder);

    // });



}

// Call the function when the page loads
document.addEventListener('DOMContentLoaded', displaySongs);