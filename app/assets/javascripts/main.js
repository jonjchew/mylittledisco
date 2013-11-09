$(document).ready(function(){
  bindPlayer()
  Ws.init($('#room').data('uri'), true)
});

function Ws(channel) {
  this.dispatcher = new WebSocketRails('localhost:3000/websocket', true);
  this.setChannel(channel);
  this.bind(channel);
};

Ws.prototype.setChannel = function(channel) {
  this.channel = this.dispatcher.subscribe(channel);
};

Ws.prototype.bind = function(channel) {
  var self = this;

  self.channel.bind('get_info', function(data) {
    console.log('INFO FROM HERE')
    self.dispatcher.trigger('sync_player', {
      current_song_time: Math.floor(Math.random() * 100)
    });
  });

  self.channel.bind('sync_player', function(data) {
    console.log(JSON.stringify(data));
  });

  self.dispatcher.on_open = function(data) {
    self.dispatcher.trigger('sync_new_user', {
      room_number: channel
    });
  };
};

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
    AudioPlayer.song.src = null
    if(Playlist.queue.length!=0){
      song = Playlist.remove_song()
      AudioPlayer.set_current_song(song.MLDStream)
      AudioPlayer.play()
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
  $('.add-song-button').on('click', function() {
    // var track_id = $('#add-song-field').val()
    // $('#add-song-field').val('')
    // Ws.dispatcher.trigger('add_song', {
    //   room_number: Ws.roomId,
    //   song: track_id
    // })
  });
}
