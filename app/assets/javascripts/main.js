$(document).ready(function(){
  bindPlayer()
  // Ws.init($('#room').data('uri'), true)
});

var Ws = {
  init: function(url, useWebSockets) {
    Ws.dispatcher = new WebSocketRails(url, useWebSockets)
    Ws.roomId = document.getElementById('room-id').innerText
    Ws.channel = Ws.dispatcher.subscribe(Ws.roomId)
    Ws.bind()
  },
  bind: function() {
    Ws.channel.bind('play_audio', AudioPlayer.play)
    Ws.channel.bind('pause_audio', AudioPlayer.pause)
    Ws.channel.bind('skip_audio', AudioPlayer.skip)
  },
}

//"http://api.soundcloud.com/tracks/117063791/stream?consumer_key=d61f17a08f86bfb1dea28539908bc9bf"
//"http://api.soundcloud.com/tracks/118117514/stream?consumer_key=d61f17a08f86bfb1dea28539908bc9bf"
// https://api.soundcloud.com/tracks/118881575" width="100%" height="166" iframe="true" /]

var AudioPlayer = {
  song: new Audio,

  set_current_song: function(song_url) {
    AudioPlayer.song.src=song_url
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
      song = Playlist.remove_song()
      AudioPlayer.set_current_song(song)
      AudioPlayer.play()
    }
  },
  bindEnd: function() {
    $(AudioPlayer.song).bind('ended', AudioPlayer.next_song)
  }
};

var Playlist = {
  queue: [],

  add: function(song_url) {
    Playlist.queue.push(song_url)
    if(Playlist.queue.length===1) {
      AudioPlayer.set_current_song(song_url)
      AudioPlayer.play()
    }
  },
  remove_song: function() {
    return Playlist.queue.shift()
  }
}

function bindPlayer(){
  $('#play').on('click', function(){
    AudioPlayer.play()
    // Ws.dispatcher.trigger('play_audio', {
    //   room_number: Ws.roomId
    // });
  });
  $('#pause').on('click', function(){
    AudioPlayer.pause()
    // Ws.dispatcher.trigger('pause_audio', {
    //   room_number: Ws.roomId
    // });
  });
  $('#next').on('click', function(){
    AudioPlayer.next_song()
    // Ws.dispatcher.trigger('skip_audio', {
    //   room_number: Ws.roomId
    // });
  });
  $('#add-button').on('click', function() {
    Playlist.add('http://api.soundcloud.com/tracks/' + 
                $('#add-song-field').val() + 
                '/stream?consumer_key=d61f17a08f86bfb1dea28539908bc9bf')

    $('#add-song-field').val('')
  });
}