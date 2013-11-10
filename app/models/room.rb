class Room < ActiveRecord::Base

  def to_param
    name
  end

  def users_count
    WebsocketRails[name].subscribers.count
  end

  def self.delete_unused
    all.each {|room| room.destroy if room.users_count == 0}
  end
end
