

$(function() {
  $('#search-bar').on('input',Search.hitSoundCloud)
})


var Search = {
  songs: {},
  hitSoundCloud: function(inputEvent) {
    clearTimeout(Search.timeout)
    var query = inputEvent.target.value
    Search.timeout = setTimeout(function() { Search.getSoundCloudData(query) },1000)
  },
  getSoundCloudData: function(queryString) {
    $.ajax({
      url: '/search',
      type: 'POST',
      data: {query: queryString},
      success: Search.appendResults
    })
  },
  appendResults: function(songsArray) {
    Search.clearResults()
    for(var i = 0 ; i < songsArray.length;i++) {
      Search.appendSong(songsArray[i])
      Search.songs[songsArray[i].id] = songsArray[i]
    }
  },
  clearResults: function() {
    $('#results').empty()
  },
  appendSong: function(songHash) {
    var song = $('#hidden .song').clone()
    song.find('.song-title').text(songHash.title)
    song.find('.add-song-button').val(songHash.id)
    $('#results').append(song)
  },
  getSong: function(id) {
    return songs[id]
  }
}















