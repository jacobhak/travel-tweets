var username = "admin";
var password = "password";
var scheme   = "https";
var host     = "localhost";
var port     = "8089";
var version  = "5.0";

var tweets;
var currentTweets;
var tweetInterval;



var Async = splunkjs.Async;
var utils = splunkjs.Utils;
var http = new splunkjs.ProxyHttp("/proxy");
var service = new splunkjs.Service(http, {
  username: username,
  password: password,
  scheme: scheme,
  host: host,
  port: port,
  version: version
});

function incrementTweetInterval() {
  var newTweets = tweets.splice((tweetInterval)*10, 10);
  $("#tweetTable").children().remove();
  putTweetsOnMap(newTweets);
  putTweetsInTable(newTweets);
  tweetInterval += 1;
}

function showTweet(i) {
  console.log("showing tweet: "+i);
  var div = $("#popup");
  div.children().remove();
  div.append(popupTable(currentTweets[i]));
  $('#popup').modal('show');
}

function popupTable(tweet) {
  var ul = $("<ul>");
  var li = $("<li>");
  for (var key in tweet) {
    li = $("<li>");
    if (tweet.hasOwnProperty(key)) {
      li.append(key + ": " + tweet[key]);
    }
    ul.append(li);
  }
  return ul;
}

function putTweetsInTable(tweets) {
  var letters = ['A','B','C','D','E','F','G','H','I','J'];
  var tbody = $("#tweetTable");
  for (var i = 0; i < tweets.length; i++) {
    var tr = $("<tr>");
    var td = $("<td>");
    td.append(letters[i]);
    tr.append(td);
    td = $("<td>");
    td.append(tweets[i].username);
    tr.append(td);
    td = $("<td>");
    td.append(tweets[i].placeold);
    tr.append(td);
    td = $("<td>");
    td.append(tweets[i].place);
    tr.append(td);
    td = $("<td>");
    td.append(Math.floor(tweets[i].distance));
    tr.append(td);
    td = $("<td>");
    td.append(Math.floor(tweets[i].mph));
    tr.append(td);
    tbody.append(tr);
  }
}
function derp() {
  $('#theTable').hide();
Async.chain([
  // First, we log in
  function(done) {
    service.login(done);
  },
  // Perform the search
  function(success, done) {
    if (!success) {
      done("Error logging in");
    }

    // The saved search created earlier
    var searchName = "ljtt4h";

  // Retrieve the saved search collection
  var mySavedSearches = service.savedSearches();
  mySavedSearches.fetch(function(err, mySavedSearches) {
  // Retrieve the saved search that was created earlier

  var mySavedSearch = mySavedSearches.item(searchName);
  console.log(mySavedSearch);
  // Run the saved search and poll for completion
  mySavedSearch.dispatch(function(err, jobs, search) {
    console.log(jobs);
    var job = jobs;

    // Display the job's search ID
    console.log("Job SID: ", job.sid);

    // Poll the status of the search job
    job.track({
      period: 200
    }, {
      done: function(job) {
        console.log("Done!");

        // Print out the statics
        console.log("Job statistics:");
        console.log("  Event count:  " + job.properties().eventCount);
        console.log("  Result count: " + job.properties().resultCount);
        console.log("  Disk usage:   " + job.properties().diskUsage + " bytes");
        console.log("  Priority:     " + job.properties().priority);

        // Get 10 results and print them
        job.results({
          count: 100
        }, function(err, results, job) {
          res = [];
          for (var i = 0; i < results.rows.length; i++) {
            res[i] = {
              username: results.rows[i][utils.indexOf(results.fields, "user.screen_name")],
              tweet: results.rows[i][utils.indexOf(results.fields, "text")],
              tweetold: results.rows[i][utils.indexOf(results.fields, "textold")],
              lngold: results.rows[i][utils.indexOf(results.fields, "lngold")],
              latold: results.rows[i][utils.indexOf(results.fields, "latold")],
              lng: results.rows[i][utils.indexOf(results.fields, "lng")],
              lat: results.rows[i][utils.indexOf(results.fields, "lat")],
              distance: Math.floor(results.rows[i][utils.indexOf(results.fields, "geodistance")]),
              mph: Math.floor(results.rows[i][utils.indexOf(results.fields, "mph")]),
              placeold: results.rows[i][utils.indexOf(results.fields, "placeold")],
              place: results.rows[i][utils.indexOf(results.fields, "place.full_name")]
            };
          }
          tweets = res;
          tweetInterval = 1;
          currentTweets = res.splice(tweetInterval-1, 10);
          putTweetsInTable(currentTweets);
          putTweetsOnMap(currentTweets);
        });
      },
      failed: function(job) {
        console.log("Job failed");
      },
      error: function(err) {
        done(err);
      }
    });
  });
});
  }
  ],
  function(err) {
    callback(err);
}
);
}

