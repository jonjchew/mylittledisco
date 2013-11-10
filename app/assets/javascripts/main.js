$(document).ready(function(){
  var roomName      = document.getElementById('room-name').innerText,
      socketUrl     = $('#room').data('uri'),
      useWebSockets = true;

  Ws.init(roomName, socketUrl, useWebSockets);
  Chat.init();
  bindPlayer();
  LandingPage.init()
  focusSearchBar()
});

var updateUserCount = function(data) {
  $('#user-count').text(data["users"])
}

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
    Ws.channel.bind('update_user_count', updateUserCount)
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
      Playlist.removeSong(parseInt(data.songId))
    })
  },

  add_song: function(e) {
    $(e.target).addClass('disabled')
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
      currentSong: AudioPlayer.currentSong,
      currentTime: AudioPlayer.song.currentTime,
      queue: Playlist.queue,
      paused: AudioPlayer.song.paused
    };
  },

  updateRoomState: function(data) {

    if (AudioPlayer.song.src === "" && data["room_info"]["currentSong"] ) {
      var beforeLoad = Date.now()
      AudioPlayer.set_current_song(data["room_info"]["currentSong"])

      $( AudioPlayer.song ).on('loadeddata', function() {
        var afterLoad = Date.now();
        var loadTime = (afterLoad - beforeLoad)/1000

        AudioPlayer.song.currentTime = data["room_info"]["currentTime"]
        if (!data["room_info"]["paused"]) {
          AudioPlayer.song.currentTime += loadTime
          AudioPlayer.play()
        }
      })

      Playlist.queue = data["room_info"]["queue"]
      Playlist.displayPlaylist()

    }

    Ws.dispatcher.trigger('update_user_count', {
        room_number: Ws.channelName
    })
  }
}


var AudioPlayer = {
  song: new Audio,

  set_current_song: function(song_object) {
    AudioPlayer.currentSong = song_object
    AudioPlayer.song = new Audio
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
    $item.find('.remove-song-button').attr('data-id',song_object.id).on('click',Playlist.removeSongCallback)

    if(song_object.artwork_url!=null){
      barge_size_image = song_object.artwork_url.replace(/large/,"badge")
      $item.find('.playlist-image').attr('src', barge_size_image)
    }
    else {
      $item.find('.playlist-image').attr('src', "http://i1.sndcdn.com/artworks-000033564444-hama0x-badge.jpg?3eddc42")
    }
    return $item
  },
  removeSongCallback: function(clickEvent) {

    var songId = $(event.target).attr('data-id')

    Ws.dispatcher.trigger('remove_song', {
      room_number: Ws.channelName,
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
  $('#mobile-menu').on('click', function() {
    $('.container').toggleClass('slide')
    $('.container').toggleClass('fixed')
    $('#nav-bar').toggleClass('absolute')
    window.scrollTo('.container')
  });

  $('#mobile-menu-chat').on('click', function() {
    $('.container').toggleClass('slide-left')
  });

  $('#playlist-toggle').on('click', function() {
    $('.playlist-container').toggleClass('show-full')
  });
}


var LandingPage = {
  init: function(){
    LandingPage.bindCreateRoom()
    LandingPage.bindJoinRoom()
  },
  bindCreateRoom: function() {
    $('#create-room-button').one('click', LandingPage.revealCreateInput)
  },
  revealCreateInput: function(e) {
    e.preventDefault()
    $('#create-room-acc').addClass('reveal')
    $('#create-room-input').focus()
  },
  bindJoinRoom: function() {
    $('#join-room-button').one('click', LandingPage.revealJoinInput)
  },
  revealJoinInput: function(e) {
    e.preventDefault()
    $('#join-room-acc').addClass('reveal')
    $('#join-room-input').focus()
  }
}

function focusSearchBar() {
  if($('#search-bar').length>0){
    $('#search-bar').focus()
  }
}
