class Room < ActiveRecord::Base
  validates :name, presence: true
  validate :name_on_characters
  validate :name_on_length

  def name_on_length
    if name.length > 8
      errors.add(:name, "can only be eight characters long")
    end
  end

  def name_on_characters
    if name.match(/\W/)
      errors.add(:name, "can only include letters, numbers, or underscores")
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
