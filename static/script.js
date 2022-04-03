const THIEF = new ColorThief()

const KEYS = ["C", "C♯ or D♭", "D", "D♯ or E♭", "E", "F", "F♯ or G♭", "G", "G♯ or A♭", "A", "A♯ or B♭", "B"]

const songAudioData = {
  "danceability": 0.631,
  "energy": 0.518,
  "key": 0,
  "loudness": -8.771,
  "mode": 1,
  "speechiness": 0.0303,
  "acousticness": 0.274,
  "instrumentalness": 0,
  "liveness": 0.088,
  "valence": 0.205,
  "tempo": 93.023,
  "type": "audio_features",
  "id": "5enxwA8aAbwZbf5qCHORXi",
  "uri": "spotify:track:5enxwA8aAbwZbf5qCHORXi",
  "track_href": "https://api.spotify.com/v1/tracks/5enxwA8aAbwZbf5qCHORXi",
  "analysis_url": "https://api.spotify.com/v1/audio-analysis/5enxwA8aAbwZbf5qCHORXi",
  "duration_ms": 613027,
  "time_signature": 4
}

function clearStats() {
  while (STATS.children.length > 0) {
    STATS.firstChild.remove()
  }
}

function mapPercentages(percent, ...args) {
  if (percent >= 1) return args[args.length - 1]
  return args[Math.floor(percent * args.length)]
}

function createStats(stats, accent) {
  clearStats()
  addProgressBar("Danceability", stats.danceability, accent)
  addProgressBar("Energy", stats.energy, accent)
  addProgressBar("Speechiness", stats.speechiness, accent)
  addText("Instrumental?", mapPercentages(stats.instrumentalness, "No", "Probably Not", "Probably", "Yes"))
  addText("Mode", mapPercentages(stats.mode, "Minor", "Major"))
  addText("Loudness", Math.round(stats.loudness + 60) + " dB")
  addText("Key", stats.key == -1 ? "Unknown" : KEYS[stats.key])
  addText("Live?", mapPercentages(stats.liveness, "No", "Maybe", "Yes"))
  addText("Tempo", Math.round(stats.tempo) + " BPM")
  addText("Time Signature", stats.time_signature + "/4")
  addText("Positivity", mapPercentages(stats.mode, "Negative", "Neutral", "Positive"))
  addText("Duration", Math.floor(stats.duration_ms / 1000 / 60)+":" + String(Math.floor(stats.duration_ms/1000 % 60)).padStart(2, "0"))
}

function getBrightness(color) {
  return (color[0] + color[1] + color[2])/ (3 * 255)
}

function addProgressBar(name, percent, accent = [255,0,0]) {
  let background = getBrightness(accent) < 0.5 ? "#eee" : "#111"
  let cont = document.createElement("div")
  cont.classList.add("stat")
  let label = document.createElement("p")
  label.textContent = name
  cont.append(label)
  let progressBarCont = document.createElement("div")
  progressBarCont.classList.add("progressBar")
  progressBarCont.style.background = background
  let bar = document.createElement("div")
  bar.style.width = percent * 100 + "%"
  bar.style.background = "rgb("+accent.join(", ")+")"
  progressBarCont.append(bar)
  cont.append(progressBarCont)
  STATS.append(cont)
}

function addText(name, text) {
  let cont = document.createElement("div")
  cont.classList.add("stat")
  let label = document.createElement("p")
  label.textContent = name
  cont.append(label)
  let textElem = document.createElement("p")
  console.log(name, text)
  textElem.textContent = text
  textElem.classList.add("description")
  cont.append(textElem)
  STATS.append(cont)
}

const BACKGROUND = document.getElementById("background")
const SEARCH_BUTTON = document.getElementById("searchButton")
const STATS = document.getElementById("stats")
const albumTitle = document.getElementById("album-title")
const songTitle = document.getElementById("song-title")
const artistTitle = document.getElementById("artist-name")
const albumArt = document.getElementById("album-art")
const danceability = document.getElementById("danceability-stat")
const energy = document.getElementById("energy-stat")
const speechiness = document.getElementById("speechiness-stat")

SEARCH_BUTTON.addEventListener("click", ()=>{
  hideResultsAndShowSearch()
})

function populateUI(info, audioData) {
  albumArt.src = info.album.images[0].url
  albumArt.onload = () => {
    const accent = handleColorQuantization()
    albumTitle.textContent = info.album.name
    songTitle.textContent = info.name
    artistTitle.textContent = info.artists.map(artist=>artist.name).join(", ")
    createStats(audioData, accent)
    danceability.style.width = audioData.danceability * 100 + "%"
    energy.style.width = audioData.energy * 100 + "%"
    speechiness.style.width = audioData.speechiness * 100 + "%"
    showSongInfo()
  }
}

function showSongInfo() {
  BACKGROUND.classList.remove("hidden")
  document.getElementById("song-info").classList.remove("hidden")
  SEARCH_BUTTON.classList.remove("hidden")
}

function handleColorQuantization() {
  try {
    let palette = THIEF.getPalette(albumArt)
    palette = [...palette, ...palette, ...palette, ...palette, ...palette]
    BACKGROUND.style.backgroundImage = palette.map(randomRadial).join(", ");
    return THIEF.getColor(albumArt)
  } catch (e) {
    console.error(e)
    return [255, 255, 255]
  }
}

function randomRadial(color) {
  const x = Math.ceil(Math.random() * 100)
  const y = Math.ceil(Math.random() * 100)
  return `radial-gradient(at ${x}% ${y}%, rgb(${color[0]}, ${color[1]}, ${color[2]}) 0, transparent 50%)`
}

function getSongInfo(id) {
  return new Promise((resolve, reject)=>{
    fetch("/song-info", {
      method:"POST", 
      body: JSON.stringify({id: id}),
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      }
    })
      .then(res=>res.json())
      .then(res=>resolve(res))
  })
}

// getSongInfo("19blFYzqmPj7FtW7W4DFEl").then(data=>populateUI(data.info, data.stats))

// populateUI(pyreInfo, pyreAudioInfo)

// console.log(randomRadial([50, 50, 50]))

// ===========
// SEARCH CODE
// ===========

const searchCont = document.getElementById("search")
const search = document.getElementById("searchResults")

var lastQueryTime = 0
var lastTimer = false
var lastQuery = ""

function getResults(query) {
  return new Promise((resolve, reject)=>{
    fetch("/search-tracks", {
      method:"POST", 
      body: JSON.stringify({query: query}),
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      }
    })
      .then(res=>res.json())
      .then(res=>resolve(res))
  })
}

function createSearchResult(songImage, songTitle, songArtist, songId) {
  const result = document.createElement("div");
  result.classList.add("result");
  const image = document.createElement("img");
  image.setAttribute("src", songImage);
  image.classList.add("image");
  const info = document.createElement("div");
  info.classList.add("info");
  const title = document.createElement("p");
  title.classList.add("title");
  title.textContent = songTitle;
  const artist = document.createElement("p");
  artist.classList.add("artist");
  artist.textContent = songArtist;
  info.append(title, artist);
  result.append(image, info);
  result.addEventListener("click",()=>{
    inspectSong(songId)
  })
  return result;
}

function hideSearch() {
  searchCont.classList.add("hidden")
}

function hideResultsAndShowSearch() {
  BACKGROUND.classList.add("hidden")
  document.getElementById("song-info").classList.add("hidden")
  SEARCH_BUTTON.classList.add("hidden")
  setTimeout(()=>{
    searchCont.classList.remove("hidden")
  }, 1500)
}

function timerPromise(ms) {
  return new Promise((res)=>{
    setTimeout(()=>{
      res()
    }, ms)
  })
}

function inspectSong(id) {
  hideSearch()
  Promise.all([
    getSongInfo(id),
    timerPromise(1000)
  ])
    .then(arr=>arr[0])
    .then(data=>populateUI(data.info, data.stats))
  //console.log(id)
}


const RATE_LIMIT = 900
async function searchTrack(query) {
  if (query == "") {
    clearTracks()
    lastQueryTime = Date.now()
    return
  }
  if (query == lastQuery) {
    lastQueryTime = Date.now()
    return
  }
  const timeDelta = Date.now() - lastQueryTime
  // console.log(timeDelta, query)
  if (timeDelta > RATE_LIMIT) {
    // console.log(query)
    lastQuery = query
    lastQueryTime = Date.now()
    const results = await getResults(query)
    displayTracks(results.tracks.items)
  } else {
    if (lastTimer) {
      clearTimeout(lastTimer)
    }
    lastTimer = setTimeout(()=>{
      searchTrack(query)
    }, RATE_LIMIT - timeDelta)
  }
  
}

function displayTrack(track) {
  const title = track.name
  const artists = track.artists.map(artist=>artist.name).join(", ")
  search.append(createSearchResult(track.album.images[track.album.images.length - 1].url, title, artists, track.id))
}

function clearTracks() {
  while (search.children.length > 0) {
    search.firstChild.remove()
  }
}

function displayTracks(listOfTracks) {
  tracks = listOfTracks.slice(0, 5);
  clearTracks()
  tracks.forEach(displayTrack);
}

const searchBox = document.getElementById("searchBox")
searchBox.addEventListener("keyup", (e)=>{
  searchTrack(searchBox.value.trim());
})

document.body.classList.add("transition")