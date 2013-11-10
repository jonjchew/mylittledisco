var Chat = {
  init: function() {
    Chat.message = $('#chat-message')
    Chat.wrapper = $('#chat-wrapper')

    Chat.bind()
  },

  bind: function() {
    Chat.message.on('keyup', Chat.sendMessage)
    Ws.channel.bind('new_user', Chat.printNewUserMessage)
    Ws.channel.bind('user_left', Chat.printUserLeftMessage)
    Ws.channel.bind('new_message', Chat.printUserMessage)
  },

  sendMessage: function(e) {
    if (e.keyCode === 13) {
      Ws.dispatcher.trigger('send_message', {
        room_number: Ws.channelName,
        message: $(this).val()
      })

      $(this).val('')
    }
  },

  printNewMessage: function(message) {
    Chat.wrapper.append('<li>' + message + '</li>')
  },

  printUserMessage: function(data) {
    Chat.printNewMessage(Chat.getUserMessage(data))
  },

  printNewUserMessage: function(data) {
    Chat.printNewMessage(Chat.getNewUserMessage(data))
  },

  printUserLeftMessage: function(data) {
    Chat.printNewMessage(Chat.getUserLeftMessage(data))
  },

  getUserMessage: function(data) {
    return '<span class="user-name">' + data.user_name + ':</span> ' + data.message;
  },

  getNewUserMessage: function(data) {
    return '<span class="user-name">' + data.user_name + '</span> joined the room';
  },

  getUserLeftMessage: function(data) {
    return '<span class="user-name">' + data.user_name + '</span> left the room';
  }
}
