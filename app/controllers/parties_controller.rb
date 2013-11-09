class PartiesController < WebsocketRails::BaseController

  def initialize_session
    puts "Session Initialized\n"
  end

  def client_connected

  end

  def delete_user
    puts "User left"
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