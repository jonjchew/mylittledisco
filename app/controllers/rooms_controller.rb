class RoomsController < ApplicationController
  def index
    Room.delete_unused
    @rooms = Room.all
    @room = Room.new
  end

  def create
    room = Room.find_or_create_by(room_params)
    redirect_to room
  end

  def join
    @room = Room.find_by name: params[:room][:name]
    if @room
      redirect_to @room
    else
      flash[:error] = "that room doesn't exist yet!"
      redirect_to root_path
    end
  end

   def show
    @room = Room.find_by name: params[:name]
  end

  private

  def room_params
    params.require(:room).permit :name
  end
end
