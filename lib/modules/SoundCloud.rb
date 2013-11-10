require 'soundcloud'

module SoundCloud

  extend self

  def search(query_string)
    search_responses = make_SC_call('/tracks',:q => query_string)
    search_responses = convert_to_array_of_hashes(search_responses)
    search_responses = pluck_non_streamable(search_responses)
    # sort_by_favorites(search_responses)
  end

  def make_SC_call(query,params)
    client = Soundcloud.new(:client_id => '18d1af9ae5c1c93accb3ab1369f37577')
    client.get(query,params)
  end

  def pluck_non_streamable(songs_array)
    songs_array.select { |song| song["streamable"] }

  end

  def convert_to_array_of_hashes(sound_cloud_array)
    sound_cloud_array.each_with_object([]) { |song,array| array << song.to_hash }
  end

  def sort_by_favorites(songs_array)
    songs_array.each { |song| song["favoritings_count"] ||= 0 }
    songs_array.sort_by do |song|
      song["favoritings_count"]
    end
  end

end

