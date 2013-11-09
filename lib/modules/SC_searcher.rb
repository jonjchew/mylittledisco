require 'soundcloud'


module SoundCloudSearcher

  extend self

  def search(query_string)
    make_SC_call('/tracks',:q => query_string)
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

end

