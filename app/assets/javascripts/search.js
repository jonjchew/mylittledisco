

$(function() {
  $('#search-bar').on('input',hitSoundCloud)
})

var timeout

var hitSoundCloud = function(inputEvent) {
  clearTimeout(timeout)
  var query = inputEvent.target.value
  timeout = setTimeout(function() { getSoundCloudData(query) },1000)
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
  clearResults()
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
}