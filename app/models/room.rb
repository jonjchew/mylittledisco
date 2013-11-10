class Room < ActiveRecord::Base

  def to_param
    name
  end

  def users_count
    WebsocketRails[name].subscribers.count
  end
end
