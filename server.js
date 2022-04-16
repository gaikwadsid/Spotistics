const fetch = require('node-fetch');
const configData = require("./config.json");
const bodyParser = require('body-parser')
const CLIENT_ID = configData.clientId;
const CLIENT_SECRET = configData.clientSecret;
const PORT = configData.port;
// const TOKEN = configData.testToken;
let TOKEN = false
let prevTokenTimestamp = 0


const express = require("express")
const app = express()

app.use(express.static("static"))
app.use(bodyParser.json())

// Refresh the token automatically!
app.use((req, res, next)=>{
  refreshTokenIfNecessary()
    .then(()=>next())
})

async function refreshTokenIfNecessary() {
  if (Date.now() - prevTokenTimestamp > 60*60*1000 - 50) {
    return refreshToken()
  } else {
    return false
  }
}

async function refreshToken() {
  let obj = await getSpotifyToken(CLIENT_ID, CLIENT_SECRET)
  TOKEN = obj.access_token
  prevTokenTimestamp = Date.now()
  console.log("Token Refreshed at", Date.now())
  return true
}

function search(query) {
  console.log(TOKEN)
  return fetch(`https://api.spotify.com/v1/search/?q=${encodeURIComponent(query)}&type=track`, {
  method:"GET", 
  headers:{
    'Content-Type': 'application/json',
    'Authorization': 'Bearer ' + TOKEN
    }
  })
  .then(res=>res.json())
  .then(res=>{
    console.log(res)
    return res
  })
}

function getSongInfo(id) {
  return Promise.all([
    fetch(`https://api.spotify.com/v1/audio-features/${encodeURIComponent(id)}`, {
      method:"GET", 
      headers:{
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + TOKEN
      }
    })
    .then(res=>res.json()),
    fetch(`https://api.spotify.com/v1/tracks/${encodeURIComponent(id)}`, {
      method:"GET", 
      headers:{
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + TOKEN
      }
    })
    .then(res=>res.json())])
}



async function getSpotifyToken(id, secret) {
  return fetch("https://accounts.spotify.com/api/token", {
    method:"POST", 
    headers:{
      'Content-Type': 'application/x-www-form-urlencoded',
      'Authorization': 'Basic ' + Buffer.from(CLIENT_ID + ':' + CLIENT_SECRET).toString('base64')
    },
    body: encodeURIComponent("grant_type") + "=" + encodeURIComponent("client_credentials")
  })
    .then(res=>res.json())
}

// async function init() {
//   const token = await getSpotifyToken(CLIENT_ID, CLIENT_SECRET)
//   console.log(token)
// }

app.post("/search-tracks", (req, res)=>{
  console.log(req.body)
  if (req.body && req.body.query) {
    search(req.body.query)
      .then(data=>res.json(data)) 
  } else {
    search("")
      .then(data=>res.json(data)) 
  }
})

app.post("/song-info", (req, res)=>{
  console.log(req.body)
  if (req.body && req.body.id) {
    getSongInfo(req.body.id)
      .then((array)=>{
        return {info:array[1], stats:array[0]}
      })
      .then(data=>res.json(data))
  } else {
    res.sendStatus(400)
  }
})

app.listen(PORT, ()=>{
  console.log(`Listening on port ${PORT}!`)
})
