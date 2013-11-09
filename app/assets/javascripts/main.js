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
  }
}


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

  add: function(clickEvent) {
    var trackId = clickEvent.target.value
    var song = Search.getSong(trackId)
    debugger
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
  $('#add-button').on('click', function() {
    var track_id = $('#add-song-field').val()
    $('#add-song-field').val('')
    Ws.dispatcher.trigger('add_song', {
      room_number: Ws.roomId,
      song: track_id
    })
  });
}

