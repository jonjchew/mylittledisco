$(document).ready(function(){
  bindPlayer()
  Ws.init($('#room').data('uri'), true)
});

var Ws = {
  init: function(url, useWebSockets) {
    Ws.dispatcher = new WebSocketRails(url, useWebSockets)
    Ws.roomId = document.getElementById('room-name').innerText
    Ws.channel = Ws.dispatcher.subscribe(Ws.roomId)
    Ws.bind()
  },
  bind: function() {
    Ws.channel.bind('play_song', AudioPlayer.play)
    Ws.channel.bind('pause_song', AudioPlayer.pause)
    Ws.channel.bind('next_song', AudioPlayer.next_song)
    Ws.channel.bind('add_song', function(data){
      Playlist.add(data.song)
    })
  },
  add_song: function(e) {
    var track_id = e.target.value
    var song_object = Search.getSong(track_id)
    Ws.dispatcher.trigger('add_song', {
      room_number: Ws.roomId,
      song: song_object
    })
  }
}


var AudioPlayer = {
  song: new Audio,

  set_current_song: function(song_url) {
    AudioPlayer.song.src = song_url
    AudioPlayer.song.load()
    AudioPlayer.bindEnd()
  },
  play: function() {
    AudioPlayer.song.play();
  },
  pause: function() {
    AudioPlayer.song.pause();
  },
  next_song: function() {
    if(Playlist.queue.length!=0){
      song = Playlist.pop_first_song()
      AudioPlayer.set_current_song(song.MLDStream)
      AudioPlayer.play()
      Playlist.displayPlaylist()
    }
  },
  bindEnd: function() {
    $(AudioPlayer.song).bind('ended', AudioPlayer.next_song)
  }
};

var Playlist = {
  queue: [],

  add: function(song_object) {
    if(AudioPlayer.song.src===""){
      AudioPlayer.set_current_song(song_object.MLDStream)
      AudioPlayer.play()
    }
    else {
      Playlist.queue.push(song_object)
    }
    Playlist.displayPlaylist()
  },
  pop_first_song: function() {
    return Playlist.queue.shift()
  },
  displayPlaylist: function() {
    $('#playlist').empty()
    for(var i=0; i < Playlist.queue.length;i++) {
      var $item = Playlist.displaySong(Playlist.queue[i])
      $('#playlist').append($item)
    }
  },
  displaySong: function(song_object) {
    var $item = $('#hidden .playlist-item').clone()
    $item.find('.song-title').text(song_object.title)
    $item.find('.remove-song-button').val(song_object.id).on('click',Playlist.removeSong)
    return $item
  },
  removeSong: function(clickEvent) {

    var songId = clickEvent.target.value
    var deletedSongIndex

    for (var i = 0; i < Playlist.queue.length; i++) {
      if (Playlist.queue[i].id === songId) {
        deletedSongIndex = i
      }
    }

    Playlist.queue.splice(deletedSongIndex,1)
    Playlist.displayPlaylist()

  }
}

function bindPlayer(){
  $('#play').on('click', function(){
    Ws.dispatcher.trigger('play_song', {
      room_number: Ws.roomId
    });
  });
  $('#pause').on('click', function(){
    Ws.dispatcher.trigger('pause_song', {
      room_number: Ws.roomId
    });
  });
  $('#next').on('click', function(){
    Ws.dispatcher.trigger('next_song', {
      room_number: Ws.roomId
    });
  });
  $('.add-song-button').on('click', function() {
    // var track_id = $('#add-song-field').val()
    // $('#add-song-field').val('')
    // Ws.dispatcher.trigger('add_song', {
    //   room_number: Ws.roomId,
    //   song: track_id
    // })
  });
}
