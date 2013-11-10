$(document).ready(function(){
  var roomName      = document.getElementById('room-name').innerText,
      socketUrl     = $('#room').data('uri'),
      useWebSockets = true;

  Ws.init(roomName, socketUrl, useWebSockets);

  bindPlayer();
});

var Ws = {
  init: function(channelName, url, useWebSockets) {
    Ws.channelName = channelName

    Ws.dispatcher = new WebSocketRails(url, useWebSockets)
    Ws.channel    = Ws.dispatcher.subscribe(Ws.channelName)

    Ws.bind()
  },

  bind: function() {
    Ws.dispatcher.on_open = function(data) {
      // Set connection information on server once socket is opened
      Ws.dispatcher.trigger('sync_new_user', {
        room_number: Ws.channelName
      })
    }

    Ws.channel.bind('play_song', AudioPlayer.play)
    Ws.channel.bind('pause_song', AudioPlayer.pause)
    Ws.channel.bind('next_song', AudioPlayer.next_song)

    Ws.channel.bind('add_song', function(data){
      Playlist.add(data.song)
    })

    // Update current room state
    Ws.channel.bind('synchronize_room', function(data) {
      Room.updateRoomState(data);
    })

    // Retrives current room state
    Ws.channel.bind('room_state', function(data) {
      // Send current Room state to server so it can sync other users
      Ws.dispatcher.trigger('synchronize_channel', {
        room_info: Room.getRoomState()
      })
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

var Room = {
  getRoomState: function() {
    return {
      info: 'here'
    };
  },

  updateRoomState: function(data) {
    console.log(JSON.stringify(data));
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
