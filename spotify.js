const fetch = require('node-fetch');
const configData = require("./config.json");
const CLIENT_ID = configData.clientId;
const CLIENT_SECRET = configData.clientSecret;
const TOKEN = configData.testToken;

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

async function init() {
  const token = await getSpotifyToken(CLIENT_ID, CLIENT_SECRET)
  console.log(token)
}

// init()

const taylor = "06HL4z0CvFAxyc27GXpf02"
// fetch(`https://api.spotify.com/v1/artists/${taylor}`, {
//   method:"GET", 
//   headers:{
//     'Content-Type': 'application/json',
//     'Authorization': 'Bearer ' + TOKEN
//   }
// })
// .then(res=>res.json())
// .then(console.log)

// fetch(`https://api.spotify.com/v1/search/?q=test&type=track`, {
//   method:"GET", 
//   headers:{
//     'Content-Type': 'application/json',
//     'Authorization': 'Bearer ' + TOKEN
//   }
// })
// .then(res=>res.json())
// .then(data=>console.log(JSON.stringify(data, null, 4)))

const song="5enxwA8aAbwZbf5qCHORXi"

fetch(`https://api.spotify.com/v1/tracks/${song}`, {
  method:"GET", 
  headers:{
    'Content-Type': 'application/json',
    'Authorization': 'Bearer ' + TOKEN
  }
})
.then(res=>res.json())
.then(data=>console.log(JSON.stringify(data, null, 4)))


// fetch(`https://api.spotify.com/v1/audio-features/${song}`, {
//   method:"GET", 
//   headers:{
//     'Content-Type': 'application/json',
//     'Authorization': 'Bearer ' + TOKEN
//   }
// })
// .then(res=>res.json())
// .then(data=>console.log(JSON.stringify(data, null, 4)))

// init()

// var authOptions = {
//   url: 'https://accounts.spotify.com/api/token',
//   headers: {
//     'Authorization': 'Basic ' + Buffer.from(CLIENT_ID + ':' + CLIENT_SECRET).toString('base64')
//   },
//   form: {
//     grant_type: 'client_credentials'
//   },
//   json: true
// };

// request.post(authOptions, function(error, response, body) {
//   if (!error && response.statusCode === 200) {
//     var token = body.access_token;
//   }
// });

// fetch("https://api.spotify.com/v1/artists/1vCWHaC5f2uS3yhpwWbIA6/albums?album_type=SINGLE&offset=20&limit=10")
//   .then(res=>res.json())
//   .then(text=>console.log(text))