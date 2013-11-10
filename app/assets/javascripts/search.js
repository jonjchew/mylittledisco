

$(function() {
  $('#search-bar').on('input',Search.hitSoundCloud)
})


var Search = {
  hitSoundCloud: function(inputEvent) {
    clearTimeout(Search.timeout)
    var query = inputEvent.target.value

    if (query) {
      Search.timeout = setTimeout(function() { Search.getSoundCloudData(query) },1000)
    }
    else {
      Search.clearResults()
    }
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
      Search.addToSongsArray(songsArray[i])
    }
  },
  addToSongsArray: function(songHash) {
    songHash["MLDStream"] = songHash.stream_url + "?consumer_key=d61f17a08f86bfb1dea28539908bc9bf"
    Search.songs[songHash.id] = songHash
  },
  clearResults: function() {
    $('#results').empty()
  },
  appendSong: function(songHash) {
    var song = $('#hidden .song').clone()
    song.find('.song-title').text(songHash.title)
    if(songHash.artwork_url!=null){
      song.find('.song-art-image').html('<img src="' + songHash.artwork_url + '"">')
    }
    else {
      song.find('.song-art-image').html('<img src="http://i1.sndcdn.com/artworks-000033564444-hama0x-large.jpg?3eddc42">')
    }
    song.find('.song-art-overlay').val(songHash.id).on('click', Ws.add_song)
    $('#results').append(song)
  },
  getSong: function(id) {
    return Search.songs[id]
  }
}
