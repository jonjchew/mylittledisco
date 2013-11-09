class PartiesController < WebsocketRails::BaseController

  def initialize_session
    puts "Session Initialized\n"
  end

  def client_connected
  end

  def delete_user
    puts "User left"
  end

  def sync_new_user
    room_number = message[:room_number].to_s
    connection_store[:room_number] = room_number

    WebsocketRails[room_number].subscribers.first.trigger(WebsocketRails::Event.new(:get_info, {
      :channel => room_number,
      :data => {}
    }))
  end

  def sync_player
    room_number = connection_store[:room_number]
    current_song_time = message[:current_song_time].to_s

    WebsocketRails[room_number].trigger :sync_player, {current_song_time: current_song_time}
  end

  def play_song
    WebsocketRails[message[:room_number]].trigger(:play_song, {})
  end

  def pause_song
    WebsocketRails[message[:room_number]].trigger(:pause_song, {})
  end

  def next_song
    WebsocketRails[message[:room_number]].trigger(:next_song, {})
  end

  def add_song
    WebsocketRails[message[:room_number]].trigger(:add_song, {song: message[:song]})
  end

end
