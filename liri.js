
require("dotenv").config();

const fs = require('fs');
var request = require('request');

var keys = require("./keys");

var Spotify = require('node-spotify-api');
var Twitter = require('twitter');

var spotify = new Spotify(keys.spotify);
var client = new Twitter(keys.twitter);

var selector = process.argv[2];
var command = process.argv[3];

var params = {
    screen_name: 'BootcampJ',
    count: 20
};

switch (selector) {
    case 'my-tweets':
        myTweets();
        break;
    case 'spotify-this-song':
        spotifyMe(command);
        break;
    case 'movie-this':
        omdbMe(command);
        break;
    case 'do-what-it-says':
        random();
        break;
}

function spotifyMe(command) {
    
    if (command == null) {
        command = 'All The Small Things';
    }

    spotify
    .request(`https://api.spotify.com/v1/search?query=${command}&type=track&offset=0&limit=2`)
    .then(function(data) {
        //console.log(data); 
        var numArt = data.tracks.items[0].artists.length;
        var count = 0;
        var songLink ='';
        var artistArr =[];

        var artistsCheck = function(){
            if (count < numArt){
                if (count == 0){
                    artistArr.push(`Artist: ${data.tracks.items[0].artists[0].name}`)
                } else if (count == 1){
                    artistArr.push(` ft. ${data.tracks.items[0].artists[1].name}`)
                } else if (count == 2){
                    artistArr.push(` & ${data.tracks.items[0].artists[2].name}`)
                } else if (count == 3){
                    artistArr.push(` & ${data.tracks.items[0].artists[3].name}`)
                }
                count++;
                artistsCheck();
            }  
        }
        artistsCheck();

        console.log(`\n${artistArr.join('')}`)

        console.log(`Song Name: ${data.tracks.items[0].name}`)
        if (data.tracks.items[0].preview_url === null){
            songLink = data.tracks.items[0].external_urls.spotify;
            console.log(`There's no preview link for this song but here is a direct link to the \nsong on Spotify: ${data.tracks.items[0].external_urls.spotify}`)
        }else{
            songLink = data.tracks.items[0].preview_url;
            console.log(`Preview Link: ${data.tracks.items[0].preview_url}`)
        }
        console.log(`Album: ${data.tracks.items[0].album.name}\n`)
        

        var terminalInputs = process.argv.splice(2,4);
        fs.appendFile('log.txt', 
        (`-----------------------------Log Start-----------------------------\n\n
        Date: ${Date()}\n
        Inputs: ${terminalInputs}\n
        Outputs:\n
            ${artistArr.join('')}\n
            Song Name: ${data.tracks.items[0].name}\n
            Song Link: \n\n${songLink}\n
            Album: ${data.tracks.items[0].album.name}\n
        \n------------------------------Log End------------------------------\n\n\n`), 
        function (err) {
            if (err) throw err;
        });
    })
    .catch(function(err) {
        console.error('Error occurred: ' + err); 
    });
}


function myTweets() {

    var tweetsArr = []
    count = 0;

    client.get('statuses/user_timeline', params, function(error, tweets, response) {
        if (!error) {

            var tweetHistory = function (){ 
                if (count <20){
                    tweetsArr.push(`${params.screen_name} tweeted \t${tweets[count].text}\tat ${tweets[count].created_at}.`);
                    count++;
                    tweetHistory();
                }   
            }
            tweetHistory();
        }
        console.log(tweetsArr.join('\n'));

        var terminalInputs = process.argv.splice(2,3);
        fs.appendFile('log.txt', 
        (`-----------------------------Log Start-----------------------------\n\n
        Date: ${Date()}\n
        Inputs: ${terminalInputs}\n
        Outputs:\n
            \n${tweetsArr.join('\n')}\n
        \n------------------------------Log End------------------------------\n\n\n`), 
        function (err) {
            if (err) throw err;
        });
    });
} 

function omdbMe(command) {
    if (command == null) {
        command = 'wargames';
    }
    request(`http://www.omdbapi.com/?t=${command}&y=&plot=short&tomatoes=true&r=json&apikey=trilogy`, function(error, response, body) {
        if (!error && response.statusCode == 200) {
            jsonResults = JSON.parse(body)
            var movieResults =(`\
                \nTitle: ${jsonResults.Title}\
                \nYear: ${jsonResults.Year}\
                \nIMDB Rating: ${jsonResults.imdbRating}\
                \nRotten Tomatoes Rating: ${jsonResults.Ratings[1].Value}\
                \nCountry: ${jsonResults.Country}\
                \nLanguage: ${jsonResults.Language}\
                \nPlot: ${jsonResults.Language}\
                \nActors: ${jsonResults.Actors}\n
            `);

            console.log(movieResults);
            var terminalInputs = process.argv.splice(2,4);
            fs.appendFile('log.txt', 
            (`-----------------------------Log Start-----------------------------\n\n
            Date: ${Date()}\n
            Inputs: ${terminalInputs}\n
            Outputs:\n
                \n${movieResults}\n
            \n------------------------------Log End------------------------------\n\n\n`), function(err) {
                 if (err) throw err;
             });
        }
    });
} 

function random() {
    fs.readFile('random.txt', 'utf8', function(error, data) {
        if (error) {
            console.log(error);
        } else {
            var rand = Math.floor(Math.random() * 12);

            console.log[dataArr]
            var dataArr = data.split('\n');
            console.log(dataArr)
            var dataArray = dataArr[rand].split(',')
            console.log(dataArray)
            if (dataArray[0] === 'spotify-this-song') {
                spotifyMe(dataArray[1]);
            }
            if (dataArray[0] === 'movie-this') {
                omdbMe(dataArray[1]);
            }
        }
    });
} 