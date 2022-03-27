

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

function inspectSong(id) {
  hideSearch()
  console.log(id)
}


const RATE_LIMIT = 1000
async function searchTrack(query) {
  if (query == "") {
    clearTracks()
    return
  }
  if (query == lastQuery) {
    return
  }
  const timeDelta = Date.now() - lastQueryTime
  console.log(timeDelta, query)
  if (timeDelta > RATE_LIMIT) {
    console.log(query)
    lastQuery = query
    lastQueryTime = Date.now()
    const results = await getResults(query)
    console.log(results)
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
  console.log(track)
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

// search.append(createSearchResult("", "Test Song", "Cool Artist"))