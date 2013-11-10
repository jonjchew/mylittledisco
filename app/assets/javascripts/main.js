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

    Ws.channel.bind('remove_song', function(data){
      Playlist.removeSong(data.songId)
    })
  },

  add_song: function(e) {
    $(e.target).css('opacity','0.5')
    var track_id = e.target.value
    var song_object = Search.getSong(track_id)
    Ws.dispatcher.trigger('add_song', {
      room_number: Ws.channelName,
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

  set_current_song: function(song_object) {
    AudioPlayer.song.src = song_object.MLDStream
    AudioPlayer.song.load()
    AudioPlayer.setSongText(song_object.title)
    AudioPlayer.bindEnd()
  },
  play: function() {
    AudioPlayer.song.play();
    $('#play').css('display', 'none')
    $('#pause').css('display', 'block')
  },
  pause: function() {
    AudioPlayer.song.pause();
    $('#pause').css('display', 'none')
    $('#play').css('display', 'block')
  },
  next_song: function() {
    AudioPlayer.song.src = null
    if(Playlist.queue.length!=0){
      song = Playlist.pop_first_song()
      AudioPlayer.set_current_song(song)
      AudioPlayer.play()
      Playlist.displayPlaylist()
    }
  },
  bindEnd: function() {
    $(AudioPlayer.song).bind('ended', AudioPlayer.next_song)
  },
  setSongText: function(text) {
    $('#current-song-title').text(text)
  }
};

var Playlist = {
  queue: [],

  add: function(song_object) {
    if(AudioPlayer.song.src===""){
      AudioPlayer.set_current_song(song_object)
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
    $item.find('.remove-song-button').val(song_object.id).on('click',Playlist.removeSongCallback)
    return $item
  },
  removeSongCallback: function(clickEvent) {

    var songId = clickEvent.target.value

    Ws.dispatcher.trigger('remove_song', {
      room_number: Ws.roomId,
      songId: songId
    })
  },
  removeSong: function(songId) {
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
    if(AudioPlayer.song.src!=""){
      Ws.dispatcher.trigger('play_song', {
        room_number: Ws.channelName
      });
  }
  });
  $('#pause').on('click', function(){
    Ws.dispatcher.trigger('pause_song', {
      room_number: Ws.channelName
    });
  });
  $('#next').on('click', function(){
    Ws.dispatcher.trigger('next_song', {
      room_number: Ws.channelName
    });
  });
  $('.song-art-image').on('click', function() {
    console.log('hit')
    // $(this.find('.song-art-overlay')).css('opacity','0.8')
  });
}
