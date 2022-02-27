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

const songInfo = {
  "album": {
      "album_type": "album",
      "artists": [
          {
              "external_urls": {
                  "spotify": "https://open.spotify.com/artist/06HL4z0CvFAxyc27GXpf02"
              },
              "href": "https://api.spotify.com/v1/artists/06HL4z0CvFAxyc27GXpf02",
              "id": "06HL4z0CvFAxyc27GXpf02",
              "name": "Taylor Swift",
              "type": "artist",
              "uri": "spotify:artist:06HL4z0CvFAxyc27GXpf02"
          }
      ],
      "available_markets": [],
      "external_urls": {
          "spotify": "https://open.spotify.com/album/6kZ42qRrzov54LcAk4onW9"
      },
      "href": "https://api.spotify.com/v1/albums/6kZ42qRrzov54LcAk4onW9",
      "id": "6kZ42qRrzov54LcAk4onW9",
      "images": [
          {
              "height": 640,
              "url": "https://i.scdn.co/image/ab67616d0000b273318443aab3531a0558e79a4d",
              "width": 640
          },
          {
              "height": 300,
              "url": "https://i.scdn.co/image/ab67616d00001e02318443aab3531a0558e79a4d",
              "width": 300
          },
          {
              "height": 64,
              "url": "https://i.scdn.co/image/ab67616d00004851318443aab3531a0558e79a4d",
              "width": 64
          }
      ],
      "name": "Red (Taylor's Version)",
      "release_date": "2021-11-12",
      "release_date_precision": "day",
      "total_tracks": 30,
      "type": "album",
      "uri": "spotify:album:6kZ42qRrzov54LcAk4onW9"
  },
  "artists": [
      {
          "external_urls": {
              "spotify": "https://open.spotify.com/artist/06HL4z0CvFAxyc27GXpf02"
          },
          "href": "https://api.spotify.com/v1/artists/06HL4z0CvFAxyc27GXpf02",
          "id": "06HL4z0CvFAxyc27GXpf02",
          "name": "Taylor Swift",
          "type": "artist",
          "uri": "spotify:artist:06HL4z0CvFAxyc27GXpf02"
      }
  ],
  "available_markets": [],
  "disc_number": 1,
  "duration_ms": 613026,
  "explicit": true,
  "external_ids": {
      "isrc": "USUG12103690"
  },
  "external_urls": {
      "spotify": "https://open.spotify.com/track/5enxwA8aAbwZbf5qCHORXi"
  },
  "href": "https://api.spotify.com/v1/tracks/5enxwA8aAbwZbf5qCHORXi",
  "id": "5enxwA8aAbwZbf5qCHORXi",
  "is_local": false,
  "name": "All Too Well (10 Minute Version) (Taylor's Version) (From The Vault)",
  "popularity": 90,
  "preview_url": null,
  "track_number": 30,
  "type": "track",
  "uri": "spotify:track:5enxwA8aAbwZbf5qCHORXi"
}

const albumTitle = document.getElementById("album-title");
const songTitle = document.getElementById("song-title");
const artistTitle = document.getElementById("artist-name");

function populateUI(info, audioData) {
  albumTitle.textContent = songInfo.album.name;
  songTitle.textContent = songInfo.name;
  artistTitle.textContent = 
}
