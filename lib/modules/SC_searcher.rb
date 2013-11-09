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

end





p SoundCloudSearcher.search('strokes')
