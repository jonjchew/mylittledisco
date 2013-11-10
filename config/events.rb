WebsocketRails::EventMap.describe do
  # You can use this file to map incoming events to controller actions.
  # One event can be mapped to any number of controller actions. The
  # actions will be executed in the order they were subscribed.
  #
  # Uncomment and edit the next line to handle the client connected event:
  #   subscribe :client_connected, :to => Controller, :with_method => :method_name
  #
  # Here is an example of mapping namespaced events:
  #   namespace :product do
  #     subscribe :new, :to => ProductController, :with_method => :new_product
  #   end
  # The above will handle an event triggered on the client like `product.new`.
  subscribe :sync_new_user,         to: PartiesController, with_method: :sync_new_user
  subscribe :synchronize_channel,   to: PartiesController, with_method: :synchronize_channel

  subscribe :send_message,          to: PartiesController, with_method: :send_message

  subscribe :client_connected,      to: PartiesController, with_method: :client_connected
  subscribe :play_song,             to: PartiesController, with_method: :play_song
  subscribe :pause_song,            to: PartiesController, with_method: :pause_song
  subscribe :next_song,             to: PartiesController, with_method: :next_song
  subscribe :add_song,              to: PartiesController, with_method: :add_song
  subscribe :remove_song,           to: PartiesController, with_method: :remove_song
  subscribe :client_disconnected,   to: PartiesController, with_method: :delete_user
end
