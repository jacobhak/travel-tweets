var map;
var markers = [];
var markers2 = [];
var boxes = [];

function setupMap() {
    var pos;
    pos = new google.maps.LatLng(40.00,-99.0);

    var mapOptions = {
        center: pos,
        zoom: 4,
        mapTypeId: google.maps.MapTypeId.ROADMAP
    };
    map = new google.maps.Map(document.getElementById("map-canvas"), mapOptions);
}

var infowindow = new google.maps.InfoWindow();

function putTweetsOnMap(tweets) {
  clearMarkers();
  console.log(map);
  var pos;
  for (var i = 0; i < tweets.length; i++) {
    pos = new google.maps.LatLng(tweets[i].lat, tweets[i].lng);
    var marker = new google.maps.Marker({
      position: pos,
      map: map,
      icon: pinColors[i*2 +1],
      title:"Hi"
    });
    pos = new google.maps.LatLng(tweets[i].latold, tweets[i].lngold);
    var marker2 = new google.maps.Marker({
      position: pos,
      map: map,
      icon: pinColors[i*2],
      title:"Hi"
    });
    markers[i] = marker;
    markers2[i] = marker2;
    var iw = new InfoBox();
    var iw2 = new InfoBox();
    iw.setContent(tweets[i].tweet.slice(0,50) + "<br><a onclick='showTweet("+i+")'>More</a>");
    iw2.setContent(tweets[i].tweetold.slice(0,50) + "<br><a onclick='showTweet("+i+")'>More</a>");
    iw.open(map, marker);
    iw2.open(map, marker2);
    boxes.push(iw, iw2);
    //makeInfoWindowEvent(tweets[i].username + ": " + tweets[i].tweet, marker);
    //makeInfoWindowEvent(tweets[i].username + ": " + tweets[i].tweetold, marker2);
  }

}

function clearMarkers() {
  for (var i = 0; i < markers.length; i++) {
    markers[i].setMap(null);
    markers2[i].setMap(null);
    boxes[i].setMap(null);
    boxes[10+i].setMap(null);
  }
  markers = [];
  markers2 = [];
  boxes = [];
}

pinColors = [
  'markers/blue_MarkerA.png',
  'markers/red_MarkerA.png',
  'markers/blue_MarkerB.png',
  'markers/red_MarkerB.png',
  'markers/blue_MarkerC.png',
  'markers/red_MarkerC.png',
  'markers/blue_MarkerD.png',
  'markers/red_MarkerD.png',
  'markers/blue_MarkerE.png',
  'markers/red_MarkerE.png',
  'markers/blue_MarkerF.png',
  'markers/red_MarkerF.png',
  'markers/blue_MarkerG.png',
  'markers/red_MarkerG.png',
  'markers/blue_MarkerH.png',
  'markers/red_MarkerH.png',
  'markers/blue_MarkerI.png',
  'markers/red_MarkerI.png',
  'markers/blue_MarkerJ.png',
  'markers/red_MarkerJ.png'
];
function makeInfoWindowEvent(contentString, marker) {
  google.maps.event.addListener(marker, 'click', function() {
    infowindow.setContent(contentString);
    infowindow.open(map, marker);
  });
}