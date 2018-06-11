// required modules to run 
var request = require('request');
var secrets = require('./secrets');
var fs = require('fs');
var args = process.argv;


console.log('Welcome to the GitHub Avatar Downloader!');

function getRepoContributors(repoOwner, repoName, cb) {
  // creating the URL to be requested
  var options = {
    url: "https://api.github.com/repos/" + repoOwner + "/" + repoName + "/contributors",
    headers: {
      'User-Agent': "request",
      // authorization added
      'Authorization': "token " + secrets.GITHUB_TOKEN
    }
  };

  request(options, function(err, res, body) {
    if (!err) {
      // if no errors, continuing to parse data
      var obj = JSON.parse(body)
      cb(err, obj);
    }
  });
}

function downloadImageByURL(url, filePath) {
  request.get(url)
    .on('error', function(err) {
      throw err;
    })
    // downloading messages to show during the process
    .on('response', function(response) {
      console.log('Downloading image...');
    })
    .on('end', function() {
      console.log('Download complete.');
    })
    // creates the file
    .pipe(fs.createWriteStream(filePath));
}


// calling function to run on Node command line
getRepoContributors(process.argv[2], process.argv[3], function(err, result) {
  for (var i = 0; i < result.length; i++) {
    downloadImageByURL(result[i].avatar_url, `./avatars/${result[i].login}.jpg`);
  }
});