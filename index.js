const express = require('express');
const SpotifyWebApi = require('spotify-web-api-node');

// load env variables, if any
require('dotenv').config();

const app = express();

const spotifyApi = new SpotifyWebApi({
  clientId : process.env.CLIENT_ID,
  clientSecret : process.env.CLIENT_SECRET
});

const fetchToken = () => {
  spotifyApi.clientCredentialsGrant()
    .then(function(data) {
      console.log('The access token expires in ' + data.body['expires_in']);
      console.log('The access token is ' + data.body['access_token']);

      // Save the access token so that it's used in future calls
      spotifyApi.setAccessToken(data.body['access_token']);
    }, function(err) {
      console.log('Something went wrong when retrieving an access token', err);
    });
};

app.get('/', (req, res) => res.send('search, fetchAlbumsByArtist, fetchAlbumDetails'));

app.get('/search/:artist', (req, res) =>
  spotifyApi.searchArtists(req.params.artist)
  .then(function(data) {
    res.send(data.body);
  }, function(err) {
    res.status(400).send(err);
  })
);

app.get('/fetchAlbumsByArtist/:id', (req, res) =>
  spotifyApi.getArtistAlbums(req.params.id)
  .then(function(data) {
    res.send(data.body);
  }, function(err) {
    res.status(400).send(err);
  })
);

app.get('/fetchAlbumDetails/:id', (req, res) =>
  spotifyApi.getAlbum(req.params.id)
  .then(function(data) {
    res.send(data.body);
  }, function(err) {
    res.status(400).send(err);
  })
);

app.listen(process.env.PORT, () => {
    console.log('spotify explorer API running');
    fetchToken();
});
