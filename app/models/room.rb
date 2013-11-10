class Room < ActiveRecord::Base
  validates :name, presence: true
  validate :name_on_length
  validate :name_on_characters

  def name_on_length
    if name.length > 8
      errors.add(:name, "please use a shorter name")
    end
  end

  def name_on_characters
    if name.match(/\W/)
      errors.add(:name, "name has invalid characters")
    end
  end

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
