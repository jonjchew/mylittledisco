class RoomsController < ApplicationController
  def index
    @rooms = Room.all
    @room = Room.new
  end

  def create
    room = Room.find_or_create_by(room_params)
    redirect_to room
  end

  def show
    @room = Room.find_by name: params[:name]
  end

  private

  def room_params
    params.require(:room).permit :name
  end
end
