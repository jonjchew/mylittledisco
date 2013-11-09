

$(function() {
  $('#search-bar').on('input',Search.hitSoundCloud)
})


var Search = {
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
    Search.songs = {}
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
    song.find('.add-song-button').val(songHash.id).on('click',Playlist.add)
    $('#results').append(song)
  },
  getSong: function(id) {
    return Search.songs[id]
  }
}















