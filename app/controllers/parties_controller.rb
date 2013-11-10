class PartiesController < WebsocketRails::BaseController

  def initialize_session
    puts "Session Initialized\n"
  end

  def client_connected
  end

  def delete_user
    puts "User left"
    WebsocketRails[connection_store[:room_number]].trigger(:user_left, {
      :user_name => connection_store[connection_store[:room_number]]
    })
  end

  def sync_new_user
    room_number = message[:room_number].to_s
    connection_store[:room_number] = room_number

    if WebsocketRails[room_number].subscribers.count > 1
      WebsocketRails[room_number].subscribers.first.trigger(WebsocketRails::Event.new(:room_state, {
        :channel => room_number,
        :data => {}
      }))
    end

    connection_store[room_number] = __get_next_guest_name(room_number)
    WebsocketRails[connection_store[:room_number]].trigger(:new_user, {
      :user_name => connection_store[room_number]
    })
  end

  def synchronize_channel
    room_number = connection_store[:room_number]

    WebsocketRails[room_number].trigger :synchronize_room, {
      room_info: message[:room_info]
    }
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

  def remove_song
    WebsocketRails[message[:room_number]].trigger(:remove_song, {songId: message[:songId]})
  end

  def update_user_count
    user_count = WebsocketRails[message[:room_number]].subscribers.count
    WebsocketRails[message[:room_number]].trigger(:update_user_count, {users: user_count})
  end

  def __get_next_guest_name(room_number)
    last_guest_name = connection_store.collect_all(room_number).compact.last
    if !last_guest_name.nil?
      next_guest_number = 'Guest' + (/Guest([0-9])+/.match(last_guest_name)[1].to_i + 1).to_s
    else
      next_guest_number = 'Guest1'
    end
  end

end
