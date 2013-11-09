class PartiesController < WebsocketRails::BaseController

  def initialize_session
    puts "Session Initialized\n"
  end

  def client_connected

  end

  def delete_user
    puts "User left"
  end

  def play_audio
    WebsocketRails[message[:room_number]].trigger(:play_audio, {})
  end

  def pause_audio
    WebsocketRails[message[:room_number]].trigger(:pause_audio, {})
  end

  def skip_audio
    WebsocketRails[message[:room_number]].trigger(:skip_audio, {})
  end

end