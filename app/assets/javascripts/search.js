

$(function() {
  var search = document.getElementById('search-bar')
  search.addEventListener('input',hitSoundCloud)
})

var hitSoundCloud = function(inputEvent) {
  var query = inputEvent.target.value
  getSoundCloudData(query)
}

var getSoundCloudData = function(queryString) {
  $.ajax({
    url: '/search',
    type: 'POST',
    data: {query: queryString},
    success: appendResults
  })
}

var appendResults = function(songsArray) {
  clearResults();
  for(var i = 0 ; i < songsArray.length;i++) {
    appendSong(songsArray[i])
  }
}

var clearResults = function() {
  $('#results').empty()
}

var appendSong = function(songHash) {
  var song = $('#hidden .song').clone().text(songHash.title)
  $('#results').append(song)
  console.log(songHash)
}
