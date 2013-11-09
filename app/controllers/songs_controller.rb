require 'modules/SoundCloud'

class SongsController < ApplicationController
  include SoundCloud

  def searchSoundCloud
    results_array = search(params["query"])

    render json: results_array
  end
end


